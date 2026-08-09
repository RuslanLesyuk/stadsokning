import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { CompanySiteRenderer } from "@/components/company-sites/company-site-renderer"
import {
  normalizeEnabledLocales,
  normalizeSiteLocale,
} from "@/lib/company-sites/utils"
import type {
  CompanySiteCompany,
  CompanySiteLocale,
  CompanySiteReview,
  CompanySiteRow,
} from "@/lib/company-sites/types"
import { createClient } from "@/lib/supabase-server"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ lang?: string }>
}

type ReviewerProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

export default async function CompanyWebsitePreviewPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const query = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/companies/${id}/website/preview`)
  }

  const [{ data: companyData }, { data: siteData }] = await Promise.all([
    supabase
      .from("companies")
      .select(
        "id, name, slug, city, address, postal_code, organization_number, founded_year, website, phone, email, description, logo_url, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, verified, owner_id, updated_at",
      )
      .eq("id", id)
      .eq("owner_id", user.id)
      .maybeSingle(),
    supabase.from("company_sites").select("*").eq("company_id", id).maybeSingle(),
  ])

  const company = companyData as CompanySiteCompany | null
  const site = siteData as CompanySiteRow | null

  if (!company) redirect("/dashboard/company-claims")
  if (!site) redirect(`/dashboard/companies/${id}/website`)

  const cookieStore = await cookies()
  const enabledLocales = normalizeEnabledLocales(
    site.enabled_locales,
    site.default_locale,
  )
  const requested = normalizeSiteLocale(query.lang, site.default_locale)
  const cookieLocale = normalizeSiteLocale(
    cookieStore.get("clean_jobs_locale")?.value,
    site.default_locale,
  )
  const locale: CompanySiteLocale = query.lang && enabledLocales.includes(requested)
    ? requested
    : enabledLocales.includes(cookieLocale)
      ? cookieLocale
      : site.default_locale

  const { data: reviewData } = await supabase
    .from("reviews")
    .select("id, reviewer_id, rating, comment, created_at")
    .eq("entity_type", "company")
    .eq("entity_id", company.id)
    .order("created_at", { ascending: false })
    .limit(12)

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

  return (
    <CompanySiteRenderer
      site={site}
      company={company}
      reviews={reviews}
      locale={locale}
      preview
      editorHref={`/dashboard/companies/${company.id}/website`}
      defaultEmail={user.email || ""}
    />
  )
}
