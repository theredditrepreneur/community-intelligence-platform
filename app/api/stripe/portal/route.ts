import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getAppUrl, getStripe } from '@/lib/stripe';
import type { SubscriptionMetadata } from '@/lib/subscription';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', requestUrl.origin));
  }

  const user = await currentUser();
  const subscription = (user?.privateMetadata || {}) as SubscriptionMetadata;

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
