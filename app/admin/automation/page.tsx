import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { reconcileExpiredPremiumOverridesAction } from "@/app/admin/automation/actions"
import { getAdminAutomationSnapshot } from "@/lib/admin-automation/server"
import type {
  AdminAutomationOccurrenceIssue,
  CompanyRef,
} from "@/lib/admin-automation/types"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Admin Automation | Clean Jobs",
  description: "Operational health, exception queues and safe maintenance for Clean Jobs.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{
    maintenance?: string
    updated?: string
    failed?: string
  }>
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function relationOne<T>(value: T | T[] | null | undefined) {
  if (!value) return null
  return Array.isArray(value) ? value[0] ?? null : value
}

function occurrenceBooking(row: AdminAutomationOccurrenceIssue) {
  return relationOne(row.company_bookings)
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function companyName(value: CompanyRef | CompanyRef[] | null | undefined) {
  return relationOne(value)?.name || "Unknown company"
}

function Metric({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string
  value: number
  hint: string
  tone?: "critical" | "warning" | "info" | "neutral"
}) {
  const toneClass =
    tone === "critical"
      ? "border-red-200 bg-red-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : tone === "info"
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white"

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-600">{hint}</p>
    </div>
  )
}

function QueueHeader({
  title,
  description,
  count,
  href,
  action,
}: {
  title: string
  description: string
  count: number
  href?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-black tracking-tight text-slate-950">
            {title}
          </h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700">
            {count}
          </span>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {action}
        {href ? (
          <Link
            href={href}
            prefetch={false}
            className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Open queue
          </Link>
        ) : null}
      </div>
    </div>
  )
}

function Empty({ text = "No issues detected." }: { text?: string }) {
  return (
    <div className="m-5 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-5 text-sm font-bold text-emerald-800 sm:m-6">
      ✓ {text}
    </div>
  )
}

function Row({
  title,
  meta,
  time,
  href,
  badge,
}: {
  title: string
  meta: string
  time?: string
  href?: string
  badge?: string
}) {
  const content = (
    <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-black text-slate-950">{title}</p>
          {badge ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-slate-500">{meta}</p>
      </div>
      <div className="shrink-0 text-xs font-bold text-slate-400">
        {time || "—"}
      </div>
    </div>
  )

  return href ? (
    <Link
      href={href}
      prefetch={false}
      className="block rounded-2xl border border-slate-200 bg-white transition hover:border-rose-200 hover:bg-rose-50/30"
    >
      {content}
    </Link>
  ) : (
    <div className="rounded-2xl border border-slate-200 bg-white">{content}</div>
  )
}

function MaintenanceMessage({
  status,
  updated,
  failed,
}: {
  status?: string
  updated: number
  failed: number
}) {
  if (!status) return null

  if (status === "none") {
    return (
      <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-800">
        No expired admin Premium overrides required reconciliation.
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
        Maintenance could not complete. Check the server console.
      </div>
    )
  }

  return (
    <div
      className={`mt-5 rounded-2xl border p-4 text-sm font-bold ${
        failed > 0
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-emerald-200 bg-emerald-50 text-emerald-800"
      }`}
    >
      Premium reconciliation finished. Updated: {updated} · Failed: {failed}
    </div>
  )
}

export default async function AdminAutomationPage({ searchParams }: PageProps) {
  const query = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/automation")
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  const snapshot = await getAdminAutomationSnapshot()
  const maintenanceUpdated = Number(query.updated || 0)
  const maintenanceFailed = Number(query.failed || 0)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/admin"
                prefetch={false}
                className="text-sm font-black text-slate-500 hover:text-rose-600"
              >
                ← Admin
              </Link>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-600">
                Operations / Automation
              </p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Admin Automation Center
              </h1>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                One live operational queue for company claims, bookings, customer
                follow-ups, billing, domains and outreach exceptions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Snapshot: {formatDate(snapshot.generatedAt)}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <Metric
              label="Critical"
              value={snapshot.metrics.critical}
              hint="Overdue operations or failed technical flows"
              tone="critical"
            />
            <Metric
              label="Needs attention"
              value={snapshot.metrics.warning}
              hint="Queues that are old enough to require review"
              tone="warning"
            />
            <Metric
              label="Follow-ups"
              value={snapshot.metrics.followUps}
              hint="Customer and outreach follow-ups due now"
              tone="info"
            />
            <Metric
              label="Technical"
              value={snapshot.metrics.technical}
              hint="Webhook, domain and enrichment exceptions"
            />
            <Metric
              label="Open reports"
              value={snapshot.metrics.openReports}
              hint="Existing moderation queue"
            />
          </div>

          <MaintenanceMessage
            status={query.maintenance}
            updated={maintenanceUpdated}
            failed={maintenanceFailed}
          />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <QueueHeader
            title="Company claim SLA"
            description={`Claims still pending or waiting on admin after more than ${snapshot.thresholds.claimPendingHours} hours.`}
            count={snapshot.claims.count}
            href="/admin#company-claims"
          />
          {snapshot.claims.items.length === 0 ? (
            <Empty />
          ) : (
            <div className="space-y-3 p-5 sm:p-6">
              {snapshot.claims.items.map((claim) => (
                <Row
                  key={claim.id}
                  title={companyName(claim.companies)}
                  meta={`Claim ${claim.status} · user ${claim.user_id.slice(0, 8)}…`}
                  time={formatDate(claim.updated_at)}
                  href="/admin#company-claims"
                  badge={claim.status}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-7 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <QueueHeader
              title="Stale pending bookings"
              description={`Booking requests that have waited more than ${snapshot.thresholds.bookingPendingHours} hours for a company decision.`}
              count={snapshot.pendingBookings.count}
              href="/admin/automation"
            />
            {snapshot.pendingBookings.items.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3 p-5 sm:p-6">
                {snapshot.pendingBookings.items.map((booking) => (
                  <Row
                    key={booking.id}
                    title={booking.customer_name}
                    meta={`${companyName(booking.companies)} · ${booking.service_type} · ${booking.city}`}
                    time={formatDate(booking.created_at)}
                    badge={booking.status}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-red-200 bg-white shadow-sm">
            <QueueHeader
              title="Overdue booking occurrences"
              description="Confirmed or in-progress cleanings whose scheduled end time has already passed."
              count={snapshot.overdueOccurrences.count}
            />
            {snapshot.overdueOccurrences.items.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3 p-5 sm:p-6">
                {snapshot.overdueOccurrences.items.map((occurrence) => {
                  const booking = occurrenceBooking(occurrence)
                  return (
                    <Row
                      key={occurrence.id}
                      title={booking?.customer_name || "Booking"}
                      meta={`${companyName(booking?.companies)} · ${booking?.service_type || "Cleaning"}`}
                      time={formatDate(occurrence.scheduled_end)}
                      badge={occurrence.status}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-7 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <QueueHeader
              title="Unattended customer leads"
              description={`New customer quote requests older than ${snapshot.thresholds.leadNewHours} hours.`}
              count={snapshot.unattendedLeads.count}
              href="/admin/customer-leads?status=new"
            />
            {snapshot.unattendedLeads.items.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3 p-5 sm:p-6">
                {snapshot.unattendedLeads.items.map((lead) => (
                  <Row
                    key={lead.id}
                    title={lead.customer_name}
                    meta={`${companyName(lead.companies)} · ${lead.service_type || "—"} · ${lead.city || "—"}`}
                    time={formatDate(lead.created_at)}
                    href="/admin/customer-leads?status=new"
                    badge={lead.priority}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <QueueHeader
              title="Overdue CRM follow-ups"
              description="Company CRM follow-ups whose due time is already in the past."
              count={snapshot.overdueCrmFollowUps.count}
            />
            {snapshot.overdueCrmFollowUps.items.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3 p-5 sm:p-6">
                {snapshot.overdueCrmFollowUps.items.map((customer) => (
                  <Row
                    key={customer.id}
                    title={customer.customer_name}
                    meta={`${companyName(customer.companies)} · ${customer.email}`}
                    time={formatDate(customer.follow_up_at)}
                    badge={customer.lifecycle_stage}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <QueueHeader
            title="Billing and Premium exceptions"
            description="Problem subscription states, failed/stuck Stripe webhook processing and expired admin Premium overrides."
            count={
              snapshot.billingExceptions.count +
              snapshot.failedWebhooks.count +
              snapshot.stuckWebhooks.count +
              snapshot.expiredPremiumOverrides.count
            }
            href="/admin/billing"
            action={
              snapshot.expiredPremiumOverrides.count > 0 ? (
                <form action={reconcileExpiredPremiumOverridesAction}>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white hover:bg-slate-800"
                  >
                    Reconcile expired Premium ({snapshot.expiredPremiumOverrides.count})
                  </button>
                </form>
              ) : null
            }
          />

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-400">
                Subscription states
              </h3>
              <div className="mt-3 space-y-3">
                {snapshot.billingExceptions.items.length === 0 ? (
                  <Empty text="No problematic subscription states." />
                ) : (
                  snapshot.billingExceptions.items.map((billing) => (
                    <Row
                      key={billing.user_id}
                      title={billing.user_id}
                      meta={`${billing.status} · ${billing.billing_interval} · invoice ${billing.last_invoice_status || "—"}`}
                      time={formatDate(billing.updated_at)}
                      href="/admin/billing"
                      badge={billing.status}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-wide text-slate-400">
                Stripe webhook processing
              </h3>
              <div className="mt-3 space-y-3">
                {[...snapshot.stuckWebhooks.items, ...snapshot.failedWebhooks.items]
                  .slice(0, 12)
                  .map((event) => (
                    <Row
                      key={event.event_id}
                      title={event.event_type}
                      meta={event.error_message || event.event_id}
                      time={formatDate(event.created_at)}
                      badge={event.status}
                    />
                  ))}
                {snapshot.stuckWebhooks.items.length === 0 &&
                snapshot.failedWebhooks.items.length === 0 ? (
                  <Empty text="Stripe webhook processing is healthy." />
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-7 xl:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <QueueHeader
              title="Custom-domain exceptions"
              description={`Failed domains plus pending verification older than ${snapshot.thresholds.sitePendingHours} hours.`}
              count={snapshot.failedDomains.count + snapshot.pendingDomains.count}
            />
            {snapshot.failedDomains.items.length === 0 &&
            snapshot.pendingDomains.items.length === 0 ? (
              <Empty />
            ) : (
              <div className="space-y-3 p-5 sm:p-6">
                {[...snapshot.failedDomains.items, ...snapshot.pendingDomains.items]
                  .slice(0, 12)
                  .map((site) => (
                    <Row
                      key={site.id}
                      title={site.custom_domain || site.site_slug}
                      meta={`${companyName(site.companies)} · site ${site.status}`}
                      time={formatDate(site.updated_at)}
                      href={`/site/${site.site_slug}`}
                      badge={site.domain_status}
                    />
                  ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <QueueHeader
              title="Outreach / enrichment"
              description={`Technical email-scan retries, never-scanned websites and invitations with no registration after ${snapshot.thresholds.staleInviteDays} days.`}
              count={
                snapshot.enrichmentRetries.count +
                snapshot.neverScannedOutreach.count +
                snapshot.staleInvites.count
              }
              href="/admin/leads/enrich"
            />

            <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-6">
              <Link
                href="/admin/leads/enrich"
                className="rounded-2xl border border-red-200 bg-red-50 p-4 hover:bg-red-100"
              >
                <p className="text-3xl font-black text-red-800">
                  {snapshot.enrichmentRetries.count}
                </p>
                <p className="mt-1 text-sm font-black text-red-800">
                  Retry technical scans
                </p>
              </Link>
              <Link
                href="/admin/leads/enrich"
                className="rounded-2xl border border-blue-200 bg-blue-50 p-4 hover:bg-blue-100"
              >
                <p className="text-3xl font-black text-blue-800">
                  {snapshot.neverScannedOutreach.count}
                </p>
                <p className="mt-1 text-sm font-black text-blue-800">
                  Never scanned
                </p>
              </Link>
              <Link
                href="/admin/leads?status=invited"
                className="rounded-2xl border border-amber-200 bg-amber-50 p-4 hover:bg-amber-100"
              >
                <p className="text-3xl font-black text-amber-800">
                  {snapshot.staleInvites.count}
                </p>
                <p className="mt-1 text-sm font-black text-amber-800">
                  Stale invitations
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <h2 className="text-lg font-black text-blue-950">What this stage automates</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-900">
            The page calculates operational exceptions from live production data
            instead of relying on manual spot checks. The only automatic mutation
            exposed here is the safe Premium-override reconciliation; customer,
            booking, claim and outreach records remain human-reviewed.
          </p>
        </section>
      </div>
    </main>
  )
}
