import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createAdminClient } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function getCustomerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id
}

function getPeriodEnd(subscription: Stripe.Subscription) {
  const currentPeriodEnd = subscription.items.data[0]?.current_period_end

  if (!currentPeriodEnd) {
    return null
  }

  return new Date(currentPeriodEnd * 1000).toISOString()
}

function isSubscriptionPremiumActive(subscription: Stripe.Subscription) {
  if (subscription.cancel_at_period_end) {
    return subscription.status === "active" || subscription.status === "trialing"
  }

  return subscription.status === "active" || subscription.status === "trialing"
}

async function updateProfileByUserId({
  userId,
  customerId,
  subscriptionId,
  isPremium,
  subscriptionEndsAt,
}: {
  userId: string
  customerId: string | null
  subscriptionId: string | null
  isPremium: boolean
  subscriptionEndsAt: string | null
}) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: isPremium,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_ends_at: subscriptionEndsAt,
    })
    .eq("id", userId)

  if (error) {
    throw error
  }
}

async function updateProfileBySubscriptionId({
  subscriptionId,
  isPremium,
  subscriptionEndsAt,
}: {
  subscriptionId: string
  isPremium: boolean
  subscriptionEndsAt: string | null
}) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("profiles")
    .update({
      is_premium: isPremium,
      subscription_ends_at: subscriptionEndsAt,
    })
    .eq("stripe_subscription_id", subscriptionId)

  if (error) {
    throw error
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
) {
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

  let subscriptionEndsAt: string | null = null

  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    subscriptionEndsAt = getPeriodEnd(subscription)
  }

  await updateProfileByUserId({
    userId,
    customerId,
    subscriptionId,
    isPremium: true,
    subscriptionEndsAt,
  })
}

async function handleSubscriptionChanged(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription)
  const subscriptionId = subscription.id
  const userId = subscription.metadata?.user_id || null
  const subscriptionEndsAt = getPeriodEnd(subscription)
  const isPremium = isSubscriptionPremiumActive(subscription)

  if (userId) {
    await updateProfileByUserId({
      userId,
      customerId,
      subscriptionId,
      isPremium,
      subscriptionEndsAt,
    })

    return
  }

  await updateProfileBySubscriptionId({
    subscriptionId,
    isPremium,
    subscriptionEndsAt,
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id
  const userId = subscription.metadata?.user_id || null

  if (userId) {
    await updateProfileByUserId({
      userId,
      customerId: getCustomerId(subscription),
      subscriptionId,
      isPremium: false,
      subscriptionEndsAt: null,
    })

    return
  }

  await updateProfileBySubscriptionId({
    subscriptionId,
    isPremium: false,
    subscriptionEndsAt: null,
  })
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice & {
    subscription?: string | Stripe.Subscription | null
  }

  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id || null

  if (!subscriptionId) {
    return
  }

  await updateProfileBySubscriptionId({
    subscriptionId,
    isPremium: false,
    subscriptionEndsAt: null,
  })
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
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 },
    )
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
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          stripe,
        )
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await handleSubscriptionChanged(event.data.object as Stripe.Subscription)
        break
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      }

      case "invoice.payment_failed": {
        await handleInvoicePaymentFailed(event)
        break
      }

      default:
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed"

    return NextResponse.json({ error: message }, { status: 500 })
  }
}