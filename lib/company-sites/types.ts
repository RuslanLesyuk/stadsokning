export const COMPANY_SITE_LOCALES = ["sv", "en", "uk", "ru", "pl"] as const
export type CompanySiteLocale = (typeof COMPANY_SITE_LOCALES)[number]

export const COMPANY_SITE_TEMPLATES = ["modern", "minimal", "elegant"] as const
export type CompanySiteTemplate = (typeof COMPANY_SITE_TEMPLATES)[number]

export type CompanySiteStatus = "draft" | "published"
export type CompanyDomainStatus =
  | "not_configured"
  | "pending"
  | "verified"
  | "failed"

export type LocalizedSiteContent = {
  hero_title?: string
  hero_subtitle?: string
  about_title?: string
  about_text?: string
  cta_title?: string
  cta_text?: string
}

export type CompanySiteContent = Partial<
  Record<CompanySiteLocale, LocalizedSiteContent>
>

export type CompanySiteSectionSettings = {
  services: boolean
  pricing: boolean
  about: boolean
  gallery: boolean
  reviews: boolean
  areas: boolean
  hours: boolean
  faq: boolean
  contact: boolean
}

export type CompanySiteSocialLinks = {
  facebook?: string
  instagram?: string
  linkedin?: string
  tiktok?: string
}

export type LocalizedSeoSettings = {
  title?: string
  description?: string
}

export type CompanySiteSeoSettings = Partial<
  Record<CompanySiteLocale, LocalizedSeoSettings>
>

export type CompanySiteRow = {
  id: string
  company_id: string
  site_slug: string
  status: CompanySiteStatus
  template: CompanySiteTemplate
  primary_color: string
  secondary_color: string
  default_locale: CompanySiteLocale
  enabled_locales: string[]
  content: unknown
  section_settings: unknown
  social_links: unknown
  seo_settings: unknown
  custom_domain: string | null
  domain_status: CompanyDomainStatus
  remove_clean_jobs_branding?: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export type CompanySiteCompany = {
  id: string
  name: string
  slug: string
  city: string | null
  address: string | null
  postal_code: string | null
  organization_number: string | null
  founded_year: number | null
  website: string | null
  phone: string | null
  email: string | null
  description: string | null
  logo_url: string | null
  cover_url: string | null
  gallery_urls: unknown
  service_types: unknown
  service_areas: unknown
  languages: unknown
  hourly_rate: number | null
  minimum_order: number | null
  rut_available: boolean | null
  working_hours: unknown
  faq: unknown
  verified: boolean | null
  owner_id: string | null
  updated_at: string | null
}

export type CompanySiteReview = {
  id: string
  reviewer_id: string | null
  rating: number
  comment: string | null
  created_at: string
  reviewer_name?: string | null
  reviewer_avatar_url?: string | null
}
