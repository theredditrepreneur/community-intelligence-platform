export type FreeScoreJobProvider = 'supabase' | 'local';
export type FreeScoreDataProvider = 'fixture' | 'reddit-oauth';

function enabled(value: string | undefined, fallback = false) {
  if (value == null) return fallback;
  return value.toLowerCase() === 'true';
}

function positiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export const freeScoreServerConfig = {
  enabled: enabled(process.env.FREE_SCORE_ENABLED, true),
  liveDataEnabled: enabled(process.env.FREE_SCORE_LIVE_DATA_ENABLED),
  jobsEnabled: enabled(process.env.FREE_SCORE_JOBS_ENABLED),
  workerEnabled: enabled(process.env.FREE_SCORE_WORKER_ENABLED),
  emailEnabled: enabled(process.env.FREE_SCORE_EMAIL_ENABLED),
  jobProvider: (process.env.FREE_SCORE_JOB_PROVIDER || 'supabase') as FreeScoreJobProvider,
  dataProvider: (process.env.FREE_SCORE_DATA_PROVIDER || 'fixture') as FreeScoreDataProvider,
  methodologyVersion: process.env.COMMUNITY_SCORE_METHODOLOGY_VERSION || 'community-score-v1',
  windowDays: positiveInteger(process.env.COMMUNITY_SCORE_WINDOW_DAYS, 90),
  maxSearches: positiveInteger(process.env.COMMUNITY_SCORE_MAX_SEARCHES, 6),
  maxPosts: positiveInteger(process.env.COMMUNITY_SCORE_MAX_POSTS, 30),
  maxComments: positiveInteger(process.env.COMMUNITY_SCORE_MAX_COMMENTS, 60),
  maxAttempts: positiveInteger(process.env.COMMUNITY_SCORE_MAX_ATTEMPTS, 3),
  anonymousLimit: positiveInteger(process.env.COMMUNITY_SCORE_ANONYMOUS_LIMIT, 3),
  accountLimit: positiveInteger(process.env.COMMUNITY_SCORE_ACCOUNT_LIMIT, 5),
  cooldownHours: positiveInteger(process.env.COMMUNITY_SCORE_DOMAIN_COOLDOWN_HOURS, 24),
  auditAttributionMode: process.env.FREE_SCORE_AUDIT_ATTRIBUTION_MODE || 'click_only',
  retention: {
    anonymousJobHours: positiveInteger(process.env.RETENTION_ANONYMOUS_JOB_HOURS, 24),
    unclaimedScorecardDays: positiveInteger(process.env.RETENTION_UNCLAIMED_SCORECARD_DAYS, 7),
    sourceDataDays: positiveInteger(process.env.RETENTION_SOURCE_DATA_DAYS, 30),
    rateLimitIdDays: positiveInteger(process.env.RETENTION_RATE_LIMIT_ID_DAYS, 7),
    failedJobDays: positiveInteger(process.env.RETENTION_FAILED_JOB_DAYS, 14),
  },
} as const;

export const freeScorePublicConfig = {
  posthogEnabled: enabled(process.env.NEXT_PUBLIC_POSTHOG_ENABLED),
  turnstileEnabled: enabled(process.env.NEXT_PUBLIC_TURNSTILE_ENABLED),
};

export function assertSafeFreeScoreConfiguration() {
  if (freeScoreServerConfig.liveDataEnabled && freeScoreServerConfig.dataProvider === 'fixture') {
    throw new Error('Fixture data cannot be configured as live Community Intelligence data.');
  }
  if (freeScoreServerConfig.dataProvider === 'reddit-oauth' && !freeScoreServerConfig.liveDataEnabled) {
    throw new Error('Reddit OAuth provider requires FREE_SCORE_LIVE_DATA_ENABLED=true.');
  }
}
