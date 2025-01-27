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
        const { from, to, departureDate, minPrice, maxPrice, seats } = filters;
        if (from)
            where.start_date = { [Op.iLike]: `%${from}%` };
        if (to)
            where.end_date = { [Op.iLike]: `%${to}%` };
        if (departureDate) {
            const startDate = new Date(departureDate);
            startDate.setUTCHours(0, 0, 0, 0);
            const endDate = new Date(departureDate);
            endDate.setUTCHours(23, 59, 59, 999);
            where.start_date = { [Op.between]: [startDate, endDate] };
        }
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice)
                where.price[Op.gte] = minPrice;
            if (maxPrice)
                where.price[Op.lte] = maxPrice;
        }
        if (seats)
            where.seats_available = { [Op.gte]: seats };
        return Trip.findAll({
            where,
            include: [{
                    model: User,
                    as: 'organizer',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }],
            order: [['start_date', 'ASC']]
        });
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
