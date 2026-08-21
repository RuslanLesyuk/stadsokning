
import { notFound } from "next/navigation"

import { createSeoEngine } from "@/lib/seo/index"
import { getLocalizedSeoStaticParams } from "@/lib/seo/indexing"
import { SeoPage } from "@/lib/seo/page"
import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"
import type { SeoLocale } from "@/lib/seo/types"

export const revalidate = 86400

type PageProps = {
  params: Promise<{
    seoSlug: SeoLocale
    city: string
    service: string
  }>
}

const SUPPORTED_LOCALES: SeoLocale[] = ["en", "uk", "ru", "pl"]

export function generateStaticParams() {
  return getLocalizedSeoStaticParams({
    locales: SUPPORTED_LOCALES,
    cities: seoCities,
    services: seoServices,
  })
}

export async function generateMetadata({ params }: PageProps) {
  const { seoSlug, city, service } = await params

  if (!SUPPORTED_LOCALES.includes(seoSlug)) return {}

  const seo = createSeoEngine({
    locale: seoSlug,
    citySlug: city,
    serviceSlug: service,
  })

  if (!seo) return {}
  return seo.metadata
}

export default async function LocalizedSeoDynamicPage({ params }: PageProps) {
  const { seoSlug, city, service } = await params

  if (!SUPPORTED_LOCALES.includes(seoSlug)) {
    notFound()
  }

  const seo = createSeoEngine({
    locale: seoSlug,
    citySlug: city,
    serviceSlug: service,
  })

  if (!seo) {
    notFound()
  }

  return <SeoPage seo={seo} />
}
