import { NextResponse } from "next/server"

import { getBillingAccessForUser } from "@/lib/billing/server"
import { getStripeClient } from "@/lib/billing/stripe"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"

export async function GET() {
  return NextResponse.redirect(new URL("/billing", siteUrl), 303)
}

export async function POST() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login?next=/billing", siteUrl), 303)
    }

    const access = await getBillingAccessForUser(user.id)
    if (!access.customerId) {
      return NextResponse.redirect(new URL("/billing?error=no-customer", siteUrl), 303)
    }

    const session = await getStripeClient().billingPortal.sessions.create({
      customer: access.customerId,
      return_url: `${siteUrl}/billing`,
    })

    return NextResponse.redirect(session.url, 303)
  } catch (error) {
    console.error("Stripe customer portal error:", error)
    return NextResponse.redirect(new URL("/billing?error=portal-failed", siteUrl), 303)
  }
}
