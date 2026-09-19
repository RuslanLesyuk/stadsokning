-- Clean Jobs: separate employment vacancies (Lediga jobb)

create table if not exists public.vacancies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  company_name text not null,
  city text not null,
  description text not null,
  schedule text,
  salary text,
  requirements text,
  contact_email text,
  contact_phone text,
  status text not null default 'active',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  constraint vacancies_status_check check (status in ('active', 'closed')),
  constraint vacancies_title_length check (char_length(title) between 2 and 140),
  constraint vacancies_company_length check (char_length(company_name) between 2 and 160),
  constraint vacancies_city_length check (char_length(city) between 2 and 120),
  constraint vacancies_description_length check (char_length(description) between 20 and 10000),
  constraint vacancies_schedule_length check (schedule is null or char_length(schedule) <= 160),
  constraint vacancies_salary_length check (salary is null or char_length(salary) <= 160),
  constraint vacancies_requirements_length check (requirements is null or char_length(requirements) <= 5000),
  constraint vacancies_contact_required check (
    nullif(trim(contact_email), '') is not null or nullif(trim(contact_phone), '') is not null
  )
);

create index if not exists vacancies_status_created_at_idx
  on public.vacancies(status, created_at desc);
create index if not exists vacancies_city_status_created_at_idx
  on public.vacancies(city, status, created_at desc);
create index if not exists vacancies_created_by_created_at_idx
  on public.vacancies(created_by, created_at desc);

create table if not exists public.vacancy_applications (
  id uuid primary key default gen_random_uuid(),
  vacancy_id uuid not null references public.vacancies(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  applicant_name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now(),
  constraint vacancy_applications_name_length check (char_length(applicant_name) between 2 and 160),
  constraint vacancy_applications_email_length check (char_length(email) between 3 and 320),
  constraint vacancy_applications_phone_length check (phone is null or char_length(phone) <= 60),
  constraint vacancy_applications_message_length check (char_length(message) between 10 and 3000),
  constraint vacancy_applications_unique_applicant unique(vacancy_id, applicant_id)
);

create index if not exists vacancy_applications_vacancy_created_idx
  on public.vacancy_applications(vacancy_id, created_at desc);
create index if not exists vacancy_applications_applicant_created_idx
  on public.vacancy_applications(applicant_id, created_at desc);

create or replace function public.set_vacancies_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_vacancies_updated_at on public.vacancies;
create trigger set_vacancies_updated_at
before update on public.vacancies
for each row execute function public.set_vacancies_updated_at();

alter table public.vacancies enable row level security;
alter table public.vacancy_applications enable row level security;

drop policy if exists "Public can view active vacancies" on public.vacancies;
create policy "Public can view active vacancies"
on public.vacancies for select
using (status = 'active' or created_by = auth.uid());

drop policy if exists "Authenticated users can create own vacancies" on public.vacancies;
create policy "Authenticated users can create own vacancies"
on public.vacancies for insert to authenticated
with check (created_by = auth.uid());

drop policy if exists "Owners can update own vacancies" on public.vacancies;
create policy "Owners can update own vacancies"
on public.vacancies for update to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "Owners can delete own vacancies" on public.vacancies;
create policy "Owners can delete own vacancies"
on public.vacancies for delete to authenticated
using (created_by = auth.uid());

drop policy if exists "Applicants can create vacancy applications" on public.vacancy_applications;
create policy "Applicants can create vacancy applications"
on public.vacancy_applications for insert to authenticated
with check (
  applicant_id = auth.uid()
  and exists (
    select 1
    from public.vacancies v
    where v.id = vacancy_id
      and v.status = 'active'
      and v.created_by <> auth.uid()
  )
);

drop policy if exists "Applicants and vacancy owners can view applications" on public.vacancy_applications;
create policy "Applicants and vacancy owners can view applications"
on public.vacancy_applications for select to authenticated
using (
  applicant_id = auth.uid()
  or exists (
    select 1
    from public.vacancies v
    where v.id = vacancy_id
      and v.created_by = auth.uid()
  )
);

grant select on public.vacancies to anon, authenticated;
grant insert, update, delete on public.vacancies to authenticated;
grant all on public.vacancies to service_role;

grant select, insert on public.vacancy_applications to authenticated;
grant all on public.vacancy_applications to service_role;
