begin;

-- -----------------------------------------------------------------------------
-- Claim Company 2.0
-- -----------------------------------------------------------------------------

alter table public.company_claim_requests
  add column if not exists evidence_paths text[] not null default '{}'::text[],
  add column if not exists locale text not null default 'sv',
  add column if not exists business_email_domain text,
  add column if not exists company_domain text,
  add column if not exists email_domain_match boolean not null default false,
  add column if not exists requested_info_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists resubmitted_at timestamptz;

alter table public.companies
  add column if not exists claimed_at timestamptz;

-- Replace old status check, regardless of the name Supabase/Postgres generated.
do $$
declare
  constraint_row record;
begin
  for constraint_row in
    select c.conname
    from pg_constraint c
    join pg_class t on t.oid = c.conrelid
    join pg_namespace n on n.oid = t.relnamespace
    where n.nspname = 'public'
      and t.relname = 'company_claim_requests'
      and c.contype = 'c'
      and pg_get_constraintdef(c.oid) ilike '%status%'
  loop
    execute format(
      'alter table public.company_claim_requests drop constraint if exists %I',
      constraint_row.conname
    );
  end loop;
end
$$;

alter table public.company_claim_requests
  add constraint company_claim_requests_status_check
  check (
    status in (
      'pending',
      'needs_info',
      'approved',
      'rejected',
      'cancelled'
    )
  );

alter table public.company_claim_requests
  drop constraint if exists company_claim_requests_locale_check;

alter table public.company_claim_requests
  add constraint company_claim_requests_locale_check
  check (locale in ('sv', 'en', 'uk', 'ru', 'pl'));

-- Remove the common legacy all-time uniqueness constraint so rejected/cancelled
-- requests can be submitted again. Active requests remain unique below.
alter table public.company_claim_requests
  drop constraint if exists company_claim_requests_company_id_user_id_key;

alter table public.company_claim_requests
  drop constraint if exists company_claim_requests_user_id_company_id_key;

drop index if exists public.company_claim_requests_company_id_user_id_idx;
drop index if exists public.company_claim_requests_user_id_company_id_idx;

create unique index if not exists company_claim_requests_active_unique
  on public.company_claim_requests (company_id, user_id)
  where status in ('pending', 'needs_info');

create index if not exists company_claim_requests_company_status_created_idx
  on public.company_claim_requests (company_id, status, created_at desc);

create index if not exists company_claim_requests_user_status_created_idx
  on public.company_claim_requests (user_id, status, created_at desc);

-- Keep updated_at reliable.
create or replace function public.set_company_claim_updated_at()
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

drop trigger if exists set_company_claim_updated_at
on public.company_claim_requests;

create trigger set_company_claim_updated_at
before update on public.company_claim_requests
for each row
execute function public.set_company_claim_updated_at();

-- -----------------------------------------------------------------------------
-- Claim audit trail
-- -----------------------------------------------------------------------------

create table if not exists public.company_claim_audit (
  id uuid primary key default gen_random_uuid(),
  claim_id uuid not null references public.company_claim_requests(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists company_claim_audit_claim_created_idx
  on public.company_claim_audit (claim_id, created_at asc);

create index if not exists company_claim_audit_user_created_idx
  on public.company_claim_audit (user_id, created_at desc);

alter table public.company_claim_audit enable row level security;

grant select on public.company_claim_audit to authenticated;

drop policy if exists "Users can read own company claim audit"
on public.company_claim_audit;

create policy "Users can read own company claim audit"
on public.company_claim_audit
for select
to authenticated
using (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- Claim request RLS
-- -----------------------------------------------------------------------------

alter table public.company_claim_requests enable row level security;

grant select, insert, update
on public.company_claim_requests
to authenticated;

drop policy if exists "Users can read own company claims"
on public.company_claim_requests;

create policy "Users can read own company claims"
on public.company_claim_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create own company claims"
on public.company_claim_requests;

create policy "Users can create own company claims"
on public.company_claim_requests
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
);

drop policy if exists "Users can update own active company claims"
on public.company_claim_requests;

create policy "Users can update own active company claims"
on public.company_claim_requests
for update
to authenticated
using (
  user_id = auth.uid()
  and status in ('pending', 'needs_info')
)
with check (
  user_id = auth.uid()
  and status in ('pending', 'cancelled')
);

-- -----------------------------------------------------------------------------
-- Private proof-document bucket
-- Paths are USER_ID/CLAIM_ID/file.ext
-- -----------------------------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'company-claim-evidence',
  'company-claim-evidence',
  false,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Claimants can read own claim evidence"
on storage.objects;

create policy "Claimants can read own claim evidence"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'company-claim-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Claimants can upload own claim evidence"
on storage.objects;

create policy "Claimants can upload own claim evidence"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'company-claim-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Claimants can delete own claim evidence"
on storage.objects;

create policy "Claimants can delete own claim evidence"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'company-claim-evidence'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- -----------------------------------------------------------------------------
-- Notifications: keep this migration safe even if the quote-notification pack
-- has already added these fields.
-- -----------------------------------------------------------------------------

alter table public.notifications
  add column if not exists href text,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists dedupe_key text;

create unique index if not exists notifications_dedupe_key_unique
  on public.notifications (dedupe_key)
  where dedupe_key is not null;

create index if not exists notifications_entity_idx
  on public.notifications (entity_type, entity_id);

-- -----------------------------------------------------------------------------
-- Atomic admin review functions
-- -----------------------------------------------------------------------------

create or replace function public.approve_company_claim(
  claim_request_id uuid,
  reviewer_user_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
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

create or replace function public.reject_company_claim(
  claim_request_id uuid,
  reviewer_user_id uuid,
  rejection_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
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

create or replace function public.request_more_info_company_claim(
  claim_request_id uuid,
  reviewer_user_id uuid,
  request_note text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
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

notify pgrst, 'reload schema';

commit;
