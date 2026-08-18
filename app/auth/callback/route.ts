import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase-server"
import {
  resolveTrustedAuthOrigin,
  sanitizeInternalRedirect,
} from "@/lib/security/urls"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = resolveTrustedAuthOrigin(requestUrl.origin)
  const code = requestUrl.searchParams.get("code")
  const next = sanitizeInternalRedirect(requestUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login", origin))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User"

    const { error: profileError } = await supabase.from("profiles").upsert(
      { id: user.id, full_name: String(fullName).slice(0, 120) },
      { onConflict: "id" },
    )

    if (profileError) {
      console.error("OAuth profile upsert error:", profileError)
    }
  }

  return NextResponse.redirect(new URL(next, origin))
}
