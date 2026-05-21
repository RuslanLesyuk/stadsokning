import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/resend"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const to = process.env.TEST_EMAIL_TO

    if (!to) {
      return NextResponse.json(
        { error: "Missing TEST_EMAIL_TO env variable" },
        { status: 500 },
      )
    }

    const result = await sendEmail({
      to,
      subject: "Clean Jobs test email",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">
          <h1>Clean Jobs email test</h1>
          <p>If you received this, Resend works.</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true, result })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { ok: false, error: "Unknown email error" },
      { status: 500 },
    )
  }
}