create extension if not exists pgcrypto;

do $$ begin
  create type public.community_score_status as enum ('queued','searching','analysing','completed','insufficient_data','failed');
exception when duplicate_object then null; end $$;

create table if not exists public.community_scorecards (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  anonymous_token_hash text, company_name text not null, normalized_domain text not null, website_url text not null,
  industry text, primary_competitor text, status public.community_score_status not null default 'queued', demonstration boolean not null default false,
  overall_score smallint check (overall_score between 0 and 100), score_tier text, overall_confidence text not null default 'insufficient' check (overall_confidence in ('high','moderate','low','insufficient')),
  community_presence smallint check (community_presence between 0 and 20), community_trust smallint check (community_trust between 0 and 20),
  share_of_consensus smallint check (share_of_consensus between 0 and 20), insight_responsiveness smallint check (insight_responsiveness between 0 and 20),
  community_authority smallint check (community_authority between 0 and 20), dimension_results jsonb not null default '{}'::jsonb,
  conversation_count integer not null default 0 check (conversation_count >= 0), source_count integer not null default 0 check (source_count >= 0),
  community_count integer not null default 0 check (community_count >= 0), date_range_start timestamptz, date_range_end timestamptz,
  data_freshness_at timestamptz, findings jsonb not null default '{}'::jsonb, recommendations jsonb not null default '[]'::jsonb,
  share_of_consensus_result jsonb, source_metadata jsonb not null default '{}'::jsonb, methodology_version text not null,
  error_code text, error_summary text, claimed_at timestamptz, expires_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint completed_score_sum check (status not in ('completed') or overall_score = community_presence + community_trust + share_of_consensus + insight_responsiveness + community_authority),
  constraint claimed_has_owner check (claimed_at is null or user_id is not null)
);
create index if not exists community_scorecards_user_created_idx on public.community_scorecards(user_id, created_at desc);
create index if not exists community_scorecards_domain_created_idx on public.community_scorecards(normalized_domain, created_at desc);
create unique index if not exists community_scorecards_anonymous_token_idx on public.community_scorecards(anonymous_token_hash) where anonymous_token_hash is not null;

create table if not exists public.community_score_jobs (
  id uuid primary key default gen_random_uuid(), scorecard_id uuid not null references public.community_scorecards(id) on delete cascade,
  idempotency_key text not null unique, status public.community_score_status not null default 'queued', stage text not null default 'queued',
  attempt_count integer not null default 0, max_attempts integer not null default 3, progress smallint not null default 0 check (progress between 0 and 100),
  stage_deadline timestamptz, last_heartbeat_at timestamptz, next_attempt_at timestamptz, diagnostic_code text,
  completed_at timestamptz, failed_at timestamptz, payload_expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists community_score_jobs_recovery_idx on public.community_score_jobs(status, next_attempt_at, last_heartbeat_at);

create table if not exists public.community_score_evidence (
  id uuid primary key default gen_random_uuid(), scorecard_id uuid not null references public.community_scorecards(id) on delete cascade,
  provider text not null, external_id text not null, canonical_url text not null, community_name text, published_at timestamptz, retrieved_at timestamptz not null default now(),
  necessary_excerpt text check (char_length(necessary_excerpt) <= 1000), content_fingerprint text, evidence_type text,
  observed_signals jsonb not null default '{}'::jsonb, ai_interpretation jsonb not null default '{}'::jsonb, inferences jsonb not null default '{}'::jsonb,
  confidence text not null default 'insufficient', qualifies_for_consensus boolean not null default false, named_brands text[] not null default '{}',
  expires_at timestamptz not null default (now() + interval '30 days'), created_at timestamptz not null default now(),
  unique(scorecard_id, provider, external_id)
);

create table if not exists public.community_score_attribution (
  id uuid primary key default gen_random_uuid(), scorecard_id uuid not null unique references public.community_scorecards(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null, utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  referrer_host text, entry_mode text check (entry_mode in ('direct','embed','authenticated')), first_touch_at timestamptz not null default now(), last_touch_at timestamptz not null default now()
);

create table if not exists public.free_score_pending_conversions (
  id uuid primary key default gen_random_uuid(), scorecard_id uuid not null references public.community_scorecards(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null, conversion_type text not null default 'community_audit', status text not null default 'pending' check (status in ('pending','confirmed','expired','unmatched')),
  client_reference_id text not null unique, stripe_checkout_session_id text unique, stripe_payment_intent_id text, attribution_snapshot jsonb not null default '{}'::jsonb,
  clicked_at timestamptz not null default now(), confirmed_at timestamptz, expires_at timestamptz not null default (now() + interval '30 days')
);

create table if not exists public.free_score_abuse_events (
  id bigint generated always as identity primary key, ip_hmac text, domain_hmac text, user_id uuid references auth.users(id) on delete set null,
  event_code text not null, expires_at timestamptz not null default (now() + interval '7 days'), created_at timestamptz not null default now()
);
create index if not exists free_score_abuse_lookup_idx on public.free_score_abuse_events(ip_hmac, domain_hmac, created_at desc);

alter table public.community_scorecards enable row level security;
alter table public.community_score_jobs enable row level security;
alter table public.community_score_evidence enable row level security;
alter table public.community_score_attribution enable row level security;
alter table public.free_score_pending_conversions enable row level security;
alter table public.free_score_abuse_events enable row level security;

create policy "Scorecards readable by owner" on public.community_scorecards for select to authenticated using (auth.uid() = user_id);
create policy "Evidence readable through owned scorecard" on public.community_score_evidence for select to authenticated using (exists (select 1 from public.community_scorecards s where s.id = scorecard_id and s.user_id = auth.uid()));
create policy "Attribution readable by owner" on public.community_score_attribution for select to authenticated using (auth.uid() = user_id);

-- Run only after confirming pgmq is available on the target Supabase project.
do $$ begin
  if exists (select 1 from pg_extension where extname = 'pgmq') then perform pgmq.create('community-score-jobs'); end if;
exception when others then raise notice 'community-score-jobs queue was not created: %', sqlerrm; end $$;

create or replace function public.cleanup_free_score_data() returns jsonb language plpgsql security definer set search_path = public as $$
declare deleted_jobs integer; deleted_scorecards integer; deleted_evidence integer; deleted_abuse integer;
begin
  delete from public.community_score_jobs where payload_expires_at < now(); get diagnostics deleted_jobs = row_count;
  delete from public.community_scorecards where user_id is null and expires_at < now(); get diagnostics deleted_scorecards = row_count;
  update public.community_score_evidence set necessary_excerpt = null, observed_signals = '{}'::jsonb, ai_interpretation = '{}'::jsonb, inferences = '{}'::jsonb where expires_at < now() and necessary_excerpt is not null; get diagnostics deleted_evidence = row_count;
  delete from public.free_score_abuse_events where expires_at < now(); get diagnostics deleted_abuse = row_count;
  return jsonb_build_object('jobs',deleted_jobs,'scorecards',deleted_scorecards,'evidence_redacted',deleted_evidence,'abuse_events',deleted_abuse);
end $$;
revoke all on function public.cleanup_free_score_data() from public, anon, authenticated;
