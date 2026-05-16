import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const metadata: Metadata = {
  metadataBase: new URL("https://cleanjobs.app"),

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
  ],

  authors: [{ name: "Clean Jobs" }],
  creator: "Clean Jobs",

  openGraph: {
    title: "Clean Jobs",
    description:
      "Find cleaning jobs or hire cleaners quickly in your city.",
    url: "https://cleanjobs.app",
    siteName: "Clean Jobs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
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

  icons: {
    icon: "/favicon.ico",
  },
}

type FooterCopy = {
  title: string
  subtitle: string
  terms: string
  privacy: string
}

const footerCopy: Record<Locale, FooterCopy> = {
  uk: {
    title: "Clean Jobs",
    subtitle: "Платформа для пошуку клінінгової роботи.",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
  },
  ru: {
    title: "Clean Jobs",
    subtitle: "Платформа для поиска клининговой работы.",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
  },
  en: {
    title: "Clean Jobs",
    subtitle: "Cleaning marketplace platform.",
    terms: "Terms",
    privacy: "Privacy",
  },
  sv: {
    title: "Clean Jobs",
    subtitle: "Plattform för städjobb.",
    terms: "Villkor",
    privacy: "Integritet",
  },
  pl: {
    title: "Clean Jobs",
    subtitle: "Platforma do ofert sprzątania.",
    terms: "Regulamin",
    privacy: "Prywatność",
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

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200/80 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-6">
              <div>
                <div className="text-sm font-semibold tracking-tight text-slate-900">
                  {t.title}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {t.subtitle}
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
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}