"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFoundHandler = notFoundHandler;
exports.asyncHandler = asyncHandler;
const errors_1 = require("@common/errors");
const logger_1 = require("@common/logger");
const logger = (0, logger_1.createLogger)('ErrorHandler');
function errorHandler(err, req, res, _next) {
    const requestId = req.headers['x-request-id'] || 'unknown';
    if (err instanceof errors_1.AppError) {
        logger.error('Application error', {
            error: err,
            requestId,
            path: req.path,
            method: req.method,
            statusCode: err.statusCode,
        });
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
            },
            meta: {
                timestamp: new Date().toISOString(),
                requestId,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }
    logger.error('Unexpected error', {
        error: err,
        requestId,
        path: req.path,
        method: req.method,
    });
    const response = {
        success: false,
        error: {
            code: errors_1.ErrorCode.INTERNAL_ERROR,
            message: process.env.NODE_ENV === 'production'
                ? 'An unexpected error occurred'
                : err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId,
        },
    };
    res.status(500).json(response);
}
function notFoundHandler(req, res) {
    const requestId = req.headers['x-request-id'] || 'unknown';
    logger.warn('Route not found', {
        requestId,
        path: req.path,
        method: req.method,
    });
    const response = {
        success: false,
        error: {
            code: errors_1.ErrorCode.NOT_FOUND,
            message: `Route ${req.method} ${req.path} not found`,
        },
        meta: {
            timestamp: new Date().toISOString(),
            requestId,
        },
    };
    res.status(404).json(response);
}
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
exports.default = errorHandler;
//# sourceMappingURL=middleware.js.map