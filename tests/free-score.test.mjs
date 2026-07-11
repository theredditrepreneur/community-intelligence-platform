import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

test('methodology is versioned and deterministic scoring is not delegated to an AI prompt', () => {
  const source = readFileSync(new URL('../lib/free-score/methodology.ts', import.meta.url), 'utf8');
  assert.match(source, /community-score-v1/);
  assert.match(source, /calculateCommunityScore/);
  assert.doesNotMatch(source, /OpenAI/);
});

test('migration enforces owner RLS and score boundaries', () => {
  const source = readFileSync(new URL('../supabase/migrations/202607110001_free_community_score.sql', import.meta.url), 'utf8');
  assert.match(source, /auth\.uid\(\) = user_id/);
  assert.match(source, /between 0 and 20/);
  assert.match(source, /community-score-jobs/);
});

test('fixture provider is visibly nonproduction', () => {
  const source = readFileSync(new URL('../lib/free-score/providers.ts', import.meta.url), 'utf8');
  assert.match(source, /demonstration: true/);
  assert.match(source, /example\.invalid/);
});
