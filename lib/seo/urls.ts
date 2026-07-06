import {
  SEO_DEFAULT_LOCALE,
  SEO_SITE_URL,
  SEO_SUPPORTED_LOCALES,
} from "./constants"

import type { SeoLocale } from "./types"

type SeoPathInput = {
  city: string
  service: string
}

export function normalizePath(path: string) {
  if (!path.startsWith("/")) {
    return `/${path}`
  }

  return path
}

export function buildSeoPath({ city, service }: SeoPathInput) {
  return `/seo/${city}/${service}`
}

export function buildLocalizedSeoPath({
  locale,
  city,
  service,
}: SeoPathInput & {
  locale: SeoLocale
}) {
  const path = buildSeoPath({ city, service })

  if (locale === SEO_DEFAULT_LOCALE) {
    return path
  }

  return `/${locale}${path}`
}

export function buildAbsoluteUrl(path: string) {
  const normalizedPath = normalizePath(path)

  return `${SEO_SITE_URL}${normalizedPath}`
}

export function buildAbsoluteSeoUrl({
  locale,
  city,
  service,
}: SeoPathInput & {
  locale: SeoLocale
}) {
  return buildAbsoluteUrl(
    buildLocalizedSeoPath({
      locale,
      city,
      service,
    }),
  )
}

export function buildSeoLanguageAlternates({
  city,
  service,
}: SeoPathInput) {
  return SEO_SUPPORTED_LOCALES.reduce(
    (acc, locale) => {
      acc[locale] = buildAbsoluteSeoUrl({
        locale,
        city,
        service,
      })

      return acc
    },
    {} as Record<SeoLocale, string>,
  )
}

export function buildSeoXDefaultUrl({ city, service }: SeoPathInput) {
  return buildAbsoluteSeoUrl({
    locale: SEO_DEFAULT_LOCALE,
    city,
    service,
  })
}