begin;

-- ============================================================
-- Clean Jobs — Stabilization 3/4: Performance & Scale
-- ============================================================
-- 1) Scale the public company directory with server-side search/pagination.
-- 2) Collapse expensive header counters into one authenticated RPC.
-- 3) Collapse company-dashboard aggregate metrics into one owner-only RPC.
-- 4) Add indexes used by the scaled directory/admin/header workloads.
-- ============================================================

create schema if not exists extensions;
create extension if not exists pg_trgm with schema extensions;
set local search_path = public, extensions;

-- ---------------------------------------------------------------------------
-- Directory/admin search and sort indexes.
-- These are created before mass import so future growth does not require a
-- full-table scan for every directory/admin search.
-- ---------------------------------------------------------------------------

create index if not exists companies_verified_name_scale_idx
  on public.companies (verified desc, name asc);

create index if not exists companies_city_verified_name_scale_idx
  on public.companies (city, verified desc, name asc);

create index if not exists companies_name_trgm_idx
  on public.companies using gin (lower(name) gin_trgm_ops);

create index if not exists companies_city_trgm_idx
  on public.companies using gin (lower(city) gin_trgm_ops)
  where city is not null;

create index if not exists companies_description_trgm_idx
  on public.companies using gin (lower(description) gin_trgm_ops)
  where description is not null;

create index if not exists company_leads_status_created_scale_idx
  on public.company_leads (status, created_at desc);

create index if not exists company_leads_name_trgm_idx
  on public.company_leads using gin (lower(company_name) gin_trgm_ops);

create index if not exists company_leads_city_trgm_idx
  on public.company_leads using gin (lower(city) gin_trgm_ops)
  where city is not null;

create index if not exists company_leads_email_trgm_idx
  on public.company_leads using gin (lower(email) gin_trgm_ops)
  where email is not null;

create index if not exists company_leads_website_trgm_idx
  on public.company_leads using gin (lower(website) gin_trgm_ops)
  where website is not null;

create index if not exists company_quote_requests_customer_name_trgm_idx
  on public.company_quote_requests using gin (lower(customer_name) gin_trgm_ops);

create index if not exists company_quote_requests_customer_email_trgm_idx
  on public.company_quote_requests using gin (lower(customer_email) gin_trgm_ops);

create index if not exists company_quote_requests_customer_phone_trgm_idx
  on public.company_quote_requests using gin (lower(customer_phone) gin_trgm_ops)
  where customer_phone is not null;

create index if not exists company_quote_requests_service_type_trgm_idx
  on public.company_quote_requests using gin (lower(service_type) gin_trgm_ops)
  where service_type is not null;

create index if not exists company_quote_requests_city_trgm_idx
  on public.company_quote_requests using gin (lower(city) gin_trgm_ops)
  where city is not null;

create index if not exists jobs_created_by_scale_idx
  on public.jobs (created_by, created_at desc);

create index if not exists jobs_assigned_to_scale_idx
  on public.jobs (assigned_to, created_at desc)
  where assigned_to is not null;

create index if not exists messages_job_unread_scale_idx
  on public.messages (job_id, sender_id)
  where read_at is null;

-- ---------------------------------------------------------------------------
-- Public directory facets.
-- Only public directory information is returned.
-- ---------------------------------------------------------------------------

create or replace function public.get_company_directory_facets()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with normalized_cities as (
    select min(trim(city)) as city
    from public.companies
    where nullif(trim(city), '') is not null
    group by lower(trim(city))
  )
  select jsonb_build_object(
    'total_count', (select count(*) from public.companies),
    'verified_count', (
      select count(*)
      from public.companies
      where coalesce(verified, false) = true
    ),
    'city_count', (select count(*) from normalized_cities),
    'cities', coalesce(
      (select jsonb_agg(city order by city) from normalized_cities),
      '[]'::jsonb
    )
  );
$$;

revoke all on function public.get_company_directory_facets() from public;
grant execute on function public.get_company_directory_facets() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Server-side company directory search + pagination.
-- The browser never receives the full company catalog.
-- ---------------------------------------------------------------------------

create or replace function public.search_company_directory(
  p_search text default null,
  p_city text default null,
  p_status text default 'all',
  p_sort text default 'verified',
  p_offset integer default 0,
  p_limit integer default 24
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select
      c.id,
      c.name,
      c.slug,
      c.city,
      c.website,
      c.phone,
      c.email,
      c.description,
      c.logo_url,
      coalesce(c.verified, false) as verified
    from public.companies c
    where
      (
        nullif(trim(p_search), '') is null
        or c.name ilike '%' || trim(p_search) || '%'
        or coalesce(c.city, '') ilike '%' || trim(p_search) || '%'
        or coalesce(c.description, '') ilike '%' || trim(p_search) || '%'
      )
      and (
        nullif(trim(p_city), '') is null
        or lower(trim(coalesce(c.city, ''))) = lower(trim(p_city))
      )
      and (
        coalesce(p_status, 'all') = 'all'
        or (p_status = 'verified' and coalesce(c.verified, false) = true)
        or (p_status = 'website' and nullif(trim(coalesce(c.website, '')), '') is not null)
      )
  ),
  ordered as (
    select
      filtered.*,
      row_number() over (
        order by
          case when coalesce(p_sort, 'verified') = 'verified'
            then case when verified then 0 else 1 end
            else 0
          end asc,
          lower(name) asc,
          id asc
      ) as row_no
    from filtered
    order by
      case when coalesce(p_sort, 'verified') = 'verified'
        then case when verified then 0 else 1 end
        else 0
      end asc,
      lower(name) asc,
      id asc
    offset greatest(coalesce(p_offset, 0), 0)
    limit least(greatest(coalesce(p_limit, 24), 1), 60)
  )
  select jsonb_build_object(
    'total_count', (select count(*) from filtered),
    'items', coalesce(
      (
        select jsonb_agg(to_jsonb(ordered) - 'row_no' order by row_no)
        from ordered
      ),
      '[]'::jsonb
    )
  );
$$;

revoke all on function public.search_company_directory(text, text, text, text, integer, integer) from public;
grant execute on function public.search_company_directory(text, text, text, text, integer, integer)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
-- One authenticated header snapshot instead of 5-8 application queries.
-- The function is user-scoped exclusively through auth.uid().
-- ---------------------------------------------------------------------------

create or replace function public.get_header_snapshot()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with viewer as (
    select auth.uid() as uid
  ),
  primary_company as (
    select c.id, c.name, c.logo_url
    from public.companies c, viewer v
    where v.uid is not null
      and c.owner_id = v.uid
    order by c.name asc
    limit 1
  )
  select case
    when v.uid is null then '{}'::jsonb
    else jsonb_build_object(
      'full_name', p.full_name,
      'avatar_url', p.avatar_url,
      'profile_company_name', p.company_name,
      'profile_company_logo_url', p.company_logo_url,
      'primary_company_name', (select name from primary_company),
      'primary_company_logo_url', (select logo_url from primary_company),
      'has_owned_company', exists (
        select 1 from public.companies c where c.owner_id = v.uid
      ),
      'unread_notifications_count', (
        select count(*)
        from public.notifications n
        where n.user_id = v.uid
          and n.is_read = false
      ),
      'active_claims_count', (
        select count(*)
        from public.company_claim_requests cr
        where cr.user_id = v.uid
          and cr.status in ('pending', 'needs_info')
      ),
      'new_company_leads_count', (
        select count(*)
        from public.company_quote_requests q
        join public.companies c on c.id = q.company_id
        where c.owner_id = v.uid
          and q.status = 'new'
      ),
      'pending_company_bookings_count', (
        select count(*)
        from public.company_bookings b
        join public.companies c on c.id = b.company_id
        where c.owner_id = v.uid
          and b.status = 'pending'
      ),
      'unread_messages_count', (
        select count(*)
        from public.messages m
        join public.jobs j on j.id = m.job_id
        where (j.created_by = v.uid or j.assigned_to = v.uid)
          and m.sender_id <> v.uid
          and m.read_at is null
      )
    )
  end
  from viewer v
  left join public.profiles p on p.id = v.uid;
$$;

revoke all on function public.get_header_snapshot() from public, anon;
grant execute on function public.get_header_snapshot() to authenticated;

-- ---------------------------------------------------------------------------
-- One owner-only company dashboard aggregate snapshot.
-- Recent rows remain normal RLS queries so UI data stays simple and readable.
-- ---------------------------------------------------------------------------

create or replace function public.get_company_dashboard_metrics(
  p_company_id uuid,
  p_now timestamptz default now()
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_month_start timestamptz;
  v_month_end timestamptz;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if not exists (
    select 1
    from public.companies c
    where c.id = p_company_id
      and c.owner_id = v_user_id
  ) then
    raise exception 'COMPANY_ACCESS_DENIED' using errcode = '42501';
  end if;

  v_month_start := date_trunc('month', p_now at time zone 'Europe/Stockholm')
    at time zone 'Europe/Stockholm';
  v_month_end := (
    date_trunc('month', p_now at time zone 'Europe/Stockholm') + interval '1 month'
  ) at time zone 'Europe/Stockholm';

  return jsonb_build_object(
    'total_leads', (
      select count(*)
      from public.company_quote_requests q
      where q.company_id = p_company_id
    ),
    'new_leads', (
      select count(*)
      from public.company_quote_requests q
      where q.company_id = p_company_id
        and q.status = 'new'
    ),
    'won_leads', (
      select count(*)
      from public.company_quote_requests q
      where q.company_id = p_company_id
        and q.status = 'won'
    ),
    'crm_customers', (
      select count(*)
      from public.company_crm_customers c
      where c.company_id = p_company_id
        and c.lifecycle_stage <> 'inactive'
    ),
    'crm_follow_ups_due', (
      select count(*)
      from public.company_crm_customers c
      where c.company_id = p_company_id
        and c.lifecycle_stage <> 'inactive'
        and c.follow_up_at is not null
        and c.follow_up_at <= p_now
    ),
    'pipeline_value', coalesce((
      select sum(coalesce(q.quoted_value, q.estimated_value, 0))
      from public.company_quote_requests q
      where q.company_id = p_company_id
        and q.status in ('new', 'viewed', 'contacted', 'qualified', 'quoted')
    ), 0),
    'pending_bookings', (
      select count(*)
      from public.company_bookings b
      where b.company_id = p_company_id
        and b.status = 'pending'
    ),
    'next_seven_days', (
      select count(*)
      from public.company_booking_occurrences o
      where o.company_id = p_company_id
        and o.status in ('confirmed', 'in_progress')
        and o.scheduled_start >= p_now
        and o.scheduled_start < p_now + interval '7 days'
    ),
    'month_revenue', coalesce((
      select sum(coalesce(o.price, 0))
      from public.company_booking_occurrences o
      where o.company_id = p_company_id
        and o.status = 'completed'
        and o.completed_at >= v_month_start
        and o.completed_at < v_month_end
    ), 0)
  );
end;
$$;

revoke all on function public.get_company_dashboard_metrics(uuid, timestamptz) from public, anon;
grant execute on function public.get_company_dashboard_metrics(uuid, timestamptz) to authenticated;

notify pgrst, 'reload schema';

commit;
