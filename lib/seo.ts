import { SUPPORTED_LOCALES } from "@/lib/i18n"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export function getLanguageAlternates(pathname: string) {
  return SUPPORTED_LOCALES.reduce(
    (acc, locale) => {
      acc[locale] = `${siteUrl}${pathname}?lang=${locale}`
      return acc
    },
    {} as Record<string, string>,
  )
}