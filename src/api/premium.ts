import api from './axiosConfig'

export const premiumApi = {
  createSubscription: async () => {
    const response = await api.post('/api/premium/subscribe')
    return response.data
  },

  checkSubscriptionStatus: async () => {
    const response = await api.get('/api/premium/status')
    return response.data
  }
}
