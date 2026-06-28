import { NextResponse } from 'next/server';
import { requirePlan } from '@/lib/subscription';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  await requirePlan('discover');

  return NextResponse.json(
    {
      error: 'Live discovery is not connected yet. Connect compliant source retrieval before generating Discover briefs.',
    },
    { status: 501 }
  );
}
