alter table public.jobs
  add column if not exists acquisition_source text,
  add column if not exists acquisition_medium text,
  add column if not exists acquisition_campaign text,
  add column if not exists acquisition_content text,
  add column if not exists acquisition_term text,
  add column if not exists acquisition_referrer text,
  add column if not exists acquisition_landing_page text;

comment on column public.jobs.acquisition_source is
  'Consent-based acquisition source captured when the job is published.';
comment on column public.jobs.acquisition_medium is
  'Consent-based acquisition medium captured when the job is published.';
comment on column public.jobs.acquisition_campaign is
  'Consent-based UTM campaign captured when the job is published.';
comment on column public.jobs.acquisition_content is
  'Consent-based UTM content captured when the job is published.';
comment on column public.jobs.acquisition_term is
  'Consent-based UTM term captured when the job is published.';
comment on column public.jobs.acquisition_referrer is
  'Consent-based referring hostname captured when the job is published.';
comment on column public.jobs.acquisition_landing_page is
  'Consent-based landing path captured when the job is published.';

create index if not exists jobs_acquisition_source_created_at_idx
  on public.jobs (acquisition_source, created_at desc);

grant insert (
  acquisition_source,
  acquisition_medium,
  acquisition_campaign,
  acquisition_content,
  acquisition_term,
  acquisition_referrer,
  acquisition_landing_page
) on table public.jobs to authenticated;
