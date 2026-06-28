import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getLanguageAlternates } from "@/lib/seo"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  normalizeLocale,
} from "@/lib/i18n"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!service) {
    return { title: "Service Not Found | Clean Jobs" }
  }

  return {
    title: `${service.company_name} | Cleaning Services in ${service.city}`,
    description:
      service.description ||
      `Professional cleaning services in ${service.city}.`,
    alternates: {
  canonical: `https://cleansjob.com/services/${service.slug}`,
  languages: getLanguageAlternates(`/services/${service.slug}`),
},
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)
  const t = dictionary.services

  const supabase = await createClient()

  const { data: service } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!service) {
    notFound()
  }

  const { data: relatedServices } = await supabase
    .from("service_profiles")
    .select("*")
    .neq("id", service.id)
    .limit(3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: service.company_name,
    image: service.logo_url || undefined,
    description: service.description,
    telephone: service.phone,
    url: service.website,
    areaServed: service.service_areas || [],
    address: {
      "@type": "PostalAddress",
      addressLocality: service.city,
      addressCountry: "SE",
    },
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 md:p-10">
            <Link
              href="/services"
              prefetch={false}
              className="text-sm font-semibold text-rose-600"
            >
              ← {t.backToServices}
            </Link>

            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {service.logo_url ? (
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <img
                      src={service.logo_url}
                      alt={service.company_name}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                ) : (
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-slate-200 bg-rose-50 text-3xl font-bold text-rose-600 shadow-sm">
                    {service.company_name?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
                      {service.company_name}
                    </h1>

                    {service.verified ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {t.verified}
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                        {t.pending}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-lg text-slate-500">
                    {service.city}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.rut_available ? (
                      <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                        {t.rutAvailable}
                      </span>
                    ) : null}

                    {service.minimum_order ? (
                      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        {t.minimumOrderHours} {service.minimum_order}h
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {service.hourly_rate ? (
                <div className="rounded-3xl border border-rose-100 bg-white px-6 py-5 text-left shadow-sm md:text-right">
                  <p className="text-sm font-medium text-slate-500">
                    {t.priceFrom}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-rose-600">
                    {service.hourly_rate} SEK/h
                  </p>
                </div>
              ) : null}
            </div>

            <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-600">
              {service.description || t.serviceProvider}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {service.website ? (
                <a
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  {t.visitWebsite}
                </a>
              ) : null}

              {service.phone ? (
                <a
                  href={`tel:${service.phone}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  {t.call}
                </a>
              ) : null}

              {service.email ? (
                <a
                  href={`mailto:${service.email}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  {t.email}
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              {t.contactInformation}
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <div>
                <span className="font-semibold text-slate-950">
                  {t.cityLabel}:
                </span>{" "}
                {service.city}
              </div>

              {service.phone ? (
                <div>
                  <span className="font-semibold text-slate-950">
                    {t.phone}:
                  </span>{" "}
                  {service.phone}
                </div>
              ) : null}

              {service.email ? (
                <div>
                  <span className="font-semibold text-slate-950">
                    {t.email}:
                  </span>{" "}
                  {service.email}
                </div>
              ) : null}

              {service.website ? (
                <div>
                  <span className="font-semibold text-slate-950">
                    {t.websiteLabel}:
                  </span>{" "}
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:underline"
                  >
                    {service.website}
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              {t.serviceDetails}
            </h2>

            <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <div>
                <span className="font-semibold text-slate-950">
                  {t.minimumOrderHours}:
                </span>{" "}
                {service.minimum_order || "-"} {t.hours}
              </div>

              <div>
                <span className="font-semibold text-slate-950">
                  {t.rutAvailable}:
                </span>{" "}
                {service.rut_available ? t.yes : t.no}
              </div>
            </div>
          </div>
        </section>

        {service.languages?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-950">
              {t.languagesTitle}
            </h2>

            <div className="flex flex-wrap gap-2">
              {service.languages.map((language: string) => (
                <span
                  key={language}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {language}
                </span>
              ))}
            </div>
          </section>
        )}

        {service.service_types?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-950">
              {t.servicesTitle}
            </h2>

            <div className="flex flex-wrap gap-2">
              {service.service_types.map((item: string) => (
                <span
                  key={item}
                  className="rounded-full bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        {service.service_areas?.length > 0 && (
          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-950">
              {t.serviceAreasTitle}
            </h2>

            <div className="flex flex-wrap gap-2">
              {service.service_areas.map((area: string) => (
                <span
                  key={area}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {relatedServices && relatedServices.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-950">
              {t.relatedServices}
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  prefetch={false}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    {related.logo_url ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={related.logo_url}
                          alt={related.company_name}
                          className="h-full w-full object-contain p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 font-bold text-rose-600">
                        {related.company_name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-slate-950">
                        {related.company_name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {related.city}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}