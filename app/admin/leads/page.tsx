import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import BulkLeadsList, {
  type BulkCompanyLead,
} from "@/app/admin/leads/bulk-leads-list"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Company Leads | Clean Jobs Admin",
  description: "Manage cleaning company outreach leads.",
}

type LeadStatus =
  | "new"
  | "invited"
  | "opened"
  | "registered"
  | "ignored"

type CompanyLeadRow = {
  id: string
  company_name: string
  city: string | null
  website: string | null
  email: string | null
  phone: string | null
  source: string | null
  notes: string | null
  status: LeadStatus
  invited_at: string | null
  last_invited_at: string | null
  invite_count: number
  registered: boolean
  created_at: string
  updated_at: string
}

type LeadsPageProps = {
  searchParams: Promise<{
    status?: string
    search?: string
    success?: string
    error?: string
    sent?: string
    skipped?: string
    failed?: string
    page?: string
  }>
}

const allowedStatuses: LeadStatus[] = [
  "new",
  "invited",
  "opened",
  "registered",
  "ignored",
]

const PAGE_SIZE = 100

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function normalizeStatus(
  value: string | undefined,
): LeadStatus | "all" {
  if (!value) {
    return "all"
  }

  if (allowedStatuses.includes(value as LeadStatus)) {
    return value as LeadStatus
  }

  return "all"
}

function normalizeCount(value: string | undefined) {
  const parsedValue = Number(value || 0)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0
  }

  return Math.floor(parsedValue)
}

function normalizePage(value: string | undefined) {
  const parsed = Number(value || 1)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100000) : 1
}

function buildFilterHref({
  status,
  search,
  page,
}: {
  status?: LeadStatus | "all"
  search?: string
  page?: number
}) {
  const params = new URLSearchParams()

  if (status && status !== "all") {
    params.set("status", status)
  }

  if (search?.trim()) {
    params.set("search", search.trim())
  }

  if (page && page > 1) {
    params.set("page", String(page))
  }

  const query = params.toString()

  return query ? `/admin/leads?${query}` : "/admin/leads"
}

export default async function AdminLeadsPage({
  searchParams,
}: LeadsPageProps) {
  const params = await searchParams

  const success = params.success
  const pageError = params.error
  const sentCount = normalizeCount(params.sent)
  const skippedCount = normalizeCount(params.skipped)
  const failedCount = normalizeCount(params.failed)
  const selectedStatus = normalizeStatus(params.status)
  const search = String(params.search || "").trim().slice(0, 100)
  const currentPage = normalizePage(params.page)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin/leads")
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  const admin = createAdminClient()

  let query = admin
    .from("company_leads")
    .select(
      `
        id,
        company_name,
        city,
        website,
        email,
        phone,
        source,
        notes,
        status,
        invited_at,
        last_invited_at,
        invite_count,
        registered,
        created_at,
        updated_at
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })

  if (selectedStatus !== "all") {
    query = query.eq("status", selectedStatus)
  }

  if (search) {
    const safeSearch = search
      .replace(/[%,()_]/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    if (safeSearch) {
      query = query.or(
        [
          `company_name.ilike.%${safeSearch}%`,
          `city.ilike.%${safeSearch}%`,
          `email.ilike.%${safeSearch}%`,
          `website.ilike.%${safeSearch}%`,
        ].join(","),
      )
    }
  }

  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const [pageResult, totalCountResult, newCountResult, invitedCountResult, registeredCountResult] =
    await Promise.all([
      query.range(from, to),
      admin.from("company_leads").select("id", { count: "exact", head: true }),
      admin.from("company_leads").select("id", { count: "exact", head: true }).eq("status", "new"),
      admin.from("company_leads").select("id", { count: "exact", head: true }).eq("status", "invited"),
      admin
        .from("company_leads")
        .select("id", { count: "exact", head: true })
        .or("status.eq.registered,registered.eq.true"),
    ])

  const { data, error, count: filteredCount } = pageResult

  if (error) {
    console.error("Admin leads query error:", error.message)
  }

  for (const [label, result] of [
    ["total", totalCountResult],
    ["new", newCountResult],
    ["invited", invitedCountResult],
    ["registered", registeredCountResult],
  ] as const) {
    if (result.error) console.error(`Admin leads ${label} count error:`, result.error.message)
  }

  const leads = (data ?? []) as CompanyLeadRow[]
  const totalFiltered = filteredCount ?? 0
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE))

  if (totalFiltered > 0 && currentPage > totalPages) {
    redirect(buildFilterHref({ status: selectedStatus, search, page: totalPages }))
  }

  const stats = {
    total: totalCountResult.count ?? 0,
    new: newCountResult.count ?? 0,
    invited: invitedCountResult.count ?? 0,
    registered: registeredCountResult.count ?? 0,
  }

  const filters: Array<{
    value: LeadStatus | "all"
    label: string
  }> = [
    {
      value: "all",
      label: "All",
    },
    {
      value: "new",
      label: "New",
    },
    {
      value: "invited",
      label: "Invited",
    },
    {
      value: "opened",
      label: "Opened",
    },
    {
      value: "registered",
      label: "Registered",
    },
    {
      value: "ignored",
      label: "Ignored",
    },
  ]

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              Admin outreach
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Company leads
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Manage cleaning companies, outreach status and
              registrations.
            </p>
          </div>
            </div>
          <div className="flex flex-wrap gap-3">
  <Link
    href="/admin"
    prefetch={false}
    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-[0.97]"
  >
    Back to admin
  </Link>

  <Link
    href="/admin/leads/enrich"
    prefetch={false}
    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-blue-300 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 active:scale-[0.97]"
  >
    Email scanner
  </Link>

  <Link
    href="/admin/leads/import"
    prefetch={false}
    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.97]"
  >
    Import Excel
  </Link>

  <Link
    href="/admin/leads/new"
    prefetch={false}
    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
  >
    Add company
  </Link>
</div>

        {success === "company-added" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            Company added successfully.
          </div>
        ) : null}

        {success === "company-updated" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            Company updated successfully.
          </div>
        ) : null}

        {success === "company-deleted" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            Company deleted successfully.
          </div>
        ) : null}

        {success === "invite-sent" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            Invitation email sent successfully.
          </div>
        ) : null}

        {success === "bulk-invites-sent" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="font-semibold">
              Bulk invitation completed.
            </div>

            <div className="mt-1">
              Sent: {sentCount} · Skipped: {skippedCount} ·
              Failed: {failedCount}
            </div>
          </div>
        ) : null}

        {pageError ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {pageError}
          </div>
        ) : null}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">
              Total leads
            </div>

            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {stats.total}
            </div>
          </div>

          <div className="rounded-[28px] border border-sky-200 bg-sky-50 p-5 shadow-sm">
            <div className="text-sm text-sky-700">
              New leads
            </div>

            <div className="mt-2 text-3xl font-semibold text-sky-700">
              {stats.new}
            </div>
          </div>

          <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="text-sm text-amber-700">
              Invited
            </div>

            <div className="mt-2 text-3xl font-semibold text-amber-700">
              {stats.invited}
            </div>
          </div>

          <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-sm text-emerald-700">
              Registered
            </div>

            <div className="mt-2 text-3xl font-semibold text-emerald-700">
              {stats.registered}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <form
            action="/admin/leads"
            method="get"
            className="flex flex-col gap-3 md:flex-row"
          >
            {selectedStatus !== "all" ? (
              <input
                type="hidden"
                name="status"
                value={selectedStatus}
              />
            ) : null}

            <label className="min-w-0 flex-1">
              <span className="sr-only">
                Search companies
              </span>

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search company, city, email or website"
                className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Search
            </button>

            {search ? (
              <Link
                href={buildFilterHref({
                  status: selectedStatus,
                })}
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Clear
              </Link>
            ) : null}
          </form>

          <div className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const isActive =
                selectedStatus === filter.value

              return (
                <Link
                  key={filter.value}
                  href={buildFilterHref({
                    status: filter.value,
                    search,
                  })}
                  prefetch={false}
                  className={
                    isActive
                      ? "inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white"
                      : "inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                  }
                >
                  {filter.label}
                </Link>
              )
            })}
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Could not load company leads. Check the server
            console for details.
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {totalFiltered === 0 ? 0 : from + 1}–{Math.min(to + 1, totalFiltered)} of {totalFiltered} matching leads
          </p>
          {totalPages > 1 ? <p>Page {currentPage} of {totalPages}</p> : null}
        </div>

        <BulkLeadsList
          leads={leads as BulkCompanyLead[]}
        />

        {totalPages > 1 ? (
          <nav className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            {currentPage > 1 ? (
              <Link
                href={buildFilterHref({ status: selectedStatus, search, page: currentPage - 1 })}
                prefetch={false}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Previous
              </Link>
            ) : <span />}
            <span className="text-sm font-semibold text-slate-500">{currentPage} / {totalPages}</span>
            {currentPage < totalPages ? (
              <Link
                href={buildFilterHref({ status: selectedStatus, search, page: currentPage + 1 })}
                prefetch={false}
                className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
