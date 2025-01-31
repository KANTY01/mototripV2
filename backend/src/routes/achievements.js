import express from 'express'
import { authenticate } from '../middleware/auth.js'
import db from '../models/index.js'
import { param, validationResult } from 'express-validator'

const router = express.Router()
const { Achievement, UserAchievement, User } = db

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Get all achievements
 *     tags: [Achievements]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 *       500:
 *         description: Failed to fetch achievements
 */
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.findAll()
    res.json(achievements)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch achievements', error: err.message })
  }
})

/**
 * @swagger
 * /api/achievements/user/{userId}:
 *   get:
 *     summary: Get achievements for a specific user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to get achievements for
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Achievement'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to fetch user achievements
 */
router.get('/user/:userId', authenticate, [
  param('userId').isInt().withMessage('User ID must be an integer')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { userId } = req.params

  try {
    const user = await User.findByPk(userId, {
      include: [{
        model: Achievement,
        through: { attributes: ['achieved_at'] }
      }]
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user.Achievements)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user achievements', error: err.message })
  }
})

/**
 * @swagger
 * /api/achievements/user/{userId}/{achievementId}:
 *   post:
 *     summary: Grant an achievement to a user
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to grant the achievement to
 *       - in: path
 *         name: achievementId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the achievement to grant
 *     responses:
 *       200:
 *         description: Achievement granted successfully
 *       400:
 *         description: Failed to grant achievement
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or achievement not found
 */
router.post('/user/:userId/:achievementId', authenticate, [
  param('userId').isInt().withMessage('User ID must be an integer'),
  param('achievementId').isInt().withMessage('Achievement ID must be an integer')
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { userId, achievementId } = req.params

  try {
    const user = await User.findByPk(userId)
    const achievement = await Achievement.findByPk(achievementId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' })
    }

    await UserAchievement.create({
      user_id: userId,
      achievement_id: achievementId
    })

    res.json({ message: 'Achievement granted successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Failed to grant achievement', error: err.message })
  }
})

export default router
