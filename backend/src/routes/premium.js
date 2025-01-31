import express from 'express'
import { authenticate } from '../middleware/auth.js'
import db from '../models/index.js'

const router = express.Router()
const { Subscription } = db

/**
 * @swagger
 * /api/premium/subscribe:
 *   post:
 *     summary: Create a new subscription for the current user
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       400:
 *         description: Subscription creation failed
 *       401:
 *         description: Unauthorized
 */
router.post('/subscribe', authenticate, async (req, res) => {
  const userId = req.user.id
  const { startDate, endDate } = req.body

  try {
    await Subscription.create({
      user_id: userId,
      start_date: startDate,
      end_date: endDate
    })
    res.status(201).json({ message: 'Subscription created successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Subscription creation failed', error: err.message })
  }
})

/**
 * @swagger
 * /api/premium/status:
 *   get:
 *     summary: Check the current user's premium subscription status
 *     tags: [Premium]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isPremium:
 *                   type: boolean
 *                 subscription:
 *                   $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Failed to check premium status
 *       401:
 *         description: Unauthorized
 */
router.get('/status', authenticate, async (req, res) => {
  const userId = req.user.id

  try {
    const subscription = await Subscription.findOne({
      where: {
        user_id: userId,
        status: 'active',
        end_date: {
          [db.Sequelize.Op.gte]: new Date()
        }
      },
      order: [['end_date', 'DESC']]
    })

    res.json({
      isPremium: !!subscription,
      subscription
    })
  } catch (err) {
    res.status(400).json({ message: 'Failed to check premium status', error: err.message })
  }
})

export default router
