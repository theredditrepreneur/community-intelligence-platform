import { AlertsUpgrade, AlertsWorkspace } from '@/components/alerts/AlertsWorkspace';
import { getCurrentSubscription, hasPlanAccess } from '@/lib/subscription';

export default async function Page({ searchParams }: { searchParams: { checkout?: string } }) {
  const subscription = await getCurrentSubscription();
  if (!hasPlanAccess(subscription, 'alerts')) return <AlertsUpgrade />;
  return <AlertsWorkspace checkoutSuccess={searchParams.checkout === 'success'} />;
}
