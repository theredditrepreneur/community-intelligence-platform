'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { AnalyseBrief, AnalyseInput } from '@/lib/ai/community-intelligence';

type ConversationSource = {
  id: number;
  platform: string;
  url: string;
  text: string;
};

const initialSource: ConversationSource = {
  id: 0,
  platform: 'Reddit thread',
  url: '',
  text: '',
};

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

function AnalyseResults({ brief }: { brief: AnalyseBrief }) {
  return (
    <section className="findings ai-results">
      <div className="eyebrow">Intelligence Findings</div>
      <article className="finding featured-finding">
        <h3>Executive Summary</h3>
        <p>{brief.executiveSummary}</p>
      </article>
      <div className="score-grid">
        <ScoreCard label="Community Intelligence Score" value={brief.communityIntelligenceScore} />
        <ScoreCard label="Confidence Score" value={brief.confidenceScore} />
      </div>
      <article className="finding"><h3>Key Findings</h3><FieldList items={brief.keyFindings} /></article>
      <article className="finding"><h3>Pain Points</h3><FieldList items={brief.painPoints} /></article>
      <article className="finding"><h3>Buying Intent</h3><FieldList items={brief.buyingIntent} /></article>
      <article className="finding"><h3>Competitor Mentions</h3><FieldList items={brief.competitorMentions} /></article>
      <article className="finding"><h3>AI Search Opportunities</h3><FieldList items={brief.aiSearchOpportunities} /></article>
      <article className="finding"><h3>Content Opportunities</h3><FieldList items={brief.contentOpportunities} /></article>
      <article className="finding"><h3>Recommended Actions</h3><FieldList items={brief.recommendedActions} /></article>
      <article className="finding"><h3>Business Impact</h3><p>{brief.businessImpact}</p></article>
      <article className="finding"><h3>Evidence</h3><FieldList items={brief.evidence} /></article>
    </section>
  );
}

export function AnalyseWorkspace() {
  const [sources, setSources] = useState<ConversationSource[]>([initialSource]);
  const [form, setForm] = useState<Omit<AnalyseInput, 'platform' | 'conversationText'>>({
    brandName: '',
    website: '',
    competitors: '',
    targetCustomer: '',
    strategicGoal: '',
  });
  const [brief, setBrief] = useState<AnalyseBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateSource(id: number, updates: Partial<ConversationSource>) {
    setSources((items) => items.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  async function generateBrief() {
    setLoading(true);
    setError('');
    setBrief(null);

    const conversationText = sources
      .map((source, index) => [
        `Source ${index + 1}`,
        `Platform: ${source.platform}`,
        source.url ? `URL: ${source.url}` : '',
        source.text,
      ].filter(Boolean).join('\n'))
      .join('\n\n');

    try {
      const response = await fetch('/api/ai/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          platform: sources.map((source) => source.platform).join(', '),
          conversationText,
        }),
      });
      const data = (await response.json()) as AnalyseBrief | { error?: string };

      if (!response.ok) {
        throw new Error('error' in data ? data.error || 'Unable to generate brief.' : 'Unable to generate brief.');
      }

      setBrief(data as AnalyseBrief);
    } catch (briefError) {
      setError(briefError instanceof Error ? briefError.message : 'Unable to generate brief.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Community Intelligence Platform</div>
        <div className="question">What does this conversation mean?</div>
        <h1>Analyse Community Conversations</h1>
        <p>Paste conversations from Reddit, YouTube, TikTok, LinkedIn, X, reviews or forums. We&apos;ll turn them into executive ready Community Intelligence.</p>
      </section>
      <section className="panel">
        <div className="stack">
          <div className="field-grid">
            <label>Brand Name<input value={form.brandName} onChange={(event) => setForm({ ...form, brandName: event.target.value })} placeholder="Brand, product or market" /></label>
            <label>Website<input value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} placeholder="https://example.com" /></label>
            <label>Competitors<input value={form.competitors} onChange={(event) => setForm({ ...form, competitors: event.target.value })} placeholder="Competitors mentioned or relevant" /></label>
            <label>Target Customer<input value={form.targetCustomer} onChange={(event) => setForm({ ...form, targetCustomer: event.target.value })} placeholder="Who you sell to" /></label>
            <label className="full">Strategic Goal<textarea value={form.strategicGoal} onChange={(event) => setForm({ ...form, strategicGoal: event.target.value })} placeholder="What decision should this brief support?" /></label>
          </div>
          <div className="stack">
            {sources.map((source, index) => (
              <div className="conversation-source" key={source.id}>
                <div className="source-head">
                  <strong>Source {index + 1}</strong>
                  <button className="remove-source" disabled={sources.length === 1} onClick={() => setSources((items) => items.filter((item) => item.id !== source.id))}>Remove</button>
                </div>
                <div className="source-row">
                  <label>Platform<select value={source.platform} onChange={(event) => updateSource(source.id, { platform: event.target.value })}><option>Reddit thread</option><option>YouTube comments</option><option>TikTok comments</option><option>LinkedIn post</option><option>X conversation</option><option>Reviews</option><option>Forum thread</option><option>Other</option></select></label>
                  <label>URL<input type="url" value={source.url} onChange={(event) => updateSource(source.id, { url: event.target.value })} placeholder="Paste source URL" /></label>
                </div>
                <label>Conversation<textarea value={source.text} onChange={(event) => updateSource(source.id, { text: event.target.value })} placeholder="Paste the conversation, comments, transcript or review text here." /></label>
              </div>
            ))}
          </div>
          {error ? <p className="checkout-error">{error}</p> : null}
          <div className="button-row">
            <Button variant="secondary" onClick={() => setSources((items) => [...items, { ...initialSource, id: Date.now() }])}>Add Conversation or URL</Button>
            <Button variant="orange" onClick={generateBrief} disabled={loading}>{loading ? 'Generating brief...' : 'Generate Community Intelligence Brief'}</Button>
          </div>
        </div>
      </section>
      {loading ? <section className="loading active"><div>Reading conversation context...</div><div>Finding commercial signals...</div><div>Building Community Intelligence Brief...</div></section> : null}
      {!brief && !loading ? <section className="empty-state panel"><h2>No brief generated yet.</h2><p>Paste a conversation and generate your first Community Intelligence Brief.</p></section> : null}
      {brief ? <AnalyseResults brief={brief} /> : null}
    </>
  );
}
