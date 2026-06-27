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

No Stripe, authentication, database or real monitoring has been added yet. This is the organised app structure for the public launch page and SaaS workspace routes.

## Fixing Vercel 404

If Vercel shows `404: NOT_FOUND`, check these settings:

1. Deploy the repository root that contains `package.json`, `app/`, `components/`, `lib/` and `vercel.json`.
2. In Vercel Project Settings, set Framework Preset to `Next.js`.
3. Leave Output Directory blank.
4. Use Build Command `npm run build`.
5. Use Install Command `npm install`.
6. Visit `/pricing` after deployment. The root `/` redirects to `/pricing`.

If you deploy only the static `outputs` folder instead of the Next.js app, use `outputs/index.html` as the landing file. The Next.js routes will not exist in that static-only deployment.
