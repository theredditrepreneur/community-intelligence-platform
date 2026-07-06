import { AppShell } from '@/components/layout/AppShell';
import { getCurrentSubscription, getSubscriptionLabel, hasAdminAccess } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const subscription = await getCurrentSubscription();
  const subscriptionLabel = await getSubscriptionLabel();
  const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : undefined;

  return (
    <AppShell
      subscriptionLabel={subscriptionLabel}
      isAdmin={hasAdminAccess(subscription)}
      user={{ email: user?.email, name: fullName }}
    >
      {children}
    </AppShell>
  );
}
