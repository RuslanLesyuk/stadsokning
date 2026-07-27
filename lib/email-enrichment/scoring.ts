import type {
  DiscoveredEmailCandidate,
  EmailSource,
} from "./types"

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "hotmail.com",
  "hotmail.se",
  "hotmail.co.uk",
  "outlook.com",
  "outlook.se",
  "live.com",
  "live.se",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "yahoo.com",
  "yahoo.se",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "zoho.com",
  "aol.com",
  "telia.com",
  "comhem.se",
  "bredband.net",
  "spray.se",
  "passagen.se",
])

const ROLE_PREFIXES = [
  "info",
  "kontakt",
  "contact",
  "office",
  "hello",
  "hej",
  "kundservice",
  "kundtjanst",
  "service",
  "bokning",
  "booking",
  "support",
  "sales",
  "order",
  "orders",
  "offert",
  "quote",
  "reception",
  "admin",
]

const HIGH_VALUE_ROLE_PREFIXES = new Set([
  "info",
  "kontakt",
  "contact",
  "office",
  "hello",
  "hej",
  "kundservice",
  "kundtjanst",
  "service",
  "bokning",
  "booking",
  "offert",
  "quote",
])

const LOW_VALUE_ROLE_PREFIXES = new Set([
  "support",
  "sales",
  "admin",
  "reception",
  "order",
  "orders",
])

const BLOCKED_OR_LOW_QUALITY_PREFIXES = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster",
  "abuse",
  "webmaster",
  "hostmaster",
  "root",
  "test",
  "testing",
  "example",
  "demo",
  "sample",
  "fake",
  "null",
  "undefined",
  "privacy",
  "gdpr",
  "dataskydd",
  "legal",
  "security",
  "billing",
  "invoice",
  "invoices",
  "faktura",
  "fakturor",
]

const RECRUITMENT_PREFIXES = [
  "hr",
  "jobb",
  "job",
  "jobs",
  "career",
  "careers",
  "rekrytering",
  "rekrytera",
  "recruitment",
  "recruiting",
  "ansokan",
  "application",
]

const TECHNICAL_PREFIXES = [
  "dev",
  "developer",
  "development",
  "tech",
  "technical",
  "it",
  "dns",
  "domain",
  "domains",
  "hosting",
  "server",
  "system",
  "systems",
  "api",
  "wordpress",
  "wp",
]

const THIRD_PARTY_DOMAIN_KEYWORDS = [
  "wix",
  "squarespace",
  "wordpress",
  "shopify",
  "webflow",
  "godaddy",
  "one.com",
  "loopia",
  "misshosting",
  "agency",
  "digital",
  "media",
  "marketing",
  "webbyra",
  "webagency",
  "hosting",
]

const CONTACT_PAGE_KEYWORDS = [
  "/kontakt",
  "/kontakta",
  "/contact",
  "/contact-us",
  "/kundservice",
  "/kundtjanst",
  "/customer-service",
  "/support",
  "/bokning",
  "/booking",
  "/offert",
  "/quote",
]

const COMPANY_PAGE_KEYWORDS = [
  "/om-oss",
  "/about",
  "/about-us",
  "/company",
  "/team",
  "/staff",
]

const LOW_VALUE_PAGE_KEYWORDS = [
  "/privacy",
  "/integritet",
  "/legal",
  "/terms",
  "/villkor",
  "/cookie",
  "/cookies",
  "/gdpr",
  "/dataskydd",
  "/impressum",
  "/career",
  "/careers",
  "/jobb",
  "/jobs",
]

const SOURCE_SCORES: Record<EmailSource, number> = {
  mailto: 70,
  json_ld: 55,
  cloudflare: 52,
  javascript: 42,
  contact: 38,
  homepage: 30,
  robots: 15,
  sitemap: 12,
}

function normalizeHostname(hostname: string) {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^www\./, "")
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizeLocalPart(localPart: string) {
  return localPart
    .trim()
    .toLowerCase()
}

function normalizeSourceUrl(sourceUrl: string) {
  return sourceUrl
    .trim()
    .toLowerCase()
}

function getEmailParts(email: string) {
  const normalizedEmail = normalizeEmail(email)

  const separatorIndex =
    normalizedEmail.lastIndexOf("@")

  if (
    separatorIndex <= 0 ||
    separatorIndex ===
      normalizedEmail.length - 1
  ) {
    return null
  }

  return {
    localPart: normalizeLocalPart(
      normalizedEmail.slice(
        0,
        separatorIndex,
      ),
    ),
    domain: normalizeHostname(
      normalizedEmail.slice(
        separatorIndex + 1,
      ),
    ),
  }
}

function getDomainLabels(domain: string) {
  return normalizeHostname(domain)
    .split(".")
    .filter(Boolean)
}

function getComparableBaseDomain(
  domain: string,
) {
  const labels = getDomainLabels(domain)

  if (labels.length <= 2) {
    return labels.join(".")
  }

  const finalLabel =
    labels[labels.length - 1]

  const secondLastLabel =
    labels[labels.length - 2]

  const thirdLastLabel =
    labels[labels.length - 3]

  const commonSecondLevelSuffixes =
    new Set([
      "co.uk",
      "org.uk",
      "me.uk",
      "com.au",
      "net.au",
      "org.au",
      "co.nz",
      "com.br",
      "com.pl",
    ])

  const finalTwoLabels =
    `${secondLastLabel}.${finalLabel}`

  if (
    commonSecondLevelSuffixes.has(
      finalTwoLabels,
    )
  ) {
    return `${thirdLastLabel}.${finalTwoLabels}`
  }

  return finalTwoLabels
}

function domainsMatch(
  emailDomain: string,
  websiteDomain: string,
) {
  const normalizedEmailDomain =
    normalizeHostname(emailDomain)

  const normalizedWebsiteDomain =
    normalizeHostname(websiteDomain)

  return (
    normalizedEmailDomain ===
      normalizedWebsiteDomain ||
    normalizedEmailDomain.endsWith(
      `.${normalizedWebsiteDomain}`,
    ) ||
    normalizedWebsiteDomain.endsWith(
      `.${normalizedEmailDomain}`,
    )
  )
}

function baseDomainsMatch(
  emailDomain: string,
  websiteDomain: string,
) {
  return (
    getComparableBaseDomain(emailDomain) ===
    getComparableBaseDomain(websiteDomain)
  )
}

function startsWithAny(
  value: string,
  prefixes: string[],
) {
  return prefixes.some(
    (prefix) =>
      value === prefix ||
      value.startsWith(`${prefix}.`) ||
      value.startsWith(`${prefix}_`) ||
      value.startsWith(`${prefix}-`) ||
      value.startsWith(`${prefix}+`),
  )
}

function includesAny(
  value: string,
  fragments: string[],
) {
  return fragments.some((fragment) =>
    value.includes(fragment),
  )
}

function looksLikePersonalEmail(
  localPart: string,
) {
  if (
    HIGH_VALUE_ROLE_PREFIXES.has(localPart) ||
    LOW_VALUE_ROLE_PREFIXES.has(localPart)
  ) {
    return false
  }

  if (
    startsWithAny(
      localPart,
      BLOCKED_OR_LOW_QUALITY_PREFIXES,
    ) ||
    startsWithAny(
      localPart,
      RECRUITMENT_PREFIXES,
    ) ||
    startsWithAny(
      localPart,
      TECHNICAL_PREFIXES,
    )
  ) {
    return false
  }

  const cleanedLocalPart = localPart
    .replace(/[0-9]+/g, "")
    .replace(/[._-]+/g, " ")
    .trim()

  const nameParts = cleanedLocalPart
    .split(/\s+/)
    .filter(Boolean)

  if (nameParts.length >= 2) {
    return nameParts.every(
      (part) =>
        part.length >= 2 &&
        /^[a-zåäöæøéü]+$/i.test(part),
    )
  }

  if (
    nameParts.length === 1 &&
    nameParts[0].length >= 4 &&
    nameParts[0].length <= 18 &&
    /^[a-zåäöæøéü]+$/i.test(
      nameParts[0],
    )
  ) {
    return !ROLE_PREFIXES.includes(
      nameParts[0],
    )
  }

  return false
}

function getDomainScore(
  emailDomain: string,
  websiteHostname: string,
) {
  const websiteDomain =
    normalizeHostname(websiteHostname)

  if (
    domainsMatch(
      emailDomain,
      websiteDomain,
    )
  ) {
    return 350
  }

  if (
    baseDomainsMatch(
      emailDomain,
      websiteDomain,
    )
  ) {
    return 280
  }

  if (
    FREE_EMAIL_DOMAINS.has(emailDomain)
  ) {
    return -85
  }

  if (
    includesAny(
      emailDomain,
      THIRD_PARTY_DOMAIN_KEYWORDS,
    )
  ) {
    return -160
  }

  return -120
}

function getLocalPartScore(
  localPart: string,
) {
  let score = 0

  const roleIndex =
    ROLE_PREFIXES.indexOf(localPart)

  if (
    HIGH_VALUE_ROLE_PREFIXES.has(
      localPart,
    )
  ) {
    score += 150

    if (roleIndex >= 0) {
      score -= roleIndex * 2
    }
  } else if (
    LOW_VALUE_ROLE_PREFIXES.has(
      localPart,
    )
  ) {
    score += 70

    if (roleIndex >= 0) {
      score -= roleIndex
    }
  }

  if (
    startsWithAny(
      localPart,
      BLOCKED_OR_LOW_QUALITY_PREFIXES,
    )
  ) {
    score -= 220
  }

  if (
    startsWithAny(
      localPart,
      RECRUITMENT_PREFIXES,
    )
  ) {
    score -= 100
  }

  if (
    startsWithAny(
      localPart,
      TECHNICAL_PREFIXES,
    )
  ) {
    score -= 120
  }

  if (looksLikePersonalEmail(localPart)) {
    score += 20
  }

  if (
    localPart.length < 2 ||
    localPart.length > 50
  ) {
    score -= 30
  }

  if (
    /\d{5,}/.test(localPart)
  ) {
    score -= 35
  }

  if (
    localPart.includes("..") ||
    localPart.includes("--") ||
    localPart.includes("__")
  ) {
    score -= 25
  }

  return score
}

function getSourceScore(
  source: EmailSource,
) {
  return SOURCE_SCORES[source]
}

function getSourceUrlScore(
  sourceUrl: string,
) {
  const normalizedSourceUrl =
    normalizeSourceUrl(sourceUrl)

  let score = 0

  if (
    includesAny(
      normalizedSourceUrl,
      CONTACT_PAGE_KEYWORDS,
    )
  ) {
    score += 75
  }

  if (
    includesAny(
      normalizedSourceUrl,
      COMPANY_PAGE_KEYWORDS,
    )
  ) {
    score += 30
  }

  if (
    includesAny(
      normalizedSourceUrl,
      LOW_VALUE_PAGE_KEYWORDS,
    )
  ) {
    score -= 45
  }

  try {
    const url = new URL(sourceUrl)

    const normalizedPathname =
      url.pathname.replace(/\/+$/, "")

    if (
      normalizedPathname === "" ||
      normalizedPathname === "/"
    ) {
      score += 20
    }
  } catch {
    score -= 10
  }

  return score
}

function getCandidateScore(
  candidate: DiscoveredEmailCandidate,
  websiteHostname: string,
) {
  const emailParts =
    getEmailParts(candidate.email)

  if (!emailParts) {
    return Number.NEGATIVE_INFINITY
  }

  let score = 0

  score += getDomainScore(
    emailParts.domain,
    websiteHostname,
  )

  score += getLocalPartScore(
    emailParts.localPart,
  )

  score += getSourceScore(
    candidate.source,
  )

  score += getSourceUrlScore(
    candidate.sourceUrl,
  )

  /*
   * A general company address on the company's own
   * domain is the strongest CRM lead.
   */
  if (
    domainsMatch(
      emailParts.domain,
      websiteHostname,
    ) &&
    HIGH_VALUE_ROLE_PREFIXES.has(
      emailParts.localPart,
    )
  ) {
    score += 100
  }

  /*
   * Personal addresses are useful when they belong
   * to the company domain, but less reliable when
   * hosted by a free email provider.
   */
  if (
    looksLikePersonalEmail(
      emailParts.localPart,
    )
  ) {
    if (
      domainsMatch(
        emailParts.domain,
        websiteHostname,
      )
    ) {
      score += 30
    } else if (
      FREE_EMAIL_DOMAINS.has(
        emailParts.domain,
      )
    ) {
      score -= 25
    }
  }

  /*
   * A free mailbox can still be legitimate for a
   * small company. A strong contact-page or mailto
   * signal prevents it from being discarded.
   */
  if (
    FREE_EMAIL_DOMAINS.has(
      emailParts.domain,
    ) &&
    (
      candidate.source === "mailto" ||
      includesAny(
        normalizeSourceUrl(
          candidate.sourceUrl,
        ),
        CONTACT_PAGE_KEYWORDS,
      )
    )
  ) {
    score += 45
  }

  return score
}

function compareCandidates(
  first: DiscoveredEmailCandidate,
  second: DiscoveredEmailCandidate,
  websiteHostname: string,
) {
  const scoreDifference =
    getCandidateScore(
      second,
      websiteHostname,
    ) -
    getCandidateScore(
      first,
      websiteHostname,
    )

  if (scoreDifference !== 0) {
    return scoreDifference
  }

  const firstParts =
    getEmailParts(first.email)

  const secondParts =
    getEmailParts(second.email)

  const firstDomainMatches =
    firstParts
      ? domainsMatch(
          firstParts.domain,
          websiteHostname,
        )
      : false

  const secondDomainMatches =
    secondParts
      ? domainsMatch(
          secondParts.domain,
          websiteHostname,
        )
      : false

  if (
    firstDomainMatches !==
    secondDomainMatches
  ) {
    return secondDomainMatches ? 1 : -1
  }

  const emailDifference =
    normalizeEmail(first.email).localeCompare(
      normalizeEmail(second.email),
    )

  if (emailDifference !== 0) {
    return emailDifference
  }

  const sourceDifference =
    first.source.localeCompare(
      second.source,
    )

  if (sourceDifference !== 0) {
    return sourceDifference
  }

  return first.sourceUrl.localeCompare(
    second.sourceUrl,
  )
}

export function chooseBestEmail(
  candidates: DiscoveredEmailCandidate[],
  websiteHostname: string,
) {
  if (!candidates.length) {
    return null
  }

  const validCandidates =
    candidates.filter(
      (candidate) =>
        Number.isFinite(
          getCandidateScore(
            candidate,
            websiteHostname,
          ),
        ),
    )

  if (!validCandidates.length) {
    return null
  }

  return [...validCandidates].sort(
    (first, second) =>
      compareCandidates(
        first,
        second,
        websiteHostname,
      ),
  )[0]
}