import { createLogger } from '@common/logger';
import {
  SchedulingError,
  ValidationError,
  NotFoundError,
  TimeoutError,
} from '@common/errors';
import {
  Task,
  TaskType,
  TaskStatus,
  TaskPriority,
  AuditableEntity,
} from '@common/types';
import { Result, ok, err, generateId, sleep } from '@common/utils';

export interface SchedulerConfig {
  maxConcurrentTasks: number;
  maxQueuedTasks: number;
  taskTimeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  enablePriorityQueue: boolean;
  enableTaskDependencies: boolean;
  healthCheckIntervalMs: number;
}

export interface TaskExecutor {
  canExecute(task: Task): boolean;
  execute(task: Task): Promise<Task>;
}

const DEFAULT_CONFIG: SchedulerConfig = {
  maxConcurrentTasks: 10,
  maxQueuedTasks: 1000,
  taskTimeoutMs: 30000,
  retryAttempts: 3,
  retryDelayMs: 1000,
  enablePriorityQueue: true,
  enableTaskDependencies: true,
  healthCheckIntervalMs: 60000,
};

export class TaskScheduler {
  private readonly logger = createLogger('TaskScheduler');
  private readonly config: Required<SchedulerConfig>;
  private taskQueue: Task[] = [];
  private runningTasks: Map<string, Task> = new Map();
  private completedTasks: Map<string, Task> = new Map();
  private taskExecutors: Map<TaskType, TaskExecutor> = new Map();
  private isRunning: boolean = false;
  private processingLoop: NodeJS.Timeout | null = null;
  private metrics: SchedulerMetrics;

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.metrics = this.createInitialMetrics();
    this.logger.info('TaskScheduler initialized', { config: this.config });
  }

  private createInitialMetrics(): SchedulerMetrics {
    return {
      totalTasksSubmitted: 0,
      totalTasksCompleted: 0,
      totalTasksFailed: 0,
      totalTasksCancelled: 0,
      activeTasks: 0,
      queuedTasks: 0,
      averageExecutionTime: 0,
      throughput: 0,
    };
  }

  public async start(): Promise<void> {
    if (this.isRunning) {
      this.logger.warn('TaskScheduler already running');
      return;
    }

    this.isRunning = true;
    this.processingLoop = setInterval(() => this.processQueue(), 1000);
    this.logger.info('TaskScheduler started');
  }

  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    if (this.processingLoop) {
      clearInterval(this.processingLoop);
      this.processingLoop = null;
    }

    await this.cancelAllTasks();

    this.logger.info('TaskScheduler stopped');
  }

  public registerExecutor(type: TaskType, executor: TaskExecutor): void {
    this.taskExecutors.set(type, executor);
    this.logger.debug('Registered task executor', { type });
  }

  public async submitTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress' | 'retryCount'>): Promise<Result<Task>> {
    try {
      if (this.taskQueue.length >= this.config.maxQueuedTasks) {
        return err(new SchedulingError('Task queue is full', {
          maxQueueSize: this.config.maxQueuedTasks,
          currentSize: this.taskQueue.length,
        }));
      }

      if (this.config.enableTaskDependencies && taskData.dependencies.length > 0) {
        const depsValid = await this.validateDependencies(taskData.dependencies);
        if (!depsValid) {
          return err(new SchedulingError('Invalid task dependencies'));
        }
      }

      const now = new Date();
      const task: Task = {
        ...taskData,
        id: generateId(),
        status: TaskStatus.PENDING,
        progress: 0,
        retryCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      this.taskQueue.push(task);
      this.taskQueue.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return a.scheduledAt.getTime() - b.scheduledAt.getTime();
      });

      this.metrics.totalTasksSubmitted++;
      this.updateMetrics();

      this.logger.info('Task submitted', { taskId: task.id, type: task.type, priority: task.priority });

      return ok(task);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown submission error';
      this.logger.error('Failed to submit task', error as Error);
      return err(new SchedulingError(errMsg));
    }
  }

  private async validateDependencies(dependencies: string[]): Promise<boolean> {
    for (const depId of dependencies) {
      const depTask = this.findTask(depId);
      if (!depTask) {
        this.logger.warn('Dependency not found', { dependencyId: depId });
        return false;
      }

      if (depTask.status !== TaskStatus.COMPLETED) {
        return false;
      }
    }
    return true;
  }

  private findTask(taskId: string): Task | undefined {
    const inQueue = this.taskQueue.find((t) => t.id === taskId);
    if (inQueue) return inQueue;

    const inProgress = this.runningTasks.get(taskId);
    if (inProgress) return inProgress;

    const completed = this.completedTasks.get(taskId);
    return completed;
  }

  public async getTask(taskId: string): Promise<Task | null> {
    return this.findTask(taskId) || null;
  }

  public async cancelTask(taskId: string): Promise<Result<void>> {
    const task = this.findTask(taskId);

    if (!task) {
      return err(new NotFoundError('Task', taskId));
    }

    switch (task.status) {
      case TaskStatus.PENDING:
        this.removeFromQueue(taskId);
        task.status = TaskStatus.CANCELLED;
        task.updatedAt = new Date();
        this.metrics.totalTasksCancelled++;
        this.updateMetrics();
        this.logger.info('Task cancelled', { taskId });
        break;

      case TaskStatus.RUNNING:
        task.status = TaskStatus.CANCELLED;
        task.updatedAt = new Date();
        this.runningTasks.delete(taskId);
        this.metrics.totalTasksCancelled++;
        this.updateMetrics();
        this.logger.info('Running task cancelled', { taskId });
        break;

      case TaskStatus.COMPLETED:
      case TaskStatus.FAILED:
      case TaskStatus.CANCELLED:
        this.logger.warn('Cannot cancel task in terminal state', { taskId, status: task.status });
        return err(new SchedulingError('Task is already in terminal state'));

      default:
        return err(new SchedulingError(`Unknown task status: ${task.status}`));
    }

    return ok(undefined);
  }

  private removeFromQueue(taskId: string): void {
    const index = this.taskQueue.findIndex((t) => t.id === taskId);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
    }
  }

  public async retryTask(taskId: string): Promise<Result<void>> {
    const task = this.findTask(taskId);

    if (!task) {
      return err(new NotFoundError('Task', taskId));
    }

    if (task.status !== TaskStatus.FAILED) {
      return err(new SchedulingError('Only failed tasks can be retried'));
    }

    if (task.retryCount >= this.config.retryAttempts) {
      return err(new SchedulingError('Maximum retry attempts exceeded'));
    }

    task.status = TaskStatus.PENDING;
    task.retryCount++;
    task.progress = 0;
    task.error = undefined;
    task.updatedAt = new Date();

    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.scheduledAt.getTime() - b.scheduledAt.getTime();
    });

    this.logger.info('Task queued for retry', { taskId, retryCount: task.retryCount });
    return ok(undefined);
  }

  private async processQueue(): Promise<void> {
    if (!this.isRunning) return;

    if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
      return;
    }

    const availableSlots = this.config.maxConcurrentTasks - this.runningTasks.size;

    for (let i = 0; i < availableSlots; i++) {
      const readyTask = this.findReadyTask();
      if (!readyTask) break;

      this.removeFromQueue(readyTask.id);
      await this.executeTask(readyTask);
    }
  }

  private findReadyTask(): Task | undefined {
    for (const task of this.taskQueue) {
      if (this.config.enableTaskDependencies) {
        const depsValid = this.validateDependenciesSync(task.dependencies);
        if (depsValid) {
          return task;
        }
      } else {
        return task;
      }
    }
    return undefined;
  }

  private validateDependenciesSync(dependencies: string[]): boolean {
    for (const depId of dependencies) {
      const depTask = this.findTask(depId);
      if (!depTask || depTask.status !== TaskStatus.COMPLETED) {
        return false;
      }
    }
    return true;
  }

  private async executeTask(task: Task): Promise<void> {
    task.status = TaskStatus.RUNNING;
    task.startedAt = new Date();
    task.updatedAt = new Date();
    this.runningTasks.set(task.id, task);
    this.metrics.activeTasks++;
    this.updateMetrics();

    const executor = this.taskExecutors.get(task.type);

    if (!executor) {
      task.status = TaskStatus.FAILED;
      task.error = `No executor registered for task type: ${task.type}`;
      task.updatedAt = new Date();
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksFailed++;
      this.metrics.activeTasks--;
      this.updateMetrics();
      this.logger.error('Task failed - no executor', { taskId: task.id, type: task.type });
      return;
    }

    const startTime = Date.now();

    try {
      const timeoutPromise = sleep(this.config.taskTimeoutMs).then(() => {
        throw new TimeoutError(task.type, this.config.taskTimeoutMs);
      });

      const executePromise = executor.execute(task);

      const completedTask = await Promise.race([executePromise, timeoutPromise]);

      Object.assign(task, completedTask);
      task.status = TaskStatus.COMPLETED;
      task.progress = 100;
      task.completedAt = new Date();
      task.updatedAt = new Date();

      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksCompleted++;
      this.metrics.activeTasks--;

      const executionTime = Date.now() - startTime;
      this.updateAverageExecutionTime(executionTime);

      this.updateMetrics();

      this.logger.info('Task completed', {
        taskId: task.id,
        executionTime,
        retryCount: task.retryCount,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (error instanceof TimeoutError) {
        task.status = TaskStatus.FAILED;
        task.error = `Task timed out after ${this.config.taskTimeoutMs}ms`;
      } else {
        task.status = TaskStatus.FAILED;
        task.error = errorMessage;
      }

      task.updatedAt = new Date();
      this.runningTasks.delete(task.id);
      this.completedTasks.set(task.id, task);
      this.metrics.totalTasksFailed++;
      this.metrics.activeTasks--;
      this.updateMetrics();

      this.logger.error('Task execution failed', error as Error, { taskId: task.id });
    }
  }

  private updateAverageExecutionTime(executionTime: number): void {
    const completed = this.metrics.totalTasksCompleted;
    const currentAvg = this.metrics.averageExecutionTime;

    this.metrics.averageExecutionTime = (currentAvg * (completed - 1) + executionTime) / completed;
  }

  public async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const results: Task[] = [];

    for (const task of this.taskQueue) {
      if (task.status === status) {
        results.push(task);
      }
    }

    for (const task of this.runningTasks.values()) {
      if (task.status === status) {
        results.push(task);
      }
    }

    for (const task of this.completedTasks.values()) {
      if (task.status === status) {
        results.push(task);
      }
    }

    return results;
  }

  public async getTaskHistory(limit: number = 100): Promise<Task[]> {
    const completed = Array.from(this.completedTasks.values());
    completed.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    return completed.slice(0, limit);
  }

  private async cancelAllTasks(): Promise<void> {
    for (const task of this.taskQueue) {
      task.status = TaskStatus.CANCELLED;
      task.updatedAt = new Date();
      this.metrics.totalTasksCancelled++;
    }
    this.taskQueue = [];

    for (const task of this.runningTasks.values()) {
      task.status = TaskStatus.CANCELLED;
      task.updatedAt = new Date();
      this.metrics.totalTasksCancelled++;
    }
    this.runningTasks.clear();

    this.updateMetrics();
    this.logger.info('All tasks cancelled');
  }

  public getMetrics(): SchedulerMetrics {
    return { ...this.metrics, queuedTasks: this.taskQueue.length };
  }

  private updateMetrics(): void {
    const totalProcessed = this.metrics.totalTasksCompleted + this.metrics.totalTasksFailed;
    if (totalProcessed > 0 && this.metrics.totalTasksCompleted > 0) {
      this.metrics.throughput = Math.round(
        (this.metrics.totalTasksCompleted / totalProcessed) * 100
      );
    }
  }

  public getQueueStatus(): {
    queued: number;
    running: number;
    completed: number;
    failed: number;
    maxConcurrent: number;
    maxQueued: number;
  } {
    return {
      queued: this.taskQueue.length,
      running: this.runningTasks.size,
      completed: this.metrics.totalTasksCompleted,
      failed: this.metrics.totalTasksFailed,
      maxConcurrent: this.config.maxConcurrentTasks,
      maxQueued: this.config.maxQueuedTasks,
    };
  }

  public updateConfig(config: Partial<SchedulerConfig>): void {
    Object.assign(this.config, config);
    this.logger.info('Scheduler config updated', { config: this.config });
  }

  public clearCompletedTasks(): void {
    const beforeCount = this.completedTasks.size;
    this.completedTasks.clear();
    this.logger.info('Cleared completed tasks cache', { count: beforeCount });
  }
}

export interface SchedulerMetrics {
  totalTasksSubmitted: number;
  totalTasksCompleted: number;
  totalTasksFailed: number;
  totalTasksCancelled: number;
  activeTasks: number;
  queuedTasks: number;
  averageExecutionTime: number;
  throughput: number;
}

export const taskScheduler = new TaskScheduler();

export default TaskScheduler;
