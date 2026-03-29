"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./common/logger");
const middleware_1 = require("./api/middleware");
const HealthController_1 = require("./api/HealthController");
const SkillsController_1 = require("./api/SkillsController");
const BaseController_1 = require("./api/BaseController");
const database_1 = require("./core/database");
const config_1 = require("./common/config");
const metrics_1 = require("./common/metrics");
const logger = (0, logger_1.createLogger)('OpenClawSkills');
class OpenClawSkillsSystem {
    constructor() {
        this.server = null;
        this.initialized = false;
        this.config = config_1.configLoader.getConfig();
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb', reviver: (_key, value) => value }));
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // 设置 UTF-8 编码
        this.app.use((req, res, next) => {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            next();
        });
        // Serve static frontend files
        const frontendPath = path_1.default.join(__dirname, '..', 'frontend');
        this.app.use(express_1.default.static(frontendPath));
        // Serve index.html for root path
        this.app.get('/', (req, res) => {
            res.sendFile(path_1.default.join(frontendPath, 'index.html'));
        });
        this.app.use((req, _res, next) => {
            const start = Date.now();
            _res.on('finish', () => {
                const duration = Date.now() - start;
                metrics_1.metricsCollector.observe('http_request_duration_ms', duration, {
                    method: req.method,
                    path: req.path,
                    status: _res.statusCode.toString(),
                });
                metrics_1.metricsCollector.incrementCounter('http_requests_total', 1, {
                    method: req.method,
                    path: req.path,
                });
            });
            next();
        });
        logger.info('Middleware setup complete');
    }
    setupRoutes() {
        const apiRouter = (0, express_1.Router)();
        apiRouter.get('/health', (0, middleware_1.asyncHandler)((req, res) => HealthController_1.healthController.getHealth(req, res)));
        apiRouter.get('/ready', (0, middleware_1.asyncHandler)((req, res) => HealthController_1.healthController.getReadiness(req, res)));
        apiRouter.get('/live', (0, middleware_1.asyncHandler)((req, res) => HealthController_1.healthController.getLiveness(req, res)));
        apiRouter.post('/api/v1/data/process', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.processData(req, res)));
        apiRouter.post('/api/v1/knowledge/extract', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.extractKnowledge(req, res)));
        apiRouter.post('/api/v1/knowledge/fuse', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.fuseKnowledge(req, res)));
        apiRouter.post('/api/v1/knowledge/entries', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.createKnowledgeEntry(req, res)));
        apiRouter.get('/api/v1/knowledge/search', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.searchKnowledge(req, res)));
        apiRouter.get('/api/v1/knowledge', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.listKnowledge(req, res)));
        apiRouter.get('/api/v1/knowledge/count', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.getKnowledgeCount(req, res)));
        apiRouter.post('/api/v1/knowledge/import-folder', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.importFromFolder(req, res)));
        apiRouter.delete('/api/v1/knowledge/:id', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.deleteKnowledge(req, res)));
        apiRouter.put('/api/v1/knowledge/:id', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.updateKnowledge(req, res)));
        apiRouter.post('/api/v1/knowledge/backup', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.backupKnowledge(req, res)));
        apiRouter.post('/api/v1/knowledge/restore', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.restoreKnowledge(req, res)));
        apiRouter.post('/api/v1/knowledge/upload', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.uploadFile(req, res)));
        apiRouter.get('/api/v1/knowledge/tags', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.getAllTags(req, res)));
        apiRouter.post('/api/v1/knowledge/batch-delete', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.batchDeleteKnowledge(req, res)));
        apiRouter.get('/api/v1/knowledge/export', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.exportKnowledge(req, res)));
        apiRouter.get('/api/v1/knowledge/stats', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.getKnowledgeStats(req, res)));
        // Memory API routes
        apiRouter.get('/api/v1/memory', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { type, role, page = '1', pageSize = '50', q } = req.query;
            if (q) {
                // Search memories
                const results = await database_1.memoryRepository.search(q, type);
                res.json((0, BaseController_1.successResponse)({ items: results, total: results.length, page: 1, pageSize: results.length }));
            }
            else if (role) {
                // Filter by role
                const result = await database_1.memoryRepository.findByRole(role, { page: parseInt(page), pageSize: parseInt(pageSize) });
                res.json((0, BaseController_1.successResponse)(result));
            }
            else if (type) {
                // Filter by type
                const result = await database_1.memoryRepository.findByType(type, { page: parseInt(page), pageSize: parseInt(pageSize) });
                res.json((0, BaseController_1.successResponse)(result));
            }
            else {
                // List all
                const result = await database_1.memoryRepository.findAll({ page: parseInt(page), pageSize: parseInt(pageSize) });
                res.json((0, BaseController_1.successResponse)(result));
            }
        }));
        apiRouter.get('/api/v1/memory/count', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { type, role } = req.query;
            let count;
            if (role) {
                count = await database_1.memoryRepository.countByRole(role);
            }
            else if (type) {
                count = await database_1.memoryRepository.countByType(type);
            }
            else {
                count = await database_1.memoryRepository.count();
            }
            res.json((0, BaseController_1.successResponse)({ count, type: type || 'all', role: role || null }));
        }));
        apiRouter.post('/api/v1/memory', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { content, memoryType, role, speaker, keywords, metadata } = req.body;
            if (!content || !memoryType) {
                res.status(400).json((0, BaseController_1.errorResponse)('content and memoryType are required'));
                return;
            }
            const entry = await database_1.memoryRepository.create({ content, memoryType, role, speaker, keywords, metadata });
            res.json((0, BaseController_1.successResponse)(entry));
        }));
        // Auto-record conversation messages (batch)
        apiRouter.post('/api/v1/memory/auto-record', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { messages } = req.body;
            if (!Array.isArray(messages) || messages.length === 0) {
                res.status(400).json((0, BaseController_1.errorResponse)('messages array is required'));
                return;
            }
            const results = [];
            for (const msg of messages) {
                const { content, role } = msg;
                if (content && role) {
                    const entry = await database_1.memoryRepository.create({
                        content,
                        memoryType: 'episodic',
                        role: role === 'user' ? 'user' : role === 'assistant' ? 'assistant' : 'system'
                    });
                    results.push(entry);
                }
            }
            res.json((0, BaseController_1.successResponse)({ recorded: results.length, messages: results }));
        }));
        apiRouter.put('/api/v1/memory/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const { content, memoryType, role, speaker, keywords, metadata } = req.body;
            const entry = await database_1.memoryRepository.update(id, { content, memoryType, role, speaker, keywords, metadata });
            res.json((0, BaseController_1.successResponse)(entry));
        }));
        apiRouter.delete('/api/v1/memory/:id', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { id } = req.params;
            const deleted = await database_1.memoryRepository.delete(id);
            res.json((0, BaseController_1.successResponse)({ deleted, id }));
        }));
        apiRouter.delete('/api/v1/memory', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { type } = req.query;
            if (!type) {
                res.status(400).json((0, BaseController_1.errorResponse)('type query parameter is required'));
                return;
            }
            const deleted = await database_1.memoryRepository.clearByType(type);
            res.json((0, BaseController_1.successResponse)({ deleted, type }));
        }));
        // Auto-organize knowledge
        apiRouter.post('/api/v1/knowledge/auto-organize', (0, middleware_1.asyncHandler)(async (req, res) => {
            const { mode } = req.query;
            const organizeMode = mode || 'all'; // 'tag', 'dedup', 'cluster', 'all'
            try {
                const allEntries = await database_1.knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
                const entries = allEntries.items || [];
                let results = { tagged: 0, deduped: 0, clustered: 0, message: '' };
                // Auto-tagging: extract keywords from content
                if (organizeMode === 'tag' || organizeMode === 'all') {
                    for (const entry of entries) {
                        try {
                            const words = String(entry.content).split(/[,，.。!?！？\s]+/).filter((w) => w.length > 2);
                            const uniqueTags = [...new Set(words.slice(0, 5))];
                            const existingTags = Array.isArray(entry.tags) ? entry.tags : [];
                            const newTags = [...new Set([...existingTags, ...uniqueTags])];
                            if (newTags.length > existingTags.length) {
                                await database_1.knowledgeRepository.update(entry.id, { tags: newTags });
                                results.tagged++;
                            }
                        }
                        catch (e) { /* skip failed entries */ }
                    }
                }
                // Deduplication
                if (organizeMode === 'dedup' || organizeMode === 'all') {
                    const contentMap = new Map();
                    const toDelete = [];
                    for (const entry of entries) {
                        const normalized = String(entry.content).toLowerCase().trim();
                        if (contentMap.has(normalized)) {
                            toDelete.push(entry.id);
                        }
                        else {
                            contentMap.set(normalized, entry.id);
                        }
                    }
                    for (const id of toDelete) {
                        try {
                            await database_1.knowledgeRepository.delete(id);
                            results.deduped++;
                        }
                        catch (e) { /* skip failed deletes */ }
                    }
                }
                results.message = `整理完成：自动标签 ${results.tagged} 条，去重 ${results.deduped} 条`;
                res.json((0, BaseController_1.successResponse)(results));
            }
            catch (error) {
                logger.error('Auto-organize error: ' + error.message);
                res.status(500).json((0, BaseController_1.errorResponse)(error.message));
            }
        }));
        // Get tag statistics
        apiRouter.get('/api/v1/knowledge/tag-stats', (0, middleware_1.asyncHandler)(async (req, res) => {
            const allEntries = await database_1.knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
            const entries = allEntries.items || [];
            const tagMap = new Map();
            for (const entry of entries) {
                const tags = Array.isArray(entry.tags) ? entry.tags : [];
                for (const tag of tags) {
                    tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
                }
            }
            const stats = Array.from(tagMap.entries())
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count);
            res.json((0, BaseController_1.successResponse)({ tags: stats, total: stats.length }));
        }));
        apiRouter.post('/api/v1/learning/feedback', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.submitLearningFeedback(req, res)));
        apiRouter.post('/api/v1/tasks', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.submitTask(req, res)));
        apiRouter.get('/api/v1/tasks/:taskId', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.getTaskStatus(req, res)));
        apiRouter.get('/api/v1/stats', (0, middleware_1.asyncHandler)((req, res) => SkillsController_1.skillsController.getSystemStats(req, res)));
        apiRouter.get('/metrics', (_req, res) => {
            res.set('Content-Type', 'text/plain');
            res.send(metrics_1.metricsCollector.getPrometheusMetrics());
        });
        this.app.use(apiRouter);
        logger.info('Routes setup complete');
    }
    setupErrorHandling() {
        this.app.use(middleware_1.notFoundHandler);
        this.app.use(middleware_1.errorHandler);
        logger.info('Error handling setup complete');
    }
    async initialize() {
        if (this.initialized) {
            logger.warn('System already initialized');
            return;
        }
        logger.info('Initializing OpenClaw Skills System...', { config: this.config });
        try {
            // Initialize memory repository (non-critical, continue if fails)
            try {
                await database_1.memoryRepository.initialize();
                logger.info('Memory repository initialized');
            }
            catch (memErr) {
                logger.warn('Memory repository initialization failed, continuing without it: ' + memErr.message);
            }
            this.initialized = true;
            logger.info('OpenClaw Skills System initialized successfully');
        }
        catch (error) {
            this.initialized = false;
            logger.error('Failed to initialize system: ' + error.message);
            throw error;
        }
    }
    async start() {
        await this.initialize();
        const { port, host } = this.config;
        this.server = this.app.listen(port, host, () => {
            logger.info(`OpenClaw Skills System running at http://${host}:${port}`);
            logger.info(`Environment: ${this.config.env}`);
        });
        this.setupGracefulShutdown();
    }
    setupGracefulShutdown() {
        const shutdown = async (signal) => {
            logger.info(`Received ${signal}, starting graceful shutdown...`);
            if (this.server) {
                this.server.close(() => {
                    logger.info('HTTP server closed');
                });
            }
            this.initialized = false;
            logger.info('Graceful shutdown complete');
            process.exit(0);
        };
        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
    async shutdown() {
        if (!this.initialized) {
            return;
        }
        logger.info('Shutting down OpenClaw Skills System...');
        if (this.server) {
            await new Promise((resolve) => {
                this.server.close(() => resolve());
            });
        }
        this.initialized = false;
        logger.info('OpenClaw Skills System shutdown complete');
    }
}
const system = new OpenClawSkillsSystem();
system.start().catch((error) => {
    logger.error('Failed to start system');
    process.exit(1);
});
exports.default = OpenClawSkillsSystem;
//# sourceMappingURL=index.js.map