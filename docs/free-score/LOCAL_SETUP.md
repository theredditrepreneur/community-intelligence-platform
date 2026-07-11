# Free Score Local Setup

1. Copy `.env.example` to the local environment and leave live data, jobs, email, PostHog and Turnstile disabled.
2. Set long random local values for both HMAC secrets.
3. Run the migration in `supabase/migrations/202607110001_free_community_score.sql` against a nonproduction Supabase project if testing claim and history.
4. Run `npm install`, `npm run dev`, then open `/free-score` or `/free-score/embed`.
5. Fixture results must show the demonstration banner. Do not use them as company findings.
6. Run `npm test`, `npm run typecheck`, `npm run lint` and `npm run build`.

Without Supabase configuration the public demonstration works, but authenticated claiming and history intentionally report that persistence is unavailable.
