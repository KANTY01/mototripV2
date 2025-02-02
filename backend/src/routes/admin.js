import express from 'express'
import { authenticate, authorize } from '../middleware/auth.js'
import db from '../models/index.js'
import { Op } from 'sequelize'

import multer from 'multer'
const router = express.Router()
const { Review, User, Trip, ReviewImage, TripImage } = db
const upload = multer({ dest: 'uploads/' })

/**
 * @swagger
 * /api/admin/reviews:
 *   get:
 *     summary: Get all reviews (admin only)
 *     tags: [Reviews, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reported
 *         schema:
 *           type: boolean
 *         description: Filter by reported reviews
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: tripId
 *         schema:
 *           type: integer
 *         description: Filter by trip ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of reviews
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/reviews', authenticate, authorize(['admin']), async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const perPage = parseInt(req.query.per_page) || 10
  const offset = (page - 1) * perPage

  try {
    const whereClause = {}
    if (req.query.reported === 'true') whereClause.reports = { [Op.gt]: 0 }
    if (req.query.userId) whereClause.user_id = parseInt(req.query.userId)
    if (req.query.status) whereClause.status = req.query.status === 'null' ? null : req.query.status
    if (req.query.tripId) whereClause.trip_id = parseInt(req.query.tripId)

    const { rows, count } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, attributes: ['username', 'avatar'] },
        { model: Trip, attributes: ['title'] },
        { model: ReviewImage, attributes: ['image_url'] }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(perPage),
      offset
    })

    // Transform the data to include image URLs
    const transformedRows = rows.map(row => {
      const review = row.get({ plain: true })
      return {
        ...review,
        images: review.ReviewImages?.map(img => img.image_url) || [],
        status: review.status
      }
    })

    // Format response to match frontend's expected structure
    res.json({
      data: transformedRows || [],
      meta: { current_page: page, last_page: Math.ceil(count / perPage), per_page: perPage, total: count }
    })
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch reviews', error: err.message })
  }
})

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   patch:
 *     summary: Update a review status (admin only)
 *     tags: [Reviews, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.patch('/reviews/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Review not found' })
    }

    const { status, content, rating } = req.body
    if (status && !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' })
    }

    await review.update({
      status: status || review.status,
      content: content || review.content,
      rating: req.body.rating || review.rating
    })

    res.json(review)
  } catch (err) {
    res.status(400).json({ message: 'Failed to update review', error: err.message })
  }
})

/**
 * @swagger
 * /api/admin/reviews/{id}:
 *   delete:
 *     summary: Delete a review (admin only)
 *     tags: [Reviews, Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete('/reviews/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const deleted = await Review.destroy({ where: { id: req.params.id } })
    if (!deleted) {
      return res.status(404).json({ message: 'Review not found' })
    }
    res.json({ message: 'Review deleted successfully', id: req.params.id })
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete review', error: err.message })
  }
})

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: Start date for filtering statistics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: End date for filtering statistics
 *     responses:
 *       200:
 *         description: Statistics data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/statistics', authenticate, authorize(['admin']), async (req, res) => {
  const { startDate, endDate } = req.query
  const dateFilter = {}
  
  if (startDate && endDate) {
    dateFilter.created_at = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    }
  }

  try {
    const [
      totalTrips,
      totalUsers,
      totalReviews,
      premiumUsers,
      averageRating
    ] = await Promise.all([
      Trip.count({ where: dateFilter }),
      User.count({ where: dateFilter }),
      Review.count({ where: dateFilter }),
      User.count({ where: { ...dateFilter, role: 'premium' } }),
      Review.findOne({
        where: dateFilter,
        attributes: [[db.sequelize.fn('AVG', db.sequelize.col('rating')), 'average']]
      })
    ])

    res.json({
      totalTrips,
      totalUsers,
      totalReviews,
      premiumUsers,
      averageRating: averageRating?.getDataValue('average') || 0,
      monthlyRevenue: 0, // Implement actual revenue calculation if needed
      recentActivity: [], // Implement if needed
      userGrowth: [], // Implement if needed
      tripStats: {
        byDifficulty: {},
        byTerrain: {},
        averageDuration: 0,
        averageDistance: 0
      },
      revenueStats: [],
      engagementStats: {
        averageReviewsPerTrip: totalTrips ? totalReviews / totalTrips : 0,
        averageTripsPerUser: totalUsers ? totalTrips / totalUsers : 0,
        activeUsers: totalUsers,
        premiumConversionRate: totalUsers ? (premiumUsers / totalUsers) * 100 : 0
      }
    })
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch statistics', error: err.message })
  }
})

/**
 * @swagger
 * /api/admin/trips:
 *   get:
 *     summary: Get all trips with admin privileges
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of trips
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.get('/trips', authenticate, authorize(['admin']), async (req, res) => {
  const { page = 1, perPage = 10 } = req.query
  const offset = (page - 1) * perPage

  try {
    const { rows, count } = await Trip.findAndCountAll({
      include: [{ model: User, attributes: ['username', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(perPage),
      offset
    })
    
    res.json(rows)
  } catch (err) {
    res.status(400).json([])
  }
})

/**
 * @swagger
 * /api/admin/trips:
 *   post:
 *     summary: Create a new trip (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *               - distance
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               distance:
 *                 type: number
 *               duration:
 *                 type: string
 *               isPremium:
 *                 type: boolean
 *               status:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/trips', authenticate, authorize(['admin']), upload.array('images'), async (req, res) => {
  try {
    const { startLatitude, startLongitude, startAddress, start_date, end_date, ...otherData } = req.body;
    
    // Create the startLocation object if any location data is provided
    let startLocation;
    if (startLatitude || startLongitude || startAddress) {
      startLocation = {
        latitude: startLatitude ? parseFloat(startLatitude) : null,
        longitude: startLongitude ? parseFloat(startLongitude) : null,
        address: startAddress || null
      };
    }

    const tripData = {
      ...otherData,
      startLocation,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      created_by: req.user.id,
      isPremium: otherData.isPremium === 'true',
      distance: parseFloat(otherData.distance) || 0
    };

    console.log('Creating trip with data:', tripData);

    const trip = await Trip.create(tripData);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => ({
        trip_id: trip.id,
        image_url: file.path
      }));
      await TripImage.bulkCreate(images);
    }

    const tripWithImages = await Trip.findByPk(trip.id, { include: [TripImage] });
    res.status(201).json(tripWithImages);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create trip', error: err.message });
  }
})

/**
 * @swagger
 * /api/admin/trips/{id}:
 *   delete:
 *     summary: Delete a trip (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.delete('/trips/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const deleted = await Trip.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Trip not found' });
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete trip', error: err.message });
  }
})

export default router