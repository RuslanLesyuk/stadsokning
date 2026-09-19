export const VACANCY_LIMITS = {
  title: 140,
  companyName: 160,
  personName: 160,
  city: 120,
  description: 10_000,
  schedule: 160,
  salary: 160,
  requirements: 5_000,
  contactEmail: 320,
  contactPhone: 60,
  applicationName: 160,
  applicationMessage: 3_000,
} as const

export function vacancySlugPart(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/å/g, "a")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
}

export function buildVacancySlug(input: {
  title: string
  identityName: string
  city: string
  id: string
}) {
  const base = [input.title, input.identityName, input.city]
    .map(vacancySlugPart)
    .filter(Boolean)
    .join("-")
    .slice(0, 92)

  return `${base || "ledigt-jobb"}-${input.id.slice(0, 8)}`
}

export function isLikelyEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
