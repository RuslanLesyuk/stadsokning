import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { formatVacancySalary } from "@/lib/vacancies/salary"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Lediga städjobb i Sverige",
  description: "Hitta lediga jobb inom städning och lokalvård i Sverige. Sök städjobb efter ort och ansök direkt via Clean Jobs.",
  alternates: { canonical: "/lediga-jobb" },
}

type Props = { searchParams: Promise<{ city?: string }> }

export default async function VacanciesPage({ searchParams }: Props) {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  const t = getVacancyDictionary(locale).list
  const { city = "" } = await searchParams
  const selectedCity = city.trim()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase.from("vacancies").select("id,slug,title,company_name,city,schedule,salary,created_at").eq("status", "active").order("created_at", { ascending: false }).limit(100)
  if (selectedCity) query = query.ilike("city", selectedCity)
  const { data: vacancies } = await query

  const { data: cityRows } = await supabase.from("vacancies").select("city").eq("status", "active").order("city").limit(1000)
  const cities = Array.from(new Set((cityRows || []).map((row) => row.city).filter(Boolean)))

  return <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
    <section className="rounded-[32px] bg-slate-950 p-7 text-white md:p-10"><p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-300">{t.eyebrow}</p><div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-3xl"><h1 className="text-3xl font-black tracking-tight md:text-5xl">{t.title}</h1><p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{t.subtitle}</p></div><Link href="/lediga-jobb/create" className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">{t.add}</Link></div></section>
    <section className="mt-7 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><form className="flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-semibold text-slate-800">{t.filterCity}<select name="city" defaultValue={selectedCity} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm"><option value="">{t.allCities}</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><button className="min-h-12 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white">{t.show}</button>{selectedCity ? <Link href="/lediga-jobb" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 px-5 text-sm font-semibold text-slate-700">{t.clear}</Link> : null}</form></section>
    <section className="mt-7 space-y-4">{(vacancies || []).length === 0 ? <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-600">{t.empty}</div> : (vacancies || []).map((vacancy) => <Link key={vacancy.id} href={user ? `/lediga-jobb/${vacancy.slug}` : `/login?next=${encodeURIComponent(`/lediga-jobb/${vacancy.slug}`)}`} className="block rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><p className="text-sm font-bold text-rose-700">{vacancy.company_name}</p><h2 className="mt-1 text-xl font-black text-slate-950 md:text-2xl">{vacancy.title}</h2><p className="mt-2 text-sm text-slate-600">📍 {vacancy.city}{vacancy.schedule ? ` · ${vacancy.schedule}` : ""}</p></div>{vacancy.salary ? <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">{formatVacancySalary(vacancy.salary, locale)}</span> : null}</div></Link>)}</section>
  </main>
}
