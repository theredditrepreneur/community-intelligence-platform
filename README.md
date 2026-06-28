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

Analyse and Discover use Stripe Checkout subscriptions. Alerts is waitlist only and does not use Stripe yet.

### Create products and prices

In Stripe Dashboard, create two subscription products:

1. Analyse at £29 per month
2. Discover at £99 per month

Copy each recurring Price ID. They usually look like `price_...`.

The current Stripe Price IDs are:

- Analyse: `price_1Tn4lyCnZ6SZ2vclmvqv9imG`
- Discover: `price_1Tn4nJCnZ6SZ2vclVlYiSFeK`

### Environment variables

Add these locally in `.env.local` and in Vercel Project Settings under Environment Variables:

```bash
STRIPE_SECRET_KEY=sk_test_or_live_key_from_stripe
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_webhook
NEXT_PUBLIC_STRIPE_ANALYSE_PRICE_ID=price_1Tn4lyCnZ6SZ2vclmvqv9imG
NEXT_PUBLIC_STRIPE_DISCOVER_PRICE_ID=price_1Tn4nJCnZ6SZ2vclVlYiSFeK
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Use your deployed URL for `NEXT_PUBLIC_APP_URL`, for example `https://your-domain.com`.

Do not commit `.env.local` to GitHub.

### Webhook

Create a Stripe webhook endpoint for:

```text
https://your-domain.com/api/stripe/webhook
```

Listen for these events:

```text
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
```

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

### Test checkout

1. Sign in to the app.
2. Visit `/pricing`.
3. Click Launch Analyse or Launch Discover.
4. Use Stripe test card `4242 4242 4242 4242` with any future expiry date and any CVC.
5. After checkout, Stripe redirects to `/checkout/success`.
6. The webhook updates Clerk private metadata with the active subscription plan.

### Vercel environment variables

Before deploying, add these values in Vercel Project Settings, Environment Variables:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_ANALYSE_PRICE_ID=price_1Tn4lyCnZ6SZ2vclmvqv9imG
NEXT_PUBLIC_STRIPE_DISCOVER_PRICE_ID=price_1Tn4nJCnZ6SZ2vclVlYiSFeK
NEXT_PUBLIC_APP_URL=https://your-production-domain
```

Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` secret. Do not expose them in client code or commit them to GitHub.

### Deploy

After adding environment variables in Vercel, push the code to GitHub. Vercel will install dependencies and build the app. If environment variables are missing, checkout and billing portal routes will fail at runtime, but the build should still complete.

### Pending checkout recovery

Pricing buttons use `/checkout/start?plan=analyse` and `/checkout/start?plan=discover`. This stores the intended plan in a short-lived HTTP-only cookie before Clerk sign-up. If Clerk redirects a new user into the app after sign-up, the app resumes the pending checkout and sends them to Stripe.

### Checkout flow

Pricing cards call `POST /api/stripe/checkout` with `{ "plan": "analyse" }` or `{ "plan": "discover" }`. The API route creates the Stripe Checkout Session server-side and returns `session.url`, then the browser redirects to Stripe. Signed-out users are sent through Clerk sign-up and resume checkout at `/checkout/analyse` or `/checkout/discover`.
