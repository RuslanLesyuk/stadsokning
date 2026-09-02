import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  getSeoLandingCopy,
  getSeoLandingPage,
  seoLandingPages,
  type SeoLandingPage,
} from "@/lib/seo-landing-pages"
import { SEO_SITE_URL } from "@/lib/seo/constants"
import {
  getSeoMarketplaceSnapshot,
  type SeoMarketplaceSnapshot,
} from "@/lib/seo/marketplace"
import { createMarketplaceItemListSchema } from "@/lib/seo/marketplace-schema"
import { seoServices } from "@/lib/seo/services"

export const revalidate = 86400

type PageProps = {
  params: Promise<{
    seoSlug: string
  }>
}

function getLandingService(page: SeoLandingPage) {
  if (page.serviceType === "stadfirma") {
    return null
  }

  return seoServices.find((item) => item.slug === page.serviceType) ?? null
}

function buildLandingMetaDescription({
  page,
  marketplace,
}: {
  page: SeoLandingPage
  marketplace: SeoMarketplaceSnapshot
}) {
  if (marketplace.mode === "city") {
    if (marketplace.totalCityCompanies > 0) {
      return `Jämför ${marketplace.totalCityCompanies} publicerade städföretag i ${page.city}. Se registrerade tjänster, RUT-information och kontaktuppgifter på Clean Jobs.`
    }

    return `Hitta städföretag i ${page.city} och jämför publicerade företagsprofiler på Clean Jobs.`
  }

  if (marketplace.serviceMatchCount > 0 && marketplace.serviceLabel) {
    return `Jämför ${marketplace.serviceMatchCount} företagsprofiler i ${page.city} som listar ${marketplace.serviceLabel.toLowerCase()}. Se RUT-information och kontaktuppgifter på Clean Jobs.`
  }

  return `Hitta städföretag i ${page.city} och se vilka tjänster som finns registrerade i företagsprofiler på Clean Jobs.`
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

  const copy = getSeoLandingCopy(page, "sv")
  const service = getLandingService(page)
  const marketplace = await getSeoMarketplaceSnapshot({
    city: { name: page.city },
    service,
    limit: 9,
  })
  const description = buildLandingMetaDescription({
    page,
    marketplace,
  })

  return {
    title: {
      absolute: copy.title,
    },
    description,
    alternates: {
      canonical: `${SEO_SITE_URL}/${page.slug}`,
    },
    openGraph: {
      title: copy.title,
      description,
      url: `${SEO_SITE_URL}/${page.slug}`,
      siteName: "Clean Jobs",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { seoSlug } = await params
  const page = getSeoLandingPage(seoSlug)

  if (!page) {
    notFound()
  }

  const locale = "sv" as const
  const copy = getSeoLandingCopy(page, locale)

  const service = getLandingService(page)

  const marketplace = await getSeoMarketplaceSnapshot({
    city: { name: page.city },
    service,
    limit: 9,
  })

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

  const sameCityPages = seoLandingPages.filter(
    (item) => item.city === page.city && item.slug !== page.slug,
  )

  const sameServicePages = seoLandingPages
    .filter(
      (item) =>
        item.serviceType === page.serviceType &&
        item.city !== page.city,
    )
    .slice(0, 10)

  const providersTitle =
    page.serviceType === "stadfirma"
      ? `Städföretag i ${page.city}`
      : copy.providersTitle

  const hasServiceFilter = marketplace.mode === "service"

  const itemListSchema = createMarketplaceItemListSchema({
    pageUrl: `/${page.slug}`,
    name: providersTitle,
    companies: marketplace.companies,
  })

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {itemListSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
          }}
        />
      ) : null}

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
              href={`/companies?city=${encodeURIComponent(page.city)}`}
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
              {providersTitle}
            </h2>

            {hasServiceFilter ? (
              <p className="mt-2 text-sm text-slate-600">
                {marketplace.serviceMatchCount} av{" "}
                {marketplace.totalCityCompanies} publicerade företagsprofiler i{" "}
                {page.city} har {marketplace.serviceLabel?.toLowerCase()} registrerad
                som tjänst.
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                {marketplace.totalCityCompanies} publicerade företagsprofiler i{" "}
                {page.city}.
              </p>
            )}
          </div>

          <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-slate-950">
                {hasServiceFilter
                  ? marketplace.serviceMatchCount
                  : marketplace.totalCityCompanies}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {hasServiceFilter
                  ? "profiler med tjänsten"
                  : "företagsprofiler i staden"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-slate-950">
                {marketplace.rutCount}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                med RUT-information
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-slate-950">
                {marketplace.contactCount}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                med kontaktuppgifter
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-slate-950">
                {marketplace.descriptionCount}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                med företagsbeskrivning
              </p>
            </div>
          </div>

          {marketplace.companies.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {marketplace.companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  prefetch={false}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-950">
                      {company.name}
                    </h3>

                    {company.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Verifierad
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm text-slate-500">
                    {company.city || page.city}
                  </p>

                  {company.hourly_rate ? (
                    <p className="mt-4 text-sm font-semibold text-slate-950">
                      {copy.priceFrom} {company.hourly_rate} {copy.perHour}
                    </p>
                  ) : null}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {company.description || copy.fallback}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.matchesService ? (
                      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                        Tjänsten finns i profilen
                      </span>
                    ) : null}

                    {company.rut_available ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        RUT
                      </span>
                    ) : null}

                    {company.website || company.phone || company.email ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        Kontaktuppgifter
                      </span>
                    ) : null}
                  </div>

                  {company.service_types.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {company.service_types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="mt-6 inline-flex text-sm font-semibold text-rose-600">
                    {copy.viewCompany} →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
              <h3 className="font-semibold text-amber-950">
                Ingen matchande publicerad företagsprofil ännu
              </h3>
              <p className="mt-2 text-sm leading-6 text-amber-900">
                Clean Jobs har {marketplace.totalCityCompanies} publicerade
                företagsprofiler i {page.city}, men ingen av dem har just nu{" "}
                {marketplace.serviceLabel?.toLowerCase() || "den här tjänsten"}{" "}
                registrerad i profilen.
              </p>
              <Link
                href={`/companies?city=${encodeURIComponent(page.city)}`}
                prefetch={false}
                className="mt-4 inline-flex text-sm font-semibold text-amber-950 underline"
              >
                Se alla företag i {page.city} →
              </Link>
            </div>
          )}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-black text-slate-950">
              Så bygger Clean Jobs jämförelsen
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Siffrorna på sidan bygger på uppgifter i publicerade
              företagsprofiler på Clean Jobs.
            </p>

            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              {hasServiceFilter ? (
                <li>
                  • En tjänst räknas bara när den finns registrerad i
                  företagets profil.
                </li>
              ) : null}
              <li>
                • RUT visas bara när profilen innehåller uppgift om RUT.
              </li>
              <li>
                • Pris visas bara när företaget själv har ett pris registrerat.
                Clean Jobs fyller inte i saknade priser.
              </li>
              {marketplace.verifiedCount > 0 ? (
                <li>
                  • {marketplace.verifiedCount} av profilerna i jämförelsen är
                  markerade som verifierade.
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            {copy.popularTitle}
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {sameCityPages.map((item) => {
              const relatedCopy = getSeoLandingCopy(item, locale)

              return (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  prefetch={false}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                >
                  {relatedCopy.h1}
                </Link>
              )
            })}
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
            {sameServicePages.map((item) => {
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