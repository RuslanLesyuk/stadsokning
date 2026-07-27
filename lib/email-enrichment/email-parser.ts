import {
  BLOCKED_EMAIL_DOMAINS,
  BLOCKED_EMAIL_EXTENSIONS,
  BLOCKED_EMAIL_PREFIXES,
} from "./constants"
import type {
  EmailSource,
  ExtractedEmailCandidate,
} from "./types"

const EMAIL_PATTERN =
  /[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/gi

const MAILTO_PATTERN =
  /mailto:([^"'<>?\s]+)/gi

const SPACED_EMAIL_PATTERN =
  /([a-z0-9._%+-]+)\s*(?:\(|\[)?\s*(?:at|snabel-a)\s*(?:\)|\])?\s*([a-z0-9.-]+)\s*(?:\(|\[)?\s*(?:dot|punkt)\s*(?:\)|\])?\s*([a-z]{2,})/gi

const JSON_LD_SCRIPT_PATTERN =
  /<script\b[^>]*type\s*=\s*["']application\/ld\+json(?:\s*;\s*charset=[^"']+)?["'][^>]*>([\s\S]*?)<\/script>/gi

const JAVASCRIPT_SCRIPT_PATTERN =
  /<script\b(?![^>]*type\s*=\s*["']application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/gi

const CLOUDFLARE_DATA_PATTERN =
  /\bdata-cfemail\s*=\s*["']([a-f0-9]+)["']/gi

const CLOUDFLARE_LINK_PATTERN =
  /\/cdn-cgi\/l\/email-protection#([a-f0-9]+)/gi

const JS_STRING_LITERAL_SOURCE =
  String.raw`(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|` +
  String.raw`\`(?:\\.|[^\\` +
  "`" +
  String.raw`])*\`)`

const JS_STRING_LITERAL_PATTERN = new RegExp(
  JS_STRING_LITERAL_SOURCE,
  "g",
)

const JS_STRING_CONCATENATION_PATTERN = new RegExp(
  `(${JS_STRING_LITERAL_SOURCE}(?:\\s*\\+\\s*${JS_STRING_LITERAL_SOURCE}){1,12})`,
  "g",
)

const JS_ARRAY_JOIN_PATTERN = new RegExp(
  `\\[((?:\\s*${JS_STRING_LITERAL_SOURCE}\\s*,){1,12}\\s*${JS_STRING_LITERAL_SOURCE}\\s*)\\]` +
    `\\s*\\.\\s*join\\s*\\(\\s*(${JS_STRING_LITERAL_SOURCE})?\\s*\\)`,
  "gi",
)

const JS_FROM_CHAR_CODE_PATTERN =
  /\bString\s*\.\s*fromCharCode\s*\(\s*([0-9a-fx+\-,\s]{3,1500})\s*\)/gi

const JS_FROM_CODE_POINT_PATTERN =
  /\bString\s*\.\s*fromCodePoint\s*\(\s*([0-9a-fx+\-,\s]{3,1500})\s*\)/gi

const JS_ATOB_PATTERN = new RegExp(
  `\\batob\\s*\\(\\s*(${JS_STRING_LITERAL_SOURCE})\\s*\\)`,
  "gi",
)

const JS_DECODE_URI_PATTERN = new RegExp(
  `\\bdecodeURIComponent\\s*\\(\\s*(${JS_STRING_LITERAL_SOURCE})\\s*\\)`,
  "gi",
)

const JS_UNESCAPE_PATTERN = new RegExp(
  `\\bunescape\\s*\\(\\s*(${JS_STRING_LITERAL_SOURCE})\\s*\\)`,
  "gi",
)

const JS_REVERSED_STRING_PATTERN = new RegExp(
  `(${JS_STRING_LITERAL_SOURCE})` +
    `\\s*\\.\\s*split\\s*\\(\\s*(?:""|'')\\s*\\)` +
    `\\s*\\.\\s*reverse\\s*\\(\\s*\\)` +
    `\\s*\\.\\s*join\\s*\\(\\s*(?:""|'')\\s*\\)`,
  "gi",
)

const MAX_JSON_LD_LENGTH = 500_000
const MAX_JAVASCRIPT_LENGTH = 1_000_000
const MAX_JSON_DEPTH = 20
const MAX_CLOUDFLARE_VALUE_LENGTH = 1024
const MAX_JAVASCRIPT_DECODED_LENGTH = 10_000
const MAX_CHAR_CODE_VALUES = 320

const SOURCE_PRIORITY: Record<EmailSource, number> = {
  mailto: 80,
  json_ld: 70,
  cloudflare: 65,
  javascript: 60,
  contact: 50,
  homepage: 40,
  robots: 30,
  sitemap: 20,
}

export function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&commat;", "@")
    .replaceAll("&#64;", "@")
    .replaceAll("&#064;", "@")
    .replaceAll("&#x40;", "@")
    .replaceAll("&#X40;", "@")
    .replaceAll("&period;", ".")
    .replaceAll("&#46;", ".")
    .replaceAll("&#046;", ".")
    .replaceAll("&#x2e;", ".")
    .replaceAll("&#X2E;", ".")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#34;", '"')
    .replaceAll("&#x22;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
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
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..")
  ) {
    return false
  }

  if (
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
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

function addEmailCandidate(
  candidates: Map<string, ExtractedEmailCandidate>,
  value: string,
  source: EmailSource,
) {
  const email = normalizeEmailCandidate(value)

  if (!isValidEmailCandidate(email)) {
    return
  }

  const existingCandidate =
    candidates.get(email)

  if (
    !existingCandidate ||
    SOURCE_PRIORITY[source] >
      SOURCE_PRIORITY[existingCandidate.source]
  ) {
    candidates.set(email, {
      email,
      source,
    })
  }
}

function extractEmailsFromText(
  value: string,
  candidates: Map<string, ExtractedEmailCandidate>,
  defaultSource: EmailSource,
) {
  const decodedValue = decodeHtmlEntities(value)

  for (const match of decodedValue.matchAll(
    MAILTO_PATTERN,
  )) {
    addEmailCandidate(
      candidates,
      match[1] || "",
      "mailto",
    )
  }

  for (const match of decodedValue.matchAll(
    EMAIL_PATTERN,
  )) {
    addEmailCandidate(
      candidates,
      match[0] || "",
      defaultSource,
    )
  }

  for (const match of decodedValue.matchAll(
    SPACED_EMAIL_PATTERN,
  )) {
    addEmailCandidate(
      candidates,
      `${match[1]}@${match[2]}.${match[3]}`,
      defaultSource,
    )
  }
}

function sanitizeJsonLd(value: string) {
  return decodeHtmlEntities(value)
    .replace(/^\uFEFF/, "")
    .replace(
      /^\s*<!--([\s\S]*?)-->\s*$/,
      "$1",
    )
    .replace(
      /^\s*\/\*<!\[CDATA\[\*\/([\s\S]*?)\/\*\]\]>\*\/\s*$/,
      "$1",
    )
    .replace(
      /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/,
      "$1",
    )
    .trim()
}

function isEmailRelatedJsonKey(key: string) {
  const normalizedKey = key
    .trim()
    .toLowerCase()
    .replace(/[-_\s]/g, "")

  return (
    normalizedKey === "email" ||
    normalizedKey === "emailaddress" ||
    normalizedKey === "contactemail" ||
    normalizedKey === "mail" ||
    normalizedKey === "contactpoint"
  )
}

function collectEmailsFromJsonValue(
  value: unknown,
  candidates: Map<string, ExtractedEmailCandidate>,
  depth = 0,
  parentKey = "",
) {
  if (
    depth > MAX_JSON_DEPTH ||
    value === null ||
    value === undefined
  ) {
    return
  }

  if (typeof value === "string") {
    if (
      isEmailRelatedJsonKey(parentKey) ||
      value.includes("@") ||
      value.toLowerCase().includes("mailto:")
    ) {
      extractEmailsFromText(
        value,
        candidates,
        "json_ld",
      )
    }

    return
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectEmailsFromJsonValue(
        item,
        candidates,
        depth + 1,
        parentKey,
      )
    }

    return
  }

  if (typeof value !== "object") {
    return
  }

  for (const [key, nestedValue] of Object.entries(
    value as Record<string, unknown>,
  )) {
    collectEmailsFromJsonValue(
      nestedValue,
      candidates,
      depth + 1,
      key,
    )
  }
}

function extractJsonLdEmails(
  html: string,
  candidates: Map<string, ExtractedEmailCandidate>,
) {
  for (const match of html.matchAll(
    JSON_LD_SCRIPT_PATTERN,
  )) {
    const rawJsonLd = match[1] || ""

    if (
      !rawJsonLd ||
      rawJsonLd.length > MAX_JSON_LD_LENGTH
    ) {
      continue
    }

    const sanitizedJsonLd =
      sanitizeJsonLd(rawJsonLd)

    if (!sanitizedJsonLd) {
      continue
    }

    try {
      const parsedJsonLd: unknown =
        JSON.parse(sanitizedJsonLd)

      collectEmailsFromJsonValue(
        parsedJsonLd,
        candidates,
      )
    } catch {
      extractEmailsFromText(
        sanitizedJsonLd,
        candidates,
        "json_ld",
      )
    }
  }
}

function decodeCloudflareEmail(
  encodedValue: string,
) {
  const normalizedValue = encodedValue
    .trim()
    .toLowerCase()

  if (
    normalizedValue.length < 4 ||
    normalizedValue.length >
      MAX_CLOUDFLARE_VALUE_LENGTH ||
    normalizedValue.length % 2 !== 0 ||
    !/^[a-f0-9]+$/.test(normalizedValue)
  ) {
    return null
  }

  const key = Number.parseInt(
    normalizedValue.slice(0, 2),
    16,
  )

  if (!Number.isFinite(key)) {
    return null
  }

  let decodedEmail = ""

  for (
    let index = 2;
    index < normalizedValue.length;
    index += 2
  ) {
    const encodedByte = Number.parseInt(
      normalizedValue.slice(index, index + 2),
      16,
    )

    if (!Number.isFinite(encodedByte)) {
      return null
    }

    decodedEmail += String.fromCharCode(
      encodedByte ^ key,
    )
  }

  return decodedEmail
}

function extractCloudflareEmails(
  html: string,
  candidates: Map<string, ExtractedEmailCandidate>,
) {
  const encodedValues = new Set<string>()

  for (const match of html.matchAll(
    CLOUDFLARE_DATA_PATTERN,
  )) {
    if (match[1]) {
      encodedValues.add(match[1])
    }
  }

  for (const match of html.matchAll(
    CLOUDFLARE_LINK_PATTERN,
  )) {
    if (match[1]) {
      encodedValues.add(match[1])
    }
  }

  for (const encodedValue of encodedValues) {
    const decodedEmail =
      decodeCloudflareEmail(encodedValue)

    if (decodedEmail) {
      addEmailCandidate(
        candidates,
        decodedEmail,
        "cloudflare",
      )
    }
  }
}

function decodeJavascriptStringLiteral(
  literal: string,
) {
  const trimmedLiteral = literal.trim()

  if (trimmedLiteral.length < 2) {
    return null
  }

  const quote = trimmedLiteral[0]

  if (
    (quote !== '"' &&
      quote !== "'" &&
      quote !== "`") ||
    trimmedLiteral.at(-1) !== quote
  ) {
    return null
  }

  const rawValue = trimmedLiteral.slice(1, -1)

  if (
    quote === "`" &&
    rawValue.includes("${")
  ) {
    return null
  }

  try {
    const decodedValue = rawValue
      .replace(
        /\\u\{([0-9a-f]{1,6})\}/gi,
        (_, hexadecimalValue: string) => {
          const codePoint = Number.parseInt(
            hexadecimalValue,
            16,
          )

          if (
            !Number.isFinite(codePoint) ||
            codePoint > 0x10ffff
          ) {
            return ""
          }

          return String.fromCodePoint(codePoint)
        },
      )
      .replace(
        /\\u([0-9a-f]{4})/gi,
        (_, hexadecimalValue: string) =>
          String.fromCharCode(
            Number.parseInt(
              hexadecimalValue,
              16,
            ),
          ),
      )
      .replace(
        /\\x([0-9a-f]{2})/gi,
        (_, hexadecimalValue: string) =>
          String.fromCharCode(
            Number.parseInt(
              hexadecimalValue,
              16,
            ),
          ),
      )
      .replace(/\\0(?![0-9])/g, "\0")
      .replace(/\\b/g, "\b")
      .replace(/\\f/g, "\f")
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\v/g, "\v")
      .replace(/\\(["'`\\/])/g, "$1")

    if (
      decodedValue.length >
      MAX_JAVASCRIPT_DECODED_LENGTH
    ) {
      return null
    }

    return decodeHtmlEntities(decodedValue)
  } catch {
    return null
  }
}

function decodeCharacterCodeList(
  rawValues: string,
  useCodePoints: boolean,
) {
  const values = rawValues
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (
    !values.length ||
    values.length > MAX_CHAR_CODE_VALUES
  ) {
    return null
  }

  const characterCodes: number[] = []

  for (const value of values) {
    if (
      !/^(?:0x[0-9a-f]+|\d+)$/i.test(value)
    ) {
      return null
    }

    const characterCode = value
      .toLowerCase()
      .startsWith("0x")
      ? Number.parseInt(value.slice(2), 16)
      : Number.parseInt(value, 10)

    if (!Number.isFinite(characterCode)) {
      return null
    }

    if (
      useCodePoints &&
      (characterCode < 0 ||
        characterCode > 0x10ffff)
    ) {
      return null
    }

    if (
      !useCodePoints &&
      (characterCode < 0 ||
        characterCode > 0xffff)
    ) {
      return null
    }

    characterCodes.push(characterCode)
  }

  try {
    return useCodePoints
      ? String.fromCodePoint(...characterCodes)
      : String.fromCharCode(...characterCodes)
  } catch {
    return null
  }
}

function decodeBase64Value(value: string) {
  const normalizedValue = value
    .replace(/\s+/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/")

  if (
    normalizedValue.length < 4 ||
    normalizedValue.length > 20_000 ||
    !/^[a-z0-9+/]*={0,2}$/i.test(
      normalizedValue,
    )
  ) {
    return null
  }

  try {
    const decodedValue = Buffer.from(
      normalizedValue,
      "base64",
    ).toString("utf8")

    return decodedValue.length <=
      MAX_JAVASCRIPT_DECODED_LENGTH
      ? decodedValue
      : null
  } catch {
    return null
  }
}

function decodeLegacyJavascriptEscape(
  value: string,
) {
  try {
    return value
      .replace(
        /%u([0-9a-f]{4})/gi,
        (_, hexadecimalValue: string) =>
          String.fromCharCode(
            Number.parseInt(
              hexadecimalValue,
              16,
            ),
          ),
      )
      .replace(
        /%([0-9a-f]{2})/gi,
        (_, hexadecimalValue: string) =>
          String.fromCharCode(
            Number.parseInt(
              hexadecimalValue,
              16,
            ),
          ),
      )
  } catch {
    return null
  }
}

function extractJavascriptEmailsFromSource(
  javascript: string,
  candidates: Map<string, ExtractedEmailCandidate>,
) {
  if (
    !javascript ||
    javascript.length > MAX_JAVASCRIPT_LENGTH
  ) {
    return
  }

  for (const match of javascript.matchAll(
    JS_STRING_CONCATENATION_PATTERN,
  )) {
    const expression = match[1] || ""
    const parts: string[] = []

    for (const literalMatch of expression.matchAll(
      JS_STRING_LITERAL_PATTERN,
    )) {
      const decoded =
        decodeJavascriptStringLiteral(
          literalMatch[0],
        )

      if (decoded === null) {
        parts.length = 0
        break
      }

      parts.push(decoded)
    }

    if (parts.length >= 2) {
      extractEmailsFromText(
        parts.join(""),
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_ARRAY_JOIN_PATTERN,
  )) {
    const values: string[] = []

    for (
      const literalMatch of (
        match[1] || ""
      ).matchAll(JS_STRING_LITERAL_PATTERN)
    ) {
      const decoded =
        decodeJavascriptStringLiteral(
          literalMatch[0],
        )

      if (decoded === null) {
        values.length = 0
        break
      }

      values.push(decoded)
    }

    const separator =
      match[2] === undefined
        ? ","
        : decodeJavascriptStringLiteral(
            match[2],
          )

    if (
      values.length >= 2 &&
      separator !== null
    ) {
      extractEmailsFromText(
        values.join(separator),
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_FROM_CHAR_CODE_PATTERN,
  )) {
    const decoded = decodeCharacterCodeList(
      match[1] || "",
      false,
    )

    if (decoded) {
      extractEmailsFromText(
        decoded,
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_FROM_CODE_POINT_PATTERN,
  )) {
    const decoded = decodeCharacterCodeList(
      match[1] || "",
      true,
    )

    if (decoded) {
      extractEmailsFromText(
        decoded,
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_ATOB_PATTERN,
  )) {
    const encoded =
      decodeJavascriptStringLiteral(
        match[1] || "",
      )

    const decoded = encoded
      ? decodeBase64Value(encoded)
      : null

    if (decoded) {
      extractEmailsFromText(
        decoded,
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_DECODE_URI_PATTERN,
  )) {
    const encoded =
      decodeJavascriptStringLiteral(
        match[1] || "",
      )

    if (!encoded) {
      continue
    }

    try {
      extractEmailsFromText(
        decodeURIComponent(encoded),
        candidates,
        "javascript",
      )
    } catch {
      // Ignore malformed encoding.
    }
  }

  for (const match of javascript.matchAll(
    JS_UNESCAPE_PATTERN,
  )) {
    const encoded =
      decodeJavascriptStringLiteral(
        match[1] || "",
      )

    const decoded = encoded
      ? decodeLegacyJavascriptEscape(encoded)
      : null

    if (decoded) {
      extractEmailsFromText(
        decoded,
        candidates,
        "javascript",
      )
    }
  }

  for (const match of javascript.matchAll(
    JS_REVERSED_STRING_PATTERN,
  )) {
    const reversed =
      decodeJavascriptStringLiteral(
        match[1] || "",
      )

    if (reversed) {
      extractEmailsFromText(
        Array.from(reversed)
          .reverse()
          .join(""),
        candidates,
        "javascript",
      )
    }
  }
}

function extractJavascriptEmails(
  html: string,
  candidates: Map<string, ExtractedEmailCandidate>,
) {
  for (const match of html.matchAll(
    JAVASCRIPT_SCRIPT_PATTERN,
  )) {
    extractJavascriptEmailsFromSource(
      match[1] || "",
      candidates,
    )
  }

  if (html.length <= MAX_JAVASCRIPT_LENGTH) {
    extractJavascriptEmailsFromSource(
      html,
      candidates,
    )
  }
}

export function extractEmails(
  html: string,
  pageSource: EmailSource,
) {
  const candidates =
    new Map<string, ExtractedEmailCandidate>()

  extractEmailsFromText(
    html,
    candidates,
    pageSource,
  )

  extractJsonLdEmails(html, candidates)
  extractCloudflareEmails(html, candidates)
  extractJavascriptEmails(html, candidates)

  return Array.from(candidates.values())
}