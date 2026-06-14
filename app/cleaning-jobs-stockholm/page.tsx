import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
  description: "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Stockholm and nearby areas.",
  alternates: {
    canonical: "/cleaning-jobs-stockholm",
  },
  keywords: ['cleaning jobs Stockholm', 'cleaner jobs Stockholm', 'home cleaning jobs Stockholm', 'office cleaning jobs Stockholm', 'move out cleaning Stockholm', 'part time cleaning jobs Stockholm', 'cleaning work Stockholm', 'hire cleaner Stockholm'],
  openGraph: {
    title: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
    description: "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Stockholm and nearby areas.",
    url: `${siteUrl}/cleaning-jobs-stockholm`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
    description: "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Stockholm and nearby areas.",
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
            Cleaning jobs in Stockholm: find cleaner work or hire trusted cleaners
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Stockholm has one of Sweden’s strongest markets for cleaning work. Private homes, apartments, offices, shops and rental properties often need reliable cleaners for one-time and recurring jobs. Clean Jobs helps cleaners, clients and cleaning companies connect in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Browse Stockholm jobs
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
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Overview</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Why Stockholm is strong for cleaning work</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>Stockholm is a large metropolitan area with many apartments, offices, businesses and moving households. This creates steady demand for home cleaning, office cleaning, deep cleaning and move-out cleaning.</p>
            <p>Many clients prefer cleaners with clear profiles, reliable communication and visible experience. A marketplace profile makes it easier for clients to understand who you are and what type of cleaning jobs you accept.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Types of work</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Common cleaning jobs in Stockholm</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>The most common cleaning jobs in Stockholm include apartment cleaning, house cleaning, office cleaning, stair cleaning, move-out cleaning and recurring weekly cleaning.</p>
            <p>Cleaning companies can also use Clean Jobs to find extra work, receive requests from new clients and show their company name, verification and premium profile information.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">Areas</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">Areas near Stockholm where cleaners can find work</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>If you are searching for cleaning jobs in Stockholm, also consider nearby areas and commuter municipalities such as Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge and Botkyrka.</p>
            <p>Cleaners who can travel across several areas have a better chance of finding regular work and building long-term relationships with clients.</p>
          </div>
        </section>
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">For clients</div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">How to hire a cleaner in Stockholm</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
            <p>If you need a cleaner in Stockholm, create a clear job with city, address area, budget, date, time and description. Include the type of cleaning you need and whether the job is one-time or recurring.</p>
            <p>Clean Jobs is built for both private clients and cleaning companies. You can post a job, receive interest from cleaners and continue the conversation through the job page and chat.</p>
          </div>
        </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">SEO search topics</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">cleaning jobs Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">cleaner jobs Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">home cleaning jobs Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">office cleaning jobs Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">move out cleaning Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">part time cleaning jobs Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">cleaning work Stockholm</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">hire cleaner Stockholm</span>
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
          <RelatedGuides currentPath="/work-in-sweden" />
                  <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
                  <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
                  <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" title="Relaterade guider" />
        </div>
      </main>
    </div>
  )
}
