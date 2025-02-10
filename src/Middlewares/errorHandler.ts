// middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../Utils/AppError.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'An unexpected error occurred';

  res.status(statusCode).json({ message });
};
