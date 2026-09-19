import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers"

import VacancyApplicationForm from "@/components/vacancies/vacancy-application-form"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { formatVacancyCreatedAt } from "@/lib/vacancies/date"
import { formatVacancySalary } from "@/lib/vacancies/salary"

type Props = { params: Promise<{ slug: string }> }

async function getVacancy(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("vacancies")
    .select("id,slug,listing_type,title,company_name,person_name,city,description,schedule,salary,requirements,contact_email,contact_phone,status,created_by,created_at")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).detail
  const vacancy = await getVacancy(slug)
  if (!vacancy) return { title: t.notFound, robots: { index: false, follow: false } }

  const isSeeker = vacancy.listing_type === "job_seeker"
  const identity = isSeeker ? vacancy.person_name || "" : vacancy.company_name || ""
  const description = isSeeker
    ? t.seekerMetaDescription(vacancy.title, identity, vacancy.city)
    : t.offerMetaDescription(vacancy.title, identity, vacancy.city)

  return {
    title: `${vacancy.title} – ${identity} – ${vacancy.city}`,
    description,
    alternates: { canonical: `/lediga-jobb/${vacancy.slug}` },
    openGraph: {
      title: `${vacancy.title} – ${identity}`,
      description: isSeeker ? t.seekerOgDescription(vacancy.city) : t.offerOgDescription(vacancy.city),
      type: "website",
      url: `https://cleansjob.com/lediga-jobb/${vacancy.slug}`,
    },
  }
}

export default async function VacancyDetailPage({ params }: Props) {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).detail
  const { slug } = await params
  const vacancy = await getVacancy(slug)
  if (!vacancy) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(`/lediga-jobb/${vacancy.slug}`)}`)

  const isSeeker = vacancy.listing_type === "job_seeker"
  const identity = isSeeker ? vacancy.person_name : vacancy.company_name
  const jobPosting = !isSeeker ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.title,
    description: vacancy.description,
    datePosted: vacancy.created_at,
    hiringOrganization: { "@type": "Organization", name: vacancy.company_name },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: vacancy.city, addressCountry: "SE" } },
  } : null

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {jobPosting ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting).replace(/</g, "\\u003c") }} /> : null}
      <Link href={`/lediga-jobb?type=${isSeeker ? "seeking" : "offering"}`} className="text-sm font-semibold text-rose-700">← {t.back}</Link>

      <article className="mt-5 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-9">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{isSeeker ? t.seekerBadge : t.offerBadge}</span>
            {identity ? <p className="mt-3 text-sm font-bold text-rose-700">{identity}</p> : null}
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{vacancy.title}</h1>
            <p className="mt-4 text-base text-slate-600">📍 {vacancy.city}{vacancy.schedule ? ` · ${vacancy.schedule}` : ""}</p>
            <p className="mt-2 text-sm font-medium text-slate-500">🕒 {t.published}: {formatVacancyCreatedAt(vacancy.created_at, locale)}</p>
          </div>
          {vacancy.salary ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 font-bold text-emerald-900">{formatVacancySalary(vacancy.salary, locale)}</div> : null}
        </div>

        <section className="mt-9 border-t border-slate-200 pt-7">
          <h2 className="text-xl font-black text-slate-950">{isSeeker ? t.aboutSeeker : t.aboutOffer}</h2>
          <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-700">{vacancy.description}</p>
        </section>

        {vacancy.requirements ? (
          <section className="mt-8">
            <h2 className="text-xl font-black text-slate-950">{isSeeker ? t.requirementsSeeker : t.requirementsOffer}</h2>
            <p className="mt-4 whitespace-pre-wrap leading-8 text-slate-700">{vacancy.requirements}</p>
          </section>
        ) : null}

        <section className="mt-8 rounded-[24px] bg-slate-50 p-5">
          <h2 className="font-black text-slate-950">{t.contact}</h2>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            {vacancy.contact_email ? <p>{t.email}: <a className="font-semibold text-rose-700" href={`mailto:${vacancy.contact_email}`}>{vacancy.contact_email}</a></p> : null}
            {vacancy.contact_phone ? <p>{t.phone}: <a className="font-semibold text-rose-700" href={`tel:${vacancy.contact_phone}`}>{vacancy.contact_phone}</a></p> : null}
          </div>
          {isSeeker ? <p className="mt-4 text-sm text-slate-600">{t.seekerContactNote}</p> : null}
        </section>

        {user.id === vacancy.created_by ? (
          <div className="mt-8">
            <Link href={`/lediga-jobb/${vacancy.slug}/edit`} className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 px-5 text-sm font-semibold">{t.edit}</Link>
          </div>
        ) : !isSeeker ? (
          <section className="mt-9 border-t border-slate-200 pt-7">
            <h2 className="text-xl font-black text-slate-950">{t.applyTitle}</h2>
            <p className="mt-2 text-sm text-slate-600">{t.applyFree}</p>
            <div className="mt-5"><VacancyApplicationForm vacancyId={vacancy.id} vacancySlug={vacancy.slug} defaultEmail={user.email || ""} locale={locale} /></div>
          </section>
        ) : null}
      </article>
    </main>
  )
}
