export enum ErrorCode {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DATABASE_ERROR = 'DATABASE_ERROR',
  KNOWLEDGE_PROCESSING_ERROR = 'KNOWLEDGE_PROCESSING_ERROR',
  RETRIEVAL_ERROR = 'RETRIEVAL_ERROR',
  LEARNING_ERROR = 'LEARNING_ERROR',
  SCHEDULING_ERROR = 'SCHEDULING_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  field?: string;
  value?: unknown;
  context?: Record<string, unknown>;
  cause?: Error;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details: ErrorDetails;
  public readonly isOperational: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number = 500,
    details: Partial<ErrorDetails> = {},
    isOperational: boolean = true
  ) {
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

  toJSON(): Record<string, unknown> {
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

export class ValidationError extends AppError {
  constructor(message: string, field?: string, value?: unknown) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, { field, value });
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, 404, {
      context: { resource, identifier },
    });
  }
}

export class AlreadyExistsError extends AppError {
  constructor(resource: string, identifier?: string) {
    super(ErrorCode.ALREADY_EXISTS, `${resource} already exists`, 409, {
      context: { resource, identifier },
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, cause?: Error) {
    super(ErrorCode.DATABASE_ERROR, message, 500, { cause }, true);
  }
}

export class KnowledgeProcessingError extends AppError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(ErrorCode.KNOWLEDGE_PROCESSING_ERROR, message, 500, { context, cause });
  }
}

export class RetrievalError extends AppError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(ErrorCode.RETRIEVAL_ERROR, message, 500, { context, cause });
  }
}

export class LearningError extends AppError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(ErrorCode.LEARNING_ERROR, message, 500, { context, cause });
  }
}

export class SchedulingError extends AppError {
  constructor(message: string, context?: Record<string, unknown>, cause?: Error) {
    super(ErrorCode.SCHEDULING_ERROR, message, 500, { context, cause });
  }
}

export class TimeoutError extends AppError {
  constructor(operation: string, timeout: number) {
    super(ErrorCode.TIMEOUT_ERROR, `Operation '${operation}' timed out after ${timeout}ms`, 408, {
      context: { operation, timeout },
    });
  }
}

export class ResourceExhaustedError extends AppError {
  constructor(resource: string, limit?: number) {
    super(ErrorCode.RESOURCE_EXHAUSTED, `Resource '${resource}' exhausted`, 429, {
      context: { resource, limit },
    });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(ErrorCode.UNAUTHORIZED, message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(ErrorCode.FORBIDDEN, message, 403);
  }
}

export class InternalError extends AppError {
  constructor(message: string, cause?: Error) {
    super(ErrorCode.INTERNAL_ERROR, message, 500, { cause }, false);
  }
}
