import type { Metadata } from "next"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"

export const metadata: Metadata = {
  title: "Jobs for Foreigners in Sweden 2026 | Work Without Perfect Swedish",
  description:
    "Guide to finding jobs for foreigners in Sweden. Learn about cleaning jobs, service work, jobs without fluent Swedish and how newcomers can find work faster.",
  alternates: {
    canonical: "/jobs-for-foreigners-in-sweden",
  },
  keywords: [
    "jobs for foreigners in Sweden",
    "work in Sweden for foreigners",
    "jobs in Sweden without Swedish",
    "English speaking jobs Sweden",
    "jobs for immigrants in Sweden",
    "cleaning jobs for foreigners Sweden",
    "jobs for Ukrainians in Sweden",
    "newcomer jobs Sweden",
    "part time jobs Sweden foreigners",
    "work in Stockholm for foreigners",
  ],
  openGraph: {
    title: "Jobs for Foreigners in Sweden | Clean Jobs",
    description:
      "A practical guide for foreigners, newcomers and immigrants looking for work in Sweden.",
    url: `${siteUrl}/jobs-for-foreigners-in-sweden`,
    siteName: "Clean Jobs",
    type: "article",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jobs for foreigners in Sweden",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs for Foreigners in Sweden | Clean Jobs",
    description:
      "Find work in Sweden without perfect Swedish. Learn about cleaning jobs, service jobs and practical steps.",
    images: ["/og-image.png"],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can foreigners find jobs in Sweden without fluent Swedish?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Yes. Some jobs in Sweden require Swedish, but cleaning work, service jobs, warehouse work, restaurant work and some international roles may be possible with English or basic Swedish.",
      },
    },
    {
      "@type": "Question",
      name: "What jobs are easier for foreigners to get in Sweden?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Cleaning jobs, warehouse jobs, restaurant jobs, hotel work, delivery work and construction support can be practical entry points for foreigners in Sweden.",
      },
    },
    {
      "@type": "Question",
      name: "How can Clean Jobs help foreigners find work?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Clean Jobs helps workers find cleaning jobs and helps clients or cleaning companies connect with people who are ready to work in Sweden.",
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

function JobTypeCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default function JobsForForeignersInSwedenPage() {
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
            Jobs for foreigners
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            Jobs for foreigners in Sweden: practical work options for newcomers
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            Finding work in Sweden as a foreigner can be challenging, especially
            if you are still learning Swedish. But there are practical job options
            where reliability, communication and willingness to work can matter
            more than perfect language skills. Cleaning jobs, service work,
            warehouses, restaurants and local support roles can be good entry
            points.
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
              href="/signup"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              Create profile
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow="Start here" title="How foreigners can find work in Sweden">
            <p>
              The first step is to understand which jobs match your current
              language level, experience and schedule. Many employers prefer
              Swedish, but not every job requires fluent Swedish from day one.
              Some roles can work with English, basic Swedish or clear practical
              instructions.
            </p>

            <p>
              To improve your chances, prepare a simple CV, keep your contact
              details updated, apply often and answer quickly when someone contacts
              you. A professional profile with your city, availability and work
              experience can help clients and companies trust you faster.
            </p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <JobTypeCard
              title="Cleaning jobs"
              text="Home cleaning, office cleaning and move-out cleaning can be practical entry jobs for foreigners in Sweden."
            />
            <JobTypeCard
              title="Service jobs"
              text="Hotels, restaurants and local service businesses often need reliable workers."
            />
            <JobTypeCard
              title="Warehouse jobs"
              text="Logistics and warehouse roles can be suitable if you can follow instructions and work consistently."
            />
            <JobTypeCard
              title="Construction support"
              text="Some construction and renovation companies need helpers, cleaners and support workers."
            />
          </section>

          <Section eyebrow="Cleaning work" title="Why cleaning jobs can be a good first step">
            <p>
              Cleaning jobs in Sweden can be easier to understand than many office
              jobs because the task is practical and clear. Clients often need help
              with home cleaning, apartment cleaning, office cleaning, move-out
              cleaning and recurring cleaning. If you are reliable, punctual and
              careful, cleaning work can help you build local experience.
            </p>

            <p>
              Clean Jobs focuses on cleaning work because it connects a real need
              with people who are ready to work. Workers can browse jobs, clients
              can post requests, and cleaning companies can present themselves to
              new customers.
            </p>
          </Section>

          <Section eyebrow="Language" title="Do you need Swedish to get a job?">
            <p>
              Some jobs in Sweden require Swedish, especially roles with customer
              service, documentation or safety rules. But many foreigners start
              with roles where simple communication is enough. Learning Swedish is
              still very useful, but you do not always need to wait until you are
              fluent before looking for work.
            </p>

            <p>
              For cleaning jobs, it can be enough to understand the task, time,
              place and expectations. A short profile in English or simple Swedish
              is better than no profile at all. Be honest about your language level
              and focus on reliability.
            </p>
          </Section>

          <Section eyebrow="Cities" title="Best cities for foreign workers in Sweden">
            <p>
              The biggest job markets are usually Stockholm, Gothenburg and Malmö,
              followed by cities such as Uppsala, Västerås, Örebro, Linköping,
              Helsingborg, Lund and Jönköping. Larger cities often have more
              cleaning jobs, service jobs and short-term work opportunities.
            </p>

            <p>
              If you live near a large city, search both in the city and in nearby
              municipalities. Many clients are outside the city center but still
              need cleaners or service workers.
            </p>
          </Section>

          <Section eyebrow="Profile" title="How to make clients trust your profile">
            <p>
              Use your real name, add your city, write your availability and explain
              what work you can do. If you have cleaning experience, mention home
              cleaning, office cleaning, move-out cleaning or recurring cleaning.
              If you have a company, add the company name and logo.
            </p>

            <p>
              Trust is very important in Sweden, especially when clients invite
              someone into their home. A clear profile, fast replies and polite
              communication can make a big difference.
            </p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Start with cleaning jobs in Sweden
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              If you are a foreigner looking for work in Sweden, Clean Jobs can
              help you find cleaning jobs and connect with clients or cleaning
              companies that need reliable workers.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                Find jobs
              </Link>

              <Link
                href="/work-in-sweden"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                Read work guide
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
