"use server"

import { revalidatePath } from "next/cache"

import { bookingCopy } from "@/lib/bookings/copy"
import {
  createBookingRecord,
  loadBookingCompany,
  normalizeBookingLocale,
  notifyCustomerAboutBookingStatus,
  notifyOwnerAboutBooking,
  validateBookingSchedule,
} from "@/lib/bookings/server"
import {
  BOOKING_FREQUENCIES,
  type BookingFrequency,
  type BookingLocale,
} from "@/lib/bookings/types"
import {
  inferBookingSource,
  sanitizeBookingSourcePath,
} from "@/lib/bookings/utils"
import { createClient } from "@/lib/supabase-server"
import { checkActionRateLimit } from "@/lib/security/rate-limit"

type BookingFieldErrors = Partial<Record<
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "serviceType"
  | "address"
  | "postalCode"
  | "city"
  | "frequency"
  | "startDate"
  | "preferredTime"
  | "durationMinutes"
  | "customerNotes",
  string
>>

export type CompanyBookingFormState = {
  status: "idle" | "success" | "error"
  message: string
  bookingId?: string
  autoConfirmed?: boolean
  fieldErrors?: BookingFieldErrors
}

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function localizedFieldMessage(locale: BookingLocale, field: string) {
  const messages: Record<BookingLocale, Record<string, string>> = {
    sv: { required: "Fältet är obligatoriskt.", email: "Ange en giltig e-postadress.", phone: "Ange ett giltigt telefonnummer.", duration: "Välj en giltig längd.", length: "Fältet innehåller för många tecken.", notes: "Kommentaren får vara högst 2 000 tecken." },
    en: { required: "This field is required.", email: "Enter a valid email address.", phone: "Enter a valid phone number.", duration: "Choose a valid duration.", length: "This field contains too many characters.", notes: "Notes cannot exceed 2,000 characters." },
    uk: { required: "Це поле обов’язкове.", email: "Вкажіть правильний email.", phone: "Вкажіть правильний номер телефону.", duration: "Оберіть правильну тривалість.", length: "У цьому полі забагато символів.", notes: "Коментар не може перевищувати 2 000 символів." },
    ru: { required: "Это поле обязательное.", email: "Укажите корректный email.", phone: "Укажите корректный номер телефона.", duration: "Выберите корректную длительность.", length: "В этом поле слишком много символов.", notes: "Комментарий не может превышать 2 000 символов." },
    pl: { required: "To pole jest wymagane.", email: "Podaj prawidłowy adres email.", phone: "Podaj prawidłowy numer telefonu.", duration: "Wybierz prawidłowy czas trwania.", length: "To pole zawiera zbyt wiele znaków.", notes: "Uwagi nie mogą przekraczać 2 000 znaków." },
  }

  return messages[locale][field] || messages[locale].required
}

export async function submitCompanyBooking(
  _previousState: CompanyBookingFormState,
  formData: FormData,
): Promise<CompanyBookingFormState> {
  const locale = normalizeBookingLocale(getString(formData, "locale"))
  const t = bookingCopy[locale]
  const companyId = getString(formData, "companyId")
  const companySlug = getString(formData, "companySlug")
  const customerName = getString(formData, "customerName")
  const customerEmail = getString(formData, "customerEmail")
  const customerPhone = getString(formData, "customerPhone")
  const serviceType = getString(formData, "serviceType")
  const address = getString(formData, "address")
  const postalCode = getString(formData, "postalCode")
  const city = getString(formData, "city")
  const frequencyRaw = getString(formData, "frequency")
  const startDate = getString(formData, "startDate")
  const preferredTime = getString(formData, "preferredTime")
  const durationRaw = getString(formData, "durationMinutes")
  const customerNotes = getString(formData, "customerNotes")
  const website = getString(formData, "website")
  const sourcePath = sanitizeBookingSourcePath(
    getString(formData, "sourcePath"),
    companySlug,
  )

  if (website) {
    return { status: "success", message: t.bookingSentText }
  }

  const fieldErrors: BookingFieldErrors = {}
  if (!customerName) fieldErrors.customerName = localizedFieldMessage(locale, "required")
  else if (customerName.length > 120) fieldErrors.customerName = localizedFieldMessage(locale, "length")
  if (!customerEmail) fieldErrors.customerEmail = localizedFieldMessage(locale, "required")
  else if (customerEmail.length > 254 || !isValidEmail(customerEmail)) fieldErrors.customerEmail = localizedFieldMessage(locale, "email")
  if (customerPhone && (customerPhone.length > 40 || customerPhone.replace(/\D/g, "").length < 6)) fieldErrors.customerPhone = localizedFieldMessage(locale, "phone")
  if (!serviceType) fieldErrors.serviceType = localizedFieldMessage(locale, "required")
  else if (serviceType.length > 120) fieldErrors.serviceType = localizedFieldMessage(locale, "length")
  if (!address) fieldErrors.address = localizedFieldMessage(locale, "required")
  else if (address.length > 300) fieldErrors.address = localizedFieldMessage(locale, "length")
  if (postalCode.length > 20) fieldErrors.postalCode = localizedFieldMessage(locale, "length")
  if (!city) fieldErrors.city = localizedFieldMessage(locale, "required")
  else if (city.length > 120) fieldErrors.city = localizedFieldMessage(locale, "length")
  if (!startDate) fieldErrors.startDate = localizedFieldMessage(locale, "required")
  if (!preferredTime) fieldErrors.preferredTime = localizedFieldMessage(locale, "required")
  if (customerNotes.length > 2000) fieldErrors.customerNotes = localizedFieldMessage(locale, "notes")

  const durationMinutes = Number(durationRaw)
  if (!Number.isInteger(durationMinutes) || durationMinutes < 30 || durationMinutes > 1440) {
    fieldErrors.durationMinutes = localizedFieldMessage(locale, "duration")
  }

  const frequency = BOOKING_FREQUENCIES.includes(frequencyRaw as BookingFrequency)
    ? (frequencyRaw as BookingFrequency)
    : null
  if (!frequency) fieldErrors.frequency = localizedFieldMessage(locale, "required")

  if (!companyId || !companySlug) {
    return { status: "error", message: t.genericError }
  }

  if (Object.keys(fieldErrors).length > 0 || !frequency) {
    return { status: "error", message: t.validation, fieldErrors }
  }

  const loaded = await loadBookingCompany(companyId, companySlug)
  if (!loaded || !loaded.company.owner_id) {
    return { status: "error", message: t.genericError }
  }

  const { company, settings } = loaded
  if (!settings.booking_enabled) {
    return { status: "error", message: t.bookingDisabled }
  }

  if (frequency !== "one_time" && !settings.recurring_enabled) {
    return { status: "error", message: t.recurringDisabled }
  }

  const schedule = await validateBookingSchedule({
    company,
    settings,
    startDate,
    preferredTime,
    durationMinutes,
    frequency,
  })

  if (schedule.code !== "ok") {
    const message =
      schedule.code === "too-soon"
        ? t.tooSoon
        : schedule.code === "too-far"
          ? t.tooFar
          : schedule.code === "outside-hours"
            ? t.outsideHours
            : schedule.code === "unavailable"
              ? t.unavailable
              : t.validation

    return { status: "error", message }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const rateLimit = await checkActionRateLimit({
    action: "company_booking_request",
    identity: `${company.id}:${customerEmail.toLowerCase()}`,
    identityLimit: 5,
    ipLimit: 20,
    windowSeconds: 15 * 60,
  })

  if (!rateLimit.allowed) {
    return { status: "error", message: t.genericError }
  }

  const booking = await createBookingRecord({
    company,
    settings,
    customerId: user?.id || null,
    customerName,
    customerEmail,
    customerPhone: customerPhone || null,
    serviceType,
    address,
    postalCode: postalCode || null,
    city,
    frequency,
    startDate,
    preferredTime,
    durationMinutes,
    rutRequested: company.rut_available && formData.get("rutRequested") === "on",
    customerNotes: customerNotes || null,
    source: inferBookingSource(sourcePath),
    sourceUrl: sourcePath,
  })

  if (!booking) {
    return { status: "error", message: t.genericError }
  }

  await notifyOwnerAboutBooking({ company, booking, actorId: user?.id || null })

  if (booking.status === "confirmed") {
    await notifyCustomerAboutBookingStatus({
      booking,
      companyName: company.name,
      actorId: company.owner_id,
    })
  }

  revalidatePath(`/companies/${company.slug}`)
  revalidatePath("/dashboard/company-bookings")
  revalidatePath("/dashboard/bookings")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")

  return {
    status: "success",
    message: booking.status === "confirmed" ? t.bookingConfirmedText : t.bookingSentText,
    bookingId: booking.id,
    autoConfirmed: booking.status === "confirmed",
  }
}
