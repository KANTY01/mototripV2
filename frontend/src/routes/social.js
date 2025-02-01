import express from 'express'
import { authenticate } from '../middleware/auth.js'
import db from '../models/index.js'

const router = express.Router()
const { Follower, Trip, User } = db

/**
 * @swagger
 * /api/social/follow/{userId}:
 *   post:
 *     summary: Follow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to follow
 *     responses:
 *       200:
 *         description: Followed successfully
 *       400:
 *         description: Failed to follow user
 *       401:
 *         description: Unauthorized
 */
router.post('/follow/:userId', authenticate, async (req, res) => {
  const { userId } = req.params
  const followerId = req.user.id

  try {
    await Follower.create({
      follower_id: followerId,
      following_id: userId
    })
    res.json({ message: 'Followed successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Failed to follow user', error: err.message })
  }
})

/**
 * @swagger
 * /api/social/follow/{userId}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       400:
 *         description: Failed to unfollow user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Follow relationship not found
 */
router.delete('/follow/:userId', authenticate, async (req, res) => {
  const { userId } = req.params
  const followerId = req.user.id

  try {
    const result = await Follower.destroy({
      where: {
        follower_id: followerId,
        following_id: userId
      }
    })

    if (result === 0) {
      return res.status(404).json({ message: 'Follow relationship not found' })
    }

    res.json({ message: 'Unfollowed successfully' })
  } catch (err) {
    res.status(400).json({ message: 'Failed to unfollow user', error: err.message })
  }
})

/**
 * @swagger
 * /api/social/feed:
 *   get:
 *     summary: Get the current user's feed
 *     tags: [Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Failed to fetch feed
 *       401:
 *         description: Unauthorized
 */
router.get('/feed', authenticate, async (req, res) => {
  const userId = req.user.id

  try {
    const following = await Follower.findAll({
      where: { follower_id: userId },
      attributes: ['following_id']
    })

    const followingIds = following.map(f => f.following_id)

    const feed = await Trip.findAll({
      where: {
        created_by: followingIds
      },
      include: [{
        model: User,
        attributes: ['username', 'avatar']
      }],
      order: [['created_at', 'DESC']]
    })

    res.json(feed)
  } catch (err) {
    res.status(400).json({ message: 'Failed to fetch feed', error: err.message })
  }
})

export default router
