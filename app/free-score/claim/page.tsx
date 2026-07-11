import { redirect } from 'next/navigation';
import { claimPendingFreeScore } from '@/lib/free-score/actions';
import { getCurrentUser } from '@/lib/supabase/server';
export const metadata = { robots: { index: false, follow: false } };
export default async function ClaimFreeScorePage() { const user = await getCurrentUser(); if (!user) redirect('/sign-in?freeScore=1'); return <main className="free-score-page claim-page"><section className="unlock-card claim-card"><div><span className="free-score-kicker">Secure transfer</span><h1>Save your scorecard</h1><p>Your private score preview is ready to be associated with this account.</p></div><form action={claimPendingFreeScore}><button className="free-score-primary" type="submit">Save to my dashboard</button></form></section></main>; }
