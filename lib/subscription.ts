import { currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { activeSubscriptionStatuses, type PaidPlan, type SubscriptionStatus } from '@/lib/config/subscriptions';

export const pendingCheckoutCookie = 'redditrepreneur_pending_checkout_plan';

export type SubscriptionMetadata = {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  subscriptionPlan?: PaidPlan;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionCurrentPeriodEnd?: number;
};

export function isPaidPlan(value?: string): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

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
  const user = await currentUser();
  return (user?.privateMetadata || {}) as SubscriptionMetadata;
}

export async function requirePlan(requiredPlan: PaidPlan) {
  const pendingCheckoutPlan = cookies().get(pendingCheckoutCookie)?.value;

  if (isPaidPlan(pendingCheckoutPlan)) {
    redirect('/checkout/' + pendingCheckoutPlan);
  }

  const subscription = await getCurrentSubscription();

  if (!hasPlanAccess(subscription, requiredPlan)) {
    redirect('/pricing?upgrade=' + requiredPlan);
  }

  return subscription;
}
