import { NextResponse } from "next/server"

import { getBillingAccessForUser } from "@/lib/billing/server"
import { getPremiumPriceId, getStripeClient } from "@/lib/billing/stripe"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export async function GET() {
  return NextResponse.redirect(new URL("/billing", siteUrl), 303)
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 })
    }

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/billing", siteUrl), 303)
    }

    const formData = await request.formData()
    const checkoutType = String(formData.get("type") || "")
    const interval = String(formData.get("interval") || "")

    if (checkoutType !== "premium") {
      return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 })
    }

    if (interval !== "monthly" && interval !== "yearly") {
      return NextResponse.redirect(new URL("/billing", siteUrl), 303)
    }

    const priceId = getPremiumPriceId(interval)
    if (!priceId) {
      return NextResponse.redirect(
        new URL(`/billing?error=missing-${interval}-price`, siteUrl),
        303,
      )
    }

    if (!priceId.startsWith("price_")) {
      return NextResponse.redirect(
        new URL(`/billing?error=invalid-${interval}-price`, siteUrl),
        303,
      )
    }

    const access = await getBillingAccessForUser(user.id)
    const blockingStatuses = new Set([
      "active",
      "trialing",
      "past_due",
      "unpaid",
      "incomplete",
      "paused",
    ])

    const hasBlockingSubscription =
      Boolean(access.subscriptionId) &&
      (Boolean(access.status && blockingStatuses.has(access.status)) ||
        (access.status === "legacy" && access.source === "legacy" && access.isPremium))

    if (hasBlockingSubscription) {
      return NextResponse.redirect(new URL("/billing?error=subscription-exists", siteUrl), 303)
    }

    const stripe = getStripeClient()
    const metadata = {
      user_id: user.id,
      type: "premium",
      plan: "premium",
      interval,
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id,
      ...(access.customerId
        ? { customer: access.customerId }
        : { customer_email: user.email || undefined }),
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      subscription_data: { metadata },
      allow_promotion_codes: true,
      success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/billing/cancel`,
    })

    if (!session.url) {
      return NextResponse.redirect(new URL("/billing?error=no-checkout-url", siteUrl), 303)
    }

    return NextResponse.redirect(session.url, 303)
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.redirect(new URL("/billing?error=checkout-failed", siteUrl), 303)
  }
}
