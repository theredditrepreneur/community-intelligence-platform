import { createHmac, timingSafeEqual } from 'node:crypto';
import type { CommunityScorecardResult, ScoreRequest } from './types';

export const freeScoreCookie = 'redditrepreneur_free_score_result';
export type PendingFreeScore = { request: ScoreRequest & { normalizedDomain: string }; result: CommunityScorecardResult; createdAt: string; attribution?: Record<string, string> };

function secret() {
  const value = process.env.SCORECARD_TOKEN_HMAC_SECRET;
  if (value) return value;
  if (process.env.NODE_ENV === 'production') throw new Error('SCORECARD_TOKEN_HMAC_SECRET must be configured in production.');
  return 'local-development-only-free-score-secret';
}

export function sealPendingScore(value: PendingFreeScore) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function openPendingScore(value?: string): PendingFreeScore | null {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', secret()).update(payload).digest();
  const actual = Buffer.from(signature, 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString()) as PendingFreeScore;
  if (Date.now() - new Date(parsed.createdAt).getTime() > 7 * 86400000) return null;
  return parsed;
}
