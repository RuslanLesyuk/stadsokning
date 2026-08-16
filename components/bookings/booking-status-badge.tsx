import { bookingCopy } from "@/lib/bookings/copy"
import type { BookingLocale } from "@/lib/bookings/types"
import { normalizeBookingOccurrenceStatus, normalizeBookingStatus } from "@/lib/bookings/utils"

export function BookingStatusBadge({
  status,
  locale,
  occurrence = false,
}: {
  status: string
  locale: BookingLocale
  occurrence?: boolean
}) {
  const normalized = occurrence
    ? normalizeBookingOccurrenceStatus(status)
    : normalizeBookingStatus(status)
  const t = bookingCopy[locale]
  const style: Record<string, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    confirmed: "border-sky-200 bg-sky-50 text-sky-800",
    in_progress: "border-violet-200 bg-violet-50 text-violet-800",
    completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
    declined: "border-red-200 bg-red-50 text-red-800",
    cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  }

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${style[normalized] || style.pending}`}>
      {t[normalized]}
    </span>
  )
}
