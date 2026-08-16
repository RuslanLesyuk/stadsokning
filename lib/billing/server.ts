import { createAdminClient } from "@/lib/supabase-admin"

import {
  hasLegacyPremiumEntitlement,
  hasStripePremiumEntitlement,
  isBillingDateInFuture,
  type BillingAccess,
  type BillingInterval,
  type BillingSubscriptionRow,
  type BillingSubscriptionStatus,
  type PremiumSource,
} from "./types"

type ProfileBillingRow = {
  is_premium: boolean | null
  premium_source: PremiumSource | null
  premium_override_until: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_subscription_status: string | null
  stripe_price_id: string | null
  stripe_billing_interval: string | null
  subscription_ends_at: string | null
  billing_grace_until: string | null
}

function interval(value: string | null | undefined): BillingInterval {
  return value === "monthly" || value === "yearly" ? value : "unknown"
}

function status(value: string | null | undefined): BillingSubscriptionStatus | null {
  const allowed = new Set([
    "active",
    "trialing",
    "past_due",
    "unpaid",
    "canceled",
    "incomplete",
    "incomplete_expired",
    "paused",
    "legacy",
    "inactive",
  ])
  return value && allowed.has(value) ? (value as BillingSubscriptionStatus) : null
}

export async function getBillingAccessForUser(userId: string): Promise<BillingAccess> {
  const admin = createAdminClient()

  const [{ data: profileData, error: profileError }, { data: subscriptionData, error: subscriptionError }] =
    await Promise.all([
      admin
        .from("profiles")
        .select(
          "is_premium, premium_source, premium_override_until, stripe_customer_id, stripe_subscription_id, stripe_subscription_status, stripe_price_id, stripe_billing_interval, subscription_ends_at, billing_grace_until",
        )
        .eq("id", userId)
        .maybeSingle(),
      admin
        .from("billing_subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(),
    ])

  if (profileError) throw profileError
  if (subscriptionError) throw subscriptionError

  const profile = (profileData || null) as ProfileBillingRow | null
  const subscription = (subscriptionData || null) as BillingSubscriptionRow | null
  const now = new Date()

  const overrideUntil = profile?.premium_override_until || null
  const adminOverride = isBillingDateInFuture(overrideUntil, now)

  const stripeStatus = status(subscription?.status || profile?.stripe_subscription_status)
  const graceUntil = subscription?.grace_until || profile?.billing_grace_until || null
  const stripeEntitled = hasStripePremiumEntitlement(stripeStatus, graceUntil, now)

  const legacyEntitled =
    !subscription || subscription.status === "legacy"
      ? hasLegacyPremiumEntitlement({
          isPremium: Boolean(profile?.is_premium),
          subscriptionEndsAt:
            subscription?.current_period_end || profile?.subscription_ends_at || null,
          now,
        })
      : false

  let source: PremiumSource = "none"
  if (adminOverride) source = "admin"
  else if (stripeEntitled) source = "stripe"
  else if (legacyEntitled) source = "legacy"

  return {
    userId,
    isPremium: adminOverride || stripeEntitled || legacyEntitled,
    source,
    status: stripeStatus,
    interval: interval(subscription?.billing_interval || profile?.stripe_billing_interval),
    customerId: subscription?.stripe_customer_id || profile?.stripe_customer_id || null,
    subscriptionId:
      subscription?.stripe_subscription_id || profile?.stripe_subscription_id || null,
    priceId: subscription?.price_id || profile?.stripe_price_id || null,
    currentPeriodEnd:
      subscription?.current_period_end || profile?.subscription_ends_at || null,
    graceUntil,
    cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end),
    overrideUntil,
    isInGracePeriod:
      stripeStatus === "past_due" && isBillingDateInFuture(graceUntil, now),
  }
}
