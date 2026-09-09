import {
  seoLandingPages,
  type SeoServiceType,
} from "@/lib/seo-landing-pages"
import { getPublicJobsHubPath } from "@/lib/seo/public-jobs"

export type MarketplaceLinkKind =
  | "city-hub"
  | "city-jobs"
  | "home-service"
  | "office-service"
  | "companies"
  | "services"

export type MarketplaceInternalLink = {
  kind: MarketplaceLinkKind
  href: string
  city: string
}

function clean(
  value: string | null | undefined,
) {
  return String(value || "").trim()
}

function findLandingPath(
  city: string,
  serviceType: SeoServiceType,
) {
  const normalizedCity =
    clean(city).toLocaleLowerCase("sv-SE")

  const landing = seoLandingPages.find(
    (item) =>
      item.city.toLocaleLowerCase("sv-SE") ===
        normalizedCity &&
      item.serviceType === serviceType,
  )

  return landing
    ? `/${landing.slug}`
    : null
}

function jobTypeToServiceType(
  jobType: string | null | undefined,
): SeoServiceType | null {
  if (jobType === "home_cleaning") {
    return "hemstadning"
  }

  if (jobType === "office_cleaning") {
    return "kontorsstadning"
  }

  return null
}

export function getMarketplaceInternalLinks({
  city,
  jobType,
}: {
  city: string | null | undefined
  jobType?: string | null
}): MarketplaceInternalLink[] {
  const safeCity = clean(city)

  if (!safeCity) {
    return []
  }

  const links: MarketplaceInternalLink[] = []

  const cityHub =
    getPublicJobsHubPath(safeCity)

  if (cityHub) {
    links.push({
      kind: "city-hub",
      href: cityHub,
      city: safeCity,
    })
  }

  links.push({
    kind: "city-jobs",
    href: `/jobs?city=${encodeURIComponent(
      safeCity,
    )}`,
    city: safeCity,
  })

  const specificServiceType =
    jobTypeToServiceType(jobType)

  const serviceTypes:
    SeoServiceType[] = specificServiceType
      ? [specificServiceType]
      : [
          "hemstadning",
          "kontorsstadning",
        ]

  for (const serviceType of serviceTypes) {
    const href = findLandingPath(
      safeCity,
      serviceType,
    )

    if (!href) {
      continue
    }

    links.push({
      kind:
        serviceType === "hemstadning"
          ? "home-service"
          : "office-service",
      href,
      city: safeCity,
    })
  }

  links.push(
    {
      kind: "companies",
      href: `/companies?city=${encodeURIComponent(
        safeCity,
      )}`,
      city: safeCity,
    },
    {
      kind: "services",
      href: "/services",
      city: safeCity,
    },
  )

  const seen = new Set<string>()

  return links.filter((link) => {
    if (seen.has(link.href)) {
      return false
    }

    seen.add(link.href)
    return true
  })
}
