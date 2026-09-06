export const ACQUISITION_COOKIE_NAME =
  "clean_jobs_acquisition"

export const ACQUISITION_COOKIE_MAX_AGE =
  60 * 60 * 24 * 30

export type AcquisitionAttribution = {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
  referrer: string
  landingPage: string
}

function cleanText(
  value: unknown,
  maxLength: number,
) {
  return String(value ?? "")
    .trim()
    .slice(0, maxLength)
}

export function normalizeAcquisitionAttribution(
  value: unknown,
): AcquisitionAttribution | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null
  }

  const raw = value as Record<string, unknown>

  const attribution: AcquisitionAttribution = {
    source: cleanText(raw.source, 120),
    medium: cleanText(raw.medium, 120),
    campaign: cleanText(raw.campaign, 180),
    content: cleanText(raw.content, 180),
    term: cleanText(raw.term, 180),
    referrer: cleanText(raw.referrer, 255),
    landingPage: cleanText(
      raw.landingPage,
      500,
    ),
  }

  if (
    !attribution.source &&
    !attribution.medium &&
    !attribution.campaign &&
    !attribution.referrer &&
    !attribution.landingPage
  ) {
    return null
  }

  return attribution
}

export function parseAcquisitionCookie(
  value: string | null | undefined,
): AcquisitionAttribution | null {
  if (!value) {
    return null
  }

  try {
    const decoded = decodeURIComponent(value)
    const parsed = JSON.parse(decoded)

    return normalizeAcquisitionAttribution(
      parsed,
    )
  } catch {
    return null
  }
}
