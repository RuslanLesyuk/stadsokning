import type { Metadata } from "next"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { CompanySiteRenderer } from "@/components/company-sites/company-site-renderer"
import {
  getLocalizedContent,
  getLocalizedSeo,
  normalizeContent,
  normalizeEnabledLocales,
  normalizeSeoSettings,
  normalizeSiteLocale,
  safeJsonForScript,
} from "@/lib/company-sites/utils"
import type {
  CompanySiteCompany,
  CompanySiteLocale,
  CompanySiteReview,
  CompanySiteRow,
} from "@/lib/company-sites/types"
import { createClient } from "@/lib/supabase-server"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ lang?: string }>
}

type ReviewerProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

async function loadPublishedSite(slug: string) {
  const supabase = await createClient()

  const { data: siteData } = await supabase
    .from("company_sites")
    .select("*")
    .eq("site_slug", slug)
    .eq("status", "published")
    .maybeSingle()

  const site = siteData as CompanySiteRow | null
  if (!site) return null

  const { data: companyData } = await supabase
    .from("companies")
    .select(
      "id, name, slug, city, address, postal_code, organization_number, founded_year, website, phone, email, description, logo_url, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, verified, owner_id, updated_at",
    )
    .eq("id", site.company_id)
    .maybeSingle()

  const company = companyData as CompanySiteCompany | null
  if (!company) return null

  return { site, company }
}

function resolveLocale({
  requested,
  cookieLocale,
  site,
}: {
  requested?: string
  cookieLocale?: string
  site: CompanySiteRow
}): CompanySiteLocale {
  const enabled = normalizeEnabledLocales(site.enabled_locales, site.default_locale)
  const requestedLocale = normalizeSiteLocale(requested, site.default_locale)
  if (requested && enabled.includes(requestedLocale)) return requestedLocale

  const cookieValue = normalizeSiteLocale(cookieLocale, site.default_locale)
  if (cookieLocale && enabled.includes(cookieValue)) return cookieValue

  return site.default_locale
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const query = await searchParams
  const loaded = await loadPublishedSite(slug)

  if (!loaded) {
    return {
      title: "Website not found",
      robots: { index: false, follow: false },
    }
  }

  const cookieStore = await cookies()
  const locale = resolveLocale({
    requested: query.lang,
    cookieLocale: cookieStore.get("clean_jobs_locale")?.value,
    site: loaded.site,
  })
  const seo = getLocalizedSeo(
    normalizeSeoSettings(loaded.site.seo_settings),
    locale,
    loaded.site.default_locale,
  )
  const content = getLocalizedContent(
    normalizeContent(loaded.site.content),
    locale,
    loaded.site.default_locale,
  )

  const title =
    seo.title ||
    content.hero_title ||
    `${loaded.company.name} – Städföretag i ${loaded.company.city || "Sverige"}`
  const description =
    seo.description ||
    content.hero_subtitle ||
    loaded.company.description ||
    `Professionella städtjänster från ${loaded.company.name}.`
  const canonical = `https://cleansjob.com/site/${loaded.site.site_slug}`
  const image = loaded.company.cover_url || loaded.company.logo_url || undefined

  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image, alt: loaded.company.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image,
    },
    robots: { index: true, follow: true },
  }
}

export default async function CompanyWebsitePage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params
  const query = await searchParams
  const loaded = await loadPublishedSite(slug)

  if (!loaded) notFound()

  const cookieStore = await cookies()
  const locale = resolveLocale({
    requested: query.lang,
    cookieLocale: cookieStore.get("clean_jobs_locale")?.value,
    site: loaded.site,
  })

  const supabase = await createClient()
  const [{ data: reviewData }, { data: userData }, { data: bookingSettings }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, reviewer_id, rating, comment, created_at")
      .eq("entity_type", "company")
      .eq("entity_id", loaded.company.id)
      .order("created_at", { ascending: false })
      .limit(12),
    supabase.auth.getUser(),
    supabase
      .from("company_booking_settings")
      .select("booking_enabled, recurring_enabled, default_duration_minutes")
      .eq("company_id", loaded.company.id)
      .maybeSingle(),
  ])

  const rawReviews = (reviewData ?? []) as Array<{
    id: string
    reviewer_id: string | null
    rating: number
    comment: string | null
    created_at: string
  }>
  const reviewerIds = Array.from(
    new Set(rawReviews.map((item) => item.reviewer_id).filter(Boolean)),
  ) as string[]

  let profiles: ReviewerProfile[] = []
  if (reviewerIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", reviewerIds)
    profiles = (data ?? []) as ReviewerProfile[]
  }

  const profileMap = new Map(profiles.map((profile) => [profile.id, profile]))
  const reviews: CompanySiteReview[] = rawReviews.map((review) => {
    const profile = review.reviewer_id ? profileMap.get(review.reviewer_id) : null
    return {
      ...review,
      reviewer_name: profile?.full_name || null,
      reviewer_avatar_url: profile?.avatar_url || null,
    }
  })

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      : null
  const publicUrl = `https://cleansjob.com/site/${loaded.site.site_slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    "@id": `${publicUrl}#business`,
    name: loaded.company.name,
    url: publicUrl,
    description: loaded.company.description || undefined,
    image: loaded.company.cover_url || loaded.company.logo_url || undefined,
    logo: loaded.company.logo_url || undefined,
    telephone: loaded.company.phone || undefined,
    email: loaded.company.email || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: loaded.company.address || undefined,
      postalCode: loaded.company.postal_code || undefined,
      addressLocality: loaded.company.city || undefined,
      addressCountry: "SE",
    },
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonForScript(jsonLd) }}
      />
      <CompanySiteRenderer
        site={loaded.site}
        company={loaded.company}
        reviews={reviews}
        locale={locale}
        defaultEmail={userData.user?.email || ""}
        bookingEnabled={Boolean(loaded.company.owner_id && bookingSettings?.booking_enabled)}
        bookingRecurringEnabled={bookingSettings?.recurring_enabled !== false}
        bookingDefaultDurationMinutes={bookingSettings?.default_duration_minutes || 180}
        isAuthenticated={Boolean(userData.user)}
      />
    </>
  )
}
