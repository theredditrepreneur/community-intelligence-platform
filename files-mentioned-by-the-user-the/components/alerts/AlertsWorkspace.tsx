'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function AlertsWorkspace() {
  const [waitlist, setWaitlist] = useState(false);
  const [preview, setPreview] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What changed since yesterday?</div>
        <h1>Community Intelligence Alerts</h1>
        <p>Know what communities are saying before your competitors do.</p>
      </section>
      <section className="status-panel">
        <div className="monitoring">
          <div><div className="status-pill"><span className="dot" />{waitlist ? 'Waitlist Joined' : 'Coming Soon'}</div><h2>Join the Alerts waitlist.</h2><p>Continuous Community Intelligence monitoring is the next premium tier. Join the waitlist to be notified when always on alerts are ready.</p></div>
          <div className="next-brief"><span>Next Brief</span><strong>Tomorrow<br />08:00 GMT</strong></div>
        </div>
        <div className="signal-grid">
          <div className="signal"><h3>Watching</h3><p>Reddit, YouTube, LinkedIn, Trustpilot, G2 and Forums.</p></div>
          <div className="signal"><h3>Tracking</h3><p>Brand, competitors and keywords.</p></div>
          <div className="signal"><h3>Next Brief</h3><p>Tomorrow at 08:00 GMT.</p></div>
          <div className="signal"><h3>Alert Health</h3><p>Last scan completed 7 minutes ago.</p></div>
        </div>
      </section>
      <section className="launch-card">
        <div><div className="eyebrow">First time setup</div><h2>Join the Alerts Waitlist</h2><p>Alerts will add continuous monitoring, daily briefs and proactive Community Intelligence when it launches.</p></div>
        <div className="launch-grid"><div className="launch-step"><strong>1. Confirm watchlist</strong><span>Brand, competitors, keywords and priority communities.</span></div><div className="launch-step"><strong>2. Choose brief schedule</strong><span>Daily, weekly, monthly or real time alerts.</span></div><div className="launch-step"><strong>3. Activate monitoring</strong><span>Your analyst begins watching and preparing intelligence.</span></div></div>
        <div className="button-row"><Button variant="orange" onClick={() => setWaitlist(true)}>Join Alerts Waitlist</Button>{waitlist ? <span className="launch-state active">You are on the Alerts waitlist. We will notify you when continuous monitoring opens.</span> : null}</div>
      </section>
      <section className="scroll-stack">
        <section className="setup-card"><h2>Setup Alerts</h2><div className="field-grid"><label>Brand Name<input /></label><label>Website<input /></label><label className="full">What does your company do?<textarea /></label><label className="full">Who are your ideal customers?<textarea /></label></div></section>
        <section className="setup-card"><h2>Watchlist</h2><label>Competitors<p className="helper">Companies you want us to monitor.</p><input /></label><label>Keywords<p className="helper">Products, services, industries or topics you want us to watch.</p><input /></label></section>
        <section className="setup-card"><h2>Preview Community Intelligence Alert</h2><Button variant="orange" onClick={() => setPreview(true)}>Preview Community Intelligence Alert</Button></section>
        {preview ? <section className="setup-card brief-preview"><div className="eyebrow">Community Intelligence Alert 27 June 2026</div><h2>Executive Briefing</h2>{['Executive Summary','Top Insights','Business Impact','Priority Actions','Recommended Next Steps','Confidence Score','Estimated Reading Time'].map((item) => <article className="finding" key={item}><h3>{item}</h3><p>What changed, why it matters commercially, and what the business should do next.</p></article>)}</section> : null}
      </section>
    </>
  );
}
