import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'An unexpected error occurred';
  let code = 'UNKNOWN_ERROR';
  let errors = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'CUSTOM_ERROR';
    errors = err.errors || [];
  }

  res.status(statusCode).json({
    status: 'error',
    code,
    message,
    errors,
  });
};
