import { logger } from "./logger";

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    
    this.errors = errors;

    const logLevel = statusCode >= 500 ? 'error' : 'warn';
    
    logger[logLevel]({
      message,
      statusCode,
      errors: this.errors,
      stack: this.stack,
      timestamp: new Date().toISOString(),
    });

    Error.captureStackTrace(this, this.constructor);
  }
}