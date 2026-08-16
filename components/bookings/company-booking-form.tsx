"use client"

import { useActionState } from "react"
import { usePathname } from "next/navigation"
import { useFormStatus } from "react-dom"

import {
  submitCompanyBooking,
  type CompanyBookingFormState,
} from "@/app/bookings/actions"
import { bookingCopy } from "@/lib/bookings/copy"
import type { BookingLocale } from "@/lib/bookings/types"

type Props = {
  companyId: string
  companySlug: string
  companyName: string
  locale: BookingLocale
  serviceTypes: string[]
  defaultCity?: string
  defaultEmail?: string
  defaultDurationMinutes?: number
  recurringEnabled?: boolean
  rutAvailable?: boolean
  isAuthenticated?: boolean
}

const initialState: CompanyBookingFormState = {
  status: "idle",
  message: "",
}

const fallbackServices: Record<BookingLocale, string[]> = {
  sv: ["Hemstädning", "Flyttstädning", "Kontorsstädning", "Fönsterputsning", "Byggstädning", "Annan städtjänst"],
  en: ["Home cleaning", "Move-out cleaning", "Office cleaning", "Window cleaning", "Construction cleaning", "Other cleaning service"],
  uk: ["Домашнє прибирання", "Прибирання після переїзду", "Прибирання офісу", "Миття вікон", "Будівельне прибирання", "Інша послуга"],
  ru: ["Домашняя уборка", "Уборка после переезда", "Уборка офиса", "Мытье окон", "Строительная уборка", "Другая услуга"],
  pl: ["Sprzątanie domu", "Sprzątanie po przeprowadzce", "Sprzątanie biura", "Mycie okien", "Sprzątanie budowlane", "Inna usługa"],
}

export function CompanyBookingForm({
  companyId,
  companySlug,
  companyName,
  locale,
  serviceTypes,
  defaultCity = "",
  defaultEmail = "",
  defaultDurationMinutes = 180,
  recurringEnabled = true,
  rutAvailable = false,
  isAuthenticated = false,
}: Props) {
  const t = bookingCopy[locale]
  const pathname = usePathname()
  const [state, formAction] = useActionState(submitCompanyBooking, initialState)
  const services = serviceTypes.length > 0 ? serviceTypes : fallbackServices[locale]
  const durationOptions = Array.from(new Set([60, 120, 180, 240, 300, 360, 480, defaultDurationMinutes])).filter((value) => value >= 30 && value <= 1440).sort((a, b) => a - b)

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-700">✓</div>
        <h3 className="mt-5 text-2xl font-black text-emerald-950">
          {state.autoConfirmed ? t.bookingConfirmed : t.bookingSent}
        </h3>
        <p className="mt-3 leading-7 text-emerald-800">{state.message}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {state.bookingId && isAuthenticated ? (
            <a href={`/dashboard/bookings/${state.bookingId}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white">
              {t.open}
            </a>
          ) : null}
          <button type="button" onClick={() => window.location.reload()} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100">
            {t.sendAnother}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{t.bookingFormTitle}</h2>
      <p className="mt-3 leading-7 text-slate-600">{t.bookingFormText.replace("the company", companyName)}</p>

      <form action={formAction} className="mt-7 grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="companySlug" value={companySlug} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="sourcePath" value={pathname || `/companies/${companySlug}`} />

        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor={`booking-website-${companyId}`}>Website</label>
          <input id={`booking-website-${companyId}`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Field name="customerName" label={t.name} error={state.fieldErrors?.customerName} required />
        <Field name="customerEmail" type="email" label={t.email} defaultValue={defaultEmail} error={state.fieldErrors?.customerEmail} required />
        <Field name="customerPhone" type="tel" label={t.phone} error={state.fieldErrors?.customerPhone} />

        <label className="block">
          <span className="text-sm font-bold text-slate-900">{t.service}</span>
          <select name="serviceType" required className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100">
            <option value="">{t.chooseService}</option>
            {services.map((service) => <option key={service} value={service}>{service}</option>)}
          </select>
          <FieldError message={state.fieldErrors?.serviceType} />
        </label>

        <Field name="address" label={t.address} error={state.fieldErrors?.address} required />
        <Field name="postalCode" label={t.postalCode} error={state.fieldErrors?.postalCode} />
        <Field name="city" label={t.city} defaultValue={defaultCity} error={state.fieldErrors?.city} required />

        <label className="block">
          <span className="text-sm font-bold text-slate-900">{t.frequency}</span>
          <select name="frequency" defaultValue="one_time" className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100">
            <option value="one_time">{t.one_time}</option>
            {recurringEnabled ? <option value="weekly">{t.weekly}</option> : null}
            {recurringEnabled ? <option value="biweekly">{t.biweekly}</option> : null}
            {recurringEnabled ? <option value="monthly">{t.monthly}</option> : null}
          </select>
          <FieldError message={state.fieldErrors?.frequency} />
        </label>

        <Field name="startDate" type="date" label={t.date} error={state.fieldErrors?.startDate} required />
        <Field name="preferredTime" type="time" label={t.time} error={state.fieldErrors?.preferredTime} required />

        <label className="block">
          <span className="text-sm font-bold text-slate-900">{t.duration}</span>
          <select name="durationMinutes" defaultValue={String(defaultDurationMinutes)} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100">
            {durationOptions.map((minutes) => (
              <option key={minutes} value={minutes}>{minutes / 60} {t.hours}</option>
            ))}
          </select>
          <FieldError message={state.fieldErrors?.durationMinutes} />
        </label>

        {rutAvailable ? (
          <label className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:col-span-2">
            <input type="checkbox" name="rutRequested" className="mt-1 h-4 w-4 rounded border-slate-300" />
            <span className="text-sm font-semibold leading-6 text-emerald-900">{t.rut}</span>
          </label>
        ) : null}

        <label className="sm:col-span-2">
          <span className="text-sm font-bold text-slate-900">{t.notes}</span>
          <textarea name="customerNotes" rows={4} maxLength={2000} placeholder={t.notesPlaceholder} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100" />
          <FieldError message={state.fieldErrors?.customerNotes} />
        </label>

        {state.status === "error" && state.message ? (
          <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{state.message}</div>
        ) : null}

        <div className="sm:col-span-2"><SubmitButton idle={t.submitBooking} pending={t.submittingBooking} /></div>
      </form>
    </div>
  )
}

function Field({ name, label, type = "text", defaultValue, error, required = false }: { name: string; label: string; type?: string; defaultValue?: string; error?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      <input name={name} type={type} defaultValue={defaultValue} required={required} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100" />
      <FieldError message={error} />
    </label>
  )
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-xs font-semibold text-red-700">{message}</p> : null
}

function SubmitButton({ idle, pending }: { idle: string; pending: string }) {
  const formStatus = useFormStatus()
  return <button type="submit" disabled={formStatus.pending} className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 text-sm font-black text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">{formStatus.pending ? pending : idle}</button>
}
