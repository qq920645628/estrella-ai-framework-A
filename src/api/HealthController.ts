import { Request, Response } from 'express';
import { createLogger } from '@common/logger';
import * as os from 'os';

const logger = createLogger('HealthController');

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
  };
  cpu: {
    cores: number;
    loadAverage: number[];
  };
  services: {
    [key: string]: {
      status: 'up' | 'down' | 'unknown';
      latency?: number;
      message?: string;
    };
  };
}

class HealthController {
  private startTime: Date = new Date();

  public async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.collectHealth();
      const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
      res.status(statusCode).json(health);
    } catch (error) {
      logger.error('Health check failed', { error });
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  }

  public async getReadiness(req: Request, res: Response): Promise<void> {
    try {
      const health = await this.collectHealth();
      const isReady = health.status !== 'unhealthy';
      res.status(isReady ? 200 : 503).json({
        ready: isReady,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
      });
    }
  }

  public async getLiveness(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      alive: true,
      timestamp: new Date().toISOString(),
    });
  }

  private async collectHealth(): Promise<HealthStatus> {
    const memUsage = process.memoryUsage();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Date.now() - this.startTime.getTime(),
      memory: {
        total: totalMem,
        used: usedMem,
        free: freeMem,
        usagePercent: Math.round((usedMem / totalMem) * 100),
      },
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg(),
      },
      services: {},
    };

    if (health.memory.usagePercent > 90) {
      health.status = 'degraded';
    }

    if (health.cpu.loadAverage[0] > os.cpus().length * 0.8) {
      health.status = 'degraded';
    }

    return health;
  }
}

export const healthController = new HealthController();
export default HealthController;
