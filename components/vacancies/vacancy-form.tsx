"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import type { VacancyActionState } from "@/app/lediga-jobb/actions"
import type { Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"

const initialState: VacancyActionState = { success: false, message: "" }

type VacancyDefaults = {
  id?: string
  slug?: string
  title?: string | null
  company_name?: string | null
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

export default function VacancyForm({ action, defaults = {}, submitLabel, locale }: Props) {
  const [state, formAction] = useActionState(action, initialState)
  const t = getVacancyDictionary(locale).form

  return (
    <form action={formAction} className="space-y-5">
      {defaults.id ? <input type="hidden" name="vacancy_id" value={defaults.id} /> : null}
      {defaults.slug ? <input type="hidden" name="slug" value={defaults.slug} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">{t.title} *<input name="title" required maxLength={140} defaultValue={defaults.title || ""} placeholder={t.titlePlaceholder} className={inputClass} /></label>
        <label className="text-sm font-semibold text-slate-800">{t.company} *<input name="company_name" required maxLength={160} defaultValue={defaults.company_name || ""} placeholder={t.companyPlaceholder} className={inputClass} /></label>
        <label className="text-sm font-semibold text-slate-800">{t.city} *<input name="city" required maxLength={120} defaultValue={defaults.city || ""} placeholder={t.cityPlaceholder} className={inputClass} /></label>
        <label className="text-sm font-semibold text-slate-800">{t.schedule}<input name="schedule" maxLength={160} defaultValue={defaults.schedule || ""} placeholder={t.schedulePlaceholder} className={inputClass} /></label>
        <label className="text-sm font-semibold text-slate-800 md:col-span-2">{t.salary}<div className="relative mt-2"><input type="number" inputMode="decimal" name="salary" min="1" step="1" defaultValue={numericSalaryDefault(defaults.salary)} placeholder={t.salaryPlaceholder} className={`${inputClass} mt-0 pr-32`} /><span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">{t.salaryUnit}</span></div></label>
      </div>
      <label className="block text-sm font-semibold text-slate-800">{t.description} *<textarea name="description" required minLength={20} maxLength={10000} rows={9} defaultValue={defaults.description || ""} placeholder={t.descriptionPlaceholder} className={inputClass} /></label>
      <label className="block text-sm font-semibold text-slate-800">{t.requirements}<textarea name="requirements" maxLength={5000} rows={6} defaultValue={defaults.requirements || ""} placeholder={t.requirementsPlaceholder} className={inputClass} /></label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-800">{t.email}<input type="email" name="contact_email" maxLength={320} defaultValue={defaults.contact_email || ""} placeholder={t.emailPlaceholder} className={inputClass} /></label>
        <label className="text-sm font-semibold text-slate-800">{t.phone}<input name="contact_phone" maxLength={60} defaultValue={defaults.contact_phone || ""} placeholder={t.phonePlaceholder} className={inputClass} /></label>
      </div>
      <p className="text-xs text-slate-500">{t.contactHint}</p>
      {state.message ? <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{state.message}</p> : null}
      <SubmitButton label={submitLabel} saving={t.saving} />
    </form>
  )
}
