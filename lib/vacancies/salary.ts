import type { Locale } from "@/lib/i18n"

const units: Record<Locale, string> = {
  sv: "SEK / timme",
  en: "SEK / hour",
  uk: "SEK / год",
  ru: "SEK / час",
  pl: "SEK / godz.",
}

export function formatVacancySalary(value: string | null | undefined, locale: Locale) {
  if (!value) return null
  const trimmed = value.trim()
  if (!/^\d+(?:[.,]\d+)?$/.test(trimmed)) return trimmed
  return `${trimmed.replace(",", ".")} ${units[locale]}`
}
