import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getCurrentSubscription, hasPlanAccess } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getPlanLabel(plan?: string) {
  if (plan === 'discover') return 'Discover';
  if (plan === 'analyse') return 'Analyse';
  return 'Free';
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const subscription = await getCurrentSubscription();
  const planLabel = getPlanLabel(subscription.subscriptionPlan);
  const canAnalyse = hasPlanAccess(subscription, 'analyse');
  const canDiscover = hasPlanAccess(subscription, 'discover');
  const nextStep = canDiscover
    ? 'Start by entering your brand, competitors and keywords into Discover.'
    : canAnalyse
      ? 'Start by pasting a Reddit thread, YouTube comments, review set or forum conversation into Analyse.'
      : 'Start with a free brief, then upgrade when you want Analyse or Discover intelligence.';

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1>Good morning.</h1>
          <p>Here&apos;s your Community Intelligence workspace.</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card subscription-card">
          <div>
            <span className="dashboard-kicker">Subscription Status</span>
            <h2>Current plan: {planLabel}</h2>
            <p>Access level: {canDiscover ? 'Analyse, Discover and Briefs workspaces' : canAnalyse ? 'Analyse and Briefs workspaces' : 'Briefs workspace'}</p>
          </div>
          {planLabel === 'Free' ? (
            <a className="btn btn-primary" href="/pricing">View plans</a>
          ) : (
            <a className="btn btn-primary" href="/api/stripe/portal">Manage billing</a>
          )}
        </article>

        <article className="dashboard-card next-step-card">
          <span className="dashboard-kicker">Recommended Next Step</span>
          <p>{nextStep}</p>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-head">
          <span className="dashboard-kicker">Quick Actions</span>
          <h2>Move from signal to decision.</h2>
        </div>
        <div className="quick-action-grid">
          <article className="dashboard-card quick-action-card">
            <h3>Analyse conversations</h3>
            <p>Understand conversations you already have.</p>
            {canAnalyse ? (
              <Button href="/app/analyse">Open Analyse</Button>
            ) : (
              <Button href="/pricing?upgrade=analyse" variant="secondary">Upgrade to Analyse</Button>
            )}
          </article>
          <article className="dashboard-card quick-action-card">
            <h3>Discover opportunities</h3>
            <p>Find community conversations that matter.</p>
            {canDiscover ? (
              <Button href="/app/discover" variant="orange">Open Discover</Button>
            ) : (
              <Button href="/pricing?upgrade=discover" variant="secondary">Upgrade to Discover</Button>
            )}
          </article>
          <article className="dashboard-card quick-action-card">
            <h3>Briefs</h3>
            <p>Turn Community Intelligence into action-ready documents.</p>
            <Button href="/app/briefs" variant="secondary">Open Briefs</Button>
          </article>
          <article className="dashboard-card quick-action-card">
            <div className="card-title-row">
              <h3>Alerts</h3>
              <Badge>Coming Soon</Badge>
            </div>
            <p>Continuous Community Intelligence monitoring.</p>
            <Button href="/app/alerts" variant="secondary">Join waitlist</Button>
          </article>
        </div>
      </section>

      <section className="dashboard-section two-column-dashboard">
        <article className="dashboard-card briefs-card">
          <span className="dashboard-kicker">Recent Intelligence Briefs</span>
          <h2>No saved briefs yet.</h2>
          <p>Your generated Community Intelligence Briefs will appear here.</p>
        </article>

        <article className="dashboard-card snapshot-card">
          <span className="dashboard-kicker">Community Intelligence Snapshot</span>
          <div className="snapshot-grid">
            <div><strong>0</strong><span>Briefs generated</span></div>
            <div><strong>0</strong><span>Opportunities found</span></div>
            <div><strong>0</strong><span>Competitors tracked</span></div>
            <div><strong>0</strong><span>AI Search opportunities</span></div>
          </div>
        </article>
      </section>
    </>
  );
}
