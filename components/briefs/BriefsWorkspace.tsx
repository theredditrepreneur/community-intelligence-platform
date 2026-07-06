'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ActionBrief, BriefInput } from '@/lib/ai/community-intelligence';
import type { SubscriptionLabel } from '@/lib/subscription';

const briefTypes = ['Executive Brief', 'Marketing Brief', 'Content Brief', 'Product Brief', 'Community Brief', 'Research Brief', 'Reddit Brief'];
const tones = ['Executive and concise', 'Strategic and commercially focused', 'Clear and practical', 'Bold and persuasive', 'Analytical and evidence-led'];
const lengths = ['Short', 'Medium', 'Detailed'];
const researchGoals = [
  'Understand community sentiment',
  'Find customer pain points',
  'Analyse competitors',
  'Identify content opportunities',
  'Find high-intent communities',
  'Improve positioning',
  'Discover objections',
  'Build authority',
];

const initialForm: BriefInput = {
  briefType: 'Executive Brief',
  topic: '',
  industry: '',
  audience: '',
  objective: '',
  platformsToPrioritise: '',
  sourceContext: '',
  keyInsights: '',
  researchGoals: [],
  tone: 'Strategic and commercially focused',
  desiredOutputLength: 'Medium',
};

function FieldList({ items }: { items: string[] }) {
  if (!items.length) return <p>No items generated for this section yet.</p>;
  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

type BriefsWorkspaceProps = {
  subscriptionLabel: SubscriptionLabel;
};

function formatBrief(brief: ActionBrief) {
  return [
    brief.briefTitle,
    '',
    'Executive Summary',
    brief.executiveSummary,
    '',
    'Key Findings',
    ...brief.keyFindings.map((item) => '- ' + item),
    '',
    'Strategic Context',
    brief.strategicContext,
    '',
    'Recommended Actions',
    ...brief.recommendedActions.map((item) => '- ' + item),
    '',
    'Suggested Content / Assets',
    ...brief.suggestedContentAssets.map((item) => '- ' + item),
    '',
    'Risks or Watchouts',
    ...brief.risksOrWatchouts.map((item) => '- ' + item),
    '',
    'Next Steps',
    ...brief.nextSteps.map((item) => '- ' + item),
  ].join('\n');
}

function UpgradeCta({ subscriptionLabel }: BriefsWorkspaceProps) {
  if (subscriptionLabel === 'Admin') {
    return (
      <article className="finding brief-upgrade-card">
        <h3>Admin Test Mode</h3>
        <p>Admin access enabled.</p>
      </article>
    );
  }

  if (subscriptionLabel === 'Discover') {
    return (
      <article className="finding brief-upgrade-card">
        <h3>You&apos;re on the highest active tier.</h3>
        <p>Alerts will become the next upgrade path when continuous Community Intelligence monitoring is ready.</p>
      </article>
    );
  }

  if (subscriptionLabel === 'Analyse') {
    return (
      <article className="finding brief-upgrade-card">
        <h3>Ready to find the conversations behind this brief?</h3>
        <p>Upgrade to Discover to move from bring-your-own conversations to Reddit-first supported source discovery.</p>
        <Button href="/pricing?upgrade=discover" variant="orange">Upgrade to Discover</Button>
      </article>
    );
  }

  return (
    <article className="finding brief-upgrade-card">
      <h3>Turn this free brief into deeper Community Intelligence.</h3>
      <p>Choose Analyse to bring your own conversations for AI-powered intelligence, or Discover for Reddit-first supported source discovery.</p>
      <div className="button-row">
        <Button href="/pricing?upgrade=analyse" variant="orange">Choose Analyse</Button>
        <Button href="/pricing?upgrade=discover" variant="secondary">Compare Discover</Button>
      </div>
    </article>
  );
}

export function BriefsWorkspace({ subscriptionLabel }: BriefsWorkspaceProps) {
  const [form, setForm] = useState<BriefInput>(initialForm);
  const [brief, setBrief] = useState<ActionBrief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function generateBrief() {
    setLoading(true);
    setError('');
    setNotice('');
    setBrief(null);

    try {
      const response = await fetch('/api/ai/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as ActionBrief | { error?: string };

      if (!response.ok) {
        throw new Error('error' in data ? data.error || 'Unable to generate brief.' : 'Unable to generate brief.');
      }

      setBrief(data as ActionBrief);
    } catch (briefError) {
      setError(briefError instanceof Error ? briefError.message : 'Unable to generate brief.');
    } finally {
      setLoading(false);
    }
  }

  async function copyBrief() {
    if (!brief) return;
    await navigator.clipboard.writeText(formatBrief(brief));
    setNotice('Brief copied to clipboard.');
  }

  function comingSoon(label: string) {
    setNotice(label + ' is coming soon.');
  }

  function toggleGoal(goal: string) {
    setForm((value) => ({
      ...value,
      researchGoals: value.researchGoals.includes(goal)
        ? value.researchGoals.filter((item) => item !== goal)
        : [...value.researchGoals, goal],
    }));
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Briefs</div>
        <div className="question">How should this intelligence become action?</div>
        <h1>Brief Generator</h1>
        <p>Briefs turn Community Intelligence into action-ready documents for marketing, product, leadership and content teams.</p>
      </section>

      <section className="briefs-layout">
        <div className="panel briefs-form-panel">
          <div className="stack">
            <div className="field-grid">
              <label>Brief Type<select value={form.briefType} onChange={(event) => setForm({ ...form, briefType: event.target.value })}>{briefTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Topic<input value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} placeholder="What should the brief be about?" /></label>
              <label>Industry / Category<input value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} placeholder="SaaS, ecommerce, fintech, creator, B2B..." /></label>
              <label>Audience<input value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} placeholder="Leadership, marketing, product, content..." /></label>
              <label>Objective<input value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })} placeholder="What should this brief help achieve?" /></label>
              <label>Platforms To Prioritise<input value={form.platformsToPrioritise} onChange={(event) => setForm({ ...form, platformsToPrioritise: event.target.value })} placeholder="Reddit, YouTube, reviews, forums, LinkedIn..." /></label>
              <label>Tone<select value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })}>{tones.map((tone) => <option key={tone}>{tone}</option>)}</select></label>
              <label>Desired Output Length<select value={form.desiredOutputLength} onChange={(event) => setForm({ ...form, desiredOutputLength: event.target.value })}>{lengths.map((length) => <option key={length}>{length}</option>)}</select></label>
              <label className="full">Source Context<textarea value={form.sourceContext} onChange={(event) => setForm({ ...form, sourceContext: event.target.value })} placeholder="Paste conversation extracts, research notes, Analyse output, Discover output or raw context." /></label>
              <label className="full">Key Insights<textarea value={form.keyInsights} onChange={(event) => setForm({ ...form, keyInsights: event.target.value })} placeholder="Add the strongest signals, findings or points that must be included." /></label>
            </div>
            <div className="brief-goals">
              <span className="dashboard-kicker">Research goals</span>
              <div className="goal-grid">
                {researchGoals.map((goal) => (
                  <button type="button" key={goal} className={form.researchGoals.includes(goal) ? 'goal-chip selected' : 'goal-chip'} onClick={() => toggleGoal(goal)}>
                    {goal}
                  </button>
                ))}
              </div>
            </div>
            {error ? <p className="checkout-error">{error}</p> : null}
            {notice ? <p className="auth-success">{notice}</p> : null}
            <div className="button-row">
              <Button variant="orange" onClick={generateBrief} disabled={loading}>{loading ? 'Generating brief...' : 'Generate Brief'}</Button>
              <Button variant="secondary" onClick={() => { setForm(initialForm); setBrief(null); setNotice(''); setError(''); }}>Start a blank brief</Button>
            </div>
          </div>
        </div>

        <aside className="dashboard-card briefs-guidance">
          <span className="dashboard-kicker">Coming next</span>
          <h2>From reports to briefs</h2>
          <p>Later, Analyse and Discover reports will be sent directly into Briefs so teams can turn intelligence into launch plans, content plans and leadership updates.</p>
        </aside>
      </section>

      {loading ? <section className="loading active"><div>Reading source context...</div><div>Structuring action-ready sections...</div><div>Generating brief...</div></section> : null}

      {!brief && !loading ? (
        <section className="empty-state panel">
          <h2>No brief generated yet.</h2>
          <p>Start blank or paste Community Intelligence context, then generate a brief.</p>
        </section>
      ) : null}

      {brief ? (
        <section className="findings ai-results briefs-output">
          <div className="brief-output-head">
            <div>
              <div className="eyebrow">Generated Brief</div>
              <h2>{brief.briefTitle}</h2>
            </div>
            <div className="brief-output-actions">
              <Button variant="secondary" onClick={copyBrief}>Copy Brief</Button>
              <Button variant="secondary" onClick={() => comingSoon('Save Brief')}>Save Brief</Button>
              <Button variant="secondary" onClick={() => comingSoon('Export')}>Export</Button>
            </div>
          </div>
          <article className="finding featured-finding"><h3>Executive Summary</h3><p>{brief.executiveSummary}</p></article>
          <article className="finding"><h3>Key Findings</h3><FieldList items={brief.keyFindings} /></article>
          <article className="finding"><h3>Strategic Context</h3><p>{brief.strategicContext}</p></article>
          <article className="finding"><h3>Recommended Actions</h3><FieldList items={brief.recommendedActions} /></article>
          <article className="finding"><h3>Suggested Content / Assets</h3><FieldList items={brief.suggestedContentAssets} /></article>
          <article className="finding"><h3>Risks or Watchouts</h3><FieldList items={brief.risksOrWatchouts} /></article>
          <article className="finding"><h3>Next Steps</h3><FieldList items={brief.nextSteps} /></article>
          <UpgradeCta subscriptionLabel={subscriptionLabel} />
        </section>
      ) : null}
    </>
  );
}
