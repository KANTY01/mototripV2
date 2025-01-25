export class ApiError extends Error {
  statusCode: number;
  details: any;

  constructor(message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden", details?: any) {
    super(message, 403, details);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found", details?: any) {
    super(message, 404, details);
  }
}
