
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  CRM_CUSTOMER_STAGES,
  type CrmCustomerStage,
} from "@/lib/crm/types"
import { parseCrmTags } from "@/lib/crm/utils"
import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function parseDateTimeLocal(value: string) {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return date.toISOString()
}

function refreshCustomerPaths(customerId: string) {
  revalidatePath("/dashboard/company")
  revalidatePath("/dashboard/company-customers")
  revalidatePath(`/dashboard/company-customers/${customerId}`)
  revalidatePath("/dashboard/company-leads")
  revalidatePath("/dashboard/company-bookings")
  revalidatePath("/", "layout")
}

export async function updateCompanyCustomerAction(formData: FormData) {
  const customerId = getString(formData, "customer_id")
  const customerName = getString(formData, "customer_name")
  const phone = getString(formData, "phone")
  const city = getString(formData, "city")
  const stageRaw = getString(formData, "lifecycle_stage")
  const tagsRaw = getString(formData, "tags")
  const notes = getString(formData, "owner_notes")
  const followUpRaw = getString(formData, "follow_up_at")

  if (!customerId || !customerName) {
    redirect("/dashboard/company-customers")
  }

  const stage = stageRaw as CrmCustomerStage

  if (!CRM_CUSTOMER_STAGES.includes(stage)) {
    redirect(`/dashboard/company-customers/${customerId}?error=stage`)
  }

  if (
    customerName.length > 200 ||
    phone.length > 100 ||
    city.length > 200 ||
    notes.length > 10000
  ) {
    redirect(`/dashboard/company-customers/${customerId}?error=length`)
  }

  const followUpAt = parseDateTimeLocal(followUpRaw)

  if (followUpRaw && !followUpAt) {
    redirect(`/dashboard/company-customers/${customerId}?error=follow-up`)
  }

  const tags = parseCrmTags(tagsRaw)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(
      `/login?next=/dashboard/company-customers/${encodeURIComponent(
        customerId,
      )}`,
    )
  }

  const { data: customer, error: loadError } = await supabase
    .from("company_crm_customers")
    .select("id, company_id")
    .eq("id", customerId)
    .maybeSingle()

  if (loadError || !customer) {
    if (loadError) {
      console.error("Load CRM customer before update error:", loadError)
    }
    redirect("/dashboard/company-customers")
  }

  const { data: updated, error } = await supabase
    .from("company_crm_customers")
    .update({
      customer_name: customerName,
      phone: phone || null,
      city: city || null,
      lifecycle_stage: stage,
      tags,
      owner_notes: notes || null,
      follow_up_at: followUpAt,
      last_activity_at: new Date().toISOString(),
    })
    .eq("id", customerId)
    .select("id")
    .maybeSingle()

  if (error || !updated) {
    console.error("Update CRM customer error:", error)
    redirect(`/dashboard/company-customers/${customerId}?error=save`)
  }

  refreshCustomerPaths(customerId)
  redirect(`/dashboard/company-customers/${customerId}?saved=true`)
}
