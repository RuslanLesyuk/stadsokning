import { seoServiceData } from "./data"
import type { SeoService } from "./types"

export const seoServices: SeoService[] = seoServiceData.map((service) => ({
  slug: service.slug,
  name: service.name,
  shortName: service.shortName,
  serviceType: service.serviceType,
}))