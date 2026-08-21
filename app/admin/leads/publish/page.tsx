import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

import { publishCompanyLeadsAction } from "./actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Publish Imported Companies | Clean Jobs Admin",
  description: "Publish eligible imported cleaning companies into the public directory.",
}

const MIN_PUBLICATION_QUALITY = 55

type PageProps = {
  searchParams: Promise<{
    batch?: string
    success?: string
    error?: string
    processed?: string
    created?: string
    linked?: string
    failed?: string
    remaining?: string
  }>
}

type LeadPreview = {
  id: string
  company_name: string
  city: string | null
  organization_number: string | null
  website: string | null
  email: string | null
  data_quality_score: number
  catalog_publication_status: string
  catalog_company_id: string | null
}

type PublishedLead = LeadPreview & {
  catalog_published_at: string | null
  companies: { slug: string; name: string } | { slug: string; name: string }[] | null
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function count(value: string | undefined) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
}

function companyFromRelation(value: PublishedLead["companies"]) {
  return Array.isArray(value) ? value[0] ?? null : value
}

function qualityClass(score: number) {
  if (score >= 80) return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (score >= MIN_PUBLICATION_QUALITY) return "border-blue-200 bg-blue-50 text-blue-800"
  return "border-amber-200 bg-amber-50 text-amber-800"
}

function ResultMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white/80 p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{label}</p>
      <p className="mt-1 text-3xl font-black text-emerald-950">{value}</p>
    </div>
  )
}

export default async function PublishImportedCompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/leads/publish")
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  const admin = createAdminClient() as any
  const selectedBatch = String(params.batch || "").trim()

  const scope = (query: any) => {
    let scoped = query.not("import_batch_id", "is", null)
    if (selectedBatch) scoped = scoped.eq("import_batch_id", selectedBatch)
    return scoped
  }

  const eligibleBase = () =>
    scope(
      admin
        .from("company_leads")
        .select("id", { count: "exact", head: true })
        .is("catalog_company_id", null)
        .in("catalog_publication_status", ["pending", "failed"])
        .neq("status", "ignored")
        .not("city", "is", null)
        .gte("data_quality_score", MIN_PUBLICATION_QUALITY),
    )

  const [totalResult, eligibleResult, publishedResult, linkedResult, failedResult, previewResult, recentPublishedResult] =
    await Promise.all([
      scope(admin.from("company_leads").select("id", { count: "exact", head: true })),
      eligibleBase(),
      scope(
        admin
          .from("company_leads")
          .select("id", { count: "exact", head: true })
          .eq("catalog_publication_status", "published"),
      ),
      scope(
        admin
          .from("company_leads")
          .select("id", { count: "exact", head: true })
          .eq("catalog_publication_status", "linked_existing"),
      ),
      scope(
        admin
          .from("company_leads")
          .select("id", { count: "exact", head: true })
          .eq("catalog_publication_status", "failed"),
      ),
      (() => {
        let query = admin
          .from("company_leads")
          .select(
            "id, company_name, city, organization_number, website, email, data_quality_score, catalog_publication_status, catalog_company_id",
          )
          .not("import_batch_id", "is", null)
          .is("catalog_company_id", null)
          .in("catalog_publication_status", ["pending", "failed"])
          .neq("status", "ignored")
          .not("city", "is", null)
          .gte("data_quality_score", MIN_PUBLICATION_QUALITY)
          .order("data_quality_score", { ascending: false })
          .order("created_at", { ascending: true })
          .limit(30)

        if (selectedBatch) query = query.eq("import_batch_id", selectedBatch)
        return query
      })(),
      (() => {
        let query = admin
          .from("company_leads")
          .select(
            "id, company_name, city, organization_number, website, email, data_quality_score, catalog_publication_status, catalog_company_id, catalog_published_at, companies:catalog_company_id(slug,name)",
          )
          .not("catalog_company_id", "is", null)
          .in("catalog_publication_status", ["published", "linked_existing"])
          .order("catalog_published_at", { ascending: false })
          .limit(15)

        if (selectedBatch) query = query.eq("import_batch_id", selectedBatch)
        return query
      })(),
    ])

  for (const [label, result] of [
    ["total", totalResult],
    ["eligible", eligibleResult],
    ["published", publishedResult],
    ["linked", linkedResult],
    ["failed", failedResult],
    ["preview", previewResult],
    ["recent published", recentPublishedResult],
  ] as const) {
    if (result.error) console.error(`Catalog publication ${label} query error:`, result.error.message)
  }

  const total = totalResult.count ?? 0
  const eligible = eligibleResult.count ?? 0
  const published = publishedResult.count ?? 0
  const linked = linkedResult.count ?? 0
  const failed = failedResult.count ?? 0
  const blocked = Math.max(0, total - published - linked - eligible - failed)
  const preview = (previewResult.data ?? []) as LeadPreview[]
  const recentPublished = (recentPublishedResult.data ?? []) as PublishedLead[]
  const completed = params.success === "publication-completed"

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-blue-800">
              Mass Import 2/4
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Publish companies to the directory
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
              Convert high-quality imported outreach records into unclaimed public company profiles. Existing public companies are linked instead of duplicated.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/admin/leads/import" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-100">
              Import companies
            </Link>
            <Link href="/companies" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-bold text-white hover:bg-slate-800">
              Open public directory
            </Link>
          </div>
        </div>

        {selectedBatch ? (
          <div className="mt-6 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-900">
            Publishing only import batch <code className="font-bold">{selectedBatch}</code>. <Link href="/admin/leads/publish" className="font-bold underline">Show all imported batches</Link>.
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-800">{params.error}</div>
        ) : null}

        {completed ? (
          <section className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-7">
            <h2 className="text-xl font-black text-emerald-950">Publication completed</h2>
            <p className="mt-1 text-sm text-emerald-800">No outreach emails were sent. Newly created profiles remain unclaimed and unverified.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <ResultMetric label="Processed" value={count(params.processed)} />
              <ResultMetric label="Created" value={count(params.created)} />
              <ResultMetric label="Linked" value={count(params.linked)} />
              <ResultMetric label="Failed" value={count(params.failed)} />
              <ResultMetric label="Remaining" value={count(params.remaining)} />
            </div>
          </section>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ResultMetric label="Imported" value={total} />
          <ResultMetric label="Ready" value={eligible} />
          <ResultMetric label="Created" value={published} />
          <ResultMetric label="Linked" value={linked} />
          <ResultMetric label="Blocked / low quality" value={blocked} />
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Safe publication gate</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                A lead must come from Mass Import, have a city and score at least {MIN_PUBLICATION_QUALITY}/100. Matching uses organisation number first, then domain, email, phone/name and company name + city.
              </p>
              <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                Publication never marks a company as verified and never assigns an owner. The normal Claim Company flow remains the only path to ownership.
              </div>
            </div>

            <form action={publishCompanyLeadsAction} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <input type="hidden" name="batchId" value={selectedBatch} />
              <label htmlFor="batchSize" className="block text-sm font-black text-slate-950">Companies per run</label>
              <select id="batchSize" name="batchSize" defaultValue="50" className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900">
                <option value="10">10 companies</option>
                <option value="50">50 companies</option>
                <option value="100">100 companies</option>
                <option value="250">250 companies</option>
              </select>
              <button type="submit" disabled={eligible === 0} className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                Publish eligible companies
              </button>
              <p className="mt-3 text-xs leading-5 text-slate-500">Run small batches first. Re-running is safe because already linked records are excluded.</p>
            </form>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <h2 className="text-xl font-black text-slate-950">Ready to publish</h2>
            <p className="mt-1 text-sm text-slate-500">Highest-quality eligible records are shown first.</p>
          </div>

          {preview.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-500">No eligible imported companies are waiting for publication.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr><th className="px-5 py-3">Company</th><th className="px-5 py-3">City</th><th className="px-5 py-3">Identity</th><th className="px-5 py-3">Quality</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {preview.map((lead) => (
                    <tr key={lead.id}>
                      <td className="px-5 py-4"><p className="font-bold text-slate-950">{lead.company_name}</p>{lead.website ? <p className="mt-1 max-w-xs truncate text-xs text-slate-500">{lead.website}</p> : null}</td>
                      <td className="px-5 py-4 text-slate-700">{lead.city || "—"}</td>
                      <td className="px-5 py-4 text-xs text-slate-600">{lead.organization_number || lead.email || "Contact data"}</td>
                      <td className="px-5 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${qualityClass(lead.data_quality_score)}`}>{lead.data_quality_score}/100</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {recentPublished.length > 0 ? (
          <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
              <h2 className="text-xl font-black text-slate-950">Recently published / linked</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {recentPublished.map((lead) => {
                const company = companyFromRelation(lead.companies)
                return (
                  <div key={lead.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div><p className="font-bold text-slate-950">{lead.company_name}</p><p className="text-xs text-slate-500">{lead.city || "Sweden"} · {lead.catalog_publication_status}</p></div>
                    {company ? <Link href={`/companies/${company.slug}`} prefetch={false} className="text-sm font-bold text-blue-700 hover:underline">View {company.name} →</Link> : null}
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}
