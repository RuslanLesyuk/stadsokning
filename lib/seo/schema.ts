import { createSeoContent } from "./content"

import {
  SEO_COUNTRY_CODE,
  SEO_ORGANIZATION_NAME,
  SEO_SITE_NAME,
  SEO_SITE_URL,
} from "./constants"

import { buildAbsoluteSeoUrl } from "./urls"

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

export function createSeoSchema({
  locale,
  city,
  service,
}: CreateSeoSchemaParams) {
  const content = createSeoContent({
    locale,
    city,
    service,
  })

  const cityName = getSeoName(city, locale)
  const serviceName = getSeoName(service, locale)

  const pageUrl = buildAbsoluteSeoUrl({
    locale,
    city: city.slug,
    service: service.slug,
  })

  const faqItems = content.faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }))

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
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: `${serviceName} in ${cityName}`,
        serviceType: serviceName,
        areaServed: {
          "@type": "City",
          name: cityName,
          address: {
            "@type": "PostalAddress",
            addressCountry: SEO_COUNTRY_CODE,
          },
        },
        provider: {
          "@id": `${SEO_SITE_URL}/#organization`,
        },
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqItems,
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
            item: pageUrl,
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