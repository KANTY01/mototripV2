import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export const reviewValidation = {
  validateGetReviews: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, pageSize, sortBy, sortOrder } = req.query;

      // Validate pagination parameters
      if (page && (isNaN(Number(page)) || Number(page) < 1)) {
        throw new ApiError('Invalid page number', 400);
      }

      if (pageSize && (isNaN(Number(pageSize)) || Number(pageSize) < 1)) {
        throw new ApiError('Invalid page size', 400);
      }

      // Validate sorting parameters
      if (sortBy && !['createdAt', 'rating'].includes(sortBy as string)) {
        throw new ApiError('Invalid sort field', 400);
      }

      if (sortOrder && !['ASC', 'DESC'].includes((sortOrder as string).toUpperCase())) {
        throw new ApiError('Invalid sort order', 400);
      }

      // Validate filter parameters
      if (req.query.tripId && isNaN(Number(req.query.tripId))) {
        throw new ApiError('Invalid trip ID', 400);
      }

      if (req.query.userId && isNaN(Number(req.query.userId))) {
        throw new ApiError('Invalid user ID', 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  validateUpdateReview: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rating, comment } = req.body;

      // Validate review ID
      if (!req.params.id || isNaN(Number(req.params.id))) {
        throw new ApiError('Invalid review ID', 400);
      }


      // Validate rating if provided
      if (rating !== undefined) {
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          throw new ApiError('Rating must be an integer between 1 and 5', 400);
        }
      }

      // Validate comment if provided
      if (comment !== undefined) {
        if (typeof comment !== 'string' || comment.length < 10 || comment.length > 2000) {
          throw new ApiError('Comment must be between 10 and 2000 characters', 400);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  },

  validateCreateReview: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rating, comment, tripId, bookingId } = req.body;

      // Validate required fields
      if (!rating || !comment || !tripId || !bookingId) {
        throw new ApiError('Missing required review fields', 400);
      }

      // Validate rating
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new ApiError('Rating must be an integer between 1 and 5', 400);
      }

      // Validate comment
      if (typeof comment !== 'string' || comment.length < 10 || comment.length > 2000) {
        throw new ApiError('Comment must be between 10 and 2000 characters', 400);
      }

      // Validate trip/booking references
      if (isNaN(Number(tripId)) || isNaN(Number(bookingId))) {
        throw new ApiError('Invalid trip or booking reference', 400);
      }

      next();
    } catch (error) {
      next(error);
    }
  }
};
