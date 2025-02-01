export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  premiumTripsLimit: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan?: SubscriptionPlan;
  paymentMethod?: PaymentMethod;
  autoRenew: boolean;
  endDate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal';
  last4?: string;
}