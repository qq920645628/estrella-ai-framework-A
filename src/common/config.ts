import * as fs from 'fs';
import * as path from 'path';
import { createLogger } from '@common/logger';

const logger = createLogger('ConfigLoader');

export interface AppConfig {
  env: string;
  port: number;
  host: string;
  logLevel: string;
  database: DatabaseConfig;
  redis: RedisConfig;
  security: SecurityConfig;
  scheduler: SchedulerConfig;
  retrieval: RetrievalConfig;
}

export interface DatabaseConfig {
  path: string;
  vectorPath: string;
  graphPath: string;
  maxConnections: number;
  timeoutMs: number;
}

export interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

export interface SecurityConfig {
  enableAuth: boolean;
  jwtSecret: string;
  jwtExpiresIn: string;
  enableRateLimit: boolean;
  maxRequestsPerMinute: number;
}

export interface SchedulerConfig {
  maxConcurrentTasks: number;
  maxQueuedTasks: number;
  taskTimeoutMs: number;
  retryAttempts: number;
}

export interface RetrievalConfig {
  defaultStrategy: string;
  hybridAlpha: number;
  maxResults: number;
  minScore: number;
  enableCache: boolean;
}

class ConfigLoader {
  private config: AppConfig | null = null;
  private configPath: string = path.resolve(process.cwd(), 'config', 'default.json');

  public load(): AppConfig {
    if (this.config) {
      return this.config;
    }

    const defaultConfig = this.loadDefaultConfig();
    const envConfig = this.loadEnvConfig();

    this.config = this.mergeConfigs(defaultConfig, envConfig);
    this.validateConfig(this.config);

    logger.info('Configuration loaded', { env: this.config.env });
    return this.config;
  }

  private loadDefaultConfig(): Partial<AppConfig> {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      logger.warn('Failed to load default config', { error });
    }

    return this.getDefaultConfig();
  }

  private loadEnvConfig(): Partial<AppConfig> {
    return {
      env: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.API_PORT || '3000', 10),
      host: process.env.API_HOST || '0.0.0.0',
      logLevel: process.env.LOG_LEVEL || 'info',
      database: {
        path: process.env.DATABASE_PATH || './data/skills.db',
        vectorPath: process.env.VECTOR_DB_PATH || './data/vectors',
        graphPath: process.env.GRAPH_DB_PATH || './data/graph',
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
        timeoutMs: parseInt(process.env.DB_TIMEOUT_MS || '5000', 10),
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
        db: parseInt(process.env.REDIS_DB || '0', 10),
      },
      security: {
        enableAuth: process.env.ENABLE_SECURITY === 'true',
        jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        enableRateLimit: process.env.ENABLE_RATE_LIMIT === 'true',
        maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '100', 10),
      },
      scheduler: {
        maxConcurrentTasks: parseInt(process.env.SKILLS_MAX_CONCURRENT_TASKS || '10', 10),
        maxQueuedTasks: parseInt(process.env.SKILLS_MAX_QUEUED_TASKS || '1000', 10),
        taskTimeoutMs: parseInt(process.env.SKILLS_TASK_TIMEOUT_MS || '30000', 10),
        retryAttempts: parseInt(process.env.SKILLS_RETRY_ATTEMPTS || '3', 10),
      },
      retrieval: {
        defaultStrategy: process.env.RETRIEVAL_STRATEGY || 'HYBRID',
        hybridAlpha: parseFloat(process.env.RETRIEVAL_HYBRID_ALPHA || '0.5'),
        maxResults: parseInt(process.env.RETRIEVAL_MAX_RESULTS || '10', 10),
        minScore: parseFloat(process.env.RETRIEVAL_MIN_SCORE || '0.5'),
        enableCache: process.env.ENABLE_RETRIEVAL_CACHE !== 'false',
      },
    };
  }

  private mergeConfigs(defaultConfig: Partial<AppConfig>, envConfig: Partial<AppConfig>): AppConfig {
    return {
      env: envConfig.env || defaultConfig.env || 'development',
      port: envConfig.port || defaultConfig.port || 3000,
      host: envConfig.host || defaultConfig.host || '0.0.0.0',
      logLevel: envConfig.logLevel || defaultConfig.logLevel || 'info',
      database: { ...defaultConfig.database, ...envConfig.database },
      redis: { ...defaultConfig.redis, ...envConfig.redis },
      security: { ...defaultConfig.security, ...envConfig.security },
      scheduler: { ...defaultConfig.scheduler, ...envConfig.scheduler },
      retrieval: { ...defaultConfig.retrieval, ...envConfig.retrieval },
    };
  }

  private validateConfig(config: AppConfig): void {
    if (config.port < 1 || config.port > 65535) {
      throw new Error('Invalid port number');
    }

    if (config.security.enableAuth && config.security.jwtSecret.length < 32) {
      logger.warn('JWT secret is too short, consider using a longer secret');
    }

    if (config.env === 'production') {
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'default-secret-change-in-production') {
        throw new Error('JWT_SECRET must be set in production');
      }
    }
  }

  private getDefaultConfig(): Partial<AppConfig> {
    return {
      env: 'development',
      port: 3000,
      host: '0.0.0.0',
      logLevel: 'info',
      database: {
        path: './data/skills.db',
        vectorPath: './data/vectors',
        graphPath: './data/graph',
        maxConnections: 10,
        timeoutMs: 5000,
      },
      redis: {
        host: 'localhost',
        port: 6379,
        password: '',
        db: 0,
      },
      security: {
        enableAuth: false,
        jwtSecret: 'default-secret-change-in-production',
        jwtExpiresIn: '24h',
        enableRateLimit: true,
        maxRequestsPerMinute: 100,
      },
      scheduler: {
        maxConcurrentTasks: 10,
        maxQueuedTasks: 1000,
        taskTimeoutMs: 30000,
        retryAttempts: 3,
      },
      retrieval: {
        defaultStrategy: 'HYBRID',
        hybridAlpha: 0.5,
        maxResults: 10,
        minScore: 0.5,
        enableCache: true,
      },
    };
  }

  public getConfig(): AppConfig {
    if (!this.config) {
      return this.load();
    }
    return this.config;
  }

  public reload(): AppConfig {
    this.config = null;
    return this.load();
  }
}

export const configLoader = new ConfigLoader();
export default ConfigLoader;
