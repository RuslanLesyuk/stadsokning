import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  SWEDISH_LANDING_CITY_SLUGS,
  SWEDISH_LANDING_SERVICE_SLUGS,
  getSwedishSeoLandingPath,
} from "@/lib/seo/indexing"
import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"
import {
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/lib/i18n"
import { updateSession } from "@/lib/supabase-proxy"

const LANGUAGE_SELECTED_COOKIE = "clean_jobs_language_selected"

const SWEDISH_GUIDE_PATHS = new Set([
  "/jobb-i-sverige",
  "/jobb-utan-svenska",
  "/hur-man-far-jobb-i-sverige",
  "/vad-tjanar-en-stadare-i-sverige",
  "/stadbranschen-i-sverige-statistik",
  "/basta-stadforetag-i-sverige",
  "/stadjobb-stockholm",
  "/stadjobb-goteborg",
  "/stadjobb-malmo",
])

const ENGLISH_GUIDE_PATHS = new Set([
  "/work-in-sweden",
  "/jobs-for-foreigners-in-sweden",
  "/how-to-find-a-job-in-sweden",
  "/how-much-do-cleaners-earn-in-sweden",
  "/cleaning-company-statistics-sweden",
  "/hire-cleaner-stockholm",
  "/best-cleaning-companies-in-sweden",
  "/cleaning-jobs-stockholm",
  "/cleaning-jobs-gothenburg",
  "/cleaning-jobs-malmo",
])

const SWEDISH_LANDING_PATHS = new Set(
  SWEDISH_LANDING_CITY_SLUGS.flatMap((citySlug) =>
    SWEDISH_LANDING_SERVICE_SLUGS.map(
      (serviceSlug) => `/${serviceSlug}-${citySlug}`,
    ),
  ),
)

const SEO_CITY_SLUGS = new Set(
  seoCities.map((city) => city.slug.toLowerCase()),
)

const SEO_SERVICE_SLUGS = [...seoServices]
  .map((service) => service.slug.toLowerCase())
  .sort((a, b) => b.length - a.length)

function cleanPathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/"
}

/*
 * Recover malformed historical SEO URLs.
 *
 * Examples:
 *
 * /seo/forshaga/sofftvatt-sofftvatt
 * -> /seo/forshaga/sofftvatt
 *
 * /seo/skurup/garage-stadning-Skurup
 * -> /seo/skurup/garage-stadning
 *
 * /ru/seo/skinnskatteberg/golvvard-Skinnskatteberg
 * -> /ru/seo/skinnskatteberg/golvvard
 *
 * A redirect is created only when:
 * - the city is one of our real SEO cities;
 * - the malformed service starts with one of our real service slugs;
 * - the complete service segment is NOT already a valid service slug.
 */
function getMalformedSeoRedirectPath(pathname: string) {
  const cleanPath = cleanPathname(pathname)

  const match = cleanPath.match(
    /^\/(?:(en|uk|ru|pl)\/)?seo\/([^/]+)\/([^/]+)$/i,
  )

  if (!match) {
    return null
  }

  const [, locale, rawCitySlug, rawServiceSegment] = match

  const citySlug = rawCitySlug.toLowerCase()
  const serviceSegment = rawServiceSegment.toLowerCase()

  if (!SEO_CITY_SLUGS.has(citySlug)) {
    return null
  }

  // Already a correct service slug. Never redirect it.
  if (SEO_SERVICE_SLUGS.includes(serviceSegment)) {
    return null
  }

  const serviceSlug = SEO_SERVICE_SLUGS.find((candidate) =>
    serviceSegment.startsWith(`${candidate}-`),
  )

  if (!serviceSlug) {
    return null
  }

  /*
   * Localized SEO URLs remain localized.
   */
  if (locale) {
    return `/${locale.toLowerCase()}/seo/${citySlug}/${serviceSlug}`
  }

  /*
   * Swedish combinations that have a preferred clean landing page
   * should go directly to that canonical URL.
   */
  const landingPath = getSwedishSeoLandingPath(
    citySlug,
    serviceSlug,
  )

  if (landingPath) {
    return landingPath
  }

  return `/seo/${citySlug}/${serviceSlug}`
}

/*
 * Old versions of Clean Jobs exposed some normal pages with a locale prefix:
 *
 * /ru/companies/company-slug
 * /uk/companies/company-slug
 * /pl/services/city/botkyrka
 * /pl/flyttstadning-goteborg
 *
 * Those routes no longer exist. Permanently redirect them to the
 * current canonical URL.
 *
 * IMPORTANT:
 * /en/seo/...
 * /uk/seo/...
 * /ru/seo/...
 * /pl/seo/...
 *
 * are current valid SEO routes and MUST NOT be redirected.
 */
function getLegacyLocaleRedirectPath(pathname: string) {
  const cleanPath = cleanPathname(pathname)

  const match = cleanPath.match(
    /^\/(en|uk|ru|pl)(\/.*)$/,
  )

  if (!match) {
    return null
  }

  const unprefixedPath = match[2]

  if (/^\/seo\/[^/]+\/[^/]+$/.test(unprefixedPath)) {
    return null
  }

  if (
    unprefixedPath === "/companies" ||
    unprefixedPath.startsWith("/companies/")
  ) {
    return unprefixedPath
  }

  if (
    unprefixedPath === "/services" ||
    unprefixedPath.startsWith("/services/")
  ) {
    return unprefixedPath
  }

  if (SWEDISH_LANDING_PATHS.has(unprefixedPath)) {
    return unprefixedPath
  }

  return null
}

function getForcedSeoLocale(pathname: string): Locale | null {
  const cleanPath = cleanPathname(pathname)

  const localizedSeoMatch = cleanPath.match(
    /^\/(en|uk|ru|pl)\/seo\/[^/]+\/[^/]+$/,
  )

  if (localizedSeoMatch) {
    return localizedSeoMatch[1] as Locale
  }

  if (/^\/seo\/[^/]+\/[^/]+$/.test(cleanPath)) {
    return "sv"
  }

  if (SWEDISH_LANDING_PATHS.has(cleanPath)) {
    return "sv"
  }

  if (SWEDISH_GUIDE_PATHS.has(cleanPath)) {
    return "sv"
  }

  if (ENGLISH_GUIDE_PATHS.has(cleanPath)) {
    return "en"
  }

  return null
}

function isLocaleEncodedSeoPath(pathname: string) {
  const cleanPath = cleanPathname(pathname)

  return (
    /^\/seo\/[^/]+\/[^/]+$/.test(cleanPath) ||
    /^\/(en|uk|ru|pl)\/seo\/[^/]+\/[^/]+$/.test(cleanPath)
  )
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  /*
   * 1. Repair malformed historical SEO URLs first.
   */
  const malformedSeoRedirectPath =
    getMalformedSeoRedirectPath(pathname)

  if (malformedSeoRedirectPath) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = malformedSeoRedirectPath

    return NextResponse.redirect(redirectUrl, 308)
  }

  /*
   * 2. Recover old locale-prefixed normal URLs.
   */
  const legacyRedirectPath =
    getLegacyLocaleRedirectPath(pathname)

  if (legacyRedirectPath) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = legacyRedirectPath

    return NextResponse.redirect(redirectUrl, 308)
  }

  /*
   * 3. Swedish SEO engine URLs that have a preferred clean landing:
   *
   * /seo/stockholm/hemstadning
   * -> /hemstadning-stockholm
   */
  const seoMatch = pathname.match(
    /^\/seo\/([^/]+)\/([^/]+)\/?$/,
  )

  if (seoMatch) {
    const [, citySlug, serviceSlug] = seoMatch

    const landingPath = getSwedishSeoLandingPath(
      citySlug,
      serviceSlug,
    )

    if (landingPath) {
      const redirectUrl = request.nextUrl.clone()

      redirectUrl.pathname = landingPath
      redirectUrl.search = ""

      return NextResponse.redirect(redirectUrl, 308)
    }
  }

  /*
   * URL-localized SEO routes keep a stable document language:
   *
   * /seo/...          -> sv
   * /en/seo/...       -> en
   * /uk/seo/...       -> uk
   * /ru/seo/...       -> ru
   * /pl/seo/...       -> pl
   */
  const forcedLocale = getForcedSeoLocale(pathname)

  const explicitLanguageSelected =
    request.cookies.get(LANGUAGE_SELECTED_COOKIE)?.value === "true"

  if (
    forcedLocale &&
    (
      isLocaleEncodedSeoPath(pathname) ||
      !explicitLanguageSelected
    )
  ) {
    request.cookies.set(
      LOCALE_COOKIE_NAME,
      forcedLocale,
    )
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
}
