import type { Locale } from "@/lib/i18n"

const localeTags: Record<Locale, string> = {
  sv: "sv-SE",
  en: "en-GB",
  uk: "uk-UA",
  ru: "ru-RU",
  pl: "pl-PL",
}

export function formatVacancyCreatedAt(value: string, locale: Locale) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(localeTags[locale] ?? "sv-SE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Stockholm",
  }).format(date)
}
