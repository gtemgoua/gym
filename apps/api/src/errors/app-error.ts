export class AppError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly code?: string;

  constructor(message: string, statusCode = 400, options?: { details?: unknown; code?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.details = options?.details;
    this.code = options?.code;
  }
}
