import type { MetadataRoute } from "next"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

import { seoLandingPages } from "@/lib/seo-landing-pages"

import {
  SEO_SITE_URL,
  SEO_SUPPORTED_LOCALES,
} from "@/lib/seo/constants"

import { seoCities } from "@/lib/seo/cities"
import { seoServices } from "@/lib/seo/services"

import {
  getPreferredSeoPath,
  shouldIndexPreferredSeoPage,
} from "@/lib/seo/indexing"
import {
  PUBLIC_JOB_SITEMAP_LIMIT,
  isPublicJobIndexable,
} from "@/lib/seo/public-jobs"

export const dynamic = "force-dynamic"

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
   * Full SEO sitemap:
   *
   * Submit the complete canonical 290 x 20 x 5 matrix.
   * Swedish combinations with a cleaner landing URL use that preferred URL;
   * the duplicate /seo/... path is not submitted.
   */
  const seoEnginePages: MetadataRoute.Sitemap = seoCities.flatMap((city) =>
    seoServices.flatMap((service) =>
      SEO_SUPPORTED_LOCALES.flatMap((locale) => {
        if (
          !shouldIndexPreferredSeoPage({
            locale,
            citySlug: city.slug,
            serviceSlug: service.slug,
          })
        ) {
          return []
        }

        return [
          {
            url: `${SEO_SITE_URL}${getPreferredSeoPath({
              locale,
              city: city.slug,
              service: service.slug,
            })}`,
            changeFrequency: "weekly" as const,
            priority:
              locale === "sv"
                ? 0.78
                : 0.7,
          },
        ]
      }),
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

  const { data: publicJobs } =
    await supabase
      .from("jobs")
      .select(
        "id, title, description, city, job_type, status, assigned_to, created_at, scheduled_date",
      )
      .eq("status", "new")
      .is("assigned_to", null)
      .order("created_at", {
        ascending: false,
      })
      .limit(PUBLIC_JOB_SITEMAP_LIMIT)

  const publicJobIds =
    (publicJobs ?? []).map(
      (job) => job.id,
    )

  const openReportCountByJobId =
    new Map<string, number>()

  if (publicJobIds.length > 0) {
    const admin = createAdminClient()

    const { data: openReports } =
      await admin
        .from("job_reports")
        .select("job_id")
        .eq("status", "open")
        .in("job_id", publicJobIds)

    for (const report of openReports ?? []) {
      openReportCountByJobId.set(
        report.job_id,
        (openReportCountByJobId.get(
          report.job_id,
        ) || 0) + 1,
      )
    }
  }

  const now = new Date()

  const jobPages: MetadataRoute.Sitemap =
    (publicJobs ?? [])
      .filter((job) =>
        isPublicJobIndexable(
          {
            ...job,
            open_report_count:
              openReportCountByJobId.get(
                job.id,
              ) || 0,
          },
          now,
        ),
      )
      .map((job) => ({
        url: `${SEO_SITE_URL}/jobs/${job.id}`,
        lastModified: job.created_at
          ? new Date(job.created_at)
          : undefined,
        changeFrequency:
          "daily" as const,
        priority: 0.72,
      }))

  const seen = new Set<string>()

  return [
    ...staticPages,
    ...cityPages,
    ...landingPages,
    ...seoEnginePages,
    ...companyPages,
    ...servicePages,
    ...jobPages,
  ].filter((item) => {
    if (seen.has(item.url)) {
      return false
    }

    seen.add(item.url)

    return true
  })
}
