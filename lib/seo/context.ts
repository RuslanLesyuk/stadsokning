import { seoCounties, seoMunicipalities, seoServiceData } from "./data"
import type { SeoLocale } from "./types"

export type SeoPageContextInput = {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}

export function getSeoPageContext(input: SeoPageContextInput) {
  const municipality = seoMunicipalities.find(
    (item) => item.slug === input.citySlug,
  )

  const service = seoServiceData.find((item) => item.slug === input.serviceSlug)

  if (!municipality || !service) {
    return null
  }

  const county = seoCounties.find(
    (item) => item.slug === municipality.countySlug,
  )

  return {
    locale: input.locale,

    municipality: {
      slug: municipality.slug,
      name: municipality.name[input.locale],
      defaultName: municipality.name.sv,
      region: municipality.region,
      countySlug: municipality.countySlug,
      population: municipality.population,
      coordinates: municipality.coordinates,
      aliases: municipality.aliases,
      priority: municipality.priority,
    },

    county: county
      ? {
          slug: county.slug,
          name: county.name[input.locale],
          defaultName: county.name.sv,
        }
      : null,

    service: {
      slug: service.slug,
      name: service.name[input.locale],
      defaultName: service.name.sv,
      shortName: service.shortName[input.locale],
      defaultShortName: service.shortName.sv,
      serviceType: service.serviceType,
      category: service.category,
      priority: service.priority,
      aliases: service.aliases,
    },
  }
}