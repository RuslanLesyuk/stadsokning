begin;

-- ============================================================================
-- Clean Jobs — Mass Import 3/4
-- Persistent batch email enrichment for hundreds/thousands of imported leads.
-- The browser drives small server-side chunks; progress and retry state live in DB.
-- ============================================================================

create table if not exists public.company_enrichment_batches (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  import_batch_id uuid references public.company_import_batches(id) on delete set null,
  source_status text not null default 'never_scanned',
  imported_only boolean not null default true,
  max_attempts integer not null default 3,
  requested_limit integer not null default 1000,
  status text not null default 'queued',
  total_items integer not null default 0,
  queued_count integer not null default 0,
  processing_count integer not null default 0,
  completed_count integer not null default 0,
  found_count integer not null default 0,
  not_found_count integer not null default 0,
  timeout_count integer not null default 0,
  invalid_site_count integer not null default 0,
  failed_count integer not null default 0,
  skipped_count integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_enrichment_batches_source_status_check
    check (source_status in ('never_scanned', 'not_found', 'timeout', 'invalid_site', 'failed')),
  constraint company_enrichment_batches_status_check
    check (status in ('queued', 'running', 'completed')),
  constraint company_enrichment_batches_limits_check
    check (max_attempts between 1 and 10 and requested_limit between 1 and 5000),
  constraint company_enrichment_batches_counts_check
    check (
      total_items >= 0 and queued_count >= 0 and processing_count >= 0 and
      completed_count >= 0 and found_count >= 0 and not_found_count >= 0 and
      timeout_count >= 0 and invalid_site_count >= 0 and failed_count >= 0 and
      skipped_count >= 0
    )
);

create index if not exists company_enrichment_batches_created_idx
  on public.company_enrichment_batches(created_at desc);

create index if not exists company_enrichment_batches_status_idx
  on public.company_enrichment_batches(status, created_at desc);

create index if not exists company_enrichment_batches_import_batch_idx
  on public.company_enrichment_batches(import_batch_id, created_at desc)
  where import_batch_id is not null;

alter table public.company_enrichment_batches enable row level security;
revoke all on public.company_enrichment_batches from public, anon, authenticated;
grant select, insert, update, delete on public.company_enrichment_batches to service_role;

create or replace function public.touch_company_enrichment_batch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_company_enrichment_batch_updated_at on public.company_enrichment_batches;
create trigger touch_company_enrichment_batch_updated_at
before update on public.company_enrichment_batches
for each row execute function public.touch_company_enrichment_batch_updated_at();

alter table public.company_leads
  add column if not exists email_scan_attempt_count integer not null default 0,
  add column if not exists email_scan_last_attempt_at timestamptz,
  add column if not exists email_scan_last_batch_id uuid references public.company_enrichment_batches(id) on delete set null;

alter table public.company_leads
  drop constraint if exists company_leads_email_scan_attempt_count_check;

alter table public.company_leads
  add constraint company_leads_email_scan_attempt_count_check
  check (email_scan_attempt_count >= 0);

update public.company_leads
set email_scan_attempt_count = 1
where email_scan_attempt_count = 0
  and email_checked_at is not null
  and email_scan_status <> 'never_scanned';

create index if not exists company_leads_enrichment_queue_idx
  on public.company_leads(email_scan_status, email_scan_attempt_count, created_at asc)
  where website is not null
    and website <> ''
    and (email is null or email = '');

create index if not exists company_leads_email_scan_last_batch_idx
  on public.company_leads(email_scan_last_batch_id)
  where email_scan_last_batch_id is not null;

create table if not exists public.company_enrichment_batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.company_enrichment_batches(id) on delete cascade,
  lead_id uuid not null references public.company_leads(id) on delete cascade,
  position integer not null,
  source_status text not null,
  status text not null default 'queued',
  result_status text,
  claim_attempts integer not null default 0,
  worker_token text,
  claimed_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_enrichment_batch_items_unique_lead unique(batch_id, lead_id),
  constraint company_enrichment_batch_items_position_check check (position > 0),
  constraint company_enrichment_batch_items_source_status_check
    check (source_status in ('never_scanned', 'not_found', 'timeout', 'invalid_site', 'failed')),
  constraint company_enrichment_batch_items_status_check
    check (status in ('queued', 'processing', 'completed')),
  constraint company_enrichment_batch_items_result_status_check
    check (result_status is null or result_status in ('found', 'not_found', 'timeout', 'invalid_site', 'failed', 'skipped')),
  constraint company_enrichment_batch_items_claim_attempts_check check (claim_attempts >= 0)
);

create index if not exists company_enrichment_batch_items_queue_idx
  on public.company_enrichment_batch_items(batch_id, status, position);

create index if not exists company_enrichment_batch_items_lead_idx
  on public.company_enrichment_batch_items(lead_id, created_at desc);

create unique index if not exists company_enrichment_batch_items_one_active_lead_idx
  on public.company_enrichment_batch_items(lead_id)
  where status in ('queued', 'processing');

create index if not exists company_enrichment_batch_items_claim_idx
  on public.company_enrichment_batch_items(batch_id, claimed_at)
  where status = 'processing';

alter table public.company_enrichment_batch_items enable row level security;
revoke all on public.company_enrichment_batch_items from public, anon, authenticated;
grant select, insert, update, delete on public.company_enrichment_batch_items to service_role;

create or replace function public.touch_company_enrichment_batch_item_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_company_enrichment_batch_item_updated_at on public.company_enrichment_batch_items;
create trigger touch_company_enrichment_batch_item_updated_at
before update on public.company_enrichment_batch_items
for each row execute function public.touch_company_enrichment_batch_item_updated_at();

create or replace function public.refresh_company_enrichment_batch(p_batch_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_total integer := 0;
  v_queued integer := 0;
  v_processing integer := 0;
  v_completed integer := 0;
  v_found integer := 0;
  v_not_found integer := 0;
  v_timeout integer := 0;
  v_invalid_site integer := 0;
  v_failed integer := 0;
  v_skipped integer := 0;
  v_status text := 'queued';
  v_completed_at timestamptz;
begin
  select
    count(*)::integer,
    count(*) filter (where item.status = 'queued')::integer,
    count(*) filter (where item.status = 'processing')::integer,
    count(*) filter (where item.status = 'completed')::integer,
    count(*) filter (where item.result_status = 'found')::integer,
    count(*) filter (where item.result_status = 'not_found')::integer,
    count(*) filter (where item.result_status = 'timeout')::integer,
    count(*) filter (where item.result_status = 'invalid_site')::integer,
    count(*) filter (where item.result_status = 'failed')::integer,
    count(*) filter (where item.result_status = 'skipped')::integer
  into
    v_total,
    v_queued,
    v_processing,
    v_completed,
    v_found,
    v_not_found,
    v_timeout,
    v_invalid_site,
    v_failed,
    v_skipped
  from public.company_enrichment_batch_items item
  where item.batch_id = p_batch_id;

  if v_total = 0 or (v_queued = 0 and v_processing = 0) then
    v_status := 'completed';
    v_completed_at := now();
  elsif v_processing > 0 or v_completed > 0 then
    v_status := 'running';
    v_completed_at := null;
  else
    v_status := 'queued';
    v_completed_at := null;
  end if;

  update public.company_enrichment_batches batch
  set
    status = v_status,
    total_items = v_total,
    queued_count = v_queued,
    processing_count = v_processing,
    completed_count = v_completed,
    found_count = v_found,
    not_found_count = v_not_found,
    timeout_count = v_timeout,
    invalid_site_count = v_invalid_site,
    failed_count = v_failed,
    skipped_count = v_skipped,
    completed_at = case
      when v_status = 'completed' then coalesce(batch.completed_at, v_completed_at)
      else null
    end
  where batch.id = p_batch_id;

  if not found then
    raise exception 'Enrichment batch % was not found.', p_batch_id;
  end if;

  return jsonb_build_object(
    'id', p_batch_id,
    'status', v_status,
    'total', v_total,
    'queued', v_queued,
    'processing', v_processing,
    'completed', v_completed,
    'found', v_found,
    'not_found', v_not_found,
    'timeout', v_timeout,
    'invalid_site', v_invalid_site,
    'failed', v_failed,
    'skipped', v_skipped,
    'remaining', v_queued + v_processing
  );
end;
$$;

create or replace function public.create_company_enrichment_batch(
  p_created_by uuid,
  p_source_status text default 'never_scanned',
  p_import_batch_id uuid default null,
  p_imported_only boolean default true,
  p_limit integer default 1000,
  p_max_attempts integer default 3
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_batch_id uuid;
  v_count integer := 0;
begin
  if p_source_status is null or p_source_status not in ('never_scanned', 'not_found', 'timeout', 'invalid_site', 'failed') then
    raise exception 'Invalid enrichment source status: %', p_source_status;
  end if;

  p_limit := greatest(1, least(coalesce(p_limit, 1000), 5000));
  p_max_attempts := greatest(1, least(coalesce(p_max_attempts, 3), 10));

  if p_import_batch_id is not null and not exists (
    select 1 from public.company_import_batches import_batch where import_batch.id = p_import_batch_id
  ) then
    raise exception 'Import batch % was not found.', p_import_batch_id;
  end if;

  insert into public.company_enrichment_batches (
    created_by,
    import_batch_id,
    source_status,
    imported_only,
    max_attempts,
    requested_limit,
    status
  ) values (
    p_created_by,
    p_import_batch_id,
    p_source_status,
    case when p_import_batch_id is not null then true else coalesce(p_imported_only, true) end,
    p_max_attempts,
    p_limit,
    'queued'
  )
  returning id into v_batch_id;

  with candidates as (
    select
      lead.id,
      (row_number() over (order by lead.created_at asc, lead.id asc))::integer as position
    from public.company_leads lead
    where nullif(trim(coalesce(lead.website, '')), '') is not null
      and nullif(trim(coalesce(lead.email, '')), '') is null
      and lead.email_scan_status = p_source_status
      and lead.email_scan_attempt_count < p_max_attempts
      and (p_import_batch_id is null or lead.import_batch_id = p_import_batch_id)
      and (
        p_import_batch_id is not null
        or not coalesce(p_imported_only, true)
        or lead.import_batch_id is not null
      )
      and not exists (
        select 1
        from public.company_enrichment_batch_items active_item
        join public.company_enrichment_batches active_batch on active_batch.id = active_item.batch_id
        where active_item.lead_id = lead.id
          and active_item.status in ('queued', 'processing')
          and active_batch.status in ('queued', 'running')
      )
    order by lead.created_at asc, lead.id asc
    limit p_limit
  )
  insert into public.company_enrichment_batch_items (
    batch_id,
    lead_id,
    position,
    source_status
  )
  select
    v_batch_id,
    candidate.id,
    candidate.position,
    p_source_status
  from candidates candidate
  on conflict do nothing;

  get diagnostics v_count = row_count;

  update public.company_enrichment_batches
  set
    total_items = v_count,
    queued_count = v_count,
    status = case when v_count = 0 then 'completed' else 'queued' end,
    completed_at = case when v_count = 0 then now() else null end
  where id = v_batch_id;

  return jsonb_build_object(
    'id', v_batch_id,
    'status', case when v_count = 0 then 'completed' else 'queued' end,
    'total', v_count,
    'queued', v_count,
    'processing', 0,
    'completed', 0,
    'found', 0,
    'not_found', 0,
    'timeout', 0,
    'invalid_site', 0,
    'failed', 0,
    'skipped', 0,
    'remaining', v_count
  );
end;
$$;

create or replace function public.claim_company_enrichment_items(
  p_batch_id uuid,
  p_limit integer default 8,
  p_worker_token text default null
)
returns table (
  item_id uuid,
  lead_id uuid,
  company_name text,
  website text,
  source_status text,
  catalog_company_id uuid
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if nullif(trim(coalesce(p_worker_token, '')), '') is null then
    raise exception 'Worker token is required.';
  end if;

  p_limit := greatest(1, least(coalesce(p_limit, 8), 12));

  if not exists (select 1 from public.company_enrichment_batches batch where batch.id = p_batch_id) then
    raise exception 'Enrichment batch % was not found.', p_batch_id;
  end if;

  -- A browser/tab can disappear during a scan. Requeue abandoned claims after 15 minutes.
  update public.company_enrichment_batch_items item
  set
    status = 'queued',
    worker_token = null,
    claimed_at = null,
    error_message = coalesce(item.error_message, 'Previous worker claim expired and was requeued.')
  where item.batch_id = p_batch_id
    and item.status = 'processing'
    and item.claimed_at < now() - interval '15 minutes';

  update public.company_enrichment_batches batch
  set
    status = 'running',
    started_at = coalesce(batch.started_at, now()),
    completed_at = null
  where batch.id = p_batch_id
    and batch.status <> 'completed';

  return query
  with candidates as (
    select item.id
    from public.company_enrichment_batch_items item
    where item.batch_id = p_batch_id
      and item.status = 'queued'
    order by item.position asc, item.id asc
    for update skip locked
    limit p_limit
  ), claimed as (
    update public.company_enrichment_batch_items item
    set
      status = 'processing',
      worker_token = p_worker_token,
      claimed_at = now(),
      claim_attempts = item.claim_attempts + 1,
      error_message = null
    from candidates candidate
    where item.id = candidate.id
    returning item.id, item.lead_id, item.source_status
  )
  select
    claimed.id,
    lead.id,
    lead.company_name,
    lead.website,
    claimed.source_status,
    lead.catalog_company_id
  from claimed
  join public.company_leads lead on lead.id = claimed.lead_id
  order by claimed.id;
end;
$$;

create or replace function public.complete_company_enrichment_item(
  p_item_id uuid,
  p_worker_token text,
  p_result_status text,
  p_email text default null,
  p_email_source text default null,
  p_email_source_url text default null,
  p_error text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_item public.company_enrichment_batch_items%rowtype;
  v_lead public.company_leads%rowtype;
  v_final_status text := p_result_status;
  v_quality integer := 0;
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
begin
  if p_result_status not in ('found', 'not_found', 'timeout', 'invalid_site', 'failed') then
    raise exception 'Invalid enrichment result status: %', p_result_status;
  end if;

  select item.* into v_item
  from public.company_enrichment_batch_items item
  where item.id = p_item_id
    and item.status = 'processing'
    and item.worker_token = p_worker_token
  for update;

  if not found then
    return jsonb_build_object('saved', false, 'status', 'stale_claim');
  end if;

  select lead.* into v_lead
  from public.company_leads lead
  where lead.id = v_item.lead_id
  for update;

  if not found then
    update public.company_enrichment_batch_items
    set
      status = 'completed',
      result_status = 'failed',
      completed_at = now(),
      worker_token = null,
      error_message = 'Lead no longer exists.'
    where id = v_item.id;

    return jsonb_build_object('saved', false, 'status', 'failed');
  end if;

  if nullif(trim(coalesce(v_lead.email, '')), '') is not null then
    v_final_status := 'skipped';
    v_quality := v_lead.data_quality_score;
  elsif p_result_status = 'found' then
    if v_email is null or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
      raise exception 'Found result is missing a valid email address.';
    end if;

    update public.company_leads lead
    set
      email = v_email,
      email_source = nullif(trim(coalesce(p_email_source, '')), ''),
      email_source_url = nullif(trim(coalesce(p_email_source_url, '')), ''),
      email_scan_status = 'found',
      email_checked_at = now(),
      email_scan_error = null,
      email_scan_attempt_count = lead.email_scan_attempt_count + 1,
      email_scan_last_attempt_at = now(),
      email_scan_last_batch_id = v_item.batch_id
    where lead.id = v_lead.id
    returning lead.data_quality_score into v_quality;

    if v_lead.catalog_company_id is not null then
      update public.companies company
      set
        email = v_email,
        updated_at = now()
      where company.id = v_lead.catalog_company_id
        and nullif(trim(coalesce(company.email, '')), '') is null;
    end if;
  else
    update public.company_leads lead
    set
      email_scan_status = p_result_status,
      email_checked_at = now(),
      email_scan_error = nullif(left(coalesce(p_error, ''), 1000), ''),
      email_source = null,
      email_source_url = null,
      email_scan_attempt_count = lead.email_scan_attempt_count + 1,
      email_scan_last_attempt_at = now(),
      email_scan_last_batch_id = v_item.batch_id
    where lead.id = v_lead.id
    returning lead.data_quality_score into v_quality;
  end if;

  update public.company_enrichment_batch_items item
  set
    status = 'completed',
    result_status = v_final_status,
    completed_at = now(),
    worker_token = null,
    error_message = case
      when v_final_status = 'skipped' then 'Lead already had an email when the result was saved.'
      else nullif(left(coalesce(p_error, ''), 1000), '')
    end
  where item.id = v_item.id;

  return jsonb_build_object(
    'saved', true,
    'status', v_final_status,
    'quality_score', coalesce(v_quality, 0)
  );
end;
$$;

revoke all on function public.refresh_company_enrichment_batch(uuid)
  from public, anon, authenticated;
revoke all on function public.create_company_enrichment_batch(uuid, text, uuid, boolean, integer, integer)
  from public, anon, authenticated;
revoke all on function public.claim_company_enrichment_items(uuid, integer, text)
  from public, anon, authenticated;
revoke all on function public.complete_company_enrichment_item(uuid, text, text, text, text, text, text)
  from public, anon, authenticated;

grant execute on function public.refresh_company_enrichment_batch(uuid) to service_role;
grant execute on function public.create_company_enrichment_batch(uuid, text, uuid, boolean, integer, integer) to service_role;
grant execute on function public.claim_company_enrichment_items(uuid, integer, text) to service_role;
grant execute on function public.complete_company_enrichment_item(uuid, text, text, text, text, text, text) to service_role;

notify pgrst, 'reload schema';
commit;
