import { Request, Response } from 'express';
import BookingService from '../services/bookingService.js';
import { ApiResponse } from '../utils/apiResponse.js';

class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const booking = await BookingService.createBooking(req.body, req.user.id);
      new ApiResponse(res, { success: true }).success(booking, 201);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
    }
  }

  async updateBookingStatus(req: Request, res: Response) {
    try {
      const booking = await BookingService.updateBookingStatus(
        parseInt(req.params.id),
        req.body.status,
        req.body.reason
      );
      new ApiResponse(res, { success: true }).success(booking, 200);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
    }
  }

  async getBookings(req: Request, res: Response) {
    try {
      const filters = {
        userId: req.query.user_id ? parseInt(req.query.user_id as string) : undefined,
        tripId: req.query.trip_id ? parseInt(req.query.trip_id as string) : undefined,
        status: req.query.status as string | undefined
      };
      const bookings = await BookingService.getBookings(filters);
      new ApiResponse(res, { success: true }).success(bookings, 200);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
    }
  }

  async deleteBooking(req: Request, res: Response) {
    try {
      await BookingService.deleteBooking(parseInt(req.params.id));
      new ApiResponse(res, { success: true }).success(null, 204);
    } catch (error) {
      new ApiResponse(res, { success: false }).error(error instanceof Error ? error : String(error), 500);
    }
  }
}

export default new BookingController();
