import { NextResponse } from 'next/server';
import { getAppUrl, getStripe } from '@/lib/stripe';
import { getCurrentSubscription } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL('/sign-in', requestUrl.origin));
  }

  const subscription = await getCurrentSubscription();

  if (!subscription.stripeCustomerId) {
    return NextResponse.redirect(new URL('/pricing', requestUrl.origin));
  }

  const stripe = getStripe();
  const appUrl = getAppUrl(request.url);
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: appUrl + '/app/billing',
  });

  return NextResponse.redirect(portalSession.url, { status: 303 });
}
