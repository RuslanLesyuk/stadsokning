import type { MetadataRoute } from "next"

import { createClient } from "@/lib/supabase-server"

import { seoLandingPages } from "@/lib/seo-landing-pages"

import {
  SEO_SITE_URL,
  SEO_SUPPORTED_LOCALES,
} from "@/lib/seo/constants"

import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"

import { getPreferredSeoPath } from "@/lib/seo/indexing"

const citySlugs = [
  "stockholm",
  "sollentuna",
  "taby",
  "jarfalla",
  "nacka",
  "huddinge",
  "botkyrka",
  "solna",
  "sundbyberg",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SEO_SITE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SEO_SITE_URL}/jobs`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/companies`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/services`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/faq`,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${SEO_SITE_URL}/jobb-i-sverige`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/jobb-utan-svenska`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/hur-man-far-jobb-i-sverige`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/vad-tjanar-en-stadare-i-sverige`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/stadbranschen-i-sverige-statistik`,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${SEO_SITE_URL}/basta-stadforetag-i-sverige`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-stockholm`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-goteborg`,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-malmo`,
      changeFrequency: "daily",
      priority: 0.85,
    },
  ]

  const cityPages: MetadataRoute.Sitemap = citySlugs.flatMap((city) => [
    {
      url: `${SEO_SITE_URL}/companies/city/${city}`,
      changeFrequency: "weekly",
      priority: city === "stockholm" ? 0.9 : 0.8,
    },
    {
      url: `${SEO_SITE_URL}/services/city/${city}`,
      changeFrequency: "weekly",
      priority: city === "stockholm" ? 0.85 : 0.75,
    },
  ])

  const landingPages: MetadataRoute.Sitemap = seoLandingPages.map(
    (page) => ({
      url: `${SEO_SITE_URL}/${page.slug}`,
      changeFrequency: "weekly",
      priority: page.city === "Stockholm" ? 0.9 : 0.8,
    }),
  )

  /**
   * Full canonical SEO coverage.
   *
   * Swedish combinations use cleaner URLs when one exists.
   * Other Swedish combinations use /seo/[city]/[service].
   *
   * EN / UK / RU / PL use their localized SEO-engine URLs.
   *
   * generateStaticParams() remains intentionally smaller;
   * pages outside that prebuilt subset are generated on demand.
   */
  const seoEnginePages: MetadataRoute.Sitemap = seoCities.flatMap((city) =>
    seoServices.flatMap((service) =>
      SEO_SUPPORTED_LOCALES.map((locale) => ({
        url: `${SEO_SITE_URL}${getPreferredSeoPath({
          locale,
          city: city.slug,
          service: service.slug,
        })}`,
        changeFrequency: "weekly" as const,
        priority:
          locale === "sv"
            ? 0.72
            : 0.65,
      })),
    ),
  )

  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("slug, created_at, updated_at, verified")
    .order("updated_at", { ascending: false })

  const companyPages: MetadataRoute.Sitemap =
    companies?.map((company) => ({
      url: `${SEO_SITE_URL}/companies/${company.slug}`,
      lastModified: company.updated_at
        ? new Date(company.updated_at)
        : company.created_at
          ? new Date(company.created_at)
          : undefined,
      changeFrequency: "weekly",
      priority: company.verified ? 0.85 : 0.72,
    })) ?? []

  const { data: services } = await supabase
    .from("service_profiles")
    .select("slug, created_at")
    .order("created_at", { ascending: false })

  const servicePages: MetadataRoute.Sitemap =
    services?.map((service) => ({
      url: `${SEO_SITE_URL}/services/${service.slug}`,
      lastModified: service.created_at
        ? new Date(service.created_at)
        : undefined,
      changeFrequency: "weekly",
      priority: 0.75,
    })) ?? []

  const seen = new Set<string>()

  return [
    ...staticPages,
    ...cityPages,
    ...landingPages,
    ...seoEnginePages,
    ...companyPages,
    ...servicePages,
  ].filter((item) => {
    if (seen.has(item.url)) {
      return false
    }

    seen.add(item.url)

    return true
  })
}