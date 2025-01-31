import initializeDb from '../db/db.js'

let dbInstance = null

export const checkPremium = async (req, res, next) => {
  const userId = req.user.id

  try {
    if (!dbInstance) {
      dbInstance = await initializeDb()
    }
    
    const subscription = await dbInstance.get(`
      SELECT * FROM subscriptions
      WHERE user_id = ? AND status = 'active'
      AND end_date > CURRENT_DATE
    `, [userId])

    if (!subscription) {
      return res.status(403).json({ message: 'Premium content requires active subscription' })
    }

    next()
  } catch (err) {
    res.status(400).json({ message: 'Failed to verify premium status' })
  }
}
