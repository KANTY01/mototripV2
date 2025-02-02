import api from './axiosConfig'

export interface Trip {
  id: number
  title: string
  description: string
  start_date: string
  end_date: string
  difficulty: 'easy' | 'moderate' | 'hard'
  distance: number
  created_by: number
  images: string[]
  location: {
    latitude: number
    longitude: number
    route_points?: {
      latitude: number
      longitude: number
    }[]
  }
  is_premium?: boolean
}

export interface TripCreate {
  title: string
  description: string
  start_date: string
  end_date: string
  difficulty: 'easy' | 'moderate' | 'hard'
  distance: number
  images: File[]
  location: {
    latitude: number
    longitude: number
    route_points?: {
      latitude: number
      longitude: number
    }[]
  }
}

export interface TripFilters {
  userId?: number
  search?: string
  difficulty?: 'easy' | 'moderate' | 'hard'
  minDistance?: number
  maxDistance?: number
  startDate?: string
  endDate?: string
  location?: {
    latitude: number
    longitude: number
    radius: number // in kilometers
  }
}

export interface PaginatedResponse<T> {
  trips: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}
 
export const tripApi = {
  getTrips: async (filters?: TripFilters, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Trip>> => {
    try {
      const response = await api.get('/trips', { params: { ...filters, page, per_page: perPage } })
      return response.data
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch trips. Please check your connection and try again.'
      )
    }
  },

  getTrip: async (id: number) => {
    const response = await api.get(`/trips/${id}`)
    return response.data
  },

  createTrip: async (tripData: Partial<TripCreate>) => {
    const formData = new FormData()
    Object.entries(tripData).forEach(([key, value]: [string, any]) => {
      if (key === 'images') {
        if (Array.isArray(value)) {
          value.forEach((file: File) => formData.append('images', file))
        }
      } else if (key === 'location' && value) {
        formData.append('latitude', value.latitude.toString())
        formData.append('longitude', value.longitude.toString())
        if (value.route_points) {
          formData.append('route_points', JSON.stringify(value.route_points))
        }
      } else {
        formData.append(key, value.toString())
      }
    })
    const response = await api.post('/trips', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  updateTrip: async (id: number, tripData: Partial<TripCreate>) => {
    const formData = new FormData()
    Object.entries(tripData).forEach(([key, value]: [string, any]) => {
      if (key === 'images') {
        if (Array.isArray(value)) {
          value.forEach((file: File) => formData.append('images', file))
        }
      } else if (key === 'location' && value) {
        formData.append('latitude', value.latitude.toString())
        formData.append('longitude', value.longitude.toString())
        if (value.route_points) {
          formData.append('route_points', JSON.stringify(value.route_points))
        }
      } else if (value !== undefined) {
        formData.append(key, value.toString())
      }
    })
    const response = await api.patch(`/trips/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  deleteTrip: async (id: number) => {
    await api.delete(`/trips/${id}`)
  },

  getPremiumContent: async (tripId: number) => {
    const response = await api.get(`/trips/${tripId}/premium`)
    return response.data
  },

  getNearbyTrips: async (latitude: number, longitude: number, radius: number = 50) => {
    const response = await api.get('/trips/nearby', {
      params: { latitude, longitude, radius }
    })
    return response.data
  },

  getTripRoute: async (tripId: number) => {
    const response = await api.get(`/trips/${tripId}/route`)
    return response.data
  },

  searchTrips: async (query: string) => {
    return await tripApi.getTrips({ search: query })
  }
}
