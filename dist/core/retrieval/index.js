"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrievalService = exports.retrievalVectorStore = void 0;
__exportStar(require("./RetrievalService"), exports);
const RetrievalService_1 = require("./RetrievalService");
const KnowledgeRepository_1 = require("@core/database/KnowledgeRepository");
const VectorStore_1 = require("@core/database/VectorStore");
// 初始化 knowledgeRepository
KnowledgeRepository_1.knowledgeRepository.initialize().catch(console.error);
// 创建独立实例用于检索
exports.retrievalVectorStore = new VectorStore_1.VectorStore();
// 初始化 vectorStore
exports.retrievalVectorStore.initialize(1536).catch(console.error);
exports.retrievalService = new RetrievalService_1.RetrievalService({
    defaultStrategy: 'HYBRID',
    hybridAlpha: 0.5,
    maxResults: 10,
    minScore: 0.01, // 降低阈值
    enableReranking: false, // 禁用 reranking 简化调试
    rerankTopK: 20,
    enableCache: true,
    cacheSize: 1000,
    timeoutMs: 5000,
}, KnowledgeRepository_1.knowledgeRepository, exports.retrievalVectorStore);
//# sourceMappingURL=index.js.map