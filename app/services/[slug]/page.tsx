import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

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
    return {
      title: "Service Not Found | Clean Jobs",
    }
  }

  return {
    title: `${service.company_name} | Cleaning Services in ${service.city}`,
    description:
      service.description ||
      `Professional cleaning services in ${service.city}.`,
    alternates: {
      canonical: `https://cleansjob.com/services/${service.slug}`,
    },
  }
}

export default async function ServicePage({
  params,
}: PageProps) {
  const { slug } = await params

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              {service.company_name}
            </h1>

            {service.verified && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                Verified
              </span>
            )}
          </div>

          <p className="mt-4 text-lg text-slate-500">
            {service.city}
          </p>

          {service.hourly_rate && (
            <div className="mt-6 inline-flex rounded-2xl bg-rose-50 px-5 py-3 text-lg font-semibold text-rose-700">
              From {service.hourly_rate} SEK/hour
            </div>
          )}

          <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-600">
            {service.description}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Contact Information
              </h2>

              <div className="mt-5 space-y-3">
                {service.phone && (
                  <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {service.phone}
                  </div>
                )}

                {service.email && (
                  <div>
                    <span className="font-semibold">Email:</span>{" "}
                    {service.email}
                  </div>
                )}

                {service.website && (
                  <div>
                    <span className="font-semibold">Website:</span>{" "}
                    <a
                      href={service.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-600 hover:underline"
                    >
                      Visit website
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                Service Details
              </h2>

              <div className="mt-5 space-y-3">
                <div>
                  <span className="font-semibold">
                    Minimum Order:
                  </span>{" "}
                  {service.minimum_order || "-"} hours
                </div>

                <div>
                  <span className="font-semibold">
                    RUT Available:
                  </span>{" "}
                  {service.rut_available ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>

          {service.languages?.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-slate-950">
                Languages
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
            </div>
          )}

          {service.service_types?.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-slate-950">
                Services
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
            </div>
          )}

          {service.service_areas?.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-slate-950">
                Service Areas
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
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              prefetch={false}
              className="rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
            >
              Find Cleaning Jobs
            </Link>

            <Link
              href="/services"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              All Services
            </Link>
          </div>
        </div>

        {relatedServices && relatedServices.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-950">
              Related Services
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/services/${related.slug}`}
                  prefetch={false}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-950">
                    {related.company_name}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {related.city}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}