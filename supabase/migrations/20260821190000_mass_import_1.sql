begin;

-- ============================================================================
-- Clean Jobs — Mass Import 1/4
-- Staging import, canonical normalization, import batches and safe deduplication.
-- company_leads remains the outreach CRM. Nothing here publishes to companies.
-- ============================================================================

create table if not exists public.company_import_batches (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid references auth.users(id) on delete set null,
  file_name text not null,
  file_type text not null,
  source text not null,
  status text not null default 'processing',
  total_rows integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  duplicate_count integer not null default 0,
  invalid_count integer not null default 0,
  failed_count integer not null default 0,
  error_message text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_import_batches_file_type_check check (file_type in ('xlsx', 'csv')),
  constraint company_import_batches_status_check check (status in ('processing', 'completed', 'failed')),
  constraint company_import_batches_counts_check check (
    total_rows >= 0 and created_count >= 0 and updated_count >= 0 and
    duplicate_count >= 0 and invalid_count >= 0 and failed_count >= 0
  )
);

create index if not exists company_import_batches_created_idx
  on public.company_import_batches(created_at desc);

alter table public.company_import_batches enable row level security;
revoke all on public.company_import_batches from anon, authenticated;
grant select, insert, update on public.company_import_batches to service_role;

create or replace function public.touch_company_import_batch_updated_at()
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

drop trigger if exists touch_company_import_batch_updated_at on public.company_import_batches;
create trigger touch_company_import_batch_updated_at
before update on public.company_import_batches
for each row execute function public.touch_company_import_batch_updated_at();

alter table public.company_leads
  add column if not exists organization_number text,
  add column if not exists address text,
  add column if not exists postal_code text,
  add column if not exists website_domain text,
  add column if not exists normalized_company_name text,
  add column if not exists normalized_city text,
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text,
  add column if not exists import_batch_id uuid references public.company_import_batches(id) on delete set null,
  add column if not exists import_row_number integer,
  add column if not exists import_fingerprint text,
  add column if not exists data_quality_score integer not null default 0,
  add column if not exists import_updated_at timestamptz;

create or replace function public.normalize_company_import_text(value text)
returns text
language sql
immutable
parallel safe
as $$
  select nullif(regexp_replace(lower(trim(coalesce(value, ''))), '\s+', ' ', 'g'), '');
$$;

create or replace function public.normalize_company_import_org_number(value text)
returns text
language plpgsql
immutable
parallel safe
as $$
declare
  digits text := regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g');
begin
  if length(digits) = 12 and left(digits, 2) = '16' then
    digits := right(digits, 10);
  end if;

  if length(digits) = 10 then
    return digits;
  end if;

  return null;
end;
$$;

create or replace function public.normalize_company_import_domain(value text)
returns text
language plpgsql
immutable
parallel safe
as $$
declare
  normalized text := lower(trim(coalesce(value, '')));
begin
  if normalized = '' then return null; end if;

  normalized := regexp_replace(normalized, '^https?://', '', 'i');
  normalized := regexp_replace(normalized, '^www\.', '', 'i');
  normalized := split_part(normalized, '/', 1);
  normalized := split_part(normalized, '?', 1);
  normalized := split_part(normalized, '#', 1);
  normalized := split_part(normalized, ':', 1);
  normalized := trim(trailing '.' from normalized);

  if normalized = '' or position('.' in normalized) = 0 or position('@' in normalized) > 0 or normalized ~ '[[:space:]]' then
    return null;
  end if;

  return normalized;
end;
$$;

create or replace function public.normalize_company_import_email(value text)
returns text
language sql
immutable
parallel safe
as $$
  select case
    when nullif(lower(trim(coalesce(value, ''))), '') is null then null
    when lower(trim(value)) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then null
    else lower(trim(value))
  end;
$$;

create or replace function public.normalize_company_import_phone(value text)
returns text
language plpgsql
immutable
parallel safe
as $$
declare
  digits text := regexp_replace(coalesce(value, ''), '[^0-9]', '', 'g');
begin
  if digits = '' then return null; end if;
  if left(digits, 4) = '0046' then digits := '46' || substr(digits, 5); end if;
  if left(digits, 1) = '0' and length(digits) between 9 and 11 then
    digits := '46' || substr(digits, 2);
  end if;
  if length(digits) < 7 or length(digits) > 15 then return null; end if;
  return digits;
end;
$$;

create or replace function public.company_import_quality_score(
  org_number text,
  domain_name text,
  email_address text,
  phone_number text,
  city_name text,
  street_address text,
  postal text
)
returns integer
language sql
immutable
parallel safe
as $$
  select
    (case when org_number is not null then 30 else 0 end) +
    (case when domain_name is not null then 25 else 0 end) +
    (case when email_address is not null then 20 else 0 end) +
    (case when phone_number is not null then 10 else 0 end) +
    (case when nullif(trim(coalesce(city_name, '')), '') is not null then 5 else 0 end) +
    (case when nullif(trim(coalesce(street_address, '')), '') is not null then 5 else 0 end) +
    (case when nullif(trim(coalesce(postal, '')), '') is not null then 5 else 0 end);
$$;

create or replace function public.normalize_company_lead_import_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.organization_number := public.normalize_company_import_org_number(new.organization_number);
  new.website_domain := public.normalize_company_import_domain(new.website);
  new.normalized_company_name := public.normalize_company_import_text(new.company_name);
  new.normalized_city := public.normalize_company_import_text(new.city);
  new.normalized_email := public.normalize_company_import_email(new.email);
  new.normalized_phone := public.normalize_company_import_phone(new.phone);

  if new.postal_code is not null then
    new.postal_code := nullif(regexp_replace(trim(new.postal_code), '\s+', ' ', 'g'), '');
  end if;

  if new.address is not null then
    new.address := nullif(regexp_replace(trim(new.address), '\s+', ' ', 'g'), '');
  end if;

  new.data_quality_score := public.company_import_quality_score(
    new.organization_number,
    new.website_domain,
    new.normalized_email,
    new.normalized_phone,
    new.city,
    new.address,
    new.postal_code
  );

  if new.import_batch_id is not null then
    new.import_updated_at := now();
  end if;

  new.import_fingerprint := md5(concat_ws('|',
    coalesce(new.organization_number, ''),
    coalesce(new.website_domain, ''),
    coalesce(new.normalized_email, ''),
    coalesce(new.normalized_phone, ''),
    coalesce(new.normalized_company_name, ''),
    coalesce(new.normalized_city, '')
  ));

  return new;
end;
$$;

drop trigger if exists normalize_company_lead_import_fields on public.company_leads;
create trigger normalize_company_lead_import_fields
before insert or update of company_name, city, website, email, phone, organization_number, address, postal_code, import_batch_id
on public.company_leads
for each row execute function public.normalize_company_lead_import_fields();

-- Backfill canonical values for existing CRM rows without changing their business data.
update public.company_leads
set
  organization_number = organization_number,
  website = website,
  email = email,
  phone = phone,
  company_name = company_name,
  city = city;

create index if not exists company_leads_org_number_idx
  on public.company_leads(organization_number)
  where organization_number is not null;

create index if not exists company_leads_website_domain_idx
  on public.company_leads(website_domain)
  where website_domain is not null;

create index if not exists company_leads_normalized_email_idx
  on public.company_leads(normalized_email)
  where normalized_email is not null;

create index if not exists company_leads_normalized_phone_idx
  on public.company_leads(normalized_phone)
  where normalized_phone is not null;

create index if not exists company_leads_name_city_idx
  on public.company_leads(normalized_company_name, normalized_city);

create index if not exists company_leads_import_batch_idx
  on public.company_leads(import_batch_id, import_row_number)
  where import_batch_id is not null;

create index if not exists company_leads_quality_idx
  on public.company_leads(data_quality_score desc, created_at desc);

create or replace function public.import_company_leads_batch(
  p_batch_id uuid,
  p_rows jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  item jsonb;
  ordinality bigint;
  existing_lead public.company_leads%rowtype;
  company_name_value text;
  city_value text;
  org_value text;
  website_value text;
  domain_value text;
  email_value text;
  phone_value text;
  address_value text;
  postal_value text;
  source_value text;
  notes_value text;
  normalized_name_value text;
  normalized_city_value text;
  normalized_email_value text;
  normalized_phone_value text;
  input_row_number integer;
  v_total_count integer := 0;
  v_created_count integer := 0;
  v_updated_count integer := 0;
  v_duplicate_count integer := 0;
  v_invalid_count integer := 0;
  v_failed_count integer := 0;
  should_update boolean;
begin
  if p_batch_id is null then
    raise exception 'Missing import batch id.';
  end if;

  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'Import rows must be a JSON array.';
  end if;

  if jsonb_array_length(p_rows) > 5000 then
    raise exception 'A maximum of 5000 rows can be imported per batch.';
  end if;

  if not exists (select 1 from public.company_import_batches where id = p_batch_id) then
    raise exception 'Import batch not found.';
  end if;

  for item, ordinality in
    select value, ordinality
    from jsonb_array_elements(p_rows) with ordinality
  loop
    v_total_count := v_total_count + 1;

    begin
      company_name_value := nullif(regexp_replace(trim(coalesce(item->>'company_name', '')), '\s+', ' ', 'g'), '');
      city_value := nullif(regexp_replace(trim(coalesce(item->>'city', '')), '\s+', ' ', 'g'), '');
      org_value := public.normalize_company_import_org_number(item->>'organization_number');
      website_value := nullif(trim(coalesce(item->>'website', '')), '');
      domain_value := public.normalize_company_import_domain(website_value);
      email_value := public.normalize_company_import_email(item->>'email');
      phone_value := nullif(regexp_replace(trim(coalesce(item->>'phone', '')), '\s+', ' ', 'g'), '');
      address_value := nullif(regexp_replace(trim(coalesce(item->>'address', '')), '\s+', ' ', 'g'), '');
      postal_value := nullif(regexp_replace(trim(coalesce(item->>'postal_code', '')), '\s+', ' ', 'g'), '');
      source_value := coalesce(nullif(trim(coalesce(item->>'source', '')), ''), 'mass_import');
      notes_value := nullif(trim(coalesce(item->>'notes', '')), '');
      normalized_name_value := public.normalize_company_import_text(company_name_value);
      normalized_city_value := public.normalize_company_import_text(city_value);
      normalized_email_value := public.normalize_company_import_email(email_value);
      normalized_phone_value := public.normalize_company_import_phone(phone_value);
      input_row_number := coalesce(nullif(item->>'row_number', '')::integer, ordinality::integer + 1);

      if company_name_value is null then
        v_invalid_count := v_invalid_count + 1;
        continue;
      end if;

      if org_value is null and domain_value is null and normalized_email_value is null and normalized_phone_value is null then
        v_invalid_count := v_invalid_count + 1;
        continue;
      end if;

      existing_lead := null;

      select lead.* into existing_lead
      from public.company_leads lead
      where
        (org_value is not null and lead.organization_number = org_value)
        or (domain_value is not null and lead.website_domain = domain_value)
        or (normalized_email_value is not null and lead.normalized_email = normalized_email_value)
        or (
          normalized_phone_value is not null
          and lead.normalized_phone = normalized_phone_value
          and (
            lead.normalized_company_name = normalized_name_value
            or (normalized_city_value is not null and lead.normalized_city = normalized_city_value)
          )
        )
        or (
          normalized_name_value is not null
          and normalized_city_value is not null
          and lead.normalized_company_name = normalized_name_value
          and lead.normalized_city = normalized_city_value
        )
      order by
        case
          when org_value is not null and lead.organization_number = org_value then 1
          when domain_value is not null and lead.website_domain = domain_value then 2
          when normalized_email_value is not null and lead.normalized_email = normalized_email_value then 3
          when normalized_phone_value is not null and lead.normalized_phone = normalized_phone_value then 4
          else 5
        end,
        lead.created_at asc
      limit 1;

      if found then
        should_update :=
          (nullif(trim(coalesce(existing_lead.company_name, '')), '') is null and company_name_value is not null)
          or (nullif(trim(coalesce(existing_lead.organization_number, '')), '') is null and org_value is not null)
          or (nullif(trim(coalesce(existing_lead.website, '')), '') is null and website_value is not null)
          or (nullif(trim(coalesce(existing_lead.email, '')), '') is null and email_value is not null)
          or (nullif(trim(coalesce(existing_lead.phone, '')), '') is null and phone_value is not null)
          or (nullif(trim(coalesce(existing_lead.city, '')), '') is null and city_value is not null)
          or (nullif(trim(coalesce(existing_lead.address, '')), '') is null and address_value is not null)
          or (nullif(trim(coalesce(existing_lead.postal_code, '')), '') is null and postal_value is not null)
          or (nullif(trim(coalesce(existing_lead.notes, '')), '') is null and notes_value is not null)
          or (nullif(trim(coalesce(existing_lead.source, '')), '') is null and source_value is not null);

        if should_update then
          update public.company_leads
          set
            company_name = coalesce(nullif(trim(company_name), ''), company_name_value),
            organization_number = coalesce(nullif(trim(organization_number), ''), org_value),
            website = coalesce(nullif(trim(website), ''), website_value),
            email = coalesce(nullif(trim(email), ''), email_value),
            phone = coalesce(nullif(trim(phone), ''), phone_value),
            city = coalesce(nullif(trim(city), ''), city_value),
            address = coalesce(nullif(trim(address), ''), address_value),
            postal_code = coalesce(nullif(trim(postal_code), ''), postal_value),
            notes = coalesce(nullif(trim(notes), ''), notes_value),
            source = coalesce(nullif(trim(source), ''), source_value),
            import_batch_id = p_batch_id,
            import_row_number = input_row_number
          where id = existing_lead.id;

          v_updated_count := v_updated_count + 1;
        else
          v_duplicate_count := v_duplicate_count + 1;
        end if;
      else
        insert into public.company_leads (
          company_name,
          city,
          organization_number,
          website,
          email,
          phone,
          address,
          postal_code,
          source,
          notes,
          status,
          registered,
          invite_count,
          import_batch_id,
          import_row_number
        ) values (
          company_name_value,
          city_value,
          org_value,
          website_value,
          email_value,
          phone_value,
          address_value,
          postal_value,
          source_value,
          notes_value,
          'new',
          false,
          0,
          p_batch_id,
          input_row_number
        );

        v_created_count := v_created_count + 1;
      end if;
    exception when others then
      v_failed_count := v_failed_count + 1;
      raise warning 'Mass import row % failed: %', ordinality, sqlerrm;
    end;
  end loop;

  return jsonb_build_object(
    'total', v_total_count,
    'created', v_created_count,
    'updated', v_updated_count,
    'duplicates', v_duplicate_count,
    'invalid', v_invalid_count,
    'failed', v_failed_count
  );
end;
$$;

revoke all on function public.import_company_leads_batch(uuid, jsonb) from public, anon, authenticated;
grant execute on function public.import_company_leads_batch(uuid, jsonb) to service_role;

notify pgrst, 'reload schema';
commit;
