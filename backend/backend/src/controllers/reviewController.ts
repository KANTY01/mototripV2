import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/errors.js';
import { JwtPayload } from '../middleware/authMiddleware.js';

export class ReviewController {
  static async getReviews(req: Request, res: Response) {
    try {
      const { page, pageSize, sortBy, sortOrder } = req.query;
      const filters = { 
        tripId: req.query.tripId ? Number(req.query.tripId) : undefined,
        userId: req.query.userId ? Number(req.query.userId) : undefined
      };
      
      const result = await ReviewService.getReviews(filters, { 
        page: Number(page || 1),
        pageSize: Number(pageSize || 10),
        sortBy: (sortBy as string) || 'createdAt',
        sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC'
      });
      
      new ApiResponse(res, { success: true }).success({
        data: result.rows,
        total: result.count,
        page: Number(page || 1),
        pageSize: Number(pageSize || 10)
      });
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
    }
  }

  static async updateReview(req: Request, res: Response) {
    try {
      const review = await ReviewService.updateReview(
        Number(req.params.id),
        req.body,
        (req.user as JwtPayload).id,
        (req.user as JwtPayload).role === 'admin'
      );
      new ApiResponse(res, { success: true }).success(review);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
    }
  }

  static async createReview(req: Request, res: Response) {
    try {
      const review = await ReviewService.createReview(
        req.body,
        (req.user as JwtPayload).id
      );
      new ApiResponse(res, { success: true }).created(review);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
