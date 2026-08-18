import { NextResponse } from "next/server"

import { sendEmail } from "@/lib/resend"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export async function GET() {
  if (process.env.ENABLE_EMAIL_TEST_ROUTE !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !getAdminEmails().includes(user.email.toLowerCase())) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const to = process.env.TEST_EMAIL_TO
    if (!to) {
      return NextResponse.json({ error: "Missing TEST_EMAIL_TO" }, { status: 500 })
    }

    await sendEmail({
      to,
      subject: "Clean Jobs test email",
      html: "<div style=\"font-family:Arial,sans-serif;padding:24px\"><h1>Clean Jobs email test</h1><p>If you received this, Resend works.</p></div>",
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Admin email test error:", error)
    return NextResponse.json({ ok: false, error: "Email test failed" }, { status: 500 })
  }
}
