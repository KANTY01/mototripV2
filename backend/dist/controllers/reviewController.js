import { ReviewService } from '../services/reviewService.js';
import { ApiResponse } from '../utils/apiResponse.js';
export class ReviewController {
    static async getReviews(req, res) {
        try {
            const { page, pageSize, sortBy, sortOrder } = req.query;
            const filters = {
                tripId: req.query.tripId ? Number(req.query.tripId) : undefined,
                userId: req.query.userId ? Number(req.query.userId) : undefined
            };
            const result = await ReviewService.getReviews(filters, {
                page: Number(page || 1),
                pageSize: Number(pageSize || 10),
                sortBy: sortBy || 'createdAt',
                sortOrder: sortOrder || 'DESC'
            });
            new ApiResponse(res, { success: true }).success({
                data: result.rows,
                total: result.count,
                page: Number(page || 1),
                pageSize: Number(pageSize || 10)
            });
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
        }
    }
    static async updateReview(req, res) {
        try {
            const review = await ReviewService.updateReview(Number(req.params.id), req.body, req.user.id, req.user.role === 'admin');
            new ApiResponse(res, { success: true }).success(review);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
        }
    }
    static async createReview(req, res) {
        try {
            const review = await ReviewService.createReview(req.body, req.user.id);
            new ApiResponse(res, { success: true }).created(review);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : new Error(String(error)));
        }
    }
}
