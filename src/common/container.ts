import { createLogger } from '@common/logger';
import Logger from '@common/logger';

export interface ServiceRegistry {
  logger: Logger;
}

class Container {
  private static instance: Container;
  private services: Map<string, unknown> = new Map();
  private logger: Logger;

  private constructor() {
    this.logger = createLogger('ServiceContainer');
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  public register<T>(name: string, service: T): void {
    if (this.services.has(name)) {
      this.logger.warn(`Service ${name} already registered, overwriting`);
    }
    this.services.set(name, service);
    this.logger.debug(`Registered service: ${name}`);
  }

  public get<T>(name: string): T | undefined {
    return this.services.get(name) as T | undefined;
  }

  public has(name: string): boolean {
    return this.services.has(name);
  }

  public async initialize(): Promise<void> {
    this.logger.info('Initializing service container...');
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down service container...');
    this.services.clear();
  }
}

export const container = Container.getInstance();
export default Container;
