export class AppError extends Error {
  statusCode: number;
  code: string;
  errors: any[];

  constructor(message: string, statusCode: number = 500, code: string = 'CUSTOM_ERROR', errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;

    // Capturing stack trace, useful for debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
