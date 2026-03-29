"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataInputService = exports.DataProcessingError = exports.DataValidationError = exports.DataSourceType = exports.DataFormat = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const utils_1 = require("@common/utils");
var DataFormat;
(function (DataFormat) {
    DataFormat["JSON"] = "json";
    DataFormat["TEXT"] = "text";
    DataFormat["MARKDOWN"] = "markdown";
    DataFormat["HTML"] = "html";
    DataFormat["CSV"] = "csv";
    DataFormat["XML"] = "xml";
    DataFormat["BINARY"] = "binary";
})(DataFormat || (exports.DataFormat = DataFormat = {}));
var DataSourceType;
(function (DataSourceType) {
    DataSourceType["FILE"] = "file";
    DataSourceType["API"] = "api";
    DataSourceType["STREAM"] = "stream";
    DataSourceType["DATABASE"] = "database";
    DataSourceType["MESSAGE_QUEUE"] = "message_queue";
})(DataSourceType || (exports.DataSourceType = DataSourceType = {}));
const DEFAULT_CONFIG = {
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
const DEFAULT_QUALITY = {
    score: 1.0,
    completeness: 1.0,
    consistency: 1.0,
    validity: 1.0,
};
class DataValidationError extends errors_1.ValidationError {
    constructor(message, errors) {
        super(message);
        this.errors = errors;
    }
}
exports.DataValidationError = DataValidationError;
class DataProcessingError extends Error {
    constructor(message, code, context) {
        super(message);
        this.code = code;
        this.context = context;
        this.name = 'DataProcessingError';
    }
}
exports.DataProcessingError = DataProcessingError;
class DataInputService {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)('DataInputService');
        this.validationRules = new Map();
        this.processedDataCache = new Map();
        this.dataHashIndex = new Map();
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.initializeDefaultValidationRules();
        this.logger.info('DataInputService initialized', { config: this.config });
    }
    initializeDefaultValidationRules() {
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
    async process(rawData) {
        const startTime = Date.now();
        this.logger.debug('Starting data processing', { dataId: rawData.id, format: rawData.format });
        try {
            if (this.config.enableValidation) {
                const validationResult = await this.validate(rawData);
                if (!validationResult.success) {
                    return (0, utils_1.err)(validationResult.error);
                }
            }
            if (this.config.enableDeduplication) {
                const dedupResult = await this.checkDeduplication(rawData);
                if (dedupResult.success && dedupResult.data.isDuplicate) {
                    this.logger.warn('Duplicate data detected', { dataId: rawData.id, originalId: dedupResult.data.originalId });
                    return (0, utils_1.err)(new DataProcessingError('Duplicate data detected', 'DUPLICATE_DATA', { originalId: dedupResult.data.originalId }));
                }
            }
            const normalized = await this.normalize(rawData);
            const extracted = await this.extractFields(normalized);
            const quality = await this.assessQuality(normalized, extracted);
            const processed = {
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
            return (0, utils_1.ok)(processed);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Data processing failed', error, { dataId: rawData.id });
            return (0, utils_1.err)(new DataProcessingError(errMsg, 'PROCESSING_ERROR', { dataId: rawData.id }));
        }
    }
    async validate(rawData) {
        const rules = this.validationRules.get(rawData.format);
        if (!rules || rules.length === 0) {
            return (0, utils_1.ok)(true);
        }
        const errors = [];
        const content = typeof rawData.content === 'string' ? rawData.content : rawData.content.toString('utf-8');
        for (const rule of rules) {
            const error = this.applyValidationRule(rule, content, rawData.metadata);
            if (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            return (0, utils_1.err)(new DataValidationError('Validation failed', errors));
        }
        return (0, utils_1.ok)(true);
    }
    applyValidationRule(rule, content, metadata) {
        const value = rule.field === 'content' ? content : metadata[rule.field];
        switch (rule.type) {
            case 'required':
                if (value === undefined || value === null || value === '') {
                    return { field: rule.field, message: rule.message };
                }
                break;
            case 'type':
                const expectedType = rule.params?.expectedType;
                if (typeof value !== expectedType) {
                    return { field: rule.field, message: rule.message };
                }
                break;
            case 'range':
                const minLength = rule.params?.minLength;
                const maxLength = rule.params?.maxLength;
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
                const pattern = rule.params?.pattern;
                if (pattern && typeof value === 'string' && !pattern.test(value)) {
                    return { field: rule.field, message: rule.message };
                }
                break;
        }
        return null;
    }
    async checkDeduplication(rawData) {
        const hash = this.computeDataHash(rawData);
        const existingId = this.dataHashIndex.get(hash);
        if (existingId) {
            return (0, utils_1.ok)({ isDuplicate: true, originalId: existingId });
        }
        this.dataHashIndex.set(hash, rawData.id);
        return (0, utils_1.ok)({ isDuplicate: false });
    }
    computeDataHash(rawData) {
        const content = typeof rawData.content === 'string'
            ? rawData.content
            : rawData.content.toString('utf-8');
        const hash = require('crypto')
            .createHash('sha256')
            .update(content + rawData.source + (rawData.sourceId || ''))
            .digest('hex');
        return hash;
    }
    async normalize(rawData) {
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
    stripHtmlTags(html) {
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
    normalizeMarkdown(md) {
        return md
            .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
            .replace(/[#*_~`]/g, ' ')
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`[^`]+`/g, '');
    }
    normalizeXml(xml) {
        return xml
            .replace(/<\?[^>]+\?>/g, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ');
    }
    normalizeCsv(csv) {
        const lines = csv.split('\n');
        const headers = lines[0]?.split(',').map((h) => h.trim()) || [];
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map((v) => v.trim());
            const obj = {};
            headers.forEach((h, idx) => {
                obj[h] = values[idx] || '';
            });
            result.push(JSON.stringify(obj));
        }
        return result.join('\n');
    }
    normalizeWhitespace(text) {
        return text.replace(/\s+/g, ' ');
    }
    async extractFields(data) {
        const fields = {
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
    async assessQuality(data, extracted) {
        const wordCount = extracted.wordCount;
        const lineCount = extracted.lineCount;
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
    checkConsistency(data) {
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
    checkValidity(data) {
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
    cacheProcessedData(processed) {
        if (this.processedDataCache.size > 10000) {
            const firstKey = this.processedDataCache.keys().next().value;
            if (firstKey) {
                this.processedDataCache.delete(firstKey);
            }
        }
        this.processedDataCache.set(processed.id, processed);
    }
    getProcessedData(id) {
        return this.processedDataCache.get(id);
    }
    async processBatch(rawDataList, onProgress) {
        const results = [];
        let completed = 0;
        const total = rawDataList.length;
        const chunkSize = this.config.maxConcurrentProcessing;
        for (let i = 0; i < total; i += chunkSize) {
            const chunk = rawDataList.slice(i, i + chunkSize);
            const chunkResults = await Promise.all(chunk.map(async (data) => {
                const result = await this.process(data);
                completed++;
                onProgress?.(completed, total);
                return result;
            }));
            results.push(...chunkResults);
        }
        return results;
    }
    addValidationRule(format, rule) {
        const rules = this.validationRules.get(format) || [];
        rules.push(rule);
        this.validationRules.set(format, rules);
        this.logger.debug('Added validation rule', { format, rule });
    }
    getStatistics() {
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
    generateProcessedDataId() {
        return `proc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    clearCache() {
        this.processedDataCache.clear();
        this.dataHashIndex.clear();
        this.logger.info('Cache cleared');
    }
}
exports.dataInputService = new DataInputService();
exports.default = DataInputService;
//# sourceMappingURL=DataInputService.js.map