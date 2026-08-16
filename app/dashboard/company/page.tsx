import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import DashboardLiveRefresh from "@/components/dashboard-live-refresh"
import CompanyWorkspaceNav from "@/components/company-dashboard/company-workspace-nav"
import { getBillingAccessForUser } from "@/lib/billing/server"
import { companyDashboardCopy } from "@/lib/company-dashboard/copy"
import {
  normalizeBookingStatus,
  numberValue as bookingNumberValue,
} from "@/lib/bookings/utils"
import {
  normalizeCompanyLeadPriority,
  normalizeCompanyLeadStatus,
} from "@/lib/company-leads/utils"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ company?: string }>
}

type OwnedCompany = {
  id: string
  name: string
  slug: string
  city: string | null
  logo_url: string | null
  verified: boolean | null
  rut_available: boolean | null
  hourly_rate: number | null
  minimum_order: number | null
}

type SiteRow = {
  id: string
  site_slug: string
  status: string
  custom_domain: string | null
  domain_status: string
  updated_at: string
}

type BookingSettingsRow = {
  booking_enabled: boolean
  recurring_enabled: boolean
  timezone: string
}

type LeadRow = {
  id: string
  customer_name: string
  service_type: string | null
  city: string | null
  status: string
  priority: string
  estimated_value: number | string | null
  quoted_value: number | string | null
  follow_up_at: string | null
  created_at: string
  updated_at: string
}

type LeadValueRow = {
  estimated_value: number | string | null
  quoted_value: number | string | null
}

type BookingRow = {
  id: string
  customer_name: string
  service_type: string
  city: string
  status: string
  frequency: string
  start_date: string
  preferred_time: string
  estimated_price: number | string | null
  agreed_price: number | string | null
  created_at: string
  updated_at: string
}

type OccurrenceRow = {
  id: string
  booking_id: string
  scheduled_start: string
  scheduled_end: string
  status: string
  price: number | string | null
  company_bookings:
    | {
        id: string
        customer_name: string
        service_type: string
      }
    | {
        id: string
        customer_name: string
        service_type: string
      }[]
    | null
}

type RevenueRow = {
  price: number | string | null
}

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>

async function loadOpenLeadValues(
  supabase: ServerSupabaseClient,
  companyId: string,
) {
  const rows: LeadValueRow[] = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("company_quote_requests")
      .select("estimated_value, quoted_value")
      .eq("company_id", companyId)
      .in("status", ["new", "viewed", "contacted", "qualified", "quoted"])
      .range(from, from + pageSize - 1)

    if (error) {
      console.error("Company dashboard pipeline value error:", error)
      break
    }

    const chunk = (data ?? []) as LeadValueRow[]
    rows.push(...chunk)

    if (chunk.length < pageSize) break
    from += pageSize
  }

  return rows
}

async function loadMonthRevenueRows(
  supabase: ServerSupabaseClient,
  companyId: string,
  startIso: string,
  endIso: string,
) {
  const rows: RevenueRow[] = []
  const pageSize = 1000
  let from = 0

  while (true) {
    const { data, error } = await supabase
      .from("company_booking_occurrences")
      .select("price")
      .eq("company_id", companyId)
      .eq("status", "completed")
      .gte("completed_at", startIso)
      .lt("completed_at", endIso)
      .range(from, from + pageSize - 1)

    if (error) {
      console.error("Company dashboard month revenue error:", error)
      break
    }

    const chunk = (data ?? []) as RevenueRow[]
    rows.push(...chunk)

    if (chunk.length < pageSize) break
    from += pageSize
  }

  return rows
}

type AttentionItem =
  | {
      type: "lead"
      id: string
      title: string
      subtitle: string
      value: string
      createdAt: string
      href: string
    }
  | {
      type: "booking"
      id: string
      title: string
      subtitle: string
      value: string
      createdAt: string
      href: string
    }

type ActivityItem = {
  id: string
  kind: "lead" | "booking" | "website"
  title: string
  subtitle: string
  timestamp: string
  href: string
}

function formatMoney(value: number | string | null | undefined) {
  const parsed = bookingNumberValue(value)
  return parsed > 0
    ? `${Math.round(parsed).toLocaleString("sv-SE")} SEK`
    : "—"
}

function formatPercent(value: number) {
  return `${Math.round(value * 10) / 10}%`
}

function formatDateTime(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(localeMap[locale], {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function relationBooking(row: OccurrenceRow) {
  if (!row.company_bookings) return null
  return Array.isArray(row.company_bookings)
    ? row.company_bookings[0] ?? null
    : row.company_bookings
}

function statusPill(kind: "lead" | "booking", status: string) {
  if (kind === "lead") {
    const map: Record<string, string> = {
      new: "border-blue-200 bg-blue-50 text-blue-800",
      viewed: "border-violet-200 bg-violet-50 text-violet-800",
      contacted: "border-amber-200 bg-amber-50 text-amber-800",
      qualified: "border-cyan-200 bg-cyan-50 text-cyan-800",
      quoted: "border-indigo-200 bg-indigo-50 text-indigo-800",
      won: "border-emerald-200 bg-emerald-50 text-emerald-800",
      lost: "border-red-200 bg-red-50 text-red-800",
      archived: "border-slate-200 bg-slate-100 text-slate-700",
    }
    return map[status] || map.new
  }

  const map: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    confirmed: "border-emerald-200 bg-emerald-50 text-emerald-800",
    in_progress: "border-sky-200 bg-sky-50 text-sky-800",
    completed: "border-slate-200 bg-slate-100 text-slate-700",
    declined: "border-red-200 bg-red-50 text-red-800",
    cancelled: "border-red-200 bg-red-50 text-red-800",
  }
  return map[status] || map.pending
}

function stockholmParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  )

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
  }
}

function timeZoneOffsetMs(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  })

  const parts = Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  )

  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )

  return asUtc - date.getTime()
}

function stockholmLocalMidnightUtc(year: number, month: number, day: number) {
  const timeZone = "Europe/Stockholm"
  const desiredUtc = Date.UTC(year, month - 1, day, 0, 0, 0)
  let candidate = new Date(desiredUtc)

  for (let i = 0; i < 2; i += 1) {
    const offset = timeZoneOffsetMs(candidate, timeZone)
    candidate = new Date(desiredUtc - offset)
  }

  return candidate
}

function stockholmMonthBounds(now = new Date()) {
  const parts = stockholmParts(now)
  const start = stockholmLocalMidnightUtc(parts.year, parts.month, 1)
  const nextYear = parts.month === 12 ? parts.year + 1 : parts.year
  const nextMonth = parts.month === 12 ? 1 : parts.month + 1
  const end = stockholmLocalMidnightUtc(nextYear, nextMonth, 1)

  return { start, end }
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

function SetupRow({
  label,
  value,
  tone = "neutral",
}: {
  label: string
  value: string
  tone?: "good" | "warn" | "neutral"
}) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-100 text-emerald-800"
      : tone === "warn"
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700"

  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${toneClass}`}>
        {value}
      </span>
    </div>
  )
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
      {text}
    </div>
  )
}

export default async function CompanyDashboardPage({ searchParams }: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  ) as Locale
  const t = companyDashboardCopy[locale] || companyDashboardCopy.en

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company")
  }

  const [{ data: companiesData, error: companiesError }, billing] =
    await Promise.all([
      supabase
        .from("companies")
        .select(
          "id, name, slug, city, logo_url, verified, rut_available, hourly_rate, minimum_order",
        )
        .eq("owner_id", user.id)
        .order("name", { ascending: true }),
      getBillingAccessForUser(user.id),
    ])

  if (companiesError) {
    console.error("Load company dashboard companies error:", companiesError)
  }

  const companies = (companiesData ?? []) as OwnedCompany[]

  if (companies.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Link
            href="/dashboard"
            prefetch={false}
            className="text-sm font-black text-slate-500 hover:text-rose-600"
          >
            ← {t.personalDashboard}
          </Link>

          <section className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
              🏢
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-950">
              {t.noCompaniesTitle}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              {t.noCompaniesText}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/companies"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-5 text-sm font-black text-white hover:bg-rose-700"
              >
                {t.browseCompanies}
              </Link>
              <Link
                href="/dashboard/company-claims"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {t.claims}
              </Link>
            </div>
          </section>
        </div>
      </main>
    )
  }

  const selectedCompany =
    companies.find((company) => company.id === query.company) || companies[0]

  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const monthBounds = stockholmMonthBounds(now)

  const [
    siteResult,
    settingsResult,
    totalLeadResult,
    newLeadResult,
    wonLeadResult,
    openLeadValues,
    recentNewLeadsResult,
    recentLeadsResult,
    pendingBookingResult,
    recentPendingBookingsResult,
    recentBookingsResult,
    upcomingCountResult,
    upcomingResult,
    monthRevenueRows,
  ] = await Promise.all([
    supabase
      .from("company_sites")
      .select(
        "id, site_slug, status, custom_domain, domain_status, updated_at",
      )
      .eq("company_id", selectedCompany.id)
      .maybeSingle(),
    supabase
      .from("company_booking_settings")
      .select("booking_enabled, recurring_enabled, timezone")
      .eq("company_id", selectedCompany.id)
      .maybeSingle(),
    supabase
      .from("company_quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("company_id", selectedCompany.id),
    supabase
      .from("company_quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("company_id", selectedCompany.id)
      .eq("status", "new"),
    supabase
      .from("company_quote_requests")
      .select("id", { count: "exact", head: true })
      .eq("company_id", selectedCompany.id)
      .eq("status", "won"),
    loadOpenLeadValues(supabase, selectedCompany.id),
    supabase
      .from("company_quote_requests")
      .select(
        "id, customer_name, service_type, city, status, priority, estimated_value, quoted_value, follow_up_at, created_at, updated_at",
      )
      .eq("company_id", selectedCompany.id)
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("company_quote_requests")
      .select(
        "id, customer_name, service_type, city, status, priority, estimated_value, quoted_value, follow_up_at, created_at, updated_at",
      )
      .eq("company_id", selectedCompany.id)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("company_bookings")
      .select("id", { count: "exact", head: true })
      .eq("company_id", selectedCompany.id)
      .eq("status", "pending"),
    supabase
      .from("company_bookings")
      .select(
        "id, customer_name, service_type, city, status, frequency, start_date, preferred_time, estimated_price, agreed_price, created_at, updated_at",
      )
      .eq("company_id", selectedCompany.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("company_bookings")
      .select(
        "id, customer_name, service_type, city, status, frequency, start_date, preferred_time, estimated_price, agreed_price, created_at, updated_at",
      )
      .eq("company_id", selectedCompany.id)
      .order("updated_at", { ascending: false })
      .limit(6),
    supabase
      .from("company_booking_occurrences")
      .select("id", { count: "exact", head: true })
      .eq("company_id", selectedCompany.id)
      .in("status", ["confirmed", "in_progress"])
      .gte("scheduled_start", now.toISOString())
      .lt("scheduled_start", sevenDaysFromNow.toISOString()),
    supabase
      .from("company_booking_occurrences")
      .select(
        "id, booking_id, scheduled_start, scheduled_end, status, price, company_bookings ( id, customer_name, service_type )",
      )
      .eq("company_id", selectedCompany.id)
      .in("status", ["confirmed", "in_progress"])
      .gte("scheduled_start", now.toISOString())
      .lt("scheduled_start", sevenDaysFromNow.toISOString())
      .order("scheduled_start", { ascending: true })
      .limit(12),
    loadMonthRevenueRows(
      supabase,
      selectedCompany.id,
      monthBounds.start.toISOString(),
      monthBounds.end.toISOString(),
    ),
  ])

  for (const [label, result] of [
    ["site", siteResult],
    ["booking settings", settingsResult],
    ["total leads", totalLeadResult],
    ["new leads", newLeadResult],
    ["won leads", wonLeadResult],
    ["recent new leads", recentNewLeadsResult],
    ["recent leads", recentLeadsResult],
    ["pending bookings", pendingBookingResult],
    ["recent pending bookings", recentPendingBookingsResult],
    ["recent bookings", recentBookingsResult],
    ["upcoming count", upcomingCountResult],
    ["upcoming", upcomingResult],
  ] as const) {
    if (result.error) {
      console.error(`Company dashboard ${label} error:`, result.error)
    }
  }

  const site = (siteResult.data || null) as SiteRow | null
  const settings = (settingsResult.data || null) as BookingSettingsRow | null
  const recentNewLeads = (recentNewLeadsResult.data ?? []) as LeadRow[]
  const recentLeads = (recentLeadsResult.data ?? []) as LeadRow[]
  const recentPendingBookings = (recentPendingBookingsResult.data ??
    []) as BookingRow[]
  const recentBookings = (recentBookingsResult.data ?? []) as BookingRow[]
  const upcomingOccurrences = (upcomingResult.data ?? []) as OccurrenceRow[]

  const totalLeads = totalLeadResult.count ?? 0
  const newLeads = newLeadResult.count ?? 0
  const wonLeads = wonLeadResult.count ?? 0
  const conversion = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0
  const pipelineValue = openLeadValues.reduce(
    (sum, row) =>
      sum + bookingNumberValue(row.quoted_value || row.estimated_value),
    0,
  )
  const pendingBookings = pendingBookingResult.count ?? 0
  const nextSevenDays = upcomingCountResult.count ?? 0
  const monthRevenue = monthRevenueRows.reduce(
    (sum, row) => sum + bookingNumberValue(row.price),
    0,
  )

  const attentionItems: AttentionItem[] = [
    ...recentNewLeads.map((lead) => ({
      type: "lead" as const,
      id: lead.id,
      title: lead.customer_name,
      subtitle: [lead.service_type, lead.city].filter(Boolean).join(" · "),
      value: formatMoney(lead.quoted_value || lead.estimated_value),
      createdAt: lead.created_at,
      href: `/dashboard/company-leads/${lead.id}`,
    })),
    ...recentPendingBookings.map((booking) => ({
      type: "booking" as const,
      id: booking.id,
      title: booking.customer_name,
      subtitle: [booking.service_type, booking.city].filter(Boolean).join(" · "),
      value: formatMoney(booking.agreed_price || booking.estimated_price),
      createdAt: booking.created_at,
      href: `/dashboard/company-bookings/${booking.id}`,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 8)

  const activityItems: ActivityItem[] = [
    ...recentLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      kind: "lead" as const,
      title: lead.customer_name,
      subtitle: `${t.leadActivity} · ${
        t.leadStatuses[normalizeCompanyLeadStatus(lead.status)]
      }`,
      timestamp: lead.updated_at || lead.created_at,
      href: `/dashboard/company-leads/${lead.id}`,
    })),
    ...recentBookings.map((booking) => ({
      id: `booking-${booking.id}`,
      kind: "booking" as const,
      title: booking.customer_name,
      subtitle: `${t.bookingActivity} · ${
        t.bookingStatuses[normalizeBookingStatus(booking.status)]
      }`,
      timestamp: booking.updated_at || booking.created_at,
      href: `/dashboard/company-bookings/${booking.id}`,
    })),
    ...(site
      ? [
          {
            id: `website-${site.id}`,
            kind: "website" as const,
            title: selectedCompany.name,
            subtitle: `${t.websiteActivity} · ${
              site.status === "published" ? t.published : t.draft
            }`,
            timestamp: site.updated_at,
            href: `/dashboard/companies/${selectedCompany.id}/website`,
          },
        ]
      : []),
  ]
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, 10)

  const websiteStatus = !site
    ? t.noWebsite
    : site.status === "published"
      ? t.published
      : t.draft

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardLiveRefresh interval={15000} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <Link
                href="/dashboard"
                prefetch={false}
                className="text-sm font-black text-slate-500 hover:text-rose-600"
              >
                ← {t.personalDashboard}
              </Link>

              <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-600">
                {t.eyebrow}
              </p>

              <div className="mt-3 flex items-center gap-4">
                {selectedCompany.logo_url ? (
                  <img
                    src={selectedCompany.logo_url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-2xl border border-slate-200 bg-white object-contain p-2"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-2xl font-black text-white">
                    {selectedCompany.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <h1 className="truncate text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
                    {selectedCompany.name}
                  </h1>
                  <p className="mt-2 text-slate-600">
                    {selectedCompany.city || "Sweden"} · {t.title}
                  </p>
                </div>
              </div>

              <p className="mt-5 max-w-3xl leading-7 text-slate-600">
                {t.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    selectedCompany.verified
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedCompany.verified ? t.verified : t.notVerified}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    billing.isPremium
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {billing.isPremium ? t.premium : t.free}
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3">
              {companies.length > 1 ? (
                <form
                  method="get"
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row"
                >
                  <label className="sr-only" htmlFor="company-dashboard-company">
                    {t.selectCompany}
                  </label>
                  <select
                    id="company-dashboard-company"
                    name="company"
                    defaultValue={selectedCompany.id}
                    className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-800"
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  <button className="min-h-11 rounded-xl bg-slate-950 px-4 text-sm font-black text-white hover:bg-slate-800">
                    {t.switchCompany}
                  </button>
                </form>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/companies/${selectedCompany.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  {t.publicProfile}
                </Link>

                {site?.status === "published" ? (
                  <Link
                    href={`/site/${site.site_slug}`}
                    target="_blank"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700"
                  >
                    {t.openWebsite}
                  </Link>
                ) : null}

                <Link
                  href={`/dashboard/companies/${selectedCompany.id}/edit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
                >
                  {t.editCompany}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-7 sm:px-6 lg:px-8">
        <CompanyWorkspaceNav
          locale={locale}
          active="overview"
          companyId={selectedCompany.id}
          newLeadsCount={newLeads}
          pendingBookingsCount={pendingBookings}
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label={t.newLeads} value={String(newLeads)} />
          <MetricCard label={t.conversion} value={formatPercent(conversion)} />
          <MetricCard label={t.pipeline} value={formatMoney(pipelineValue)} />
          <MetricCard
            label={t.pendingBookings}
            value={String(pendingBookings)}
          />
          <MetricCard label={t.nextSevenDays} value={String(nextSevenDays)} />
          <MetricCard
            label={t.revenueThisMonth}
            value={formatMoney(monthRevenue)}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  {t.attention}
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {t.attentionText}
                </p>
              </div>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-black text-rose-700">
                {newLeads + pendingBookings}
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {attentionItems.length === 0 ? (
                <EmptyCard text={t.attentionEmpty} />
              ) : (
                attentionItems.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.href}
                    prefetch={false}
                    className="block rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 hover:bg-rose-50/30"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${
                              item.type === "lead"
                                ? "border-blue-200 bg-blue-50 text-blue-800"
                                : "border-amber-200 bg-amber-50 text-amber-800"
                            }`}
                          >
                            {item.type === "lead" ? t.lead : t.booking}
                          </span>
                          <h3 className="truncate font-black text-slate-950">
                            {item.title}
                          </h3>
                        </div>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {item.subtitle || "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatDateTime(item.createdAt, locale)}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <p className="font-black text-slate-950">{item.value}</p>
                        <p className="mt-1 text-xs font-bold text-rose-600">
                          {item.type === "lead" ? t.openLead : t.openBooking} →
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {t.setup}
            </h2>
            <div className="mt-5">
              <SetupRow
                label={t.website}
                value={websiteStatus}
                tone={
                  site?.status === "published"
                    ? "good"
                    : site
                      ? "warn"
                      : "neutral"
                }
              />
              <SetupRow
                label={t.bookings}
                value={
                  settings?.booking_enabled
                    ? t.bookingOnline
                    : t.bookingOffline
                }
                tone={settings?.booking_enabled ? "good" : "warn"}
              />
              <SetupRow
                label={t.bookingSettings}
                value={
                  settings?.recurring_enabled ? t.recurringOn : t.recurringOff
                }
                tone={settings?.recurring_enabled ? "good" : "neutral"}
              />
              <SetupRow
                label={t.customDomain}
                value={site?.custom_domain || t.noDomain}
                tone={
                  site?.custom_domain && site.domain_status === "verified"
                    ? "good"
                    : site?.custom_domain
                      ? "warn"
                      : "neutral"
                }
              />
              <SetupRow
                label="RUT"
                value={selectedCompany.rut_available ? t.rutOn : t.rutOff}
                tone={selectedCompany.rut_available ? "good" : "neutral"}
              />
              <SetupRow
                label="Premium"
                value={billing.isPremium ? t.premium : t.free}
                tone={billing.isPremium ? "good" : "neutral"}
              />
            </div>

            <div className="mt-6 grid gap-2">
              <Link
                href={`/dashboard/companies/${selectedCompany.id}/website`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white hover:bg-rose-600"
              >
                {t.websites}
              </Link>
              <Link
                href={`/dashboard/company-bookings/settings/${selectedCompany.id}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                {t.bookingSettings}
              </Link>
              <Link
                href="/billing"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm font-black text-amber-800 hover:bg-amber-100"
              >
                {t.billing}
              </Link>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-950">
                {t.upcoming}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {t.upcomingText}
              </p>
            </div>
            <Link
              href={`/dashboard/company-bookings?company=${selectedCompany.id}`}
              className="text-sm font-black text-rose-600 hover:text-rose-700"
            >
              {t.bookings} →
            </Link>
          </div>

          {upcomingOccurrences.length === 0 ? (
            <div className="mt-6">
              <EmptyCard text={t.upcomingEmpty} />
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {upcomingOccurrences.map((occurrence) => {
                const booking = relationBooking(occurrence)
                const status = normalizeBookingStatus(
                  occurrence.status === "in_progress"
                    ? "in_progress"
                    : "confirmed",
                )

                return (
                  <Link
                    key={occurrence.id}
                    href={`/dashboard/company-bookings/${occurrence.booking_id}`}
                    prefetch={false}
                    className="rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 hover:bg-rose-50/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate font-black text-slate-950">
                          {booking?.customer_name || t.booking}
                        </h3>
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {booking?.service_type || "—"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${statusPill(
                          "booking",
                          status,
                        )}`}
                      >
                        {t.bookingStatuses[status]}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-4">
                      <p className="text-sm font-bold text-slate-700">
                        {formatDateTime(occurrence.scheduled_start, locale)}
                      </p>
                      <p className="text-sm font-black text-slate-950">
                        {formatMoney(occurrence.price)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {t.recentActivity}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {t.recentActivityText}
            </p>

            <div className="mt-6 space-y-3">
              {activityItems.length === 0 ? (
                <EmptyCard text={t.activityEmpty} />
              ) : (
                activityItems.map((activity) => (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    prefetch={false}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 hover:bg-rose-50/30"
                  >
                    <span
                      className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                        activity.kind === "lead"
                          ? "bg-blue-500"
                          : activity.kind === "booking"
                            ? "bg-emerald-500"
                            : "bg-violet-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="truncate font-black text-slate-950">
                          {activity.title}
                        </p>
                        <p className="shrink-0 text-xs text-slate-400">
                          {formatDateTime(activity.timestamp, locale)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {activity.subtitle}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-950">
              {t.quickActions}
            </h2>
            <div className="mt-5 grid gap-3">
              <Link
                href={`/dashboard/company-leads?company=${selectedCompany.id}`}
                className="inline-flex min-h-12 items-center justify-between rounded-2xl bg-rose-600 px-5 text-sm font-black text-white hover:bg-rose-700"
              >
                <span>{t.leads}</span>
                <span>{newLeads > 0 ? newLeads : "→"}</span>
              </Link>

              <Link
                href={`/dashboard/company-bookings?company=${selectedCompany.id}`}
                className="inline-flex min-h-12 items-center justify-between rounded-2xl bg-slate-950 px-5 text-sm font-black text-white hover:bg-slate-800"
              >
                <span>{t.bookings}</span>
                <span>{pendingBookings > 0 ? pendingBookings : "→"}</span>
              </Link>

              <Link
                href={`/dashboard/companies/${selectedCompany.id}/website`}
                className="inline-flex min-h-12 items-center justify-between rounded-2xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                <span>{t.websites}</span>
                <span>→</span>
              </Link>

              <Link
                href={`/dashboard/company-bookings/settings/${selectedCompany.id}`}
                className="inline-flex min-h-12 items-center justify-between rounded-2xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                <span>{t.bookingSettings}</span>
                <span>→</span>
              </Link>

              <Link
                href="/dashboard/services"
                className="inline-flex min-h-12 items-center justify-between rounded-2xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                <span>{t.services}</span>
                <span>→</span>
              </Link>

              <Link
                href="/billing"
                className="inline-flex min-h-12 items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-5 text-sm font-black text-amber-800 hover:bg-amber-100"
              >
                <span>{t.billing}</span>
                <span>→</span>
              </Link>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
