"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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

  const adminEmails = getAdminEmails()
  const isAdmin = adminEmails.includes(user.email.toLowerCase())

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return supabase
}

export async function verifyUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = String(formData.get("userId") || "").trim()

  if (!userId) {
    redirect("/admin")
  }

  await supabase.from("profiles").update({ verified: true }).eq("id", userId)

  revalidatePath("/admin")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect("/admin")
}

export async function unverifyUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = String(formData.get("userId") || "").trim()

  if (!userId) {
    redirect("/admin")
  }

  await supabase.from("profiles").update({ verified: false }).eq("id", userId)

  revalidatePath("/admin")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect("/admin")
}

export async function setPremiumUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = String(formData.get("userId") || "").trim()

  if (!userId) {
    redirect("/admin")
  }

  const subscriptionEndsAt = new Date()
  subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1)

  await supabase
    .from("profiles")
    .update({
      is_premium: true,
      subscription_ends_at: subscriptionEndsAt.toISOString(),
    })
    .eq("id", userId)

  revalidatePath("/admin")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect("/admin")
}

export async function removePremiumUserAction(formData: FormData) {
  const supabase = await requireAdmin()
  const userId = String(formData.get("userId") || "").trim()

  if (!userId) {
    redirect("/admin")
  }

  await supabase
    .from("profiles")
    .update({
      is_premium: false,
      subscription_ends_at: null,
    })
    .eq("id", userId)

  revalidatePath("/admin")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect("/admin")
}

export async function cancelJobAction(formData: FormData) {
  const supabase = await requireAdmin()
  const jobId = String(formData.get("jobId") || "").trim()

  if (!jobId) {
    redirect("/admin")
  }

  await supabase.from("jobs").update({ status: "cancelled" }).eq("id", jobId)

  revalidatePath("/admin")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")
  revalidatePath(`/jobs/${jobId}`)

  redirect("/admin")
}

export async function resolveReportAction(formData: FormData) {
  const supabase = await requireAdmin()
  const reportId = String(formData.get("reportId") || "").trim()
  const jobId = String(formData.get("jobId") || "").trim()

  if (!reportId) {
    redirect("/admin")
  }

  await supabase
    .from("job_reports")
    .update({
      status: "resolved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)

  revalidatePath("/admin")

  if (jobId) {
    revalidatePath(`/jobs/${jobId}`)
  }

  redirect("/admin")
}

export async function dismissReportAction(formData: FormData) {
  const supabase = await requireAdmin()
  const reportId = String(formData.get("reportId") || "").trim()

  if (!reportId) {
    redirect("/admin")
  }

  await supabase
    .from("job_reports")
    .update({
      status: "dismissed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId)

  revalidatePath("/admin")

  redirect("/admin")
}
