import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type IdTokenPayload = {
  iss?: string
  aud?: string | string[]
  exp?: number
  nonce?: string
  sub?: string
}

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

function createBasicAuthHeader(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
}

function decodeIdTokenPayload(idToken: string): IdTokenPayload {
  const parts = idToken.split(".")
  if (parts.length !== 3) throw new Error("Invalid BankID ID token")

  try {
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")) as IdTokenPayload
  } catch {
    throw new Error("Invalid BankID ID token payload")
  }
}

function validateTokenCorrelation({
  payload,
  expectedNonce,
  issuer,
  clientId,
}: {
  payload: IdTokenPayload
  expectedNonce: string
  issuer: string
  clientId: string
}) {
  if (!payload.nonce || payload.nonce !== expectedNonce) {
    throw new Error("Invalid BankID nonce")
  }

  if (!payload.iss || payload.iss.replace(/\/$/, "") !== issuer.replace(/\/$/, "")) {
    throw new Error("Invalid BankID issuer")
  }

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
  if (!audiences.includes(clientId)) {
    throw new Error("Invalid BankID audience")
  }

  if (!payload.exp || payload.exp * 1000 <= Date.now()) {
    throw new Error("Expired BankID ID token")
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  try {
    assertBankIdEnvironmentReady()

    const code = requestUrl.searchParams.get("code")
    const state = requestUrl.searchParams.get("state")
    const providerError = requestUrl.searchParams.get("error")

    if (providerError) {
      return NextResponse.redirect(
        new URL(`/profile?bankid_error=${encodeURIComponent(providerError)}`, request.url),
      )
    }

    if (!code || !state) throw new Error("Missing BankID callback parameters")

    const cookieStore = await cookies()
    const expectedState = cookieStore.get("bankid_state")?.value
    const expectedNonce = cookieStore.get("bankid_nonce")?.value
    const codeVerifier = cookieStore.get("bankid_code_verifier")?.value

    if (!expectedState || expectedState !== state) throw new Error("Invalid BankID state")
    if (!expectedNonce) throw new Error("Missing BankID nonce")
    if (!codeVerifier) throw new Error("Missing BankID PKCE verifier")

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/profile", request.url))
    }

    const issuer = getRequiredEnv("BANKID_ISSUER").replace(/\/$/, "")
    const clientId = getRequiredEnv("BANKID_CLIENT_ID")
    const clientSecret = getRequiredEnv("BANKID_CLIENT_SECRET")
    const redirectUri = getRequiredEnv("BANKID_REDIRECT_URI")

    const tokenResponse = await fetch(`${issuer}/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: createBasicAuthHeader(clientId, clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
      cache: "no-store",
    })

    if (!tokenResponse.ok) {
      throw new Error(`BankID token exchange failed (${tokenResponse.status})`)
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string
      id_token?: string
    }

    if (!tokenData.access_token || !tokenData.id_token) {
      throw new Error("Missing BankID tokens")
    }

    const idPayload = decodeIdTokenPayload(tokenData.id_token)
    validateTokenCorrelation({
      payload: idPayload,
      expectedNonce,
      issuer,
      clientId,
    })

    const userInfoResponse = await fetch(`${issuer}/oauth2/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
      cache: "no-store",
    })

    if (!userInfoResponse.ok) {
      throw new Error(`BankID userinfo failed (${userInfoResponse.status})`)
    }

    const userInfo = (await userInfoResponse.json()) as { sub?: string }
    if (!userInfo.sub || (idPayload.sub && userInfo.sub !== idPayload.sub)) {
      throw new Error("BankID subject mismatch")
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        bankid_verified: true,
        bankid_verified_at: new Date().toISOString(),
        bankid_provider: process.env.BANKID_PROVIDER_LABEL || "se_bankid_oidc",
      })
      .eq("id", user.id)

    if (updateError) throw updateError

    const response = NextResponse.redirect(new URL("/profile?bankid_verified=1", request.url))
    response.cookies.delete("bankid_state")
    response.cookies.delete("bankid_nonce")
    response.cookies.delete("bankid_code_verifier")
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : "BankID verification failed"
    const response = NextResponse.redirect(
      new URL(`/profile?bankid_error=${encodeURIComponent(message)}`, request.url),
    )
    response.cookies.delete("bankid_state")
    response.cookies.delete("bankid_nonce")
    response.cookies.delete("bankid_code_verifier")
    return response
  }
}
