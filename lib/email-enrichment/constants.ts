export const DEFAULT_BATCH_SIZE = 10
export const MAX_BATCH_SIZE = 20

export const FETCH_TIMEOUT_MS = 7_000
export const MAX_HTML_SIZE_BYTES = 1_500_000
export const MAX_PAGES_PER_WEBSITE = 6
export const CONCURRENCY = 4

export const COMMON_CONTACT_PATHS = [
  "/kontakt",
  "/kontakta-oss",
  "/contact",
  "/contact-us",
  "/om-oss",
  "/about",
] as const

export const CONTACT_LINK_WORDS = [
  "kontakt",
  "kontakta",
  "contact",
  "contact-us",
  "om-oss",
  "about",
  "support",
  "kundservice",
] as const

export const BLOCKED_EMAIL_PREFIXES = [
  "noreply",
  "no-reply",
  "donotreply",
  "do-not-reply",
  "mailer-daemon",
  "postmaster",
  "abuse",
] as const

export const BLOCKED_EMAIL_DOMAINS = [
  "example.com",
  "example.org",
  "example.net",
  "sentry.io",
  "wixpress.com",
  "wordpress.org",
  "schema.org",
] as const

export const BLOCKED_EMAIL_EXTENSIONS = [
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
] as const