import { Response } from 'express';

interface ErrorDetail {
  code: string;
  message: string;
  details?: any;
}

interface ApiResponseOptions<T> {
  success: boolean;
  data?: T;
  error?: ErrorDetail;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
  statusCode?: number;
}

export class ApiResponse<T = any> {
  constructor(
    private res: Response,
    private options: ApiResponseOptions<T>
  ) {}

  static sendSuccess<T>(res: Response, data: T, statusCode: number = 200) {
    new ApiResponse(res, { success: true }).success(data, statusCode);
  }

  static sendError(res: Response, error: Error | string, statusCode: number = 400) {
    new ApiResponse(res, { success: false }).error(error, statusCode);
  }

  static unauthorized = (res: Response) => new ApiResponse(res, { 
    success: false,
    error: {
      code: 'UNAUTHORIZED',
      message: 'Insufficient privileges for this operation'
    }
  });


  success(data?: T, statusCode: number = 200) {
    this.res.status(statusCode).json({
      success: true,
      data: data || this.options.data,
      meta: this.options.meta
    });
  }

  created(data?: T) {
    this.res.status(201).json({
      success: true,
      data: data || this.options.data
    });
  }

  error(error: Error | string, statusCode: number = 400) {
    const errorDetail: ErrorDetail = {
      code: 'GENERIC_ERROR',
      message: typeof error === 'string' ? error : error.message
    };

    if (error instanceof Error && 'details' in error) {
      errorDetail.details = (error as any).details;
    }

    this.res.status(statusCode).json({
      success: false,
      error: errorDetail
    });
  }
}
