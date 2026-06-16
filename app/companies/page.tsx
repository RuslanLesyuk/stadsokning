import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Cleaning Companies in Stockholm | Clean Jobs",
  description:
    "Find cleaning companies in Stockholm. Compare cleaning services, contact companies and hire trusted cleaners.",
  alternates: {
    canonical: "https://cleansjob.com/companies",
  },
}

export default async function CompaniesPage() {
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("verified", { ascending: false })
    .order("name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Cleaning Companies in Stockholm
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Browse cleaning companies in Stockholm. Compare services,
            websites and contact details.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies?.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.slug}`}
              prefetch={false}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-slate-900">
                  {company.name}
                </h2>

                {company.verified && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Verified
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {company.city}
              </p>

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                {company.description}
              </p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-rose-600">
                  View company
                </span>

                <span className="text-slate-400 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}