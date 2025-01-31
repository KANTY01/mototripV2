import api from './axiosConfig'

interface Review {
  id: number
  trip_id: number
  user_id: number
  rating: number
  content: string
  images?: string[]
  created_at: string
}

export const reviewApi = {
  getTripReviews: async (tripId: number) => {
    const response = await api.get(`/reviews/${tripId}`)
    return response.data
  },

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
    const response = await api.post(`/reviews/${tripId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  updateReview: async (reviewId: number, data: {
    rating?: number
    content?: string
  }) => {
    const response = await api.patch(`/reviews/${reviewId}`, data)
    return response.data
  },

  deleteReview: async (reviewId: number) => {
    await api.delete(`/reviews/${reviewId}`)
  }
}
