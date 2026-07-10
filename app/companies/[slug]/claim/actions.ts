"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

export type CompanyClaimFormState = {
  status: "idle" | "error"
  message: string
  fieldErrors?: {
    businessEmail?: string
    businessPhone?: string
    message?: string
  }
}

export const initialCompanyClaimFormState: CompanyClaimFormState = {
  status: "idle",
  message: "",
}

function getStringValue(
  formData: FormData,
  fieldName: string,
): string {
  const value = formData.get(fieldName)

  return typeof value === "string" ? value.trim() : ""
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function submitCompanyClaim(
  previousState: CompanyClaimFormState,
  formData: FormData,
): Promise<CompanyClaimFormState> {
  const companyId = getStringValue(formData, "companyId")
  const companySlug = getStringValue(formData, "companySlug")
  const businessEmail = getStringValue(formData, "businessEmail")
  const businessPhone = getStringValue(formData, "businessPhone")
  const claimMessage = getStringValue(formData, "message")

  const fieldErrors: CompanyClaimFormState["fieldErrors"] = {}

  if (!businessEmail) {
    fieldErrors.businessEmail = "Business email is required."
  } else if (!isValidEmail(businessEmail)) {
    fieldErrors.businessEmail = "Enter a valid email address."
  }

  if (!businessPhone) {
    fieldErrors.businessPhone = "Business phone is required."
  } else if (businessPhone.length < 6) {
    fieldErrors.businessPhone = "Enter a valid phone number."
  }

  if (!claimMessage) {
    fieldErrors.message = "Explain your connection to the company."
  } else if (claimMessage.length < 20) {
    fieldErrors.message =
      "Please provide at least 20 characters."
  } else if (claimMessage.length > 2000) {
    fieldErrors.message =
      "The message cannot exceed 2000 characters."
  }

  if (!companyId || !companySlug) {
    return {
      status: "error",
      message: "Company information is missing.",
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors,
    }
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      status: "error",
      message: "You must be signed in to claim a company.",
    }
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, slug, owner_id")
    .eq("id", companyId)
    .eq("slug", companySlug)
    .maybeSingle()

  if (companyError) {
    console.error("Company claim lookup error:", companyError)

    return {
      status: "error",
      message: "The company could not be verified.",
    }
  }

  if (!company) {
    return {
      status: "error",
      message: "Company not found.",
    }
  }

  if (company.owner_id) {
    return {
      status: "error",
      message: "This company has already been claimed.",
    }
  }

  const { data: existingClaim, error: existingClaimError } =
    await supabase
      .from("company_claim_requests")
      .select("id, status")
      .eq("company_id", companyId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle()

  if (existingClaimError) {
    console.error(
      "Existing company claim lookup error:",
      existingClaimError,
    )

    return {
      status: "error",
      message: "We could not check your existing requests.",
    }
  }

  if (existingClaim) {
    redirect(`/companies/${companySlug}/claim?submitted=true`)
  }

  const { error: insertError } = await supabase
    .from("company_claim_requests")
    .insert({
      company_id: companyId,
      user_id: user.id,
      business_email: businessEmail,
      business_phone: businessPhone,
      message: claimMessage,
      status: "pending",
    })

  if (insertError) {
    console.error("Company claim insert error:", insertError)

    if (insertError.code === "23505") {
      redirect(`/companies/${companySlug}/claim?submitted=true`)
    }

    return {
      status: "error",
      message:
        "The request could not be submitted. Please try again.",
    }
  }

  revalidatePath(`/companies/${companySlug}`)
  revalidatePath(`/companies/${companySlug}/claim`)

  redirect(`/companies/${companySlug}/claim?submitted=true`)
}