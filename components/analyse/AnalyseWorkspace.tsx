'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CommunityAssessment } from '@/components/reports/CommunityAssessment';
import type { BrandProfile } from '@/lib/brands';
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

function AnalyseResults({ brief }: { brief: AnalyseBrief }) {
  return (
    <CommunityAssessment
      assessment={brief.assessment}
      fallbackScore={brief.communityIntelligenceScore}
      fallbackConfidence={brief.confidenceScore}
    />
  );
}

function BrandContextCard({ brand }: { brand: BrandProfile }) {
  return (
    <article className="dashboard-card brand-context-card">
      <span className="dashboard-kicker">Brand Profile</span>
      <h2>{brand.companyName}</h2>
      <p>{brand.companyDescription || 'Your saved company context will be used in this analysis.'}</p>
      <div className="brand-context-grid">
        <div><strong>Customers</strong><span>{brand.idealCustomers || 'Not set yet'}</span></div>
        <div><strong>Competitors</strong><span>{brand.competitors || 'Not set yet'}</span></div>
        <div><strong>Keywords</strong><span>{brand.keywords || 'Not set yet'}</span></div>
      </div>
      <Button href="/app/onboarding" variant="secondary">Edit Brand Profile</Button>
    </article>
  );
}

export function AnalyseWorkspace({ brand }: { brand: BrandProfile }) {
  const [sources, setSources] = useState<ConversationSource[]>([initialSource]);
  const form: Omit<AnalyseInput, 'platform' | 'conversationText'> = {
    brandName: brand.companyName,
    website: brand.website,
    competitors: brand.competitors,
    targetCustomer: brand.idealCustomers,
    strategicGoal: brand.goals.join(', '),
  };
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
        throw new Error('error' in data ? data.error || 'Unable to generate assessment.' : 'Unable to generate assessment.');
      }

      setBrief(data as AnalyseBrief);
    } catch (briefError) {
      setError(briefError instanceof Error ? briefError.message : 'Unable to generate assessment.');
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
        <p>Paste conversations from Reddit, YouTube, TikTok, LinkedIn, X, reviews or forums. We&apos;ll use your Brand Profile to turn them into executive ready Community Intelligence.</p>
      </section>
      <BrandContextCard brand={brand} />
      <section className="panel">
        <div className="stack">
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
            <Button variant="orange" onClick={generateBrief} disabled={loading}>{loading ? 'Generating assessment...' : 'Generate Community Intelligence Assessment'}</Button>
          </div>
        </div>
      </section>
      {loading ? <section className="loading active"><div>Reading conversation context...</div><div>Finding commercial signals...</div><div>Building Community Intelligence Assessment...</div></section> : null}
      {!brief && !loading ? <section className="empty-state panel"><h2>No assessment generated yet.</h2><p>Paste a conversation and generate your first Community Intelligence Assessment.</p></section> : null}
      {brief ? <AnalyseResults brief={brief} /> : null}
    </>
  );
}
