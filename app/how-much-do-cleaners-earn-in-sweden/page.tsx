import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "How Much Do Cleaners Earn in Sweden 2026?",
  description:
    "Cleaner salary in Sweden guide. Learn how much cleaners earn, monthly salary, hourly pay, factors that affect income and how to find cleaning jobs.",
  alternates: {
    canonical: "/how-much-do-cleaners-earn-in-sweden",
  },
  keywords: [
    "how much do cleaners earn in Sweden",
    "cleaner salary Sweden",
    "cleaning salary Sweden",
    "house cleaner salary Sweden",
    "office cleaner salary Sweden",
    "cleaning jobs salary Sweden",
    "cleaner hourly pay Sweden",
    "städare lön Sweden",
    "cleaning jobs Sweden",
    "work as cleaner Sweden",
  ],
  openGraph: {
    title: "How Much Do Cleaners Earn in Sweden? | Clean Jobs",
    description:
      "Guide to cleaner salaries in Sweden, salary levels, city differences and how to find cleaning jobs.",
    url: `${siteUrl}/how-much-do-cleaners-earn-in-sweden`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cleaner salary in Sweden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Do Cleaners Earn in Sweden?",
    description:
      "Cleaner salary guide for Sweden with practical tips for finding cleaning work.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much do cleaners earn in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Official salary statistics show that cleaners in Sweden are commonly around the high 20,000 SEK range per month before tax, depending on experience, region, employer and working hours.",
      },
    },
    {
      "@type": "Question",
      name: "Do cleaners earn more in Stockholm, Gothenburg or Malmö?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Cleaner pay can vary by city and employer. Larger cities such as Stockholm, Gothenburg and Malmö may offer more opportunities, but cost of living and competition can also be higher.",
      },
    },
    {
      "@type": "Question",
      name: "How can I increase my income as a cleaner in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Cleaners can increase income by building trust, taking recurring clients, learning Swedish, improving quality, working with companies and creating a clear profile on platforms such as Clean Jobs.",
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

export default function CleanerSalarySwedenPage() {
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
            Cleaner salary Sweden
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            How much do cleaners earn in Sweden?
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Cleaner salaries in Sweden depend on experience, employer, city,
            working hours and type of cleaning work. Home cleaning, office
            cleaning, move-out cleaning and recurring cleaning can all have
            different pay levels. This guide explains typical salary levels and
            how cleaners can increase their income.
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
              href="/jobs-for-foreigners-in-sweden"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Jobs for foreigners
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title="Typical monthly salary"
              value="≈ 27,600–28,700 SEK"
              text="Recent public salary sources place cleaners around the high 20,000 SEK range per month before tax."
            />

            <StatCard
              title="Lower quartile / median / upper quartile"
              value="26,800 / 28,600 / 30,400"
              text="SCB regional salary statistics show this range for cleaners in the latest available table."
            />

            <StatCard
              title="Salary depends on"
              value="City + employer"
              text="Experience, working hours, responsibility, company type and region can change the final income."
            />
          </section>

          <Section eyebrow="Salary overview" title="Cleaner salary in Sweden">
            <p>
              Official Swedish salary statistics show that cleaners are commonly
              paid around the high 20,000 SEK range per month before tax. SCB’s
              latest table for cleaners shows lower quartile, median and upper
              quartile salary levels around 26,800 SEK, 28,600 SEK and 30,400 SEK
              respectively. Other salary sites summarize the average cleaner salary
              at around 27,600 SEK per month based on recent full-time data.
            </p>

            <p>
              These numbers are useful as a guide, but they are not a guarantee.
              Your actual salary can be higher or lower depending on whether you
              work full-time or part-time, whether you are employed by a company,
              work with private clients, have recurring customers or take
              specialized cleaning assignments.
            </p>
          </Section>

          <Section eyebrow="Income factors" title="What affects cleaner pay?">
            <p>
              The biggest factors are experience, quality, reliability, city,
              employer and type of cleaning. A cleaner who can handle office
              cleaning, home cleaning, move-out cleaning and recurring clients can
              often access more opportunities than someone who only takes one type
              of job.
            </p>

            <p>
              Communication also matters. Clients in Sweden often care about trust,
              punctuality and clear expectations. A cleaner with a strong profile,
              good response time and clear availability may receive more requests.
            </p>
          </Section>

          <Section eyebrow="Cities" title="Cleaner salaries in Stockholm, Gothenburg and Malmö">
            <p>
              Stockholm, Gothenburg and Malmö often have more cleaning jobs because
              they have more apartments, offices, moving households and local
              businesses. Bigger cities can provide more opportunities, but they can
              also mean more competition and higher travel costs.
            </p>

            <p>
              Cleaners who can travel across several areas often increase their
              chances of finding work. For example, near Stockholm you can also
              look at Solna, Sundbyberg, Järfälla, Nacka, Huddinge and nearby
              municipalities. Near Gothenburg and Malmö, surrounding commuter areas
              can also be valuable.
            </p>
          </Section>

          <Section eyebrow="Types of work" title="Which cleaning jobs can pay better?">
            <p>
              Recurring cleaning can provide stable income because the client needs
              help every week or every month. Move-out cleaning can sometimes have
              a higher budget because the work is larger and time-sensitive. Office
              cleaning can also be valuable if it becomes a long-term contract.
            </p>

            <p>
              For individual workers, the goal is often to build a reliable flow of
              jobs. For cleaning companies, the goal is to receive more requests
              and keep good clients over time.
            </p>
          </Section>

          <Section eyebrow="Tips" title="How to increase your income as a cleaner">
            <p>
              Create a clear profile, add your city, describe your experience and
              show what type of cleaning work you can do. Mention whether you are
              available for home cleaning, office cleaning, move-out cleaning,
              evening work, weekend work or recurring cleaning.
            </p>

            <p>
              If you are still learning Swedish, keep improving it. Even basic
              Swedish can help build trust and make communication easier. Good
              reviews, punctuality and fast replies can also help you get more
              clients.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Find cleaning jobs in Sweden
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              Clean Jobs helps cleaners, clients and cleaning companies connect
              across Sweden. Start by browsing jobs or creating a profile.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Browse jobs
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
