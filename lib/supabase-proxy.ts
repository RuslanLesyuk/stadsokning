import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

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
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000",
    )
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
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )

          // @supabase/ssr 0.5.x does not automatically propagate the newer
          // cache-safety headers when a refreshed session cookie is written.
          // Never allow a CDN to cache a response carrying another user's
          // refreshed authentication cookie.
          if (cookiesToSet.length > 0) {
            response.headers.set("Cache-Control", "private, no-store")
            response.headers.set("Pragma", "no-cache")
            response.headers.set("Expires", "0")
          }
        },
      },
    },
  )

  // getUser() is server-validated and also gives @supabase/ssr a chance to
  // refresh expired tokens through the cookie adapter above.
  await supabase.auth.getUser()

  return applySecurityHeaders(response, request)
}
