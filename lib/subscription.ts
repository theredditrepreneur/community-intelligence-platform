import { redirect } from 'next/navigation';
import { activeSubscriptionStatuses, type PaidPlan, type SubscriptionStatus } from '@/lib/config/subscriptions';
import { getCurrentProfileSubscription } from '@/lib/profiles';

export const pendingCheckoutCookie = 'redditrepreneur_pending_checkout_plan';

export function isPaidPlan(value: unknown): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

export type SubscriptionLabel = 'Free' | 'Analyse' | 'Discover';

export type SubscriptionMetadata = {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  subscriptionPlan?: PaidPlan;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionCurrentPeriodEnd?: number;
};

export function hasPlanAccess(subscription: SubscriptionMetadata, requiredPlan: PaidPlan) {
  const status = subscription.subscriptionStatus || 'none';

  if (!activeSubscriptionStatuses.includes(status)) {
    return false;
  }

  if (requiredPlan === 'analyse') {
    return subscription.subscriptionPlan === 'analyse' || subscription.subscriptionPlan === 'discover';
  }

  return subscription.subscriptionPlan === 'discover';
}

export async function getCurrentSubscription() {
  return getCurrentProfileSubscription();
}

export async function getSubscriptionLabel(): Promise<SubscriptionLabel> {
  const subscription = await getCurrentSubscription();

  if (!activeSubscriptionStatuses.includes(subscription.subscriptionStatus || 'none')) {
    return 'Free';
  }

  if (subscription.subscriptionPlan === 'discover') return 'Discover';
  if (subscription.subscriptionPlan === 'analyse') return 'Analyse';

  return 'Free';
}

export function getSubscriptionAppPath(subscription: SubscriptionMetadata) {
  if (!activeSubscriptionStatuses.includes(subscription.subscriptionStatus || 'none')) {
    return '/pricing';
  }

  if (subscription.subscriptionPlan === 'discover') return '/app/discover';
  if (subscription.subscriptionPlan === 'analyse') return '/app/analyse';

  return '/pricing';
}

export async function requirePlan(requiredPlan: PaidPlan) {
  const subscription = await getCurrentSubscription();

  if (!hasPlanAccess(subscription, requiredPlan)) {
    redirect('/pricing?upgrade=' + requiredPlan);
  }

  return subscription;
}
