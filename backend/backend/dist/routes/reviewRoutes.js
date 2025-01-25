import express from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { validateAccessToken } from '../middleware/authMiddleware.js';
import { reviewValidation } from '../middleware/reviewValidation.js';
const router = express.Router();
// GET /reviews with pagination and filters
router.get('/', validateAccessToken, reviewValidation.validateGetReviews, ReviewController.getReviews);
// PUT /reviews/:id 
router.put('/:id', validateAccessToken, reviewValidation.validateUpdateReview, ReviewController.updateReview);
export default router;
