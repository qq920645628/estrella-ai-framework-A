"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.generateRequestId = generateRequestId;
const logger_1 = require("@common/logger");
const errors_1 = require("@common/errors");
function successResponse(data, meta) {
    return {
        success: true,
        data,
        meta: {
            timestamp: new Date().toISOString(),
            requestId: generateRequestId(),
            ...meta,
        },
    };
}
function errorResponse(error) {
    const apiError = {
        code: error instanceof errors_1.AppError ? error.code : errors_1.ErrorCode.UNKNOWN_ERROR,
        message: error.message,
    };
    if (process.env.NODE_ENV === 'development') {
        apiError.stack = error.stack;
    }
    if (error instanceof errors_1.AppError && error.details) {
        apiError.details = error.details;
    }
    return {
        success: false,
        error: apiError,
        meta: {
            timestamp: new Date().toISOString(),
            requestId: generateRequestId(),
        },
    };
}
function generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}
class BaseController {
    constructor() {
        this.logger = (0, logger_1.createLogger)(this.constructor.name);
    }
    handleError(error) {
        this.logger.error('Controller error', { error });
        return errorResponse(error);
    }
    validateRequired(params, required) {
        for (const field of required) {
            if (params[field] === undefined || params[field] === null) {
                throw new errors_1.AppError(errors_1.ErrorCode.VALIDATION_ERROR, `Missing required field: ${field}`, 400, { field });
            }
        }
    }
}
exports.BaseController = BaseController;
exports.default = BaseController;
//# sourceMappingURL=BaseController.js.map