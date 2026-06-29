'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

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

type DiscoverResult = {
  executiveSummary: string;
  communityIntelligenceScore: number;
  marketSignals: string[];
  likelyConversationThemes: string[];
  biggestBusinessOpportunities: string[];
  biggestRisks: string[];
  buyingIntentSignals: string[];
  competitorIntelligence: string[];
  aiSearchOpportunities: string[];
  contentRoadmap: string[];
  priorityActions: string[];
  recommendedSearches: string[];
  confidenceScore: number;
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

function ListFinding({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="finding">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </article>
  );
}

function HowDiscoverWorks() {
  return (
    <section className="discover-explainer">
      <div>
        <span className="dashboard-kicker">How Discover works</span>
        <ol>
          <li>You enter your brand, competitors, keywords and selected sources.</li>
          <li>Discover searches supported public sources for relevant conversations.</li>
          <li>We filter and rank the findings.</li>
          <li>The Redditrepreneur Framework turns them into a Community Intelligence Brief.</li>
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
    <section className="findings ai-results">
      <div className="eyebrow">Reddit Discover Brief</div>
      <article className="finding featured-finding">
        <h3>Executive Summary</h3>
        <p>{result.executiveSummary}</p>
      </article>
      <div className="discovery-meta-grid">
        <article className="finding"><h3>Sources searched</h3><p>{result.sourceCoverage.searchedSources.join(', ')}</p></article>
        <article className="finding"><h3>Coverage note</h3><p>{result.sourceCoverage.limitation}</p></article>
        <article className="finding"><h3>Reddit results found</h3><strong>{result.retrievedSources.length}</strong></article>
        <article className="finding"><h3>Confidence Score</h3><strong>{result.confidenceScore}/100</strong></article>
      </div>
      <ListFinding title="Market Signals" items={result.marketSignals} />
      <ListFinding title="Likely Conversation Themes" items={result.likelyConversationThemes} />
      <ListFinding title="Biggest Business Opportunities" items={result.biggestBusinessOpportunities} />
      <ListFinding title="Biggest Risks" items={result.biggestRisks} />
      <ListFinding title="Buying Intent Signals" items={result.buyingIntentSignals} />
      <ListFinding title="Competitor Intelligence" items={result.competitorIntelligence} />
      <ListFinding title="AI Search Opportunities" items={result.aiSearchOpportunities} />
      <ListFinding title="Content Roadmap" items={result.contentRoadmap} />
      <ListFinding title="Priority Actions" items={result.priorityActions} />
      <ListFinding title="Recommended Follow-up Searches" items={result.recommendedSearches} />
      <article className="finding source-references">
        <h3>Reddit Source References</h3>
        {result.retrievedSources.length ? (
          <ul>
            {result.retrievedSources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer">{source.title}</a>
                <span>{source.subreddit} - {source.comments} comments - score {source.score}</span>
                {source.excerpt ? <p>{source.excerpt}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Reddit results were returned for this search. Try broader keywords, more competitors or a longer timeframe.</p>
        )}
      </article>
      <article className="finding">
        <h3>Coming Later</h3>
        <ul>
          {result.sourceCoverage.comingLater.map((source) => <li key={source}>{source}</li>)}
        </ul>
      </article>
    </section>
  );
}

export function DiscoverWorkspace() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<DiscoverForm>({
    brandName: '',
    website: '',
    companyDescription: '',
    idealCustomers: '',
    competitors: '',
    keywords: '',
    searchDepth: 'Standard Search',
    timeframe: 'Past Month',
  });

  async function generateDiscoverBrief() {
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
        throw new Error(data.error || 'Unable to generate the Discover brief.');
      }

      setResult(data as DiscoverResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to generate the Discover brief.');
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
        <p>Tell us about your business and we&apos;ll search supported Reddit public results for relevant conversations, then turn the findings into a Community Intelligence Brief.</p>
      </section>

      <HowDiscoverWorks />

      {!result ? (
        <section className="step-card active">
          <div className="step-label">Step {step}</div>
          {step === 1 && <><h2>About Your Business</h2><div className="field-grid"><label>Brand Name<input value={form.brandName} onChange={(event) => setForm({ ...form, brandName: event.target.value })} /></label><label>Website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label><label className="full">What does your company do?<textarea value={form.companyDescription} onChange={(event) => setForm({ ...form, companyDescription: event.target.value })} /></label><label className="full">Who are your ideal customers?<textarea value={form.idealCustomers} onChange={(event) => setForm({ ...form, idealCustomers: event.target.value })} /></label></div></>}
          {step === 2 && <><h2>Watchlist</h2><label>Competitors<input value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} /></label><label>Keywords<input value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} /></label></>}
          {step === 3 && <><h2>Supported Sources</h2><SourceSelection /></>}
          {step === 4 && <><h2>Search Scope</h2><div className="choice-grid">{searchDepths.map((item) => <button key={item} className={['btn btn-secondary option', form.searchDepth === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, searchDepth: item })}>{item}</button>)}</div></>}
          {step === 5 && <><h2>Search Timeframe</h2><div className="choice-grid">{timeframes.map((item) => <button key={item} className={['btn btn-secondary option', form.timeframe === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, timeframe: item })}>{item}</button>)}</div><p className="helper timeframe-note">The selected timeframe applies to Reddit public search results. Coverage depends on what Reddit returns for the query.</p></>}
          {error ? <p className="checkout-error">{error}</p> : null}
          <div className="button-row">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
            {step < 5 ? (
              <Button onClick={() => setStep((value) => value + 1)}>Continue</Button>
            ) : (
              <Button variant="orange" onClick={generateDiscoverBrief} disabled={isGenerating}>
                {isGenerating ? 'Searching Reddit...' : 'Discover Community Intelligence'}
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
