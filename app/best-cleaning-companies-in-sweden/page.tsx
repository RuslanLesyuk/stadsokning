
import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Best Cleaning Companies in Sweden 2026 | Clean Jobs",
  description:
    "Guide to finding the best cleaning companies in Sweden. Compare home cleaning, office cleaning, move-out cleaning, reviews, prices and local cleaning services.",
  alternates: {
    canonical: "/best-cleaning-companies-in-sweden",
  },
  keywords: [
    "best cleaning companies in Sweden",
    "cleaning companies Sweden",
    "cleaning company Sweden",
    "home cleaning Sweden",
    "office cleaning Sweden",
    "move out cleaning Sweden",
    "hire cleaner Sweden",
    "cleaning services Sweden",
    "trusted cleaners Sweden",
    "cleaning marketplace Sweden",
  ],
  openGraph: {
    title: "Best Cleaning Companies in Sweden | Clean Jobs",
    description:
      "Learn how to compare cleaning companies in Sweden and find trusted cleaners for homes, offices and move-out cleaning.",
    url: `${siteUrl}/best-cleaning-companies-in-sweden`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Best cleaning companies in Sweden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Cleaning Companies in Sweden",
    description:
      "Guide to choosing trusted cleaning companies and cleaners in Sweden.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I choose the best cleaning company in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Compare services, prices, availability, communication, reviews, insurance, company information and whether the company offers the type of cleaning you need.",
      },
    },
    {
      "@type": "Question",
      name: "What cleaning services are common in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Common services include home cleaning, office cleaning, move-out cleaning, apartment cleaning, deep cleaning, stair cleaning and recurring cleaning.",
      },
    },
    {
      "@type": "Question",
      name: "Can Clean Jobs help me find cleaning companies?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Clean Jobs helps clients, cleaners and cleaning companies connect through a focused marketplace for cleaning jobs and cleaning services.",
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

function CheckCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg text-rose-700">
        ✓
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function BestCleaningCompaniesInSwedenPage() {
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
            Cleaning companies
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Best cleaning companies in Sweden: how to choose the right one
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Choosing a cleaning company in Sweden is about more than price. The best
            cleaning companies are reliable, clear in communication, transparent
            about services and easy to contact. This guide explains how to compare
            cleaning companies for home cleaning, office cleaning, move-out cleaning
            and recurring cleaning.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Post a cleaning job
            </Link>

            <Link
              href="/hire-cleaner-stockholm"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Hire cleaner Stockholm
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow="Comparison" title="What makes a cleaning company one of the best?">
            <p>
              A strong cleaning company should make it easy to understand what
              services are offered, where the company works, how to contact them
              and what type of clients they help. For private clients, trust is
              especially important because the cleaner may enter the home. For
              business clients, reliability and long-term service quality are often
              the most important factors.
            </p>

            <p>
              Clean Jobs is designed to help this comparison become easier. Clients
              can post cleaning jobs, cleaners and companies can show their profiles,
              and communication can happen directly through the platform.
            </p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <CheckCard
              title="Clear services"
              text="A good company explains whether it offers home cleaning, office cleaning, move-out cleaning or recurring cleaning."
            />
            <CheckCard
              title="Local coverage"
              text="Check whether the company works in your city, nearby suburbs and the specific area where you need help."
            />
            <CheckCard
              title="Fast replies"
              text="Good communication is often a strong sign that the company is organized and reliable."
            />
            <CheckCard
              title="Trust signals"
              text="Look for company name, profile information, reviews, verification, logo and professional presentation."
            />
          </section>

          <Section eyebrow="Services" title="Common cleaning services in Sweden">
            <p>
              The most common services are home cleaning, apartment cleaning, office
              cleaning, move-out cleaning, stair cleaning, deep cleaning and
              recurring weekly or monthly cleaning. Some companies also offer window
              cleaning, post-renovation cleaning or cleaning for housing
              associations.
            </p>

            <p>
              Before choosing a company, describe the job clearly. Include the city,
              approximate area, property size, type of cleaning, preferred date,
              time and budget. Clear information helps cleaning companies answer
              faster and more accurately.
            </p>
          </Section>

          <Section eyebrow="Cities" title="Where to find cleaning companies in Sweden">
            <p>
              The strongest markets are usually Stockholm, Gothenburg and Malmö,
              because these cities have many homes, offices, rental apartments and
              businesses. There is also strong demand in Uppsala, Västerås, Örebro,
              Linköping, Helsingborg, Lund and Jönköping.
            </p>

            <p>
              If you are a client, search locally first. If you are a cleaning
              company, make sure your profile clearly shows which cities and areas
              you cover. Local visibility is one of the most important SEO factors
              for cleaning services.
            </p>
          </Section>

          <Section eyebrow="Clients" title="How to hire a cleaner safely">
            <p>
              Start with a clear job description and avoid vague messages. Explain
              what needs to be cleaned, how large the property is and whether
              cleaning materials are available. Ask practical questions before the
              job starts and keep communication in one place.
            </p>

            <p>
              On Clean Jobs, you can post a cleaning job and receive interest from
              cleaners or cleaning companies. This makes the process easier than
              contacting many companies manually.
            </p>
          </Section>

          <Section eyebrow="Companies" title="How cleaning companies can appear on future lists">
            <p>
              This page is currently a guide, not a ranking of specific companies.
              In the future, Clean Jobs can highlight real registered cleaning
              companies based on profile quality, verification, reviews, activity
              and service coverage.
            </p>

            <p>
              That means cleaning companies should create a complete profile now:
              company name, logo, city, service areas and clear descriptions. The
              better the profile, the easier it becomes for clients to trust the
              company.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Find trusted cleaning help in Sweden
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs helps clients, cleaners and cleaning companies connect in
              one marketplace. Post a job or create a company profile today.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Post job
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Create account
              </Link>
            </div>
          </section>
          <RelatedGuides currentPath="/work-in-sweden" />
          <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
          <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
          <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
        </div>
      </main>
    </div>
  )
}
