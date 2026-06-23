import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import { getLanguageAlternates } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.companies

  return {
  title: `${t.pageTitle} | Clean Jobs`,
  description: t.pageSubtitle,
  alternates: {
    canonical: "https://cleansjob.com/companies",
    languages: getLanguageAlternates("/companies"),
  },
}
}

const cityLinks = [
  { name: "Stockholm", href: "/companies/city/stockholm" },
  { name: "Sollentuna", href: "/companies/city/sollentuna" },
  { name: "Täby", href: "/companies/city/taby" },
  { name: "Järfälla", href: "/companies/city/jarfalla" },
  { name: "Nacka", href: "/companies/city/nacka" },
  { name: "Huddinge", href: "/companies/city/huddinge" },
  { name: "Botkyrka", href: "/companies/city/botkyrka" },
  { name: "Solna", href: "/companies/city/solna" },
  { name: "Sundbyberg", href: "/companies/city/sundbyberg" },
]

export default async function CompaniesPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.companies

  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("verified", { ascending: false })
    .order("name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
              {t.badge}
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              {t.pageTitle}
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              {t.pageSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {t.findJobs}
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                {t.addCompany}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            {t.browseByCity}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {t.browseByCityText}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {cityLinks.map((city) => (
              <Link
                key={city.href}
                href={city.href}
                prefetch={false}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-rose-50"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                {t.listedCompanies}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {companies?.length ?? 0} {t.availableCompanies}
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies?.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                prefetch={false}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-slate-950">
                    {company.name}
                  </h3>

                  {company.verified ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {t.verified}
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {company.city || "Sweden"}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {company.description || t.fallbackDescription}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-600">
                    {t.viewCompany}
                  </span>

                  <span className="text-slate-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                {t.findServicesTitle}
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {t.findServicesText}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                {t.areYouCompanyTitle}
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {t.areYouCompanyText}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}