import { createAdminClient } from "@/lib/supabase-admin"

import type {
  BookingFrequency,
  BookingLocale,
  BookingSource,
} from "./types"

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

export type BookingCompanyRow = {
  id: string
  name: string
  slug: string
  owner_id: string | null
  city: string | null
  hourly_rate: number | null
  rut_available: boolean | null
  working_hours: unknown
  service_types: unknown
}

export type BookingSettingsRow = {
  id: string
  company_id: string
  booking_enabled: boolean
  recurring_enabled: boolean
  min_notice_hours: number
  max_days_ahead: number
  default_duration_minutes: number
  buffer_minutes: number
  auto_confirm: boolean
  timezone: string
}

export type ProposedOccurrence = {
  start: Date
  end: Date
}

export type ScheduleValidationCode =
  | "ok"
  | "invalid-date"
  | "too-soon"
  | "too-far"
  | "outside-hours"
  | "unavailable"

const DAY_KEYS: DayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
]

function parseLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null
  }
  return { year, month, day, date }
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

function getTimeZoneOffsetMs(date: Date, timeZone: string) {
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

  const parts = formatter.formatToParts(date)
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  )

  return asUtc - date.getTime()
}

export function zonedDateTimeToUtc(
  dateValue: string,
  timeValue: string,
  timeZone: string,
) {
  const parsedDate = parseLocalDate(dateValue)
  const parsedTime = parseTime(timeValue)
  if (!parsedDate || !parsedTime) return null

  try {
    const wallClockUtc = Date.UTC(
      parsedDate.year,
      parsedDate.month - 1,
      parsedDate.day,
      parsedTime.hour,
      parsedTime.minute,
      0,
    )
    let guess = new Date(wallClockUtc)
    let offset = getTimeZoneOffsetMs(guess, timeZone)
    guess = new Date(wallClockUtc - offset)
    offset = getTimeZoneOffsetMs(guess, timeZone)
    return new Date(wallClockUtc - offset)
  } catch {
    return null
  }
}

function addDays(dateValue: string, days: number) {
  const parsed = parseLocalDate(dateValue)
  if (!parsed) return null
  const date = new Date(parsed.date.getTime())
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function addMonths(dateValue: string, months: number) {
  const parsed = parseLocalDate(dateValue)
  if (!parsed) return null
  const originalDay = parsed.day
  const target = new Date(Date.UTC(parsed.year, parsed.month - 1 + months, 1))
  const year = target.getUTCFullYear()
  const month = target.getUTCMonth()
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const day = Math.min(originalDay, lastDay)
  return new Date(Date.UTC(year, month, day)).toISOString().slice(0, 10)
}

function dateDifferenceDays(start: string, end: string) {
  const a = parseLocalDate(start)?.date
  const b = parseLocalDate(end)?.date
  if (!a || !b) return null
  return Math.floor((b.getTime() - a.getTime()) / 86_400_000)
}

export function buildProposedOccurrences({
  startDate,
  preferredTime,
  durationMinutes,
  frequency,
  timezone,
  maxDaysAhead,
}: {
  startDate: string
  preferredTime: string
  durationMinutes: number
  frequency: BookingFrequency
  timezone: string
  maxDaysAhead: number
}): ProposedOccurrence[] {
  const occurrences: ProposedOccurrence[] = []

  for (let index = 0; index < 60; index += 1) {
    let dateValue: string | null = startDate

    if (frequency === "weekly") dateValue = addDays(startDate, index * 7)
    if (frequency === "biweekly") dateValue = addDays(startDate, index * 14)
    if (frequency === "monthly") dateValue = addMonths(startDate, index)

    if (!dateValue) break

    const diff = dateDifferenceDays(startDate, dateValue)
    if (diff === null || diff > maxDaysAhead) break

    const start = zonedDateTimeToUtc(dateValue, preferredTime, timezone)
    if (!start) break
    const end = new Date(start.getTime() + durationMinutes * 60_000)
    occurrences.push({ start, end })

    if (frequency === "one_time") break
  }

  return occurrences
}

function normalizeWorkingHours(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Partial<Record<DayKey, string>>
  }

  const source = value as Record<string, unknown>
  const result: Partial<Record<DayKey, string>> = {}

  for (const key of DAY_KEYS) {
    if (typeof source[key] === "string") result[key] = source[key]
  }

  return result
}

function timeToMinutes(value: string) {
  const parsed = parseTime(value)
  return parsed ? parsed.hour * 60 + parsed.minute : null
}

function isWithinWorkingHours(
  occurrence: ProposedOccurrence,
  timezone: string,
  workingHours: unknown,
) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
  const startParts = Object.fromEntries(
    formatter.formatToParts(occurrence.start).map((part) => [part.type, part.value]),
  )
  const endParts = Object.fromEntries(
    formatter.formatToParts(occurrence.end).map((part) => [part.type, part.value]),
  )
  const day = String(startParts.weekday || "").toLowerCase() as DayKey
  const schedule = normalizeWorkingHours(workingHours)[day]

  if (!schedule) return true

  const match = schedule.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/)
  if (!match) return false

  const opens = timeToMinutes(match[1].padStart(5, "0"))
  const closes = timeToMinutes(match[2].padStart(5, "0"))
  const startMinutes = Number(startParts.hour) * 60 + Number(startParts.minute)
  const endMinutes = Number(endParts.hour) * 60 + Number(endParts.minute)

  if (opens === null || closes === null) return true
  return startMinutes >= opens && endMinutes <= closes
}

export async function loadBookingCompany(companyId: string, slug?: string) {
  const admin = createAdminClient()
  let companyQuery = admin
    .from("companies")
    .select(
      "id, name, slug, owner_id, city, hourly_rate, rut_available, working_hours, service_types",
    )
    .eq("id", companyId)

  if (slug) companyQuery = companyQuery.eq("slug", slug)

  const { data: companyData, error: companyError } = await companyQuery.maybeSingle()
  if (companyError || !companyData) return null

  const { data: settingsData } = await admin
    .from("company_booking_settings")
    .select(
      "id, company_id, booking_enabled, recurring_enabled, min_notice_hours, max_days_ahead, default_duration_minutes, buffer_minutes, auto_confirm, timezone",
    )
    .eq("company_id", companyId)
    .maybeSingle()

  const company = companyData as BookingCompanyRow
  const settings = (settingsData || {
    id: "",
    company_id: companyId,
    booking_enabled: false,
    recurring_enabled: true,
    min_notice_hours: 24,
    max_days_ahead: 90,
    default_duration_minutes: 180,
    buffer_minutes: 30,
    auto_confirm: false,
    timezone: "Europe/Stockholm",
  }) as BookingSettingsRow

  return { company, settings }
}

export async function validateBookingSchedule({
  company,
  settings,
  startDate,
  preferredTime,
  durationMinutes,
  frequency,
}: {
  company: BookingCompanyRow
  settings: BookingSettingsRow
  startDate: string
  preferredTime: string
  durationMinutes: number
  frequency: BookingFrequency
}): Promise<{ code: ScheduleValidationCode; occurrences: ProposedOccurrence[] }> {
  const occurrences = buildProposedOccurrences({
    startDate,
    preferredTime,
    durationMinutes,
    frequency,
    timezone: settings.timezone,
    maxDaysAhead: settings.max_days_ahead,
  })

  if (occurrences.length === 0) return { code: "invalid-date", occurrences }

  const firstStart = occurrences[0].start
  const noticeMs = settings.min_notice_hours * 60 * 60 * 1000
  if (firstStart.getTime() < Date.now() + noticeMs) {
    return { code: "too-soon", occurrences }
  }

  const today = new Date().toISOString().slice(0, 10)
  const daysAhead = dateDifferenceDays(today, startDate)
  if (daysAhead === null || daysAhead > settings.max_days_ahead) {
    return { code: "too-far", occurrences }
  }

  for (const occurrence of occurrences) {
    if (!isWithinWorkingHours(occurrence, settings.timezone, company.working_hours)) {
      return { code: "outside-hours", occurrences }
    }
  }

  const admin = createAdminClient()
  const bufferMs = settings.buffer_minutes * 60_000

  for (const occurrence of occurrences) {
    const bufferedStart = new Date(occurrence.start.getTime() - bufferMs).toISOString()
    const bufferedEnd = new Date(occurrence.end.getTime() + bufferMs).toISOString()

    const { data, error } = await admin
      .from("company_booking_occurrences")
      .select("id")
      .eq("company_id", company.id)
      .in("status", ["confirmed", "in_progress"])
      .lt("scheduled_start", bufferedEnd)
      .gt("scheduled_end", bufferedStart)
      .limit(1)

    if (error) {
      console.error("Booking conflict lookup error:", error)
      return { code: "unavailable", occurrences }
    }

    if ((data ?? []).length > 0) {
      return { code: "unavailable", occurrences }
    }
  }

  return { code: "ok", occurrences }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com").replace(/\/$/, "")
}

async function sendEmail({
  to,
  replyTo,
  subject,
  text,
  html,
}: {
  to: string
  replyTo?: string
  subject: string
  text: string
  html: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || !to) return

  const from =
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "Clean Jobs <support@cleansjob.com>"

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
      html,
    }),
  })

  if (!response.ok) {
    console.error("Booking email error:", response.status, await response.text())
  }
}

export async function notifyOwnerAboutBooking({
  company,
  booking,
  actorId,
}: {
  company: BookingCompanyRow
  booking: {
    id: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    service_type: string
    city: string
    start_date: string
    preferred_time: string
    frequency: string
    status: string
  }
  actorId: string | null
}) {
  if (!company.owner_id || company.owner_id === actorId) return

  const admin = createAdminClient()
  const href = `/dashboard/company-bookings/${booking.id}`

  const { error: notificationError } = await admin.from("notifications").upsert(
    {
      user_id: company.owner_id,
      actor_id: actorId,
      job_id: null,
      application_id: null,
      type: "company_booking_request",
      title: `Ny bokningsförfrågan för ${company.name}`,
      message: `${booking.customer_name} vill boka ${booking.service_type} i ${booking.city}.`,
      is_read: false,
      href,
      entity_type: "company_booking",
      entity_id: booking.id,
      dedupe_key: `company_booking_request:${booking.id}`,
    },
    { onConflict: "dedupe_key", ignoreDuplicates: true },
  )

  if (notificationError) {
    console.error("Booking owner notification error:", notificationError)
  }

  const { data: ownerData } = await admin.auth.admin.getUserById(company.owner_id)
  const recipient = ownerData.user?.email?.trim()
  if (!recipient) return

  const url = `${getSiteUrl()}${href}`
  const safeCompany = escapeHtml(company.name)
  const safeCustomer = escapeHtml(booking.customer_name)
  const safeService = escapeHtml(booking.service_type)
  const safeCity = escapeHtml(booking.city)

  await sendEmail({
    to: recipient,
    replyTo: booking.customer_email,
    subject: `Ny bokningsförfrågan för ${company.name}`,
    text: [
      `Ny bokningsförfrågan för ${company.name}`,
      `Kund: ${booking.customer_name}`,
      `Tjänst: ${booking.service_type}`,
      `Ort: ${booking.city}`,
      `Datum: ${booking.start_date}`,
      `Tid: ${booking.preferred_time}`,
      `Frekvens: ${booking.frequency}`,
      `Öppna bokningen: ${url}`,
    ].join("\n"),
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px"><p style="color:#e11d48;font-weight:700">Clean Jobs</p><h1>Ny bokningsförfrågan för ${safeCompany}</h1><p><strong>Kund:</strong> ${safeCustomer}</p><p><strong>Tjänst:</strong> ${safeService}</p><p><strong>Ort:</strong> ${safeCity}</p><p><strong>Datum:</strong> ${escapeHtml(booking.start_date)} · ${escapeHtml(booking.preferred_time)}</p><a href="${url}" style="display:inline-block;margin-top:14px;padding:12px 18px;border-radius:12px;background:#e11d48;color:white;text-decoration:none;font-weight:700">Öppna bokningen</a></div>`,
  })
}

const STATUS_SUBJECT: Record<string, string> = {
  confirmed: "Din bokning är bekräftad",
  declined: "Din bokningsförfrågan avböjdes",
  cancelled: "Din bokning har avbokats",
  in_progress: "Din bokning har startat",
  completed: "Din bokning är klar",
}

export async function notifyCustomerAboutBookingStatus({
  booking,
  companyName,
  actorId,
}: {
  booking: {
    id: string
    customer_id: string | null
    customer_email: string
    customer_name: string
    service_type: string
    start_date: string
    preferred_time: string
    status: string
  }
  companyName: string
  actorId: string | null
}) {
  const admin = createAdminClient()
  const href = `/dashboard/bookings/${booking.id}`
  const title = STATUS_SUBJECT[booking.status] || "Bokningen har uppdaterats"

  if (booking.customer_id && booking.customer_id !== actorId) {
    const { error } = await admin.from("notifications").insert({
      user_id: booking.customer_id,
      actor_id: actorId,
      job_id: null,
      application_id: null,
      type: "booking_status_changed",
      title,
      message: `${companyName}: ${booking.service_type} · ${booking.start_date} ${booking.preferred_time}`,
      is_read: false,
      href,
      entity_type: "company_booking",
      entity_id: booking.id,
      dedupe_key: `booking_status:${booking.id}:${booking.status}:${Date.now()}`,
    })

    if (error) console.error("Booking customer notification error:", error)
  }

  const siteUrl = getSiteUrl()
  const publicHref = booking.customer_id ? `${siteUrl}${href}` : `${siteUrl}/companies`
  await sendEmail({
    to: booking.customer_email,
    subject: `${title} – ${companyName}`,
    text: [
      title,
      `Företag: ${companyName}`,
      `Tjänst: ${booking.service_type}`,
      `Datum: ${booking.start_date}`,
      `Tid: ${booking.preferred_time}`,
      `Status: ${booking.status}`,
      booking.customer_id ? `Öppna bokningen: ${publicHref}` : "",
    ].filter(Boolean).join("\n"),
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px"><p style="color:#e11d48;font-weight:700">Clean Jobs</p><h1>${escapeHtml(title)}</h1><p><strong>Företag:</strong> ${escapeHtml(companyName)}</p><p><strong>Tjänst:</strong> ${escapeHtml(booking.service_type)}</p><p><strong>Datum:</strong> ${escapeHtml(booking.start_date)} · ${escapeHtml(booking.preferred_time)}</p>${booking.customer_id ? `<a href="${publicHref}" style="display:inline-block;margin-top:14px;padding:12px 18px;border-radius:12px;background:#e11d48;color:white;text-decoration:none;font-weight:700">Öppna bokningen</a>` : ""}</div>`,
  })
}

export async function createBookingRecord({
  company,
  settings,
  customerId,
  quoteRequestId,
  customerName,
  customerEmail,
  customerPhone,
  serviceType,
  address,
  postalCode,
  city,
  frequency,
  startDate,
  preferredTime,
  durationMinutes,
  rutRequested,
  customerNotes,
  source,
  sourceUrl,
}: {
  company: BookingCompanyRow
  settings: BookingSettingsRow
  customerId: string | null
  quoteRequestId?: string | null
  customerName: string
  customerEmail: string
  customerPhone: string | null
  serviceType: string
  address: string
  postalCode: string | null
  city: string
  frequency: BookingFrequency
  startDate: string
  preferredTime: string
  durationMinutes: number
  rutRequested: boolean
  customerNotes: string | null
  source: BookingSource
  sourceUrl: string | null
}) {
  const admin = createAdminClient()
  const estimatedPrice = company.hourly_rate
    ? Math.round(company.hourly_rate * (durationMinutes / 60) * 100) / 100
    : null
  const status = settings.auto_confirm ? "confirmed" : "pending"

  const { data, error } = await admin
    .from("company_bookings")
    .insert({
      company_id: company.id,
      customer_id: customerId,
      quote_request_id: quoteRequestId || null,
      customer_name: customerName,
      customer_email: customerEmail.toLowerCase(),
      customer_phone: customerPhone,
      service_type: serviceType,
      address,
      postal_code: postalCode,
      city,
      frequency,
      start_date: startDate,
      preferred_time: preferredTime,
      duration_minutes: durationMinutes,
      rut_requested: rutRequested,
      customer_notes: customerNotes,
      status,
      estimated_price: estimatedPrice,
      currency: "SEK",
      source,
      source_url: sourceUrl,
      timezone: settings.timezone,
      payment_status: "unpaid",
      confirmed_at: status === "confirmed" ? new Date().toISOString() : null,
    })
    .select(
      "id, customer_id, customer_name, customer_email, customer_phone, service_type, city, start_date, preferred_time, frequency, status, estimated_price",
    )
    .single()

  if (error || !data) {
    console.error("Create company booking error:", error)
    return null
  }

  return data as {
    id: string
    customer_id: string | null
    customer_name: string
    customer_email: string
    customer_phone: string | null
    service_type: string
    city: string
    start_date: string
    preferred_time: string
    frequency: string
    status: string
    estimated_price: number | string | null
  }
}


export async function notifyOwnerAboutBookingCancellation({
  companyId,
  bookingId,
  customerName,
  serviceType,
  actorId,
}: {
  companyId: string
  bookingId: string
  customerName: string
  serviceType: string
  actorId: string
}) {
  const admin = createAdminClient()
  const { data: company } = await admin
    .from("companies")
    .select("id, name, owner_id")
    .eq("id", companyId)
    .maybeSingle()

  if (!company?.owner_id || company.owner_id === actorId) return

  const href = `/dashboard/company-bookings/${bookingId}`
  const { error: notificationError } = await admin.from("notifications").insert({
    user_id: company.owner_id,
    actor_id: actorId,
    job_id: null,
    application_id: null,
    type: "company_booking_cancelled",
    title: `Bokning avbokad av ${customerName}`,
    message: `${serviceType} · ${company.name}`,
    is_read: false,
    href,
    entity_type: "company_booking",
    entity_id: bookingId,
    dedupe_key: `booking_customer_cancelled:${bookingId}:${Date.now()}`,
  })
  if (notificationError) console.error("Customer cancellation notification error:", notificationError)

  const { data: ownerData } = await admin.auth.admin.getUserById(company.owner_id)
  const recipient = ownerData.user?.email?.trim()
  if (!recipient) return

  await sendEmail({
    to: recipient,
    subject: `Bokning avbokad – ${company.name}`,
    text: `${customerName} har avbokat ${serviceType}.\nÖppna bokningen: ${getSiteUrl()}${href}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px"><p style="color:#e11d48;font-weight:700">Clean Jobs</p><h1>Bokning avbokad</h1><p><strong>${escapeHtml(customerName)}</strong> har avbokat ${escapeHtml(serviceType)}.</p><a href="${getSiteUrl()}${href}" style="display:inline-block;margin-top:14px;padding:12px 18px;border-radius:12px;background:#e11d48;color:white;text-decoration:none;font-weight:700">Öppna bokningen</a></div>`,
  })
}

export function normalizeBookingLocale(value: string): BookingLocale {
  return ["sv", "en", "uk", "ru", "pl"].includes(value)
    ? (value as BookingLocale)
    : "sv"
}
