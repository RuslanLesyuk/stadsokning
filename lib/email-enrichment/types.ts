export type EmailScanStatus =
  | "found"
  | "not_found"
  | "timeout"
  | "invalid_site"
  | "failed"

export type EmailSource =
  | "homepage"
  | "contact"
  | "json_ld"
  | "mailto"
  | "cloudflare"
  | "javascript"
  | "robots"
  | "sitemap"

export type CompanyLead = {
  id: string
  company_name: string
  website: string
}

export type PageScanError = {
  url: string
  message: string
}

export type ExtractedEmailCandidate = {
  email: string
  source: EmailSource
}

export type DiscoveredEmailCandidate = {
  email: string
  source: EmailSource
  sourceUrl: string
}

export type WebsiteScanResult = {
  email: string | null
  emailSource: EmailSource | null
  emailSourceUrl: string | null
  successfulPages: number
  errors: PageScanError[]
}

export type ScanResult = {
  leadId: string
  companyName: string
  status: EmailScanStatus
  email: string | null
  emailSource: EmailSource | null
  emailSourceUrl: string | null
  error: string | null
}

export type LeadScanResult = {
  leadId: string
  companyName: string
  status: EmailScanStatus
  email: string | null
  emailSource: EmailSource | null
  emailSourceUrl: string | null
  error: string | null
}

export type ScannableCompanyLead = {
  id: string
  company_name: string
  website: string
}