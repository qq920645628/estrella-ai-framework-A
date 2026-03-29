export * from './RetrievalService';
export { QueryContext, RetrievalResult } from '@common/types';

import { RetrievalService } from './RetrievalService';
import { knowledgeRepository as kbRepo } from '@core/database/KnowledgeRepository';
import { VectorStore } from '@core/database/VectorStore';

// 初始化 knowledgeRepository
kbRepo.initialize().catch(console.error);

// 创建独立实例用于检索
export const retrievalVectorStore = new VectorStore();

// 初始化 vectorStore
retrievalVectorStore.initialize(1536).catch(console.error);

export const retrievalService = new RetrievalService(
  {
    defaultStrategy: 'HYBRID' as any,
    hybridAlpha: 0.5,
    maxResults: 10,
    minScore: 0.01,  // 降低阈值
    enableReranking: false,  // 禁用 reranking 简化调试
    rerankTopK: 20,
    enableCache: true,
    cacheSize: 1000,
    timeoutMs: 5000,
  },
  kbRepo,
  retrievalVectorStore
);
