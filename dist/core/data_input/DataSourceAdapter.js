"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceManager = exports.DataSourceManager = exports.FileDataSource = exports.BaseDataSource = exports.DataSourceStatus = void 0;
const logger_1 = require("@common/logger");
const DataInputService_1 = require("./DataInputService");
const StreamProcessor_1 = require("./StreamProcessor");
var DataSourceStatus;
(function (DataSourceStatus) {
    DataSourceStatus["IDLE"] = "IDLE";
    DataSourceStatus["CONNECTING"] = "CONNECTING";
    DataSourceStatus["IMPORTING"] = "IMPORTING";
    DataSourceStatus["ERROR"] = "ERROR";
    DataSourceStatus["DISCONNECTED"] = "DISCONNECTED";
})(DataSourceStatus || (exports.DataSourceStatus = DataSourceStatus = {}));
class BaseDataSource {
    constructor(config) {
        this.logger = (0, logger_1.createLogger)(this.constructor.name);
        this.status = DataSourceStatus.IDLE;
        this.config = config;
        this.stats = this.createInitialStats();
    }
    createInitialStats() {
        return {
            sourceName: this.config.name,
            recordsImported: 0,
            lastImportTime: new Date(0),
            errors: 0,
            status: DataSourceStatus.IDLE,
        };
    }
    updateStatus(status) {
        this.status = status;
        this.stats.status = status;
        this.logger.debug('Data source status updated', { name: this.config.name, status });
    }
    getStats() {
        return { ...this.stats };
    }
    getStatus() {
        return this.status;
    }
    async withRetry(operation, maxRetries = 3, delayMs = 1000) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            }
            catch (error) {
                lastError = error;
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
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}
exports.BaseDataSource = BaseDataSource;
class FileDataSource extends BaseDataSource {
    constructor(config) {
        super(config);
        this.filePath = config.filePath;
    }
    async connect() {
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
        }
        catch (error) {
            this.updateStatus(DataSourceStatus.ERROR);
            throw error;
        }
    }
    async disconnect() {
        this.stopWatching();
        this.updateStatus(DataSourceStatus.DISCONNECTED);
        this.logger.info('File data source disconnected');
    }
    async fetchData() {
        this.updateStatus(DataSourceStatus.IMPORTING);
        try {
            const fs = require('fs');
            const path = require('path');
            if (!fs.existsSync(this.filePath)) {
                throw new Error(`File not found: ${this.filePath}`);
            }
            const content = fs.readFileSync(this.filePath);
            const fileStats = fs.statSync(this.filePath);
            const rawData = {
                id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
                content,
                format: this.detectFormat(this.filePath),
                source: DataInputService_1.DataSourceType.FILE,
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
        }
        catch (error) {
            this.stats.errors++;
            this.updateStatus(DataSourceStatus.ERROR);
            throw error;
        }
    }
    async healthCheck() {
        try {
            const fs = require('fs');
            return fs.existsSync(this.filePath);
        }
        catch {
            return false;
        }
    }
    startWatching(callback, intervalMs = 5000) {
        if (this.watchInterval) {
            this.stopWatching();
        }
        this.watchInterval = setInterval(async () => {
            try {
                const fs = require('fs');
                if (!fs.existsSync(this.filePath))
                    return;
                const stats = fs.statSync(this.filePath);
                if (this.lastModified && stats.mtime > this.lastModified) {
                    this.logger.info('File changed, fetching new data', { filePath: this.filePath });
                    const data = await this.fetchData();
                    callback(data);
                }
            }
            catch (error) {
                this.logger.error('Error watching file', error);
            }
        }, intervalMs);
        this.logger.info('Started watching file', { filePath: this.filePath, intervalMs });
    }
    stopWatching() {
        if (this.watchInterval) {
            clearInterval(this.watchInterval);
            this.watchInterval = undefined;
            this.logger.info('Stopped watching file', { filePath: this.filePath });
        }
    }
    detectFormat(filePath) {
        const ext = require('path').extname(filePath).toLowerCase();
        const formatMap = {
            '.json': DataInputService_1.DataFormat.JSON,
            '.txt': DataInputService_1.DataFormat.TEXT,
            '.md': DataInputService_1.DataFormat.MARKDOWN,
            '.html': DataInputService_1.DataFormat.HTML,
            '.htm': DataInputService_1.DataFormat.HTML,
            '.csv': DataInputService_1.DataFormat.CSV,
            '.xml': DataInputService_1.DataFormat.XML,
        };
        return formatMap[ext] || DataInputService_1.DataFormat.BINARY;
    }
    getMimeType(filePath) {
        const ext = require('path').extname(filePath).toLowerCase();
        const mimeMap = {
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
exports.FileDataSource = FileDataSource;
class DataSourceManager {
    constructor() {
        this.logger = (0, logger_1.createLogger)('DataSourceManager');
        this.sources = new Map();
        this.streamProcessor = StreamProcessor_1.streamManager.createProcessor('ds-manager');
        this.logger.info('DataSourceManager initialized');
    }
    registerSource(id, source) {
        if (this.sources.has(id)) {
            this.logger.warn('Data source already registered', { id });
            return;
        }
        this.sources.set(id, source);
        this.logger.info('Data source registered', { id, type: source.config.type });
    }
    unregisterSource(id) {
        const source = this.sources.get(id);
        if (source) {
            source.disconnect().catch((err) => {
                this.logger.error('Error disconnecting source', err);
            });
            this.sources.delete(id);
            this.logger.info('Data source unregistered', { id });
            return true;
        }
        return false;
    }
    getSource(id) {
        return this.sources.get(id);
    }
    async importFromSource(id, options = {}) {
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
            const results = await DataInputService_1.dataInputService.processBatch(rawData, options.onProgress);
            const processed = [];
            for (const result of results) {
                if ('data' in result && result.success) {
                    processed.push(result.data);
                }
                else {
                    this.logger.warn('Failed to process data', { error: 'data' in result ? result.error : 'Unknown' });
                }
            }
            this.logger.info('Import completed', { id, processedCount: processed.length });
            return processed;
        }
        catch (error) {
            this.logger.error('Import failed', error, { id });
            throw error;
        }
    }
    async importFromAll(options = {}) {
        const results = new Map();
        for (const [id] of this.sources) {
            try {
                const processed = await this.importFromSource(id, options);
                results.set(id, processed);
            }
            catch (error) {
                this.logger.error('Failed to import from source', error, { id });
                results.set(id, []);
            }
        }
        return results;
    }
    async healthCheckAll() {
        const results = new Map();
        for (const [id, source] of this.sources) {
            try {
                const healthy = await source.healthCheck();
                results.set(id, healthy);
            }
            catch {
                results.set(id, false);
            }
        }
        return results;
    }
    getAllStats() {
        const stats = new Map();
        for (const [id, source] of this.sources) {
            stats.set(id, source.getStats());
        }
        return stats;
    }
    getAggregateStats() {
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
            }
            else {
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
    async shutdown() {
        this.logger.info('Shutting down DataSourceManager', { sourceCount: this.sources.size });
        for (const [id, source] of this.sources) {
            try {
                await source.disconnect();
            }
            catch (error) {
                this.logger.error('Error disconnecting source', error, { id });
            }
        }
        this.sources.clear();
        StreamProcessor_1.streamManager.removeProcessor('ds-manager');
        this.logger.info('DataSourceManager shutdown complete');
    }
}
exports.DataSourceManager = DataSourceManager;
exports.dataSourceManager = new DataSourceManager();
exports.default = BaseDataSource;
//# sourceMappingURL=DataSourceAdapter.js.map