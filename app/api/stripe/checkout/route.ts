import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { paidPlans, type PaidPlan } from '@/lib/config/subscriptions';
import { getAppUrl, getStripe } from '@/lib/stripe';
import { getPriceIdForPlan } from '@/lib/stripe-subscriptions';
import type { SubscriptionMetadata } from '@/lib/subscription';

function isPaidPlan(value: string | null): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get('plan');

  if (!isPaidPlan(plan)) {
    return NextResponse.redirect(new URL('/pricing', requestUrl.origin));
  }

  const { userId } = await auth();

  if (!userId) {
    const signInUrl = new URL('/sign-in', requestUrl.origin);
    signInUrl.searchParams.set('redirect_url', '/checkout/' + plan);
    return NextResponse.redirect(signInUrl);
  }

  const user = await currentUser();
  const subscription = (user?.privateMetadata || {}) as SubscriptionMetadata;
  const stripe = getStripe();
  const appUrl = getAppUrl(request.url);
  const priceId = getPriceIdForPlan(plan);
  const customerEmail = user?.primaryEmailAddress?.emailAddress;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: subscription.stripeCustomerId,
    customer_email: subscription.stripeCustomerId ? undefined : customerEmail,
    client_reference_id: userId,
    metadata: {
      clerkUserId: userId,
      plan,
    },
    subscription_data: {
      metadata: {
        clerkUserId: userId,
        plan,
      },
    },
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    allow_promotion_codes: true,
    success_url: appUrl + '/checkout/success?plan=' + plan + '&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: appUrl + '/checkout/cancel?plan=' + plan,
  });

  if (!session.url) {
    throw new Error('Unable to create ' + paidPlans[plan].label + ' checkout session.');
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
