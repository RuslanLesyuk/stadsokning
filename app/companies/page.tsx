import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Cleaning Companies in Stockholm | Clean Jobs",
  description:
    "Browse cleaning companies in Stockholm. Compare cleaning services, websites and contact details from local cleaning companies.",
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
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
              Cleaning company directory
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
              Cleaning Companies in Stockholm
            </h1>
            <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
  <h2 className="text-2xl font-bold text-slate-950">
    Browse companies by city
  </h2>

  <p className="mt-3 text-sm leading-7 text-slate-600">
    Find cleaning companies in Stockholm and surrounding municipalities.
  </p>

  <div className="mt-6 flex flex-wrap gap-2">
    <Link
      href="/companies/city/stockholm"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Stockholm
    </Link>

    <Link
      href="/companies/city/sollentuna"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Sollentuna
    </Link>

    <Link
      href="/companies/city/taby"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Täby
    </Link>

    <Link
      href="/companies/city/jarfalla"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Järfälla
    </Link>

    <Link
      href="/companies/city/nacka"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Nacka
    </Link>

    <Link
      href="/companies/city/huddinge"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Huddinge
    </Link>

    <Link
      href="/companies/city/botkyrka"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Botkyrka
    </Link>

    <Link
      href="/companies/city/solna"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Solna
    </Link>

    <Link
      href="/companies/city/sundbyberg"
      prefetch={false}
      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-rose-50"
    >
      Sundbyberg
    </Link>
  </div>
</section>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Find cleaning companies in Stockholm for home cleaning, office
              cleaning, moving cleaning and regular cleaning services. Compare
              company profiles, contact details and websites in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Find cleaning jobs
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Add your company
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Listed companies
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {companies?.length ?? 0} cleaning companies available.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companies?.map((company) => (
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

                  {company.verified && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {company.city || "Sweden"}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {company.description ||
                    "Cleaning company listed on Clean Jobs."}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-600">
                    View company
                  </span>

                  <span className="text-slate-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Find cleaning services in Stockholm
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Stockholm has many cleaning companies offering services for
                apartments, houses, offices and moving. This directory helps
                visitors discover cleaning companies and compare their public
                contact details.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Are you a cleaning company?
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                Create a profile on Clean Jobs to make your company easier to
                find and connect with people looking for cleaning services in
                Sweden.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}