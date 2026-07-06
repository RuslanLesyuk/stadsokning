import { createSeoBreadcrumbs } from "./breadcrumbs"
import { createSeoContent } from "./content"
import { seoCities } from "./cities"
import { createSeoMetadata } from "./metadata"
import { createRelatedContent } from "./related"
import { createSeoSchema } from "./schema"
import { seoServices } from "./services"

import type { SeoLocale } from "./types"

type Params = {
  locale: SeoLocale
  citySlug: string
  serviceSlug: string
}

export function createSeoEngine({ locale, citySlug, serviceSlug }: Params) {
  const city = seoCities.find((item) => item.slug === citySlug)
  const service = seoServices.find((item) => item.slug === serviceSlug)

  if (!city || !service) {
    return null
  }

  const content = createSeoContent({
    locale,
    city,
    service,
  })

  const metadata = createSeoMetadata({
    locale,
    city,
    service,
    title: content.hero.title,
    description: content.hero.text,
  })

  const schema = createSeoSchema({
    locale,
    city,
    service,
  })

  const breadcrumbs = createSeoBreadcrumbs({
    locale,
    city,
    service,
  })

  const related = createRelatedContent({
    locale,
    city,
    service,
  })

  return {
    locale,
    city,
    service,
    content,
    metadata,
    schema,
    breadcrumbs,
    related,
  }
}