import Link from "next/link"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

import EnrichLeadsForm from "./enrich-leads-form"

type PageProps = {
  searchParams: Promise<{
    success?: string
    error?: string
    scanned?: string
    found?: string
    saved?: string
    notFound?: string
    timeout?: string
    invalidSite?: string
    failed?: string
  }>
}

type ScanStatus =
  | "never_scanned"
  | "found"
  | "not_found"
  | "timeout"
  | "invalid_site"
  | "failed"

type RecentLead = {
  id: string
  company_name: string
  website: string | null
  email: string | null
  email_scan_status: ScanStatus
  email_checked_at: string | null
  email_scan_error: string | null
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(
      `/login?next=${encodeURIComponent(
        "/admin/leads/enrich",
      )}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return supabase
}

function parseCounter(value: string | undefined) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return Math.floor(parsed)
}

async function getStatusCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  status: ScanStatus,
) {
  const { count, error } = await supabase
    .from("company_leads")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("email_scan_status", status)

  return {
    count: count ?? 0,
    error,
  }
}

function formatDate(value: string | null) {
  if (!value) {
    return "Never"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Unknown"
  }

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function getStatusLabel(status: ScanStatus) {
  const labels: Record<ScanStatus, string> = {
    never_scanned: "Never scanned",
    found: "Email found",
    not_found: "Not found",
    timeout: "Timeout",
    invalid_site: "Invalid website",
    failed: "Failed",
  }

  return labels[status]
}

function getStatusClassName(status: ScanStatus) {
  const classes: Record<ScanStatus, string> = {
    never_scanned:
      "border-slate-200 bg-slate-100 text-slate-700",
    found:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    not_found:
      "border-amber-200 bg-amber-50 text-amber-800",
    timeout:
      "border-orange-200 bg-orange-50 text-orange-800",
    invalid_site:
      "border-red-200 bg-red-50 text-red-700",
    failed:
      "border-rose-200 bg-rose-50 text-rose-700",
  }

  return classes[status]
}

export default async function EnrichLeadsPage({
  searchParams,
}: PageProps) {
  const supabase = await requireAdmin()
  const params = await searchParams

  const [
    neverScannedResult,
    foundResult,
    notFoundResult,
    timeoutResult,
    invalidSiteResult,
    failedResult,
    recentResult,
  ] = await Promise.all([
    getStatusCount(supabase, "never_scanned"),
    getStatusCount(supabase, "found"),
    getStatusCount(supabase, "not_found"),
    getStatusCount(supabase, "timeout"),
    getStatusCount(supabase, "invalid_site"),
    getStatusCount(supabase, "failed"),
    supabase
      .from("company_leads")
      .select(
        `
          id,
          company_name,
          website,
          email,
          email_scan_status,
          email_checked_at,
          email_scan_error
        `,
      )
      .not("email_checked_at", "is", null)
      .order("email_checked_at", {
        ascending: false,
      })
      .limit(20),
  ])

  const countErrors = [
    neverScannedResult.error,
    foundResult.error,
    notFoundResult.error,
    timeoutResult.error,
    invalidSiteResult.error,
    failedResult.error,
  ].filter(Boolean)

  const recentLeads = (recentResult.data ??
    []) as RecentLead[]

  const isCompleted =
    params.success === "enrichment-completed"

  const scanned = parseCounter(params.scanned)
  const found = parseCounter(params.found)
  const saved = parseCounter(params.saved)
  const notFound = parseCounter(params.notFound)
  const timeout = parseCounter(params.timeout)
  const invalidSite = parseCounter(
    params.invalidSite,
  )
  const failed = parseCounter(params.failed)

  const totalLeads =
    neverScannedResult.count +
    foundResult.count +
    notFoundResult.count +
    timeoutResult.count +
    invalidSiteResult.count +
    failedResult.count

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Admin CRM
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Email enrichment
            </h1>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
              Scan company websites, collect publicly
              published contact emails and monitor every
              enrichment result.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leads/import"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-100"
            >
              Import Excel
            </Link>

            <Link
              href="/admin/leads"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to leads
            </Link>
          </div>
        </div>

        {params.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">
            {params.error}
          </div>
        ) : null}

        {params.success === "no-companies" ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-800">
            There are no unscanned companies with a website
            and a missing email address.
          </div>
        ) : null}

        {isCompleted ? (
          <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <h2 className="text-base font-bold text-emerald-950">
              Last enrichment completed
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
              <ResultMetric
                label="Scanned"
                value={scanned}
              />

              <ResultMetric
                label="Found"
                value={found}
              />

              <ResultMetric
                label="Saved"
                value={saved}
              />

              <ResultMetric
                label="Not found"
                value={notFound}
              />

              <ResultMetric
                label="Timeout"
                value={timeout}
              />

              <ResultMetric
                label="Invalid site"
                value={invalidSite}
              />

              <ResultMetric
                label="Failed"
                value={failed}
              />
            </div>
          </section>
        ) : null}

        {countErrors.length > 0 ||
        recentResult.error ? (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
            Some enrichment statistics could not be loaded.
            The scanner can still be started.
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatusMetric
            label="Never scanned"
            value={neverScannedResult.count}
            description="Waiting for first scan"
            status="never_scanned"
          />

          <StatusMetric
            label="Emails found"
            value={foundResult.count}
            description="Ready for outreach"
            status="found"
          />

          <StatusMetric
            label="Not found"
            value={notFoundResult.count}
            description="Website scanned"
            status="not_found"
          />

          <StatusMetric
            label="Timeout"
            value={timeoutResult.count}
            description="Website did not respond"
            status="timeout"
          />

          <StatusMetric
            label="Invalid sites"
            value={invalidSiteResult.count}
            description="Website cannot be used"
            status="invalid_site"
          />

          <StatusMetric
            label="Failed"
            value={failedResult.count}
            description="Other scan errors"
            status="failed"
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-500">
                Total tracked leads
              </p>

              <p className="text-4xl font-bold tracking-tight text-slate-950">
                {totalLeads}
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-950">
  Email scanner
</h2>

<p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
  Scan new companies or repeat scanning only for
  selected scan results.
</p>

<div className="mt-6 grid gap-4 md:grid-cols-2">
  <div className="rounded-xl border border-slate-200 p-4">
    <h3 className="font-semibold">
      Scan new companies
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      Only companies that have never been scanned.
    </p>

    <div className="mt-4">
      <EnrichLeadsForm />
    </div>
  </div>

  <div className="rounded-xl border border-slate-200 p-4">
    <h3 className="font-semibold">
      Retry scan
    </h3>

    <div className="mt-4 space-y-3">

      <EnrichLeadsForm
  title="Retry Not Found"
  scanStatus="not_found"
  compact
/>

<EnrichLeadsForm
  title="Retry Timeout"
  scanStatus="timeout"
  compact
/>

<EnrichLeadsForm
  title="Retry Invalid Website"
  scanStatus="invalid_site"
  compact
/>

<EnrichLeadsForm
  title="Retry Failed"
  scanStatus="failed"
  compact
/>

    </div>
  </div>
</div>
            </div>
          </article>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-lg font-bold text-slate-950">
              How statuses work
            </h2>

            <div className="mt-5 space-y-4">
              <StatusExplanation
                status="found"
                text="A public email was detected and saved."
              />

              <StatusExplanation
                status="not_found"
                text="The website worked, but no public email was found."
              />

              <StatusExplanation
                status="timeout"
                text="The website did not respond before the timeout."
              />

              <StatusExplanation
                status="invalid_site"
                text="The website address is invalid, unavailable or blocked."
              />

              <StatusExplanation
                status="failed"
                text="The scanner encountered another technical error."
              />
            </div>
          </aside>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-bold text-slate-950">
              Recent scans
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              The 20 most recently checked company
              websites.
            </p>
          </div>

          {recentLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <TableHeader>
                      Company
                    </TableHeader>

                    <TableHeader>
                      Email
                    </TableHeader>

                    <TableHeader>
                      Status
                    </TableHeader>

                    <TableHeader>
                      Checked
                    </TableHeader>

                    <TableHeader>
                      Error
                    </TableHeader>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="align-top"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-950">
                          {lead.company_name}
                        </p>

                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block max-w-xs truncate text-sm text-blue-700 hover:underline"
                          >
                            {lead.website}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-slate-400">
                            No website
                          </p>
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {lead.email ? (
                          <a
                            href={`mailto:${lead.email}`}
                            className="font-medium text-blue-700 hover:underline"
                          >
                            {lead.email}
                          </a>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <ScanStatusBadge
                          status={
                            lead.email_scan_status
                          }
                        />
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {formatDate(
                          lead.email_checked_at,
                        )}
                      </td>

                      <td className="max-w-sm px-6 py-4 text-sm leading-6 text-slate-600">
                        {lead.email_scan_error ? (
                          <span
                            title={
                              lead.email_scan_error
                            }
                            className="line-clamp-3"
                          >
                            {
                              lead.email_scan_error
                            }
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center sm:px-8">
              <p className="text-sm text-slate-600">
                No website scans have been completed yet.
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Outreach compliance
          </h2>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            Use collected addresses only for relevant
            business communication. Clearly identify Clean
            Jobs, explain why the company is being
            contacted and provide a simple method to stop
            receiving future messages.
          </p>
        </section>
      </div>
    </main>
  )
}

function StatusMetric({
  label,
  value,
  description,
  status,
}: {
  label: string
  value: number
  description: string
  status: ScanStatus
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <ScanStatusBadge status={status} />

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-900">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  )
}

function ResultMetric({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-emerald-950">
        {value}
      </p>
    </div>
  )
}

function ScanStatusBadge({
  status,
}: {
  status: ScanStatus
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClassName(
        status,
      )}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}

function StatusExplanation({
  status,
  text,
}: {
  status: ScanStatus
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="shrink-0">
        <ScanStatusBadge status={status} />
      </div>

      <p className="pt-1 text-sm leading-6 text-slate-600">
        {text}
      </p>
    </div>
  )
}

function TableHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </th>
  )
}