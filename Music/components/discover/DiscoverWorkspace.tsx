'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const reportSections = ['Executive Summary','Community Intelligence Score','What Changed / What Was Found','Biggest Business Opportunities','Biggest Risks','Buying Intent Signals','Competitor Intelligence','AI Search Opportunities','Content Roadmap','Priority Actions','Evidence','Confidence Score','Generate Executive Brief'];

export function DiscoverWorkspace() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  function runDiscovery() {
    setLoading(true);
    setShowReport(false);
    window.setTimeout(() => { setLoading(false); setShowReport(true); }, 900);
  }
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What conversations should I know about?</div>
        <h1>Discover Community Intelligence</h1>
        <p>Tell us about your business and we'll find the conversations that matter.</p>
      </section>
      {!showReport && !loading ? (
        <section className="step-card active">
          <div className="step-label">Step {step}</div>
          {step === 1 && <><h2>About Your Business</h2><div className="field-grid"><label>Brand Name<input /></label><label>Website<input /></label><label className="full">What does your company do?<textarea /></label><label className="full">Who are your ideal customers?<textarea /></label></div></>}
          {step === 2 && <><h2>Watchlist</h2><label>Competitors<input /></label><label>Keywords<input /></label></>}
          {step === 3 && <><h2>Platforms to Search</h2><div className="choice-grid">{['Reddit','YouTube','TikTok','LinkedIn','X','Trustpilot','G2','Forums','Other'].map((item) => <label className="chip" key={item}><input type="checkbox" defaultChecked />{item}</label>)}</div></>}
          {step === 4 && <><h2>Search Scope</h2><div className="choice-grid"><button className="btn btn-secondary option">Quick Scan</button><button className="btn btn-secondary option active">Standard Search</button><button className="btn btn-secondary option">Deep Community Search</button></div></>}
          {step === 5 && <><h2>Search Timeframe</h2><div className="choice-grid"><button className="btn btn-secondary option">Past Week</button><button className="btn btn-secondary option active">Past Month</button><button className="btn btn-secondary option">Past 3 Months</button><button className="btn btn-secondary option">Past Year</button><button className="btn btn-secondary option">Custom</button></div></>}
          <div className="button-row">
            {step > 1 ? <Button variant="secondary" onClick={() => setStep((value) => value - 1)}>Back</Button> : null}
            {step < 5 ? <Button onClick={() => setStep((value) => value + 1)}>Continue</Button> : <Button variant="orange" onClick={runDiscovery}>Discover Community Intelligence</Button>}
          </div>
        </section>
      ) : null}
      {loading ? <section className="loading active"><div>Searching Reddit...</div><div>Searching YouTube...</div><div>Searching LinkedIn...</div><div>Searching Trustpilot...</div><div>Finding buying signals...</div><div>Finding competitor mentions...</div><div>Analysing conversations...</div><div>Generating Community Intelligence Brief...</div></section> : null}
      {showReport ? <section className="findings"><div className="eyebrow">Intelligence Findings</div>{reportSections.map((item, index) => <article className="finding" key={item}><h3>{item}</h3><p>{index === 0 ? 'The highest value conversations are clustered around competitor comparisons, buying questions and emerging category language.' : 'What we found, why it matters commercially, and what the business should do next.'}</p></article>)}<Button variant="orange" onClick={() => { setShowReport(false); setStep(1); }}>Start New Discovery</Button></section> : null}
    </>
  );
}
