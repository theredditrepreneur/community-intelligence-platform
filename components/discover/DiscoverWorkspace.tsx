'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CommunityAssessment } from '@/components/reports/CommunityAssessment';
import type { BrandProfile } from '@/lib/brands';
import type { DiscoverBrief } from '@/lib/ai/community-intelligence';

type DiscoverForm = {
  brandName: string;
  website: string;
  companyDescription: string;
  idealCustomers: string;
  competitors: string;
  keywords: string;
  searchDepth: string;
  timeframe: string;
};

type RetrievedSource = {
  title: string;
  subreddit: string;
  url: string;
  excerpt: string;
  score: number;
  comments: number;
  createdAt: string;
};

type DiscoverResult = DiscoverBrief & {
  sourceCoverage: {
    searchedSources: string[];
    comingLater: string[];
    limitation: string;
  };
  retrievedSources: RetrievedSource[];
};

const activeSources = ['Reddit public search'];
const comingSoonSources = ['YouTube', 'TikTok', 'LinkedIn', 'X', 'Trustpilot', 'G2', 'Forums'];
const searchDepths = ['Quick Scan', 'Standard Search', 'Deep Community Search'];
const timeframes = ['Past Week', 'Past Month', 'Past 3 Months', 'Past Year', 'Custom'];

function HowDiscoverWorks() {
  return (
    <section className="discover-explainer">
      <div>
        <span className="dashboard-kicker">How Discover works</span>
        <ol>
          <li>You enter your brand, competitors, keywords and selected sources.</li>
          <li>Discover searches supported public sources for relevant conversations.</li>
          <li>We filter and rank the findings.</li>
          <li>The Redditrepreneur Framework turns them into a Community Intelligence Assessment.</li>
        </ol>
      </div>
      <p>
        Discover currently searches supported Reddit public results only. Other sources are labelled clearly as Coming Soon until their connectors are active.
      </p>
    </section>
  );
}

function SourceSelection() {
  return (
    <div className="source-selection">
      <div>
        <h3>Active Sources</h3>
        <div className="source-grid">
          {activeSources.map((source) => (
            <label className="source-chip" key={source}>
              <input type="checkbox" checked readOnly />
              <span>{source}</span>
              <small>Active</small>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3>Coming Soon</h3>
        <div className="source-grid">
          {comingSoonSources.map((source) => (
            <label className="source-chip disabled" key={source}>
              <input type="checkbox" disabled />
              <span>{source}</span>
              <small>Coming Soon</small>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function DiscoveryResults({ result }: { result: DiscoverResult }) {
  return (
    <CommunityAssessment
      assessment={result.assessment}
      fallbackScore={result.communityIntelligenceScore}
      fallbackConfidence={result.confidenceScore}
      sourceCoverage={result.sourceCoverage}
      retrievedCount={result.retrievedSources.length}
    />
  );
}

function BrandContextCard({ brand }: { brand: BrandProfile }) {
  return (
    <article className="dashboard-card brand-context-card">
      <span className="dashboard-kicker">Brand Profile</span>
      <h2>{brand.companyName}</h2>
      <p>{brand.companyDescription || 'Discover will use your saved company context for search and analysis.'}</p>
      <div className="brand-context-grid">
        <div><strong>Customers</strong><span>{brand.idealCustomers || 'Not set yet'}</span></div>
        <div><strong>Competitors</strong><span>{brand.competitors || 'Not set yet'}</span></div>
        <div><strong>Keywords</strong><span>{brand.keywords || 'Not set yet'}</span></div>
      </div>
      <Button href="/app/onboarding" variant="secondary">Edit Brand Profile</Button>
    </article>
  );
}

export function DiscoverWorkspace({ brand }: { brand: BrandProfile }) {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<DiscoverForm>({
    brandName: brand.companyName,
    website: brand.website,
    companyDescription: brand.companyDescription,
    idealCustomers: brand.idealCustomers,
    competitors: brand.competitors,
    keywords: brand.keywords,
    searchDepth: 'Standard Search',
    timeframe: 'Past Month',
  });

  async function generateDiscoverAssessment() {
    setError('');
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/ai/discover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          platformsToSearch: ['Reddit'],
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to generate the Discover assessment.');
      }

      setResult(data as DiscoverResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate the Discover assessment.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What conversations should I know about?</div>
        <h1>Discover Community Intelligence</h1>
        <p>We&apos;ll use your Brand Profile to search supported Reddit public results, then turn the findings into a Community Intelligence Assessment.</p>
      </section>

      <BrandContextCard brand={brand} />
      <HowDiscoverWorks />

      {!result ? (
        <section className="step-card active">
          <div className="step-label">Step {step}</div>
          {step === 1 && <><h2>Supported Sources</h2><SourceSelection /></>}
          {step === 2 && <><h2>Search Scope</h2><div className="choice-grid">{searchDepths.map((item) => <button type="button" key={item} className={['btn btn-secondary option', form.searchDepth === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, searchDepth: item })}>{item}</button>)}</div></>}
          {step === 3 && <><h2>Search Timeframe</h2><div className="choice-grid">{timeframes.map((item) => <button type="button" key={item} className={['btn btn-secondary option', form.timeframe === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, timeframe: item })}>{item}</button>)}</div><p className="helper timeframe-note">The selected timeframe applies to Reddit public search results. Coverage depends on what Reddit returns for the query.</p></>}
          {error ? <p className="checkout-error">{error}</p> : null}
          <div className="button-row">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
            {step < 3 ? (
              <Button onClick={() => setStep((value) => value + 1)}>Continue</Button>
            ) : (
              <Button variant="orange" onClick={generateDiscoverAssessment} disabled={isGenerating}>
                {isGenerating ? 'Creating assessment...' : 'Discover Community Intelligence'}
              </Button>
            )}
          </div>
        </section>
      ) : null}

      {!result ? (
        <section className="empty-state panel">
          <h2>Current source coverage</h2>
          <p>Discover currently searches Reddit public results. YouTube, TikTok, LinkedIn, X, review sources, forums and broader public web search are coming later.</p>
        </section>
      ) : null}

      {result ? (
        <>
          <DiscoveryResults result={result} />
          <div className="repeat-actions">
            <Button variant="orange" onClick={() => { setResult(null); setStep(1); }}>Start New Discovery</Button>
          </div>
        </>
      ) : null}
    </>
  );
}
