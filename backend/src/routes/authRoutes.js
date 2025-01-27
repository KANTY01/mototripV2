import express from 'express';
import authController from '../controllers/authController.js';
import authService from '../services/authService.js';

const router = express.Router();

// Registration route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Token refresh route
router.post('/refresh', authController.refreshToken);

// Logout route (requires valid token)
router.post('/logout', 
  authController.authenticateToken,
  authController.logout
);

// Protected test route
router.get('/protected',
  authController.authenticateToken,
  (req, res) => res.json({ message: 'Protected route accessed' })
);

export default router;
