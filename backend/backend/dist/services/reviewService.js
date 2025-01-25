import sequelize from '../config/database.js';
import Review from '../models/review.js';
import { ApiError } from '../utils/errors.js';
export const ReviewService = {
    async getReviews(filters, pagination) {
        const { page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = pagination;
        const whereClause = {};
        if (filters.tripId)
            whereClause.tripId = filters.tripId;
        if (filters.userId)
            whereClause.userId = filters.userId;
        return Review.findAndCountAll({
            where: whereClause,
            limit: pageSize,
            offset: (page - 1) * pageSize,
            order: [[sortBy, sortOrder]],
            include: ['User', 'Trip']
        });
    },
    async updateReview(reviewId, updateData, userId, isAdmin) {
        return sequelize.transaction(async (t) => {
            const review = await Review.findOne({
                where: { id: reviewId.toString() },
                transaction: t,
                rejectOnEmpty: false
            });
            if (!review) {
                throw new ApiError('Review not found', 404);
            }
            if (!isAdmin && review.userId !== userId) {
                throw new ApiError('Not authorized to update this review', 403);
            }
            return review.update(updateData, { transaction: t });
        });
    }
};
