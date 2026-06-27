import { AppShell } from '@/components/layout/AppShell';
import { activeSubscriptionStatuses, type PaidPlan, type SubscriptionStatus } from '@/lib/config/subscriptions';
import { getCurrentSubscription } from '@/lib/subscription';

function getSubscriptionLabel(plan?: PaidPlan, status?: SubscriptionStatus) {
  if (!status || !activeSubscriptionStatuses.includes(status)) {
    return 'Free';
  }

  if (plan === 'discover') return 'Discover';
  if (plan === 'analyse') return 'Analyse';

  return 'Free';
}

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const subscription = await getCurrentSubscription();
  const subscriptionLabel = getSubscriptionLabel(subscription.subscriptionPlan, subscription.subscriptionStatus);

  return <AppShell subscriptionLabel={subscriptionLabel}>{children}</AppShell>;
}
