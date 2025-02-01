import api from './axiosConfig'

interface Review {
  id: number
  trip_id: number
  user: {
    id: number
    username: string
    avatar?: string
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

export type ReviewFormData = {
  rating: number
  content: string
  images?: File[]
  removed_images?: string[]
}

export const reviewApi = {
  createReview: async (tripId: number, data: {
      rating: number
      content: string
      images?: File[]
    }) => {
    const formData = new FormData()
    formData.append('rating', data.rating.toString())
    formData.append('content', data.content)
    if (data.images) {
      data.images.forEach(file => formData.append('images', file))
    }
    const response = await api.post(`/trips/${tripId}/reviews`, formData, {
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
  
  updateReview: async (reviewId: number, data: ReviewFormData) => {
    const formData = new FormData()
    formData.append('rating', data.rating.toString())
    formData.append('content', data.content)
    
    if (data.images) {
      data.images.forEach(file => formData.append('new_images', file))
    }
    
    if (data.removed_images) {
      formData.append('removed_images', JSON.stringify(data.removed_images))
    }

    const response = await api.patch(`/trips/reviews/${reviewId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  voteReview: async (reviewId: number, voteType: 'up' | 'down') => {
    const response = await api.post(`/trips/reviews/${reviewId}/vote`, {
      vote_type: voteType
    })
    return response.data
  },

  reportReview: async (reviewId: number, reason: string) => {
    const response = await api.post(`/trips/reviews/${reviewId}/reports`, {
      reason
    })
    return response.data
  },

  getReviewReports: async (reviewId: number) => {
    const response = await api.get(`/trips/reviews/${reviewId}/reports`)
    return response.data
  },

  // Admin endpoints
  adminGetAllReviews: async (filters: {
    reported?: boolean
    userId?: number
    tripId?: number
    page?: number
    perPage?: number
  } = {}) => {
    const response = await api.get('/admin/reviews', { params: filters })
    return response.data
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

  getReviewById: async (reviewId: number) => {
    const response = await api.get(`/trips/reviews/${reviewId}`)
    return response.data as Review
  },

  deleteReview: async (reviewId: number) => {
    await api.delete(`/trips/reviews/${reviewId}`)
  }
}
