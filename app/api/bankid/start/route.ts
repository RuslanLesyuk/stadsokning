import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function assertBankIdEnvironmentReady() {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.BANKID_PRODUCTION_READY !== "true"
  ) {
    throw new Error("BankID production verification is not enabled")
  }
}

function isSecureRequest(request: Request) {
  return new URL(request.url).protocol === "https:"
}

function toBase64Url(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64url")
}

async function createPkcePair() {
  const verifierBytes = crypto.getRandomValues(new Uint8Array(48))
  const verifier = toBase64Url(verifierBytes)
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))
  return { verifier, challenge: toBase64Url(new Uint8Array(digest)) }
}

export async function GET(request: Request) {
  try {
    assertBankIdEnvironmentReady()

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/profile", request.url))
    }

    const issuer = getRequiredEnv("BANKID_ISSUER").replace(/\/$/, "")
    const clientId = getRequiredEnv("BANKID_CLIENT_ID")
    const redirectUri = getRequiredEnv("BANKID_REDIRECT_URI")

    const state = crypto.randomUUID()
    const nonce = crypto.randomUUID()
    const { verifier, challenge } = await createPkcePair()

    const authorizationUrl = new URL(`${issuer}/oauth2/authorize`)
    authorizationUrl.searchParams.set("response_type", "code")
    authorizationUrl.searchParams.set("client_id", clientId)
    authorizationUrl.searchParams.set("redirect_uri", redirectUri)
    authorizationUrl.searchParams.set("scope", "openid profile")
    authorizationUrl.searchParams.set("state", state)
    authorizationUrl.searchParams.set("nonce", nonce)
    authorizationUrl.searchParams.set("acr_values", "urn:grn:authn:se:bankid")
    authorizationUrl.searchParams.set("code_challenge", challenge)
    authorizationUrl.searchParams.set("code_challenge_method", "S256")

    const response = NextResponse.redirect(authorizationUrl)
    const secure = isSecureRequest(request)
    const options = {
      httpOnly: true,
      secure,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 10 * 60,
    }

    response.cookies.set("bankid_state", state, options)
    response.cookies.set("bankid_nonce", nonce, options)
    response.cookies.set("bankid_code_verifier", verifier, options)

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start BankID"
    return NextResponse.redirect(
      new URL(`/profile?bankid_error=${encodeURIComponent(message)}`, request.url),
    )
  }
}
