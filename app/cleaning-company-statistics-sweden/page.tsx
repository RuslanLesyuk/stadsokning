
import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Cleaning Company Statistics Sweden 2026 | Market Guide",
  description:
    "Cleaning company statistics and market guide for Sweden. Learn about the cleaning services industry, demand, companies, employment and opportunities for cleaners and clients.",
  alternates: {
    canonical: "/cleaning-company-statistics-sweden",
  },
  keywords: [
    "cleaning company statistics Sweden",
    "cleaning industry Sweden",
    "cleaning market Sweden",
    "cleaning companies Sweden",
    "cleaning services Sweden",
    "cleaning business Sweden",
    "cleaning jobs Sweden",
    "facility management Sweden",
    "home cleaning Sweden",
    "office cleaning Sweden",
  ],
  openGraph: {
    title: "Cleaning Company Statistics Sweden | Clean Jobs",
    description:
      "Market guide for cleaning companies, cleaning jobs and the cleaning services industry in Sweden.",
    url: `${siteUrl}/cleaning-company-statistics-sweden`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cleaning company statistics Sweden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Company Statistics Sweden",
    description:
      "Cleaning industry statistics and market guide for Sweden.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is the cleaning industry important in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Cleaning services are part of Sweden's broader service economy and include home cleaning, office cleaning, facility services, move-out cleaning and cleaning companies serving private and business clients.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I find official cleaning company data in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Official company and employment data can be found through Statistics Sweden's Statistical Business Register and other SCB statistics by industry.",
      },
    },
    {
      "@type": "Question",
      name: "How can cleaning companies get more clients in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Cleaning companies can improve visibility by building an online profile, showing company information, responding quickly to requests and using marketplaces such as Clean Jobs.",
      },
    },
  ],
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      {eyebrow ? (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
        {children}
      </div>
    </section>
  )
}

function StatCard({
  title,
  value,
  text,
}: {
  title: string
  value: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function CleaningCompanyStatisticsSwedenPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-10">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Cleaning industry Sweden
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Cleaning company statistics in Sweden
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Sweden’s cleaning services industry includes home cleaning, office
            cleaning, facility services, move-out cleaning, sanitation and cleaning
            companies serving private homes, property owners and businesses. This
            guide summarizes the market and explains why digital visibility is
            important for cleaners and cleaning companies.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Browse cleaning jobs
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Post a cleaning job
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title="Official company data"
              value="SCB"
              text="Statistics Sweden reports the number of enterprises and employees by industry and size class through the Statistical Business Register."
            />

            <StatCard
              title="Industry trend"
              value="Growth phase"
              text="Almega Serviceföretagen’s 2024 report describes the cleaning, FM and home-service industry as being in a growth phase despite a challenging external environment."
            />

            <StatCard
              title="Productivity benchmark"
              value="€54.7k"
              text="A 2023 cleaning-services dataset reported turnover per employee in Sweden at about 54.7 thousand euros, with forecasts staying close to 55 thousand euros."
            />
          </section>

          <Section eyebrow="Market overview" title="What counts as the cleaning industry in Sweden?">
            <p>
              The Swedish cleaning market is broader than only private home cleaning.
              It includes cleaning companies, facility management, office cleaning,
              home services, move-out cleaning, stair cleaning, sanitation, retail
              cleaning and cleaning for property owners. Some companies focus on
              private households, while others work mostly with offices, housing
              associations or commercial premises.
            </p>

            <p>
              For SEO and business development, this matters because different
              clients search in different ways. A private client may search for
              “hire cleaner Stockholm”, while a business client may search for
              “office cleaning company Sweden” or “cleaning company Stockholm”.
            </p>
          </Section>

          <Section eyebrow="Statistics" title="Where the numbers come from">
            <p>
              The most reliable official source for company and employment data is
              Statistics Sweden. SCB’s Statistical Business Register reports
              enterprises and employees by industry and size class. For cleaning
              companies, this type of data is useful for understanding market
              structure, number of businesses and the importance of small companies.
            </p>

            <p>
              Industry organizations also publish market reports. Almega
              Serviceföretagen’s 2024 branch report covers cleaning, facility
              management and home-service companies and describes the sector as
              continuing to develop even during a more challenging economy.
            </p>
          </Section>

          <Section eyebrow="Demand" title="Why demand for cleaning services remains strong">
            <p>
              Cleaning is a recurring need. Homes, offices, rental apartments,
              shops, restaurants and property owners all need cleaning. Some demand
              is weekly and predictable, while other demand appears when people move,
              renovate, open offices or need urgent cleaning help.
            </p>

            <p>
              This creates opportunities for both individual cleaners and cleaning
              companies. Workers can find home cleaning, office cleaning and move-out
              cleaning jobs, while companies can build recurring client relationships
              and local brand visibility.
            </p>
          </Section>

          <Section eyebrow="Digital visibility" title="Why cleaning companies need online visibility">
            <p>
              Many cleaning companies still depend on referrals, local Facebook
              groups, old directories or manual outreach. That can work, but it is
              slow. Clients increasingly expect to find companies online, compare
              options and contact a cleaner quickly.
            </p>

            <p>
              Clean Jobs is designed to make that easier. A cleaning company can
              create a profile, show company name and logo, receive job requests and
              become visible to people who are already looking for cleaning help.
            </p>
          </Section>

          <Section eyebrow="Cities" title="Strong cleaning markets in Sweden">
            <p>
              The strongest markets are usually the largest city regions: Stockholm,
              Gothenburg and Malmö. These areas have many apartments, offices,
              rental properties and local businesses. Uppsala, Västerås, Örebro,
              Linköping, Helsingborg, Lund and Jönköping are also relevant cities
              for cleaning jobs and cleaning companies.
            </p>

            <p>
              A long-term SEO strategy should therefore include both national pages
              and city pages. National pages explain the market, while city pages
              target local searches such as “cleaning jobs Stockholm” or “hire
              cleaner Gothenburg”.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Grow your cleaning company with Clean Jobs
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs helps cleaning companies, cleaners and clients meet in one
              focused marketplace. Create a profile, browse jobs or post cleaning
              work today.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Create account
              </Link>

              <Link
                href="/hire-cleaner-stockholm"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Hire cleaner Stockholm
              </Link>
            </div>
          </section>
        </div>
        <RelatedGuides currentPath="/work-in-sweden" />
                <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
      </main>
    </div>
  )
}
