begin;

alter table public.company_quote_requests
  add column if not exists priority text,
  add column if not exists lead_type text,
  add column if not exists source text,
  add column if not exists source_url text,
  add column if not exists source_site_id uuid,
  add column if not exists first_viewed_at timestamptz,
  add column if not exists viewed_by uuid,
  add column if not exists owner_notes text,
  add column if not exists lead_score smallint,
  add column if not exists estimated_value numeric(12,2),
  add column if not exists quoted_value numeric(12,2),
  add column if not exists currency text,
  add column if not exists lost_reason text,
  add column if not exists follow_up_at timestamptz,
  add column if not exists lead_access text,
  add column if not exists is_paid boolean,
  add column if not exists lead_price numeric(10,2),
  add column if not exists unlocked_at timestamptz,
  add column if not exists last_activity_at timestamptz,
  add column if not exists metadata jsonb;

update public.company_quote_requests
set
  priority = coalesce(priority, 'normal'),
  lead_type = coalesce(lead_type, 'direct'),
  source = coalesce(source, 'company_profile'),
  currency = coalesce(currency, 'SEK'),
  lead_access = coalesce(lead_access, 'included'),
  is_paid = coalesce(is_paid, false),
  last_activity_at = coalesce(last_activity_at, updated_at, created_at, now()),
  metadata = coalesce(metadata, '{}'::jsonb)
where
  priority is null
  or lead_type is null
  or source is null
  or currency is null
  or lead_access is null
  or is_paid is null
  or last_activity_at is null
  or metadata is null;

update public.company_quote_requests
set status = 'new'
where status not in (
  'new', 'viewed', 'contacted', 'qualified', 'quoted', 'won', 'lost', 'archived'
);

update public.company_quote_requests
set first_viewed_at = coalesce(first_viewed_at, updated_at, created_at, now())
where status <> 'new' and first_viewed_at is null;

alter table public.company_quote_requests
  alter column priority set default 'normal',
  alter column priority set not null,
  alter column lead_type set default 'direct',
  alter column lead_type set not null,
  alter column source set default 'company_profile',
  alter column source set not null,
  alter column currency set default 'SEK',
  alter column currency set not null,
  alter column lead_access set default 'included',
  alter column lead_access set not null,
  alter column is_paid set default false,
  alter column is_paid set not null,
  alter column last_activity_at set default now(),
  alter column last_activity_at set not null,
  alter column metadata set default '{}'::jsonb,
  alter column metadata set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_status_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_status_check
      check (status in ('new','viewed','contacted','qualified','quoted','won','lost','archived'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_priority_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_priority_check
      check (priority in ('low','normal','high','urgent'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_lead_type_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_lead_type_check
      check (lead_type in ('direct','marketplace','distributed'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_source_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_source_check
      check (source in ('company_profile','company_site','marketplace','manual','admin','seo','google','other'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_lead_access_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_lead_access_check
      check (lead_access in ('included','paid','locked'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_lead_score_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_lead_score_check
      check (lead_score is null or (lead_score between 0 and 100));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_estimated_value_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_estimated_value_check
      check (estimated_value is null or estimated_value >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_quoted_value_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_quoted_value_check
      check (quoted_value is null or quoted_value >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_lead_price_check'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_lead_price_check
      check (lead_price is null or lead_price >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_viewed_by_fkey'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_viewed_by_fkey
      foreign key (viewed_by) references auth.users(id) on delete set null;
  end if;
end $$;

do $$
begin
  if to_regclass('public.company_sites') is not null and not exists (
    select 1 from pg_constraint
    where conrelid = 'public.company_quote_requests'::regclass
      and conname = 'company_quote_requests_source_site_id_fkey'
  ) then
    alter table public.company_quote_requests
      add constraint company_quote_requests_source_site_id_fkey
      foreign key (source_site_id) references public.company_sites(id) on delete set null;
  end if;
end $$;

create table if not exists public.company_quote_request_activity (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.company_quote_requests(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists company_quote_requests_company_status_created_idx
  on public.company_quote_requests(company_id, status, created_at desc);

create index if not exists company_quote_requests_company_priority_created_idx
  on public.company_quote_requests(company_id, priority, created_at desc);

create index if not exists company_quote_requests_company_source_created_idx
  on public.company_quote_requests(company_id, source, created_at desc);

create index if not exists company_quote_requests_follow_up_idx
  on public.company_quote_requests(company_id, follow_up_at)
  where follow_up_at is not null;

create index if not exists company_quote_requests_last_activity_idx
  on public.company_quote_requests(company_id, last_activity_at desc);

create index if not exists company_quote_request_activity_lead_created_idx
  on public.company_quote_request_activity(quote_request_id, created_at desc);

create or replace function public.touch_company_quote_request()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  new.last_activity_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_company_quote_request on public.company_quote_requests;
create trigger trg_touch_company_quote_request
before update on public.company_quote_requests
for each row execute function public.touch_company_quote_request();

create or replace function public.log_company_quote_request_activity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, to_status, metadata, created_at
    ) values (
      new.id,
      v_actor,
      'created',
      new.status,
      jsonb_build_object('source', new.source, 'lead_type', new.lead_type),
      new.created_at
    );
    return new;
  end if;

  if old.first_viewed_at is null and new.first_viewed_at is not null then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      coalesce(new.viewed_by, v_actor),
      'viewed',
      '{}'::jsonb
    );
  end if;

  if new.status is distinct from old.status then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, from_status, to_status
    ) values (
      new.id, v_actor, 'status_changed', old.status, new.status
    );
  end if;

  if new.priority is distinct from old.priority then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'priority_changed',
      jsonb_build_object('from', old.priority, 'to', new.priority)
    );
  end if;

  if new.owner_notes is distinct from old.owner_notes then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (new.id, v_actor, 'notes_updated', '{}'::jsonb);
  end if;

  if new.lead_score is distinct from old.lead_score then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'score_updated',
      jsonb_build_object('from', old.lead_score, 'to', new.lead_score)
    );
  end if;

  if new.estimated_value is distinct from old.estimated_value
     or new.quoted_value is distinct from old.quoted_value then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'value_updated',
      jsonb_build_object(
        'estimated_value', new.estimated_value,
        'quoted_value', new.quoted_value,
        'currency', new.currency
      )
    );
  end if;

  if new.follow_up_at is distinct from old.follow_up_at then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'follow_up_changed',
      jsonb_build_object('follow_up_at', new.follow_up_at)
    );
  end if;

  if new.lost_reason is distinct from old.lost_reason then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (new.id, v_actor, 'lost_reason_updated', '{}'::jsonb);
  end if;

  if new.lead_access is distinct from old.lead_access
     or new.is_paid is distinct from old.is_paid
     or new.lead_price is distinct from old.lead_price
     or new.unlocked_at is distinct from old.unlocked_at then
    insert into public.company_quote_request_activity(
      quote_request_id, actor_id, event_type, metadata
    ) values (
      new.id,
      v_actor,
      'access_updated',
      jsonb_build_object(
        'lead_access', new.lead_access,
        'is_paid', new.is_paid,
        'lead_price', new.lead_price,
        'unlocked_at', new.unlocked_at
      )
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_log_company_quote_request_activity on public.company_quote_requests;
create trigger trg_log_company_quote_request_activity
after insert or update on public.company_quote_requests
for each row execute function public.log_company_quote_request_activity();

insert into public.company_quote_request_activity(
  quote_request_id,
  actor_id,
  event_type,
  to_status,
  metadata,
  created_at
)
select
  q.id,
  q.user_id,
  'created',
  q.status,
  jsonb_build_object('source', q.source, 'lead_type', q.lead_type, 'backfilled', true),
  q.created_at
from public.company_quote_requests q
where not exists (
  select 1
  from public.company_quote_request_activity a
  where a.quote_request_id = q.id
    and a.event_type = 'created'
);

alter table public.company_quote_requests enable row level security;
alter table public.company_quote_request_activity enable row level security;

drop policy if exists "Anyone can create company quote requests" on public.company_quote_requests;
drop policy if exists "Visitors can create company quote requests" on public.company_quote_requests;
drop policy if exists "Company owners can read company quote requests" on public.company_quote_requests;
drop policy if exists "Company owners can update company quote requests" on public.company_quote_requests;
drop policy if exists "Customers can read their own company quote requests" on public.company_quote_requests;
drop policy if exists "Public can create company quote requests" on public.company_quote_requests;

create policy "Public can create company quote requests"
on public.company_quote_requests
for insert
to anon, authenticated
with check (
  status = 'new'
  and lead_type = 'direct'
  and source in ('company_profile', 'company_site')
  and lead_access = 'included'
  and is_paid = false
  and company_id is not null
  and nullif(trim(customer_name), '') is not null
  and nullif(trim(customer_email), '') is not null
  and nullif(trim(message), '') is not null
  and (user_id is null or user_id = auth.uid())
);

create policy "Company owners can read company quote requests"
on public.company_quote_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_quote_requests.company_id
      and c.owner_id = auth.uid()
  )
);

create policy "Company owners can update company quote requests"
on public.company_quote_requests
for update
to authenticated
using (
  exists (
    select 1
    from public.companies c
    where c.id = company_quote_requests.company_id
      and c.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.companies c
    where c.id = company_quote_requests.company_id
      and c.owner_id = auth.uid()
  )
);

create policy "Customers can read their own company quote requests"
on public.company_quote_requests
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Company owners can read quote request activity" on public.company_quote_request_activity;
create policy "Company owners can read quote request activity"
on public.company_quote_request_activity
for select
to authenticated
using (
  exists (
    select 1
    from public.company_quote_requests q
    join public.companies c on c.id = q.company_id
    where q.id = company_quote_request_activity.quote_request_id
      and c.owner_id = auth.uid()
  )
);

grant insert on public.company_quote_requests to anon, authenticated;
grant select, update on public.company_quote_requests to authenticated;
grant select on public.company_quote_request_activity to authenticated;

notify pgrst, 'reload schema';

commit;
