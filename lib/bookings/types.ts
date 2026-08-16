export const BOOKING_FREQUENCIES = [
  "one_time",
  "weekly",
  "biweekly",
  "monthly",
] as const

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "declined",
  "cancelled",
] as const

export const BOOKING_OCCURRENCE_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const

export const BOOKING_SOURCES = [
  "company_profile",
  "company_site",
  "lead_conversion",
  "manual",
  "admin",
] as const

export type BookingFrequency = (typeof BOOKING_FREQUENCIES)[number]
export type BookingStatus = (typeof BOOKING_STATUSES)[number]
export type BookingOccurrenceStatus =
  (typeof BOOKING_OCCURRENCE_STATUSES)[number]
export type BookingSource = (typeof BOOKING_SOURCES)[number]
export type BookingLocale = "sv" | "en" | "uk" | "ru" | "pl"

export type CompanyBookingSettings = {
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
  created_at: string
  updated_at: string
}

export type CompanyBooking = {
  id: string
  company_id: string
  customer_id: string | null
  quote_request_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_type: string
  address: string
  postal_code: string | null
  city: string
  frequency: BookingFrequency
  start_date: string
  preferred_time: string
  duration_minutes: number
  rut_requested: boolean
  customer_notes: string | null
  status: BookingStatus
  estimated_price: number | string | null
  agreed_price: number | string | null
  currency: "SEK"
  source: BookingSource
  source_url: string | null
  timezone: string
  payment_status: "unpaid" | "pending" | "paid" | "refunded" | "failed"
  stripe_payment_intent_id: string | null
  payment_required: boolean
  payment_amount: number | string | null
  platform_fee_amount: number | string | null
  platform_fee_percent: number | string | null
  paid_at: string | null
  refunded_at: string | null
  stripe_checkout_session_id: string | null
  confirmed_at: string | null
  declined_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancelled_by: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}

export type CompanyBookingOccurrence = {
  id: string
  booking_id: string
  company_id: string
  sequence_no: number
  scheduled_start: string
  scheduled_end: string
  status: BookingOccurrenceStatus
  price: number | string | null
  confirmed_at: string | null
  started_at: string | null
  completed_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string
  updated_at: string
}
