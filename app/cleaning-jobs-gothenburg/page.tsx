import type { Metadata } from "next"
import Link from "next/link"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Cleaning Jobs in Gothenburg 2026 | Find Cleaner Work",
  description:
    "Find cleaning jobs in Gothenburg. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Göteborg and nearby areas.",
  alternates: {
    canonical: "/cleaning-jobs-gothenburg",
  },
  keywords: [
    "cleaning jobs Gothenburg",
    "cleaning jobs Göteborg",
    "cleaner jobs Gothenburg",
    "cleaner jobs Göteborg",
    "home cleaning jobs Gothenburg",
    "office cleaning jobs Gothenburg",
    "move out cleaning Gothenburg",
    "part time cleaning jobs Gothenburg",
    "cleaning work Gothenburg",
    "hire cleaner Gothenburg",
    "Gothenburg cleaning marketplace",
  ],
  openGraph: {
    title: "Cleaning Jobs in Gothenburg | Clean Jobs",
    description:
      "Find cleaner work in Gothenburg or hire trusted cleaners for home cleaning, office cleaning and move-out cleaning.",
    url: `${siteUrl}/cleaning-jobs-gothenburg`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cleaning jobs in Gothenburg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleaning Jobs in Gothenburg | Clean Jobs",
    description:
      "Find cleaning work and cleaner jobs in Gothenburg with Clean Jobs.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I find cleaning jobs in Gothenburg?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "You can find cleaning jobs in Gothenburg through cleaning companies, job boards, local networks and specialized platforms such as Clean Jobs.",
      },
    },
    {
      "@type": "Question",
      name: "What cleaning jobs are common in Gothenburg?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Common cleaning jobs in Gothenburg include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and recurring cleaning tasks.",
      },
    },
    {
      "@type": "Question",
      name: "Can cleaning companies use Clean Jobs in Gothenburg?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Cleaning companies can use Clean Jobs to become visible, find new clients and receive cleaning job requests in Gothenburg and nearby areas.",
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

function AreaCard({ area }: { area: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      {area}
    </div>
  )
}

export default function CleaningJobsGothenburgPage() {
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
            Gothenburg
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Cleaning jobs in Gothenburg: find cleaner work or hire trusted cleaners
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Gothenburg is one of Sweden’s strongest service markets, with demand
            for home cleaning, apartment cleaning, office cleaning, move-out
            cleaning and recurring cleaning help. Clean Jobs helps cleaners,
            clients and cleaning companies connect in one focused marketplace.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs?city=Göteborg"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              Browse Gothenburg jobs
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
          <Section eyebrow="Overview" title="Why Gothenburg is good for cleaning work">
            <p>
              Gothenburg has a large mix of apartments, private homes, offices,
              shops, restaurants and local businesses. This creates ongoing demand
              for cleaners who can work carefully, arrive on time and communicate
              clearly with clients.
            </p>
            <p>
              Cleaning jobs in Gothenburg can be one-time assignments or recurring
              work. For many workers, cleaning is a practical way to start earning
              money, build trust and connect with clients without needing a large
              personal network.
            </p>
          </Section>

          <Section eyebrow="Types of work" title="Common cleaning jobs in Gothenburg">
            <p>
              Common cleaning jobs include home cleaning, office cleaning, move-out
              cleaning, apartment cleaning, deep cleaning and recurring weekly or
              monthly cleaning. Clients often look for cleaners who can explain
              availability, travel areas and previous experience.
            </p>
            <p>
              Cleaning companies can also benefit from Clean Jobs by creating a
              visible profile, receiving job requests and finding clients who
              already need cleaning help in the Gothenburg area.
            </p>
          </Section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              Areas near Gothenburg where cleaners can find work
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              If you are searching for cleaning jobs in Gothenburg, it can help
              to include nearby areas and commuter municipalities. Many clients
              live outside the city center but still need regular cleaning help.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                "Göteborg City",
                "Hisingen",
                "Mölndal",
                "Partille",
                "Lerum",
                "Kungälv",
                "Kungsbacka",
                "Majorna",
                "Linné",
                "Frölunda",
                "Angered",
                "Västra Götaland",
              ].map((area) => (
                <AreaCard key={area} area={area} />
              ))}
            </div>
          </section>

          <Section eyebrow="For workers" title="How to get more cleaning jobs in Gothenburg">
            <p>
              A strong profile improves your chances. Add your name, city, phone
              number, availability and cleaning experience. If you work for a
              company, add the company name and logo so clients can recognize your
              brand.
            </p>
            <p>
              Mention whether you can work evenings, weekends or short-notice
              jobs. Also describe whether you prefer home cleaning, office
              cleaning, move-out cleaning or recurring jobs.
            </p>
          </Section>

          <Section eyebrow="For clients" title="How to hire a cleaner in Gothenburg">
            <p>
              If you need a cleaner in Gothenburg, create a clear job post with
              the city, approximate address area, cleaning type, date, time,
              budget and description. Clear job details help cleaners understand
              the task and respond faster.
            </p>
            <p>
              Clean Jobs is designed for private clients, workers and cleaning
              companies. You can post a job, receive interest and continue the
              conversation through the job page and chat.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Start with cleaning jobs in Gothenburg
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Whether you are searching for cleaning work or need to hire a
              cleaner, Clean Jobs gives you a focused marketplace for Gothenburg
              and nearby areas.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs?city=Göteborg"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Find jobs
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
        </div>
      </main>
    </div>
  )
}
