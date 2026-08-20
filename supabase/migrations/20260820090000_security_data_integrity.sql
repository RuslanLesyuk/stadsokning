begin;

-- ============================================================================
-- Clean Jobs — Stabilization 2/4: Security & Data Integrity
-- ============================================================================
-- Goals:
--   1) remove the public quote-request INSERT surface that bypassed app checks;
--   2) protect commercial / payment / verification fields with column grants;
--   3) remove the legacy "any authenticated user can take any job" RLS policy;
--   4) limit an assigned worker to status-only job updates at database level.
--
-- RLS remains the row-ownership boundary. These grants add a second boundary:
-- even a valid row owner cannot mutate privileged columns through PostgREST.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Public company quote requests
-- --------------------------------------------------------------------------
-- Creation now happens only in the validated Next.js server action through the
-- service-role client. Direct anon/authenticated INSERT is intentionally gone.
drop policy if exists "Public can create company quote requests"
  on public.company_quote_requests;

revoke all privileges on table public.company_quote_requests
  from anon, authenticated;

grant select on table public.company_quote_requests to authenticated;

grant update (
  status,
  first_viewed_at,
  viewed_by,
  priority,
  owner_notes,
  lead_score,
  estimated_value,
  quoted_value,
  lost_reason,
  follow_up_at
) on table public.company_quote_requests to authenticated;

grant all privileges on table public.company_quote_requests to service_role;

-- Activity is read-only for authenticated users. Trigger/service-role paths
-- remain responsible for creating timeline events.
revoke all privileges on table public.company_quote_request_activity
  from anon, authenticated;
grant select on table public.company_quote_request_activity to authenticated;
grant all privileges on table public.company_quote_request_activity to service_role;

-- --------------------------------------------------------------------------
-- Companies
-- --------------------------------------------------------------------------
-- Company owners may edit public business profile fields, never ownership,
-- verification, claim timestamps or calculated rating fields.
revoke all privileges on table public.companies from anon, authenticated;

grant select on table public.companies to anon, authenticated;

grant update (
  name,
  city,
  website,
  phone,
  email,
  description,
  logo_url,
  services,
  founded_year,
  address,
  cover_url,
  gallery_urls,
  service_types,
  service_areas,
  languages,
  hourly_rate,
  minimum_order,
  rut_available,
  working_hours,
  organization_number,
  postal_code,
  faq
) on table public.companies to authenticated;

grant all privileges on table public.companies to service_role;

-- --------------------------------------------------------------------------
-- Service profiles
-- --------------------------------------------------------------------------
-- verified is platform-controlled. New rows rely on the DB default false.
revoke all privileges on table public.service_profiles from anon, authenticated;

grant select on table public.service_profiles to anon, authenticated;

grant insert (
  user_id,
  company_name,
  slug,
  logo_url,
  description,
  city,
  phone,
  email,
  website,
  hourly_rate,
  minimum_order,
  rut_available,
  languages,
  service_types,
  service_areas,
  gallery_urls,
  working_hours
) on table public.service_profiles to authenticated;

grant update (
  company_name,
  logo_url,
  description,
  city,
  phone,
  email,
  website,
  hourly_rate,
  minimum_order,
  rut_available,
  languages,
  service_types,
  service_areas,
  gallery_urls,
  working_hours
) on table public.service_profiles to authenticated;

grant delete on table public.service_profiles to authenticated;
grant all privileges on table public.service_profiles to service_role;

-- --------------------------------------------------------------------------
-- Booking settings
-- --------------------------------------------------------------------------
revoke all privileges on table public.company_booking_settings
  from anon, authenticated;

grant select on table public.company_booking_settings to anon, authenticated;

grant insert (
  company_id,
  booking_enabled,
  recurring_enabled,
  min_notice_hours,
  max_days_ahead,
  default_duration_minutes,
  buffer_minutes,
  auto_confirm,
  timezone
) on table public.company_booking_settings to authenticated;

grant update (
  booking_enabled,
  recurring_enabled,
  min_notice_hours,
  max_days_ahead,
  default_duration_minutes,
  buffer_minutes,
  auto_confirm,
  timezone
) on table public.company_booking_settings to authenticated;

grant all privileges on table public.company_booking_settings to service_role;

-- --------------------------------------------------------------------------
-- Bookings
-- --------------------------------------------------------------------------
-- Public booking creation and customer cancellation already use trusted
-- service-role server paths. Company owners only receive the operational fields
-- needed by their dashboard; payment/customer identity/source fields stay
-- protected for future payment activation.
revoke all privileges on table public.company_bookings from anon, authenticated;

grant select on table public.company_bookings to authenticated;

grant update (
  status,
  agreed_price,
  confirmed_at,
  declined_at,
  completed_at,
  cancelled_at,
  cancelled_by,
  cancellation_reason
) on table public.company_bookings to authenticated;

grant all privileges on table public.company_bookings to service_role;

revoke all privileges on table public.company_booking_occurrences
  from anon, authenticated;

grant select on table public.company_booking_occurrences to authenticated;

grant update (
  status,
  price,
  confirmed_at,
  started_at,
  completed_at,
  cancelled_at,
  cancellation_reason
) on table public.company_booking_occurrences to authenticated;

grant all privileges on table public.company_booking_occurrences to service_role;

revoke all privileges on table public.company_booking_activity
  from anon, authenticated;
grant select on table public.company_booking_activity to authenticated;
grant all privileges on table public.company_booking_activity to service_role;

-- --------------------------------------------------------------------------
-- CRM Lite
-- --------------------------------------------------------------------------
-- Owners may manage CRM presentation/workflow fields for rows belonging to
-- their companies, but cannot relink a CRM row to another company/user or edit
-- canonical email identity through a direct browser API update.
revoke all privileges on table public.company_crm_customers
  from anon, authenticated;

grant select on table public.company_crm_customers to authenticated;

grant insert (
  company_id,
  customer_name,
  email,
  normalized_email,
  phone,
  city,
  lifecycle_stage,
  tags,
  owner_notes,
  follow_up_at
) on table public.company_crm_customers to authenticated;

grant update (
  customer_name,
  phone,
  city,
  lifecycle_stage,
  tags,
  owner_notes,
  follow_up_at,
  last_activity_at
) on table public.company_crm_customers to authenticated;

grant all privileges on table public.company_crm_customers to service_role;

revoke all privileges on table public.company_crm_customer_activity
  from anon, authenticated;
grant select on table public.company_crm_customer_activity to authenticated;
grant all privileges on table public.company_crm_customer_activity to service_role;

-- --------------------------------------------------------------------------
-- Jobs
-- --------------------------------------------------------------------------
-- This legacy policy defeated the current application -> owner approval flow:
-- any authenticated browser could UPDATE any job row. Remove it permanently.
drop policy if exists "Users can take jobs" on public.jobs;

-- Keep public/authenticated reads. Creation is limited to ordinary job content;
-- status, assigned_to and featured fields come only from database defaults or
-- trusted approval/payment/admin paths.
revoke all privileges on table public.jobs from anon, authenticated;

grant select on table public.jobs to anon, authenticated;

grant insert (
  created_by,
  title,
  description,
  job_type,
  property_type,
  address,
  city,
  scheduled_date,
  scheduled_time,
  budget
) on table public.jobs to authenticated;

grant update (
  title,
  description,
  job_type,
  property_type,
  address,
  city,
  scheduled_date,
  scheduled_time,
  budget,
  status
) on table public.jobs to authenticated;

grant delete on table public.jobs to authenticated;
grant all privileges on table public.jobs to service_role;

-- RLS already limits updates to either the creator or assigned user. Because
-- both use the same `authenticated` DB role, enforce the assignee's narrower
-- business capability in a trigger: assignees may progress status only.
create or replace function public.enforce_assigned_job_update_scope()
returns trigger
language plpgsql
security invoker
set search_path = public, auth
as $$
declare
  v_actor uuid := auth.uid();
begin
  -- Trusted service-role / database maintenance paths have no auth.uid().
  if v_actor is null then
    return new;
  end if;

  -- The creator is governed by the owner RLS policies + column grants above.
  if old.created_by = v_actor then
    return new;
  end if;

  if old.assigned_to = v_actor then
    if new.id is distinct from old.id
      or new.created_by is distinct from old.created_by
      or new.assigned_to is distinct from old.assigned_to
      or new.title is distinct from old.title
      or new.description is distinct from old.description
      or new.job_type is distinct from old.job_type
      or new.property_type is distinct from old.property_type
      or new.address is distinct from old.address
      or new.city is distinct from old.city
      or new.scheduled_date is distinct from old.scheduled_date
      or new.scheduled_time is distinct from old.scheduled_time
      or new.budget is distinct from old.budget
      or new.created_at is distinct from old.created_at
      or new.is_featured is distinct from old.is_featured
      or new.featured_until is distinct from old.featured_until
    then
      raise exception 'JOB_ASSIGNEE_CAN_ONLY_CHANGE_STATUS'
        using errcode = '42501';
    end if;

    return new;
  end if;

  -- RLS should prevent reaching this branch for browser users. Fail closed if
  -- policies are ever broadened again in a future migration.
  raise exception 'JOB_UPDATE_NOT_ALLOWED'
    using errcode = '42501';
end;
$$;

revoke all on function public.enforce_assigned_job_update_scope() from PUBLIC;
grant execute on function public.enforce_assigned_job_update_scope()
  to authenticated, service_role;

drop trigger if exists enforce_assigned_job_update_scope on public.jobs;
create trigger enforce_assigned_job_update_scope
before update on public.jobs
for each row
execute function public.enforce_assigned_job_update_scope();

notify pgrst, 'reload schema';

commit;
