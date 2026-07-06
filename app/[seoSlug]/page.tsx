import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"
import {
  getSeoLandingCopy,
  getSeoLandingPage,
  seoLandingPages,
} from "@/lib/seo-landing-pages"
import { getLanguageAlternates } from "@/lib/seo"
import { SEO_SITE_URL } from "@/lib/seo/constants"

type PageProps = {
  params: Promise<{
    seoSlug: string
  }>
}

function cityToSlug(city: string) {
  return city
    .toLowerCase()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function getRelatedServiceTypes(serviceType: string) {
  switch (serviceType) {
    case "stadfirma":
      return [
        "Hemstädning",
        "Flyttstädning",
        "Kontorsstädning",
        "Fönsterputs",
        "Storstädning",
        "Trappstädning",
        "Byggstädning",
      ]
    case "hemstadning":
      return ["Hemstädning", "Storstädning", "Fönsterputs", "Flyttstädning"]
    case "flyttstadning":
      return ["Flyttstädning", "Storstädning", "Fönsterputs", "Hemstädning"]
    case "kontorsstadning":
      return ["Kontorsstädning", "Trappstädning", "Byggstädning", "Fönsterputs"]
    case "fonsterputs":
      return ["Fönsterputs", "Hemstädning", "Flyttstädning", "Kontorsstädning"]
    default:
      return ["Hemstädning", "Flyttstädning", "Kontorsstädning", "Fönsterputs"]
  }
}

export async function generateStaticParams() {
  return seoLandingPages.map((page) => ({
    seoSlug: page.slug,
  }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { seoSlug } = await params
  const page = getSeoLandingPage(seoSlug)

  if (!page) {
    return {}
  }

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const copy = getSeoLandingCopy(page, locale)
  const dictionary = getDictionary(locale)
  const common = dictionary.common

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: `${SEO_SITE_URL}/${page.slug}`,
      languages: getLanguageAlternates(`/${page.slug}`),
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SEO_SITE_URL}/${page.slug}`,
      siteName: "Clean Jobs",
      type: "website",
    },
  }
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { seoSlug } = await params
  const page = getSeoLandingPage(seoSlug)

  if (!page) {
    notFound()
  }

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const copy = getSeoLandingCopy(page, locale)

  const supabase = await createClient()
  const citySlug = cityToSlug(page.city)

  const { data: services } = await supabase
    .from("service_profiles")
    .select("*")
    .ilike("city", `%${page.city}%`)
    .order("verified", { ascending: false })
    .order("company_name")
    .limit(9)

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Clean Jobs",
        item: SEO_SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: copy.h1,
        item: `${SEO_SITE_URL}/${page.slug}`,
      },
    ],
  }

  const relatedServiceTypes = getRelatedServiceTypes(page.serviceType)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Clean Jobs
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {copy.h1}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {copy.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/services/city/${citySlug}`}
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {copy.primaryButton}
            </Link>

            <Link
              href="/services"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {copy.secondaryButton}
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              {copy.providersTitle}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                prefetch={false}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-slate-950">
                    {service.company_name}
                  </h3>

                  {service.verified && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-500">{service.city}</p>

                {service.hourly_rate && (
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    {copy.priceFrom} {service.hourly_rate} {copy.perHour}
                  </p>
                )}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {service.description || copy.fallback}
                </p>

                <span className="mt-6 inline-flex text-sm font-semibold text-rose-600">
                  {copy.viewCompany} →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            {copy.popularTitle}
          </h2>

          <div className="mt-6 flex flex-wrap gap-2">
            {relatedServiceTypes.map((type) => (
              <span
                key={type}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {type}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">{copy.faqTitle}</h2>

          <div className="mt-6 space-y-6">
            {copy.faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.question}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            {copy.morePages}
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {seoLandingPages
              .filter((item) => item.slug !== page.slug)
              .map((item) => {
                const relatedCopy = getSeoLandingCopy(item, locale)

                return (
                  <Link
                    key={item.slug}
                    href={`/${item.slug}`}
                    prefetch={false}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:border-rose-300 hover:bg-rose-50"
                  >
                    {relatedCopy.h1}
                  </Link>
                )
              })}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-gradient-to-r from-rose-50 to-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-950">Clean Jobs</h2>

            <p className="mt-4 leading-8 text-slate-600">{copy.intro}</p>
          </div>
        </section>
      </main>
    </div>
  )
}