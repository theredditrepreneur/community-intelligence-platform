import { AppShell } from '@/components/layout/AppShell';
import { getSubscriptionLabel } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const subscriptionLabel = await getSubscriptionLabel();
  const user = await getCurrentUser();
  const fullName = typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name : undefined;

  return <AppShell subscriptionLabel={subscriptionLabel} user={{ email: user?.email, name: fullName }}>{children}</AppShell>;
}
