import { createLogger } from '@common/logger';
import {
  LearningError,
  ValidationError,
} from '@common/errors';
import {
  LearningFeedback,
  LearningFeedbackType,
} from '@common/types';
import { Result, ok, err, generateId } from '@common/utils';

export enum LearningStrategy {
  EPSILON_GREEDY = 'EPSILON_GREEDY',
  UCB1 = 'UCB1',
  THOMPSON_SAMPLING = 'THOMPSON_SAMPLING',
  REINFORCE = 'REINFORCE',
  DQN = 'DQN',
}

export interface LearningConfig {
  strategy: LearningStrategy;
  epsilon: number;
  epsilonDecay: number;
  epsilonMin: number;
  learningRate: number;
  discountFactor: number;
  explorationBonus: number;
  batchSize: number;
  memorySize: number;
  targetUpdateFrequency: number;
}

export interface LearningPolicy {
  id: string;
  name: string;
  actionScores: Map<string, number>;
  actionCounts: Map<string, number>;
  totalSelections: number;
  lastUpdated: Date;
}

export interface LearningAction {
  id: string;
  name: string;
  score: number;
  count: number;
  lastReward?: number;
}

export interface LearningEpisode {
  id: string;
  state: string;
  action: string;
  reward: number;
  nextState?: string;
  done: boolean;
  timestamp: Date;
}

export interface LearningMetrics {
  totalEpisodes: number;
  totalRewards: number;
  averageReward: number;
  bestAction?: string;
  explorationRate: number;
  convergenceScore: number;
}

const DEFAULT_CONFIG: LearningConfig = {
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

export class LearningControlService {
  private readonly logger = createLogger('LearningControlService');
  private readonly config: LearningConfig;
  private policies: Map<string, LearningPolicy> = new Map();
  private episodeMemory: LearningEpisode[] = [];
  private actionRewards: Map<string, number[]> = new Map();
  private metrics: LearningMetrics;
  private epsilon: number;
  private initialized: boolean = false;

  constructor(config: Partial<LearningConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.epsilon = this.config.epsilon;
    this.metrics = this.createInitialMetrics();
    this.logger.info('LearningControlService initialized', { config: this.config });
  }

  private createInitialMetrics(): LearningMetrics {
    return {
      totalEpisodes: 0,
      totalRewards: 0,
      averageReward: 0,
      explorationRate: this.epsilon,
      convergenceScore: 0,
    };
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.logger.info('LearningControlService setup complete');
  }

  public async shutdown(): Promise<void> {
    this.initialized = false;
    this.policies.clear();
    this.episodeMemory = [];
    this.actionRewards.clear();
    this.logger.info('LearningControlService shutdown complete');
  }

  public async selectAction(policyId: string, state: string): Promise<Result<LearningAction>> {
    try {
      const policy = this.policies.get(policyId);
      if (!policy) {
        return err(new ValidationError(`Policy not found: ${policyId}`));
      }

      const exploration = this.shouldExplore();
      let selectedAction: LearningAction;

      if (exploration) {
        selectedAction = this.selectRandomAction(policy);
        this.logger.debug('Exploration: selected random action', { action: selectedAction.name });
      } else {
        selectedAction = this.selectBestAction(policy);
        this.logger.debug('Exploitation: selected best action', { action: selectedAction.name, score: selectedAction.score });
      }

      return ok(selectedAction);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown selection error';
      this.logger.error('Action selection failed', error as Error);
      return err(new LearningError(errMsg));
    }
  }

  private shouldExplore(): boolean {
    return Math.random() < this.epsilon;
  }

  private selectRandomAction(policy: LearningPolicy): LearningAction {
    const actions = Array.from(policy.actionScores.keys());
    const randomIndex = Math.floor(Math.random() * actions.length);
    const actionName = actions[randomIndex];

    return {
      id: generateId(),
      name: actionName,
      score: policy.actionScores.get(actionName) || 0,
      count: policy.actionCounts.get(actionName) || 0,
    };
  }

  private selectBestAction(policy: LearningPolicy): LearningAction {
    let bestActionName = '';
    let bestScore = -Infinity;

    for (const [actionName, score] of policy.actionScores.entries()) {
      let adjustedScore = score;

      if (this.config.strategy === LearningStrategy.UCB1 && policy.totalSelections > 0) {
        const count = policy.actionCounts.get(actionName) || 0;
        if (count > 0) {
          const ucb1Bonus = this.config.explorationBonus * Math.sqrt(
            Math.log(policy.totalSelections) / count
          );
          adjustedScore += ucb1Bonus;
        }
      }

      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestActionName = actionName;
      }
    }

    return {
      id: generateId(),
      name: bestActionName,
      score: bestScore,
      count: policy.actionCounts.get(bestActionName) || 0,
    };
  }

  public async recordFeedback(feedback: LearningFeedback): Promise<Result<void>> {
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
        id: generateId(),
        state: feedback.query,
        action,
        reward,
        done: true,
        timestamp: new Date(),
      });

      this.updatePolicy(policy, action, reward);
      this.updateMetrics(reward);

      this.decayEpsilon();

      return ok(undefined);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown feedback error';
      this.logger.error('Failed to record feedback', error as Error);
      return err(new LearningError(errMsg));
    }
  }

  private computeReward(feedback: LearningFeedback): number {
    switch (feedback.feedback) {
      case LearningFeedbackType.RELEVANT:
        return 1.0;
      case LearningFeedbackType.PARTIALLY_RELEVANT:
        return 0.5;
      case LearningFeedbackType.BOOKMARK:
        return 0.3;
      case LearningFeedbackType.IRRELEVANT:
        return -0.5;
      case LearningFeedbackType.BAD:
        return -1.0;
      default:
        return 0;
    }
  }

  private async recordEpisode(episode: LearningEpisode): Promise<void> {
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

  private updatePolicy(policy: LearningPolicy, action: string, reward: number): void {
    const currentScore = policy.actionScores.get(action) || 0;
    const count = (policy.actionCounts.get(action) || 0) + 1;

    let newScore: number;

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

  private updateMetrics(reward: number): void {
    this.metrics.totalEpisodes++;
    this.metrics.totalRewards += reward;
    this.metrics.averageReward = this.metrics.totalRewards / this.metrics.totalEpisodes;
    this.metrics.explorationRate = this.epsilon;

    this.calculateConvergenceScore();
  }

  private calculateConvergenceScore(): void {
    let maxDiff = 0;

    for (const [, scores] of this.policies) {
      const scoreArray = Array.from(scores.actionScores.values());
      if (scoreArray.length < 2) continue;

      scoreArray.sort((a, b) => a - b);
      const diff = scoreArray[scoreArray.length - 1] - scoreArray[0];
      maxDiff = Math.max(maxDiff, diff);
    }

    this.metrics.convergenceScore = Math.max(0, 1 - maxDiff);
  }

  private decayEpsilon(): void {
    if (this.epsilon > this.config.epsilonMin) {
      this.epsilon *= this.config.epsilonDecay;
      this.epsilon = Math.max(this.epsilon, this.config.epsilonMin);
    }
  }

  public createPolicy(id: string, name: string): LearningPolicy {
    return {
      id,
      name,
      actionScores: new Map(),
      actionCounts: new Map(),
      totalSelections: 0,
      lastUpdated: new Date(),
    };
  }

  public async addAction(policyId: string, actionName: string, initialScore: number = 0): Promise<Result<void>> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }

    if (!policy.actionScores.has(actionName)) {
      policy.actionScores.set(actionName, initialScore);
      policy.actionCounts.set(actionName, 0);
      this.logger.debug('Added action to policy', { policyId, actionName });
    }

    return ok(undefined);
  }

  public async removeAction(policyId: string, actionName: string): Promise<Result<void>> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }

    policy.actionScores.delete(actionName);
    policy.actionCounts.delete(actionName);
    this.logger.debug('Removed action from policy', { policyId, actionName });

    return ok(undefined);
  }

  public getPolicy(policyId: string): LearningPolicy | undefined {
    return this.policies.get(policyId);
  }

  public getAllPolicies(): LearningPolicy[] {
    return Array.from(this.policies.values());
  }

  public getMetrics(): LearningMetrics {
    return { ...this.metrics };
  }

  public getActionStatistics(actionName: string): {
    averageReward: number;
    selectionCount: number;
    lastReward?: number;
  } | null {
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

  public async resetPolicy(policyId: string): Promise<Result<void>> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      return err(new ValidationError(`Policy not found: ${policyId}`));
    }

    for (const action of policy.actionScores.keys()) {
      policy.actionScores.set(action, 0);
      policy.actionCounts.set(action, 0);
    }
    policy.totalSelections = 0;
    policy.lastUpdated = new Date();

    this.logger.info('Policy reset', { policyId });
    return ok(undefined);
  }

  public async resetAll(): Promise<void> {
    this.policies.clear();
    this.episodeMemory = [];
    this.actionRewards.clear();
    this.metrics = this.createInitialMetrics();
    this.epsilon = this.config.epsilon;
    this.logger.info('All learning state reset');
  }

  public updateConfig(config: Partial<LearningConfig>): void {
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

export const learningControlService = new LearningControlService();

export default LearningControlService;
