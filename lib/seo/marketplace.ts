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
  rutCount: number
  contactCount: number
  verifiedCount: number
  descriptionCount: number
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

function hasContact(company: {
  website: string | null
  phone: string | null
  email: string | null
}) {
  return Boolean(company.website || company.phone || company.email)
}

function getEvidenceStats(
  companies: Array<{
    description: string | null
    website: string | null
    phone: string | null
    email: string | null
    verified: boolean | null
    rut_available: boolean | null
  }>,
) {
  return {
    rutCount: companies.filter((company) => company.rut_available === true)
      .length,
    contactCount: companies.filter(hasContact).length,
    verifiedCount: companies.filter((company) => company.verified === true)
      .length,
    descriptionCount: companies.filter(
      (company) => Boolean(company.description?.trim()),
    ).length,
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

  /**
   * Phase 3 quality strategy:
   *
   * Load the complete city result set once, then derive service-specific
   * evidence from the same published profiles. The current catalogue is
   * intentionally small, so this gives truthful totals without extra count
   * queries and keeps displayed cards + evidence numbers in sync.
   *
   * Keep the same city matching behavior that passed Phase 2 production QA.
   * Phase 3 changes evidence depth, not route/data-selection semantics.
   */
  const { data, error } = await supabase
    .from("companies")
    .select(COMPANY_FIELDS)
    .ilike("city", `%${city.name}%`)
    .order("verified", { ascending: false })
    .order("directory_quality_score", { ascending: false })
    .order("name", { ascending: true })

  if (error || !data) {
    if (error) {
      console.error("SEO marketplace company load error:", error)
    }

    return {
      companies: [],
      totalCityCompanies: 0,
      serviceMatchCount: 0,
      rutCount: 0,
      contactCount: 0,
      verifiedCount: 0,
      descriptionCount: 0,
      mode: serviceLabel ? "service" : "city",
      serviceLabel,
    }
  }

  if (!serviceLabel) {
    const stats = getEvidenceStats(data)

    return {
      companies: data
        .slice(0, limit)
        .map((company) => prepareCompany(company, false)),
      totalCityCompanies: data.length,
      serviceMatchCount: 0,
      ...stats,
      mode: "city",
      serviceLabel: null,
    }
  }

  const matchingCompanies = data.filter((company) =>
    (company.service_types ?? []).includes(serviceLabel),
  )
  const stats = getEvidenceStats(matchingCompanies)

  return {
    companies: matchingCompanies
      .slice(0, limit)
      .map((company) => prepareCompany(company, true)),
    totalCityCompanies: data.length,
    serviceMatchCount: matchingCompanies.length,
    ...stats,
    mode: "service",
    serviceLabel,
  }
}
