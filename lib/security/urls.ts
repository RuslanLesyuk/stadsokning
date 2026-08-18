const DEFAULT_SITE_URL = "https://cleansjob.com"

function normalizeOrigin(value: string | null | undefined) {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return url.origin
  } catch {
    return null
  }
}

function isLocalOrigin(origin: string) {
  try {
    const hostname = new URL(origin).hostname
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  } catch {
    return false
  }
}

export function getConfiguredSiteOrigin() {
  return normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) || DEFAULT_SITE_URL
}

export function resolveTrustedAuthOrigin(candidateOrigin?: string | null) {
  const configured = getConfiguredSiteOrigin()
  const candidate = normalizeOrigin(candidateOrigin)

  if (!candidate) return configured
  if (candidate === configured) return configured

  if (process.env.NODE_ENV !== "production" && isLocalOrigin(candidate)) {
    return candidate
  }

  return configured
}

export function sanitizeInternalRedirect(
  value: string | null | undefined,
  fallback = "/dashboard",
) {
  const raw = (value || "").trim()
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return fallback

  try {
    const parsed = new URL(raw, "https://clean-jobs.invalid")
    if (parsed.origin !== "https://clean-jobs.invalid") return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}

export function getAuthCallbackUrl({
  origin,
  next = "/dashboard",
}: {
  origin?: string | null
  next?: string | null
}) {
  const trustedOrigin = resolveTrustedAuthOrigin(origin)
  const safeNext = sanitizeInternalRedirect(next)
  const url = new URL("/auth/callback", trustedOrigin)
  url.searchParams.set("next", safeNext)
  return url.toString()
}
