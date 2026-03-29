import { createLogger } from '@common/logger';
import { DatabaseError, ValidationError } from '@common/errors';
import { generateId } from '@common/utils';

export interface Vector {
  id: string;
  values: number[];
  metadata?: Record<string, unknown>;
  dimension: number;
  createdAt: Date;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  vector: Vector;
}

export interface IndexStats {
  totalVectors: number;
  dimension: number;
  indexSizeBytes: number;
  lastUpdated: Date;
}

export class VectorStore {
  private readonly logger = createLogger('VectorStore');
  private vectors: Map<string, Vector> = new Map();
  private dimension: number = 1536;
  private initialized: boolean = false;
  private indexReady: boolean = false;

  public async initialize(dimension: number = 1536): Promise<void> {
    if (this.initialized) {
      this.logger.warn('VectorStore already initialized');
      return;
    }

    this.logger.info('Initializing VectorStore', { dimension });
    this.dimension = dimension;
    this.initialized = true;
    this.indexReady = false;
    this.logger.info('VectorStore initialized successfully');
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down VectorStore');
    this.vectors.clear();
    this.initialized = false;
    this.indexReady = false;
  }

  public async add(vector: Omit<Vector, 'id' | 'createdAt' | 'dimension'>): Promise<Vector> {
    this.ensureInitialized();

    const values = vector.values;
    if (values.length !== this.dimension) {
      throw new ValidationError(
        `Vector dimension mismatch. Expected ${this.dimension}, got ${values.length}`
      );
    }

    const normalizedValues = this.normalize(values);

    const fullVector: Vector = {
      ...vector,
      id: generateId(),
      values: normalizedValues,
      dimension: this.dimension,
      createdAt: new Date(),
    };

    this.vectors.set(fullVector.id, fullVector);
    this.indexReady = false;

    this.logger.debug('Added vector', { id: fullVector.id, dimension: this.dimension });
    return fullVector;
  }

  public async addBatch(
    vectors: Array<Omit<Vector, 'id' | 'createdAt' | 'dimension'>>
  ): Promise<Vector[]> {
    this.ensureInitialized();

    const added: Vector[] = [];
    for (const vec of vectors) {
      try {
        const addedVector = await this.add(vec);
        added.push(addedVector);
      } catch (error) {
        this.logger.error(error);
      }
    }

    this.logger.info('Batch added vectors', { requested: vectors.length, succeeded: added.length });
    return added;
  }

  public async search(
    query: number[],
    limit: number = 10,
    filter?: Record<string, unknown>
  ): Promise<VectorSearchResult[]> {
    this.ensureInitialized();

    if (query.length !== this.dimension) {
      throw new ValidationError(
        `Query dimension mismatch. Expected ${this.dimension}, got ${query.length}`
      );
    }

    const normalizedQuery = this.normalize(query);
    const results: VectorSearchResult[] = [];

    for (const vector of this.vectors.values()) {
      if (filter && !this.matchesFilter(vector, filter)) {
        continue;
      }

      const score = this.cosineSimilarity(normalizedQuery, vector.values);
      results.push({
        id: vector.id,
        score,
        vector,
      });
    }

    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, limit);

    this.logger.debug('Vector search completed', {
      totalVectors: this.vectors.size,
      returned: topResults.length,
      topScore: topResults[0]?.score ?? 0,
    });

    return topResults;
  }

  public async findById(id: string): Promise<Vector | null> {
    this.ensureInitialized();
    return this.vectors.get(id) || null;
  }

  public async delete(id: string): Promise<boolean> {
    this.ensureInitialized();

    const deleted = this.vectors.delete(id);
    if (deleted) {
      this.indexReady = false;
    }
    return deleted;
  }

  public async update(id: string, metadata?: Record<string, unknown>): Promise<Vector | null> {
    this.ensureInitialized();

    const vector = this.vectors.get(id);
    if (!vector) {
      return null;
    }

    const updated: Vector = {
      ...vector,
      metadata: { ...vector.metadata, ...metadata },
    };

    this.vectors.set(id, updated);
    return updated;
  }

  public async count(): Promise<number> {
    this.ensureInitialized();
    return this.vectors.size;
  }

  public getStats(): IndexStats {
    this.ensureInitialized();

    let totalBytes = 0;
    for (const vector of this.vectors.values()) {
      totalBytes += vector.values.length * 8;
    }

    return {
      totalVectors: this.vectors.size,
      dimension: this.dimension,
      indexSizeBytes: totalBytes,
      lastUpdated: new Date(),
    };
  }

  private normalize(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector.reduce((sum, val) => sum + val * val, 0)
    );

    if (magnitude === 0) {
      return vector;
    }

    return vector.map((val) => val / magnitude);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  private matchesFilter(vector: Vector, filter: Record<string, unknown>): boolean {
    if (!vector.metadata) {
      return false;
    }

    for (const [key, value] of Object.entries(filter)) {
      if (vector.metadata[key] !== value) {
        return false;
      }
    }

    return true;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new DatabaseError('VectorStore not initialized. Call initialize() first.');
    }
  }

  public async clear(): Promise<void> {
    this.ensureInitialized();
    this.vectors.clear();
    this.indexReady = false;
    this.logger.info('VectorStore cleared');
  }

  public async getAllIds(): Promise<string[]> {
    this.ensureInitialized();
    return Array.from(this.vectors.keys());
  }

  public async getVectorsByMetadata(
    metadata: Record<string, unknown>,
    limit?: number
  ): Promise<Vector[]> {
    this.ensureInitialized();

    const results: Vector[] = [];
    for (const vector of this.vectors.values()) {
      if (this.matchesFilter(vector, metadata)) {
        results.push(vector);
        if (limit && results.length >= limit) {
          break;
        }
      }
    }

    return results;
  }
}

export class HNSWIndex {
  private readonly logger = createLogger('HNSWIndex');
  private vectors: Map<string, Vector> = new Map();
  private level: number = 0;
  private m: number = 16;
  private efConstruction: number = 200;
  private efSearch: number = 100;
  private maxLevel: number = 16;

  private enterPoint: Vector | null = null;

  constructor(m: number = 16, efConstruction: number = 200, efSearch: number = 100) {
    this.m = m;
    this.efConstruction = efConstruction;
    this.efSearch = efSearch;
    this.logger.info('HNSWIndex created', { m, efConstruction, efSearch });
  }

  public async addVector(vector: Vector): Promise<void> {
    this.vectors.set(vector.id, vector);
  }

  public async search(query: number[], k: number = 10): Promise<VectorSearchResult[]> {
    const results: VectorSearchResult[] = [];

    for (const vector of this.vectors.values()) {
      const score = this.cosineSimilarity(query, vector.values);
      results.push({
        id: vector.id,
        score,
        vector,
      });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, k);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  public async clear(): Promise<void> {
    this.vectors.clear();
  }
}

export const vectorStore = new VectorStore();

export default VectorStore;
