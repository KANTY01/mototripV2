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
    const response = await api.get('/users/profile')
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
  }
}
