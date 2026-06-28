import { NextResponse } from 'next/server';
import { generateDiscoverBrief, type DiscoverInput } from '@/lib/ai/community-intelligence';
import { requirePlan } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidPayload(payload: Partial<DiscoverInput>) {
  return Boolean(payload.brandName && payload.companyDescription && payload.keywords);
}

export async function POST(request: Request) {
  await requirePlan('discover');

  const payload = (await request.json().catch(() => ({}))) as Partial<DiscoverInput>;

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: 'Brand, company description and keywords are required.' }, { status: 400 });
  }

  try {
    const brief = await generateDiscoverBrief({
      brandName: payload.brandName || '',
      website: payload.website || '',
      companyDescription: payload.companyDescription || '',
      idealCustomers: payload.idealCustomers || '',
      competitors: payload.competitors || '',
      keywords: payload.keywords || '',
      platformsToSearch: Array.isArray(payload.platformsToSearch) ? payload.platformsToSearch : [],
      searchDepth: payload.searchDepth || 'Standard Search',
      timeframe: payload.timeframe || 'Past Month',
    });

    return NextResponse.json(brief);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate the discovery brief.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
