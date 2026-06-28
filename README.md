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

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Output directory: leave blank for Next.js.

## Clerk Authentication

The public pricing page is available at `/pricing`. The product workspaces under `/app` are protected by Clerk.

Add these environment variables locally and in Vercel:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/analyse
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/analyse
```

This project is intended to link to Clerk application `app_3Fjk6KeOj8K8GCm2em3Ket5aza4`.

Recommended local Clerk CLI setup:

```bash
command -v clerk && clerk --version
clerk update --yes
clerk auth login
clerk init --app app_3Fjk6KeOj8K8GCm2em3Ket5aza4
clerk doctor
```

Stripe subscriptions are now wired for Analyse and Discover. Alerts remains waitlist only. No database or real monitoring has been added yet.

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

Analyse and Discover use Stripe Checkout subscriptions. Clerk is used for authentication only.

Stripe Price IDs:

- Analyse: `price_1Tn7IjKEEIC0xE464vV7wRrN`
- Discover: `price_1Tn7JNKEEIC0xE46YYhQob2c`

### Vercel environment variables

Add these in Vercel Project Settings under Environment Variables:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/analyse
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/analyse
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
