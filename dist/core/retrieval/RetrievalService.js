"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievalService = exports.RetrievalService = exports.RetrievalStrategy = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const types_1 = require("@common/types");
const utils_1 = require("@common/utils");
const KnowledgeRepository_1 = require("@core/database/KnowledgeRepository");
var RetrievalStrategy;
(function (RetrievalStrategy) {
    RetrievalStrategy["SPARSE"] = "SPARSE";
    RetrievalStrategy["DENSE"] = "DENSE";
    RetrievalStrategy["HYBRID"] = "HYBRID";
    RetrievalStrategy["GRAPH"] = "GRAPH";
})(RetrievalStrategy || (exports.RetrievalStrategy = RetrievalStrategy = {}));
const DEFAULT_CONFIG = {
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
class RetrievalService {
    constructor(config = {}, knowledgeRepo, vectorStoreInstance) {
        this.logger = (0, logger_1.createLogger)('RetrievalService');
        this.cache = new Map();
        this.queryCount = 0;
        this.cacheHitCount = 0;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.knowledgeRepo = knowledgeRepo || KnowledgeRepository_1.knowledgeRepository;
        this.vectorStore = vectorStoreInstance || (require('@core/retrieval').retrievalVectorStore);
        this.logger.info('RetrievalService initialized', { config: this.config });
    }
    async retrieve(context) {
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
                    return (0, utils_1.ok)(cached);
                }
            }
            let results;
            // 根据 useVector 参数决定搜索策略
            const strategy = context.useVector === false
                ? RetrievalStrategy.SPARSE // 禁用向量搜索时使用关键词搜索
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
                    if (firstKey)
                        this.cache.delete(firstKey);
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
            return (0, utils_1.ok)(results);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown retrieval error';
            this.logger.error('Retrieval failed', error);
            return (0, utils_1.err)(new errors_1.RetrievalError(errMsg));
        }
    }
    async sparseRetrieval(context) {
        const entries = await this.knowledgeRepo.searchByContent(context.query, context.limit || this.config.maxResults);
        const results = [];
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
    async denseRetrieval(context) {
        const queryVector = await this.embedText(context.query);
        const searchResults = await this.vectorStore.search(queryVector, context.limit || this.config.rerankTopK, context.filters?.length ? this.filtersToMetadata(context.filters) : undefined);
        const results = [];
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
    async hybridRetrieval(context) {
        const [sparseResults, denseResults] = await Promise.all([
            this.sparseRetrieval(context),
            this.denseRetrieval(context),
        ]);
        const scoreMap = new Map();
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
            }
            else {
                scoreMap.set(result.id, {
                    content: result.content,
                    score: normalizedScore * (1 - this.config.hybridAlpha),
                    metadata: result.metadata || {},
                });
            }
        }
        const results = [];
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
    async graphRetrieval(context) {
        const sparseResults = await this.sparseRetrieval(context);
        const topEntities = sparseResults.slice(0, 5);
        const results = [...sparseResults];
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
    async findRelatedContent(entityId) {
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
    async rerankResults(results, query) {
        const scored = results.map((result) => ({
            result,
            crossScore: this.calculateCrossEncoderScore(result.content, query),
        }));
        scored.sort((a, b) => b.crossScore - a.crossScore);
        return scored.slice(0, this.config.rerankTopK).map((s) => s.result);
    }
    calculateCrossEncoderScore(content, query) {
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
    calculateBM25Score(content, query) {
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
    normalizeScore(score, strategy) {
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
    applyFilters(results, filters) {
        return results.filter((result) => {
            for (const filter of filters) {
                if (!this.matchesFilter(result, filter)) {
                    return false;
                }
            }
            return true;
        });
    }
    matchesFilter(result, filter) {
        const value = this.getNestedValue(result, filter.field);
        switch (filter.operator) {
            case types_1.FilterOperator.EQ:
                return value === filter.value;
            case types_1.FilterOperator.NE:
                return value !== filter.value;
            case types_1.FilterOperator.GT:
                return typeof value === 'number' && value > filter.value;
            case types_1.FilterOperator.GTE:
                return typeof value === 'number' && value >= filter.value;
            case types_1.FilterOperator.LT:
                return typeof value === 'number' && value < filter.value;
            case types_1.FilterOperator.LTE:
                return typeof value === 'number' && value <= filter.value;
            case types_1.FilterOperator.IN:
                return Array.isArray(filter.value) && filter.value.includes(value);
            case types_1.FilterOperator.NOT_IN:
                return Array.isArray(filter.value) && !filter.value.includes(value);
            case types_1.FilterOperator.CONTAINS:
                return typeof value === 'string' && value.includes(filter.value);
            case types_1.FilterOperator.NOT_CONTAINS:
                return typeof value === 'string' && !value.includes(filter.value);
            case types_1.FilterOperator.BETWEEN:
                if (Array.isArray(filter.value) && filter.value.length === 2) {
                    return typeof value === 'number' && value >= filter.value[0] && value <= filter.value[1];
                }
                return false;
            default:
                return true;
        }
    }
    getNestedValue(obj, path) {
        const keys = path.split('.');
        let value = obj;
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            }
            else {
                return undefined;
            }
        }
        return value;
    }
    filtersToMetadata(filters) {
        const metadata = {};
        for (const filter of filters) {
            if (filter.field.startsWith('metadata.')) {
                const key = filter.field.replace('metadata.', '');
                metadata[key] = filter.value;
            }
        }
        return metadata;
    }
    generateExplanation(result, query) {
        const queryTerms = query.toLowerCase().split(/\s+/);
        const contentLower = result.content.toLowerCase();
        const matchedTerms = queryTerms.filter((term) => contentLower.includes(term));
        return `Matched ${matchedTerms.length}/${queryTerms.length} query terms with score ${result.score.toFixed(3)}. ` +
            `Content relevance: ${result.score > 0.8 ? 'High' : result.score > 0.5 ? 'Medium' : 'Low'}.`;
    }
    async embedText(text) {
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
    getEmbeddingDimension() {
        return 1536;
    }
    computeCacheKey(context) {
        const filtersStr = context.filters
            ? JSON.stringify(context.filters.sort((a, b) => a.field.localeCompare(b.field)))
            : '';
        return `${context.query}:${context.limit}:${filtersStr}`;
    }
    getCacheHitRate() {
        if (this.queryCount === 0)
            return 0;
        return Math.round((this.cacheHitCount / this.queryCount) * 100) / 100;
    }
    getStatistics() {
        return {
            totalQueries: this.queryCount,
            cacheHitRate: this.getCacheHitRate(),
            cacheSize: this.cache.size,
            config: this.config,
        };
    }
    clearCache() {
        this.cache.clear();
        this.logger.info('Retrieval cache cleared');
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
        this.logger.info('Retrieval config updated', { config: this.config });
    }
}
exports.RetrievalService = RetrievalService;
exports.retrievalService = new RetrievalService();
exports.default = RetrievalService;
//# sourceMappingURL=RetrievalService.js.map