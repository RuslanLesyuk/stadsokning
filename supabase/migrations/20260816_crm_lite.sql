
begin;

-- ============================================================
-- Clean Jobs — CRM Lite (Block 8/10)
-- ============================================================
-- Canonical CRM contact metadata sits on top of the existing
-- company_quote_requests + company_bookings business flows.
-- Leads/bookings remain the source of truth for transactions.
-- ============================================================

create table if not exists public.company_crm_customers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  email text not null,
  normalized_email text not null,
  phone text,
  city text,
  lifecycle_stage text not null default 'prospect',
  tags text[] not null default '{}'::text[],
  owner_notes text,
  follow_up_at timestamptz,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_crm_customers_name_check
    check (length(trim(customer_name)) between 1 and 200),
  constraint company_crm_customers_email_check
    check (length(trim(email)) between 3 and 320 and position('@' in email) > 1),
  constraint company_crm_customers_normalized_email_check
    check (normalized_email = lower(trim(email))),
  constraint company_crm_customers_stage_check
    check (lifecycle_stage in ('prospect', 'customer', 'vip', 'inactive')),
  constraint company_crm_customers_tags_check
    check (coalesce(array_length(tags, 1), 0) <= 20),
  constraint company_crm_customers_notes_check
    check (owner_notes is null or length(owner_notes) <= 10000),
  constraint company_crm_customers_company_email_unique
    unique (company_id, normalized_email)
);

create index if not exists company_crm_customers_company_activity_idx
  on public.company_crm_customers(company_id, last_activity_at desc);

create index if not exists company_crm_customers_company_stage_idx
  on public.company_crm_customers(company_id, lifecycle_stage, last_activity_at desc);

create index if not exists company_crm_customers_follow_up_idx
  on public.company_crm_customers(company_id, follow_up_at)
  where follow_up_at is not null;

create index if not exists company_crm_customers_tags_gin_idx
  on public.company_crm_customers using gin(tags);

alter table public.company_quote_requests
  add column if not exists crm_customer_id uuid;

alter table public.company_bookings
  add column if not exists crm_customer_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_crm_customer_id_fkey'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_crm_customer_id_fkey
      foreign key (crm_customer_id)
      references public.company_crm_customers(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.company_bookings'::regclass
      and conname = 'company_bookings_crm_customer_id_fkey'
  ) then
    alter table public.company_bookings
      add constraint company_bookings_crm_customer_id_fkey
      foreign key (crm_customer_id)
      references public.company_crm_customers(id)
      on delete set null;
  end if;
end $$;

create index if not exists company_quote_requests_crm_customer_idx
  on public.company_quote_requests(crm_customer_id, created_at desc)
  where crm_customer_id is not null;

create index if not exists company_bookings_crm_customer_idx
  on public.company_bookings(crm_customer_id, created_at desc)
  where crm_customer_id is not null;

-- ---------------------------------------------------------------------------
-- Shared upsert helper.
-- Existing CRM-entered profile data wins over source snapshots, while missing
-- fields are filled from later leads/bookings. Lifecycle can auto-promote from
-- prospect to customer, but VIP/inactive remain explicit owner decisions.
-- ---------------------------------------------------------------------------

create or replace function public.upsert_company_crm_customer(
  p_company_id uuid,
  p_user_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_city text,
  p_seen_at timestamptz,
  p_lifecycle_stage text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_email text := lower(trim(coalesce(p_email, '')));
  v_name text := trim(coalesce(p_customer_name, ''));
  v_seen timestamptz := coalesce(p_seen_at, now());
  v_stage text := case
    when p_lifecycle_stage in ('customer', 'vip') then p_lifecycle_stage
    else 'prospect'
  end;
begin
  if p_company_id is null or v_email = '' or position('@' in v_email) <= 1 then
    return null;
  end if;

  if v_name = '' then
    v_name := split_part(v_email, '@', 1);
  end if;

  insert into public.company_crm_customers (
    company_id,
    user_id,
    customer_name,
    email,
    normalized_email,
    phone,
    city,
    lifecycle_stage,
    first_seen_at,
    last_seen_at,
    last_activity_at
  )
  values (
    p_company_id,
    p_user_id,
    v_name,
    trim(p_email),
    v_email,
    nullif(trim(coalesce(p_phone, '')), ''),
    nullif(trim(coalesce(p_city, '')), ''),
    v_stage,
    v_seen,
    v_seen,
    v_seen
  )
  on conflict (company_id, normalized_email)
  do update set
    user_id = coalesce(company_crm_customers.user_id, excluded.user_id),
    customer_name = case
      when nullif(trim(company_crm_customers.customer_name), '') is null
        then excluded.customer_name
      else company_crm_customers.customer_name
    end,
    email = company_crm_customers.email,
    phone = coalesce(
      nullif(trim(company_crm_customers.phone), ''),
      excluded.phone
    ),
    city = coalesce(
      nullif(trim(company_crm_customers.city), ''),
      excluded.city
    ),
    lifecycle_stage = case
      when company_crm_customers.lifecycle_stage in ('vip', 'inactive')
        then company_crm_customers.lifecycle_stage
      when excluded.lifecycle_stage = 'customer'
        then 'customer'
      else company_crm_customers.lifecycle_stage
    end,
    first_seen_at = least(company_crm_customers.first_seen_at, excluded.first_seen_at),
    last_seen_at = greatest(company_crm_customers.last_seen_at, excluded.last_seen_at),
    last_activity_at = greatest(company_crm_customers.last_activity_at, excluded.last_activity_at),
    updated_at = now()
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.upsert_company_crm_customer(
  uuid, uuid, text, text, text, text, timestamptz, text
) from public;

-- ---------------------------------------------------------------------------
-- Backfill CRM contacts from existing leads.
-- ---------------------------------------------------------------------------

with latest as (
  select distinct on (q.company_id, lower(trim(q.customer_email)))
    q.company_id,
    q.user_id,
    q.customer_name,
    q.customer_email,
    q.customer_phone,
    q.city,
    case when q.status = 'won' then 'customer' else 'prospect' end as lifecycle_stage,
    q.created_at,
    coalesce(q.last_activity_at, q.updated_at, q.created_at, now()) as activity_at
  from public.company_quote_requests q
  where nullif(trim(q.customer_email), '') is not null
  order by
    q.company_id,
    lower(trim(q.customer_email)),
    coalesce(q.last_activity_at, q.updated_at, q.created_at, now()) desc
)
insert into public.company_crm_customers (
  company_id,
  user_id,
  customer_name,
  email,
  normalized_email,
  phone,
  city,
  lifecycle_stage,
  first_seen_at,
  last_seen_at,
  last_activity_at
)
select
  company_id,
  user_id,
  coalesce(nullif(trim(customer_name), ''), split_part(lower(trim(customer_email)), '@', 1)),
  trim(customer_email),
  lower(trim(customer_email)),
  nullif(trim(coalesce(customer_phone, '')), ''),
  nullif(trim(coalesce(city, '')), ''),
  lifecycle_stage,
  created_at,
  activity_at,
  activity_at
from latest
on conflict (company_id, normalized_email)
do update set
  user_id = coalesce(company_crm_customers.user_id, excluded.user_id),
  phone = coalesce(company_crm_customers.phone, excluded.phone),
  city = coalesce(company_crm_customers.city, excluded.city),
  lifecycle_stage = case
    when company_crm_customers.lifecycle_stage in ('vip', 'inactive')
      then company_crm_customers.lifecycle_stage
    when excluded.lifecycle_stage = 'customer'
      then 'customer'
    else company_crm_customers.lifecycle_stage
  end,
  first_seen_at = least(company_crm_customers.first_seen_at, excluded.first_seen_at),
  last_seen_at = greatest(company_crm_customers.last_seen_at, excluded.last_seen_at),
  last_activity_at = greatest(company_crm_customers.last_activity_at, excluded.last_activity_at),
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Backfill/upgrade CRM contacts from existing bookings.
-- ---------------------------------------------------------------------------

with latest as (
  select distinct on (b.company_id, lower(trim(b.customer_email)))
    b.company_id,
    b.customer_id as user_id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    b.city,
    case
      when b.status in ('confirmed', 'in_progress', 'completed') then 'customer'
      else 'prospect'
    end as lifecycle_stage,
    b.created_at,
    coalesce(b.updated_at, b.created_at, now()) as activity_at
  from public.company_bookings b
  where nullif(trim(b.customer_email), '') is not null
  order by
    b.company_id,
    lower(trim(b.customer_email)),
    coalesce(b.updated_at, b.created_at, now()) desc
)
insert into public.company_crm_customers (
  company_id,
  user_id,
  customer_name,
  email,
  normalized_email,
  phone,
  city,
  lifecycle_stage,
  first_seen_at,
  last_seen_at,
  last_activity_at
)
select
  company_id,
  user_id,
  coalesce(nullif(trim(customer_name), ''), split_part(lower(trim(customer_email)), '@', 1)),
  trim(customer_email),
  lower(trim(customer_email)),
  nullif(trim(coalesce(customer_phone, '')), ''),
  nullif(trim(coalesce(city, '')), ''),
  lifecycle_stage,
  created_at,
  activity_at,
  activity_at
from latest
on conflict (company_id, normalized_email)
do update set
  user_id = coalesce(company_crm_customers.user_id, excluded.user_id),
  phone = coalesce(company_crm_customers.phone, excluded.phone),
  city = coalesce(company_crm_customers.city, excluded.city),
  lifecycle_stage = case
    when company_crm_customers.lifecycle_stage in ('vip', 'inactive')
      then company_crm_customers.lifecycle_stage
    when excluded.lifecycle_stage = 'customer'
      then 'customer'
    else company_crm_customers.lifecycle_stage
  end,
  first_seen_at = least(company_crm_customers.first_seen_at, excluded.first_seen_at),
  last_seen_at = greatest(company_crm_customers.last_seen_at, excluded.last_seen_at),
  last_activity_at = greatest(company_crm_customers.last_activity_at, excluded.last_activity_at),
  updated_at = now();

-- Correct first/last seen across all historical rows.
with source_bounds as (
  select
    company_id,
    lower(trim(customer_email)) as normalized_email,
    min(created_at) as first_seen_at,
    max(activity_at) as last_seen_at
  from (
    select
      company_id,
      customer_email,
      created_at,
      coalesce(last_activity_at, updated_at, created_at, now()) as activity_at
    from public.company_quote_requests
    where nullif(trim(customer_email), '') is not null

    union all

    select
      company_id,
      customer_email,
      created_at,
      coalesce(updated_at, created_at, now()) as activity_at
    from public.company_bookings
    where nullif(trim(customer_email), '') is not null
  ) source_rows
  group by company_id, lower(trim(customer_email))
)
update public.company_crm_customers c
set
  first_seen_at = least(c.first_seen_at, b.first_seen_at),
  last_seen_at = greatest(c.last_seen_at, b.last_seen_at),
  last_activity_at = greatest(c.last_activity_at, b.last_seen_at),
  updated_at = now()
from source_bounds b
where b.company_id = c.company_id
  and b.normalized_email = c.normalized_email;

-- Link existing rows without rewriting historical activity timestamps.
do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.company_quote_requests'::regclass
      and tgname = 'trg_touch_company_quote_request'
      and not tgisinternal
  ) then
    execute 'alter table public.company_quote_requests disable trigger trg_touch_company_quote_request';
  end if;

  if exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.company_bookings'::regclass
      and tgname = 'company_bookings_touch_updated_at'
      and not tgisinternal
  ) then
    execute 'alter table public.company_bookings disable trigger company_bookings_touch_updated_at';
  end if;
end $$;

update public.company_quote_requests q
set crm_customer_id = c.id
from public.company_crm_customers c
where c.company_id = q.company_id
  and c.normalized_email = lower(trim(q.customer_email))
  and q.crm_customer_id is distinct from c.id;

update public.company_bookings b
set crm_customer_id = c.id
from public.company_crm_customers c
where c.company_id = b.company_id
  and c.normalized_email = lower(trim(b.customer_email))
  and b.crm_customer_id is distinct from c.id;

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.company_quote_requests'::regclass
      and tgname = 'trg_touch_company_quote_request'
      and not tgisinternal
  ) then
    execute 'alter table public.company_quote_requests enable trigger trg_touch_company_quote_request';
  end if;

  if exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.company_bookings'::regclass
      and tgname = 'company_bookings_touch_updated_at'
      and not tgisinternal
  ) then
    execute 'alter table public.company_bookings enable trigger company_bookings_touch_updated_at';
  end if;
end $$;

-- Seed the CRM follow-up from the earliest open lead follow-up when the
-- customer does not already have a CRM-level follow-up.
with next_follow_up as (
  select
    crm_customer_id,
    min(follow_up_at) as follow_up_at
  from public.company_quote_requests
  where crm_customer_id is not null
    and follow_up_at is not null
    and status in ('new', 'viewed', 'contacted', 'qualified', 'quoted')
  group by crm_customer_id
)
update public.company_crm_customers c
set
  follow_up_at = f.follow_up_at,
  updated_at = now()
from next_follow_up f
where c.id = f.crm_customer_id
  and c.follow_up_at is null;

-- ---------------------------------------------------------------------------
-- CRM customer activity.
-- ---------------------------------------------------------------------------

create table if not exists public.company_crm_customer_activity (
  id uuid primary key default gen_random_uuid(),
  crm_customer_id uuid not null references public.company_crm_customers(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists company_crm_customer_activity_customer_created_idx
  on public.company_crm_customer_activity(crm_customer_id, created_at desc);

create index if not exists company_crm_customer_activity_company_created_idx
  on public.company_crm_customer_activity(company_id, created_at desc);

create or replace function public.touch_company_crm_customer()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.normalized_email = lower(trim(new.email));
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_company_crm_customer on public.company_crm_customers;
create trigger trg_touch_company_crm_customer
before update on public.company_crm_customers
for each row
execute function public.touch_company_crm_customer();

create or replace function public.log_company_crm_customer_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    insert into public.company_crm_customer_activity (
      crm_customer_id,
      company_id,
      actor_id,
      event_type,
      metadata,
      created_at
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'customer_created',
      jsonb_build_object('stage', new.lifecycle_stage),
      new.created_at
    );
    return new;
  end if;

  if new.customer_name is distinct from old.customer_name
     or new.phone is distinct from old.phone
     or new.city is distinct from old.city then
    insert into public.company_crm_customer_activity (
      crm_customer_id, company_id, actor_id, event_type, metadata
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'contact_updated',
      jsonb_build_object(
        'name', new.customer_name,
        'phone', new.phone,
        'city', new.city
      )
    );
  end if;

  if new.lifecycle_stage is distinct from old.lifecycle_stage then
    insert into public.company_crm_customer_activity (
      crm_customer_id, company_id, actor_id, event_type, metadata
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'lifecycle_changed',
      jsonb_build_object(
        'from', old.lifecycle_stage,
        'to', new.lifecycle_stage
      )
    );
  end if;

  if new.tags is distinct from old.tags then
    insert into public.company_crm_customer_activity (
      crm_customer_id, company_id, actor_id, event_type, metadata
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'tags_updated',
      jsonb_build_object('tags', to_jsonb(new.tags))
    );
  end if;

  if new.owner_notes is distinct from old.owner_notes then
    insert into public.company_crm_customer_activity (
      crm_customer_id, company_id, actor_id, event_type, metadata
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'notes_updated',
      '{}'::jsonb
    );
  end if;

  if new.follow_up_at is distinct from old.follow_up_at then
    insert into public.company_crm_customer_activity (
      crm_customer_id, company_id, actor_id, event_type, metadata
    ) values (
      new.id,
      new.company_id,
      v_actor,
      'follow_up_changed',
      jsonb_build_object(
        'from', old.follow_up_at,
        'to', new.follow_up_at
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_log_company_crm_customer_activity on public.company_crm_customers;
create trigger trg_log_company_crm_customer_activity
after insert or update on public.company_crm_customers
for each row
execute function public.log_company_crm_customer_activity();

-- ---------------------------------------------------------------------------
-- Prevent cross-company CRM links.
-- ---------------------------------------------------------------------------

create or replace function public.ensure_crm_customer_company_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.crm_customer_id is null then
    return new;
  end if;

  if not exists (
    select 1
    from public.company_crm_customers c
    where c.id = new.crm_customer_id
      and c.company_id = new.company_id
  ) then
    raise exception 'CRM_CUSTOMER_COMPANY_MISMATCH';
  end if;

  return new;
end;
$$;

revoke all on function public.ensure_crm_customer_company_match() from public;

drop trigger if exists trg_quote_request_crm_company_match on public.company_quote_requests;
create trigger trg_quote_request_crm_company_match
before insert or update of company_id, crm_customer_id
on public.company_quote_requests
for each row
execute function public.ensure_crm_customer_company_match();

drop trigger if exists trg_booking_crm_company_match on public.company_bookings;
create trigger trg_booking_crm_company_match
before insert or update of company_id, crm_customer_id
on public.company_bookings
for each row
execute function public.ensure_crm_customer_company_match();

-- ---------------------------------------------------------------------------
-- Keep CRM links and profile snapshots synchronized from leads/bookings.
-- AFTER triggers allow the public quote-request insert policy to require
-- crm_customer_id IS NULL on the incoming request.
-- ---------------------------------------------------------------------------

create or replace function public.sync_crm_customer_from_quote_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_stage text;
begin
  if nullif(trim(new.customer_email), '') is null then
    return new;
  end if;

  v_stage := case when new.status = 'won' then 'customer' else 'prospect' end;

  v_customer_id := public.upsert_company_crm_customer(
    new.company_id,
    new.user_id,
    new.customer_name,
    new.customer_email,
    new.customer_phone,
    new.city,
    coalesce(new.last_activity_at, new.updated_at, new.created_at, now()),
    v_stage
  );

  if v_customer_id is not null and new.crm_customer_id is distinct from v_customer_id then
    update public.company_quote_requests
    set crm_customer_id = v_customer_id
    where id = new.id
      and crm_customer_id is distinct from v_customer_id;
  end if;

  if v_customer_id is not null
     and new.follow_up_at is not null
     and new.status in ('new', 'viewed', 'contacted', 'qualified', 'quoted') then
    update public.company_crm_customers
    set follow_up_at = new.follow_up_at
    where id = v_customer_id
      and follow_up_at is null;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_crm_customer_from_quote_request() from public;

drop trigger if exists trg_sync_crm_customer_from_quote_request
  on public.company_quote_requests;

create trigger trg_sync_crm_customer_from_quote_request
after insert or update of
  company_id,
  user_id,
  customer_name,
  customer_email,
  customer_phone,
  city,
  status,
  priority,
  owner_notes,
  lead_score,
  estimated_value,
  quoted_value,
  follow_up_at,
  lost_reason,
  lead_access,
  is_paid
on public.company_quote_requests
for each row
execute function public.sync_crm_customer_from_quote_request();

create or replace function public.sync_crm_customer_from_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_stage text;
begin
  if nullif(trim(new.customer_email), '') is null then
    return new;
  end if;

  v_stage := case
    when new.status in ('confirmed', 'in_progress', 'completed') then 'customer'
    else 'prospect'
  end;

  v_customer_id := public.upsert_company_crm_customer(
    new.company_id,
    new.customer_id,
    new.customer_name,
    new.customer_email,
    new.customer_phone,
    new.city,
    coalesce(new.updated_at, new.created_at, now()),
    v_stage
  );

  if v_customer_id is not null and new.crm_customer_id is distinct from v_customer_id then
    update public.company_bookings
    set crm_customer_id = v_customer_id
    where id = new.id
      and crm_customer_id is distinct from v_customer_id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_crm_customer_from_booking() from public;

drop trigger if exists trg_sync_crm_customer_from_booking
  on public.company_bookings;

create trigger trg_sync_crm_customer_from_booking
after insert or update of
  company_id,
  customer_id,
  customer_name,
  customer_email,
  customer_phone,
  city,
  status,
  service_type,
  address,
  postal_code,
  frequency,
  start_date,
  preferred_time,
  agreed_price,
  estimated_price,
  payment_status,
  cancellation_reason
on public.company_bookings
for each row
execute function public.sync_crm_customer_from_booking();

-- Keep customer recency aligned with recurring-cleaning activity even when
-- the parent booking status itself does not change.
create or replace function public.touch_crm_customer_from_booking_occurrence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
begin
  select b.crm_customer_id
  into v_customer_id
  from public.company_bookings b
  where b.id = new.booking_id;

  if v_customer_id is not null then
    update public.company_crm_customers
    set
      last_seen_at = greatest(last_seen_at, now()),
      last_activity_at = greatest(last_activity_at, now())
    where id = v_customer_id;
  end if;

  return new;
end;
$$;

revoke all on function public.touch_crm_customer_from_booking_occurrence() from public;

drop trigger if exists trg_touch_crm_customer_from_booking_occurrence
  on public.company_booking_occurrences;

create trigger trg_touch_crm_customer_from_booking_occurrence
after update of status
on public.company_booking_occurrences
for each row
when (old.status is distinct from new.status)
execute function public.touch_crm_customer_from_booking_occurrence();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.company_crm_customers enable row level security;
alter table public.company_crm_customer_activity enable row level security;

drop policy if exists "Company owners can read CRM customers"
  on public.company_crm_customers;
create policy "Company owners can read CRM customers"
on public.company_crm_customers
for select
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_crm_customers.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can insert CRM customers"
  on public.company_crm_customers;
create policy "Company owners can insert CRM customers"
on public.company_crm_customers
for insert
to authenticated
with check (
  exists (
    select 1
    from public.companies c
    where c.id = company_crm_customers.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can update CRM customers"
  on public.company_crm_customers;
create policy "Company owners can update CRM customers"
on public.company_crm_customers
for update
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_crm_customers.company_id
      and c.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.companies c
    where c.id = company_crm_customers.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can read CRM customer activity"
  on public.company_crm_customer_activity;
create policy "Company owners can read CRM customer activity"
on public.company_crm_customer_activity
for select
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_crm_customer_activity.company_id
      and c.owner_id = auth.uid()
  )
);

grant select, insert, update on public.company_crm_customers to authenticated;
grant select on public.company_crm_customer_activity to authenticated;

-- ---------------------------------------------------------------------------
-- Tighten public lead creation: CRM linkage is assigned by the DB after insert,
-- never trusted from an anonymous/authenticated public form payload.
-- ---------------------------------------------------------------------------

drop policy if exists "Public can create company quote requests"
  on public.company_quote_requests;

create policy "Public can create company quote requests"
on public.company_quote_requests
for insert
to anon, authenticated
with check (
  status = 'new'
  and lead_type = 'direct'
  and source in ('company_profile', 'company_site')
  and lead_access = 'included'
  and is_paid = false
  and crm_customer_id is null
  and company_id is not null
  and nullif(trim(customer_name), '') is not null
  and nullif(trim(customer_email), '') is not null
  and nullif(trim(message), '') is not null
  and (user_id is null or user_id = auth.uid())
);

notify pgrst, 'reload schema';

commit;
