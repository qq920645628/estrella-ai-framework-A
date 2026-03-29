"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeFusionService = exports.KnowledgeFusionService = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const utils_1 = require("@common/utils");
const DEFAULT_FUSION_CONFIG = {
    conflictResolutionStrategy: 'CONFIDENCE',
    enableDeduplication: true,
    similarityThreshold: 0.85,
    enableTemporalReasoning: true,
};
class KnowledgeFusionService {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)('KnowledgeFusionService');
        this.config = { ...DEFAULT_FUSION_CONFIG, ...config };
        this.knowledgeGraph = this.createEmptyGraph();
        this.logger.info('KnowledgeFusionService initialized', { config: this.config });
    }
    createEmptyGraph() {
        return {
            nodes: [],
            edges: [],
            metadata: {
                totalNodes: 0,
                totalEdges: 0,
                createdAt: new Date(),
                lastUpdatedAt: new Date(),
            },
        };
    }
    async fuseEntries(entries) {
        try {
            this.logger.info('Starting knowledge fusion', { entryCount: entries.length });
            if (entries.length === 0) {
                return (0, utils_1.ok)([]);
            }
            const fusedEntries = [];
            const groupedEntries = this.groupByContent(entries);
            for (const [contentHash, group] of groupedEntries) {
                if (group.length === 1) {
                    fusedEntries.push(group[0]);
                }
                else {
                    const fused = await this.fuseGroup(group);
                    fusedEntries.push(fused);
                }
            }
            this.logger.info('Knowledge fusion completed', {
                inputCount: entries.length,
                outputCount: fusedEntries.length,
                deduplicatedCount: entries.length - fusedEntries.length,
            });
            return (0, utils_1.ok)(fusedEntries);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown fusion error';
            this.logger.error('Knowledge fusion failed', error);
            return (0, utils_1.err)(new errors_1.KnowledgeProcessingError(errMsg));
        }
    }
    groupByContent(entries) {
        const groups = new Map();
        for (const entry of entries) {
            const hash = this.computeContentHash(entry.content);
            const existing = groups.get(hash) || [];
            existing.push(entry);
            groups.set(hash, existing);
        }
        return groups;
    }
    computeContentHash(content) {
        const normalized = content.toLowerCase().trim();
        const hash = require('crypto')
            .createHash('sha256')
            .update(normalized)
            .digest('hex')
            .substring(0, 16);
        return hash;
    }
    async fuseGroup(entries) {
        this.logger.debug('Fusing entry group', { size: entries.length });
        entries.sort((a, b) => b.confidence - a.confidence);
        const primary = entries[0];
        const fused = {
            ...primary,
            id: primary.id,
            entities: [],
            relations: [],
            tags: [],
        };
        const mergedEntities = this.mergeEntities(entries.flatMap((e) => e.entities));
        fused.entities = mergedEntities;
        const mergedRelations = this.mergeRelations(entries.flatMap((e) => e.relations));
        fused.relations = mergedRelations;
        const mergedTags = this.mergeTags(entries.flatMap((e) => e.tags));
        fused.tags = mergedTags;
        const avgConfidence = entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length;
        fused.confidence = Math.round(avgConfidence * 100) / 100;
        fused.updatedAt = new Date();
        fused.version++;
        return fused;
    }
    mergeEntities(entities) {
        const merged = [];
        const seen = new Map();
        for (const entity of entities) {
            const key = `${entity.type}:${entity.name}`;
            if (seen.has(key)) {
                const existing = seen.get(key);
                if (entity.confidence > existing.confidence) {
                    seen.set(key, entity);
                }
                else {
                    existing.attributes = { ...existing.attributes, ...entity.attributes };
                    existing.confidence =
                        (existing.confidence + entity.confidence) / 2;
                }
            }
            else {
                seen.set(key, { ...entity });
            }
        }
        return Array.from(seen.values());
    }
    mergeRelations(relations) {
        const merged = [];
        const seen = new Set();
        for (const relation of relations) {
            const key = `${relation.sourceEntityId}:${relation.relationType}:${relation.targetEntityId}`;
            if (!seen.has(key)) {
                seen.add(key);
                merged.push(relation);
            }
        }
        return merged;
    }
    mergeTags(tags) {
        const tagSet = new Set(tags.map((t) => t.toLowerCase().trim()));
        return Array.from(tagSet);
    }
    async addToGraph(entities, relations) {
        try {
            for (const entity of entities) {
                const existingNode = this.findNodeByEntityId(entity.id);
                if (existingNode) {
                    existingNode.attributes = { ...existingNode.attributes, ...entity.attributes };
                    existingNode.inDegree = this.countIncomingEdges(existingNode.id);
                    existingNode.outDegree = this.countOutgoingEdges(existingNode.id);
                }
                else {
                    const node = {
                        id: (0, utils_1.generateId)(),
                        entityId: entity.id,
                        type: entity.type,
                        name: entity.name,
                        attributes: entity.attributes,
                        inDegree: 0,
                        outDegree: 0,
                    };
                    this.knowledgeGraph.nodes.push(node);
                }
            }
            for (const relation of relations) {
                const sourceNode = this.findNodeByEntityId(relation.sourceEntityId);
                const targetNode = this.findNodeByEntityId(relation.targetEntityId);
                if (sourceNode && targetNode) {
                    const existingEdge = this.findEdge(sourceNode.id, targetNode.id, relation.relationType);
                    if (existingEdge) {
                        existingEdge.weight = Math.max(existingEdge.weight, relation.confidence);
                    }
                    else {
                        const edge = {
                            id: relation.id,
                            sourceNodeId: sourceNode.id,
                            targetNodeId: targetNode.id,
                            relationType: relation.relationType,
                            weight: relation.confidence,
                            attributes: relation.attributes,
                        };
                        this.knowledgeGraph.edges.push(edge);
                        sourceNode.outDegree++;
                        targetNode.inDegree++;
                    }
                }
            }
            this.updateGraphMetadata();
            this.logger.info('Added entities and relations to graph', {
                entitiesAdded: entities.length,
                relationsAdded: relations.length,
                totalNodes: this.knowledgeGraph.metadata.totalNodes,
                totalEdges: this.knowledgeGraph.metadata.totalEdges,
            });
            return (0, utils_1.ok)(undefined);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown graph error';
            this.logger.error('Failed to add to graph', error);
            return (0, utils_1.err)(new errors_1.KnowledgeProcessingError(errMsg));
        }
    }
    findNodeByEntityId(entityId) {
        return this.knowledgeGraph.nodes.find((n) => n.entityId === entityId);
    }
    findEdge(sourceNodeId, targetNodeId, relationType) {
        return this.knowledgeGraph.edges.find((e) => e.sourceNodeId === sourceNodeId &&
            e.targetNodeId === targetNodeId &&
            e.relationType === relationType);
    }
    countIncomingEdges(nodeId) {
        return this.knowledgeGraph.edges.filter((e) => e.targetNodeId === nodeId).length;
    }
    countOutgoingEdges(nodeId) {
        return this.knowledgeGraph.edges.filter((e) => e.sourceNodeId === nodeId).length;
    }
    updateGraphMetadata() {
        this.knowledgeGraph.metadata = {
            totalNodes: this.knowledgeGraph.nodes.length,
            totalEdges: this.knowledgeGraph.edges.length,
            createdAt: this.knowledgeGraph.metadata.createdAt,
            lastUpdatedAt: new Date(),
        };
    }
    getGraph() {
        return {
            ...this.knowledgeGraph,
            nodes: [...this.knowledgeGraph.nodes],
            edges: [...this.knowledgeGraph.edges],
        };
    }
    async findPath(startEntityId, endEntityId, maxDepth = 3) {
        try {
            const startNode = this.findNodeByEntityId(startEntityId);
            const endNode = this.findNodeByEntityId(endEntityId);
            if (!startNode || !endNode) {
                return (0, utils_1.err)(new errors_1.NotFoundError('Entity not found in graph'));
            }
            const visited = new Set();
            const path = [];
            const found = this.bfs(startNode.id, endNode.id, maxDepth, visited, path);
            if (found) {
                return (0, utils_1.ok)(path);
            }
            else {
                return (0, utils_1.err)(new errors_1.KnowledgeProcessingError('No path found between entities'));
            }
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown path error';
            return (0, utils_1.err)(new errors_1.KnowledgeProcessingError(errMsg));
        }
    }
    bfs(startId, endId, maxDepth, visited, path) {
        if (startId === endId) {
            path.push(startId);
            return true;
        }
        if (maxDepth === 0) {
            return false;
        }
        visited.add(startId);
        path.push(startId);
        const neighbors = this.getNeighbors(startId);
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                if (this.bfs(neighbor, endId, maxDepth - 1, visited, path)) {
                    return true;
                }
            }
        }
        path.pop();
        return false;
    }
    getNeighbors(nodeId) {
        const neighbors = new Set();
        for (const edge of this.knowledgeGraph.edges) {
            if (edge.sourceNodeId === nodeId) {
                neighbors.add(edge.targetNodeId);
            }
            if (edge.targetNodeId === nodeId) {
                neighbors.add(edge.sourceNodeId);
            }
        }
        return Array.from(neighbors);
    }
    calculateCentrality() {
        const centrality = new Map();
        for (const node of this.knowledgeGraph.nodes) {
            const degree = node.inDegree + node.outDegree;
            centrality.set(node.id, degree);
        }
        return centrality;
    }
    async getSubgraph(entityIds, depth = 1) {
        try {
            const nodeIds = new Set();
            const edgeIds = new Set();
            for (const entityId of entityIds) {
                const node = this.findNodeByEntityId(entityId);
                if (node) {
                    nodeIds.add(node.id);
                    this.expandSubgraph(node.id, depth, nodeIds, edgeIds);
                }
            }
            const subgraph = {
                nodes: this.knowledgeGraph.nodes.filter((n) => nodeIds.has(n.id)),
                edges: this.knowledgeGraph.edges.filter((e) => edgeIds.has(e.id)),
                metadata: {
                    totalNodes: nodeIds.size,
                    totalEdges: edgeIds.size,
                    createdAt: new Date(),
                    lastUpdatedAt: new Date(),
                },
            };
            return (0, utils_1.ok)(subgraph);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown subgraph error';
            return (0, utils_1.err)(new errors_1.KnowledgeProcessingError(errMsg));
        }
    }
    expandSubgraph(nodeId, remainingDepth, nodeIds, edgeIds) {
        if (remainingDepth === 0)
            return;
        for (const edge of this.knowledgeGraph.edges) {
            if (edge.sourceNodeId === nodeId) {
                nodeIds.add(edge.targetNodeId);
                edgeIds.add(edge.id);
                this.expandSubgraph(edge.targetNodeId, remainingDepth - 1, nodeIds, edgeIds);
            }
            if (edge.targetNodeId === nodeId) {
                nodeIds.add(edge.sourceNodeId);
                edgeIds.add(edge.id);
                this.expandSubgraph(edge.sourceNodeId, remainingDepth - 1, nodeIds, edgeIds);
            }
        }
    }
    getStatistics() {
        const degrees = this.knowledgeGraph.nodes.map((n) => ({
            id: n.id,
            name: n.name,
            degree: n.inDegree + n.outDegree,
        }));
        degrees.sort((a, b) => b.degree - a.degree);
        const totalDegree = degrees.reduce((sum, n) => sum + n.degree, 0);
        const avgDegree = degrees.length > 0 ? totalDegree / degrees.length : 0;
        return {
            totalNodes: this.knowledgeGraph.metadata.totalNodes,
            totalEdges: this.knowledgeGraph.metadata.totalEdges,
            avgDegree: Math.round(avgDegree * 100) / 100,
            mostConnectedNodes: degrees.slice(0, 10),
        };
    }
    clearGraph() {
        this.knowledgeGraph = this.createEmptyGraph();
        this.logger.info('Knowledge graph cleared');
    }
}
exports.KnowledgeFusionService = KnowledgeFusionService;
exports.knowledgeFusionService = new KnowledgeFusionService();
exports.default = KnowledgeFusionService;
//# sourceMappingURL=KnowledgeFusionService.js.map