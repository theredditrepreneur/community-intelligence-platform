'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isPaidPlan, pendingCheckoutCookie } from '@/lib/subscription';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function authRedirect(path: string, message: string) {
  redirect(path + '?error=' + encodeURIComponent(message));
}

function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export async function signIn(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    authRedirect('/sign-in', error.message);
  }

  const pendingPlan = cookies().get(pendingCheckoutCookie)?.value;

  if (isPaidPlan(pendingPlan)) {
    redirect('/checkout/resume');
  }

  redirect('/app/analyse');
}

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');
  const fullName = String(formData.get('fullName') || '');
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: getAppUrl() + '/auth/callback',
    },
  });

  if (error) {
    authRedirect('/sign-up', error.message);
  }

  if (!data.session) {
    redirect('/sign-in?message=' + encodeURIComponent('Check your email to confirm your account, then sign in.'));
  }

  const pendingPlan = cookies().get(pendingCheckoutCookie)?.value;
  if (isPaidPlan(pendingPlan)) {
    redirect('/checkout/resume');
  }

  redirect('/app/analyse');
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/pricing');
}

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get('fullName') || '');
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });

  if (error) {
    authRedirect('/app/profile', error.message);
  }

  redirect('/app/account');
}
