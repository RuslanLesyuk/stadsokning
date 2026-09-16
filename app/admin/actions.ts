"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  hasStripePremiumEntitlement,
  isBillingDateInFuture,
} from "@/lib/billing/types"
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

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com").replace(
    /\/$/,
    "",
  )
}

function formatSwedishDate(value: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    dateStyle: "long",
  }).format(value)
}

function buildPremiumGrantedEmail({
  premiumUntil,
}: {
  premiumUntil: Date
}) {
  const siteUrl = getSiteUrl()
  const dashboardUrl = `${siteUrl}/dashboard`
  const billingUrl = `${siteUrl}/billing`
  const untilText = formatSwedishDate(premiumUntil)

  return {
    subject: "Du har fått Clean Jobs Premium gratis",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:32px 20px">
        <p style="margin:0 0 12px;color:#e11d48;font-weight:700">Clean Jobs</p>
        <h1 style="margin:0 0 18px;font-size:28px;line-height:1.2">Premium är nu aktiverat på ditt konto</h1>
        <p style="margin:0 0 16px">
          Vi har gett dig kostnadsfri tillgång till <strong>Clean Jobs Premium</strong>
          till och med <strong>${untilText}</strong>.
        </p>
        <p style="margin:0 0 22px">
          Logga in och använd Premium-funktionerna. Premium ger bland annat bättre
          synlighet och tillgång till avancerade företagsfunktioner där de är tillgängliga.
        </p>
        <a href="${dashboardUrl}" style="display:inline-block;padding:13px 20px;border-radius:12px;background:#e11d48;color:#ffffff;text-decoration:none;font-weight:700">
          Öppna Clean Jobs
        </a>
        <p style="margin:24px 0 0;font-size:13px;color:#64748b">
          Du kan se din Premium-status på
          <a href="${billingUrl}" style="color:#e11d48">Clean Jobs Premium & fakturering</a>.
        </p>
      </div>
    `,
  }
}

async function sendPremiumGrantedEmail({
  admin,
  userId,
  premiumUntil,
}: {
  admin: ReturnType<typeof createAdminClient>
  userId: string
  premiumUntil: Date
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "Premium granted email skipped: RESEND_API_KEY is not configured.",
    )
    return
  }

  try {
    const { data, error } = await admin.auth.admin.getUserById(userId)

    if (error) {
      console.error("Load Premium recipient email error:", error.message)
      return
    }

    const recipient = data.user?.email?.trim()

    if (!recipient) {
      console.warn("Premium granted email skipped: user has no email.", userId)
      return
    }

    const { sendEmail } = await import("@/lib/resend")
    const email = buildPremiumGrantedEmail({ premiumUntil })

    const result = await sendEmail({
      to: recipient,
      subject: email.subject,
      html: email.html,
    })

    if (result.error) {
      console.error(
        "Premium granted email error:",
        result.error.message || result.error,
      )
    }
  } catch (error) {
    console.error("Premium granted email unexpected error:", error)
  }
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
  } else {
    await sendPremiumGrantedEmail({
      admin: supabase,
      userId,
      premiumUntil: premiumOverrideUntil,
    })
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
    (!billing.current_period_end ||
      isBillingDateInFuture(billing.current_period_end))

  const nextPremium = stripeEntitled || legacyEntitled
  const nextSource = stripeEntitled
    ? "stripe"
    : legacyEntitled
      ? "legacy"
      : "none"

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
