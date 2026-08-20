


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."accept_job_application"("p_application_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_application public.job_applications%rowtype;
  v_job public.jobs%rowtype;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'You must be logged in.';
  end if;

  select *
  into v_application
  from public.job_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found.';
  end if;

  select *
  into v_job
  from public.jobs
  where id = v_application.job_id
  for update;

  if not found then
    raise exception 'Job not found.';
  end if;

  if v_job.created_by is distinct from v_user_id then
    raise exception 'Only the job owner can accept applications.';
  end if;

  if v_application.status <> 'pending' then
    raise exception 'Only pending applications can be accepted.';
  end if;

  if v_job.status <> 'new' then
    raise exception 'This job is no longer open.';
  end if;

  if v_job.assigned_to is not null then
    raise exception 'This job already has an assigned worker.';
  end if;

  update public.jobs
  set
    assigned_to = v_application.applicant_id,
    status = 'assigned'
  where id = v_job.id
    and status = 'new'
    and assigned_to is null;

  if not found then
    raise exception 'The job could not be assigned.';
  end if;

  update public.job_applications
  set status = 'accepted'
  where id = v_application.id
    and status = 'pending';

  if not found then
    raise exception 'The application could not be accepted.';
  end if;

  update public.job_applications
  set status = 'rejected'
  where job_id = v_job.id
    and id <> v_application.id
    and status = 'pending';

  return jsonb_build_object(
    'success', true,
    'job_id', v_job.id,
    'application_id', v_application.id,
    'assigned_to', v_application.applicant_id
  );
end;
$$;


ALTER FUNCTION "public"."accept_job_application"("p_application_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."approve_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  claim_row public.company_claim_requests%rowtype;
  company_owner uuid;
begin
  select *
  into claim_row
  from public.company_claim_requests
  where id = claim_request_id
  for update;

  if not found then
    raise exception 'Claim request not found.';
  end if;

  if claim_row.status not in ('pending', 'needs_info') then
    raise exception 'This claim has already been reviewed.';
  end if;

  select owner_id
  into company_owner
  from public.companies
  where id = claim_row.company_id
  for update;

  if not found then
    raise exception 'Company not found.';
  end if;

  if company_owner is not null and company_owner <> claim_row.user_id then
    raise exception 'This company already belongs to another account.';
  end if;

  update public.companies
  set
    owner_id = claim_row.user_id,
    verified = true,
    claimed_at = coalesce(claimed_at, now())
  where id = claim_row.company_id;

  update public.company_claim_requests
  set
    status = 'approved',
    reviewed_by = reviewer_user_id,
    reviewed_at = now(),
    admin_note = null
  where id = claim_request_id;

  insert into public.company_claim_audit (
    claim_id,
    company_id,
    user_id,
    actor_id,
    action,
    note
  )
  values (
    claim_row.id,
    claim_row.company_id,
    claim_row.user_id,
    reviewer_user_id,
    'approved',
    'Company ownership approved.'
  );

  -- Other active claims for the same company can no longer be approved.
  insert into public.company_claim_audit (
    claim_id,
    company_id,
    user_id,
    actor_id,
    action,
    note
  )
  select
    id,
    company_id,
    user_id,
    reviewer_user_id,
    'auto_rejected_competing_claim',
    'Another verified claim for this company was approved.'
  from public.company_claim_requests
  where company_id = claim_row.company_id
    and id <> claim_row.id
    and status in ('pending', 'needs_info');

  update public.company_claim_requests
  set
    status = 'rejected',
    admin_note = 'Another verified claim for this company was approved.',
    reviewed_by = reviewer_user_id,
    reviewed_at = now()
  where company_id = claim_row.company_id
    and id <> claim_row.id
    and status in ('pending', 'needs_info');
end;
$$;


ALTER FUNCTION "public"."approve_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."consume_security_rate_limit"("p_action" "text", "p_key_hash" "text", "p_limit" integer, "p_window_seconds" integer) RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_window_start timestamptz;
  v_hits integer;
begin
  if p_action is null or length(trim(p_action)) = 0 or length(p_action) > 80 then
    raise exception 'invalid rate-limit action';
  end if;

  if p_key_hash is null or length(p_key_hash) <> 64 then
    raise exception 'invalid rate-limit key';
  end if;

  if p_limit < 1 or p_limit > 10000 then
    raise exception 'invalid rate-limit limit';
  end if;

  if p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'invalid rate-limit window';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.security_rate_limits (
    action,
    key_hash,
    window_start,
    hits,
    updated_at
  )
  values (
    trim(p_action),
    p_key_hash,
    v_window_start,
    1,
    now()
  )
  on conflict (action, key_hash, window_start)
  do update set
    hits = public.security_rate_limits.hits + 1,
    updated_at = now()
  returning hits into v_hits;

  -- Opportunistic cleanup; old buckets are not business data.
  delete from public.security_rate_limits
  where updated_at < now() - interval '2 days';

  return v_hits <= p_limit;
end;
$$;


ALTER FUNCTION "public"."consume_security_rate_limit"("p_action" "text", "p_key_hash" "text", "p_limit" integer, "p_window_seconds" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."enforce_company_site_premium_features"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_actor uuid := auth.uid();
  v_owner uuid;
  v_is_premium boolean := false;
begin
  -- Service-role / database maintenance paths have no auth.uid().
  if v_actor is null then
    return new;
  end if;

  select c.owner_id into v_owner
  from public.companies c
  where c.id = new.company_id;

  if v_owner is null or v_owner <> v_actor then
    return new;
  end if;

  v_is_premium := coalesce(public.user_has_premium(v_owner), false);
  if v_is_premium then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.template <> 'modern' then
      raise exception 'premium_required: advanced_template'
        using errcode = 'P0001';
    end if;

    if cardinality(new.enabled_locales) > 1 then
      raise exception 'premium_required: multiple_languages'
        using errcode = 'P0001';
    end if;

    if new.custom_domain is not null then
      raise exception 'premium_required: custom_domain'
        using errcode = 'P0001';
    end if;

    if new.remove_clean_jobs_branding = true then
      raise exception 'premium_required: remove_branding'
        using errcode = 'P0001';
    end if;

    return new;
  end if;

  if new.template <> 'modern' and new.template is distinct from old.template then
    raise exception 'premium_required: advanced_template'
      using errcode = 'P0001';
  end if;

  if cardinality(new.enabled_locales) > 1
     and new.enabled_locales is distinct from old.enabled_locales then
    raise exception 'premium_required: multiple_languages'
      using errcode = 'P0001';
  end if;

  if new.custom_domain is not null
     and new.custom_domain is distinct from old.custom_domain then
    raise exception 'premium_required: custom_domain'
      using errcode = 'P0001';
  end if;

  if new.remove_clean_jobs_branding = true
     and old.remove_clean_jobs_branding = false then
    raise exception 'premium_required: remove_branding'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."enforce_company_site_premium_features"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_company_booking_settings"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if new.owner_id is not null then
    insert into public.company_booking_settings(company_id)
    values (new.id)
    on conflict (company_id) do nothing;
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."ensure_company_booking_settings"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_crm_customer_company_match"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."ensure_crm_customer_company_match"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_company_booking_occurrences"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."generate_company_booking_occurrences"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."guard_company_booking_occurrence_conflict"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."guard_company_booking_occurrence_conflict"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_job_activity_for_jobs"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if tg_op = 'INSERT' then
    insert into public.job_activity (
      job_id,
      actor_id,
      event_type,
      new_status,
      metadata
    )
    values (
      new.id,
      new.created_by,
      'job_created',
      new.status,
      jsonb_build_object(
        'title', new.title,
        'created_by', new.created_by
      )
    );

    return new;
  end if;

  if tg_op = 'UPDATE' then
    if new.assigned_to is distinct from old.assigned_to
       and new.assigned_to is not null then
      insert into public.job_activity (
        job_id,
        actor_id,
        event_type,
        metadata
      )
      values (
        new.id,
        coalesce(auth.uid(), new.assigned_to),
        'job_assigned',
        jsonb_build_object(
          'assigned_to', new.assigned_to
        )
      );
    end if;

    if new.status is distinct from old.status then
      insert into public.job_activity (
        job_id,
        actor_id,
        event_type,
        old_status,
        new_status,
        metadata
      )
      values (
        new.id,
        auth.uid(),
        'status_changed',
        old.status,
        new.status,
        '{}'::jsonb
      );
    end if;

    return new;
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_job_activity_for_jobs"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_job_activity_for_reviews"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  insert into public.job_activity (
    job_id,
    actor_id,
    event_type,
    metadata
  )
  values (
    new.job_id,
    new.reviewer_id,
    'review_left',
    jsonb_build_object(
      'reviewee_id', new.reviewee_id,
      'rating', new.rating
    )
  );

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_job_activity_for_reviews"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (
    id,
    full_name,
    created_at
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1),
      'User'
    ),
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_company_booking_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."log_company_booking_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_company_booking_occurrence_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."log_company_booking_occurrence_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_company_crm_customer_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."log_company_crm_customer_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."log_company_quote_request_activity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, to_status, metadata, created_at
    ) values (
      new.id,
      v_actor,
      'created',
      new.status,
      jsonb_build_object('source', new.source, 'lead_type', new.lead_type),
      new.created_at
    );
    return new;
  end if;

  if old.first_viewed_at is null and new.first_viewed_at is not null then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      coalesce(new.viewed_by, v_actor),
      'viewed',
      '{}'::jsonb
    );
  end if;

  if new.status is distinct from old.status then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, from_status, to_status
    ) values (
      new.id, v_actor, 'status_changed', old.status, new.status
    );
  end if;

  if new.priority is distinct from old.priority then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'priority_changed',
      jsonb_build_object('from', old.priority, 'to', new.priority)
    );
  end if;

  if new.owner_notes is distinct from old.owner_notes then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (new.id, v_actor, 'notes_updated', '{}'::jsonb);
  end if;

  if new.lead_score is distinct from old.lead_score then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'score_updated',
      jsonb_build_object('from', old.lead_score, 'to', new.lead_score)
    );
  end if;

  if new.estimated_value is distinct from old.estimated_value
     or new.quoted_value is distinct from old.quoted_value then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'value_updated',
      jsonb_build_object(
        'estimated_value', new.estimated_value,
        'quoted_value', new.quoted_value,
        'currency', new.currency
      )
    );
  end if;

  if new.follow_up_at is distinct from old.follow_up_at then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'follow_up_changed',
      jsonb_build_object('follow_up_at', new.follow_up_at)
    );
  end if;

  if new.lost_reason is distinct from old.lost_reason then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (new.id, v_actor, 'lost_reason_updated', '{}'::jsonb);
  end if;

  if new.lead_access is distinct from old.lead_access
     or new.is_paid is distinct from old.is_paid
     or new.lead_price is distinct from old.lead_price
     or new.unlocked_at is distinct from old.unlocked_at then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'access_updated',
      jsonb_build_object(
        'lead_access', new.lead_access,
        'is_paid', new.is_paid,
        'lead_price', new.lead_price,
        'unlocked_at', new.unlocked_at
      )
    );
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."log_company_quote_request_activity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reject_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "rejection_note" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  claim_row public.company_claim_requests%rowtype;
  clean_note text;
begin
  clean_note := nullif(trim(rejection_note), '');

  if clean_note is null or length(clean_note) < 5 then
    raise exception 'A rejection reason of at least 5 characters is required.';
  end if;

  select *
  into claim_row
  from public.company_claim_requests
  where id = claim_request_id
  for update;

  if not found then
    raise exception 'Claim request not found.';
  end if;

  if claim_row.status not in ('pending', 'needs_info') then
    raise exception 'This claim has already been reviewed.';
  end if;

  update public.company_claim_requests
  set
    status = 'rejected',
    admin_note = clean_note,
    reviewed_by = reviewer_user_id,
    reviewed_at = now()
  where id = claim_request_id;

  insert into public.company_claim_audit (
    claim_id,
    company_id,
    user_id,
    actor_id,
    action,
    note
  )
  values (
    claim_row.id,
    claim_row.company_id,
    claim_row.user_id,
    reviewer_user_id,
    'rejected',
    clean_note
  );
end;
$$;


ALTER FUNCTION "public"."reject_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "rejection_note" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reject_job_application"("p_application_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_user_id uuid;
  v_application public.job_applications%rowtype;
  v_job public.jobs%rowtype;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'You must be logged in.';
  end if;

  select *
  into v_application
  from public.job_applications
  where id = p_application_id
  for update;

  if not found then
    raise exception 'Application not found.';
  end if;

  select *
  into v_job
  from public.jobs
  where id = v_application.job_id;

  if not found then
    raise exception 'Job not found.';
  end if;

  if v_job.created_by <> v_user_id then
    raise exception 'Only the job owner can reject applications.';
  end if;

  if v_application.status <> 'pending' then
    raise exception 'Only pending applications can be rejected.';
  end if;

  update public.job_applications
  set status = 'rejected'
  where id = v_application.id
    and status = 'pending';

  if not found then
    raise exception 'The application could not be rejected.';
  end if;

  return jsonb_build_object(
    'success', true,
    'job_id', v_application.job_id,
    'application_id', v_application.id
  );
end;
$$;


ALTER FUNCTION "public"."reject_job_application"("p_application_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."request_more_info_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "request_note" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  claim_row public.company_claim_requests%rowtype;
  clean_note text;
begin
  clean_note := nullif(trim(request_note), '');

  if clean_note is null or length(clean_note) < 5 then
    raise exception 'Explain what additional information is required.';
  end if;

  select *
  into claim_row
  from public.company_claim_requests
  where id = claim_request_id
  for update;

  if not found then
    raise exception 'Claim request not found.';
  end if;

  if claim_row.status not in ('pending', 'needs_info') then
    raise exception 'This claim has already been reviewed.';
  end if;

  update public.company_claim_requests
  set
    status = 'needs_info',
    admin_note = clean_note,
    reviewed_by = reviewer_user_id,
    reviewed_at = null,
    requested_info_at = now()
  where id = claim_request_id;

  insert into public.company_claim_audit (
    claim_id,
    company_id,
    user_id,
    actor_id,
    action,
    note
  )
  values (
    claim_row.id,
    claim_row.company_id,
    claim_row.user_id,
    reviewer_user_id,
    'needs_info',
    clean_note
  );
end;
$$;


ALTER FUNCTION "public"."request_more_info_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "request_note" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_companies_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_companies_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_company_claim_request_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_company_claim_request_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_company_claim_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_company_claim_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_company_quote_requests_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_company_quote_requests_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_company_sites_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_company_sites_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_job_application_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_job_application_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_company_booking_occurrences"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."sync_company_booking_occurrences"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_crm_customer_from_booking"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."sync_crm_customer_from_booking"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_crm_customer_from_quote_request"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."sync_crm_customer_from_quote_request"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_billing_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."touch_billing_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_company_booking_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."touch_company_booking_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_company_crm_customer"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.normalized_email = lower(trim(new.email));
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."touch_company_crm_customer"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_company_quote_request"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  new.last_activity_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."touch_company_quote_request"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_company_leads_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."update_company_leads_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
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


ALTER FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_premium"("target_user_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
  select
    coalesce(p.premium_override_until > now(), false)
    or exists (
      select 1
      from public.billing_subscriptions b
      where b.user_id = target_user_id
        and (
          b.status in ('active', 'trialing')
          or (b.status = 'past_due' and b.grace_until > now())
          or (
            b.status = 'legacy'
            and coalesce(p.is_premium, false) = true
            and (b.current_period_end is null or b.current_period_end > now())
          )
        )
    )
    or (
      coalesce(p.is_premium, false) = true
      and coalesce(p.premium_source, 'none') = 'legacy'
      and (p.subscription_ends_at is null or p.subscription_ends_at > now())
    )
  from public.profiles p
  where p.id = target_user_id;
$$;


ALTER FUNCTION "public"."user_has_premium"("target_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validate_review_entity"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if new.entity_type = 'job' then
    if not exists (
      select 1
      from public.jobs
      where id = new.entity_id
    ) then
      raise exception 'Review job does not exist';
    end if;

  elsif new.entity_type = 'service' then
    if not exists (
      select 1
      from public.service_profiles
      where id = new.entity_id
    ) then
      raise exception 'Review service does not exist';
    end if;

  elsif new.entity_type = 'company' then
    if not exists (
      select 1
      from public.companies
      where id = new.entity_id
    ) then
      raise exception 'Review company does not exist';
    end if;

  else
    raise exception 'Unsupported review entity type';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."validate_review_entity"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."billing_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "plan" "text" DEFAULT 'premium'::"text" NOT NULL,
    "billing_interval" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "price_id" "text",
    "status" "text" DEFAULT 'inactive'::"text" NOT NULL,
    "cancel_at_period_end" boolean DEFAULT false NOT NULL,
    "current_period_end" timestamp with time zone,
    "grace_until" timestamp with time zone,
    "last_invoice_id" "text",
    "last_invoice_status" "text",
    "last_payment_failed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "billing_subscriptions_interval_check" CHECK (("billing_interval" = ANY (ARRAY['monthly'::"text", 'yearly'::"text", 'unknown'::"text"]))),
    CONSTRAINT "billing_subscriptions_plan_check" CHECK (("plan" = 'premium'::"text")),
    CONSTRAINT "billing_subscriptions_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'trialing'::"text", 'past_due'::"text", 'unpaid'::"text", 'canceled'::"text", 'incomplete'::"text", 'incomplete_expired'::"text", 'paused'::"text", 'legacy'::"text", 'inactive'::"text"])))
);


ALTER TABLE "public"."billing_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."billing_transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "kind" "text" DEFAULT 'subscription'::"text" NOT NULL,
    "reference_id" "text",
    "stripe_event_id" "text",
    "stripe_invoice_id" "text",
    "stripe_checkout_session_id" "text",
    "amount_minor" bigint,
    "currency" "text" DEFAULT 'SEK'::"text" NOT NULL,
    "status" "text" NOT NULL,
    "paid_at" timestamp with time zone,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "billing_transactions_amount_check" CHECK ((("amount_minor" IS NULL) OR ("amount_minor" >= 0))),
    CONSTRAINT "billing_transactions_kind_check" CHECK (("kind" = ANY (ARRAY['subscription'::"text", 'lead'::"text", 'booking'::"text", 'featured_job'::"text", 'other'::"text"])))
);


ALTER TABLE "public"."billing_transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."billing_webhook_events" (
    "event_id" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "livemode" boolean DEFAULT false NOT NULL,
    "status" "text" DEFAULT 'processing'::"text" NOT NULL,
    "error_message" "text",
    "stripe_created_at" timestamp with time zone,
    "processed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "billing_webhook_events_status_check" CHECK (("status" = ANY (ARRAY['processing'::"text", 'processed'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."billing_webhook_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "city" "text",
    "website" "text",
    "phone" "text",
    "email" "text",
    "description" "text",
    "logo_url" "text",
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "services" "text",
    "founded_year" integer,
    "rating" numeric,
    "address" "text",
    "owner_id" "uuid",
    "claimed_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "cover_url" "text",
    "gallery_urls" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "service_types" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "service_areas" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "languages" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "hourly_rate" integer,
    "minimum_order" integer,
    "rut_available" boolean DEFAULT false NOT NULL,
    "working_hours" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "organization_number" "text",
    "postal_code" "text",
    "faq" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    CONSTRAINT "companies_founded_year_valid" CHECK ((("founded_year" IS NULL) OR (("founded_year" >= 1800) AND ("founded_year" <= 2100)))),
    CONSTRAINT "companies_hourly_rate_non_negative" CHECK ((("hourly_rate" IS NULL) OR ("hourly_rate" >= 0))),
    CONSTRAINT "companies_minimum_order_non_negative" CHECK ((("minimum_order" IS NULL) OR ("minimum_order" >= 0)))
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_booking_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid" NOT NULL,
    "occurrence_id" "uuid",
    "actor_id" "uuid",
    "event_type" "text" NOT NULL,
    "from_status" "text",
    "to_status" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."company_booking_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_booking_occurrences" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "booking_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "sequence_no" integer NOT NULL,
    "scheduled_start" timestamp with time zone NOT NULL,
    "scheduled_end" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "price" numeric(12,2),
    "confirmed_at" timestamp with time zone,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "cancellation_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "company_booking_occurrences_price_check" CHECK ((("price" IS NULL) OR ("price" >= (0)::numeric))),
    CONSTRAINT "company_booking_occurrences_sequence_check" CHECK (("sequence_no" >= 1)),
    CONSTRAINT "company_booking_occurrences_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'in_progress'::"text", 'completed'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "company_booking_occurrences_time_check" CHECK (("scheduled_end" > "scheduled_start"))
);


ALTER TABLE "public"."company_booking_occurrences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_booking_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "booking_enabled" boolean DEFAULT false NOT NULL,
    "recurring_enabled" boolean DEFAULT true NOT NULL,
    "min_notice_hours" integer DEFAULT 24 NOT NULL,
    "max_days_ahead" integer DEFAULT 90 NOT NULL,
    "default_duration_minutes" integer DEFAULT 180 NOT NULL,
    "buffer_minutes" integer DEFAULT 30 NOT NULL,
    "auto_confirm" boolean DEFAULT false NOT NULL,
    "timezone" "text" DEFAULT 'Europe/Stockholm'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "company_booking_settings_buffer_check" CHECK ((("buffer_minutes" >= 0) AND ("buffer_minutes" <= 240))),
    CONSTRAINT "company_booking_settings_duration_check" CHECK ((("default_duration_minutes" >= 30) AND ("default_duration_minutes" <= 1440))),
    CONSTRAINT "company_booking_settings_max_days_check" CHECK ((("max_days_ahead" >= 1) AND ("max_days_ahead" <= 365))),
    CONSTRAINT "company_booking_settings_min_notice_check" CHECK ((("min_notice_hours" >= 0) AND ("min_notice_hours" <= 720))),
    CONSTRAINT "company_booking_settings_timezone_check" CHECK ((("length"(TRIM(BOTH FROM "timezone")) >= 1) AND ("length"(TRIM(BOTH FROM "timezone")) <= 100)))
);


ALTER TABLE "public"."company_booking_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "customer_id" "uuid",
    "quote_request_id" "uuid",
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "customer_phone" "text",
    "service_type" "text" NOT NULL,
    "address" "text" NOT NULL,
    "postal_code" "text",
    "city" "text" NOT NULL,
    "frequency" "text" DEFAULT 'one_time'::"text" NOT NULL,
    "start_date" "date" NOT NULL,
    "preferred_time" time without time zone NOT NULL,
    "duration_minutes" integer DEFAULT 180 NOT NULL,
    "rut_requested" boolean DEFAULT false NOT NULL,
    "customer_notes" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "estimated_price" numeric(12,2),
    "agreed_price" numeric(12,2),
    "currency" "text" DEFAULT 'SEK'::"text" NOT NULL,
    "source" "text" DEFAULT 'company_profile'::"text" NOT NULL,
    "source_url" "text",
    "timezone" "text" DEFAULT 'Europe/Stockholm'::"text" NOT NULL,
    "payment_status" "text" DEFAULT 'unpaid'::"text" NOT NULL,
    "stripe_payment_intent_id" "text",
    "confirmed_at" timestamp with time zone,
    "declined_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "cancelled_by" "uuid",
    "cancellation_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "payment_required" boolean DEFAULT false NOT NULL,
    "payment_amount" numeric(12,2),
    "platform_fee_amount" numeric(12,2),
    "platform_fee_percent" numeric(7,4),
    "paid_at" timestamp with time zone,
    "refunded_at" timestamp with time zone,
    "stripe_checkout_session_id" "text",
    "crm_customer_id" "uuid",
    CONSTRAINT "company_bookings_address_check" CHECK ((("length"(TRIM(BOTH FROM "address")) >= 1) AND ("length"(TRIM(BOTH FROM "address")) <= 500))),
    CONSTRAINT "company_bookings_city_check" CHECK ((("length"(TRIM(BOTH FROM "city")) >= 1) AND ("length"(TRIM(BOTH FROM "city")) <= 200))),
    CONSTRAINT "company_bookings_currency_check" CHECK (("currency" = 'SEK'::"text")),
    CONSTRAINT "company_bookings_duration_check" CHECK ((("duration_minutes" >= 30) AND ("duration_minutes" <= 1440))),
    CONSTRAINT "company_bookings_email_check" CHECK ((POSITION(('@'::"text") IN ("customer_email")) > 1)),
    CONSTRAINT "company_bookings_frequency_check" CHECK (("frequency" = ANY (ARRAY['one_time'::"text", 'weekly'::"text", 'biweekly'::"text", 'monthly'::"text"]))),
    CONSTRAINT "company_bookings_name_check" CHECK ((("length"(TRIM(BOTH FROM "customer_name")) >= 1) AND ("length"(TRIM(BOTH FROM "customer_name")) <= 200))),
    CONSTRAINT "company_bookings_payment_amount_check" CHECK ((("payment_amount" IS NULL) OR ("payment_amount" >= (0)::numeric))),
    CONSTRAINT "company_bookings_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['unpaid'::"text", 'pending'::"text", 'paid'::"text", 'refunded'::"text", 'failed'::"text"]))),
    CONSTRAINT "company_bookings_platform_fee_amount_check" CHECK ((("platform_fee_amount" IS NULL) OR ("platform_fee_amount" >= (0)::numeric))),
    CONSTRAINT "company_bookings_platform_fee_percent_check" CHECK ((("platform_fee_percent" IS NULL) OR (("platform_fee_percent" >= (0)::numeric) AND ("platform_fee_percent" <= (100)::numeric)))),
    CONSTRAINT "company_bookings_price_check" CHECK (((("estimated_price" IS NULL) OR ("estimated_price" >= (0)::numeric)) AND (("agreed_price" IS NULL) OR ("agreed_price" >= (0)::numeric)))),
    CONSTRAINT "company_bookings_service_check" CHECK ((("length"(TRIM(BOTH FROM "service_type")) >= 1) AND ("length"(TRIM(BOTH FROM "service_type")) <= 200))),
    CONSTRAINT "company_bookings_source_check" CHECK (("source" = ANY (ARRAY['company_profile'::"text", 'company_site'::"text", 'lead_conversion'::"text", 'manual'::"text", 'admin'::"text"]))),
    CONSTRAINT "company_bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'in_progress'::"text", 'completed'::"text", 'declined'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."company_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_claim_audit" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "claim_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "action" "text" NOT NULL,
    "note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."company_claim_audit" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_claim_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "business_email" "text",
    "business_phone" "text",
    "message" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "admin_note" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "reviewed_at" timestamp with time zone,
    "reviewed_by" "uuid",
    "evidence_paths" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "locale" "text" DEFAULT 'sv'::"text" NOT NULL,
    "business_email_domain" "text",
    "company_domain" "text",
    "email_domain_match" boolean DEFAULT false NOT NULL,
    "requested_info_at" timestamp with time zone,
    "cancelled_at" timestamp with time zone,
    "resubmitted_at" timestamp with time zone,
    CONSTRAINT "company_claim_requests_locale_check" CHECK (("locale" = ANY (ARRAY['sv'::"text", 'en'::"text", 'uk'::"text", 'ru'::"text", 'pl'::"text"]))),
    CONSTRAINT "company_claim_requests_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'needs_info'::"text", 'approved'::"text", 'rejected'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."company_claim_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_crm_customer_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "crm_customer_id" "uuid" NOT NULL,
    "company_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "event_type" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."company_crm_customer_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_crm_customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "customer_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "normalized_email" "text" NOT NULL,
    "phone" "text",
    "city" "text",
    "lifecycle_stage" "text" DEFAULT 'prospect'::"text" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "owner_notes" "text",
    "follow_up_at" timestamp with time zone,
    "first_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_seen_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_activity_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "company_crm_customers_email_check" CHECK (((("length"(TRIM(BOTH FROM "email")) >= 3) AND ("length"(TRIM(BOTH FROM "email")) <= 320)) AND (POSITION(('@'::"text") IN ("email")) > 1))),
    CONSTRAINT "company_crm_customers_name_check" CHECK ((("length"(TRIM(BOTH FROM "customer_name")) >= 1) AND ("length"(TRIM(BOTH FROM "customer_name")) <= 200))),
    CONSTRAINT "company_crm_customers_normalized_email_check" CHECK (("normalized_email" = "lower"(TRIM(BOTH FROM "email")))),
    CONSTRAINT "company_crm_customers_notes_check" CHECK ((("owner_notes" IS NULL) OR ("length"("owner_notes") <= 10000))),
    CONSTRAINT "company_crm_customers_stage_check" CHECK (("lifecycle_stage" = ANY (ARRAY['prospect'::"text", 'customer'::"text", 'vip'::"text", 'inactive'::"text"]))),
    CONSTRAINT "company_crm_customers_tags_check" CHECK ((COALESCE("array_length"("tags", 1), 0) <= 20))
);


ALTER TABLE "public"."company_crm_customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_name" "text" NOT NULL,
    "city" "text",
    "website" "text",
    "email" "text",
    "phone" "text",
    "source" "text",
    "notes" "text",
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "invited_at" timestamp with time zone,
    "last_invited_at" timestamp with time zone,
    "invite_count" integer DEFAULT 0 NOT NULL,
    "registered" boolean DEFAULT false NOT NULL,
    "registered_user_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "email_checked_at" timestamp with time zone,
    "email_scan_status" "text" DEFAULT 'never_scanned'::"text" NOT NULL,
    "email_scan_error" "text",
    "email_source" "text",
    "email_source_url" "text",
    CONSTRAINT "company_leads_email_scan_status_check" CHECK (("email_scan_status" = ANY (ARRAY['never_scanned'::"text", 'found'::"text", 'not_found'::"text", 'timeout'::"text", 'invalid_site'::"text", 'failed'::"text"]))),
    CONSTRAINT "company_leads_email_source_check" CHECK ((("email_source" IS NULL) OR ("email_source" = ANY (ARRAY['homepage'::"text", 'contact'::"text", 'json_ld'::"text", 'mailto'::"text", 'cloudflare'::"text", 'javascript'::"text", 'robots'::"text", 'sitemap'::"text"])))),
    CONSTRAINT "company_leads_invite_count_check" CHECK (("invite_count" >= 0)),
    CONSTRAINT "company_leads_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'invited'::"text", 'opened'::"text", 'registered'::"text", 'ignored'::"text"])))
);


ALTER TABLE "public"."company_leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_quote_request_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "quote_request_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "event_type" "text" NOT NULL,
    "from_status" "text",
    "to_status" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."company_quote_request_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_quote_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "user_id" "uuid",
    "customer_name" "text" NOT NULL,
    "customer_email" "text" NOT NULL,
    "customer_phone" "text",
    "service_type" "text",
    "city" "text",
    "preferred_date" "date",
    "message" "text" NOT NULL,
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "priority" "text" DEFAULT 'normal'::"text" NOT NULL,
    "lead_type" "text" DEFAULT 'direct'::"text" NOT NULL,
    "source" "text" DEFAULT 'company_profile'::"text" NOT NULL,
    "source_url" "text",
    "source_site_id" "uuid",
    "first_viewed_at" timestamp with time zone,
    "viewed_by" "uuid",
    "owner_notes" "text",
    "lead_score" smallint,
    "estimated_value" numeric(12,2),
    "quoted_value" numeric(12,2),
    "currency" "text" DEFAULT 'SEK'::"text" NOT NULL,
    "lost_reason" "text",
    "follow_up_at" timestamp with time zone,
    "lead_access" "text" DEFAULT 'included'::"text" NOT NULL,
    "is_paid" boolean DEFAULT false NOT NULL,
    "lead_price" numeric(10,2),
    "unlocked_at" timestamp with time zone,
    "last_activity_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "stripe_checkout_session_id" "text",
    "stripe_payment_intent_id" "text",
    "paid_at" timestamp with time zone,
    "purchased_by" "uuid",
    "crm_customer_id" "uuid",
    CONSTRAINT "company_quote_requests_estimated_value_check" CHECK ((("estimated_value" IS NULL) OR ("estimated_value" >= (0)::numeric))),
    CONSTRAINT "company_quote_requests_lead_access_check" CHECK (("lead_access" = ANY (ARRAY['included'::"text", 'paid'::"text", 'locked'::"text"]))),
    CONSTRAINT "company_quote_requests_lead_price_check" CHECK ((("lead_price" IS NULL) OR ("lead_price" >= (0)::numeric))),
    CONSTRAINT "company_quote_requests_lead_score_check" CHECK ((("lead_score" IS NULL) OR (("lead_score" >= 0) AND ("lead_score" <= 100)))),
    CONSTRAINT "company_quote_requests_lead_type_check" CHECK (("lead_type" = ANY (ARRAY['direct'::"text", 'marketplace'::"text", 'distributed'::"text"]))),
    CONSTRAINT "company_quote_requests_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'normal'::"text", 'high'::"text", 'urgent'::"text"]))),
    CONSTRAINT "company_quote_requests_quoted_value_check" CHECK ((("quoted_value" IS NULL) OR ("quoted_value" >= (0)::numeric))),
    CONSTRAINT "company_quote_requests_source_check" CHECK (("source" = ANY (ARRAY['company_profile'::"text", 'company_site'::"text", 'marketplace'::"text", 'manual'::"text", 'admin'::"text", 'seo'::"text", 'google'::"text", 'other'::"text"]))),
    CONSTRAINT "company_quote_requests_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'viewed'::"text", 'contacted'::"text", 'qualified'::"text", 'quoted'::"text", 'won'::"text", 'lost'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."company_quote_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_sites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid" NOT NULL,
    "site_slug" "text" NOT NULL,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "template" "text" DEFAULT 'modern'::"text" NOT NULL,
    "primary_color" "text" DEFAULT '#e11d48'::"text" NOT NULL,
    "secondary_color" "text" DEFAULT '#0f172a'::"text" NOT NULL,
    "default_locale" "text" DEFAULT 'sv'::"text" NOT NULL,
    "enabled_locales" "text"[] DEFAULT ARRAY['sv'::"text"] NOT NULL,
    "content" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "section_settings" "jsonb" DEFAULT '{"faq": true, "about": true, "areas": true, "hours": true, "contact": true, "gallery": true, "pricing": true, "reviews": true, "services": true}'::"jsonb" NOT NULL,
    "social_links" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "seo_settings" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "custom_domain" "text",
    "domain_status" "text" DEFAULT 'not_configured'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "remove_clean_jobs_branding" boolean DEFAULT false NOT NULL,
    CONSTRAINT "company_sites_default_locale_check" CHECK (("default_locale" = ANY (ARRAY['sv'::"text", 'en'::"text", 'uk'::"text", 'ru'::"text", 'pl'::"text"]))),
    CONSTRAINT "company_sites_domain_status_check" CHECK (("domain_status" = ANY (ARRAY['not_configured'::"text", 'pending'::"text", 'verified'::"text", 'failed'::"text"]))),
    CONSTRAINT "company_sites_primary_color_check" CHECK (("primary_color" ~ '^#[0-9A-Fa-f]{6}$'::"text")),
    CONSTRAINT "company_sites_secondary_color_check" CHECK (("secondary_color" ~ '^#[0-9A-Fa-f]{6}$'::"text")),
    CONSTRAINT "company_sites_site_slug_check" CHECK (("site_slug" ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'::"text")),
    CONSTRAINT "company_sites_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"]))),
    CONSTRAINT "company_sites_template_check" CHECK (("template" = ANY (ARRAY['modern'::"text", 'minimal'::"text", 'elegant'::"text"])))
);


ALTER TABLE "public"."company_sites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "event_type" "text" NOT NULL,
    "old_status" "text",
    "new_status" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "text" DEFAULT 'status_changed'::"text" NOT NULL,
    CONSTRAINT "job_activity_event_type_check" CHECK (("event_type" = ANY (ARRAY['job_created'::"text", 'job_assigned'::"text", 'status_changed'::"text", 'review_left'::"text"])))
);


ALTER TABLE "public"."job_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "applicant_id" "uuid" NOT NULL,
    "hourly_rate" numeric(10,2),
    "fixed_price" numeric(10,2),
    "message" "text",
    "available_from" "date",
    "estimated_hours" numeric(8,2),
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_applications_estimated_hours_positive" CHECK ((("estimated_hours" IS NULL) OR ("estimated_hours" > (0)::numeric))),
    CONSTRAINT "job_applications_fixed_price_positive" CHECK ((("fixed_price" IS NULL) OR ("fixed_price" >= (0)::numeric))),
    CONSTRAINT "job_applications_hourly_rate_positive" CHECK ((("hourly_rate" IS NULL) OR ("hourly_rate" >= (0)::numeric))),
    CONSTRAINT "job_applications_message_length" CHECK ((("message" IS NULL) OR ("char_length"("message") <= 2000))),
    CONSTRAINT "job_applications_price_required" CHECK ((("hourly_rate" IS NOT NULL) OR ("fixed_price" IS NOT NULL))),
    CONSTRAINT "job_applications_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'rejected'::"text", 'withdrawn'::"text"])))
);


ALTER TABLE "public"."job_applications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_chat_reads" (
    "user_id" "uuid" NOT NULL,
    "job_id" "uuid" NOT NULL,
    "last_read_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."job_chat_reads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "message" "text",
    "status" "text" DEFAULT 'open'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "job_reports_reason_check" CHECK (("reason" = ANY (ARRAY['spam'::"text", 'scam'::"text", 'fake_job'::"text", 'inappropriate_content'::"text", 'other'::"text"]))),
    CONSTRAINT "job_reports_status_check" CHECK (("status" = ANY (ARRAY['open'::"text", 'resolved'::"text", 'dismissed'::"text"])))
);


ALTER TABLE "public"."job_reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_by" "uuid" NOT NULL,
    "assigned_to" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "job_type" "text" NOT NULL,
    "property_type" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "scheduled_date" "date",
    "scheduled_time" "text",
    "budget" numeric,
    "status" "text" DEFAULT 'new'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_featured" boolean DEFAULT false NOT NULL,
    "featured_until" timestamp with time zone,
    CONSTRAINT "jobs_job_type_check" CHECK (("job_type" = ANY (ARRAY['home_cleaning'::"text", 'office_cleaning'::"text"]))),
    CONSTRAINT "jobs_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'assigned'::"text", 'in_progress'::"text", 'done'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "body" "text" NOT NULL,
    "read_at" timestamp with time zone,
    "read_by" "uuid"
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "actor_id" "uuid",
    "job_id" "uuid",
    "application_id" "uuid",
    "type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text",
    "is_read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "href" "text",
    "entity_type" "text",
    "entity_id" "uuid",
    "dedupe_key" "text",
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['application_received'::"text", 'application_accepted'::"text", 'application_rejected'::"text", 'new_message'::"text", 'review_received'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."outreach_email_preferences" (
    "email_normalized" "text" NOT NULL,
    "unsubscribe_token" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "opted_out_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "outreach_email_preferences_email_check" CHECK ((("email_normalized" = "lower"(TRIM(BOTH FROM "email_normalized"))) AND (POSITION(('@'::"text") IN ("email_normalized")) > 1)))
);


ALTER TABLE "public"."outreach_email_preferences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "phone" "text",
    "city" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "avatar_url" "text",
    "company_logo_url" "text",
    "company_name" "text",
    "bio" "text",
    "is_premium" boolean DEFAULT false NOT NULL,
    "verified" boolean DEFAULT false NOT NULL,
    "subscription_ends_at" timestamp with time zone,
    "stripe_customer_id" "text",
    "stripe_subscription_id" "text",
    "bankid_verified" boolean DEFAULT false NOT NULL,
    "bankid_verified_at" timestamp with time zone,
    "bankid_provider" "text",
    "premium_source" "text" DEFAULT 'none'::"text" NOT NULL,
    "premium_override_until" timestamp with time zone,
    "stripe_subscription_status" "text",
    "stripe_price_id" "text",
    "stripe_billing_interval" "text",
    "billing_grace_until" timestamp with time zone,
    "premium_updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_premium_source_check" CHECK (("premium_source" = ANY (ARRAY['none'::"text", 'legacy'::"text", 'stripe'::"text", 'admin'::"text"]))),
    CONSTRAINT "profiles_stripe_billing_interval_check" CHECK ((("stripe_billing_interval" IS NULL) OR ("stripe_billing_interval" = ANY (ARRAY['monthly'::"text", 'yearly'::"text", 'unknown'::"text"]))))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid",
    "reviewer_id" "uuid" NOT NULL,
    "reviewee_id" "uuid" NOT NULL,
    "rating" integer NOT NULL,
    "comment" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "entity_type" "text",
    "entity_id" "uuid",
    CONSTRAINT "reviews_entity_pair_check" CHECK (((("entity_type" IS NULL) AND ("entity_id" IS NULL)) OR (("entity_type" IS NOT NULL) AND ("entity_id" IS NOT NULL)))),
    CONSTRAINT "reviews_entity_type_check" CHECK (("entity_type" = ANY (ARRAY['job'::"text", 'service'::"text", 'company'::"text"]))),
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "reviews_reviewer_not_reviewee" CHECK (("reviewer_id" <> "reviewee_id"))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "job_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."saved_jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."security_rate_limits" (
    "action" "text" NOT NULL,
    "key_hash" "text" NOT NULL,
    "window_start" timestamp with time zone NOT NULL,
    "hits" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "security_rate_limits_hits_check" CHECK (("hits" >= 0))
);


ALTER TABLE "public"."security_rate_limits" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."service_profiles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "company_name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "logo_url" "text",
    "description" "text",
    "city" "text" NOT NULL,
    "phone" "text",
    "email" "text",
    "website" "text",
    "hourly_rate" integer,
    "minimum_order" integer,
    "rut_available" boolean DEFAULT true,
    "languages" "text"[],
    "service_types" "text"[],
    "service_areas" "text"[],
    "verified" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "gallery_urls" "text"[] DEFAULT '{}'::"text"[],
    "working_hours" "jsonb" DEFAULT '{}'::"jsonb"
);


ALTER TABLE "public"."service_profiles" OWNER TO "postgres";


ALTER TABLE ONLY "public"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_stripe_customer_id_key" UNIQUE ("stripe_customer_id");



ALTER TABLE ONLY "public"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_stripe_subscription_id_key" UNIQUE ("stripe_subscription_id");



ALTER TABLE ONLY "public"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."billing_transactions"
    ADD CONSTRAINT "billing_transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."billing_transactions"
    ADD CONSTRAINT "billing_transactions_stripe_invoice_id_key" UNIQUE ("stripe_invoice_id");



ALTER TABLE ONLY "public"."billing_webhook_events"
    ADD CONSTRAINT "billing_webhook_events_pkey" PRIMARY KEY ("event_id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."company_booking_activity"
    ADD CONSTRAINT "company_booking_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_booking_occurrences"
    ADD CONSTRAINT "company_booking_occurrences_booking_sequence_unique" UNIQUE ("booking_id", "sequence_no");



ALTER TABLE ONLY "public"."company_booking_occurrences"
    ADD CONSTRAINT "company_booking_occurrences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_booking_settings"
    ADD CONSTRAINT "company_booking_settings_company_id_key" UNIQUE ("company_id");



ALTER TABLE ONLY "public"."company_booking_settings"
    ADD CONSTRAINT "company_booking_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_claim_audit"
    ADD CONSTRAINT "company_claim_audit_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_claim_requests"
    ADD CONSTRAINT "company_claim_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_crm_customer_activity"
    ADD CONSTRAINT "company_crm_customer_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_crm_customers"
    ADD CONSTRAINT "company_crm_customers_company_email_unique" UNIQUE ("company_id", "normalized_email");



ALTER TABLE ONLY "public"."company_crm_customers"
    ADD CONSTRAINT "company_crm_customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_leads"
    ADD CONSTRAINT "company_leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_quote_request_activity"
    ADD CONSTRAINT "company_quote_request_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_sites"
    ADD CONSTRAINT "company_sites_company_id_key" UNIQUE ("company_id");



ALTER TABLE ONLY "public"."company_sites"
    ADD CONSTRAINT "company_sites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_sites"
    ADD CONSTRAINT "company_sites_site_slug_key" UNIQUE ("site_slug");



ALTER TABLE ONLY "public"."job_activity"
    ADD CONSTRAINT "job_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_chat_reads"
    ADD CONSTRAINT "job_chat_reads_pkey" PRIMARY KEY ("user_id", "job_id");



ALTER TABLE ONLY "public"."job_reports"
    ADD CONSTRAINT "job_reports_job_id_reporter_id_key" UNIQUE ("job_id", "reporter_id");



ALTER TABLE ONLY "public"."job_reports"
    ADD CONSTRAINT "job_reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."outreach_email_preferences"
    ADD CONSTRAINT "outreach_email_preferences_pkey" PRIMARY KEY ("email_normalized");



ALTER TABLE ONLY "public"."outreach_email_preferences"
    ADD CONSTRAINT "outreach_email_preferences_unsubscribe_token_key" UNIQUE ("unsubscribe_token");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_unique_job_reviewer" UNIQUE ("job_id", "reviewer_id");



ALTER TABLE ONLY "public"."saved_jobs"
    ADD CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saved_jobs"
    ADD CONSTRAINT "saved_jobs_user_id_job_id_key" UNIQUE ("user_id", "job_id");



ALTER TABLE ONLY "public"."security_rate_limits"
    ADD CONSTRAINT "security_rate_limits_pkey" PRIMARY KEY ("action", "key_hash", "window_start");



ALTER TABLE ONLY "public"."service_profiles"
    ADD CONSTRAINT "service_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."service_profiles"
    ADD CONSTRAINT "service_profiles_slug_key" UNIQUE ("slug");



CREATE INDEX "billing_subscriptions_admin_exception_idx" ON "public"."billing_subscriptions" USING "btree" ("status", "updated_at") WHERE ("status" = ANY (ARRAY['past_due'::"text", 'unpaid'::"text", 'incomplete'::"text", 'incomplete_expired'::"text", 'paused'::"text"]));



CREATE INDEX "billing_subscriptions_period_end_idx" ON "public"."billing_subscriptions" USING "btree" ("current_period_end");



CREATE INDEX "billing_subscriptions_status_idx" ON "public"."billing_subscriptions" USING "btree" ("status");



CREATE INDEX "billing_transactions_kind_created_idx" ON "public"."billing_transactions" USING "btree" ("kind", "created_at" DESC);



CREATE INDEX "billing_transactions_user_created_idx" ON "public"."billing_transactions" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "billing_webhook_events_admin_problem_idx" ON "public"."billing_webhook_events" USING "btree" ("status", "created_at") WHERE ("status" = ANY (ARRAY['processing'::"text", 'failed'::"text"]));



CREATE INDEX "billing_webhook_events_status_created_idx" ON "public"."billing_webhook_events" USING "btree" ("status", "created_at" DESC);



CREATE INDEX "companies_city_idx" ON "public"."companies" USING "btree" ("city");



CREATE INDEX "companies_owner_id_idx" ON "public"."companies" USING "btree" ("owner_id");



CREATE INDEX "companies_slug_idx" ON "public"."companies" USING "btree" ("slug");



CREATE INDEX "company_booking_activity_booking_created_idx" ON "public"."company_booking_activity" USING "btree" ("booking_id", "created_at" DESC);



CREATE INDEX "company_booking_occurrences_admin_overdue_idx" ON "public"."company_booking_occurrences" USING "btree" ("scheduled_end") WHERE ("status" = ANY (ARRAY['confirmed'::"text", 'in_progress'::"text"]));



CREATE INDEX "company_booking_occurrences_booking_idx" ON "public"."company_booking_occurrences" USING "btree" ("booking_id", "sequence_no");



CREATE INDEX "company_booking_occurrences_company_start_idx" ON "public"."company_booking_occurrences" USING "btree" ("company_id", "scheduled_start");



CREATE INDEX "company_booking_occurrences_status_start_idx" ON "public"."company_booking_occurrences" USING "btree" ("status", "scheduled_start");



CREATE INDEX "company_bookings_admin_pending_created_idx" ON "public"."company_bookings" USING "btree" ("created_at") WHERE ("status" = 'pending'::"text");



CREATE INDEX "company_bookings_company_status_created_idx" ON "public"."company_bookings" USING "btree" ("company_id", "status", "created_at" DESC);



CREATE INDEX "company_bookings_crm_customer_idx" ON "public"."company_bookings" USING "btree" ("crm_customer_id", "created_at" DESC) WHERE ("crm_customer_id" IS NOT NULL);



CREATE INDEX "company_bookings_customer_created_idx" ON "public"."company_bookings" USING "btree" ("customer_id", "created_at" DESC);



CREATE UNIQUE INDEX "company_bookings_quote_request_unique_idx" ON "public"."company_bookings" USING "btree" ("quote_request_id") WHERE ("quote_request_id" IS NOT NULL);



CREATE INDEX "company_bookings_start_date_idx" ON "public"."company_bookings" USING "btree" ("start_date");



CREATE INDEX "company_claim_audit_claim_created_idx" ON "public"."company_claim_audit" USING "btree" ("claim_id", "created_at");



CREATE INDEX "company_claim_audit_user_created_idx" ON "public"."company_claim_audit" USING "btree" ("user_id", "created_at" DESC);



CREATE UNIQUE INDEX "company_claim_requests_active_unique" ON "public"."company_claim_requests" USING "btree" ("company_id", "user_id") WHERE ("status" = ANY (ARRAY['pending'::"text", 'needs_info'::"text"]));



CREATE INDEX "company_claim_requests_admin_active_updated_idx" ON "public"."company_claim_requests" USING "btree" ("status", "updated_at") WHERE ("status" = ANY (ARRAY['pending'::"text", 'needs_info'::"text"]));



CREATE INDEX "company_claim_requests_company_id_idx" ON "public"."company_claim_requests" USING "btree" ("company_id");



CREATE INDEX "company_claim_requests_company_status_created_idx" ON "public"."company_claim_requests" USING "btree" ("company_id", "status", "created_at" DESC);



CREATE INDEX "company_claim_requests_status_idx" ON "public"."company_claim_requests" USING "btree" ("status");



CREATE UNIQUE INDEX "company_claim_requests_unique_pending_idx" ON "public"."company_claim_requests" USING "btree" ("company_id", "user_id") WHERE ("status" = 'pending'::"text");



CREATE INDEX "company_claim_requests_user_id_idx" ON "public"."company_claim_requests" USING "btree" ("user_id");



CREATE INDEX "company_claim_requests_user_status_created_idx" ON "public"."company_claim_requests" USING "btree" ("user_id", "status", "created_at" DESC);



CREATE INDEX "company_crm_customer_activity_company_created_idx" ON "public"."company_crm_customer_activity" USING "btree" ("company_id", "created_at" DESC);



CREATE INDEX "company_crm_customer_activity_customer_created_idx" ON "public"."company_crm_customer_activity" USING "btree" ("crm_customer_id", "created_at" DESC);



CREATE INDEX "company_crm_customers_admin_follow_up_idx" ON "public"."company_crm_customers" USING "btree" ("follow_up_at") WHERE ("follow_up_at" IS NOT NULL);



CREATE INDEX "company_crm_customers_company_activity_idx" ON "public"."company_crm_customers" USING "btree" ("company_id", "last_activity_at" DESC);



CREATE INDEX "company_crm_customers_company_stage_idx" ON "public"."company_crm_customers" USING "btree" ("company_id", "lifecycle_stage", "last_activity_at" DESC);



CREATE INDEX "company_crm_customers_follow_up_idx" ON "public"."company_crm_customers" USING "btree" ("company_id", "follow_up_at") WHERE ("follow_up_at" IS NOT NULL);



CREATE INDEX "company_crm_customers_tags_gin_idx" ON "public"."company_crm_customers" USING "gin" ("tags");



CREATE INDEX "company_leads_admin_scan_problem_idx" ON "public"."company_leads" USING "btree" ("email_scan_status", "email_checked_at") WHERE ("email_scan_status" = ANY (ARRAY['never_scanned'::"text", 'timeout'::"text", 'invalid_site'::"text", 'failed'::"text"]));



CREATE INDEX "company_leads_admin_stale_invite_idx" ON "public"."company_leads" USING "btree" ("last_invited_at") WHERE (("status" = 'invited'::"text") AND ("registered" = false) AND ("last_invited_at" IS NOT NULL));



CREATE INDEX "company_leads_city_idx" ON "public"."company_leads" USING "btree" ("city");



CREATE INDEX "company_leads_created_at_idx" ON "public"."company_leads" USING "btree" ("created_at" DESC);



CREATE INDEX "company_leads_email_checked_at_idx" ON "public"."company_leads" USING "btree" ("email_checked_at");



CREATE INDEX "company_leads_email_enrichment_idx" ON "public"."company_leads" USING "btree" ("email_scan_status", "email_checked_at") WHERE ("website" IS NOT NULL);



CREATE INDEX "company_leads_email_idx" ON "public"."company_leads" USING "btree" ("lower"("email"));



CREATE INDEX "company_leads_email_scan_status_idx" ON "public"."company_leads" USING "btree" ("email_scan_status");



CREATE INDEX "company_leads_email_source_idx" ON "public"."company_leads" USING "btree" ("email_source") WHERE ("email_source" IS NOT NULL);



CREATE INDEX "company_leads_status_idx" ON "public"."company_leads" USING "btree" ("status");



CREATE UNIQUE INDEX "company_leads_unique_email_idx" ON "public"."company_leads" USING "btree" ("lower"("email")) WHERE (("email" IS NOT NULL) AND (TRIM(BOTH FROM "email") <> ''::"text"));



CREATE INDEX "company_quote_request_activity_lead_created_idx" ON "public"."company_quote_request_activity" USING "btree" ("quote_request_id", "created_at" DESC);



CREATE INDEX "company_quote_requests_admin_new_created_idx" ON "public"."company_quote_requests" USING "btree" ("created_at") WHERE ("status" = 'new'::"text");



CREATE INDEX "company_quote_requests_company_id_created_at_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "created_at" DESC);



CREATE INDEX "company_quote_requests_company_priority_created_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "priority", "created_at" DESC);



CREATE INDEX "company_quote_requests_company_source_created_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "source", "created_at" DESC);



CREATE INDEX "company_quote_requests_company_status_created_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "status", "created_at" DESC);



CREATE INDEX "company_quote_requests_crm_customer_idx" ON "public"."company_quote_requests" USING "btree" ("crm_customer_id", "created_at" DESC) WHERE ("crm_customer_id" IS NOT NULL);



CREATE INDEX "company_quote_requests_follow_up_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "follow_up_at") WHERE ("follow_up_at" IS NOT NULL);



CREATE INDEX "company_quote_requests_last_activity_idx" ON "public"."company_quote_requests" USING "btree" ("company_id", "last_activity_at" DESC);



CREATE INDEX "company_quote_requests_status_idx" ON "public"."company_quote_requests" USING "btree" ("status");



CREATE INDEX "company_quote_requests_user_id_created_at_idx" ON "public"."company_quote_requests" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "company_sites_admin_domain_problem_idx" ON "public"."company_sites" USING "btree" ("domain_status", "updated_at") WHERE (("custom_domain" IS NOT NULL) AND ("domain_status" = ANY (ARRAY['pending'::"text", 'failed'::"text"])));



CREATE INDEX "company_sites_company_id_idx" ON "public"."company_sites" USING "btree" ("company_id");



CREATE UNIQUE INDEX "company_sites_custom_domain_unique" ON "public"."company_sites" USING "btree" ("lower"("custom_domain")) WHERE ("custom_domain" IS NOT NULL);



CREATE INDEX "company_sites_status_idx" ON "public"."company_sites" USING "btree" ("status");



CREATE INDEX "job_activity_job_id_created_at_idx" ON "public"."job_activity" USING "btree" ("job_id", "created_at" DESC);



CREATE INDEX "job_applications_applicant_id_idx" ON "public"."job_applications" USING "btree" ("applicant_id");



CREATE INDEX "job_applications_created_at_idx" ON "public"."job_applications" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "job_applications_job_applicant_unique" ON "public"."job_applications" USING "btree" ("job_id", "applicant_id");



CREATE INDEX "job_applications_job_id_idx" ON "public"."job_applications" USING "btree" ("job_id");



CREATE INDEX "job_applications_job_status_idx" ON "public"."job_applications" USING "btree" ("job_id", "status");



CREATE UNIQUE INDEX "job_applications_one_accepted_per_job" ON "public"."job_applications" USING "btree" ("job_id") WHERE ("status" = 'accepted'::"text");



CREATE INDEX "job_applications_status_idx" ON "public"."job_applications" USING "btree" ("status");



CREATE INDEX "job_reports_created_at_idx" ON "public"."job_reports" USING "btree" ("created_at" DESC);



CREATE INDEX "job_reports_job_id_idx" ON "public"."job_reports" USING "btree" ("job_id");



CREATE INDEX "job_reports_reporter_id_idx" ON "public"."job_reports" USING "btree" ("reporter_id");



CREATE INDEX "job_reports_status_idx" ON "public"."job_reports" USING "btree" ("status");



CREATE INDEX "jobs_featured_until_idx" ON "public"."jobs" USING "btree" ("featured_until");



CREATE INDEX "jobs_is_featured_idx" ON "public"."jobs" USING "btree" ("is_featured");



CREATE INDEX "messages_job_id_created_at_idx" ON "public"."messages" USING "btree" ("job_id", "created_at");



CREATE INDEX "messages_job_id_sender_id_idx" ON "public"."messages" USING "btree" ("job_id", "sender_id");



CREATE INDEX "messages_read_at_idx" ON "public"."messages" USING "btree" ("read_at");



CREATE INDEX "notifications_created_at_idx" ON "public"."notifications" USING "btree" ("created_at" DESC);



CREATE UNIQUE INDEX "notifications_dedupe_key_unique" ON "public"."notifications" USING "btree" ("dedupe_key") WHERE ("dedupe_key" IS NOT NULL);



CREATE INDEX "notifications_entity_idx" ON "public"."notifications" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "notifications_user_id_idx" ON "public"."notifications" USING "btree" ("user_id");



CREATE INDEX "notifications_user_unread_idx" ON "public"."notifications" USING "btree" ("user_id", "is_read");



CREATE INDEX "outreach_email_preferences_opted_out_idx" ON "public"."outreach_email_preferences" USING "btree" ("opted_out_at") WHERE ("opted_out_at" IS NOT NULL);



CREATE INDEX "profiles_admin_expired_override_idx" ON "public"."profiles" USING "btree" ("premium_override_until") WHERE (("premium_source" = 'admin'::"text") AND ("premium_override_until" IS NOT NULL));



CREATE INDEX "profiles_is_premium_idx" ON "public"."profiles" USING "btree" ("is_premium");



CREATE INDEX "profiles_verified_idx" ON "public"."profiles" USING "btree" ("verified");



CREATE INDEX "reviews_entity_lookup_idx" ON "public"."reviews" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "reviews_job_id_created_at_idx" ON "public"."reviews" USING "btree" ("job_id", "created_at" DESC);



CREATE INDEX "reviews_reviewee_idx" ON "public"."reviews" USING "btree" ("reviewee_id");



CREATE INDEX "reviews_reviewer_idx" ON "public"."reviews" USING "btree" ("reviewer_id");



CREATE UNIQUE INDEX "reviews_unique_reviewer_entity_idx" ON "public"."reviews" USING "btree" ("reviewer_id", "entity_type", "entity_id") WHERE (("entity_type" IS NOT NULL) AND ("entity_id" IS NOT NULL));



CREATE INDEX "security_rate_limits_updated_idx" ON "public"."security_rate_limits" USING "btree" ("updated_at");



CREATE INDEX "service_profiles_city_idx" ON "public"."service_profiles" USING "btree" ("city");



CREATE INDEX "service_profiles_slug_idx" ON "public"."service_profiles" USING "btree" ("slug");



CREATE OR REPLACE TRIGGER "companies_ensure_booking_settings" AFTER INSERT OR UPDATE OF "owner_id" ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_company_booking_settings"();



CREATE OR REPLACE TRIGGER "company_booking_occurrences_activity_update" AFTER UPDATE ON "public"."company_booking_occurrences" FOR EACH ROW EXECUTE FUNCTION "public"."log_company_booking_occurrence_activity"();



CREATE OR REPLACE TRIGGER "company_booking_occurrences_conflict_guard" BEFORE INSERT OR UPDATE OF "scheduled_start", "scheduled_end", "status" ON "public"."company_booking_occurrences" FOR EACH ROW EXECUTE FUNCTION "public"."guard_company_booking_occurrence_conflict"();



CREATE OR REPLACE TRIGGER "company_booking_occurrences_touch_updated_at" BEFORE UPDATE ON "public"."company_booking_occurrences" FOR EACH ROW EXECUTE FUNCTION "public"."touch_company_booking_updated_at"();



CREATE OR REPLACE TRIGGER "company_booking_settings_touch_updated_at" BEFORE UPDATE ON "public"."company_booking_settings" FOR EACH ROW EXECUTE FUNCTION "public"."touch_company_booking_updated_at"();



CREATE OR REPLACE TRIGGER "company_bookings_activity_insert" AFTER INSERT ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."log_company_booking_activity"();



CREATE OR REPLACE TRIGGER "company_bookings_activity_update" AFTER UPDATE ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."log_company_booking_activity"();



CREATE OR REPLACE TRIGGER "company_bookings_generate_occurrences" AFTER INSERT ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."generate_company_booking_occurrences"();



CREATE OR REPLACE TRIGGER "company_bookings_sync_occurrences" AFTER UPDATE OF "status" ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."sync_company_booking_occurrences"();



CREATE OR REPLACE TRIGGER "company_bookings_touch_updated_at" BEFORE UPDATE ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."touch_company_booking_updated_at"();



CREATE OR REPLACE TRIGGER "company_leads_updated_at_trigger" BEFORE UPDATE ON "public"."company_leads" FOR EACH ROW EXECUTE FUNCTION "public"."update_company_leads_updated_at"();



CREATE OR REPLACE TRIGGER "enforce_company_site_premium_features" BEFORE INSERT OR UPDATE ON "public"."company_sites" FOR EACH ROW EXECUTE FUNCTION "public"."enforce_company_site_premium_features"();



CREATE OR REPLACE TRIGGER "set_companies_updated_at" BEFORE UPDATE ON "public"."companies" FOR EACH ROW EXECUTE FUNCTION "public"."set_companies_updated_at"();



CREATE OR REPLACE TRIGGER "set_company_claim_request_updated_at" BEFORE UPDATE ON "public"."company_claim_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_company_claim_request_updated_at"();



CREATE OR REPLACE TRIGGER "set_company_claim_updated_at" BEFORE UPDATE ON "public"."company_claim_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_company_claim_updated_at"();



CREATE OR REPLACE TRIGGER "set_company_quote_requests_updated_at" BEFORE UPDATE ON "public"."company_quote_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_company_quote_requests_updated_at"();



CREATE OR REPLACE TRIGGER "set_company_sites_updated_at" BEFORE UPDATE ON "public"."company_sites" FOR EACH ROW EXECUTE FUNCTION "public"."set_company_sites_updated_at"();



CREATE OR REPLACE TRIGGER "set_job_application_updated_at" BEFORE UPDATE ON "public"."job_applications" FOR EACH ROW EXECUTE FUNCTION "public"."set_job_application_updated_at"();



CREATE OR REPLACE TRIGGER "touch_billing_subscriptions_updated_at" BEFORE UPDATE ON "public"."billing_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."touch_billing_updated_at"();



CREATE OR REPLACE TRIGGER "touch_billing_transactions_updated_at" BEFORE UPDATE ON "public"."billing_transactions" FOR EACH ROW EXECUTE FUNCTION "public"."touch_billing_updated_at"();



CREATE OR REPLACE TRIGGER "touch_billing_webhook_events_updated_at" BEFORE UPDATE ON "public"."billing_webhook_events" FOR EACH ROW EXECUTE FUNCTION "public"."touch_billing_updated_at"();



CREATE OR REPLACE TRIGGER "trg_booking_crm_company_match" BEFORE INSERT OR UPDATE OF "company_id", "crm_customer_id" ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_crm_customer_company_match"();



CREATE OR REPLACE TRIGGER "trg_job_activity_for_jobs" AFTER INSERT OR UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."handle_job_activity_for_jobs"();



CREATE OR REPLACE TRIGGER "trg_job_activity_for_reviews" AFTER INSERT ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."handle_job_activity_for_reviews"();



CREATE OR REPLACE TRIGGER "trg_log_company_crm_customer_activity" AFTER INSERT OR UPDATE ON "public"."company_crm_customers" FOR EACH ROW EXECUTE FUNCTION "public"."log_company_crm_customer_activity"();



CREATE OR REPLACE TRIGGER "trg_log_company_quote_request_activity" AFTER INSERT OR UPDATE ON "public"."company_quote_requests" FOR EACH ROW EXECUTE FUNCTION "public"."log_company_quote_request_activity"();



CREATE OR REPLACE TRIGGER "trg_quote_request_crm_company_match" BEFORE INSERT OR UPDATE OF "company_id", "crm_customer_id" ON "public"."company_quote_requests" FOR EACH ROW EXECUTE FUNCTION "public"."ensure_crm_customer_company_match"();



CREATE OR REPLACE TRIGGER "trg_sync_crm_customer_from_booking" AFTER INSERT OR UPDATE OF "company_id", "customer_id", "customer_name", "customer_email", "customer_phone", "city", "status", "service_type", "address", "postal_code", "frequency", "start_date", "preferred_time", "agreed_price", "estimated_price", "payment_status", "cancellation_reason" ON "public"."company_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."sync_crm_customer_from_booking"();



CREATE OR REPLACE TRIGGER "trg_sync_crm_customer_from_quote_request" AFTER INSERT OR UPDATE OF "company_id", "user_id", "customer_name", "customer_email", "customer_phone", "city", "status", "priority", "owner_notes", "lead_score", "estimated_value", "quoted_value", "follow_up_at", "lost_reason", "lead_access", "is_paid" ON "public"."company_quote_requests" FOR EACH ROW EXECUTE FUNCTION "public"."sync_crm_customer_from_quote_request"();



CREATE OR REPLACE TRIGGER "trg_touch_company_crm_customer" BEFORE UPDATE ON "public"."company_crm_customers" FOR EACH ROW EXECUTE FUNCTION "public"."touch_company_crm_customer"();



CREATE OR REPLACE TRIGGER "trg_touch_company_quote_request" BEFORE UPDATE ON "public"."company_quote_requests" FOR EACH ROW EXECUTE FUNCTION "public"."touch_company_quote_request"();



CREATE OR REPLACE TRIGGER "trg_touch_crm_customer_from_booking_occurrence" AFTER UPDATE OF "status" ON "public"."company_booking_occurrences" FOR EACH ROW WHEN (("old"."status" IS DISTINCT FROM "new"."status")) EXECUTE FUNCTION "public"."touch_crm_customer_from_booking_occurrence"();



CREATE OR REPLACE TRIGGER "validate_review_entity_trigger" BEFORE INSERT OR UPDATE OF "entity_type", "entity_id" ON "public"."reviews" FOR EACH ROW EXECUTE FUNCTION "public"."validate_review_entity"();



ALTER TABLE ONLY "public"."billing_subscriptions"
    ADD CONSTRAINT "billing_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."billing_transactions"
    ADD CONSTRAINT "billing_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_booking_activity"
    ADD CONSTRAINT "company_booking_activity_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_booking_activity"
    ADD CONSTRAINT "company_booking_activity_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."company_bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_booking_activity"
    ADD CONSTRAINT "company_booking_activity_occurrence_id_fkey" FOREIGN KEY ("occurrence_id") REFERENCES "public"."company_booking_occurrences"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_booking_occurrences"
    ADD CONSTRAINT "company_booking_occurrences_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."company_bookings"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_booking_occurrences"
    ADD CONSTRAINT "company_booking_occurrences_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_booking_settings"
    ADD CONSTRAINT "company_booking_settings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_cancelled_by_fkey" FOREIGN KEY ("cancelled_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_crm_customer_id_fkey" FOREIGN KEY ("crm_customer_id") REFERENCES "public"."company_crm_customers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_bookings"
    ADD CONSTRAINT "company_bookings_quote_request_id_fkey" FOREIGN KEY ("quote_request_id") REFERENCES "public"."company_quote_requests"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_claim_audit"
    ADD CONSTRAINT "company_claim_audit_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_claim_audit"
    ADD CONSTRAINT "company_claim_audit_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "public"."company_claim_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_claim_audit"
    ADD CONSTRAINT "company_claim_audit_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_claim_audit"
    ADD CONSTRAINT "company_claim_audit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_claim_requests"
    ADD CONSTRAINT "company_claim_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_claim_requests"
    ADD CONSTRAINT "company_claim_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_claim_requests"
    ADD CONSTRAINT "company_claim_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_crm_customer_activity"
    ADD CONSTRAINT "company_crm_customer_activity_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_crm_customer_activity"
    ADD CONSTRAINT "company_crm_customer_activity_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_crm_customer_activity"
    ADD CONSTRAINT "company_crm_customer_activity_crm_customer_id_fkey" FOREIGN KEY ("crm_customer_id") REFERENCES "public"."company_crm_customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_crm_customers"
    ADD CONSTRAINT "company_crm_customers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_crm_customers"
    ADD CONSTRAINT "company_crm_customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_leads"
    ADD CONSTRAINT "company_leads_registered_user_id_fkey" FOREIGN KEY ("registered_user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_request_activity"
    ADD CONSTRAINT "company_quote_request_activity_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_request_activity"
    ADD CONSTRAINT "company_quote_request_activity_quote_request_id_fkey" FOREIGN KEY ("quote_request_id") REFERENCES "public"."company_quote_requests"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_crm_customer_id_fkey" FOREIGN KEY ("crm_customer_id") REFERENCES "public"."company_crm_customers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_purchased_by_fkey" FOREIGN KEY ("purchased_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_source_site_id_fkey" FOREIGN KEY ("source_site_id") REFERENCES "public"."company_sites"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_quote_requests"
    ADD CONSTRAINT "company_quote_requests_viewed_by_fkey" FOREIGN KEY ("viewed_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."company_sites"
    ADD CONSTRAINT "company_sites_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_activity"
    ADD CONSTRAINT "job_activity_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."job_activity"
    ADD CONSTRAINT "job_activity_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_chat_reads"
    ADD CONSTRAINT "job_chat_reads_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_chat_reads"
    ADD CONSTRAINT "job_chat_reads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_reports"
    ADD CONSTRAINT "job_reports_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."job_reports"
    ADD CONSTRAINT "job_reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_read_by_fkey" FOREIGN KEY ("read_by") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_reviewee_id_fkey" FOREIGN KEY ("reviewee_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_jobs"
    ADD CONSTRAINT "saved_jobs_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_jobs"
    ADD CONSTRAINT "saved_jobs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."service_profiles"
    ADD CONSTRAINT "service_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone authenticated can read jobs" ON "public"."jobs" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Anyone can read companies" ON "public"."companies" FOR SELECT USING (true);



CREATE POLICY "Applicants can update own pending applications" ON "public"."job_applications" FOR UPDATE TO "authenticated" USING ((("applicant_id" = "auth"."uid"()) AND ("status" = 'pending'::"text"))) WITH CHECK ((("applicant_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['pending'::"text", 'withdrawn'::"text"]))));



CREATE POLICY "Applicants can view own applications" ON "public"."job_applications" FOR SELECT TO "authenticated" USING (("applicant_id" = "auth"."uid"()));



CREATE POLICY "Assigned user can update assigned jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "assigned_to")) WITH CHECK (("auth"."uid"() = "assigned_to"));



CREATE POLICY "Authenticated users can create jobs" ON "public"."jobs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Company owners can create company sites" ON "public"."company_sites" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_sites"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can delete company sites" ON "public"."company_sites" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_sites"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can insert CRM customers" ON "public"."company_crm_customers" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_crm_customers"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can insert booking settings" ON "public"."company_booking_settings" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_settings"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read CRM customer activity" ON "public"."company_crm_customer_activity" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_crm_customer_activity"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read CRM customers" ON "public"."company_crm_customers" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_crm_customers"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read booking activity" ON "public"."company_booking_activity" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."company_bookings"
     JOIN "public"."companies" ON (("companies"."id" = "company_bookings"."company_id")))
  WHERE (("company_bookings"."id" = "company_booking_activity"."booking_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read booking occurrences" ON "public"."company_booking_occurrences" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_occurrences"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read company bookings" ON "public"."company_bookings" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_bookings"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read company quote requests" ON "public"."company_quote_requests" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_quote_requests"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can read quote request activity" ON "public"."company_quote_request_activity" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM ("public"."company_quote_requests" "q"
     JOIN "public"."companies" "c" ON (("c"."id" = "q"."company_id")))
  WHERE (("q"."id" = "company_quote_request_activity"."quote_request_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update CRM customers" ON "public"."company_crm_customers" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_crm_customers"."company_id") AND ("c"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_crm_customers"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update booking occurrences" ON "public"."company_booking_occurrences" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_occurrences"."company_id") AND ("companies"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_occurrences"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update booking settings" ON "public"."company_booking_settings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_settings"."company_id") AND ("companies"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_booking_settings"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update company bookings" ON "public"."company_bookings" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_bookings"."company_id") AND ("companies"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_bookings"."company_id") AND ("companies"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update company quote requests" ON "public"."company_quote_requests" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_quote_requests"."company_id") AND ("c"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_quote_requests"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update company sites" ON "public"."company_sites" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_sites"."company_id") AND ("c"."owner_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_sites"."company_id") AND ("c"."owner_id" = "auth"."uid"())))));



CREATE POLICY "Company owners can update own companies" ON "public"."companies" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "owner_id")) WITH CHECK (("auth"."uid"() = "owner_id"));



CREATE POLICY "Company owners can update their companies" ON "public"."companies" FOR UPDATE TO "authenticated" USING (("owner_id" = "auth"."uid"())) WITH CHECK (("owner_id" = "auth"."uid"()));



CREATE POLICY "Customers can read own booking activity" ON "public"."company_booking_activity" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."company_bookings"
  WHERE (("company_bookings"."id" = "company_booking_activity"."booking_id") AND ("company_bookings"."customer_id" = "auth"."uid"())))));



CREATE POLICY "Customers can read own booking occurrences" ON "public"."company_booking_occurrences" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."company_bookings"
  WHERE (("company_bookings"."id" = "company_booking_occurrences"."booking_id") AND ("company_bookings"."customer_id" = "auth"."uid"())))));



CREATE POLICY "Customers can read own company bookings" ON "public"."company_bookings" FOR SELECT TO "authenticated" USING (("customer_id" = "auth"."uid"()));



CREATE POLICY "Customers can read their own company quote requests" ON "public"."company_quote_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Job owners can view applications" ON "public"."job_applications" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "job_applications"."job_id") AND ("jobs"."created_by" = "auth"."uid"())))));



CREATE POLICY "Owner can update own jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Public can create company quote requests" ON "public"."company_quote_requests" FOR INSERT TO "authenticated", "anon" WITH CHECK ((("status" = 'new'::"text") AND ("lead_type" = 'direct'::"text") AND ("source" = ANY (ARRAY['company_profile'::"text", 'company_site'::"text"])) AND ("lead_access" = 'included'::"text") AND ("is_paid" = false) AND ("crm_customer_id" IS NULL) AND ("company_id" IS NOT NULL) AND (NULLIF(TRIM(BOTH FROM "customer_name"), ''::"text") IS NOT NULL) AND (NULLIF(TRIM(BOTH FROM "customer_email"), ''::"text") IS NOT NULL) AND (NULLIF(TRIM(BOTH FROM "message"), ''::"text") IS NOT NULL) AND (("user_id" IS NULL) OR ("user_id" = "auth"."uid"()))));



CREATE POLICY "Public can read booking settings" ON "public"."company_booking_settings" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read published company sites" ON "public"."company_sites" FOR SELECT TO "authenticated", "anon" USING ((("status" = 'published'::"text") OR (EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "company_sites"."company_id") AND ("c"."owner_id" = "auth"."uid"()))))));



CREATE POLICY "Public can view jobs" ON "public"."jobs" FOR SELECT USING (true);



CREATE POLICY "Users can create job applications" ON "public"."job_applications" FOR INSERT TO "authenticated" WITH CHECK ((("applicant_id" = "auth"."uid"()) AND ("status" = 'pending'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "job_applications"."job_id") AND ("jobs"."created_by" <> "auth"."uid"()) AND ("jobs"."status" = 'new'::"text") AND ("jobs"."assigned_to" IS NULL))))));



CREATE POLICY "Users can create own company claim requests" ON "public"."company_claim_requests" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text") AND ("reviewed_at" IS NULL) AND ("reviewed_by" IS NULL) AND (EXISTS ( SELECT 1
   FROM "public"."companies"
  WHERE (("companies"."id" = "company_claim_requests"."company_id") AND ("companies"."owner_id" IS NULL))))));



CREATE POLICY "Users can create own company claims" ON "public"."company_claim_requests" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) AND ("status" = 'pending'::"text")));



CREATE POLICY "Users can create own job reports" ON "public"."job_reports" FOR INSERT WITH CHECK (("auth"."uid"() = "reporter_id"));



CREATE POLICY "Users can delete own jobs" ON "public"."jobs" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can delete own pending company claim requests" ON "public"."company_claim_requests" FOR DELETE TO "authenticated" USING ((("auth"."uid"() = "user_id") AND ("status" = 'pending'::"text")));



CREATE POLICY "Users can insert own jobs" ON "public"."jobs" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can read all profiles" ON "public"."profiles" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can read own billing subscription" ON "public"."billing_subscriptions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can read own billing transactions" ON "public"."billing_transactions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can read own company claim audit" ON "public"."company_claim_audit" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can read own company claims" ON "public"."company_claim_requests" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "Users can remove own saved jobs" ON "public"."saved_jobs" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can save jobs" ON "public"."saved_jobs" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can take jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Users can update own active company claims" ON "public"."company_claim_requests" FOR UPDATE TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['pending'::"text", 'needs_info'::"text"])))) WITH CHECK ((("user_id" = "auth"."uid"()) AND ("status" = ANY (ARRAY['pending'::"text", 'cancelled'::"text"]))));



CREATE POLICY "Users can update own jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "created_by")) WITH CHECK (("auth"."uid"() = "created_by"));



CREATE POLICY "Users can update own notifications" ON "public"."notifications" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can update own open job reports" ON "public"."job_reports" FOR UPDATE USING ((("auth"."uid"() = "reporter_id") AND ("status" = 'open'::"text"))) WITH CHECK (("auth"."uid"() = "reporter_id"));



CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view all jobs" ON "public"."jobs" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can view own company claim requests" ON "public"."company_claim_requests" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own job reports" ON "public"."job_reports" FOR SELECT USING (("auth"."uid"() = "reporter_id"));



CREATE POLICY "Users can view own notifications" ON "public"."notifications" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can view own saved jobs" ON "public"."saved_jobs" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."billing_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."billing_transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."billing_webhook_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "companies public read" ON "public"."companies" FOR SELECT USING (true);



ALTER TABLE "public"."company_booking_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_booking_occurrences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_booking_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_claim_audit" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_claim_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_crm_customer_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_crm_customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_quote_request_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_quote_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."company_sites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_activity" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "job_activity_insert_participant" ON "public"."job_activity" FOR INSERT TO "authenticated" WITH CHECK ((("actor_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs" "j"
  WHERE (("j"."id" = "job_activity"."job_id") AND (("auth"."uid"() = "j"."created_by") OR ("auth"."uid"() = "j"."assigned_to")))))));



CREATE POLICY "job_activity_select_authenticated" ON "public"."job_activity" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_chat_reads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "job_chat_reads_insert_own_participant" ON "public"."job_chat_reads" FOR INSERT TO "authenticated" WITH CHECK ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs" "j"
  WHERE (("j"."id" = "job_chat_reads"."job_id") AND (("auth"."uid"() = "j"."created_by") OR ("auth"."uid"() = "j"."assigned_to")))))));



CREATE POLICY "job_chat_reads_select_own_participant" ON "public"."job_chat_reads" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs" "j"
  WHERE (("j"."id" = "job_chat_reads"."job_id") AND (("auth"."uid"() = "j"."created_by") OR ("auth"."uid"() = "j"."assigned_to")))))));



CREATE POLICY "job_chat_reads_update_own_participant" ON "public"."job_chat_reads" FOR UPDATE TO "authenticated" USING ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs" "j"
  WHERE (("j"."id" = "job_chat_reads"."job_id") AND (("auth"."uid"() = "j"."created_by") OR ("auth"."uid"() = "j"."assigned_to"))))))) WITH CHECK ((("user_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs" "j"
  WHERE (("j"."id" = "job_chat_reads"."job_id") AND (("auth"."uid"() = "j"."created_by") OR ("auth"."uid"() = "j"."assigned_to")))))));



ALTER TABLE "public"."job_reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_insert_participants" ON "public"."messages" FOR INSERT TO "authenticated" WITH CHECK ((("sender_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "messages"."job_id") AND (("jobs"."created_by" = "auth"."uid"()) OR ("jobs"."assigned_to" = "auth"."uid"())) AND ("jobs"."assigned_to" IS NOT NULL))))));



CREATE POLICY "messages_select_participants" ON "public"."messages" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "messages"."job_id") AND (("jobs"."created_by" = "auth"."uid"()) OR ("jobs"."assigned_to" = "auth"."uid"())) AND ("jobs"."assigned_to" IS NOT NULL)))));



CREATE POLICY "messages_update_read_at_for_job_participants" ON "public"."messages" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "messages"."job_id") AND (("auth"."uid"() = "jobs"."created_by") OR ("auth"."uid"() = "jobs"."assigned_to")))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."jobs"
  WHERE (("jobs"."id" = "messages"."job_id") AND (("auth"."uid"() = "jobs"."created_by") OR ("auth"."uid"() = "jobs"."assigned_to"))))));



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."outreach_email_preferences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reviews_delete" ON "public"."reviews" FOR DELETE TO "authenticated" USING (("reviewer_id" = "auth"."uid"()));



CREATE POLICY "reviews_insert" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK ((("reviewer_id" = "auth"."uid"()) AND ("reviewer_id" <> "reviewee_id") AND ("entity_type" = ANY (ARRAY['job'::"text", 'service'::"text", 'company'::"text"])) AND ("entity_id" IS NOT NULL) AND (("rating" >= 1) AND ("rating" <= 5))));



CREATE POLICY "reviews_select" ON "public"."reviews" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "reviews_update" ON "public"."reviews" FOR UPDATE TO "authenticated" USING (("reviewer_id" = "auth"."uid"())) WITH CHECK ((("reviewer_id" = "auth"."uid"()) AND ("reviewer_id" <> "reviewee_id") AND ("entity_type" = ANY (ARRAY['job'::"text", 'service'::"text", 'company'::"text"])) AND ("entity_id" IS NOT NULL) AND (("rating" >= 1) AND ("rating" <= 5))));



ALTER TABLE "public"."saved_jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."security_rate_limits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "service profiles public read" ON "public"."service_profiles" FOR SELECT USING (true);



ALTER TABLE "public"."service_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users can delete own service profile" ON "public"."service_profiles" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "users can insert own service profile" ON "public"."service_profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "users can update own service profile" ON "public"."service_profiles" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."accept_job_application"("p_application_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."accept_job_application"("p_application_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."accept_job_application"("p_application_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."accept_job_application"("p_application_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."approve_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."approve_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."consume_security_rate_limit"("p_action" "text", "p_key_hash" "text", "p_limit" integer, "p_window_seconds" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."consume_security_rate_limit"("p_action" "text", "p_key_hash" "text", "p_limit" integer, "p_window_seconds" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."enforce_company_site_premium_features"() TO "anon";
GRANT ALL ON FUNCTION "public"."enforce_company_site_premium_features"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."enforce_company_site_premium_features"() TO "service_role";



GRANT ALL ON FUNCTION "public"."ensure_company_booking_settings"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_company_booking_settings"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_company_booking_settings"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."ensure_crm_customer_company_match"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ensure_crm_customer_company_match"() TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_crm_customer_company_match"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_crm_customer_company_match"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_company_booking_occurrences"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_company_booking_occurrences"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_company_booking_occurrences"() TO "service_role";



GRANT ALL ON FUNCTION "public"."guard_company_booking_occurrence_conflict"() TO "anon";
GRANT ALL ON FUNCTION "public"."guard_company_booking_occurrence_conflict"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."guard_company_booking_occurrence_conflict"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_job_activity_for_jobs"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_job_activity_for_jobs"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_job_activity_for_jobs"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_job_activity_for_reviews"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_job_activity_for_reviews"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_job_activity_for_reviews"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_company_booking_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_company_booking_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_company_booking_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_company_booking_occurrence_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_company_booking_occurrence_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_company_booking_occurrence_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_company_crm_customer_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_company_crm_customer_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_company_crm_customer_activity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."log_company_quote_request_activity"() TO "anon";
GRANT ALL ON FUNCTION "public"."log_company_quote_request_activity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."log_company_quote_request_activity"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."reject_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "rejection_note" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."reject_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "rejection_note" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."reject_job_application"("p_application_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."reject_job_application"("p_application_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."reject_job_application"("p_application_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."reject_job_application"("p_application_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."request_more_info_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "request_note" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."request_more_info_company_claim"("claim_request_id" "uuid", "reviewer_user_id" "uuid", "request_note" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_companies_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_companies_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_companies_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_company_claim_request_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_company_claim_request_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_company_claim_request_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_company_claim_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_company_claim_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_company_claim_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_company_quote_requests_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_company_quote_requests_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_company_quote_requests_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_company_sites_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_company_sites_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_company_sites_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_job_application_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_job_application_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_job_application_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_company_booking_occurrences"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_company_booking_occurrences"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_company_booking_occurrences"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sync_crm_customer_from_booking"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_booking"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_booking"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_booking"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."sync_crm_customer_from_quote_request"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_quote_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_quote_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_crm_customer_from_quote_request"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_billing_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_billing_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_billing_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_company_booking_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_company_booking_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_company_booking_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_company_crm_customer"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_company_crm_customer"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_company_crm_customer"() TO "service_role";



GRANT ALL ON FUNCTION "public"."touch_company_quote_request"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_company_quote_request"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_company_quote_request"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() TO "anon";
GRANT ALL ON FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."touch_crm_customer_from_booking_occurrence"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_company_leads_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_company_leads_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_company_leads_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_company_crm_customer"("p_company_id" "uuid", "p_user_id" "uuid", "p_customer_name" "text", "p_email" "text", "p_phone" "text", "p_city" "text", "p_seen_at" timestamp with time zone, "p_lifecycle_stage" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."user_has_premium"("target_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."user_has_premium"("target_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_premium"("target_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_premium"("target_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."validate_review_entity"() TO "anon";
GRANT ALL ON FUNCTION "public"."validate_review_entity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validate_review_entity"() TO "service_role";



GRANT ALL ON TABLE "public"."billing_subscriptions" TO "service_role";
GRANT SELECT ON TABLE "public"."billing_subscriptions" TO "authenticated";



GRANT ALL ON TABLE "public"."billing_transactions" TO "service_role";
GRANT SELECT ON TABLE "public"."billing_transactions" TO "authenticated";



GRANT ALL ON TABLE "public"."billing_webhook_events" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."company_booking_activity" TO "anon";
GRANT ALL ON TABLE "public"."company_booking_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."company_booking_activity" TO "service_role";



GRANT ALL ON TABLE "public"."company_booking_occurrences" TO "anon";
GRANT ALL ON TABLE "public"."company_booking_occurrences" TO "authenticated";
GRANT ALL ON TABLE "public"."company_booking_occurrences" TO "service_role";



GRANT ALL ON TABLE "public"."company_booking_settings" TO "anon";
GRANT ALL ON TABLE "public"."company_booking_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."company_booking_settings" TO "service_role";



GRANT ALL ON TABLE "public"."company_bookings" TO "anon";
GRANT ALL ON TABLE "public"."company_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."company_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."company_claim_audit" TO "anon";
GRANT ALL ON TABLE "public"."company_claim_audit" TO "authenticated";
GRANT ALL ON TABLE "public"."company_claim_audit" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."company_claim_requests" TO "anon";
GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."company_claim_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."company_claim_requests" TO "service_role";



GRANT ALL ON TABLE "public"."company_crm_customer_activity" TO "anon";
GRANT ALL ON TABLE "public"."company_crm_customer_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."company_crm_customer_activity" TO "service_role";



GRANT ALL ON TABLE "public"."company_crm_customers" TO "anon";
GRANT ALL ON TABLE "public"."company_crm_customers" TO "authenticated";
GRANT ALL ON TABLE "public"."company_crm_customers" TO "service_role";



GRANT ALL ON TABLE "public"."company_leads" TO "anon";
GRANT ALL ON TABLE "public"."company_leads" TO "authenticated";
GRANT ALL ON TABLE "public"."company_leads" TO "service_role";



GRANT ALL ON TABLE "public"."company_quote_request_activity" TO "anon";
GRANT ALL ON TABLE "public"."company_quote_request_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."company_quote_request_activity" TO "service_role";



GRANT ALL ON TABLE "public"."company_quote_requests" TO "anon";
GRANT ALL ON TABLE "public"."company_quote_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."company_quote_requests" TO "service_role";



GRANT ALL ON TABLE "public"."company_sites" TO "anon";
GRANT ALL ON TABLE "public"."company_sites" TO "authenticated";
GRANT ALL ON TABLE "public"."company_sites" TO "service_role";



GRANT ALL ON TABLE "public"."job_activity" TO "anon";
GRANT ALL ON TABLE "public"."job_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."job_activity" TO "service_role";



GRANT ALL ON TABLE "public"."job_applications" TO "anon";
GRANT ALL ON TABLE "public"."job_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."job_applications" TO "service_role";



GRANT ALL ON TABLE "public"."job_chat_reads" TO "anon";
GRANT ALL ON TABLE "public"."job_chat_reads" TO "authenticated";
GRANT ALL ON TABLE "public"."job_chat_reads" TO "service_role";



GRANT ALL ON TABLE "public"."job_reports" TO "anon";
GRANT ALL ON TABLE "public"."job_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."job_reports" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT UPDATE("read_at") ON TABLE "public"."messages" TO "authenticated";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."outreach_email_preferences" TO "service_role";



GRANT SELECT,MAINTAIN ON TABLE "public"."profiles" TO "anon";
GRANT SELECT,MAINTAIN ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT INSERT("id") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("full_name"),UPDATE("full_name") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("phone"),UPDATE("phone") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("city"),UPDATE("city") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("avatar_url"),UPDATE("avatar_url") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("company_logo_url"),UPDATE("company_logo_url") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("company_name"),UPDATE("company_name") ON TABLE "public"."profiles" TO "authenticated";



GRANT INSERT("bio"),UPDATE("bio") ON TABLE "public"."profiles" TO "authenticated";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."saved_jobs" TO "anon";
GRANT ALL ON TABLE "public"."saved_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."security_rate_limits" TO "service_role";



GRANT ALL ON TABLE "public"."service_profiles" TO "anon";
GRANT ALL ON TABLE "public"."service_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."service_profiles" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







