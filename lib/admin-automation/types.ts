export type AutomationSeverity = "critical" | "warning" | "info"

export type CompanyRef = {
  id: string
  name: string
  slug: string
}

export type AdminAutomationClaimIssue = {
  id: string
  company_id: string
  user_id: string
  status: string
  created_at: string
  updated_at: string
  requested_info_at: string | null
  companies: CompanyRef | CompanyRef[] | null
}

export type AdminAutomationBookingIssue = {
  id: string
  company_id: string
  customer_name: string
  customer_email: string
  service_type: string
  city: string
  start_date: string
  preferred_time: string
  status: string
  payment_status: string
  created_at: string
  companies: CompanyRef | CompanyRef[] | null
}

export type AdminAutomationOccurrenceIssue = {
  id: string
  booking_id: string
  company_id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  company_bookings:
    | {
        id: string
        customer_name: string
        customer_email: string
        service_type: string
        companies: CompanyRef | CompanyRef[] | null
      }
    | {
        id: string
        customer_name: string
        customer_email: string
        service_type: string
        companies: CompanyRef | CompanyRef[] | null
      }[]
    | null
}

export type AdminAutomationLeadIssue = {
  id: string
  company_id: string
  customer_name: string
  customer_email: string
  service_type: string | null
  city: string | null
  status: string
  priority: string
  follow_up_at: string | null
  created_at: string
  updated_at: string
  companies: CompanyRef | CompanyRef[] | null
}

export type AdminAutomationCrmIssue = {
  id: string
  company_id: string
  customer_name: string
  email: string
  phone: string | null
  city: string | null
  lifecycle_stage: string
  follow_up_at: string | null
  last_activity_at: string
  companies: CompanyRef | CompanyRef[] | null
}

export type AdminAutomationBillingIssue = {
  user_id: string
  status: string
  billing_interval: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  current_period_end: string | null
  grace_until: string | null
  last_invoice_status: string | null
  last_payment_failed_at: string | null
  updated_at: string
}

export type AdminAutomationWebhookIssue = {
  event_id: string
  event_type: string
  status: string
  error_message: string | null
  created_at: string
  processed_at: string | null
}

export type AdminAutomationPremiumOverrideIssue = {
  id: string
  full_name: string | null
  company_name: string | null
  is_premium: boolean | null
  premium_source: string | null
  premium_override_until: string | null
}

export type AdminAutomationSiteIssue = {
  id: string
  company_id: string
  site_slug: string
  status: string
  custom_domain: string | null
  domain_status: string
  updated_at: string
  companies: CompanyRef | CompanyRef[] | null
}

export type AdminAutomationOutreachIssue = {
  id: string
  company_name: string
  city: string | null
  website: string | null
  email: string | null
  status: string
  registered: boolean
  invite_count: number
  last_invited_at: string | null
  email_scan_status: string
  email_checked_at: string | null
  email_scan_error: string | null
  created_at: string
}

export type AdminAutomationQueue<T> = {
  count: number
  items: T[]
}

export type AdminAutomationSnapshot = {
  generatedAt: string
  thresholds: {
    claimPendingHours: number
    bookingPendingHours: number
    leadNewHours: number
    sitePendingHours: number
    stuckWebhookMinutes: number
    staleInviteDays: number
  }
  metrics: {
    critical: number
    warning: number
    followUps: number
    technical: number
    openReports: number
  }
  claims: AdminAutomationQueue<AdminAutomationClaimIssue>
  pendingBookings: AdminAutomationQueue<AdminAutomationBookingIssue>
  overdueOccurrences: AdminAutomationQueue<AdminAutomationOccurrenceIssue>
  unattendedLeads: AdminAutomationQueue<AdminAutomationLeadIssue>
  overdueCrmFollowUps: AdminAutomationQueue<AdminAutomationCrmIssue>
  billingExceptions: AdminAutomationQueue<AdminAutomationBillingIssue>
  failedWebhooks: AdminAutomationQueue<AdminAutomationWebhookIssue>
  stuckWebhooks: AdminAutomationQueue<AdminAutomationWebhookIssue>
  expiredPremiumOverrides: AdminAutomationQueue<AdminAutomationPremiumOverrideIssue>
  failedDomains: AdminAutomationQueue<AdminAutomationSiteIssue>
  pendingDomains: AdminAutomationQueue<AdminAutomationSiteIssue>
  enrichmentRetries: AdminAutomationQueue<AdminAutomationOutreachIssue>
  neverScannedOutreach: AdminAutomationQueue<AdminAutomationOutreachIssue>
  staleInvites: AdminAutomationQueue<AdminAutomationOutreachIssue>
}
