begin;

-- Clean Jobs — Mass Import 1/4 runtime fix
-- PostgreSQL error 42702: column reference "ordinality" is ambiguous.
-- The previous function used a PL/pgSQL variable named ordinality and an
-- unqualified WITH ORDINALITY column with the same name. PostgreSQL only
-- raises this ambiguity when the RPC executes, so the migration itself can
-- apply successfully while the first import still fails.

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
  v_ordinality bigint;
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

  if not exists (
    select 1
    from public.company_import_batches batch
    where batch.id = p_batch_id
  ) then
    raise exception 'Import batch not found.';
  end if;

  for item, v_ordinality in
    select row_data.value, row_data.row_ordinality
    from jsonb_array_elements(p_rows) with ordinality
      as row_data(value, row_ordinality)
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
      input_row_number := coalesce(
        nullif(item->>'row_number', '')::integer,
        v_ordinality::integer + 1
      );

      if company_name_value is null then
        v_invalid_count := v_invalid_count + 1;
        continue;
      end if;

      if org_value is null
        and domain_value is null
        and normalized_email_value is null
        and normalized_phone_value is null
      then
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
      raise warning 'Mass import row % failed: %', v_ordinality, sqlerrm;
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

revoke all on function public.import_company_leads_batch(uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.import_company_leads_batch(uuid, jsonb)
  to service_role;

notify pgrst, 'reload schema';
commit;
