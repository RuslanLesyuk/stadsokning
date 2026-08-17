
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import CompanyWorkspaceNav from "@/components/company-dashboard/company-workspace-nav"
import { crmCopy } from "@/lib/crm/copy"
import {
  CRM_CUSTOMER_STAGES,
  type CompanyCrmCustomer,
  type CrmCustomerStage,
} from "@/lib/crm/types"
import {
  formatCrmMoney,
  normalizeCrmCustomerStage,
  numberValue,
} from "@/lib/crm/utils"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{
    company?: string
    search?: string
    stage?: string
    follow_up?: string
    tag?: string
    sort?: string
  }>
}

type OwnedCompany = {
  id: string
  name: string
  slug: string
}

type LeadRow = {
  crm_customer_id: string | null
  status: string
}

type BookingRow = {
  id: string
  crm_customer_id: string | null
  status: string
}

type OccurrenceRow = {
  booking_id: string
  price: number | string | null
}

type CustomerMetrics = {
  leadCount: number
  bookingCount: number
  completedBookings: number
  revenue: number
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>

async function loadAllCompanyCustomerStats(
  supabase: ServerSupabaseClient,
  companyId: string,
) {
  const rows: Array<{
    id: string
    lifecycle_stage: string
    follow_up_at: string | null
    tags: string[]
  }> = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("company_crm_customers")
      .select("id, lifecycle_stage, follow_up_at, tags")
      .eq("company_id", companyId)
      .range(from, from + pageSize - 1)

    if (error) {
      console.error("Load CRM customer stats error:", error)
      break
    }

    const chunk = (data ?? []) as Array<{
      id: string
      lifecycle_stage: string
      follow_up_at: string | null
      tags: string[]
    }>

    rows.push(...chunk)

    if (chunk.length < pageSize) break
    from += pageSize
  }

  return rows
}

async function loadCompanyCompletedRevenue(
  supabase: ServerSupabaseClient,
  companyId: string,
) {
  const rows: Array<{ price: number | string | null }> = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("company_booking_occurrences")
      .select("price")
      .eq("company_id", companyId)
      .eq("status", "completed")
      .range(from, from + pageSize - 1)

    if (error) {
      console.error("Load CRM company completed revenue error:", error)
      break
    }

    const chunk = (data ?? []) as Array<{ price: number | string | null }>
    rows.push(...chunk)

    if (chunk.length < pageSize) break
    from += pageSize
  }

  return rows
}

function safeSearch(value: string) {
  return value
    .replace(/[%,()_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
}

function safeTag(value: string) {
  return value
    .replace(/[{},"\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40)
}

function formatDateTime(value: string | null, locale: Locale) {
  if (!value) return "—"

  const map: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"

  return new Intl.DateTimeFormat(map[locale], {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function stageStyle(stage: CrmCustomerStage) {
  const map: Record<CrmCustomerStage, string> = {
    prospect: "border-blue-200 bg-blue-50 text-blue-800",
    customer: "border-emerald-200 bg-emerald-50 text-emerald-800",
    vip: "border-amber-200 bg-amber-50 text-amber-800",
    inactive: "border-slate-200 bg-slate-100 text-slate-600",
  }

  return map[stage]
}

function Stat({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  )
}

export default async function CompanyCustomersPage({
  searchParams,
}: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  ) as Locale
  const t = crmCopy[locale] || crmCopy.en

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company-customers")
  }

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("name", { ascending: true })

  if (companyError) {
    console.error("Load CRM companies error:", companyError)
  }

  const companies = (companyData ?? []) as OwnedCompany[]

  if (companies.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-4xl font-black text-slate-950">{t.title}</h1>
          <p className="mt-4 text-slate-600">{t.noCustomersText}</p>
        </div>
      </main>
    )
  }

  const companyIds = companies.map((company) => company.id)
  const selectedCompany = companyIds.includes(query.company || "")
    ? String(query.company)
    : companies[0].id

  const search = safeSearch(query.search || "")
  const selectedStage = CRM_CUSTOMER_STAGES.includes(
    query.stage as CrmCustomerStage,
  )
    ? (query.stage as CrmCustomerStage)
    : ""

  const followUpFilter = ["due", "upcoming"].includes(query.follow_up || "")
    ? query.follow_up!
    : ""

  const selectedTag = safeTag(query.tag || "")
  const sort = ["recent", "name", "value", "follow_up"].includes(
    query.sort || "",
  )
    ? query.sort!
    : "recent"

  let customerQuery = supabase
    .from("company_crm_customers")
    .select(`
      id, company_id, user_id, customer_name, email, normalized_email,
      phone, city, lifecycle_stage, tags, owner_notes, follow_up_at,
      first_seen_at, last_seen_at, last_activity_at, created_at, updated_at
    `)
    .eq("company_id", selectedCompany)

  if (search) {
    customerQuery = customerQuery.or(
      [
        `customer_name.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `city.ilike.%${search}%`,
      ].join(","),
    )
  }

  if (selectedStage) {
    customerQuery = customerQuery.eq("lifecycle_stage", selectedStage)
  }

  if (selectedTag) {
    customerQuery = customerQuery.contains("tags", [selectedTag])
  }

  const nowIso = new Date().toISOString()

  if (followUpFilter === "due") {
    customerQuery = customerQuery
      .not("follow_up_at", "is", null)
      .lte("follow_up_at", nowIso)
  } else if (followUpFilter === "upcoming") {
    customerQuery = customerQuery.gt("follow_up_at", nowIso)
  }

  if (sort === "name") {
    customerQuery = customerQuery.order("customer_name", { ascending: true })
  } else if (sort === "follow_up") {
    customerQuery = customerQuery
      .order("follow_up_at", { ascending: true, nullsFirst: false })
      .order("last_activity_at", { ascending: false })
  } else {
    customerQuery = customerQuery.order("last_activity_at", {
      ascending: false,
    })
  }

  const [
    { data: customerData, error: customerError },
    allCustomers,
    companyRevenueData,
  ] = await Promise.all([
    customerQuery.limit(500),
    loadAllCompanyCustomerStats(supabase, selectedCompany),
    loadCompanyCompletedRevenue(supabase, selectedCompany),
  ])

  if (customerError) {
    console.error("Load CRM customers error:", customerError)
  }

  const customers = (customerData ?? []) as CompanyCrmCustomer[]

  const customerIds = customers.map((customer) => customer.id)

  const metricsByCustomer = new Map<string, CustomerMetrics>()

  for (const customer of customers) {
    metricsByCustomer.set(customer.id, {
      leadCount: 0,
      bookingCount: 0,
      completedBookings: 0,
      revenue: 0,
    })
  }

  let bookings: BookingRow[] = []

  if (customerIds.length > 0) {
    const [{ data: leadsData, error: leadsError }, bookingResult] =
      await Promise.all([
        supabase
          .from("company_quote_requests")
          .select("crm_customer_id, status")
          .eq("company_id", selectedCompany)
          .in("crm_customer_id", customerIds),
        supabase
          .from("company_bookings")
          .select("id, crm_customer_id, status")
          .eq("company_id", selectedCompany)
          .in("crm_customer_id", customerIds),
      ])

    if (leadsError) {
      console.error("Load CRM customer lead metrics error:", leadsError)
    }

    if (bookingResult.error) {
      console.error(
        "Load CRM customer booking metrics error:",
        bookingResult.error,
      )
    }

    const leads = (leadsData ?? []) as LeadRow[]
    bookings = (bookingResult.data ?? []) as BookingRow[]

    for (const lead of leads) {
      if (!lead.crm_customer_id) continue
      const metric = metricsByCustomer.get(lead.crm_customer_id)
      if (metric) metric.leadCount += 1
    }

    for (const booking of bookings) {
      if (!booking.crm_customer_id) continue
      const metric = metricsByCustomer.get(booking.crm_customer_id)
      if (!metric) continue

      metric.bookingCount += 1
      if (booking.status === "completed") {
        metric.completedBookings += 1
      }
    }

    const bookingIds = bookings.map((booking) => booking.id)

    if (bookingIds.length > 0) {
      const { data: occurrenceData, error: occurrenceError } = await supabase
        .from("company_booking_occurrences")
        .select("booking_id, price")
        .in("booking_id", bookingIds)
        .eq("status", "completed")

      if (occurrenceError) {
        console.error("Load CRM completed revenue error:", occurrenceError)
      }

      const bookingToCustomer = new Map(
        bookings
          .filter((booking) => booking.crm_customer_id)
          .map((booking) => [booking.id, booking.crm_customer_id as string]),
      )

      for (const row of (occurrenceData ?? []) as OccurrenceRow[]) {
        const customerId = bookingToCustomer.get(row.booking_id)
        if (!customerId) continue
        const metric = metricsByCustomer.get(customerId)
        if (metric) metric.revenue += numberValue(row.price)
      }
    }
  }

  const decorated = customers.map((customer) => ({
    customer,
    metric: metricsByCustomer.get(customer.id) || {
      leadCount: 0,
      bookingCount: 0,
      completedBookings: 0,
      revenue: 0,
    },
  }))

  if (sort === "value") {
    decorated.sort((a, b) => b.metric.revenue - a.metric.revenue)
  }

  const total = allCustomers.length
  const prospects = allCustomers.filter(
    (item) => normalizeCrmCustomerStage(item.lifecycle_stage) === "prospect",
  ).length
  const activeCustomers = allCustomers.filter((item) =>
    ["customer", "vip"].includes(normalizeCrmCustomerStage(item.lifecycle_stage)),
  ).length
  const vipCustomers = allCustomers.filter(
    (item) => normalizeCrmCustomerStage(item.lifecycle_stage) === "vip",
  ).length
  const followUpsDue = allCustomers.filter((item) => {
    if (normalizeCrmCustomerStage(item.lifecycle_stage) === "inactive") {
      return false
    }
    if (!item.follow_up_at) return false
    return new Date(item.follow_up_at).getTime() <= Date.now()
  }).length

  const uniqueTags = Array.from(
    new Set(
      allCustomers.flatMap((customer) =>
        Array.isArray(customer.tags) ? customer.tags : [],
      ),
    ),
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, locale))

  const lifetimeRevenue = (companyRevenueData ?? []).reduce(
    (sum, row) => sum + numberValue(row.price),
    0,
  )

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {t.title}
          </h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            {t.subtitle}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <Stat label={t.total} value={String(total)} />
            <Stat label={t.prospects} value={String(prospects)} />
            <Stat label={t.activeCustomers} value={String(activeCustomers)} />
            <Stat label={t.vipCustomers} value={String(vipCustomers)} />
            <Stat label={t.followUpsDue} value={String(followUpsDue)} />
            <Stat
              label={t.lifetimeRevenue}
              value={formatCrmMoney(lifetimeRevenue)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CompanyWorkspaceNav
          locale={locale}
          active="customers"
          companyId={selectedCompany}
        />

        <form
          method="get"
          className="mt-5 grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-6"
        >
          <input
            name="search"
            defaultValue={search}
            placeholder={t.searchPlaceholder}
            className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm lg:col-span-2"
          />

          <select
            name="stage"
            defaultValue={selectedStage}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="">{t.allStages}</option>
            {CRM_CUSTOMER_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {t.stages[stage]}
              </option>
            ))}
          </select>

          <select
            name="tag"
            defaultValue={selectedTag}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="">{t.allTags}</option>
            {uniqueTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select
            name="follow_up"
            defaultValue={followUpFilter}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="">{t.allFollowUps}</option>
            <option value="due">{t.dueFollowUps}</option>
            <option value="upcoming">{t.upcomingFollowUps}</option>
          </select>

          <select
            name="sort"
            defaultValue={sort}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
          >
            <option value="recent">{t.sortRecent}</option>
            <option value="name">{t.sortName}</option>
            <option value="value">{t.sortValue}</option>
            <option value="follow_up">{t.sortFollowUp}</option>
          </select>

          <select
            name="company"
            defaultValue={selectedCompany}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm lg:col-span-2"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <button className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-black text-white">
            {t.filter}
          </button>

          <Link
            href={`/dashboard/company-customers?company=${encodeURIComponent(
              selectedCompany,
            )}`}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700"
          >
            {t.reset}
          </Link>
        </form>

        {customerError ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-800">
            {t.saveError}
          </div>
        ) : decorated.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              {t.noCustomersTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              {t.noCustomersText}
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {decorated.map(({ customer, metric }) => {
              const stage = normalizeCrmCustomerStage(
                customer.lifecycle_stage,
              )
              const followUpDue =
                customer.follow_up_at &&
                new Date(customer.follow_up_at).getTime() <= Date.now()

              return (
                <article
                  key={customer.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/dashboard/company-customers/${customer.id}`}
                          className="truncate text-xl font-black text-slate-950 hover:text-rose-600"
                        >
                          {customer.customer_name}
                        </Link>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-black ${stageStyle(
                            stage,
                          )}`}
                        >
                          {t.stages[stage]}
                        </span>
                      </div>

                      <p className="mt-2 truncate text-sm text-slate-500">
                        {customer.email}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {[customer.phone, customer.city]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>

                    {followUpDue ? (
                      <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700">
                        {t.followUpsDue}
                      </span>
                    ) : null}
                  </div>

                  {customer.tags?.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {customer.tags.slice(0, 6).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MiniMetric label={t.leads} value={String(metric.leadCount)} />
                    <MiniMetric
                      label={t.bookings}
                      value={String(metric.bookingCount)}
                    />
                    <MiniMetric
                      label={t.completed}
                      value={String(metric.completedBookings)}
                    />
                    <MiniMetric
                      label={t.revenue}
                      value={formatCrmMoney(metric.revenue)}
                    />
                  </div>

                  <div className="mt-5 grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t.lastActivity}
                      </p>
                      <p className="mt-1 font-bold text-slate-700">
                        {formatDateTime(customer.last_activity_at, locale)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        {t.followUp}
                      </p>
                      <p
                        className={`mt-1 font-bold ${
                          followUpDue ? "text-rose-700" : "text-slate-700"
                        }`}
                      >
                        {formatDateTime(customer.follow_up_at, locale)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <Link
                      href={`/dashboard/company-customers/${customer.id}`}
                      className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700"
                    >
                      {t.openCustomer}
                    </Link>

                    <a
                      href={`mailto:${customer.email}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                    >
                      {t.sendEmail}
                    </a>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function MiniMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-base font-black text-slate-950">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  )
}
