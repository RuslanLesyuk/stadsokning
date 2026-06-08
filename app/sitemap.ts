import type { MetadataRoute } from "next"

const siteUrl = "https://cleansjob.com"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${siteUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },

    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },

    {
      url: `${siteUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },

    {
      url: `${siteUrl}/work-in-sweden`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/jobb-i-sverige`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteUrl}/cleaning-jobs-stockholm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${siteUrl}/stadjobb-stockholm`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },

    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
  url: `${siteUrl}/cleaning-jobs-gothenburg`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},

{
  url: `${siteUrl}/stadjobb-goteborg`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/cleaning-jobs-gothenburg`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},

{
  url: `${siteUrl}/stadjobb-goteborg`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},

{
  url: `${siteUrl}/cleaning-jobs-malmo`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},

{
  url: `${siteUrl}/stadjobb-malmo`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.85,
},
{
  url: `${siteUrl}/jobs-for-foreigners-in-sweden`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
},

{
  url: `${siteUrl}/jobb-utan-svenska`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.9,
},
  ]
}
