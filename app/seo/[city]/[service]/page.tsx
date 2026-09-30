
import { notFound, permanentRedirect } from "next/navigation"

import { createSeoEngine } from "@/lib/seo/index"
import {
  getSwedishSeoLandingPath,
  getSwedishSeoStaticParams,
} from "@/lib/seo/indexing"
import { SeoPage } from "@/lib/seo/page"
import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"
import { SEO_SITE_URL } from "@/lib/seo/constants"
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
  return getSwedishSeoStaticParams(seoCities, seoServices)
}

export async function generateMetadata({ params }: PageProps) {
  const { city, service } = await params
  const landingPath = getSwedishSeoLandingPath(city, service)

  if (landingPath) {
    return {
      alternates: {
        canonical: `${SEO_SITE_URL}${landingPath}`,
      },
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const seo = createSeoEngine({
    locale: DEFAULT_LOCALE,
    citySlug: city,
    serviceSlug: service,
  })

  if (!seo) return {}
  return seo.metadata
}

export default async function SeoDynamicPage({ params }: PageProps) {
  const { city, service } = await params
  const landingPath = getSwedishSeoLandingPath(city, service)

  if (landingPath) {
    permanentRedirect(landingPath)
  }

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
