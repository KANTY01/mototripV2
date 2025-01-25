import db from '../config/database.js';
import Booking from '../models/booking.js';
import Trip from '../models/trip.js';
import { ApiError } from '../utils/errors.js';
class BookingService {
    async createBooking(bookingData, userId) {
        return db.transaction(async (t) => {
            const trip = await Trip.findByPk(bookingData.trip_id, {
                transaction: t,
                lock: true
            });
            if (!trip)
                throw new ApiError('Trip not found', 404);
            if (trip.seats_available < bookingData.seats_requested) {
                throw new ApiError('Not enough seats available', 409);
            }
            const booking = await Booking.create({
                ...bookingData,
                user_id: userId,
                status: 'pending'
            }, { transaction: t });
            await Trip.update({ seats_available: trip.seats_available - bookingData.seats_requested }, { where: { id: bookingData.trip_id }, transaction: t });
            return booking;
        });
    }
    async updateBookingStatus(id, status, reason) {
        const validStatuses = ['confirmed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            throw new ApiError('Invalid status value', 400);
        }
        const booking = await Booking.findByPk(id);
        if (!booking)
            throw new ApiError('Booking not found', 404);
        return booking.update({ status, cancellation_reason: reason });
    }
    async getBookings(filters) {
        const whereClause = {};
        if (filters.userId)
            whereClause.user_id = filters.userId;
        if (filters.tripId)
            whereClause.trip_id = filters.tripId;
        if (filters.status)
            whereClause.status = filters.status;
        return Booking.findAll({
            where: whereClause,
            include: [Trip]
        });
    }
    async deleteBooking(id) {
        const booking = await Booking.findByPk(id);
        if (!booking)
            throw new ApiError('Booking not found', 404);
        return db.transaction(async (t) => {
            const trip = await Trip.findByPk(booking.trip_id, { transaction: t });
            if (trip) {
                await Trip.update({ seats_available: trip.seats_available + booking.seats_requested }, { where: { id: booking.trip_id }, transaction: t });
            }
            await booking.destroy({ transaction: t });
        });
    }
}
export default new BookingService();
