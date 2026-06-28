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

## Clerk Billing

Analyse and Discover now use Clerk Billing instead of custom Stripe Checkout routes.

Plan IDs:

- Analyse: `cplan_3Fk4IrOj7iuX7UmUb7xq4G4Y4hd`
- Discover: `cplan_3Fk4cNt8B4mcoYPxl0BiWMY08Al`

The public pricing page renders the existing launch positioning cards and a Clerk `<PricingTable />` section. Clerk handles signup, checkout, subscription state and account billing.

### Vercel environment variables

Add these in Vercel Project Settings under Environment Variables:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/app/analyse
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/app/analyse
```

No Stripe secret keys are required in the app when using Clerk Billing. Stripe is connected inside the Clerk Dashboard.

### Access control

The app uses Clerk Billing plan checks with `auth().has({ plan })`.

- Analyse subscribers can access `/app/analyse`.
- Discover subscribers can access `/app/analyse` and `/app/discover`.
- Alerts remains visible but unavailable.

If access does not unlock, confirm the Clerk plan slug is `analyse` for Analyse and `discover` for Discover, or update `lib/config/clerk-billing.ts` with the correct slugs.
