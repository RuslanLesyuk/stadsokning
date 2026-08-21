
import type { Metadata } from "next"

import {
  SEO_DEFAULT_OG_IMAGE,
  SEO_DEFAULT_TWITTER_IMAGE,
  SEO_SITE_NAME,
  SEO_SITE_URL,
  SEO_TWITTER_CARD,
} from "./constants"

import { shouldIndexSeoEnginePage } from "./indexing"

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
    "name" in item &&
    item.name &&
    typeof item.name === "object" &&
    locale in item.name
  ) {
    return item.name[locale as keyof typeof item.name] as string
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

  const indexable = shouldIndexSeoEnginePage({
    locale,
    citySlug: city.slug,
    serviceSlug: service.slug,
  })

  const cityName = getSeoName(city, locale)
  const serviceName = getSeoName(service, locale)
  const absoluteTitle = `${title} | ${SEO_SITE_NAME}`
  const ogImageUrl = buildAbsoluteUrl(SEO_DEFAULT_OG_IMAGE)
  const twitterImageUrl = buildAbsoluteUrl(SEO_DEFAULT_TWITTER_IMAGE)

  const alternates = indexable
    ? {
        canonical,
        languages: {
          ...buildSeoLanguageAlternates({
            city: city.slug,
            service: service.slug,
          }),
          "x-default": buildSeoXDefaultUrl({
            city: city.slug,
            service: service.slug,
          }),
        },
      }
    : {
        canonical,
      }

  return {
    metadataBase: new URL(SEO_SITE_URL),
    title: {
      absolute: absoluteTitle,
    },
    description,
    applicationName: SEO_SITE_NAME,
    alternates,

    openGraph: {
      type: "website",
      siteName: SEO_SITE_NAME,
      title: absoluteTitle,
      description,
      url: canonical,
      locale,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${serviceName} – ${cityName}`,
        },
      ],
    },

    twitter: {
      card: SEO_TWITTER_CARD,
      title: absoluteTitle,
      description,
      images: [twitterImageUrl],
    },

    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        }
      : {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        },

    category: locale === "sv" ? "Städtjänster" : "Cleaning services",
  }
}
