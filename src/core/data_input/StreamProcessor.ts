import { Readable, Transform, Writable } from 'stream';
import { EventEmitter } from 'events';
import { createLogger } from '@common/logger';
import { DataFormat, DataSourceType, RawData } from './DataInputService';
import { DataProcessingError } from './DataInputService';

export interface StreamProcessorConfig {
  highWaterMark?: number;
  objectMode?: boolean;
  enableBackpressure?: boolean;
  maxBufferSize?: number;
}

export interface StreamStats {
  bytesProcessed: number;
  recordsProcessed: number;
  errorsEncountered: number;
  startTime: Date;
  endTime?: Date;
  processingRate: number;
}

class DataStreamProcessor extends EventEmitter {
  private readonly logger = createLogger('DataStreamProcessor');
  private readonly config: Required<StreamProcessorConfig>;
  private stats: StreamStats;
  private isPaused: boolean = false;
  private buffer: RawData[] = [];

  constructor(config: StreamProcessorConfig = {}) {
    super();
    this.config = {
      highWaterMark: config.highWaterMark ?? 64,
      objectMode: config.objectMode ?? true,
      enableBackpressure: config.enableBackpressure ?? true,
      maxBufferSize: config.maxBufferSize ?? 1000,
    };

    this.stats = this.createInitialStats();
    this.logger.info('DataStreamProcessor initialized', { config: this.config });
  }

  private createInitialStats(): StreamStats {
    return {
      bytesProcessed: 0,
      recordsProcessed: 0,
      errorsEncountered: 0,
      startTime: new Date(),
      processingRate: 0,
    };
  }

  public createReadableStream(dataSource: AsyncIterable<RawData> | RawData[]): Readable {
    const self = this;
    let iterator: AsyncIterator<RawData> | Iterator<RawData>;
    let isAsync = false;

    if (Array.isArray(dataSource)) {
      iterator = dataSource[Symbol.iterator]();
    } else {
      isAsync = true;
      iterator = dataSource[Symbol.asyncIterator]?.() || dataSource[Symbol.iterator]();
    }

    return new Readable({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,

      async read() {
        try {
          const result = isAsync
            ? await (iterator as AsyncIterator<RawData>).next()
            : (iterator as Iterator<RawData>).next();

          if (result.done) {
            this.push(null);
          } else {
            self.updateStats(result.value);
            this.push(result.value);
          }
        } catch (error) {
          self.logger.error('Error reading from stream', error as Error);
          self.stats.errorsEncountered++;
          self.emit('error', error);
          this.push(null);
        }
      },
    });
  }

  public createTransformStream(
    transformFn: (data: RawData) => Promise<RawData> | RawData
  ): Transform {
    const self = this;

    return new Transform({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,

      async transform(chunk: RawData, encoding, callback) {
        try {
          if (self.config.enableBackpressure && self.isPaused) {
            self.buffer.push(chunk);
            callback();
            return;
          }

          const result = await transformFn(chunk);
          self.stats.recordsProcessed++;
          callback(null, result);
        } catch (error) {
          self.logger.error('Error transforming data', error as Error, { dataId: chunk.id });
          self.stats.errorsEncountered++;
          callback(error as Error);
        }
      },

      flush(callback) {
        self.logger.debug('Flushing transform stream', { bufferedItems: self.buffer.length });
        callback();
      },
    });
  }

  public createWritableStream(
    writeFn: (data: RawData) => Promise<void>
  ): Writable {
    const self = this;

    return new Writable({
      objectMode: this.config.objectMode,
      highWaterMark: this.config.highWaterMark,

      async write(chunk: RawData, encoding, callback) {
        try {
          await writeFn(chunk);
          self.stats.bytesProcessed += chunk.size || 0;
          callback();
        } catch (error) {
          self.logger.error('Error writing data', error as Error, { dataId: chunk.id });
          self.stats.errorsEncountered++;
          callback(error as Error);
        }
      },
    });
  }

  public createPipeline(
    source: AsyncIterable<RawData> | RawData[],
    transforms: Array<(data: RawData) => Promise<RawData> | RawData>,
    destination: (data: RawData) => Promise<void>
  ): Promise<StreamStats> {
    return new Promise((resolve, reject) => {
      const readable = this.createReadableStream(source);
      let transformStreams: Transform[] = [];
      const writable = this.createWritableStream(destination);

      readable.on('error', (error) => {
        this.logger.error('Pipeline source error', error as Error);
        reject(error);
      });

      writable.on('error', (error) => {
        this.logger.error('Pipeline destination error', error as Error);
        reject(error);
      });

      if (transforms.length > 0) {
        transformStreams = transforms.map((transformFn) =>
          this.createTransformStream(transformFn)
        );

        transformStreams.forEach((ts, index) => {
          ts.on('error', (error) => {
            this.logger.error(`Pipeline transform ${index} error`, error as Error);
            reject(error);
          });
        });

        let stream: NodeJS.ReadableStream = readable;
        for (const transform of transformStreams) {
          stream = stream.pipe(transform);
        }
        stream.pipe(writable);
      } else {
        readable.pipe(writable);
      }

      writable.on('finish', () => {
        this.stats.endTime = new Date();
        this.stats.processingRate = this.calculateProcessingRate();
        this.logger.info('Pipeline completed', { stats: this.stats });
        resolve({ ...this.stats });
      });
    });
  }

  public pause(): void {
    this.isPaused = true;
    this.emit('pause');
    this.logger.debug('Stream processing paused');
  }

  public resume(): void {
    if (this.isPaused && this.buffer.length > 0) {
      this.isPaused = false;
      this.emit('resume', { bufferedItems: this.buffer.length });
      this.logger.debug('Stream processing resumed', { bufferedItems: this.buffer.length });
    }
  }

  public getStats(): StreamStats {
    return { ...this.stats, processingRate: this.calculateProcessingRate() };
  }

  private updateStats(data: RawData): void {
    this.stats.bytesProcessed += data.size || 0;
  }

  private calculateProcessingRate(): number {
    const duration = (this.stats.endTime?.getTime() || Date.now()) - this.stats.startTime.getTime();
    const seconds = duration / 1000;
    return seconds > 0 ? Math.round((this.stats.recordsProcessed / seconds) * 100) / 100 : 0;
  }

  public resetStats(): void {
    this.stats = this.createInitialStats();
    this.buffer = [];
    this.isPaused = false;
    this.logger.info('Stream stats reset');
  }
}

export class DataStreamManager {
  private readonly logger = createLogger('DataStreamManager');
  private readonly processors: Map<string, DataStreamProcessor> = new Map();
  private readonly config: Required<StreamProcessorConfig>;

  constructor(config: StreamProcessorConfig = {}) {
    this.config = {
      highWaterMark: config.highWaterMark ?? 64,
      objectMode: config.objectMode ?? true,
      enableBackpressure: config.enableBackpressure ?? true,
      maxBufferSize: config.maxBufferSize ?? 1000,
    };
    this.logger.info('DataStreamManager initialized');
  }

  public createProcessor(id: string, config?: StreamProcessorConfig): DataStreamProcessor {
    if (this.processors.has(id)) {
      this.logger.warn('Processor already exists, returning existing', { id });
      return this.processors.get(id)!;
    }

    const processor = new DataStreamProcessor({ ...this.config, ...config });
    this.processors.set(id, processor);

    processor.on('error', (error) => {
      this.logger.error('Processor error', error as Error, { processorId: id });
    });

    processor.on('pause', () => {
      this.logger.warn('Processor paused', { processorId: id });
    });

    processor.on('resume', (info) => {
      this.logger.info('Processor resumed', { processorId: id, ...info });
    });

    this.logger.info('Created new processor', { id });
    return processor;
  }

  public getProcessor(id: string): DataStreamProcessor | undefined {
    return this.processors.get(id);
  }

  public removeProcessor(id: string): boolean {
    const processor = this.processors.get(id);
    if (processor) {
      processor.removeAllListeners();
      this.processors.delete(id);
      this.logger.info('Processor removed', { id });
      return true;
    }
    return false;
  }

  public getAllStats(): Map<string, StreamStats> {
    const stats = new Map<string, StreamStats>();
    for (const [id, processor] of this.processors) {
      stats.set(id, processor.getStats());
    }
    return stats;
  }

  public getAggregateStats(): StreamStats {
    const allStats = Array.from(this.processors.values()).map((p) => p.getStats());

    return {
      bytesProcessed: allStats.reduce((sum, s) => sum + s.bytesProcessed, 0),
      recordsProcessed: allStats.reduce((sum, s) => sum + s.recordsProcessed, 0),
      errorsEncountered: allStats.reduce((sum, s) => sum + s.errorsEncountered, 0),
      startTime: allStats.length > 0 ? allStats[0].startTime : new Date(),
      endTime: allStats.every((s) => s.endTime) ? new Date() : undefined,
      processingRate: allStats.reduce((sum, s) => sum + s.processingRate, 0),
    };
  }

  public shutdown(): void {
    this.logger.info('Shutting down DataStreamManager', { processorCount: this.processors.size });

    for (const [id, processor] of this.processors) {
      processor.removeAllListeners();
      processor.resetStats();
    }

    this.processors.clear();
    this.logger.info('DataStreamManager shutdown complete');
  }
}

export const streamManager = new DataStreamManager();

export default DataStreamProcessor;
