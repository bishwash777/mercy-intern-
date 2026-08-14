import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

/**
 * Global error handling middleware.
 * Catches AppErrors and unexpected errors, returning structured JSON.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Unexpected / programming errors
  console.error('Unexpected Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
