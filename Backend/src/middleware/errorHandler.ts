import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

/**
 * Central error handling middleware.
 * Must be registered LAST (after all routes).
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  // Already an ApiError – use its properties
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    });
    return;
  }

  // CORS error
  if (err.message.includes('not allowed by CORS')) {
    res.status(403).json({
      error: { code: 'CORS_ERROR', message: err.message },
    });
    return;
  }

  // Unexpected errors
  logger.error(
    {
      err,
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
    },
    'Unhandled error'
  );

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'production'
          ? 'An unexpected error occurred'
          : err.message,
    },
  });
}
