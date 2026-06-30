import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const LOCALE_COOKIE_NAME = "clean_jobs_locale"

const locales = ["uk", "ru", "en", "sv", "pl"] as const
type Locale = (typeof locales)[number]

function normalizeLocale(value?: string | null): Locale {
  if (value && locales.includes(value as Locale)) return value as Locale
  return "uk"
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)
}

const copy = {
  uk: {
    metaTitle: "Клінінгова фірма Стокгольм | Clean Jobs",
    metaDescription:
      "Знайдіть клінінгові фірми, прибирання дому, офісу та після переїзду в Стокгольмі.",
    title: "Клінінгова фірма Стокгольм",
    text: "Знайдіть клінінгові фірми та послуги з прибирання в Стокгольмі.",
    postJob: "Опублікувати роботу з прибирання",
    seeServices: "Переглянути клінінгові послуги",
  },
  ru: {
    metaTitle: "Клининговая фирма Стокгольм | Clean Jobs",
    metaDescription:
      "Найдите клининговые фирмы, уборку дома, офиса и после переезда в Стокгольме.",
    title: "Клининговая фирма Стокгольм",
    text: "Найдите клининговые фирмы и услуги уборки в Стокгольме.",
    postJob: "Опубликовать работу по уборке",
    seeServices: "Смотреть клининговые услуги",
  },
  en: {
    metaTitle: "Cleaning Company Stockholm | Clean Jobs",
    metaDescription:
      "Find cleaning companies, home cleaning, office cleaning and move-out cleaning in Stockholm.",
    title: "Cleaning Company Stockholm",
    text: "Find cleaning companies and cleaning services in Stockholm.",
    postJob: "Post cleaning job",
    seeServices: "See cleaning services",
  },
  sv: {
    metaTitle: "Städfirma Stockholm | Clean Jobs",
    metaDescription:
      "Hitta städfirmor, hemstädning, kontorsstädning och flyttstädning i Stockholm.",
    title: "Städfirma Stockholm",
    text: "Hitta städfirmor och städtjänster i Stockholm.",
    postJob: "Lägg upp städjobb",
    seeServices: "Se städtjänster",
  },
  pl: {
    metaTitle: "Firma sprzątająca Sztokholm | Clean Jobs",
    metaDescription:
      "Znajdź firmy sprzątające, sprzątanie domu, biura i po przeprowadzce w Sztokholmie.",
    title: "Firma sprzątająca Sztokholm",
    text: "Znajdź firmy sprzątające i usługi sprzątania w Sztokholmie.",
    postJob: "Dodaj pracę sprzątania",
    seeServices: "Zobacz usługi sprzątania",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/stadfirma-stockholm",
    },
  }
}

export default async function Page() {
  const locale = await getLocale()
  const t = copy[locale]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-5xl font-bold">{t.title}</h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          {t.text}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/jobs/create"
            prefetch={false}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
          >
            {t.postJob}
          </Link>

          <Link
            href="/jobs"
            prefetch={false}
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
          >
            {t.seeServices}
          </Link>
        </div>

        <RelatedGuides currentPath="/stadfirma-stockholm" />
      </main>
    </div>
  )
}