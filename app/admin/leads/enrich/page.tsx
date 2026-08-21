import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import type {
  EnrichmentBatchSummary,
  EnrichmentImportBatchOption,
} from "@/lib/email-enrichment/batch-types"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

import BatchRunner from "./batch-runner"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Batch Email Enrichment | Clean Jobs Admin",
  description: "Run persistent email-enrichment batches for imported Swedish cleaning companies.",
}

type PageProps = {
  searchParams: Promise<{
    batch?: string
    importBatch?: string
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
  email_scan_attempt_count: number
  data_quality_score: number
}

type RecentBatch = {
  id: string
  source_status: string
  imported_only: boolean
  status: string
  total_items: number
  completed_count: number
  found_count: number
  failed_count: number
  created_at: string
  completed_at: string | null
  import_batch_id: string | null
}

type ImportBatchRow = {
  id: string
  file_name: string
  total_rows: number
  created_at: string
  status: string
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function integer(value: unknown, fallback = 0) {
  const parsed = Number(value ?? fallback)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

function parseBatchSummary(value: unknown): EnrichmentBatchSummary | null {
  if (!value || typeof value !== "object") return null

  const raw = value as Record<string, unknown>
  const id = typeof raw.id === "string" ? raw.id : ""
  const status = String(raw.status || "queued")

  if (!id || !["queued", "running", "completed"].includes(status)) return null

  return {
    id,
    status: status as EnrichmentBatchSummary["status"],
    total: integer(raw.total),
    queued: integer(raw.queued),
    processing: integer(raw.processing),
    completed: integer(raw.completed),
    found: integer(raw.found),
    notFound: integer(raw.not_found),
    timeout: integer(raw.timeout),
    invalidSite: integer(raw.invalid_site),
    failed: integer(raw.failed),
    skipped: integer(raw.skipped),
    remaining: integer(raw.remaining),
  }
}

function formatDate(value: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function StatusMetric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

async function countByStatus(admin: ReturnType<typeof createAdminClient>, status: ScanStatus) {
  const { count, error } = await admin
    .from("company_leads")
    .select("id", { count: "exact", head: true })
    .eq("email_scan_status", status)

  if (error) console.error(`Enrichment ${status} count error:`, error.message)
  return count ?? 0
}

export default async function EnrichLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent("/admin/leads/enrich")}`)
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()
  const selectedBatchId = String(params.batch || "").trim()
  const preselectedImportBatchId = String(params.importBatch || "").trim()

  const [
    neverScanned,
    found,
    notFound,
    timeout,
    invalidSite,
    failed,
    importedWaitingResult,
    recentScansResult,
    recentBatchesResult,
    importBatchesResult,
  ] = await Promise.all([
    countByStatus(admin, "never_scanned"),
    countByStatus(admin, "found"),
    countByStatus(admin, "not_found"),
    countByStatus(admin, "timeout"),
    countByStatus(admin, "invalid_site"),
    countByStatus(admin, "failed"),
    admin
      .from("company_leads")
      .select("id", { count: "exact", head: true })
      .not("import_batch_id", "is", null)
      .not("website", "is", null)
      .neq("website", "")
      .or("email.is.null,email.eq."),
    admin
      .from("company_leads")
      .select(
        "id, company_name, website, email, email_scan_status, email_checked_at, email_scan_attempt_count, data_quality_score",
      )
      .not("email_checked_at", "is", null)
      .order("email_checked_at", { ascending: false })
      .limit(20),
    admin
      .from("company_enrichment_batches")
      .select(
        "id, source_status, imported_only, status, total_items, completed_count, found_count, failed_count, created_at, completed_at, import_batch_id",
      )
      .order("created_at", { ascending: false })
      .limit(12),
    admin
      .from("company_import_batches")
      .select("id, file_name, total_rows, created_at, status")
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(25),
  ])

  if (importedWaitingResult.error) {
    console.error("Imported enrichment waiting count error:", importedWaitingResult.error.message)
  }
  if (recentScansResult.error) {
    console.error("Recent enrichment scans error:", recentScansResult.error.message)
  }
  if (recentBatchesResult.error) {
    console.error("Recent enrichment batches error:", recentBatchesResult.error.message)
  }
  if (importBatchesResult.error) {
    console.error("Enrichment import batches error:", importBatchesResult.error.message)
  }

  let selectedBatch: EnrichmentBatchSummary | null = null

  if (selectedBatchId && isUuid(selectedBatchId)) {
    const { data, error } = await admin.rpc("refresh_company_enrichment_batch", {
      p_batch_id: selectedBatchId,
    })

    if (error) {
      console.error("Selected enrichment batch refresh error:", error.message)
    } else {
      selectedBatch = parseBatchSummary(data)
    }
  }

  const recentScans = (recentScansResult.data ?? []) as RecentLead[]
  const recentBatches = (recentBatchesResult.data ?? []) as RecentBatch[]
  const importBatches = ((importBatchesResult.data ?? []) as ImportBatchRow[]).map(
    (batch): EnrichmentImportBatchOption => ({
      id: batch.id,
      fileName: batch.file_name,
      totalRows: batch.total_rows,
      createdAt: batch.created_at,
    }),
  )

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-700">
              Admin CRM · Mass Import 3/4
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Batch email enrichment
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Turn the existing website scanner into a persistent queue for mass-imported Swedish cleaning companies. Every scan result is saved to the CRM, retry attempts are capped, and discovered emails increase the lead quality score automatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/leads/import"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-5 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
            >
              Import companies
            </Link>
            <Link
              href="/admin/leads/publish"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-blue-50 px-5 text-sm font-bold text-blue-800 hover:bg-blue-100"
            >
              Publish directory
            </Link>
            <Link
              href="/admin/leads"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800"
            >
              Back to leads
            </Link>
          </div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          <StatusMetric label="Imported waiting" value={importedWaitingResult.count ?? 0} detail="Imported leads with website and no email." />
          <StatusMetric label="Never scanned" value={neverScanned} detail="First scan candidates." />
          <StatusMetric label="Emails found" value={found} detail="Ready for outreach / stronger quality." />
          <StatusMetric label="Not found" value={notFound} detail="Website worked, no public email." />
          <StatusMetric label="Timeout" value={timeout} detail="Retry candidates." />
          <StatusMetric label="Invalid site" value={invalidSite} detail="Website needs correction or later retry." />
          <StatusMetric label="Failed" value={failed} detail="Other technical failures." />
        </section>

        <div className="mt-8">
          <BatchRunner
            initialBatch={selectedBatch}
            importBatches={importBatches}
            preselectedImportBatchId={
              isUuid(preselectedImportBatchId) ? preselectedImportBatchId : undefined
            }
          />
        </div>

        <section className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-5 sm:p-7">
          <h2 className="text-lg font-black text-blue-950">Quality gate after enrichment</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-blue-900">
            The Mass Import score gives a valid email 20 points. When the scanner finds an email, the existing normalization trigger recalculates <code>data_quality_score</code>. If the lead was already linked to a public company, the email is copied only when the public profile does not already have one. Existing company email data is never overwritten.
          </p>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-950">Recent enrichment batches</h2>
            <p className="mt-1 text-sm text-slate-500">
              Persistent queues can be reopened and continued after refresh or browser restart.
            </p>
          </div>

          {recentBatches.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No enrichment batches yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Source</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Progress</th>
                    <th className="px-5 py-3">Found</th>
                    <th className="px-5 py-3">Failed</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentBatches.map((batch) => (
                    <tr key={batch.id}>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(batch.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-900">{batch.source_status}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {batch.import_batch_id ? "Specific import" : batch.imported_only ? "All imports" : "All CRM"}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{batch.status}</td>
                      <td className="px-5 py-4">
                        {batch.completed_count} / {batch.total_items}
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-700">{batch.found_count}</td>
                      <td className="px-5 py-4 font-bold text-red-700">{batch.failed_count}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/leads/enrich?batch=${encodeURIComponent(batch.id)}`}
                          prefetch={false}
                          className="font-bold text-violet-700 hover:underline"
                        >
                          {batch.status === "completed" ? "View" : "Continue"} →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-950">Recent scan results</h2>
            <p className="mt-1 text-sm text-slate-500">The latest 20 CRM leads checked by either enrichment workflow.</p>
          </div>

          {recentScans.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No website scans have been completed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Attempts</th>
                    <th className="px-5 py-3">Quality</th>
                    <th className="px-5 py-3">Checked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentScans.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{lead.company_name}</p>
                        {lead.website ? (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block max-w-xs truncate text-xs text-blue-700 hover:underline"
                          >
                            {lead.website}
                          </a>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 text-slate-700">{lead.email || "—"}</td>
                      <td className="px-5 py-4 font-bold text-slate-700">{lead.email_scan_status}</td>
                      <td className="px-5 py-4">{lead.email_scan_attempt_count}</td>
                      <td className="px-5 py-4 font-bold">{lead.data_quality_score}/100</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(lead.email_checked_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-black text-slate-950">Operational rules</h2>
          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">
            Use the default 8-company server chunk for normal runs. The queue itself can contain up to 5,000 leads, but only a small chunk is scanned per request. This avoids one long Server Action holding hundreds of external HTTP requests. Retry queues respect the maximum attempt count selected when the batch is created.
          </p>
        </section>
      </div>
    </main>
  )
}
