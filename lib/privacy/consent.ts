export const ANALYTICS_CONSENT_COOKIE = "clean_jobs_analytics_consent"
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 180

export type AnalyticsConsent = "granted" | "denied"

export function normalizeAnalyticsConsent(
  value: string | null | undefined,
): AnalyticsConsent | null {
  return value === "granted" || value === "denied" ? value : null
}
