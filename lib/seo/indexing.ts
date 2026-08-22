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
 * Controls whether a valid SEO-engine page may be indexed.
 *
 * Important:
 * - non-Swedish SEO pages remain indexable;
 * - Swedish long-tail SEO pages remain indexable;
 * - Swedish combinations that have a cleaner landing URL are NOT
 *   indexed at /seo/... because that route permanently redirects
 *   to the cleaner URL.
 *
 * This is deliberately separate from generateStaticParams().
 * Indexability must not depend on whether a page is pre-rendered
 * during next build.
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

  return true
}

/**
 * Determines whether the Swedish /seo/[city]/[service] URL itself
 * is a canonical SEO-engine URL.
 *
 * Cleaner Swedish landing URLs replace the corresponding /seo/... URL.
 */
export function shouldIncludeSwedishSeoEnginePage(
  citySlug: string,
  serviceSlug: string,
) {
  return !getSwedishSeoLandingPath(citySlug, serviceSlug)
}

/**
 * Keep build-time pre-rendering intentionally small.
 *
 * These are performance/prebuild priorities only.
 * Other valid SEO URLs remain available through dynamic rendering
 * and may still be indexed.
 */
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

/**
 * Keep localized build-time pre-rendering intentionally limited.
 *
 * Remaining valid localized SEO pages are generated on demand.
 */
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
      if (!prebuildCities.has(city.slug)) {
        return []
      }

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