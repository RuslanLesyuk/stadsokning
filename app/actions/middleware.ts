import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getPreferredLocale,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"

const SUPPORTED_LOCALES: Locale[] = ["uk", "ru", "en", "sv", "pl"]

const AUTH_ROUTES = [
  "/dashboard",
  "/admin",
  "/profile",
  "/messages",
]

function getLocaleFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0]

  if (SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return null
}

function removeLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean)

  if (
    segments.length > 0 &&
    SUPPORTED_LOCALES.includes(segments[0] as Locale)
  ) {
    const pathnameWithoutLocale = `/${segments.slice(1).join("/")}`
    return pathnameWithoutLocale === "/" ? "/" : pathnameWithoutLocale
  }

  return pathname
}

function requiresAuthentication(pathname: string): boolean {
  const pathnameWithoutLocale = removeLocalePrefix(pathname)

  return AUTH_ROUTES.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`),
  )
}

function createBaseResponse(
  request: NextRequest,
  requestHeaders: Headers,
): NextResponse {
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const currentPath = `${pathname}${request.nextUrl.search}`

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-current-path", currentPath)

  const pathLocale = getLocaleFromPath(pathname)
  const existingLocaleCookie = request.cookies.get(
    LOCALE_COOKIE_NAME,
  )?.value

  const locale = pathLocale
    ? pathLocale
    : existingLocaleCookie
      ? normalizeLocale(existingLocaleCookie)
      : getPreferredLocale(request.headers.get("accept-language")) ||
        DEFAULT_LOCALE

  let response = createBaseResponse(request, requestHeaders)

  /*
   * Публічні сторінки, включно з усіма SEO-маршрутами,
   * більше не запускають Supabase Auth.
   */
  if (!requiresAuthentication(pathname)) {
    if (!existingLocaleCookie || existingLocaleCookie !== locale) {
      response.cookies.set(LOCALE_COOKIE_NAME, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      })
    }

    return response
  }

  /*
   * Supabase запускається тільки для приватних маршрутів:
   * dashboard, admin, profile і messages.
   */
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },

        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            request.cookies.set(cookie.name, cookie.value)
          }

          response = createBaseResponse(request, requestHeaders)

          for (const cookie of cookiesToSet) {
            response.cookies.set(
              cookie.name,
              cookie.value,
              cookie.options,
            )
          }
        },
      },
    },
  )

  await supabase.auth.getUser()

  if (!existingLocaleCookie || existingLocaleCookie !== locale) {
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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|woff|woff2|ttf|otf)$).*)",
  ],
}