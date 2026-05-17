import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 },
    )
  }

  const stripe = new Stripe(stripeSecretKey)
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", siteUrl), 303)
  }

  const formData = await request.formData()
  const checkoutType = String(formData.get("type") || "")

  if (checkoutType !== "premium") {
    return NextResponse.json(
      { error: "Invalid checkout type" },
      { status: 400 },
    )
  }

  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID

  if (!priceId) {
    return NextResponse.json(
      { error: "Missing STRIPE_PREMIUM_PRICE_ID" },
      { status: 500 },
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email || undefined,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      type: "premium",
    },
    success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/billing/cancel`,
  })

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 },
    )
  }

  return NextResponse.redirect(session.url, 303)
}