'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { BrandProfile } from '@/lib/brands';
import type { ActionBrief, BriefInput } from '@/lib/ai/community-intelligence';
import type { SubscriptionLabel } from '@/lib/subscription';

const briefTypes = [
  'Executive Brief',
  'Product Brief',
  'Marketing Brief',
  'Content Brief',
  'Research Brief',
  'Community Brief',
  'Strategy Brief',
  'Campaign Brief',
];
const writingStyles = ['Executive', 'Professional', 'Strategic', 'Technical', 'Friendly', 'Persuasive', 'Clear and practical'];
const objectives = [
  'Make a business decision',
  'Plan a marketing campaign',
  'Improve our product',
  'Understand customer feedback',
  'Research competitors',
  'Prepare an executive update',
  'Create content',
  'Improve positioning',
  'Identify risks',
  'Other',
];
const lengths = ['Short', 'Medium', 'Detailed'];
const researchGoals = [
  'Understand community sentiment',
  'Find customer pain points',
  'Analyse competitors',
  'Identify content opportunities',
  'Find high intent communities',
  'Improve positioning',
  'Discover objections',
  'Build authority',
];

const smartTemplates = [
  {
    name: 'Product Launch',
    briefType: 'Product Brief',
    objective: 'Plan a marketing campaign',
    tone: 'Strategic',
  },
  {
    name: 'Competitor Analysis',
    briefType: 'Research Brief',
    objective: 'Research competitors',
    tone: 'Professional',
  },
  {
    name: 'Customer Feedback',
    briefType: 'Community Brief',
    objective: 'Understand customer feedback',
    tone: 'Clear and practical',
  },
  {
    name: 'Feature Requests',
    briefType: 'Product Brief',
    objective: 'Improve our product',
    tone: 'Technical',
  },
  {
    name: 'Executive Update',
    briefType: 'Executive Brief',
    objective: 'Prepare an executive update',
    tone: 'Executive',
  },
  {
    name: 'Content Strategy',
    briefType: 'Content Brief',
    objective: 'Create content',
    tone: 'Persuasive',
  },
  {
    name: 'AI Search Strategy',
    briefType: 'Strategy Brief',
    objective: 'Improve positioning',
    tone: 'Strategic',
  },
  {
    name: 'Marketing Campaign',
    briefType: 'Campaign Brief',
    objective: 'Plan a marketing campaign',
    tone: 'Persuasive',
  },
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
  tone: 'Strategic',
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
    ...brief.keyFindings.map((item) => '* ' + item),
    '',
    'Strategic Context',
    brief.strategicContext,
    '',
    'Recommended Actions',
    ...brief.recommendedActions.map((item) => '* ' + item),
    '',
    'Suggested Content / Assets',
    ...brief.suggestedContentAssets.map((item) => '* ' + item),
    '',
    'Risks or Watchouts',
    ...brief.risksOrWatchouts.map((item) => '* ' + item),
    '',
    'Next Steps',
    ...brief.nextSteps.map((item) => '* ' + item),
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
        <p>Upgrade to Discover to move from conversations you already have to Reddit first supported source discovery.</p>
        <Button href="/pricing?upgrade=discover" variant="orange">Upgrade to Discover</Button>
      </article>
    );
  }

  return (
    <article className="finding brief-upgrade-card">
      <h3>Turn this free brief into deeper Community Intelligence.</h3>
      <p>Choose Analyse to bring your own conversations for AI powered intelligence, or Discover for Reddit first supported source discovery.</p>
      <div className="button-row">
        <Button href="/pricing?upgrade=analyse" variant="orange">Choose Analyse</Button>
        <Button href="/pricing?upgrade=discover" variant="secondary">Compare Discover</Button>
      </div>
    </article>
  );
}

function buildInitialForm(brand?: BrandProfile | null): BriefInput {
  if (!brand) return initialForm;

  return {
    ...initialForm,
    industry: brand.industry,
    audience: brand.idealCustomers,
    platformsToPrioritise: brand.preferredPlatforms.join(', '),
    sourceContext: [
      `Company: ${brand.companyName}`,
      brand.website ? `Website: ${brand.website}` : '',
      brand.companyDescription ? `Company description: ${brand.companyDescription}` : '',
      brand.idealCustomers ? `Ideal customers: ${brand.idealCustomers}` : '',
      brand.competitors ? `Competitors: ${brand.competitors}` : '',
      brand.keywords ? `Keywords: ${brand.keywords}` : '',
    ].filter(Boolean).join('\n'),
    researchGoals: brand.goals,
  };
}

function BrandContextCard({ brand }: { brand?: BrandProfile | null }) {
  if (!brand) return null;

  return (
    <article className="dashboard-card brand-context-card">
      <span className="dashboard-kicker">Brand Profile</span>
      <h2>{brand.companyName}</h2>
      <p>{brand.companyDescription || 'Action Centre will use your saved company context.'}</p>
      <Button href="/app/onboarding" variant="secondary">Edit Brand Profile</Button>
    </article>
  );
}

export function BriefsWorkspace({ subscriptionLabel, brand }: BriefsWorkspaceProps & { brand?: BrandProfile | null }) {
  const [form, setForm] = useState<BriefInput>(() => buildInitialForm(brand));
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

  function applyTemplate(templateName: string) {
    const template = smartTemplates.find((item) => item.name === templateName);
    if (!template) return;

    setForm((value) => ({
      ...value,
      briefType: template.briefType,
      objective: template.objective,
      tone: template.tone,
    }));
  }

  return (
    <>
      <section className="hero">
        <div className="eyebrow">Action Centre</div>
        <div className="question">How should this intelligence become action?</div>
        <h1>Action Centre</h1>
        <p>Create action ready documents for marketing, product, leadership and content teams using your saved Brand Profile.</p>
      </section>

      <BrandContextCard brand={brand} />
      <section className="briefs-layout">
        <div className="panel briefs-form-panel">
          <div className="stack">
            <article className="brief-guidance-box">
              <h2>Briefs turn Community Intelligence into action ready documents.</h2>
              <p>Choose what you want to create, tell us what it is about, and we&apos;ll shape the insight into a clear business ready brief.</p>
            </article>

            <section className="smart-template-section">
              <span className="dashboard-kicker">Start with a smart template</span>
              <div className="smart-template-grid">
                {smartTemplates.map((template) => (
                  <button type="button" key={template.name} className="smart-template" onClick={() => applyTemplate(template.name)}>
                    <span>{template.name}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="field-grid">
              <label>Brief Type<select value={form.briefType} onChange={(event) => setForm({ ...form, briefType: event.target.value })}>{briefTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>
                What is this about?
                <span className="field-helper">What conversation, insight or business issue are you exploring?</span>
                <input
                  value={form.topic}
                  onChange={(event) => setForm({ ...form, topic: event.target.value })}
                  placeholder="Reddit discussions about our onboarding process"
                  list="brief-topic-examples"
                />
                <datalist id="brief-topic-examples">
                  <option value="Reddit discussions about our onboarding process" />
                  <option value="Customer complaints about pricing" />
                  <option value="Feature requests from YouTube comments" />
                  <option value="Competitor sentiment in online communities" />
                </datalist>
              </label>
              <label>What should this brief help you achieve?<select value={form.objective} onChange={(event) => setForm({ ...form, objective: event.target.value })}><option value="">Select an outcome</option>{objectives.map((objective) => <option key={objective}>{objective}</option>)}</select></label>
              <label>Writing Style<select value={form.tone} onChange={(event) => setForm({ ...form, tone: event.target.value })}>{writingStyles.map((style) => <option key={style}>{style}</option>)}</select></label>
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
              <Button variant="secondary" onClick={() => { setForm(buildInitialForm(brand)); setBrief(null); setNotice(''); setError(''); }}>Reset Brief</Button>
            </div>
          </div>
        </div>

        <aside className="dashboard-card briefs-guidance">
          <span className="dashboard-kicker">Coming next</span>
          <h2>From reports to briefs</h2>
          <p>Later, Analyse and Discover reports will be sent directly into Action Centre so teams can turn intelligence into launch plans, content plans and leadership updates.</p>
        </aside>
      </section>

      {loading ? <section className="loading active"><div>Reading source context...</div><div>Structuring action ready sections...</div><div>Generating brief...</div></section> : null}

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
