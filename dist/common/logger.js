"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, errors, json } = winston_1.default.format;
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
    constructor(context = 'app') {
        this.context = context;
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            defaultMeta: { context: this.context },
            transports: [
                new winston_1.default.transports.Console({
                    format: combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), errors({ stack: true }), logFormat),
                }),
                new winston_1.default.transports.File({
                    filename: path_1.default.join('logs', 'error.log'),
                    level: 'error',
                    format: combine(timestamp(), errors({ stack: true }), jsonFormat),
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                }),
                new winston_1.default.transports.File({
                    filename: path_1.default.join('logs', 'combined.log'),
                    format: combine(timestamp(), jsonFormat),
                    maxsize: 10 * 1024 * 1024,
                    maxFiles: 5,
                }),
            ],
        });
    }
    setContext(context) {
        this.context = context;
        this.logger.defaultMeta = { context: this.context };
    }
    debug(message, meta) {
        this.logger.debug(message, { context: this.context, ...meta });
    }
    info(message, meta) {
        this.logger.info(message, { context: this.context, ...meta });
    }
    warn(message, meta) {
        this.logger.warn(message, { context: this.context, ...meta });
    }
    error(message, meta) {
        if (message instanceof Error) {
            this.logger.error(message.message, {
                context: this.context,
                stack: message.stack,
                ...meta,
            });
        }
        else {
            this.logger.error(message, { context: this.context, ...meta });
        }
    }
    child(metadata) {
        return new ChildLogger(this.logger, this.context, metadata);
    }
}
class ChildLogger {
    constructor(logger, context, metadata) {
        this.logger = logger;
        this.context = context;
        this.metadata = metadata;
    }
    debug(message, meta) {
        this.logger.debug(message, { context: this.context, ...this.metadata, ...meta });
    }
    info(message, meta) {
        this.logger.info(message, { context: this.context, ...this.metadata, ...meta });
    }
    warn(message, meta) {
        this.logger.warn(message, { context: this.context, ...this.metadata, ...meta });
    }
    error(message, meta) {
        if (message instanceof Error) {
            this.logger.error(message.message, {
                context: this.context,
                stack: message.stack,
                ...this.metadata,
                ...meta,
            });
        }
        else {
            this.logger.error(message, { context: this.context, ...this.metadata, ...meta });
        }
    }
}
const createLogger = (context) => new Logger(context);
exports.createLogger = createLogger;
exports.default = Logger;
//# sourceMappingURL=logger.js.map