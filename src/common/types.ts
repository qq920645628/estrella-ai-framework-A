export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditableEntity extends Entity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
}

export interface BaseDocument {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  status: EntityStatus;
}

export interface KnowledgeEntry extends AuditableEntity {
  type: KnowledgeEntryType;
  content: string;
  embedding?: number[];
  entities: ExtractedEntity[];
  relations: ExtractedRelation[];
  confidence: number;
  source: string;
  tags: string[];
  status: EntityStatus;
}

export enum KnowledgeEntryType {
  DOCUMENT = 'DOCUMENT',
  EXTRACTION = 'EXTRACTION',
  FUSION = 'FUSION',
  UPDATE = 'UPDATE',
}

export interface ExtractedEntity {
  id: string;
  type: string;
  name: string;
  attributes: Record<string, unknown>;
  confidence: number;
  startPosition: number;
  endPosition: number;
}

export interface ExtractedRelation {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: string;
  attributes: Record<string, unknown>;
  confidence: number;
}

export interface Task extends AuditableEntity {
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  input: Record<string, unknown>;
  output?: Record<string, unknown>;
  error?: string;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  scheduledAt: Date;
  retryCount: number;
  maxRetries: number;
  dependencies: string[];
  metadata?: Record<string, unknown>;
}

export enum TaskType {
  KNOWLEDGE_EXTRACTION = 'KNOWLEDGE_EXTRACTION',
  KNOWLEDGE_FUSION = 'KNOWLEDGE_FUSION',
  INDEXING = 'INDEXING',
  RETRIEVAL = 'RETRIEVAL',
  LEARNING = 'LEARNING',
  CUSTOM = 'CUSTOM',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETRYING = 'RETRYING',
}

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

export interface RetrievalResult {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
  explanation?: string;
}

export interface QueryContext {
  query: string;
  filters?: QueryFilter[];
  limit: number;
  offset?: number;
  includeEmbeddings?: boolean;
  rerank?: boolean;
  hybrid?: boolean;
  useVector?: boolean;  // 是否使用向量搜索
}

export interface QueryFilter {
  field: string;
  operator: FilterOperator;
  value: unknown;
}

export enum FilterOperator {
  EQ = 'eq',
  NE = 'ne',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  NOT_IN = 'not_in',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  BETWEEN = 'between',
}

export interface LearningFeedback {
  taskId: string;
  query: string;
  retrievedIds: string[];
  selectedId?: string;
  relevanceScore?: number;
  feedback: LearningFeedbackType;
  metadata?: Record<string, unknown>;
}

export enum LearningFeedbackType {
  RELEVANT = 'RELEVANT',
  IRRELEVANT = 'IRRELEVANT',
  PARTIALLY_RELEVANT = 'PARTIALLY_RELEVANT',
  BOOKMARK = 'BOOKMARK',
  BAD = 'BAD',
}

export interface SystemMetrics {
  timestamp: Date;
  cpuUsage: number;
  memoryUsage: number;
  activeTasks: number;
  queuedTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  knowledgeEntryCount: number;
  retrievalCount: number;
  cacheHitRate: number;
}

// Re-export from utils for convenience
export type { PaginationParams, PaginatedResult } from './utils';
