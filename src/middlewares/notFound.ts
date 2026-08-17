import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found handler — must be registered after all routes.
 */
export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
