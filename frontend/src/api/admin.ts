import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import api from './axiosConfig'
import type { RootState } from '../store/store'

export interface AdminStats {
  totalTrips: number
  totalUsers: number
  totalReviews: number
  premiumUsers: number
  averageRating: number
  monthlyRevenue: number
  recentActivity: {
    date: string
    trips: number
    users: number
    reviews: number
  }[]
  userGrowth: {
    date: string
    total: number
    premium: number
  }[]
  tripStats: {
    byDifficulty: Record<string, number>
    byTerrain: Record<string, number>
    averageDuration: number
    averageDistance: number
  }
  revenueStats: {
    date: string
    amount: number
    subscriptions: number
  }[]
  engagementStats: {
    averageReviewsPerTrip: number
    averageTripsPerUser: number
    activeUsers: number
    premiumConversionRate: number
  }
}

export interface DateRangeFilter {
  startDate: string
  endDate: string
}

export interface TripFilters {
  search?: string
  difficulty?: string
  terrain?: string
  isPremium?: boolean
  status?: string
  minDistance?: number
  maxDistance?: number
  dateRange?: DateRangeFilter
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  perPage?: number
}

export interface TripUpdateData {
  title?: string
  description?: string
  difficulty?: string
  distance?: number
  duration?: string
  isPremium?: boolean
  status?: 'active' | 'draft' | 'archived'
  terrain?: string
  startLocation?: {
    latitude: number
    longitude: number
    address: string
  }
  routePoints?: {
    latitude: number
    longitude: number
    name?: string
    description?: string
    pointOfInterest?: string
  }[]
}

// Create the API slice using RTK Query with auth headers
export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    getStatistics: builder.query<AdminStats, DateRangeFilter | undefined>({
      query: (dateRange) => ({
        url: '/admin/statistics',
        params: dateRange || undefined
      })
    }),
    getUserStats: builder.query<any, { role?: string; status?: string; dateRange?: DateRangeFilter }>({
      query: (filters) => ({
        url: '/admin/users/stats',
        params: filters
      })
    }),
    getTripStats: builder.query<any, { difficulty?: string; terrain?: string; dateRange?: DateRangeFilter }>({
      query: (filters) => ({
        url: '/admin/trips/stats',
        params: filters
      })
    }),
    getTrips: builder.query<any, TripFilters>({
      query: (filters) => ({
        url: '/admin/trips',
        params: filters
      })
    }),
    updateTrip: builder.mutation<any, { tripId: number; tripData: FormData }>({
      query: ({ tripId, tripData }) => ({
        url: `/admin/trips/${tripId}`,
        method: 'PUT',
        body: tripData
      })
    }),
    deleteTrip: builder.mutation<any, number>({
      query: (tripId) => ({
        url: `/admin/trips/${tripId}`,
        method: 'DELETE'
      })
    })
  })
})

// Export hooks for usage in components
export const {
  useGetStatisticsQuery,
  useGetUserStatsQuery,
  useGetTripStatsQuery,
  useGetTripsQuery,
  useUpdateTripMutation,
  useDeleteTripMutation
} = adminApiSlice

// Export the regular API functions (these already use the axios instance with auth headers)
export const adminApi = {
  // Statistics endpoints
  getStatistics: async (dateRange?: DateRangeFilter) => {
    const response = await api.get('/admin/statistics', {
      params: dateRange
    })
    return response.data as AdminStats
  },

  exportStatistics: async (format: 'csv' | 'pdf', dateRange?: DateRangeFilter) => {
    const response = await api.get('/admin/statistics/export', {
      params: {
        format,
        ...dateRange
      },
      responseType: 'blob'
    })
    return response.data
  },

  getUserStats: async (filters: {
    role?: string
    status?: string
    dateRange?: DateRangeFilter
  }) => {
    const response = await api.get('/admin/users/stats', {
      params: filters
    })
    return response.data
  },

  getTripStats: async (filters: {
    difficulty?: string
    terrain?: string
    dateRange?: DateRangeFilter
  }) => {
    const response = await api.get('/admin/trips/stats', {
      params: filters
    })
    return response.data
  },

  getRevenueStats: async (dateRange?: DateRangeFilter) => {
    const response = await api.get('/admin/revenue/stats', {
      params: dateRange
    })
    return response.data
  },

  getEngagementStats: async (dateRange?: DateRangeFilter) => {
    const response = await api.get('/admin/engagement/stats', {
      params: dateRange
    })
    return response.data
  },

  // Trip management endpoints
  getTrips: async (filters: TripFilters) => {
    const response = await api.get('/admin/trips', {
      params: filters
    })
    return response.data
  },

  createTrip: async (tripData: FormData) => {
    const response = await api.post('/admin/trips', tripData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  updateTrip: async (tripId: number, tripData: FormData) => {
    const response = await api.put(`/admin/trips/${tripId}`, tripData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  deleteTrip: async (tripId: number) => {
    const response = await api.delete(`/admin/trips/${tripId}`)
    return response.data
  },

  bulkUpdateTrips: async (tripIds: number[], updates: Partial<TripUpdateData>) => {
    const response = await api.put('/admin/trips/bulk', {
      tripIds,
      updates
    })
    return response.data
  },

  bulkDeleteTrips: async (tripIds: number[]) => {
    const response = await api.delete('/admin/trips/bulk', {
      data: { tripIds }
    })
    return response.data
  },

  updateTripImages: async (tripId: number, formData: FormData) => {
    const response = await api.put(`/admin/trips/${tripId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  deleteTripImage: async (tripId: number, imageId: number) => {
    const response = await api.delete(`/admin/trips/${tripId}/images/${imageId}`)
    return response.data
  },

  reorderTripImages: async (tripId: number, imageIds: number[]) => {
    const response = await api.put(`/admin/trips/${tripId}/images/reorder`, {
      imageIds
    })
    return response.data
  },

  exportTrips: async (format: 'csv' | 'pdf', filters?: TripFilters) => {
    const response = await api.get('/admin/trips/export', {
      params: {
        format,
        ...filters
      },
      responseType: 'blob'
    })
    return response.data
  }
}
