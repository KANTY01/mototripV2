import express from 'express'
import { authenticate } from '../middleware/auth.js'
import db from '../models/index.js'
import multer from 'multer'
import cache from '../cache.js'

const router = express.Router()
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage })
const { User } = db

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to fetch user profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticate, async (req, res) => {
  const userId = req.user.id

  try {
    const cacheKey = `user:${userId}`
    const cachedUser = await cache.get(cacheKey)

    if (cachedUser) {
      return res.json(JSON.parse(cachedUser))
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await cache.set(cacheKey, JSON.stringify(user), 'EX', 3600) // Cache for 1 hour

    res.json(user)
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch user profile', error: err.message })
  }
})

/**
 * @swagger
 * /api/users/update:
 *   patch:
 *     summary: Update the current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               experience_level:
 *                 type: string
 *               preferred_routes:
 *                 type: array
 *                 items:
 *                   type: string
 *               motorcycle_details:
 *                 type: object
 *                 properties:
 *                   make:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to update profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/update', authenticate, upload.single('avatar'), async (req, res) => {
  const userId = req.user.id
  const { username, email, bio, experience_level, preferred_routes, motorcycle_details } = req.body

  try {
    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Debug logging
    console.log('Raw request body:', req.body)
    console.log('Raw motorcycle_details:', req.body.motorcycle_details)
    if (req.body.motorcycle_details) {
      console.log('Type of motorcycle_details:', typeof req.body.motorcycle_details)
    }

    // Helper function to safely parse JSON
    const safeJSONParse = (str) => {
      try {
        // First, handle potential multiple escaping
        let cleaned = str
        while (typeof cleaned === 'string' && (cleaned.startsWith('"') || cleaned.includes('\\"'))) {
          cleaned = JSON.parse(cleaned)
        }
        // If it's still a string but looks like an object, parse it
        if (typeof cleaned === 'string' && cleaned.startsWith('{')) {
          cleaned = JSON.parse(cleaned)
        }
        return cleaned
      } catch (e) {
        console.error('JSON parse error:', e.message, '\nInput was:', str)
        return null
      }
    }

    // Log all received fields
    console.log('Received fields:', { username, email, bio, experience_level, preferred_routes, motorcycle_details })

    user.username = username ?? user.username
    user.email = email ?? user.email
    user.bio = bio ?? user.bio
    user.experience_level = experience_level ?? user.experience_level
    
    // Handle preferred_routes parsing
    if (preferred_routes) {
      const parsedRoutes = safeJSONParse(preferred_routes)
      user.preferred_routes = Array.isArray(parsedRoutes) 
        ? JSON.stringify(parsedRoutes)
        : preferred_routes
    }
    
    // Handle motorcycle_details parsing
    if (motorcycle_details) {
      const parsedDetails = safeJSONParse(motorcycle_details)
      console.log('Parsed motorcycle_details:', parsedDetails)
      if (parsedDetails && typeof parsedDetails === 'object' && !Array.isArray(parsedDetails)) {
        user.motorcycle_details = JSON.stringify(parsedDetails)
      } else {
        console.warn('Invalid motorcycle_details format:', motorcycle_details)
      }
    }

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`
    }

    await user.save()

    // Invalidate cache
    const cacheKey = `user:${userId}`
    await cache.del(cacheKey)

    res.json({ message: 'Profile updated successfully', user: user.toJSON() })
  } catch (err) {
    console.error('Profile Update Error:', {
      error: err,
      message: err.message,
      stack: err.stack,
      requestBody: req.body
    })

    // Send more detailed error response
    res.status(400).json({
      message: 'Failed to update profile',
      error: err.message || 'Unknown error occurred',
      details: err.stack,
      validationErrors: err.errors
    })
  }
})

export default router
