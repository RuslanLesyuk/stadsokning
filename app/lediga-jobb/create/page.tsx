import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import VacancyForm from "@/components/vacancies/vacancy-form"
import { createVacancyAction } from "@/app/lediga-jobb/actions"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { canPublishVacancy, VACANCY_POSTING_REQUIRES_PREMIUM } from "@/lib/vacancies/config"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { listingTypeFromQuery } from "@/lib/vacancies/types"

export const metadata: Metadata = { title: "Publicera jobbannons", robots: { index: false, follow: true } }

type Props = { searchParams: Promise<{ type?: string }> }

export default async function CreateVacancyPage({ searchParams }: Props) {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).create
  const { type } = await searchParams
  const listingType = listingTypeFromQuery(type)
  const isOffer = listingType === "job_offer"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/lediga-jobb/create?type=${isOffer ? "offering" : "seeking"}`)}`)
  const allowed = await canPublishVacancy(user.id)

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href={`/lediga-jobb?type=${isOffer ? "offering" : "seeking"}`} className="text-sm font-semibold text-rose-700">← {t.back}</Link>
      <div className="mt-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-700">{isOffer ? t.offerEyebrow : t.seekerEyebrow}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">{isOffer ? t.offerTitle : t.seekerTitle}</h1>
            <p className="mt-3 text-slate-600">{VACANCY_POSTING_REQUIRES_PREMIUM ? t.premiumFeature : t.freeLaunch}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/lediga-jobb/create?type=offering" className={`rounded-xl px-4 py-2 text-sm font-semibold ${isOffer ? "bg-slate-950 text-white" : "border border-slate-300 text-slate-700"}`}>{t.switchToOffer}</Link>
            <Link href="/lediga-jobb/create?type=seeking" className={`rounded-xl px-4 py-2 text-sm font-semibold ${!isOffer ? "bg-slate-950 text-white" : "border border-slate-300 text-slate-700"}`}>{t.switchToSeeker}</Link>
          </div>
        </div>

        {!allowed ? (
          <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-amber-900">{t.premiumRequired} <Link href="/billing" className="font-bold underline">{t.seePremium}</Link></div>
        ) : (
          <div className="mt-8">
            <VacancyForm action={createVacancyAction} submitLabel={isOffer ? t.publishOffer : t.publishSeeker} locale={locale} listingType={listingType} />
          </div>
        )}
      </div>
    </main>
  )
}
