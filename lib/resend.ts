import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY")
}

export const resend = new Resend(resendApiKey)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  return resend.emails.send({
    from: "Clean Jobs <noreply@cleansjob.com>",
    to,
    subject,
    html,
  })
}