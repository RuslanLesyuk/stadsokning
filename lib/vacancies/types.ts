export const VACANCY_LISTING_TYPES = ["job_offer", "job_seeker"] as const

export type VacancyListingType = (typeof VACANCY_LISTING_TYPES)[number]

export function isVacancyListingType(value: string): value is VacancyListingType {
  return (VACANCY_LISTING_TYPES as readonly string[]).includes(value)
}

export function listingTypeFromQuery(value?: string | null): VacancyListingType {
  return value === "seeking" ? "job_seeker" : "job_offer"
}

export function listingTypeQueryValue(type: VacancyListingType) {
  return type === "job_seeker" ? "seeking" : "offering"
}
