import { Router } from 'express';
import { Op } from 'sequelize';
import { roleCheck } from '../middleware/adminMiddleware.js';
import { validateAccessToken } from '../middleware/authMiddleware.js';
import User from '../models/user.js';
import Trip from '../models/trip.js';
import AuditLog from '../models/auditLog.js';
import { ApiError } from '../utils/errors.js';

const router = Router();

// Apply authentication and role-based access control to all routes
router.use(validateAccessToken);
router.use(roleCheck(['admin']));

// User management endpoints
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'created_at'],
      where: {
        deleted_at: null
      }
    });
    res.json(users);
  } catch (error) {
    next(new ApiError('Failed to fetch users', 500));
  }
});

router.patch('/users/:id/role', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (role !== 'admin' && role !== 'user') {
      throw new ApiError('Invalid role', 400);
    }
    
    const user = await User.findByPk(id);
    if (!user) throw new ApiError('User not found', 404);
    
    await user.update({ role });
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id/activate', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) throw new ApiError('User not found', 404);
    
    await user.update({ deleted_at: null });
    res.json({ message: 'User activated successfully' });
  } catch (error) {
    next(error);
  }
});

// Trip management endpoints
router.get('/trips', async (req, res, next) => {
  try {
    const trips = await Trip.findAll({
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'username']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json(trips);
  } catch (error) {
    next(new ApiError('Failed to fetch trips', 500));
  }
});

router.get('/trips/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id, {
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'username']
      }]
    });
    
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }
    
    res.json(trip);
  } catch (error) {
    next(error);
  }
});

router.put('/trips/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'active', 'rejected', 'completed'] as const;
    const normalizedStatus = status.toLowerCase();
    
    if (!validStatuses.includes(normalizedStatus as typeof validStatuses[number])) {
      throw new ApiError('Invalid status. Must be one of: pending, active, rejected, completed', 400);
    }
    
    const trip = await Trip.findByPk(id);
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }
    
    await trip.update({ status: normalizedStatus });
    
    // Log the action
    await AuditLog.create({
      userId: String(req.user.id),
      action: 'UPDATE_TRIP_STATUS',
      details: `Updated trip ${id} status to ${normalizedStatus}`,
      ipAddress: req.ip || 'unknown'
    });
    
    res.json({ message: 'Trip status updated successfully' });
  } catch (error) {
    next(error);
  }
});

router.delete('/trips/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);
    
    if (!trip) {
      throw new ApiError('Trip not found', 404);
    }
    
    await trip.destroy();
    
    // Log the action
    await AuditLog.create({
      userId: String(req.user.id),
      action: 'DELETE_TRIP',
      details: `Deleted trip ${id}`,
      ipAddress: req.ip || 'unknown'
    });
    
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Analytics and statistics endpoints
router.get('/statistics', async (req, res, next) => {
  try {
    const totalUsers = await User.count({ where: { deleted_at: null } });
    const activeUsers = await User.count({ where: { deleted_at: null } });
    const pendingUsers = await User.count({ where: { deleted_at: { [Op.not]: null } } });
    
    res.json({
      totalUsers,
      activeUsers,
      pendingUsers,
      totalMeetings: 0 // TODO: Implement meetings count
    });
  } catch (error) {
    next(new ApiError('Failed to fetch statistics', 500));
  }
});

// System settings endpoints
router.get('/settings', async (req, res) => {
  res.json({
    settings: {
      require_admin_approval: true,
      max_login_attempts: 5,
      password_expiry_days: 90
    }
  });
});

router.put('/settings', async (req, res, next) => {
  try {
    // TODO: Implement settings update logic
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    next(new ApiError('Failed to update settings', 500));
  }
});

// Audit logs endpoints
router.get('/logs', async (req, res, next) => {
  try {
    const logs = await AuditLog.findAll({
      order: [['created_at', 'DESC']],
      limit: 100,
      include: [{
        model: User,
        attributes: ['username']
      }]
    });
    
    res.json({
      data: logs
    });
  } catch (error) {
    next(new ApiError('Failed to fetch audit logs', 500));
  }
});

// Meetings management endpoints
router.get('/meetings', async (req, res, next) => {
  try {
    const meetings = await Trip.findAll({
      where: {
        status: 'active'
      },
      include: [{
        model: User,
        as: 'organizer',
        attributes: ['id', 'username']
      }],
      order: [['start_date', 'DESC']]
    });
    
    res.json(meetings);
  } catch (error) {
    next(new ApiError('Failed to fetch meetings', 500));
  }
});

export default router;
