"use server"

import dns from "node:dns/promises"
import net from "node:net"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const DEFAULT_BATCH_SIZE = 10
const MAX_BATCH_SIZE = 20
const FETCH_TIMEOUT_MS = 7_000
const MAX_HTML_SIZE_BYTES = 1_500_000
const MAX_PAGES_PER_WEBSITE = 6
const CONCURRENCY = 4

const COMMON_CONTACT_PATHS = [
  "/kontakt",
  "/kontakta-oss",
  "/contact",
  "/contact-us",
  "/om-oss",
  "/about",
]

const CONTACT_LINK_WORDS = [
  "kontakt",
  "kontakta",
  "contact",
  "contact-us",
  "om-oss",
  "about",
  "support",
  "kundservice",
]

const BLOCKED_EMAIL_PREFIXES = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster",
  "abuse",
  "privacy",
]

const BLOCKED_EMAIL_DOMAINS = [
  "example.com",
  "example.org",
  "example.net",
  "sentry.io",
  "wixpress.com",
  "wordpress.org",
  "schema.org",
]

const BLOCKED_EMAIL_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".svg",
  ".css",
  ".js",
  ".json",
  ".xml",
  ".woff",
  ".woff2",
  ".ttf",
]

type CompanyLead = {
  id: string
  company_name: string
  website: string
}

type ScanResult =
  | {
      leadId: string
      companyName: string
      status: "found"
      email: string
    }
  | {
      leadId: string
      companyName: string
      status: "not_found"
    }
  | {
      leadId: string
      companyName: string
      status: "failed"
      error: string
    }

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(
      `/login?next=${encodeURIComponent(
        "/admin/leads/enrich",
      )}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function redirectWithError(message: string): never {
  redirect(
    `/admin/leads/enrich?error=${encodeURIComponent(
      message,
    )}`,
  )
}

function normalizeWebsite(value: string) {
  const website = value.trim()

  if (!website) {
    return null
  }

  try {
    const preparedWebsite =
      website.startsWith("http://") ||
      website.startsWith("https://")
        ? website
        : `https://${website}`

    const url = new URL(preparedWebsite)

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return null
    }

    url.hash = ""

    return url
  } catch {
    return null
  }
}

function isPrivateIpv4(address: string) {
  const parts = address
    .split(".")
    .map((part) => Number(part))

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255,
    )
  ) {
    return true
  }

  const [first, second] = parts

  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 &&
      second >= 16 &&
      second <= 31) ||
    (first === 192 && second === 168) ||
    first >= 224
  )
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase()

  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.")
  )
}

function isPrivateIp(address: string) {
  const ipVersion = net.isIP(address)

  if (ipVersion === 4) {
    return isPrivateIpv4(address)
  }

  if (ipVersion === 6) {
    return isPrivateIpv6(address)
  }

  return true
}

async function assertPublicHostname(hostname: string) {
  const normalizedHostname = hostname
    .trim()
    .toLowerCase()
    .replace(/\.$/, "")

  if (
    !normalizedHostname ||
    normalizedHostname === "localhost" ||
    normalizedHostname.endsWith(".localhost") ||
    normalizedHostname.endsWith(".local") ||
    normalizedHostname.endsWith(".internal")
  ) {
    throw new Error("Blocked website hostname.")
  }

  if (net.isIP(normalizedHostname)) {
    if (isPrivateIp(normalizedHostname)) {
      throw new Error("Blocked private IP address.")
    }

    return
  }

  let addresses: Awaited<
    ReturnType<typeof dns.lookup>
  >[]

  try {
    const resolved = await dns.lookup(
      normalizedHostname,
      {
        all: true,
        verbatim: true,
      },
    )

    addresses = resolved
  } catch {
    throw new Error("Website hostname could not be resolved.")
  }

  if (!addresses.length) {
    throw new Error("Website hostname has no IP address.")
  }

  for (const address of addresses) {
    if (isPrivateIp(address.address)) {
      throw new Error(
        "Website resolves to a blocked private IP address.",
      )
    }
  }
}

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&commat;", "@")
    .replaceAll("&#64;", "@")
    .replaceAll("&#x40;", "@")
    .replaceAll("&period;", ".")
    .replaceAll("&#46;", ".")
    .replaceAll("&#x2e;", ".")
    .replaceAll("&amp;", "&")
}

function normalizeEmailCandidate(value: string) {
  return decodeHtmlEntities(value)
    .trim()
    .replace(/^mailto:/i, "")
    .split("?")[0]
    .replace(/[),.;:!?]+$/g, "")
    .replace(/^[("'[\]{}<>]+/g, "")
    .toLowerCase()
}

function isValidEmailCandidate(email: string) {
  if (
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(
      email,
    )
  ) {
    return false
  }

  if (email.length > 254) {
    return false
  }

  const [localPart, domain] = email.split("@")

  if (!localPart || !domain) {
    return false
  }

  if (
    BLOCKED_EMAIL_PREFIXES.some(
      (prefix) =>
        localPart === prefix ||
        localPart.startsWith(`${prefix}+`),
    )
  ) {
    return false
  }

  if (
    BLOCKED_EMAIL_DOMAINS.some(
      (blockedDomain) =>
        domain === blockedDomain ||
        domain.endsWith(`.${blockedDomain}`),
    )
  ) {
    return false
  }

  if (
    BLOCKED_EMAIL_EXTENSIONS.some((extension) =>
      email.endsWith(extension),
    )
  ) {
    return false
  }

  return true
}

function extractEmails(html: string) {
  const decodedHtml = decodeHtmlEntities(html)
  const candidates = new Set<string>()

  const mailtoPattern =
    /mailto:([^"'<>?\s]+)/gi

  for (const match of decodedHtml.matchAll(
    mailtoPattern,
  )) {
    const email = normalizeEmailCandidate(
      match[1] || "",
    )

    if (isValidEmailCandidate(email)) {
      candidates.add(email)
    }
  }

  const normalEmailPattern =
    /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/gi

  for (const match of decodedHtml.matchAll(
    normalEmailPattern,
  )) {
    const email = normalizeEmailCandidate(
      match[0] || "",
    )

    if (isValidEmailCandidate(email)) {
      candidates.add(email)
    }
  }

  const spacedEmailPattern =
    /([a-z0-9._%+-]+)\s*(?:\(|\[)?\s*(?:at|snabel-a)\s*(?:\)|\])?\s*([a-z0-9.-]+)\s*(?:\(|\[)?\s*(?:dot|punkt)\s*(?:\)|\])?\s*([a-z]{2,})/gi

  for (const match of decodedHtml.matchAll(
    spacedEmailPattern,
  )) {
    const email = normalizeEmailCandidate(
      `${match[1]}@${match[2]}.${match[3]}`,
    )

    if (isValidEmailCandidate(email)) {
      candidates.add(email)
    }
  }

  return Array.from(candidates)
}

function getRegistrableComparisonDomain(
  hostname: string,
) {
  return hostname
    .toLowerCase()
    .replace(/^www\./, "")
}

function getEmailScore(
  email: string,
  websiteHostname: string,
) {
  const [localPart, emailDomain] = email.split("@")
  const websiteDomain =
    getRegistrableComparisonDomain(websiteHostname)

  let score = 0

  if (
    emailDomain === websiteDomain ||
    websiteDomain.endsWith(`.${emailDomain}`) ||
    emailDomain.endsWith(`.${websiteDomain}`)
  ) {
    score += 100
  }

  const preferredPrefixes = [
    "info",
    "kontakt",
    "contact",
    "hello",
    "hej",
    "office",
    "kundservice",
    "service",
    "bokning",
    "booking",
  ]

  const preferredIndex =
    preferredPrefixes.indexOf(localPart)

  if (preferredIndex >= 0) {
    score += 50 - preferredIndex
  }

  if (
    localPart.includes("support") ||
    localPart.includes("sales")
  ) {
    score += 10
  }

  return score
}

function chooseBestEmail(
  emails: string[],
  websiteHostname: string,
) {
  return [...emails].sort((first, second) => {
    const scoreDifference =
      getEmailScore(second, websiteHostname) -
      getEmailScore(first, websiteHostname)

    if (scoreDifference !== 0) {
      return scoreDifference
    }

    return first.localeCompare(second)
  })[0]
}

function extractContactLinks(
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
      href.startsWith("javascript:")
    ) {
      continue
    }

    let url: URL

    try {
      url = new URL(href, pageUrl)
    } catch {
      continue
    }

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      continue
    }

    const normalizedHostname =
      getRegistrableComparisonDomain(url.hostname)

    const normalizedRootHostname =
      getRegistrableComparisonDomain(rootHostname)

    if (
      normalizedHostname !==
        normalizedRootHostname &&
      !normalizedHostname.endsWith(
        `.${normalizedRootHostname}`,
      ) &&
      !normalizedRootHostname.endsWith(
        `.${normalizedHostname}`,
      )
    ) {
      continue
    }

    const searchableValue =
      `${url.pathname} ${url.search}`.toLowerCase()

    if (
      !CONTACT_LINK_WORDS.some((word) =>
        searchableValue.includes(word),
      )
    ) {
      continue
    }

    url.hash = ""
    links.add(url.toString())
  }

  return Array.from(links)
}

async function fetchHtml(url: URL) {
  await assertPublicHostname(url.hostname)

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_TIMEOUT_MS,
  )

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept:
          "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "User-Agent":
          "CleanJobsLeadEnrichmentBot/1.0 (+https://cleansjob.com)",
      },
    })

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location = response.headers.get("location")

      if (!location) {
        throw new Error(
          `Website returned redirect ${response.status}.`,
        )
      }

      const redirectUrl = new URL(location, url)

      await assertPublicHostname(
        redirectUrl.hostname,
      )

      return fetchHtmlWithoutRedirect(
        redirectUrl,
        controller.signal,
      )
    }

    return readHtmlResponse(response)
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchHtmlWithoutRedirect(
  url: URL,
  signal: AbortSignal,
) {
  const response = await fetch(url, {
    method: "GET",
    redirect: "error",
    cache: "no-store",
    signal,
    headers: {
      Accept:
        "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
      "User-Agent":
        "CleanJobsLeadEnrichmentBot/1.0 (+https://cleansjob.com)",
    },
  })

  return readHtmlResponse(response)
}

async function readHtmlResponse(
  response: Response,
) {
  if (!response.ok) {
    throw new Error(
      `Website returned HTTP ${response.status}.`,
    )
  }

  const contentType =
    response.headers.get("content-type") || ""

  if (
    !contentType.includes("text/html") &&
    !contentType.includes(
      "application/xhtml+xml",
    )
  ) {
    throw new Error(
      "Website response is not an HTML page.",
    )
  }

  const contentLength = Number(
    response.headers.get("content-length") || "0",
  )

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_HTML_SIZE_BYTES
  ) {
    throw new Error("Website page is too large.")
  }

  const html = await response.text()

  if (Buffer.byteLength(html, "utf8") >
    MAX_HTML_SIZE_BYTES) {
    throw new Error("Website page is too large.")
  }

  return html
}

async function scanWebsiteForEmail(
  website: string,
) {
  const rootUrl = normalizeWebsite(website)

  if (!rootUrl) {
    throw new Error("Invalid website URL.")
  }

  await assertPublicHostname(rootUrl.hostname)

  const pagesToVisit = new Set<string>()
  pagesToVisit.add(rootUrl.toString())

  for (const path of COMMON_CONTACT_PATHS) {
    pagesToVisit.add(new URL(path, rootUrl).toString())
  }

  const checkedPages = new Set<string>()
  const discoveredEmails = new Set<string>()

  while (
    pagesToVisit.size > 0 &&
    checkedPages.size < MAX_PAGES_PER_WEBSITE
  ) {
    const nextPage = pagesToVisit
      .values()
      .next().value as string | undefined

    if (!nextPage) {
      break
    }

    pagesToVisit.delete(nextPage)

    if (checkedPages.has(nextPage)) {
      continue
    }

    checkedPages.add(nextPage)

    let pageUrl: URL

    try {
      pageUrl = new URL(nextPage)
    } catch {
      continue
    }

    try {
      const html = await fetchHtml(pageUrl)

      for (const email of extractEmails(html)) {
        discoveredEmails.add(email)
      }

      for (const contactLink of extractContactLinks(
        html,
        pageUrl,
        rootUrl.hostname,
      )) {
        if (
          checkedPages.size + pagesToVisit.size <
          MAX_PAGES_PER_WEBSITE
        ) {
          pagesToVisit.add(contactLink)
        }
      }
    } catch (error) {
      console.warn(
        `Could not scan ${pageUrl.toString()}:`,
        error instanceof Error
          ? error.message
          : error,
      )
    }
  }

  if (!discoveredEmails.size) {
    return null
  }

  return chooseBestEmail(
    Array.from(discoveredEmails),
    rootUrl.hostname,
  )
}

async function processLead(
  lead: CompanyLead,
): Promise<ScanResult> {
  try {
    const email = await scanWebsiteForEmail(
      lead.website,
    )

    if (!email) {
      return {
        leadId: lead.id,
        companyName: lead.company_name,
        status: "not_found",
      }
    }

    return {
      leadId: lead.id,
      companyName: lead.company_name,
      status: "found",
      email,
    }
  } catch (error) {
    return {
      leadId: lead.id,
      companyName: lead.company_name,
      status: "failed",
      error:
        error instanceof Error
          ? error.message
          : "Unknown website scanning error.",
    }
  }
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  handler: (item: T) => Promise<R>,
) {
  const results: R[] = new Array(items.length)
  let currentIndex = 0

  async function worker() {
    while (true) {
      const index = currentIndex
      currentIndex += 1

      if (index >= items.length) {
        return
      }

      results[index] = await handler(items[index])
    }
  }

  const workers = Array.from(
    {
      length: Math.min(concurrency, items.length),
    },
    () => worker(),
  )

  await Promise.all(workers)

  return results
}

export async function enrichCompanyLeadsAction(
  formData: FormData,
) {
  const admin = await requireAdmin()

  const requestedBatchSize = Number(
    formData.get("batch_size") ||
      DEFAULT_BATCH_SIZE,
  )

  const batchSize = Math.min(
    MAX_BATCH_SIZE,
    Math.max(
      1,
      Number.isFinite(requestedBatchSize)
        ? Math.floor(requestedBatchSize)
        : DEFAULT_BATCH_SIZE,
    ),
  )

  const { data, error } = await admin
    .from("company_leads")
    .select("id, company_name, website")
    .not("website", "is", null)
    .or("email.is.null,email.eq.")
    .order("created_at", {
      ascending: true,
    })
    .limit(batchSize)

  if (error) {
    console.error(
      "Company lead enrichment query error:",
      error.message,
    )

    redirectWithError(
      "Could not load companies for email enrichment.",
    )
  }

  const leads = (data ?? []).filter(
    (
      lead,
    ): lead is CompanyLead =>
      typeof lead.id === "string" &&
      typeof lead.company_name === "string" &&
      typeof lead.website === "string" &&
      lead.website.trim().length > 0,
  )

  if (!leads.length) {
    redirect(
      "/admin/leads/enrich?success=no-companies",
    )
  }

  const results = await mapWithConcurrency(
    leads,
    CONCURRENCY,
    processLead,
  )

  let foundCount = 0
  let savedCount = 0
  let notFoundCount = 0
  let failedCount = 0

  for (const result of results) {
    if (result.status === "not_found") {
      notFoundCount += 1
      continue
    }

    if (result.status === "failed") {
      failedCount += 1

      console.error(
        `Lead enrichment failed for ${result.companyName}:`,
        result.error,
      )

      continue
    }

    foundCount += 1

    const { data: updatedLead, error: updateError } =
      await admin
        .from("company_leads")
        .update({
          email: result.email,
        })
        .eq("id", result.leadId)
        .or("email.is.null,email.eq.")
        .select("id")
        .maybeSingle()

    if (updateError) {
      failedCount += 1

      console.error(
        `Could not save email for ${result.companyName}:`,
        updateError.message,
      )

      continue
    }

    if (updatedLead) {
      savedCount += 1
    }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/leads")
  revalidatePath("/admin/leads/enrich")

  const params = new URLSearchParams({
    success: "enrichment-completed",
    scanned: String(leads.length),
    found: String(foundCount),
    saved: String(savedCount),
    notFound: String(notFoundCount),
    failed: String(failedCount),
  })

  redirect(
    `/admin/leads/enrich?${params.toString()}`,
  )
}