'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const findings = ['Executive Summary','Community Intelligence Score','Key Findings','Pain Points','Buying Intent','Competitor Mentions','AI Search Opportunities','Recommended Actions','Business Impact','Evidence','Confidence Score'];

export function AnalyseWorkspace() {
  const [sources, setSources] = useState([0]);
  const [showFindings, setShowFindings] = useState(false);
  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What does this conversation mean?</div>
        <h1>Analyse Community Conversations</h1>
        <p>Paste conversations from Reddit, YouTube, TikTok, LinkedIn, X, reviews or forums. We'll turn them into executive ready Community Intelligence.</p>
      </section>
      <section className="panel">
        <div className="stack">
          <div className="field-grid">
            <label>Brand Context<input placeholder="Brand, product or market context" /></label>
            <label>Competitors<input placeholder="Competitors mentioned or relevant" /></label>
          </div>
          <div className="stack">
            {sources.map((source, index) => (
              <div className="conversation-source" key={source}>
                <div className="source-head">
                  <strong>Source {index + 1}</strong>
                  <button className="remove-source" disabled={sources.length === 1} onClick={() => setSources((items) => items.filter((item) => item !== source))}>Remove</button>
                </div>
                <div className="source-row">
                  <label>Source Type<select><option>Reddit thread</option><option>YouTube comments</option><option>TikTok comments</option><option>LinkedIn post</option><option>X conversation</option><option>Reviews</option><option>Forum thread</option><option>Other</option></select></label>
                  <label>URL<input type="url" placeholder="Paste source URL" /></label>
                </div>
                <label>Conversation<textarea placeholder="Paste the conversation, comments, transcript or review text here." /></label>
              </div>
            ))}
          </div>
          <div className="button-row">
            <Button variant="secondary" onClick={() => setSources((items) => [...items, Date.now()])}>Add Conversation or URL</Button>
            <Button variant="orange" onClick={() => setShowFindings(true)}>Generate Community Intelligence Brief</Button>
          </div>
        </div>
      </section>
      {showFindings ? (
        <section className="findings">
          <div className="eyebrow">Intelligence Findings</div>
          {findings.map((finding, index) => (
            <article className="finding" key={finding}>
              <h3>{finding}</h3>
              <p>{index === 0 ? 'Buyers are actively comparing options and need clearer proof, pricing context and onboarding reassurance before moving forward.' : 'What we found, why it matters commercially, and what the business should do next.'}</p>
            </article>
          ))}
          <div className="repeat-actions">
            <Button variant="orange" onClick={() => setShowFindings(false)}>Analyse Another Conversation</Button>
            <Button variant="secondary" onClick={() => { setSources([0]); setShowFindings(false); }}>Clear Inputs</Button>
          </div>
        </section>
      ) : null}
    </>
  );
}
