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
    },
    async createReview(data, userId) {
        return sequelize.transaction(async (t) => {
            // Validate rating
            if (data.rating < 1 || data.rating > 5) {
                throw new ApiError('Rating must be between 1 and 5', 400);
            }
            // Validate comment length
            if (data.comment.length < 10 || data.comment.length > 2000) {
                throw new ApiError('Comment must be between 10 and 2000 characters', 400);
            }
            // Create the review
            const review = await Review.create({
                ...data,
                userId
            }, {
                transaction: t,
                include: ['User', 'Trip']
            });
            // Fetch the created review with associations
            return Review.findByPk(review.id, {
                transaction: t,
                include: ['User', 'Trip'],
                rejectOnEmpty: true
            });
        });
    }
};
