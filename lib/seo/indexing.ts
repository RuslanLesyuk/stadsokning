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
  "stadfirma",
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
] as const

export const LOCALIZED_PRIORITY_SERVICE_SLUGS = [
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
  "trappstadning",
] as const

const priorityCities = new Set<string>(SWEDISH_PRIORITY_CITY_SLUGS)
const priorityServices = new Set<string>(SWEDISH_PRIORITY_SERVICE_SLUGS)
const landingCities = new Set<string>(SWEDISH_LANDING_CITY_SLUGS)
const landingServices = new Set<string>(SWEDISH_LANDING_SERVICE_SLUGS)
const localizedPriorityServices = new Set<string>(
  LOCALIZED_PRIORITY_SERVICE_SLUGS,
)

export function isSwedishPriorityCity(citySlug: string) {
  return priorityCities.has(citySlug)
}

export function isSwedishPriorityService(serviceSlug: string) {
  return priorityServices.has(serviceSlug)
}

export function isLocalizedPriorityCity(citySlug: string) {
  return landingCities.has(citySlug)
}

export function isLocalizedPriorityService(serviceSlug: string) {
  return localizedPriorityServices.has(serviceSlug)
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

    if (landingPath) {
      return landingPath
    }
  }

  return buildLocalizedSeoPath({
    locale,
    city,
    service,
  })
}

/**
 * Canonical index policy.
 *
 * Recovery strategy:
 * - Swedish: keep the strongest 28 cities x 8 commercial services.
 * - EN/UK/RU/PL: keep 11 priority cities x the 5 strongest services.
 * - Cleaner Swedish landing URLs remain indexable and replace the
 *   corresponding /seo/... URL.
 *
 * All other valid combinations remain routable but are noindex.
 * This lets us preserve the engine without asking Google to evaluate
 * ~29k near-template pages at the same time.
 */
export function shouldIndexPreferredSeoPage({
  locale,
  citySlug,
  serviceSlug,
}: {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}) {
  if (locale === "sv") {
    if (getSwedishSeoLandingPath(citySlug, serviceSlug)) {
      return true
    }

    return (
      priorityCities.has(citySlug) &&
      priorityServices.has(serviceSlug)
    )
  }

  return (
    landingCities.has(citySlug) &&
    localizedPriorityServices.has(serviceSlug)
  )
}

/**
 * Controls the actual /seo route.
 *
 * A Swedish combination with a cleaner landing path is not indexable
 * at /seo/... because that route permanently redirects to the clean URL.
 */
export function shouldIndexSeoEnginePage({
  locale,
  citySlug,
  serviceSlug,
}: {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}) {
  if (
    locale === "sv" &&
    getSwedishSeoLandingPath(citySlug, serviceSlug)
  ) {
    return false
  }

  return shouldIndexPreferredSeoPage({
    locale,
    citySlug,
    serviceSlug,
  })
}

export function shouldIncludeSwedishSeoEnginePage(
  citySlug: string,
  serviceSlug: string,
) {
  return !getSwedishSeoLandingPath(citySlug, serviceSlug)
}

export function getSwedishSeoStaticParams(
  cities: SeoCity[],
  services: SeoService[],
) {
  return cities.flatMap((city) => {
    if (!priorityCities.has(city.slug)) {
      return []
    }

    return services
      .filter(
        (service) =>
          priorityServices.has(service.slug) &&
          shouldIncludeSwedishSeoEnginePage(city.slug, service.slug),
      )
      .map((service) => ({
        city: city.slug,
        service: service.slug,
      }))
  })
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
  return locales.flatMap((seoSlug) =>
    cities.flatMap((city) => {
      if (!landingCities.has(city.slug)) {
        return []
      }

      return services
        .filter((service) =>
          localizedPriorityServices.has(service.slug),
        )
        .map((service) => ({
          seoSlug,
          city: city.slug,
          service: service.slug,
        }))
    }),
  )
}
