export const COMPANY_LEAD_STATUSES = [
  "new",
  "viewed",
  "contacted",
  "qualified",
  "quoted",
  "won",
  "lost",
  "archived",
] as const

export type CompanyLeadStatus = (typeof COMPANY_LEAD_STATUSES)[number]

export const COMPANY_LEAD_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const

export type CompanyLeadPriority = (typeof COMPANY_LEAD_PRIORITIES)[number]

export const COMPANY_LEAD_SOURCES = [
  "company_profile",
  "company_site",
  "marketplace",
  "manual",
  "admin",
  "seo",
  "google",
  "other",
] as const

export type CompanyLeadSource = (typeof COMPANY_LEAD_SOURCES)[number]

export type CompanyLeadType = "direct" | "marketplace" | "distributed"
export type CompanyLeadAccess = "included" | "paid" | "locked"
