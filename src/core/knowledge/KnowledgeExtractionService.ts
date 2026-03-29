import { createLogger } from '@common/logger';
import {
  KnowledgeProcessingError,
  ValidationError,
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

export interface ExtractionConfig {
  enableEntityExtraction: boolean;
  enableRelationExtraction: boolean;
  enableConceptExtraction: boolean;
  maxEntityCount: number;
  minConfidence: number;
  language?: string;
}

export interface ExtractionResult {
  entities: ExtractedEntity[];
  relations: ExtractedRelation[];
  concepts: Concept[];
  metadata: {
    extractionTime: number;
    language: string;
    confidence: number;
  };
}

export interface Concept {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  description?: string;
  confidence: number;
  relatedEntities: string[];
}

const DEFAULT_EXTRACTION_CONFIG: ExtractionConfig = {
  enableEntityExtraction: true,
  enableRelationExtraction: true,
  enableConceptExtraction: true,
  maxEntityCount: 1000,
  minConfidence: 0.5,
  language: 'zh-CN',
};

const ENTITY_PATTERNS: Record<string, RegExp[]> = {
  'zh-CN': [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
    /\b(\d{4}[-/年]\d{1,2}[-/月]\d{1,2}[日]?)\b/g,
    /\b(\d+(?:\.\d+)?[%亿元万元])\b/g,
    /\b([A-Z]+(?:-[A-Z]+)+)\b/g,
  ],
  'en-US': [
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g,
    /\b(\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/g,
    /\b(\$\d+(?:,\d{3})*(?:\.\d{2})?)\b/g,
    /\b([A-Z]{2,})\b/g,
  ],
};

const CONCEPT_CATEGORIES = [
  'PERSON',
  'ORGANIZATION',
  'LOCATION',
  'TIME',
  'MONEY',
  'PERCENT',
  'TECHNOLOGY',
  'EVENT',
  'PRODUCT',
];

export class KnowledgeExtractionService {
  private readonly logger = createLogger('KnowledgeExtractionService');
  private readonly config: ExtractionConfig;
  private entityCache: Map<string, ExtractedEntity> = new Map();
  private conceptCache: Map<string, Concept> = new Map();

  constructor(config: Partial<ExtractionConfig> = {}) {
    this.config = { ...DEFAULT_EXTRACTION_CONFIG, ...config };
    this.logger.info('KnowledgeExtractionService initialized', { config: this.config });
  }

  public async extract(text: string, context?: Record<string, unknown>): Promise<Result<ExtractionResult>> {
    const startTime = Date.now();

    if (!text || text.trim().length === 0) {
      return err(new ValidationError('Text cannot be empty'));
    }

    try {
      this.logger.debug('Starting extraction', { textLength: text.length, context });

      const entities: ExtractedEntity[] = [];
      const relations: ExtractedRelation[] = [];
      const concepts: Concept[] = [];

      if (this.config.enableEntityExtraction) {
        const extractedEntities = this.extractEntities(text);
        entities.push(...extractedEntities);
      }

      if (this.config.enableConceptExtraction) {
        const extractedConcepts = this.extractConcepts(text, entities);
        concepts.push(...extractedConcepts);
      }

      if (this.config.enableRelationExtraction && entities.length > 1) {
        const extractedRelations = this.extractRelations(text, entities);
        relations.push(...extractedRelations);
      }

      const filteredEntities = this.filterByConfidence(entities);
      const filteredRelations = this.filterByConfidence(relations);
      const filteredConcepts = this.filterConceptsByConfidence(concepts);

      const overallConfidence = this.calculateOverallConfidence(
        filteredEntities,
        filteredRelations,
        filteredConcepts
      );

      const result: ExtractionResult = {
        entities: filteredEntities,
        relations: filteredRelations,
        concepts: filteredConcepts,
        metadata: {
          extractionTime: Date.now() - startTime,
          language: this.config.language || 'auto',
          confidence: overallConfidence,
        },
      };

      this.updateCaches(filteredEntities, filteredConcepts);

      this.logger.info('Extraction completed', {
        entityCount: filteredEntities.length,
        relationCount: filteredRelations.length,
        conceptCount: filteredConcepts.length,
        duration: result.metadata.extractionTime,
      });

      return ok(result);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown extraction error';
      this.logger.error('Extraction failed', error as Error);
      return err(new KnowledgeProcessingError(errMsg, { textLength: text.length }));
    }
  }

  private extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];
    const patterns = ENTITY_PATTERNS[this.config.language || 'zh-CN'] || ENTITY_PATTERNS['zh-CN'];

    const addedTexts = new Set<string>();

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      const regex = new RegExp(pattern.source, pattern.flags);

      while ((match = regex.exec(text)) !== null) {
        const entityText = match[1] || match[0];
        const normalizedText = entityText.trim();

        if (
          normalizedText.length < 2 ||
          addedTexts.has(normalizedText) ||
          this.isStopWord(normalizedText)
        ) {
          continue;
        }

        addedTexts.add(normalizedText);

        const entity: ExtractedEntity = {
          id: generateId(),
          type: this.categorizeEntity(normalizedText, entityText),
          name: normalizedText,
          attributes: {
            originalText: entityText,
            matchIndex: match.index,
            matchedPattern: pattern.source,
          },
          confidence: this.calculateEntityConfidence(normalizedText, entityText),
          startPosition: match.index,
          endPosition: match.index + entityText.length,
        };

        entities.push(entity);

        if (entities.length >= this.config.maxEntityCount) {
          break;
        }
      }
    }

    return entities;
  }

  private categorizeEntity(entityText: string, originalMatch: string): string {
    const categoryPatterns: Array<{ category: string; patterns: RegExp[] }> = [
      {
        category: 'PERSON',
        patterns: [/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/],
      },
      {
        category: 'ORGANIZATION',
        patterns: [
          /公司|企业|集团|协会|组织|机构/,
          /\b(?:Inc|LLC|Corp|Ltd|Co)\.?$/i,
        ],
      },
      {
        category: 'LOCATION',
        patterns: [
          /省|市|区|县|镇|村|路|街|道/,
          /市|县|区$/,
        ],
      },
      {
        category: 'TIME',
        patterns: [/\d{4}[-/年]\d{1,2}[-/月]\d{1,2}/, /\d{4}年/, /昨天|今天|明天|上周|下周/],
      },
      {
        category: 'MONEY',
        patterns: [/[$￥€£]\d/, /\d+元|\d+万|\d+亿/],
      },
      {
        category: 'PERCENT',
        patterns: [/\d+%|百分之/],
      },
    ];

    for (const { category, patterns } of categoryPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(entityText) || pattern.test(originalMatch)) {
          return category;
        }
      }
    }

    return 'UNKNOWN';
  }

  private calculateEntityConfidence(entityText: string, originalMatch: string): number {
    let confidence = 0.7;

    if (entityText.length >= 2 && entityText.length <= 20) {
      confidence += 0.1;
    } else if (entityText.length > 50) {
      confidence -= 0.2;
    }

    if (/^[A-Z]/.test(entityText) || /^[\u4e00-\u9fa5]/.test(entityText)) {
      confidence += 0.1;
    }

    if (/\d/.test(entityText)) {
      confidence -= 0.05;
    }

    return Math.min(Math.max(confidence, 0), 1);
  }

  private extractConcepts(text: string, entities: ExtractedEntity[]): Concept[] {
    const concepts: Concept[] = [];
    const conceptNames = new Set<string>();

    for (const category of CONCEPT_CATEGORIES) {
      const categoryEntities = entities.filter((e) => e.type === category);

      if (categoryEntities.length >= 2) {
        const conceptName = `${category}_CLUSTER_${Date.now()}`;

        if (!conceptNames.has(category)) {
          conceptNames.add(category);

          const concept: Concept = {
            id: generateId(),
            name: category,
            category: 'ENTITY_CLUSTER',
            aliases: [],
            description: `Cluster of ${category} entities`,
            confidence: 0.8,
            relatedEntities: categoryEntities.map((e) => e.id),
          };

          concepts.push(concept);
        }
      }
    }

    const nounPhrases = this.extractNounPhrases(text);
    for (const phrase of nounPhrases) {
      if (phrase.length >= 3 && phrase.length <= 30) {
        const concept: Concept = {
          id: generateId(),
          name: phrase,
          category: 'PHRASE',
          aliases: [],
          relatedEntities: [],
          confidence: 0.6,
        };
        concepts.push(concept);
      }
    }

    return concepts;
  }

  private extractNounPhrases(text: string): string[] {
    const phrases: string[] = [];
    const patterns = [
      /\b([\u4e00-\u9fa5]{2,}(?:[\u4e00-\u9fa5a-zA-Z0-9]*[\u4e00-\u9fa5]+)+)/g,
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\b/g,
    ];

    for (const pattern of patterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(text)) !== null) {
        const phrase = match[1].trim();
        if (phrase.length >= 3) {
          phrases.push(phrase);
        }
      }
    }

    return phrases;
  }

  private extractRelations(text: string, entities: ExtractedEntity[]): ExtractedRelation[] {
    const relations: ExtractedRelation[] = [];

    const relationPatterns = [
      {
        type: 'WORKS_AT',
        pattern: /(.*?)(公司|企业|组织|机构)(.*)/,
        sourceTypes: ['PERSON'],
        targetTypes: ['ORGANIZATION'],
      },
      {
        type: 'LOCATED_IN',
        pattern: /(.*?)(位于|坐落于|在)(.*)/,
        sourceTypes: ['ORGANIZATION', 'LOCATION'],
        targetTypes: ['LOCATION'],
      },
      {
        type: 'FOUNDED_BY',
        pattern: /(.*?)(创立|创建|成立|创办)(.*)/,
        sourceTypes: ['ORGANIZATION'],
        targetTypes: ['PERSON'],
      },
    ];

    for (const relPattern of relationPatterns) {
      let match: RegExpExecArray | null;
      const regex = new RegExp(relPattern.pattern);

      while ((match = regex.exec(text)) !== null) {
        const sourceEntity = this.findNearestEntity(entities, match.index, relPattern.sourceTypes);
        const targetEntity = this.findNearestEntity(
          entities,
          match.index + match[0].length,
          relPattern.targetTypes
        );

        if (sourceEntity && targetEntity && sourceEntity.id !== targetEntity.id) {
          const relation: ExtractedRelation = {
            id: generateId(),
            sourceEntityId: sourceEntity.id,
            targetEntityId: targetEntity.id,
            relationType: relPattern.type,
            attributes: {
              matchedText: match[0],
              matchIndex: match.index,
            },
            confidence: 0.75,
          };
          relations.push(relation);
        }
      }
    }

    return this.deduplicateRelations(relations);
  }

  private findNearestEntity(
    entities: ExtractedEntity[],
    position: number,
    types: string[]
  ): ExtractedEntity | undefined {
    let nearest: ExtractedEntity | undefined;
    let minDistance = Infinity;

    for (const entity of entities) {
      if (!types.includes(entity.type)) continue;

      const entityCenter = (entity.startPosition + entity.endPosition) / 2;
      const distance = Math.abs(entityCenter - position);

      if (distance < minDistance) {
        minDistance = distance;
        nearest = entity;
      }
    }

    return nearest;
  }

  private deduplicateRelations(relations: ExtractedRelation[]): ExtractedRelation[] {
    const seen = new Set<string>();
    return relations.filter((rel) => {
      const key = `${rel.sourceEntityId}-${rel.relationType}-${rel.targetEntityId}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private filterByConfidence<T extends { confidence: number }>(items: T[]): T[] {
    return items.filter((item) => item.confidence >= this.config.minConfidence);
  }

  private filterConceptsByConfidence(concepts: Concept[]): Concept[] {
    return concepts.filter((c) => c.confidence >= this.config.minConfidence);
  }

  private calculateOverallConfidence(
    entities: ExtractedEntity[],
    relations: ExtractedRelation[],
    concepts: Concept[]
  ): number {
    const weights = {
      entity: 0.4,
      relation: 0.3,
      concept: 0.3,
    };

    const entityConf = entities.length > 0
      ? entities.reduce((sum, e) => sum + e.confidence, 0) / entities.length
      : 0;

    const relationConf = relations.length > 0
      ? relations.reduce((sum, r) => sum + r.confidence, 0) / relations.length
      : 0;

    const conceptConf = concepts.length > 0
      ? concepts.reduce((sum, c) => sum + c.confidence, 0) / concepts.length
      : 0;

    return Math.round((entityConf * weights.entity + relationConf * weights.relation + conceptConf * weights.concept) * 100) / 100;
  }

  private updateCaches(entities: ExtractedEntity[], concepts: Concept[]): void {
    if (this.entityCache.size > 10000) {
      const keys = Array.from(this.entityCache.keys()).slice(0, 5000);
      keys.forEach((k) => this.entityCache.delete(k));
    }

    for (const entity of entities) {
      this.entityCache.set(entity.id, entity);
    }

    for (const concept of concepts) {
      this.conceptCache.set(concept.id, concept);
    }
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很',
      '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', 'the', 'a', 'an', 'is',
    ]);
    return stopWords.has(word.toLowerCase());
  }

  public getCacheStats(): {
    entityCount: number;
    conceptCount: number;
  } {
    return {
      entityCount: this.entityCache.size,
      conceptCount: this.conceptCache.size,
    };
  }

  public clearCache(): void {
    this.entityCache.clear();
    this.conceptCache.clear();
    this.logger.info('Knowledge extraction cache cleared');
  }
}

export const knowledgeExtractionService = new KnowledgeExtractionService();

export default KnowledgeExtractionService;
