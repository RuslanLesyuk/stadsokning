import { seoMunicipalities } from "@/lib/seo/data/municipalities"

const collator = new Intl.Collator("sv-SE", { sensitivity: "base" })

export const vacancyCities = Array.from(
  new Set(
    seoMunicipalities
      .map((municipality) => municipality.name.sv.trim())
      .filter(Boolean),
  ),
).sort((a, b) => collator.compare(a, b))

export const vacancyPopularCities = [
  "Stockholm",
  "Göteborg",
  "Malmö",
  "Uppsala",
  "Västerås",
  "Örebro",
  "Linköping",
  "Helsingborg",
  "Jönköping",
  "Norrköping",
  "Lund",
  "Umeå",
] as const

export function mergeVacancyCities(extraCities: Array<string | null | undefined>) {
  return Array.from(
    new Set([
      ...extraCities.map((city) => String(city || "").trim()).filter(Boolean),
      ...vacancyCities,
    ]),
  ).sort((a, b) => collator.compare(a, b))
}
