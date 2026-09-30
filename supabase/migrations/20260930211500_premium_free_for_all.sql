begin;

-- ============================================================
-- Clean Jobs launch mode:
-- Premium features are temporarily free for every user.
--
-- IMPORTANT:
-- This does NOT modify existing Stripe subscriptions,
-- profile premium states or admin overrides.
-- ============================================================

create table if not exists public.platform_settings (
  key text primary key,
  boolean_value boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (
  key,
  boolean_value,
  updated_at
)
values (
  'premium_free_for_all',
  true,
  now()
)
on conflict (key)
do update set
  boolean_value = excluded.boolean_value,
  updated_at = now();

alter table public.platform_settings enable row level security;

revoke all
on table public.platform_settings
from anon, authenticated;

grant all
on table public.platform_settings
to service_role;

create or replace function public.is_premium_free_for_all()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select s.boolean_value
      from public.platform_settings s
      where s.key = 'premium_free_for_all'
    ),
    false
  );
$$;

revoke all
on function public.is_premium_free_for_all()
from public, anon;

grant execute
on function public.is_premium_free_for_all()
to authenticated, service_role;

-- Keep all existing Premium logic, but launch mode wins first.
create or replace function public.user_has_premium(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select
    public.is_premium_free_for_all()
    or coalesce(
      (
        select
          coalesce(p.premium_override_until > now(), false)
          or exists (
            select 1
            from public.billing_subscriptions b
            where b.user_id = target_user_id
              and (
                b.status in ('active', 'trialing')
                or (
                  b.status = 'past_due'
                  and b.grace_until > now()
                )
                or (
                  b.status = 'legacy'
                  and coalesce(p.is_premium, false) = true
                  and (
                    b.current_period_end is null
                    or b.current_period_end > now()
                  )
                )
              )
          )
          or (
            coalesce(p.is_premium, false) = true
            and coalesce(p.premium_source, 'none') = 'legacy'
            and (
              p.subscription_ends_at is null
              or p.subscription_ends_at > now()
            )
          )
        from public.profiles p
        where p.id = target_user_id
      ),
      false
    );
$$;

revoke all
on function public.user_has_premium(uuid)
from public, anon;

grant execute
on function public.user_has_premium(uuid)
to authenticated, service_role;

notify pgrst, 'reload schema';

commit;
