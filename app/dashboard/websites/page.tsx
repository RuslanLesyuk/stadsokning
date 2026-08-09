import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { normalizeLocale } from "@/lib/i18n"
import type { CompanySiteLocale, CompanySiteRow } from "@/lib/company-sites/types"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type Copy = {
  eyebrow: string
  title: string
  subtitle: string
  back: string
  noCompanies: string
  noCompaniesText: string
  browseCompanies: string
  draft: string
  published: string
  noSite: string
  create: string
  manage: string
  open: string
  domain: string
}

const copy: Record<CompanySiteLocale, Copy> = {
  sv: {
    eyebrow: "Website-as-a-Service",
    title: "Företagswebbplatser",
    subtitle: "Skapa, förhandsvisa och publicera fristående webbplatser för företag du hanterar.",
    back: "Dashboard",
    noCompanies: "Du hanterar inga företag ännu",
    noCompaniesText: "När ett företagsanspråk godkänns kan du skapa företagets webbplats här.",
    browseCompanies: "Bläddra bland företag",
    draft: "Utkast",
    published: "Publicerad",
    noSite: "Ingen webbplats",
    create: "Skapa webbplats",
    manage: "Hantera webbplats",
    open: "Öppna",
    domain: "Domän",
  },
  en: {
    eyebrow: "Website-as-a-Service",
    title: "Company websites",
    subtitle: "Create, preview and publish standalone websites for companies you manage.",
    back: "Dashboard",
    noCompanies: "You do not manage any companies yet",
    noCompaniesText: "After a company claim is approved, you can create its website here.",
    browseCompanies: "Browse companies",
    draft: "Draft",
    published: "Published",
    noSite: "No website",
    create: "Create website",
    manage: "Manage website",
    open: "Open",
    domain: "Domain",
  },
  uk: {
    eyebrow: "Website-as-a-Service",
    title: "Сайти компаній",
    subtitle: "Створюйте, переглядайте та публікуйте окремі сайти компаній, якими ви керуєте.",
    back: "Кабінет",
    noCompanies: "Ви ще не керуєте жодною компанією",
    noCompaniesText: "Після схвалення заявки на компанію тут можна буде створити її сайт.",
    browseCompanies: "Переглянути компанії",
    draft: "Чернетка",
    published: "Опубліковано",
    noSite: "Сайту немає",
    create: "Створити сайт",
    manage: "Керувати сайтом",
    open: "Відкрити",
    domain: "Домен",
  },
  ru: {
    eyebrow: "Website-as-a-Service",
    title: "Сайты компаний",
    subtitle: "Создавайте, просматривайте и публикуйте отдельные сайты компаний, которыми вы управляете.",
    back: "Кабинет",
    noCompanies: "Вы пока не управляете компаниями",
    noCompaniesText: "После одобрения заявки на компанию здесь можно создать ее сайт.",
    browseCompanies: "Посмотреть компании",
    draft: "Черновик",
    published: "Опубликовано",
    noSite: "Сайта нет",
    create: "Создать сайт",
    manage: "Управлять сайтом",
    open: "Открыть",
    domain: "Домен",
  },
  pl: {
    eyebrow: "Website-as-a-Service",
    title: "Strony firm",
    subtitle: "Twórz, podglądaj i publikuj niezależne strony firm, którymi zarządzasz.",
    back: "Panel",
    noCompanies: "Nie zarządzasz jeszcze żadną firmą",
    noCompaniesText: "Po zatwierdzeniu zgłoszenia firmy możesz utworzyć jej stronę tutaj.",
    browseCompanies: "Przeglądaj firmy",
    draft: "Szkic",
    published: "Opublikowana",
    noSite: "Brak strony",
    create: "Utwórz stronę",
    manage: "Zarządzaj stroną",
    open: "Otwórz",
    domain: "Domena",
  },
}

type CompanyRow = {
  id: string
  name: string
  slug: string
  city: string | null
  logo_url: string | null
  verified: boolean | null
}

export default async function WebsitesDashboardPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as CompanySiteLocale
  const t = copy[locale] || copy.sv

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/dashboard/websites")

  const { data: companiesData } = await supabase
    .from("companies")
    .select("id, name, slug, city, logo_url, verified")
    .eq("owner_id", user.id)
    .order("name", { ascending: true })

  const companies = (companiesData ?? []) as CompanyRow[]
  const companyIds = companies.map((company) => company.id)

  let sites: CompanySiteRow[] = []
  if (companyIds.length > 0) {
    const { data } = await supabase
      .from("company_sites")
      .select("*")
      .in("company_id", companyIds)
    sites = (data ?? []) as CompanySiteRow[]
  }

  const siteMap = new Map(sites.map((site) => [site.company_id, site]))

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-rose-600">
            ← {t.back}
          </Link>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-600">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{t.title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{t.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {companies.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-black text-slate-950">{t.noCompanies}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">{t.noCompaniesText}</p>
            <Link
              href="/companies"
              className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-black text-white hover:bg-rose-700"
            >
              {t.browseCompanies}
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {companies.map((company) => {
              const site = siteMap.get(company.id)
              return (
                <article key={company.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="h-14 w-14 rounded-2xl border border-slate-200 bg-white object-contain p-2" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-xl font-black text-white">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="truncate text-xl font-black text-slate-950">{company.name}</h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${
                          site?.status === "published"
                            ? "bg-emerald-100 text-emerald-800"
                            : site
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                        }`}>
                          {site?.status === "published" ? t.published : site ? t.draft : t.noSite}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{company.city || "Sweden"}</p>
                      {site?.custom_domain ? (
                        <p className="mt-3 text-xs font-semibold text-slate-500">
                          {t.domain}: {site.custom_domain} · {site.domain_status}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/companies/${company.id}/website`}
                      className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white hover:bg-rose-600"
                    >
                      {site ? t.manage : t.create}
                    </Link>
                    {site?.status === "published" ? (
                      <Link
                        href={`/site/${site.site_slug}`}
                        target="_blank"
                        className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-800 hover:bg-slate-50"
                      >
                        {t.open}
                      </Link>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
