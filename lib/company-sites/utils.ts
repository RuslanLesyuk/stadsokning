import {
  COMPANY_SITE_LOCALES,
  COMPANY_SITE_TEMPLATES,
  type CompanySiteContent,
  type CompanySiteLocale,
  type CompanySiteSectionSettings,
  type CompanySiteSeoSettings,
  type CompanySiteSocialLinks,
  type CompanySiteTemplate,
  type LocalizedSiteContent,
} from "./types"

export const DEFAULT_SECTION_SETTINGS: CompanySiteSectionSettings = {
  services: true,
  pricing: true,
  about: true,
  gallery: true,
  reviews: true,
  areas: true,
  hours: true,
  faq: true,
  contact: true,
}

export function isCompanySiteLocale(value: string): value is CompanySiteLocale {
  return COMPANY_SITE_LOCALES.includes(value as CompanySiteLocale)
}

export function normalizeSiteLocale(
  value: string | null | undefined,
  fallback: CompanySiteLocale = "sv",
): CompanySiteLocale {
  return value && isCompanySiteLocale(value) ? value : fallback
}

export function normalizeEnabledLocales(
  value: unknown,
  fallback: CompanySiteLocale = "sv",
): CompanySiteLocale[] {
  if (!Array.isArray(value)) return [fallback]

  const locales = Array.from(
    new Set(
      value.filter(
        (item): item is CompanySiteLocale =>
          typeof item === "string" && isCompanySiteLocale(item),
      ),
    ),
  )

  return locales.length > 0 ? locales : [fallback]
}

export function normalizeTemplate(value: string): CompanySiteTemplate {
  return COMPANY_SITE_TEMPLATES.includes(value as CompanySiteTemplate)
    ? (value as CompanySiteTemplate)
    : "modern"
}

export function normalizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim()
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed.toLowerCase() : fallback
}

export function slugifySite(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function normalizeCustomDomain(value: string | null | undefined) {
  if (!value) return null

  const trimmed = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .replace(/\.$/, "")

  if (!trimmed) return null

  if (
    trimmed.length > 253 ||
    !/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(
      trimmed,
    )
  ) {
    return null
  }

  return trimmed
}

export function normalizeExternalUrl(value: string | null | undefined) {
  if (!value) return ""
  const trimmed = value.trim()
  if (!trimmed) return ""
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  )
}

export function normalizeContent(value: unknown): CompanySiteContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}

  const source = value as Record<string, unknown>
  const result: CompanySiteContent = {}

  for (const locale of COMPANY_SITE_LOCALES) {
    const raw = source[locale]
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue

    const record = raw as Record<string, unknown>
    const content: LocalizedSiteContent = {}

    for (const key of [
      "hero_title",
      "hero_subtitle",
      "about_title",
      "about_text",
      "cta_title",
      "cta_text",
    ] as const) {
      const field = record[key]
      if (typeof field === "string" && field.trim()) {
        content[key] = field.trim()
      }
    }

    result[locale] = content
  }

  return result
}

export function normalizeSectionSettings(
  value: unknown,
): CompanySiteSectionSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...DEFAULT_SECTION_SETTINGS }
  }

  const source = value as Record<string, unknown>
  const result = { ...DEFAULT_SECTION_SETTINGS }

  for (const key of Object.keys(result) as Array<keyof typeof result>) {
    if (typeof source[key] === "boolean") result[key] = source[key] as boolean
  }

  return result
}

export function normalizeSocialLinks(value: unknown): CompanySiteSocialLinks {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}

  const source = value as Record<string, unknown>
  const result: CompanySiteSocialLinks = {}

  for (const key of ["facebook", "instagram", "linkedin", "tiktok"] as const) {
    const field = source[key]
    if (typeof field === "string" && field.trim()) {
      result[key] = normalizeExternalUrl(field)
    }
  }

  return result
}

export function normalizeSeoSettings(value: unknown): CompanySiteSeoSettings {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}

  const source = value as Record<string, unknown>
  const result: CompanySiteSeoSettings = {}

  for (const locale of COMPANY_SITE_LOCALES) {
    const raw = source[locale]
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue

    const record = raw as Record<string, unknown>
    const title = typeof record.title === "string" ? record.title.trim() : ""
    const description =
      typeof record.description === "string" ? record.description.trim() : ""

    result[locale] = {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    }
  }

  return result
}

export function getLocalizedContent(
  content: CompanySiteContent,
  locale: CompanySiteLocale,
  fallback: CompanySiteLocale,
): LocalizedSiteContent {
  return content[locale] || content[fallback] || content.sv || {}
}

export function getLocalizedSeo(
  seo: CompanySiteSeoSettings,
  locale: CompanySiteLocale,
  fallback: CompanySiteLocale,
) {
  return seo[locale] || seo[fallback] || seo.sv || {}
}

export function safeJsonForScript(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}
