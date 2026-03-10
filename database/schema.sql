-- ═══════════════════════════════════════════════════════════════════
-- LIVEPREVIEW — Complete Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ─── USERS ────────────────────────────────────────────────────────
create table public.users (
  id                     uuid primary key references auth.users(id) on delete cascade,
  email                  text unique not null,
  full_name              text,
  avatar_url             text,
  plan                   text not null default 'free' check (plan in ('free','pro')),
  plan_started_at        timestamptz,
  plan_ends_at           timestamptz,
  stripe_customer_id     text unique,
  stripe_subscription_id text unique,
  api_token              text unique default encode(gen_random_bytes(32),'hex'),
  tunnels_used_today     int default 0,
  last_usage_reset       timestamptz default now(),
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

-- ─── PLANS ────────────────────────────────────────────────────────
create table public.plans (
  id                    text primary key,
  name                  text not null,
  price_monthly         numeric(10,2) default 0,
  max_active_tunnels    int,
  session_duration_mins int,
  custom_subdomains     boolean default false,
  log_retention_days    int default 1,
  stripe_price_id       text
);

insert into public.plans values
  ('free','Free',   0,    1,  60,    false, 1,  null),
  ('pro', 'Pro',    8.99, null, null, true,  30, 'price_REPLACE_WITH_STRIPE_PRICE_ID');

-- ─── TUNNELS ──────────────────────────────────────────────────────
create table public.tunnels (
  id               text primary key,
  user_id          uuid references public.users(id) on delete set null,
  subdomain        text unique not null,
  public_url       text not null,
  local_port       int not null,
  status           text not null default 'pending'
                     check (status in ('pending','active','closed','expired')),
  created_at       timestamptz default now(),
  connected_at     timestamptz,
  closed_at        timestamptz,
  expires_at       timestamptz,
  total_requests   int default 0,
  total_visitors   int default 0,
  bytes_in         bigint default 0,
  bytes_out        bigint default 0
);

create index idx_tunnels_subdomain on public.tunnels(subdomain) where status='active';
create index idx_tunnels_user      on public.tunnels(user_id);
create index idx_tunnels_status    on public.tunnels(status);

-- ─── TUNNEL REQUESTS ──────────────────────────────────────────────
create table public.tunnel_requests (
  id          uuid primary key default uuid_generate_v4(),
  tunnel_id   text references public.tunnels(id) on delete cascade,
  method      text not null,
  path        text not null,
  status_code int,
  duration_ms int,
  ip_address  text,
  country     text,
  user_agent  text,
  bytes_in    int default 0,
  bytes_out   int default 0,
  created_at  timestamptz default now()
);

create index idx_requests_tunnel  on public.tunnel_requests(tunnel_id);
create index idx_requests_created on public.tunnel_requests(created_at desc);

-- ─── TUNNEL VISITORS ──────────────────────────────────────────────
create table public.tunnel_visitors (
  id         uuid primary key default uuid_generate_v4(),
  tunnel_id  text references public.tunnels(id) on delete cascade,
  session_id text not null,
  country    text,
  user_agent text,
  first_seen timestamptz default now(),
  last_seen  timestamptz default now(),
  page_views int default 1
);

create unique index idx_visitors_unique on public.tunnel_visitors(tunnel_id, session_id);

-- ─── CLI SESSIONS ─────────────────────────────────────────────────
create table public.cli_sessions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.users(id) on delete cascade,
  token        text unique default encode(gen_random_bytes(32),'hex'),
  device_name  text,
  last_used_at timestamptz default now(),
  created_at   timestamptz default now(),
  revoked_at   timestamptz
);

-- ─── STRIPE EVENTS (idempotency log) ──────────────────────────────
create table public.stripe_events (
  id          text primary key,
  type        text not null,
  processed   boolean default false,
  created_at  timestamptz default now()
);

-- ─── RLS ──────────────────────────────────────────────────────────
alter table public.users            enable row level security;
alter table public.tunnels          enable row level security;
alter table public.tunnel_requests  enable row level security;
alter table public.tunnel_visitors  enable row level security;
alter table public.cli_sessions     enable row level security;
alter table public.plans            enable row level security;

create policy "own_user"      on public.users           for all  using (auth.uid()=id);
create policy "own_tunnels"   on public.tunnels         for all  using (auth.uid()=user_id);
create policy "own_requests"  on public.tunnel_requests for select using (tunnel_id in (select id from public.tunnels where user_id=auth.uid()));
create policy "own_visitors"  on public.tunnel_visitors for select using (tunnel_id in (select id from public.tunnels where user_id=auth.uid()));
create policy "own_sessions"  on public.cli_sessions    for all  using (auth.uid()=user_id);
create policy "plans_public"  on public.plans           for select using (true);

-- ─── TRIGGERS ─────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users(id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at=now(); return new; end;
$$;

create trigger users_updated_at before update on public.users
  for each row execute function public.update_updated_at();

create or replace function public.inc_tunnel_stats()
returns trigger language plpgsql as $$
begin
  update public.tunnels
  set total_requests = total_requests + 1,
      bytes_out = bytes_out + coalesce(new.bytes_out,0),
      bytes_in  = bytes_in  + coalesce(new.bytes_in, 0)
  where id = new.tunnel_id;
  return new;
end;
$$;

create trigger on_request_insert after insert on public.tunnel_requests
  for each row execute function public.inc_tunnel_stats();

-- ─── VIEWS ────────────────────────────────────────────────────────
create or replace view public.user_stats as
select
  u.id,
  u.plan,
  u.email,
  count(t.id) filter (where t.status='active')  as active_tunnels,
  count(t.id)                                    as total_tunnels,
  coalesce(sum(t.total_requests),0)              as total_requests,
  coalesce(sum(t.bytes_out),0)                   as total_bytes_out
from public.users u
left join public.tunnels t on t.user_id = u.id
group by u.id, u.plan, u.email;