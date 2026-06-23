import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"

type Props = {
  params: Promise<{
    city: string
  }>
}

const cityNames: Record<string, string> = {
  stockholm: "Stockholm",
  sollentuna: "Sollentuna",
  taby: "Täby",
  jarfalla: "Järfälla",
  nacka: "Nacka",
  huddinge: "Huddinge",
  botkyrka: "Botkyrka",
  solna: "Solna",
  sundbyberg: "Sundbyberg",
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = cityNames[city]

  if (!cityName) return {}

  return {
    title: `Cleaning Companies in ${cityName} | Clean Jobs`,
    description: `Find cleaning companies in ${cityName}. Compare websites, contact details and cleaning services.`,
    alternates: {
      canonical: `https://cleansjob.com/companies/city/${city}`,
    },
  }
}

export default async function CompaniesCityPage({ params }: Props) {
  const { city } = await params
  const cityName = cityNames[city]

  if (!cityName) {
    notFound()
  }

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
    .ilike("city", `%${cityName}%`)
    .order("verified", { ascending: false })
    .order("name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <Link
            href="/companies"
            prefetch={false}
            className="text-sm font-semibold text-rose-600"
          >
            ← {t.listedCompanies}
          </Link>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {t.pageTitle} — {cityName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {t.pageSubtitle}
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              {t.listedCompanies}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {companies?.length ?? 0} {t.availableCompanies}
            </p>
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
                  {company.city}
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
      </main>
    </div>
  )
}