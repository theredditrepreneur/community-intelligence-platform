import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { paidPlans, type PaidPlan } from '@/lib/config/subscriptions';
import { getAppUrl, getStripe } from '@/lib/stripe';
import { getPriceIdForPlan } from '@/lib/stripe-subscriptions';
import { pendingCheckoutCookie } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

function isPaidPlan(value: unknown): value is PaidPlan {
  return value === 'analyse' || value === 'discover';
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { plan?: unknown };
  const plan = body.plan;
  const requestUrl = new URL(request.url);

  if (!isPaidPlan(plan)) {
    return NextResponse.json({ error: 'Choose a valid paid plan.' }, { status: 400 });
  }

  const user = await getCurrentUser();

  if (!user) {
    cookies().set(pendingCheckoutCookie, plan, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 30,
    });

    return NextResponse.json({ error: 'Please sign in before checkout.' }, { status: 401 });
  }

  cookies().delete(pendingCheckoutCookie);

  const appUrl = getAppUrl(request.url);
  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.email || undefined,
    client_reference_id: user.id,
    line_items: [
      {
        price: getPriceIdForPlan(plan),
        quantity: 1,
      },
    ],
    metadata: {
      supabaseUserId: user.id,
      plan,
    },
    subscription_data: {
      metadata: {
        supabaseUserId: user.id,
        plan,
      },
    },
    success_url: appUrl + '/checkout/success?plan=' + plan,
    cancel_url: requestUrl.origin + '/checkout/cancel?plan=' + plan,
  });

  return NextResponse.json({ url: checkoutSession.url || paidPlans[plan].appPath });
}
