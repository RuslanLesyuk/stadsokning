import { SEO_SITE_URL, SEO_SUPPORTED_LOCALES } from "@/lib/seo/constants"

function normalizePath(pathname: string) {
  if (!pathname.startsWith("/")) {
    return `/${pathname}`
  }

  return pathname
}

export function getLanguageAlternates(pathname: string) {
  const normalizedPath = normalizePath(pathname)

  const languages = SEO_SUPPORTED_LOCALES.reduce(
    (acc, locale) => {
      const localizedPath =
        locale === "sv" ? normalizedPath : `/${locale}${normalizedPath}`

      acc[locale] = `${SEO_SITE_URL}${localizedPath}`

      return acc
    },
    {} as Record<string, string>,
  )

  return {
    ...languages,
    "x-default": `${SEO_SITE_URL}${normalizedPath}`,
  }
}