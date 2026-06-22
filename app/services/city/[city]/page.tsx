import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

type Props = {
  params: Promise<{
    city: string
  }>
}

const cityNames: Record<string, string> = {
  stockholm: "Stockholm",
  sollentuna: "Sollentuna",
  taby: "Täby",
  jarfalla: "Järfälla",
  nacka: "Nacka",
  huddinge: "Huddinge",
  botkyrka: "Botkyrka",
  solna: "Solna",
  sundbyberg: "Sundbyberg",
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { city } = await params

  const cityName = cityNames[city]

  if (!cityName) {
    return {}
  }

  return {
    title: `Cleaning Services in ${cityName} | Clean Jobs`,
    description: `Find cleaning companies and private cleaners in ${cityName}. Compare prices, service areas and contact details.`,
    alternates: {
      canonical: `https://cleansjob.com/services/city/${city}`,
    },
  }
}

export default async function CityServicesPage({
  params,
}: Props) {
  const { city } = await params

  const cityName = cityNames[city]

  if (!cityName) {
    notFound()
  }

  const supabase = await createClient()

  const { data: services } = await supabase
    .from("service_profiles")
    .select("*")
    .ilike("city", `%${cityName}%`)
    .order("verified", { ascending: false })
    .order("company_name")

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              prefetch={false}
              className="text-sm font-medium text-rose-600"
            >
              ← All services
            </Link>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            Cleaning Services in {cityName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Compare cleaning companies and private cleaners in {cityName}.
            Find home cleaning, office cleaning, moving cleaning,
            window cleaning and more.
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              Available providers
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {services?.length ?? 0} service profiles found.
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