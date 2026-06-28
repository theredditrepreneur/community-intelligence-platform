import { NextResponse } from 'next/server';
import { generateAnalyseBrief, type AnalyseInput } from '@/lib/ai/community-intelligence';
import { requirePlan } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidPayload(payload: Partial<AnalyseInput>) {
  return Boolean(payload.brandName && payload.platform && payload.conversationText);
}

export async function POST(request: Request) {
  await requirePlan('analyse');

  const payload = (await request.json().catch(() => ({}))) as Partial<AnalyseInput>;

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: 'Brand, platform and conversation text are required.' }, { status: 400 });
  }

  try {
    const brief = await generateAnalyseBrief({
      brandName: payload.brandName || '',
      website: payload.website || '',
      platform: payload.platform || '',
      conversationText: payload.conversationText || '',
      competitors: payload.competitors || '',
      targetCustomer: payload.targetCustomer || '',
      strategicGoal: payload.strategicGoal || '',
    });

    return NextResponse.json(brief);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate the brief.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
