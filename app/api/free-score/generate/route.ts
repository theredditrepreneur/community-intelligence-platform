import { NextResponse } from 'next/server';
import { freeScoreServerConfig } from '@/lib/free-score/config';
import { createFixtureScore } from '@/lib/free-score/fixtures';
import { freeScoreCookie, sealPendingScore } from '@/lib/free-score/session';
import { validateScoreRequest } from '@/lib/free-score/validation';
import { enforceFreeScoreRateLimit, requestIp } from '@/lib/free-score/abuse';
import { verifyTurnstile } from '@/lib/free-score/turnstile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!freeScoreServerConfig.enabled) return NextResponse.json({ error: 'The Free Community Intelligence Score is not currently available.' }, { status: 503 });
  try {
    const input = validateScoreRequest(await request.json());
    await verifyTurnstile(input.turnstileToken, requestIp(request));
    await enforceFreeScoreRateLimit(request, input.normalizedDomain);
    if (freeScoreServerConfig.liveDataEnabled) return NextResponse.json({ error: 'Live Community Intelligence generation requires an approved configured provider.' }, { status: 503 });
    const result = await createFixtureScore(input.companyName, input.competitor, input.industry);
    const response = NextResponse.json({ result, mode: 'demonstration' });
    response.cookies.set(freeScoreCookie, sealPendingScore({ request: input, result, createdAt: new Date().toISOString(), attribution: input.attribution }), {
      httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 86400,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to generate the score preview.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
