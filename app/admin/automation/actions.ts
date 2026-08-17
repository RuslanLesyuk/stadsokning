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
    redirect("/login?next=/admin/automation")
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function refreshPaths() {
  revalidatePath("/admin")
  revalidatePath("/admin/automation")
  revalidatePath("/admin/billing")
  revalidatePath("/billing")
  revalidatePath("/profile")
  revalidatePath("/dashboard")
  revalidatePath("/", "layout")
}

export async function reconcileExpiredPremiumOverridesAction() {
  const admin = await requireAdmin()
  const now = new Date().toISOString()

  const { data: profiles, error: profileError } = await admin
    .from("profiles")
    .select("id")
    .eq("premium_source", "admin")
    .not("premium_override_until", "is", null)
    .lt("premium_override_until", now)
    .limit(500)

  if (profileError) {
    console.error("Load expired premium overrides error:", profileError)
    redirect("/admin/automation?maintenance=error")
  }

  const userIds = (profiles ?? []).map((profile: { id: string }) => profile.id)

  if (userIds.length === 0) {
    redirect("/admin/automation?maintenance=none")
  }

  const { data: billingRows, error: billingError } = await admin
    .from("billing_subscriptions")
    .select("user_id, status, grace_until, current_period_end")
    .in("user_id", userIds)

  if (billingError) {
    console.error("Load billing state for premium reconciliation error:", billingError)
    redirect("/admin/automation?maintenance=error")
  }

  type BillingStateRow = {
    user_id: string
    status: string
    grace_until: string | null
    current_period_end: string | null
  }

  const billingByUser = new Map<string, BillingStateRow>(
    ((billingRows ?? []) as BillingStateRow[]).map((row) => [row.user_id, row]),
  )

  let updated = 0
  let failed = 0

  for (const userId of userIds) {
    const billing = billingByUser.get(userId)
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

    const { error } = await admin
      .from("profiles")
      .update({
        is_premium: nextPremium,
        premium_source: nextSource,
        premium_override_until: null,
        premium_updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      failed += 1
      console.error(`Premium reconciliation failed for ${userId}:`, error)
    } else {
      updated += 1
    }
  }

  refreshPaths()

  const params = new URLSearchParams({
    maintenance: failed > 0 ? "partial" : "ok",
    updated: String(updated),
    failed: String(failed),
  })

  redirect(`/admin/automation?${params.toString()}`)
}
