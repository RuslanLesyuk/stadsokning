import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/", "/chat/"],
    },
    sitemap: "https://cleansjob.com/sitemap.xml",
    host: "https://cleansjob.com",
  }
}