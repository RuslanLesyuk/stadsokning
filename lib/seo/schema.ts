
import {
  SEO_COUNTRY_CODE,
  SEO_ORGANIZATION_NAME,
  SEO_SITE_NAME,
  SEO_SITE_URL,
} from "./constants"

import { buildAbsoluteSeoUrl, buildAbsoluteUrl } from "./urls"

import type { SeoCity, SeoLocale, SeoService } from "./types"

type CreateSeoSchemaParams = {
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

export function createSeoSchema({
  locale,
  city,
  service,
}: CreateSeoSchemaParams) {
  const cityName = getSeoName(city, locale)
  const serviceName = getSeoName(service, locale)

  const pageUrl = buildAbsoluteSeoUrl({
    locale,
    city: city.slug,
    service: service.slug,
  })

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SEO_SITE_URL}/#organization`,
        name: SEO_ORGANIZATION_NAME,
        url: SEO_SITE_URL,
      },
      {
        "@type": "WebSite",
        "@id": `${SEO_SITE_URL}/#website`,
        name: SEO_SITE_NAME,
        url: SEO_SITE_URL,
        publisher: {
          "@id": `${SEO_SITE_URL}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${serviceName} – ${cityName}`,
        inLanguage: locale,
        isPartOf: {
          "@id": `${SEO_SITE_URL}/#website`,
        },
        about: {
          "@type": "Service",
          name: serviceName,
          serviceType: serviceName,
          areaServed: {
            "@type": "City",
            name: cityName,
            address: {
              "@type": "PostalAddress",
              addressCountry: SEO_COUNTRY_CODE,
            },
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: SEO_ORGANIZATION_NAME,
            item: SEO_SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: cityName,
            item: buildAbsoluteUrl(`/companies?city=${encodeURIComponent(cityName)}`),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: serviceName,
            item: pageUrl,
          },
        ],
      },
    ],
  }
}
