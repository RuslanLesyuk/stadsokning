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
    title: `${company.name} | Cleaning Company in ${company.city} | Clean Jobs`,
    description:
      company.description ||
      `Find information about ${company.name} cleaning services in ${company.city}.`,
    alternates: {
      canonical: `https://cleansjob.com/companies/${company.slug}`,
    },
  }
}

export default async function CompanyPage({
  params,
}: PageProps) {
  const { slug } = await params

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
    url: company.website || "",
    telephone: company.phone || "",
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

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold text-slate-900">
              {company.name}
            </h1>

            {company.verified && (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                Verified Company
              </span>
            )}
          </div>

          <p className="mt-4 text-slate-500">
            {company.city}
          </p>

          <div className="mt-8 space-y-4">
            {company.description && (
              <p className="text-lg leading-8 text-slate-700">
                {company.description}
              </p>
            )}

            {company.phone && (
              <div>
                <span className="font-semibold text-slate-900">
                  Phone:
                </span>{" "}
                {company.phone}
              </div>
            )}

            {company.email && (
              <div>
                <span className="font-semibold text-slate-900">
                  Email:
                </span>{" "}
                {company.email}
              </div>
            )}

            {company.website && (
              <div>
                <span className="font-semibold text-slate-900">
                  Website:
                </span>{" "}
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:underline"
                >
                  {company.website}
                </a>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Visit Website
              </a>
            )}

            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Find Cleaning Jobs
            </Link>
          </div>
        </div>

        {relatedCompanies && relatedCompanies.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Related Companies
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedCompanies.map((related) => (
                <Link
                  key={related.id}
                  href={`/companies/${related.slug}`}
                  prefetch={false}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <h3 className="font-bold text-slate-900">
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