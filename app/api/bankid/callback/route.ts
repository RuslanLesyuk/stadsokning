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

function createBasicAuthHeader(clientId: string, clientSecret: string) {
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
  return `Basic ${credentials}`
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  try {
    const code = requestUrl.searchParams.get("code")
    const state = requestUrl.searchParams.get("state")
    const error = requestUrl.searchParams.get("error")

    if (error) {
      return NextResponse.redirect(
        new URL(`/profile?bankid_error=${encodeURIComponent(error)}`, request.url),
      )
    }

    if (!code || !state) {
      throw new Error("Missing BankID callback parameters")
    }

    const expectedState = request.headers
      .get("cookie")
      ?.split(";")
      .map((item) => item.trim())
      .find((item) => item.startsWith("bankid_state="))
      ?.split("=")[1]

    if (!expectedState || expectedState !== state) {
      throw new Error("Invalid BankID state")
    }

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/profile", request.url))
    }

    const issuer = getRequiredEnv("BANKID_ISSUER")
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
      }),
      cache: "no-store",
    })

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text()
      throw new Error(`BankID token exchange failed: ${text}`)
    }

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      throw new Error("Missing BankID access token")
    }

    const userInfoResponse = await fetch(`${issuer}/oauth2/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    })

    if (!userInfoResponse.ok) {
      const text = await userInfoResponse.text()
      throw new Error(`BankID userinfo failed: ${text}`)
    }

    await userInfoResponse.json()

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        bankid_verified: true,
        bankid_verified_at: new Date().toISOString(),
        bankid_provider: "idura_se_bankid_test",
      })
      .eq("id", user.id)

    if (updateError) {
      throw updateError
    }

    const response = NextResponse.redirect(
      new URL("/profile?bankid_verified=1", request.url),
    )

    response.cookies.delete("bankid_state")
    response.cookies.delete("bankid_nonce")

    return response
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "BankID verification failed"

    return NextResponse.redirect(
      new URL(`/profile?bankid_error=${encodeURIComponent(message)}`, request.url),
    )
  }
}