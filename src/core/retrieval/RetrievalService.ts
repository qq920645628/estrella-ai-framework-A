import { createLogger } from '@common/logger';
import {
  RetrievalError,
  ValidationError,
  NotFoundError,
} from '@common/errors';
import {
  RetrievalResult,
  QueryContext,
  QueryFilter,
  FilterOperator,
} from '@common/types';
import { Result, ok, err } from '@common/utils';
import { KnowledgeRepository } from '@core/database/KnowledgeRepository';
import { VectorStore, VectorSearchResult } from '@core/database/VectorStore';
import { knowledgeRepository } from '@core/database/KnowledgeRepository';
import { vectorStore } from '@core/database/VectorStore';

export enum RetrievalStrategy {
  SPARSE = 'SPARSE',
  DENSE = 'DENSE',
  HYBRID = 'HYBRID',
  GRAPH = 'GRAPH',
}

export interface RetrievalConfig {
  defaultStrategy: RetrievalStrategy;
  hybridAlpha: number;
  maxResults: number;
  minScore: number;
  enableReranking: boolean;
  rerankTopK: number;
  enableCache: boolean;
  cacheSize: number;
  timeoutMs: number;
}

const DEFAULT_CONFIG: RetrievalConfig = {
  defaultStrategy: RetrievalStrategy.HYBRID,
  hybridAlpha: 0.5,
  maxResults: 10,
  minScore: 0.5,
  enableReranking: true,
  rerankTopK: 20,
  enableCache: true,
  cacheSize: 1000,
  timeoutMs: 5000,
};

export interface RerankerConfig {
  modelType: 'cross-encoder' | 'bm25';
  topK: number;
}

export class RetrievalService {
  private readonly logger = createLogger('RetrievalService');
  private readonly config: RetrievalConfig;
  private readonly knowledgeRepo: KnowledgeRepository;
  private readonly vectorStore: VectorStore;
  private cache: Map<string, RetrievalResult[]> = new Map();
  private queryCount: number = 0;
  private cacheHitCount: number = 0;

  constructor(
    config: Partial<RetrievalConfig> = {},
    knowledgeRepo?: KnowledgeRepository,
    vectorStoreInstance?: VectorStore
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.knowledgeRepo = knowledgeRepo || knowledgeRepository;
    this.vectorStore = vectorStoreInstance || (require('@core/retrieval').retrievalVectorStore);
    this.logger.info('RetrievalService initialized', { config: this.config });
  }

  public async retrieve(context: QueryContext): Promise<Result<RetrievalResult[]>> {
    const startTime = Date.now();
    this.queryCount++;

    try {
      this.logger.debug('Starting retrieval', { query: context.query, strategy: this.config.defaultStrategy, useVector: context.useVector });

      if (this.config.enableCache) {
        const cacheKey = this.computeCacheKey(context);
        const cached = this.cache.get(cacheKey);
        if (cached) {
          this.cacheHitCount++;
          this.logger.debug('Cache hit', { cacheKey });
          return ok(cached);
        }
      }

      let results: RetrievalResult[];

      // 根据 useVector 参数决定搜索策略
      const strategy = context.useVector === false 
        ? RetrievalStrategy.SPARSE  // 禁用向量搜索时使用关键词搜索
        : this.config.defaultStrategy;

      switch (strategy) {
        case RetrievalStrategy.SPARSE:
          results = await this.sparseRetrieval(context);
          break;
        case RetrievalStrategy.DENSE:
          results = await this.denseRetrieval(context);
          break;
        case RetrievalStrategy.HYBRID:
          results = await this.hybridRetrieval(context);
          break;
        case RetrievalStrategy.GRAPH:
          results = await this.graphRetrieval(context);
          break;
        default:
          results = await this.hybridRetrieval(context);
      }

      if (context.filters && context.filters.length > 0) {
        results = this.applyFilters(results, context.filters);
      }

      if (context.rerank !== false && this.config.enableReranking) {
        results = await this.rerankResults(results, context.query);
      }

      results = results.slice(0, context.limit || this.config.maxResults);

      results = results.filter((r) => r.score >= this.config.minScore);

      for (const result of results) {
        result.explanation = this.generateExplanation(result, context.query);
      }

      if (this.config.enableCache) {
        const cacheKey = this.computeCacheKey(context);
        if (this.cache.size >= this.config.cacheSize) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey) this.cache.delete(firstKey);
        }
        this.cache.set(cacheKey, results);
      }

      const duration = Date.now() - startTime;
      this.logger.info('Retrieval completed', {
        queryLength: context.query.length,
        resultCount: results.length,
        duration,
        cacheHitRate: this.getCacheHitRate(),
      });

      return ok(results);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown retrieval error';
      this.logger.error('Retrieval failed', error as Error);
      return err(new RetrievalError(errMsg));
    }
  }

  private async sparseRetrieval(context: QueryContext): Promise<RetrievalResult[]> {
    const entries = await this.knowledgeRepo.searchByContent(
      context.query,
      context.limit || this.config.maxResults
    );

    const results: RetrievalResult[] = [];

    for (const entry of entries) {
      const score = this.calculateBM25Score(entry.content, context.query);

      results.push({
        id: entry.id,
        content: entry.content,
        score,
        metadata: {
          type: entry.type,
          tags: entry.tags,
          source: entry.source,
        },
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private async denseRetrieval(context: QueryContext): Promise<RetrievalResult[]> {
    const queryVector = await this.embedText(context.query);

    const searchResults = await this.vectorStore.search(
      queryVector,
      context.limit || this.config.rerankTopK,
      context.filters?.length ? this.filtersToMetadata(context.filters) : undefined
    );

    const results: RetrievalResult[] = [];

    for (const sr of searchResults) {
      const entry = await this.knowledgeRepo.findById(sr.id);
      if (entry) {
        results.push({
          id: entry.id,
          content: entry.content,
          score: sr.score,
          metadata: {
            type: entry.type,
            tags: entry.tags,
            source: entry.source,
          },
        });
      }
    }

    return results;
  }

  private async hybridRetrieval(context: QueryContext): Promise<RetrievalResult[]> {
    const [sparseResults, denseResults] = await Promise.all([
      this.sparseRetrieval(context),
      this.denseRetrieval(context),
    ]);

    const scoreMap = new Map<string, { content: string; score: number; metadata: Record<string, unknown> }>();

    for (const result of sparseResults) {
      const normalizedScore = this.normalizeScore(result.score, RetrievalStrategy.SPARSE);
      scoreMap.set(result.id, {
        content: result.content,
        score: normalizedScore * this.config.hybridAlpha,
        metadata: result.metadata || {},
      });
    }

    for (const result of denseResults) {
      const normalizedScore = this.normalizeScore(result.score, RetrievalStrategy.DENSE);
      const existing = scoreMap.get(result.id);

      if (existing) {
        existing.score += normalizedScore * (1 - this.config.hybridAlpha);
      } else {
        scoreMap.set(result.id, {
          content: result.content,
          score: normalizedScore * (1 - this.config.hybridAlpha),
          metadata: result.metadata || {},
        });
      }
    }

    const results: RetrievalResult[] = [];
    for (const [id, data] of scoreMap) {
      results.push({
        id,
        content: data.content,
        score: data.score,
        metadata: data.metadata,
      });
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private async graphRetrieval(context: QueryContext): Promise<RetrievalResult[]> {
    const sparseResults = await this.sparseRetrieval(context);

    const topEntities = sparseResults.slice(0, 5);

    const results: RetrievalResult[] = [...sparseResults];

    for (const entity of topEntities) {
      const relatedResults = await this.findRelatedContent(entity.id);
      for (const related of relatedResults) {
        if (!results.find((r) => r.id === related.id)) {
          results.push(related);
        }
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private async findRelatedContent(entityId: string): Promise<RetrievalResult[]> {
    const entry = await this.knowledgeRepo.findById(entityId);
    if (!entry) {
      return [];
    }

    const relatedEntries = await this.knowledgeRepo.findByEntityType(entry.entities[0]?.type || 'UNKNOWN');

    return relatedEntries
      .filter((e) => e.id !== entityId)
      .slice(0, 5)
      .map((e) => ({
        id: e.id,
        content: e.content,
        score: 0.6,
        metadata: {
          type: e.type,
          tags: e.tags,
          source: e.source,
          relatedTo: entityId,
        },
      }));
  }

  private async rerankResults(results: RetrievalResult[], query: string): Promise<RetrievalResult[]> {
    const scored = results.map((result) => ({
      result,
      crossScore: this.calculateCrossEncoderScore(result.content, query),
    }));

    scored.sort((a, b) => b.crossScore - a.crossScore);

    return scored.slice(0, this.config.rerankTopK).map((s) => s.result);
  }

  private calculateCrossEncoderScore(content: string, query: string): number {
    const contentLower = content.toLowerCase();
    const queryTerms = query.toLowerCase().split(/\s+/);

    let matchCount = 0;
    let positionBonus = 0;

    for (let i = 0; i < queryTerms.length; i++) {
      const term = queryTerms[i];
      const index = contentLower.indexOf(term);

      if (index !== -1) {
        matchCount++;
        positionBonus += 1 / (index + 1);
      }
    }

    const coverage = matchCount / queryTerms.length;
    const avgPosition = positionBonus / (matchCount || 1);

    return coverage * 0.7 + Math.min(avgPosition, 0.3) * 0.3;
  }

  private calculateBM25Score(content: string, query: string): number {
    const contentLower = content.toLowerCase();
    const queryTerms = query.toLowerCase().split(/\s+/);

    const k1 = 1.5;
    const b = 0.75;

    const contentLength = contentLower.split(/\s+/).length;
    const avgContentLength = contentLength;

    let score = 0;

    for (const term of queryTerms) {
      const regex = new RegExp(term, 'gi');
      const tf = (contentLower.match(regex) || []).length;

      if (tf > 0) {
        const idf = Math.log((1000 + 1) / (tf + 1));
        const tfComponent = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (contentLength / avgContentLength)));
        score += idf * tfComponent;
      }
    }

    return Math.min(score / queryTerms.length, 1.0);
  }

  private normalizeScore(score: number, strategy: RetrievalStrategy): number {
    switch (strategy) {
      case RetrievalStrategy.SPARSE:
        return Math.min(score / 10, 1.0);
      case RetrievalStrategy.DENSE:
        return (score + 1) / 2;
      case RetrievalStrategy.HYBRID:
        return Math.min(score, 1.0);
      default:
        return score;
    }
  }

  private applyFilters(results: RetrievalResult[], filters: QueryFilter[]): RetrievalResult[] {
    return results.filter((result) => {
      for (const filter of filters) {
        if (!this.matchesFilter(result, filter)) {
          return false;
        }
      }
      return true;
    });
  }

  private matchesFilter(result: RetrievalResult, filter: QueryFilter): boolean {
    const value = this.getNestedValue(result, filter.field);

    switch (filter.operator) {
      case FilterOperator.EQ:
        return value === filter.value;
      case FilterOperator.NE:
        return value !== filter.value;
      case FilterOperator.GT:
        return typeof value === 'number' && value > (filter.value as number);
      case FilterOperator.GTE:
        return typeof value === 'number' && value >= (filter.value as number);
      case FilterOperator.LT:
        return typeof value === 'number' && value < (filter.value as number);
      case FilterOperator.LTE:
        return typeof value === 'number' && value <= (filter.value as number);
      case FilterOperator.IN:
        return Array.isArray(filter.value) && filter.value.includes(value);
      case FilterOperator.NOT_IN:
        return Array.isArray(filter.value) && !filter.value.includes(value);
      case FilterOperator.CONTAINS:
        return typeof value === 'string' && value.includes(filter.value as string);
      case FilterOperator.NOT_CONTAINS:
        return typeof value === 'string' && !value.includes(filter.value as string);
      case FilterOperator.BETWEEN:
        if (Array.isArray(filter.value) && filter.value.length === 2) {
          return typeof value === 'number' && value >= filter.value[0] && value <= filter.value[1];
        }
        return false;
      default:
        return true;
    }
  }

  private getNestedValue(obj: Record<string, unknown>, path: string): unknown {
    const keys = path.split('.');
    let value: unknown = obj;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return value;
  }

  private filtersToMetadata(filters: QueryFilter[]): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    for (const filter of filters) {
      if (filter.field.startsWith('metadata.')) {
        const key = filter.field.replace('metadata.', '');
        metadata[key] = filter.value;
      }
    }

    return metadata;
  }

  private generateExplanation(result: RetrievalResult, query: string): string {
    const queryTerms = query.toLowerCase().split(/\s+/);
    const contentLower = result.content.toLowerCase();

    const matchedTerms = queryTerms.filter((term) => contentLower.includes(term));

    return `Matched ${matchedTerms.length}/${queryTerms.length} query terms with score ${result.score.toFixed(3)}. ` +
      `Content relevance: ${result.score > 0.8 ? 'High' : result.score > 0.5 ? 'Medium' : 'Low'}.`;
  }

  private async embedText(text: string): Promise<number[]> {
    const embedding = new Array(this.getEmbeddingDimension()).fill(0);
    const words = text.toLowerCase().split(/\s+/);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const charCode = word.charCodeAt(j);
        const index = (charCode + i + j) % this.getEmbeddingDimension();
        embedding[index] += Math.sin(charCode * (j + 1)) * 0.1;
      }
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    return embedding;
  }

  private getEmbeddingDimension(): number {
    return 1536;
  }

  private computeCacheKey(context: QueryContext): string {
    const filtersStr = context.filters
      ? JSON.stringify(context.filters.sort((a, b) => a.field.localeCompare(b.field)))
      : '';
    return `${context.query}:${context.limit}:${filtersStr}`;
  }

  public getCacheHitRate(): number {
    if (this.queryCount === 0) return 0;
    return Math.round((this.cacheHitCount / this.queryCount) * 100) / 100;
  }

  public getStatistics(): {
    totalQueries: number;
    cacheHitRate: number;
    cacheSize: number;
    config: RetrievalConfig;
  } {
    return {
      totalQueries: this.queryCount,
      cacheHitRate: this.getCacheHitRate(),
      cacheSize: this.cache.size,
      config: this.config,
    };
  }

  public clearCache(): void {
    this.cache.clear();
    this.logger.info('Retrieval cache cleared');
  }

  public updateConfig(config: Partial<RetrievalConfig>): void {
    this.config = { ...this.config, ...config };
    this.logger.info('Retrieval config updated', { config: this.config });
  }
}

export const retrievalService = new RetrievalService();

export default RetrievalService;
