-- Python Future Lab: production PostgreSQL schema and RLS baseline.

create type public.user_role as enum ('student', 'teacher', 'admin');
create type public.progress_status as enum ('in_progress', 'completed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'student',
  display_name text not null check (char_length(display_name) between 2 and 20),
  avatar_key text,
  current_level integer not null default 1 check (current_level > 0),
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learning_paths (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  order_index integer not null unique check (order_index > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  learning_path_id uuid not null references public.learning_paths(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  summary text not null default '',
  concept text not null,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  order_index integer not null check (order_index > 0),
  starter_code text not null check (char_length(starter_code) <= 300),
  expected_result jsonb not null default '{}'::jsonb,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  is_trial boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learning_path_id, order_index)
);

create table public.mission_steps (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  step_type text not null check (step_type in ('concept', 'edit', 'run', 'review')),
  instruction text not null,
  block_definition jsonb not null default '{}'::jsonb,
  code_template text not null default '' check (char_length(code_template) <= 300),
  validation_rule jsonb not null default '{}'::jsonb,
  hint text not null default '',
  order_index integer not null check (order_index > 0),
  unique (mission_id, order_index)
);

create table public.user_mission_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mission_id uuid not null references public.missions(id) on delete cascade,
  status public.progress_status not null default 'in_progress',
  current_step integer not null default 0 check (current_step >= 0),
  code text not null default '' check (char_length(code) <= 300),
  attempts integer not null default 0 check (attempts >= 0),
  best_result jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, mission_id),
  check ((status = 'completed' and completed_at is not null) or status = 'in_progress')
);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  description text not null default '',
  icon_key text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.user_badges (
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

create table public.auth_rate_limits (
  key_hash text primary key,
  failed_attempts integer not null default 0 check (failed_attempts >= 0),
  window_started_at timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index missions_path_published_order_idx
  on public.missions (learning_path_id, is_published, order_index);
create index progress_user_status_updated_idx
  on public.user_mission_progress (user_id, status, updated_at desc);
create index progress_mission_status_idx
  on public.user_mission_progress (mission_id, status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger learning_paths_set_updated_at
before update on public.learning_paths
for each row execute function public.set_updated_at();

create trigger missions_set_updated_at
before update on public.missions
for each row execute function public.set_updated_at();

create trigger progress_set_updated_at
before update on public.user_mission_progress
for each row execute function public.set_updated_at();

create trigger auth_rate_limits_set_updated_at
before update on public.auth_rate_limits
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(coalesce(new.email, 'student'), '@', 1)), 20)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.learning_paths enable row level security;
alter table public.missions enable row level security;
alter table public.mission_steps enable row level security;
alter table public.user_mission_progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.auth_rate_limits enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.learning_paths, public.missions, public.mission_steps, public.badges
  to anon, authenticated;
grant select on public.profiles, public.user_mission_progress, public.user_badges
  to authenticated;
grant all on public.profiles, public.learning_paths, public.missions, public.mission_steps,
  public.user_mission_progress, public.badges, public.user_badges, public.auth_rate_limits
  to service_role;

create policy "published learning paths are public"
on public.learning_paths for select
to anon, authenticated
using (is_published);

create policy "published missions are public"
on public.missions for select
to anon, authenticated
using (
  is_published
  and exists (
    select 1 from public.learning_paths
    where learning_paths.id = missions.learning_path_id
      and learning_paths.is_published
  )
);

create policy "published mission steps are public"
on public.mission_steps for select
to anon, authenticated
using (
  exists (
    select 1 from public.missions
    join public.learning_paths on learning_paths.id = missions.learning_path_id
    where missions.id = mission_steps.mission_id
      and missions.is_published
      and learning_paths.is_published
  )
);

create policy "published badges are public"
on public.badges for select
to anon, authenticated
using (is_published);

create policy "users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "users can read their own progress"
on public.user_mission_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "users can read their own badges"
on public.user_badges for select
to authenticated
using ((select auth.uid()) = user_id);

-- Progress, XP, roles, and badge writes intentionally have no client policy.
-- Validated Next.js server routes use the service role after authenticating
-- the caller and validating mission results. This prevents forged completion.

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
