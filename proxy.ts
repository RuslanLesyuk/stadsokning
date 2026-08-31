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
   * Canonical SEO URLs must have a stable document language.
   *
   * Override the locale only on the incoming request. We intentionally
   * do not persist this as a response cookie, so the visitor's normal
   * language preference remains unchanged after leaving the SEO page.
   *
   * RootLayout, SiteHeader and SEO pages all read clean_jobs_locale,
   * therefore this single request-scoped override keeps <html lang>,
   * header, footer and page copy aligned with the canonical URL.
   */
  const forcedLocale = getForcedSeoLocale(pathname)

  if (forcedLocale) {
    request.cookies.set(LOCALE_COOKIE_NAME, forcedLocale)
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
}
