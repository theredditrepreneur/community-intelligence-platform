import { AnalyseWorkspace } from '@/components/analyse/AnalyseWorkspace';
import { requirePlan } from '@/lib/subscription';

export default async function Page() {
  await requirePlan('analyse');
  return <AnalyseWorkspace />;
}
