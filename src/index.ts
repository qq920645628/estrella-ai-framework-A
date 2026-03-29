import 'reflect-metadata';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import express, { Application, Request, Response, Router } from 'express';
import cors from 'cors';
import { createServer, Server as HTTPServer } from 'http';
import { createLogger } from './common/logger';
import { errorHandler, notFoundHandler, asyncHandler } from './api/middleware';
import { healthController } from './api/HealthController';
import { skillsController } from './api/SkillsController';
import { authMiddleware } from './api/AuthMiddleware';
import { successResponse, errorResponse } from './api/BaseController';
import { memoryRepository, knowledgeRepository } from './core/database';
import { configLoader } from './common/config';
import { metricsCollector } from './common/metrics';

const logger = createLogger('OpenClawSkills');

class OpenClawSkillsSystem {
  private app: Application;
  private server: HTTPServer | null = null;
  private initialized: boolean = false;
  private config = configLoader.getConfig();

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb', reviver: (_key, value) => value }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // 设置 UTF-8 编码
    this.app.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      next();
    });
    
    // Serve static frontend files
    const frontendPath = path.join(__dirname, '..', 'frontend');
    this.app.use(express.static(frontendPath));
    
    // Serve index.html for root path
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    this.app.use((req: Request, _res: Response, next) => {
      const start = Date.now();
      _res.on('finish', () => {
        const duration = Date.now() - start;
        metricsCollector.observe('http_request_duration_ms', duration, {
          method: req.method,
          path: req.path,
          status: _res.statusCode.toString(),
        });
        metricsCollector.incrementCounter('http_requests_total', 1, {
          method: req.method,
          path: req.path,
        });
      });
      next();
    });

    logger.info('Middleware setup complete');
  }

  private setupRoutes(): void {
    const apiRouter = Router();

    apiRouter.get('/health', asyncHandler((req, res) => healthController.getHealth(req, res)));
    apiRouter.get('/ready', asyncHandler((req, res) => healthController.getReadiness(req, res)));
    apiRouter.get('/live', asyncHandler((req, res) => healthController.getLiveness(req, res)));

    apiRouter.post('/api/v1/data/process', asyncHandler((req, res) => skillsController.processData(req, res)));

    apiRouter.post('/api/v1/knowledge/extract', asyncHandler((req, res) => skillsController.extractKnowledge(req, res)));
    apiRouter.post('/api/v1/knowledge/fuse', asyncHandler((req, res) => skillsController.fuseKnowledge(req, res)));
    apiRouter.post('/api/v1/knowledge/entries', asyncHandler((req, res) => skillsController.createKnowledgeEntry(req, res)));
    apiRouter.get('/api/v1/knowledge/search', asyncHandler((req, res) => skillsController.searchKnowledge(req, res)));
    apiRouter.get('/api/v1/knowledge', asyncHandler((req, res) => skillsController.listKnowledge(req, res)));
    apiRouter.get('/api/v1/knowledge/count', asyncHandler((req, res) => skillsController.getKnowledgeCount(req, res)));
    apiRouter.post('/api/v1/knowledge/import-folder', asyncHandler((req, res) => skillsController.importFromFolder(req, res)));
    apiRouter.delete('/api/v1/knowledge/:id', asyncHandler((req, res) => skillsController.deleteKnowledge(req, res)));
    apiRouter.put('/api/v1/knowledge/:id', asyncHandler((req, res) => skillsController.updateKnowledge(req, res)));
    apiRouter.post('/api/v1/knowledge/backup', asyncHandler((req, res) => skillsController.backupKnowledge(req, res)));
    apiRouter.post('/api/v1/knowledge/restore', asyncHandler((req, res) => skillsController.restoreKnowledge(req, res)));
    apiRouter.post('/api/v1/knowledge/upload', asyncHandler((req, res) => skillsController.uploadFile(req, res)));
    apiRouter.get('/api/v1/knowledge/tags', asyncHandler((req, res) => skillsController.getAllTags(req, res)));
    apiRouter.post('/api/v1/knowledge/batch-delete', asyncHandler((req, res) => skillsController.batchDeleteKnowledge(req, res)));
    apiRouter.get('/api/v1/knowledge/export', asyncHandler((req, res) => skillsController.exportKnowledge(req, res)));
    apiRouter.get('/api/v1/knowledge/stats', asyncHandler((req, res) => skillsController.getKnowledgeStats(req, res)));

    // Memory API routes
    apiRouter.get('/api/v1/memory', asyncHandler(async (req, res) => {
      const { type, role, page = '1', pageSize = '50', q } = req.query;
      
      if (q) {
        // Search memories
        const results = await memoryRepository.search(q as string, type as string);
        res.json(successResponse({ items: results, total: results.length, page: 1, pageSize: results.length }));
      } else if (role) {
        // Filter by role
        const result = await memoryRepository.findByRole(role as string, { page: parseInt(page as string), pageSize: parseInt(pageSize as string) });
        res.json(successResponse(result));
      } else if (type) {
        // Filter by type
        const result = await memoryRepository.findByType(type as string, { page: parseInt(page as string), pageSize: parseInt(pageSize as string) });
        res.json(successResponse(result));
      } else {
        // List all
        const result = await memoryRepository.findAll({ page: parseInt(page as string), pageSize: parseInt(pageSize as string) });
        res.json(successResponse(result));
      }
    }));
    
    apiRouter.get('/api/v1/memory/count', asyncHandler(async (req, res) => {
      const { type, role } = req.query;
      let count: number;
      if (role) {
        count = await memoryRepository.countByRole(role as string);
      } else if (type) {
        count = await memoryRepository.countByType(type as string);
      } else {
        count = await memoryRepository.count();
      }
      res.json(successResponse({ count, type: type || 'all', role: role || null }));
    }));
    
    apiRouter.post('/api/v1/memory', asyncHandler(async (req, res) => {
      const { content, memoryType, role, speaker, keywords, metadata } = req.body;
      if (!content || !memoryType) {
        res.status(400).json(errorResponse('content and memoryType are required'));
        return;
      }
      const entry = await memoryRepository.create({ content, memoryType, role, speaker, keywords, metadata });
      res.json(successResponse(entry));
    }));

    // Auto-record conversation messages (batch)
    apiRouter.post('/api/v1/memory/auto-record', asyncHandler(async (req, res) => {
      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json(errorResponse('messages array is required'));
        return;
      }
      
      const results = [];
      for (const msg of messages) {
        const { content, role } = msg;
        if (content && role) {
          const entry = await memoryRepository.create({
            content,
            memoryType: 'episodic',
            role: role === 'user' ? 'user' : role === 'assistant' ? 'assistant' : 'system'
          });
          results.push(entry);
        }
      }
      
      res.json(successResponse({ recorded: results.length, messages: results }));
    }));
    
    apiRouter.put('/api/v1/memory/:id', asyncHandler(async (req, res) => {
      const { id } = req.params;
      const { content, memoryType, role, speaker, keywords, metadata } = req.body;
      const entry = await memoryRepository.update(id, { content, memoryType, role, speaker, keywords, metadata });
      res.json(successResponse(entry));
    }));
    
    apiRouter.delete('/api/v1/memory/:id', asyncHandler(async (req, res) => {
      const { id } = req.params;
      const deleted = await memoryRepository.delete(id);
      res.json(successResponse({ deleted, id }));
    }));
    
    apiRouter.delete('/api/v1/memory', asyncHandler(async (req, res) => {
      const { type } = req.query;
      if (!type) {
        res.status(400).json(errorResponse('type query parameter is required'));
        return;
      }
      const deleted = await memoryRepository.clearByType(type as string);
      res.json(successResponse({ deleted, type }));
    }));

    // Auto-organize knowledge
    apiRouter.post('/api/v1/knowledge/auto-organize', asyncHandler(async (req, res) => {
      const { mode } = req.query;
      const organizeMode = (mode as string) || 'all'; // 'tag', 'dedup', 'cluster', 'all'
      
      try {
        const allEntries = await knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
        const entries = allEntries.items || [];
        let results = { tagged: 0, deduped: 0, clustered: 0, message: '' };
        
        // Auto-tagging: extract keywords from content
        if (organizeMode === 'tag' || organizeMode === 'all') {
          for (const entry of entries) {
            try {
              const words = String(entry.content).split(/[,，.。!?！？\s]+/).filter((w: string) => w.length > 2);
              const uniqueTags = [...new Set(words.slice(0, 5))];
              const existingTags = Array.isArray(entry.tags) ? entry.tags : [];
              const newTags = [...new Set([...existingTags, ...uniqueTags])];
              if (newTags.length > existingTags.length) {
                await knowledgeRepository.update(entry.id, { tags: newTags });
                results.tagged++;
              }
            } catch (e) { /* skip failed entries */ }
          }
        }
        
        // Deduplication
        if (organizeMode === 'dedup' || organizeMode === 'all') {
          const contentMap = new Map();
          const toDelete: string[] = [];
          for (const entry of entries) {
            const normalized = String(entry.content).toLowerCase().trim();
            if (contentMap.has(normalized)) {
              toDelete.push(entry.id);
            } else {
              contentMap.set(normalized, entry.id);
            }
          }
          for (const id of toDelete) {
            try {
              await knowledgeRepository.delete(id);
              results.deduped++;
            } catch (e) { /* skip failed deletes */ }
          }
        }
        
        results.message = `整理完成：自动标签 ${results.tagged} 条，去重 ${results.deduped} 条`;
        res.json(successResponse(results));
      } catch (error: any) {
        logger.error('Auto-organize error: ' + error.message);
        res.status(500).json(errorResponse(error.message));
      }
    }));

    // Get tag statistics
    apiRouter.get('/api/v1/knowledge/tag-stats', asyncHandler(async (req, res) => {
      const allEntries = await knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
      const entries = allEntries.items || [];
      const tagMap = new Map<string, number>();
      
      for (const entry of entries) {
        const tags = Array.isArray(entry.tags) ? entry.tags : [];
        for (const tag of tags) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
      }
      
      const stats = Array.from(tagMap.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count);
      
      res.json(successResponse({ tags: stats, total: stats.length }));
    }));

    apiRouter.post('/api/v1/learning/feedback', asyncHandler((req, res) => skillsController.submitLearningFeedback(req, res)));

    apiRouter.post('/api/v1/tasks', asyncHandler((req, res) => skillsController.submitTask(req, res)));
    apiRouter.get('/api/v1/tasks/:taskId', asyncHandler((req, res) => skillsController.getTaskStatus(req, res)));

    apiRouter.get('/api/v1/stats', asyncHandler((req, res) => skillsController.getSystemStats(req, res)));

    apiRouter.get('/metrics', (_req: Request, res: Response) => {
      res.set('Content-Type', 'text/plain');
      res.send(metricsCollector.getPrometheusMetrics());
    });

    this.app.use(apiRouter);

    logger.info('Routes setup complete');
  }

  private setupErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
    logger.info('Error handling setup complete');
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      logger.warn('System already initialized');
      return;
    }

    logger.info('Initializing OpenClaw Skills System...', { config: this.config });

    try {
      // Initialize memory repository (non-critical, continue if fails)
      try {
        await memoryRepository.initialize();
        logger.info('Memory repository initialized');
      } catch (memErr: any) {
        logger.warn('Memory repository initialization failed, continuing without it: ' + memErr.message);
      }
      
      this.initialized = true;
      logger.info('OpenClaw Skills System initialized successfully');
    } catch (error: any) {
      this.initialized = false;
      logger.error('Failed to initialize system: ' + error.message);
      throw error;
    }
  }

  public async start(): Promise<void> {
    await this.initialize();

    const { port, host } = this.config;

    this.server = this.app.listen(port, host, () => {
      logger.info(`OpenClaw Skills System running at http://${host}:${port}`);
      logger.info(`Environment: ${this.config.env}`);
    });

    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
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

  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    logger.info('Shutting down OpenClaw Skills System...');

    if (this.server) {
      await new Promise<void>((resolve) => {
        this.server!.close(() => resolve());
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

export default OpenClawSkillsSystem;
