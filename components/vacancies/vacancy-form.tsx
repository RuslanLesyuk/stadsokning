"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import type { VacancyActionState } from "@/app/lediga-jobb/actions"
import type { Locale } from "@/lib/i18n"
import { vacancyCities } from "@/lib/vacancies/cities"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import type { VacancyListingType } from "@/lib/vacancies/types"

const initialState: VacancyActionState = { success: false, message: "" }

type VacancyDefaults = {
  id?: string
  slug?: string
  listing_type?: VacancyListingType | null
  title?: string | null
  company_name?: string | null
  person_name?: string | null
  city?: string | null
  description?: string | null
  schedule?: string | null
  salary?: string | null
  requirements?: string | null
  contact_email?: string | null
  contact_phone?: string | null
}

type Props = {
  action: (state: VacancyActionState, formData: FormData) => Promise<VacancyActionState>
  defaults?: VacancyDefaults
  submitLabel: string
  locale: Locale
  listingType?: VacancyListingType
}

function SubmitButton({ label, saving }: { label: string; saving: string }) {
  const { pending } = useFormStatus()
  return <button type="submit" disabled={pending} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">{pending ? saving : label}</button>
}

const inputClass = "mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"

function numericSalaryDefault(value?: string | null) {
  if (!value) return ""
  const match = value.match(/\d+(?:[.,]\d+)?/)
  return match ? match[0].replace(",", ".") : ""
}

export default function VacancyForm({ action, defaults = {}, submitLabel, locale, listingType = "job_offer" }: Props) {
  const [state, formAction] = useActionState(action, initialState)
  const t = getVacancyDictionary(locale).form
  const type = defaults.listing_type || listingType
  const isOffer = type === "job_offer"

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="listing_type" value={type} />
      {defaults.id ? <input type="hidden" name="vacancy_id" value={defaults.id} /> : null}
      {defaults.slug ? <input type="hidden" name="slug" value={defaults.slug} /> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">
          {isOffer ? t.offerTitle : t.seekerTitle} *
          <input name="title" required maxLength={140} defaultValue={defaults.title || ""} placeholder={isOffer ? t.offerTitlePlaceholder : t.seekerTitlePlaceholder} className={inputClass} />
        </label>

        {isOffer ? (
          <label className="text-sm font-semibold text-slate-800">
            {t.company} *
            <input name="company_name" required maxLength={160} defaultValue={defaults.company_name || ""} placeholder={t.companyPlaceholder} className={inputClass} />
          </label>
        ) : (
          <label className="text-sm font-semibold text-slate-800">
            {t.personName} *
            <input name="person_name" required maxLength={160} defaultValue={defaults.person_name || ""} placeholder={t.personNamePlaceholder} className={inputClass} />
          </label>
        )}

        <label className="text-sm font-semibold text-slate-800">
          {t.city} *
          <input name="city" list="vacancy-form-city-options" required maxLength={120} defaultValue={defaults.city || ""} placeholder={t.cityPlaceholder} autoComplete="off" className={inputClass} />
          <datalist id="vacancy-form-city-options">
            {vacancyCities.map((city) => <option key={city} value={city} />)}
          </datalist>
        </label>

        <label className="text-sm font-semibold text-slate-800">
          {isOffer ? t.offerSchedule : t.seekerSchedule}
          <input name="schedule" maxLength={160} defaultValue={defaults.schedule || ""} placeholder={isOffer ? t.offerSchedulePlaceholder : t.seekerSchedulePlaceholder} className={inputClass} />
        </label>

        <label className="text-sm font-semibold text-slate-800 md:col-span-2">
          {isOffer ? t.offerSalary : t.seekerSalary}
          <div className="relative mt-2">
            <input type="number" inputMode="decimal" name="salary" min="1" step="1" defaultValue={numericSalaryDefault(defaults.salary)} placeholder={t.salaryPlaceholder} className={`${inputClass} mt-0 pr-32`} />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">{t.salaryUnit}</span>
          </div>
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-800">
        {isOffer ? t.offerDescription : t.seekerDescription} *
        <textarea name="description" required minLength={20} maxLength={10000} rows={9} defaultValue={defaults.description || ""} placeholder={isOffer ? t.offerDescriptionPlaceholder : t.seekerDescriptionPlaceholder} className={inputClass} />
      </label>

      <label className="block text-sm font-semibold text-slate-800">
        {isOffer ? t.offerRequirements : t.seekerRequirements}
        <textarea name="requirements" maxLength={5000} rows={6} defaultValue={defaults.requirements || ""} placeholder={isOffer ? t.offerRequirementsPlaceholder : t.seekerRequirementsPlaceholder} className={inputClass} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">
          {t.email}
          <input type="email" name="contact_email" maxLength={320} defaultValue={defaults.contact_email || ""} placeholder={t.emailPlaceholder} className={inputClass} />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          {t.phone}
          <input name="contact_phone" maxLength={60} defaultValue={defaults.contact_phone || ""} placeholder={t.phonePlaceholder} className={inputClass} />
        </label>
      </div>

      <p className="text-xs text-slate-500">{t.contactHint}</p>
      {state.message ? <div className={`rounded-2xl p-4 text-sm font-medium ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{state.message}</div> : null}
      <SubmitButton label={submitLabel} saving={t.saving} />
    </form>
  )
}
