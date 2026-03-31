import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', { message: err.message, stack: err.stack });

  
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    sendError(res, 'Validation failed', 400, errors);
    return;
  }


  if ((err as NodeJS.ErrnoException).code === '11000') {
    const field = Object.keys((err as any).keyValue || {})[0] || 'field';
    sendError(res, `${field} already exists`, 409);
    return;
  }

  
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, `Invalid ${err.path}: ${err.value}`, 400);
    return;
  }

  
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }

  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token expired', 401);
    return;
  }

  
  const message = config.isDev ? err.message : 'Something went wrong';
  sendError(res, message, 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
};