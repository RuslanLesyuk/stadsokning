import type { Metadata, Viewport } from "next"
import Link from "next/link"
import Script from "next/script"
import { cookies } from "next/headers"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import LanguageWelcomeModal from "@/components/language-welcome-modal"
import { normalizeLocale, type Locale } from "@/lib/i18n"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cleaning Jobs in Sweden | Find Cleaners & Cleaning Work",
    template: "%s | Clean Jobs",
  },
  description:
    "Find cleaning jobs across Sweden or hire trusted cleaners. Browse house cleaning, office cleaning, apartment cleaning and professional cleaning work in Stockholm, Göteborg, Malmö and nearby cities.",
  applicationName: "Clean Jobs",
  keywords: [
    "cleaning jobs Sweden",
    "cleaning jobs Stockholm",
    "städjobb Stockholm",
    "städjobb Sverige",
    "städfirma jobb",
    "cleaner jobs Sweden",
    "house cleaning jobs",
    "office cleaning jobs",
    "apartment cleaning",
    "hire cleaner Sweden",
    "hire cleaner Stockholm",
    "hemstädning jobb",
    "kontorsstädning jobb",
    "cleaning marketplace Sweden",
    "Clean Jobs",
  ],
  authors: [{ name: "Clean Jobs" }],
  creator: "Clean Jobs",
  publisher: "Clean Jobs",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Cleaning Jobs in Sweden | Clean Jobs",
    description:
      "Find cleaning jobs across Sweden or hire trusted cleaners for house cleaning, office cleaning and apartment cleaning.",
    url: "/",
    siteName: "Clean Jobs",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Clean Jobs marketplace for cleaning jobs in Sweden",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Jobs in Sweden | Clean Jobs",
    description:
      "Find cleaning jobs across Sweden or hire trusted cleaners for house cleaning, office cleaning and apartment cleaning.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  category: "marketplace",
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
  copyright: string
}

const footerCopy: Record<Locale, FooterCopy> = {
  uk: {
    title: "Clean Jobs",
    subtitle:
      "Платформа для пошуку клінінгової роботи та виконавців у Швеції.",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
    contact: "Контакти",
    copyright: "Усі права захищено.",
  },
  ru: {
    title: "Clean Jobs",
    subtitle:
      "Платформа для поиска клининговой работы и исполнителей в Швеции.",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
    contact: "Контакты",
    copyright: "Все права защищены.",
  },
  en: {
    title: "Clean Jobs",
    subtitle: "Cleaning marketplace for clients and workers across Sweden.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    copyright: "All rights reserved.",
  },
  sv: {
    title: "Clean Jobs",
    subtitle: "Marknadsplats för städjobb och städare i Sverige.",
    terms: "Villkor",
    privacy: "Integritet",
    contact: "Kontakt",
    copyright: "Alla rättigheter förbehållna.",
  },
  pl: {
    title: "Clean Jobs",
    subtitle: "Platforma dla zleceń sprzątania i wykonawców w Szwecji.",
    terms: "Regulamin",
    privacy: "Prywatność",
    contact: "Kontakt",
    copyright: "Wszelkie prawa zastrzeżone.",
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
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Clean Jobs",
      description:
        "Cleaning jobs marketplace for clients and workers across Sweden.",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${siteUrl}/jobs?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <div className="flex min-h-screen flex-col">
          <SiteHeader />

          <main className="flex-1">{children}</main>

          <footer className="border-t border-slate-200 bg-white">
  <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">

    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-lg font-semibold tracking-tight text-slate-950">
          {t.title}
        </div>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          {t.subtitle}
        </p>

        <p className="mt-4 text-xs text-slate-400">
          © {new Date().getFullYear()} Clean Jobs. {t.copyright}
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

    <div className="mt-8 border-t border-slate-200 pt-8">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">
        Popular Guides
      </h3>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/work-in-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          Work in Sweden
        </Link>

        <Link href="/jobs-for-foreigners-in-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          Jobs for Foreigners in Sweden
        </Link>

        <Link href="/how-to-find-a-job-in-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          How to Find a Job in Sweden
        </Link>

        <Link href="/jobb-i-sverige" className="text-sm text-slate-600 hover:text-rose-600">
          Jobb i Sverige
        </Link>

        <Link href="/jobb-utan-svenska" className="text-sm text-slate-600 hover:text-rose-600">
          Jobb utan svenska
        </Link>

        <Link href="/hur-man-far-jobb-i-sverige" className="text-sm text-slate-600 hover:text-rose-600">
          Hur man får jobb i Sverige
        </Link>

        <Link href="/how-much-do-cleaners-earn-in-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          Cleaner Salary Sweden
        </Link>

        <Link href="/vad-tjanar-en-stadare-i-sverige" className="text-sm text-slate-600 hover:text-rose-600">
          Vad tjänar en städare
        </Link>

        <Link href="/cleaning-company-statistics-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          Cleaning Industry Statistics
        </Link>

        <Link href="/stadbranschen-i-sverige-statistik" className="text-sm text-slate-600 hover:text-rose-600">
          Städbranschen Statistik
        </Link>

        <Link href="/hire-cleaner-stockholm" className="text-sm text-slate-600 hover:text-rose-600">
          Hire Cleaner Stockholm
        </Link>

        <Link href="/stadfirma-stockholm" className="text-sm text-slate-600 hover:text-rose-600">
          Städfirma Stockholm
        </Link>

        <Link href="/best-cleaning-companies-in-sweden" className="text-sm text-slate-600 hover:text-rose-600">
          Best Cleaning Companies
        </Link>

        <Link href="/basta-stadforetag-i-sverige" className="text-sm text-slate-600 hover:text-rose-600">
          Bästa Städföretag
        </Link>
      </div>
    </div>

  </div>
</footer>
        </div>

        <LanguageWelcomeModal />

        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wzu4anu3qc");
          `}
        </Script>
              <Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>

<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
      page_path: window.location.pathname,
    });
  `}
</Script>
        <Analytics />
      </body>
    </html>
  )
}


eccYD9c5mIT3VyF5o4w1hbLJfeNkguEyffDj2TInKro=