"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  COMPANY_LEAD_PRIORITIES,
  COMPANY_LEAD_STATUSES,
  type CompanyLeadPriority,
  type CompanyLeadStatus,
} from "@/lib/company-leads/types"
import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function parseNullableNumber(value: string) {
  if (!value) return null
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) ? parsed : null
}

function parseDateTimeLocal(value: string) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

async function getAuthenticatedClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company-leads")
  }

  return { supabase, user }
}

function refreshLeadPaths(leadId?: string) {
  revalidatePath("/dashboard/company")
  revalidatePath("/dashboard/company-leads")
  if (leadId) revalidatePath(`/dashboard/company-leads/${leadId}`)
  revalidatePath("/notifications")
  revalidatePath("/", "layout")
}

export async function markCompanyLeadViewedAction(leadId: string) {
  if (!leadId) return { ok: false }

  const { supabase, user } = await getAuthenticatedClient()

  const { data: lead, error: loadError } = await supabase
    .from("company_quote_requests")
    .select("id, status, first_viewed_at")
    .eq("id", leadId)
    .maybeSingle()

  if (loadError || !lead) {
    if (loadError) console.error("Load company lead for view tracking error:", loadError)
    return { ok: false }
  }

  const payload: Record<string, unknown> = {}

  if (!lead.first_viewed_at) {
    payload.first_viewed_at = new Date().toISOString()
    payload.viewed_by = user.id
  }

  if (lead.status === "new") {
    payload.status = "viewed"
  }

  if (Object.keys(payload).length > 0) {
    const { error } = await supabase
      .from("company_quote_requests")
      .update(payload)
      .eq("id", leadId)

    if (error) {
      console.error("Mark company lead viewed error:", error)
      return { ok: false }
    }
  }

  const { error: notificationError } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("entity_type", "company_quote_request")
    .eq("entity_id", leadId)

  if (notificationError) {
    console.error("Mark company lead notification read error:", notificationError)
  }

  refreshLeadPaths(leadId)
  return { ok: true }
}

export async function setCompanyLeadStatusAction(
  leadId: string,
  status: CompanyLeadStatus,
) {
  if (!leadId || !COMPANY_LEAD_STATUSES.includes(status)) {
    return { ok: false, message: "Invalid lead status." }
  }

  const { supabase, user } = await getAuthenticatedClient()

  const { data: lead, error: loadError } = await supabase
    .from("company_quote_requests")
    .select("id, first_viewed_at")
    .eq("id", leadId)
    .maybeSingle()

  if (loadError || !lead) {
    console.error("Load company lead before status update error:", loadError)
    return { ok: false, message: "Could not update lead status." }
  }

  const payload: Record<string, unknown> = { status }

  if (status !== "new" && !lead.first_viewed_at) {
    payload.first_viewed_at = new Date().toISOString()
    payload.viewed_by = user.id
  }

  const { data, error } = await supabase
    .from("company_quote_requests")
    .update(payload)
    .eq("id", leadId)
    .select("id")
    .maybeSingle()

  if (error || !data) {
    console.error("Company lead status update error:", error)
    return { ok: false, message: "Could not update lead status." }
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

  refreshLeadPaths(leadId)
  return { ok: true }
}

export async function updateCompanyLeadDetailsAction(formData: FormData) {
  const leadId = getString(formData, "lead_id")
  if (!leadId) redirect("/dashboard/company-leads")

  const priority = getString(formData, "priority") as CompanyLeadPriority
  const notes = getString(formData, "owner_notes")
  const lostReason = getString(formData, "lost_reason")
  const scoreRaw = getString(formData, "lead_score")
  const estimatedRaw = getString(formData, "estimated_value")
  const quotedRaw = getString(formData, "quoted_value")
  const followUpRaw = getString(formData, "follow_up_at")

  if (!COMPANY_LEAD_PRIORITIES.includes(priority)) {
    redirect(`/dashboard/company-leads/${leadId}?error=invalid-priority`)
  }

  if (notes.length > 5000 || lostReason.length > 1000) {
    redirect(`/dashboard/company-leads/${leadId}?error=text-too-long`)
  }

  const score = parseNullableNumber(scoreRaw)
  const estimatedValue = parseNullableNumber(estimatedRaw)
  const quotedValue = parseNullableNumber(quotedRaw)
  const followUpAt = parseDateTimeLocal(followUpRaw)

  if (score !== null && (!Number.isInteger(score) || score < 0 || score > 100)) {
    redirect(`/dashboard/company-leads/${leadId}?error=invalid-score`)
  }

  if (estimatedValue !== null && estimatedValue < 0) {
    redirect(`/dashboard/company-leads/${leadId}?error=invalid-estimated-value`)
  }

  if (quotedValue !== null && quotedValue < 0) {
    redirect(`/dashboard/company-leads/${leadId}?error=invalid-quoted-value`)
  }

  if (followUpRaw && !followUpAt) {
    redirect(`/dashboard/company-leads/${leadId}?error=invalid-follow-up`)
  }

  const { supabase } = await getAuthenticatedClient()

  const { data, error } = await supabase
    .from("company_quote_requests")
    .update({
      priority,
      owner_notes: notes || null,
      lost_reason: lostReason || null,
      lead_score: score,
      estimated_value: estimatedValue,
      quoted_value: quotedValue,
      follow_up_at: followUpAt,
    })
    .eq("id", leadId)
    .select("id")
    .maybeSingle()

  if (error || !data) {
    console.error("Update company lead details error:", error)
    redirect(`/dashboard/company-leads/${leadId}?error=save-failed`)
  }

  refreshLeadPaths(leadId)
  redirect(`/dashboard/company-leads/${leadId}?saved=true`)
}