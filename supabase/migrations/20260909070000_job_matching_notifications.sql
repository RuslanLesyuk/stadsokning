-- Clean Jobs — Step 7/12: job matching + notification preferences
-- Adds explicit user preferences, per-channel delivery audit/dedupe,
-- and an extensible notification type constraint for job_match.

create table if not exists public.job_match_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  enabled boolean not null default true,
  in_app_enabled boolean not null default true,
  email_enabled boolean not null default false,
  cities text[] not null default '{}'::text[],
  job_types text[] not null default array['home_cleaning', 'office_cleaning']::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_match_preferences_city_count_check
    check (cardinality(cities) <= 25),
  constraint job_match_preferences_job_type_count_check
    check (cardinality(job_types) between 1 and 2),
  constraint job_match_preferences_job_types_check
    check (
      job_types <@ array['home_cleaning', 'office_cleaning']::text[]
    )
);

create index if not exists job_match_preferences_enabled_idx
  on public.job_match_preferences (enabled)
  where enabled = true;

create table if not exists public.job_match_deliveries (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null,
  status text not null default 'pending',
  error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  constraint job_match_deliveries_channel_check
    check (channel in ('in_app', 'email')),
  constraint job_match_deliveries_status_check
    check (status in ('pending', 'sent', 'failed')),
  constraint job_match_deliveries_error_length_check
    check (error is null or char_length(error) <= 1000),
  constraint job_match_deliveries_job_user_channel_key
    unique (job_id, user_id, channel)
);

create index if not exists job_match_deliveries_job_idx
  on public.job_match_deliveries (job_id, created_at desc);

create index if not exists job_match_deliveries_user_idx
  on public.job_match_deliveries (user_id, created_at desc);

create index if not exists job_match_deliveries_failed_idx
  on public.job_match_deliveries (created_at desc)
  where status = 'failed';

alter table public.job_match_preferences enable row level security;
alter table public.job_match_deliveries enable row level security;

drop policy if exists "Users can view own job match preferences"
  on public.job_match_preferences;
create policy "Users can view own job match preferences"
  on public.job_match_preferences
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own job match preferences"
  on public.job_match_preferences;
create policy "Users can insert own job match preferences"
  on public.job_match_preferences
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own job match preferences"
  on public.job_match_preferences;
create policy "Users can update own job match preferences"
  on public.job_match_preferences
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own job match preferences"
  on public.job_match_preferences;
create policy "Users can delete own job match preferences"
  on public.job_match_preferences
  for delete
  to authenticated
  using (auth.uid() = user_id);

revoke all on table public.job_match_preferences from public, anon;
grant select, insert, update, delete
  on table public.job_match_preferences
  to authenticated;
grant all on table public.job_match_preferences to service_role;

revoke all on table public.job_match_deliveries from public, anon, authenticated;
grant all on table public.job_match_deliveries to service_role;

-- Older Clean Jobs migrations used an enum-like CHECK for notifications.type.
-- The product now has several feature notification types, so keep structural
-- integrity without forcing every future feature to rewrite the whole list.
alter table public.notifications
  drop constraint if exists notifications_type_check;

alter table public.notifications
  add constraint notifications_type_check
  check (
    char_length(type) between 2 and 64
    and type ~ '^[a-z][a-z0-9_]*$'
  );

notify pgrst, 'reload schema';
