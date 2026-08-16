import {
  BOOKING_FREQUENCIES,
  BOOKING_OCCURRENCE_STATUSES,
  BOOKING_SOURCES,
  BOOKING_STATUSES,
  type BookingFrequency,
  type BookingOccurrenceStatus,
  type BookingSource,
  type BookingStatus,
} from "./types"

export function normalizeBookingFrequency(value: unknown): BookingFrequency {
  return BOOKING_FREQUENCIES.includes(value as BookingFrequency)
    ? (value as BookingFrequency)
    : "one_time"
}

export function normalizeBookingStatus(value: unknown): BookingStatus {
  return BOOKING_STATUSES.includes(value as BookingStatus)
    ? (value as BookingStatus)
    : "pending"
}

export function normalizeBookingOccurrenceStatus(
  value: unknown,
): BookingOccurrenceStatus {
  return BOOKING_OCCURRENCE_STATUSES.includes(value as BookingOccurrenceStatus)
    ? (value as BookingOccurrenceStatus)
    : "pending"
}

export function normalizeBookingSource(value: unknown): BookingSource {
  return BOOKING_SOURCES.includes(value as BookingSource)
    ? (value as BookingSource)
    : "company_profile"
}

export function inferBookingSource(pathname: string): BookingSource {
  if (pathname.startsWith("/site/")) return "company_site"
  if (pathname.startsWith("/dashboard/company-leads/")) return "lead_conversion"
  if (pathname.startsWith("/admin")) return "admin"
  return "company_profile"
}

export function sanitizeBookingSourcePath(
  value: string,
  companySlug?: string,
) {
  const fallback = companySlug ? `/companies/${companySlug}` : "/companies"
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  return value.slice(0, 500)
}

export function numberValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatBookingMoney(
  value: number | string | null | undefined,
  currency = "SEK",
) {
  const parsed = numberValue(value)
  if (parsed <= 0) return "—"
  return `${Math.round(parsed).toLocaleString("sv-SE")} ${currency}`
}
