"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorStore = exports.HNSWIndex = exports.VectorStore = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const utils_1 = require("@common/utils");
class VectorStore {
    constructor() {
        this.logger = (0, logger_1.createLogger)('VectorStore');
        this.vectors = new Map();
        this.dimension = 1536;
        this.initialized = false;
        this.indexReady = false;
    }
    async initialize(dimension = 1536) {
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
    async shutdown() {
        this.logger.info('Shutting down VectorStore');
        this.vectors.clear();
        this.initialized = false;
        this.indexReady = false;
    }
    async add(vector) {
        this.ensureInitialized();
        const values = vector.values;
        if (values.length !== this.dimension) {
            throw new errors_1.ValidationError(`Vector dimension mismatch. Expected ${this.dimension}, got ${values.length}`);
        }
        const normalizedValues = this.normalize(values);
        const fullVector = {
            ...vector,
            id: (0, utils_1.generateId)(),
            values: normalizedValues,
            dimension: this.dimension,
            createdAt: new Date(),
        };
        this.vectors.set(fullVector.id, fullVector);
        this.indexReady = false;
        this.logger.debug('Added vector', { id: fullVector.id, dimension: this.dimension });
        return fullVector;
    }
    async addBatch(vectors) {
        this.ensureInitialized();
        const added = [];
        for (const vec of vectors) {
            try {
                const addedVector = await this.add(vec);
                added.push(addedVector);
            }
            catch (error) {
                this.logger.error(error);
            }
        }
        this.logger.info('Batch added vectors', { requested: vectors.length, succeeded: added.length });
        return added;
    }
    async search(query, limit = 10, filter) {
        this.ensureInitialized();
        if (query.length !== this.dimension) {
            throw new errors_1.ValidationError(`Query dimension mismatch. Expected ${this.dimension}, got ${query.length}`);
        }
        const normalizedQuery = this.normalize(query);
        const results = [];
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
    async findById(id) {
        this.ensureInitialized();
        return this.vectors.get(id) || null;
    }
    async delete(id) {
        this.ensureInitialized();
        const deleted = this.vectors.delete(id);
        if (deleted) {
            this.indexReady = false;
        }
        return deleted;
    }
    async update(id, metadata) {
        this.ensureInitialized();
        const vector = this.vectors.get(id);
        if (!vector) {
            return null;
        }
        const updated = {
            ...vector,
            metadata: { ...vector.metadata, ...metadata },
        };
        this.vectors.set(id, updated);
        return updated;
    }
    async count() {
        this.ensureInitialized();
        return this.vectors.size;
    }
    getStats() {
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
    normalize(vector) {
        const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
        if (magnitude === 0) {
            return vector;
        }
        return vector.map((val) => val / magnitude);
    }
    cosineSimilarity(a, b) {
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
    matchesFilter(vector, filter) {
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
    ensureInitialized() {
        if (!this.initialized) {
            throw new errors_1.DatabaseError('VectorStore not initialized. Call initialize() first.');
        }
    }
    async clear() {
        this.ensureInitialized();
        this.vectors.clear();
        this.indexReady = false;
        this.logger.info('VectorStore cleared');
    }
    async getAllIds() {
        this.ensureInitialized();
        return Array.from(this.vectors.keys());
    }
    async getVectorsByMetadata(metadata, limit) {
        this.ensureInitialized();
        const results = [];
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
exports.VectorStore = VectorStore;
class HNSWIndex {
    constructor(m = 16, efConstruction = 200, efSearch = 100) {
        this.logger = (0, logger_1.createLogger)('HNSWIndex');
        this.vectors = new Map();
        this.level = 0;
        this.m = 16;
        this.efConstruction = 200;
        this.efSearch = 100;
        this.maxLevel = 16;
        this.enterPoint = null;
        this.m = m;
        this.efConstruction = efConstruction;
        this.efSearch = efSearch;
        this.logger.info('HNSWIndex created', { m, efConstruction, efSearch });
    }
    async addVector(vector) {
        this.vectors.set(vector.id, vector);
    }
    async search(query, k = 10) {
        const results = [];
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
    cosineSimilarity(a, b) {
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
    async clear() {
        this.vectors.clear();
    }
}
exports.HNSWIndex = HNSWIndex;
exports.vectorStore = new VectorStore();
exports.default = VectorStore;
//# sourceMappingURL=VectorStore.js.map