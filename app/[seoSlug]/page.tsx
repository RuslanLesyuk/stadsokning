import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { seoLandingPages } from "@/lib/seo-landing-pages"

type PageProps = {
  params: Promise<{
    seoSlug: string
  }>
}

function getPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug)
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
  const page = getPage(seoSlug)

  if (!page) {
    return {}
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://cleansjob.com/${page.slug}`,
    },
  }
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { seoSlug } = await params
  const page = getPage(seoSlug)

  if (!page) {
    notFound()
  }

  const supabase = await createClient()

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
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Clean Jobs
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {page.h1}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {page.intro}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/services/city/${page.city.toLowerCase()}`}
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Hitta städfirma
            </Link>

            <Link
              href="/services"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Alla städtjänster
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-950">
            Städfirmor i {page.city}
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((service) => (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                prefetch={false}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {service.company_name}
                </h3>

                <p className="mt-2 text-sm text-slate-500">{service.city}</p>

                {service.hourly_rate ? (
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    Från {service.hourly_rate} SEK/timme
                  </p>
                ) : null}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {service.description || "Städfirma listad på Clean Jobs."}
                </p>

                <span className="mt-6 inline-flex text-sm font-semibold text-rose-600">
                  Visa företag →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Populära städtjänster
          </h2>

          <div className="mt-6 flex flex-wrap gap-2">
            {page.relatedServiceTypes.map((type) => (
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
          <h2 className="text-2xl font-bold text-slate-950">
            Vanliga frågor
          </h2>

          <div className="mt-6 space-y-5">
            {page.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-slate-950">
                  {item.question}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-bold text-slate-950">
            Fler sidor
          </h2>

          <div className="mt-6 flex flex-wrap gap-2">
            {seoLandingPages
              .filter((item) => item.slug !== page.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  prefetch={false}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-rose-50"
                >
                  {item.h1}
                </Link>
              ))}
          </div>
        </section>
      </main>
    </div>
  )
}