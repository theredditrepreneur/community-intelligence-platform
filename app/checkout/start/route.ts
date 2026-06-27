import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { isPaidPlan, pendingCheckoutCookie } from '@/lib/subscription';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get('plan') || undefined;

  if (!isPaidPlan(plan)) {
    return NextResponse.redirect(new URL('/pricing', requestUrl.origin));
  }

  const { userId } = await auth();
  const redirectPath = userId ? '/checkout/' + plan : '/sign-up';
  const response = NextResponse.redirect(new URL(redirectPath, requestUrl.origin), { status: 303 });

  response.cookies.set(pendingCheckoutCookie, plan, {
    httpOnly: true,
    sameSite: 'lax',
    secure: requestUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 30,
  });

  return response;
}
