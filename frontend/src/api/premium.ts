import { AxiosInstance } from 'axios';
import type { SubscriptionPlan, SubscriptionStatus, PaymentMethod } from '../types/premium';

export interface PremiumApi {
  checkSubscriptionStatus: () => Promise<SubscriptionStatus>;
  getSubscriptionPlans: () => Promise<SubscriptionPlan[]>;
  createSubscription: (planId: string, paymentMethodId?: string) => Promise<void>;
  toggleAutoRenew: (enable: boolean) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const premiumApi = (axios: AxiosInstance): PremiumApi => ({
  checkSubscriptionStatus: async () => {
    const response = await axios.get('/subscription/status');
    return response.data;
  },
  getSubscriptionPlans: async () => {
    const response = await axios.get('/subscription/plans');
    return response.data;
  },
  createSubscription: async (planId: string, paymentMethodId?: string) => {
    await axios.post('/subscription', { planId, paymentMethodId });
  },
  toggleAutoRenew: async (enable: boolean) => {
    await axios.patch('/subscription/auto-renew', { enable });
  },
  cancelSubscription: async () => {
    await axios.delete('/subscription');
  }
});
