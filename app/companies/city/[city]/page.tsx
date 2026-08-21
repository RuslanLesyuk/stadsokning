import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import type { CompanyDirectoryItem } from "@/components/companies/companies-directory"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"

type Props = {
  params: Promise<{ city: string }>
  searchParams: Promise<{ page?: string }>
}

type DirectoryResult = {
  total_count: number
  items: CompanyDirectoryItem[]
}

const PAGE_SIZE = 24

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

function normalizePage(value: string | undefined) {
  const parsed = Number(value || 1)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100000) : 1
}

function parseResult(value: unknown): DirectoryResult {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
  const total = Number(raw.total_count ?? 0)
  return {
    total_count: Number.isFinite(total) && total >= 0 ? Math.floor(total) : 0,
    items: Array.isArray(raw.items) ? (raw.items as CompanyDirectoryItem[]) : [],
  }
}

function pageHref(city: string, page: number) {
  return page > 1 ? `/companies/city/${city}?page=${page}` : `/companies/city/${city}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityName = cityNames[city]

  if (!cityName) return {}

  return {
    title: `Cleaning Companies in ${cityName} | Clean Jobs`,
    description: `Find cleaning companies in ${cityName}. Compare websites, contact details and cleaning services.`,
    alternates: { canonical: `https://cleansjob.com/companies/city/${city}` },
  }
}

export default async function CompaniesCityPage({ params, searchParams }: Props) {
  const [{ city }, query] = await Promise.all([params, searchParams])
  const cityName = cityNames[city]
  if (!cityName) notFound()

  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE)
  const dictionary = getDictionary(locale)
  const t = dictionary.companies
  const currentPage = normalizePage(query.page)
  const offset = (currentPage - 1) * PAGE_SIZE

  const supabase = await createClient()
  const { data, error } = await supabase.rpc("search_company_directory", {
    p_search: null,
    p_city: cityName,
    p_status: "all",
    p_sort: "verified",
    p_offset: offset,
    p_limit: PAGE_SIZE,
  })

  if (error) console.error("Company city directory error:", error)

  const result = parseResult(data)
  const totalPages = Math.max(1, Math.ceil(result.total_count / PAGE_SIZE))

  if (result.total_count > 0 && currentPage > totalPages) {
    redirect(pageHref(city, totalPages))
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <Link href="/companies" prefetch={false} className="text-sm font-semibold text-rose-600">
            ← {t.listedCompanies}
          </Link>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {t.pageTitle} — {cityName}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{t.pageSubtitle}</p>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">{t.listedCompanies}</h2>
              <p className="mt-1 text-sm text-slate-500">{result.total_count} {t.availableCompanies}</p>
            </div>
            {totalPages > 1 ? <p className="text-sm font-semibold text-slate-500">{currentPage} / {totalPages}</p> : null}
          </div>

          {error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-800">
              Companies could not be loaded.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {result.items.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  prefetch={false}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-950">{company.name}</h3>
                    {company.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{t.verified}</span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{company.city}</p>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{company.description || t.fallbackDescription}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-rose-600">{t.viewCompany}</span>
                    <span className="text-slate-400 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <nav className="mt-8 flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
              {currentPage > 1 ? (
                <Link href={pageHref(city, currentPage - 1)} prefetch={false} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">← Previous</Link>
              ) : <span />}
              <span className="text-sm font-bold text-slate-500">{currentPage} / {totalPages}</span>
              {currentPage < totalPages ? (
                <Link href={pageHref(city, currentPage + 1)} prefetch={false} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">Next →</Link>
              ) : <span />}
            </nav>
          ) : null}
        </section>
      </main>
    </div>
  )
}
