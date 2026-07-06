import { BriefsWorkspace } from '@/components/briefs/BriefsWorkspace';
import { getCurrentBrandProfile } from '@/lib/brands';
import { getSubscriptionLabel } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const subscriptionLabel = await getSubscriptionLabel();
  const brand = await getCurrentBrandProfile();

  return <BriefsWorkspace subscriptionLabel={subscriptionLabel} brand={brand} />;
}
