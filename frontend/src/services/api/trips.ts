import { api } from './index';
import { TripCategory, TripTag } from '../../types/trip';

export interface TripResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  rating?: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  availableSpots: number;
  category: TripCategory;
  tags: TripTag[];
  organizer: {
    id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripData extends Omit<TripResponse, 'id' | 'organizer' | 'createdAt' | 'updatedAt'> {}

export interface TripFilters {
  page?: number;
  search?: string;
  location?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  minPrice?: number;
  maxPrice?: number;
  capacity?: number;
  sortBy?: string;
  categories?: TripCategory[];
  tags?: string[];
}

export interface TripsResponse {
  trips: TripResponse[];
  total: number;
  perPage: number;
  currentPage: number;
}

export const tripsApi = {
  getTrips: async (filters: TripFilters): Promise<TripsResponse> => {
    const response = await api.get('/trips', { params: filters });
    return response.data;
  },

  getTrip: async (id: string): Promise<TripResponse> => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createTrip: async (tripData: CreateTripData) => {
    const response = await api.post('/trips/create', tripData);
    return response.data;
  },

  updateTrip: async (id: string, tripData: Partial<TripResponse>) => {
    const response = await api.put(`/trips/update/${id}`, tripData);
    return response.data;
  },

  deleteTrip: async (id: string) => {
    const response = await api.delete(`/trips/delete/${id}`);
    return response.data;
  }
};
