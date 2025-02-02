import api from './axiosConfig'

export interface Review {
  id: number
  trip_id: number
  user: {
    id: number
    username: string
    avatar?: string
  }
  trip: {
    title: string
    created_by?: number
  }
  votes: {
    upvotes: number
    downvotes: number
    user_vote?: 'up' | 'down'
  }
  reports?: number
  user_id: number
  rating: number
  content: string
  images?: string[]
  created_at: string
  status?: 'approved' | 'rejected' | null
}

interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const reviewApi = {
  createReview: async (tripId: number, formData: FormData) => {
    const response = await api.post(`/reviews/${tripId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      } 
    })
    return response.data
  },

  getTripReviews: async (tripId: number, page: number = 1, sort: string = 'newest', perPage: number = 10): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/reviews/${tripId}`, {
      params: { 
        page,
        sort,
        per_page: perPage
      }
    })
    return response.data
  },
  
  updateReview: async (reviewId: number, formData: FormData) => {
    const response = await api.patch(`/reviews/update/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  voteReview: async (reviewId: number, voteType: 'up' | 'down') => {
    const response = await api.post(`/reviews/vote/${reviewId}`, {
      vote_type: voteType
    })
    return response.data
  },

  reportReview: async (reviewId: number, reason: string) => {
    const response = await api.post(`/reviews/${reviewId}/reports`, {
      reason
    })
    return response.data
  },

  getReviewReports: async (reviewId: number) => {
    const response = await api.get(`/reviews/${reviewId}/reports`)
    return response.data
  },

  // Get reviews written by a user
  getUserReviews: async (userId: number, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/reviews/user/${userId}`, {
      params: {
        page,
        per_page: perPage
      }
    })
    return response.data
  },

  // Get reviews for trips created by a user
  getTripOwnerReviews: async (userId: number, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Review>> => {
    const response = await api.get(`/reviews/trip-owner/${userId}`, {
      params: {
        page,
        per_page: perPage
      }
    })
    return response.data
  },

  // Get a single review by ID
  getReviewById: async (reviewId: number) => {
    const response = await api.get(`/reviews/single/${reviewId}`)
    return response.data as Review
  },

  // Admin endpoints
  adminGetAllReviews: async (filters: {
    reported?: boolean
    userId?: number
    tripId?: number
    page?: number
    status?: 'approved' | 'rejected' | null
    per_page?: number
  } = {}): Promise<PaginatedResponse<Review>> => {
    const response = await api.get('/admin/reviews', { params: filters })
    return response.data as PaginatedResponse<Review>
  },

  adminDeleteReview: async (reviewId: number) => {
    const response = await api.delete(`/admin/reviews/${reviewId}`)
    return response.data
  },

  adminUpdateReview: async (reviewId: number, data: {
    content?: string
    rating?: number
    status?: 'approved' | 'rejected'
  }) => {
    const response = await api.patch(`/admin/reviews/${reviewId}`, data)
    return response.data
  },
  
  deleteReview: async (reviewId: number) => {
    const response = await api.delete(`/reviews/${reviewId}`)
    return response.data.id
  }
}
