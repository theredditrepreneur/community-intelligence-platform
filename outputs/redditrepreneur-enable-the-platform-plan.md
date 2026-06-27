# The Redditrepreneur Community Intelligence Platform - Enablement Plan

## Objective
Move from prototype to a paid SaaS product with three distinct paid tiers:

- Analyse: understanding conversations users already have.
- Discover: researching conversations users should know about.
- Alerts: decision-making through continuous monitoring and proactive briefs.

The key product rule: each tier must unlock a different job, not just more volume.

## Recommended Launch Architecture

### Frontend
Use the current prototype as the product direction, then rebuild as a real app in Next.js or another modern web framework.

Core frontend areas:
- Public marketing site
- Authenticated app shell
- Analyse workspace
- Discover onboarding and report workspace
- Alerts setup and monitoring workspace
- Reports library
- Billing/account settings

### Backend
Use a backend that supports authentication, database storage, scheduled jobs and secure API keys.

Recommended practical stack:
- Auth: Clerk, Supabase Auth or Auth0
- Payments: Stripe subscriptions
- Database: Postgres, ideally Supabase or Neon
- File/report storage: Supabase Storage, S3 or Cloudflare R2
- Background jobs: Inngest, Trigger.dev, Temporal or queue workers
- Email: Resend, Postmark or SendGrid
- AI: OpenAI API behind your backend only

Never expose OpenAI keys in the browser.

## Accounts

### Required User Objects
- User
- Workspace / Company
- Team membership
- Subscription
- Usage limits
- Saved reports
- Sources
- Watchlists
- Alert configurations

### Account Flow
1. User signs up.
2. User creates or joins a workspace.
3. User selects a plan.
4. User completes onboarding for the selected tier.
5. User lands in the relevant workspace.

### Workspace Fields
- Company name
- Website
- Description
- Ideal customers
- Competitors
- Keywords
- Preferred platforms
- Time zone
- Delivery email

## Payments

### Stripe Products
Create three subscription products:

Analyse
- Monthly subscription
- Allows analysis of conversations supplied by user
- No discovery or monitoring access

Discover
- Monthly subscription
- Includes Analyse capabilities
- Unlocks discovery workflows and weekly executive reports

Alerts
- Monthly subscription
- Includes Discover capabilities
- Unlocks continuous monitoring, alerts, daily brief and Action Centre

### Billing Logic
Store subscription state in your database via Stripe webhooks.

Important webhook events:
- checkout.session.completed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
- invoice.payment_succeeded

### Access States
- Trialing
- Active
- Past due
- Cancelled
- Free / no subscription

If payment fails, keep reports readable but pause new generations and monitoring.

## Tier Permissions

### Analyse Permissions
Can:
- Add conversations and URLs manually
- Generate analysis
- Save reports
- Export PDF
- Search previous reports

Cannot:
- Discover conversations automatically
- Create monitoring jobs
- Receive alerts
- Access trend timelines or historical movement

### Discover Permissions
Can:
- Use everything in Analyse
- Create discovery projects
- Search supported platforms
- Rank discovered conversations
- Generate weekly executive reports
- Access market, trend and AI Search intelligence

Cannot:
- Run continuous monitoring
- Receive daily alerts
- Use Action Centre automation
- Track historical movement continuously

### Alerts Permissions
Can:
- Use everything in Discover
- Launch continuous monitoring
- Receive daily / scheduled briefs
- Receive alert triggers
- Use Action Centre
- Access historical intelligence
- Track changes over time

## OpenAI / API Usage

### API Principle
All AI calls should happen server-side.

The browser sends:
- User-provided conversations
- URLs
- Business context
- Selected platforms
- Report type requested

The backend sends prompts to OpenAI and returns structured JSON to the frontend.

### Suggested AI Outputs
Use structured outputs for consistency.

Analyse output schema:
- executive_summary
- community_intelligence_score
- pain_points
- repeated_questions
- buying_intent
- community_intent
- emotional_state
- competitor_mentions
- ai_search_opportunities
- content_opportunities
- business_impact
- recommended_actions
- evidence
- confidence_score

Discover output schema:
- everything from Analyse
- discovered_sources
- top_10_conversations
- search_intelligence
- trend_detection
- market_intelligence
- ai_search_intelligence
- opportunity_ranking
- weekly_executive_report

Alerts output schema:
- daily_brief
- top_changes
- top_risks
- top_opportunities
- priority_actions
- competitor_intelligence
- ai_search_radar
- trend_timeline
- action_centre
- historical_intelligence

### Model Usage Pattern
Use a cheaper/faster model for extraction and classification.
Use a stronger reasoning/writing model for executive synthesis and final reports.

Example pipeline:
1. Extract source text.
2. Classify intent, sentiment, competitors, topics and questions.
3. Cluster repeated themes.
4. Score commercial relevance.
5. Generate executive report.
6. Store structured output and rendered report.

## Data Collection

### Analyse Data Collection
User provides:
- Pasted text
- Source URL
- Source type
- Optional source label

The platform does not need to fetch external data for Analyse at launch.

### Discover Data Collection
Start with semi-automated discovery before full automation.

MVP options:
- User enters keywords, competitors and platforms.
- Backend uses approved search APIs or scraping providers.
- Results are collected, filtered and analysed.
- User receives ranked opportunities.

Potential data sources:
- Reddit API or third-party Reddit data provider
- YouTube Data API
- Search API providers
- Review platforms where access is permitted
- G2/Trustpilot via approved methods or manual/import workflows
- Forum discovery through search APIs

Avoid brittle scraping as the core business dependency.

### Alerts Data Collection
Alerts require scheduled monitoring jobs.

Core loop:
1. Load workspace watchlist.
2. Search/fetch new conversations on schedule.
3. Deduplicate sources.
4. Compare against historical baseline.
5. Detect meaningful change.
6. Generate brief or alert.
7. Deliver by email/dashboard.

## Report Storage

### Tables
Suggested core tables:

users
- id
- email
- name
- created_at

workspaces
- id
- name
- website
- description
- ideal_customers
- created_at

memberships
- user_id
- workspace_id
- role

subscriptions
- workspace_id
- stripe_customer_id
- stripe_subscription_id
- plan
- status
- current_period_end

sources
- id
- workspace_id
- source_type
- url
- label
- raw_text
- fetched_at
- created_at

reports
- id
- workspace_id
- type: analyse/discover/alert/weekly/monthly
- title
- summary
- structured_json
- pdf_url
- created_at

watchlists
- id
- workspace_id
- competitors
- keywords
- platforms

alert_configs
- id
- workspace_id
- delivery_email
- schedule
- delivery_time
- timezone
- sensitivity
- alert_types
- active

monitoring_runs
- id
- workspace_id
- status
- started_at
- completed_at
- sources_found
- changes_detected

trend_snapshots
- id
- workspace_id
- topic
- metric
- value
- captured_at

### Report Library
Users should be able to:
- Search reports
- Filter by tier/workflow
- Filter by competitor, topic, platform or date
- Export PDF
- Re-run analysis
- Save/share report

## Onboarding Flow

### New User Onboarding
1. Create account
2. Create workspace
3. Choose plan
4. Add business context
5. Start first workflow

### Analyse Onboarding
Prompt:
“Paste your first conversation or URL.”

Then show:
- Generate Intelligence
- Save Report
- Export PDF

### Discover Onboarding
Step 1: About your business
Step 2: Competitors and keywords
Step 3: Platforms
Step 4: Search depth and timeframe
Step 5: Discover Community Intelligence

### Alerts Onboarding
Step 1: About your business
Step 2: Watchlist
Step 3: Sources to monitor
Step 4: Alert types
Step 5: Briefing schedule
Step 6: Launch Alerts

After launch:
- Show Monitoring Active
- Show next brief time
- Show alert health
- Show first preview brief

## MVP Build Order

### Phase 1: Paid Analyse
Goal: start charging quickly.

Build:
- Auth
- Stripe subscriptions
- Analyse app
- Manual conversation paste and URL input
- OpenAI analysis generation
- Save report
- Report library
- PDF export
- Usage limits if needed

This proves people will pay for understanding.

### Phase 2: Discover
Build:
- Discovery onboarding
- Search/data collection pipeline
- Source ranking
- Weekly executive report
- AI Search Intelligence
- Opportunity ranking

This proves people will pay for research.

### Phase 3: Alerts
Build:
- Alert configuration
- Scheduled monitoring
- Change detection
- Daily brief generation
- Email delivery
- Dashboard alert feed
- Action Centre
- Historical trend snapshots

This proves people will pay for decision-making.

## Practical Recommendation
Do not try to fully automate all three tiers at once.

Best path:
1. Launch Analyse with real OpenAI analysis and payments.
2. Run Discover partly manually behind the scenes while building automation.
3. Run Alerts as a concierge/premium pilot for the first customers.
4. Automate the repeated parts once you know which insights customers value most.

## What To Build Next

Immediate next step:
Create the production app foundation.

Required pieces:
- Authenticated app shell
- Stripe checkout
- Subscription-aware access control
- Database schema
- Analyse API endpoint
- OpenAI structured report generation
- Report save/search/export

Once that works, Discover and Alerts can build on the same report engine.
