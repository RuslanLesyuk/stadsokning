import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  SWEDISH_LANDING_CITY_SLUGS,
  SWEDISH_LANDING_SERVICE_SLUGS,
  getSwedishSeoLandingPath,
} from "@/lib/seo/indexing"
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

function cleanPathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/"
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
   *   /seo/...          -> sv
   *   /en/seo/...       -> en
   *   /uk/seo/...       -> uk
   *   /ru/seo/...       -> ru
   *   /pl/seo/...       -> pl
   *
   * Clean Swedish landing pages and static guide URLs still get their
   * canonical default language for visitors/crawlers that have not made
   * an explicit language choice.
   *
   * Once a real user explicitly chooses a language, however, we respect
   * clean_jobs_locale on those non-prefixed pages. This lets the global
   * language switcher translate the page instead of immediately forcing
   * it back to Swedish/English.
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
    request.cookies.set(LOCALE_COOKIE_NAME, forcedLocale)
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
}
