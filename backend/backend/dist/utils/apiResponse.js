export class ApiResponse {
    res;
    options;
    constructor(res, options) {
        this.res = res;
        this.options = options;
    }
    static sendSuccess(res, data, statusCode = 200) {
        new ApiResponse(res, { success: true }).success(data, statusCode);
    }
    static sendError(res, error, statusCode = 400) {
        new ApiResponse(res, { success: false }).error(error, statusCode);
    }
    static unauthorized = (res) => new ApiResponse(res, {
        success: false,
        error: {
            code: 'UNAUTHORIZED',
            message: 'Insufficient privileges for this operation'
        }
    });
    success(data, statusCode = 200) {
        this.res.status(statusCode).json({
            success: true,
            data: data || this.options.data,
            meta: this.options.meta
        });
    }
    error(error, statusCode = 400) {
        const errorDetail = {
            code: 'GENERIC_ERROR',
            message: typeof error === 'string' ? error : error.message
        };
        if (error instanceof Error && 'details' in error) {
            errorDetail.details = error.details;
        }
        this.res.status(statusCode).json({
            success: false,
            error: errorDetail
        });
    }
}
