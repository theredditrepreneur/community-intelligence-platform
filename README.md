# The Redditrepreneur Community Intelligence Platform

A Vercel ready Next.js structure for the public pricing page and the app workspaces.

## Routes

- `/` redirects to `/pricing`
- `/pricing` public pricing page
- `/app` redirects to `/app/analyse`
- `/app/analyse` Analyse workspace
- `/app/discover` Discover workspace
- `/app/alerts` Alerts waitlist and configuration preview

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
```

## OpenAI Intelligence

Analyse and Discover use server-side OpenAI routes for Community Intelligence output. Add these environment variables locally and in Vercel:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

Do not expose `OPENAI_API_KEY` in client-side code or `NEXT_PUBLIC_` variables.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Output directory: leave blank for Next.js.

## Supabase Authentication

The public pricing page is available at `/pricing`. The product workspaces under `/app` are protected by Supabase Auth.

Add these environment variables locally and in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Apply `supabase/schema.sql` in Supabase SQL Editor to create the `profiles` table used by Stripe subscription access checks.

Stripe subscriptions are wired for Analyse and Discover. Alerts remains waitlist only. No real monitoring has been added yet.

## Fixing Vercel 404

If Vercel shows `404: NOT_FOUND`, check these settings:

1. Deploy the repository root that contains `package.json`, `app/`, `components/`, `lib/` and `vercel.json`.
2. In Vercel Project Settings, set Framework Preset to `Next.js`.
3. Leave Output Directory blank.
4. Use Build Command `npm run build`.
5. Use Install Command `npm install`.
6. Visit `/pricing` after deployment. The root `/` redirects to `/pricing`.

If you deploy only the static `outputs` folder instead of the Next.js app, use `outputs/index.html` as the landing file. The Next.js routes will not exist in that static-only deployment.

## Stripe Subscriptions

Analyse and Discover use Stripe Checkout subscriptions. Supabase Auth is used for authentication, and Stripe subscription state is stored in the Supabase `profiles` table.

Stripe Price IDs:

- Analyse: `price_1Tn7IjKEEIC0xE464vV7wRrN`
- Discover: `price_1Tn7JNKEEIC0xE46YYhQob2c`

### Vercel environment variables

Add these in Vercel Project Settings under Environment Variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY
OPENAI_MODEL=gpt-4.1-mini
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_ANALYSE_PRICE_ID=price_1Tn7IjKEEIC0xE464vV7wRrN
NEXT_PUBLIC_STRIPE_DISCOVER_PRICE_ID=price_1Tn7JNKEEIC0xE46YYhQob2c
NEXT_PUBLIC_APP_URL=https://your-production-domain
```

### Webhook

Create a Stripe webhook endpoint at:

```text
https://your-production-domain/api/stripe/webhook
```

Listen for:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### Checkout flow

Pricing cards call `POST /api/stripe/checkout` with `analyse` or `discover`. The API creates the Stripe Checkout Session server-side and returns `session.url`.

- Analyse subscribers can access `/app/analyse`.
- Discover subscribers can access `/app/analyse` and `/app/discover`.
- Alerts remains visible but unavailable.
