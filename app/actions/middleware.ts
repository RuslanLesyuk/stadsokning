import { NextRequest, NextResponse } from "next/server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getPreferredLocale,
  normalizeLocale,
} from "@/lib/i18n"

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`

  requestHeaders.set("x-current-path", currentPath)

  const existingLocaleCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  const locale = existingLocaleCookie
    ? normalizeLocale(existingLocaleCookie)
    : getPreferredLocale(request.headers.get("accept-language")) || DEFAULT_LOCALE

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  if (!existingLocaleCookie) {
    response.cookies.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
}