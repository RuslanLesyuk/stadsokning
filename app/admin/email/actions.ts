"use server"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"
import { sendEmail } from "@/lib/resend"

export type ManualOutreachState = {
  status: "idle" | "error" | "duplicate" | "success"
  message: string
  previousSentAt?: string | null
  previousSubject?: string | null
  previousSource?: "manual" | "company_invite" | null
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://cleansjob.com"
  ).replace(/\/$/, "")
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email || !getAdminEmails().includes(user.email.toLowerCase())) {
    throw new Error("Unauthorized")
  }

  return {
    user,
    admin: createAdminClient(),
  }
}

type OutreachPreference = {
  email_normalized: string
  unsubscribe_token: string
  opted_out_at: string | null
}

async function getOutreachPreference(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
) {
  const { data, error } = await admin
    .from("outreach_email_preferences")
    .upsert(
      {
        email_normalized: email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email_normalized" },
    )
    .select("email_normalized, unsubscribe_token, opted_out_at")
    .single()

  if (error || !data) {
    console.error("Manual outreach preference error:", error)
    throw new Error("Could not verify email preferences.")
  }

  return data as OutreachPreference
}

function buildUnsubscribeUrl(token: string) {
  return `${getSiteUrl()}/outreach/unsubscribe/${encodeURIComponent(token)}`
}

function buildManualOutreachHtml({
  subject,
  message,
  unsubscribeUrl,
}: {
  subject: string
  message: string
  unsubscribeUrl: string
}) {
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />")
  const safeUnsubscribeUrl = escapeHtml(unsubscribeUrl)
  const supportEmail = escapeHtml(
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@cleansjob.com",
  )

  return `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${safeSubject}</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f8fafc;padding:24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;">
                <tr>
                  <td style="padding:26px 32px;background:#fff1f2;border-bottom:1px solid #fecdd3;">
                    <div style="font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#be123c;">Clean Jobs</div>
                    <div style="margin-top:8px;font-size:13px;color:#64748b;">Sveriges marknadsplats för städtjänster</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <div style="font-size:16px;line-height:1.75;color:#334155;">${safeMessage}</div>

                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0 0;">
                      <tr>
                        <td style="border-radius:14px;background:#e11d48;">
                          <a href="${getSiteUrl()}" style="display:inline-block;padding:13px 20px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">Besök Clean Jobs</a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:28px 0 0;font-size:13px;line-height:1.7;color:#64748b;">
                      Vill ni inte få fler meddelanden från Clean Jobs?
                      <a href="${safeUnsubscribeUrl}" style="color:#475569;text-decoration:underline;">Avregistrera e-postadressen</a>
                      eller kontakta oss på
                      <a href="mailto:${supportEmail}" style="color:#475569;text-decoration:underline;">${supportEmail}</a>.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;line-height:1.6;color:#94a3b8;">
                    Clean Jobs · cleansjob.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export async function sendManualOutreachAction(
  _previousState: ManualOutreachState,
  formData: FormData,
): Promise<ManualOutreachState> {
  let auth: Awaited<ReturnType<typeof requireAdmin>>

  try {
    auth = await requireAdmin()
  } catch {
    return {
      status: "error",
      message: "Admin session is not available. Reload the page and sign in again.",
    }
  }

  const { user, admin } = auth
  const email = normalizeEmail(getFormValue(formData, "email"))
  const subject = getFormValue(formData, "subject")
  const message = getFormValue(formData, "message")
  const forceSend = getFormValue(formData, "forceSend") === "true"

  if (!isValidEmail(email)) {
    return { status: "error", message: "Enter a valid email address." }
  }

  if (subject.length < 3 || subject.length > 180) {
    return {
      status: "error",
      message: "Subject must contain between 3 and 180 characters.",
    }
  }

  if (message.length < 20 || message.length > 8000) {
    return {
      status: "error",
      message: "Message must contain between 20 and 8,000 characters.",
    }
  }

  let preference: OutreachPreference

  try {
    preference = await getOutreachPreference(admin, email)
  } catch (error) {
    console.error("Manual outreach preference exception:", error)
    return {
      status: "error",
      message: "Could not verify the recipient's email preferences.",
    }
  }

  if (preference.opted_out_at) {
    return {
      status: "error",
      message: "This email address has opted out. Sending is blocked.",
    }
  }

  const [manualResult, inviteResult] = await Promise.all([
    admin
      .from("manual_outreach_emails")
      .select("subject, sent_at")
      .eq("email_normalized", email)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from("company_leads")
      .select("company_name, last_invited_at, invited_at, invite_count")
      .ilike("email", email)
      .gt("invite_count", 0)
      .order("last_invited_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (manualResult.error) {
    console.error("Manual outreach history error:", manualResult.error)
    return { status: "error", message: "Could not check previous sends." }
  }

  if (inviteResult.error) {
    console.error("Company invite history error:", inviteResult.error)
    return { status: "error", message: "Could not check previous company invites." }
  }

  const manualPrevious = manualResult.data
  const leadPrevious = inviteResult.data
  const leadSentAt = leadPrevious?.last_invited_at || leadPrevious?.invited_at || null

  const candidates = [
    manualPrevious
      ? {
          source: "manual" as const,
          sentAt: manualPrevious.sent_at,
          subject: manualPrevious.subject,
        }
      : null,
    leadPrevious && leadSentAt
      ? {
          source: "company_invite" as const,
          sentAt: leadSentAt,
          subject: `Company invite${leadPrevious.company_name ? ` · ${leadPrevious.company_name}` : ""}`,
        }
      : null,
  ].filter(Boolean) as Array<{
    source: "manual" | "company_invite"
    sentAt: string
    subject: string
  }>

  candidates.sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime(),
  )

  const previous = candidates[0]

  if (previous && !forceSend) {
    return {
      status: "duplicate",
      message: "A Clean Jobs email has already been sent to this address.",
      previousSentAt: previous.sentAt,
      previousSubject: previous.subject,
      previousSource: previous.source,
    }
  }

  const html = buildManualOutreachHtml({
    subject,
    message,
    unsubscribeUrl: buildUnsubscribeUrl(preference.unsubscribe_token),
  })

  try {
    const result = await sendEmail({
      to: email,
      subject,
      html,
    })

    if (result.error) {
      console.error("Manual outreach Resend error:", result.error)
      return {
        status: "error",
        message: `Email was not sent: ${result.error.message}`,
      }
    }

    const { error: insertError } = await admin
      .from("manual_outreach_emails")
      .insert({
        email_normalized: email,
        subject,
        message,
        resend_email_id: result.data?.id || null,
        sent_by: user.id,
        sent_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error("Manual outreach log insert error:", insertError)
      return {
        status: "success",
        message:
          "Email was sent, but the send history could not be saved. Check the server log before sending to this address again.",
      }
    }

    return {
      status: "success",
      message: `Email sent to ${email}.`,
    }
  } catch (error) {
    console.error("Manual outreach send exception:", error)
    return {
      status: "error",
      message: "Email was not sent. Check the Resend configuration.",
    }
  }
}
