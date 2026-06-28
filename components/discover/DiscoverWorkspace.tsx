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

const liveDiscoveryConnected = false;
const connectorPipeline = ['Reddit', 'Public web search'];
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
          <li>The Redditrepreneur Framework turns them into a Community Intelligence Brief.</li>
        </ol>
      </div>
      <p>
        Discover uses live or recently retrieved public conversation data only from supported sources. Sources that are not yet connected are labelled Coming Soon.
      </p>
    </section>
  );
}

function SourceSelection() {
  return (
    <div className="source-selection">
      <div>
        <h3>Connector pipeline</h3>
        <div className="source-grid">
          {connectorPipeline.map((source) => (
            <label className="source-chip disabled" key={source}>
              <input type="checkbox" disabled />
              <span>{source}</span>
              <small>{liveDiscoveryConnected ? 'Available' : 'Connector required'}</small>
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

function DiscoveryPreview({ form }: { form: DiscoverForm }) {
  return (
    <section className="findings ai-results">
      <div className="eyebrow">Discovery Preview</div>
      <article className="finding featured-finding">
        <h3>Live discovery is not connected yet.</h3>
        <p>This preview shows the future Discover experience. Connect live source retrieval before charging users for Discover.</p>
      </article>
      <div className="discovery-meta-grid">
        <article className="finding"><h3>Sources searched</h3><p>None yet. Reddit and public web search are the recommended Stage 1 connectors.</p></article>
        <article className="finding"><h3>Timeframe searched</h3><p>{form.timeframe}</p></article>
        <article className="finding"><h3>Conversations found</h3><strong>0</strong></article>
        <article className="finding"><h3>Conversations analysed</h3><strong>0</strong></article>
      </div>
      <article className="finding">
        <h3>Evidence links or source references</h3>
        <p>No evidence links are available until live source retrieval is connected.</p>
      </article>
      <article className="finding">
        <h3>Confidence level</h3>
        <p>Not available. Discover confidence should be calculated after real source retrieval, filtering and analysis.</p>
      </article>
      <article className="finding">
        <h3>Limitations</h3>
        <ul>
          <li>No public source connector is active in this environment yet.</li>
          <li>No Reddit, web, YouTube, review or forum data has been retrieved.</li>
          <li>No Community Intelligence Brief should be treated as discovered evidence until compliant retrieval is connected.</li>
        </ul>
      </article>
      <article className="finding">
        <h3>Recommended implementation stages</h3>
        <ol>
          <li>Reddit and public web search connector only.</li>
          <li>YouTube official API.</li>
          <li>Review sources where compliant.</li>
          <li>Additional approved APIs.</li>
          <li>Alerts monitoring.</li>
        </ol>
      </article>
    </section>
  );
}

export function DiscoverWorkspace() {
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
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

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What conversations should I know about?</div>
        <h1>Discover Community Intelligence</h1>
        <p>Tell us about your business and we&apos;ll search supported public sources for relevant conversations.</p>
      </section>

      <HowDiscoverWorks />

      {!showPreview ? (
        <section className="step-card active">
          <div className="step-label">Step {step}</div>
          {step === 1 && <><h2>About Your Business</h2><div className="field-grid"><label>Brand Name<input value={form.brandName} onChange={(event) => setForm({ ...form, brandName: event.target.value })} /></label><label>Website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} /></label><label className="full">What does your company do?<textarea value={form.companyDescription} onChange={(event) => setForm({ ...form, companyDescription: event.target.value })} /></label><label className="full">Who are your ideal customers?<textarea value={form.idealCustomers} onChange={(event) => setForm({ ...form, idealCustomers: event.target.value })} /></label></div></>}
          {step === 2 && <><h2>Watchlist</h2><label>Competitors<input value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} /></label><label>Keywords<input value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} /></label></>}
          {step === 3 && <><h2>Supported Sources</h2><SourceSelection /></>}
          {step === 4 && <><h2>Search Scope</h2><div className="choice-grid">{searchDepths.map((item) => <button key={item} className={['btn btn-secondary option', form.searchDepth === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, searchDepth: item })}>{item}</button>)}</div></>}
          {step === 5 && <><h2>Search Timeframe</h2><div className="choice-grid">{timeframes.map((item) => <button key={item} className={['btn btn-secondary option', form.timeframe === item ? 'active' : ''].join(' ')} onClick={() => setForm({ ...form, timeframe: item })}>{item}</button>)}</div><p className="helper timeframe-note">The selected timeframe applies only to sources with live or recent retrieval enabled.</p></>}
          <div className="button-row">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
            {step < 5 ? <Button onClick={() => setStep((value) => value + 1)}>Continue</Button> : <Button variant="orange" onClick={() => setShowPreview(true)}>Discover Community Intelligence</Button>}
          </div>
        </section>
      ) : null}

      {!showPreview ? (
        <section className="empty-state panel">
          <h2>Live discovery is not connected yet.</h2>
          <p>This page shows the intended Discover workflow. Connect compliant live source retrieval before presenting Discover as active research.</p>
        </section>
      ) : null}

      {showPreview ? <><DiscoveryPreview form={form} /><div className="repeat-actions"><Button variant="orange" onClick={() => { setShowPreview(false); setStep(1); }}>Start New Discovery Preview</Button></div></> : null}
    </>
  );
}
