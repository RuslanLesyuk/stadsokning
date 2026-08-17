
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import CompanyWorkspaceNav from "@/components/company-dashboard/company-workspace-nav"
import { crmCopy } from "@/lib/crm/copy"
import type { CompanyCrmCustomer } from "@/lib/crm/types"
import {
  CRM_CUSTOMER_STAGES,
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
import { updateCompanyCustomerAction } from "../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}

type LeadRow = {
  id: string
  customer_name: string
  service_type: string | null
  city: string | null
  status: string
  priority: string
  source: string
  estimated_value: number | string | null
  quoted_value: number | string | null
  follow_up_at: string | null
  created_at: string
  updated_at: string
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
  agreed_price: number | string | null
  estimated_price: number | string | null
  created_at: string
  updated_at: string
}

type OccurrenceRow = {
  booking_id: string
  status: string
  scheduled_start: string
  price: number | string | null
}

type CrmActivityRow = {
  id: string
  event_type: string
  metadata: Record<string, unknown> | null
  created_at: string
}

type LeadActivityRow = {
  id: string
  quote_request_id: string
  event_type: string
  from_status: string | null
  to_status: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

type BookingActivityRow = {
  id: string
  booking_id: string
  event_type: string
  from_status: string | null
  to_status: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

type TimelineItem = {
  id: string
  kind: "crm" | "lead" | "booking"
  title: string
  subtitle: string
  createdAt: string
  href?: string
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

function formatDate(value: string | null, locale: Locale) {
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
  }).format(date)
}

function toInputDateTime(value: string | null) {
  if (!value) return ""

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60_000,
  )

  return local.toISOString().slice(0, 16)
}

function eventLabel(eventType: string, locale: Locale) {
  const t = crmCopy[locale] || crmCopy.en
  const key = `event_${eventType}` as keyof typeof t
  const value = t[key]
  return typeof value === "string"
    ? value
    : eventType.replaceAll("_", " ")
}

function statusStyle(value: string) {
  if (["won", "completed", "confirmed"].includes(value)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800"
  }

  if (["lost", "cancelled", "declined"].includes(value)) {
    return "border-red-200 bg-red-50 text-red-800"
  }

  if (["quoted", "qualified", "in_progress"].includes(value)) {
    return "border-indigo-200 bg-indigo-50 text-indigo-800"
  }

  if (["new", "pending"].includes(value)) {
    return "border-amber-200 bg-amber-50 text-amber-800"
  }

  return "border-slate-200 bg-slate-100 text-slate-700"
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

export default async function CompanyCustomerDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
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
    redirect(`/login?next=/dashboard/company-customers/${id}`)
  }

  const { data: customerData, error: customerError } = await supabase
    .from("company_crm_customers")
    .select(`
      id, company_id, user_id, customer_name, email, normalized_email,
      phone, city, lifecycle_stage, tags, owner_notes, follow_up_at,
      first_seen_at, last_seen_at, last_activity_at, created_at, updated_at
    `)
    .eq("id", id)
    .maybeSingle()

  if (customerError) {
    console.error("Load CRM customer detail error:", customerError)
  }

  if (!customerData) notFound()

  const customer = customerData as CompanyCrmCustomer
  const stage = normalizeCrmCustomerStage(customer.lifecycle_stage)

  const { data: companyData } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("id", customer.company_id)
    .maybeSingle()

  if (!companyData) notFound()

  const [
    { data: leadsData, error: leadsError },
    { data: bookingsData, error: bookingsError },
    { data: crmActivityData, error: crmActivityError },
  ] = await Promise.all([
    supabase
      .from("company_quote_requests")
      .select(`
        id, customer_name, service_type, city, status, priority, source,
        estimated_value, quoted_value, follow_up_at, created_at, updated_at
      `)
      .eq("crm_customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("company_bookings")
      .select(`
        id, customer_name, service_type, city, status, frequency,
        start_date, preferred_time, agreed_price, estimated_price,
        created_at, updated_at
      `)
      .eq("crm_customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("company_crm_customer_activity")
      .select("id, event_type, metadata, created_at")
      .eq("crm_customer_id", customer.id)
      .order("created_at", { ascending: false })
      .limit(100),
  ])

  if (leadsError) {
    console.error("Load CRM customer leads error:", leadsError)
  }

  if (bookingsError) {
    console.error("Load CRM customer bookings error:", bookingsError)
  }

  if (crmActivityError) {
    console.error("Load CRM customer activity error:", crmActivityError)
  }

  const leads = (leadsData ?? []) as LeadRow[]
  const bookings = (bookingsData ?? []) as BookingRow[]
  const crmActivities = (crmActivityData ?? []) as CrmActivityRow[]

  const leadIds = leads.map((lead) => lead.id)
  const bookingIds = bookings.map((booking) => booking.id)

  const [occurrenceResult, leadActivityResult, bookingActivityResult] =
    await Promise.all([
      bookingIds.length > 0
        ? supabase
            .from("company_booking_occurrences")
            .select("booking_id, status, scheduled_start, price")
            .in("booking_id", bookingIds)
            .order("scheduled_start", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
      leadIds.length > 0
        ? supabase
            .from("company_quote_request_activity")
            .select(`
              id, quote_request_id, event_type, from_status, to_status,
              metadata, created_at
            `)
            .in("quote_request_id", leadIds)
            .order("created_at", { ascending: false })
            .limit(150)
        : Promise.resolve({ data: [], error: null }),
      bookingIds.length > 0
        ? supabase
            .from("company_booking_activity")
            .select(`
              id, booking_id, event_type, from_status, to_status,
              metadata, created_at
            `)
            .in("booking_id", bookingIds)
            .order("created_at", { ascending: false })
            .limit(150)
        : Promise.resolve({ data: [], error: null }),
    ])

  if (occurrenceResult.error) {
    console.error("Load CRM customer occurrences error:", occurrenceResult.error)
  }

  if (leadActivityResult.error) {
    console.error(
      "Load CRM customer lead activity error:",
      leadActivityResult.error,
    )
  }

  if (bookingActivityResult.error) {
    console.error(
      "Load CRM customer booking activity error:",
      bookingActivityResult.error,
    )
  }

  const occurrences = (occurrenceResult.data ?? []) as OccurrenceRow[]
  const leadActivities = (leadActivityResult.data ?? []) as LeadActivityRow[]
  const bookingActivities = (bookingActivityResult.data ??
    []) as BookingActivityRow[]

  const completedRevenue = occurrences
    .filter((occurrence) => occurrence.status === "completed")
    .reduce((sum, occurrence) => sum + numberValue(occurrence.price), 0)

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length

  const upcomingCount = occurrences.filter(
    (occurrence) =>
      ["confirmed", "in_progress"].includes(occurrence.status) &&
      new Date(occurrence.scheduled_start).getTime() >= Date.now(),
  ).length

  const leadById = new Map(leads.map((lead) => [lead.id, lead]))
  const bookingById = new Map(bookings.map((booking) => [booking.id, booking]))

  const timeline: TimelineItem[] = [
    ...crmActivities.map((activity) => ({
      id: `crm-${activity.id}`,
      kind: "crm" as const,
      title: eventLabel(activity.event_type, locale),
      subtitle:
        activity.event_type === "lifecycle_changed"
          ? `${String(activity.metadata?.from || "—")} → ${String(
              activity.metadata?.to || "—",
            )}`
          : "",
      createdAt: activity.created_at,
    })),
    ...leadActivities.map((activity) => {
      const lead = leadById.get(activity.quote_request_id)
      return {
        id: `lead-${activity.id}`,
        kind: "lead" as const,
        title: `${t.leads} · ${activity.event_type.replaceAll("_", " ")}`,
        subtitle: [
          lead?.service_type,
          activity.from_status && activity.to_status
            ? `${activity.from_status} → ${activity.to_status}`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        createdAt: activity.created_at,
        href: `/dashboard/company-leads/${activity.quote_request_id}`,
      }
    }),
    ...bookingActivities.map((activity) => {
      const booking = bookingById.get(activity.booking_id)
      return {
        id: `booking-${activity.id}`,
        kind: "booking" as const,
        title: `${t.bookings} · ${activity.event_type.replaceAll("_", " ")}`,
        subtitle: [
          booking?.service_type,
          activity.from_status && activity.to_status
            ? `${activity.from_status} → ${activity.to_status}`
            : null,
        ]
          .filter(Boolean)
          .join(" · "),
        createdAt: activity.created_at,
        href: `/dashboard/company-bookings/${activity.booking_id}`,
      }
    }),
  ]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    )
    .slice(0, 120)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <Link
            href={`/dashboard/company-customers?company=${encodeURIComponent(
              customer.company_id,
            )}`}
            className="text-sm font-bold text-slate-500 hover:text-rose-600"
          >
            ← {t.back}
          </Link>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">
                {t.eyebrow}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tight text-slate-950">
                  {customer.customer_name}
                </h1>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-black ${stageStyle(
                    stage,
                  )}`}
                >
                  {t.stages[stage]}
                </span>
              </div>
              <p className="mt-3 text-slate-600">
                {companyData.name} · {customer.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {customer.phone ? (
                <a
                  href={`tel:${customer.phone.replace(/\s+/g, "")}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white"
                >
                  {t.call}
                </a>
              ) : null}

              <a
                href={`mailto:${customer.email}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700"
              >
                {t.sendEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <CompanyWorkspaceNav
          locale={locale}
          active="customers"
          companyId={customer.company_id}
        />

        {query.saved ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
            {t.saved}
          </div>
        ) : null}

        {query.error ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
            {t.saveError}
          </div>
        ) : null}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <Stat label={t.leads} value={String(leads.length)} />
          <Stat label={t.bookings} value={String(bookings.length)} />
          <Stat label={t.completedBookings} value={String(completedBookings)} />
          <Stat label={t.upcoming} value={String(upcomingCount)} />
          <Stat label={t.customerValue} value={formatCrmMoney(completedRevenue)} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {t.profile}
              </h2>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label={t.email} value={customer.email} />
                <Detail label={t.phone} value={customer.phone || "—"} />
                <Detail label={t.city} value={customer.city || "—"} />
                <Detail
                  label={t.firstSeen}
                  value={formatDateTime(customer.first_seen_at, locale)}
                />
                <Detail
                  label={t.lastSeen}
                  value={formatDateTime(customer.last_seen_at, locale)}
                />
                <Detail
                  label={t.lastActivity}
                  value={formatDateTime(customer.last_activity_at, locale)}
                />
              </dl>

              {customer.tags?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {customer.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-950">
                    {t.leadHistory}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {leads.length} {t.leads.toLowerCase()}
                  </p>
                </div>
              </div>

              {leads.length === 0 ? (
                <Empty text={t.noLeads} />
              ) : (
                <div className="mt-5 space-y-3">
                  {leads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/dashboard/company-leads/${lead.id}`}
                      className="block rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 hover:bg-rose-50/30"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-950">
                              {lead.service_type || t.leads}
                            </p>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${statusStyle(
                                lead.status,
                              )}`}
                            >
                              {lead.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {[lead.city, lead.source]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatDateTime(lead.created_at, locale)}
                          </p>
                        </div>
                        <p className="shrink-0 font-black text-slate-950">
                          {formatCrmMoney(
                            lead.quoted_value || lead.estimated_value,
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {t.bookingHistory}
              </h2>

              {bookings.length === 0 ? (
                <Empty text={t.noBookings} />
              ) : (
                <div className="mt-5 space-y-3">
                  {bookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/dashboard/company-bookings/${booking.id}`}
                      className="block rounded-2xl border border-slate-200 p-4 transition hover:border-rose-200 hover:bg-rose-50/30"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black text-slate-950">
                              {booking.service_type}
                            </p>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-[11px] font-black ${statusStyle(
                                booking.status,
                              )}`}
                            >
                              {booking.status.replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(booking.start_date, locale)} ·{" "}
                            {booking.preferred_time.slice(0, 5)} ·{" "}
                            {booking.frequency.replaceAll("_", " ")}
                          </p>
                        </div>
                        <p className="shrink-0 font-black text-slate-950">
                          {formatCrmMoney(
                            booking.agreed_price || booking.estimated_price,
                          )}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                {t.activity}
              </h2>

              {timeline.length === 0 ? (
                <Empty text={t.noActivity} />
              ) : (
                <div className="mt-6 space-y-4">
                  {timeline.map((item) => {
                    const content = (
                      <div className="flex gap-4">
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                            item.kind === "crm"
                              ? "bg-violet-500"
                              : item.kind === "lead"
                                ? "bg-blue-500"
                                : "bg-emerald-500"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-black text-slate-900">
                            {item.title}
                          </p>
                          {item.subtitle ? (
                            <p className="mt-1 text-sm text-slate-500">
                              {item.subtitle}
                            </p>
                          ) : null}
                          <p className="mt-1 text-xs text-slate-400">
                            {formatDateTime(item.createdAt, locale)}
                          </p>
                        </div>
                      </div>
                    )

                    return item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        className="block rounded-2xl border border-slate-100 p-3 hover:bg-slate-50"
                      >
                        {content}
                      </Link>
                    ) : (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-100 p-3"
                      >
                        {content}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
            <form
              action={updateCompanyCustomerAction}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <input type="hidden" name="customer_id" value={customer.id} />

              <h2 className="text-xl font-black text-slate-950">
                {t.editCustomer}
              </h2>

              <div className="mt-5 space-y-4">
                <Field
                  name="customer_name"
                  label={t.customer}
                  defaultValue={customer.customer_name}
                  required
                />

                <Field
                  name="phone"
                  label={t.phone}
                  defaultValue={customer.phone || ""}
                />

                <Field
                  name="city"
                  label={t.city}
                  defaultValue={customer.city || ""}
                />

                <label className="block">
                  <span className="text-sm font-black text-slate-900">
                    {t.stage}
                  </span>
                  <select
                    name="lifecycle_stage"
                    defaultValue={stage}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
                  >
                    {CRM_CUSTOMER_STAGES.map((item) => (
                      <option key={item} value={item}>
                        {t.stages[item]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-900">
                    {t.followUp}
                  </span>
                  <input
                    name="follow_up_at"
                    type="datetime-local"
                    defaultValue={toInputDateTime(customer.follow_up_at)}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
                  />
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    {t.followUpHint}
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-900">
                    {t.tags}
                  </span>
                  <input
                    name="tags"
                    defaultValue={(customer.tags || []).join(", ")}
                    className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
                  />
                  <span className="mt-1 block text-xs leading-5 text-slate-400">
                    {t.tagsHint}
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-black text-slate-900">
                    {t.notes}
                  </span>
                  <textarea
                    name="owner_notes"
                    rows={8}
                    defaultValue={customer.owner_notes || ""}
                    className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-sm"
                  />
                </label>
              </div>

              <button className="mt-5 min-h-11 w-full rounded-xl bg-slate-950 px-4 text-sm font-black text-white hover:bg-rose-600">
                {t.save}
              </button>
            </form>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">{t.contact}</h2>
              <div className="mt-4 space-y-3">
                <a
                  href={`mailto:${customer.email}`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700"
                >
                  {t.sendEmail}
                </a>

                {customer.phone ? (
                  <a
                    href={`tel:${customer.phone.replace(/\s+/g, "")}`}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700"
                  >
                    {t.call}
                  </a>
                ) : null}

                <Link
                  href={`/companies/${companyData.slug}`}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-black text-slate-700"
                >
                  {t.company}
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  )
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
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
    </div>
  )
}

function Detail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-bold text-slate-800">
        {value}
      </dd>
    </div>
  )
}

function Field({
  name,
  label,
  defaultValue,
  required = false,
}: {
  name: string
  label: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-slate-900">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
      />
    </label>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
      {text}
    </div>
  )
}
