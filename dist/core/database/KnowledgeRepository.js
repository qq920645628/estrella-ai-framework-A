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
exports.knowledgeRepository = exports.KnowledgeRepository = exports.BaseRepository = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const types_1 = require("@common/types");
const utils_1 = require("@common/utils");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DEFAULT_CONFIG = {
    path: './data/skills.db',
    maxConnections: 10,
    timeoutMs: 5000,
    enableWAL: true,
    enableCache: true,
    cacheSize: 1000,
    enableEncryption: false,
};
class BaseRepository {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)(this.constructor.name);
        this.cache = new Map();
        this.initialized = false;
        this.config = { ...DEFAULT_CONFIG, ...config };
    }
    getCached(id) {
        return this.cache.get(id) || null;
    }
    setCached(entity) {
        if (this.config.enableCache) {
            if (this.cache.size >= this.config.cacheSize) {
                const firstKey = this.cache.keys().next().value;
                if (firstKey)
                    this.cache.delete(firstKey);
            }
            this.cache.set(entity.id, entity);
        }
    }
    invalidateCache(id) {
        this.cache.delete(id);
    }
    clearCache() {
        this.cache.clear();
    }
    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.config.cacheSize,
        };
    }
}
exports.BaseRepository = BaseRepository;
class KnowledgeRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.entityIndex = new Map();
        this.tagIndex = new Map();
    }
    async initialize() {
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
        this.db = new better_sqlite3_1.default(this.config.path);
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
    createTables() {
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
    loadFromDatabase() {
        const rows = this.db.prepare('SELECT * FROM knowledge_entries').all();
        for (const row of rows) {
            const entry = {
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
            this.cache.set(entry.id, entry);
            this.updateIndexes(entry);
        }
        this.logger.info('Loaded entries from database', { count: rows.length });
    }
    async shutdown() {
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
    rowToEntry(row) {
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
    async create(entityData) {
        await this.ensureInitialized();
        const existing = await this.findByContent(entityData.content);
        if (existing) {
            throw new errors_1.AlreadyExistsError('KnowledgeEntry', entityData.content.substring(0, 50));
        }
        const now = new Date();
        const entity = {
            ...entityData,
            id: (0, utils_1.generateId)(),
            createdAt: now,
            updatedAt: now,
        };
        // 插入数据库
        const stmt = this.db.prepare(`
      INSERT INTO knowledge_entries (id, content, type, entities, relations, confidence, source, tags, status, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(entity.id, entity.content, entity.type || 'DOCUMENT', JSON.stringify(entity.entities || []), JSON.stringify(entity.relations || []), entity.confidence || 1.0, entity.source || 'unknown', JSON.stringify(entity.tags || []), entity.status || 'ACTIVE', entity.version || 1, entity.createdAt.toISOString(), entity.updatedAt.toISOString());
        this.updateIndexes(entity);
        this.setCached(entity);
        this.logger.debug('Created knowledge entry', { id: entity.id });
        return entity;
    }
    async findById(id) {
        await this.ensureInitialized();
        const cached = this.getCached(id);
        if (cached) {
            return cached;
        }
        const row = this.db.prepare('SELECT * FROM knowledge_entries WHERE id = ?').get(id);
        if (!row) {
            return null;
        }
        const entry = this.rowToEntry(row);
        this.setCached(entry);
        return entry;
    }
    async update(id, updateData) {
        await this.ensureInitialized();
        const existing = await this.findById(id);
        if (!existing) {
            throw new errors_1.NotFoundError('KnowledgeEntry', id);
        }
        const updated = {
            ...existing,
            ...updateData,
            id: existing.id,
            createdAt: existing.createdAt,
            updatedAt: new Date(),
            version: existing.version + 1,
        };
        const stmt = this.db.prepare(`
      UPDATE knowledge_entries 
      SET content = ?, type = ?, entities = ?, relations = ?, confidence = ?, source = ?, tags = ?, status = ?, version = ?, updated_at = ?
      WHERE id = ?
    `);
        stmt.run(updated.content, updated.type, JSON.stringify(updated.entities || []), JSON.stringify(updated.relations || []), updated.confidence, updated.source, JSON.stringify(updated.tags || []), updated.status, updated.version, updated.updatedAt.toISOString(), id);
        this.rebuildIndexes();
        this.setCached(updated);
        this.logger.debug('Updated knowledge entry', { id });
        return updated;
    }
    async delete(id) {
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
    async findAll(pagination) {
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
        const sorted = entries.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return (0, utils_1.paginate)(sorted, total, pagination);
    }
    async findByContent(content) {
        await this.ensureInitialized();
        const normalizedContent = content.toLowerCase().trim();
        for (const entry of this.cache.values()) {
            if (entry.content.toLowerCase().trim() === normalizedContent) {
                return entry;
            }
        }
        return null;
    }
    async findByEntityType(entityType) {
        await this.ensureInitialized();
        const entryIds = this.entityIndex.get(entityType);
        if (!entryIds) {
            return [];
        }
        const entries = [];
        for (const id of entryIds) {
            const entry = await this.findById(id);
            if (entry) {
                entries.push(entry);
            }
        }
        return entries;
    }
    async findByTag(tag) {
        await this.ensureInitialized();
        const entryIds = this.tagIndex.get(tag.toLowerCase());
        if (!entryIds) {
            return [];
        }
        const entries = [];
        for (const id of entryIds) {
            const entry = await this.findById(id);
            if (entry) {
                entries.push(entry);
            }
        }
        return entries;
    }
    async findByStatus(status) {
        await this.ensureInitialized();
        const entries = [];
        for (const entry of this.cache.values()) {
            if (entry.status === status) {
                entries.push(entry);
            }
        }
        return entries;
    }
    async searchByContent(query, limit = 10) {
        await this.ensureInitialized();
        // 预处理查询 - 支持中英文
        const normalizedQuery = query.toLowerCase().trim();
        const results = [];
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
    calculateRelevanceScore(content, query) {
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
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    async count() {
        await this.ensureInitialized();
        return this.cache.size;
    }
    async countByStatus() {
        await this.ensureInitialized();
        const counts = {
            [types_1.EntityStatus.ACTIVE]: 0,
            [types_1.EntityStatus.INACTIVE]: 0,
            [types_1.EntityStatus.DELETED]: 0,
            [types_1.EntityStatus.PENDING]: 0,
        };
        for (const entry of this.cache.values()) {
            counts[entry.status]++;
        }
        return counts;
    }
    updateIndexes(entity) {
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
    rebuildIndexes() {
        this.entityIndex.clear();
        this.tagIndex.clear();
        for (const entity of this.cache.values()) {
            this.updateIndexes(entity);
        }
    }
    async ensureInitialized() {
        if (!this.initialized) {
            throw new errors_1.DatabaseError('Repository not initialized. Call initialize() first.');
        }
    }
    async bulkCreate(entries) {
        await this.ensureInitialized();
        const created = [];
        const errors = [];
        for (const entryData of entries) {
            try {
                const createdEntry = await this.create(entryData);
                created.push(createdEntry);
            }
            catch (error) {
                errors.push(error);
            }
        }
        this.logger.info('Bulk created knowledge entries', {
            total: entries.length,
            succeeded: created.length,
            failed: errors.length,
        });
        return created;
    }
    async deleteAll() {
        await this.ensureInitialized();
        const count = this.cache.size;
        this.db.prepare('DELETE FROM knowledge_entries').run();
        this.clearCache();
        this.rebuildIndexes();
        this.logger.info('Deleted all knowledge entries', { count });
        return count;
    }
}
exports.KnowledgeRepository = KnowledgeRepository;
exports.knowledgeRepository = new KnowledgeRepository();
exports.default = BaseRepository;
//# sourceMappingURL=KnowledgeRepository.js.map