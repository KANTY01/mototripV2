import { Router } from 'express';
import reviewRoutes from './reviewRoutes.js';
import adminRoutes from './adminRoutes.js';
import tripRoutes from './tripRoutes.js';
import authRoutes from './authRoutes.js';
const router = Router();
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version,
        services: ['auth', 'trips', 'reviews', 'admin']
    });
});
// Public routes
router.use('/auth', authRoutes);
router.use('/reviews', reviewRoutes);
router.use('/trips', tripRoutes);
// Admin routes
router.use('/admin', adminRoutes);
export default router;
