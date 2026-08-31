import { createClient } from "@/lib/supabase-server"

import type { SeoCity, SeoService } from "./types"

export type SeoMarketplaceCompany = {
  id: string
  name: string
  slug: string
  city: string | null
  description: string | null
  website: string | null
  phone: string | null
  email: string | null
  verified: boolean | null
  service_types: string[]
  hourly_rate: number | null
  rut_available: boolean
  matchesService: boolean
}

export type SeoMarketplaceSnapshot = {
  companies: SeoMarketplaceCompany[]
  totalCityCompanies: number
  serviceMatchCount: number
}

function normalizeToken(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "")
}

function getServiceTokens(service: SeoService | null) {
  if (!service) return new Set<string>()

  return new Set(
    [
      service.slug,
      service.serviceType,
      ...Object.values(service.name),
      ...Object.values(service.shortName),
    ]
      .map(normalizeToken)
      .filter(Boolean),
  )
}

function matchesService(
  serviceTypes: string[] | null | undefined,
  service: SeoService | null,
) {
  if (!service || !serviceTypes?.length) {
    return false
  }

  const expected = getServiceTokens(service)

  return serviceTypes.some((value) => {
    const normalized = normalizeToken(value)

    if (!normalized) return false
    if (expected.has(normalized)) return true

    return [...expected].some(
      (candidate) =>
        candidate.length >= 5 &&
        (normalized.includes(candidate) ||
          candidate.includes(normalized)),
    )
  })
}

export async function getSeoMarketplaceSnapshot({
  city,
  service,
  limit = 6,
}: {
  city: Pick<SeoCity, "name">
  service?: SeoService | null
  limit?: number
}): Promise<SeoMarketplaceSnapshot> {
  const supabase = await createClient()

  const { data, error, count } = await supabase
    .from("companies")
    .select(
      "id, name, slug, city, description, website, phone, email, verified, service_types, hourly_rate, rut_available, directory_quality_score",
      { count: "exact" },
    )
    .ilike("city", `%${city.name}%`)
    .order("verified", { ascending: false })
    .order("directory_quality_score", { ascending: false })
    .order("name", { ascending: true })
    .limit(24)

  if (error || !data) {
    if (error) {
      console.error("SEO marketplace company load error:", error)
    }

    return {
      companies: [],
      totalCityCompanies: 0,
      serviceMatchCount: 0,
    }
  }

  const prepared = data.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    city: company.city,
    description: company.description,
    website: company.website,
    phone: company.phone,
    email: company.email,
    verified: company.verified,
    service_types: company.service_types ?? [],
    hourly_rate: company.hourly_rate,
    rut_available: Boolean(company.rut_available),
    matchesService: matchesService(
      company.service_types,
      service ?? null,
    ),
  }))

  const matched = prepared.filter((company) => company.matchesService)
  const fallback = prepared.filter((company) => !company.matchesService)

  const companies = [...matched, ...fallback].slice(0, limit)

  return {
    companies,
    totalCityCompanies: count ?? prepared.length,
    serviceMatchCount: matched.length,
  }
}
