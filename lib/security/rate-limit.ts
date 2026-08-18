import { createHmac } from "node:crypto"
import { headers } from "next/headers"

import { createAdminClient } from "@/lib/supabase-admin"

type RateLimitOptions = {
  action: string
  identity?: string | null
  identityLimit?: number
  ipLimit?: number
  windowSeconds?: number
}

type RateLimitResult = {
  allowed: boolean
}

function getPepper() {
  return (
    process.env.SECURITY_RATE_LIMIT_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "clean-jobs-rate-limit"
  )
}

function hashKey(value: string) {
  return createHmac("sha256", getPepper()).update(value).digest("hex")
}

function normalizeClientIp(value: string | null) {
  if (!value) return null
  const first = value.split(",")[0]?.trim()
  if (!first || first.length > 100) return null
  return first
}

async function getClientIp() {
  const store = await headers()
  return (
    normalizeClientIp(store.get("cf-connecting-ip")) ||
    normalizeClientIp(store.get("x-real-ip")) ||
    normalizeClientIp(store.get("x-forwarded-for"))
  )
}

async function consumeBucket({
  action,
  key,
  limit,
  windowSeconds,
}: {
  action: string
  key: string
  limit: number
  windowSeconds: number
}) {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin.rpc("consume_security_rate_limit", {
      p_action: action,
      p_key_hash: hashKey(key),
      p_limit: limit,
      p_window_seconds: windowSeconds,
    })

    if (error) {
      console.error("Security rate-limit RPC error:", error)
      return true
    }

    return data !== false
  } catch (error) {
    // Rate limiting must never turn a transient database issue into a full
    // public-form outage. Fail open and log the error for Admin Automation.
    console.error("Security rate-limit unexpected error:", error)
    return true
  }
}

export async function checkActionRateLimit({
  action,
  identity,
  identityLimit = 5,
  ipLimit = 20,
  windowSeconds = 15 * 60,
}: RateLimitOptions): Promise<RateLimitResult> {
  const normalizedAction = action.trim().slice(0, 80)
  if (!normalizedAction) return { allowed: true }

  const checks: Promise<boolean>[] = []
  const normalizedIdentity = identity?.trim().toLowerCase().slice(0, 500)

  if (normalizedIdentity) {
    checks.push(
      consumeBucket({
        action: normalizedAction,
        key: `identity:${normalizedIdentity}`,
        limit: Math.max(1, identityLimit),
        windowSeconds: Math.max(60, windowSeconds),
      }),
    )
  }

  const ip = await getClientIp()
  if (ip) {
    checks.push(
      consumeBucket({
        action: normalizedAction,
        key: `ip:${ip}`,
        limit: Math.max(1, ipLimit),
        windowSeconds: Math.max(60, windowSeconds),
      }),
    )
  }

  if (checks.length === 0) return { allowed: true }
  const results = await Promise.all(checks)
  return { allowed: results.every(Boolean) }
}
