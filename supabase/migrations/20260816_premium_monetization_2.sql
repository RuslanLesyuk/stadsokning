begin;

-- -----------------------------------------------------------------------------
-- Premium cache fields on profiles (kept for backwards compatibility)
-- -----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists premium_source text not null default 'none',
  add column if not exists premium_override_until timestamptz,
  add column if not exists stripe_subscription_status text,
  add column if not exists stripe_price_id text,
  add column if not exists stripe_billing_interval text,
  add column if not exists billing_grace_until timestamptz,
  add column if not exists premium_updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_premium_source_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_premium_source_check
      check (premium_source in ('none', 'legacy', 'stripe', 'admin'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_stripe_billing_interval_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_stripe_billing_interval_check
      check (
        stripe_billing_interval is null
        or stripe_billing_interval in ('monthly', 'yearly', 'unknown')
      );
  end if;
end $$;

update public.profiles
set premium_source = 'legacy',
    premium_updated_at = now()
where is_premium = true
  and premium_source = 'none';

-- -----------------------------------------------------------------------------
-- Canonical billing subscription state
-- -----------------------------------------------------------------------------
create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'premium',
  billing_interval text not null default 'unknown',
  price_id text,
  status text not null default 'inactive',
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  grace_until timestamptz,
  last_invoice_id text,
  last_invoice_status text,
  last_payment_failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_subscriptions_plan_check
    check (plan in ('premium')),
  constraint billing_subscriptions_interval_check
    check (billing_interval in ('monthly', 'yearly', 'unknown')),
  constraint billing_subscriptions_status_check
    check (status in (
      'active', 'trialing', 'past_due', 'unpaid', 'canceled',
      'incomplete', 'incomplete_expired', 'paused', 'legacy', 'inactive'
    ))
);

create index if not exists billing_subscriptions_status_idx
  on public.billing_subscriptions(status);
create index if not exists billing_subscriptions_period_end_idx
  on public.billing_subscriptions(current_period_end);

insert into public.billing_subscriptions (
  user_id,
  stripe_customer_id,
  stripe_subscription_id,
  plan,
  billing_interval,
  price_id,
  status,
  current_period_end
)
select
  p.id,
  p.stripe_customer_id,
  p.stripe_subscription_id,
  'premium',
  coalesce(p.stripe_billing_interval, 'unknown'),
  p.stripe_price_id,
  'legacy',
  p.subscription_ends_at
from public.profiles p
where p.is_premium = true
   or p.stripe_customer_id is not null
   or p.stripe_subscription_id is not null
on conflict (user_id) do nothing;

-- -----------------------------------------------------------------------------
-- Billing history foundation
-- -----------------------------------------------------------------------------
create table if not exists public.billing_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null default 'subscription',
  reference_id text,
  stripe_event_id text,
  stripe_invoice_id text unique,
  stripe_checkout_session_id text,
  amount_minor bigint,
  currency text not null default 'SEK',
  status text not null,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_transactions_kind_check
    check (kind in ('subscription', 'lead', 'booking', 'featured_job', 'other')),
  constraint billing_transactions_amount_check
    check (amount_minor is null or amount_minor >= 0)
);

create index if not exists billing_transactions_user_created_idx
  on public.billing_transactions(user_id, created_at desc);
create index if not exists billing_transactions_kind_created_idx
  on public.billing_transactions(kind, created_at desc);

-- -----------------------------------------------------------------------------
-- Webhook idempotency / observability
-- -----------------------------------------------------------------------------
create table if not exists public.billing_webhook_events (
  event_id text primary key,
  event_type text not null,
  livemode boolean not null default false,
  status text not null default 'processing',
  error_message text,
  stripe_created_at timestamptz,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_webhook_events_status_check
    check (status in ('processing', 'processed', 'failed'))
);

create index if not exists billing_webhook_events_status_created_idx
  on public.billing_webhook_events(status, created_at desc);

-- -----------------------------------------------------------------------------
-- updated_at helpers
-- -----------------------------------------------------------------------------
create or replace function public.touch_billing_updated_at()
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

drop trigger if exists touch_billing_subscriptions_updated_at
on public.billing_subscriptions;
create trigger touch_billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row execute function public.touch_billing_updated_at();

drop trigger if exists touch_billing_transactions_updated_at
on public.billing_transactions;
create trigger touch_billing_transactions_updated_at
before update on public.billing_transactions
for each row execute function public.touch_billing_updated_at();

drop trigger if exists touch_billing_webhook_events_updated_at
on public.billing_webhook_events;
create trigger touch_billing_webhook_events_updated_at
before update on public.billing_webhook_events
for each row execute function public.touch_billing_updated_at();

-- -----------------------------------------------------------------------------
-- Premium entitlement helper used by database-side feature gates
-- -----------------------------------------------------------------------------
create or replace function public.user_has_premium(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    coalesce(p.premium_override_until > now(), false)
    or exists (
      select 1
      from public.billing_subscriptions b
      where b.user_id = target_user_id
        and (
          b.status in ('active', 'trialing')
          or (b.status = 'past_due' and b.grace_until > now())
          or (
            b.status = 'legacy'
            and coalesce(p.is_premium, false) = true
            and (b.current_period_end is null or b.current_period_end > now())
          )
        )
    )
    or (
      coalesce(p.is_premium, false) = true
      and coalesce(p.premium_source, 'none') = 'legacy'
      and (p.subscription_ends_at is null or p.subscription_ends_at > now())
    )
  from public.profiles p
  where p.id = target_user_id;
$$;

revoke all on function public.user_has_premium(uuid) from public;
grant execute on function public.user_has_premium(uuid) to authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Company website Premium features
-- -----------------------------------------------------------------------------
alter table if exists public.company_sites
  add column if not exists remove_clean_jobs_branding boolean not null default false;

create or replace function public.enforce_company_site_premium_features()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_actor uuid := auth.uid();
  v_owner uuid;
  v_is_premium boolean := false;
begin
  -- Service-role / database maintenance paths have no auth.uid().
  if v_actor is null then
    return new;
  end if;

  select c.owner_id into v_owner
  from public.companies c
  where c.id = new.company_id;

  if v_owner is null or v_owner <> v_actor then
    return new;
  end if;

  v_is_premium := coalesce(public.user_has_premium(v_owner), false);
  if v_is_premium then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.template <> 'modern' then
      raise exception 'premium_required: advanced_template'
        using errcode = 'P0001';
    end if;

    if cardinality(new.enabled_locales) > 1 then
      raise exception 'premium_required: multiple_languages'
        using errcode = 'P0001';
    end if;

    if new.custom_domain is not null then
      raise exception 'premium_required: custom_domain'
        using errcode = 'P0001';
    end if;

    if new.remove_clean_jobs_branding = true then
      raise exception 'premium_required: remove_branding'
        using errcode = 'P0001';
    end if;

    return new;
  end if;

  if new.template <> 'modern' and new.template is distinct from old.template then
    raise exception 'premium_required: advanced_template'
      using errcode = 'P0001';
  end if;

  if cardinality(new.enabled_locales) > 1
     and new.enabled_locales is distinct from old.enabled_locales then
    raise exception 'premium_required: multiple_languages'
      using errcode = 'P0001';
  end if;

  if new.custom_domain is not null
     and new.custom_domain is distinct from old.custom_domain then
    raise exception 'premium_required: custom_domain'
      using errcode = 'P0001';
  end if;

  if new.remove_clean_jobs_branding = true
     and old.remove_clean_jobs_branding = false then
    raise exception 'premium_required: remove_branding'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_company_site_premium_features
on public.company_sites;
create trigger enforce_company_site_premium_features
before insert or update on public.company_sites
for each row execute function public.enforce_company_site_premium_features();

-- -----------------------------------------------------------------------------
-- Lead / booking payment foundation. No checkout is enabled by this migration.
-- -----------------------------------------------------------------------------
do $$
begin
  if to_regclass('public.company_bookings') is not null then
    alter table public.company_bookings
      add column if not exists payment_required boolean not null default false,
      add column if not exists payment_amount numeric(12,2),
      add column if not exists platform_fee_amount numeric(12,2),
      add column if not exists platform_fee_percent numeric(7,4),
      add column if not exists paid_at timestamptz,
      add column if not exists refunded_at timestamptz,
      add column if not exists stripe_checkout_session_id text;

    if not exists (
      select 1 from pg_constraint
      where conname = 'company_bookings_payment_amount_check'
        and conrelid = 'public.company_bookings'::regclass
    ) then
      alter table public.company_bookings add constraint company_bookings_payment_amount_check
        check (payment_amount is null or payment_amount >= 0);
    end if;

    if not exists (
      select 1 from pg_constraint
      where conname = 'company_bookings_platform_fee_amount_check'
        and conrelid = 'public.company_bookings'::regclass
    ) then
      alter table public.company_bookings add constraint company_bookings_platform_fee_amount_check
        check (platform_fee_amount is null or platform_fee_amount >= 0);
    end if;

    if not exists (
      select 1 from pg_constraint
      where conname = 'company_bookings_platform_fee_percent_check'
        and conrelid = 'public.company_bookings'::regclass
    ) then
      alter table public.company_bookings add constraint company_bookings_platform_fee_percent_check
        check (platform_fee_percent is null or (platform_fee_percent >= 0 and platform_fee_percent <= 100));
    end if;
  end if;
end $$;

do $$
begin
  if to_regclass('public.company_quote_requests') is not null then
    alter table public.company_quote_requests
      add column if not exists stripe_checkout_session_id text,
      add column if not exists stripe_payment_intent_id text,
      add column if not exists paid_at timestamptz,
      add column if not exists purchased_by uuid references auth.users(id) on delete set null;
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- RLS for billing data
-- -----------------------------------------------------------------------------
alter table public.billing_subscriptions enable row level security;
alter table public.billing_transactions enable row level security;
alter table public.billing_webhook_events enable row level security;

drop policy if exists "Users can read own billing subscription"
on public.billing_subscriptions;
create policy "Users can read own billing subscription"
on public.billing_subscriptions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read own billing transactions"
on public.billing_transactions;
create policy "Users can read own billing transactions"
on public.billing_transactions
for select to authenticated
using (user_id = auth.uid());

revoke all on public.billing_subscriptions from anon, authenticated;
revoke all on public.billing_transactions from anon, authenticated;
revoke all on public.billing_webhook_events from anon, authenticated;
grant select on public.billing_subscriptions to authenticated;
grant select on public.billing_transactions to authenticated;
grant all on public.billing_subscriptions to service_role;
grant all on public.billing_transactions to service_role;
grant all on public.billing_webhook_events to service_role;

-- -----------------------------------------------------------------------------
-- Critical profiles hardening: users may edit profile fields, never billing/admin
-- fields such as is_premium, Stripe IDs, verification flags, or overrides.
-- -----------------------------------------------------------------------------
revoke insert, update, delete, truncate, references, trigger
  on table public.profiles from anon;

revoke insert, update, delete, truncate, references, trigger
  on table public.profiles from authenticated;

grant insert (
  id,
  full_name,
  phone,
  city,
  company_name,
  avatar_url,
  company_logo_url,
  bio
) on public.profiles to authenticated;

grant update (
  full_name,
  phone,
  city,
  company_name,
  avatar_url,
  company_logo_url,
  bio
) on public.profiles to authenticated;

-- Keep authenticated SELECT plus the existing RLS policies; INSERT/UPDATE are column-scoped.
-- Service role remains unrestricted for trusted server-side actions/webhooks.

notify pgrst, 'reload schema';

commit;
