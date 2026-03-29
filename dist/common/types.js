"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearningFeedbackType = exports.FilterOperator = exports.TaskPriority = exports.TaskStatus = exports.TaskType = exports.KnowledgeEntryType = exports.EntityStatus = void 0;
var EntityStatus;
(function (EntityStatus) {
    EntityStatus["ACTIVE"] = "ACTIVE";
    EntityStatus["INACTIVE"] = "INACTIVE";
    EntityStatus["DELETED"] = "DELETED";
    EntityStatus["PENDING"] = "PENDING";
})(EntityStatus || (exports.EntityStatus = EntityStatus = {}));
var KnowledgeEntryType;
(function (KnowledgeEntryType) {
    KnowledgeEntryType["DOCUMENT"] = "DOCUMENT";
    KnowledgeEntryType["EXTRACTION"] = "EXTRACTION";
    KnowledgeEntryType["FUSION"] = "FUSION";
    KnowledgeEntryType["UPDATE"] = "UPDATE";
})(KnowledgeEntryType || (exports.KnowledgeEntryType = KnowledgeEntryType = {}));
var TaskType;
(function (TaskType) {
    TaskType["KNOWLEDGE_EXTRACTION"] = "KNOWLEDGE_EXTRACTION";
    TaskType["KNOWLEDGE_FUSION"] = "KNOWLEDGE_FUSION";
    TaskType["INDEXING"] = "INDEXING";
    TaskType["RETRIEVAL"] = "RETRIEVAL";
    TaskType["LEARNING"] = "LEARNING";
    TaskType["CUSTOM"] = "CUSTOM";
})(TaskType || (exports.TaskType = TaskType = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["PENDING"] = "PENDING";
    TaskStatus["QUEUED"] = "QUEUED";
    TaskStatus["RUNNING"] = "RUNNING";
    TaskStatus["COMPLETED"] = "COMPLETED";
    TaskStatus["FAILED"] = "FAILED";
    TaskStatus["CANCELLED"] = "CANCELLED";
    TaskStatus["RETRYING"] = "RETRYING";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["NORMAL"] = 1] = "NORMAL";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
    TaskPriority[TaskPriority["CRITICAL"] = 3] = "CRITICAL";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
var FilterOperator;
(function (FilterOperator) {
    FilterOperator["EQ"] = "eq";
    FilterOperator["NE"] = "ne";
    FilterOperator["GT"] = "gt";
    FilterOperator["GTE"] = "gte";
    FilterOperator["LT"] = "lt";
    FilterOperator["LTE"] = "lte";
    FilterOperator["IN"] = "in";
    FilterOperator["NOT_IN"] = "not_in";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["NOT_CONTAINS"] = "not_contains";
    FilterOperator["BETWEEN"] = "between";
})(FilterOperator || (exports.FilterOperator = FilterOperator = {}));
var LearningFeedbackType;
(function (LearningFeedbackType) {
    LearningFeedbackType["RELEVANT"] = "RELEVANT";
    LearningFeedbackType["IRRELEVANT"] = "IRRELEVANT";
    LearningFeedbackType["PARTIALLY_RELEVANT"] = "PARTIALLY_RELEVANT";
    LearningFeedbackType["BOOKMARK"] = "BOOKMARK";
    LearningFeedbackType["BAD"] = "BAD";
})(LearningFeedbackType || (exports.LearningFeedbackType = LearningFeedbackType = {}));
//# sourceMappingURL=types.js.map