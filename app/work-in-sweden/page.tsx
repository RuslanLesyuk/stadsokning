import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
  description: "Complete guide to finding work in Sweden in 2026. Learn about cleaning jobs, jobs for foreigners, Stockholm jobs, part-time work, full-time work and how Clean Jobs helps workers and companies connect.",
  alternates: {
    canonical: "/work-in-sweden",
  },
  keywords: ['jobs in Sweden', 'work in Sweden', 'jobs for foreigners in Sweden', 'cleaning jobs Sweden', 'cleaner jobs Sweden', 'jobs in Stockholm', 'jobs in Gothenburg', 'jobs in Malmö', 'part time jobs Sweden', 'full time jobs Sweden'],
  openGraph: {
    title: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
    description: "Complete guide to finding work in Sweden in 2026. Learn about cleaning jobs, jobs for foreigners, Stockholm jobs, part-time work, full-time work and how Clean Jobs helps workers and companies connect.",
    url: `${siteUrl}/work-in-sweden`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
    description: "Complete guide to finding work in Sweden in 2026. Learn about cleaning jobs, jobs for foreigners, Stockholm jobs, part-time work, full-time work and how Clean Jobs helps workers and companies connect.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can Clean Jobs help?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
      },
    },
    {
      "@type": "Question",
      name: "Is Clean Jobs only for cleaning work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",
      },
    },
  ],
}

export default function SeoLandingPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-10">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Clean Jobs
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Work in Sweden: jobs, cleaning work and practical advice for 2026
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Sweden has a strong service economy with demand for reliable workers in cleaning, facility services, hotels, restaurants, warehouses, construction and home services. This guide explains how to find work in Sweden and how Clean Jobs helps clients, cleaners and cleaning companies connect faster.
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
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Guide</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">How to find work in Sweden</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>If you are searching for jobs in Sweden, start by choosing the type of work that matches your skills, language level and schedule. Many people begin with service jobs, cleaning jobs, warehouse jobs, construction support, restaurant work, delivery work or hotel jobs.</p>
            <p>A good strategy is to prepare a simple CV, keep your phone number and email active, respond quickly to messages and apply to several jobs every week. If you are interested in cleaning work, Clean Jobs gives you a focused marketplace where you can browse cleaning jobs and build trust through your profile.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Cleaning work</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Cleaning jobs in Sweden</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Cleaning jobs in Sweden can include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and regular recurring cleaning. Clients usually care about reliability, clear communication, punctuality and quality.</p>
            <p>Cleaning work is also useful for cleaning companies that need extra workers, subcontractors or new clients. A marketplace like Clean Jobs helps connect people who need cleaning with people who are ready to work.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Cities</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Best cities for jobs in Sweden</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>The biggest job markets are usually found in Stockholm, Gothenburg and Malmö, but many opportunities also exist in Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund and surrounding commuter towns.</p>
            <p>If you live near Stockholm, it can be useful to search for cleaning jobs in several nearby areas, including Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge and Botkyrka.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Foreign workers</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Jobs in Sweden for foreigners</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Many foreigners search for work in Sweden while they are still learning Swedish. Some jobs require fluent Swedish, but service roles can sometimes work with English, basic Swedish or another shared language.</p>
            <p>To increase your chances, create a profile with your name, city, phone number and experience. Add a professional photo or company logo if you have one.</p>
          </div>
        </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">SEO search topics</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobs in Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">work in Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobs for foreigners in Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">cleaning jobs Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">cleaner jobs Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobs in Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobs in Gothenburg</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">jobs in Malmö</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">part time jobs Sweden</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">full time jobs Sweden</span>
            </div>
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Start with Clean Jobs</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">Browse jobs</Link>
              <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">Create account</Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
