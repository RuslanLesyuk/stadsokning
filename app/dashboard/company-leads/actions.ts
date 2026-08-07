"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

const allowedStatuses = new Set([
  "new",
  "contacted",
  "won",
  "lost",
  "archived",
])

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

export async function updateCompanyLeadStatus(formData: FormData) {
  const leadId = getString(formData, "lead_id")
  const status = getString(formData, "status")

  if (!leadId || !allowedStatuses.has(status)) {
    return
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company-leads")
  }

  const { data: updatedLead, error } = await supabase
    .from("company_quote_requests")
    .update({ status })
    .eq("id", leadId)
    .select("id")
    .maybeSingle()

  if (error) {
    console.error("Company lead status update error:", error)
    return
  }

  if (!updatedLead) {
    console.error("Company lead status update denied or lead not found:", leadId)
    return
  }

  if (status !== "new") {
    const { error: notificationError } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("entity_type", "company_quote_request")
      .eq("entity_id", leadId)

    if (notificationError) {
      console.error("Mark company lead notification read error:", notificationError)
    }
  }

  revalidatePath("/dashboard/company-leads")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")
}
