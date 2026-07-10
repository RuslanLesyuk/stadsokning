"use client"

import Link from "next/link"
import { useMemo, useState } from "react"

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

type CompaniesDirectoryProps = {
  companies: CompanyDirectoryItem[]
  locale: Locale
}

type StatusFilter = "all" | "verified" | "website"

type SortOption = "verified" | "alphabetical"

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
  showingResults: string
  showingOneResult: string
  noResultsTitle: string
  noResultsDescription: string
  visitProfile: string
  verifiedCompany: string
  website: string
  phone: string
  clearSearch: string
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
    showingResults: "företag hittades",
    showingOneResult: "företag hittades",
    noResultsTitle: "Inga företag hittades",
    noResultsDescription:
      "Prova ett annat sökord eller rensa de valda filtren.",
    visitProfile: "Visa företaget",
    verifiedCompany: "Verifierat företag",
    website: "Webbplats",
    phone: "Telefon",
    clearSearch: "Rensa sökning",
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
    showingResults: "companies found",
    showingOneResult: "company found",
    noResultsTitle: "No companies found",
    noResultsDescription:
      "Try another search term or clear the selected filters.",
    visitProfile: "View company",
    verifiedCompany: "Verified company",
    website: "Website",
    phone: "Phone",
    clearSearch: "Clear search",
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
    showingResults: "компаній знайдено",
    showingOneResult: "компанію знайдено",
    noResultsTitle: "Компаній не знайдено",
    noResultsDescription:
      "Спробуйте інший пошуковий запит або очистьте вибрані фільтри.",
    visitProfile: "Переглянути компанію",
    verifiedCompany: "Перевірена компанія",
    website: "Вебсайт",
    phone: "Телефон",
    clearSearch: "Очистити пошук",
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
    showingResults: "компаний найдено",
    showingOneResult: "компания найдена",
    noResultsTitle: "Компании не найдены",
    noResultsDescription:
      "Попробуйте другой поисковый запрос или очистите выбранные фильтры.",
    visitProfile: "Посмотреть компанию",
    verifiedCompany: "Проверенная компания",
    website: "Сайт",
    phone: "Телефон",
    clearSearch: "Очистить поиск",
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
    showingResults: "firm znaleziono",
    showingOneResult: "firmę znaleziono",
    noResultsTitle: "Nie znaleziono firm",
    noResultsDescription:
      "Spróbuj użyć innego wyszukiwania lub wyczyść wybrane filtry.",
    visitProfile: "Zobacz firmę",
    verifiedCompany: "Zweryfikowana firma",
    website: "Strona internetowa",
    phone: "Telefon",
    clearSearch: "Wyczyść wyszukiwanie",
  },
}

function normalizeWebsiteUrl(website: string): string {
  const trimmedWebsite = website.trim()

  if (
    trimmedWebsite.startsWith("http://") ||
    trimmedWebsite.startsWith("https://")
  ) {
    return trimmedWebsite
  }

  return `https://${trimmedWebsite}`
}

function getWebsiteLabel(website: string): string {
  return website
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "")
}

function normalizeSearchValue(value: string | null | undefined): string {
  return value?.trim().toLocaleLowerCase() ?? ""
}

function CompanyLogo({
  company,
}: {
  company: CompanyDirectoryItem
}) {
  const [imageFailed, setImageFailed] = useState(false)

  const firstLetter = company.name.trim().charAt(0).toLocaleUpperCase() || "C"

  if (company.logo_url && !imageFailed) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <img
          src={company.logo_url}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain p-2"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-bold text-white shadow-sm"
    >
      {firstLetter}
    </div>
  )
}

export function CompaniesDirectory({
  companies,
  locale,
}: CompaniesDirectoryProps) {
  const dictionary = dictionaries[locale] ?? dictionaries.sv

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all")
  const [selectedCity, setSelectedCity] = useState("all")
  const [sortOption, setSortOption] =
    useState<SortOption>("verified")

  const cities = useMemo(() => {
    const uniqueCities = new Set<string>()

    companies.forEach((company) => {
      const city = company.city?.trim()

      if (city) {
        uniqueCities.add(city)
      }
    })

    return Array.from(uniqueCities).sort((firstCity, secondCity) =>
      firstCity.localeCompare(secondCity, locale, {
        sensitivity: "base",
      }),
    )
  }, [companies, locale])

  const filteredCompanies = useMemo(() => {
    const normalizedQuery = normalizeSearchValue(searchQuery)

    const filtered = companies.filter((company) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        normalizeSearchValue(company.name).includes(normalizedQuery) ||
        normalizeSearchValue(company.city).includes(normalizedQuery) ||
        normalizeSearchValue(company.description).includes(normalizedQuery)

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "verified" && company.verified) ||
        (statusFilter === "website" &&
          Boolean(company.website?.trim()))

      const matchesCity =
        selectedCity === "all" || company.city?.trim() === selectedCity

      return matchesSearch && matchesStatus && matchesCity
    })

    return filtered.sort((firstCompany, secondCompany) => {
      if (sortOption === "alphabetical") {
        return firstCompany.name.localeCompare(
          secondCompany.name,
          locale,
          {
            sensitivity: "base",
          },
        )
      }

      if (firstCompany.verified !== secondCompany.verified) {
        return Number(secondCompany.verified) - Number(firstCompany.verified)
      }

      return firstCompany.name.localeCompare(
        secondCompany.name,
        locale,
        {
          sensitivity: "base",
        },
      )
    })
  }, [
    companies,
    locale,
    searchQuery,
    selectedCity,
    sortOption,
    statusFilter,
  ])

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    selectedCity !== "all" ||
    sortOption !== "verified"

  function clearFilters() {
    setSearchQuery("")
    setStatusFilter("all")
    setSelectedCity("all")
    setSortOption("verified")
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-5">
          <div>
            <label
              htmlFor="company-search"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {dictionary.searchLabel}
            </label>

            <div className="relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>

              <input
                id="company-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />

              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label={dictionary.clearSearch}
                  title={dictionary.clearSearch}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-800">
              {dictionary.filtersLabel}
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                aria-pressed={statusFilter === "all"}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === "all"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {dictionary.all}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("verified")}
                aria-pressed={statusFilter === "verified"}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === "verified"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>

                {dictionary.verified}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("website")}
                aria-pressed={statusFilter === "website"}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === "website"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                  <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>

                {dictionary.hasWebsite}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="company-city-filter"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                {dictionary.city}
              </label>

              <select
                id="company-city-filter"
                value={selectedCity}
                onChange={(event) => setSelectedCity(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="all">{dictionary.allCities}</option>

                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="company-sort"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                {dictionary.sortLabel}
              </label>

              <select
                id="company-sort"
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
                className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              >
                <option value="verified">
                  {dictionary.verifiedFirst}
                </option>

                <option value="alphabetical">
                  {dictionary.alphabetical}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm font-medium text-slate-600"
          aria-live="polite"
        >
          <span className="font-bold text-slate-950">
            {filteredCompanies.length}
          </span>{" "}
          {filteredCompanies.length === 1
            ? dictionary.showingOneResult
            : dictionary.showingResults}
        </p>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-950"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="m19 6-1 14H6L5 6" />
              <path d="M10 11v5" />
              <path d="M14 11v5" />
            </svg>

            {dictionary.clearFilters}
          </button>
        ) : null}
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((company) => (
            <article
              key={company.id}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="flex items-start gap-4">
                <CompanyLogo company={company} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start gap-2">
                    <h2 className="min-w-0 flex-1 text-xl font-bold tracking-tight text-slate-950">
                      <Link
                        href={`/companies/${company.slug}`}
                        className="transition hover:text-emerald-700"
                      >
                        {company.name}
                      </Link>
                    </h2>

                    {company.verified ? (
                      <span
                        title={dictionary.verifiedCompany}
                        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>

                        {dictionary.verified}
                      </span>
                    ) : null}
                  </div>

                  {company.city ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                      >
                        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>

                      {company.city}
                    </p>
                  ) : null}
                </div>
              </div>

              {company.description ? (
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">
                  {company.description}
                </p>
              ) : (
                <div className="mt-5" />
              )}

              <div className="mt-5 space-y-2 border-t border-slate-100 pt-5">
                {company.website ? (
                  <a
                    href={normalizeWebsiteUrl(company.website)}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                      <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                      <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                    </svg>

                    <span className="truncate">
                      {getWebsiteLabel(company.website)}
                    </span>

                    <span className="sr-only">
                      {dictionary.website}
                    </span>
                  </a>
                ) : null}

                {company.phone ? (
                  <a
                    href={`tel:${company.phone.replace(/[^\d+]/g, "")}`}
                    className="flex min-w-0 items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4 shrink-0"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.92Z" />
                    </svg>

                    <span className="truncate">{company.phone}</span>

                    <span className="sr-only">
                      {dictionary.phone}
                    </span>
                  </a>
                ) : null}
              </div>

              <div className="mt-auto pt-6">
                <Link
                  href={`/companies/${company.slug}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                >
                  {dictionary.visitProfile}

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 transition group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-7 w-7"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 11h6" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-950">
            {dictionary.noResultsTitle}
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            {dictionary.noResultsDescription}
          </p>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              {dictionary.clearFilters}
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}