import Link from "next/link"

export type CompanyDirectoryItem = {
  id: string
  name: string
  slug: string
  city: string | null
  website: string | null
  phone: string | null
  email: string | null
  description: string | null
  logo_url: string | null
  verified: boolean
}

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type StatusFilter = "all" | "verified" | "website"
type SortOption = "verified" | "alphabetical"

type CompaniesDirectoryProps = {
  companies: CompanyDirectoryItem[]
  locale: Locale
  cities: string[]
  totalResults: number
  currentPage: number
  totalPages: number
  search: string
  city: string
  status: StatusFilter
  sort: SortOption
}

type Dictionary = {
  searchLabel: string
  searchPlaceholder: string
  filtersLabel: string
  all: string
  verified: string
  hasWebsite: string
  city: string
  allCities: string
  sortLabel: string
  verifiedFirst: string
  alphabetical: string
  clearFilters: string
  applyFilters: string
  showingResults: string
  showingOneResult: string
  noResultsTitle: string
  noResultsDescription: string
  visitProfile: string
  verifiedCompany: string
  website: string
  phone: string
  previous: string
  next: string
  page: string
  of: string
}

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    searchLabel: "Sök företag",
    searchPlaceholder: "Sök efter namn, stad eller beskrivning...",
    filtersLabel: "Filter",
    all: "Alla",
    verified: "Verifierade",
    hasWebsite: "Har webbplats",
    city: "Stad",
    allCities: "Alla städer",
    sortLabel: "Sortera",
    verifiedFirst: "Verifierade först",
    alphabetical: "Alfabetisk ordning",
    clearFilters: "Rensa filter",
    applyFilters: "Visa resultat",
    showingResults: "företag hittades",
    showingOneResult: "företag hittades",
    noResultsTitle: "Inga företag hittades",
    noResultsDescription: "Prova ett annat sökord eller rensa de valda filtren.",
    visitProfile: "Visa företaget",
    verifiedCompany: "Verifierat företag",
    website: "Webbplats",
    phone: "Telefon",
    previous: "Föregående",
    next: "Nästa",
    page: "Sida",
    of: "av",
  },
  en: {
    searchLabel: "Search companies",
    searchPlaceholder: "Search by name, city or description...",
    filtersLabel: "Filters",
    all: "All",
    verified: "Verified",
    hasWebsite: "Has website",
    city: "City",
    allCities: "All cities",
    sortLabel: "Sort",
    verifiedFirst: "Verified first",
    alphabetical: "Alphabetical",
    clearFilters: "Clear filters",
    applyFilters: "Show results",
    showingResults: "companies found",
    showingOneResult: "company found",
    noResultsTitle: "No companies found",
    noResultsDescription: "Try another search term or clear the selected filters.",
    visitProfile: "View company",
    verifiedCompany: "Verified company",
    website: "Website",
    phone: "Phone",
    previous: "Previous",
    next: "Next",
    page: "Page",
    of: "of",
  },
  uk: {
    searchLabel: "Пошук компаній",
    searchPlaceholder: "Пошук за назвою, містом або описом...",
    filtersLabel: "Фільтри",
    all: "Усі",
    verified: "Перевірені",
    hasWebsite: "Є вебсайт",
    city: "Місто",
    allCities: "Усі міста",
    sortLabel: "Сортування",
    verifiedFirst: "Спочатку перевірені",
    alphabetical: "За алфавітом",
    clearFilters: "Очистити фільтри",
    applyFilters: "Показати результати",
    showingResults: "компаній знайдено",
    showingOneResult: "компанію знайдено",
    noResultsTitle: "Компаній не знайдено",
    noResultsDescription: "Спробуйте інший пошуковий запит або очистьте вибрані фільтри.",
    visitProfile: "Переглянути компанію",
    verifiedCompany: "Перевірена компанія",
    website: "Вебсайт",
    phone: "Телефон",
    previous: "Попередня",
    next: "Наступна",
    page: "Сторінка",
    of: "з",
  },
  ru: {
    searchLabel: "Поиск компаний",
    searchPlaceholder: "Поиск по названию, городу или описанию...",
    filtersLabel: "Фильтры",
    all: "Все",
    verified: "Проверенные",
    hasWebsite: "Есть сайт",
    city: "Город",
    allCities: "Все города",
    sortLabel: "Сортировка",
    verifiedFirst: "Сначала проверенные",
    alphabetical: "По алфавиту",
    clearFilters: "Очистить фильтры",
    applyFilters: "Показать результаты",
    showingResults: "компаний найдено",
    showingOneResult: "компания найдена",
    noResultsTitle: "Компании не найдены",
    noResultsDescription: "Попробуйте другой поисковый запрос или очистите выбранные фильтры.",
    visitProfile: "Посмотреть компанию",
    verifiedCompany: "Проверенная компания",
    website: "Сайт",
    phone: "Телефон",
    previous: "Предыдущая",
    next: "Следующая",
    page: "Страница",
    of: "из",
  },
  pl: {
    searchLabel: "Szukaj firm",
    searchPlaceholder: "Szukaj według nazwy, miasta lub opisu...",
    filtersLabel: "Filtry",
    all: "Wszystkie",
    verified: "Zweryfikowane",
    hasWebsite: "Posiada stronę",
    city: "Miasto",
    allCities: "Wszystkie miasta",
    sortLabel: "Sortowanie",
    verifiedFirst: "Najpierw zweryfikowane",
    alphabetical: "Alfabetycznie",
    clearFilters: "Wyczyść filtry",
    applyFilters: "Pokaż wyniki",
    showingResults: "firm znaleziono",
    showingOneResult: "firmę znaleziono",
    noResultsTitle: "Nie znaleziono firm",
    noResultsDescription: "Spróbuj użyć innego wyszukiwania lub wyczyść wybrane filtry.",
    visitProfile: "Zobacz firmę",
    verifiedCompany: "Zweryfikowana firma",
    website: "Strona internetowa",
    phone: "Telefon",
    previous: "Poprzednia",
    next: "Następna",
    page: "Strona",
    of: "z",
  },
}

function normalizeWebsiteUrl(website: string) {
  const value = website.trim()
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

function getWebsiteLabel(website: string) {
  return website
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "")
}

function buildPageHref({
  page,
  search,
  city,
  status,
  sort,
}: {
  page: number
  search: string
  city: string
  status: StatusFilter
  sort: SortOption
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

function CompanyLogo({ company }: { company: CompanyDirectoryItem }) {
  if (company.logo_url) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={company.logo_url}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain p-2"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white shadow-sm"
    >
      {company.name.trim().charAt(0).toLocaleUpperCase() || "C"}
    </div>
  )
}

export function CompaniesDirectory({
  companies,
  locale,
  cities,
  totalResults,
  currentPage,
  totalPages,
  search,
  city,
  status,
  sort,
}: CompaniesDirectoryProps) {
  const dictionary = dictionaries[locale] ?? dictionaries.sv
  const hasActiveFilters = Boolean(search || city || status !== "all" || sort !== "verified")

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form method="get" action="/companies" className="grid gap-5">
          <div>
            <label htmlFor="company-search" className="mb-2 block text-sm font-semibold text-slate-800">
              {dictionary.searchLabel}
            </label>
            <input
              id="company-search"
              name="search"
              type="search"
              maxLength={80}
              defaultValue={search}
              placeholder={dictionary.searchPlaceholder}
              className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">{dictionary.filtersLabel}</span>
              <select
                name="status"
                defaultValue={status}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="all">{dictionary.all}</option>
                <option value="verified">{dictionary.verified}</option>
                <option value="website">{dictionary.hasWebsite}</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">{dictionary.city}</span>
              <select
                name="city"
                defaultValue={city}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">{dictionary.allCities}</option>
                {cities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">{dictionary.sortLabel}</span>
              <select
                name="sort"
                defaultValue={sort}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="verified">{dictionary.verifiedFirst}</option>
                <option value="alphabetical">{dictionary.alphabetical}</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              {dictionary.applyFilters}
            </button>
            {hasActiveFilters ? (
              <Link
                href="/companies"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {dictionary.clearFilters}
              </Link>
            ) : null}
          </div>
        </form>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-600" aria-live="polite">
          <span className="font-bold text-slate-950">{totalResults}</span>{" "}
          {totalResults === 1 ? dictionary.showingOneResult : dictionary.showingResults}
        </p>
        {totalPages > 1 ? (
          <p className="text-sm font-medium text-slate-500">
            {dictionary.page} {currentPage} {dictionary.of} {totalPages}
          </p>
        ) : null}
      </div>

      {companies.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {companies.map((company) => (
            <article
              key={company.id}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="flex items-start gap-4">
                <CompanyLogo company={company} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start gap-2">
                    <h2 className="min-w-0 flex-1 text-xl font-bold tracking-tight text-slate-950">
                      <Link href={`/companies/${company.slug}`} className="transition hover:text-emerald-700">
                        {company.name}
                      </Link>
                    </h2>
                    {company.verified ? (
                      <span
                        title={dictionary.verifiedCompany}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800"
                      >
                        ✓ {dictionary.verified}
                      </span>
                    ) : null}
                  </div>
                  {company.city ? <p className="mt-2 text-sm font-medium text-slate-500">📍 {company.city}</p> : null}
                </div>
              </div>

              {company.description ? (
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{company.description}</p>
              ) : <div className="mt-5" />}

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                {company.website ? (
                  <a
                    href={normalizeWebsiteUrl(company.website)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                  >
                    <span aria-hidden="true">🌐</span>
                    <span className="truncate">{getWebsiteLabel(company.website)}</span>
                    <span className="sr-only">{dictionary.website}</span>
                  </a>
                ) : null}
                {company.phone ? (
                  <a
                    href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                  >
                    <span aria-hidden="true">☎</span>
                    <span className="truncate">{company.phone}</span>
                    <span className="sr-only">{dictionary.phone}</span>
                  </a>
                ) : null}
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={`/companies/${company.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  {dictionary.visitProfile} →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-950">{dictionary.noResultsTitle}</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">{dictionary.noResultsDescription}</p>
          {hasActiveFilters ? (
            <Link
              href="/companies"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              {dictionary.clearFilters}
            </Link>
          ) : null}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Pagination">
          {currentPage > 1 ? (
            <Link
              href={buildPageHref({ page: currentPage - 1, search, city, status, sort })}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              ← {dictionary.previous}
            </Link>
          ) : <span />}
          <span className="text-sm font-bold text-slate-600">{currentPage} / {totalPages}</span>
          {currentPage < totalPages ? (
            <Link
              href={buildPageHref({ page: currentPage + 1, search, city, status, sort })}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              {dictionary.next} →
            </Link>
          ) : <span />}
        </nav>
      ) : null}
    </div>
  )
}
