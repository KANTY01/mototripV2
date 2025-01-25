import { User, Trip, Booking } from '../models';
import AuditLog from '../models/auditLog';
import { Op } from 'sequelize';
import redisClient from '../config/redis';
class AdminServiceImpl {
    async getPaginatedUsers(options) {
        const { page = 1, pageSize = 10 } = options;
        const limit = pageSize;
        const offset = (page - 1) * pageSize;
        const whereClause = {};
        const result = await User.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        return {
            data: result.rows,
            total: result.count,
            page: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(result.count / limit)
        };
    }
    async updateUser(userId, roles) {
        const user = await User.findByPk(userId);
        if (!user)
            throw new Error('User not found');
        const validRole = roles[0];
        await user.update({ role: validRole });
        await AuditLog.create({
            userId: String(userId),
            action: 'ROLE_UPDATE',
            details: JSON.stringify({ newRoles: roles }),
            ipAddress: '127.0.0.1'
        });
        return user;
    }
    async disableUsers(userIds) {
        const [affectedCount] = await User.update({ status: 'disabled' }, {
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
    async getPendingTrips() {
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
    async moderateTrip(tripId, action) {
        const trip = await Trip.findByPk(tripId);
        if (!trip)
            throw new Error('Trip not found');
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
    async generateSystemAnalytics(period) {
        const cacheKey = 'admin:platform_analytics';
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const [totalUsers, totalTrips, totalSeats, totalBookings, activeTripsCount] = await Promise.all([
            User.count(),
            Trip.count(),
            Trip.sum('seats_available'),
            Booking.count(),
            Trip.count({ where: { status: 'active' } })
        ]);
        const analytics = {
            totalUsers,
            totalTrips,
            totalBookings,
            activeTrips: activeTripsCount,
            averageSeats: totalSeats ? Math.round(totalSeats / totalTrips) : 0
        };
        await redisClient.set(cacheKey, JSON.stringify(analytics), 'EX', 300); // Cache for 5m
        return analytics;
    }
    async generateReport(params) {
        const { startDate, endDate, reportType } = params;
        let data = [];
        if (reportType === 'user_activity') {
            const users = await User.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['id', 'name', 'role', 'status', 'createdAt']
            });
            data = users.map(user => user.toJSON());
        }
        else {
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
            data = trips.map(trip => trip.toJSON());
        }
        return {
            generatedAt: new Date(),
            data
        };
    }
    async updateSystemConfig(key, value) {
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
    buildUserWhereClause(filters) {
        const where = {};
        if (filters.role)
            where.role = filters.role;
        if (filters.status)
            where.status = filters.status;
        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${filters.search}%` } },
                { email: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }
        return where;
    }
}
export default new AdminServiceImpl();
