import Trip from '../models/trip.js';
import User from '../models/user.js';
import Booking from '../models/booking.js';
import { ApiError, ForbiddenError, NotFoundError } from '../utils/errors.js';
import { Op } from 'sequelize';
class TripService {
    static async createTrip(tripData) {
        return Trip.create({
            ...tripData,
            status: 'pending'
        });
    }
    static async searchTrips(filters) {
        const where = {};
        const { search, location, startDate, endDate, minPrice, maxPrice, capacity, categories, tags, sortBy } = filters;
        // Search filter
        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }
        // Location filter
        if (location) {
            where.location = { [Op.iLike]: `%${location}%` };
        }
        // Date filters
        if (startDate) {
            where.start_date = { [Op.gte]: new Date(startDate) };
        }
        if (endDate) {
            where.end_date = { [Op.lte]: new Date(endDate) };
        }
        // Price range
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price[Op.gte] = minPrice;
            if (maxPrice)
                where.price[Op.lte] = maxPrice;
        }
        // Capacity
        if (capacity) {
            where.seats_available = { [Op.gte]: capacity };
        }
        // Categories
        if (categories && categories.length > 0) {
            where.route_type = { [Op.in]: categories };
        }
        // Tags
        if (tags && tags.length > 0) {
            where.motorcycle_types = { [Op.overlap]: tags };
        }
        // Determine sort order
        const order = [['createdAt', 'DESC']];
        if (sortBy) {
            switch (sortBy) {
                case 'price-low':
                    order[0] = ['price', 'ASC'];
                    break;
                case 'price-high':
                    order[0] = ['price', 'DESC'];
                    break;
                case 'rating':
                    order[0] = ['rating', 'DESC'];
                    break;
                case 'date':
                    order[0] = ['start_date', 'ASC'];
                    break;
            }
        }
        const limit = 12; // Items per page
        const offset = ((filters.page || 1) - 1) * limit;
        const { rows: trips, count: total } = await Trip.findAndCountAll({
            where,
            include: [{
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'username']
                }],
            order: order, // Type assertion needed for Sequelize's order type
            limit,
            offset
        });
        return {
            trips,
            total,
            perPage: limit,
            currentPage: filters.page || 1
        };
    }
    static async updateTrip(tripId, updates, userId) {
        const trip = await Trip.findByPk(tripId);
        if (!trip)
            throw new NotFoundError('Trip not found');
        const user = await User.findByPk(userId);
        if (!user)
            throw new NotFoundError('User not found');
        if (trip.created_by !== userId && user.role !== 'admin') {
            throw new ForbiddenError('Not authorized to update this trip');
        }
        return trip.update(updates);
    }
    static async getTripById(tripId) {
        const trip = await Trip.findByPk(tripId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Booking,
                    attributes: ['id', 'startDate', 'endDate', 'totalPrice']
                }
            ]
        });
        if (!trip) {
            throw new ApiError('Trip not found', 404);
        }
        return trip;
    }
    static async archiveTrip(tripId, userId) {
        const trip = await Trip.findByPk(tripId);
        if (!trip)
            throw new NotFoundError('Trip not found');
        const user = await User.findByPk(userId);
        if (!user)
            throw new NotFoundError('User not found');
        if (trip.created_by !== userId && user.role !== 'admin') {
            throw new ForbiddenError('Not authorized to archive this trip');
        }
        return trip.destroy(); // This will perform a soft delete since paranoid is true
    }
}
export default TripService;
