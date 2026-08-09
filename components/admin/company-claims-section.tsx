import { createAdminClient } from "@/lib/supabase-admin"
import { CompanyClaimsClient, type AdminCompanyClaim } from "./company-claims-client"

type CompanyClaimsSectionProps = {
  success?: string
  error?: string
}

type RawClaim = {
  id: string
  company_id: string
  user_id: string
  business_email: string | null
  business_phone: string | null
  message: string | null
  status: "pending" | "needs_info" | "approved" | "rejected" | "cancelled"
  admin_note: string | null
  created_at: string
  updated_at: string
  reviewed_at: string | null
  requested_info_at: string | null
  cancelled_at: string | null
  evidence_paths: string[] | null
  business_email_domain: string | null
  company_domain: string | null
  email_domain_match: boolean | null
  companies:
    | {
        id: string
        name: string
        slug: string
        city: string | null
        website: string | null
        phone: string | null
        email: string | null
        logo_url: string | null
        owner_id: string | null
      }
    | {
        id: string
        name: string
        slug: string
        city: string | null
        website: string | null
        phone: string | null
        email: string | null
        logo_url: string | null
        owner_id: string | null
      }[]
    | null
}

function getCompany(claim: RawClaim) {
  if (!claim.companies) return null
  return Array.isArray(claim.companies) ? claim.companies[0] ?? null : claim.companies
}

function getErrorMessage(value: string) {
  if (value === "missing-claim") return "Claim request ID is missing."
  if (value === "rejection-note-required") return "Enter a rejection reason of at least 5 characters."
  if (value === "info-note-required") return "Explain what additional information is required."

  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function getEvidenceLinks(
  adminSupabase: ReturnType<typeof createAdminClient>,
  paths: string[] | null,
) {
  const validPaths = (paths ?? []).filter(Boolean)
  if (validPaths.length === 0) return []

  const { data } = await adminSupabase.storage
    .from("company-claim-evidence")
    .createSignedUrls(validPaths, 30 * 60)

  return (data ?? [])
    .filter((item) => Boolean(item.signedUrl))
    .map((item) => ({
      path: item.path,
      url: item.signedUrl,
      name: item.path.split("/").pop() || "document",
    }))
}

export async function CompanyClaimsSection({
  success,
  error,
}: CompanyClaimsSectionProps) {
  const adminSupabase = createAdminClient()

  const { data, error: loadError } = await adminSupabase
    .from("company_claim_requests")
    .select(`
      id,
      company_id,
      user_id,
      business_email,
      business_phone,
      message,
      status,
      admin_note,
      created_at,
      updated_at,
      reviewed_at,
      requested_info_at,
      cancelled_at,
      evidence_paths,
      business_email_domain,
      company_domain,
      email_domain_match,
      companies (
        id,
        name,
        slug,
        city,
        website,
        phone,
        email,
        logo_url,
        owner_id
      )
    `)
    .order("created_at", { ascending: false })

  const rawClaims = (data ?? []) as RawClaim[]
  const claims: AdminCompanyClaim[] = await Promise.all(
    rawClaims.map(async (claim) => {
      const company = getCompany(claim)
      const evidence = await getEvidenceLinks(adminSupabase, claim.evidence_paths)

      return {
        id: claim.id,
        company_id: claim.company_id,
        user_id: claim.user_id,
        business_email: claim.business_email,
        business_phone: claim.business_phone,
        message: claim.message,
        status: claim.status,
        admin_note: claim.admin_note,
        created_at: claim.created_at,
        updated_at: claim.updated_at,
        reviewed_at: claim.reviewed_at,
        requested_info_at: claim.requested_info_at,
        cancelled_at: claim.cancelled_at,
        business_email_domain: claim.business_email_domain,
        company_domain: claim.company_domain,
        email_domain_match: Boolean(claim.email_domain_match),
        evidence,
        company: company
          ? {
              id: company.id,
              name: company.name,
              slug: company.slug,
              city: company.city,
              website: company.website,
              phone: company.phone,
              email: company.email,
              logo_url: company.logo_url,
              owner_id: company.owner_id,
            }
          : null,
      }
    }),
  )

  return (
    <CompanyClaimsClient
      claims={claims}
      loadError={loadError ? "Company claim requests could not be loaded." : null}
      success={success || null}
      error={error ? getErrorMessage(error) : null}
    />
  )
}
