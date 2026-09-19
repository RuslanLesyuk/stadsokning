-- Clean Jobs: split employment ads into employers offering jobs and people seeking work.
-- Existing vacancy rows are preserved as job offers.

alter table public.vacancies
  add column if not exists listing_type text;

update public.vacancies
set listing_type = 'job_offer'
where listing_type is null;

alter table public.vacancies
  alter column listing_type set default 'job_offer';

alter table public.vacancies
  alter column listing_type set not null;

alter table public.vacancies
  add column if not exists person_name text;

alter table public.vacancies
  alter column company_name drop not null;

alter table public.vacancies
  drop constraint if exists vacancies_listing_type_check;
alter table public.vacancies
  add constraint vacancies_listing_type_check
  check (listing_type in ('job_offer', 'job_seeker'));

alter table public.vacancies
  drop constraint if exists vacancies_company_required_by_type_check;
alter table public.vacancies
  add constraint vacancies_company_required_by_type_check
  check (
    listing_type <> 'job_offer'
    or (company_name is not null and char_length(trim(company_name)) between 2 and 160)
  );

alter table public.vacancies
  drop constraint if exists vacancies_person_required_by_type_check;
alter table public.vacancies
  add constraint vacancies_person_required_by_type_check
  check (
    listing_type <> 'job_seeker'
    or (person_name is not null and char_length(trim(person_name)) between 2 and 160)
  );

alter table public.vacancies
  drop constraint if exists vacancies_person_name_length_check;
alter table public.vacancies
  add constraint vacancies_person_name_length_check
  check (person_name is null or char_length(person_name) <= 160);

create index if not exists vacancies_type_status_created_at_idx
  on public.vacancies(listing_type, status, created_at desc);

create index if not exists vacancies_type_city_status_created_at_idx
  on public.vacancies(listing_type, city, status, created_at desc);

-- Applications are only valid for employer job offers. People seeking work are
-- contacted directly through the authenticated detail page.
drop policy if exists "Applicants can create vacancy applications"
  on public.vacancy_applications;
create policy "Applicants can create vacancy applications"
on public.vacancy_applications for insert to authenticated
with check (
  applicant_id = auth.uid()
  and exists (
    select 1
    from public.vacancies v
    where v.id = vacancy_id
      and v.status = 'active'
      and v.listing_type = 'job_offer'
      and v.created_by <> auth.uid()
  )
);

notify pgrst, 'reload schema';
