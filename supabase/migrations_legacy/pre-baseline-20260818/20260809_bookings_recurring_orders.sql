begin;

-- ============================================================
-- Clean Jobs — Bookings / Recurring Orders 1.0 (Block 5/10)
-- ============================================================

create table if not exists public.company_booking_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  booking_enabled boolean not null default false,
  recurring_enabled boolean not null default true,
  min_notice_hours integer not null default 24,
  max_days_ahead integer not null default 90,
  default_duration_minutes integer not null default 180,
  buffer_minutes integer not null default 30,
  auto_confirm boolean not null default false,
  timezone text not null default 'Europe/Stockholm',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_booking_settings_min_notice_check
    check (min_notice_hours between 0 and 720),
  constraint company_booking_settings_max_days_check
    check (max_days_ahead between 1 and 365),
  constraint company_booking_settings_duration_check
    check (default_duration_minutes between 30 and 1440),
  constraint company_booking_settings_buffer_check
    check (buffer_minutes between 0 and 240),
  constraint company_booking_settings_timezone_check
    check (length(trim(timezone)) between 1 and 100)
);

create table if not exists public.company_bookings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  customer_id uuid references auth.users(id) on delete set null,
  quote_request_id uuid references public.company_quote_requests(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_type text not null,
  address text not null,
  postal_code text,
  city text not null,
  frequency text not null default 'one_time',
  start_date date not null,
  preferred_time time without time zone not null,
  duration_minutes integer not null default 180,
  rut_requested boolean not null default false,
  customer_notes text,
  status text not null default 'pending',
  estimated_price numeric(12,2),
  agreed_price numeric(12,2),
  currency text not null default 'SEK',
  source text not null default 'company_profile',
  source_url text,
  timezone text not null default 'Europe/Stockholm',
  payment_status text not null default 'unpaid',
  stripe_payment_intent_id text,
  confirmed_at timestamptz,
  declined_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancelled_by uuid references auth.users(id) on delete set null,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_bookings_frequency_check
    check (frequency in ('one_time', 'weekly', 'biweekly', 'monthly')),
  constraint company_bookings_status_check
    check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'declined', 'cancelled')),
  constraint company_bookings_duration_check
    check (duration_minutes between 30 and 1440),
  constraint company_bookings_price_check
    check ((estimated_price is null or estimated_price >= 0) and (agreed_price is null or agreed_price >= 0)),
  constraint company_bookings_currency_check
    check (currency = 'SEK'),
  constraint company_bookings_source_check
    check (source in ('company_profile', 'company_site', 'lead_conversion', 'manual', 'admin')),
  constraint company_bookings_payment_status_check
    check (payment_status in ('unpaid', 'pending', 'paid', 'refunded', 'failed')),
  constraint company_bookings_name_check
    check (length(trim(customer_name)) between 1 and 200),
  constraint company_bookings_email_check
    check (position('@' in customer_email) > 1),
  constraint company_bookings_service_check
    check (length(trim(service_type)) between 1 and 200),
  constraint company_bookings_address_check
    check (length(trim(address)) between 1 and 500),
  constraint company_bookings_city_check
    check (length(trim(city)) between 1 and 200)
);

create unique index if not exists company_bookings_quote_request_unique_idx
  on public.company_bookings(quote_request_id)
  where quote_request_id is not null;

create table if not exists public.company_booking_occurrences (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.company_bookings(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  sequence_no integer not null,
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status text not null default 'pending',
  price numeric(12,2),
  confirmed_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_booking_occurrences_status_check
    check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  constraint company_booking_occurrences_time_check
    check (scheduled_end > scheduled_start),
  constraint company_booking_occurrences_sequence_check
    check (sequence_no >= 1),
  constraint company_booking_occurrences_price_check
    check (price is null or price >= 0),
  constraint company_booking_occurrences_booking_sequence_unique
    unique (booking_id, sequence_no)
);

create table if not exists public.company_booking_activity (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.company_bookings(id) on delete cascade,
  occurrence_id uuid references public.company_booking_occurrences(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists company_bookings_company_status_created_idx
  on public.company_bookings(company_id, status, created_at desc);
create index if not exists company_bookings_customer_created_idx
  on public.company_bookings(customer_id, created_at desc);
create index if not exists company_bookings_start_date_idx
  on public.company_bookings(start_date);
create index if not exists company_booking_occurrences_company_start_idx
  on public.company_booking_occurrences(company_id, scheduled_start);
create index if not exists company_booking_occurrences_booking_idx
  on public.company_booking_occurrences(booking_id, sequence_no);
create index if not exists company_booking_occurrences_status_start_idx
  on public.company_booking_occurrences(status, scheduled_start);
create index if not exists company_booking_activity_booking_created_idx
  on public.company_booking_activity(booking_id, created_at desc);

-- ============================================================
-- updated_at helpers
-- ============================================================
create or replace function public.touch_company_booking_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists company_booking_settings_touch_updated_at on public.company_booking_settings;
create trigger company_booking_settings_touch_updated_at
before update on public.company_booking_settings
for each row execute function public.touch_company_booking_updated_at();

drop trigger if exists company_bookings_touch_updated_at on public.company_bookings;
create trigger company_bookings_touch_updated_at
before update on public.company_bookings
for each row execute function public.touch_company_booking_updated_at();

drop trigger if exists company_booking_occurrences_touch_updated_at on public.company_booking_occurrences;
create trigger company_booking_occurrences_touch_updated_at
before update on public.company_booking_occurrences
for each row execute function public.touch_company_booking_updated_at();

-- ============================================================
-- Ensure every claimed/owned company has booking settings.
-- Booking is OFF by default; owner explicitly enables it.
-- ============================================================
create or replace function public.ensure_company_booking_settings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.owner_id is not null then
    insert into public.company_booking_settings(company_id)
    values (new.id)
    on conflict (company_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists companies_ensure_booking_settings on public.companies;
create trigger companies_ensure_booking_settings
after insert or update of owner_id on public.companies
for each row execute function public.ensure_company_booking_settings();

insert into public.company_booking_settings(company_id)
select id
from public.companies
where owner_id is not null
on conflict (company_id) do nothing;

-- ============================================================
-- Generate a finite recurring schedule inside the company's
-- configured booking horizon. Existing series remain stable if
-- settings are changed later.
-- ============================================================
create or replace function public.generate_company_booking_occurrences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  settings_row public.company_booking_settings%rowtype;
  occurrence_date date;
  horizon_date date;
  sequence_number integer := 1;
  occurrence_start timestamptz;
  occurrence_end timestamptz;
  occurrence_status text;
begin
  select *
  into settings_row
  from public.company_booking_settings
  where company_id = new.company_id;

  if not found then
    settings_row.max_days_ahead := 90;
  end if;

  horizon_date := new.start_date + coalesce(settings_row.max_days_ahead, 90);
  occurrence_date := new.start_date;
  occurrence_status := case when new.status = 'confirmed' then 'confirmed' else 'pending' end;

  loop
    exit when occurrence_date > horizon_date;
    exit when sequence_number > 60;

    occurrence_start := ((occurrence_date + new.preferred_time) at time zone new.timezone);
    occurrence_end := occurrence_start + make_interval(mins => new.duration_minutes);

    insert into public.company_booking_occurrences(
      booking_id,
      company_id,
      sequence_no,
      scheduled_start,
      scheduled_end,
      status,
      price,
      confirmed_at
    ) values (
      new.id,
      new.company_id,
      sequence_number,
      occurrence_start,
      occurrence_end,
      occurrence_status,
      coalesce(new.agreed_price, new.estimated_price),
      case when occurrence_status = 'confirmed' then now() else null end
    );

    if new.frequency = 'one_time' then
      exit;
    elsif new.frequency = 'weekly' then
      occurrence_date := occurrence_date + 7;
    elsif new.frequency = 'biweekly' then
      occurrence_date := occurrence_date + 14;
    elsif new.frequency = 'monthly' then
      occurrence_date := (new.start_date + make_interval(months => sequence_number))::date;
    else
      exit;
    end if;

    sequence_number := sequence_number + 1;
  end loop;

  return new;
end;
$$;

drop trigger if exists company_bookings_generate_occurrences on public.company_bookings;
create trigger company_bookings_generate_occurrences
after insert on public.company_bookings
for each row execute function public.generate_company_booking_occurrences();

-- ============================================================
-- Database-level overlap guard for confirmed work.
-- The advisory lock serializes confirmation for the same company,
-- preventing two concurrent confirmations from occupying one slot.
-- ============================================================
create or replace function public.guard_company_booking_occurrence_conflict()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  buffer_value integer := 0;
  conflict_exists boolean;
begin
  if new.status not in ('confirmed', 'in_progress') then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(new.company_id::text, 0));

  select coalesce(buffer_minutes, 0)
  into buffer_value
  from public.company_booking_settings
  where company_id = new.company_id;

  select exists (
    select 1
    from public.company_booking_occurrences existing
    where existing.company_id = new.company_id
      and existing.id is distinct from new.id
      and existing.status in ('confirmed', 'in_progress')
      and existing.scheduled_start < new.scheduled_end + make_interval(mins => buffer_value)
      and existing.scheduled_end > new.scheduled_start - make_interval(mins => buffer_value)
  )
  into conflict_exists;

  if conflict_exists then
    raise exception using
      errcode = 'P0001',
      message = 'BOOKING_TIME_CONFLICT';
  end if;

  return new;
end;
$$;

drop trigger if exists company_booking_occurrences_conflict_guard on public.company_booking_occurrences;
create trigger company_booking_occurrences_conflict_guard
before insert or update of scheduled_start, scheduled_end, status
on public.company_booking_occurrences
for each row execute function public.guard_company_booking_occurrence_conflict();

-- ============================================================
-- Keep occurrence state consistent with booking-level decisions.
-- ============================================================
create or replace function public.sync_company_booking_occurrences()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is not distinct from new.status then
    return new;
  end if;

  if new.status = 'confirmed' then
    update public.company_booking_occurrences
    set status = 'confirmed',
        confirmed_at = coalesce(confirmed_at, now())
    where booking_id = new.id
      and status = 'pending';
  elsif new.status in ('declined', 'cancelled') then
    update public.company_booking_occurrences
    set status = 'cancelled',
        cancelled_at = coalesce(cancelled_at, now()),
        cancellation_reason = coalesce(new.cancellation_reason, cancellation_reason)
    where booking_id = new.id
      and status in ('pending', 'confirmed');
  end if;

  return new;
end;
$$;

drop trigger if exists company_bookings_sync_occurrences on public.company_bookings;
create trigger company_bookings_sync_occurrences
after update of status on public.company_bookings
for each row execute function public.sync_company_booking_occurrences();

-- ============================================================
-- Activity timeline
-- ============================================================
create or replace function public.log_company_booking_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.company_booking_activity(
      booking_id, actor_id, event_type, to_status, metadata
    ) values (
      new.id,
      auth.uid(),
      'created',
      new.status,
      jsonb_build_object('source', new.source, 'frequency', new.frequency)
    );
    return new;
  end if;

  if old.status is distinct from new.status then
    insert into public.company_booking_activity(
      booking_id, actor_id, event_type, from_status, to_status
    ) values (
      new.id,
      auth.uid(),
      'status_changed',
      old.status,
      new.status
    );
  end if;

  if old.agreed_price is distinct from new.agreed_price then
    insert into public.company_booking_activity(
      booking_id, actor_id, event_type, metadata
    ) values (
      new.id,
      auth.uid(),
      'price_updated',
      jsonb_build_object('from', old.agreed_price, 'to', new.agreed_price)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists company_bookings_activity_insert on public.company_bookings;
create trigger company_bookings_activity_insert
after insert on public.company_bookings
for each row execute function public.log_company_booking_activity();

drop trigger if exists company_bookings_activity_update on public.company_bookings;
create trigger company_bookings_activity_update
after update on public.company_bookings
for each row execute function public.log_company_booking_activity();

create or replace function public.log_company_booking_occurrence_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.status is distinct from new.status then
    insert into public.company_booking_activity(
      booking_id,
      occurrence_id,
      actor_id,
      event_type,
      from_status,
      to_status,
      metadata
    ) values (
      new.booking_id,
      new.id,
      auth.uid(),
      'occurrence_status_changed',
      old.status,
      new.status,
      jsonb_build_object('scheduled_start', new.scheduled_start)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists company_booking_occurrences_activity_update on public.company_booking_occurrences;
create trigger company_booking_occurrences_activity_update
after update on public.company_booking_occurrences
for each row execute function public.log_company_booking_occurrence_activity();

-- ============================================================
-- RLS
-- ============================================================
alter table public.company_booking_settings enable row level security;
alter table public.company_bookings enable row level security;
alter table public.company_booking_occurrences enable row level security;
alter table public.company_booking_activity enable row level security;

-- Settings are public-readable because public booking UI needs only
-- availability configuration. Only company owners can write them.
drop policy if exists "Public can read booking settings" on public.company_booking_settings;
create policy "Public can read booking settings"
on public.company_booking_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Company owners can insert booking settings" on public.company_booking_settings;
create policy "Company owners can insert booking settings"
on public.company_booking_settings
for insert
to authenticated
with check (
  exists (
    select 1 from public.companies
    where companies.id = company_booking_settings.company_id
      and companies.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can update booking settings" on public.company_booking_settings;
create policy "Company owners can update booking settings"
on public.company_booking_settings
for update
to authenticated
using (
  exists (
    select 1 from public.companies
    where companies.id = company_booking_settings.company_id
      and companies.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.companies
    where companies.id = company_booking_settings.company_id
      and companies.owner_id = auth.uid()
  )
);

-- Booking rows are private: the logged-in customer or company owner.
drop policy if exists "Customers can read own company bookings" on public.company_bookings;
create policy "Customers can read own company bookings"
on public.company_bookings
for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "Company owners can read company bookings" on public.company_bookings;
create policy "Company owners can read company bookings"
on public.company_bookings
for select
to authenticated
using (
  exists (
    select 1 from public.companies
    where companies.id = company_bookings.company_id
      and companies.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can update company bookings" on public.company_bookings;
create policy "Company owners can update company bookings"
on public.company_bookings
for update
to authenticated
using (
  exists (
    select 1 from public.companies
    where companies.id = company_bookings.company_id
      and companies.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.companies
    where companies.id = company_bookings.company_id
      and companies.owner_id = auth.uid()
  )
);

-- Occurrences inherit booking visibility.
drop policy if exists "Customers can read own booking occurrences" on public.company_booking_occurrences;
create policy "Customers can read own booking occurrences"
on public.company_booking_occurrences
for select
to authenticated
using (
  exists (
    select 1 from public.company_bookings
    where company_bookings.id = company_booking_occurrences.booking_id
      and company_bookings.customer_id = auth.uid()
  )
);

drop policy if exists "Company owners can read booking occurrences" on public.company_booking_occurrences;
create policy "Company owners can read booking occurrences"
on public.company_booking_occurrences
for select
to authenticated
using (
  exists (
    select 1
    from public.companies
    where companies.id = company_booking_occurrences.company_id
      and companies.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can update booking occurrences" on public.company_booking_occurrences;
create policy "Company owners can update booking occurrences"
on public.company_booking_occurrences
for update
to authenticated
using (
  exists (
    select 1
    from public.companies
    where companies.id = company_booking_occurrences.company_id
      and companies.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.companies
    where companies.id = company_booking_occurrences.company_id
      and companies.owner_id = auth.uid()
  )
);

-- Timeline visibility follows the booking.
drop policy if exists "Customers can read own booking activity" on public.company_booking_activity;
create policy "Customers can read own booking activity"
on public.company_booking_activity
for select
to authenticated
using (
  exists (
    select 1 from public.company_bookings
    where company_bookings.id = company_booking_activity.booking_id
      and company_bookings.customer_id = auth.uid()
  )
);

drop policy if exists "Company owners can read booking activity" on public.company_booking_activity;
create policy "Company owners can read booking activity"
on public.company_booking_activity
for select
to authenticated
using (
  exists (
    select 1
    from public.company_bookings
    join public.companies on companies.id = company_bookings.company_id
    where company_bookings.id = company_booking_activity.booking_id
      and companies.owner_id = auth.uid()
  )
);

-- Explicit grants. Public creation happens only through trusted server actions
-- using the service-role client after validation, spam checks and conflict checks.
grant select on public.company_booking_settings to anon, authenticated;
grant insert, update on public.company_booking_settings to authenticated;
grant select, update on public.company_bookings to authenticated;
grant select, update on public.company_booking_occurrences to authenticated;
grant select on public.company_booking_activity to authenticated;

notify pgrst, 'reload schema';

commit;
