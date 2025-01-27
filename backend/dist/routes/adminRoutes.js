import { Router } from 'express';
import { roleCheck } from '../middleware/adminMiddleware.js';
import User from '../models/user.js';
import { ApiError } from '../utils/errors.js';
const router = Router();
// Apply role-based access control
// User management endpoints
router.get('/users', roleCheck(['admin']), async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'created_at'],
            where: {
                deleted_at: null
            }
        });
        res.json(users);
    }
    catch (error) {
        next(new ApiError('Failed to fetch users', 500));
    }
});
router.patch('/users/:id/role', roleCheck(['admin']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (role !== 'admin' && role !== 'user') {
            throw new ApiError('Invalid role', 400);
        }
        const user = await User.findByPk(id);
        if (!user)
            throw new ApiError('User not found', 404);
        await user.update({ role });
        res.json({ message: 'User role updated successfully' });
    }
    catch (error) {
        next(error);
    }
});
// Trip moderation endpoints
router.get('/trips/pending', async (req, res, next) => {
    try {
        // TODO: Implement trip moderation logic
        res.json({ message: 'Pending trips endpoint' });
    }
    catch (error) {
        next(new ApiError('Failed to fetch pending trips', 500));
    }
});
// Analytics endpoints
router.get('/analytics', async (req, res, next) => {
    try {
        // TODO: Implement analytics data collection
        res.json({ message: 'Analytics endpoint' });
    }
    catch (error) {
        next(new ApiError('Failed to fetch analytics', 500));
    }
});
export default router;
