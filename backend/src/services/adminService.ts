import { User, Trip, Booking } from '../models';
import AuditLog from '../models/auditLog';
import Review from '../models/review';
import type { WhereOptions } from 'sequelize';
import type { UserAttributes } from '../models/user';
import { Op } from 'sequelize';
import { PaginationParams, PaginatedResult } from '../types/pagination';
import redisClient from '../config/redis';
import type { 
  ModerationAction, 
  ModerationResult, 
  PlatformAnalytics, 
  ReportParams, 
  ReportResult, 
  UserFilters 
} from '../types/adminTypes.js';
import type { TripAttributes } from '../models/trip';

interface AdminService {
  // User Management
  getPaginatedUsers(options: PaginationParams): Promise<PaginatedResult<User>>;
  updateUser(userId: number, roles: string[]): Promise<User>;
  disableUsers(userIds: number[]): Promise<{ disabledCount: number }>;
  
  // Trip Moderation
  getPendingTrips(): Promise<Trip[]>;
  moderateTrip(tripId: number, action: ModerationAction): Promise<ModerationResult>;
  
  // Analytics
  generateSystemAnalytics(period: string): Promise<PlatformAnalytics>;
  generateReport(params: ReportParams): Promise<ReportResult>;
  
  // System Configuration
  updateSystemConfig(key: string, value: any): Promise<{ key: string; value: any; updatedAt: Date }>;
}

class AdminServiceImpl implements AdminService {
  async getPaginatedUsers(options: PaginationParams): Promise<PaginatedResult<User>> {
    const { page = 1, pageSize = 10 } = options;
    const limit = pageSize;
    const offset = (page - 1) * pageSize;
    const whereClause = {};
    
    const result = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    return {
      data: result.rows,
      total: result.count,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(result.count / limit)
    };
  }

  async updateUser(userId: number, roles: string[]): Promise<User> {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    const validRole = roles[0] as 'user' | 'admin';
    await user.update({ role: validRole });
    
    await AuditLog.create({
      userId: String(userId),
      action: 'ROLE_UPDATE',
      details: JSON.stringify({ newRole: validRole }),
      ipAddress: '127.0.0.1'
    });

    return user;
  }

  async disableUsers(userIds: number[]): Promise<{ disabledCount: number }> {
    const [affectedCount] = await User.update({ deleted_at: new Date() }, {
      where: { id: userIds }
    });

    await AuditLog.bulkCreate(userIds.map(userId => ({
      userId: String(userId),
      action: 'USER_DISABLE',
      details: JSON.stringify({ reason: 'Bulk action' }),
      ipAddress: '127.0.0.1'
    })));

    return { disabledCount: affectedCount };
  }

  async getPendingTrips(): Promise<Trip[]> {
    const cacheKey = 'admin:pending_trips';
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const trips = await Trip.findAll({
      where: { status: 'pending' },
      include: [{
        model: User,
        attributes: ['id', 'name', 'reputation']
      }],
      order: [['createdAt', 'ASC']]
    });

    await redisClient.set(cacheKey, JSON.stringify(trips), 'EX', 60); // Cache for 60s
    return trips;
  }

  async moderateTrip(tripId: number, action: ModerationAction): Promise<ModerationResult> {
    const trip = await Trip.findByPk(tripId);
    if (!trip) throw new Error('Trip not found');

    await trip.update({ status: action === 'approve' ? 'active' : 'rejected' });
    
    await AuditLog.create({
      userId: String(trip.created_by),
      action: 'TRIP_MODERATION',
      details: JSON.stringify({ action, tripId }),
      ipAddress: '127.0.0.1'
    });

    await redisClient.del('admin:pending_trips'); // Invalidate cache

    return {
      tripId,
      newStatus: trip.status,
      moderatedAt: new Date()
    };
  }

  async generateSystemAnalytics(period: string): Promise<PlatformAnalytics> {
    const cacheKey = 'admin:platform_analytics';
    const cached = await redisClient.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const [
      totalUsers,
      totalTrips,
      totalSeats,
      totalBookings,
      activeTripsCount
    ] = await Promise.all([
      User.count(),
      Trip.count(),
      Trip.sum('seats_available'),
      Booking.count(),
      Trip.count({ where: { status: 'active' } })
    ]);

    const analytics: PlatformAnalytics = {
      totalUsers,
      totalTrips,
      totalBookings,
      activeTrips: activeTripsCount,
      averageSeats: totalSeats ? Math.round(totalSeats / totalTrips) : 0
    };

    await redisClient.set(cacheKey, JSON.stringify(analytics), 'EX', 300); // Cache for 5m
    return analytics;
  }

  async generateReport(params: ReportParams): Promise<ReportResult> {
    const { startDate, endDate, reportType } = params;
    
    let data: Array<Record<string, unknown>> = [];
    
    if (reportType === 'user_activity') {
      const users = await User.findAll({
        where: {
          created_at: {
            [Op.between]: [startDate, endDate]
          }
        },
        attributes: ['id', 'name', 'role', 'status', 'createdAt']
      });
      data = users.map(user => user.toJSON() as unknown as Record<string, unknown>);
    } else {
      const trips = await Trip.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: User,
          attributes: ['name']
        }],
        attributes: ['id', 'status', 'seats_available', 'createdAt']
      });
      data = trips.map(trip => trip.toJSON() as unknown as Record<string, unknown>);
    }
    
    return {
      generatedAt: new Date(),
      data
    };
  }

  async updateSystemConfig(key: string, value: any): Promise<{ key: string; value: any; updatedAt: Date }> {
    // Store in Redis for fast access
    const configKey = `system:config:${key}`;
    await redisClient.set(configKey, JSON.stringify(value));
    
    // Log the configuration change
    await AuditLog.create({
      userId: '0', // System user ID for system-level operations
      action: 'SYSTEM_CONFIG_UPDATE',
      details: JSON.stringify({ key, value }),
      ipAddress: '127.0.0.1'
    });

    return {
      key,
      value,
      updatedAt: new Date()
    };
  }

  private buildUserWhereClause(filters: UserFilters): WhereOptions<UserAttributes> {
    const where: any = {};
    if (filters.role) where.role = filters.role;
    if (filters.search) {
      where[Op.or] = [
        { username: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }
    if (!filters.includeDeleted) {
      where.deleted_at = null;
    }
    return where;
  }
}

export default new AdminServiceImpl();
