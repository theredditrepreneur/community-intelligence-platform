export type PaidPlan = 'analyse' | 'discover';
export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused'
  | 'none';

export const paidPlans: Record<PaidPlan, { label: string; priceEnv: string; appPath: string }> = {
  analyse: {
    label: 'Analyse',
    priceEnv: 'NEXT_PUBLIC_STRIPE_ANALYSE_PRICE_ID',
    appPath: '/app/analyse',
  },
  discover: {
    label: 'Discover',
    priceEnv: 'NEXT_PUBLIC_STRIPE_DISCOVER_PRICE_ID',
    appPath: '/app/discover',
  },
};

export const activeSubscriptionStatuses: SubscriptionStatus[] = ['active', 'trialing'];
