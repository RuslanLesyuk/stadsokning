"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { sendEmail } from "@/lib/resend"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const LEAD_STATUSES = [
  "new",
  "invited",
  "opened",
  "registered",
  "ignored",
] as const

type LeadStatus = (typeof LEAD_STATUSES)[number]

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin(nextPath = "/admin/leads") {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  const isAdmin = getAdminEmails().includes(user.email.toLowerCase())

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function getFormValue(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim()
}

function normalizeOptionalValue(value: string) {
  return value || null
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function normalizeWebsite(value: string) {
  const website = value.trim()

  if (!website) {
    return ""
  }

  if (
    website.startsWith("http://") ||
    website.startsWith("https://")
  ) {
    return website
  }

  return `https://${website}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function redirectWithCreateError(message: string): never {
  redirect(`/admin/leads/new?error=${encodeURIComponent(message)}`)
}

function redirectWithEditError(
  leadId: string,
  message: string,
): never {
  redirect(
    `/admin/leads/${leadId}/edit?error=${encodeURIComponent(message)}`,
  )
}

function redirectWithListError(message: string): never {
  redirect(`/admin/leads?error=${encodeURIComponent(message)}`)
}

function refreshLeadPaths(leadId?: string) {
  revalidatePath("/admin")
  revalidatePath("/admin/leads")

  if (leadId) {
    revalidatePath(`/admin/leads/${leadId}/edit`)
  }
}

async function emailAlreadyExists({
  email,
  excludeLeadId,
}: {
  email: string
  excludeLeadId?: string
}) {
  const admin = createAdminClient()

  let query = admin
    .from("company_leads")
    .select("id")
    .ilike("email", email)

  if (excludeLeadId) {
    query = query.neq("id", excludeLeadId)
  }

  const { data, error } = await query.limit(1)

  if (error) {
    console.error("emailAlreadyExists error:", error.message)
    throw new Error(error.message)
  }

  return Boolean(data?.length)
}

function getInviteUrl(leadId: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://cleansjob.com"

  const url = new URL(
    `/company-invite/${encodeURIComponent(leadId)}`,
    siteUrl,
  )

  return url.toString()
}

function createCompanyInviteEmail({
  companyName,
  inviteUrl,
}: {
  companyName: string
  inviteUrl: string
}) {
  const safeCompanyName = escapeHtml(companyName)
  const safeInviteUrl = escapeHtml(inviteUrl)

  const subject =
    "Få fler städuppdrag i Sverige med Clean Jobs"

  const html = `
    <!doctype html>
    <html lang="sv">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(subject)}</title>
      </head>

      <body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
          Skapa en kostnadsfri företagsprofil och hitta nya städuppdrag.
        </div>

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="background:#f8fafc;padding:24px 12px;"
        >
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;"
              >
                <tr>
                  <td
                    style="padding:28px 32px;background:#fff1f2;border-bottom:1px solid #fecdd3;"
                  >
                    <div
                      style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#be123c;"
                    >
                      Clean Jobs
                    </div>

                    <h1
                      style="margin:12px 0 0;font-size:28px;line-height:1.2;color:#0f172a;"
                    >
                      Få fler städuppdrag i Sverige
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334155;">
                      Hej ${safeCompanyName},
                    </p>

                    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334155;">
                      Vi vill bjuda in ert företag till
                      <strong>Clean Jobs</strong> – en plattform där
                      privatpersoner och företag kan publicera
                      städuppdrag och jämföra städföretag.
                    </p>

                    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#334155;">
                      Genom att registrera ert företag kan ni:
                    </p>

                    <ul
                      style="margin:0 0 24px;padding-left:22px;font-size:16px;line-height:1.8;color:#334155;"
                    >
                      <li>visa era städtjänster och verksamhetsområden;</li>
                      <li>hitta nya uppdrag i er stad;</li>
                      <li>skicka ansökningar och prisförslag;</li>
                      <li>bygga upp omdömen och företagets synlighet;</li>
                      <li>ta emot förfrågningar från nya kunder.</li>
                    </ul>

                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="margin:0 0 26px;"
                    >
                      <tr>
                        <td
                          style="border-radius:14px;background:#e11d48;"
                        >
                          <a
                            href="${safeInviteUrl}"
                            style="display:inline-block;padding:14px 22px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;"
                          >
                            Skapa företagsprofil
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 18px;font-size:14px;line-height:1.7;color:#64748b;">
                      Registreringen är enkel och ni bestämmer själva
                      vilka tjänster och områden som ska visas.
                    </p>

                    <p style="margin:0;font-size:16px;line-height:1.7;color:#334155;">
                      Vänliga hälsningar,<br />
                      <strong>Clean Jobs</strong><br />
                      Sveriges marknadsplats för städtjänster
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;"
                  >
                    <p style="margin:0;font-size:12px;line-height:1.6;color:#94a3b8;">
                      Detta meddelande skickades eftersom ert företag
                      erbjuder städtjänster i Sverige.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

  return {
    subject,
    html,
  }
}

export async function createCompanyLeadAction(formData: FormData) {
  const admin = await requireAdmin("/admin/leads/new")

  const companyName = getFormValue(formData, "companyName")
  const city = getFormValue(formData, "city")
  const website = normalizeWebsite(
    getFormValue(formData, "website"),
  )
  const email = normalizeEmail(getFormValue(formData, "email"))
  const phone = getFormValue(formData, "phone")
  const source = getFormValue(formData, "source") || "manual"
  const notes = getFormValue(formData, "notes")

  if (!companyName) {
    redirectWithCreateError("Company name is required.")
  }

  if (!email && !phone && !website) {
    redirectWithCreateError(
      "Add at least an email, phone number or website.",
    )
  }

  if (email && !email.includes("@")) {
    redirectWithCreateError("Enter a valid email address.")
  }

  if (email) {
    let exists = false

    try {
      exists = await emailAlreadyExists({ email })
    } catch {
      redirectWithCreateError(
        "Could not verify whether this email already exists.",
      )
    }

    if (exists) {
      redirectWithCreateError(
        "A company with this email already exists.",
      )
    }
  }

  const { error } = await admin.from("company_leads").insert({
    company_name: companyName,
    city: normalizeOptionalValue(city),
    website: normalizeOptionalValue(website),
    email: normalizeOptionalValue(email),
    phone: normalizeOptionalValue(phone),
    source,
    notes: normalizeOptionalValue(notes),
    status: "new",
    registered: false,
    invite_count: 0,
  })

  if (error) {
    console.error("createCompanyLeadAction error:", error.message)

    if (error.code === "23505") {
      redirectWithCreateError(
        "A company with this email already exists.",
      )
    }

    redirectWithCreateError(
      "Could not add the company. Try again.",
    )
  }

  refreshLeadPaths()

  redirect("/admin/leads?success=company-added")
}

export async function updateCompanyLeadAction(formData: FormData) {
  const leadId = getFormValue(formData, "leadId")

  if (!leadId) {
    redirectWithListError("Missing company lead.")
  }

  const admin = await requireAdmin(`/admin/leads/${leadId}/edit`)

  const companyName = getFormValue(formData, "companyName")
  const city = getFormValue(formData, "city")
  const website = normalizeWebsite(
    getFormValue(formData, "website"),
  )
  const email = normalizeEmail(getFormValue(formData, "email"))
  const phone = getFormValue(formData, "phone")
  const source = getFormValue(formData, "source") || "manual"
  const notes = getFormValue(formData, "notes")
  const status = getFormValue(formData, "status") as LeadStatus

  if (!companyName) {
    redirectWithEditError(leadId, "Company name is required.")
  }

  if (!email && !phone && !website) {
    redirectWithEditError(
      leadId,
      "Add at least an email, phone number or website.",
    )
  }

  if (email && !email.includes("@")) {
    redirectWithEditError(leadId, "Enter a valid email address.")
  }

  if (!LEAD_STATUSES.includes(status)) {
    redirectWithEditError(leadId, "Invalid lead status.")
  }

  if (email) {
    let exists = false

    try {
      exists = await emailAlreadyExists({
        email,
        excludeLeadId: leadId,
      })
    } catch {
      redirectWithEditError(
        leadId,
        "Could not verify whether this email already exists.",
      )
    }

    if (exists) {
      redirectWithEditError(
        leadId,
        "A company with this email already exists.",
      )
    }
  }

  const { error } = await admin
    .from("company_leads")
    .update({
      company_name: companyName,
      city: normalizeOptionalValue(city),
      website: normalizeOptionalValue(website),
      email: normalizeOptionalValue(email),
      phone: normalizeOptionalValue(phone),
      source,
      notes: normalizeOptionalValue(notes),
      status,
      registered: status === "registered",
    })
    .eq("id", leadId)

  if (error) {
    console.error("updateCompanyLeadAction error:", error.message)

    if (error.code === "23505") {
      redirectWithEditError(
        leadId,
        "A company with this email already exists.",
      )
    }

    redirectWithEditError(
      leadId,
      "Could not update the company. Try again.",
    )
  }

  refreshLeadPaths(leadId)

  redirect("/admin/leads?success=company-updated")
}

export async function deleteCompanyLeadAction(formData: FormData) {
  const leadId = getFormValue(formData, "leadId")

  if (!leadId) {
    redirectWithListError("Missing company lead.")
  }

  const admin = await requireAdmin("/admin/leads")

  const { error } = await admin
    .from("company_leads")
    .delete()
    .eq("id", leadId)

  if (error) {
    console.error("deleteCompanyLeadAction error:", error.message)
    redirectWithListError("Could not delete the company.")
  }

  refreshLeadPaths(leadId)

  redirect("/admin/leads?success=company-deleted")
}

export async function sendCompanyInviteAction(formData: FormData) {
  const leadId = getFormValue(formData, "leadId")

  if (!leadId) {
    redirectWithListError("Missing company lead.")
  }

  const admin = await requireAdmin("/admin/leads")

  const { data: lead, error: leadError } = await admin
    .from("company_leads")
    .select(
      `
        id,
        company_name,
        email,
        status,
        invite_count
      `,
    )
    .eq("id", leadId)
    .maybeSingle()

  if (leadError) {
    console.error(
      "sendCompanyInviteAction lead error:",
      leadError.message,
    )

    redirectWithListError("Could not load the company.")
  }

  if (!lead) {
    redirectWithListError("Company not found.")
  }

  const email = normalizeEmail(String(lead.email || ""))

  if (!email) {
    redirectWithListError(
      "This company does not have an email address.",
    )
  }

  if (!email.includes("@")) {
    redirectWithListError(
      "This company has an invalid email address.",
    )
  }

  if (lead.status === "registered") {
    redirectWithListError(
      "This company is already marked as registered.",
    )
  }

  const inviteUrl = getInviteUrl(lead.id)

  const emailContent = createCompanyInviteEmail({
    companyName: lead.company_name,
    inviteUrl,
  })

  

  try {
  const result = await sendEmail({
    to: email,
    subject: emailContent.subject,
    html: emailContent.html,
  })

  if (result.error) {
    console.error(
      "Resend company invite error:",
      result.error,
    )

    redirectWithListError(
      `Email was not sent: ${result.error.message}`,
    )
  }
} catch (error) {
  console.error("sendCompanyInviteAction error:", error)

  redirectWithListError(
    "Email was not sent. Check the Resend configuration.",
  )
}
  const invitedAt = new Date().toISOString()
  const currentInviteCount = Number(lead.invite_count || 0)

  const { error: updateError } = await admin
  .from("company_leads")
  .update({
    status: "invited",
    invited_at: invitedAt,
    last_invited_at: invitedAt,
    invite_count: currentInviteCount + 1,
  })
    .eq("id", lead.id)

  if (updateError) {
    console.error(
      "Update invited company error:",
      updateError.message,
    )

    redirectWithListError(
      "Email was sent, but the lead status could not be updated.",
    )
  }

  refreshLeadPaths(lead.id)

  redirect("/admin/leads?success=invite-sent")
}
export async function sendBulkCompanyInvitesAction(
  formData: FormData,
) {
  const admin = await requireAdmin("/admin/leads")

  const rawLeadIds = getFormValue(formData, "leadIds")

  let parsedLeadIds: unknown

  try {
    parsedLeadIds = JSON.parse(rawLeadIds)
  } catch {
    redirectWithListError(
      "Could not read the selected companies.",
    )
  }

  if (!Array.isArray(parsedLeadIds)) {
    redirectWithListError("Invalid company selection.")
  }

  const leadIds = Array.from(
    new Set(
      parsedLeadIds
        .filter(
          (value): value is string =>
            typeof value === "string" &&
            value.trim().length > 0,
        )
        .map((value) => value.trim()),
    ),
  ).slice(0, 50)

  if (leadIds.length === 0) {
    redirectWithListError(
      "Select at least one company.",
    )
  }

  const { data: leads, error: leadsError } = await admin
    .from("company_leads")
    .select(
      `
        id,
        company_name,
        email,
        status,
        registered,
        invite_count
      `,
    )
    .in("id", leadIds)

  if (leadsError) {
    console.error(
      "sendBulkCompanyInvitesAction leads error:",
      leadsError.message,
    )

    redirectWithListError(
      "Could not load the selected companies.",
    )
  }

  let sentCount = 0
  let skippedCount = 0
  let failedCount = 0

  for (const lead of leads ?? []) {
    const email = normalizeEmail(String(lead.email || ""))

    const cannotReceiveInvite =
      !email ||
      !email.includes("@") ||
      lead.status === "registered" ||
      Boolean(lead.registered)

    if (cannotReceiveInvite) {
      skippedCount += 1
      continue
    }

    const inviteUrl = getInviteUrl(lead.id)

    const emailContent = createCompanyInviteEmail({
      companyName: lead.company_name,
      inviteUrl,
    })

    try {
      const result = await sendEmail({
        to: email,
        subject: emailContent.subject,
        html: emailContent.html,
      })

      if (result.error) {
        console.error(
          `Bulk invite error for ${lead.id}:`,
          result.error,
        )

        failedCount += 1
        continue
      }

      const invitedAt = new Date().toISOString()
      const currentInviteCount = Number(
        lead.invite_count || 0,
      )

      const { error: updateError } = await admin
        .from("company_leads")
        .update({
          status: "invited",
          invited_at: invitedAt,
          last_invited_at: invitedAt,
          invite_count: currentInviteCount + 1,
        })
        .eq("id", lead.id)

      if (updateError) {
        console.error(
          `Bulk lead update error for ${lead.id}:`,
          updateError.message,
        )

        failedCount += 1
        continue
      }

      sentCount += 1
    } catch (error) {
      console.error(
        `Bulk company invite exception for ${lead.id}:`,
        error,
      )

      failedCount += 1
    }
  }

  const missingCount = Math.max(
    0,
    leadIds.length - (leads?.length ?? 0),
  )

  skippedCount += missingCount

  refreshLeadPaths()

  const params = new URLSearchParams({
    success: "bulk-invites-sent",
    sent: String(sentCount),
    skipped: String(skippedCount),
    failed: String(failedCount),
  })

  redirect(`/admin/leads?${params.toString()}`)
}