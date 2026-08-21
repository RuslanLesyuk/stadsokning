begin;

-- ============================================================================
-- Clean Jobs — Mass Import 2/4
-- Safe publication of imported outreach leads into the public companies catalog.
-- company_leads remains the outreach CRM; companies remains the public directory.
-- ============================================================================

alter table public.company_leads
  add column if not exists catalog_company_id uuid references public.companies(id) on delete set null,
  add column if not exists catalog_publication_status text not null default 'pending',
  add column if not exists catalog_published_at timestamptz,
  add column if not exists catalog_publish_error text;

alter table public.company_leads
  drop constraint if exists company_leads_catalog_publication_status_check;

alter table public.company_leads
  add constraint company_leads_catalog_publication_status_check
  check (catalog_publication_status in ('pending', 'published', 'linked_existing', 'failed'));

create index if not exists company_leads_catalog_status_quality_idx
  on public.company_leads(catalog_publication_status, data_quality_score desc, created_at asc)
  where import_batch_id is not null;

create index if not exists company_leads_catalog_company_idx
  on public.company_leads(catalog_company_id)
  where catalog_company_id is not null;

alter table public.companies
  add column if not exists catalog_source text not null default 'native',
  add column if not exists directory_quality_score integer not null default 0,
  add column if not exists normalized_company_name text,
  add column if not exists normalized_city text,
  add column if not exists website_domain text,
  add column if not exists normalized_email text,
  add column if not exists normalized_phone text;

alter table public.companies
  drop constraint if exists companies_catalog_source_check;

alter table public.companies
  add constraint companies_catalog_source_check
  check (catalog_source in ('native', 'mass_import'));

alter table public.companies
  drop constraint if exists companies_directory_quality_score_check;

alter table public.companies
  add constraint companies_directory_quality_score_check
  check (directory_quality_score between 0 and 100);

create or replace function public.normalize_company_catalog_fields()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.organization_number := public.normalize_company_import_org_number(new.organization_number);
  new.website_domain := public.normalize_company_import_domain(new.website);
  new.normalized_company_name := public.normalize_company_import_text(new.name);
  new.normalized_city := public.normalize_company_import_text(new.city);
  new.normalized_email := public.normalize_company_import_email(new.email);
  new.normalized_phone := public.normalize_company_import_phone(new.phone);

  if new.postal_code is not null then
    new.postal_code := nullif(regexp_replace(trim(new.postal_code), '\s+', ' ', 'g'), '');
  end if;

  if new.address is not null then
    new.address := nullif(regexp_replace(trim(new.address), '\s+', ' ', 'g'), '');
  end if;

  new.directory_quality_score := public.company_import_quality_score(
    new.organization_number,
    new.website_domain,
    new.normalized_email,
    new.normalized_phone,
    new.city,
    new.address,
    new.postal_code
  );

  return new;
end;
$$;

drop trigger if exists normalize_company_catalog_fields on public.companies;
create trigger normalize_company_catalog_fields
before insert or update of name, city, website, email, phone, organization_number, address, postal_code
on public.companies
for each row execute function public.normalize_company_catalog_fields();

-- Backfill canonical values for the current public directory without changing business data.
update public.companies
set
  organization_number = organization_number,
  website = website,
  email = email,
  phone = phone,
  name = name,
  city = city;

create index if not exists companies_org_number_lookup_idx
  on public.companies(organization_number)
  where organization_number is not null;

create index if not exists companies_website_domain_lookup_idx
  on public.companies(website_domain)
  where website_domain is not null;

create index if not exists companies_normalized_email_lookup_idx
  on public.companies(normalized_email)
  where normalized_email is not null;

create index if not exists companies_normalized_phone_lookup_idx
  on public.companies(normalized_phone)
  where normalized_phone is not null;

create index if not exists companies_name_city_lookup_idx
  on public.companies(normalized_company_name, normalized_city);

create index if not exists companies_catalog_source_quality_idx
  on public.companies(catalog_source, directory_quality_score desc, updated_at desc);

create or replace function public.company_catalog_slug_part(value text)
returns text
language plpgsql
immutable
parallel safe
as $$
declare
  normalized text := lower(trim(coalesce(value, '')));
begin
  if normalized = '' then
    return null;
  end if;

  normalized := translate(normalized, 'åäöéüæø', 'aaoeuao');
  normalized := regexp_replace(normalized, '[^a-z0-9]+', '-', 'g');
  normalized := trim(both '-' from normalized);
  normalized := regexp_replace(normalized, '-+', '-', 'g');

  return nullif(left(normalized, 90), '');
end;
$$;

create or replace function public.company_catalog_slug_base(company_name text, city_name text)
returns text
language plpgsql
immutable
parallel safe
as $$
declare
  company_part text := public.company_catalog_slug_part(company_name);
  city_part text := public.company_catalog_slug_part(city_name);
begin
  if company_part is null then
    company_part := 'stadforetag';
  end if;

  if city_part is null then
    return company_part;
  end if;

  if right(company_part, length(city_part) + 1) = ('-' || city_part) then
    return company_part;
  end if;

  return left(company_part || '-' || city_part, 110);
end;
$$;

create or replace function public.publish_company_leads_batch(
  p_limit integer default 100,
  p_import_batch_id uuid default null,
  p_min_quality integer default 55
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  lead_record public.company_leads%rowtype;
  existing_company public.companies%rowtype;
  slug_base text;
  slug_candidate text;
  slug_suffix integer;
  created_company_id uuid;
  v_processed integer := 0;
  v_created integer := 0;
  v_linked integer := 0;
  v_failed integer := 0;
  v_remaining integer := 0;
begin
  p_limit := greatest(1, least(coalesce(p_limit, 100), 250));
  p_min_quality := greatest(0, least(coalesce(p_min_quality, 55), 100));

  for lead_record in
    select lead.*
    from public.company_leads lead
    where lead.import_batch_id is not null
      and (p_import_batch_id is null or lead.import_batch_id = p_import_batch_id)
      and lead.catalog_company_id is null
      and lead.catalog_publication_status in ('pending', 'failed')
      and lead.status <> 'ignored'
      and nullif(trim(coalesce(lead.company_name, '')), '') is not null
      and nullif(trim(coalesce(lead.city, '')), '') is not null
      and lead.data_quality_score >= p_min_quality
    order by lead.data_quality_score desc, lead.created_at asc, lead.id asc
    for update skip locked
    limit p_limit
  loop
    v_processed := v_processed + 1;

    begin
      existing_company := null;

      select company.* into existing_company
      from public.companies company
      where
        (lead_record.organization_number is not null and company.organization_number = lead_record.organization_number)
        or (lead_record.website_domain is not null and company.website_domain = lead_record.website_domain)
        or (lead_record.normalized_email is not null and company.normalized_email = lead_record.normalized_email)
        or (
          lead_record.normalized_phone is not null
          and company.normalized_phone = lead_record.normalized_phone
          and (
            company.normalized_company_name = lead_record.normalized_company_name
            or company.normalized_city = lead_record.normalized_city
          )
        )
        or (
          lead_record.normalized_company_name is not null
          and lead_record.normalized_city is not null
          and company.normalized_company_name = lead_record.normalized_company_name
          and company.normalized_city = lead_record.normalized_city
        )
      order by
        case
          when lead_record.organization_number is not null and company.organization_number = lead_record.organization_number then 1
          when lead_record.website_domain is not null and company.website_domain = lead_record.website_domain then 2
          when lead_record.normalized_email is not null and company.normalized_email = lead_record.normalized_email then 3
          when lead_record.normalized_phone is not null and company.normalized_phone = lead_record.normalized_phone then 4
          else 5
        end,
        company.created_at asc nulls last,
        company.id asc
      limit 1;

      if found then
        update public.companies
        set
          name = coalesce(nullif(trim(name), ''), lead_record.company_name),
          organization_number = coalesce(nullif(trim(organization_number), ''), lead_record.organization_number),
          city = coalesce(nullif(trim(city), ''), lead_record.city),
          address = coalesce(nullif(trim(address), ''), lead_record.address),
          postal_code = coalesce(nullif(trim(postal_code), ''), lead_record.postal_code),
          website = coalesce(nullif(trim(website), ''), lead_record.website),
          email = coalesce(nullif(trim(email), ''), lead_record.email),
          phone = coalesce(nullif(trim(phone), ''), lead_record.phone),
          updated_at = now()
        where id = existing_company.id;

        update public.company_leads
        set
          catalog_company_id = existing_company.id,
          catalog_publication_status = 'linked_existing',
          catalog_published_at = now(),
          catalog_publish_error = null
        where id = lead_record.id;

        v_linked := v_linked + 1;
        continue;
      end if;

      slug_base := public.company_catalog_slug_base(lead_record.company_name, lead_record.city);
      slug_candidate := slug_base;
      slug_suffix := 2;

      while exists (
        select 1 from public.companies company where company.slug = slug_candidate
      ) loop
        slug_candidate := left(slug_base, 100) || '-' || slug_suffix::text;
        slug_suffix := slug_suffix + 1;
      end loop;

      insert into public.companies (
        name,
        slug,
        city,
        address,
        postal_code,
        organization_number,
        website,
        email,
        phone,
        owner_id,
        verified,
        catalog_source
      ) values (
        lead_record.company_name,
        slug_candidate,
        lead_record.city,
        lead_record.address,
        lead_record.postal_code,
        lead_record.organization_number,
        lead_record.website,
        lead_record.email,
        lead_record.phone,
        null,
        false,
        'mass_import'
      )
      returning id into created_company_id;

      update public.company_leads
      set
        catalog_company_id = created_company_id,
        catalog_publication_status = 'published',
        catalog_published_at = now(),
        catalog_publish_error = null
      where id = lead_record.id;

      v_created := v_created + 1;
    exception when others then
      v_failed := v_failed + 1;

      update public.company_leads
      set
        catalog_publication_status = 'failed',
        catalog_publish_error = left(sqlerrm, 1000)
      where id = lead_record.id;

      raise warning 'Catalog publication failed for lead %: %', lead_record.id, sqlerrm;
    end;
  end loop;

  select count(*) into v_remaining
  from public.company_leads lead
  where lead.import_batch_id is not null
    and (p_import_batch_id is null or lead.import_batch_id = p_import_batch_id)
    and lead.catalog_company_id is null
    and lead.catalog_publication_status in ('pending', 'failed')
    and lead.status <> 'ignored'
    and nullif(trim(coalesce(lead.company_name, '')), '') is not null
    and nullif(trim(coalesce(lead.city, '')), '') is not null
    and lead.data_quality_score >= p_min_quality;

  return jsonb_build_object(
    'processed', v_processed,
    'created', v_created,
    'linked', v_linked,
    'failed', v_failed,
    'remaining', v_remaining,
    'min_quality', p_min_quality
  );
end;
$$;

revoke all on function public.publish_company_leads_batch(integer, uuid, integer)
  from public, anon, authenticated;
grant execute on function public.publish_company_leads_batch(integer, uuid, integer)
  to service_role;

notify pgrst, 'reload schema';
commit;
