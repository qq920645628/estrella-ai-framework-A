import { createLogger } from '@common/logger';
import {
  ValidationError,
  ResourceExhaustedError,
} from '@common/errors';
import { Result, ok, err } from '@common/utils';

export enum DataFormat {
  JSON = 'json',
  TEXT = 'text',
  MARKDOWN = 'markdown',
  HTML = 'html',
  CSV = 'csv',
  XML = 'xml',
  BINARY = 'binary',
}

export enum DataSourceType {
  FILE = 'file',
  API = 'api',
  STREAM = 'stream',
  DATABASE = 'database',
  MESSAGE_QUEUE = 'message_queue',
}

export interface DataInputConfig {
  maxFileSizeMB: number;
  maxConcurrentProcessing: number;
  supportedFormats: DataFormat[];
  enableValidation: boolean;
  enablePreprocessing: boolean;
  enableDeduplication: boolean;
  timeoutMs: number;
}

export interface RawData {
  id: string;
  content: string | Buffer;
  format: DataFormat;
  source: DataSourceType;
  sourceId?: string;
  metadata: Record<string, unknown>;
  receivedAt: Date;
  size: number;
}

export interface ProcessedData {
  id: string;
  rawDataId: string;
  normalizedContent: string;
  extractedFields: Record<string, unknown>;
  format: DataFormat;
  quality: DataQuality;
  processingDuration: number;
  processedAt: Date;
  warnings: ProcessingWarning[];
}

export interface DataQuality {
  score: number;
  completeness: number;
  consistency: number;
  validity: number;
}

export interface ProcessingWarning {
  code: string;
  message: string;
  field?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'type' | 'range' | 'pattern' | 'custom';
  params?: Record<string, unknown>;
  message: string;
}

const DEFAULT_CONFIG: DataInputConfig = {
  maxFileSizeMB: 100,
  maxConcurrentProcessing: 5,
  supportedFormats: [
    DataFormat.JSON,
    DataFormat.TEXT,
    DataFormat.MARKDOWN,
    DataFormat.HTML,
    DataFormat.CSV,
    DataFormat.XML,
  ],
  enableValidation: true,
  enablePreprocessing: true,
  enableDeduplication: true,
  timeoutMs: 30000,
};

const DEFAULT_QUALITY: DataQuality = {
  score: 1.0,
  completeness: 1.0,
  consistency: 1.0,
  validity: 1.0,
};

export class DataValidationError extends ValidationError {
  constructor(
    message: string,
    public readonly errors: Array<{ field: string; message: string }>
  ) {
    super(message);
  }
}

export class DataProcessingError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DataProcessingError';
  }
}

class DataInputService {
  private readonly logger = createLogger('DataInputService');
  private readonly config: DataInputConfig;
  private readonly validationRules: Map<DataFormat, ValidationRule[]> = new Map();
  private processedDataCache: Map<string, ProcessedData> = new Map();
  private dataHashIndex: Map<string, string> = new Map();

  constructor(config: Partial<DataInputConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeDefaultValidationRules();
    this.logger.info('DataInputService initialized', { config: this.config });
  }

  private initializeDefaultValidationRules(): void {
    this.validationRules.set(DataFormat.JSON, [
      { field: 'content', type: 'required', message: 'Content is required' },
      { field: 'content', type: 'type', params: { expectedType: 'string' }, message: 'Content must be a string' },
    ]);

    this.validationRules.set(DataFormat.TEXT, [
      { field: 'content', type: 'required', message: 'Content is required' },
      { field: 'content', type: 'range', params: { minLength: 1, maxLength: 10 * 1024 * 1024 }, message: 'Content length out of range' },
    ]);

    this.validationRules.set(DataFormat.CSV, [
      { field: 'content', type: 'required', message: 'Content is required' },
      { field: 'content', type: 'pattern', params: { pattern: /^.+\n.+/ }, message: 'CSV must have at least header and one row' },
    ]);
  }

  public async process(rawData: RawData): Promise<Result<ProcessedData, DataProcessingError | DataValidationError>> {
    const startTime = Date.now();
    this.logger.debug('Starting data processing', { dataId: rawData.id, format: rawData.format });

    try {
      if (this.config.enableValidation) {
        const validationResult = await this.validate(rawData);
        if (!validationResult.success) {
          return err(validationResult.error);
        }
      }

      if (this.config.enableDeduplication) {
        const dedupResult = await this.checkDeduplication(rawData);
        if (dedupResult.success && dedupResult.data.isDuplicate) {
          this.logger.warn('Duplicate data detected', { dataId: rawData.id, originalId: dedupResult.data.originalId });
          return err(new DataProcessingError(
            'Duplicate data detected',
            'DUPLICATE_DATA',
            { originalId: dedupResult.data.originalId }
          ));
        }
      }

      const normalized = await this.normalize(rawData);
      const extracted = await this.extractFields(normalized);
      const quality = await this.assessQuality(normalized, extracted);

      const processed: ProcessedData = {
        id: this.generateProcessedDataId(),
        rawDataId: rawData.id,
        normalizedContent: normalized,
        extractedFields: extracted,
        format: rawData.format,
        quality,
        processingDuration: Date.now() - startTime,
        processedAt: new Date(),
        warnings: [],
      };

      this.cacheProcessedData(processed);
      this.logger.info('Data processed successfully', {
        dataId: rawData.id,
        processedId: processed.id,
        duration: processed.processingDuration,
        quality: processed.quality.score,
      });

      return ok(processed);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Data processing failed', error as Error, { dataId: rawData.id });
      return err(new DataProcessingError(errMsg, 'PROCESSING_ERROR', { dataId: rawData.id }));
    }
  }

  private async validate(rawData: RawData): Promise<Result<true, DataValidationError>> {
    const rules = this.validationRules.get(rawData.format);
    if (!rules || rules.length === 0) {
      return ok(true);
    }

    const errors: Array<{ field: string; message: string }> = [];
    const content = typeof rawData.content === 'string' ? rawData.content : rawData.content.toString('utf-8');

    for (const rule of rules) {
      const error = this.applyValidationRule(rule, content, rawData.metadata);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return err(new DataValidationError('Validation failed', errors));
    }

    return ok(true);
  }

  private applyValidationRule(
    rule: ValidationRule,
    content: string,
    metadata: Record<string, unknown>
  ): { field: string; message: string } | null {
    const value = rule.field === 'content' ? content : metadata[rule.field];

    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return { field: rule.field, message: rule.message };
        }
        break;

      case 'type':
        const expectedType = rule.params?.expectedType as string;
        if (typeof value !== expectedType) {
          return { field: rule.field, message: rule.message };
        }
        break;

      case 'range':
        const minLength = rule.params?.minLength as number | undefined;
        const maxLength = rule.params?.maxLength as number | undefined;
        if (typeof value === 'string') {
          if (minLength !== undefined && value.length < minLength) {
            return { field: rule.field, message: rule.message };
          }
          if (maxLength !== undefined && value.length > maxLength) {
            return { field: rule.field, message: rule.message };
          }
        }
        break;

      case 'pattern':
        const pattern = rule.params?.pattern as RegExp;
        if (pattern && typeof value === 'string' && !pattern.test(value)) {
          return { field: rule.field, message: rule.message };
        }
        break;
    }

    return null;
  }

  private async checkDeduplication(rawData: RawData): Promise<Result<{ isDuplicate: boolean; originalId?: string }>> {
    const hash = this.computeDataHash(rawData);
    const existingId = this.dataHashIndex.get(hash);

    if (existingId) {
      return ok({ isDuplicate: true, originalId: existingId });
    }

    this.dataHashIndex.set(hash, rawData.id);
    return ok({ isDuplicate: false });
  }

  private computeDataHash(rawData: RawData): string {
    const content = typeof rawData.content === 'string'
      ? rawData.content
      : rawData.content.toString('utf-8');
    const hash = require('crypto')
      .createHash('sha256')
      .update(content + rawData.source + (rawData.sourceId || ''))
      .digest('hex');
    return hash;
  }

  private async normalize(rawData: RawData): Promise<string> {
    let content = typeof rawData.content === 'string'
      ? rawData.content
      : rawData.content.toString('utf-8');

    switch (rawData.format) {
      case DataFormat.HTML:
        content = this.stripHtmlTags(content);
        break;
      case DataFormat.MARKDOWN:
        content = this.normalizeMarkdown(content);
        break;
      case DataFormat.XML:
        content = this.normalizeXml(content);
        break;
      case DataFormat.CSV:
        content = this.normalizeCsv(content);
        break;
    }

    content = this.normalizeWhitespace(content);
    return content.trim();
  }

  private stripHtmlTags(html: string): string {
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"');
  }

  private normalizeMarkdown(md: string): string {
    return md
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#*_~`]/g, ' ')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]+`/g, '');
  }

  private normalizeXml(xml: string): string {
    return xml
      .replace(/<\?[^>]+\?>/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ');
  }

  private normalizeCsv(csv: string): string {
    const lines = csv.split('\n');
    const headers = lines[0]?.split(',').map((h) => h.trim()) || [];
    const result: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });
      result.push(JSON.stringify(obj));
    }

    return result.join('\n');
  }

  private normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ');
  }

  private async extractFields(data: string): Promise<Record<string, unknown>> {
    const fields: Record<string, unknown> = {
      wordCount: data.split(/\s+/).filter((w) => w.length > 0).length,
      charCount: data.length,
      lineCount: data.split('\n').length,
      paragraphCount: data.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length,
    };

    const titleMatch = data.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      fields.title = titleMatch[1].trim();
    }

    const urlMatches = data.match(/https?:\/\/[^\s]+/g);
    if (urlMatches) {
      fields.urls = [...new Set(urlMatches)];
    }

    const emailMatches = data.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
    if (emailMatches) {
      fields.emails = [...new Set(emailMatches)];
    }

    return fields;
  }

  private async assessQuality(data: string, extracted: Record<string, unknown>): Promise<DataQuality> {
    const wordCount = extracted.wordCount as number;
    const lineCount = extracted.lineCount as number;

    const completeness = wordCount > 100 ? 1.0 : wordCount / 100;
    const consistency = this.checkConsistency(data);
    const validity = this.checkValidity(data);

    const score = (completeness * 0.4 + consistency * 0.3 + validity * 0.3);

    return {
      score: Math.round(score * 100) / 100,
      completeness: Math.round(completeness * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      validity: Math.round(validity * 100) / 100,
    };
  }

  private checkConsistency(data: string): number {
    const lines = data.split('\n');
    let consistent = true;
    let lastIndent = 0;

    for (const line of lines) {
      const indent = line.match(/^\s*/)?.[0].length || 0;
      if (Math.abs(indent - lastIndent) > 4 && lastIndent !== 0) {
        consistent = false;
        break;
      }
      lastIndent = indent;
    }

    return consistent ? 1.0 : 0.7;
  }

  private checkValidity(data: string): number {
    const validPatterns = [
      /[\u4e00-\u9fa5]/,
      /[a-zA-Z]/,
      /[0-9]/,
    ];

    let patternCount = 0;
    for (const pattern of validPatterns) {
      if (pattern.test(data)) {
        patternCount++;
      }
    }

    return patternCount / validPatterns.length;
  }

  private cacheProcessedData(processed: ProcessedData): void {
    if (this.processedDataCache.size > 10000) {
      const firstKey = this.processedDataCache.keys().next().value;
      if (firstKey) {
        this.processedDataCache.delete(firstKey);
      }
    }
    this.processedDataCache.set(processed.id, processed);
  }

  public getProcessedData(id: string): ProcessedData | undefined {
    return this.processedDataCache.get(id);
  }

  public async processBatch(
    rawDataList: RawData[],
    onProgress?: (completed: number, total: number) => void
  ): Promise<Array<Result<ProcessedData, DataProcessingError | DataValidationError>>> {
    const results: Array<Result<ProcessedData, DataProcessingError | DataValidationError>> = [];
    let completed = 0;
    const total = rawDataList.length;

    const chunkSize = this.config.maxConcurrentProcessing;
    for (let i = 0; i < total; i += chunkSize) {
      const chunk = rawDataList.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(
        chunk.map(async (data) => {
          const result = await this.process(data);
          completed++;
          onProgress?.(completed, total);
          return result;
        })
      );
      results.push(...chunkResults);
    }

    return results;
  }

  public addValidationRule(format: DataFormat, rule: ValidationRule): void {
    const rules = this.validationRules.get(format) || [];
    rules.push(rule);
    this.validationRules.set(format, rules);
    this.logger.debug('Added validation rule', { format, rule });
  }

  public getStatistics(): {
    totalProcessed: number;
    cacheSize: number;
    uniqueDataCount: number;
    averageQuality: number;
  } {
    let totalQuality = 0;
    let count = 0;

    for (const processed of this.processedDataCache.values()) {
      totalQuality += processed.quality.score;
      count++;
    }

    return {
      totalProcessed: count,
      cacheSize: this.processedDataCache.size,
      uniqueDataCount: this.dataHashIndex.size,
      averageQuality: count > 0 ? Math.round((totalQuality / count) * 100) / 100 : 0,
    };
  }

  private generateProcessedDataId(): string {
    return `proc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  public clearCache(): void {
    this.processedDataCache.clear();
    this.dataHashIndex.clear();
    this.logger.info('Cache cleared');
  }
}

export const dataInputService = new DataInputService();

export default DataInputService;
