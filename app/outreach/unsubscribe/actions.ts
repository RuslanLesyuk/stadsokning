"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"

function getToken(formData: FormData) {
  const value = formData.get("token")
  return typeof value === "string" ? value.trim() : ""
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function confirmOutreachUnsubscribeAction(formData: FormData) {
  const token = getToken(formData)

  if (!isUuid(token)) {
    redirect("/outreach/unsubscribed?status=invalid")
  }

  const admin = createAdminClient()
  const { data: preference, error: readError } = await admin
    .from("outreach_email_preferences")
    .select("email_normalized, opted_out_at")
    .eq("unsubscribe_token", token)
    .maybeSingle()

  if (readError || !preference) {
    if (readError) console.error("Outreach unsubscribe lookup error:", readError)
    redirect("/outreach/unsubscribed?status=invalid")
  }

  if (!preference.opted_out_at) {
    const now = new Date().toISOString()
    const { error: updateError } = await admin
      .from("outreach_email_preferences")
      .update({ opted_out_at: now, updated_at: now })
      .eq("unsubscribe_token", token)
      .is("opted_out_at", null)

    if (updateError) {
      console.error("Outreach unsubscribe update error:", updateError)
      redirect("/outreach/unsubscribed?status=error")
    }

    const { error: leadError } = await admin
      .from("company_leads")
      .update({ status: "ignored" })
      .ilike("email", preference.email_normalized)
      .neq("status", "registered")

    if (leadError) {
      // Preference is already persisted, so never roll back the opt-out because
      // an admin-CRM convenience update failed.
      console.error("Outreach lead suppression sync error:", leadError)
    }
  }

  revalidatePath("/admin/leads")
  revalidatePath("/admin/automation")
  redirect("/outreach/unsubscribed?status=ok")
}
