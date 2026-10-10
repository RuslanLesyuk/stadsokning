import { notFound } from "next/navigation"

import { createSeoEngine } from "@/lib/seo/index"
import { SeoPage } from "@/lib/seo/page"
import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"
import type { SeoLocale } from "@/lib/seo/types"

export const revalidate = 86400

type PageProps = {
  params: Promise<{
    city: string
    service: string
  }>
}

const DEFAULT_LOCALE: SeoLocale = "sv"

export function generateStaticParams() {
  return seoCities.flatMap((city) =>
    seoServices.map((service) => ({
      city: city.slug,
      service: service.slug,
    })),
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { city, service } = await params

  const seo = createSeoEngine({
    locale: DEFAULT_LOCALE,
    citySlug: city,
    serviceSlug: service,
  })

  if (!seo) {
    return {}
  }

  return seo.metadata
}

export default async function SeoDynamicPage({ params }: PageProps) {
  const { city, service } = await params

  const seo = createSeoEngine({
    locale: DEFAULT_LOCALE,
    citySlug: city,
    serviceSlug: service,
  })

  if (!seo) {
    notFound()
  }

  return <SeoPage seo={seo} />
}