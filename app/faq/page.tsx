import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"

import FaqAccordion from "@/components/faq/faq-accordion"
import {
  getAllFaqItems,
  getFaqCopy,
  type FaqPageCopy,
} from "@/lib/faq"
import {
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"

const siteUrl = "https://cleansjob.com"

type AudienceCardProps = {
  icon: string
  title: string
  description: string
  steps: string[]
  button: string
  href: string
}

async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies()

  return normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale
}

function AudienceCard({
  icon,
  title,
  description,
  steps,
  button,
  href,
}: AudienceCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
        <span aria-hidden="true">{icon}</span>
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <ol className="mt-6 grid gap-4">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 text-sm leading-6 text-slate-700"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-bold text-white">
              {index + 1}
            </span>

            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>

      <div className="mt-auto pt-7">
        <Link
          href={href}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
        >
          {button}
        </Link>
      </div>
    </article>
  )
}

function buildFaqJsonLd(
  locale: Locale,
  copy: FaqPageCopy,
) {
  const questions = getAllFaqItems(locale)

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/faq#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Clean Jobs",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: copy.metadata.title,
            item: `${siteUrl}/faq`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/faq#faq`,
        url: `${siteUrl}/faq`,
        name: copy.metadata.title,
        description: copy.metadata.description,
        inLanguage: locale,
        mainEntity: questions.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale()
  const copy = getFaqCopy(locale)

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical: "/faq",
    },
    openGraph: {
      type: "website",
      url: `${siteUrl}/faq`,
      siteName: "Clean Jobs",
      title: `${copy.metadata.title} | Clean Jobs`,
      description: copy.metadata.description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: copy.metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${copy.metadata.title} | Clean Jobs`,
      description: copy.metadata.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function FaqPage() {
  const locale = await getCurrentLocale()
  const copy = getFaqCopy(locale)
  const jsonLd = buildFaqJsonLd(locale, copy)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="overflow-hidden">
        <section className="relative border-b border-slate-200 bg-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.10),transparent_42%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.10),transparent_38%)]"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                {copy.hero.eyebrow}
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {copy.hero.title}
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                {copy.hero.description}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/jobs/create"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {copy.hero.postJob}
                </Link>

                <Link
                  href="/jobs"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {copy.hero.browseJobs}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fafafa] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                {copy.audience.eyebrow}
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {copy.audience.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {copy.audience.description}
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              <AudienceCard
                icon="🏠"
                title={copy.audience.client.title}
                description={
                  copy.audience.client.description
                }
                steps={copy.audience.client.steps}
                button={copy.audience.client.button}
                href="/jobs/create"
              />

              <AudienceCard
                icon="🧹"
                title={copy.audience.worker.title}
                description={
                  copy.audience.worker.description
                }
                steps={copy.audience.worker.steps}
                button={copy.audience.worker.button}
                href="/jobs"
              />

              <AudienceCard
                icon="🏢"
                title={copy.audience.company.title}
                description={
                  copy.audience.company.description
                }
                steps={copy.audience.company.steps}
                button={copy.audience.company.button}
                href="/services/create"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                {copy.faq.eyebrow}
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {copy.faq.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-600">
                {copy.faq.description}
              </p>
            </div>

            <div className="mt-10">
              <FaqAccordion
                categories={copy.faq.categories}
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                  {copy.safety.eyebrow}
                </div>

                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {copy.safety.title}
                </h2>

                <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                  {copy.safety.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {copy.safety.items.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-sm font-bold text-rose-200"
                    >
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-slate-200">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fafafa] py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-[32px] border border-rose-200 bg-gradient-to-br from-white via-white to-rose-50 p-7 shadow-sm sm:p-10">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                    {copy.contact.eyebrow}
                  </div>

                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
                    {copy.contact.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    {copy.contact.description}
                  </p>

                  <a
                    href="mailto:support@cleansjob.com"
                    className="mt-4 inline-flex text-sm font-semibold text-rose-700 hover:text-rose-800"
                  >
                    support@cleansjob.com
                  </a>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {copy.contact.button}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}