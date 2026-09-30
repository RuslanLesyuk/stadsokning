"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

type ExistingCompany = {
  id: string
  name: string
  slug: string
  owner_id: string | null
}

function clean(value: FormDataEntryValue | null, maxLength: number) {
  if (typeof value !== "string") return ""

  return value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
}

function slugify(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, 90)
    .replace(/-+$/g, "")

  return normalized || "company"
}

function normalizeWebsite(value: string) {
  if (!value) return null

  const candidate = /^https?:\/\//i.test(value)
    ? value
    : `https://${value}`

  try {
    const url = new URL(candidate)

    if (!["http:", "https:"].includes(url.protocol)) {
      return null
    }

    return url.toString().replace(/\/$/, "")
  } catch {
    return null
  }
}

function isValidEmail(value: string) {
  if (!value) return true
  if (value.length > 254) return false

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

async function getUniqueSlug(
  admin: ReturnType<typeof createAdminClient>,
  name: string,
  city: string,
) {
  const base = slugify(`${name}-${city}`)

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate =
      attempt === 0
        ? base
        : `${base}-${attempt + 1}`.slice(0, 100).replace(/-+$/g, "")

    const { data, error } = await admin
      .from("companies")
      .select("id")
      .eq("slug", candidate)
      .limit(1)

    if (error) {
      console.error("Company slug lookup error:", error)
      redirect("/companies/create?error=create")
    }

    if (!data || data.length === 0) {
      return candidate
    }
  }

  return `${base}-${randomUUID().slice(0, 8)}`
}

function redirectForExistingCompany(
  company: ExistingCompany,
  userId: string,
): never {
  if (company.owner_id === userId) {
    redirect(`/dashboard/company?company=${company.id}`)
  }

  redirect(`/companies/${company.slug}/claim`)
}

export async function createCompanyAction(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login?next=/companies/create")
  }

  const name = clean(formData.get("name"), 160)
  const city = clean(formData.get("city"), 120)
  const description = clean(formData.get("description"), 2000)
  const organizationNumber = clean(formData.get("organization_number"), 64)
  const phone = clean(formData.get("phone"), 60)
  const email = clean(formData.get("email"), 254).toLowerCase()
  const websiteInput = clean(formData.get("website"), 500)

  if (
    name.length < 2 ||
    city.length < 2 ||
    description.length < 40
  ) {
    redirect("/companies/create?error=required")
  }

  if (!phone && !email) {
    redirect("/companies/create?error=contact")
  }

  if (!isValidEmail(email)) {
    redirect("/companies/create?error=email")
  }

  const website = normalizeWebsite(websiteInput)

  if (websiteInput && !website) {
    redirect("/companies/create?error=website")
  }

  const admin = createAdminClient()

  const { count: ownedCount, error: countError } = await admin
    .from("companies")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("owner_id", user.id)

  if (countError) {
    console.error("Company ownership count error:", countError)
    redirect("/companies/create?error=create")
  }

  if ((ownedCount ?? 0) >= 10) {
    redirect("/companies/create?error=limit")
  }

  let normalizedOrganizationNumber: string | null = null

  if (organizationNumber) {
    const { data, error } = await admin.rpc(
      "normalize_company_import_org_number",
      {
        value: organizationNumber,
      },
    )

    if (error) {
      console.error("Company organisation number normalization error:", error)
      redirect("/companies/create?error=create")
    }

    normalizedOrganizationNumber =
      typeof data === "string" && data.trim()
        ? data.trim()
        : null
  }

  const [
    normalizedNameResult,
    normalizedCityResult,
  ] = await Promise.all([
    admin.rpc("normalize_company_import_text", {
      value: name,
    }),
    admin.rpc("normalize_company_import_text", {
      value: city,
    }),
  ])

  if (
    normalizedNameResult.error ||
    normalizedCityResult.error
  ) {
    console.error(
      "Company duplicate normalization error:",
      normalizedNameResult.error ||
        normalizedCityResult.error,
    )

    redirect("/companies/create?error=create")
  }

  const normalizedName =
    typeof normalizedNameResult.data === "string"
      ? normalizedNameResult.data
      : ""

  const normalizedCity =
    typeof normalizedCityResult.data === "string"
      ? normalizedCityResult.data
      : ""

  let duplicate: ExistingCompany | null = null

  if (normalizedOrganizationNumber) {
    const { data, error } = await admin
      .from("companies")
      .select("id, name, slug, owner_id")
      .eq(
        "organization_number",
        normalizedOrganizationNumber,
      )
      .limit(1)

    if (error) {
      console.error(
        "Company organisation duplicate lookup error:",
        error,
      )

      redirect("/companies/create?error=create")
    }

    duplicate =
      ((data?.[0] || null) as ExistingCompany | null)
  }

  if (
    !duplicate &&
    normalizedName &&
    normalizedCity
  ) {
    const { data, error } = await admin
      .from("companies")
      .select("id, name, slug, owner_id")
      .eq("normalized_company_name", normalizedName)
      .eq("normalized_city", normalizedCity)
      .limit(1)

    if (error) {
      console.error(
        "Company name/city duplicate lookup error:",
        error,
      )

      redirect("/companies/create?error=create")
    }

    duplicate =
      ((data?.[0] || null) as ExistingCompany | null)
  }

  if (duplicate) {
    redirectForExistingCompany(
      duplicate,
      user.id,
    )
  }

  const slug = await getUniqueSlug(
    admin,
    name,
    city,
  )

  const now = new Date().toISOString()

  const { data: company, error: insertError } =
    await admin
      .from("companies")
      .insert({
        name,
        slug,
        city,
        description,
        organization_number:
          normalizedOrganizationNumber ||
          organizationNumber ||
          null,
        phone: phone || null,
        email: email || null,
        website,
        owner_id: user.id,
        claimed_at: now,
        verified: false,
        catalog_source: "native",
      })
      .select("id, slug")
      .single()

  if (insertError || !company) {
    console.error(
      "Create company error:",
      insertError,
    )

    redirect("/companies/create?error=create")
  }

  revalidatePath("/companies")
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/company")
  revalidatePath("/dashboard/websites")
  revalidatePath("/", "layout")

  redirect(
    `/dashboard/companies/${company.id}/onboarding`,
  )
}
