import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Mass Import Rollout QA | Clean Jobs Admin",
  description: "Audit imported Swedish cleaning-company data before large-scale publication and outreach.",
}

const MIN_PUBLICATION_QUALITY = 55
const MAX_ENRICHMENT_ATTEMPTS = 3

type PageProps = {
  searchParams: Promise<{
    batch?: string
  }>
}

type ImportBatchRow = {
  id: string
  file_name: string
  status: string
  total_rows: number
  created_count: number
  updated_count: number
  duplicate_count: number
  invalid_count: number
  failed_count: number
  created_at: string
  completed_at: string | null
}

type RolloutSummary = {
  total: number
  withOrgNumber: number
  withWebsite: number
  withEmail: number
  withPhone: number
  withCity: number
  quality80Plus: number
  quality55To79: number
  qualityBelow55: number
  readyToPublish: number
  published: number
  linkedExisting: number
  publicationFailed: number
  needsFirstScan: number
  retryableEnrichment: number
  enrichmentExhausted: number
  activeEnrichment: number
  missingCity: number
  noReachableContact: number
  ignored: number
  integrityIssues: number
}

type RolloutIssue = {
  issue_code: string
  severity: "blocker" | "review" | string
  lead_id: string
  company_name: string
  city: string | null
  data_quality_score: number
  email_scan_status: string
  email_scan_attempt_count: number
  catalog_publication_status: string
  detail: string
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

function numberValue(raw: Record<string, unknown>, key: string) {
  const parsed = Number(raw[key] ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
}

function parseSummary(value: unknown): RolloutSummary {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}

  return {
    total: numberValue(raw, "total"),
    withOrgNumber: numberValue(raw, "with_org_number"),
    withWebsite: numberValue(raw, "with_website"),
    withEmail: numberValue(raw, "with_email"),
    withPhone: numberValue(raw, "with_phone"),
    withCity: numberValue(raw, "with_city"),
    quality80Plus: numberValue(raw, "quality_80_plus"),
    quality55To79: numberValue(raw, "quality_55_79"),
    qualityBelow55: numberValue(raw, "quality_below_55"),
    readyToPublish: numberValue(raw, "ready_to_publish"),
    published: numberValue(raw, "published"),
    linkedExisting: numberValue(raw, "linked_existing"),
    publicationFailed: numberValue(raw, "publication_failed"),
    needsFirstScan: numberValue(raw, "needs_first_scan"),
    retryableEnrichment: numberValue(raw, "retryable_enrichment"),
    enrichmentExhausted: numberValue(raw, "enrichment_exhausted"),
    activeEnrichment: numberValue(raw, "active_enrichment"),
    missingCity: numberValue(raw, "missing_city"),
    noReachableContact: numberValue(raw, "no_reachable_contact"),
    ignored: numberValue(raw, "ignored"),
    integrityIssues: numberValue(raw, "integrity_issues"),
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

function Metric({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </article>
  )
}

function percentage(value: number, total: number) {
  if (total <= 0) return "0%"
  return `${Math.round((value / total) * 100)}%`
}

function issueBadge(severity: string) {
  return severity === "blocker"
    ? "border-red-200 bg-red-50 text-red-800"
    : "border-amber-200 bg-amber-50 text-amber-800"
}

function issueLabel(code: string) {
  const labels: Record<string, string> = {
    catalog_state_mismatch: "Catalog state mismatch",
    found_without_email: "Found without email",
    publication_failed: "Publication failed",
    missing_city: "Missing city",
    no_reachable_contact: "No reachable contact",
    enrichment_exhausted: "Enrichment exhausted",
    low_quality: "Low quality",
  }

  return labels[code] || code.replaceAll("_", " ")
}

export default async function MassImportRolloutPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent("/admin/leads/rollout")}`)
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()
  const requestedBatch = String(params.batch || "").trim()
  const selectedBatchId = isUuid(requestedBatch) ? requestedBatch : ""

  const [summaryResult, issuesResult, batchesResult] = await Promise.all([
    (admin as any).rpc("get_company_import_rollout_summary", {
      p_import_batch_id: selectedBatchId || null,
      p_min_quality: MIN_PUBLICATION_QUALITY,
      p_max_attempts: MAX_ENRICHMENT_ATTEMPTS,
    }),
    (admin as any).rpc("get_company_import_rollout_issues", {
      p_import_batch_id: selectedBatchId || null,
      p_min_quality: MIN_PUBLICATION_QUALITY,
      p_max_attempts: MAX_ENRICHMENT_ATTEMPTS,
      p_limit: 100,
    }),
    admin
      .from("company_import_batches")
      .select(
        "id, file_name, status, total_rows, created_count, updated_count, duplicate_count, invalid_count, failed_count, created_at, completed_at",
      )
      .order("created_at", { ascending: false })
      .limit(30),
  ])

  if (summaryResult.error) {
    console.error("Mass import rollout summary error:", summaryResult.error.message)
  }
  if (issuesResult.error) {
    console.error("Mass import rollout issues error:", issuesResult.error.message)
  }
  if (batchesResult.error) {
    console.error("Mass import rollout batches error:", batchesResult.error.message)
  }

  const summary = parseSummary(summaryResult.data)
  const issues = (issuesResult.data ?? []) as RolloutIssue[]
  const batches = (batchesResult.data ?? []) as ImportBatchRow[]
  const selectedBatch = selectedBatchId ? batches.find((batch) => batch.id === selectedBatchId) ?? null : null
  const blockerCount = issues.filter((issue) => issue.severity === "blocker").length
  const catalogCompleted = summary.published + summary.linkedExisting
  const enrichmentWaiting = summary.needsFirstScan + summary.retryableEnrichment

  const readiness =
    summary.total === 0
      ? { label: "No imported data", className: "border-slate-200 bg-slate-100 text-slate-700" }
      : summary.integrityIssues > 0 || summary.publicationFailed > 0
        ? { label: "Blocked", className: "border-red-200 bg-red-50 text-red-800" }
        : summary.missingCity > 0 || summary.noReachableContact > 0 || summary.qualityBelow55 > 0
          ? { label: "Review needed", className: "border-amber-200 bg-amber-50 text-amber-800" }
          : { label: "Rollout ready", className: "border-emerald-200 bg-emerald-50 text-emerald-800" }

  const batchQuery = selectedBatchId ? `?batch=${encodeURIComponent(selectedBatchId)}` : ""
  const enrichHref = selectedBatchId
    ? `/admin/leads/enrich?importBatch=${encodeURIComponent(selectedBatchId)}`
    : "/admin/leads/enrich"
  const publishHref = selectedBatchId
    ? `/admin/leads/publish?batch=${encodeURIComponent(selectedBatchId)}`
    : "/admin/leads/publish"
  const exportHref = selectedBatchId
    ? `/admin/leads/rollout/export?batch=${encodeURIComponent(selectedBatchId)}`
    : "/admin/leads/rollout/export"

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-violet-800">
              Mass Import 4/4
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Rollout QA & scale control
              </h1>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${readiness.className}`}>
                {readiness.label}
              </span>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Audit imported Swedish cleaning companies before large publication runs. This dashboard checks enrichment readiness, directory quality gates, publication failures and data-integrity mismatches without sending outreach email.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/leads/import" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-emerald-50 px-5 text-sm font-bold text-emerald-800 hover:bg-emerald-100">
              Import
            </Link>
            <Link href={enrichHref} prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 px-5 text-sm font-bold text-violet-800 hover:bg-violet-100">
              Enrich
            </Link>
            <Link href={publishHref} prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-blue-50 px-5 text-sm font-bold text-blue-800 hover:bg-blue-100">
              Publish
            </Link>
            <a href={exportHref} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
              Download QA issues CSV
            </a>
          </div>
        </div>

        {selectedBatchId ? (
          <section className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            <span className="font-black">Batch scope:</span>{" "}
            {selectedBatch ? `${selectedBatch.file_name} · ${selectedBatch.total_rows} rows` : selectedBatchId}
            {" · "}
            <Link href="/admin/leads/rollout" className="font-bold underline">Show all imports</Link>
          </section>
        ) : null}

        {summaryResult.error || issuesResult.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">
            Rollout QA could not be fully loaded. Check the server console and confirm the Mass Import 4 migration is applied.
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          <Metric label="Imported" value={summary.total} detail="Leads in the selected import scope." />
          <Metric label="Quality 80+" value={summary.quality80Plus} detail={`${percentage(summary.quality80Plus, summary.total)} strong records.`} />
          <Metric label="Ready to publish" value={summary.readyToPublish} detail={`Score ≥ ${MIN_PUBLICATION_QUALITY}, city present.`} />
          <Metric label="Directory done" value={catalogCompleted} detail={`${summary.published} created · ${summary.linkedExisting} linked.`} />
          <Metric label="Needs enrichment" value={enrichmentWaiting} detail={`${summary.needsFirstScan} first scan · ${summary.retryableEnrichment} retry.`} />
          <Metric label="QA blockers" value={blockerCount} detail={`${summary.integrityIssues} integrity · ${summary.publicationFailed} publish failures.`} />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Identity coverage</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Can we trust the records?</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p className="flex justify-between gap-4"><span>Organisation number</span><strong>{summary.withOrgNumber} · {percentage(summary.withOrgNumber, summary.total)}</strong></p>
              <p className="flex justify-between gap-4"><span>Website</span><strong>{summary.withWebsite} · {percentage(summary.withWebsite, summary.total)}</strong></p>
              <p className="flex justify-between gap-4"><span>Email</span><strong>{summary.withEmail} · {percentage(summary.withEmail, summary.total)}</strong></p>
              <p className="flex justify-between gap-4"><span>Phone</span><strong>{summary.withPhone} · {percentage(summary.withPhone, summary.total)}</strong></p>
              <p className="flex justify-between gap-4"><span>City</span><strong>{summary.withCity} · {percentage(summary.withCity, summary.total)}</strong></p>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-700">Enrichment</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Email discovery backlog</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p className="flex justify-between gap-4"><span>First scan</span><strong>{summary.needsFirstScan}</strong></p>
              <p className="flex justify-between gap-4"><span>Retryable</span><strong>{summary.retryableEnrichment}</strong></p>
              <p className="flex justify-between gap-4"><span>Active queue</span><strong>{summary.activeEnrichment}</strong></p>
              <p className="flex justify-between gap-4"><span>Attempts exhausted</span><strong>{summary.enrichmentExhausted}</strong></p>
              <p className="flex justify-between gap-4"><span>No reachable contact</span><strong>{summary.noReachableContact}</strong></p>
            </div>
            {enrichmentWaiting > 0 ? (
              <Link href={enrichHref} prefetch={false} className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-violet-600 px-4 text-sm font-black text-white hover:bg-violet-700">
                Open enrichment →
              </Link>
            ) : null}
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Directory publication</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">Public catalog gate</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p className="flex justify-between gap-4"><span>Ready now</span><strong>{summary.readyToPublish}</strong></p>
              <p className="flex justify-between gap-4"><span>Created profiles</span><strong>{summary.published}</strong></p>
              <p className="flex justify-between gap-4"><span>Linked existing</span><strong>{summary.linkedExisting}</strong></p>
              <p className="flex justify-between gap-4"><span>Publication failed</span><strong>{summary.publicationFailed}</strong></p>
              <p className="flex justify-between gap-4"><span>Below quality {MIN_PUBLICATION_QUALITY}</span><strong>{summary.qualityBelow55}</strong></p>
            </div>
            {summary.readyToPublish > 0 ? (
              <Link href={publishHref} prefetch={false} className="mt-5 inline-flex min-h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-black text-white hover:bg-blue-700">
                Open publication →
              </Link>
            ) : null}
          </article>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">Production rollout sequence</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Scale only after each checkpoint stays clean</h2>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">
              Outreach remains separate
            </span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              ["1", "100 companies", "Import → enrich → publish 10–50. Inspect every blocker."],
              ["2", "500 companies", "Keep enrichment chunks at 8. Confirm error and duplicate rates stay low."],
              ["3", "1,000 companies", "Publish in controlled 50–100 company runs and re-check the directory."],
              ["4", "Up to 5,000", "Use the full importer only after the previous three rollout sizes remain clean."],
            ].map(([step, title, detail]) => (
              <div key={step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-black text-slate-400">STEP {step}</p>
                <h3 className="mt-2 font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-950">QA issues</h2>
                <p className="mt-1 text-sm text-slate-500">First 100 blockers and review items in this scope.</p>
              </div>
              <a href={exportHref} className="text-sm font-black text-slate-700 hover:underline">Export all visible issue types →</a>
            </div>
          </div>

          {issues.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-black text-emerald-700">No rollout QA issues found.</p>
              <p className="mt-2 text-sm text-slate-500">This scope passed the current integrity and quality checks.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Issue</th>
                    <th className="px-5 py-3">Company</th>
                    <th className="px-5 py-3">Quality</th>
                    <th className="px-5 py-3">Scan</th>
                    <th className="px-5 py-3">Catalog</th>
                    <th className="px-5 py-3">Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {issues.map((issue) => (
                    <tr key={`${issue.issue_code}-${issue.lead_id}`} className="align-top">
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${issueBadge(issue.severity)}`}>
                          {issueLabel(issue.issue_code)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-slate-950">{issue.company_name}</p>
                        <p className="mt-1 text-xs text-slate-500">{issue.city || "No city"}</p>
                      </td>
                      <td className="px-5 py-4 font-black text-slate-700">{issue.data_quality_score}/100</td>
                      <td className="px-5 py-4 text-xs text-slate-600">
                        {issue.email_scan_status} · {issue.email_scan_attempt_count} attempts
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600">{issue.catalog_publication_status}</td>
                      <td className="max-w-md px-5 py-4 text-sm leading-6 text-slate-600">{issue.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-950">Recent import batches</h2>
            <p className="mt-1 text-sm text-slate-500">Open a batch-specific QA view before scaling the next import.</p>
          </div>

          {batches.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No import batches yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">File</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Rows</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3">Duplicates</th>
                    <th className="px-5 py-3">Invalid / failed</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="max-w-xs truncate font-bold text-slate-950">{batch.file_name}</p>
                        <p className="mt-1 text-xs text-slate-500">{formatDate(batch.created_at)}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{batch.status}</td>
                      <td className="px-5 py-4">{batch.total_rows}</td>
                      <td className="px-5 py-4 text-emerald-700">{batch.created_count}</td>
                      <td className="px-5 py-4 text-blue-700">{batch.updated_count}</td>
                      <td className="px-5 py-4">{batch.duplicate_count}</td>
                      <td className="px-5 py-4 text-amber-700">{batch.invalid_count} / {batch.failed_count}</td>
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/leads/rollout?batch=${encodeURIComponent(batch.id)}`}
                          prefetch={false}
                          className="font-black text-violet-700 hover:underline"
                        >
                          Audit →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
