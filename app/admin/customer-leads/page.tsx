import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Customer Leads | Clean Jobs Admin",
  description: "Review all customer quote leads across Clean Jobs.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}

type Lead = {
  id: string
  company_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_type: string | null
  city: string | null
  status: string
  priority: string
  source: string
  lead_type: string
  estimated_value: number | string | null
  quoted_value: number | string | null
  lead_access: string
  is_paid: boolean
  created_at: string
  companies:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
}

const statuses = ["new", "viewed", "contacted", "qualified", "quoted", "won", "lost", "archived"]
const PAGE_SIZE = 100

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function getCompany(lead: Lead) {
  if (!lead.companies) return null
  return Array.isArray(lead.companies) ? lead.companies[0] ?? null : lead.companies
}

function safeSearch(value: string) {
  return value.replace(/[%,()_]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100)
}

function normalizePage(value: string | undefined) {
  const parsed = Number(value || 1)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100000) : 1
}

function buildHref({ status, search, page }: { status: string; search: string; page?: number }) {
  const params = new URLSearchParams()
  if (status) params.set("status", status)
  if (search) params.set("search", search)
  if (page && page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `/admin/customer-leads?${query}` : "/admin/customer-leads"
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export default async function AdminCustomerLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) redirect("/login?next=/admin/customer-leads")
  if (!getAdminEmails().includes(user.email.toLowerCase())) redirect("/dashboard")

  const admin = createAdminClient()
  const selectedStatus = statuses.includes(params.status || "") ? params.status! : ""
  const search = safeSearch(params.search || "")
  const currentPage = normalizePage(params.page)

  let query = admin
    .from("company_quote_requests")
    .select(`
      id, company_id, customer_name, customer_email, customer_phone, service_type,
      city, status, priority, source, lead_type, estimated_value, quoted_value,
      lead_access, is_paid, created_at,
      companies ( id, name, slug )
    `, { count: "exact" })
    .order("created_at", { ascending: false })

  if (selectedStatus) query = query.eq("status", selectedStatus)
  if (search) {
    query = query.or([
      `customer_name.ilike.%${search}%`,
      `customer_email.ilike.%${search}%`,
      `customer_phone.ilike.%${search}%`,
      `service_type.ilike.%${search}%`,
      `city.ilike.%${search}%`,
    ].join(","))
  }

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const [pageResult, totalCountResult, ...statusCountResults] = await Promise.all([
    query.range(from, to),
    admin.from("company_quote_requests").select("id", { count: "exact", head: true }),
    ...statuses.map((status) =>
      admin
        .from("company_quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", status),
    ),
  ])

  if (pageResult.error) console.error("Admin customer leads query error:", pageResult.error)
  if (totalCountResult.error) console.error("Admin customer leads total count error:", totalCountResult.error)

  const leads = (pageResult.data ?? []) as Lead[]
  const totalFiltered = pageResult.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  if (totalFiltered > 0 && currentPage > totalPages) {
    redirect(buildHref({ status: selectedStatus, search, page: totalPages }))
  }

  const counts = new Map<string, number>()
  statuses.forEach((status, index) => {
    const result = statusCountResults[index]
    if (result?.error) console.error(`Admin customer leads ${status} count error:`, result.error)
    counts.set(status, result?.count ?? 0)
  })
  const totalCount = totalCountResult.count ?? 0

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/admin" className="text-sm font-bold text-slate-500 hover:text-rose-600">← Admin</Link>
            <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-rose-600">Lead Generation 2.0</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">Customer leads</h1>
            <p className="mt-3 text-slate-600">All customer quote requests across every company on Clean Jobs.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">Total</p><p className="mt-1 text-3xl font-black text-slate-950">{totalCount}</p></div>
        </div>

        <form method="get" className="mt-7 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row">
          <input name="search" defaultValue={search} placeholder="Customer, email, phone, service or city" className="min-h-11 flex-1 rounded-xl border border-slate-300 px-4 text-sm" />
          <select name="status" defaultValue={selectedStatus} className="min-h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm"><option value="">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status} ({counts.get(status) || 0})</option>)}</select>
          <button className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-black text-white">Filter</button>
          <Link href="/admin/customer-leads" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-5 text-sm font-black text-slate-700">Reset</Link>
        </form>

        <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing {totalFiltered === 0 ? 0 : from + 1}–{Math.min(to + 1, totalFiltered)} of {totalFiltered} matching leads</p>
          {totalPages > 1 ? <p>Page {currentPage} of {totalPages}</p> : null}
        </div>

        <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {leads.length === 0 ? <div className="p-10 text-center text-slate-500">No customer leads found.</div> : <div className="divide-y divide-slate-200">{leads.map((lead) => {
            const company = getCompany(lead)
            const value = Number(lead.quoted_value || lead.estimated_value || 0)
            return <article key={lead.id} className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_170px_160px_140px] lg:items-center">
              <div><div className="flex flex-wrap items-center gap-2"><h2 className="font-black text-slate-950">{lead.customer_name}</h2><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">{lead.status}</span><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{lead.priority}</span></div><p className="mt-2 text-sm text-slate-500">{company?.name || "Unknown company"} · {lead.service_type || "—"} · {lead.city || "—"}</p><p className="mt-1 text-xs text-slate-400">{lead.customer_email} · {formatDate(lead.created_at)}</p></div>
              <div><p className="text-xs font-bold uppercase text-slate-400">Source</p><p className="mt-1 text-sm font-bold">{lead.source}</p></div>
              <div><p className="text-xs font-bold uppercase text-slate-400">Commercial</p><p className="mt-1 text-sm font-bold">{lead.lead_access}{lead.is_paid ? " · paid" : ""}</p></div>
              <div className="text-right font-black text-slate-950">{value > 0 ? `${Math.round(value).toLocaleString("sv-SE")} SEK` : "—"}</div>
            </article>
          })}</div>}
        </div>

        {totalPages > 1 ? (
          <nav className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            {currentPage > 1 ? (
              <Link
                href={buildHref({ status: selectedStatus, search, page: currentPage - 1 })}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                ← Previous
              </Link>
            ) : <span />}
            <span className="text-sm font-black text-slate-500">{currentPage} / {totalPages}</span>
            {currentPage < totalPages ? (
              <Link
                href={buildHref({ status: selectedStatus, search, page: currentPage + 1 })}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Next →
              </Link>
            ) : <span />}
          </nav>
        ) : null}
      </div>
    </main>
  )
}
