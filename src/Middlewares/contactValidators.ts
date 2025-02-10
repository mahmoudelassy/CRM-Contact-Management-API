import { body, param, query, validationResult } from 'express-validator/lib/index.js';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../Utils/AppError';

type ExpressMiddleware = RequestHandler | ((req: Request, res: Response, next: NextFunction) => void);

const handleValidationErrors: ExpressMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
    }));

    throw new AppError('Validation error: One or more fields are incorrect', 400, 'VALIDATION_ERROR', validationErrors);
  }
  next();
};

export const validateCreateContact: ExpressMiddleware[] = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('company').notEmpty().withMessage('Company is required'),
  body('balance').optional().isFloat({ min: 0 }).withMessage('Balance must be a positive number'),
  handleValidationErrors,
];

export const validateContactId: ExpressMiddleware[] = [
  param('id').isUUID().withMessage('Invalid contact ID format'),
  handleValidationErrors,
];

export const validateListContacts: ExpressMiddleware[] = [
  query('company').optional().isString(),
  query('is_deleted').optional().isIn(['true', 'false']),
  query('created_after').optional().isISO8601(),
  handleValidationErrors,
];

export const validateTransferBalance: ExpressMiddleware[] = [
  body('from_contact_id').isUUID().withMessage('Invalid sender ID format'),
  body('to_contact_id').isUUID().withMessage('Invalid receiver ID format'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number'),
  handleValidationErrors,
];
