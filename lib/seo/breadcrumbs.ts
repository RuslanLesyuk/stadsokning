
import type { SeoCity, SeoLocale, SeoService } from "./types"

import {
  SEO_DEFAULT_LOCALE,
  SEO_HOME_URL,
  SEO_ORGANIZATION_NAME,
} from "./constants"

import { getPreferredSeoPath } from "./indexing"

type CreateSeoBreadcrumbsParams = {
  locale: SeoLocale
  city: SeoCity
  service: SeoService
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

export function createSeoBreadcrumbs({
  locale,
  city,
  service,
}: CreateSeoBreadcrumbsParams) {
  const cityName = getSeoName(city, locale)
  const serviceName = getSeoName(service, locale)

  const homePath =
    locale === SEO_DEFAULT_LOCALE ? SEO_HOME_URL : `/${locale}${SEO_HOME_URL}`

  return [
    {
      name: SEO_ORGANIZATION_NAME,
      href: homePath,
    },
    {
      name: cityName,
      href: `/companies?city=${encodeURIComponent(city.name)}`,
    },
    {
      name: serviceName,
      href: getPreferredSeoPath({
        locale,
        city: city.slug,
        service: service.slug,
      }),
    },
  ]
}
