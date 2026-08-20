import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function getLocaleFromPath(pathname: string): Locale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0]

  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as Locale)) {
    return firstSegment as Locale
  }

  return null
}

function resolveRequestLocale(request: NextRequest): Locale {
  const pathLocale = getLocaleFromPath(request.nextUrl.pathname)
  if (pathLocale) return pathLocale

  // The canonical, unprefixed SEO route is Swedish. Never let an old
  // language cookie turn /seo/... into a mixed-language document.
  if (
    request.nextUrl.pathname === "/seo" ||
    request.nextUrl.pathname.startsWith("/seo/")
  ) {
    return DEFAULT_LOCALE
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  if (cookieLocale) return normalizeLocale(cookieLocale)

  return DEFAULT_LOCALE
}

function createBaseResponse(request: NextRequest, requestHeaders: Headers) {
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

function applySecurityHeaders(response: NextResponse, request: NextRequest) {
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), usb=(), browsing-topics=()",
  )
  response.headers.set(
    "Content-Security-Policy",
    "base-uri 'self'; object-src 'none'; frame-ancestors 'none'",
  )

  const forwardedProto = request.headers.get("x-forwarded-proto")
  if (request.nextUrl.protocol === "https:" || forwardedProto === "https") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000")
  }

  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api")
  ) {
    response.headers.set("Cache-Control", "private, no-store")
  }

  return response
}

export async function updateSession(request: NextRequest) {
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-current-path", currentPath)

  const resolvedLocale = resolveRequestLocale(request)
  const existingLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  const localeChanged = existingLocale !== resolvedLocale

  // Server Components must see the resolved locale during this same request,
  // not only after the browser receives Set-Cookie.
  if (localeChanged) {
    request.cookies.set(LOCALE_COOKIE_NAME, resolvedLocale)
  }

  let response = createBaseResponse(request, requestHeaders)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )

          response = createBaseResponse(request, requestHeaders)

          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )

          if (cookiesToSet.length > 0) {
            response.headers.set("Cache-Control", "private, no-store")
            response.headers.set("Pragma", "no-cache")
            response.headers.set("Expires", "0")
          }
        },
      },
    },
  )

  // Keep Stage 10 session-refresh behaviour intact. Query-count optimization
  // belongs to the dedicated performance stabilization package.
  await supabase.auth.getUser()

  if (localeChanged) {
    response.cookies.set(LOCALE_COOKIE_NAME, resolvedLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  return applySecurityHeaders(response, request)
}
