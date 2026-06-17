import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "Cleaning Services in Stockholm | Hemstädning & Flyttstädning",
  description:
    "Find cleaning services in Stockholm. Compare home cleaning, moving cleaning, office cleaning, window cleaning, prices and RUT availability.",
  alternates: {
    canonical: "https://cleansjob.com/services/stockholm",
  },
}

export default async function StockholmServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from("service_profiles")
    .select("*")
    .eq("city", "Stockholm")
    .order("verified", { ascending: false })
    .order("company_name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600">
            Stockholm cleaning services
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Cleaning Services in Stockholm
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Compare cleaning companies and private cleaners in Stockholm. Find
            home cleaning, moving cleaning, office cleaning, window cleaning and
            regular cleaning services with RUT availability.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services"
              prefetch={false}
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              All cleaning services
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
          <h2 className="text-2xl font-bold text-slate-950">
            Cleaning companies in Stockholm
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {services?.length ?? 0} service providers listed.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

                {service.hourly_rate && (
                  <p className="mt-4 text-sm font-semibold text-slate-950">
                    From {service.hourly_rate} SEK/hour
                  </p>
                )}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {service.description}
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

                <div className="mt-6 text-sm font-semibold text-rose-600">
                  View service →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h2 className="text-2xl font-bold text-slate-950">
            Find the right cleaning service in Stockholm
          </h2>

          <div className="mt-5 space-y-5 text-sm leading-7 text-slate-600 md:text-base">
            <p>
              Stockholm has a large number of cleaning companies offering
              services for apartments, houses, offices and moving. Clean Jobs
              helps users compare cleaning providers by service type, area,
              price and contact details.
            </p>

            <p>
              Common cleaning services in Stockholm include hemstädning,
              flyttstädning, kontorsstädning, fönsterputs, trappstädning and
              byggstädning. Many providers also support RUT-avdrag, which can
              reduce the cost for private customers.
            </p>

            <p>
              This page is built as a local directory for people searching for
              cleaning services in Stockholm and nearby areas such as Solna,
              Sundbyberg, Täby, Nacka, Sollentuna and Järfälla.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}