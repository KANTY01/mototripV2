import express from 'express'
import { authenticate } from '../middleware/auth.js'
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
      content
    })

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        review_id: review.id,
        image_url: file.path
      }))
      await ReviewImage.bulkCreate(images)
    }

    res.status(201).json({ message: 'Review created successfully', reviewId: review.id })
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
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       400:
 *         description: Failed to fetch reviews
 */
router.get('/:tripId', async (req, res) => {
  const { tripId } = req.params

  try {
    const reviews = await Review.findAll({
      where: { trip_id: tripId },
      include: [{
        model: User,
        attributes: ['username', 'avatar']
      },
      {
        model: ReviewImage,
        attributes: ['image_url']
      }]
    })

    res.json(reviews)
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch reviews', error: err.message })
  }
})

export default router
