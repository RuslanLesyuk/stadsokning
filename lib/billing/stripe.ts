import Stripe from "stripe"

import type { BillingInterval } from "./types"

let stripeClient: Stripe | null = null

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) throw new Error("Missing STRIPE_SECRET_KEY")

  if (!stripeClient) stripeClient = new Stripe(secretKey)
  return stripeClient
}

export function getPremiumPriceId(interval: BillingInterval) {
  if (interval === "monthly") {
    return (
      process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID ||
      process.env.STRIPE_PREMIUM_PRICE_ID ||
      null
    )
  }

  if (interval === "yearly") {
    return process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID || null
  }

  return null
}

export async function getPremiumPricePresentation(interval: BillingInterval) {
  const priceId = getPremiumPriceId(interval)
  if (!priceId) return null
  if (!priceId.startsWith("price_")) {
    throw new Error(`Invalid Stripe price id for ${interval}`)
  }

  const price = await getStripeClient().prices.retrieve(priceId)
  return {
    id: price.id,
    amount: price.unit_amount,
    currency: price.currency.toUpperCase(),
    interval: price.recurring?.interval || null,
  }
}
