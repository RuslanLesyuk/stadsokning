import { CONTACT_LINK_WORDS } from "./constants"
import { decodeHtmlEntities } from "./email-parser"

const SITEMAP_PAGE_WORDS = [
  ...CONTACT_LINK_WORDS,
  "about",
  "about-us",
  "company",
  "team",
  "staff",
  "employees",
  "people",
  "organisation",
  "organization",
  "privacy",
  "integritet",
  "policy",
  "legal",
  "impressum",
  "support",
  "help",
  "customer-service",
  "customer-support",
  "kundservice",
  "kundtjanst",
  "kundtjänst",
  "service",
  "faq",
  "contact-us",
  "contact-support",
  "kontakta-oss",
  "kontakt-oss",
  "om-oss",
]

const ROBOTS_DISCOVERY_WORDS = [
  "kontakt",
  "kontakta",
  "contact",
  "contact-us",
  "contact-support",
  "support",
  "customer-service",
  "customer-support",
  "kundservice",
  "kundtjanst",
  "kundtjänst",
  "help",
  "helpdesk",
  "faq",
  "about",
  "about-us",
  "om-oss",
  "company",
  "team",
  "staff",
  "employees",
  "people",
  "organisation",
  "organization",
  "privacy",
  "privacy-policy",
  "integritet",
  "integritetspolicy",
  "legal",
  "terms",
  "villkor",
  "impressum",
]

export type SitemapEntries = {
  pageUrls: string[]
  sitemapUrls: string[]
}

export type RobotsEntries = {
  pageUrls: string[]
  sitemapUrls: string[]
  disallowedPaths: string[]
}

function normalizeHostname(hostname: string) {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/^www\./, "")
}

function isSameWebsite(
  hostname: string,
  rootHostname: string,
) {
  const normalizedHostname =
    normalizeHostname(hostname)

  const normalizedRootHostname =
    normalizeHostname(rootHostname)

  return (
    normalizedHostname === normalizedRootHostname ||
    normalizedHostname.endsWith(
      `.${normalizedRootHostname}`,
    ) ||
    normalizedRootHostname.endsWith(
      `.${normalizedHostname}`,
    )
  )
}

function normalizeDiscoveredUrl(url: URL) {
  url.hash = ""

  if (
    url.pathname.length > 1 &&
    url.pathname.endsWith("/")
  ) {
    url.pathname = url.pathname.replace(
      /\/+$/,
      "",
    )
  }

  return url.toString()
}

function isSupportedWebUrl(url: URL) {
  return (
    url.protocol === "http:" ||
    url.protocol === "https:"
  )
}

function getSearchableUrlValue(url: URL) {
  return [
    url.pathname,
    url.search,
  ]
    .join(" ")
    .toLowerCase()
}

function isRelevantPageUrl(url: URL) {
  const searchableValue =
    getSearchableUrlValue(url)

  return SITEMAP_PAGE_WORDS.some((word) =>
    searchableValue.includes(
      word.toLowerCase(),
    ),
  )
}

function isRelevantRobotsPath(path: string) {
  const normalizedPath = decodeHtmlEntities(path)
    .trim()
    .toLowerCase()

  if (
    !normalizedPath ||
    normalizedPath === "/" ||
    normalizedPath === "*"
  ) {
    return false
  }

  return ROBOTS_DISCOVERY_WORDS.some((word) =>
    normalizedPath.includes(word),
  )
}

function normalizeRobotsPath(value: string) {
  const withoutComment = value
    .split("#")[0]
    .trim()

  if (!withoutComment) {
    return null
  }

  if (
    withoutComment.startsWith("http://") ||
    withoutComment.startsWith("https://")
  ) {
    try {
      const url = new URL(withoutComment)

      return `${url.pathname}${url.search}`
    } catch {
      return null
    }
  }

  if (!withoutComment.startsWith("/")) {
    return `/${withoutComment}`
  }

  return withoutComment
}

function removeRobotsPatternSyntax(path: string) {
  const wildcardIndex = path.indexOf("*")
  const endAnchorIndex = path.indexOf("$")

  let cutIndex = path.length

  if (wildcardIndex >= 0) {
    cutIndex = Math.min(cutIndex, wildcardIndex)
  }

  if (endAnchorIndex >= 0) {
    cutIndex = Math.min(cutIndex, endAnchorIndex)
  }

  const cleanedPath = path
    .slice(0, cutIndex)
    .trim()

  if (
    !cleanedPath ||
    cleanedPath === "/"
  ) {
    return null
  }

  return cleanedPath
}

function calculatePagePriority(url: URL) {
  const searchableValue =
    getSearchableUrlValue(url)

  let score = 0

  for (const word of SITEMAP_PAGE_WORDS) {
    if (
      searchableValue.includes(
        word.toLowerCase(),
      )
    ) {
      score += 10
    }
  }

  if (
    searchableValue.includes("kontakt") ||
    searchableValue.includes("contact")
  ) {
    score += 100
  }

  if (
    searchableValue.includes("support") ||
    searchableValue.includes(
      "customer-service",
    ) ||
    searchableValue.includes("kundservice")
  ) {
    score += 80
  }

  if (
    searchableValue.includes("help") ||
    searchableValue.includes("faq")
  ) {
    score += 65
  }

  if (
    searchableValue.includes("about") ||
    searchableValue.includes("om-oss") ||
    searchableValue.includes("company")
  ) {
    score += 50
  }

  if (
    searchableValue.includes("team") ||
    searchableValue.includes("staff") ||
    searchableValue.includes("people")
  ) {
    score += 40
  }

  if (
    searchableValue.includes("privacy") ||
    searchableValue.includes("integritet") ||
    searchableValue.includes("legal") ||
    searchableValue.includes("impressum")
  ) {
    score += 20
  }

  const pathDepth = url.pathname
    .split("/")
    .filter(Boolean).length

  score -= pathDepth

  return score
}

export function extractContactLinks(
  html: string,
  pageUrl: URL,
  rootHostname: string,
) {
  const links = new Set<string>()

  const anchorPattern =
    /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi

  for (const match of html.matchAll(anchorPattern)) {
    const href = decodeHtmlEntities(
      match[1] || "",
    ).trim()

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:") ||
      href.startsWith("data:")
    ) {
      continue
    }

    let url: URL

    try {
      url = new URL(href, pageUrl)
    } catch {
      continue
    }

    if (!isSupportedWebUrl(url)) {
      continue
    }

    if (
      !isSameWebsite(
        url.hostname,
        rootHostname,
      )
    ) {
      continue
    }

    if (!isRelevantPageUrl(url)) {
      continue
    }

    links.add(normalizeDiscoveredUrl(url))
  }

  return Array.from(links)
}

export function extractSitemapEntries(
  xml: string,
  sitemapUrl: URL,
  rootHostname: string,
): SitemapEntries {
  const pageUrls = new Set<string>()
  const sitemapUrls = new Set<string>()

  const locationPattern =
    /<loc\b[^>]*>([\s\S]*?)<\/loc>/gi

  for (const match of xml.matchAll(locationPattern)) {
    const rawLocation = decodeHtmlEntities(
      match[1] || "",
    )
      .replace(
        /<!\[CDATA\[([\s\S]*?)\]\]>/g,
        "$1",
      )
      .trim()

    if (!rawLocation) {
      continue
    }

    let url: URL

    try {
      url = new URL(
        rawLocation,
        sitemapUrl,
      )
    } catch {
      continue
    }

    if (!isSupportedWebUrl(url)) {
      continue
    }

    if (
      !isSameWebsite(
        url.hostname,
        rootHostname,
      )
    ) {
      continue
    }

    const normalizedUrl =
      normalizeDiscoveredUrl(url)

    const searchableValue =
      getSearchableUrlValue(url)

    if (
      searchableValue.includes("sitemap") ||
      searchableValue.endsWith(".xml")
    ) {
      sitemapUrls.add(normalizedUrl)
      continue
    }

    if (isRelevantPageUrl(url)) {
      pageUrls.add(normalizedUrl)
    }
  }

  return {
    pageUrls: Array.from(pageUrls),
    sitemapUrls: Array.from(sitemapUrls),
  }
}

export function extractRobotsEntries(
  robotsText: string,
  robotsUrl: URL,
  rootHostname: string,
): RobotsEntries {
  const pageUrls = new Set<string>()
  const sitemapUrls = new Set<string>()
  const disallowedPaths = new Set<string>()

  let appliesToCleanJobsBot = false
  let appliesToAllBots = false
  let hasSpecificUserAgentGroup = false

  const lines = robotsText.split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (
      !line ||
      line.startsWith("#")
    ) {
      continue
    }

    const separatorIndex = line.indexOf(":")

    if (separatorIndex <= 0) {
      continue
    }

    const directive = line
      .slice(0, separatorIndex)
      .trim()
      .toLowerCase()

    const rawValue = line
      .slice(separatorIndex + 1)
      .split("#")[0]
      .trim()

    if (!rawValue) {
      continue
    }

    if (directive === "user-agent") {
      const userAgent = rawValue.toLowerCase()

      appliesToCleanJobsBot =
        userAgent.includes(
          "cleanjobsleadenrichmentbot",
        )

      appliesToAllBots = userAgent === "*"

      if (appliesToCleanJobsBot) {
        hasSpecificUserAgentGroup = true
      }

      continue
    }

    if (directive === "sitemap") {
      let sitemapUrl: URL

      try {
        sitemapUrl = new URL(
          decodeHtmlEntities(rawValue),
          robotsUrl,
        )
      } catch {
        continue
      }

      if (
        !isSupportedWebUrl(sitemapUrl) ||
        !isSameWebsite(
          sitemapUrl.hostname,
          rootHostname,
        )
      ) {
        continue
      }

      sitemapUrls.add(
        normalizeDiscoveredUrl(sitemapUrl),
      )

      continue
    }

    const groupApplies =
      appliesToCleanJobsBot ||
      (!hasSpecificUserAgentGroup &&
        appliesToAllBots)

    if (!groupApplies) {
      continue
    }

    if (
      directive !== "allow" &&
      directive !== "disallow"
    ) {
      continue
    }

    const normalizedPath =
      normalizeRobotsPath(rawValue)

    if (!normalizedPath) {
      continue
    }

    if (directive === "disallow") {
      disallowedPaths.add(normalizedPath)
      continue
    }

    if (!isRelevantRobotsPath(normalizedPath)) {
      continue
    }

    const crawlablePath =
      removeRobotsPatternSyntax(normalizedPath)

    if (!crawlablePath) {
      continue
    }

    let discoveredUrl: URL

    try {
      discoveredUrl = new URL(
        crawlablePath,
        robotsUrl,
      )
    } catch {
      continue
    }

    if (
      !isSupportedWebUrl(discoveredUrl) ||
      !isSameWebsite(
        discoveredUrl.hostname,
        rootHostname,
      )
    ) {
      continue
    }

    pageUrls.add(
      normalizeDiscoveredUrl(discoveredUrl),
    )
  }

  return {
    pageUrls: Array.from(pageUrls),
    sitemapUrls: Array.from(sitemapUrls),
    disallowedPaths: Array.from(
      disallowedPaths,
    ),
  }
}

function normalizePathForRobotsComparison(
  url: URL,
) {
  return `${url.pathname}${url.search}`
}

function robotsRuleMatches(
  path: string,
  rule: string,
) {
  const normalizedRule = rule.trim()

  if (!normalizedRule) {
    return false
  }

  const endAnchored =
    normalizedRule.endsWith("$")

  const ruleWithoutAnchor = endAnchored
    ? normalizedRule.slice(0, -1)
    : normalizedRule

  const escapedRule = ruleWithoutAnchor
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*")

  try {
    const pattern = new RegExp(
      `^${escapedRule}${endAnchored ? "$" : ""}`,
    )

    return pattern.test(path)
  } catch {
    return path.startsWith(ruleWithoutAnchor)
  }
}

export function isUrlAllowedByRobots(
  url: URL,
  disallowedPaths: string[],
) {
  const path =
    normalizePathForRobotsComparison(url)

  return !disallowedPaths.some((rule) =>
    robotsRuleMatches(path, rule),
  )
}

export function prioritizePageUrls(
  urls: string[],
  limit: number,
) {
  const uniqueUrls = Array.from(
    new Set(urls),
  )

  return uniqueUrls
    .map((urlValue) => {
      try {
        const url = new URL(urlValue)

        return {
          url: normalizeDiscoveredUrl(url),
          score: calculatePagePriority(url),
        }
      } catch {
        return null
      }
    })
    .filter(
      (
        item,
      ): item is {
        url: string
        score: number
      } => item !== null,
    )
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return left.url.localeCompare(right.url)
    })
    .slice(0, Math.max(0, limit))
    .map((item) => item.url)
}