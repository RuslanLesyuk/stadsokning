
import { seoCities } from "./cities"
import { seoServices } from "./services"
import {
  getPreferredSeoPath,
  isSwedishPriorityCity,
  isSwedishPriorityService,
} from "./indexing"

import type { SeoCity, SeoLocale, SeoService } from "./types"

type CreateRelatedContentParams = {
  locale: SeoLocale
  city: SeoCity
  service: SeoService
}

export type RelatedLink = {
  title: string
  href: string
}

function getSeoName(item: SeoCity | SeoService, locale: SeoLocale) {
  if ("name" in item && typeof item.name === "string") {
    return item.name
  }

  if (
    "name" in item &&
    item.name &&
    typeof item.name === "object" &&
    locale in item.name
  ) {
    return item.name[locale as keyof typeof item.name] as string
  }

  return item.slug
}

function uniqueCities(items: SeoCity[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    if (seen.has(item.slug)) return false
    seen.add(item.slug)
    return true
  })
}

export function createRelatedContent({
  locale,
  city,
  service,
}: CreateRelatedContentParams) {
  const serviceCandidates =
    locale === "sv"
      ? seoServices.filter((item) => isSwedishPriorityService(item.slug))
      : seoServices

  const services: RelatedLink[] = serviceCandidates
    .filter((item) => item.slug !== service.slug)
    .slice(0, 6)
    .map((item) => ({
      title: getSeoName(item, locale),
      href: getPreferredSeoPath({
        locale,
        city: city.slug,
        service: item.slug,
      }),
    }))

  const sameRegion = seoCities.filter(
    (item) =>
      item.slug !== city.slug &&
      item.region &&
      city.region &&
      item.region === city.region &&
      (locale !== "sv" || isSwedishPriorityCity(item.slug)),
  )

  const priorityElsewhere = seoCities.filter(
    (item) =>
      item.slug !== city.slug &&
      !sameRegion.some((nearby) => nearby.slug === item.slug) &&
      (locale !== "sv" || isSwedishPriorityCity(item.slug)),
  )

  const cities: RelatedLink[] = uniqueCities([
    ...sameRegion,
    ...priorityElsewhere,
  ])
    .slice(0, 6)
    .map((item) => ({
      title: getSeoName(item, locale),
      href: getPreferredSeoPath({
        locale,
        city: item.slug,
        service: service.slug,
      }),
    }))

  return {
    services,
    cities,
  }
}
