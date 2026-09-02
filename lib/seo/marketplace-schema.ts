import { SEO_SITE_URL } from "./constants"

import type { SeoMarketplaceCompany } from "./marketplace"

function absoluteUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  return `${SEO_SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`
}

export function createMarketplaceItemListSchema({
  pageUrl,
  name,
  companies,
}: {
  pageUrl: string
  name: string
  companies: SeoMarketplaceCompany[]
}) {
  if (companies.length === 0) {
    return null
  }

  const url = absoluteUrl(pageUrl)

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#companies`,
    name,
    numberOfItems: companies.length,
    itemListElement: companies.map((company, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Organization",
        name: company.name,
        url: `${SEO_SITE_URL}/companies/${company.slug}`,
      },
    })),
  }
}
