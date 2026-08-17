import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { BookingStatusBadge } from "@/components/bookings/booking-status-badge"
import { bookingCopy } from "@/lib/bookings/copy"
import { crmCopy } from "@/lib/crm/copy"
import type { BookingLocale } from "@/lib/bookings/types"
import { formatBookingMoney, normalizeBookingOccurrenceStatus, normalizeBookingStatus } from "@/lib/bookings/utils"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { setBookingOccurrenceStatusAction, setCompanyBookingStatusAction, updateCompanyBookingPriceAction } from "../actions"

export const dynamic = "force-dynamic"

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }

type Booking = {
  id: string; company_id: string; crm_customer_id: string | null; customer_id: string | null; quote_request_id: string | null; customer_name: string; customer_email: string; customer_phone: string | null; service_type: string; address: string; postal_code: string | null; city: string; frequency: string; start_date: string; preferred_time: string; duration_minutes: number; rut_requested: boolean; customer_notes: string | null; status: string; estimated_price: number | string | null; agreed_price: number | string | null; currency: string; source: string; source_url: string | null; payment_status: string; cancellation_reason: string | null; created_at: string; companies: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null
}
type Occurrence = { id: string; sequence_no: number; scheduled_start: string; scheduled_end: string; status: string; price: number | string | null; cancellation_reason: string | null }
type Activity = { id: string; event_type: string; from_status: string | null; to_status: string | null; metadata: Record<string, unknown> | null; created_at: string }

function companyOf(row: Booking) { return Array.isArray(row.companies) ? row.companies[0] ?? null : row.companies }
function formatDateTime(value: string, locale: BookingLocale) { const map: Record<BookingLocale, string> = { sv: "sv-SE", en: "en-GB", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" }; return new Intl.DateTimeFormat(map[locale], { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) }

export default async function CompanyBookingDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as BookingLocale
  const t = bookingCopy[locale]
  const crmT = crmCopy[locale] || crmCopy.en
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-bookings/${id}`)

  const [{ data, error }, { data: occurrenceData }, { data: activityData }] = await Promise.all([
    supabase.from("company_bookings").select("id, company_id, crm_customer_id, customer_id, quote_request_id, customer_name, customer_email, customer_phone, service_type, address, postal_code, city, frequency, start_date, preferred_time, duration_minutes, rut_requested, customer_notes, status, estimated_price, agreed_price, currency, source, source_url, payment_status, cancellation_reason, created_at, companies ( id, name, slug )").eq("id", id).maybeSingle(),
    supabase.from("company_booking_occurrences").select("id, sequence_no, scheduled_start, scheduled_end, status, price, cancellation_reason").eq("booking_id", id).order("sequence_no"),
    supabase.from("company_booking_activity").select("id, event_type, from_status, to_status, metadata, created_at").eq("booking_id", id).order("created_at", { ascending: false }).limit(100),
  ])
  if (error) console.error("Load company booking detail error:", error)
  if (!data) notFound()

  const booking = data as Booking
  const company = companyOf(booking)
  const occurrences = (occurrenceData ?? []) as Occurrence[]
  const activities = (activityData ?? []) as Activity[]
  const status = normalizeBookingStatus(booking.status)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8"><Link href="/dashboard/company-bookings" className="text-sm font-bold text-slate-500 hover:text-rose-600">← {t.back}</Link><div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">{t.companyBookings}</p><h1 className="mt-2 text-4xl font-black text-slate-950">{booking.customer_name}</h1><p className="mt-2 text-slate-600">{company?.name} · {booking.service_type}</p></div><BookingStatusBadge status={status} locale={locale} /></div></div></section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-6">
          {query.saved ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">✓ Saved</div> : null}
          {query.error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">Could not update booking.</div> : null}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">{t.details}</h2><dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><Detail label={t.customer} value={booking.customer_name} /><Detail label={t.email} value={booking.customer_email} href={`mailto:${booking.customer_email}`} />{booking.customer_phone ? <Detail label={t.phone} value={booking.customer_phone} href={`tel:${booking.customer_phone.replace(/\s+/g, "")}`} /> : null}<Detail label={t.service} value={booking.service_type} /><Detail label={t.address} value={[booking.address, booking.postal_code, booking.city].filter(Boolean).join(", ")} /><Detail label={t.frequency} value={t[booking.frequency as keyof typeof t] || booking.frequency} /><Detail label={t.duration} value={`${booking.duration_minutes / 60} ${t.hours}`} /><Detail label="RUT" value={booking.rut_requested ? "✓" : "—"} /><Detail label={t.payment} value={booking.payment_status} /></dl>{booking.customer_notes ? <div className="mt-6 rounded-2xl bg-slate-50 p-5"><p className="whitespace-pre-line text-sm leading-7 text-slate-700">{booking.customer_notes}</p></div> : null}</section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-black text-slate-950">{t.occurrences}</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">{occurrences.length}</span></div><div className="mt-6 space-y-4">{occurrences.map((occurrence) => { const occurrenceStatus = normalizeBookingOccurrenceStatus(occurrence.status); return <article key={occurrence.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-black text-slate-950">#{occurrence.sequence_no} · {formatDateTime(occurrence.scheduled_start, locale)}</p><p className="mt-1 text-sm text-slate-500">{formatBookingMoney(occurrence.price)}</p></div><BookingStatusBadge status={occurrenceStatus} locale={locale} occurrence /></div><div className="mt-4 flex flex-wrap gap-2">{occurrenceStatus === "confirmed" ? <OccurrenceButton bookingId={booking.id} occurrenceId={occurrence.id} status="in_progress" label={t.start} /> : null}{occurrenceStatus === "in_progress" ? <OccurrenceButton bookingId={booking.id} occurrenceId={occurrence.id} status="completed" label={t.complete} /> : null}{["pending", "confirmed"].includes(occurrenceStatus) ? <OccurrenceButton bookingId={booking.id} occurrenceId={occurrence.id} status="cancelled" label={t.cancel} secondary /> : null}</div></article> })}</div></section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-2xl font-black text-slate-950">{t.timeline}</h2>{activities.length ? <div className="mt-6 space-y-4">{activities.map((activity) => <div key={activity.id} className="flex gap-3"><span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500" /><div><p className="font-bold text-slate-900">{activity.event_type.replaceAll("_", " ")}</p>{activity.from_status && activity.to_status ? <p className="mt-1 text-sm text-slate-500">{activity.from_status} → {activity.to_status}</p> : null}<p className="mt-1 text-xs text-slate-400">{formatDateTime(activity.created_at, locale)}</p></div></div>)}</div> : <p className="mt-4 text-slate-500">—</p>}</section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-black text-slate-950">{t.schedule}</h2><dl className="mt-5 space-y-4"><Detail label={t.date} value={`${booking.start_date} · ${booking.preferred_time.slice(0,5)}`} /><Detail label={t.estimatedPrice} value={formatBookingMoney(booking.estimated_price)} /><Detail label={t.agreedPrice} value={formatBookingMoney(booking.agreed_price)} /><Detail label={t.source} value={t[`source_${booking.source}` as keyof typeof t] || booking.source} /></dl></section>

          <form action={updateCompanyBookingPriceAction} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><input type="hidden" name="booking_id" value={booking.id} /><label className="text-sm font-black text-slate-900">{t.agreedPrice}<input name="agreed_price" type="number" min="0" step="1" defaultValue={booking.agreed_price?.toString() || ""} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3" /></label><button className="mt-3 min-h-11 w-full rounded-xl bg-slate-950 px-4 text-sm font-black text-white">{t.savePrice}</button></form>

          {status === "pending" ? <ActionForm bookingId={booking.id} status="confirmed" label={t.confirm} /> : null}
          {status === "pending" ? <ActionForm bookingId={booking.id} status="declined" label={t.decline} danger /> : null}
          {["confirmed", "pending"].includes(status) ? <ActionForm bookingId={booking.id} status="cancelled" label={t.cancel} danger includeReason /> : null}
          {booking.crm_customer_id ? <Link href={`/dashboard/company-customers/${booking.crm_customer_id}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 text-sm font-black text-violet-700 hover:bg-violet-100">{crmT.openCustomer}</Link> : null}
          {company ? <Link href={`/dashboard/company-bookings/settings/${company.id}`} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700">{t.bookingSettings}</Link> : null}
        </aside>
      </section>
    </main>
  )
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) { return <div><dt className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-slate-800">{href ? <a href={href} className="hover:text-rose-600">{value}</a> : value}</dd></div> }
function ActionForm({ bookingId, status, label, danger = false, includeReason = false }: { bookingId: string; status: string; label: string; danger?: boolean; includeReason?: boolean }) { return <form action={setCompanyBookingStatusAction} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><input type="hidden" name="booking_id" value={bookingId} /><input type="hidden" name="status" value={status} />{includeReason ? <input name="reason" placeholder="Reason" className="mb-3 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm" /> : null}<button className={`min-h-11 w-full rounded-xl px-4 text-sm font-black text-white ${danger ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}`}>{label}</button></form> }
function OccurrenceButton({ bookingId, occurrenceId, status, label, secondary = false }: { bookingId: string; occurrenceId: string; status: string; label: string; secondary?: boolean }) { return <form action={setBookingOccurrenceStatusAction}><input type="hidden" name="booking_id" value={bookingId} /><input type="hidden" name="occurrence_id" value={occurrenceId} /><input type="hidden" name="status" value={status} /><button className={`min-h-9 rounded-lg px-3 text-xs font-black ${secondary ? "border border-slate-300 bg-white text-slate-700" : "bg-slate-950 text-white"}`}>{label}</button></form> }
