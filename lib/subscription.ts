import { redirect } from 'next/navigation';
import { activeSubscriptionStatuses, type PaidPlan, type SubscriptionStatus } from '@/lib/config/subscriptions';
import { getCurrentProfileSubscription } from '@/lib/profiles';
import type { UserRole } from '@/lib/admin';

export const pendingCheckoutCookie = 'redditrepreneur_pending_checkout_plan';

export function isPaidPlan(value: unknown): value is PaidPlan {
  return value === 'analyse' || value === 'discover' || value === 'alerts';
}

export type SubscriptionLabel = 'Free' | 'Analyse' | 'Discover' | 'Alerts' | 'Admin';

export type SubscriptionMetadata = {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  subscriptionPlan?: PaidPlan;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionCurrentPeriodEnd?: number;
  role?: UserRole;
  isAdmin?: boolean;
};

export function hasAdminAccess(subscription: SubscriptionMetadata) {
  return subscription.isAdmin === true;
}

export function hasPlanAccess(subscription: SubscriptionMetadata, requiredPlan: PaidPlan) {
  if (hasAdminAccess(subscription)) {
    return true;
  }

  const status = subscription.subscriptionStatus || 'none';

  if (!activeSubscriptionStatuses.includes(status)) {
    return false;
  }

  if (requiredPlan === 'analyse') {
    return subscription.subscriptionPlan === 'analyse' || subscription.subscriptionPlan === 'discover' || subscription.subscriptionPlan === 'alerts';
  }
  if (requiredPlan === 'discover') return subscription.subscriptionPlan === 'discover' || subscription.subscriptionPlan === 'alerts';
  return subscription.subscriptionPlan === 'alerts';
}

export async function getCurrentSubscription() {
  return getCurrentProfileSubscription();
}

export async function getSubscriptionLabel(): Promise<SubscriptionLabel> {
  const subscription = await getCurrentSubscription();

  if (hasAdminAccess(subscription)) return 'Admin';

  if (!activeSubscriptionStatuses.includes(subscription.subscriptionStatus || 'none')) {
    return 'Free';
  }

  if (subscription.subscriptionPlan === 'alerts') return 'Alerts';
  if (subscription.subscriptionPlan === 'discover') return 'Discover';
  if (subscription.subscriptionPlan === 'analyse') return 'Analyse';

  return 'Free';
}

export function getSubscriptionAppPath(subscription: SubscriptionMetadata) {
  if (hasAdminAccess(subscription)) {
    return '/app/dashboard';
  }

  if (!activeSubscriptionStatuses.includes(subscription.subscriptionStatus || 'none')) {
    return '/app/dashboard';
  }

  if (subscription.subscriptionPlan === 'discover') return '/app/dashboard';
  if (subscription.subscriptionPlan === 'analyse') return '/app/dashboard';

  return '/app/dashboard';
}

export async function requirePlan(requiredPlan: PaidPlan) {
  const subscription = await getCurrentSubscription();

  if (!hasPlanAccess(subscription, requiredPlan)) {
    redirect('/pricing?upgrade=' + requiredPlan);
  }

  return subscription;
}
