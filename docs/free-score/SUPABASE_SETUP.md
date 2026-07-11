# Supabase Capability Checklist

- Apply the migration to a nonproduction project first.
- Confirm Postgres version supports `pgmq`, then enable Supabase Queues.
- Confirm the `community-score-jobs` basic durable queue exists.
- Keep queue functions inaccessible to `anon` and `authenticated`; only the service role/worker consumes them.
- Enable Cron and schedule a private worker invocation with `Authorization: Bearer <SUPABASE_WORKER_SECRET>`.
- Schedule the retention endpoint daily with the same authentication.
- Deploy a bounded worker as a Supabase Edge Function or invoke the repository worker contract from a private Supabase function.
- Verify RLS using two users before enabling saved scorecards.
- Confirm backups, logs and project region meet the privacy policy.
- Leave `FREE_SCORE_JOBS_ENABLED` and `FREE_SCORE_WORKER_ENABLED` false until queue, cron and recovery tests pass.

Fallback if Queues is unavailable: use `community_score_jobs` with `FOR UPDATE SKIP LOCKED` from the scheduled Supabase worker. No second paid queue provider is required.
