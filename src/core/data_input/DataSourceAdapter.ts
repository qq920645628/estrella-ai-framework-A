import { createLogger } from '@common/logger';
import {
  DataFormat,
  DataSourceType,
  RawData,
  ProcessedData,
  DataInputConfig,
  dataInputService,
} from './DataInputService';
import { streamManager, DataStreamProcessor, StreamStats } from './StreamProcessor';

export interface DataSourceConfig {
  type: DataSourceType;
  format: DataFormat;
  name: string;
  connectionString?: string;
  options?: Record<string, unknown>;
}

export interface DataSourceStats {
  sourceName: string;
  recordsImported: number;
  lastImportTime: Date;
  errors: number;
  status: DataSourceStatus;
}

export enum DataSourceStatus {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  IMPORTING = 'IMPORTING',
  ERROR = 'ERROR',
  DISCONNECTED = 'DISCONNECTED',
}

export abstract class BaseDataSource {
  protected readonly logger = createLogger(this.constructor.name);
  protected status: DataSourceStatus = DataSourceStatus.IDLE;
  protected config: DataSourceConfig;
  protected stats: DataSourceStats;

  constructor(config: DataSourceConfig) {
    this.config = config;
    this.stats = this.createInitialStats();
  }

  protected createInitialStats(): DataSourceStats {
    return {
      sourceName: this.config.name,
      recordsImported: 0,
      lastImportTime: new Date(0),
      errors: 0,
      status: DataSourceStatus.IDLE,
    };
  }

  public abstract connect(): Promise<void>;
  public abstract disconnect(): Promise<void>;
  public abstract fetchData(): Promise<RawData[]>;
  public abstract healthCheck(): Promise<boolean>;

  protected updateStatus(status: DataSourceStatus): void {
    this.status = status;
    this.stats.status = status;
    this.logger.debug('Data source status updated', { name: this.config.name, status });
  }

  public getStats(): DataSourceStats {
    return { ...this.stats };
  }

  public getStatus(): DataSourceStatus {
    return this.status;
  }

  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`Operation failed, attempt ${attempt}/${maxRetries}`, {
          error: lastError.message,
        });

        if (attempt < maxRetries) {
          await this.sleep(delayMs * attempt);
        }
      }
    }

    throw lastError;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class FileDataSource extends BaseDataSource {
  private filePath: string;
  private watchInterval?: NodeJS.Timeout;
  private lastModified?: Date;

  constructor(config: DataSourceConfig & { filePath: string }) {
    super(config);
    this.filePath = config.filePath;
  }

  public async connect(): Promise<void> {
    this.updateStatus(DataSourceStatus.CONNECTING);
    try {
      const fs = require('fs');
      if (!fs.existsSync(this.filePath)) {
        throw new Error(`File not found: ${this.filePath}`);
      }
      const stats = fs.statSync(this.filePath);
      this.lastModified = stats.mtime;
      this.updateStatus(DataSourceStatus.IDLE);
      this.logger.info('File data source connected', { filePath: this.filePath });
    } catch (error) {
      this.updateStatus(DataSourceStatus.ERROR);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    this.stopWatching();
    this.updateStatus(DataSourceStatus.DISCONNECTED);
    this.logger.info('File data source disconnected');
  }

  public async fetchData(): Promise<RawData[]> {
    this.updateStatus(DataSourceStatus.IMPORTING);

    try {
      const fs = require('fs');
      const path = require('path');

      if (!fs.existsSync(this.filePath)) {
        throw new Error(`File not found: ${this.filePath}`);
      }

      const content = fs.readFileSync(this.filePath);
      const fileStats = fs.statSync(this.filePath);

      const rawData: RawData = {
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        content,
        format: this.detectFormat(this.filePath),
        source: DataSourceType.FILE,
        sourceId: this.filePath,
        metadata: {
          fileName: path.basename(this.filePath),
          fileSize: fileStats.size,
          lastModified: fileStats.mtime.toISOString(),
          mimeType: this.getMimeType(this.filePath),
        },
        receivedAt: new Date(),
        size: fileStats.size,
      };

      this.stats.recordsImported++;
      this.stats.lastImportTime = new Date();
      this.lastModified = fileStats.mtime;
      this.updateStatus(DataSourceStatus.IDLE);

      return [rawData];
    } catch (error) {
      this.stats.errors++;
      this.updateStatus(DataSourceStatus.ERROR);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const fs = require('fs');
      return fs.existsSync(this.filePath);
    } catch {
      return false;
    }
  }

  public startWatching(callback: (data: RawData[]) => void, intervalMs: number = 5000): void {
    if (this.watchInterval) {
      this.stopWatching();
    }

    this.watchInterval = setInterval(async () => {
      try {
        const fs = require('fs');
        if (!fs.existsSync(this.filePath)) return;

        const stats = fs.statSync(this.filePath);
        if (this.lastModified && stats.mtime > this.lastModified) {
          this.logger.info('File changed, fetching new data', { filePath: this.filePath });
          const data = await this.fetchData();
          callback(data);
        }
      } catch (error) {
        this.logger.error('Error watching file', error as Error);
      }
    }, intervalMs);

    this.logger.info('Started watching file', { filePath: this.filePath, intervalMs });
  }

  public stopWatching(): void {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = undefined;
      this.logger.info('Stopped watching file', { filePath: this.filePath });
    }
  }

  private detectFormat(filePath: string): DataFormat {
    const ext = require('path').extname(filePath).toLowerCase();
    const formatMap: Record<string, DataFormat> = {
      '.json': DataFormat.JSON,
      '.txt': DataFormat.TEXT,
      '.md': DataFormat.MARKDOWN,
      '.html': DataFormat.HTML,
      '.htm': DataFormat.HTML,
      '.csv': DataFormat.CSV,
      '.xml': DataFormat.XML,
    };
    return formatMap[ext] || DataFormat.BINARY;
  }

  private getMimeType(filePath: string): string {
    const ext = require('path').extname(filePath).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.json': 'application/json',
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.csv': 'text/csv',
      '.xml': 'application/xml',
    };
    return mimeMap[ext] || 'application/octet-stream';
  }
}

export class DataSourceManager {
  private readonly logger = createLogger('DataSourceManager');
  private readonly sources: Map<string, BaseDataSource> = new Map();
  private streamProcessor: DataStreamProcessor;

  constructor() {
    this.streamProcessor = streamManager.createProcessor('ds-manager');
    this.logger.info('DataSourceManager initialized');
  }

  public registerSource(id: string, source: BaseDataSource): void {
    if (this.sources.has(id)) {
      this.logger.warn('Data source already registered', { id });
      return;
    }

    this.sources.set(id, source);
    this.logger.info('Data source registered', { id, type: source.config.type });
  }

  public unregisterSource(id: string): boolean {
    const source = this.sources.get(id);
    if (source) {
      source.disconnect().catch((err) => {
        this.logger.error('Error disconnecting source', err as Error);
      });
      this.sources.delete(id);
      this.logger.info('Data source unregistered', { id });
      return true;
    }
    return false;
  }

  public getSource(id: string): BaseDataSource | undefined {
    return this.sources.get(id);
  }

  public async importFromSource(
    id: string,
    options: {
      processData?: boolean;
      onProgress?: (processed: number, total: number) => void;
    } = {}
  ): Promise<ProcessedData[]> {
    const source = this.sources.get(id);
    if (!source) {
      throw new Error(`Data source not found: ${id}`);
    }

    this.logger.info('Starting import from source', { id });

    try {
      const rawData = await source.fetchData();
      this.logger.debug('Fetched raw data', { id, count: rawData.length });

      if (!options.processData) {
        return [];
      }

      const results = await dataInputService.processBatch(
        rawData,
        options.onProgress
      );

      const processed: ProcessedData[] = [];
      for (const result of results) {
        if ('data' in result && result.success) {
          processed.push(result.data);
        } else {
          this.logger.warn('Failed to process data', { error: 'data' in result ? result.error : 'Unknown' });
        }
      }

      this.logger.info('Import completed', { id, processedCount: processed.length });
      return processed;
    } catch (error) {
      this.logger.error('Import failed', error as Error, { id });
      throw error;
    }
  }

  public async importFromAll(
    options: { processData?: boolean } = {}
  ): Promise<Map<string, ProcessedData[]>> {
    const results = new Map<string, ProcessedData[]>();

    for (const [id] of this.sources) {
      try {
        const processed = await this.importFromSource(id, options);
        results.set(id, processed);
      } catch (error) {
        this.logger.error('Failed to import from source', error as Error, { id });
        results.set(id, []);
      }
    }

    return results;
  }

  public async healthCheckAll(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    for (const [id, source] of this.sources) {
      try {
        const healthy = await source.healthCheck();
        results.set(id, healthy);
      } catch {
        results.set(id, false);
      }
    }

    return results;
  }

  public getAllStats(): Map<string, DataSourceStats> {
    const stats = new Map<string, DataSourceStats>();
    for (const [id, source] of this.sources) {
      stats.set(id, source.getStats());
    }
    return stats;
  }

  public getAggregateStats(): {
    totalRecordsImported: number;
    totalErrors: number;
    healthySources: number;
    unhealthySources: number;
  } {
    let totalRecords = 0;
    let totalErrors = 0;
    let healthy = 0;
    let unhealthy = 0;

    for (const source of this.sources.values()) {
      const stats = source.getStats();
      totalRecords += stats.recordsImported;
      totalErrors += stats.errors;
      if (source.getStatus() === DataSourceStatus.IDLE) {
        healthy++;
      } else {
        unhealthy++;
      }
    }

    return {
      totalRecordsImported: totalRecords,
      totalErrors: totalErrors,
      healthySources: healthy,
      unhealthySources: unhealthy,
    };
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down DataSourceManager', { sourceCount: this.sources.size });

    for (const [id, source] of this.sources) {
      try {
        await source.disconnect();
      } catch (error) {
        this.logger.error('Error disconnecting source', error as Error, { id });
      }
    }

    this.sources.clear();
    streamManager.removeProcessor('ds-manager');
    this.logger.info('DataSourceManager shutdown complete');
  }
}

export const dataSourceManager = new DataSourceManager();

export default BaseDataSource;
