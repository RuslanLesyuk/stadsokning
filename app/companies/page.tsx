import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  CompaniesDirectory,
  type CompanyDirectoryItem,
} from "@/components/companies/companies-directory"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type DirectoryStatus = "all" | "verified" | "website"
type DirectorySort = "verified" | "alphabetical"

type PageProps = {
  searchParams: Promise<{
    search?: string
    city?: string
    status?: string
    sort?: string
    page?: string
  }>
}

type PageDictionary = {
  metadataTitle: string
  metadataDescription: string
  eyebrow: string
  title: string
  description: string
  companiesLabel: string
  verifiedLabel: string
  citiesLabel: string
  loadErrorTitle: string
  loadErrorDescription: string
  emptyTitle: string
  emptyDescription: string
}

type DirectoryFacets = {
  total_count: number
  verified_count: number
  city_count: number
  cities: string[]
}

type DirectoryResult = {
  total_count: number
  items: CompanyDirectoryItem[]
}

const PAGE_SIZE = 24
const supportedLocales: Locale[] = ["sv", "en", "uk", "ru", "pl"]

const dictionaries: Record<Locale, PageDictionary> = {
  sv: {
    metadataTitle: "Städföretag i Sverige | Clean Jobs",
    metadataDescription:
      "Hitta och jämför städföretag i Sverige. Se företagsinformation, kontaktuppgifter, webbplatser och verifierade företag.",
    eyebrow: "Företagskatalog",
    title: "Hitta städföretag i Sverige",
    description:
      "Sök bland städföretag, jämför företagsinformation och hitta en passande leverantör av städtjänster.",
    companiesLabel: "Företag",
    verifiedLabel: "Verifierade",
    citiesLabel: "Städer",
    loadErrorTitle: "Företagen kunde inte hämtas",
    loadErrorDescription: "Ett tekniskt fel uppstod när företagskatalogen skulle laddas.",
    emptyTitle: "Inga företag har lagts till ännu",
    emptyDescription: "Företagskatalogen kommer att visa städföretag när de har publicerats.",
  },
  en: {
    metadataTitle: "Cleaning Companies in Sweden | Clean Jobs",
    metadataDescription:
      "Find and compare cleaning companies in Sweden. View company information, contact details, websites and verified businesses.",
    eyebrow: "Company directory",
    title: "Find cleaning companies in Sweden",
    description:
      "Search cleaning companies, compare business information and find a suitable cleaning service provider.",
    companiesLabel: "Companies",
    verifiedLabel: "Verified",
    citiesLabel: "Cities",
    loadErrorTitle: "Companies could not be loaded",
    loadErrorDescription: "A technical error occurred while loading the company directory.",
    emptyTitle: "No companies have been added yet",
    emptyDescription: "The directory will display cleaning companies after they are published.",
  },
  uk: {
    metadataTitle: "Клінінгові компанії у Швеції | Clean Jobs",
    metadataDescription:
      "Знаходьте та порівнюйте клінінгові компанії у Швеції. Переглядайте інформацію, контакти, вебсайти та перевірені компанії.",
    eyebrow: "Каталог компаній",
    title: "Знайдіть клінінгову компанію у Швеції",
    description:
      "Шукайте клінінгові компанії, порівнюйте інформацію та знаходьте відповідного постачальника послуг прибирання.",
    companiesLabel: "Компанії",
    verifiedLabel: "Перевірені",
    citiesLabel: "Міста",
    loadErrorTitle: "Не вдалося завантажити компанії",
    loadErrorDescription: "Під час завантаження каталогу компаній сталася технічна помилка.",
    emptyTitle: "Компаній поки немає",
    emptyDescription: "У каталозі з’являться клінінгові компанії після їх публікації.",
  },
  ru: {
    metadataTitle: "Клининговые компании в Швеции | Clean Jobs",
    metadataDescription:
      "Находите и сравнивайте клининговые компании в Швеции. Просматривайте информацию, контакты, сайты и проверенные компании.",
    eyebrow: "Каталог компаний",
    title: "Найдите клининговую компанию в Швеции",
    description:
      "Ищите клининговые компании, сравнивайте информацию и находите подходящего поставщика услуг уборки.",
    companiesLabel: "Компании",
    verifiedLabel: "Проверенные",
    citiesLabel: "Города",
    loadErrorTitle: "Не удалось загрузить компании",
    loadErrorDescription: "При загрузке каталога компаний произошла техническая ошибка.",
    emptyTitle: "Компании пока не добавлены",
    emptyDescription: "В каталоге появятся клининговые компании после их публикации.",
  },
  pl: {
    metadataTitle: "Firmy sprzątające w Szwecji | Clean Jobs",
    metadataDescription:
      "Znajdź i porównaj firmy sprzątające w Szwecji. Zobacz informacje, dane kontaktowe, strony internetowe i zweryfikowane firmy.",
    eyebrow: "Katalog firm",
    title: "Znajdź firmę sprzątającą w Szwecji",
    description: "Wyszukuj firmy sprzątające, porównuj informacje i znajdź odpowiedniego usługodawcę.",
    companiesLabel: "Firmy",
    verifiedLabel: "Zweryfikowane",
    citiesLabel: "Miasta",
    loadErrorTitle: "Nie udało się załadować firm",
    loadErrorDescription: "Podczas ładowania katalogu firm wystąpił błąd techniczny.",
    emptyTitle: "Nie dodano jeszcze żadnych firm",
    emptyDescription: "Katalog wyświetli firmy sprzątające po ich opublikowaniu.",
  },
}

function isSupportedLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale)
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get("clean_jobs_locale")?.value
  return isSupportedLocale(localeCookie) ? localeCookie : "sv"
}

function cleanSearch(value: string | undefined) {
  return String(value || "")
    .replace(/[\u0000-\u001f%_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
}

function cleanCity(value: string | undefined) {
  return String(value || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 120)
}

function normalizeStatus(value: string | undefined): DirectoryStatus {
  return value === "verified" || value === "website" ? value : "all"
}

function normalizeSort(value: string | undefined): DirectorySort {
  return value === "alphabetical" ? "alphabetical" : "verified"
}

function normalizePage(value: string | undefined) {
  const parsed = Number(value || 1)
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, 100000) : 1
}

function numberValue(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : 0
}

function parseFacets(value: unknown): DirectoryFacets {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
  return {
    total_count: numberValue(raw.total_count),
    verified_count: numberValue(raw.verified_count),
    city_count: numberValue(raw.city_count),
    cities: Array.isArray(raw.cities)
      ? raw.cities.filter((city): city is string => typeof city === "string" && city.trim().length > 0)
      : [],
  }
}

function parseDirectoryResult(value: unknown): DirectoryResult {
  const raw = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
  return {
    total_count: numberValue(raw.total_count),
    items: Array.isArray(raw.items) ? (raw.items as CompanyDirectoryItem[]) : [],
  }
}

function buildDirectoryHref({
  search,
  city,
  status,
  sort,
  page,
}: {
  search: string
  city: string
  status: DirectoryStatus
  sort: DirectorySort
  page: number
}) {
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (city) params.set("city", city)
  if (status !== "all") params.set("status", status)
  if (sort !== "verified") params.set("sort", sort)
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `/companies?${query}` : "/companies"
}

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = dictionaries.sv

  return {
    title: {
      absolute: dictionary.metadataTitle,
    },
    description: dictionary.metadataDescription,
    alternates: {
      canonical: "https://cleansjob.com/companies",
    },
    openGraph: {
      type: "website",
      url: "https://cleansjob.com/companies",
      siteName: "Clean Jobs",
      title: dictionary.metadataTitle,
      description: dictionary.metadataDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.metadataTitle,
      description: dictionary.metadataDescription,
    },
  }
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  const search = cleanSearch(params.search)
  const city = cleanCity(params.city)
  const status = normalizeStatus(params.status)
  const sort = normalizeSort(params.sort)
  const requestedPage = normalizePage(params.page)
  const offset = (requestedPage - 1) * PAGE_SIZE

  const supabase = await createClient()
  const [facetsResult, directoryResult] = await Promise.all([
    supabase.rpc("get_company_directory_facets"),
    supabase.rpc("search_company_directory", {
      p_search: search || null,
      p_city: city || null,
      p_status: status,
      p_sort: sort,
      p_offset: offset,
      p_limit: PAGE_SIZE,
    }),
  ])

  if (facetsResult.error) {
    console.error("Company directory facets error:", facetsResult.error)
  }
  if (directoryResult.error) {
    console.error("Company directory search error:", directoryResult.error)
  }

  const facets = parseFacets(facetsResult.data)
  const directory = parseDirectoryResult(directoryResult.data)
  const totalPages = Math.max(1, Math.ceil(directory.total_count / PAGE_SIZE))

  if (directory.total_count > 0 && requestedPage > totalPages) {
    redirect(buildDirectoryHref({ search, city, status, sort, page: totalPages }))
  }

  const hasLoadError = Boolean(facetsResult.error || directoryResult.error)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-50 via-teal-50/50 to-transparent" />
        <div aria-hidden="true" className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">{dictionary.eyebrow}</p>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{dictionary.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">{dictionary.description}</p>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-slate-950">{facets.total_count}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{dictionary.companiesLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-emerald-600">{facets.verified_count}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{dictionary.verifiedLabel}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-slate-950">{facets.city_count}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">{dictionary.citiesLabel}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {hasLoadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-bold text-red-950">{dictionary.loadErrorTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-red-800">{dictionary.loadErrorDescription}</p>
          </div>
        ) : facets.total_count === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-slate-950">{dictionary.emptyTitle}</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{dictionary.emptyDescription}</p>
          </div>
        ) : (
          <CompaniesDirectory
            companies={directory.items}
            locale={locale}
            cities={facets.cities}
            totalResults={directory.total_count}
            currentPage={requestedPage}
            totalPages={totalPages}
            search={search}
            city={city}
            status={status}
            sort={sort}
          />
        )}
      </section>
    </main>
  )
}
