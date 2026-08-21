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

  if (!cityName) return {}

  return {
    title: {
      absolute: `Städtjänster i ${cityName} | Clean Jobs`,
    },
    description: `Hitta städtjänster i ${cityName}. Jämför lokala utförare, priser, serviceområden och kontaktuppgifter på Clean Jobs.`,
    alternates: {
      canonical: `https://cleansjob.com/services/city/${city}`,
    },
  }
}

export default async function CityServicesPage({ params }: Props) {
  const { city } = await params
  const cityName = cityNames[city]

  if (!cityName) {
    notFound()
  }

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)
  const t = dictionary.services

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
          <Link
            href="/services"
            prefetch={false}
            className="text-sm font-semibold text-rose-600"
          >
            ← {t.backToServices}
          </Link>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            {t.pageTitle} — {cityName}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {t.pageSubtitle}
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              {t.providers}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {services?.length ?? 0} {t.availableProfiles}
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
                <div className="flex items-start gap-4">
                  {service.logo_url ? (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <img
                        src={service.logo_url}
                        alt={service.company_name}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-rose-50 text-xl font-bold text-rose-600 shadow-sm">
                      {service.company_name?.charAt(0)?.toUpperCase() || "C"}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="truncate text-xl font-bold text-slate-950">
                        {service.company_name}
                      </h3>

                      {service.verified ? (
                        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {t.verified}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 text-sm text-slate-500">
                      {service.city}
                    </p>
                  </div>
                </div>

                {service.hourly_rate ? (
                  <p className="mt-5 text-sm font-semibold text-slate-950">
                    {t.fromPrice} {service.hourly_rate} {t.perHour}
                  </p>
                ) : null}

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                  {service.description || t.serviceProvider}
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
                    {t.viewService}
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
