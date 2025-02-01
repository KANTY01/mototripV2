import api from './axiosConfig'
import { Trip, UserRole, UserStats, User } from '../types'

export interface ProfileUpdate {
  username?: string
  email?: string
  bio?: string
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: {
    make: string
    model: string
    year: number
  }
  avatar?: File
}


export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  category: 'trips' | 'social' | 'reviews' | 'premium' | 'other'
  criteria: {
    type: 'trips' | 'distance' | 'reviews' | 'rating'
    value: number
  }
  unlocked: boolean
  unlockDate?: string
  progress: number
  reward?: string
}

interface PublicProfile {
  id: number
  username: string
  stats: UserStats
  avatar?: string
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: ProfileUpdate['motorcycle_details']
  role: UserRole
  achievements: Achievement[]
}

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  updateProfile: async (data: ProfileUpdate) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return // Skip undefined or null values
      }
      
      if (key === 'avatar' && value instanceof File) {
        formData.append('avatar', value)
      } 
      else if (key === 'motorcycle_details' && value) {
        try {
          const detailsStr = typeof value === 'string' ? value : JSON.stringify(value)
          console.log('Sending motorcycle_details:', detailsStr)
          formData.append('motorcycle_details', detailsStr)
        } catch (e) {
          console.error('Failed to process motorcycle_details:', e)
          throw new Error('Invalid motorcycle details format')
        }
      } 
      else if (key === 'preferred_routes' && Array.isArray(value)) {
        formData.append('preferred_routes', JSON.stringify(value))
      } else {
        formData.append(key, value.toString())
      }
    })
    const response = await api.patch('/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getPublicProfile: async (userId: number) => {
    const response = await api.get(`/users/${userId}`)
    return response.data as User
  },

  getUserAchievements: async (userId: number) => {
    const response = await api.get(`/achievements/user/${userId}`)
    return response.data as Achievement[]
  },

  getUserStats: async (userId: number) => {
    const response = await api.get(`/users/${userId}/stats`)
    return response.data as UserStats
  },

  followUser: async (userId: number) => {
    const response = await api.post(`/users/${userId}/follow`)
    return response.data
  },

  unfollowUser: async (userId: number) => {
    const response = await api.delete(`/users/${userId}/follow`)
    return response.data
  },

  getFollowers: async (userId: number, page: number = 1) => {
    const response = await api.get(`/users/${userId}/followers`, {
      params: { page }
    })
    return response.data
  },

  getFollowing: async (userId: number, page: number = 1) => {
    const response = await api.get(`/users/${userId}/following`, {
      params: { page }
    })
    return response.data
  },

  getUserTrips: async (userId: number, page: number = 1) => {
    const response = await api.get(`/trips/user/${userId}`, {
      params: { page }
    })
    return response.data as Trip[]
  },

  // Admin endpoints
  adminGetUsers: async (filters: {
    search?: string
    role?: string
    status?: string
    page?: number
    perPage?: number
  } = {}) => {
    const response = await api.get('/admin/users', { params: filters })
    return response.data
  },

  adminUpdateUser: async (userId: number, data: {
    role?: string
    status?: string
    premium?: boolean
  }) => {
    const response = await api.patch(`/admin/users/${userId}`, data)
    return response.data
  }
}
