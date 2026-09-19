import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"

import VacancyForm from "@/components/vacancies/vacancy-form"
import { updateVacancyAction } from "@/app/lediga-jobb/actions"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { isVacancyListingType } from "@/lib/vacancies/types"

export const metadata: Metadata = { title: "Redigera jobbannons", robots: { index: false, follow: true } }
type Props = { params: Promise<{ slug: string }> }

export default async function EditVacancyPage({ params }: Props) {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).edit
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/lediga-jobb/${slug}/edit`)

  const { data: vacancy } = await supabase
    .from("vacancies")
    .select("id,slug,listing_type,title,company_name,person_name,city,description,schedule,salary,requirements,contact_email,contact_phone,created_by")
    .eq("slug", slug)
    .maybeSingle()

  if (!vacancy || vacancy.created_by !== user.id || !isVacancyListingType(vacancy.listing_type)) notFound()
  const isOffer = vacancy.listing_type === "job_offer"

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href={`/lediga-jobb/${slug}`} className="text-sm font-semibold text-rose-700">← {t.back}</Link>
      <div className="mt-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
        <h1 className="text-3xl font-black text-slate-950">{isOffer ? t.offerTitle : t.seekerTitle}</h1>
        <div className="mt-8"><VacancyForm action={updateVacancyAction} defaults={vacancy} submitLabel={t.save} locale={locale} listingType={vacancy.listing_type} /></div>
      </div>
    </main>
  )
}
