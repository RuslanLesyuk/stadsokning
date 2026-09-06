import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { cookies, headers } from "next/headers"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import SiteHeader from "@/components/site-header"
import NavigationLoading from "@/components/navigation-loading"
import AcquisitionTracker from "@/components/analytics/acquisition-tracker"
import LanguageWelcomeModal from "@/components/language-welcome-modal"
import CookieConsentManager from "@/components/privacy/cookie-consent-manager"
import {
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import {
  ANALYTICS_CONSENT_COOKIE,
  normalizeAnalyticsConsent,
} from "@/lib/privacy/consent"

const siteUrl = "https://cleansjob.com"
const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID || null
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_ID || "wzu4anu3qc"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Städjobb och städföretag i Sverige | Clean Jobs",
    template: "%s | Clean Jobs",
  },
  description:
    "Hitta städjobb och jämför städföretag i Sverige. Sök hemstädning, flyttstädning, kontorsstädning och andra städtjänster i Stockholm, Göteborg, Malmö och fler orter.",
  applicationName: "Clean Jobs",
  authors: [{ name: "Clean Jobs" }],
  creator: "Clean Jobs",
  publisher: "Clean Jobs",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#e11d48",
}

type FooterCopy = {
  title: string
  subtitle: string
  terms: string
  privacy: string
  contact: string
  faq: string
  cookies: string
  copyright: string
  popularGuides: string
  guideWorkInSweden: string
  guideForeigners: string
  guideFindJob: string
  guideJobbISverige: string
  guideJobbUtanSvenska: string
  guideHurManFarJobb: string
  guideCleanerSalary: string
  guideVadTjanar: string
  guideIndustryStats: string
  guideStadbranschen: string
  guideHireCleaner: string
  guideStadfirma: string
  guideBestCompanies: string
  guideBastaStadforetag: string
}

const footerCopy: Record<Locale, FooterCopy> = {
  uk: {
    title: "Clean Jobs",
    subtitle: "Платформа для пошуку клінінгової роботи та виконавців у Швеції.",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
    contact: "Контакти",
    faq: "Допомога",
    cookies: "Cookies",
    copyright: "Усі права захищено.",
    popularGuides: "Популярні гайди",
    guideWorkInSweden: "Робота у Швеції",
    guideForeigners: "Робота для іноземців у Швеції",
    guideFindJob: "Як знайти роботу у Швеції",
    guideJobbISverige: "Робота у Швеції",
    guideJobbUtanSvenska: "Робота без шведської",
    guideHurManFarJobb: "Як отримати роботу у Швеції",
    guideCleanerSalary: "Зарплата прибиральника у Швеції",
    guideVadTjanar: "Скільки заробляє прибиральник",
    guideIndustryStats: "Статистика клінінгової галузі",
    guideStadbranschen: "Статистика клінінгу у Швеції",
    guideHireCleaner: "Найняти прибиральника у Стокгольмі",
    guideStadfirma: "Клінінгова компанія у Стокгольмі",
    guideBestCompanies: "Найкращі клінінгові компанії",
    guideBastaStadforetag: "Найкращі клінінгові компанії",
  },
  ru: {
    title: "Clean Jobs",
    subtitle: "Платформа для поиска клининговой работы и исполнителей в Швеции.",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    contact: "Контакты",
    faq: "Помощь",
    cookies: "Cookies",
    copyright: "Все права защищены.",
    popularGuides: "Популярные гайды",
    guideWorkInSweden: "Работа в Швеции",
    guideForeigners: "Работа для иностранцев в Швеции",
    guideFindJob: "Как найти работу в Швеции",
    guideJobbISverige: "Работа в Швеции",
    guideJobbUtanSvenska: "Работа без шведского",
    guideHurManFarJobb: "Как получить работу в Швеции",
    guideCleanerSalary: "Зарплата уборщика в Швеции",
    guideVadTjanar: "Сколько зарабатывает уборщик",
    guideIndustryStats: "Статистика клининговой отрасли",
    guideStadbranschen: "Статистика клининга в Швеции",
    guideHireCleaner: "Нанять уборщика в Стокгольме",
    guideStadfirma: "Клининговая компания в Стокгольме",
    guideBestCompanies: "Лучшие клининговые компании",
    guideBastaStadforetag: "Лучшие клининговые компании",
  },
  en: {
    title: "Clean Jobs",
    subtitle: "Cleaning marketplace for clients and workers across Sweden.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    faq: "Help Center",
    cookies: "Cookies",
    copyright: "All rights reserved.",
    popularGuides: "Popular Guides",
    guideWorkInSweden: "Work in Sweden",
    guideForeigners: "Jobs for Foreigners in Sweden",
    guideFindJob: "How to Find a Job in Sweden",
    guideJobbISverige: "Jobs in Sweden",
    guideJobbUtanSvenska: "Jobs without Swedish",
    guideHurManFarJobb: "How to Get a Job in Sweden",
    guideCleanerSalary: "Cleaner Salary Sweden",
    guideVadTjanar: "Cleaner Salary in Sweden",
    guideIndustryStats: "Cleaning Industry Statistics",
    guideStadbranschen: "Cleaning Industry Statistics",
    guideHireCleaner: "Hire Cleaner Stockholm",
    guideStadfirma: "Cleaning Company Stockholm",
    guideBestCompanies: "Best Cleaning Companies",
    guideBastaStadforetag: "Best Cleaning Companies",
  },
  sv: {
    title: "Clean Jobs",
    subtitle: "Marknadsplats för städjobb och städare i Sverige.",
    terms: "Villkor",
    privacy: "Integritet",
    contact: "Kontakt",
    faq: "Hjälp",
    cookies: "Cookies",
    copyright: "Alla rättigheter förbehållna.",
    popularGuides: "Populära guider",
    guideWorkInSweden: "Jobba i Sverige",
    guideForeigners: "Jobb för utlänningar i Sverige",
    guideFindJob: "Hur man hittar jobb i Sverige",
    guideJobbISverige: "Jobb i Sverige",
    guideJobbUtanSvenska: "Jobb utan svenska",
    guideHurManFarJobb: "Hur man får jobb i Sverige",
    guideCleanerSalary: "Lön för städare i Sverige",
    guideVadTjanar: "Vad tjänar en städare",
    guideIndustryStats: "Statistik om städbranschen",
    guideStadbranschen: "Städbranschen statistik",
    guideHireCleaner: "Anlita städare i Stockholm",
    guideStadfirma: "Städfirma Stockholm",
    guideBestCompanies: "Bästa städföretag",
    guideBastaStadforetag: "Bästa städföretag",
  },
  pl: {
    title: "Clean Jobs",
    subtitle: "Platforma dla zleceń sprzątania i wykonawców w Szwecji.",
    terms: "Regulamin",
    privacy: "Prywatność",
    contact: "Kontakt",
    faq: "Pomoc",
    cookies: "Cookies",
    copyright: "Wszelkie prawa zastrzeżone.",
    popularGuides: "Popularne poradniki",
    guideWorkInSweden: "Praca w Szwecji",
    guideForeigners: "Praca dla obcokrajowców w Szwecji",
    guideFindJob: "Jak znaleźć pracę w Szwecji",
    guideJobbISverige: "Praca w Szwecji",
    guideJobbUtanSvenska: "Praca bez języka szwedzkiego",
    guideHurManFarJobb: "Jak dostać pracę w Szwecji",
    guideCleanerSalary: "Wynagrodzenie sprzątacza w Szwecji",
    guideVadTjanar: "Ile zarabia sprzątacz",
    guideIndustryStats: "Statystyki branży sprzątania",
    guideStadbranschen: "Statystyki branży sprzątania",
    guideHireCleaner: "Zatrudnij sprzątacza w Sztokholmie",
    guideStadfirma: "Firma sprzątająca w Sztokholmie",
    guideBestCompanies: "Najlepsze firmy sprzątające",
    guideBastaStadforetag: "Najlepsze firmy sprzątające",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Clean Jobs",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      email: "support@cleansjob.com",
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@cleansjob.com",
          availableLanguage: ["Swedish", "English", "Ukrainian", "Russian", "Polish"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Clean Jobs",
      description: "Svensk marknadsplats för städjobb, städare och städföretag.",
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: ["sv", "en", "uk", "ru", "pl"],
    },
  ],
}

function isStandaloneCompanySite(pathname: string) {
  const cleanPath = pathname.split("?")[0]

  if (cleanPath === "/site" || cleanPath.startsWith("/site/")) {
    return true
  }

  return /^\/dashboard\/companies\/[^/]+\/website\/preview$/.test(cleanPath)
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [cookieStore, headerStore] = await Promise.all([cookies(), headers()])
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value) as Locale
  const t = footerCopy[locale] || footerCopy.sv
  const currentPath = headerStore.get("x-current-path") || ""
  const standalone = isStandaloneCompanySite(currentPath)
  const analyticsConsent = normalizeAnalyticsConsent(
    cookieStore.get(ANALYTICS_CONSENT_COOKIE)?.value,
  )

  const allGuideLinks = [
    { href: "/work-in-sweden", label: t.guideWorkInSweden },
    { href: "/jobs-for-foreigners-in-sweden", label: t.guideForeigners },
    { href: "/how-to-find-a-job-in-sweden", label: t.guideFindJob },
    { href: "/jobb-i-sverige", label: t.guideJobbISverige },
    { href: "/jobb-utan-svenska", label: t.guideJobbUtanSvenska },
    { href: "/hur-man-far-jobb-i-sverige", label: t.guideHurManFarJobb },
    { href: "/how-much-do-cleaners-earn-in-sweden", label: t.guideCleanerSalary },
    { href: "/vad-tjanar-en-stadare-i-sverige", label: t.guideVadTjanar },
    { href: "/cleaning-company-statistics-sweden", label: t.guideIndustryStats },
    { href: "/stadbranschen-i-sverige-statistik", label: t.guideStadbranschen },
    { href: "/hire-cleaner-stockholm", label: t.guideHireCleaner },
    { href: "/stadfirma-stockholm", label: t.guideStadfirma },
    { href: "/best-cleaning-companies-in-sweden", label: t.guideBestCompanies },
    { href: "/basta-stadforetag-i-sverige", label: t.guideBastaStadforetag },
  ]

  const swedishGuidePaths = new Set([
    "/jobb-i-sverige",
    "/jobb-utan-svenska",
    "/hur-man-far-jobb-i-sverige",
    "/vad-tjanar-en-stadare-i-sverige",
    "/stadbranschen-i-sverige-statistik",
    "/stadfirma-stockholm",
    "/basta-stadforetag-i-sverige",
  ])

  const guideLinks =
    locale === "sv"
      ? allGuideLinks.filter((link) => swedishGuidePaths.has(link.href))
      : allGuideLinks

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-[#fafafa] text-slate-900">
        <Suspense fallback={null}>
          <NavigationLoading locale={locale} />
          <AcquisitionTracker
            initialConsent={analyticsConsent}
          />
        </Suspense>
        {!standalone ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
        ) : null}

        <div className="flex min-h-screen flex-col">
          {!standalone ? <SiteHeader /> : null}
          <main className="flex-1">{children}</main>

          {!standalone ? (
            <footer className="border-t border-slate-200 bg-white">
              <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-lg font-semibold tracking-tight text-slate-950">{t.title}</div>
                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">{t.subtitle}</p>
                    <p className="mt-4 text-xs text-slate-400">
                      © {new Date().getFullYear()} Clean Jobs. {t.copyright}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link href="/terms" prefetch={false} className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">{t.terms}</Link>
                    <Link href="/privacy" prefetch={false} className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">{t.privacy}</Link>
                    <Link href="/cookies" prefetch={false} className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">{t.cookies}</Link>
                    <Link href="/faq" prefetch={false} className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">{t.faq}</Link>
                    <Link href="/contact" prefetch={false} className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700">{t.contact}</Link>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-8">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">{t.popularGuides}</h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {guideLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="text-sm text-slate-600 hover:text-rose-600">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </footer>
          ) : null}
        </div>

        {!standalone ? <LanguageWelcomeModal /> : null}

        {!standalone ? (
          <CookieConsentManager
            locale={locale}
            initialConsent={analyticsConsent}
            clarityProjectId={clarityProjectId}
            googleAnalyticsId={googleAnalyticsId}
          />
        ) : null}

        <Analytics />
      </body>
    </html>
  )
}
