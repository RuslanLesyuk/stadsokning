import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import { bookingCopy } from "@/lib/bookings/copy"
import type { BookingLocale } from "@/lib/bookings/types"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { createBookingFromLeadAction } from "./actions"

export const dynamic = "force-dynamic"

type PageProps = { searchParams: Promise<{ lead?: string; error?: string }> }

export default async function NewCompanyBookingFromLeadPage({ searchParams }: PageProps) {
  const query = await searchParams
  const leadId = query.lead?.trim()
  if (!leadId) redirect("/dashboard/company-leads")

  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE) as BookingLocale
  const t = bookingCopy[locale]
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-bookings/new?lead=${encodeURIComponent(leadId)}`)

  const { data: lead } = await supabase
    .from("company_quote_requests")
    .select("id, company_id, customer_name, customer_email, customer_phone, service_type, city, preferred_date, message, status, companies ( id, name, slug )")
    .eq("id", leadId)
    .maybeSingle()
  if (!lead) notFound()

  const { data: settings } = await supabase
    .from("company_booking_settings")
    .select("default_duration_minutes, recurring_enabled")
    .eq("company_id", lead.company_id)
    .maybeSingle()

  const companyRaw = lead.companies
  const company = Array.isArray(companyRaw) ? companyRaw[0] : companyRaw
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-4xl px-4 py-9 sm:px-6"><Link href={`/dashboard/company-leads/${lead.id}`} className="text-sm font-bold text-slate-500">← {t.back}</Link><p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-rose-600">{company?.name || t.company}</p><h1 className="mt-2 text-4xl font-black text-slate-950">{t.createFromLead}</h1><p className="mt-3 text-slate-600">{lead.customer_name} · {lead.service_type || "—"} · {lead.city || "—"}</p></div></section>
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {query.error ? <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-800">Could not create booking: {query.error}</div> : null}
        <form action={createBookingFromLeadAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <input type="hidden" name="lead_id" value={lead.id} /><input type="hidden" name="company_id" value={lead.company_id} />
          <div className="grid gap-5 sm:grid-cols-2">
            <ReadOnly label={t.customer} value={`${lead.customer_name} · ${lead.customer_email}`} />
            <ReadOnly label={t.service} value={lead.service_type || "—"} />
            <Field name="address" label={t.address} required />
            <Field name="postal_code" label={t.postalCode} />
            <Field name="city" label={t.city} defaultValue={lead.city || ""} required />
            <label><span className="text-sm font-black text-slate-900">{t.frequency}</span><select name="frequency" defaultValue="one_time" className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4"><option value="one_time">{t.one_time}</option>{settings?.recurring_enabled !== false ? <option value="weekly">{t.weekly}</option> : null}{settings?.recurring_enabled !== false ? <option value="biweekly">{t.biweekly}</option> : null}{settings?.recurring_enabled !== false ? <option value="monthly">{t.monthly}</option> : null}</select></label>
            <Field name="start_date" type="date" label={t.date} defaultValue={lead.preferred_date || tomorrow} required />
            <Field name="preferred_time" type="time" label={t.time} defaultValue="09:00" required />
            <label><span className="text-sm font-black text-slate-900">{t.duration}</span><select name="duration_minutes" defaultValue={String(settings?.default_duration_minutes || 180)} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4">{[60,120,180,240,300,360,480].map((minutes) => <option key={minutes} value={minutes}>{minutes / 60} {t.hours}</option>)}</select></label>
            <label className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><input type="checkbox" name="rut_requested" /><span className="text-sm font-bold text-emerald-900">RUT</span></label>
            <label className="sm:col-span-2"><span className="text-sm font-black text-slate-900">{t.notes}</span><textarea name="customer_notes" rows={5} defaultValue={lead.message || ""} className="mt-2 w-full rounded-2xl border border-slate-300 p-4 text-sm" /></label>
          </div>
          <button className="mt-6 min-h-12 rounded-2xl bg-rose-600 px-6 text-sm font-black text-white hover:bg-rose-700">{t.createFromLead}</button>
        </form>
      </section>
    </main>
  )
}

function Field({ name, label, type = "text", defaultValue, required = false }: { name: string; label: string; type?: string; defaultValue?: string; required?: boolean }) { return <label><span className="text-sm font-black text-slate-900">{label}</span><input name={name} type={type} defaultValue={defaultValue} required={required} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm" /></label> }
function ReadOnly({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div> }
