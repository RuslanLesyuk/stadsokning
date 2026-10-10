import { seoCities } from "./cities"
import { seoServices } from "./services"
import { buildLocalizedSeoPath } from "./urls"

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

  if (
    "names" in item &&
    item.names &&
    typeof item.names === "object" &&
    locale in item.names
  ) {
    return item.names[locale as keyof typeof item.names] as string
  }

  return item.slug
}

export function createRelatedContent({
  locale,
  city,
  service,
}: CreateRelatedContentParams) {
  const services: RelatedLink[] = seoServices
    .filter((item) => item.slug !== service.slug)
    .slice(0, 6)
    .map((item) => ({
      title: getSeoName(item, locale),
      href: buildLocalizedSeoPath({
        locale,
        city: city.slug,
        service: item.slug,
      }),
    }))

  const cities: RelatedLink[] = seoCities
    .filter((item) => item.slug !== city.slug)
    .slice(0, 6)
    .map((item) => ({
      title: getSeoName(item, locale),
      href: buildLocalizedSeoPath({
        locale,
        city: item.slug,
        service: service.slug,
      }),
    }))

  const languages: RelatedLink[] = ["sv", "en", "uk", "ru", "pl"].map(
    (item) => ({
      title: item.toUpperCase(),
      href: buildLocalizedSeoPath({
        locale: item as SeoLocale,
        city: city.slug,
        service: service.slug,
      }),
    }),
  )

  return {
    services,
    cities,
    languages,
  }
}