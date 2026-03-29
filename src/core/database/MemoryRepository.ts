import { createLogger } from '@common/logger';
import { DatabaseError, NotFoundError } from '@common/errors';
import { Entity, PaginationParams, PaginatedResult } from '@common/types';
import { Result, ok, err, generateId } from '@common/utils';
import Database from 'better-sqlite3';
import * as path from 'path';

export interface MemoryEntry extends Entity {
  content: string;
  memoryType: 'working' | 'episodic' | 'semantic';
  role?: 'user' | 'assistant' | 'system';
  speaker?: string;
  keywords?: string[];
  metadata?: Record<string, any>;
}

export class MemoryRepository {
  private readonly logger = createLogger(this.constructor.name);
  private db: Database.Database;
  private initialized = false;

  constructor(dbPath: string = './data/skills.db') {
    this.db = new Database(dbPath);
    this.db.pragma('encoding = "UTF-8"');
    this.db.pragma('journal_mode = WAL');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
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
    } catch (e: any) {
      // Table might already exist, try to add columns
      this.logger.warn('Table creation warning: ' + e.message);
    }
    
    // Add role column if it doesn't exist
    try {
      this.db.exec(`ALTER TABLE memories ADD COLUMN role TEXT CHECK(role IN ('user', 'assistant', 'system'))`);
    } catch (e: any) {
      // Column might already exist
    }
    
    try {
      this.db.exec(`ALTER TABLE memories ADD COLUMN speaker TEXT`);
    } catch (e: any) {
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

  async create(entry: Omit<MemoryEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<MemoryEntry> {
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO memories (id, content, memoryType, role, speaker, keywords, metadata, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      entry.content,
      entry.memoryType,
      entry.role || null,
      entry.speaker || null,
      entry.keywords ? JSON.stringify(entry.keywords) : null,
      entry.metadata ? JSON.stringify(entry.metadata) : null,
      now,
      now
    );
    
    return {
      id,
      ...entry,
      createdAt: now,
      updatedAt: now,
    };
  }

  async findById(id: string): Promise<MemoryEntry | null> {
    const stmt = this.db.prepare('SELECT * FROM memories WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return this.mapRowToEntry(row);
  }

  async findAll(pagination?: PaginationParams): Promise<PaginatedResult<MemoryEntry>> {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    
    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories');
    const { total } = countStmt.get() as { total: number };
    
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    
    const rows = stmt.all(limit, offset) as any[];
    const entries = rows.map(row => this.mapRowToEntry(row));
    
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit,
    };
  }

  async findByType(memoryType: string, pagination?: PaginationParams): Promise<PaginatedResult<MemoryEntry>> {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    
    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories WHERE memoryType = ?');
    const { total } = countStmt.get(memoryType) as { total: number };
    
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE memoryType = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    
    const rows = stmt.all(memoryType, limit, offset) as any[];
    const entries = rows.map(row => this.mapRowToEntry(row));
    
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit,
    };
  }

  async search(query: string, memoryType?: string): Promise<MemoryEntry[]> {
    let sql = 'SELECT * FROM memories WHERE content LIKE ?';
    const params: any[] = [`%${query}%`];
    
    if (memoryType) {
      sql += ' AND memoryType = ?';
      params.push(memoryType);
    }
    
    sql += ' ORDER BY createdAt DESC LIMIT 50';
    
    const stmt = this.db.prepare(sql);
    const rows = stmt.all(...params) as any[];
    
    return rows.map(row => this.mapRowToEntry(row));
  }

  async update(id: string, updates: Partial<MemoryEntry>): Promise<MemoryEntry> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError(`Memory ${id} not found`);
    }
    
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE memories 
      SET content = ?, memoryType = ?, role = ?, speaker = ?, keywords = ?, metadata = ?, updatedAt = ?
      WHERE id = ?
    `);
    
    stmt.run(
      updates.content ?? existing.content,
      updates.memoryType ?? existing.memoryType,
      updates.role ?? existing.role ?? null,
      updates.speaker ?? existing.speaker ?? null,
      updates.keywords ? JSON.stringify(updates.keywords) : (existing.keywords ? JSON.stringify(existing.keywords) : null),
      updates.metadata ? JSON.stringify(updates.metadata) : (existing.metadata ? JSON.stringify(existing.metadata) : null),
      now,
      id
    );
    
    return {
      ...existing,
      ...updates,
      updatedAt: now,
    };
  }

  async delete(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM memories WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  async count(): Promise<number> {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories');
    const result = stmt.get() as { count: number };
    return result.count;
  }

  async countByType(memoryType: string): Promise<number> {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories WHERE memoryType = ?');
    const result = stmt.get(memoryType) as { count: number };
    return result.count;
  }

  async countByRole(role: string): Promise<number> {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM memories WHERE role = ?');
    const result = stmt.get(role) as { count: number };
    return result.count;
  }

  async findByRole(role: string, pagination?: PaginationParams): Promise<PaginatedResult<MemoryEntry>> {
    const limit = pagination?.pageSize || 100;
    const offset = ((pagination?.page || 1) - 1) * limit;
    
    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM memories WHERE role = ?');
    const { total } = countStmt.get(role) as { total: number };
    
    const stmt = this.db.prepare(`
      SELECT * FROM memories 
      WHERE role = ?
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `);
    
    const rows = stmt.all(role, limit, offset) as any[];
    const entries = rows.map(row => this.mapRowToEntry(row));
    
    return {
      items: entries,
      total,
      page: pagination?.page || 1,
      pageSize: limit,
    };
  }

  async clearByType(memoryType: string): Promise<number> {
    const stmt = this.db.prepare('DELETE FROM memories WHERE memoryType = ?');
    const result = stmt.run(memoryType);
    return result.changes;
  }

  async shutdown(): Promise<void> {
    this.db.close();
    this.initialized = false;
    this.logger.info('MemoryRepository shutdown');
  }

  private mapRowToEntry(row: any): MemoryEntry {
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

export const memoryRepository = new MemoryRepository();
