"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamManager = exports.DataStreamManager = void 0;
const stream_1 = require("stream");
const events_1 = require("events");
const logger_1 = require("@common/logger");
class DataStreamProcessor extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.logger = (0, logger_1.createLogger)('DataStreamProcessor');
        this.isPaused = false;
        this.buffer = [];
        this.config = {
            highWaterMark: config.highWaterMark ?? 64,
            objectMode: config.objectMode ?? true,
            enableBackpressure: config.enableBackpressure ?? true,
            maxBufferSize: config.maxBufferSize ?? 1000,
        };
        this.stats = this.createInitialStats();
        this.logger.info('DataStreamProcessor initialized', { config: this.config });
    }
    createInitialStats() {
        return {
            bytesProcessed: 0,
            recordsProcessed: 0,
            errorsEncountered: 0,
            startTime: new Date(),
            processingRate: 0,
        };
    }
    createReadableStream(dataSource) {
        const self = this;
        let iterator;
        let isAsync = false;
        if (Array.isArray(dataSource)) {
            iterator = dataSource[Symbol.iterator]();
        }
        else {
            isAsync = true;
            iterator = dataSource[Symbol.asyncIterator]?.() || dataSource[Symbol.iterator]();
        }
        return new stream_1.Readable({
            objectMode: this.config.objectMode,
            highWaterMark: this.config.highWaterMark,
            async read() {
                try {
                    const result = isAsync
                        ? await iterator.next()
                        : iterator.next();
                    if (result.done) {
                        this.push(null);
                    }
                    else {
                        self.updateStats(result.value);
                        this.push(result.value);
                    }
                }
                catch (error) {
                    self.logger.error('Error reading from stream', error);
                    self.stats.errorsEncountered++;
                    self.emit('error', error);
                    this.push(null);
                }
            },
        });
    }
    createTransformStream(transformFn) {
        const self = this;
        return new stream_1.Transform({
            objectMode: this.config.objectMode,
            highWaterMark: this.config.highWaterMark,
            async transform(chunk, encoding, callback) {
                try {
                    if (self.config.enableBackpressure && self.isPaused) {
                        self.buffer.push(chunk);
                        callback();
                        return;
                    }
                    const result = await transformFn(chunk);
                    self.stats.recordsProcessed++;
                    callback(null, result);
                }
                catch (error) {
                    self.logger.error('Error transforming data', error, { dataId: chunk.id });
                    self.stats.errorsEncountered++;
                    callback(error);
                }
            },
            flush(callback) {
                self.logger.debug('Flushing transform stream', { bufferedItems: self.buffer.length });
                callback();
            },
        });
    }
    createWritableStream(writeFn) {
        const self = this;
        return new stream_1.Writable({
            objectMode: this.config.objectMode,
            highWaterMark: this.config.highWaterMark,
            async write(chunk, encoding, callback) {
                try {
                    await writeFn(chunk);
                    self.stats.bytesProcessed += chunk.size || 0;
                    callback();
                }
                catch (error) {
                    self.logger.error('Error writing data', error, { dataId: chunk.id });
                    self.stats.errorsEncountered++;
                    callback(error);
                }
            },
        });
    }
    createPipeline(source, transforms, destination) {
        return new Promise((resolve, reject) => {
            const readable = this.createReadableStream(source);
            let transformStreams = [];
            const writable = this.createWritableStream(destination);
            readable.on('error', (error) => {
                this.logger.error('Pipeline source error', error);
                reject(error);
            });
            writable.on('error', (error) => {
                this.logger.error('Pipeline destination error', error);
                reject(error);
            });
            if (transforms.length > 0) {
                transformStreams = transforms.map((transformFn) => this.createTransformStream(transformFn));
                transformStreams.forEach((ts, index) => {
                    ts.on('error', (error) => {
                        this.logger.error(`Pipeline transform ${index} error`, error);
                        reject(error);
                    });
                });
                let stream = readable;
                for (const transform of transformStreams) {
                    stream = stream.pipe(transform);
                }
                stream.pipe(writable);
            }
            else {
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
    pause() {
        this.isPaused = true;
        this.emit('pause');
        this.logger.debug('Stream processing paused');
    }
    resume() {
        if (this.isPaused && this.buffer.length > 0) {
            this.isPaused = false;
            this.emit('resume', { bufferedItems: this.buffer.length });
            this.logger.debug('Stream processing resumed', { bufferedItems: this.buffer.length });
        }
    }
    getStats() {
        return { ...this.stats, processingRate: this.calculateProcessingRate() };
    }
    updateStats(data) {
        this.stats.bytesProcessed += data.size || 0;
    }
    calculateProcessingRate() {
        const duration = (this.stats.endTime?.getTime() || Date.now()) - this.stats.startTime.getTime();
        const seconds = duration / 1000;
        return seconds > 0 ? Math.round((this.stats.recordsProcessed / seconds) * 100) / 100 : 0;
    }
    resetStats() {
        this.stats = this.createInitialStats();
        this.buffer = [];
        this.isPaused = false;
        this.logger.info('Stream stats reset');
    }
}
class DataStreamManager {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)('DataStreamManager');
        this.processors = new Map();
        this.config = {
            highWaterMark: config.highWaterMark ?? 64,
            objectMode: config.objectMode ?? true,
            enableBackpressure: config.enableBackpressure ?? true,
            maxBufferSize: config.maxBufferSize ?? 1000,
        };
        this.logger.info('DataStreamManager initialized');
    }
    createProcessor(id, config) {
        if (this.processors.has(id)) {
            this.logger.warn('Processor already exists, returning existing', { id });
            return this.processors.get(id);
        }
        const processor = new DataStreamProcessor({ ...this.config, ...config });
        this.processors.set(id, processor);
        processor.on('error', (error) => {
            this.logger.error('Processor error', error, { processorId: id });
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
    getProcessor(id) {
        return this.processors.get(id);
    }
    removeProcessor(id) {
        const processor = this.processors.get(id);
        if (processor) {
            processor.removeAllListeners();
            this.processors.delete(id);
            this.logger.info('Processor removed', { id });
            return true;
        }
        return false;
    }
    getAllStats() {
        const stats = new Map();
        for (const [id, processor] of this.processors) {
            stats.set(id, processor.getStats());
        }
        return stats;
    }
    getAggregateStats() {
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
    shutdown() {
        this.logger.info('Shutting down DataStreamManager', { processorCount: this.processors.size });
        for (const [id, processor] of this.processors) {
            processor.removeAllListeners();
            processor.resetStats();
        }
        this.processors.clear();
        this.logger.info('DataStreamManager shutdown complete');
    }
}
exports.DataStreamManager = DataStreamManager;
exports.streamManager = new DataStreamManager();
exports.default = DataStreamProcessor;
//# sourceMappingURL=StreamProcessor.js.map