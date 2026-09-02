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
  mode: "city" | "service"
  serviceLabel: string | null
}

const CATALOG_SERVICE_LABELS: Record<string, string> = {
  hemstadning: "Hemstädning",
  flyttstadning: "Flyttstädning",
  kontorsstadning: "Kontorsstädning",
  fonsterputs: "Fönsterputs",
  trappstadning: "Trappstädning",
  byggstadning: "Byggstädning",
  storstadning: "Storstädning",
  "dodsbo-stadning": "Dödsbostädning",
}

const COMPANY_FIELDS =
  "id, name, slug, city, description, website, phone, email, verified, service_types, hourly_rate, rut_available, directory_quality_score"

function getCatalogServiceLabel(service: SeoService | null) {
  if (!service) return null

  return (
    CATALOG_SERVICE_LABELS[service.slug] ||
    service.name.sv ||
    service.name.en ||
    null
  )
}

function prepareCompany(
  company: {
    id: string
    name: string
    slug: string
    city: string | null
    description: string | null
    website: string | null
    phone: string | null
    email: string | null
    verified: boolean | null
    service_types: string[] | null
    hourly_rate: number | null
    rut_available: boolean | null
  },
  matchesService: boolean,
): SeoMarketplaceCompany {
  return {
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
    matchesService,
  }
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
  const serviceLabel = getCatalogServiceLabel(service ?? null)

  if (!serviceLabel) {
    const { data, error, count } = await supabase
      .from("companies")
      .select(COMPANY_FIELDS, { count: "exact" })
      .ilike("city", `%${city.name}%`)
      .order("verified", { ascending: false })
      .order("directory_quality_score", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit)

    if (error || !data) {
      if (error) {
        console.error("SEO marketplace city company load error:", error)
      }

      return {
        companies: [],
        totalCityCompanies: 0,
        serviceMatchCount: 0,
        mode: "city",
        serviceLabel: null,
      }
    }

    return {
      companies: data.map((company) =>
        prepareCompany(company, false),
      ),
      totalCityCompanies: count ?? data.length,
      serviceMatchCount: 0,
      mode: "city",
      serviceLabel: null,
    }
  }

  const [cityCountResult, serviceResult] = await Promise.all([
    supabase
      .from("companies")
      .select("id", { count: "exact", head: true })
      .ilike("city", `%${city.name}%`),

    supabase
      .from("companies")
      .select(COMPANY_FIELDS, { count: "exact" })
      .ilike("city", `%${city.name}%`)
      .contains("service_types", [serviceLabel])
      .order("verified", { ascending: false })
      .order("directory_quality_score", { ascending: false })
      .order("name", { ascending: true })
      .limit(limit),
  ])

  if (cityCountResult.error) {
    console.error(
      "SEO marketplace city count error:",
      cityCountResult.error,
    )
  }

  if (serviceResult.error || !serviceResult.data) {
    if (serviceResult.error) {
      console.error(
        "SEO marketplace service company load error:",
        serviceResult.error,
      )
    }

    return {
      companies: [],
      totalCityCompanies: cityCountResult.count ?? 0,
      serviceMatchCount: 0,
      mode: "service",
      serviceLabel,
    }
  }

  return {
    companies: serviceResult.data.map((company) =>
      prepareCompany(company, true),
    ),
    totalCityCompanies: cityCountResult.count ?? 0,
    serviceMatchCount:
      serviceResult.count ?? serviceResult.data.length,
    mode: "service",
    serviceLabel,
  }
}
