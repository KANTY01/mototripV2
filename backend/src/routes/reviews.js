import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import db from '../models/index.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })
const { Review, ReviewImage, User, Trip } = db

/**
 * @swagger
 * /api/reviews/{tripId}:
 *   post:
 *     summary: Create a new review for a trip
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to review
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - content
 *             properties:
 *               rating:
 *                 type: number
 *                 format: float
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Review created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reviewId:
 *                   type: integer
 *       400:
 *         description: Review creation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/:tripId', authenticate, upload.array('images'), async (req, res) => {
  const { rating, content } = req.body
  const { tripId } = req.params
  const userId = req.user.id

  try {
    const review = await Review.create({
      trip_id: tripId,
      user_id: userId,
      rating,
      content,
      status: null // Pending approval
    })

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        review_id: review.id,
        image_url: file.path
      }))
      await ReviewImage.bulkCreate(images)
    }

    // Send back complete review data
    const reviewData = {
      ...review.toJSON(),
      user: req.user,
      votes: { upvotes: 0, downvotes: 0 }
    }

    res.status(201).json(reviewData)
  } catch (err) {
    res.status(400).json({ message: 'Review creation failed', error: err.message })
  }
})

/**
 * @swagger
 * /api/reviews/{tripId}:
 *   get:
 *     summary: Get all reviews for a specific trip
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to get reviews for
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest, highest_rating, lowest_rating]
 *           default: newest
 *         description: Sorting order for reviews
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *                 totalPages:
 *                   type: integer
 *       400:
 *         description: Failed to fetch reviews
 */
router.get('/:tripId', authenticate, async (req, res) => {
  const { tripId } = req.params
  const { page = 1, sort = 'newest' } = req.query
  const limit = 10 // Reviews per page
  const offset = (page - 1) * limit

  let order = []
  switch(sort) {
    case 'newest':
      order = [['created_at', 'DESC']]
      break
    case 'oldest':
      order = [['created_at', 'ASC']]
      break
    case 'highest_rating':
      order = [['rating', 'DESC']]
      break
    case 'lowest_rating':
      order = [['rating', 'ASC']]
      break
    default:
      order = [['created_at', 'DESC']]
  }

  try {
    const { rows, count } = await Review.findAndCountAll({
      where: { 
        trip_id: tripId,
        status: 'approved' // Only show approved reviews
      },
      include: [
        {
          model: User,
          attributes: ['username', 'avatar']
        },
        {
          model: ReviewImage,
          attributes: ['image_url']
        }
      ],
      order,
      limit,
      offset
    })

    const totalPages = Math.ceil(count / limit)
    res.json({ data: rows, totalPages })
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch reviews', error: err.message || 'Unknown error' })
  }
})

// Update a review
router.patch('/update/:reviewId', authenticate, upload.array('images'), async (req, res) => {
  const { reviewId } = req.params
  const userId = req.user.id
  const { rating, content } = req.body

  try {
    const review = await Review.findByPk(reviewId)
    if (!review || !review.id) {
      return res.status(404).json({ message: 'Review not found' })
    }

    if (review.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this review' })
    }

    await review.update({
      rating,
      content
    })

    // Format the created_at date to ISO string
    review.created_at = review.created_at.toISOString()

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        review_id: review.id,
        image_url: file.path
      }))
      await ReviewImage.bulkCreate(images)
    }

    // Fetch the updated review with user and images
    const updatedReview = await Review.findByPk(review.id, {
      include: [
        { model: User, attributes: ['username', 'avatar'] },
        { model: ReviewImage, attributes: ['image_url'] }
      ]
    })
    res.json(updatedReview)
  } catch (err) {
    res.status(400).json({ message: 'Review update failed', error: err.message })
  }
})

// Vote on a review
router.post('/vote/:reviewId', authenticate, async (req, res) => {
  const { reviewId } = req.params
  const { vote_type } = req.body
  const userId = req.user.id

  try {
    const review = await Review.findByPk(reviewId)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    res.json({ message: 'Vote recorded successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Vote failed', error: err.message })
  }
})

// Delete a review
router.delete('/:reviewId', authenticate, async (req, res) => {
  const { reviewId } = req.params
  const userId = req.user.id

  try {
    const review = await Review.findByPk(reviewId)
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }
    
    if (review.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this review' })
    }
    await review.destroy()
    res.json({ message: 'Review deleted successfully', id: reviewId })
  } catch (err) {
    res.status(400).json({ message: 'Delete failed', error: err.message })
  }
})

/**
 * Get reviews written by a specific user
 */
router.get('/user/:userId', authenticate, async (req, res) => {
  const { userId } = req.params
  const { page = 1, per_page: perPage = 10 } = req.query
  const offset = (page - 1) * perPage

  try {
    // Users can only view their own reviews unless they're an admin
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view these reviews' })
    }

    const { rows, count } = await Review.findAndCountAll({
      where: { 
        user_id: userId,
        ...(req.user.role !== 'admin' && { status: 'approved' }) // Only admins can see all reviews
      },
      include: [
        {
          model: User,
          attributes: ['username', 'avatar']
        },
        {
          model: Trip,
          attributes: ['title', 'created_by']
        },
        {
          model: ReviewImage,
          attributes: ['image_url']
        }
      ],
      where: {
        ...(req.user.role !== 'admin' && { status: 'approved' }) // Only admins can see all reviews
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(perPage),
      offset
    })

    res.json({
      data: rows,
      meta: {
        current_page: parseInt(page),
        per_page: parseInt(perPage),
        total: count,
        last_page: Math.ceil(count / perPage)
      }
    })
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch reviews', error: err.message })
  }
})

/**
 * Get reviews for trips created by a specific user
 */
router.get('/trip-owner/:userId', authenticate, async (req, res) => {
  const { userId } = req.params
  const { page = 1, per_page: perPage = 10 } = req.query
  const offset = (page - 1) * perPage

  try {
    // Users can only view reviews for their own trips unless they're an admin
    if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to view these reviews' })
    }

    // Build where clause
    const { rows, count } = await Review.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ['username', 'avatar']
        },
        {
          model: Trip,
          attributes: ['title', 'created_by'],
          where: { created_by: userId }
        },
        {
          model: ReviewImage,
          attributes: ['image_url']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(perPage),
      offset
    })

    res.json({
      data: rows,
      meta: {
        current_page: parseInt(page),
        per_page: parseInt(perPage),
        total: count,
        last_page: Math.ceil(count / perPage)
      }
    })
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch reviews', error: err.message })
  }
})

export default router
