"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskScheduler = exports.TaskScheduler = void 0;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
const types_1 = require("@common/types");
const utils_1 = require("@common/utils");
const DEFAULT_CONFIG = {
    maxConcurrentTasks: 10,
    maxQueuedTasks: 1000,
    taskTimeoutMs: 30000,
    retryAttempts: 3,
    retryDelayMs: 1000,
    enablePriorityQueue: true,
    enableTaskDependencies: true,
    healthCheckIntervalMs: 60000,
};
class TaskScheduler {
    constructor(config = {}) {
        this.logger = (0, logger_1.createLogger)('TaskScheduler');
        this.taskQueue = [];
        this.runningTasks = new Map();
        this.completedTasks = new Map();
        this.taskExecutors = new Map();
        this.isRunning = false;
        this.processingLoop = null;
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.metrics = this.createInitialMetrics();
        this.logger.info('TaskScheduler initialized', { config: this.config });
    }
    createInitialMetrics() {
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
    async start() {
        if (this.isRunning) {
            this.logger.warn('TaskScheduler already running');
            return;
        }
        this.isRunning = true;
        this.processingLoop = setInterval(() => this.processQueue(), 1000);
        this.logger.info('TaskScheduler started');
    }
    async stop() {
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
    registerExecutor(type, executor) {
        this.taskExecutors.set(type, executor);
        this.logger.debug('Registered task executor', { type });
    }
    async submitTask(taskData) {
        try {
            if (this.taskQueue.length >= this.config.maxQueuedTasks) {
                return (0, utils_1.err)(new errors_1.SchedulingError('Task queue is full', {
                    maxQueueSize: this.config.maxQueuedTasks,
                    currentSize: this.taskQueue.length,
                }));
            }
            if (this.config.enableTaskDependencies && taskData.dependencies.length > 0) {
                const depsValid = await this.validateDependencies(taskData.dependencies);
                if (!depsValid) {
                    return (0, utils_1.err)(new errors_1.SchedulingError('Invalid task dependencies'));
                }
            }
            const now = new Date();
            const task = {
                ...taskData,
                id: (0, utils_1.generateId)(),
                status: types_1.TaskStatus.PENDING,
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
            return (0, utils_1.ok)(task);
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : 'Unknown submission error';
            this.logger.error('Failed to submit task', error);
            return (0, utils_1.err)(new errors_1.SchedulingError(errMsg));
        }
    }
    async validateDependencies(dependencies) {
        for (const depId of dependencies) {
            const depTask = this.findTask(depId);
            if (!depTask) {
                this.logger.warn('Dependency not found', { dependencyId: depId });
                return false;
            }
            if (depTask.status !== types_1.TaskStatus.COMPLETED) {
                return false;
            }
        }
        return true;
    }
    findTask(taskId) {
        const inQueue = this.taskQueue.find((t) => t.id === taskId);
        if (inQueue)
            return inQueue;
        const inProgress = this.runningTasks.get(taskId);
        if (inProgress)
            return inProgress;
        const completed = this.completedTasks.get(taskId);
        return completed;
    }
    async getTask(taskId) {
        return this.findTask(taskId) || null;
    }
    async cancelTask(taskId) {
        const task = this.findTask(taskId);
        if (!task) {
            return (0, utils_1.err)(new errors_1.NotFoundError('Task', taskId));
        }
        switch (task.status) {
            case types_1.TaskStatus.PENDING:
                this.removeFromQueue(taskId);
                task.status = types_1.TaskStatus.CANCELLED;
                task.updatedAt = new Date();
                this.metrics.totalTasksCancelled++;
                this.updateMetrics();
                this.logger.info('Task cancelled', { taskId });
                break;
            case types_1.TaskStatus.RUNNING:
                task.status = types_1.TaskStatus.CANCELLED;
                task.updatedAt = new Date();
                this.runningTasks.delete(taskId);
                this.metrics.totalTasksCancelled++;
                this.updateMetrics();
                this.logger.info('Running task cancelled', { taskId });
                break;
            case types_1.TaskStatus.COMPLETED:
            case types_1.TaskStatus.FAILED:
            case types_1.TaskStatus.CANCELLED:
                this.logger.warn('Cannot cancel task in terminal state', { taskId, status: task.status });
                return (0, utils_1.err)(new errors_1.SchedulingError('Task is already in terminal state'));
            default:
                return (0, utils_1.err)(new errors_1.SchedulingError(`Unknown task status: ${task.status}`));
        }
        return (0, utils_1.ok)(undefined);
    }
    removeFromQueue(taskId) {
        const index = this.taskQueue.findIndex((t) => t.id === taskId);
        if (index !== -1) {
            this.taskQueue.splice(index, 1);
        }
    }
    async retryTask(taskId) {
        const task = this.findTask(taskId);
        if (!task) {
            return (0, utils_1.err)(new errors_1.NotFoundError('Task', taskId));
        }
        if (task.status !== types_1.TaskStatus.FAILED) {
            return (0, utils_1.err)(new errors_1.SchedulingError('Only failed tasks can be retried'));
        }
        if (task.retryCount >= this.config.retryAttempts) {
            return (0, utils_1.err)(new errors_1.SchedulingError('Maximum retry attempts exceeded'));
        }
        task.status = types_1.TaskStatus.PENDING;
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
        return (0, utils_1.ok)(undefined);
    }
    async processQueue() {
        if (!this.isRunning)
            return;
        if (this.runningTasks.size >= this.config.maxConcurrentTasks) {
            return;
        }
        const availableSlots = this.config.maxConcurrentTasks - this.runningTasks.size;
        for (let i = 0; i < availableSlots; i++) {
            const readyTask = this.findReadyTask();
            if (!readyTask)
                break;
            this.removeFromQueue(readyTask.id);
            await this.executeTask(readyTask);
        }
    }
    findReadyTask() {
        for (const task of this.taskQueue) {
            if (this.config.enableTaskDependencies) {
                const depsValid = this.validateDependenciesSync(task.dependencies);
                if (depsValid) {
                    return task;
                }
            }
            else {
                return task;
            }
        }
        return undefined;
    }
    validateDependenciesSync(dependencies) {
        for (const depId of dependencies) {
            const depTask = this.findTask(depId);
            if (!depTask || depTask.status !== types_1.TaskStatus.COMPLETED) {
                return false;
            }
        }
        return true;
    }
    async executeTask(task) {
        task.status = types_1.TaskStatus.RUNNING;
        task.startedAt = new Date();
        task.updatedAt = new Date();
        this.runningTasks.set(task.id, task);
        this.metrics.activeTasks++;
        this.updateMetrics();
        const executor = this.taskExecutors.get(task.type);
        if (!executor) {
            task.status = types_1.TaskStatus.FAILED;
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
            const timeoutPromise = (0, utils_1.sleep)(this.config.taskTimeoutMs).then(() => {
                throw new errors_1.TimeoutError(task.type, this.config.taskTimeoutMs);
            });
            const executePromise = executor.execute(task);
            const completedTask = await Promise.race([executePromise, timeoutPromise]);
            Object.assign(task, completedTask);
            task.status = types_1.TaskStatus.COMPLETED;
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (error instanceof errors_1.TimeoutError) {
                task.status = types_1.TaskStatus.FAILED;
                task.error = `Task timed out after ${this.config.taskTimeoutMs}ms`;
            }
            else {
                task.status = types_1.TaskStatus.FAILED;
                task.error = errorMessage;
            }
            task.updatedAt = new Date();
            this.runningTasks.delete(task.id);
            this.completedTasks.set(task.id, task);
            this.metrics.totalTasksFailed++;
            this.metrics.activeTasks--;
            this.updateMetrics();
            this.logger.error('Task execution failed', error, { taskId: task.id });
        }
    }
    updateAverageExecutionTime(executionTime) {
        const completed = this.metrics.totalTasksCompleted;
        const currentAvg = this.metrics.averageExecutionTime;
        this.metrics.averageExecutionTime = (currentAvg * (completed - 1) + executionTime) / completed;
    }
    async getTasksByStatus(status) {
        const results = [];
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
    async getTaskHistory(limit = 100) {
        const completed = Array.from(this.completedTasks.values());
        completed.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        return completed.slice(0, limit);
    }
    async cancelAllTasks() {
        for (const task of this.taskQueue) {
            task.status = types_1.TaskStatus.CANCELLED;
            task.updatedAt = new Date();
            this.metrics.totalTasksCancelled++;
        }
        this.taskQueue = [];
        for (const task of this.runningTasks.values()) {
            task.status = types_1.TaskStatus.CANCELLED;
            task.updatedAt = new Date();
            this.metrics.totalTasksCancelled++;
        }
        this.runningTasks.clear();
        this.updateMetrics();
        this.logger.info('All tasks cancelled');
    }
    getMetrics() {
        return { ...this.metrics, queuedTasks: this.taskQueue.length };
    }
    updateMetrics() {
        const totalProcessed = this.metrics.totalTasksCompleted + this.metrics.totalTasksFailed;
        if (totalProcessed > 0 && this.metrics.totalTasksCompleted > 0) {
            this.metrics.throughput = Math.round((this.metrics.totalTasksCompleted / totalProcessed) * 100);
        }
    }
    getQueueStatus() {
        return {
            queued: this.taskQueue.length,
            running: this.runningTasks.size,
            completed: this.metrics.totalTasksCompleted,
            failed: this.metrics.totalTasksFailed,
            maxConcurrent: this.config.maxConcurrentTasks,
            maxQueued: this.config.maxQueuedTasks,
        };
    }
    updateConfig(config) {
        Object.assign(this.config, config);
        this.logger.info('Scheduler config updated', { config: this.config });
    }
    clearCompletedTasks() {
        const beforeCount = this.completedTasks.size;
        this.completedTasks.clear();
        this.logger.info('Cleared completed tasks cache', { count: beforeCount });
    }
}
exports.TaskScheduler = TaskScheduler;
exports.taskScheduler = new TaskScheduler();
exports.default = TaskScheduler;
//# sourceMappingURL=TaskScheduler.js.map