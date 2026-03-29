"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = exports.ForbiddenError = exports.UnauthorizedError = exports.ResourceExhaustedError = exports.TimeoutError = exports.SchedulingError = exports.LearningError = exports.RetrievalError = exports.KnowledgeProcessingError = exports.DatabaseError = exports.AlreadyExistsError = exports.NotFoundError = exports.ValidationError = exports.AppError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNKNOWN_ERROR"] = "UNKNOWN_ERROR";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["ALREADY_EXISTS"] = "ALREADY_EXISTS";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["KNOWLEDGE_PROCESSING_ERROR"] = "KNOWLEDGE_PROCESSING_ERROR";
    ErrorCode["RETRIEVAL_ERROR"] = "RETRIEVAL_ERROR";
    ErrorCode["LEARNING_ERROR"] = "LEARNING_ERROR";
    ErrorCode["SCHEDULING_ERROR"] = "SCHEDULING_ERROR";
    ErrorCode["TIMEOUT_ERROR"] = "TIMEOUT_ERROR";
    ErrorCode["RESOURCE_EXHAUSTED"] = "RESOURCE_EXHAUSTED";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
class AppError extends Error {
    constructor(code, message, statusCode = 500, details = {}, isOperational = true) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.statusCode = statusCode;
        this.details = {
            code,
            message,
            ...details,
        };
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
            stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
        };
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, field, value) {
        super(ErrorCode.VALIDATION_ERROR, message, 400, { field, value });
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(resource, identifier) {
        super(ErrorCode.NOT_FOUND, `${resource} not found`, 404, {
            context: { resource, identifier },
        });
    }
}
exports.NotFoundError = NotFoundError;
class AlreadyExistsError extends AppError {
    constructor(resource, identifier) {
        super(ErrorCode.ALREADY_EXISTS, `${resource} already exists`, 409, {
            context: { resource, identifier },
        });
    }
}
exports.AlreadyExistsError = AlreadyExistsError;
class DatabaseError extends AppError {
    constructor(message, cause) {
        super(ErrorCode.DATABASE_ERROR, message, 500, { cause }, true);
    }
}
exports.DatabaseError = DatabaseError;
class KnowledgeProcessingError extends AppError {
    constructor(message, context, cause) {
        super(ErrorCode.KNOWLEDGE_PROCESSING_ERROR, message, 500, { context, cause });
    }
}
exports.KnowledgeProcessingError = KnowledgeProcessingError;
class RetrievalError extends AppError {
    constructor(message, context, cause) {
        super(ErrorCode.RETRIEVAL_ERROR, message, 500, { context, cause });
    }
}
exports.RetrievalError = RetrievalError;
class LearningError extends AppError {
    constructor(message, context, cause) {
        super(ErrorCode.LEARNING_ERROR, message, 500, { context, cause });
    }
}
exports.LearningError = LearningError;
class SchedulingError extends AppError {
    constructor(message, context, cause) {
        super(ErrorCode.SCHEDULING_ERROR, message, 500, { context, cause });
    }
}
exports.SchedulingError = SchedulingError;
class TimeoutError extends AppError {
    constructor(operation, timeout) {
        super(ErrorCode.TIMEOUT_ERROR, `Operation '${operation}' timed out after ${timeout}ms`, 408, {
            context: { operation, timeout },
        });
    }
}
exports.TimeoutError = TimeoutError;
class ResourceExhaustedError extends AppError {
    constructor(resource, limit) {
        super(ErrorCode.RESOURCE_EXHAUSTED, `Resource '${resource}' exhausted`, 429, {
            context: { resource, limit },
        });
    }
}
exports.ResourceExhaustedError = ResourceExhaustedError;
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(ErrorCode.UNAUTHORIZED, message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(ErrorCode.FORBIDDEN, message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalError extends AppError {
    constructor(message, cause) {
        super(ErrorCode.INTERNAL_ERROR, message, 500, { cause }, false);
    }
}
exports.InternalError = InternalError;
//# sourceMappingURL=errors.js.map