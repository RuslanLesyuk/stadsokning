begin;

-- ============================================================
-- Clean Jobs — Admin Automation / Operational Health (Block 9/10)
-- ============================================================
-- No new business state is introduced here.
-- These partial indexes support the live exception queues used by
-- /admin/automation without changing existing workflows.
-- ============================================================

create index if not exists company_claim_requests_admin_active_updated_idx
  on public.company_claim_requests(status, updated_at)
  where status in ('pending', 'needs_info');

create index if not exists company_bookings_admin_pending_created_idx
  on public.company_bookings(created_at)
  where status = 'pending';

create index if not exists company_booking_occurrences_admin_overdue_idx
  on public.company_booking_occurrences(scheduled_end)
  where status in ('confirmed', 'in_progress');

create index if not exists company_quote_requests_admin_new_created_idx
  on public.company_quote_requests(created_at)
  where status = 'new';

create index if not exists company_crm_customers_admin_follow_up_idx
  on public.company_crm_customers(follow_up_at)
  where follow_up_at is not null;

create index if not exists billing_subscriptions_admin_exception_idx
  on public.billing_subscriptions(status, updated_at)
  where status in ('past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');

create index if not exists billing_webhook_events_admin_problem_idx
  on public.billing_webhook_events(status, created_at)
  where status in ('processing', 'failed');

create index if not exists profiles_admin_expired_override_idx
  on public.profiles(premium_override_until)
  where premium_source = 'admin'
    and premium_override_until is not null;

create index if not exists company_sites_admin_domain_problem_idx
  on public.company_sites(domain_status, updated_at)
  where custom_domain is not null
    and domain_status in ('pending', 'failed');

create index if not exists company_leads_admin_scan_problem_idx
  on public.company_leads(email_scan_status, email_checked_at)
  where email_scan_status in ('never_scanned', 'timeout', 'invalid_site', 'failed');

create index if not exists company_leads_admin_stale_invite_idx
  on public.company_leads(last_invited_at)
  where status = 'invited'
    and registered = false
    and last_invited_at is not null;

notify pgrst, 'reload schema';

commit;
