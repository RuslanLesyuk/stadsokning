"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { applyToVacancyAction, type VacancyActionState } from "@/app/lediga-jobb/actions"
import type { Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"

const initialState: VacancyActionState = { success: false, message: "" }

function Submit({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = getVacancyDictionary(locale).application
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60">{pending ? t.sending : t.submit}</button>
}

export default function VacancyApplicationForm({ vacancyId, vacancySlug, defaultEmail = "", locale }: { vacancyId: string; vacancySlug: string; defaultEmail?: string; locale: Locale }) {
  const [state, action] = useActionState(applyToVacancyAction, initialState)
  const t = getVacancyDictionary(locale).application
  const field = "mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
  return <form action={action} className="space-y-4"><input type="hidden" name="vacancy_id" value={vacancyId}/><input type="hidden" name="vacancy_slug" value={vacancySlug}/><div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold text-slate-800">{t.name} *<input name="applicant_name" required maxLength={160} className={field}/></label><label className="text-sm font-semibold text-slate-800">{t.email} *<input name="email" type="email" required maxLength={320} defaultValue={defaultEmail} className={field}/></label><label className="text-sm font-semibold text-slate-800 md:col-span-2">{t.phone}<input name="phone" maxLength={60} className={field}/></label></div><label className="block text-sm font-semibold text-slate-800">{t.message} *<textarea name="message" required minLength={10} maxLength={3000} rows={5} className={field} placeholder={t.messagePlaceholder}/></label>{state.message ? <p className={`rounded-2xl px-4 py-3 text-sm ${state.success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>{state.message}</p> : null}{!state.success ? <Submit locale={locale}/> : null}</form>
}
