import { DiscoverWorkspace } from '@/components/discover/DiscoverWorkspace';
import { requirePlan } from '@/lib/subscription';

export default async function Page() {
  await requirePlan('discover');
  return <DiscoverWorkspace />;
}
