begin;

-- ============================================================================
-- Clean Jobs — Mass Import 4/4
-- Production rollout QA for imported Swedish cleaning-company data.
-- Read-only audit RPCs + scale-friendly indexes. No outreach is sent here.
-- ============================================================================

create index if not exists company_leads_import_catalog_qa_idx
  on public.company_leads(
    import_batch_id,
    catalog_publication_status,
    data_quality_score desc,
    created_at asc
  )
  where import_batch_id is not null;

create index if not exists company_leads_import_enrichment_qa_idx
  on public.company_leads(
    import_batch_id,
    email_scan_status,
    email_scan_attempt_count,
    created_at asc
  )
  where import_batch_id is not null
    and website is not null
    and website <> ''
    and (email is null or email = '');

create or replace function public.get_company_import_rollout_summary(
  p_import_batch_id uuid default null,
  p_min_quality integer default 55,
  p_max_attempts integer default 3
)
returns jsonb
language sql
stable
security definer
set search_path = public, auth
as $$
  with parameters as (
    select
      greatest(0, least(coalesce(p_min_quality, 55), 100))::integer as min_quality,
      greatest(1, least(coalesce(p_max_attempts, 3), 10))::integer as max_attempts
  ),
  scoped as (
    select lead.*
    from public.company_leads lead
    where lead.import_batch_id is not null
      and (p_import_batch_id is null or lead.import_batch_id = p_import_batch_id)
  ),
  aggregate_stats as (
    select
      count(*)::integer as total,
      count(*) filter (where lead.organization_number is not null)::integer as with_org_number,
      count(*) filter (where lead.website_domain is not null)::integer as with_website,
      count(*) filter (where lead.normalized_email is not null)::integer as with_email,
      count(*) filter (where lead.normalized_phone is not null)::integer as with_phone,
      count(*) filter (where nullif(trim(coalesce(lead.city, '')), '') is not null)::integer as with_city,
      count(*) filter (where lead.data_quality_score >= 80)::integer as quality_80_plus,
      count(*) filter (
        where lead.data_quality_score >= parameters.min_quality
          and lead.data_quality_score < 80
      )::integer as quality_55_79,
      count(*) filter (where lead.data_quality_score < parameters.min_quality)::integer as quality_below_55,
      count(*) filter (
        where lead.catalog_company_id is null
          and lead.catalog_publication_status in ('pending', 'failed')
          and lead.status <> 'ignored'
          and nullif(trim(coalesce(lead.company_name, '')), '') is not null
          and nullif(trim(coalesce(lead.city, '')), '') is not null
          and lead.data_quality_score >= parameters.min_quality
      )::integer as ready_to_publish,
      count(*) filter (where lead.catalog_publication_status = 'published')::integer as published,
      count(*) filter (where lead.catalog_publication_status = 'linked_existing')::integer as linked_existing,
      count(*) filter (where lead.catalog_publication_status = 'failed')::integer as publication_failed,
      count(*) filter (
        where nullif(trim(coalesce(lead.website, '')), '') is not null
          and nullif(trim(coalesce(lead.email, '')), '') is null
          and lead.email_scan_status = 'never_scanned'
          and lead.email_scan_attempt_count < parameters.max_attempts
      )::integer as needs_first_scan,
      count(*) filter (
        where nullif(trim(coalesce(lead.website, '')), '') is not null
          and nullif(trim(coalesce(lead.email, '')), '') is null
          and lead.email_scan_status in ('not_found', 'timeout', 'invalid_site', 'failed')
          and lead.email_scan_attempt_count < parameters.max_attempts
      )::integer as retryable_enrichment,
      count(*) filter (
        where nullif(trim(coalesce(lead.website, '')), '') is not null
          and nullif(trim(coalesce(lead.email, '')), '') is null
          and lead.email_scan_status <> 'found'
          and lead.email_scan_attempt_count >= parameters.max_attempts
      )::integer as enrichment_exhausted,
      count(*) filter (
        where nullif(trim(coalesce(lead.city, '')), '') is null
          and lead.catalog_company_id is null
          and lead.status <> 'ignored'
      )::integer as missing_city,
      count(*) filter (
        where nullif(trim(coalesce(lead.email, '')), '') is null
          and nullif(trim(coalesce(lead.website, '')), '') is null
          and nullif(trim(coalesce(lead.phone, '')), '') is null
          and lead.status <> 'ignored'
      )::integer as no_reachable_contact,
      count(*) filter (where lead.status = 'ignored')::integer as ignored,
      count(*) filter (
        where (
          lead.catalog_company_id is null
          and lead.catalog_publication_status in ('published', 'linked_existing')
        ) or (
          lead.catalog_company_id is not null
          and lead.catalog_publication_status not in ('published', 'linked_existing')
        ) or (
          lead.email_scan_status = 'found'
          and nullif(trim(coalesce(lead.email, '')), '') is null
        )
      )::integer as integrity_issues
    from scoped lead
    cross join parameters
  ),
  active_enrichment as (
    select count(distinct item.lead_id)::integer as active_count
    from public.company_enrichment_batch_items item
    join scoped lead on lead.id = item.lead_id
    where item.status in ('queued', 'processing')
  )
  select jsonb_build_object(
    'total', stats.total,
    'with_org_number', stats.with_org_number,
    'with_website', stats.with_website,
    'with_email', stats.with_email,
    'with_phone', stats.with_phone,
    'with_city', stats.with_city,
    'quality_80_plus', stats.quality_80_plus,
    'quality_55_79', stats.quality_55_79,
    'quality_below_55', stats.quality_below_55,
    'ready_to_publish', stats.ready_to_publish,
    'published', stats.published,
    'linked_existing', stats.linked_existing,
    'publication_failed', stats.publication_failed,
    'needs_first_scan', stats.needs_first_scan,
    'retryable_enrichment', stats.retryable_enrichment,
    'enrichment_exhausted', stats.enrichment_exhausted,
    'active_enrichment', active.active_count,
    'missing_city', stats.missing_city,
    'no_reachable_contact', stats.no_reachable_contact,
    'ignored', stats.ignored,
    'integrity_issues', stats.integrity_issues,
    'min_quality', parameters.min_quality,
    'max_attempts', parameters.max_attempts
  )
  from aggregate_stats stats
  cross join active_enrichment active
  cross join parameters;
$$;

create or replace function public.get_company_import_rollout_issues(
  p_import_batch_id uuid default null,
  p_min_quality integer default 55,
  p_max_attempts integer default 3,
  p_limit integer default 100
)
returns table (
  issue_code text,
  severity text,
  lead_id uuid,
  company_name text,
  city text,
  data_quality_score integer,
  email_scan_status text,
  email_scan_attempt_count integer,
  catalog_publication_status text,
  detail text
)
language sql
stable
security definer
set search_path = public, auth
as $$
  with parameters as (
    select
      greatest(0, least(coalesce(p_min_quality, 55), 100))::integer as min_quality,
      greatest(1, least(coalesce(p_max_attempts, 3), 10))::integer as max_attempts
  ),
  scoped as (
    select lead.*
    from public.company_leads lead
    where lead.import_batch_id is not null
      and (p_import_batch_id is null or lead.import_batch_id = p_import_batch_id)
  ),
  issues as (
    select
      'catalog_state_mismatch'::text as issue_code,
      'blocker'::text as severity,
      lead.id as lead_id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      'Catalog publication status and catalog_company_id disagree.'::text as detail
    from scoped lead
    where (
      lead.catalog_company_id is null
      and lead.catalog_publication_status in ('published', 'linked_existing')
    ) or (
      lead.catalog_company_id is not null
      and lead.catalog_publication_status not in ('published', 'linked_existing')
    )

    union all

    select
      'found_without_email',
      'blocker',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      'Email scan status is found, but the lead has no saved email.'
    from scoped lead
    where lead.email_scan_status = 'found'
      and nullif(trim(coalesce(lead.email, '')), '') is null

    union all

    select
      'publication_failed',
      'blocker',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      coalesce(nullif(trim(lead.catalog_publish_error), ''), 'Catalog publication failed without a saved error.')
    from scoped lead
    where lead.catalog_publication_status = 'failed'
      and lead.catalog_company_id is null

    union all

    select
      'missing_city',
      'blocker',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      'City is required before a new public company profile can be published.'
    from scoped lead
    where nullif(trim(coalesce(lead.city, '')), '') is null
      and lead.catalog_company_id is null
      and lead.status <> 'ignored'

    union all

    select
      'no_reachable_contact',
      'review',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      'No email, website or phone is currently available for outreach.'
    from scoped lead
    where nullif(trim(coalesce(lead.email, '')), '') is null
      and nullif(trim(coalesce(lead.website, '')), '') is null
      and nullif(trim(coalesce(lead.phone, '')), '') is null
      and lead.status <> 'ignored'

    union all

    select
      'enrichment_exhausted',
      'review',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      format('Email enrichment reached %s attempts without finding an email.', parameters.max_attempts)
    from scoped lead
    cross join parameters
    where nullif(trim(coalesce(lead.website, '')), '') is not null
      and nullif(trim(coalesce(lead.email, '')), '') is null
      and lead.email_scan_status <> 'found'
      and lead.email_scan_attempt_count >= parameters.max_attempts

    union all

    select
      'low_quality',
      'review',
      lead.id,
      lead.company_name,
      lead.city,
      lead.data_quality_score,
      lead.email_scan_status,
      lead.email_scan_attempt_count,
      lead.catalog_publication_status,
      format('Quality score is below the publication gate of %s.', parameters.min_quality)
    from scoped lead
    cross join parameters
    where lead.data_quality_score < parameters.min_quality
      and lead.catalog_company_id is null
      and lead.status <> 'ignored'
  )
  select
    issue.issue_code,
    issue.severity,
    issue.lead_id,
    issue.company_name,
    issue.city,
    issue.data_quality_score,
    issue.email_scan_status,
    issue.email_scan_attempt_count,
    issue.catalog_publication_status,
    left(issue.detail, 1000)::text as detail
  from issues issue
  order by
    case issue.severity when 'blocker' then 1 else 2 end,
    issue.data_quality_score asc,
    issue.company_name asc,
    issue.lead_id asc
  limit greatest(1, least(coalesce(p_limit, 100), 5000));
$$;

revoke all on function public.get_company_import_rollout_summary(uuid, integer, integer)
  from public, anon, authenticated;
revoke all on function public.get_company_import_rollout_issues(uuid, integer, integer, integer)
  from public, anon, authenticated;

grant execute on function public.get_company_import_rollout_summary(uuid, integer, integer)
  to service_role;
grant execute on function public.get_company_import_rollout_issues(uuid, integer, integer, integer)
  to service_role;

notify pgrst, 'reload schema';
commit;
