export const JOB_TITLE_MAX_LENGTH = 120
export const JOB_DESCRIPTION_MAX_LENGTH = 5000
export const JOB_CITY_MAX_LENGTH = 120
export const JOB_ADDRESS_MAX_LENGTH = 300
export const JOB_BUDGET_MAX = 10_000_000

export const SUPPORTED_JOB_TYPES = new Set([
  "home_cleaning",
  "office_cleaning",
])

export const SUPPORTED_PROPERTY_TYPES =
  new Set([
    "apartment",
    "house",
    "office",
    "other",
    "",
  ])

export type JobContentInput = {
  title: string | null | undefined
  description: string | null | undefined
  address?: string | null | undefined
  budget?: number | null
}

export type JobContentAnalysis = {
  blocked: boolean
  score: number
  reasons: string[]
  hasContactDetails: boolean
  hasSpamSignals: boolean
}

function clean(
  value: string | null | undefined,
) {
  return String(value || "").trim()
}

const emailPattern =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i

const urlPattern =
  /\b(?:https?:\/\/|www\.)\S+/i

/*
 * Phone detection intentionally avoids treating every long numeric token as
 * a phone number. That caused false positives for timestamps/IDs in QA.
 *
 * Strong signals:
 * - international number beginning with +
 * - Swedish-style number beginning with 0
 * - number explicitly introduced by phone/contact wording
 */
const phonePatterns: RegExp[] = [
  /\+\d[\d\s().-]{6,}\d/,
  /\b0\d(?:[\s().-]*\d){7,10}\b/,
  /\b(?:tel|telefon|phone|mobile|mobil|ring|sms|kontakt|contact)\s*[:\-]?\s*\+?\d(?:[\s().-]*\d){6,14}\b/i,
]

const externalMessengerPattern =
  /\b(?:whatsapp|telegram|signal)\b/i

const cryptoPattern =
  /\b(?:crypto|bitcoin|btc|usdt|wallet|binance)\b/i

const advancePaymentPattern =
  /\b(?:pay\s*first|payment\s*before|deposit\s*first|advance\s*payment|förskottsbetalning)\b/i

const identityPattern =
  /\b(?:bankid|bank\s*id|passport|id\s*card|personnummer)\b/i

const scamWordingPattern =
  /\b(?:make\s*money\s*fast|easy\s*money|guaranteed\s*income|work\s*from\s*home)\b/i

const repeatedCharactersPattern =
  /(.)\1{7,}/

export function containsPublicContactDetails(
  value: string | null | undefined,
) {
  const text = clean(value)

  if (!text) return false

  return (
    emailPattern.test(text) ||
    urlPattern.test(text) ||
    phonePatterns.some((pattern) =>
      pattern.test(text),
    )
  )
}

export function containsPublicSpamSignals(
  value: string | null | undefined,
) {
  const text = clean(value)

  if (!text) return false

  return (
    repeatedCharactersPattern.test(text) ||
    externalMessengerPattern.test(text) ||
    cryptoPattern.test(text) ||
    advancePaymentPattern.test(text) ||
    identityPattern.test(text) ||
    scamWordingPattern.test(text)
  )
}

export function redactPublicJobText(
  value: string | null | undefined,
) {
  let text = clean(value)

  if (!text) {
    return ""
  }

  text = text
    .replace(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
      "[contact hidden]",
    )
    .replace(
      /\b(?:https?:\/\/|www\.)\S+/gi,
      "[link hidden]",
    )

  for (const pattern of [
    /\+\d[\d\s().-]{6,}\d/g,
    /\b0\d(?:[\s().-]*\d){7,10}\b/g,
    /\b(?:tel|telefon|phone|mobile|mobil|ring|sms|kontakt|contact)\s*[:\-]?\s*\+?\d(?:[\s().-]*\d){6,14}\b/gi,
  ]) {
    text = text.replace(
      pattern,
      "[contact hidden]",
    )
  }

  return text
    .replace(/\s{2,}/g, " ")
    .trim()
}

export function analyzeJobContentForSubmission({
  title,
  description,
  address,
  budget,
}: JobContentInput): JobContentAnalysis {
  const safeTitle = clean(title)
  const safeDescription =
    clean(description)
  const safeAddress = clean(address)
  const text =
    `${safeTitle} ${safeDescription} ${safeAddress}`

  const reasons: string[] = []
  let score = 0

  if (
    externalMessengerPattern.test(text)
  ) {
    score += 2
    reasons.push(
      "mentions_external_messenger",
    )
  }

  if (cryptoPattern.test(text)) {
    score += 4
    reasons.push("mentions_crypto")
  }

  if (
    advancePaymentPattern.test(text)
  ) {
    score += 4
    reasons.push(
      "requests_advance_payment",
    )
  }

  if (identityPattern.test(text)) {
    score += 3
    reasons.push(
      "requests_sensitive_identity",
    )
  }

  if (scamWordingPattern.test(text)) {
    score += 3
    reasons.push("scam_wording")
  }

  if (urlPattern.test(text)) {
    score += 2
    reasons.push("contains_external_link")
  }

  if (emailPattern.test(text)) {
    score += 2
    reasons.push("contains_email")
  }

  if (
    phonePatterns.some((pattern) =>
      pattern.test(text),
    )
  ) {
    score += 2
    reasons.push("contains_phone")
  }

  if (
    safeDescription.length > 0 &&
    safeDescription.length < 15
  ) {
    score += 1
    reasons.push(
      "description_very_short",
    )
  }

  if (
    safeTitle.length >
    JOB_TITLE_MAX_LENGTH
  ) {
    score += 1
    reasons.push("title_too_long")
  }

  if (
    budget !== null &&
    budget !== undefined &&
    budget > 50_000
  ) {
    score += 2
    reasons.push(
      "unusually_high_budget",
    )
  }

  if (
    repeatedCharactersPattern.test(
      text,
    )
  ) {
    score += 2
    reasons.push(
      "repeated_spam_characters",
    )
  }

  return {
    blocked: score >= 6,
    score,
    reasons,
    hasContactDetails:
      containsPublicContactDetails(text),
    hasSpamSignals:
      containsPublicSpamSignals(text),
  }
}
