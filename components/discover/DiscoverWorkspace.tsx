'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { DiscoverBrief, DiscoverInput } from '@/lib/ai/community-intelligence';

const platforms = ['Reddit', 'YouTube', 'TikTok', 'LinkedIn', 'X', 'Trustpilot', 'G2', 'Forums', 'Other'];
const searchDepths = ['Quick Scan', 'Standard Search', 'Deep Community Search'];
const timeframes = ['Past Week', 'Past Month', 'Past 3 Months', 'Past Year', 'Custom'];

function FieldList({ items }: { items: string[] }) {
  if (!items.length) return <p>No strong signal found in this section yet.</p>;
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="finding score-finding">
      <h3>{label}</h3>
      <strong>{value}/100</strong>
    </article>
  );
}

function DiscoverResults({ brief }: { brief: DiscoverBrief }) {
  return (
    <section className="findings ai-results">
      <div className="eyebrow">Discovery Brief</div>
      <article className="finding featured-finding"><h3>Executive Summary</h3><p>{brief.executiveSummary}</p></article>
      <div className="score-grid">
        <ScoreCard label="Community Intelligence Score" value={brief.communityIntelligenceScore} />
        <ScoreCard label="Confidence Score" value={brief.confidenceScore} />
      </div>
      <article className="finding"><h3>Market Signals</h3><FieldList items={brief.marketSignals} /></article>
      <article className="finding"><h3>Likely Conversation Themes</h3><FieldList items={brief.likelyConversationThemes} /></article>
      <article className="finding"><h3>Biggest Business Opportunities</h3><FieldList items={brief.biggestBusinessOpportunities} /></article>
      <article className="finding"><h3>Biggest Risks</h3><FieldList items={brief.biggestRisks} /></article>
      <article className="finding"><h3>Buying Intent Signals</h3><FieldList items={brief.buyingIntentSignals} /></article>
      <article className="finding"><h3>Competitor Intelligence</h3><FieldList items={brief.competitorIntelligence} /></article>
      <article className="finding"><h3>AI Search Opportunities</h3><FieldList items={brief.aiSearchOpportunities} /></article>
      <article className="finding"><h3>Content Roadmap</h3><FieldList items={brief.contentRoadmap} /></article>
      <article className="finding"><h3>Priority Actions</h3><FieldList items={brief.priorityActions} /></article>
      <article className="finding"><h3>Recommended Searches</h3><FieldList items={brief.recommendedSearches} /></article>
    </section>
  );
}

export function DiscoverWorkspace() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DiscoverInput>({
    brandName: '',
    website: '',
    companyDescription: '',
    idealCustomers: '',
    competitors: '',
    keywords: '',
    platformsToSearch: ['Reddit', 'YouTube', 'LinkedIn', 'Forums'],
    searchDepth: 'Standard Search',
    timeframe: 'Past Month',
  });
  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<DiscoverBrief | null>(null);
  const [error, setError] = useState('');

  function togglePlatform(platform: string) {
    setForm((value) => ({
      ...value,
      platformsToSearch: value.platformsToSearch.includes(platform)
        ? value.platformsToSearch.filter((item) => item !== platform)
        : [...value.platformsToSearch, platform],
    }));
  }

  async function runDiscovery() {
    setLoading(true);
    setError('');
    setBrief(null);

    try {
      const response = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as DiscoverBrief | { error?: string };

      if (!response.ok) {
        throw new Error('error' in data ? data.error || 'Unable to generate discovery brief.' : 'Unable to generate discovery brief.');
      }

      setBrief(data as DiscoverBrief);
    } catch (discoveryError) {
      setError(discoveryError instanceof Error ? discoveryError.message : 'Unable to generate discovery brief.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What conversations should I know about?</div>
        <h1>Discover Community Intelligence</h1>
        <p>Tell us about your business and we&apos;ll generate a focused Community Intelligence research brief.</p>
      </section>
      {!brief && !loading ? (
        <section className="step-card active">
          <div className="step-label">Step {step}</div>
          {step === 1 && <><h2>About Your Business</h2><div className="field-grid"><label>Brand Name<input value={form.brandName} onChange={(event) => setForm({ ...form, brandName: event.target.value })} /></label><label>Website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label><label className="full">What does your company do?<textarea value={form.companyDescription} onChange={(event) => setForm({ ...form, companyDescription: event.target.value })} /></label><label className="full">Who are your ideal customers?<textarea value={form.idealCustomers} onChange={(event) => setForm({ ...form, idealCustomers: event.target.value })} /></label></div></>}
          {step === 2 && <><h2>Watchlist</h2><label>Competitors<input value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} /></label><label>Keywords<input value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} /></label></>}
          {step === 3 && <><h2>Platforms to Search</h2><div className="choice-grid">{platforms.map((item) => <label className="chip" key={item}><input type="checkbox" checked={form.platformsToSearch.includes(item)} onChange={() => togglePlatform(item)} />{item}</label>)}</div></>}
          {step === 4 && <><h2>Search Scope</h2><div className="choice-grid">{searchDepths.map((item) => <button key={item} className={['btn btn-secondary option', form.searchDepth === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, searchDepth: item })}>{item}</button>)}</div></>}
          {step === 5 && <><h2>Search Timeframe</h2><div className="choice-grid">{timeframes.map((item) => <button key={item} className={['btn btn-secondary option', form.timeframe === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, timeframe: item })}>{item}</button>)}</div></>}
          {error ? <p className="checkout-error">{error}</p> : null}
          <div className="button-row">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
            {step < 5 ? <Button onClick={() => setStep((value) => value + 1)}>Continue</Button> : <Button variant="orange" onClick={runDiscovery}>Discover Community Intelligence</Button>}
          </div>
        </section>
      ) : null}
      {loading ? <section className="loading active"><div>Reading brand context...</div><div>Mapping likely community conversations...</div><div>Finding commercial opportunities...</div><div>Generating Community Intelligence Brief...</div></section> : null}
      {!brief && !loading ? <section className="empty-state panel"><h2>No discovery brief yet.</h2><p>Complete the steps to generate a Community Intelligence research brief.</p></section> : null}
      {brief ? <><DiscoverResults brief={brief} /><div className="repeat-actions"><Button variant="orange" onClick={() => { setBrief(null); setStep(1); }}>Start New Discovery</Button></div></> : null}
    </>
  );
}
