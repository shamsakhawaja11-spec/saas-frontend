export const PlanType = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const;

export type PlanType = typeof PlanType[keyof typeof PlanType];

export const SubscriptionStatus = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  PAST_DUE: 'past_due',
  INACTIVE: 'inactive',
} as const;

export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];

export interface Subscription {
  id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutDto {
  plan: PlanType;
}

export interface CheckoutResponse {
  url: string;
}