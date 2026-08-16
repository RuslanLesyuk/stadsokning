export const BILLING_INTERVALS = ["monthly", "yearly", "unknown"] as const
export type BillingInterval = (typeof BILLING_INTERVALS)[number]

export const BILLING_SUBSCRIPTION_STATUSES = [
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
] as const

export type BillingSubscriptionStatus =
  (typeof BILLING_SUBSCRIPTION_STATUSES)[number]

export type PremiumSource = "none" | "legacy" | "stripe" | "admin"

export type BillingSubscriptionRow = {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: string
  billing_interval: BillingInterval
  price_id: string | null
  status: BillingSubscriptionStatus
  cancel_at_period_end: boolean
  current_period_end: string | null
  grace_until: string | null
  last_invoice_id: string | null
  last_invoice_status: string | null
  last_payment_failed_at: string | null
  created_at: string
  updated_at: string
}

export type BillingAccess = {
  userId: string
  isPremium: boolean
  source: PremiumSource
  status: BillingSubscriptionStatus | null
  interval: BillingInterval
  customerId: string | null
  subscriptionId: string | null
  priceId: string | null
  currentPeriodEnd: string | null
  graceUntil: string | null
  cancelAtPeriodEnd: boolean
  overrideUntil: string | null
  isInGracePeriod: boolean
}

function isFuture(value: string | null | undefined, now: Date) {
  if (!value) return false
  const timestamp = new Date(value).getTime()
  return Number.isFinite(timestamp) && timestamp > now.getTime()
}

export function hasStripePremiumEntitlement(
  status: string | null | undefined,
  graceUntil: string | null | undefined,
  now = new Date(),
) {
  if (status === "active" || status === "trialing") return true
  if (status === "past_due") return isFuture(graceUntil, now)
  return false
}

export function hasLegacyPremiumEntitlement({
  isPremium,
  subscriptionEndsAt,
  now = new Date(),
}: {
  isPremium: boolean
  subscriptionEndsAt: string | null
  now?: Date
}) {
  if (!isPremium) return false
  if (!subscriptionEndsAt) return true
  return isFuture(subscriptionEndsAt, now)
}

export function isBillingDateInFuture(
  value: string | null | undefined,
  now = new Date(),
) {
  return isFuture(value, now)
}
