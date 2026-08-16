"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { hasStripePremiumEntitlement, isBillingDateInFuture } from "@/lib/billing/types"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect("/login?next=/admin")
  }

  const isAdmin = getAdminEmails().includes(user.email.toLowerCase())

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function getFormId(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function refreshAdminPaths() {
  revalidatePath("/admin")
  revalidatePath("/admin/billing")
  revalidatePath("/billing")
  revalidatePath("/profile")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath("/services")
}

export async function verifyUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = getFormId(formData, "userId")

  if (!userId) redirect("/admin")

  const { error } = await supabase
    .from("profiles")
    .update({ verified: true })
    .eq("id", userId)

  if (error) {
    console.error("verifyUserAction error:", error.message)
  }

  refreshAdminPaths()
  redirect("/admin")
}

export async function unverifyUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = getFormId(formData, "userId")

  if (!userId) redirect("/admin")

  const { error } = await supabase
    .from("profiles")
    .update({ verified: false })
    .eq("id", userId)

  if (error) {
    console.error("unverifyUserAction error:", error.message)
  }

  refreshAdminPaths()
  redirect("/admin")
}

export async function setPremiumUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = getFormId(formData, "userId")

  if (!userId) redirect("/admin")

  const premiumOverrideUntil = new Date()
  premiumOverrideUntil.setMonth(premiumOverrideUntil.getMonth() + 1)

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: true,
      premium_source: "admin",
      premium_override_until: premiumOverrideUntil.toISOString(),
      premium_updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("setPremiumUserAction error:", error.message)
  }

  refreshAdminPaths()
  revalidatePath("/billing")
  redirect("/admin")
}

export async function removePremiumUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = getFormId(formData, "userId")

  if (!userId) redirect("/admin")

  const { data: billing } = await supabase
    .from("billing_subscriptions")
    .select("status, grace_until, current_period_end")
    .eq("user_id", userId)
    .maybeSingle()

  const stripeEntitled = hasStripePremiumEntitlement(
    billing?.status || null,
    billing?.grace_until || null,
  )
  const legacyEntitled =
    billing?.status === "legacy" &&
    (!billing.current_period_end || isBillingDateInFuture(billing.current_period_end))

  const nextPremium = stripeEntitled || legacyEntitled
  const nextSource = stripeEntitled ? "stripe" : legacyEntitled ? "legacy" : "none"

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: nextPremium,
      premium_source: nextSource,
      premium_override_until: null,
      premium_updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error("removePremiumUserAction error:", error.message)
  }

  refreshAdminPaths()
  revalidatePath("/billing")
  redirect("/admin")
}

export async function cancelJobAction(formData: FormData) {
  const supabase = await requireAdmin()
  const jobId = getFormId(formData, "jobId")

  if (!jobId) redirect("/admin")

  const { error } = await supabase
    .from("jobs")
    .update({ status: "cancelled" })
    .eq("id", jobId)

  if (error) {
    console.error("cancelJobAction error:", error.message)
  }

  refreshAdminPaths()
  revalidatePath(`/jobs/${jobId}`)
  redirect("/admin")
}

export async function resolveReportAction(formData: FormData) {
  const supabase = await requireAdmin()
  const reportId = getFormId(formData, "reportId")
  const jobId = getFormId(formData, "jobId")

  if (!reportId) redirect("/admin")

  const { error } = await supabase
    .from("job_reports")
    .update({
      status: "resolved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)

  if (error) {
    console.error("resolveReportAction error:", error.message)
  }

  revalidatePath("/admin")

  if (jobId) {
    revalidatePath(`/jobs/${jobId}`)
  }

  redirect("/admin")
}

export async function dismissReportAction(formData: FormData) {
  const supabase = await requireAdmin()
  const reportId = getFormId(formData, "reportId")

  if (!reportId) redirect("/admin")

  const { error } = await supabase
    .from("job_reports")
    .update({
      status: "dismissed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)

  if (error) {
    console.error("dismissReportAction error:", error.message)
  }

  revalidatePath("/admin")
  redirect("/admin")
}
