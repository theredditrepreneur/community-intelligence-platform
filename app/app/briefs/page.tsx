import { BriefsWorkspace } from '@/components/briefs/BriefsWorkspace';
import { getSubscriptionLabel } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const subscriptionLabel = await getSubscriptionLabel();
  return <BriefsWorkspace subscriptionLabel={subscriptionLabel} />;
}
