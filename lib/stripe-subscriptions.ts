import { clerkClient } from '@clerk/nextjs/server';
import type Stripe from 'stripe';
import { paidPlans, type PaidPlan, type SubscriptionStatus } from '@/lib/config/subscriptions';
import type { SubscriptionMetadata } from '@/lib/subscription';

export function planFromPriceId(priceId?: string | null): PaidPlan | undefined {
  if (!priceId) return undefined;

  if (priceId === process.env.NEXT_PUBLIC_STRIPE_ANALYSE_PRICE_ID) return 'analyse';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_DISCOVER_PRICE_ID) return 'discover';

  return undefined;
}

export function getPriceIdForPlan(plan: PaidPlan) {
  const priceId = process.env[paidPlans[plan].priceEnv];

  if (!priceId) {
    throw new Error(paidPlans[plan].priceEnv + ' is not set.');
  }

  return priceId;
}

function cleanSubscriptionMetadata(subscription: SubscriptionMetadata) {
  return Object.fromEntries(Object.entries(subscription).filter(([, value]) => value !== undefined));
}

export async function updateClerkSubscription(userId: string, subscription: SubscriptionMetadata) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    privateMetadata: cleanSubscriptionMetadata(subscription),
  });
}

export async function updateClerkFromStripeSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.clerkUserId;

  if (!userId) return;

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price.id;
  const plan = planFromPriceId(priceId);
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
  const currentPeriodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;

  await updateClerkSubscription(userId, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    subscriptionPlan: plan,
    subscriptionStatus: subscription.status as SubscriptionStatus,
    subscriptionCurrentPeriodEnd: currentPeriodEnd,
  });
}
