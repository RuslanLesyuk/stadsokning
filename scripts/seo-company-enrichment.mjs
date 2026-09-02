import fs from "node:fs"
import path from "node:path"
import dns from "node:dns/promises"
import net from "node:net"

import { createClient } from "@supabase/supabase-js"

const USER_AGENT =
  "CleanJobsCatalogEnrichmentBot/1.0 (+https://cleansjob.com)"

const DEFAULT_LIMIT = 25
const DEFAULT_CONCURRENCY = 3
const DEFAULT_PAGE_LIMIT = 7
const DEFAULT_TIMEOUT_MS = 8000
const MAX_HTML_BYTES = 1_500_000
const APPLY_CONFIRMATION = "SEO_COMPANY_ENRICHMENT"
const MIN_SERVICE_SCORE = 30

const SERVICE_DEFINITIONS = [
  {
    label: "Hemstädning",
    slug: "hemstadning",
    phrases: [
      "hemstädning",
      "hemstadning",
      "hemstäd",
      "hemstad",
      "veckostädning",
      "veckostadning",
      "abonnemangsstädning",
      "abonnemangsstadning",
    ],
  },
  {
    label: "Flyttstädning",
    slug: "flyttstadning",
    phrases: [
      "flyttstädning",
      "flyttstadning",
      "flyttstäd",
      "flyttstad",
    ],
  },
  {
    label: "Kontorsstädning",
    slug: "kontorsstadning",
    phrases: [
      "kontorsstädning",
      "kontorsstadning",
      "kontorsstäd",
      "kontorsstad",
      "företagsstädning",
      "foretagsstadning",
      "arbetsplatsstädning",
      "arbetsplatsstadning",
    ],
  },
  {
    label: "Fönsterputs",
    slug: "fonsterputs",
    phrases: [
      "fönsterputs",
      "fonsterputs",
      "fönsterputsning",
      "fonsterputsning",
      "fönstertvätt",
      "fonstertvatt",
    ],
  },
  {
    label: "Trappstädning",
    slug: "trappstadning",
    phrases: [
      "trappstädning",
      "trappstadning",
      "trapphusstädning",
      "trapphusstadning",
      "trappstäd",
      "trappstad",
    ],
  },
  {
    label: "Byggstädning",
    slug: "byggstadning",
    phrases: [
      "byggstädning",
      "byggstadning",
      "byggstäd",
      "byggstad",
      "byggstäd efter renovering",
      "byggstad efter renovering",
      "slutstädning efter bygg",
      "slutstadning efter bygg",
    ],
  },
  {
    label: "Storstädning",
    slug: "storstadning",
    phrases: [
      "storstädning",
      "storstadning",
      "storstäd",
      "storstad",
      "grundstädning",
      "grundstadning",
    ],
  },
  {
    label: "Dödsbostädning",
    slug: "dodsbo-stadning",
    phrases: [
      "dödsbostädning",
      "dodsbo stadning",
      "dödsbo städning",
      "dodsboostadning",
      "dödsbostäd",
      "dodsbo stad",
    ],
  },
  {
    label: "Lokalstädning",
    slug: "lokalstadning",
    phrases: [
      "lokalstädning",
      "lokalstadning",
      "lokalstäd",
      "lokalstad",
    ],
  },
  {
    label: "Butiksstädning",
    slug: "butiksstadning",
    phrases: [
      "butiksstädning",
      "butiksstadning",
      "butiksstäd",
      "butiksstad",
    ],
  },
  {
    label: "Industristädning",
    slug: "industristadning",
    phrases: [
      "industristädning",
      "industristadning",
      "industristäd",
      "industristad",
    ],
  },
  {
    label: "Hotellstädning",
    slug: "hotellstadning",
    phrases: [
      "hotellstädning",
      "hotellstadning",
      "hotellstäd",
      "hotellstad",
    ],
  },
  {
    label: "Restaurangstädning",
    slug: "restaurangstadning",
    phrases: [
      "restaurangstädning",
      "restaurangstadning",
      "restaurangstäd",
      "restaurangstad",
    ],
  },
  {
    label: "Golvvård",
    slug: "golvvard",
    phrases: [
      "golvvård",
      "golvvard",
      "golvpolering",
      "golvboning",
    ],
  },
  {
    label: "Sanering",
    slug: "sanering",
    phrases: [
      "sanering",
      "specialsanering",
      "luktsanering",
      "nikotinsanering",
    ],
  },
]

const COMMON_DISCOVERY_PATHS = [
  "/tjanster",
  "/tjänster",
  "/services",
  "/stadning",
  "/städning",
  "/hemstadning",
  "/hemstädning",
  "/flyttstadning",
  "/flyttstädning",
  "/kontorsstadning",
  "/kontorsstädning",
  "/fonsterputs",
  "/fönsterputs",
  "/om-oss",
  "/about",
]

const DISCOVERY_HINTS = [
  "tjanst",
  "tjänst",
  "service",
  "stad",
  "städ",
  "puts",
  "rut",
  "om-oss",
  "about",
]

function parseArgs(argv) {
  const args = {
    apply: false,
    confirm: "",
    city: "",
    limit: DEFAULT_LIMIT,
    concurrency: DEFAULT_CONCURRENCY,
    pageLimit: DEFAULT_PAGE_LIMIT,
    timeoutMs: DEFAULT_TIMEOUT_MS,
    outputDir: "tmp/seo-company-enrichment",
    includeClaimed: false,
    includeVerified: false,
    selfTest: false,
  }

  for (const raw of argv) {
    if (raw === "--apply") {
      args.apply = true
      continue
    }

    if (raw === "--include-claimed") {
      args.includeClaimed = true
      continue
    }

    if (raw === "--include-verified") {
      args.includeVerified = true
      continue
    }

    if (raw === "--self-test") {
      args.selfTest = true
      continue
    }

    const [key, ...rest] = raw.split("=")
    const value = rest.join("=")

    switch (key) {
      case "--confirm":
        args.confirm = value
        break
      case "--city":
        args.city = value.trim()
        break
      case "--limit":
        args.limit = clampInteger(value, 1, 5000, DEFAULT_LIMIT)
        break
      case "--concurrency":
        args.concurrency = clampInteger(value, 1, 8, DEFAULT_CONCURRENCY)
        break
      case "--page-limit":
        args.pageLimit = clampInteger(value, 1, 12, DEFAULT_PAGE_LIMIT)
        break
      case "--timeout-ms":
        args.timeoutMs = clampInteger(value, 2000, 20000, DEFAULT_TIMEOUT_MS)
        break
      case "--output":
        args.outputDir = value.trim() || args.outputDir
        break
    }
  }

  return args
}

function clampInteger(value, minimum, maximum, fallback) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, Math.floor(parsed)))
}

function cleanWhitespace(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
}

function normalizeForSearch(value) {
  return cleanWhitespace(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/æ/g, "a")
    .replace(/ø/g, "o")
}

function decodeBasicEntities(value) {
  return String(value || "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#160;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replace(/&#(\d+);/g, (_, raw) => {
      const code = Number(raw)
      return Number.isFinite(code) ? String.fromCodePoint(code) : " "
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, raw) => {
      const code = Number.parseInt(raw, 16)
      return Number.isFinite(code) ? String.fromCodePoint(code) : " "
    })
}

function stripHtml(html) {
  return cleanWhitespace(
    decodeBasicEntities(
      String(html || "")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " "),
    ),
  )
}

function extractProminentText(html) {
  const values = []

  const patterns = [
    /<title\b[^>]*>([\s\S]*?)<\/title>/gi,
    /<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi,
    /<a\b[^>]*>([\s\S]*?)<\/a>/gi,
  ]

  for (const pattern of patterns) {
    for (const match of String(html || "").matchAll(pattern)) {
      values.push(stripHtml(match[1] || ""))
    }
  }

  return cleanWhitespace(values.join(" "))
}

function normalizeHostname(hostname) {
  return String(hostname || "")
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/^www\./, "")
}

function sameWebsite(first, second) {
  const a = normalizeHostname(first)
  const b = normalizeHostname(second)

  return (
    a === b ||
    a.endsWith(`.${b}`) ||
    b.endsWith(`.${a}`)
  )
}

function normalizeWebsite(value) {
  const raw = String(value || "").trim()

  if (!raw) {
    return null
  }

  try {
    const url = new URL(
      /^https?:\/\//i.test(raw) ? raw : `https://${raw}`,
    )

    if (!["http:", "https:"].includes(url.protocol)) {
      return null
    }

    url.hash = ""
    return url
  } catch {
    return null
  }
}

function isPrivateIpv4(address) {
  const parts = String(address).split(".").map(Number)

  if (
    parts.length !== 4 ||
    parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)
  ) {
    return true
  }

  const [first, second] = parts

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  )
}

function isPrivateIpv6(address) {
  const value = String(address).toLowerCase()

  return (
    value === "::" ||
    value === "::1" ||
    value.startsWith("fc") ||
    value.startsWith("fd") ||
    value.startsWith("fe8") ||
    value.startsWith("fe9") ||
    value.startsWith("fea") ||
    value.startsWith("feb") ||
    value.startsWith("::ffff:127.") ||
    value.startsWith("::ffff:10.") ||
    value.startsWith("::ffff:192.168.")
  )
}

function isPrivateIp(address) {
  const version = net.isIP(address)

  if (version === 4) return isPrivateIpv4(address)
  if (version === 6) return isPrivateIpv6(address)

  return true
}

async function assertPublicHostname(hostname) {
  const normalized = normalizeHostname(hostname)

  if (
    !normalized ||
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  ) {
    throw new Error("Blocked website hostname.")
  }

  if (net.isIP(normalized)) {
    if (isPrivateIp(normalized)) {
      throw new Error("Blocked private IP address.")
    }

    return
  }

  const addresses = await dns.lookup(normalized, {
    all: true,
    verbatim: true,
  })

  if (!addresses.length) {
    throw new Error("Website hostname has no IP address.")
  }

  for (const item of addresses) {
    if (isPrivateIp(item.address)) {
      throw new Error("Website resolves to a blocked private IP address.")
    }
  }
}

function normalizeQueueUrl(url) {
  const clone = new URL(url.toString())
  clone.hash = ""

  if (clone.pathname.length > 1) {
    clone.pathname = clone.pathname.replace(/\/+$/, "")
  }

  return clone.toString()
}

function parseRobotsDisallow(text) {
  const rules = []
  let applies = false

  for (const rawLine of String(text || "").split(/\r?\n/)) {
    const line = rawLine.split("#")[0].trim()
    if (!line) continue

    const index = line.indexOf(":")
    if (index <= 0) continue

    const directive = line.slice(0, index).trim().toLowerCase()
    const value = line.slice(index + 1).trim()

    if (directive === "user-agent") {
      applies = value === "*" || value.toLowerCase().includes("cleanjobs")
      continue
    }

    if (applies && directive === "disallow" && value && value !== "/") {
      rules.push(value)
    }
  }

  return rules
}

function robotsAllows(url, disallowRules) {
  const pathname = `${url.pathname}${url.search}`

  return !disallowRules.some((rule) => {
    const plainRule = String(rule)
      .replace(/\*/g, "")
      .replace(/\$/g, "")
      .trim()

    return plainRule && pathname.startsWith(plainRule)
  })
}

async function fetchText(url, {
  timeoutMs,
  rootHostname,
  allowNonHtml = false,
  redirectDepth = 0,
}) {
  if (redirectDepth > 3) {
    throw new Error("Too many redirects.")
  }

  await assertPublicHostname(url.hostname)

  if (!sameWebsite(url.hostname, rootHostname)) {
    throw new Error("Cross-domain redirect blocked.")
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: allowNonHtml
          ? "text/plain,text/html;q=0.8,*/*;q=0.1"
          : "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "User-Agent": USER_AGENT,
      },
    })

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")

      if (!location) {
        throw new Error(`HTTP ${response.status} redirect without location.`)
      }

      const target = new URL(location, url)

      return fetchText(target, {
        timeoutMs,
        rootHostname,
        allowNonHtml,
        redirectDepth: redirectDepth + 1,
      })
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}.`)
    }

    const contentType = response.headers.get("content-type") || ""

    if (
      !allowNonHtml &&
      contentType &&
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("Response is not HTML.")
    }

    const contentLength = Number(response.headers.get("content-length") || "0")

    if (Number.isFinite(contentLength) && contentLength > MAX_HTML_BYTES) {
      throw new Error("Page is too large.")
    }

    const text = await response.text()

    if (Buffer.byteLength(text, "utf8") > MAX_HTML_BYTES) {
      throw new Error("Page is too large.")
    }

    return {
      text,
      finalUrl: url,
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out.")
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function loadRobots(rootUrl, timeoutMs) {
  try {
    const result = await fetchText(new URL("/robots.txt", rootUrl), {
      timeoutMs,
      rootHostname: rootUrl.hostname,
      allowNonHtml: true,
    })

    return parseRobotsDisallow(result.text)
  } catch {
    return []
  }
}

function extractInternalLinks(html, pageUrl, rootHostname) {
  const links = []

  const pattern =
    /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi

  for (const match of String(html || "").matchAll(pattern)) {
    const href = decodeBasicEntities(match[1] || "").trim()
    const anchorText = stripHtml(match[2] || "")

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

    let url

    try {
      url = new URL(href, pageUrl)
    } catch {
      continue
    }

    if (!["http:", "https:"].includes(url.protocol)) continue
    if (!sameWebsite(url.hostname, rootHostname)) continue

    const searchable = normalizeForSearch(
      `${url.pathname} ${anchorText}`,
    )

    if (
      DISCOVERY_HINTS.some((hint) =>
        searchable.includes(normalizeForSearch(hint)),
      )
    ) {
      links.push(normalizeQueueUrl(url))
    }
  }

  return Array.from(new Set(links))
}

function phraseOccurrences(text, phrase) {
  if (!text || !phrase) return 0

  let count = 0
  let index = 0

  while (true) {
    const next = text.indexOf(phrase, index)
    if (next < 0) break
    count += 1
    index = next + phrase.length
  }

  return count
}

function analyzeServiceEvidence(pages) {
  const results = []

  for (const service of SERVICE_DEFINITIONS) {
    let score = 0
    const sourceUrls = new Set()
    const matchedPhrases = new Set()

    for (const page of pages) {
      const urlText = normalizeForSearch(page.url)
      const prominentText = normalizeForSearch(page.prominentText)
      const bodyText = normalizeForSearch(page.bodyText)

      let pageMatched = false

      for (const rawPhrase of service.phrases) {
        const phrase = normalizeForSearch(rawPhrase)
        if (!phrase) continue

        if (urlText.includes(phrase.replace(/\s+/g, "-")) || urlText.includes(phrase)) {
          score += 4
          pageMatched = true
          matchedPhrases.add(rawPhrase)
        }

        if (prominentText.includes(phrase)) {
          score += 5
          pageMatched = true
          matchedPhrases.add(rawPhrase)
        }

        const occurrences = phraseOccurrences(bodyText, phrase)

        if (occurrences > 0) {
          score += Math.min(4, occurrences)
          pageMatched = true
          matchedPhrases.add(rawPhrase)
        }
      }

      if (pageMatched) {
        sourceUrls.add(page.url)
      }
    }

    if (score >= MIN_SERVICE_SCORE) {
      results.push({
        label: service.label,
        slug: service.slug,
        score,
        matchedPhrases: Array.from(matchedPhrases).slice(0, 8),
        sourceUrls: Array.from(sourceUrls).slice(0, 5),
      })
    }
  }

  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.label.localeCompare(b.label, "sv")
  })
}

function analyzeRutEvidence(pages) {
  const sourceUrls = []

  const positivePatterns = [
    /\brutavdrag\b/i,
    /\brut avdrag\b/i,
    /\brut-avdrag\b/i,
    /\bskattereduktion for hushallsarbete\b/i,
    /\b50 ?% ?rut\b/i,
    /\b50 procent rut\b/i,
  ]

  for (const page of pages) {
    const text = normalizeForSearch(page.bodyText)

    if (positivePatterns.some((pattern) => pattern.test(text))) {
      sourceUrls.push(page.url)
    }
  }

  return {
    found: sourceUrls.length > 0,
    sourceUrls: Array.from(new Set(sourceUrls)).slice(0, 5),
  }
}

function analyzeCityAreaEvidence(pages, city) {
  const cityValue = cleanWhitespace(city)

  if (!cityValue) {
    return {
      found: false,
      sourceUrls: [],
    }
  }

  const cityNorm = normalizeForSearch(cityValue)
  const sourceUrls = []

  const introPatterns = [
    "vi arbetar",
    "vi jobbar",
    "vi erbjuder",
    "vi utfor",
    "verksamma i",
    "serviceomrade",
    "verksamhetsomrade",
    "stadning i",
    "stadhjalp i",
  ]

  for (const page of pages) {
    const text = normalizeForSearch(page.bodyText)
    const cityIndex = text.indexOf(cityNorm)

    if (cityIndex < 0) continue

    const start = Math.max(0, cityIndex - 140)
    const end = Math.min(text.length, cityIndex + cityNorm.length + 140)
    const nearby = text.slice(start, end)

    const explicit =
      introPatterns.some((pattern) => nearby.includes(pattern)) ||
      nearby.includes(`${cityNorm} med omnejd`) ||
      nearby.includes(`${cityNorm} och omnejd`)

    if (explicit) {
      sourceUrls.push(page.url)
    }
  }

  return {
    found: sourceUrls.length > 0,
    sourceUrls: Array.from(new Set(sourceUrls)).slice(0, 5),
  }
}

function formatSwedishList(items) {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} och ${items[1]}`

  return `${items.slice(0, -1).join(", ")} och ${items.at(-1)}`
}

function createFactualDescription(company, services, rutFound) {
  if (!services.length) {
    return null
  }

  const city = cleanWhitespace(company.city || company.normalized_city)
  const serviceLabels = services
    .slice(0, 6)
    .map((service) => service.label.toLowerCase())

  const hasMoreServices = services.length > serviceLabels.length

  let description = city
    ? `${company.name} är ett städföretag i ${city}. `
    : `${company.name} är ett städföretag. `

  description += hasMoreServices
    ? `På företagets webbplats anges bland annat tjänster som ${formatSwedishList(serviceLabels)}.`
    : `På företagets webbplats anges tjänster som ${formatSwedishList(serviceLabels)}.`

  if (rutFound) {
    description +=
      " Företaget informerar även om RUT-avdrag för kvalificerade hushållstjänster."
  }

  return description.slice(0, 500)
}

async function scanCompany(company, args) {
  const rootUrl = normalizeWebsite(company.website)

  if (!rootUrl) {
    return {
      status: "invalid_site",
      error: "Invalid website URL.",
      pages: [],
      services: [],
      rut: { found: false, sourceUrls: [] },
      area: { found: false, sourceUrls: [] },
      patch: {},
    }
  }

  try {
    await assertPublicHostname(rootUrl.hostname)
  } catch (error) {
    return {
      status: "invalid_site",
      error: error instanceof Error ? error.message : "Invalid website.",
      pages: [],
      services: [],
      rut: { found: false, sourceUrls: [] },
      area: { found: false, sourceUrls: [] },
      patch: {},
    }
  }

  const disallowRules = await loadRobots(rootUrl, args.timeoutMs)

  const queue = []
  const queued = new Set()
  const checked = new Set()
  const pages = []
  const errors = []

  function enqueue(urlValue, priority = 0) {
    let url

    try {
      url = urlValue instanceof URL ? urlValue : new URL(urlValue, rootUrl)
    } catch {
      return
    }

    if (!sameWebsite(url.hostname, rootUrl.hostname)) return
    if (!robotsAllows(url, disallowRules)) return

    const normalized = normalizeQueueUrl(url)

    if (queued.has(normalized) || checked.has(normalized)) return

    queued.add(normalized)
    queue.push({ url: normalized, priority })
    queue.sort((a, b) => b.priority - a.priority || a.url.localeCompare(b.url))
  }

  enqueue(rootUrl, 100)

  for (const commonPath of COMMON_DISCOVERY_PATHS) {
    enqueue(new URL(commonPath, rootUrl), 30)
  }

  while (queue.length > 0 && pages.length < args.pageLimit) {
    const entry = queue.shift()
    if (!entry) break

    queued.delete(entry.url)

    if (checked.has(entry.url)) continue
    checked.add(entry.url)

    let pageUrl

    try {
      pageUrl = new URL(entry.url)
    } catch {
      continue
    }

    try {
      const result = await fetchText(pageUrl, {
        timeoutMs: args.timeoutMs,
        rootHostname: rootUrl.hostname,
      })

      const page = {
        url: result.finalUrl.toString(),
        prominentText: extractProminentText(result.text),
        bodyText: stripHtml(result.text),
      }

      pages.push(page)

      const discovered = extractInternalLinks(
        result.text,
        result.finalUrl,
        rootUrl.hostname,
      )

      for (const url of discovered) {
        enqueue(url, 80)
      }
    } catch (error) {
      errors.push({
        url: pageUrl.toString(),
        message: error instanceof Error ? error.message : "Fetch failed.",
      })
    }
  }

  if (!pages.length) {
    return {
      status: errors.some((item) =>
        item.message.toLowerCase().includes("timed out"),
      )
        ? "timeout"
        : "failed",
      error: errors.map((item) => `${item.url}: ${item.message}`).slice(0, 4).join(" | "),
      pages: [],
      services: [],
      rut: { found: false, sourceUrls: [] },
      area: { found: false, sourceUrls: [] },
      patch: {},
    }
  }

  const services = analyzeServiceEvidence(pages)
  const rut = analyzeRutEvidence(pages)
  const area = analyzeCityAreaEvidence(
    pages,
    company.city || company.normalized_city || "",
  )

  const patch = {}

  const existingServiceTypes = Array.isArray(company.service_types)
    ? company.service_types.filter(Boolean)
    : []

  const existingServiceAreas = Array.isArray(company.service_areas)
    ? company.service_areas.filter(Boolean)
    : []

  if (existingServiceTypes.length === 0 && services.length > 0) {
    patch.service_types = services.map((service) => service.label)
  }

  if (
    existingServiceAreas.length === 0 &&
    area.found &&
    cleanWhitespace(company.city || company.normalized_city)
  ) {
    patch.service_areas = [
      cleanWhitespace(company.city || company.normalized_city),
    ]
  }

  if (company.rut_available !== true && rut.found) {
    patch.rut_available = true
  }

  if (!cleanWhitespace(company.description) && services.length > 0) {
    const description = createFactualDescription(company, services, rut.found)

    if (description) {
      patch.description = description
    }
  }

  return {
    status: "scanned",
    error: errors.length
      ? errors.map((item) => `${item.url}: ${item.message}`).slice(0, 4).join(" | ")
      : null,
    pages: pages.map((page) => page.url),
    services,
    rut,
    area,
    patch,
  }
}

async function mapWithConcurrency(items, concurrency, handler) {
  if (!items.length) return []

  const results = new Array(items.length)
  let cursor = 0

  async function worker() {
    while (true) {
      const index = cursor
      cursor += 1

      if (index >= items.length) return

      results[index] = await handler(items[index], index)
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(Math.max(1, concurrency), items.length) },
      () => worker(),
    ),
  )

  return results
}

function csvEscape(value) {
  const text = Array.isArray(value)
    ? value.join(" | ")
    : String(value ?? "")

  return `"${text.replaceAll('"', '""')}"`
}

function writeReports(results, args) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")

  fs.mkdirSync(args.outputDir, { recursive: true })

  const jsonPath = path.join(
    args.outputDir,
    `seo-company-enrichment-${timestamp}.json`,
  )

  const csvPath = path.join(
    args.outputDir,
    `seo-company-enrichment-${timestamp}.csv`,
  )

  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        mode: args.apply ? "apply" : "dry-run",
        filters: {
          city: args.city || null,
          limit: args.limit,
          concurrency: args.concurrency,
          pageLimit: args.pageLimit,
          includeClaimed: args.includeClaimed,
          includeVerified: args.includeVerified,
        },
        results,
      },
      null,
      2,
    ),
  )

  const columns = [
    "name",
    "city",
    "website",
    "status",
    "services",
    "rut",
    "area",
    "patch_fields",
    "pages_scanned",
    "applied",
    "error",
  ]

  const lines = [columns.join(",")]

  for (const item of results) {
    lines.push(
      [
        csvEscape(item.company.name),
        csvEscape(item.company.city || item.company.normalized_city),
        csvEscape(item.company.website),
        csvEscape(item.scan.status),
        csvEscape(item.scan.services.map((service) => service.label)),
        csvEscape(item.scan.rut.found ? "yes" : "no"),
        csvEscape(item.scan.area.found ? "yes" : "no"),
        csvEscape(Object.keys(item.scan.patch)),
        csvEscape(item.scan.pages.length),
        csvEscape(item.applied ? "yes" : "no"),
        csvEscape(item.applyError || item.scan.error || ""),
      ].join(","),
    )
  }

  fs.writeFileSync(csvPath, `${lines.join("\n")}\n`)

  return {
    jsonPath,
    csvPath,
  }
}

function summarize(results) {
  const summary = {
    total: results.length,
    scanned: 0,
    invalidSite: 0,
    timeout: 0,
    failed: 0,
    withServices: 0,
    withRutEvidence: 0,
    withAreaEvidence: 0,
    descriptionCandidates: 0,
    serviceTypeCandidates: 0,
    serviceAreaCandidates: 0,
    rutCandidates: 0,
    patchCandidates: 0,
    applied: 0,
    applyErrors: 0,
  }

  for (const item of results) {
    const scan = item.scan

    if (scan.status === "scanned") summary.scanned += 1
    if (scan.status === "invalid_site") summary.invalidSite += 1
    if (scan.status === "timeout") summary.timeout += 1
    if (scan.status === "failed") summary.failed += 1

    if (scan.services.length > 0) summary.withServices += 1
    if (scan.rut.found) summary.withRutEvidence += 1
    if (scan.area.found) summary.withAreaEvidence += 1

    if ("description" in scan.patch) summary.descriptionCandidates += 1
    if ("service_types" in scan.patch) summary.serviceTypeCandidates += 1
    if ("service_areas" in scan.patch) summary.serviceAreaCandidates += 1
    if ("rut_available" in scan.patch) summary.rutCandidates += 1

    if (Object.keys(scan.patch).length > 0) summary.patchCandidates += 1
    if (item.applied) summary.applied += 1
    if (item.applyError) summary.applyErrors += 1
  }

  return summary
}

function runSelfTest() {
  const syntheticPages = [
    {
      url: "https://example.se/tjanster/hemstadning",
      prominentText: "Hemstädning Flyttstädning Fönsterputs",
      bodyText:
        "Vi erbjuder hemstädning, flyttstädning och fönsterputs i Stockholm med omnejd. RUT-avdrag kan användas.",
    },
  ]

  const services = analyzeServiceEvidence(syntheticPages)
  const rut = analyzeRutEvidence(syntheticPages)
  const area = analyzeCityAreaEvidence(syntheticPages, "Stockholm")

  const serviceLabels = services.map((item) => item.label)

  const expectedServices = [
    "Hemstädning",
    "Flyttstädning",
    "Fönsterputs",
  ]

  const servicesPass = expectedServices.every((item) =>
    serviceLabels.includes(item),
  )

  const pass = servicesPass && rut.found && area.found

  console.log("Clean Jobs SEO Company Enrichment — self-test")
  console.log(`Services: ${serviceLabels.join(", ")}`)
  console.log(`RUT evidence: ${rut.found}`)
  console.log(`Area evidence: ${area.found}`)
  console.log(pass ? "SELF-TEST: PASS" : "SELF-TEST: FAIL")

  if (!pass) {
    process.exitCode = 1
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.selfTest) {
    runSelfTest()
    return
  }

  if (
    args.apply &&
    args.confirm !== APPLY_CONFIRMATION
  ) {
    console.error(
      `Refusing to write. Add --confirm=${APPLY_CONFIRMATION} together with --apply.`,
    )
    process.exit(1)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    )
    process.exit(1)
  }

  const supabase = createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )

  let query = supabase
    .from("companies")
    .select(
      "id, name, slug, city, normalized_city, website, description, service_types, service_areas, rut_available, hourly_rate, verified, owner_id, claimed_at, catalog_source, directory_quality_score",
    )
    .not("website", "is", null)
    .neq("website", "")
    .order("directory_quality_score", { ascending: false })
    .order("name", { ascending: true })
    .limit(args.limit)

  if (args.city) {
    query = query.ilike("city", `%${args.city}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Could not load companies:", error.message)
    process.exit(1)
  }

  const candidates = (data || []).filter((company) => {
    if (!args.includeClaimed && (company.owner_id || company.claimed_at)) {
      return false
    }

    if (!args.includeVerified && company.verified === true) {
      return false
    }

    return true
  })

  console.log("Clean Jobs — SEO Company Enrichment Phase 2A")
  console.log(`Mode: ${args.apply ? "APPLY" : "DRY-RUN"}`)
  console.log(`Loaded: ${(data || []).length}`)
  console.log(`Eligible after ownership/verification gate: ${candidates.length}`)
  console.log(`Concurrency: ${args.concurrency}`)
  console.log(`Max pages/site: ${args.pageLimit}`)
  console.log(`Minimum service score: ${MIN_SERVICE_SCORE}`)
  console.log("")

  let completed = 0

  const results = await mapWithConcurrency(
    candidates,
    args.concurrency,
    async (company) => {
      const scan = await scanCompany(company, args)
      completed += 1

      const services = scan.services.map((service) => service.label).join(", ")
      const patchFields = Object.keys(scan.patch).join(", ")

      console.log(
        `[${completed}/${candidates.length}] ${company.name} | ${scan.status} | services=${services || "—"} | patch=${patchFields || "—"}`,
      )

      let applied = false
      let applyError = null

      if (args.apply && Object.keys(scan.patch).length > 0) {
        let updateQuery = supabase
          .from("companies")
          .update(scan.patch)
          .eq("id", company.id)

        if (!args.includeClaimed) {
          updateQuery = updateQuery
            .is("owner_id", null)
            .is("claimed_at", null)
        }

        const {
          data: updated,
          error: updateError,
        } = await updateQuery
          .select("id")
          .maybeSingle()

        if (updateError) {
          applyError = updateError.message
        } else if (updated) {
          applied = true
        } else {
          applyError =
            "Write skipped because the profile changed ownership/state during the run."
        }
      }

      return {
        company,
        scan,
        applied,
        applyError,
      }
    },
  )

  const reportPaths = writeReports(results, args)
  const summary = summarize(results)

  console.log("")
  console.log("===== SUMMARY =====")
  console.log(`Total candidates:           ${summary.total}`)
  console.log(`Successfully scanned:       ${summary.scanned}`)
  console.log(`Invalid site:               ${summary.invalidSite}`)
  console.log(`Timeout:                    ${summary.timeout}`)
  console.log(`Failed:                     ${summary.failed}`)
  console.log(`Service evidence found:     ${summary.withServices}`)
  console.log(`RUT evidence found:         ${summary.withRutEvidence}`)
  console.log(`Area evidence found:        ${summary.withAreaEvidence}`)
  console.log(`service_types candidates:   ${summary.serviceTypeCandidates}`)
  console.log(`service_areas candidates:   ${summary.serviceAreaCandidates}`)
  console.log(`description candidates:     ${summary.descriptionCandidates}`)
  console.log(`rut_available candidates:   ${summary.rutCandidates}`)
  console.log(`Profiles with any patch:    ${summary.patchCandidates}`)
  console.log(`Applied:                    ${summary.applied}`)
  console.log(`Apply errors:               ${summary.applyErrors}`)
  console.log("")
  console.log(`JSON report: ${reportPaths.jsonPath}`)
  console.log(`CSV report:  ${reportPaths.csvPath}`)
  console.log("")

  if (!args.apply) {
    console.log(
      `DRY-RUN ONLY. No database rows were changed. To apply a reviewed batch, rerun with --apply --confirm=${APPLY_CONFIRMATION}.`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
