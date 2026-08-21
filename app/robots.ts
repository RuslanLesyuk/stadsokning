
import type { MetadataRoute } from "next"

import { SEO_SITE_URL } from "@/lib/seo/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/",
          "/notifications",
          "/profile",
          "/outreach/",
        ],
      },
    ],
    sitemap: `${SEO_SITE_URL}/sitemap.xml`,
    host: SEO_SITE_URL,
  }
}
