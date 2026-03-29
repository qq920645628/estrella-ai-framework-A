"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningControlService = exports.LearningControlService = exports.LearningStrategy = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const types_1 = require("@common/types");
const utils_1 = require("@common/utils");
var LearningStrategy;
(function (LearningStrategy) {
    LearningStrategy["EPSILON_GREEDY"] = "EPSILON_GREEDY";
    LearningStrategy["UCB1"] = "UCB1";
    LearningStrategy["THOMPSON_SAMPLING"] = "THOMPSON_SAMPLING";
    LearningStrategy["REINFORCE"] = "REINFORCE";
    LearningStrategy["DQN"] = "DQN";
})(LearningStrategy || (exports.LearningStrategy = LearningStrategy = {}));
const DEFAULT_CONFIG = {
    strategy: LearningStrategy.EPSILON_GREEDY,
    epsilon: 0.1,
    epsilonDecay: 0.995,
    epsilonMin: 0.01,
    learningRate: 0.001,
    discountFactor: 0.95,
    explorationBonus: 2.0,
    batchSize: 32,
    memorySize: 10000,
    targetUpdateFrequency: 100,
};
class LearningControlService {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)('LearningControlService');
        this.policies = new Map();
        this.episodeMemory = [];
        this.actionRewards = new Map();
        this.initialized = false;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.epsilon = this.config.epsilon;
        this.metrics = this.createInitialMetrics();
        this.logger.info('LearningControlService initialized', { config: this.config });
    }
    createInitialMetrics() {
        return {
            totalEpisodes: 0,
            totalRewards: 0,
            averageReward: 0,
            explorationRate: this.epsilon,
            convergenceScore: 0,
        };
    }
    async initialize() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.logger.info('LearningControlService setup complete');
    }
    async shutdown() {
        this.initialized = false;
        this.policies.clear();
        this.episodeMemory = [];
        this.actionRewards.clear();
        this.logger.info('LearningControlService shutdown complete');
    }
    async selectAction(policyId, state) {
        try {
            const policy = this.policies.get(policyId);
            if (!policy) {
                return (0, utils_1.err)(new errors_1.ValidationError(`Policy not found: ${policyId}`));
            }
            const exploration = this.shouldExplore();
            let selectedAction;
            if (exploration) {
                selectedAction = this.selectRandomAction(policy);
                this.logger.debug('Exploration: selected random action', { action: selectedAction.name });
            }
            else {
                selectedAction = this.selectBestAction(policy);
                this.logger.debug('Exploitation: selected best action', { action: selectedAction.name, score: selectedAction.score });
            }
            return (0, utils_1.ok)(selectedAction);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown selection error';
            this.logger.error('Action selection failed', error);
            return (0, utils_1.err)(new errors_1.LearningError(errMsg));
        }
    }
    shouldExplore() {
        return Math.random() < this.epsilon;
    }
    selectRandomAction(policy) {
        const actions = Array.from(policy.actionScores.keys());
        const randomIndex = Math.floor(Math.random() * actions.length);
        const actionName = actions[randomIndex];
        return {
            id: (0, utils_1.generateId)(),
            name: actionName,
            score: policy.actionScores.get(actionName) || 0,
            count: policy.actionCounts.get(actionName) || 0,
        };
    }
    selectBestAction(policy) {
        let bestActionName = '';
        let bestScore = -Infinity;
        for (const [actionName, score] of policy.actionScores.entries()) {
            let adjustedScore = score;
            if (this.config.strategy === LearningStrategy.UCB1 && policy.totalSelections > 0) {
                const count = policy.actionCounts.get(actionName) || 0;
                if (count > 0) {
                    const ucb1Bonus = this.config.explorationBonus * Math.sqrt(Math.log(policy.totalSelections) / count);
                    adjustedScore += ucb1Bonus;
                }
            }
            if (adjustedScore > bestScore) {
                bestScore = adjustedScore;
                bestActionName = actionName;
            }
        }
        return {
            id: (0, utils_1.generateId)(),
            name: bestActionName,
            score: bestScore,
            count: policy.actionCounts.get(bestActionName) || 0,
        };
    }
    async recordFeedback(feedback) {
        try {
            this.logger.debug('Recording feedback', { taskId: feedback.taskId, feedbackType: feedback.feedback });
            const policyId = `policy_${feedback.taskId}`;
            let policy = this.policies.get(policyId);
            if (!policy) {
                policy = this.createPolicy(policyId, feedback.query);
                this.policies.set(policyId, policy);
            }
            const reward = this.computeReward(feedback);
            const action = feedback.retrievedIds[0] || 'unknown';
            await this.recordEpisode({
                id: (0, utils_1.generateId)(),
                state: feedback.query,
                action,
                reward,
                done: true,
                timestamp: new Date(),
            });
            this.updatePolicy(policy, action, reward);
            this.updateMetrics(reward);
            this.decayEpsilon();
            return (0, utils_1.ok)(undefined);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown feedback error';
            this.logger.error('Failed to record feedback', error);
            return (0, utils_1.err)(new errors_1.LearningError(errMsg));
        }
    }
    computeReward(feedback) {
        switch (feedback.feedback) {
            case types_1.LearningFeedbackType.RELEVANT:
                return 1.0;
            case types_1.LearningFeedbackType.PARTIALLY_RELEVANT:
                return 0.5;
            case types_1.LearningFeedbackType.BOOKMARK:
                return 0.3;
            case types_1.LearningFeedbackType.IRRELEVANT:
                return -0.5;
            case types_1.LearningFeedbackType.BAD:
                return -1.0;
            default:
                return 0;
        }
    }
    async recordEpisode(episode) {
        this.episodeMemory.push(episode);
        if (this.episodeMemory.length > this.config.memorySize) {
            this.episodeMemory.shift();
        }
        const rewards = this.actionRewards.get(episode.action) || [];
        rewards.push(episode.reward);
        if (rewards.length > 1000) {
            rewards.shift();
        }
        this.actionRewards.set(episode.action, rewards);
    }
    updatePolicy(policy, action, reward) {
        const currentScore = policy.actionScores.get(action) || 0;
        const count = (policy.actionCounts.get(action) || 0) + 1;
        let newScore;
        switch (this.config.strategy) {
            case LearningStrategy.REINFORCE:
                newScore = currentScore + this.config.learningRate * (reward - currentScore);
                break;
            case LearningStrategy.EPSILON_GREEDY:
            case LearningStrategy.UCB1:
            default:
                newScore = currentScore + this.config.learningRate * (reward - currentScore);
                break;
        }
        policy.actionScores.set(action, newScore);
        policy.actionCounts.set(action, count);
        policy.totalSelections++;
        policy.lastUpdated = new Date();
    }
    updateMetrics(reward) {
        this.metrics.totalEpisodes++;
        this.metrics.totalRewards += reward;
        this.metrics.averageReward = this.metrics.totalRewards / this.metrics.totalEpisodes;
        this.metrics.explorationRate = this.epsilon;
        this.calculateConvergenceScore();
    }
    calculateConvergenceScore() {
        let maxDiff = 0;
        for (const [, scores] of this.policies) {
            const scoreArray = Array.from(scores.actionScores.values());
            if (scoreArray.length < 2)
                continue;
            scoreArray.sort((a, b) => a - b);
            const diff = scoreArray[scoreArray.length - 1] - scoreArray[0];
            maxDiff = Math.max(maxDiff, diff);
        }
        this.metrics.convergenceScore = Math.max(0, 1 - maxDiff);
    }
    decayEpsilon() {
        if (this.epsilon > this.config.epsilonMin) {
            this.epsilon *= this.config.epsilonDecay;
            this.epsilon = Math.max(this.epsilon, this.config.epsilonMin);
        }
    }
    createPolicy(id, name) {
        return {
            id,
            name,
            actionScores: new Map(),
            actionCounts: new Map(),
            totalSelections: 0,
            lastUpdated: new Date(),
        };
    }
    async addAction(policyId, actionName, initialScore = 0) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return (0, utils_1.err)(new errors_1.ValidationError(`Policy not found: ${policyId}`));
        }
        if (!policy.actionScores.has(actionName)) {
            policy.actionScores.set(actionName, initialScore);
            policy.actionCounts.set(actionName, 0);
            this.logger.debug('Added action to policy', { policyId, actionName });
        }
        return (0, utils_1.ok)(undefined);
    }
    async removeAction(policyId, actionName) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return (0, utils_1.err)(new errors_1.ValidationError(`Policy not found: ${policyId}`));
        }
        policy.actionScores.delete(actionName);
        policy.actionCounts.delete(actionName);
        this.logger.debug('Removed action from policy', { policyId, actionName });
        return (0, utils_1.ok)(undefined);
    }
    getPolicy(policyId) {
        return this.policies.get(policyId);
    }
    getAllPolicies() {
        return Array.from(this.policies.values());
    }
    getMetrics() {
        return { ...this.metrics };
    }
    getActionStatistics(actionName) {
        const rewards = this.actionRewards.get(actionName);
        if (!rewards || rewards.length === 0) {
            return null;
        }
        return {
            averageReward: rewards.reduce((a, b) => a + b, 0) / rewards.length,
            selectionCount: rewards.length,
            lastReward: rewards[rewards.length - 1],
        };
    }
    async resetPolicy(policyId) {
        const policy = this.policies.get(policyId);
        if (!policy) {
            return (0, utils_1.err)(new errors_1.ValidationError(`Policy not found: ${policyId}`));
        }
        for (const action of policy.actionScores.keys()) {
            policy.actionScores.set(action, 0);
            policy.actionCounts.set(action, 0);
        }
        policy.totalSelections = 0;
        policy.lastUpdated = new Date();
        this.logger.info('Policy reset', { policyId });
        return (0, utils_1.ok)(undefined);
    }
    async resetAll() {
        this.policies.clear();
        this.episodeMemory = [];
        this.actionRewards.clear();
        this.metrics = this.createInitialMetrics();
        this.epsilon = this.config.epsilon;
        this.logger.info('All learning state reset');
    }
    updateConfig(config) {
        this.config.strategy = config.strategy ?? this.config.strategy;
        this.config.epsilon = config.epsilon ?? this.config.epsilon;
        this.config.learningRate = config.learningRate ?? this.config.learningRate;
        this.config.epsilonDecay = config.epsilonDecay ?? this.config.epsilonDecay;
        this.config.epsilonMin = config.epsilonMin ?? this.config.epsilonMin;
        if (config.epsilon !== undefined) {
            this.epsilon = config.epsilon;
        }
        this.logger.info('Learning config updated', { config: this.config });
    }
}
exports.LearningControlService = LearningControlService;
exports.learningControlService = new LearningControlService();
exports.default = LearningControlService;
//# sourceMappingURL=LearningControlService.js.map