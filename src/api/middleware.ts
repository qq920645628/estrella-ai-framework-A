import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '@common/errors';
import { createLogger } from '@common/logger';

const logger = createLogger('ErrorHandler');

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    stack?: string;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const requestId = req.headers['x-request-id'] as string || 'unknown';

  if (err instanceof AppError) {
    logger.error('Application error', {
      error: err,
      requestId,
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
    });

    const response: ErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details as unknown as Record<string, unknown>,
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

  const response: ErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.INTERNAL_ERROR,
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

export function notFoundHandler(req: Request, res: Response): void {
  const requestId = req.headers['x-request-id'] as string || 'unknown';

  logger.warn('Route not found', {
    requestId,
    path: req.path,
    method: req.method,
  });

  const response: ErrorResponse = {
    success: false,
    error: {
      code: ErrorCode.NOT_FOUND,
      message: `Route ${req.method} ${req.path} not found`,
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  res.status(404).json(response);
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;
