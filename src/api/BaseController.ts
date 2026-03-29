import { createLogger } from '@common/logger';
import { AppError, ErrorCode } from '@common/errors';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

export interface ResponseMeta {
  timestamp: string;
  requestId: string;
  processingTime?: number;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(data: T, meta?: Partial<ResponseMeta>): ApiResponse<T> {
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

export function errorResponse(error: AppError | Error): ApiResponse {
  const apiError: ApiError = {
    code: error instanceof AppError ? error.code : ErrorCode.UNKNOWN_ERROR,
    message: error.message,
  };

  if (process.env.NODE_ENV === 'development') {
    apiError.stack = error.stack;
  }

  if (error instanceof AppError && error.details) {
    apiError.details = error.details as unknown as Record<string, unknown>;
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

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export abstract class BaseController {
  protected readonly logger = createLogger(this.constructor.name);

  protected handleError(error: Error): ApiResponse {
    this.logger.error('Controller error', { error });
    return errorResponse(error);
  }

  protected validateRequired(params: Record<string, unknown>, required: string[]): void {
    for (const field of required) {
      if (params[field] === undefined || params[field] === null) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          `Missing required field: ${field}`,
          400,
          { field }
        );
      }
    }
  }
}

export default BaseController;
