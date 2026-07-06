create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  subscription_plan text check (subscription_plan in ('analyse', 'discover')),
  subscription_status text not null default 'none',
  subscription_current_period_end bigint,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists role text not null default 'customer';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
      add constraint profiles_role_check check (role in ('customer', 'admin'));
  end if;
end
$$;

insert into public.profiles (id, role, updated_at)
select id, 'admin', now()
from auth.users
where lower(email) = 'theredditrepreneur@gmail.com'
on conflict (id) do update
set role = 'admin',
    updated_at = now();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);
