'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { freeScoreCookie, openPendingScore } from './session';
import { hasScorecardPersistence, saveClaimedScorecard } from './persistence';
import { getCurrentUser } from '@/lib/supabase/server';
import { freeScoreServerConfig } from './config';
import { ResendEmailProvider } from './email';

export async function claimPendingFreeScore() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-up?freeScore=1');
  const pending = openPendingScore(cookies().get(freeScoreCookie)?.value);
  if (!pending) redirect('/free-score?error=' + encodeURIComponent('Your score preview has expired. Please generate it again.'));
  if (!hasScorecardPersistence()) redirect('/free-score?error=' + encodeURIComponent('Scorecard storage requires the Supabase migration and server configuration.'));
  const id = await saveClaimedScorecard(user.id, pending);
  if (freeScoreServerConfig.emailEnabled && !pending.result.demonstration && user.email && pending.result.overallScore != null) {
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
    await new ResendEmailProvider().sendScoreReady({ to: user.email, companyName: pending.request.companyName, score: pending.result.overallScore, tier: pending.result.tier, keyInsight: pending.result.keyInsight, scorecardUrl: `${appUrl}/app/scorecards/${id}` }, `free-score-ready-${id}`);
  }
  cookies().delete(freeScoreCookie);
  redirect(`/app/scorecards/${id}`);
}
