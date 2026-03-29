import { createLogger } from '@common/logger';
import {
  DatabaseError,
  ValidationError,
  NotFoundError,
  AlreadyExistsError,
} from '@common/errors';
import {
  Entity,
  AuditableEntity,
  EntityStatus,
  KnowledgeEntry,
  PaginationParams,
  PaginatedResult,
  SystemMetrics,
} from '@common/types';
import { Result, ok, err, generateId, paginate } from '@common/utils';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

export interface DatabaseConfig {
  path: string;
  maxConnections: number;
  timeoutMs: number;
  enableWAL: boolean;
  enableCache: boolean;
  cacheSize: number;
  enableEncryption: boolean;
  encryptionKey?: string;
}

export interface IndexConfig {
  name: string;
  fields: string[];
  unique: boolean;
  sparse: boolean;
}

const DEFAULT_CONFIG: DatabaseConfig = {
  path: './data/skills.db',
  maxConnections: 10,
  timeoutMs: 5000,
  enableWAL: true,
  enableCache: true,
  cacheSize: 1000,
  enableEncryption: false,
};

export abstract class BaseRepository<T extends Entity> {
  protected readonly logger = createLogger(this.constructor.name);
  protected config: DatabaseConfig;
  protected cache: Map<string, T> = new Map();
  protected initialized: boolean = false;

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  public abstract initialize(): Promise<void>;
  public abstract shutdown(): Promise<void>;
  public abstract create(entity: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
  public abstract findById(id: string): Promise<T | null>;
  public abstract update(id: string, entity: Partial<T>): Promise<T>;
  public abstract delete(id: string): Promise<boolean>;
  public abstract findAll(pagination?: PaginationParams): Promise<PaginatedResult<T>>;

  protected getCached(id: string): T | null {
    return this.cache.get(id) || null;
  }

  protected setCached(entity: T): void {
    if (this.config.enableCache) {
      if (this.cache.size >= this.config.cacheSize) {
        const firstKey = this.cache.keys().next().value;
        if (firstKey) this.cache.delete(firstKey);
      }
      this.cache.set(entity.id, entity);
    }
  }

  protected invalidateCache(id: string): void {
    this.cache.delete(id);
  }

  protected clearCache(): void {
    this.cache.clear();
  }

  public getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.cacheSize,
    };
  }
}

export class KnowledgeRepository extends BaseRepository<KnowledgeEntry> {
  private db!: Database.Database;
  private entityIndex: Map<string, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.logger.info('Initializing KnowledgeRepository', { path: this.config.path });

    // 确保目录存在
    const dbDir = path.dirname(this.config.path);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // 打开或创建 SQLite 数据库
    this.db = new Database(this.config.path);
    this.db.pragma('encoding = "UTF-8"');
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');

    // 创建表
    this.createTables();

    // 加载数据到缓存
    this.loadFromDatabase();

    this.initialized = true;
    this.logger.info('KnowledgeRepository initialized successfully', { entries: this.cache.size });
  }

  private createTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS knowledge_entries (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'DOCUMENT',
        entities TEXT DEFAULT '[]',
        relations TEXT DEFAULT '[]',
        confidence REAL DEFAULT 1.0,
        source TEXT DEFAULT 'unknown',
        tags TEXT DEFAULT '[]',
        status TEXT DEFAULT 'ACTIVE',
        version INTEGER DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_knowledge_content ON knowledge_entries(content);
      CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge_entries(status);
      CREATE INDEX IF NOT EXISTS idx_knowledge_source ON knowledge_entries(source);
    `);
    this.logger.info('Database tables created');
  }

  private loadFromDatabase(): void {
    const rows = this.db.prepare('SELECT * FROM knowledge_entries').all() as any[];
    
    for (const row of rows) {
      const entry: KnowledgeEntry = {
        id: row.id,
        content: row.content,
        type: row.type as any,
        entities: JSON.parse(row.entities || '[]'),
        relations: JSON.parse(row.relations || '[]'),
        confidence: row.confidence,
        source: row.source,
        tags: JSON.parse(row.tags || '[]'),
        status: row.status as any,
        version: row.version,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      };
      
      this.cache.set(entry.id, entry);
      this.updateIndexes(entry);
    }
    
    this.logger.info('Loaded entries from database', { count: rows.length });
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down KnowledgeRepository');
    this.clearCache();
    this.entityIndex.clear();
    this.tagIndex.clear();
    
    if (this.db) {
      this.db.close();
    }
    
    this.initialized = false;
    this.logger.info('KnowledgeRepository shutdown complete');
  }

  private rowToEntry(row: any): KnowledgeEntry {
    return {
      id: row.id,
      content: row.content,
      type: row.type,
      entities: JSON.parse(row.entities || '[]'),
      relations: JSON.parse(row.relations || '[]'),
      confidence: row.confidence,
      source: row.source,
      tags: JSON.parse(row.tags || '[]'),
      status: row.status,
      version: row.version,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  public async create(entityData: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<KnowledgeEntry> {
    await this.ensureInitialized();

    const existing = await this.findByContent(entityData.content);
    if (existing) {
      throw new AlreadyExistsError('KnowledgeEntry', entityData.content.substring(0, 50));
    }

    const now = new Date();
    const entity: KnowledgeEntry = {
      ...entityData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    } as KnowledgeEntry;

    // 插入数据库
    const stmt = this.db.prepare(`
      INSERT INTO knowledge_entries (id, content, type, entities, relations, confidence, source, tags, status, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      entity.id,
      entity.content,
      entity.type || 'DOCUMENT',
      JSON.stringify(entity.entities || []),
      JSON.stringify(entity.relations || []),
      entity.confidence || 1.0,
      entity.source || 'unknown',
      JSON.stringify(entity.tags || []),
      entity.status || 'ACTIVE',
      entity.version || 1,
      entity.createdAt.toISOString(),
      entity.updatedAt.toISOString()
    );

    this.updateIndexes(entity);
    this.setCached(entity);

    this.logger.debug('Created knowledge entry', { id: entity.id });
    return entity;
  }

  public async findById(id: string): Promise<KnowledgeEntry | null> {
    await this.ensureInitialized();

    const cached = this.getCached(id);
    if (cached) {
      return cached;
    }

    const row = this.db.prepare('SELECT * FROM knowledge_entries WHERE id = ?').get(id) as any;
    if (!row) {
      return null;
    }

    const entry = this.rowToEntry(row);
    this.setCached(entry);
    return entry;
  }

  public async update(id: string, updateData: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> {
    await this.ensureInitialized();

    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError('KnowledgeEntry', id);
    }

    const updated: KnowledgeEntry = {
      ...existing,
      ...updateData,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
      version: existing.version + 1,
    } as KnowledgeEntry;

    const stmt = this.db.prepare(`
      UPDATE knowledge_entries 
      SET content = ?, type = ?, entities = ?, relations = ?, confidence = ?, source = ?, tags = ?, status = ?, version = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updated.content,
      updated.type,
      JSON.stringify(updated.entities || []),
      JSON.stringify(updated.relations || []),
      updated.confidence,
      updated.source,
      JSON.stringify(updated.tags || []),
      updated.status,
      updated.version,
      updated.updatedAt.toISOString(),
      id
    );

    this.rebuildIndexes();
    this.setCached(updated);

    this.logger.debug('Updated knowledge entry', { id });
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();

    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    this.db.prepare('DELETE FROM knowledge_entries WHERE id = ?').run(id);
    this.invalidateCache(id);
    this.rebuildIndexes();

    this.logger.debug('Deleted knowledge entry', { id });
    return true;
  }

  public async findAll(pagination?: PaginationParams): Promise<PaginatedResult<KnowledgeEntry>> {
    await this.ensureInitialized();

    const entries = Array.from(this.cache.values());
    const total = entries.length;

    if (!pagination) {
      return {
        items: entries,
        total,
        page: 1,
        pageSize: total,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }

    const sorted = entries.sort((a, b) =>
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    return paginate(sorted, total, pagination);
  }

  public async findByContent(content: string): Promise<KnowledgeEntry | null> {
    await this.ensureInitialized();

    const normalizedContent = content.toLowerCase().trim();
    for (const entry of this.cache.values()) {
      if (entry.content.toLowerCase().trim() === normalizedContent) {
        return entry;
      }
    }
    return null;
  }

  public async findByEntityType(entityType: string): Promise<KnowledgeEntry[]> {
    await this.ensureInitialized();

    const entryIds = this.entityIndex.get(entityType);
    if (!entryIds) {
      return [];
    }

    const entries: KnowledgeEntry[] = [];
    for (const id of entryIds) {
      const entry = await this.findById(id);
      if (entry) {
        entries.push(entry);
      }
    }
    return entries;
  }

  public async findByTag(tag: string): Promise<KnowledgeEntry[]> {
    await this.ensureInitialized();

    const entryIds = this.tagIndex.get(tag.toLowerCase());
    if (!entryIds) {
      return [];
    }

    const entries: KnowledgeEntry[] = [];
    for (const id of entryIds) {
      const entry = await this.findById(id);
      if (entry) {
        entries.push(entry);
      }
    }
    return entries;
  }

  public async findByStatus(status: EntityStatus): Promise<KnowledgeEntry[]> {
    await this.ensureInitialized();

    const entries: KnowledgeEntry[] = [];
    for (const entry of this.cache.values()) {
      if (entry.status === status) {
        entries.push(entry);
      }
    }
    return entries;
  }

  public async searchByContent(query: string, limit: number = 10): Promise<KnowledgeEntry[]> {
    await this.ensureInitialized();

    // 预处理查询 - 支持中英文
    const normalizedQuery = query.toLowerCase().trim();
    const results: Array<{ entry: KnowledgeEntry; score: number }> = [];

    for (const entry of this.cache.values()) {
      // 预处理内容 - 支持中英文
      const content = entry.content.toLowerCase();
      const score = this.calculateRelevanceScore(content, normalizedQuery);

      if (score > 0.01) {
        results.push({ entry, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map((r) => r.entry);
  }

  private calculateRelevanceScore(content: string, query: string): number {
    // 支持中英文分词
    const queryTerms = query.split(/[\s,，、.。]+/).filter(t => t.length > 0);
    let score = 0;

    // 如果是中文查询，直接匹配子串
    const isChinese = /[\u4e00-\u9fa5]/.test(query);
    
    for (const term of queryTerms) {
      // 完全包含匹配
      if (content.includes(term)) {
        score += 0.5;
      }
      
      const regex = new RegExp(this.escapeRegex(term), 'gi');
      const matches = content.match(regex);
      if (matches) {
        score += matches.length * 0.1;
      }
    }

    // 中文查询额外的模糊匹配
    if (isChinese) {
      // 提取中文字符进行比较
      const contentChinese = content.replace(/[^\u4e00-\u9fa5]/g, '');
      const queryChinese = query.replace(/[^\u4e00-\u9fa5]/g, '');
      
      if (contentChinese.includes(queryChinese)) {
        score += 0.8;
      }
      
      // 包含任意一个中文字符
      for (const char of queryChinese) {
        if (contentChinese.includes(char)) {
          score += 0.05;
        }
      }
    }

    return Math.min(score, 1.0);
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  public async count(): Promise<number> {
    await this.ensureInitialized();
    return this.cache.size;
  }

  public async countByStatus(): Promise<Record<EntityStatus, number>> {
    await this.ensureInitialized();

    const counts: Record<EntityStatus, number> = {
      [EntityStatus.ACTIVE]: 0,
      [EntityStatus.INACTIVE]: 0,
      [EntityStatus.DELETED]: 0,
      [EntityStatus.PENDING]: 0,
    };

    for (const entry of this.cache.values()) {
      counts[entry.status]++;
    }

    return counts;
  }

  private updateIndexes(entity: KnowledgeEntry): void {
    for (const entity2 of entity.entities || []) {
      const ids = this.entityIndex.get(entity2.type) || new Set();
      ids.add(entity.id);
      this.entityIndex.set(entity2.type, ids);
    }

    for (const tag of entity.tags || []) {
      const normalizedTag = tag.toLowerCase();
      const ids = this.tagIndex.get(normalizedTag) || new Set();
      ids.add(entity.id);
      this.tagIndex.set(normalizedTag, ids);
    }
  }

  private rebuildIndexes(): void {
    this.entityIndex.clear();
    this.tagIndex.clear();

    for (const entity of this.cache.values()) {
      this.updateIndexes(entity);
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      throw new DatabaseError('Repository not initialized. Call initialize() first.');
    }
  }

  public async bulkCreate(entries: Array<Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>>): Promise<KnowledgeEntry[]> {
    await this.ensureInitialized();

    const created: KnowledgeEntry[] = [];
    const errors: Error[] = [];

    for (const entryData of entries) {
      try {
        const createdEntry = await this.create(entryData);
        created.push(createdEntry);
      } catch (error) {
        errors.push(error as Error);
      }
    }

    this.logger.info('Bulk created knowledge entries', {
      total: entries.length,
      succeeded: created.length,
      failed: errors.length,
    });

    return created;
  }

  public async deleteAll(): Promise<number> {
    await this.ensureInitialized();

    const count = this.cache.size;
    this.db.prepare('DELETE FROM knowledge_entries').run();
    this.clearCache();
    this.rebuildIndexes();

    this.logger.info('Deleted all knowledge entries', { count });
    return count;
  }
}

export const knowledgeRepository = new KnowledgeRepository();

export default BaseRepository;
