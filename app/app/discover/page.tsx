import { DiscoverWorkspace } from '@/components/discover/DiscoverWorkspace';
import { requireBrandProfile } from '@/lib/brands';
import { requirePlan } from '@/lib/subscription';

export default async function Page() {
  await requirePlan('discover');
  const brand = await requireBrandProfile();

  return <DiscoverWorkspace brand={brand} />;
}
