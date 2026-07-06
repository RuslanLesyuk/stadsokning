import type { Metadata } from "next"

import {
  SEO_DEFAULT_OG_IMAGE,
  SEO_DEFAULT_TWITTER_IMAGE,
  SEO_ORGANIZATION_NAME,
  SEO_ROBOTS_INDEX,
  SEO_SITE_NAME,
  SEO_SITE_URL,
  SEO_TWITTER_CARD,
} from "./constants"

import {
  buildAbsoluteSeoUrl,
  buildAbsoluteUrl,
  buildSeoLanguageAlternates,
  buildSeoXDefaultUrl,
} from "./urls"

import type { SeoCity, SeoLocale, SeoService } from "./types"

type CreateSeoMetadataInput = {
  locale: SeoLocale
  city: SeoCity
  service: SeoService
  title: string
  description: string
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

export function createSeoMetadata({
  locale,
  city,
  service,
  title,
  description,
}: CreateSeoMetadataInput): Metadata {
  const canonical = buildAbsoluteSeoUrl({
    locale,
    city: city.slug,
    service: service.slug,
  })

  const languageAlternates = buildSeoLanguageAlternates({
    city: city.slug,
    service: service.slug,
  })

  const xDefault = buildSeoXDefaultUrl({
    city: city.slug,
    service: service.slug,
  })

  const cityName = getSeoName(city, locale)
  const serviceName = getSeoName(service, locale)

  const ogImageUrl = buildAbsoluteUrl(SEO_DEFAULT_OG_IMAGE)
  const twitterImageUrl = buildAbsoluteUrl(SEO_DEFAULT_TWITTER_IMAGE)

  return {
    metadataBase: new URL(SEO_SITE_URL),

    title,
    description,

    applicationName: SEO_SITE_NAME,

    alternates: {
      canonical,
      languages: {
        ...languageAlternates,
        "x-default": xDefault,
      },
    },

    openGraph: {
      type: "website",
      siteName: SEO_SITE_NAME,
      title,
      description,
      url: canonical,
      locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${serviceName} in ${cityName} | ${SEO_SITE_NAME}`,
        },
      ],
    },

    twitter: {
      card: SEO_TWITTER_CARD,
      title,
      description,
      images: [twitterImageUrl],
    },

    robots: SEO_ROBOTS_INDEX,

    category: "Cleaning services",

    other: {
      "og:site_name": SEO_SITE_NAME,
      "og:locale": locale,
      "business:contact_data:country_name": "Sweden",
      "article:publisher": SEO_ORGANIZATION_NAME,
    },
  }
}