import { NextResponse } from "next/server"

import { createAdminClient } from "@/lib/supabase-admin"

type RouteContext = {
  params: Promise<{
    leadId: string
  }>
}

export async function GET(
  request: Request,
  context: RouteContext,
) {
  const { leadId } = await context.params

  const signupUrl = new URL("/signup", request.url)

  signupUrl.searchParams.set(
    "utm_source",
    "company_outreach",
  )
  signupUrl.searchParams.set("utm_medium", "email")
  signupUrl.searchParams.set(
    "utm_campaign",
    "company_invitation",
  )

  if (!leadId) {
    return NextResponse.redirect(signupUrl)
  }

  signupUrl.searchParams.set("lead", leadId)

  try {
    const admin = createAdminClient()

    const { data: lead, error: leadError } = await admin
      .from("company_leads")
      .select("id, status, registered")
      .eq("id", leadId)
      .maybeSingle()

    if (leadError) {
      console.error(
        "Company invite tracking load error:",
        leadError.message,
      )

      return NextResponse.redirect(signupUrl)
    }

    if (
      lead &&
      lead.status !== "registered" &&
      !lead.registered
    ) {
      const { error: updateError } = await admin
        .from("company_leads")
        .update({
          status: "opened",
        })
        .eq("id", lead.id)
        .neq("status", "registered")
        .eq("registered", false)

      if (updateError) {
        console.error(
          "Company invite tracking update error:",
          updateError.message,
        )
      }
    }
  } catch (error) {
    console.error(
      "Company invite tracking exception:",
      error,
    )
  }

  return NextResponse.redirect(signupUrl)
}