create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  subscription_plan text check (subscription_plan in ('analyse', 'discover')),
  subscription_status text not null default 'none',
  subscription_current_period_end bigint,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
