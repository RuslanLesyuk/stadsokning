import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const next = requestUrl.searchParams.get("next") || "/dashboard"

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin))
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin))
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

    await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
      },
      {
        onConflict: "id",
      },
    )
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin))
}