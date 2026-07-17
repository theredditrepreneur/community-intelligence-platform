export type PaidPlan = 'analyse' | 'discover' | 'alerts';
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
  alerts: {
    label: 'Alerts',
    priceEnv: 'NEXT_PUBLIC_STRIPE_ALERTS_PRICE_ID',
    appPath: '/app/alerts',
  },
};

export const activeSubscriptionStatuses: SubscriptionStatus[] = ['active', 'trialing'];
