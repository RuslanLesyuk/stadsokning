import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/react"

import "./globals.css"

import SiteHeader from "@/components/site-header"
import { normalizeLocale, type Locale } from "@/lib/i18n"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Clean Jobs",
    template: "%s | Clean Jobs",
  },

  description:
    "Find cleaning jobs or hire cleaners quickly. Clean Jobs connects clients and workers in your city.",

  keywords: [
    "cleaning jobs",
    "cleaner",
    "hire cleaner",
    "jobs marketplace",
    "cleaning services",
    "städjobb",
    "hemstädning",
    "kontorsstädning",
    "Stockholm cleaning jobs",
  ],

  authors: [{ name: "Clean Jobs" }],
  creator: "Clean Jobs",

  alternates: {
    canonical: siteUrl,
  },

  openGraph: {
    title: "Clean Jobs",
    description:
      "Find cleaning jobs or hire cleaners quickly in your city.",
    url: siteUrl,
    siteName: "Clean Jobs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clean Jobs cleaning marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Clean Jobs",
    description:
      "Find cleaning jobs or hire cleaners quickly in your city.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  themeColor: "#e11d48",

  icons: {
    icon: "/favicon.ico",
  },
}

type FooterCopy = {
  title: string
  subtitle: string
  terms: string
  privacy: string
  contact: string
  copyright: string
}

const footerCopy: Record<Locale, FooterCopy> = {
  uk: {
    title: "Clean Jobs",
    subtitle:
      "Платформа для пошуку клінінгової роботи та виконавців.",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
    contact: "Контакти",
    copyright: "Усі права захищено.",
  },

  ru: {
    title: "Clean Jobs",
    subtitle:
      "Платформа для поиска клининговой работы и исполнителей.",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    contact: "Контакты",
    copyright: "Все права защищены.",
  },

  en: {
    title: "Clean Jobs",
    subtitle:
      "Cleaning marketplace for clients and workers.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    copyright: "All rights reserved.",
  },

  sv: {
    title: "Clean Jobs",
    subtitle:
      "Marknadsplats för städjobb och städare.",
    terms: "Villkor",
    privacy: "Integritet",
    contact: "Kontakt",
    copyright: "Alla rättigheter förbehållna.",
  },

  pl: {
    title: "Clean Jobs",
    subtitle:
      "Platforma dla zleceń sprzątania i wykonawców.",
    terms: "Regulamin",
    privacy: "Prywatność",
    contact: "Kontakt",
    copyright: "Wszelkie prawa zastrzeżone.",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale

  const t = footerCopy[locale] || footerCopy.en

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-[#fafafa] text-slate-900">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
              <div>
                <div className="text-lg font-semibold tracking-tight text-slate-950">
                  {t.title}
                </div>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {t.subtitle}
                </p>

                <p className="mt-4 text-xs text-slate-400">
                  © {new Date().getFullYear()} Clean Jobs.{" "}
                  {t.copyright}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/terms"
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  {t.terms}
                </Link>

                <Link
                  href="/privacy"
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  {t.privacy}
                </Link>

                <Link
                  href="/contact"
                  prefetch={false}
                  className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
                >
                  {t.contact}
                </Link>
              </div>
            </div>
          </footer>
        </div>

        <Analytics />
      </body>
    </html>
  )
}