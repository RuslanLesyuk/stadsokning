import type { SeoCity, SeoLocale, SeoService } from "./types"

import {
  SEO_DEFAULT_LOCALE,
  SEO_HOME_URL,
  SEO_ORGANIZATION_NAME,
} from "./constants"

import { buildLocalizedSeoPath } from "./urls"

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
    "names" in item &&
    item.names &&
    typeof item.names === "object" &&
    locale in item.names
  ) {
    return item.names[locale as keyof typeof item.names] as string
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
      href: buildLocalizedSeoPath({
        locale,
        city: city.slug,
        service: service.slug,
      }),
    },
    {
      name: serviceName,
      href: buildLocalizedSeoPath({
        locale,
        city: city.slug,
        service: service.slug,
      }),
    },
  ]
}