import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY")
}

const stripe = new Stripe(stripeSecretKey)

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/login", siteUrl), 303)
  }

  const formData = await request.formData()
  const checkoutType = String(formData.get("type") || "")

  if (checkoutType === "premium") {
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

  if (checkoutType === "featured_job") {
    const priceId = process.env.STRIPE_FEATURED_JOB_PRICE_ID
    const jobId = String(formData.get("job_id") || "")

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_FEATURED_JOB_PRICE_ID" },
        { status: 500 },
      )
    }

    if (!jobId) {
      return NextResponse.json({ error: "Missing job_id" }, { status: 400 })
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("id, created_by")
      .eq("id", jobId)
      .single()

    if (!job || job.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        job_id: jobId,
        type: "featured_job",
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

  return NextResponse.json({ error: "Invalid checkout type" }, { status: 400 })
}