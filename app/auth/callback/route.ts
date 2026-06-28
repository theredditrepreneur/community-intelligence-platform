import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isPaidPlan, pendingCheckoutCookie } from '@/lib/subscription';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(new URL('/login?error=' + encodeURIComponent(error.message), origin));
    }
  }

  const pendingPlan = cookies().get(pendingCheckoutCookie)?.value;

  if (isPaidPlan(pendingPlan)) {
    return NextResponse.redirect(new URL('/checkout/resume', origin));
  }

  return NextResponse.redirect(new URL('/login?confirmed=1', origin));
}
