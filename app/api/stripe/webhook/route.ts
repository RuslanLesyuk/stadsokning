import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

export async function POST(req: Request) {
  const body = await req.text()

  const signature = (await headers()).get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret,
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 },
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const type = session.metadata?.type

    if (type === "premium" && userId) {
      const subscriptionEndsAt = new Date()

      subscriptionEndsAt.setMonth(
        subscriptionEndsAt.getMonth() + 1,
      )

      await supabase
        .from("profiles")
        .update({
          is_premium: true,
          subscription_ends_at:
            subscriptionEndsAt.toISOString(),
        })
        .eq("id", userId)
    }

    if (type === "featured_job") {
      const jobId = session.metadata?.job_id

      if (jobId) {
        const featuredUntil = new Date()

        featuredUntil.setDate(
          featuredUntil.getDate() + 7,
        )

        await supabase
          .from("jobs")
          .update({
            featured_until:
              featuredUntil.toISOString(),
          })
          .eq("id", jobId)
      }
    }
  }

  return NextResponse.json({ received: true })
}