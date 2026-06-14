import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getRequiredEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing ${name}`)
  }

  return value
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/profile", request.url))
    }

    const issuer = getRequiredEnv("BANKID_ISSUER")
    const clientId = getRequiredEnv("BANKID_CLIENT_ID")
    const redirectUri = getRequiredEnv("BANKID_REDIRECT_URI")

    const state = crypto.randomUUID()
    const nonce = crypto.randomUUID()

    const authorizationUrl = new URL(`${issuer}/oauth2/authorize`)

    authorizationUrl.searchParams.set("response_type", "code")
    authorizationUrl.searchParams.set("client_id", clientId)
    authorizationUrl.searchParams.set("redirect_uri", redirectUri)
    authorizationUrl.searchParams.set("scope", "openid profile")
    authorizationUrl.searchParams.set("state", state)
    authorizationUrl.searchParams.set("nonce", nonce)
    authorizationUrl.searchParams.set("acr_values", "urn:grn:authn:se:bankid")

    const response = NextResponse.redirect(authorizationUrl)

    response.cookies.set("bankid_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    })

    response.cookies.set("bankid_nonce", nonce, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    })

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start BankID"

    return NextResponse.redirect(
      new URL(`/profile?bankid_error=${encodeURIComponent(message)}`, request.url),
    )
  }
}