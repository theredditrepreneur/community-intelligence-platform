import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { planFromPriceId, updateClerkFromStripeSubscription, updateClerkSubscription } from '@/lib/stripe-subscriptions';
import type { SubscriptionStatus } from '@/lib/config/subscriptions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not set.' }, { status: 500 });
  }

  const stripe = getStripe();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown webhook error';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.clerkUserId || session.client_reference_id;

      if (userId && session.subscription) {
        const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const firstItem = subscription.items.data[0];
        const priceId = firstItem?.price.id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        const currentPeriodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;

        await updateClerkSubscription(userId, {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          subscriptionPlan: planFromPriceId(priceId),
          subscriptionStatus: subscription.status as SubscriptionStatus,
          subscriptionCurrentPeriodEnd: currentPeriodEnd,
        });
      }
      break;
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await updateClerkFromStripeSubscription(subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
