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
    metaTitle: "Найняти прибиральника в Стокгольмі | Clean Jobs",
    metaDescription:
      "Знайдіть надійних прибиральників, клінінгові компанії, прибирання дому та офісу в Стокгольмі.",
    title: "Найняти прибиральника в Стокгольмі",
    text:
      "Шукаєте прибиральника в Стокгольмі? Clean Jobs допомагає клієнтам знаходити прибиральників і клінінгові компанії.",
    button: "Знайти прибиральників",
  },
  ru: {
    metaTitle: "Нанять уборщика в Стокгольме | Clean Jobs",
    metaDescription:
      "Найдите надёжных уборщиков, клининговые компании, уборку дома и офиса в Стокгольме.",
    title: "Нанять уборщика в Стокгольме",
    text:
      "Ищете уборщика в Стокгольме? Clean Jobs помогает клиентам находить уборщиков и клининговые компании.",
    button: "Найти уборщиков",
  },
  en: {
    metaTitle: "Hire a Cleaner in Stockholm | Clean Jobs",
    metaDescription:
      "Find trusted cleaners, cleaning companies, home cleaning and office cleaning services in Stockholm.",
    title: "Hire a Cleaner in Stockholm",
    text:
      "Looking for a cleaner in Stockholm? Clean Jobs helps connect clients with cleaners and cleaning companies.",
    button: "Find cleaners",
  },
  sv: {
    metaTitle: "Anlita städare i Stockholm | Clean Jobs",
    metaDescription:
      "Hitta pålitliga städare, städföretag, hemstädning och kontorsstädning i Stockholm.",
    title: "Anlita städare i Stockholm",
    text:
      "Letar du efter städare i Stockholm? Clean Jobs hjälper kunder att hitta städare och städföretag.",
    button: "Hitta städare",
  },
  pl: {
    metaTitle: "Zatrudnij sprzątacza w Sztokholmie | Clean Jobs",
    metaDescription:
      "Znajdź zaufanych sprzątaczy, firmy sprzątające, sprzątanie domu i biura w Sztokholmie.",
    title: "Zatrudnij sprzątacza w Sztokholmie",
    text:
      "Szukasz sprzątacza w Sztokholmie? Clean Jobs pomaga klientom znaleźć sprzątaczy i firmy sprzątające.",
    button: "Znajdź sprzątaczy",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/hire-cleaner-stockholm",
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

        <p className="mt-6 text-slate-600">{t.text}</p>

        <Link
          href="/jobs"
          prefetch={false}
          className="mt-6 inline-flex rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
        >
          {t.button}
        </Link>

        <RelatedGuides currentPath="/hire-cleaner-stockholm" />
      </main>
    </div>
  )
}