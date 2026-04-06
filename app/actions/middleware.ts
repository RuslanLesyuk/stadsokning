import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getPreferredLocale,
  normalizeLocale,
} from "@/lib/i18n"

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const currentPath = `${request.nextUrl.pathname}${request.nextUrl.search}`

  requestHeaders.set("x-current-path", currentPath)

  const existingLocaleCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value
  const locale = existingLocaleCookie
    ? normalizeLocale(existingLocaleCookie)
    : getPreferredLocale(request.headers.get("accept-language")) || DEFAULT_LOCALE

  let response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

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

          response = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          })

          for (const cookie of cookiesToSet) {
            response.cookies.set(cookie.name, cookie.value, cookie.options)
          }
        },
      },
    }
  )

  await supabase.auth.getUser()

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
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|site.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
}