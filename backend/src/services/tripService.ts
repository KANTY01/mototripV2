import Trip from '../models/trip.js';
import User from '../models/user.js';
import Booking from '../models/booking.js';
import { ApiError, ForbiddenError, NotFoundError } from '../utils/errors.js';
import { Op } from 'sequelize';

interface TripCreationData {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  capacity: number;
  seats_available: number;
  created_by: number;
  status: 'pending' | 'active' | 'rejected' | 'completed';
  route_type: 'highway' | 'offroad' | 'mixed';
  required_experience: 'beginner' | 'intermediate' | 'advanced';
  motorcycle_types: string[];
  route_highlights: string[];
  route_map_url: string | null;
  required_gear: string[];
  distance_km: number;
  estimated_duration: string;
  terrain_difficulty: 'easy' | 'moderate' | 'challenging';
  rest_stops: string[];
  weather_info: Record<string, unknown> | null;
}

interface TripSearchFilters {
  from?: string;
  to?: string;
  departureDate?: string;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
}

interface TripUpdateData {
  title?: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  price?: number;
  capacity?: number;
  seats_available?: number;
}

class TripService {
  static async createTrip(tripData: TripCreationData) {
    return Trip.create({
      ...tripData,
      status: 'pending'
    });
  }

  static async searchTrips(filters: TripSearchFilters) {
    const where: any = {};
    const { from, to, departureDate, minPrice, maxPrice, seats } = filters;

    if (from) where.start_date = { [Op.iLike]: `%${from}%` };
    if (to) where.end_date = { [Op.iLike]: `%${to}%` };
    if (departureDate) {
      const startDate = new Date(departureDate);
      startDate.setUTCHours(0, 0, 0, 0);
      const endDate = new Date(departureDate);
      endDate.setUTCHours(23, 59, 59, 999);
      where.start_date = { [Op.between]: [startDate, endDate] };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    if (seats) where.seats_available = { [Op.gte]: seats };

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

  static async updateTrip(tripId: number, updates: TripUpdateData, userId: number) {
    const trip = await Trip.findByPk(tripId);
    if (!trip) throw new NotFoundError('Trip not found');

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');
    if (trip.created_by !== userId && user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to update this trip');
    }

    return trip.update(updates);
  }

  static async getTripById(tripId: number): Promise<Trip> {
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

  static async archiveTrip(tripId: number, userId: number): Promise<void> {
    const trip = await Trip.findByPk(tripId);
    if (!trip) throw new NotFoundError('Trip not found');

    const user = await User.findByPk(userId);
    if (!user) throw new NotFoundError('User not found');
    if (trip.created_by !== userId && user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to archive this trip');
    }

    return trip.destroy(); // This will perform a soft delete since paranoid is true
  }
}

export default TripService;
