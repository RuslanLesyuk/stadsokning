import type { MetadataRoute } from "next"

import { createClient } from "@/lib/supabase-server"
import { seoLandingPages } from "@/lib/seo-landing-pages"
import {
  SEO_SITE_URL,
  SEO_SUPPORTED_LOCALES,
} from "@/lib/seo/constants"
import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"
import { buildAbsoluteSeoUrl } from "@/lib/seo/urls"

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

const localizedSeoLocales = SEO_SUPPORTED_LOCALES.filter(
  (locale) => locale !== "sv",
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SEO_SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SEO_SITE_URL}/jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SEO_SITE_URL}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/companies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SEO_SITE_URL}/work-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/jobb-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/cleaning-jobs-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/cleaning-jobs-gothenburg`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-goteborg`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/cleaning-jobs-malmo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadjobb-malmo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/jobs-for-foreigners-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/jobb-utan-svenska`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/how-to-find-a-job-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/hur-man-far-jobb-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SEO_SITE_URL}/how-much-do-cleaners-earn-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/vad-tjanar-en-stadare-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/hire-cleaner-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/cleaning-company-statistics-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/stadbranschen-i-sverige-statistik`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${SEO_SITE_URL}/best-cleaning-companies-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/basta-stadforetag-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SEO_SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SEO_SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SEO_SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]

  const cityPages: MetadataRoute.Sitemap = citySlugs.flatMap(
    (city) => [
      {
        url: `${SEO_SITE_URL}/services/city/${city}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: city === "stockholm" ? 0.9 : 0.85,
      },
      {
        url: `${SEO_SITE_URL}/companies/city/${city}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: city === "stockholm" ? 0.9 : 0.85,
      },
    ],
  )

  const seoPages: MetadataRoute.Sitemap =
    seoLandingPages.map((page) => ({
      url: `${SEO_SITE_URL}/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    }))

  const seoEnginePages: MetadataRoute.Sitemap =
    seoCities.flatMap((city) =>
      seoServices.map((service) => ({
        url: buildAbsoluteSeoUrl({
          locale: "sv",
          city: city.slug,
          service: service.slug,
        }),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      })),
    )

  const localizedSeoEnginePages: MetadataRoute.Sitemap =
    localizedSeoLocales.flatMap((locale) =>
      seoCities.flatMap((city) =>
        seoServices.map((service) => ({
          url: buildAbsoluteSeoUrl({
            locale,
            city: city.slug,
            service: service.slug,
          }),
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.65,
        })),
      ),
    )

  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("slug, created_at")
    .order("created_at", { ascending: false })

  const companyPages: MetadataRoute.Sitemap =
    companies?.map((company) => ({
      url: `${SEO_SITE_URL}/companies/${company.slug}`,
      lastModified: company.created_at
        ? new Date(company.created_at)
        : now,
      changeFrequency: "weekly",
      priority: 0.8,
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
        : now,
      changeFrequency: "weekly",
      priority: 0.85,
    })) ?? []

  return [
    ...staticPages,
    ...cityPages,
    ...seoPages,
    ...seoEnginePages,
    ...localizedSeoEnginePages,
    ...companyPages,
    ...servicePages,
  ]
}