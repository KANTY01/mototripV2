import { api } from './index';

export interface BookingAttributes {
  tripId: string;
  participants: number;
  preferredDate: string;
  specialRequests?: string;
}

export interface BookingResponse {
  id: string;
  tripId: string;
  userId: string;
  participants: number;
  preferredDate: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  trip: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    price: number;
  };
  user: {
    id: string;
    username: string;
  };
}

export interface BookingsResponse {
  bookings: BookingResponse[];
  total: number;
  page: number;
  perPage: number;
}

export const bookingsApi = {
  getBookings: async (page = 1): Promise<BookingsResponse> => {
    const response = await api.get('/bookings', {
      params: { page },
    });
    return response.data;
  },

  getBooking: async (id: string): Promise<BookingResponse> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (data: BookingAttributes): Promise<BookingResponse> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  updateBooking: async (
    id: string,
    data: Partial<BookingAttributes>
  ): Promise<BookingResponse> => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },

  // Get bookings for a specific trip
  getTripBookings: async (tripId: string, page = 1): Promise<BookingsResponse> => {
    const response = await api.get(`/trips/${tripId}/bookings`, {
      params: { page },
    });
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (page = 1): Promise<BookingsResponse> => {
    const response = await api.get('/user/bookings', {
      params: { page },
    });
    return response.data;
  },
};
