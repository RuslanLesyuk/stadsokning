begin;

-- ============================================================================
-- Clean Jobs 10/10 - security hardening
-- ============================================================================

-- Critical: claim-review RPCs are SECURITY DEFINER functions. PostgreSQL grants
-- EXECUTE on new functions to PUBLIC by default, so explicitly make these
-- service-role-only. Admin server actions already invoke them with service role.
revoke all on function public.approve_company_claim(uuid, uuid)
  from PUBLIC, anon, authenticated;
grant execute on function public.approve_company_claim(uuid, uuid)
  to service_role;

revoke all on function public.reject_company_claim(uuid, uuid, text)
  from PUBLIC, anon, authenticated;
grant execute on function public.reject_company_claim(uuid, uuid, text)
  to service_role;

revoke all on function public.request_more_info_company_claim(uuid, uuid, text)
  from PUBLIC, anon, authenticated;
grant execute on function public.request_more_info_company_claim(uuid, uuid, text)
  to service_role;

-- Claim request mutations now go only through the authenticated server action,
-- which performs ownership/input checks and then uses service role for the final
-- write. Keep client-side SELECT for the claimant dashboard, but prevent a
-- browser from directly forging review/domain-match metadata through PostgREST.
revoke insert, update, delete on public.company_claim_requests
  from anon, authenticated;
grant select on public.company_claim_requests to authenticated;
grant all on public.company_claim_requests to service_role;

-- Persistent B2B outreach preference/suppression state. This is private and
-- service-role-only so an opt-out remains effective even if a company is
-- imported again later.
create table if not exists public.outreach_email_preferences (
  email_normalized text primary key,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  opted_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint outreach_email_preferences_email_check
    check (email_normalized = lower(trim(email_normalized)) and position('@' in email_normalized) > 1)
);

alter table public.outreach_email_preferences enable row level security;
revoke all on public.outreach_email_preferences from PUBLIC, anon, authenticated;
grant all on public.outreach_email_preferences to service_role;

create index if not exists outreach_email_preferences_opted_out_idx
  on public.outreach_email_preferences (opted_out_at)
  where opted_out_at is not null;

-- Private DB-backed rate limiting for public/email-producing actions.
create table if not exists public.security_rate_limits (
  action text not null,
  key_hash text not null,
  window_start timestamptz not null,
  hits integer not null default 0 check (hits >= 0),
  updated_at timestamptz not null default now(),
  primary key (action, key_hash, window_start)
);

alter table public.security_rate_limits enable row level security;
revoke all on public.security_rate_limits from public, anon, authenticated;
grant all on public.security_rate_limits to service_role;

create index if not exists security_rate_limits_updated_idx
  on public.security_rate_limits (updated_at);

create or replace function public.consume_security_rate_limit(
  p_action text,
  p_key_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_window_start timestamptz;
  v_hits integer;
begin
  if p_action is null or length(trim(p_action)) = 0 or length(p_action) > 80 then
    raise exception 'invalid rate-limit action';
  end if;

  if p_key_hash is null or length(p_key_hash) <> 64 then
    raise exception 'invalid rate-limit key';
  end if;

  if p_limit < 1 or p_limit > 10000 then
    raise exception 'invalid rate-limit limit';
  end if;

  if p_window_seconds < 60 or p_window_seconds > 86400 then
    raise exception 'invalid rate-limit window';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.security_rate_limits (
    action,
    key_hash,
    window_start,
    hits,
    updated_at
  )
  values (
    trim(p_action),
    p_key_hash,
    v_window_start,
    1,
    now()
  )
  on conflict (action, key_hash, window_start)
  do update set
    hits = public.security_rate_limits.hits + 1,
    updated_at = now()
  returning hits into v_hits;

  -- Opportunistic cleanup; old buckets are not business data.
  delete from public.security_rate_limits
  where updated_at < now() - interval '2 days';

  return v_hits <= p_limit;
end;
$$;

revoke all on function public.consume_security_rate_limit(text, text, integer, integer)
  from PUBLIC, anon, authenticated;
grant execute on function public.consume_security_rate_limit(text, text, integer, integer)
  to service_role;

notify pgrst, 'reload schema';
commit;
