import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Find Cleaning Services in Sweden | Clean Jobs",
  description:
    "Find cleaning services in Sweden. Compare cleaning companies, service areas, prices, RUT availability and contact details.",
  alternates: {
    canonical: "https://cleansjob.com/services",
  },
}

export default async function ServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("service_profiles")
    .select("*")
    .order("verified", { ascending: false })
    .order("company_name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Cleaning services
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Find Cleaning Services in Sweden
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Compare cleaning companies, private cleaners, service areas, prices
            and RUT availability. Find home cleaning, moving cleaning, office
            cleaning and window cleaning services.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services/stockholm"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Services in Stockholm
            </Link>

            <Link
              href="/signup"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              Add your service
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              Cleaning service providers
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {services?.length ?? 0} service profiles available.
            </p>
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

                <p className="mt-3 text-sm text-slate-500">
                  {service.city}
                </p>

                {service.hourly_rate && (
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    From {service.hourly_rate} SEK/hour
                  </p>
                )}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {service.description ||
                    "Cleaning service provider listed on Clean Jobs."}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.service_types?.slice(0, 3).map((type: string) => (
                    <span
                      key={type}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-rose-600">
                    View service
                  </span>

                  <span className="text-slate-400 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}