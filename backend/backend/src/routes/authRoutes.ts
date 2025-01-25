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

// Protected test route
router.get('/protected',
  validateAccessToken,
  (req, res) => {
    res.json({ message: 'Protected route accessed' });
  }
);

export default router;
