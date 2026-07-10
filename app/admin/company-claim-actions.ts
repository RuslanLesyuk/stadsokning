"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name)

  return typeof value === "string" ? value.trim() : ""
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin")
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return user
}

export async function approveCompanyClaimAction(
  formData: FormData,
) {
  const admin = await requireAdmin()

  const claimId = getFormValue(formData, "claimId")
  const companySlug = getFormValue(formData, "companySlug")

  if (!claimId) {
    redirect("/admin?claimError=missing-claim")
  }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase.rpc(
    "approve_company_claim",
    {
      claim_request_id: claimId,
      reviewer_user_id: admin.id,
    },
  )

  if (error) {
    console.error("Approve company claim error:", error)

    redirect(
      `/admin?claimError=${encodeURIComponent(error.message)}`,
    )
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard/company-claims")

  if (companySlug) {
    revalidatePath(`/companies/${companySlug}`)
    revalidatePath(`/companies/${companySlug}/claim`)
  }

  redirect("/admin?claimSuccess=approved")
}

export async function rejectCompanyClaimAction(
  formData: FormData,
) {
  const admin = await requireAdmin()

  const claimId = getFormValue(formData, "claimId")
  const companySlug = getFormValue(formData, "companySlug")
  const adminNote = getFormValue(formData, "adminNote")

  if (!claimId) {
    redirect("/admin?claimError=missing-claim")
  }

  if (adminNote.length < 5) {
    redirect("/admin?claimError=rejection-note-required")
  }

  const adminSupabase = createAdminClient()

  const { error } = await adminSupabase.rpc(
    "reject_company_claim",
    {
      claim_request_id: claimId,
      reviewer_user_id: admin.id,
      rejection_note: adminNote,
    },
  )

  if (error) {
    console.error("Reject company claim error:", error)

    redirect(
      `/admin?claimError=${encodeURIComponent(error.message)}`,
    )
  }

  revalidatePath("/admin")
  revalidatePath("/dashboard/company-claims")

  if (companySlug) {
    revalidatePath(`/companies/${companySlug}`)
    revalidatePath(`/companies/${companySlug}/claim`)
  }

  redirect("/admin?claimSuccess=rejected")
}