import { NextResponse } from 'next/server';
import { generateActionBrief, type BriefInput } from '@/lib/ai/community-intelligence';
import { requirePlan } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isValidPayload(payload: Partial<BriefInput>) {
  return Boolean(payload.briefType && payload.topic && payload.objective);
}

export async function POST(request: Request) {
  await requirePlan('analyse');

  const payload = (await request.json().catch(() => ({}))) as Partial<BriefInput>;

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: 'Brief type, topic and objective are required.' }, { status: 400 });
  }

  try {
    const brief = await generateActionBrief({
      briefType: payload.briefType || 'Executive Brief',
      topic: payload.topic || '',
      industry: payload.industry || '',
      audience: payload.audience || '',
      objective: payload.objective || '',
      platformsToPrioritise: payload.platformsToPrioritise || '',
      sourceContext: payload.sourceContext || '',
      keyInsights: payload.keyInsights || '',
      researchGoals: Array.isArray(payload.researchGoals) ? payload.researchGoals : [],
      tone: payload.tone || 'Clear, strategic and commercially focused',
      desiredOutputLength: payload.desiredOutputLength || 'Medium',
    });

    return NextResponse.json(brief);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate the brief.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
