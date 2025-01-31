import api from './axiosConfig'

export const socialApi = {
  followUser: async (userId: number) => {
    const response = await api.post(`/social/follow/${userId}`)
    return response.data
  },

  unfollowUser: async (userId: number) => {
    const response = await api.delete(`/social/follow/${userId}`)
    return response.data
  },

  getUserFeed: async () => {
    const response = await api.get('/social/feed')
    return response.data
  },

  getFollowers: async (userId: number) => {
    const response = await api.get(`/users/${userId}/followers`)
    return response.data
  },

  getFollowing: async (userId: number) => {
    const response = await api.get(`/users/${userId}/following`)
    return response.data
  }
}
