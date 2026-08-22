import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { importCompanyLeadsAction } from "@/app/admin/leads/import/actions"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Mass Import Companies | Clean Jobs Admin",
  description: "Import and normalize Swedish cleaning company leads.",
}

type PageProps = {
  searchParams: Promise<{
    success?: string
    error?: string
    batch?: string
    total?: string
    created?: string
    updated?: string
    duplicates?: string
    invalid?: string
    failed?: string
  }>
}

type BatchRow = {
  id: string
  file_name: string
  file_type: string
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

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function parseCount(value: string | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </div>
  )
}

export default async function ImportCompanyLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/leads/import")
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()
  const { data: batchData, error: batchesError } = await admin
    .from("company_import_batches")
    .select(
      "id, file_name, file_type, status, total_rows, created_count, updated_count, duplicate_count, invalid_count, failed_count, created_at, completed_at",
    )
    .order("created_at", { ascending: false })
    .limit(12)

  if (batchesError) {
    console.error("Company import batches query error:", batchesError.message)
  }

  const batches = (batchData ?? []) as BatchRow[]
  const completed = params.success === "import-completed"
  const total = parseCount(params.total)
  const created = parseCount(params.created)
  const updated = parseCount(params.updated)
  const duplicates = parseCount(params.duplicates)
  const invalid = parseCount(params.invalid)
  const failed = parseCount(params.failed)

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              Mass Import 1/4
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Import Swedish cleaning companies
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Load XLSX or CSV data into the outreach staging database. Clean Jobs normalizes Swedish organisation numbers, domains, emails, phones and company names before matching existing records.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/leads" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-100">
              Back to leads
            </Link>
            <Link href="/admin/leads/publish" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-blue-50 px-5 text-sm font-bold text-blue-800 hover:bg-blue-100">
              Publish directory
            </Link>
            <Link href="/admin/leads/rollout" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-violet-300 bg-violet-50 px-5 text-sm font-bold text-violet-800 hover:bg-violet-100">
              Rollout QA
            </Link>
            <a href="/templates/company-leads-import-template.csv" download className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
              Download CSV template
            </a>
          </div>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold leading-6 text-red-800">
            {params.error}
          </div>
        ) : null}

        {completed ? (
          <section className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-black text-emerald-950">Import completed</h2>
                <p className="mt-1 text-sm text-emerald-800">
                  Batch {params.batch || "—"}. No emails were sent and no public company profiles were created.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={params.batch ? `/admin/leads/publish?batch=${encodeURIComponent(params.batch)}` : "/admin/leads/publish"}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
                >
                  Publish this batch →
                </Link>
                <Link
                  href={
                    params.batch
                      ? `/admin/leads/enrich?importBatch=${encodeURIComponent(params.batch)}`
                      : "/admin/leads/enrich"
                  }
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
                >
                  Enrich this batch →
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <Metric label="Rows" value={total} detail="Rows received by the database." />
              <Metric label="Created" value={created} detail="New outreach company records." />
              <Metric label="Updated" value={updated} detail="Existing records filled with missing data." />
              <Metric label="Duplicates" value={duplicates} detail="Existing records already complete." />
              <Metric label="Invalid" value={invalid} detail="Rows without enough identity data." />
              <Metric label="Failed" value={failed} detail="Rows that hit a database error." />
            </div>
          </section>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Staging import</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">Upload XLSX or CSV</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Up to 5,000 companies per batch and 3 MB per file. Duplicate matching uses organisation number first, then website domain, email, phone/name and company name + city.
            </p>

            <form action={importCompanyLeadsAction} className="mt-7 space-y-6">
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6">
                <label htmlFor="file" className="block text-sm font-bold text-slate-900">Import file</label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".xlsx,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                  required
                  className="mt-3 block w-full cursor-pointer text-sm text-slate-700 file:mr-4 file:cursor-pointer file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-white hover:file:bg-slate-800"
                />
                <p className="mt-3 text-xs leading-5 text-slate-500">Supported: .xlsx and .csv · Maximum 3 MB · Maximum 5,000 data rows.</p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm leading-6 text-blue-900">
                <p className="font-black">Important separation</p>
                <p className="mt-1">
                  This step imports only into <code>company_leads</code>, the admin outreach CRM. After review, use <Link href="/admin/leads/publish" className="font-bold underline">Mass Import 2/4</Link> to publish eligible records into the public <code>companies</code> directory.
                </p>
              </div>

              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-emerald-600 px-6 text-sm font-black text-white transition hover:bg-emerald-700 active:scale-[0.98] sm:w-auto">
                Normalize and import companies
              </button>
            </form>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-black text-slate-950">Recommended columns</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-700">
              <p><strong>Required:</strong> company_name / Företagsnamn</p>
              <p><strong>Strong identity:</strong> organization_number / Organisationsnummer</p>
              <p><strong>Location:</strong> city, address, postal_code</p>
              <p><strong>Contact:</strong> website, email, phone</p>
              <p><strong>Optional:</strong> source, notes</p>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-xs leading-6 text-slate-600">
              A valid row needs a company name plus at least one useful identity signal: organisation number, website, email or phone. The importer never sends outreach automatically.
            </div>
          </aside>
        </div>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-950">Recent import batches</h2>
            <p className="mt-1 text-sm text-slate-500">The latest 12 staging imports and their deduplication results.</p>
          </div>

          {batchesError ? (
            <div className="p-6 text-sm font-semibold text-amber-800">Import history could not be loaded.</div>
          ) : batches.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No mass-import batches yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">File</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Rows</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3">Updated</th>
                    <th className="px-5 py-3">Dup.</th>
                    <th className="px-5 py-3">Invalid</th>
                    <th className="px-5 py-3">Failed</th>
                    <th className="px-5 py-3">Started</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="align-top">
                      <td className="px-5 py-4">
                        <p className="max-w-xs truncate font-bold text-slate-950">{batch.file_name}</p>
                        <p className="mt-1 text-xs uppercase text-slate-400">{batch.file_type}</p>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">{batch.status}</td>
                      <td className="px-5 py-4">{batch.total_rows}</td>
                      <td className="px-5 py-4 text-emerald-700">{batch.created_count}</td>
                      <td className="px-5 py-4 text-blue-700">{batch.updated_count}</td>
                      <td className="px-5 py-4">{batch.duplicate_count}</td>
                      <td className="px-5 py-4 text-amber-700">{batch.invalid_count}</td>
                      <td className="px-5 py-4 text-red-700">{batch.failed_count}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(batch.created_at)}
                        {batch.completed_at ? <div className="mt-1 text-xs">Done {formatDate(batch.completed_at)}</div> : null}
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
