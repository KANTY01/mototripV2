import BookingService from '../services/bookingService.js';
import { ApiResponse } from '../utils/apiResponse.js';
class BookingController {
    async createBooking(req, res) {
        try {
            const booking = await BookingService.createBooking(req.body, req.user.id);
            new ApiResponse(res, { success: true }).success(booking, 201);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
        }
    }
    async updateBookingStatus(req, res) {
        try {
            const booking = await BookingService.updateBookingStatus(parseInt(req.params.id), req.body.status, req.body.reason);
            new ApiResponse(res, { success: true }).success(booking, 200);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
        }
    }
    async getBookings(req, res) {
        try {
            const filters = {
                userId: req.query.user_id ? parseInt(req.query.user_id) : undefined,
                tripId: req.query.trip_id ? parseInt(req.query.trip_id) : undefined,
                status: req.query.status
            };
            const bookings = await BookingService.getBookings(filters);
            new ApiResponse(res, { success: true }).success(bookings, 200);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
        }
    }
    async deleteBooking(req, res) {
        try {
            await BookingService.deleteBooking(parseInt(req.params.id));
            new ApiResponse(res, { success: true }).success(null, 204);
        }
        catch (error) {
            new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
        }
    }
}
export default new BookingController();
