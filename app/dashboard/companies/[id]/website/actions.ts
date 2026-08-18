"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  COMPANY_SITE_LOCALES,
  type CompanySiteContent,
  type CompanySiteLocale,
  type CompanySiteSectionSettings,
  type CompanySiteSeoSettings,
  type CompanySiteSocialLinks,
} from "@/lib/company-sites/types"
import {
  DEFAULT_SECTION_SETTINGS,
  normalizeCustomDomain,
  normalizeHexColor,
  normalizeSiteLocale,
  normalizeTemplate,
  slugifySite,
} from "@/lib/company-sites/utils"
import { getBillingAccessForUser } from "@/lib/billing/server"
import { createClient } from "@/lib/supabase-server"

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function checkbox(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "yes"
}

function getEditorPath(companyId: string, query?: string) {
  const base = `/dashboard/companies/${companyId}/website`
  return query ? `${base}?${query}` : base
}

function parseContent(formData: FormData): CompanySiteContent {
  const result: CompanySiteContent = {}

  for (const locale of COMPANY_SITE_LOCALES) {
    const heroTitle = text(formData, `${locale}_hero_title`)
    const heroSubtitle = text(formData, `${locale}_hero_subtitle`)
    const aboutTitle = text(formData, `${locale}_about_title`)
    const aboutText = text(formData, `${locale}_about_text`)
    const ctaTitle = text(formData, `${locale}_cta_title`)
    const ctaText = text(formData, `${locale}_cta_text`)

    result[locale] = {
      ...(heroTitle ? { hero_title: heroTitle } : {}),
      ...(heroSubtitle ? { hero_subtitle: heroSubtitle } : {}),
      ...(aboutTitle ? { about_title: aboutTitle } : {}),
      ...(aboutText ? { about_text: aboutText } : {}),
      ...(ctaTitle ? { cta_title: ctaTitle } : {}),
      ...(ctaText ? { cta_text: ctaText } : {}),
    }
  }

  return result
}

function parseSeo(formData: FormData): CompanySiteSeoSettings {
  const result: CompanySiteSeoSettings = {}

  for (const locale of COMPANY_SITE_LOCALES) {
    const title = text(formData, `${locale}_seo_title`)
    const description = text(formData, `${locale}_seo_description`)

    result[locale] = {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
    }
  }

  return result
}

function parseSections(formData: FormData): CompanySiteSectionSettings {
  return {
    services: checkbox(formData, "section_services"),
    pricing: checkbox(formData, "section_pricing"),
    about: checkbox(formData, "section_about"),
    gallery: checkbox(formData, "section_gallery"),
    reviews: checkbox(formData, "section_reviews"),
    areas: checkbox(formData, "section_areas"),
    hours: checkbox(formData, "section_hours"),
    faq: checkbox(formData, "section_faq"),
    contact: checkbox(formData, "section_contact"),
  }
}

function parseSocial(formData: FormData): CompanySiteSocialLinks {
  const facebook = text(formData, "social_facebook")
  const instagram = text(formData, "social_instagram")
  const linkedin = text(formData, "social_linkedin")
  const tiktok = text(formData, "social_tiktok")

  return {
    ...(facebook ? { facebook } : {}),
    ...(instagram ? { instagram } : {}),
    ...(linkedin ? { linkedin } : {}),
    ...(tiktok ? { tiktok } : {}),
  }
}

export async function saveCompanyWebsiteAction(formData: FormData) {
  const companyId = text(formData, "company_id")
  const intent = text(formData, "intent") || "save"

  if (!companyId) redirect("/dashboard/websites")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/companies/${companyId}/website`)
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, owner_id")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .maybeSingle()

  if (companyError || !company) {
    redirect("/dashboard/company-claims")
  }

  const requestedSlug = text(formData, "site_slug")
  const siteSlug = slugifySite(requestedSlug || company.slug || company.name)

  if (!siteSlug) {
    redirect(getEditorPath(companyId, "error=invalid-slug"))
  }

  const defaultLocale = normalizeSiteLocale(
    text(formData, "default_locale"),
    "sv",
  )
  const enabledLocales = COMPANY_SITE_LOCALES.filter((locale) =>
    checkbox(formData, `enabled_locale_${locale}`),
  )

  if (!enabledLocales.includes(defaultLocale)) {
    enabledLocales.unshift(defaultLocale)
  }

  const rawDomain = text(formData, "custom_domain")
  const customDomain = rawDomain ? normalizeCustomDomain(rawDomain) : null

  if (rawDomain && !customDomain) {
    redirect(getEditorPath(companyId, "error=invalid-domain"))
  }

  const { data: existingSite } = await supabase
    .from("company_sites")
    .select("id, custom_domain, domain_status, status, template, enabled_locales, remove_clean_jobs_branding")
    .eq("company_id", companyId)
    .maybeSingle()

  const template = normalizeTemplate(text(formData, "template"))
  const removeCleanJobsBranding = checkbox(formData, "remove_clean_jobs_branding")
  const billing = await getBillingAccessForUser(user.id)

  if (!billing.isPremium) {
    const changedToAdvancedTemplate =
      template !== "modern" &&
      (!existingSite || template !== existingSite.template)
    const changedToMultipleLanguages =
      enabledLocales.length > 1 &&
      (!existingSite ||
        JSON.stringify(enabledLocales) !==
          JSON.stringify(existingSite.enabled_locales || []))
    const changedCustomDomain =
      Boolean(customDomain) &&
      (!existingSite || customDomain !== existingSite.custom_domain)
    const enabledBrandingRemoval =
      removeCleanJobsBranding &&
      !existingSite?.remove_clean_jobs_branding

    if (
      changedToAdvancedTemplate ||
      changedToMultipleLanguages ||
      changedCustomDomain ||
      enabledBrandingRemoval
    ) {
      redirect(getEditorPath(companyId, "error=premium-required"))
    }
  }

  let nextStatus = existingSite?.status || "draft"
  if (intent === "publish") nextStatus = "published"
  if (intent === "unpublish") nextStatus = "draft"

  let domainStatus = existingSite?.domain_status || "not_configured"
  if (!customDomain) domainStatus = "not_configured"
  else if (customDomain !== existingSite?.custom_domain) domainStatus = "pending"

  const payload = {
    company_id: companyId,
    site_slug: siteSlug,
    status: nextStatus,
    template,
    primary_color: normalizeHexColor(
      text(formData, "primary_color"),
      "#e11d48",
    ),
    secondary_color: normalizeHexColor(
      text(formData, "secondary_color"),
      "#0f172a",
    ),
    default_locale: defaultLocale,
    enabled_locales: enabledLocales,
    content: parseContent(formData),
    section_settings: {
      ...DEFAULT_SECTION_SETTINGS,
      ...parseSections(formData),
    },
    social_links: parseSocial(formData),
    seo_settings: parseSeo(formData),
    custom_domain: customDomain,
    domain_status: domainStatus,
    remove_clean_jobs_branding: removeCleanJobsBranding,
    published_at:
      nextStatus === "published"
        ? existingSite?.status === "published"
          ? undefined
          : new Date().toISOString()
        : null,
  }

  let error: { code?: string; message?: string } | null = null

  if (existingSite) {
    const updatePayload = { ...payload }
    if (updatePayload.published_at === undefined) {
      delete (updatePayload as { published_at?: string | null }).published_at
    }

    const result = await supabase
      .from("company_sites")
      .update(updatePayload)
      .eq("id", existingSite.id)
      .eq("company_id", companyId)

    error = result.error
  } else {
    const result = await supabase.from("company_sites").insert({
      ...payload,
      published_at:
        nextStatus === "published" ? new Date().toISOString() : null,
    })
    error = result.error
  }

  if (error) {
    console.error("Save company website error:", error)

    if (error.code === "23505") {
      redirect(getEditorPath(companyId, "error=slug-or-domain-taken"))
    }

    if (error.message?.includes("premium_required")) {
      redirect(getEditorPath(companyId, "error=premium-required"))
    }

    redirect(getEditorPath(companyId, "error=save-failed"))
  }

  revalidatePath("/dashboard/websites")
  revalidatePath(getEditorPath(companyId))
  revalidatePath(`/dashboard/companies/${companyId}/website/preview`)
  revalidatePath(`/site/${siteSlug}`)
  revalidatePath(`/companies/${company.slug}`)
  revalidatePath("/", "layout")

  if (intent === "preview") {
    redirect(`/dashboard/companies/${companyId}/website/preview`)
  }

  if (intent === "publish") {
    redirect(getEditorPath(companyId, "saved=true&published=true"))
  }

  if (intent === "unpublish") {
    redirect(getEditorPath(companyId, "saved=true&unpublished=true"))
  }

  redirect(getEditorPath(companyId, "saved=true"))
}

export async function resetCompanyWebsiteSectionsAction(formData: FormData) {
  const companyId = text(formData, "company_id")
  if (!companyId) redirect("/dashboard/websites")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!company) redirect("/dashboard/websites")

  const { error } = await supabase
    .from("company_sites")
    .update({ section_settings: DEFAULT_SECTION_SETTINGS })
    .eq("company_id", companyId)

  if (error) {
    console.error("Reset company website sections error:", error)
  }

  revalidatePath(getEditorPath(companyId))
  redirect(getEditorPath(companyId, "saved=true"))
}
