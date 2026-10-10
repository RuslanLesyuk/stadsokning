import { buildLocalizedSeoPath } from "./urls"

import type { SeoCity, SeoLocale, SeoService } from "./types"

/*
 * Compatibility constants retained for newer parts of Clean Jobs.
 *
 * The SEO Engine itself now follows the original full-matrix model:
 * every valid municipality x service x locale combination is indexable.
 */

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
  return SWEDISH_LANDING_CITY_SLUGS.includes(
    citySlug as (typeof SWEDISH_LANDING_CITY_SLUGS)[number],
  )
}

export function isLocalizedPriorityService(serviceSlug: string) {
  return localizedPriorityServices.has(serviceSlug)
}

/*
 * Original SEO Engine behaviour.
 *
 * Swedish /seo/... URLs are real SEO pages again.
 * Clean landing pages may continue to exist separately, but they no longer
 * replace or redirect the original SEO Engine URLs.
 */
export function getSwedishSeoLandingPath(
  _citySlug: string,
  _serviceSlug: string,
) {
  return null
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
  return buildLocalizedSeoPath({
    locale,
    city,
    service,
  })
}

/*
 * Full matrix:
 * 290 municipalities x 20 services x 5 locales.
 */
export function shouldIndexPreferredSeoPage(_params: {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}) {
  return true
}

export function shouldIndexSeoEnginePage(_params: {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}) {
  return true
}

export function shouldIncludeSwedishSeoEnginePage(
  _citySlug: string,
  _serviceSlug: string,
) {
  return true
}

export function getSwedishSeoStaticParams(
  cities: SeoCity[],
  services: SeoService[],
) {
  return cities.flatMap((city) =>
    services.map((service) => ({
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
  return locales.flatMap((seoSlug) =>
    cities.flatMap((city) =>
      services.map((service) => ({
        seoSlug,
        city: city.slug,
        service: service.slug,
      })),
    ),
  )
}
