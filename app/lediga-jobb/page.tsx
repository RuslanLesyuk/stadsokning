import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { mergeVacancyCities, vacancyPopularCities } from "@/lib/vacancies/cities"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { formatVacancyCreatedAt } from "@/lib/vacancies/date"
import { formatVacancySalary } from "@/lib/vacancies/salary"
import { listingTypeFromQuery } from "@/lib/vacancies/types"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Jobbmarknad för städning i Sverige",
  description: "Hitta lediga städjobb eller personer som söker arbete inom städning och lokalvård i Sverige på Clean Jobs.",
  alternates: { canonical: "/lediga-jobb" },
}

type Props = { searchParams: Promise<{ city?: string; type?: string }> }

function cityHref(type: string, city?: string) {
  const params = new URLSearchParams({ type })
  if (city) params.set("city", city)
  return `/lediga-jobb?${params.toString()}`
}

export default async function VacanciesPage({ searchParams }: Props) {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).list
  const { city = "", type } = await searchParams
  const selectedCity = city.trim()
  const listingType = listingTypeFromQuery(type)
  const isOffer = listingType === "job_offer"
  const queryType = isOffer ? "offering" : "seeking"

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from("vacancies")
    .select("id,slug,listing_type,title,company_name,person_name,city,schedule,salary,created_at")
    .eq("status", "active")
    .eq("listing_type", listingType)
    .order("created_at", { ascending: false })
    .limit(100)

  if (selectedCity) query = query.ilike("city", selectedCity)
  const { data: vacancies } = await query

  const { data: cityRows } = await supabase
    .from("vacancies")
    .select("city")
    .eq("status", "active")
    .eq("listing_type", listingType)
    .order("city")
    .limit(1000)

  const cities = mergeVacancyCities((cityRows || []).map((row) => row.city))
  const activeCities = new Set(
    (cityRows || [])
      .map((row) => String(row.city || "").trim().toLocaleLowerCase("sv-SE"))
      .filter(Boolean),
  )

  const offeringHref = cityHref("offering", selectedCity || undefined)
  const seekingHref = cityHref("seeking", selectedCity || undefined)

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <section className="rounded-[32px] bg-slate-950 p-7 text-white md:p-10">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-300">{t.eyebrow}</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">{t.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{t.subtitle}</p>
          </div>
          <Link href={`/lediga-jobb/create?type=${queryType}`} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
            {isOffer ? t.addOffer : t.addSeeker}
          </Link>
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2">
        <Link href={offeringHref} className={`rounded-[24px] border p-5 transition ${isOffer ? "border-rose-300 bg-rose-50 shadow-sm" : "border-slate-200 bg-white hover:border-rose-200"}`}>
          <div className="font-black text-slate-950">{t.offerTab}</div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t.offerTabDescription}</p>
        </Link>
        <Link href={seekingHref} className={`rounded-[24px] border p-5 transition ${!isOffer ? "border-rose-300 bg-rose-50 shadow-sm" : "border-slate-200 bg-white hover:border-rose-200"}`}>
          <div className="font-black text-slate-950">{t.seekerTab}</div>
          <p className="mt-1 text-sm leading-6 text-slate-600">{t.seekerTabDescription}</p>
        </Link>
      </section>

      <section className="mt-7 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <form className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
          <input type="hidden" name="type" value={queryType} />
          <label className="text-sm font-semibold text-slate-800">
            {t.filterCity}
            <input
              type="search"
              name="city"
              list="vacancy-city-filter-options"
              defaultValue={selectedCity}
              placeholder={t.citySearchPlaceholder}
              autoComplete="off"
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
            />
            <datalist id="vacancy-city-filter-options">
              {cities.map((item) => <option key={item} value={item} />)}
            </datalist>
          </label>
          <button className="min-h-12 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">{t.show}</button>
          {selectedCity ? (
            <Link href={cityHref(queryType)} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">{t.clear}</Link>
          ) : null}
        </form>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{t.popularCities}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={cityHref(queryType)}
              className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${!selectedCity ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
            >
              {t.allCities}
            </Link>
            {vacancyPopularCities.map((item) => {
              const selected = selectedCity.toLocaleLowerCase("sv-SE") === item.toLocaleLowerCase("sv-SE")
              const hasListings = activeCities.has(item.toLocaleLowerCase("sv-SE"))
              return (
                <Link
                  key={item}
                  href={cityHref(queryType, item)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${selected ? "border-rose-600 bg-rose-600 text-white" : hasListings ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-300" : "border-slate-200 bg-white text-slate-700 hover:border-rose-200"}`}
                >
                  {item}
                </Link>
              )
            })}
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">{t.cityFilterHint}</p>
        </div>
      </section>

      <section className="mt-7 space-y-4">
        {(vacancies || []).length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-600">{isOffer ? t.emptyOffer : t.emptySeeker}</div>
        ) : (vacancies || []).map((vacancy) => {
          const identity = vacancy.listing_type === "job_seeker" ? vacancy.person_name : vacancy.company_name
          return (
            <Link key={vacancy.id} href={user ? `/lediga-jobb/${vacancy.slug}` : `/login?next=${encodeURIComponent(`/lediga-jobb/${vacancy.slug}`)}`} className="block rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{vacancy.listing_type === "job_seeker" ? t.seekerBadge : t.offerBadge}</span>
                  {identity ? <p className="mt-3 text-sm font-bold text-rose-700">{identity}</p> : null}
                  <h2 className="mt-1 text-xl font-black text-slate-950 md:text-2xl">{vacancy.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">📍 {vacancy.city}{vacancy.schedule ? ` · ${vacancy.schedule}` : ""}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">🕒 {t.published}: {formatVacancyCreatedAt(vacancy.created_at, locale)}</p>
                </div>
                {vacancy.salary ? <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">{formatVacancySalary(vacancy.salary, locale)}</span> : null}
              </div>
            </Link>
          )
        })}
      </section>
    </main>
  )
}
