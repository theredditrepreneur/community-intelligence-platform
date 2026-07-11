# Rollback

1. Set `FREE_SCORE_ENABLED=false`, leave all integration flags false and redeploy the prior application build.
2. Remove navigation links if a code rollback is required; existing Analyse, Discover and Stripe subscription tables are unaffected.
3. Stop Supabase worker and cleanup Cron schedules before reverting worker code.
4. Preserve scorecard tables during an application rollback so user data is not lost. Export or delete only under the approved retention/deletion process.
5. The additive migration can be rolled back later by dropping free-score policies, functions, queue and tables in dependency order. Do not drop them during an incident unless data deletion is explicitly approved.
