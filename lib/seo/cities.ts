import { seoMunicipalities } from "./data"
import type { SeoCity } from "./types"

export const seoCities: SeoCity[] = seoMunicipalities.map((municipality) => ({
  slug: municipality.slug,
  name: municipality.name.sv,
  region: municipality.region,
}))