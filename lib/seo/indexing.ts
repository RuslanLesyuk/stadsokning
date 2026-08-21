
import { buildLocalizedSeoPath } from "./urls"

import type { SeoCity, SeoLocale, SeoService } from "./types"

export const SWEDISH_PRIORITY_CITY_SLUGS = [
  "stockholm",
  "goteborg",
  "malmo",
  "uppsala",
  "vasteras",
  "orebro",
  "linkoping",
  "helsingborg",
  "jonkoping",
  "norrkoping",
  "lund",
  "umea",
  "gavle",
  "boras",
  "sodertalje",
  "eskilstuna",
  "halmstad",
  "vaxjo",
  "karlstad",
  "sundsvall",
  "solna",
  "sundbyberg",
  "nacka",
  "huddinge",
  "taby",
  "jarfalla",
  "sollentuna",
  "botkyrka",
] as const

export const SWEDISH_PRIORITY_SERVICE_SLUGS = [
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
  "trappstadning",
  "byggstadning",
  "storstadning",
  "dodsbo-stadning",
] as const

export const SWEDISH_LANDING_CITY_SLUGS = [
  "stockholm",
  "goteborg",
  "malmo",
  "uppsala",
  "vasteras",
  "orebro",
  "linkoping",
  "helsingborg",
  "jonkoping",
  "lund",
  "umea",
] as const

export const SWEDISH_LANDING_SERVICE_SLUGS = [
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
] as const

const priorityCities = new Set<string>(SWEDISH_PRIORITY_CITY_SLUGS)
const priorityServices = new Set<string>(SWEDISH_PRIORITY_SERVICE_SLUGS)
const landingCities = new Set<string>(SWEDISH_LANDING_CITY_SLUGS)
const landingServices = new Set<string>(SWEDISH_LANDING_SERVICE_SLUGS)

export function isSwedishPriorityCity(citySlug: string) {
  return priorityCities.has(citySlug)
}

export function isSwedishPriorityService(serviceSlug: string) {
  return priorityServices.has(serviceSlug)
}

export function getSwedishSeoLandingPath(
  citySlug: string,
  serviceSlug: string,
) {
  if (!landingCities.has(citySlug) || !landingServices.has(serviceSlug)) {
    return null
  }

  return `/${serviceSlug}-${citySlug}`
}

export function getPreferredSeoPath({
  locale,
  city,
  service,
}: {
  locale: SeoLocale
  city: string
  service: string
}) {
  if (locale === "sv") {
    const landingPath = getSwedishSeoLandingPath(city, service)
    if (landingPath) return landingPath
  }

  return buildLocalizedSeoPath({ locale, city, service })
}

export function shouldIndexSeoEnginePage({
  locale,
  citySlug,
  serviceSlug,
}: {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}) {
  if (locale !== "sv") {
    return true
  }

  return isSwedishPriorityCity(citySlug) && isSwedishPriorityService(serviceSlug)
}

export function shouldIncludeSwedishSeoEnginePage(
  citySlug: string,
  serviceSlug: string,
) {
  return (
    isSwedishPriorityCity(citySlug) &&
    isSwedishPriorityService(serviceSlug) &&
    !getSwedishSeoLandingPath(citySlug, serviceSlug)
  )
}

export function getSwedishSeoStaticParams(
  cities: SeoCity[],
  services: SeoService[],
) {
  return cities.flatMap((city) =>
    services
      .filter((service) =>
        shouldIncludeSwedishSeoEnginePage(city.slug, service.slug),
      )
      .map((service) => ({
        city: city.slug,
        service: service.slug,
      })),
  )
}

export function getLocalizedSeoStaticParams({
  locales,
  cities,
  services,
}: {
  locales: SeoLocale[]
  cities: SeoCity[]
  services: SeoService[]
}) {
  const prebuildCities = new Set<string>(SWEDISH_LANDING_CITY_SLUGS)
  const prebuildServices = new Set<string>(
    SWEDISH_PRIORITY_SERVICE_SLUGS.slice(0, 5),
  )

  return locales.flatMap((seoSlug) =>
    cities.flatMap((city) => {
      if (!prebuildCities.has(city.slug)) return []

      return services
        .filter((service) => prebuildServices.has(service.slug))
        .map((service) => ({
          seoSlug,
          city: city.slug,
          service: service.slug,
        }))
    }),
  )
}
