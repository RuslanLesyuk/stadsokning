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

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!company) {
    return {
      title: "Company Not Found | Clean Jobs",
    }
  }

  return {
    title: `${company.name} | ${company.city} | Clean Jobs`,
    description:
      company.description ||
      `Professional cleaning company in ${company.city}.`,
    alternates: {
      canonical: `https://cleansjob.com/companies/${company.slug}`,
    },
  }
}

export default async function CompanyPage({
  params,
}: PageProps) {
  const { slug } = await params

  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE
  )

  const dictionary = getDictionary(locale)
  const t = dictionary.companies

  const supabase = await createClient()

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!company) {
    notFound()
  }

  const { data: relatedCompanies } = await supabase
    .from("companies")
    .select("*")
    .neq("id", company.id)
    .limit(3)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.description,
    telephone: company.phone,
    url: company.website,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
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
          <div className="flex items-start gap-5">
            {company.logo_url ? (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-full w-full object-contain p-3"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-slate-200 bg-rose-50 text-3xl font-bold text-rose-600">
                {company.name?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                  {company.name}
                </h1>

                {company.verified && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {t.verifiedCompany}
                  </span>
                )}
              </div>

              <p className="mt-3 text-lg text-slate-500">
                {company.city}
              </p>
            </div>
          </div>

          {company.description && (
            <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-600">
              {company.description}
            </p>
          )}

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                {t.phone} & {t.email}
              </h2>

              <div className="mt-5 space-y-3">
                {company.phone && (
                  <div>
                    <span className="font-semibold">
                      {t.phone}:
                    </span>{" "}
                    {company.phone}
                  </div>
                )}

                {company.email && (
                  <div>
                    <span className="font-semibold">
                      {t.email}:
                    </span>{" "}
                    {company.email}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-950">
                {t.website}
              </h2>

              <div className="mt-5">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-600 hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="text-slate-500">—</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
              >
                {t.visitWebsite}
              </a>
            )}

            <Link
              href="/jobs"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              {t.findCleaningJobs}
            </Link>

            <Link
              href="/companies"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              ← Companies
            </Link>
          </div>
        </div>

        {relatedCompanies && relatedCompanies.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-950">
              {t.relatedCompanies}
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedCompanies.map((related) => (
                <Link
                  key={related.id}
                  href={`/companies/${related.slug}`}
                  prefetch={false}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-950">
                    {related.name}
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