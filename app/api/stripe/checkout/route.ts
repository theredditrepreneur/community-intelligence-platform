import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { paidPlans, type PaidPlan } from '@/lib/config/subscriptions';
import { getAppUrl, getStripe } from '@/lib/stripe';
import { getPriceIdForPlan } from '@/lib/stripe-subscriptions';
import { pendingCheckoutCookie, type SubscriptionMetadata } from '@/lib/subscription';

function isPaidPlan(value: unknown): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

function pendingCheckoutResponse(requestUrl: URL, plan: PaidPlan) {
  const response = NextResponse.json({ url: '/sign-up?redirect_url=' + encodeURIComponent('/checkout/' + plan) }, { status: 401 });

  response.cookies.set(pendingCheckoutCookie, plan, {
    httpOnly: true,
    sameSite: 'lax',
    secure: requestUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 30,
  });

  return response;
}

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const body = (await request.json().catch(() => null)) as { plan?: unknown } | null;
  const plan = body?.plan;

  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: 'Invalid checkout plan.' }, { status: 400 });
  }

  const { userId } = await auth();

  if (!userId) {
    return pendingCheckoutResponse(requestUrl, plan);
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
    return NextResponse.json({ error: 'Unable to create ' + paidPlans[plan].label + ' checkout session.' }, { status: 500 });
  }

  const response = NextResponse.json({ url: session.url });
  response.cookies.delete(pendingCheckoutCookie);
  return response;
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST /api/stripe/checkout.' }, { status: 405 });
}
