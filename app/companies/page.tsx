import type { Metadata } from "next"
import { cookies } from "next/headers"

import {
  CompaniesDirectory,
  type CompanyDirectoryItem,
} from "@/components/companies/companies-directory"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

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
    loadErrorDescription:
      "Ett tekniskt fel uppstod när företagskatalogen skulle laddas.",
    emptyTitle: "Inga företag har lagts till ännu",
    emptyDescription:
      "Företagskatalogen kommer att visa städföretag när de har publicerats.",
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
    loadErrorDescription:
      "A technical error occurred while loading the company directory.",
    emptyTitle: "No companies have been added yet",
    emptyDescription:
      "The directory will display cleaning companies after they are published.",
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
    loadErrorDescription:
      "Під час завантаження каталогу компаній сталася технічна помилка.",
    emptyTitle: "Компаній поки немає",
    emptyDescription:
      "У каталозі з’являться клінінгові компанії після їх публікації.",
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
    loadErrorDescription:
      "При загрузке каталога компаний произошла техническая ошибка.",
    emptyTitle: "Компании пока не добавлены",
    emptyDescription:
      "В каталоге появятся клининговые компании после их публикации.",
  },

  pl: {
    metadataTitle: "Firmy sprzątające w Szwecji | Clean Jobs",
    metadataDescription:
      "Znajdź i porównaj firmy sprzątające w Szwecji. Zobacz informacje, dane kontaktowe, strony internetowe i zweryfikowane firmy.",
    eyebrow: "Katalog firm",
    title: "Znajdź firmę sprzątającą w Szwecji",
    description:
      "Wyszukuj firmy sprzątające, porównuj informacje i znajdź odpowiedniego usługodawcę.",
    companiesLabel: "Firmy",
    verifiedLabel: "Zweryfikowane",
    citiesLabel: "Miasta",
    loadErrorTitle: "Nie udało się załadować firm",
    loadErrorDescription:
      "Podczas ładowania katalogu firm wystąpił błąd techniczny.",
    emptyTitle: "Nie dodano jeszcze żadnych firm",
    emptyDescription:
      "Katalog wyświetli firmy sprzątające po ich opublikowaniu.",
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  return {
    title: dictionary.metadataTitle,
    description: dictionary.metadataDescription,
    alternates: {
      canonical: "https://cleansjob.com/companies",
      languages: {
        sv: "https://cleansjob.com/companies",
        en: "https://cleansjob.com/companies",
        uk: "https://cleansjob.com/companies",
        ru: "https://cleansjob.com/companies",
        pl: "https://cleansjob.com/companies",
        "x-default": "https://cleansjob.com/companies",
      },
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

export default async function CompaniesPage() {
  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("companies")
    .select(
      `
        id,
        name,
        slug,
        city,
        website,
        phone,
        email,
        description,
        logo_url,
        verified
      `,
    )
    .order("verified", { ascending: false })
    .order("name", { ascending: true })

  const companies = (data ?? []) as CompanyDirectoryItem[]

  const verifiedCompaniesCount = companies.filter(
    (company) => company.verified,
  ).length

  const cityCount = new Set(
    companies
      .map((company) => company.city?.trim())
      .filter((city): city is string => Boolean(city)),
  ).size

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-50 via-teal-50/50 to-transparent"
        />

        <div
          aria-hidden="true"
          className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800">
              {dictionary.eyebrow}
            </p>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              {dictionary.title}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {dictionary.description}
            </p>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-slate-950">
                {companies.length}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {dictionary.companiesLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-emerald-600">
                {verifiedCompaniesCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {dictionary.verifiedLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-black text-slate-950">
                {cityCount}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {dictionary.citiesLabel}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>

            <h2 className="mt-4 text-xl font-bold text-red-950">
              {dictionary.loadErrorTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-800">
              {dictionary.loadErrorDescription}
            </p>
          </div>
        ) : companies.length > 0 ? (
          <CompaniesDirectory
            companies={companies}
            locale={locale}
          />
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-7 w-7"
              >
                <path d="M3 21h18" />
                <path d="M6 21V7l6-4 6 4v14" />
                <path d="M9 9h1" />
                <path d="M14 9h1" />
                <path d="M9 13h1" />
                <path d="M14 13h1" />
                <path d="M9 17h6" />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              {dictionary.emptyTitle}
            </h2>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              {dictionary.emptyDescription}
            </p>
          </div>
        )}
      </section>
    </main>
  )
}