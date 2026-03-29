import { Request, Response } from 'express';
import { BaseController, successResponse, errorResponse } from './BaseController';
import { dataInputService, RawData, DataFormat, DataSourceType } from '@core/data_input';
import { knowledgeExtractionService, ExtractionResult } from '@core/knowledge';
import { knowledgeFusionService, KnowledgeEntry } from '@core/knowledge';
import { knowledgeRepository } from '@core/database';
import { retrievalService, QueryContext, RetrievalResult } from '@core/retrieval';
import { learningControlService, LearningFeedback, LearningFeedbackType } from '@core/learning';
import { taskScheduler, Task, TaskType, TaskPriority, TaskStatus } from '@core/scheduling';
import { KnowledgeEntryType, EntityStatus } from '@common/types';
import { AppError, ErrorCode } from '@common/errors';
import { isOk, isErr, Result } from '@common/utils';

// Helper to extract error from Result
function getResultError<T, E>(result: Result<T, E>): E | undefined {
  return isErr(result) ? result.error : undefined;
}

class SkillsController extends BaseController {
  public async processData(req: Request, res: Response): Promise<void> {
    try {
      const { content, format, source, metadata } = req.body;

      const rawData: RawData = {
        id: `data_${Date.now()}`,
        content: content || '',
        format: format || DataFormat.TEXT,
        source: source || DataSourceType.API,
        metadata: metadata || {},
        receivedAt: new Date(),
        size: content ? content.length : 0,
      };

      const result = await dataInputService.process(rawData);

      if (!result.success) {
        res.status(400).json(errorResponse(getResultError(result)!));
        return;
      }

      res.json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async extractKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { text, context } = req.body;

      if (!text) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Text is required', 400);
      }

      const result = await knowledgeExtractionService.extract(text, context);

      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)!));
        return;
      }

      res.json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async fuseKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { entries } = req.body;

      if (!entries || !Array.isArray(entries)) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Entries array is required', 400);
      }

      const result = await knowledgeFusionService.fuseEntries(entries);

      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)!));
        return;
      }

      // 保存融合后的条目到数据库
      const savedEntries = [];
      for (const entry of result.data) {
        const saved = await knowledgeRepository.create(entry);
        savedEntries.push(saved);
      }

      res.json(successResponse({ fusedEntries: savedEntries }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async createKnowledgeEntry(req: Request, res: Response): Promise<void> {
    try {
      const { content, type, entities, relations, tags, source } = req.body;

      const entry = await knowledgeRepository.create({
        content,
        type: type || KnowledgeEntryType.DOCUMENT,
        entities: entities || [],
        relations: relations || [],
        confidence: 1.0,
        source: source || 'api',
        tags: tags || [],
        status: EntityStatus.ACTIVE,
        version: 1,
      });

      if (entities && entities.length > 0) {
        await knowledgeFusionService.addToGraph(entities, relations || []);
      }

      res.status(201).json(successResponse(entry));
    } catch (error) {
      const appError = error as AppError;
      if (appError.code === ErrorCode.ALREADY_EXISTS) {
        res.status(409).json(errorResponse(appError));
        return;
      }
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async searchKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { query, limit: queryLimit, filters: queryFilters } = req.query;

      if (!query) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Query is required', 400);
      }

      const useVector = (req.query.useVector === 'true') || process.env.ENABLE_VECTOR_SEARCH === 'true';
      const limit = req.query.limit || queryLimit || 10;

      const context: QueryContext = {
        query: query as string,
        limit: parseInt(limit as string, 10),
        filters: queryFilters ? JSON.parse(queryFilters as string) : undefined,
        useVector: useVector,
      };

      const result = await retrievalService.retrieve(context);

      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)!));
        return;
      }

      res.json(successResponse({
        results: result.data,
        query: context.query,
        count: result.data?.length || 0,
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async submitLearningFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { taskId, query, retrievedIds, selectedId, relevanceScore, feedback } = req.body;

      if (!taskId || !feedback) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'taskId and feedback are required', 400);
      }

      const feedbackData: LearningFeedback = {
        taskId,
        query: query || '',
        retrievedIds: retrievedIds || [],
        selectedId,
        relevanceScore,
        feedback: feedback as LearningFeedbackType,
      };

      const result = await learningControlService.recordFeedback(feedbackData);

      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)!));
        return;
      }

      res.json(successResponse({ message: 'Feedback recorded successfully' }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async submitTask(req: Request, res: Response): Promise<void> {
    try {
      const { type, priority, input, dependencies, maxRetries } = req.body;

      if (!type) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Task type is required', 400);
      }

      const taskData = {
        type: type as TaskType,
        priority: (priority as TaskPriority) || TaskPriority.NORMAL,
        input: input || {},
        dependencies: dependencies || [],
        maxRetries: maxRetries || 3,
        scheduledAt: new Date(),
        metadata: {},
        version: 1,
      };

      const result = await taskScheduler.submitTask(taskData);

      if (!result.success) {
        res.status(500).json(errorResponse(getResultError(result)!));
        return;
      }

      res.status(201).json(successResponse(result.data));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async getTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      const task = await taskScheduler.getTask(taskId);

      if (!task) {
        throw new AppError(ErrorCode.NOT_FOUND, 'Task not found', 404);
      }

      res.json(successResponse(task));
    } catch (error) {
      const appError = error as AppError;
      if (appError.code === ErrorCode.NOT_FOUND) {
        res.status(404).json(errorResponse(appError));
        return;
      }
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async getSystemStats(req: Request, res: Response): Promise<void> {
    try {
      const [inputStats, extractionCache, graphStats, retrievalStats, schedulerMetrics] = await Promise.all([
        Promise.resolve(dataInputService.getStatistics()),
        Promise.resolve(knowledgeExtractionService.getCacheStats()),
        Promise.resolve(knowledgeFusionService.getStatistics()),
        Promise.resolve(retrievalService.getStatistics()),
        Promise.resolve(taskScheduler.getMetrics()),
      ]);

      res.json(successResponse({
        dataInput: inputStats,
        knowledgeExtraction: extractionCache,
        knowledgeGraph: graphStats,
        retrieval: retrievalStats,
        scheduler: schedulerMetrics,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async listKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { limit, offset } = req.query;
      const limitNum = limit ? parseInt(limit as string, 10) : 50;
      const offsetNum = offset ? parseInt(offset as string, 10) : 0;

      const result = await knowledgeRepository.findAll({ page: Math.floor(offsetNum / limitNum) + 1, pageSize: limitNum });
      
      res.json(successResponse({ entries: result.items, total: result.total }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async getKnowledgeCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await knowledgeRepository.count();
      res.json(successResponse({ count }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async deleteKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'ID is required' }));
        return;
      }

      const deleted = await knowledgeRepository.delete(id);
      
      if (deleted) {
        res.json(successResponse({ deleted: true, id }));
      } else {
        res.status(404).json(errorResponse({ code: 'NOT_FOUND', message: 'Knowledge entry not found' }));
      }
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  public async updateKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content, tags, source, type, status } = req.body;
      
      if (!id) {
        res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'ID is required' }));
        return;
      }

      const updateData: any = {};
      if (content !== undefined) updateData.content = content;
      if (tags !== undefined) updateData.tags = tags;
      if (source !== undefined) updateData.source = source;
      if (type !== undefined) updateData.type = type;
      if (status !== undefined) updateData.status = status;

      const updated = await knowledgeRepository.update(id, updateData);
      res.json(successResponse({ updated: true, entry: updated }));
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        res.status(404).json(errorResponse({ code: 'NOT_FOUND', message: 'Knowledge entry not found' }));
      } else {
        res.status(500).json(this.handleError(error as Error));
      }
    }
  }

  public async importFromFolder(req: Request, res: Response): Promise<void> {
    try {
      const { folderPath, source } = req.body;
      
      if (!folderPath) {
        res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'folderPath is required' }));
        return;
      }

      const fs = require('fs');
      const path = require('path');
      
      // 检查目录是否存在
      if (!fs.existsSync(folderPath)) {
        res.status(400).json(errorResponse({ code: 'NOT_FOUND', message: 'Folder not found' }));
        return;
      }

      const supportedExtensions = ['.txt', '.md', '.json', '.csv', '.html', '.xml', '.pdf', '.docx', '.xlsx'];
      const imported: string[] = [];
      const errors: string[] = [];

      // 递归扫描文件夹
      async function scanDir(dir: string) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            await scanDir(fullPath);
          } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (supportedExtensions.includes(ext)) {
              await processFile(fullPath);
            }
          }
        }
      }

      // 处理单个文件
      async function processFile(filePath: string) {
        try {
          let content = fs.readFileSync(filePath, 'utf-8');
          const ext = path.extname(filePath).toLowerCase();
          
          // 提取纯文本
          if (ext === '.html' || ext === '.xml') {
            content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s+/g, ' ').trim();
          }
          
          // 解析 JSON - 支持多种结构
          if (ext === '.json') {
            try {
              const data = JSON.parse(content);
              
              // 提取所有可能的文本内容
              const extractText = (obj: any): string[] => {
                const texts: string[] = [];
                if (typeof obj === 'string') {
                  texts.push(obj);
                } else if (Array.isArray(obj)) {
                  for (const item of obj) {
                    texts.push(...extractText(item));
                  }
                } else if (obj && typeof obj === 'object') {
                  for (const key of Object.keys(obj)) {
                    const val = obj[key];
                    // 跳过非文本字段
                    if (['id', 'uuid', 'date', 'timestamp', 'createdAt', 'updatedAt'].includes(key)) continue;
                    texts.push(...extractText(val));
                  }
                }
                return texts;
              };
              
              const extracted = extractText(data).filter(t => t && t.length > 10);
              if (extracted.length > 0) {
                content = extracted.join('\n\n');
              }
            } catch {}
          }
          
          // 解析 CSV
          if (ext === '.csv') {
            const lines = content.split('\n').filter((l: string) => l.trim());
            if (lines.length > 1) {
              content = lines.slice(1).map((line: string) => line.split(',')[0]).filter(Boolean).join('\n');
            }
          }

          // 解析 PDF
          if (ext === '.pdf') {
            try {
              const pdfParse = require('pdf-parse');
              const pdfBuffer = fs.readFileSync(filePath);
              const pdfData = await pdfParse(pdfBuffer);
              content = pdfData.text || '';
            } catch (e) {
              errors.push(`${filePath}: PDF 解析失败 - ${(e as Error).message}`);
              content = '';
            }
          }

          // 解析 Word (.docx)
          if (ext === '.docx') {
            try {
              const mammoth = require('mammoth');
              const result = await mammoth.extractRawText({ path: filePath });
              content = result.value || '';
            } catch (e) {
              errors.push(`${filePath}: Word 解析失败 - ${(e as Error).message}`);
              content = '';
            }
          }

          // 解析 Excel (.xlsx)
          if (ext === '.xlsx') {
            try {
              const XLSX = require('xlsx');
              const workbook = XLSX.readFile(filePath);
              let texts: string[] = [];
              for (const sheetName of workbook.SheetNames) {
                const sheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(sheet);
                for (const row of data) {
                  for (const val of Object.values(row)) {
                    if (val && typeof val === 'string') texts.push(val);
                    else if (val) texts.push(String(val));
                  }
                }
              }
              content = texts.join('\n');
            } catch (e) {
              errors.push(`${filePath}: Excel 解析失败 - ${(e as Error).message}`);
              content = '';
            }
          }

          if (content && content.trim().length > 5) {
            // 导入到知识库
            knowledgeRepository.create({
              content: content.trim().substring(0, 10000),
              type: 'DOCUMENT',
              source: source || 'folder-import',
              tags: [ext.slice(1).toUpperCase()],
              status: 'ACTIVE',
              confidence: 1,
              entities: [],
              relations: []
            } as any).then(() => {
              imported.push(filePath);
            }).catch((err: Error) => {
              errors.push(`${filePath}: ${err.message}`);
            });
          }
        } catch (err: any) {
          errors.push(`${filePath}: ${err.message}`);
        }
      }

      await scanDir(folderPath);
      
      // 等待一下让异步操作完成
      setTimeout(() => {
        res.json(successResponse({
          imported: imported.length,
          errors: errors.length,
          details: { imported, errors }
        }));
      }, 500);
      
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 备份知识库
  public async backupKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const fs = require('fs');
      const path = require('path');
      
      const entries = await knowledgeRepository.findAll({ page: 1, pageSize: 10000 });
      
      const backup = {
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        count: entries.total,
        entries: entries.items
      };
      
      // 创建备份目录
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      // 生成文件名
      const fileName = `knowledge-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
      const filePath = path.join(backupDir, fileName);
      
      fs.writeFileSync(filePath, JSON.stringify(backup, null, 2), 'utf-8');
      
      res.json(successResponse({
        backup: true,
        filePath: filePath,
        count: entries.total,
        timestamp: backup.timestamp
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 恢复知识库
  public async restoreKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { filePath } = req.body;
      const fs = require('fs');
      
      if (!filePath) {
        res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'filePath is required' }));
        return;
      }

      if (!fs.existsSync(filePath)) {
        res.status(404).json(errorResponse({ code: 'NOT_FOUND', message: 'Backup file not found' }));
        return;
      }

      const backupData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      if (!backupData.entries || !Array.isArray(backupData.entries)) {
        res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'Invalid backup file format' }));
        return;
      }

      let imported = 0;
      let failed = 0;

      for (const entry of backupData.entries) {
        try {
          await knowledgeRepository.create({
            content: entry.content,
            type: entry.type || 'DOCUMENT',
            source: entry.source || 'restore',
            tags: entry.tags || [],
            status: entry.status || 'ACTIVE',
            confidence: entry.confidence || 1,
            entities: entry.entities || [],
            relations: entry.relations || []
          } as any);
          imported++;
        } catch (e) {
          failed++;
        }
      }

      res.json(successResponse({
        restored: true,
        imported,
        failed,
        total: backupData.entries.length
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 上传文件
  public async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      // 检查是否有文件上传
      const contentType = req.headers['content-type'] || '';
      
      if (!contentType.includes('multipart/form-data')) {
        // 尝试从 body 读取内容
        const { content, fileName, source } = req.body;
        
        if (!content) {
          res.status(400).json(errorResponse({ code: 'VALIDATION_ERROR', message: 'No file content provided' }));
          return;
        }

        // 处理上传的内容
        const ext = fileName ? fileName.split('.').pop()?.toLowerCase() : 'txt';
        
        let processedContent = content;
        
        // 根据扩展名处理内容
        if (ext === 'html') {
          processedContent = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ').trim();
        } else if (ext === 'json') {
          try {
            const data = JSON.parse(content);
            const extractText = (obj: any): string[] => {
              const texts: string[] = [];
              if (typeof obj === 'string') texts.push(obj);
              else if (Array.isArray(obj)) obj.forEach((item: any) => texts.push(...extractText(item)));
              else if (obj && typeof obj === 'object') {
                Object.keys(obj).forEach(key => {
                  if (!['id', 'uuid', 'date'].includes(key)) texts.push(...extractText(obj[key]));
                });
              }
              return texts;
            };
            const extracted = extractText(data).filter((t: string) => t && t.length > 10);
            if (extracted.length > 0) processedContent = extracted.join('\n\n');
          } catch {}
        }

        const entry = await knowledgeRepository.create({
          content: processedContent.substring(0, 10000),
          type: 'DOCUMENT',
          source: source || 'file-upload',
          tags: [ext || 'UPLOAD'],
          status: 'ACTIVE',
          confidence: 1,
          entities: [],
          relations: []
        } as any);

        res.json(successResponse({
          uploaded: true,
          entry,
          originalName: fileName
        }));
        return;
      }

      res.status(400).json(errorResponse({ code: 'NOT_SUPPORTED', message: 'Multipart upload not implemented yet. Send file content as JSON.' }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 获取所有标签
  public async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
      const entries = result.items || [];
      const tagSet = new Set<string>();
      
      entries.forEach(entry => {
        if (entry.tags && Array.isArray(entry.tags)) {
          entry.tags.forEach((tag: string) => tagSet.add(tag));
        } else if (entry.tags && typeof entry.tags === 'string') {
          entry.tags.split(',').forEach((tag: string) => tagSet.add(tag.trim()));
        }
      });

      const tags = Array.from(tagSet).sort();
      res.json(successResponse({ tags, count: tags.length }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 批量删除知识
  public async batchDeleteKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'ids array is required', 400);
      }

      const deleted = [];
      const failed = [];
      
      for (const id of ids) {
        try {
          await knowledgeRepository.delete(id);
          deleted.push(id);
        } catch (e) {
          failed.push(id);
        }
      }

      res.json(successResponse({ deleted: deleted.length, failed: failed.length, ids: deleted }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 导出知识
  public async exportKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const { format = 'json' } = req.query;
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
      const entries = result.items || [];
      
      if (format === 'markdown') {
        let md = '# 知识库导出\n\n';
        entries.forEach((entry, i) => {
          md += `## ${i + 1}. ${entry.source || 'Untitled'}\n\n`;
          md += `${entry.content}\n\n`;
          if (entry.tags && entry.tags.length > 0) {
            md += `**标签**: ${Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags}\n\n`;
          }
          md += `---\n\n`;
        });
        
        res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=knowledge-export-${Date.now()}.md`);
        res.send(md);
        return;
      }
      
      res.json(successResponse({
        exportDate: new Date().toISOString(),
        count: entries.length,
        entries: entries.map(e => ({
          id: e.id,
          content: e.content,
          type: e.type,
          source: e.source,
          tags: e.tags,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt
        }))
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }

  // 获取知识统计
  public async getKnowledgeStats(req: Request, res: Response): Promise<void> {
    try {
      const result = await knowledgeRepository.findAll({ page: 1, pageSize: 1000 });
      const entries = result.items || [];
      
      const typeCount: Record<string, number> = {};
      const sourceCount: Record<string, number> = {};
      const tagCount: Record<string, number> = {};
      const dateCount: Record<string, number> = {};
      
      entries.forEach(entry => {
        const type = entry.type || 'UNKNOWN';
        typeCount[type] = (typeCount[type] || 0) + 1;
        
        const source = entry.source || 'unknown';
        sourceCount[source] = (sourceCount[source] || 0) + 1;
        
        const tags = Array.isArray(entry.tags) ? entry.tags : (entry.tags ? [entry.tags] : []);
        tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          }
        });
        
        const date = entry.createdAt ? new Date(entry.createdAt).toISOString().split('T')[0] : 'unknown';
        dateCount[date] = (dateCount[date] || 0) + 1;
      });

      const topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count }));

      res.json(successResponse({
        total: entries.length,
        byType: typeCount,
        bySource: sourceCount,
        byTag: tagCount,
        byDate: dateCount,
        topTags,
        avgContentLength: entries.reduce((sum, e) => sum + (e.content?.length || 0), 0) / (entries.length || 1)
      }));
    } catch (error) {
      res.status(500).json(this.handleError(error as Error));
    }
  }
}

export const skillsController = new SkillsController();

export default SkillsController;
