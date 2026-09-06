"use client"

import { track } from "@vercel/analytics"

import {
  ACQUISITION_COOKIE_MAX_AGE,
  ACQUISITION_COOKIE_NAME,
  type AcquisitionAttribution,
  parseAcquisitionCookie,
} from "@/lib/analytics/acquisition-shared"
import {
  ANALYTICS_CONSENT_COOKIE,
} from "@/lib/privacy/consent"

export type AnalyticsEventProperties =
  Record<string, string | number | boolean>

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>,
    ) => void
    clarity?: (
      command: string,
      value: string,
    ) => void
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null
  }

  const prefix = `${name}=`

  const item = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return item
    ? item.slice(prefix.length)
    : null
}

export function hasAnalyticsConsent() {
  return (
    readCookie(ANALYTICS_CONSENT_COOKIE) ===
    "granted"
  )
}

function writeAttributionCookie(
  attribution: AcquisitionAttribution,
) {
  const secure =
    window.location.protocol === "https:"
      ? "; Secure"
      : ""

  const encoded = encodeURIComponent(
    JSON.stringify(attribution),
  )

  document.cookie =
    `${ACQUISITION_COOKIE_NAME}=${encoded}; ` +
    `Path=/; Max-Age=${ACQUISITION_COOKIE_MAX_AGE}; ` +
    `SameSite=Lax${secure}`
}

export function clearAcquisitionAttribution() {
  if (typeof document === "undefined") {
    return
  }

  const secure =
    window.location.protocol === "https:"
      ? "; Secure"
      : ""

  document.cookie =
    `${ACQUISITION_COOKIE_NAME}=; ` +
    `Path=/; Max-Age=0; SameSite=Lax${secure}`
}

export function getStoredAcquisitionAttribution() {
  return parseAcquisitionCookie(
    readCookie(ACQUISITION_COOKIE_NAME),
  )
}

function normalizeHost(value: string) {
  if (!value) {
    return ""
  }

  try {
    return new URL(value).hostname
      .toLowerCase()
      .replace(/^www\./, "")
      .slice(0, 255)
  } catch {
    return ""
  }
}

function inferReferrerSource(
  referrerHost: string,
) {
  if (!referrerHost) {
    return {
      source: "direct",
      medium: "none",
    }
  }

  if (
    referrerHost === "google.com" ||
    referrerHost.startsWith("google.")
  ) {
    return {
      source: "google",
      medium: "organic",
    }
  }

  if (
    referrerHost === "bing.com" ||
    referrerHost.endsWith(".bing.com")
  ) {
    return {
      source: "bing",
      medium: "organic",
    }
  }

  if (
    referrerHost.includes("facebook.com")
  ) {
    return {
      source: "facebook",
      medium: "referral",
    }
  }

  if (
    referrerHost.includes("instagram.com")
  ) {
    return {
      source: "instagram",
      medium: "referral",
    }
  }

  if (
    referrerHost === "t.co" ||
    referrerHost === "x.com" ||
    referrerHost.endsWith(".x.com")
  ) {
    return {
      source: "x",
      medium: "referral",
    }
  }

  return {
    source: referrerHost,
    medium: "referral",
  }
}

function cleanParam(
  value: string | null,
  maxLength: number,
) {
  return (value || "")
    .trim()
    .slice(0, maxLength)
}

function hasCampaignParams(url: URL) {
  return [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ].some((key) =>
    Boolean(url.searchParams.get(key)),
  )
}

export function captureAcquisitionAttribution(
  href?: string,
  referrer?: string,
) {
  if (
    typeof window === "undefined" ||
    !hasAnalyticsConsent()
  ) {
    return null
  }

  let url: URL

  try {
    url = new URL(
      href || window.location.href,
    )
  } catch {
    return getStoredAcquisitionAttribution()
  }

  const existing =
    getStoredAcquisitionAttribution()

  /*
   * Keep the last non-direct attribution.
   * A later visit without UTM parameters must not
   * replace a paid/organic campaign with "direct".
   */
  if (
    existing &&
    !hasCampaignParams(url)
  ) {
    return existing
  }

  const referrerHost = normalizeHost(
    referrer ?? document.referrer,
  )

  const inferred =
    inferReferrerSource(referrerHost)

  const source =
    cleanParam(
      url.searchParams.get("utm_source"),
      120,
    ) || inferred.source

  const medium =
    cleanParam(
      url.searchParams.get("utm_medium"),
      120,
    ) || inferred.medium

  const attribution: AcquisitionAttribution = {
    source,
    medium,
    campaign: cleanParam(
      url.searchParams.get("utm_campaign"),
      180,
    ),
    content: cleanParam(
      url.searchParams.get("utm_content"),
      180,
    ),
    term: cleanParam(
      url.searchParams.get("utm_term"),
      180,
    ),
    referrer: referrerHost,
    landingPage:
      `${url.pathname}${url.search}`
        .slice(0, 500),
  }

  writeAttributionCookie(attribution)

  return attribution
}

function safeEventValue(
  value: string,
  maxLength = 180,
) {
  return value.slice(0, maxLength)
}

function attributionProperties(
  attribution:
    | AcquisitionAttribution
    | null,
): AnalyticsEventProperties {
  if (!attribution) {
    return {}
  }

  return {
    source: safeEventValue(
      attribution.source,
      120,
    ),
    medium: safeEventValue(
      attribution.medium,
      120,
    ),
    campaign: safeEventValue(
      attribution.campaign,
    ),
    content: safeEventValue(
      attribution.content,
    ),
    term: safeEventValue(
      attribution.term,
    ),
    landing_page: safeEventValue(
      attribution.landingPage,
      500,
    ),
  }
}

export function sendAnalyticsEvent(
  eventName: string,
  properties: AnalyticsEventProperties = {},
) {
  if (
    typeof window === "undefined" ||
    !hasAnalyticsConsent()
  ) {
    return
  }

  const attribution =
    captureAcquisitionAttribution()

  const eventProperties = {
    ...attributionProperties(attribution),
    ...properties,
    path: window.location.pathname,
  }

  try {
    track(eventName, eventProperties)
  } catch (error) {
    console.error(
      "Vercel analytics event error:",
      error,
    )
  }

  try {
    window.gtag?.(
      "event",
      eventName,
      eventProperties,
    )
  } catch (error) {
    console.error(
      "Google analytics event error:",
      error,
    )
  }

  try {
    window.clarity?.("event", eventName)
  } catch (error) {
    console.error(
      "Clarity event error:",
      error,
    )
  }
}
