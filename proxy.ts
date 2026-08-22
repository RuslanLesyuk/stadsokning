import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { getSwedishSeoLandingPath } from "@/lib/seo/indexing"
import { updateSession } from "@/lib/supabase-proxy"

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

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
}