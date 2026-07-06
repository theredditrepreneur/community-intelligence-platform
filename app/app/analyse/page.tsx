import { AnalyseWorkspace } from '@/components/analyse/AnalyseWorkspace';
import { requireBrandProfile } from '@/lib/brands';
import { requirePlan } from '@/lib/subscription';

export default async function Page() {
  await requirePlan('analyse');
  const brand = await requireBrandProfile();

  return <AnalyseWorkspace brand={brand} />;
}
