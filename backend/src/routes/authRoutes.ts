import express from 'express';
import authController from '../controllers/authController.js';
import { validateAccessToken, validateRefreshToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Token refresh route
router.post('/refresh', validateRefreshToken, authController.refreshToken);

// Logout route (requires valid token)
router.post('/logout', 
  validateAccessToken,
  authController.logout
);

// Get current user route
router.get('/me',
  validateAccessToken,
  (req, res) => {
    // Since validateAccessToken middleware sets req.user, we can return it
    res.json({ user: req.user });
  }
);

export default router;
