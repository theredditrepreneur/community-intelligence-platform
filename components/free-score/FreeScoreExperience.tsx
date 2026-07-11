'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { CommunityScorecardResult, DimensionKey } from '@/lib/free-score/types';
import { TurnstileWidget } from './TurnstileWidget';
import { AnalyticsConsent } from './AnalyticsConsent';
import { track } from '@/lib/free-score/analytics';

const dimensionLabels: Record<DimensionKey, string> = { communityPresence: 'Community Presence', communityTrust: 'Community Trust', shareOfConsensus: 'Share of Consensus', insightResponsiveness: 'Insight Responsiveness', communityAuthority: 'Community Authority' };
const progress = ['Validating your company information', 'Searching relevant community signals', 'Assessing trust and recommendations', 'Calculating evidence confidence'];

export function FreeScoreExperience({ embed = false }: { embed?: boolean }) {
  const [started, setStarted] = useState(false); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const [result, setResult] = useState<CommunityScorecardResult | null>(null); const formRef = useRef<HTMLFormElement>(null);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (!embed) return;
    const approved = ['https://theredditrepreneur.com', 'https://www.theredditrepreneur.com'];
    let parentOrigin = '';
    try { parentOrigin = document.referrer ? new URL(document.referrer).origin : ''; } catch { parentOrigin = ''; }
    const targetOrigin = approved.includes(parentOrigin) ? parentOrigin : '';
    const sendHeight = () => { if (targetOrigin) window.parent.postMessage({ type: 'redditrepreneur:free-score:resize', version: 1, height: document.documentElement.scrollHeight }, targetOrigin); };
    const observer = new ResizeObserver(sendHeight); observer.observe(document.body); sendHeight(); return () => observer.disconnect();
  }, [embed, result, loading]);

  useEffect(() => { void track('free_score_page_viewed', { authentication_state: 'anonymous', entry_mode: embed ? 'embed' : 'direct' }); }, [embed]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(''); setResult(null); void track('free_score_form_submitted', { authentication_state: 'anonymous', entry_mode: embed ? 'embed' : 'direct' }); void track('free_score_generation_started', { authentication_state: 'anonymous' });
    const data = new FormData(event.currentTarget); const params = new URLSearchParams(window.location.search);
    const attribution = Object.fromEntries([...params].filter(([key]) => key.startsWith('utm_') || key === 'ref'));
    try {
      const response = await fetch('/api/free-score/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ companyName: data.get('companyName'), website: data.get('website'), competitor: data.get('competitor'), industry: data.get('industry'), turnstileToken, attribution }) });
      const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Unable to generate the score.'); setResult(body.result); void track('free_score_generation_completed', { confidence_tier: body.result.confidence, score_tier: body.result.tier, demonstration: body.result.demonstration }); void track('free_score_preview_viewed', { confidence_tier: body.result.confidence, score_tier: body.result.tier, demonstration: body.result.demonstration });
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to generate the score.'); void track('free_score_generation_failed'); }
    finally { setLoading(false); }
  }

  return <div className={embed ? 'free-score-shell embed' : 'free-score-shell'}>
    <section className="free-score-hero">
      <Image src="/redditrepreneur-logo.png" alt="The Redditrepreneur" width={52} height={52} priority />
      <div><span className="free-score-kicker">Free Community Intelligence Score</span><h1>Discover Your Community Intelligence Score</h1><p>See how your brand is discussed, trusted and recommended across online communities.</p></div>
    </section>
    {!result && !loading ? <form ref={formRef} className="free-score-form" onSubmit={submit} onFocus={() => setStarted(true)}>
      {started ? <p className="sr-only" aria-live="polite">Free score form started.</p> : null}
      <div className="free-score-fields"><label>Company or brand name<input name="companyName" autoComplete="organization" maxLength={100} required /></label><label>Company website URL<input name="website" type="text" inputMode="url" placeholder="example.com" required /></label><label>Primary competitor <span>Optional</span><input name="competitor" maxLength={100} /></label><label>Industry or category <span>Optional</span><input name="industry" maxLength={100} /></label></div>
      <p className="form-consent">By continuing, you ask us to process these company details to create your score preview. No email is required to begin.</p>
      <TurnstileWidget onToken={setTurnstileToken} />
      {error ? <div className="free-score-error" role="alert">{error}</div> : null}<button className="free-score-primary" type="submit">Generate My Free Score</button>
    </form> : null}
    {loading ? <section className="free-score-progress" aria-live="polite" aria-busy="true"><div className="score-spinner" aria-hidden="true" /><h2>Building your Community Intelligence preview</h2>{progress.map((item, index) => <p key={item} style={{ animationDelay: `${index * .4}s` }}>{item}</p>)}</section> : null}
    {result ? <ScorePreview result={result} /> : null}
    {!embed ? <AnalyticsConsent /> : null}
    {embed ? <a className="embed-fallback" href="/free-score" target="_top">Open securely in The Redditrepreneur</a> : null}
  </div>;
}

function ScorePreview({ result }: { result: CommunityScorecardResult }) {
  const strongest = result.strongestDimension ? dimensionLabels[result.strongestDimension] : 'Insufficient evidence';
  const weakest = result.weakestDimension ? dimensionLabels[result.weakestDimension] : 'Insufficient evidence';
  return <section className="free-score-preview" aria-labelledby="preview-title">
    {result.demonstration ? <div className="demo-banner" role="status"><strong>Demonstration result</strong> Fixture data is being used. This is not a live company analysis and cannot be shared publicly.</div> : null}
    <div className="score-preview-head"><div><span className="free-score-kicker">Your preview</span><h2 id="preview-title">{result.status === 'insufficient_data' ? 'Limited Community Data' : result.tier}</h2><p>Confidence: <strong>{result.confidence}</strong></p></div><div className="score-orbit"><strong>{result.overallScore ?? '—'}</strong><span>/100</span></div></div>
    <div className="preview-grid"><article><span>Strongest dimension</span><strong>{strongest}</strong></article><article><span>Weakest dimension</span><strong>{weakest}</strong></article><article><span>Conversations analysed</span><strong>{result.conversationCount}</strong></article><article><span>Date range</span><strong>{new Date(result.dateRange.start).toLocaleDateString()} – {new Date(result.dateRange.end).toLocaleDateString()}</strong></article></div>
    <article className="preview-insight"><span>Key community insight</span><p>{result.keyInsight}</p></article><article className="preview-insight"><span>Recommended action</span><p>{result.recommendedAction}</p></article>
    <div className="unlock-card"><div><span className="free-score-kicker">Save and unlock</span><h2>Unlock Your Full Community Intelligence Scorecard</h2><p>Create a free account or sign in to save this private demonstration scorecard. Live scores remain disabled until an approved data provider is configured.</p></div><div className="unlock-actions"><a className="free-score-primary" href="/sign-up?freeScore=1">Create free account</a><a className="free-score-secondary" href="/sign-in?freeScore=1">Sign in</a></div></div>
  </section>;
}
