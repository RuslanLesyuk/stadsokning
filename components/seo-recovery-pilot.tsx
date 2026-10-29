import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

import {
  getSeoRecoveryGuide,
} from "@/lib/seo/recovery-pilot"
import type { SeoCity, SeoService } from "@/lib/seo/types"

type PublicCompany = {
  name: string
  slug: string
  city: string | null
  service_types: string[] | null
  verified: boolean | null
}

async function getPublicCityCompanies(cityName: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anonKey) return [] as PublicCompany[]

  try {
    // Anonymous public access only: no service-role key, no session cookies.
    // RLS must limit this query to companies that may appear publicly.
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data, error } = await supabase
      .from("companies")
      .select("name,slug,city,service_types,verified")
      .ilike("city", cityName)
      .order("verified", { ascending: false })
      .order("name", { ascending: true })
      .limit(40)

    if (error) {
      console.error("SEO pilot public directory lookup failed", error.message)
      return [] as PublicCompany[]
    }

    // Avoid rendering unsafe or incomplete internal company URLs.
    return ((data ?? []) as PublicCompany[]).filter(
      (company) =>
        Boolean(company.name?.trim()) &&
        /^[a-z0-9][a-z0-9-]*$/.test(company.slug ?? ""),
    )
  } catch (error) {
    console.error("SEO pilot public directory lookup unavailable", error)
    return [] as PublicCompany[]
  }
}

export async function SeoRecoveryPilot({
  city,
  service,
}: {
  city: SeoCity
  service: SeoService
}) {
  const guide = getSeoRecoveryGuide(service.slug)
  if (!guide) return null

  const allCompanies = await getPublicCityCompanies(city.name)
  const serviceName = service.name.sv ?? service.name.en
  const listedForService = allCompanies.filter((company) =>
    (company.service_types ?? []).some(
      (listed) => listed.toLocaleLowerCase("sv-SE") === serviceName.toLocaleLowerCase("sv-SE"),
    ),
  )

  const exactMatches = listedForService.length > 0
  const visibleCompanies = (exactMatches ? listedForService : allCompanies).slice(0, 4)
  const cityDirectoryUrl = `/companies?city=${encodeURIComponent(city.name)}`

  return (
    <section
      data-seo-recovery-pilot="true"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8"
      aria-label={`Praktisk guide för ${serviceName} i ${city.name}`}
    >
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-800">
          Praktisk köpguide
        </p>
        <h2 className="mt-3 text-3xl font-bold text-gray-950">
          Att tänka på vid {serviceName.toLocaleLowerCase("sv-SE")} i {city.name}
        </h2>
        <p className="mt-4 max-w-3xl text-gray-700">{guide.lead}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <h3 className="text-xl font-semibold text-gray-950">{guide.scopeTitle}</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              {guide.scope.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <h3 className="text-xl font-semibold text-gray-950">{guide.quoteTitle}</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              {guide.quote.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-gray-700">{guide.qualityNote}</p>
      </div>

      <div className="mt-10 rounded-3xl border border-gray-200 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-950">
          {exactMatches
            ? `Företag som listar ${serviceName.toLocaleLowerCase("sv-SE")} i ${city.name}`
            : `Städföretag i ${city.name}`}
        </h2>
        <p className="mt-3 text-gray-600">
          {exactMatches
            ? "Tjänsten finns angiven i företagens egna profiler. Kontrollera aktuellt utbud, område och villkor direkt med företaget."
            : "Företagen nedan är listade i samma stad, men deras erfarenhet av just denna tjänst är inte bekräftad. Fråga alltid om tjänsten innan du bokar."}
        </p>
        {visibleCompanies.length > 0 ? (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {visibleCompanies.map((company) => (
              <li key={company.slug} className="rounded-xl border border-gray-200 p-4">
                <Link
                  href={`/companies/${company.slug}`}
                  className="font-semibold text-emerald-800 hover:underline"
                >
                  {company.name}
                </Link>
                {company.verified ? (
                  <span className="ml-2 text-xs text-gray-500">Verifierad profil</span>
                ) : null}
                <p className="mt-2 text-sm text-gray-500">
                  {company.city ?? city.name}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-gray-600">
            Inga publika företagsprofiler hittades för staden i den här sökningen.
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={cityDirectoryUrl} className="rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
            Se företagskatalogen
          </Link>
          <Link href="/jobs/create" className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50">
            Lägg upp ett städjobb
          </Link>
        </div>
      </div>
    </section>
  )
}
