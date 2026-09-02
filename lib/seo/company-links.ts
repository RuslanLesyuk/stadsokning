import { seoCities } from "./cities"
import { getPreferredSeoPath, shouldIndexPreferredSeoPage } from "./indexing"
import { seoServices } from "./services"

import type { SeoLocale } from "./types"

export type CompanySeoLink = {
  href: string
  label: string
  serviceSlug: string
}

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "")
}

export function getCompanySeoLinks({
  cityName,
  serviceTypes,
  locale,
  limit = 6,
}: {
  cityName: string
  serviceTypes: string[]
  locale: SeoLocale
  limit?: number
}): CompanySeoLink[] {
  const cityKey = normalize(cityName)
  const city = seoCities.find((item) => normalize(item.name) === cityKey)

  if (!city) return []

  const serviceSlugByType = new Map<string, string>([
    [normalize("Hemstädning"), "hemstadning"],
    [normalize("Flyttstädning"), "flyttstadning"],
    [normalize("Kontorsstädning"), "kontorsstadning"],
    [normalize("Fönsterputs"), "fonsterputs"],
    [normalize("Trappstädning"), "trappstadning"],
    [normalize("Byggstädning"), "byggstadning"],
    [normalize("Storstädning"), "storstadning"],
    [normalize("Dödsbostädning"), "dodsbo-stadning"],
  ])

  const requestedSlugs = new Set(
    serviceTypes
      .map((serviceType) => serviceSlugByType.get(normalize(serviceType)))
      .filter((slug): slug is string => Boolean(slug)),
  )

  const seen = new Set<string>()
  const links: CompanySeoLink[] = []

  for (const service of seoServices) {
    if (!requestedSlugs.has(service.slug)) {
      continue
    }

    if (
      !shouldIndexPreferredSeoPage({
        locale,
        citySlug: city.slug,
        serviceSlug: service.slug,
      })
    ) {
      continue
    }

    const href = getPreferredSeoPath({
      locale,
      city: city.slug,
      service: service.slug,
    })

    if (seen.has(href)) continue
    seen.add(href)

    const serviceName = service.name[locale] || service.name.sv

    links.push({
      href,
      label: `${serviceName} – ${city.name}`,
      serviceSlug: service.slug,
    })

    if (links.length >= limit) break
  }

  return links
}
