import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    log += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    log += `\n${stack}`;
  }
  return log;
});

const jsonFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...metadata,
  });
});

class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string = 'app') {
    this.context = context;
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      defaultMeta: { context: this.context },
      transports: [
        new winston.transports.Console({
          format: combine(
            colorize({ all: true }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
            errors({ stack: true }),
            logFormat
          ),
        }),
        new winston.transports.File({
          filename: path.join('logs', 'error.log'),
          level: 'error',
          format: combine(timestamp(), errors({ stack: true }), jsonFormat),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: path.join('logs', 'combined.log'),
          format: combine(timestamp(), jsonFormat),
          maxsize: 10 * 1024 * 1024,
          maxFiles: 5,
        }),
      ],
    });
  }

  public setContext(context: string): void {
    this.context = context;
    this.logger.defaultMeta = { context: this.context };
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context: this.context, ...meta });
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context: this.context, ...meta });
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context: this.context, ...meta });
  }

  public error(message: string | Error, meta?: Record<string, unknown>): void {
    if (message instanceof Error) {
      this.logger.error(message.message, {
        context: this.context,
        stack: message.stack,
        ...meta,
      });
    } else {
      this.logger.error(message, { context: this.context, ...meta });
    }
  }

  public child(metadata: Record<string, unknown>): ChildLogger {
    return new ChildLogger(this.logger, this.context, metadata);
  }
}

class ChildLogger {
  private logger: winston.Logger;
  private context: string;
  private metadata: Record<string, unknown>;

  constructor(logger: winston.Logger, context: string, metadata: Record<string, unknown>) {
    this.logger = logger;
    this.context = context;
    this.metadata = metadata;
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, { context: this.context, ...this.metadata, ...meta });
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, { context: this.context, ...this.metadata, ...meta });
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, { context: this.context, ...this.metadata, ...meta });
  }

  public error(message: string | Error, meta?: Record<string, unknown>): void {
    if (message instanceof Error) {
      this.logger.error(message.message, {
        context: this.context,
        stack: message.stack,
        ...this.metadata,
        ...meta,
      });
    } else {
      this.logger.error(message, { context: this.context, ...this.metadata, ...meta });
    }
  }
}

export const createLogger = (context: string): Logger => new Logger(context);

export default Logger;
