import express from 'express'
import { authenticate } from '../middleware/auth.js'
import db from '../models/index.js'
import multer from 'multer'
import cache from '../cache.js'

const router = express.Router()
const upload = multer({ dest: 'uploads/' })
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
  const { username, experience_level, preferred_routes, motorcycle_details } = req.body

  try {
    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.username = username ?? user.username
    user.experience_level = experience_level ?? user.experience_level
    user.preferred_routes = preferred_routes ? JSON.stringify(preferred_routes) : user.preferred_routes
    user.motorcycle_details = motorcycle_details ? JSON.stringify(motorcycle_details) : user.motorcycle_details

    if (req.file) {
      user.avatar = req.file.path
    }

    await user.save()

    // Invalidate cache
    const cacheKey = `user:${userId}`
    await cache.del(cacheKey)

    res.json({ message: 'Profile updated successfully', user })
  } catch (err) {
    res.status(400).json({ message: 'Failed to update profile', error: err.message })
  }
})

export default router
