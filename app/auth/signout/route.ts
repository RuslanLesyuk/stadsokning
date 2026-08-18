import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase-server"
import { resolveTrustedAuthOrigin } from "@/lib/security/urls"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  const fetchSite = request.headers.get("sec-fetch-site")

  if (fetchSite === "cross-site") {
    return NextResponse.json({ error: "Cross-site sign-out is not allowed." }, { status: 403 })
  }

  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath("/", "layout")
  revalidatePath("/login")
  revalidatePath("/dashboard")
  revalidatePath("/jobs")

  const origin = resolveTrustedAuthOrigin(new URL(request.url).origin)
  const response = NextResponse.redirect(new URL("/login", origin), 303)
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
  return response
}
