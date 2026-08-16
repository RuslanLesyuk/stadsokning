import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { BookingStatusBadge } from "@/components/bookings/booking-status-badge"
import { bookingCopy } from "@/lib/bookings/copy"
import type { BookingLocale } from "@/lib/bookings/types"
import { formatBookingMoney, normalizeBookingStatus } from "@/lib/bookings/utils"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type PageProps = {
  searchParams: Promise<{ status?: string; company?: string }>
}

type OwnedCompany = { id: string; name: string; slug: string }
type BookingRow = {
  id: string
  company_id: string
  customer_name: string
  customer_email: string
  service_type: string
  city: string
  frequency: string
  start_date: string
  preferred_time: string
  status: string
  estimated_price: number | string | null
  agreed_price: number | string | null
  created_at: string
  companies: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null
}

function formatDate(value: string, locale: BookingLocale) {
  const map: Record<BookingLocale, string> = { sv: "sv-SE", en: "en-GB", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" }
  return new Intl.DateTimeFormat(map[locale], { dateStyle: "medium" }).format(new Date(value))
}

function companyOf(row: BookingRow) {
  return Array.isArray(row.companies) ? row.companies[0] ?? null : row.companies
}

export default async function CompanyBookingsPage({ searchParams }: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as BookingLocale
  const t = bookingCopy[locale]
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/dashboard/company-bookings")

  const { data: companiesData } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("name")
  const companies = (companiesData ?? []) as OwnedCompany[]
  const companyIds = companies.map((company) => company.id)

  if (companyIds.length === 0) {
    return <main className="mx-auto max-w-5xl px-4 py-12"><h1 className="text-4xl font-black">{t.companyDashboardTitle}</h1><p className="mt-4 text-slate-600">{t.noCompanyBookings}</p></main>
  }

  const allowedStatuses = ["pending", "confirmed", "in_progress", "completed", "declined", "cancelled"]
  const selectedStatus = allowedStatuses.includes(query.status || "") ? query.status! : ""
  const selectedCompany = companyIds.includes(query.company || "") ? query.company! : ""

  let bookingsQuery = supabase
    .from("company_bookings")
    .select("id, company_id, customer_name, customer_email, service_type, city, frequency, start_date, preferred_time, status, estimated_price, agreed_price, created_at, companies ( id, name, slug )")
    .order("created_at", { ascending: false })

  if (selectedStatus) bookingsQuery = bookingsQuery.eq("status", selectedStatus)
  if (selectedCompany) bookingsQuery = bookingsQuery.eq("company_id", selectedCompany)

  const [{ data: bookingsData, error }, { data: statsData }] = await Promise.all([
    bookingsQuery.limit(250),
    supabase.from("company_bookings").select("status"),
  ])

  if (error) console.error("Load company bookings error:", error)
  const bookings = (bookingsData ?? []) as BookingRow[]
  const stats = (statsData ?? []) as Array<{ status: string }>
  const pending = stats.filter((item) => item.status === "pending").length
  const confirmed = stats.filter((item) => ["confirmed", "in_progress"].includes(item.status)).length
  const completed = stats.filter((item) => item.status === "completed").length

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Bookings / recurring orders</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><h1 className="text-4xl font-black text-slate-950">{t.companyDashboardTitle}</h1><p className="mt-3 text-slate-600">{stats.length} {t.bookings.toLowerCase()}</p></div>
            <div className="flex flex-wrap gap-2">{companies.map((company) => <Link key={company.id} href={`/dashboard/company-bookings/settings/${company.id}`} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700">{t.bookingSettings}: {company.name}</Link>)}</div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3"><Stat label={t.pending} value={pending} /><Stat label={t.confirmed} value={confirmed} /><Stat label={t.completed} value={completed} /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <form method="get" className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-3">
          <select name="status" defaultValue={selectedStatus} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3"><option value="">{t.status}: —</option>{allowedStatuses.map((status) => <option key={status} value={status}>{t[status as keyof typeof t]}</option>)}</select>
          <select name="company" defaultValue={selectedCompany} className="min-h-11 rounded-xl border border-slate-300 bg-white px-3"><option value="">{t.company}: —</option>{companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}</select>
          <button className="min-h-11 rounded-xl bg-slate-950 px-4 font-black text-white">Filter</button>
        </form>

        {bookings.length === 0 ? <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">{t.noCompanyBookings}</div> : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {bookings.map((booking) => {
              const company = companyOf(booking)
              return <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-black text-slate-950">{booking.customer_name}</h2><p className="mt-1 text-sm text-slate-500">{company?.name} · {booking.service_type}</p></div><BookingStatusBadge status={normalizeBookingStatus(booking.status)} locale={locale} /></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label={t.date} value={`${formatDate(booking.start_date, locale)} · ${booking.preferred_time.slice(0, 5)}`} /><Detail label={t.city} value={booking.city} /><Detail label={t.frequency} value={t[booking.frequency as keyof typeof t] || booking.frequency} /><Detail label={t.price} value={formatBookingMoney(booking.agreed_price || booking.estimated_price)} /></div>
                <Link href={`/dashboard/company-bookings/${booking.id}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700">{t.open}</Link>
              </article>
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-3xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p></div> }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div> }
