import { createAdminClient } from "@/lib/supabase-admin"

import type {
  AdminAutomationBillingIssue,
  AdminAutomationBookingIssue,
  AdminAutomationClaimIssue,
  AdminAutomationCrmIssue,
  AdminAutomationLeadIssue,
  AdminAutomationOccurrenceIssue,
  AdminAutomationOutreachIssue,
  AdminAutomationPremiumOverrideIssue,
  AdminAutomationSiteIssue,
  AdminAutomationSnapshot,
  AdminAutomationWebhookIssue,
} from "./types"

const CLAIM_PENDING_HOURS = 24
const BOOKING_PENDING_HOURS = 24
const LEAD_NEW_HOURS = 24
const SITE_PENDING_HOURS = 24
const STUCK_WEBHOOK_MINUTES = 15
const STALE_INVITE_DAYS = 14
const PREVIEW_LIMIT = 12

function beforeHours(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

function beforeMinutes(minutes: number) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString()
}

function beforeDays(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

function logQueryError(label: string, error: { message?: string } | null) {
  if (error) {
    console.error(`Admin automation ${label} error:`, error.message || error)
  }
}

export async function getAdminAutomationSnapshot(): Promise<AdminAutomationSnapshot> {
  const admin = createAdminClient()
  const nowIso = new Date().toISOString()
  const claimCutoff = beforeHours(CLAIM_PENDING_HOURS)
  const bookingCutoff = beforeHours(BOOKING_PENDING_HOURS)
  const leadCutoff = beforeHours(LEAD_NEW_HOURS)
  const siteCutoff = beforeHours(SITE_PENDING_HOURS)
  const webhookCutoff = beforeMinutes(STUCK_WEBHOOK_MINUTES)
  const inviteCutoff = beforeDays(STALE_INVITE_DAYS)

  const [
    claimsResult,
    pendingBookingsResult,
    overdueOccurrencesResult,
    unattendedLeadsResult,
    overdueCrmResult,
    billingResult,
    failedWebhooksResult,
    stuckWebhooksResult,
    expiredOverrideResult,
    failedDomainsResult,
    pendingDomainsResult,
    enrichmentRetriesResult,
    neverScannedResult,
    staleInvitesResult,
    openReportsResult,
  ] = await Promise.all([
    admin
      .from("company_claim_requests")
      .select(
        "id, company_id, user_id, status, created_at, updated_at, requested_info_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .in("status", ["pending", "needs_info"])
      .lt("updated_at", claimCutoff)
      .order("updated_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_bookings")
      .select(
        "id, company_id, customer_name, customer_email, service_type, city, start_date, preferred_time, status, payment_status, created_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .eq("status", "pending")
      .lt("created_at", bookingCutoff)
      .order("created_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_booking_occurrences")
      .select(
        "id, booking_id, company_id, scheduled_start, scheduled_end, status, company_bookings ( id, customer_name, customer_email, service_type, companies ( id, name, slug ) )",
        { count: "exact" },
      )
      .in("status", ["confirmed", "in_progress"])
      .lt("scheduled_end", nowIso)
      .order("scheduled_end", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_quote_requests")
      .select(
        "id, company_id, customer_name, customer_email, service_type, city, status, priority, follow_up_at, created_at, updated_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .eq("status", "new")
      .lt("created_at", leadCutoff)
      .order("created_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_crm_customers")
      .select(
        "id, company_id, customer_name, email, phone, city, lifecycle_stage, follow_up_at, last_activity_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .not("follow_up_at", "is", null)
      .lt("follow_up_at", nowIso)
      .order("follow_up_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("billing_subscriptions")
      .select(
        "user_id, status, billing_interval, stripe_customer_id, stripe_subscription_id, current_period_end, grace_until, last_invoice_status, last_payment_failed_at, updated_at",
        { count: "exact" },
      )
      .in("status", ["past_due", "unpaid", "incomplete", "incomplete_expired", "paused"])
      .order("updated_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("billing_webhook_events")
      .select(
        "event_id, event_type, status, error_message, created_at, processed_at",
        { count: "exact" },
      )
      .eq("status", "failed")
      .order("created_at", { ascending: false })
      .limit(PREVIEW_LIMIT),

    admin
      .from("billing_webhook_events")
      .select(
        "event_id, event_type, status, error_message, created_at, processed_at",
        { count: "exact" },
      )
      .eq("status", "processing")
      .lt("created_at", webhookCutoff)
      .order("created_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("profiles")
      .select(
        "id, full_name, company_name, is_premium, premium_source, premium_override_until",
        { count: "exact" },
      )
      .eq("premium_source", "admin")
      .not("premium_override_until", "is", null)
      .lt("premium_override_until", nowIso)
      .order("premium_override_until", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_sites")
      .select(
        "id, company_id, site_slug, status, custom_domain, domain_status, updated_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .eq("domain_status", "failed")
      .not("custom_domain", "is", null)
      .order("updated_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_sites")
      .select(
        "id, company_id, site_slug, status, custom_domain, domain_status, updated_at, companies ( id, name, slug )",
        { count: "exact" },
      )
      .eq("domain_status", "pending")
      .not("custom_domain", "is", null)
      .lt("updated_at", siteCutoff)
      .order("updated_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_leads")
      .select(
        "id, company_name, city, website, email, status, registered, invite_count, last_invited_at, email_scan_status, email_checked_at, email_scan_error, created_at",
        { count: "exact" },
      )
      .in("email_scan_status", ["timeout", "invalid_site", "failed"])
      .or("email.is.null,email.eq.")
      .order("email_checked_at", { ascending: true, nullsFirst: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_leads")
      .select(
        "id, company_name, city, website, email, status, registered, invite_count, last_invited_at, email_scan_status, email_checked_at, email_scan_error, created_at",
        { count: "exact" },
      )
      .eq("email_scan_status", "never_scanned")
      .not("website", "is", null)
      .neq("website", "")
      .or("email.is.null,email.eq.")
      .order("created_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("company_leads")
      .select(
        "id, company_name, city, website, email, status, registered, invite_count, last_invited_at, email_scan_status, email_checked_at, email_scan_error, created_at",
        { count: "exact" },
      )
      .eq("status", "invited")
      .eq("registered", false)
      .not("last_invited_at", "is", null)
      .lt("last_invited_at", inviteCutoff)
      .order("last_invited_at", { ascending: true })
      .limit(PREVIEW_LIMIT),

    admin
      .from("job_reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
  ])

  const queryResults: Array<[string, { error: { message?: string } | null }]> = [
    ["claims", claimsResult],
    ["pending bookings", pendingBookingsResult],
    ["overdue occurrences", overdueOccurrencesResult],
    ["unattended leads", unattendedLeadsResult],
    ["CRM follow-ups", overdueCrmResult],
    ["billing exceptions", billingResult],
    ["failed webhooks", failedWebhooksResult],
    ["stuck webhooks", stuckWebhooksResult],
    ["expired premium overrides", expiredOverrideResult],
    ["failed domains", failedDomainsResult],
    ["pending domains", pendingDomainsResult],
    ["enrichment retries", enrichmentRetriesResult],
    ["never-scanned outreach", neverScannedResult],
    ["stale invites", staleInvitesResult],
    ["open reports", openReportsResult],
  ]

  for (const [label, result] of queryResults) {
    logQueryError(label, result.error)
  }

  const claimsCount = claimsResult.count ?? 0
  const pendingBookingsCount = pendingBookingsResult.count ?? 0
  const overdueOccurrencesCount = overdueOccurrencesResult.count ?? 0
  const unattendedLeadsCount = unattendedLeadsResult.count ?? 0
  const overdueCrmCount = overdueCrmResult.count ?? 0
  const billingCount = billingResult.count ?? 0
  const failedWebhooksCount = failedWebhooksResult.count ?? 0
  const stuckWebhooksCount = stuckWebhooksResult.count ?? 0
  const expiredOverrideCount = expiredOverrideResult.count ?? 0
  const failedDomainsCount = failedDomainsResult.count ?? 0
  const pendingDomainsCount = pendingDomainsResult.count ?? 0
  const enrichmentRetriesCount = enrichmentRetriesResult.count ?? 0
  const neverScannedCount = neverScannedResult.count ?? 0
  const staleInvitesCount = staleInvitesResult.count ?? 0

  return {
    generatedAt: nowIso,
    thresholds: {
      claimPendingHours: CLAIM_PENDING_HOURS,
      bookingPendingHours: BOOKING_PENDING_HOURS,
      leadNewHours: LEAD_NEW_HOURS,
      sitePendingHours: SITE_PENDING_HOURS,
      stuckWebhookMinutes: STUCK_WEBHOOK_MINUTES,
      staleInviteDays: STALE_INVITE_DAYS,
    },
    metrics: {
      critical:
        overdueOccurrencesCount +
        failedWebhooksCount +
        stuckWebhooksCount +
        failedDomainsCount,
      warning:
        claimsCount +
        pendingBookingsCount +
        unattendedLeadsCount +
        billingCount +
        expiredOverrideCount +
        pendingDomainsCount +
        enrichmentRetriesCount +
        staleInvitesCount,
      followUps: overdueCrmCount + unattendedLeadsCount + staleInvitesCount,
      technical:
        failedWebhooksCount +
        stuckWebhooksCount +
        failedDomainsCount +
        pendingDomainsCount +
        enrichmentRetriesCount,
      openReports: openReportsResult.count ?? 0,
    },
    claims: {
      count: claimsCount,
      items: (claimsResult.data ?? []) as AdminAutomationClaimIssue[],
    },
    pendingBookings: {
      count: pendingBookingsCount,
      items: (pendingBookingsResult.data ?? []) as AdminAutomationBookingIssue[],
    },
    overdueOccurrences: {
      count: overdueOccurrencesCount,
      items: (overdueOccurrencesResult.data ?? []) as AdminAutomationOccurrenceIssue[],
    },
    unattendedLeads: {
      count: unattendedLeadsCount,
      items: (unattendedLeadsResult.data ?? []) as AdminAutomationLeadIssue[],
    },
    overdueCrmFollowUps: {
      count: overdueCrmCount,
      items: (overdueCrmResult.data ?? []) as AdminAutomationCrmIssue[],
    },
    billingExceptions: {
      count: billingCount,
      items: (billingResult.data ?? []) as AdminAutomationBillingIssue[],
    },
    failedWebhooks: {
      count: failedWebhooksCount,
      items: (failedWebhooksResult.data ?? []) as AdminAutomationWebhookIssue[],
    },
    stuckWebhooks: {
      count: stuckWebhooksCount,
      items: (stuckWebhooksResult.data ?? []) as AdminAutomationWebhookIssue[],
    },
    expiredPremiumOverrides: {
      count: expiredOverrideCount,
      items: (expiredOverrideResult.data ?? []) as AdminAutomationPremiumOverrideIssue[],
    },
    failedDomains: {
      count: failedDomainsCount,
      items: (failedDomainsResult.data ?? []) as AdminAutomationSiteIssue[],
    },
    pendingDomains: {
      count: pendingDomainsCount,
      items: (pendingDomainsResult.data ?? []) as AdminAutomationSiteIssue[],
    },
    enrichmentRetries: {
      count: enrichmentRetriesCount,
      items: (enrichmentRetriesResult.data ?? []) as AdminAutomationOutreachIssue[],
    },
    neverScannedOutreach: {
      count: neverScannedCount,
      items: (neverScannedResult.data ?? []) as AdminAutomationOutreachIssue[],
    },
    staleInvites: {
      count: staleInvitesCount,
      items: (staleInvitesResult.data ?? []) as AdminAutomationOutreachIssue[],
    },
  }
}
