begin;

create table if not exists public.company_sites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null unique references public.companies(id) on delete cascade,
  site_slug text not null unique,
  status text not null default 'draft',
  template text not null default 'modern',
  primary_color text not null default '#e11d48',
  secondary_color text not null default '#0f172a',
  default_locale text not null default 'sv',
  enabled_locales text[] not null default array['sv']::text[],
  content jsonb not null default '{}'::jsonb,
  section_settings jsonb not null default '{"services":true,"pricing":true,"about":true,"gallery":true,"reviews":true,"areas":true,"hours":true,"faq":true,"contact":true}'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  seo_settings jsonb not null default '{}'::jsonb,
  custom_domain text,
  domain_status text not null default 'not_configured',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint company_sites_status_check
    check (status in ('draft', 'published')),
  constraint company_sites_template_check
    check (template in ('modern', 'minimal', 'elegant')),
  constraint company_sites_default_locale_check
    check (default_locale in ('sv', 'en', 'uk', 'ru', 'pl')),
  constraint company_sites_domain_status_check
    check (domain_status in ('not_configured', 'pending', 'verified', 'failed')),
  constraint company_sites_site_slug_check
    check (site_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint company_sites_primary_color_check
    check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  constraint company_sites_secondary_color_check
    check (secondary_color ~ '^#[0-9A-Fa-f]{6}$')
);

create unique index if not exists company_sites_custom_domain_unique
  on public.company_sites (lower(custom_domain))
  where custom_domain is not null;

create index if not exists company_sites_status_idx
  on public.company_sites (status);

create index if not exists company_sites_company_id_idx
  on public.company_sites (company_id);

create or replace function public.set_company_sites_updated_at()
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

drop trigger if exists set_company_sites_updated_at on public.company_sites;

create trigger set_company_sites_updated_at
before update on public.company_sites
for each row
execute function public.set_company_sites_updated_at();

alter table public.company_sites enable row level security;

drop policy if exists "Public can read published company sites"
on public.company_sites;

create policy "Public can read published company sites"
on public.company_sites
for select
to anon, authenticated
using (
  status = 'published'
  or exists (
    select 1
    from public.companies c
    where c.id = company_sites.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can create company sites"
on public.company_sites;

create policy "Company owners can create company sites"
on public.company_sites
for insert
to authenticated
with check (
  exists (
    select 1
    from public.companies c
    where c.id = company_sites.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can update company sites"
on public.company_sites;

create policy "Company owners can update company sites"
on public.company_sites
for update
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_sites.company_id
      and c.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.companies c
    where c.id = company_sites.company_id
      and c.owner_id = auth.uid()
  )
);

drop policy if exists "Company owners can delete company sites"
on public.company_sites;

create policy "Company owners can delete company sites"
on public.company_sites
for delete
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_sites.company_id
      and c.owner_id = auth.uid()
  )
);

grant select on public.company_sites to anon, authenticated;
grant insert, update, delete on public.company_sites to authenticated;

notify pgrst, 'reload schema';

commit;
