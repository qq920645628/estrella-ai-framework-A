"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryRepository = exports.MemoryRepository = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const utils_1 = require("@common/utils");
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class MemoryRepository {
    constructor(dbPath = './data/skills.db') {
        this.logger = (0, logger_1.createLogger)(this.constructor.name);
        this.initialized = false;
        this.db = new better_sqlite3_1.default(dbPath);
        this.db.pragma('encoding = "UTF-8"');
        this.db.pragma('journal_mode = WAL');
    }
    async initialize() {
        if (this.initialized)
            return;
        try {
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          memoryType TEXT NOT NULL CHECK(memoryType IN ('working', 'episodic', 'semantic')),
          role TEXT CHECK(role IN ('user', 'assistant', 'system')),
          speaker TEXT,
          keywords TEXT,
          metadata TEXT,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL
        )
      `);
        }
        catch (e) {
            // Table might already exist, try to add columns
            this.logger.warn('Table creation warning: ' + e.message);
        }
        // Add role column if it doesn't exist
        try {
            this.db.exec(`ALTER TABLE memories ADD COLUMN role TEXT CHECK(role IN ('user', 'assistant', 'system'))`);
        }
        catch (e) {
            // Column might already exist
        }
        try {
            this.db.exec(`ALTER TABLE memories ADD COLUMN speaker TEXT`);
        }
        catch (e) {
            // Column might already exist
        }
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(memoryType)
    `);
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_role ON memories(role)
    `);
        this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(createdAt DESC)
    `);
        this.initialized = true;
        this.logger.info('MemoryRepository initialized');
    }
    async create(entry) {
        const id = (0, utils_1.generateId)();
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
      INSERT INTO memories (id, content, memoryType, role, speaker, keywords, metadata, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
        stmt.run(id, entry.content, entry.memoryType, entry.role || null, entry.speaker || null, entry.keywords ? JSON.stringify(entry.keywords) : null, entry.metadata ? JSON.stringify(entry.metadata) : null, now, now);
        return {
            id,
            ...entry,
            createdAt: now,
            updatedAt: now,
        };
    }
    async findById(id) {
        const stmt = this.db.prepare('SELECT * FROM memories WHERE id = ?');
        const row = stmt.get(id);
        if (!row)
            return null;
        return this.mapRowToEntry(row);
    }
    async findAll(pagination) {
        const limit = pagination?.pageSize || 100;
        const offset = ((pagination?.page || 1) - 1) * limit;
        const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories');
        const { total } = countStmt.get();
        const stmt = this.db.prepare(`
      SELECT * FROM memories 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
        const rows = stmt.all(limit, offset);
        const entries = rows.map(row => this.mapRowToEntry(row));
        return {
            items: entries,
            total,
            page: pagination?.page || 1,
            pageSize: limit,
        };
    }
    async findByType(memoryType, pagination) {
        const limit = pagination?.pageSize || 100;
        const offset = ((pagination?.page || 1) - 1) * limit;
        const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories WHERE memoryType = ?');
        const { total } = countStmt.get(memoryType);
        const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE memoryType = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
        const rows = stmt.all(memoryType, limit, offset);
        const entries = rows.map(row => this.mapRowToEntry(row));
        return {
            items: entries,
            total,
            page: pagination?.page || 1,
            pageSize: limit,
        };
    }
    async search(query, memoryType) {
        let sql = 'SELECT * FROM memories WHERE content LIKE ?';
        const params = [`%${query}%`];
        if (memoryType) {
            sql += ' AND memoryType = ?';
            params.push(memoryType);
        }
        sql += ' ORDER BY createdAt DESC LIMIT 50';
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(...params);
        return rows.map(row => this.mapRowToEntry(row));
    }
    async update(id, updates) {
        const existing = await this.findById(id);
        if (!existing) {
            throw new errors_1.NotFoundError(`Memory ${id} not found`);
        }
        const now = new Date().toISOString();
        const stmt = this.db.prepare(`
      UPDATE memories 
      SET content = ?, memoryType = ?, role = ?, speaker = ?, keywords = ?, metadata = ?, updatedAt = ?
      WHERE id = ?
    `);
        stmt.run(updates.content ?? existing.content, updates.memoryType ?? existing.memoryType, updates.role ?? existing.role ?? null, updates.speaker ?? existing.speaker ?? null, updates.keywords ? JSON.stringify(updates.keywords) : (existing.keywords ? JSON.stringify(existing.keywords) : null), updates.metadata ? JSON.stringify(updates.metadata) : (existing.metadata ? JSON.stringify(existing.metadata) : null), now, id);
        return {
            ...existing,
            ...updates,
            updatedAt: now,
        };
    }
    async delete(id) {
        const stmt = this.db.prepare('DELETE FROM memories WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
    async count() {
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories');
        const result = stmt.get();
        return result.count;
    }
    async countByType(memoryType) {
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories WHERE memoryType = ?');
        const result = stmt.get(memoryType);
        return result.count;
    }
    async countByRole(role) {
        const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories WHERE role = ?');
        const result = stmt.get(role);
        return result.count;
    }
    async findByRole(role, pagination) {
        const limit = pagination?.pageSize || 100;
        const offset = ((pagination?.page || 1) - 1) * limit;
        const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories WHERE role = ?');
        const { total } = countStmt.get(role);
        const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE role = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
        const rows = stmt.all(role, limit, offset);
        const entries = rows.map(row => this.mapRowToEntry(row));
        return {
            items: entries,
            total,
            page: pagination?.page || 1,
            pageSize: limit,
        };
    }
    async clearByType(memoryType) {
        const stmt = this.db.prepare('DELETE FROM memories WHERE memoryType = ?');
        const result = stmt.run(memoryType);
        return result.changes;
    }
    async shutdown() {
        this.db.close();
        this.initialized = false;
        this.logger.info('MemoryRepository shutdown');
    }
    mapRowToEntry(row) {
        return {
            id: row.id,
            content: row.content,
            memoryType: row.memoryType,
            role: row.role || undefined,
            speaker: row.speaker || undefined,
            keywords: row.keywords ? JSON.parse(row.keywords) : undefined,
            metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        };
    }
}
exports.MemoryRepository = MemoryRepository;
exports.memoryRepository = new MemoryRepository();
//# sourceMappingURL=MemoryRepository.js.map