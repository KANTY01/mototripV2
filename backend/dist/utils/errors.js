export class ApiError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 400, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class ForbiddenError extends ApiError {
    constructor(message = "Forbidden", details) {
        super(message, 403, details);
    }
}
export class NotFoundError extends ApiError {
    constructor(message = "Not Found", details) {
        super(message, 404, details);
    }
}
