import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase-server"

const siteUrl = "https://cleansjob.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/companies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/services/stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/work-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/jobb-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cleaning-jobs-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/stadjobb-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/cleaning-jobs-gothenburg`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/stadjobb-goteborg`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/cleaning-jobs-malmo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/stadjobb-malmo`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/jobs-for-foreigners-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/jobb-utan-svenska`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/how-to-find-a-job-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/hur-man-far-jobb-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/how-much-do-cleaners-earn-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/vad-tjanar-en-stadare-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/hire-cleaner-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/stadfirma-stockholm`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cleaning-company-statistics-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/stadbranschen-i-sverige-statistik`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/best-cleaning-companies-in-sweden`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/basta-stadforetag-i-sverige`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
  url: `${siteUrl}/services/city/stockholm`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
},
{
  url: `${siteUrl}/services/city/sollentuna`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/taby`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/jarfalla`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/nacka`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/huddinge`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/botkyrka`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/solna`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/services/city/sundbyberg`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/stockholm`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.9,
},
{
  url: `${siteUrl}/companies/city/sollentuna`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/taby`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/jarfalla`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/nacka`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/huddinge`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/botkyrka`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/solna`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/companies/city/sundbyberg`,
  lastModified: now,
  changeFrequency: "weekly",
  priority: 0.85,
},
  ]

  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("companies")
    .select("slug, created_at")
    .order("created_at", { ascending: false })

  const companyPages: MetadataRoute.Sitemap =
    companies?.map((company) => ({
      url: `${siteUrl}/companies/${company.slug}`,
      lastModified: company.created_at ? new Date(company.created_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    })) ?? []

    const { data: services } = await supabase
  .from("service_profiles")
  .select("slug, created_at")
  .order("created_at", { ascending: false })

const servicePages: MetadataRoute.Sitemap =
  services?.map((service) => ({
    url: `${siteUrl}/services/${service.slug}`,
    lastModified: service.created_at
      ? new Date(service.created_at)
      : now,
    changeFrequency: "weekly",
    priority: 0.85,
  })) ?? []

  return [
  ...staticPages,
  ...companyPages,
  ...servicePages,
]
}
