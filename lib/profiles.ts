import type { SubscriptionMetadata } from '@/lib/subscription';
import { isAdminUser, type UserRole } from '@/lib/admin';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const subscriptionColumns = [
  'stripe_customer_id',
  'stripe_subscription_id',
  'stripe_price_id',
  'subscription_plan',
  'subscription_status',
  'subscription_current_period_end',
].join(',');

type ProfileSubscriptionRow = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_plan: SubscriptionMetadata['subscriptionPlan'] | null;
  subscription_status: SubscriptionMetadata['subscriptionStatus'] | null;
  subscription_current_period_end: number | null;
};

type ProfileRoleRow = {
  role: UserRole | null;
};

function fromProfileRow(row?: ProfileSubscriptionRow | null, role?: UserRole | null, isAdmin?: boolean): SubscriptionMetadata {
  if (!row) {
    return {
      role: role || undefined,
      isAdmin,
    };
  }

  return {
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    stripePriceId: row.stripe_price_id || undefined,
    subscriptionPlan: row.subscription_plan || undefined,
    subscriptionStatus: row.subscription_status || undefined,
    subscriptionCurrentPeriodEnd: row.subscription_current_period_end || undefined,
    role: role || undefined,
    isAdmin,
  };
}

export async function getCurrentProfileSubscription() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) return {};

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return {};

  const { data } = await supabase
    .from('profiles')
    .select(subscriptionColumns)
    .eq('id', user.id)
    .maybeSingle<ProfileSubscriptionRow>();

  const { data: roleData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<ProfileRoleRow>();

  const role = roleData?.role || null;

  return fromProfileRow(data, role, isAdminUser(user, role));
}

export async function updateProfileSubscription(userId: string, subscription: SubscriptionMetadata) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    stripe_customer_id: subscription.stripeCustomerId || null,
    stripe_subscription_id: subscription.stripeSubscriptionId || null,
    stripe_price_id: subscription.stripePriceId || null,
    subscription_plan: subscription.subscriptionPlan || null,
    subscription_status: subscription.subscriptionStatus || 'none',
    subscription_current_period_end: subscription.subscriptionCurrentPeriodEnd || null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}
