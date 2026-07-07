import { redirect } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getCurrentBrandProfile } from '@/lib/brands';
import { getCurrentSubscription, hasAdminAccess, hasPlanAccess } from '@/lib/subscription';
import { getCurrentUser } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getPlanLabel(plan?: string) {
  if (plan === 'discover') return 'Discover';
  if (plan === 'analyse') return 'Analyse';
  return 'Free';
}

const decisionPriorities = [
  {
    priority: 'High',
    title: 'Update your pricing comparison page',
    why: 'Community conversations show repeated confusion around competitor pricing, setup complexity and what buyers actually get at each tier.',
    evidence: '42 pricing-related mentions across Reddit, reviews and comparison conversations.',
    impact: 'High impact. Improves buyer confidence and supports AI search visibility.',
    confidence: 91,
    owner: 'Marketing',
    cta: 'View Brief',
    href: '/app/briefs',
  },
  {
    priority: 'High',
    title: 'Create a competitor objection brief',
    why: 'Prospects are naming alternatives before they understand your category position, which means the buying narrative needs clearer proof.',
    evidence: 'Competitor mentions cluster around onboarding effort, hidden costs and support responsiveness.',
    impact: 'High impact. Helps sales, landing pages and AI summaries answer objections earlier.',
    confidence: 88,
    owner: 'Sales',
    cta: 'Turn Into Content',
    href: '/app/briefs',
  },
  {
    priority: 'Medium',
    title: 'Prioritise onboarding friction in the product roadmap',
    why: 'Setup questions are appearing before feature questions, suggesting adoption risk is more urgent than adding more capability.',
    evidence: 'Recurring phrases include setup time, learning curve, migration and team handover.',
    impact: 'Medium impact. Reduces activation friction and improves trial to paid conversion.',
    confidence: 82,
    owner: 'Product',
    cta: 'Add to Roadmap',
    href: '/app/discover',
  },
  {
    priority: 'Medium',
    title: 'Publish a plain English category guide',
    why: 'Communities are asking basic category questions that your product can credibly answer before competitors shape the conversation.',
    evidence: 'Discovery style searches show repeated questions about use cases, ROI and who should own the workflow.',
    impact: 'Medium impact. Increases trust, captures educational demand and improves AI search coverage.',
    confidence: 79,
    owner: 'Leadership',
    cta: 'Turn Into Content',
    href: '/app/briefs',
  },
  {
    priority: 'Low',
    title: 'Review support language for setup questions',
    why: 'Support and community language can be tightened so buyers hear the same reassurance before and after sign up.',
    evidence: 'Setup and handover concerns appear in lower volume but repeated community questions.',
    impact: 'Low impact. Improves consistency and reduces avoidable support friction.',
    confidence: 73,
    owner: 'Support',
    cta: 'Mark as Done',
    href: '/app/dashboard',
  },
];

function priorityTone(priority: string) {
  if (priority === 'High') return 'high';
  if (priority === 'Medium') return 'medium';
  return 'low';
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const subscription = await getCurrentSubscription();
  const isAdmin = hasAdminAccess(subscription);
  const planLabel = isAdmin ? 'Admin' : getPlanLabel(subscription.subscriptionPlan);
  const canAnalyse = hasPlanAccess(subscription, 'analyse');
  const canDiscover = hasPlanAccess(subscription, 'discover');
  const brand = await getCurrentBrandProfile();

  if ((canAnalyse || canDiscover || isAdmin) && !brand) {
    redirect('/app/onboarding');
  }

  const nextStep = canDiscover
    ? 'Start by discovering the community conversations that matter most.'
    : canAnalyse
      ? 'Start by pasting a Reddit thread, YouTube comments, review set or forum conversation into Analyse.'
      : 'Start with a free brief, then upgrade when you want Analyse or Discover intelligence.';

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1>Good morning, {brand?.companyName || 'Founder'}.</h1>
          <p>{brand ? `${brand.companyName} is ready for Community Intelligence.` : 'Create your Brand Profile so every Assessment can be personalised.'}</p>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span className="dashboard-kicker">Brand Profile</span>
          <h2>{brand?.companyName || 'No Brand Profile yet'}</h2>
          <p>{brand?.companyDescription || 'Add your company context once so Dashboard, Analyse, Discover and Action Centre can reuse it.'}</p>
          <Button href="/app/onboarding" variant="secondary">{brand ? 'Edit Brand Profile' : 'Create Brand Profile'}</Button>
        </article>

        <article className="dashboard-card subscription-card">
          <div>
            <span className="dashboard-kicker">Subscription Status</span>
            <h2>Current plan: {planLabel}</h2>
            <p>Access level: {isAdmin ? 'All paid features and admin testing' : canDiscover ? 'Analyse, Discover and Briefs workspaces' : canAnalyse ? 'Analyse and Briefs workspaces' : 'Briefs workspace'}</p>
            {isAdmin ? <p className="helper">Admin access enabled.</p> : null}
          </div>
          {isAdmin ? (
            <a className="btn btn-primary" href="/app/billing">Open billing</a>
          ) : planLabel === 'Free' ? (
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

      <section className="dashboard-section decision-feed-section">
        <div className="dashboard-section-head decision-feed-head">
          <div>
            <span className="dashboard-kicker">Decision Feed</span>
            <h2>Today&apos;s Community Intelligence Priorities</h2>
            <p>Recommended actions based on your latest Assessments, Briefs and discovered opportunities.</p>
          </div>
        </div>

        <div className="decision-overview-grid">
          <article className="dashboard-card intelligence-score-card">
            <span className="dashboard-kicker">Community Health Score</span>
            <div className="score-row">
              <strong>84</strong>
              <span>/100</span>
            </div>
            <div className="status-row">
              <Badge tone="green">Strong</Badge>
              <span className="movement up">Up</span>
            </div>
            <p>Community sentiment is strong, but pricing clarity and onboarding proof are the highest leverage improvements.</p>
          </article>

          <article className="dashboard-card opportunity-score-card">
            <span className="dashboard-kicker">Opportunity Score</span>
            <div className="opportunity-grid">
              <div><strong>17</strong><span>Total opportunities found</span></div>
              <div><strong>Pricing</strong><span>Highest opportunity area</span></div>
              <div><strong>6</strong><span>AI Search opportunities</span></div>
              <div><strong>High</strong><span>Buying intent level</span></div>
            </div>
          </article>
        </div>

        <div className="decision-feed-grid">
          {decisionPriorities.map((item) => (
            <article className="dashboard-card decision-card" key={item.title}>
              <div className="decision-card-head">
                <span className={['priority-pill', priorityTone(item.priority)].join(' ')}>{item.priority} Priority</span>
                <span className="confidence-pill">{item.confidence}% confidence</span>
              </div>
              <h3>{item.title}</h3>
              <dl className="decision-detail-list">
                <div>
                  <dt>Why this matters</dt>
                  <dd>{item.why}</dd>
                </div>
                <div>
                  <dt>Evidence</dt>
                  <dd>{item.evidence}</dd>
                </div>
                <div>
                  <dt>Expected business impact</dt>
                  <dd>{item.impact}</dd>
                </div>
              </dl>
              <div className="decision-card-foot">
                <span>Owner: <strong>{item.owner}</strong></span>
                <Button href={item.href} variant={item.priority === 'High' ? 'orange' : 'secondary'}>{item.cta}</Button>
              </div>
            </article>
          ))}
        </div>

        <article className="dashboard-card ask-intelligence-card">
          <div>
            <span className="dashboard-kicker">Ask your Community Intelligence</span>
            <h3>Ask your Community Intelligence</h3>
            <p>Ask things like: What should I tell my CEO? What content should we create next? Which competitor is most vulnerable?</p>
          </div>
          <label>
            Intelligence question
            <textarea disabled placeholder={'Ask things like:\n"What should I tell my CEO?"\n"What content should we create next?"\n"Which competitor is most vulnerable?"'} />
          </label>
          <div className="coming-soon-panel">Interactive report chat coming soon.</div>
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
            <p>Understand conversations you already have using your saved Brand Profile.</p>
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
            <h3>Create Brief</h3>
            <p>Turn Community Intelligence into action ready documents.</p>
            <Button href="/app/briefs" variant="secondary">Open Action Centre</Button>
          </article>
          <article className="dashboard-card quick-action-card">
            <h3>View Reports</h3>
            <p>Review saved Action Centre Briefs as your library grows.</p>
            <Button href="/app/reports" variant="secondary">Open Library</Button>
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

      <section className="dashboard-section three-column-dashboard">
        <article className="dashboard-card briefs-card">
          <span className="dashboard-kicker">Latest Assessments</span>
          <h2>No Assessments yet.</h2>
          <p>Run your first Analyse or Discover to generate a Community Intelligence Assessment.</p>
          <div className="button-row">
            <Button href="/app/analyse" variant="secondary">Open Analyse</Button>
            <Button href="/app/discover" variant="orange">Open Discover</Button>
          </div>
        </article>

        <article className="dashboard-card briefs-card">
          <span className="dashboard-kicker">Recent Briefs</span>
          <h2>No saved Briefs yet.</h2>
          <p>Turn an Assessment into an Executive Brief, Marketing Strategy or Product Brief.</p>
        </article>

        <article className="dashboard-card snapshot-card">
          <span className="dashboard-kicker">Latest Activity</span>
          <div className="snapshot-grid">
            <div><strong>0</strong><span>Assessments completed</span></div>
            <div><strong>0</strong><span>Briefs saved</span></div>
            <div><strong>0</strong><span>Opportunities found</span></div>
            <div><strong>0</strong><span>AI Search opportunities</span></div>
          </div>
        </article>
      </section>
    </>
  );
}
