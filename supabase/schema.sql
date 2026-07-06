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

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  website text,
  industry text,
  company_size text,
  company_description text,
  ideal_customers text,
  competitors text,
  keywords text,
  goals text[] not null default '{}',
  preferred_platforms text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brands_user_id_idx on public.brands(user_id);

alter table public.brands enable row level security;

drop policy if exists "Brands are readable by owner" on public.brands;
create policy "Brands are readable by owner"
  on public.brands
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Brands are insertable by owner" on public.brands;
create policy "Brands are insertable by owner"
  on public.brands
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Brands are updateable by owner" on public.brands;
create policy "Brands are updateable by owner"
  on public.brands
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Brands are deletable by owner" on public.brands;
create policy "Brands are deletable by owner"
  on public.brands
  for delete
  to authenticated
  using (auth.uid() = user_id);
