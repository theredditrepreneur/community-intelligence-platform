alter table public.profiles drop constraint if exists profiles_subscription_plan_check;
alter table public.profiles drop constraint if exists profiles_subscription_plan_check1;
do $$ declare constraint_name text; begin select conname into constraint_name from pg_constraint where conrelid='public.profiles'::regclass and pg_get_constraintdef(oid) like '%subscription_plan%' limit 1; if constraint_name is not null then execute format('alter table public.profiles drop constraint %I', constraint_name); end if; end $$;
alter table public.profiles add constraint profiles_subscription_plan_check check (subscription_plan in ('analyse','discover','alerts'));

create table public.alert_monitors (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, brand_id uuid references public.brands(id) on delete set null,
 name text not null check(char_length(name) between 2 and 100), status text not null default 'active' check(status in ('active','paused','archived')),
 frequency text not null check(frequency in ('daily','weekly','monthly')), timezone text not null default 'Europe/London',
 competitors text[] not null default '{}', keywords text[] not null default '{}', signal_types text[] not null default '{}', delivery_email text,
 last_run_at timestamptz, next_run_at timestamptz, baseline_established_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index alert_monitors_due_idx on public.alert_monitors(status,next_run_at); create index alert_monitors_user_idx on public.alert_monitors(user_id);

create table public.alert_runs (
 id uuid primary key default gen_random_uuid(), monitor_id uuid not null references public.alert_monitors(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
 status text not null check(status in ('queued','searching','analysing','completed','failed','no_change')), trigger_type text not null check(trigger_type in ('scheduled','manual','baseline')),
 started_at timestamptz, completed_at timestamptz, error_code text, source_count integer not null default 0, idempotency_key text not null unique, created_at timestamptz not null default now()
);
create index alert_runs_monitor_created_idx on public.alert_runs(monitor_id,created_at desc);

create table public.alert_snapshots (
 id uuid primary key default gen_random_uuid(), run_id uuid not null unique references public.alert_runs(id) on delete cascade, monitor_id uuid not null references public.alert_monitors(id) on delete cascade,
 community_health smallint check(community_health between 0 and 100), metrics jsonb not null default '{}', evidence_summary jsonb not null default '[]', created_at timestamptz not null default now()
);
create table public.community_alerts (
 id uuid primary key default gen_random_uuid(), monitor_id uuid not null references public.alert_monitors(id) on delete cascade, run_id uuid not null references public.alert_runs(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
 alert_type text not null, priority text not null check(priority in ('low','medium','high','critical')), headline text not null, executive_summary text not null,
 what_changed text not null, why_it_matters text not null, recommended_action text not null, immediate_next_step text not null, confidence smallint not null check(confidence between 0 and 100),
 community_health_movement smallint, evidence jsonb not null default '[]', deduplication_key text not null, read_at timestamptz, created_at timestamptz not null default now(), unique(monitor_id,deduplication_key)
);
create index community_alerts_user_created_idx on public.community_alerts(user_id,created_at desc);
create table public.alert_deliveries (
 id uuid primary key default gen_random_uuid(), alert_id uuid not null references public.community_alerts(id) on delete cascade, channel text not null check(channel in ('email','dashboard')), status text not null check(status in ('pending','sent','failed')), provider_id text, error_code text, attempted_at timestamptz not null default now(), delivered_at timestamptz
);

alter table public.alert_monitors enable row level security; alter table public.alert_runs enable row level security; alter table public.alert_snapshots enable row level security; alter table public.community_alerts enable row level security; alter table public.alert_deliveries enable row level security;
create policy "Owners manage alert monitors" on public.alert_monitors for all to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "Owners read alert runs" on public.alert_runs for select to authenticated using(auth.uid()=user_id);
create policy "Owners read alert snapshots" on public.alert_snapshots for select to authenticated using(exists(select 1 from public.alert_monitors m where m.id=monitor_id and m.user_id=auth.uid()));
create policy "Owners manage alerts" on public.community_alerts for select to authenticated using(auth.uid()=user_id);
create policy "Owners read alert deliveries" on public.alert_deliveries for select to authenticated using(exists(select 1 from public.community_alerts a where a.id=alert_id and a.user_id=auth.uid()));

create or replace function public.enforce_alert_monitor_limit() returns trigger language plpgsql security definer set search_path=public as $$ begin if (select count(*) from public.alert_monitors where user_id=new.user_id and status in ('active','paused')) >= 10 then raise exception 'Alert Monitor limit reached'; end if; return new; end $$;
create trigger enforce_alert_monitor_limit before insert on public.alert_monitors for each row execute function public.enforce_alert_monitor_limit();
