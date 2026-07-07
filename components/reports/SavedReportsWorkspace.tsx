'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ActionBrief } from '@/lib/ai/community-intelligence';

type SavedBrief = ActionBrief & {
  savedAt: string;
};

function FieldList({ items }: { items: string[] }) {
  if (!items.length) return <p>No items generated for this section.</p>;

  return <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

export function SavedReportsWorkspace() {
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);
  const [selectedBrief, setSelectedBrief] = useState<SavedBrief | null>(null);

  useEffect(() => {
    const items = JSON.parse(window.localStorage.getItem('redditrepreneur_saved_briefs') || '[]') as SavedBrief[];
    setSavedBriefs(items);
    setSelectedBrief(items[0] || null);
  }, []);

  function clearSavedBriefs() {
    window.localStorage.removeItem('redditrepreneur_saved_briefs');
    setSavedBriefs([]);
    setSelectedBrief(null);
  }

  if (!savedBriefs.length) {
    return (
      <section className="empty-state panel">
        <h2>No saved briefs yet.</h2>
        <p>Turn a Community Intelligence Assessment into an Executive Brief, Marketing Strategy or Product Brief, then save it here.</p>
        <div className="button-row">
          <Button href="/app/analyse" variant="secondary">Analyse conversations</Button>
          <Button href="/app/discover" variant="orange">Discover opportunities</Button>
          <Button href="/app/briefs" variant="secondary">Create Brief</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="reports-layout">
      <aside className="dashboard-card reports-list">
        <div className="reports-list-head">
          <span className="dashboard-kicker">Saved Briefs</span>
          <button type="button" onClick={clearSavedBriefs}>Clear</button>
        </div>
        {savedBriefs.map((brief) => (
          <button
            type="button"
            key={brief.savedAt + brief.briefTitle}
            className={selectedBrief?.savedAt === brief.savedAt ? 'saved-report active' : 'saved-report'}
            onClick={() => setSelectedBrief(brief)}
          >
            <strong>{brief.briefTitle}</strong>
            <span>{new Date(brief.savedAt).toLocaleString()}</span>
          </button>
        ))}
      </aside>

      {selectedBrief ? (
        <section className="findings ai-results reports-preview">
          <div className="eyebrow">Saved Brief</div>
          <article className="finding featured-finding">
            <h3>{selectedBrief.briefTitle}</h3>
            <p>{selectedBrief.executiveSummary}</p>
          </article>
          <article className="finding"><h3>Key Findings</h3><FieldList items={selectedBrief.keyFindings} /></article>
          <article className="finding"><h3>Strategic Context</h3><p>{selectedBrief.strategicContext}</p></article>
          <article className="finding"><h3>Recommended Actions</h3><FieldList items={selectedBrief.recommendedActions} /></article>
          <article className="finding"><h3>Suggested Content and Assets</h3><FieldList items={selectedBrief.suggestedContentAssets} /></article>
          <article className="finding"><h3>Risks or Watchouts</h3><FieldList items={selectedBrief.risksOrWatchouts} /></article>
          <article className="finding"><h3>Next Steps</h3><FieldList items={selectedBrief.nextSteps} /></article>
        </section>
      ) : null}
    </section>
  );
}
