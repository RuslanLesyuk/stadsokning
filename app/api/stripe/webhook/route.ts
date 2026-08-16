import { NextResponse } from "next/server"
import Stripe from "stripe"

import { hasStripePremiumEntitlement, isBillingDateInFuture } from "@/lib/billing/types"
import { getStripeClient } from "@/lib/billing/stripe"
import { createAdminClient } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type ExistingBillingRow = {
  user_id: string
  grace_until: string | null
  last_payment_failed_at: string | null
}

type ProfileState = {
  premium_override_until: string | null
}

function getCustomerId(subscription: Stripe.Subscription) {
  return typeof subscription.customer === "string"
    ? subscription.customer
    : subscription.customer.id
}

function getPeriodEnd(subscription: Stripe.Subscription) {
  const periodEnd = subscription.items.data[0]?.current_period_end
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : null
}

function getPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id || null
}

function getBillingInterval(subscription: Stripe.Subscription) {
  const interval = subscription.items.data[0]?.price?.recurring?.interval
  if (interval === "month") return "monthly"
  if (interval === "year") return "yearly"
  return "unknown"
}

function getGraceDays() {
  const parsed = Number(process.env.BILLING_GRACE_DAYS || "3")
  if (!Number.isFinite(parsed)) return 3
  return Math.max(0, Math.min(30, Math.floor(parsed)))
}

function addGracePeriod(from = new Date()) {
  const date = new Date(from)
  date.setUTCDate(date.getUTCDate() + getGraceDays())
  return date.toISOString()
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice) {
  const modern = invoice as unknown as {
    parent?: {
      type?: string | null
      subscription_details?: {
        subscription?: string | { id: string } | null
      } | null
    } | null
  }

  const parentSubscription = modern.parent?.subscription_details?.subscription
  if (typeof parentSubscription === "string") return parentSubscription
  if (parentSubscription?.id) return parentSubscription.id

  const legacy = invoice as unknown as {
    subscription?: string | { id: string } | null
  }
  if (typeof legacy.subscription === "string") return legacy.subscription
  return legacy.subscription?.id || null
}

function getInvoiceCustomerId(invoice: Stripe.Invoice) {
  if (typeof invoice.customer === "string") return invoice.customer
  return invoice.customer?.id || null
}

async function resolveUserId({
  subscription,
  subscriptionId,
  customerId,
}: {
  subscription?: Stripe.Subscription | null
  subscriptionId?: string | null
  customerId?: string | null
}) {
  const metadataUserId = subscription?.metadata?.user_id
  if (metadataUserId) return metadataUserId

  const admin = createAdminClient()

  if (subscriptionId) {
    const { data } = await admin
      .from("billing_subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle()
    if (data?.user_id) return data.user_id as string

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_subscription_id", subscriptionId)
      .maybeSingle()
    if (profile?.id) return profile.id as string
  }

  if (customerId) {
    const { data } = await admin
      .from("billing_subscriptions")
      .select("user_id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle()
    if (data?.user_id) return data.user_id as string

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
      .maybeSingle()
    if (profile?.id) return profile.id as string
  }

  return null
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  options: {
    invoice?: Stripe.Invoice | null
    paymentFailed?: boolean
    paymentPaid?: boolean
  } = {},
) {
  const admin = createAdminClient()
  const customerId = getCustomerId(subscription)
  const subscriptionId = subscription.id
  const userId = await resolveUserId({ subscription, subscriptionId, customerId })

  if (!userId) {
    console.warn("Stripe subscription is not linked to a Clean Jobs user:", subscriptionId)
    return null
  }

  const [{ data: existingData }, { data: profileData }] = await Promise.all([
    admin
      .from("billing_subscriptions")
      .select("user_id, grace_until, last_payment_failed_at")
      .eq("user_id", userId)
      .maybeSingle(),
    admin
      .from("profiles")
      .select("premium_override_until")
      .eq("id", userId)
      .maybeSingle(),
  ])

  const existing = (existingData || null) as ExistingBillingRow | null
  const profile = (profileData || null) as ProfileState | null
  const now = new Date()
  let graceUntil = existing?.grace_until || null
  let lastPaymentFailedAt = existing?.last_payment_failed_at || null

  if (options.paymentPaid) {
    graceUntil = null
    lastPaymentFailedAt = null
  } else if (options.paymentFailed || subscription.status === "past_due") {
    if (!lastPaymentFailedAt) {
      lastPaymentFailedAt = now.toISOString()
      graceUntil = addGracePeriod(now)
    }
  } else if (subscription.status === "active" || subscription.status === "trialing") {
    graceUntil = null
    lastPaymentFailedAt = null
  } else {
    graceUntil = null
  }

  const currentPeriodEnd = getPeriodEnd(subscription)
  const priceId = getPriceId(subscription)
  const billingInterval = getBillingInterval(subscription)
  const invoice = options.invoice || null

  const { error: subscriptionError } = await admin
    .from("billing_subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        plan: "premium",
        billing_interval: billingInterval,
        price_id: priceId,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: currentPeriodEnd,
        grace_until: graceUntil,
        last_invoice_id: invoice?.id || undefined,
        last_invoice_status: invoice?.status || undefined,
        last_payment_failed_at: lastPaymentFailedAt,
        updated_at: now.toISOString(),
      },
      { onConflict: "user_id" },
    )

  if (subscriptionError) throw subscriptionError

  const adminOverride = isBillingDateInFuture(profile?.premium_override_until, now)
  const stripeEntitled = hasStripePremiumEntitlement(
    subscription.status,
    graceUntil,
    now,
  )

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      is_premium: adminOverride || stripeEntitled,
      premium_source: adminOverride ? "admin" : stripeEntitled ? "stripe" : "none",
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_subscription_status: subscription.status,
      stripe_price_id: priceId,
      stripe_billing_interval: billingInterval,
      subscription_ends_at: currentPeriodEnd,
      billing_grace_until: graceUntil,
      premium_updated_at: now.toISOString(),
    })
    .eq("id", userId)

  if (profileError) throw profileError
  return userId
}

async function recordInvoiceTransaction({
  eventId,
  invoice,
  userId,
  status,
}: {
  eventId: string
  invoice: Stripe.Invoice
  userId: string
  status: "paid" | "failed"
}) {
  const admin = createAdminClient()
  const paidAt = invoice.status_transitions?.paid_at
    ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
    : status === "paid"
      ? new Date().toISOString()
      : null

  const { error } = await admin.from("billing_transactions").upsert(
    {
      user_id: userId,
      kind: "subscription",
      reference_id: getInvoiceSubscriptionId(invoice),
      stripe_event_id: eventId,
      stripe_invoice_id: invoice.id,
      amount_minor: status === "paid" ? invoice.amount_paid : invoice.amount_due,
      currency: invoice.currency.toUpperCase(),
      status,
      paid_at: paidAt,
      metadata: {
        billing_reason: invoice.billing_reason,
        attempt_count: invoice.attempt_count,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_invoice_id" },
  )

  if (error) throw error
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id || session.client_reference_id
  if (!userId || session.metadata?.type !== "premium") return

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id || null
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || null

  if (subscriptionId) {
    const subscription = await getStripeClient().subscriptions.retrieve(subscriptionId)
    await syncSubscription(subscription)
    return
  }

  if (customerId) {
    const admin = createAdminClient()
    const { error } = await admin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userId)
    if (error) throw error
  }
}

async function handleInvoice(eventId: string, invoice: Stripe.Invoice, paid: boolean) {
  const subscriptionId = getInvoiceSubscriptionId(invoice)
  if (!subscriptionId) return

  const subscription = await getStripeClient().subscriptions.retrieve(subscriptionId)
  const userId = await syncSubscription(subscription, {
    invoice,
    paymentPaid: paid,
    paymentFailed: !paid,
  })

  if (userId) {
    await recordInvoiceTransaction({
      eventId,
      invoice,
      userId,
      status: paid ? "paid" : "failed",
    })
  }
}

async function beginWebhookEvent(event: Stripe.Event) {
  const admin = createAdminClient()
  const { data: existing, error: readError } = await admin
    .from("billing_webhook_events")
    .select("event_id, status")
    .eq("event_id", event.id)
    .maybeSingle()

  if (readError) throw readError
  if (existing?.status === "processed") return false

  if (existing) {
    const { error } = await admin
      .from("billing_webhook_events")
      .update({ status: "processing", error_message: null, updated_at: new Date().toISOString() })
      .eq("event_id", event.id)
    if (error) throw error
    return true
  }

  const { error } = await admin.from("billing_webhook_events").insert({
    event_id: event.id,
    event_type: event.type,
    livemode: event.livemode,
    status: "processing",
    stripe_created_at: new Date(event.created * 1000).toISOString(),
  })
  if (error) throw error
  return true
}

async function finishWebhookEvent(eventId: string) {
  const admin = createAdminClient()
  const { error } = await admin
    .from("billing_webhook_events")
    .update({
      status: "processed",
      processed_at: new Date().toISOString(),
      error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("event_id", eventId)
  if (error) throw error
}

async function failWebhookEvent(eventId: string, message: string) {
  const admin = createAdminClient()
  await admin
    .from("billing_webhook_events")
    .update({
      status: "failed",
      error_message: message.slice(0, 4000),
      updated_at: new Date().toISOString(),
    })
    .eq("event_id", eventId)
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 })
  }

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const body = await request.text()
  let event: Stripe.Event

  try {
    event = getStripeClient().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  try {
    const shouldProcess = await beginWebhookEvent(event)
    if (!shouldProcess) return NextResponse.json({ received: true, duplicate: true })

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      case "invoice.paid":
        await handleInvoice(event.id, event.data.object as Stripe.Invoice, true)
        break
      case "invoice.payment_failed":
        await handleInvoice(event.id, event.data.object as Stripe.Invoice, false)
        break
      default:
        break
    }

    await finishWebhookEvent(event.id)
    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed"
    console.error("Stripe webhook processing error:", error)
    await failWebhookEvent(event.id, message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
