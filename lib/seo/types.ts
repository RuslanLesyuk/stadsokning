export const seoLocales = ["uk", "ru", "en", "sv", "pl"] as const

export type SeoLocale = (typeof seoLocales)[number]

export type SeoCity = {
  slug: string
  name: string
  region?: string
}

export type SeoService = {
  slug: string
  name: Record<SeoLocale, string>
  shortName: Record<SeoLocale, string>
  serviceType: string
}

export type SeoPageKind =
  | "service-city"
  | "jobs-city"
  | "company-city"
  | "guide"

export type SeoPageInput = {
  locale: SeoLocale
  city: SeoCity
  service?: SeoService
  kind: SeoPageKind
  path: string
}

export type SeoGeneratedPage = {
  title: string
  description: string
  heroEyebrow: string
  heroTitle: string
  heroText: string
  primaryCta: string
  secondaryCta: string
  sections: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }[]
  faq: {
    question: string
    answer: string
  }[]
}