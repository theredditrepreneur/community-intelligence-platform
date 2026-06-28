import { BriefsWorkspace } from '@/components/briefs/BriefsWorkspace';
import { requirePlan } from '@/lib/subscription';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  await requirePlan('analyse');
  return <BriefsWorkspace />;
}
