import {
  COMPANY_LEAD_PRIORITIES,
  COMPANY_LEAD_SOURCES,
  COMPANY_LEAD_STATUSES,
  type CompanyLeadPriority,
  type CompanyLeadSource,
  type CompanyLeadStatus,
} from "./types"

export function normalizeCompanyLeadStatus(value: unknown): CompanyLeadStatus {
  return COMPANY_LEAD_STATUSES.includes(value as CompanyLeadStatus)
    ? (value as CompanyLeadStatus)
    : "new"
}

export function normalizeCompanyLeadPriority(value: unknown): CompanyLeadPriority {
  return COMPANY_LEAD_PRIORITIES.includes(value as CompanyLeadPriority)
    ? (value as CompanyLeadPriority)
    : "normal"
}

export function normalizeCompanyLeadSource(value: unknown): CompanyLeadSource {
  return COMPANY_LEAD_SOURCES.includes(value as CompanyLeadSource)
    ? (value as CompanyLeadSource)
    : "company_profile"
}

export function inferCompanyLeadSource(sourcePath: string) {
  if (sourcePath.startsWith("/site/")) return "company_site" as const
  if (sourcePath.startsWith("/companies/")) return "company_profile" as const
  return "company_profile" as const
}

export function sanitizeCompanyLeadSourcePath(value: string, companySlug: string) {
  const fallback = `/companies/${companySlug}`
  if (!value.startsWith("/")) return fallback
  return value.slice(0, 500)
}
