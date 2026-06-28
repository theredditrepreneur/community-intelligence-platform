import { AppShell } from '@/components/layout/AppShell';
import { getSubscriptionLabel } from '@/lib/subscription';

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const subscriptionLabel = await getSubscriptionLabel();

  return <AppShell subscriptionLabel={subscriptionLabel}>{children}</AppShell>;
}
