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

type BookingRow = {
  id: string
  company_id: string
  service_type: string
  city: string
  frequency: string
  start_date: string
  preferred_time: string
  status: string
  estimated_price: number | string | null
  agreed_price: number | string | null
  companies: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null
}

function companyOf(row: BookingRow) { return Array.isArray(row.companies) ? row.companies[0] ?? null : row.companies }
function formatDate(value: string, locale: BookingLocale) { const map: Record<BookingLocale, string> = { sv: "sv-SE", en: "en-GB", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" }; return new Intl.DateTimeFormat(map[locale], { dateStyle: "medium" }).format(new Date(value)) }

export default async function MyBookingsPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as BookingLocale
  const t = bookingCopy[locale]
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/dashboard/bookings")

  const { data, error } = await supabase
    .from("company_bookings")
    .select("id, company_id, service_type, city, frequency, start_date, preferred_time, status, estimated_price, agreed_price, companies ( id, name, slug )")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200)
  if (error) console.error("Load customer bookings error:", error)
  const bookings = (data ?? []) as BookingRow[]

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">Clean Jobs</p><h1 className="mt-3 text-4xl font-black text-slate-950">{t.dashboardTitle}</h1></div></section>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {bookings.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="text-slate-600">{t.noBookings}</p><Link href="/companies" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-rose-600 px-5 text-sm font-black text-white">{t.company}</Link></div> : (
          <div className="grid gap-4 md:grid-cols-2">{bookings.map((booking) => { const company = companyOf(booking); return <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-black text-slate-950">{company?.name || t.company}</h2><p className="mt-1 text-sm text-slate-500">{booking.service_type} · {booking.city}</p></div><BookingStatusBadge status={normalizeBookingStatus(booking.status)} locale={locale} /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><Detail label={t.date} value={`${formatDate(booking.start_date, locale)} · ${booking.preferred_time.slice(0,5)}`} /><Detail label={t.frequency} value={t[booking.frequency as keyof typeof t] || booking.frequency} /><Detail label={t.price} value={formatBookingMoney(booking.agreed_price || booking.estimated_price)} /></div><Link href={`/dashboard/bookings/${booking.id}`} className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white">{t.open}</Link></article> })}</div>
        )}
      </section>
    </main>
  )
}

function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-800">{value}</p></div> }
