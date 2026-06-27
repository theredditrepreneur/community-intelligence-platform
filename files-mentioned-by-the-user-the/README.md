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
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Vercel Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js settings.
4. Build command: `pnpm build`.
5. Install command: `pnpm install`.
6. Output directory: leave blank for Next.js.

No Stripe, authentication, database or real monitoring has been added yet. This is purely the organised app structure for the public launch page and SaaS workspace routes.
