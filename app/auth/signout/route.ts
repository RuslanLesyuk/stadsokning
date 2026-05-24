import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: Request) {
  const supabase = await createClient()

  await supabase.auth.signOut()

  revalidatePath("/", "layout")
  revalidatePath("/login")
  revalidatePath("/dashboard")
  revalidatePath("/jobs")

  const response = NextResponse.redirect(new URL("/login", request.url), 303)

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  )

  return response
}