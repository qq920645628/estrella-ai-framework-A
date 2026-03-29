import { createLogger } from '@common/logger';
import {
  KnowledgeProcessingError,
  ValidationError,
  NotFoundError,
} from '@common/errors';
import {
  KnowledgeEntry,
  KnowledgeEntryType,
  ExtractedEntity,
  ExtractedRelation,
  EntityStatus,
  AuditableEntity,
} from '@common/types';
import { Result, ok, err, generateId } from '@common/utils';

export interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    createdAt: Date;
    lastUpdatedAt: Date;
  };
}

export interface GraphNode {
  id: string;
  entityId: string;
  type: string;
  name: string;
  attributes: Record<string, unknown>;
  inDegree: number;
  outDegree: number;
  centrality?: number;
}

export interface GraphEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  relationType: string;
  weight: number;
  attributes: Record<string, unknown>;
}

export interface FusionConfig {
  conflictResolutionStrategy: 'CONFIDENCE' | 'RECENCY' | 'MAJORITY' | 'MANUAL';
  enableDeduplication: boolean;
  similarityThreshold: number;
  enableTemporalReasoning: boolean;
}

const DEFAULT_FUSION_CONFIG: FusionConfig = {
  conflictResolutionStrategy: 'CONFIDENCE',
  enableDeduplication: true,
  similarityThreshold: 0.85,
  enableTemporalReasoning: true,
};

export class KnowledgeFusionService {
  private readonly logger = createLogger('KnowledgeFusionService');
  private readonly config: FusionConfig;
  private knowledgeGraph: KnowledgeGraph;

  constructor(config: Partial<FusionConfig> = {}) {
    this.config = { ...DEFAULT_FUSION_CONFIG, ...config };
    this.knowledgeGraph = this.createEmptyGraph();
    this.logger.info('KnowledgeFusionService initialized', { config: this.config });
  }

  private createEmptyGraph(): KnowledgeGraph {
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

  public async fuseEntries(
    entries: KnowledgeEntry[]
  ): Promise<Result<KnowledgeEntry[]>> {
    try {
      this.logger.info('Starting knowledge fusion', { entryCount: entries.length });

      if (entries.length === 0) {
        return ok([]);
      }

      const fusedEntries: KnowledgeEntry[] = [];

      const groupedEntries = this.groupByContent(entries);

      for (const [contentHash, group] of groupedEntries) {
        if (group.length === 1) {
          fusedEntries.push(group[0]);
        } else {
          const fused = await this.fuseGroup(group);
          fusedEntries.push(fused);
        }
      }

      this.logger.info('Knowledge fusion completed', {
        inputCount: entries.length,
        outputCount: fusedEntries.length,
        deduplicatedCount: entries.length - fusedEntries.length,
      });

      return ok(fusedEntries);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown fusion error';
      this.logger.error('Knowledge fusion failed', error as Error);
      return err(new KnowledgeProcessingError(errMsg));
    }
  }

  private groupByContent(entries: KnowledgeEntry[]): Map<string, KnowledgeEntry[]> {
    const groups = new Map<string, KnowledgeEntry[]>();

    for (const entry of entries) {
      const hash = this.computeContentHash(entry.content);
      const existing = groups.get(hash) || [];
      existing.push(entry);
      groups.set(hash, existing);
    }

    return groups;
  }

  private computeContentHash(content: string): string {
    const normalized = content.toLowerCase().trim();
    const hash = require('crypto')
      .createHash('sha256')
      .update(normalized)
      .digest('hex')
      .substring(0, 16);
    return hash;
  }

  private async fuseGroup(entries: KnowledgeEntry[]): Promise<KnowledgeEntry> {
    this.logger.debug('Fusing entry group', { size: entries.length });

    entries.sort((a, b) => b.confidence - a.confidence);

    const primary = entries[0];
    const fused: KnowledgeEntry = {
      ...primary,
      id: primary.id,
      entities: [],
      relations: [],
      tags: [],
    };

    const mergedEntities = this.mergeEntities(
      entries.flatMap((e) => e.entities)
    );
    fused.entities = mergedEntities;

    const mergedRelations = this.mergeRelations(
      entries.flatMap((e) => e.relations)
    );
    fused.relations = mergedRelations;

    const mergedTags = this.mergeTags(entries.flatMap((e) => e.tags));
    fused.tags = mergedTags;

    const avgConfidence =
      entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length;
    fused.confidence = Math.round(avgConfidence * 100) / 100;

    fused.updatedAt = new Date();
    fused.version++;

    return fused;
  }

  private mergeEntities(entities: ExtractedEntity[]): ExtractedEntity[] {
    const merged: ExtractedEntity[] = [];
    const seen = new Map<string, ExtractedEntity>();

    for (const entity of entities) {
      const key = `${entity.type}:${entity.name}`;

      if (seen.has(key)) {
        const existing = seen.get(key)!;
        if (entity.confidence > existing.confidence) {
          seen.set(key, entity);
        } else {
          existing.attributes = { ...existing.attributes, ...entity.attributes };
          existing.confidence =
            (existing.confidence + entity.confidence) / 2;
        }
      } else {
        seen.set(key, { ...entity });
      }
    }

    return Array.from(seen.values());
  }

  private mergeRelations(relations: ExtractedRelation[]): ExtractedRelation[] {
    const merged: ExtractedRelation[] = [];
    const seen = new Set<string>();

    for (const relation of relations) {
      const key = `${relation.sourceEntityId}:${relation.relationType}:${relation.targetEntityId}`;

      if (!seen.has(key)) {
        seen.add(key);
        merged.push(relation);
      }
    }

    return merged;
  }

  private mergeTags(tags: string[]): string[] {
    const tagSet = new Set(tags.map((t) => t.toLowerCase().trim()));
    return Array.from(tagSet);
  }

  public async addToGraph(
    entities: ExtractedEntity[],
    relations: ExtractedRelation[]
  ): Promise<Result<void>> {
    try {
      for (const entity of entities) {
        const existingNode = this.findNodeByEntityId(entity.id);

        if (existingNode) {
          existingNode.attributes = { ...existingNode.attributes, ...entity.attributes };
          existingNode.inDegree = this.countIncomingEdges(existingNode.id);
          existingNode.outDegree = this.countOutgoingEdges(existingNode.id);
        } else {
          const node: GraphNode = {
            id: generateId(),
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
          } else {
            const edge: GraphEdge = {
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

      return ok(undefined);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown graph error';
      this.logger.error('Failed to add to graph', error as Error);
      return err(new KnowledgeProcessingError(errMsg));
    }
  }

  private findNodeByEntityId(entityId: string): GraphNode | undefined {
    return this.knowledgeGraph.nodes.find((n) => n.entityId === entityId);
  }

  private findEdge(sourceNodeId: string, targetNodeId: string, relationType: string): GraphEdge | undefined {
    return this.knowledgeGraph.edges.find(
      (e) =>
        e.sourceNodeId === sourceNodeId &&
        e.targetNodeId === targetNodeId &&
        e.relationType === relationType
    );
  }

  private countIncomingEdges(nodeId: string): number {
    return this.knowledgeGraph.edges.filter((e) => e.targetNodeId === nodeId).length;
  }

  private countOutgoingEdges(nodeId: string): number {
    return this.knowledgeGraph.edges.filter((e) => e.sourceNodeId === nodeId).length;
  }

  private updateGraphMetadata(): void {
    this.knowledgeGraph.metadata = {
      totalNodes: this.knowledgeGraph.nodes.length,
      totalEdges: this.knowledgeGraph.edges.length,
      createdAt: this.knowledgeGraph.metadata.createdAt,
      lastUpdatedAt: new Date(),
    };
  }

  public getGraph(): KnowledgeGraph {
    return {
      ...this.knowledgeGraph,
      nodes: [...this.knowledgeGraph.nodes],
      edges: [...this.knowledgeGraph.edges],
    };
  }

  public async findPath(
    startEntityId: string,
    endEntityId: string,
    maxDepth: number = 3
  ): Promise<Result<string[]>> {
    try {
      const startNode = this.findNodeByEntityId(startEntityId);
      const endNode = this.findNodeByEntityId(endEntityId);

      if (!startNode || !endNode) {
        return err(new NotFoundError('Entity not found in graph'));
      }

      const visited = new Set<string>();
      const path: string[] = [];

      const found = this.bfs(startNode.id, endNode.id, maxDepth, visited, path);

      if (found) {
        return ok(path);
      } else {
        return err(new KnowledgeProcessingError('No path found between entities'));
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown path error';
      return err(new KnowledgeProcessingError(errMsg));
    }
  }

  private bfs(
    startId: string,
    endId: string,
    maxDepth: number,
    visited: Set<string>,
    path: string[]
  ): boolean {
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

  private getNeighbors(nodeId: string): string[] {
    const neighbors = new Set<string>();

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

  public calculateCentrality(): Map<string, number> {
    const centrality = new Map<string, number>();

    for (const node of this.knowledgeGraph.nodes) {
      const degree = node.inDegree + node.outDegree;
      centrality.set(node.id, degree);
    }

    return centrality;
  }

  public async getSubgraph(
    entityIds: string[],
    depth: number = 1
  ): Promise<Result<KnowledgeGraph>> {
    try {
      const nodeIds = new Set<string>();
      const edgeIds = new Set<string>();

      for (const entityId of entityIds) {
        const node = this.findNodeByEntityId(entityId);
        if (node) {
          nodeIds.add(node.id);
          this.expandSubgraph(node.id, depth, nodeIds, edgeIds);
        }
      }

      const subgraph: KnowledgeGraph = {
        nodes: this.knowledgeGraph.nodes.filter((n) => nodeIds.has(n.id)),
        edges: this.knowledgeGraph.edges.filter((e) => edgeIds.has(e.id)),
        metadata: {
          totalNodes: nodeIds.size,
          totalEdges: edgeIds.size,
          createdAt: new Date(),
          lastUpdatedAt: new Date(),
        },
      };

      return ok(subgraph);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown subgraph error';
      return err(new KnowledgeProcessingError(errMsg));
    }
  }

  private expandSubgraph(
    nodeId: string,
    remainingDepth: number,
    nodeIds: Set<string>,
    edgeIds: Set<string>
  ): void {
    if (remainingDepth === 0) return;

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

  public getStatistics(): {
    totalNodes: number;
    totalEdges: number;
    avgDegree: number;
    mostConnectedNodes: Array<{ id: string; name: string; degree: number }>;
  } {
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

  public clearGraph(): void {
    this.knowledgeGraph = this.createEmptyGraph();
    this.logger.info('Knowledge graph cleared');
  }
}

export const knowledgeFusionService = new KnowledgeFusionService();

export default KnowledgeFusionService;
