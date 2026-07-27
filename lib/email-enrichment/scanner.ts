import {
  extractContactLinks,
  extractRobotsEntries,
  extractSitemapEntries,
  isUrlAllowedByRobots,
  prioritizePageUrls,
} from "./crawler"
import { extractEmails } from "./email-parser"
import {
  assertPublicHostname,
  normalizeWebsite,
} from "./hostname"
import { chooseBestEmail } from "./scoring"
import type {
  DiscoveredEmailCandidate,
  EmailScanStatus,
  EmailSource,
  LeadScanResult,
  PageScanError,
  ScannableCompanyLead,
  WebsiteScanResult,
} from "./types"

const FETCH_TIMEOUT_MS = 7_000

const MAX_HTML_SIZE_BYTES = 1_500_000
const MAX_SITEMAP_SIZE_BYTES = 2_500_000
const MAX_ROBOTS_SIZE_BYTES = 500_000

const MAX_PAGES_PER_WEBSITE = 10
const PAGE_SCAN_CONCURRENCY = 3

const MAX_SITEMAPS_PER_WEBSITE = 5
const MAX_SITEMAP_PAGE_CANDIDATES = 12
const MAX_ROBOTS_PAGE_CANDIDATES = 8

const COMMON_CONTACT_PATHS = [
  "/kontakt",
  "/kontakta-oss",
  "/kontakt-oss",
  "/contact",
  "/contact-us",
  "/contact-support",
  "/support",
  "/customer-service",
  "/customer-support",
  "/kundservice",
  "/kundtjanst",
  "/help",
  "/helpdesk",
  "/faq",
  "/om-oss",
  "/about",
  "/about-us",
  "/company",
  "/team",
  "/staff",
  "/privacy-policy",
  "/integritetspolicy",
  "/legal",
  "/terms",
  "/villkor",
  "/impressum",
]

const COMMON_SITEMAP_PATHS = [
  "/sitemap.xml",
  "/sitemap_index.xml",
]

type FetchedTextPage = {
  text: string
  finalUrl: URL
}

type FetchContentType =
  | "html"
  | "xml"
  | "robots"

type RobotsDiscoveryResult = {
  pageUrls: string[]
  sitemapUrls: string[]
  disallowedPaths: string[]
}

type PageQueueEntry = {
  url: string
  source: EmailSource
}

type PageFetchTask = {
  entry: PageQueueEntry
  pageUrl: URL
}

type SuccessfulPageFetch = {
  ok: true
  entry: PageQueueEntry
  pageUrl: URL
  result: FetchedTextPage
}

type FailedPageFetch = {
  ok: false
  entry: PageQueueEntry
  pageUrl: URL
  error: Error
}

type PageFetchResult =
  | SuccessfulPageFetch
  | FailedPageFetch

function normalizeQueueUrl(url: URL) {
  const normalizedUrl = new URL(
    url.toString(),
  )

  normalizedUrl.hash = ""

  if (
    normalizedUrl.pathname.length > 1 &&
    normalizedUrl.pathname.endsWith("/")
  ) {
    normalizedUrl.pathname =
      normalizedUrl.pathname.replace(
        /\/+$/,
        "",
      )
  }

  return normalizedUrl.toString()
}

function getMaximumResponseSize(
  contentType: FetchContentType,
) {
  if (contentType === "html") {
    return MAX_HTML_SIZE_BYTES
  }

  if (contentType === "robots") {
    return MAX_ROBOTS_SIZE_BYTES
  }

  return MAX_SITEMAP_SIZE_BYTES
}

function isAcceptedContentType(
  headerValue: string,
  contentType: FetchContentType,
) {
  const normalizedValue =
    headerValue.toLowerCase()

  if (contentType === "html") {
    return (
      normalizedValue.includes("text/html") ||
      normalizedValue.includes(
        "application/xhtml+xml",
      )
    )
  }

  if (contentType === "robots") {
    return (
      normalizedValue.includes("text/plain") ||
      normalizedValue.includes("text/html") ||
      normalizedValue.includes(
        "application/octet-stream",
      )
    )
  }

  return (
    normalizedValue.includes("application/xml") ||
    normalizedValue.includes("text/xml") ||
    normalizedValue.includes("text/plain") ||
    normalizedValue.includes(
      "application/rss+xml",
    ) ||
    normalizedValue.includes(
      "application/xhtml+xml",
    )
  )
}

function getContentTypeErrorMessage(
  contentType: FetchContentType,
) {
  if (contentType === "html") {
    return "Website response is not an HTML page."
  }

  if (contentType === "robots") {
    return "Website response is not a robots.txt file."
  }

  return "Website response is not an XML sitemap."
}

function getContentSizeErrorMessage(
  contentType: FetchContentType,
) {
  if (contentType === "html") {
    return "Website page is too large."
  }

  if (contentType === "robots") {
    return "Website robots.txt is too large."
  }

  return "Website sitemap is too large."
}

async function readTextResponse(
  response: Response,
  contentType: FetchContentType,
) {
  if (!response.ok) {
    throw new Error(
      `Website returned HTTP ${response.status}.`,
    )
  }

  const responseContentType =
    response.headers.get("content-type") || ""

  if (
    responseContentType &&
    !isAcceptedContentType(
      responseContentType,
      contentType,
    )
  ) {
    throw new Error(
      getContentTypeErrorMessage(contentType),
    )
  }

  const maximumSize =
    getMaximumResponseSize(contentType)

  const contentLength = Number(
    response.headers.get("content-length") || "0",
  )

  if (
    Number.isFinite(contentLength) &&
    contentLength > maximumSize
  ) {
    throw new Error(
      getContentSizeErrorMessage(contentType),
    )
  }

  const text = await response.text()

  if (
    Buffer.byteLength(text, "utf8") >
    maximumSize
  ) {
    throw new Error(
      getContentSizeErrorMessage(contentType),
    )
  }

  return text
}

function getRequestAcceptHeader(
  contentType: FetchContentType,
) {
  if (contentType === "html") {
    return "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1"
  }

  if (contentType === "robots") {
    return "text/plain,text/html;q=0.5,*/*;q=0.1"
  }

  return "application/xml,text/xml,text/plain;q=0.9,*/*;q=0.1"
}

async function fetchText(
  url: URL,
  contentType: FetchContentType,
): Promise<FetchedTextPage> {
  await assertPublicHostname(url.hostname)

  const controller = new AbortController()

  const timeout = setTimeout(() => {
    controller.abort()
  }, FETCH_TIMEOUT_MS)

  const requestHeaders = {
    Accept: getRequestAcceptHeader(contentType),
    "User-Agent":
      "CleanJobsLeadEnrichmentBot/1.0 (+https://cleansjob.com)",
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: requestHeaders,
    })

    if (
      response.status >= 300 &&
      response.status < 400
    ) {
      const location =
        response.headers.get("location")

      if (!location) {
        throw new Error(
          `Website returned redirect ${response.status}.`,
        )
      }

      const redirectUrl = new URL(
        location,
        url,
      )

      if (
        redirectUrl.protocol !== "http:" &&
        redirectUrl.protocol !== "https:"
      ) {
        throw new Error(
          "Website redirected to an unsupported URL.",
        )
      }

      await assertPublicHostname(
        redirectUrl.hostname,
      )

      const redirectResponse = await fetch(
        redirectUrl,
        {
          method: "GET",
          redirect: "error",
          cache: "no-store",
          signal: controller.signal,
          headers: requestHeaders,
        },
      )

      return {
        text: await readTextResponse(
          redirectResponse,
          contentType,
        ),
        finalUrl: redirectUrl,
      }
    }

    return {
      text: await readTextResponse(
        response,
        contentType,
      ),
      finalUrl: url,
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "Website request timed out.",
      )
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}

async function discoverFromRobots(
  rootUrl: URL,
): Promise<RobotsDiscoveryResult> {
  const robotsUrl = new URL(
    "/robots.txt",
    rootUrl,
  )

  try {
    const result = await fetchText(
      robotsUrl,
      "robots",
    )

    return extractRobotsEntries(
      result.text,
      result.finalUrl,
      rootUrl.hostname,
    )
  } catch {
    /*
     * robots.txt discovery is optional.
     * Missing or invalid robots.txt must not stop
     * the normal website scan.
     */
    return {
      pageUrls: [],
      sitemapUrls: [],
      disallowedPaths: [],
    }
  }
}

async function discoverPagesFromSitemaps(
  rootUrl: URL,
  robotsSitemapUrls: string[],
) {
  const sitemapQueue = new Set<string>()
  const checkedSitemaps = new Set<string>()
  const discoveredPageUrls = new Set<string>()

  for (const sitemapUrl of robotsSitemapUrls) {
    sitemapQueue.add(sitemapUrl)
  }

  for (const path of COMMON_SITEMAP_PATHS) {
    sitemapQueue.add(
      normalizeQueueUrl(
        new URL(path, rootUrl),
      ),
    )
  }

  while (
    sitemapQueue.size > 0 &&
    checkedSitemaps.size <
      MAX_SITEMAPS_PER_WEBSITE
  ) {
    const nextSitemap = sitemapQueue
      .values()
      .next().value as string | undefined

    if (!nextSitemap) {
      break
    }

    sitemapQueue.delete(nextSitemap)

    if (checkedSitemaps.has(nextSitemap)) {
      continue
    }

    checkedSitemaps.add(nextSitemap)

    let sitemapUrl: URL

    try {
      sitemapUrl = new URL(nextSitemap)
    } catch {
      continue
    }

    try {
      const result = await fetchText(
        sitemapUrl,
        "xml",
      )

      const entries = extractSitemapEntries(
        result.text,
        result.finalUrl,
        rootUrl.hostname,
      )

      for (const pageUrl of entries.pageUrls) {
        discoveredPageUrls.add(pageUrl)
      }

      for (
        const childSitemapUrl of
        entries.sitemapUrls
      ) {
        if (
          checkedSitemaps.size +
            sitemapQueue.size <
          MAX_SITEMAPS_PER_WEBSITE
        ) {
          sitemapQueue.add(
            childSitemapUrl,
          )
        }
      }
    } catch {
      /*
       * Sitemap discovery is optional.
       * One invalid sitemap must not stop
       * processing the remaining sitemap queue.
       */
    }
  }

  return prioritizePageUrls(
    Array.from(discoveredPageUrls),
    MAX_SITEMAP_PAGE_CANDIDATES,
  )
}

function addPageToQueue(
  queue: Map<string, PageQueueEntry>,
  checkedPages: Set<string>,
  url: URL,
  source: EmailSource,
  disallowedPaths: string[],
) {
  if (
    !isUrlAllowedByRobots(
      url,
      disallowedPaths,
    )
  ) {
    return
  }

  const normalizedUrl =
    normalizeQueueUrl(url)

  if (
    checkedPages.has(normalizedUrl) ||
    queue.has(normalizedUrl)
  ) {
    return
  }

  queue.set(normalizedUrl, {
    url: normalizedUrl,
    source,
  })
}

function addDiscoveredCandidate(
  candidates: Map<
    string,
    DiscoveredEmailCandidate
  >,
  candidate: DiscoveredEmailCandidate,
  websiteHostname: string,
) {
  const existingCandidate =
    candidates.get(candidate.email)

  if (!existingCandidate) {
    candidates.set(
      candidate.email,
      candidate,
    )

    return
  }

  const bestCandidate = chooseBestEmail(
    [existingCandidate, candidate],
    websiteHostname,
  )

  if (bestCandidate) {
    candidates.set(
      candidate.email,
      bestCandidate,
    )
  }
}

function takeNextPageBatch(
  pagesToVisit: Map<
    string,
    PageQueueEntry
  >,
  checkedPages: Set<string>,
  normalizedRootUrl: string,
  disallowedPaths: string[],
) {
  const batch: PageFetchTask[] = []

  while (
    pagesToVisit.size > 0 &&
    batch.length < PAGE_SCAN_CONCURRENCY &&
    checkedPages.size <
      MAX_PAGES_PER_WEBSITE
  ) {
    const nextEntry =
      pagesToVisit.values().next()
        .value as PageQueueEntry | undefined

    if (!nextEntry) {
      break
    }

    pagesToVisit.delete(nextEntry.url)

    if (
      checkedPages.has(nextEntry.url)
    ) {
      continue
    }

    let pageUrl: URL

    try {
      pageUrl = new URL(nextEntry.url)
    } catch {
      continue
    }

    if (
      nextEntry.url !== normalizedRootUrl &&
      !isUrlAllowedByRobots(
        pageUrl,
        disallowedPaths,
      )
    ) {
      continue
    }

    checkedPages.add(nextEntry.url)

    batch.push({
      entry: nextEntry,
      pageUrl,
    })
  }

  return batch
}

async function fetchPageTask(
  task: PageFetchTask,
): Promise<PageFetchResult> {
  try {
    const result = await fetchText(
      task.pageUrl,
      "html",
    )

    return {
      ok: true,
      entry: task.entry,
      pageUrl: task.pageUrl,
      result,
    }
  } catch (error) {
    return {
      ok: false,
      entry: task.entry,
      pageUrl: task.pageUrl,
      error:
        error instanceof Error
          ? error
          : new Error(
              "Unknown page scanning error.",
            ),
    }
  }
}

export async function scanWebsiteForEmail(
  website: string,
): Promise<WebsiteScanResult> {
  const rootUrl = normalizeWebsite(website)

  if (!rootUrl) {
    throw new Error(
      "Invalid website URL.",
    )
  }

  await assertPublicHostname(
    rootUrl.hostname,
  )

  const pagesToVisit =
    new Map<string, PageQueueEntry>()

  const checkedPages = new Set<string>()

  const discoveredEmails =
    new Map<
      string,
      DiscoveredEmailCandidate
    >()

  const errors: PageScanError[] = []

  const robotsDiscovery =
    await discoverFromRobots(rootUrl)

  const normalizedRootUrl =
    normalizeQueueUrl(rootUrl)

  pagesToVisit.set(
    normalizedRootUrl,
    {
      url: normalizedRootUrl,
      source: "homepage",
    },
  )

  for (const path of COMMON_CONTACT_PATHS) {
    addPageToQueue(
      pagesToVisit,
      checkedPages,
      new URL(path, rootUrl),
      "contact",
      robotsDiscovery.disallowedPaths,
    )
  }

  for (
    const robotsPageUrl of prioritizePageUrls(
      robotsDiscovery.pageUrls,
      MAX_ROBOTS_PAGE_CANDIDATES,
    )
  ) {
    try {
      addPageToQueue(
        pagesToVisit,
        checkedPages,
        new URL(robotsPageUrl),
        "robots",
        robotsDiscovery.disallowedPaths,
      )
    } catch {
      // Ignore malformed robots.txt URLs.
    }
  }

  const sitemapPageUrls =
    await discoverPagesFromSitemaps(
      rootUrl,
      robotsDiscovery.sitemapUrls,
    )

  for (const sitemapPageUrl of sitemapPageUrls) {
    try {
      addPageToQueue(
        pagesToVisit,
        checkedPages,
        new URL(sitemapPageUrl),
        "sitemap",
        robotsDiscovery.disallowedPaths,
      )
    } catch {
      // Ignore malformed sitemap URLs.
    }
  }

  let successfulPages = 0

  while (
    pagesToVisit.size > 0 &&
    checkedPages.size <
      MAX_PAGES_PER_WEBSITE
  ) {
    const pageBatch =
      takeNextPageBatch(
        pagesToVisit,
        checkedPages,
        normalizedRootUrl,
        robotsDiscovery.disallowedPaths,
      )

    if (!pageBatch.length) {
      break
    }

    /*
     * Network requests in the current batch run
     * concurrently. Promise.all preserves the input
     * order, so processing remains deterministic.
     */
    const pageResults =
      await Promise.all(
        pageBatch.map(fetchPageTask),
      )

    for (const pageResult of pageResults) {
      if ("error" in pageResult) {
  errors.push({
    url: pageResult.pageUrl.toString(),
    message: pageResult.error.message,
  })

  continue
}

      successfulPages += 1

      const sourceUrl =
        normalizeQueueUrl(
          pageResult.result.finalUrl,
        )

      const extractedCandidates =
        extractEmails(
          pageResult.result.text,
          pageResult.entry.source,
        )

      for (
        const extractedCandidate of
        extractedCandidates
      ) {
        addDiscoveredCandidate(
          discoveredEmails,
          {
            email:
              extractedCandidate.email,
            source:
              extractedCandidate.source,
            sourceUrl,
          },
          rootUrl.hostname,
        )
      }

      const remainingPageSlots =
        MAX_PAGES_PER_WEBSITE -
        checkedPages.size -
        pagesToVisit.size

      if (remainingPageSlots <= 0) {
        continue
      }

      const discoveredContactLinks =
        extractContactLinks(
          pageResult.result.text,
          pageResult.result.finalUrl,
          rootUrl.hostname,
        )

      for (
        const contactLink of
        prioritizePageUrls(
          discoveredContactLinks,
          remainingPageSlots,
        )
      ) {
        try {
          addPageToQueue(
            pagesToVisit,
            checkedPages,
            new URL(contactLink),
            "contact",
            robotsDiscovery.disallowedPaths,
          )
        } catch {
          // Ignore malformed contact links.
        }
      }
    }
  }

  const bestEmail = chooseBestEmail(
    Array.from(
      discoveredEmails.values(),
    ),
    rootUrl.hostname,
  )

  return {
    email:
      bestEmail?.email ?? null,
    emailSource:
      bestEmail?.source ?? null,
    emailSourceUrl:
      bestEmail?.sourceUrl ?? null,
    successfulPages,
    errors,
  }
}

export function classifyScanFailure(
  messages: string[],
): {
  status: Exclude<
    EmailScanStatus,
    "found" | "not_found"
  >
  error: string
} {
  const joinedMessage = messages
    .filter(Boolean)
    .join(" | ")
    .slice(0, 1000)

  const normalizedMessage =
    joinedMessage.toLowerCase()

  if (
    normalizedMessage.includes(
      "timed out",
    ) ||
    normalizedMessage.includes("abort")
  ) {
    return {
      status: "timeout",
      error:
        joinedMessage ||
        "Website request timed out.",
    }
  }

  if (
    normalizedMessage.includes(
      "invalid website",
    ) ||
    normalizedMessage.includes(
      "hostname could not be resolved",
    ) ||
    normalizedMessage.includes(
      "hostname has no ip address",
    ) ||
    normalizedMessage.includes(
      "blocked website hostname",
    ) ||
    normalizedMessage.includes(
      "blocked private ip",
    ) ||
    normalizedMessage.includes(
      "unsupported url",
    )
  ) {
    return {
      status: "invalid_site",
      error:
        joinedMessage ||
        "Invalid company website.",
    }
  }

  return {
    status: "failed",
    error:
      joinedMessage ||
      "Website could not be scanned.",
  }
}

export async function processCompanyLead(
  lead: ScannableCompanyLead,
): Promise<LeadScanResult> {
  try {
    const scanResult =
      await scanWebsiteForEmail(
        lead.website,
      )

    if (scanResult.email) {
      return {
        leadId: lead.id,
        companyName:
          lead.company_name,
        status: "found",
        email: scanResult.email,
        emailSource:
          scanResult.emailSource,
        emailSourceUrl:
          scanResult.emailSourceUrl,
        error: null,
      }
    }

    if (
      scanResult.successfulPages > 0
    ) {
      return {
        leadId: lead.id,
        companyName:
          lead.company_name,
        status: "not_found",
        email: null,
        emailSource: null,
        emailSourceUrl: null,
        error: null,
      }
    }

    const failure =
      classifyScanFailure(
        scanResult.errors.map(
          (scanError) =>
            scanError.message,
        ),
      )

    return {
      leadId: lead.id,
      companyName:
        lead.company_name,
      status: failure.status,
      email: null,
      emailSource: null,
      emailSourceUrl: null,
      error: failure.error,
    }
  } catch (error) {
    const failure =
      classifyScanFailure([
        error instanceof Error
          ? error.message
          : "Unknown website scanning error.",
      ])

    return {
      leadId: lead.id,
      companyName:
        lead.company_name,
      status: failure.status,
      email: null,
      emailSource: null,
      emailSourceUrl: null,
      error: failure.error,
    }
  }
}