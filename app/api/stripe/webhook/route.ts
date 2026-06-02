import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getSubscriptionPeriodEnd(subscription: Stripe.Subscription) {
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end

  if (!currentPeriodEnd) {
    return null
  }

  return new Date(currentPeriodEnd * 1000).toISOString()
}

async function updatePremiumBySubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()

  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id

  const subscriptionId = subscription.id
  const userId = subscription.metadata?.user_id || null
  const subscriptionEndsAt = getSubscriptionPeriodEnd(subscription)

  const isActive =
    subscription.status === "active" || subscription.status === "trialing"

  const updatePayload = {
    is_premium: isActive,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    subscription_ends_at: subscriptionEndsAt,
  }

  if (userId) {
    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)

    if (error) {
      throw error
    }

    return
  }

  const { error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("stripe_subscription_id", subscriptionId)

  if (error) {
    throw error
  }
}

async function updatePremiumByCheckoutSession(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()

  const userId = session.metadata?.user_id
  const type = session.metadata?.type

  if (!userId || type !== "premium") {
    return
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || null

  const updatePayload = {
    is_premium: true,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
  }

  const { error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", userId)

  if (error) {
    throw error
  }
}

async function removePremiumBySubscription(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()

  const subscriptionId = subscription.id
  const userId = subscription.metadata?.user_id || null

  const updatePayload = {
    is_premium: false,
    subscription_ends_at: null,
  }

  if (userId) {
    const { error } = await supabase
      .from("profiles")
      .update(updatePayload)
      .eq("id", userId)

    if (error) {
      throw error
    }

    return
  }

  const { error } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("stripe_subscription_id", subscriptionId)

  if (error) {
    throw error
  }
}

export async function POST(request: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 })
  }

  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  const stripe = new Stripe(stripeSecretKey)
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid Stripe webhook signature"

    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await updatePremiumByCheckoutSession(session)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await updatePremiumBySubscription(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await removePremiumBySubscription(subscription)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId =
          typeof invoice.subscription === "string"
            ? invoice.subscription
            : invoice.subscription?.id || null

        if (subscriptionId) {
          const supabase = createAdminClient()

          const { error } = await supabase
            .from("profiles")
            .update({
              is_premium: false,
            })
            .eq("stripe_subscription_id", subscriptionId)

          if (error) {
            throw error
          }
        }

        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook handler failed"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}