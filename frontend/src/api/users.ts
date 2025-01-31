import api from './axiosConfig'

interface ProfileUpdate {
  username?: string
  experience_level?: string
  preferred_routes?: string[]
  motorcycle_details?: {
    make: string
    model: string
    year: number
  }
  avatar?: File
}

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/api/users/profile')
    return response.data
  },

  updateProfile: async (data: ProfileUpdate) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'avatar' && value) {
        formData.append('avatar', value)
      } else if (value !== undefined) {
        formData.append(key, value)
      }
    })
    const response = await api.patch('/api/users/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await api.post('/api/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getUserAchievements: async (userId: number) => {
    const response = await api.get(`/api/achievements/user/${userId}`)
    return response.data
  }
}
