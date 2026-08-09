"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type Decision = "approved" | "rejected" | "needs_info"

type ClaimContext = {
  id: string
  company_id: string
  user_id: string
  locale: string | null
  business_email: string | null
  status: string
  updated_at: string
  companies:
    | {
        id: string
        name: string
        slug: string
      }
    | {
        id: string
        name: string
        slug: string
      }[]
    | null
}

const copy: Record<
  Locale,
  Record<
    Decision,
    {
      title: string
      message: (company: string, note?: string) => string
      subject: (company: string) => string
      emailTitle: string
      cta: string
    }
  >
> = {
  sv: {
    approved: {
      title: "Företagsanspråk godkänt",
      message: (company) => `Din begäran för ${company} har godkänts. Du kan nu hantera företagsprofilen.`,
      subject: (company) => `Din begäran för ${company} har godkänts`,
      emailTitle: "Din företagsverifiering är godkänd",
      cta: "Hantera företaget",
    },
    rejected: {
      title: "Företagsanspråk avslogs",
      message: (company, note) => `Din begäran för ${company} avslogs.${note ? ` Orsak: ${note}` : ""}`,
      subject: (company) => `Din begäran för ${company} avslogs`,
      emailTitle: "Din företagsverifiering avslogs",
      cta: "Visa begäran",
    },
    needs_info: {
      title: "Mer information behövs",
      message: (company, note) => `Vi behöver mer information för din begäran om ${company}.${note ? ` ${note}` : ""}`,
      subject: (company) => `Komplettera din begäran för ${company}`,
      emailTitle: "Vi behöver mer information",
      cta: "Komplettera begäran",
    },
  },
  en: {
    approved: {
      title: "Company claim approved",
      message: (company) => `Your claim for ${company} has been approved. You can now manage the company profile.`,
      subject: (company) => `Your claim for ${company} has been approved`,
      emailTitle: "Your company verification is approved",
      cta: "Manage company",
    },
    rejected: {
      title: "Company claim rejected",
      message: (company, note) => `Your claim for ${company} was rejected.${note ? ` Reason: ${note}` : ""}`,
      subject: (company) => `Your claim for ${company} was rejected`,
      emailTitle: "Your company verification was rejected",
      cta: "View claim",
    },
    needs_info: {
      title: "More information required",
      message: (company, note) => `We need more information for your claim for ${company}.${note ? ` ${note}` : ""}`,
      subject: (company) => `Please update your claim for ${company}`,
      emailTitle: "We need more information",
      cta: "Update claim",
    },
  },
  uk: {
    approved: {
      title: "Заявку на компанію схвалено",
      message: (company) => `Вашу заявку на ${company} схвалено. Тепер ви можете керувати профілем компанії.`,
      subject: (company) => `Вашу заявку на ${company} схвалено`,
      emailTitle: "Перевірку компанії завершено",
      cta: "Керувати компанією",
    },
    rejected: {
      title: "Заявку на компанію відхилено",
      message: (company, note) => `Вашу заявку на ${company} відхилено.${note ? ` Причина: ${note}` : ""}`,
      subject: (company) => `Вашу заявку на ${company} відхилено`,
      emailTitle: "Заявку на компанію відхилено",
      cta: "Переглянути заявку",
    },
    needs_info: {
      title: "Потрібна додаткова інформація",
      message: (company, note) => `Для заявки на ${company} потрібна додаткова інформація.${note ? ` ${note}` : ""}`,
      subject: (company) => `Доповніть заявку на ${company}`,
      emailTitle: "Потрібна додаткова інформація",
      cta: "Доповнити заявку",
    },
  },
  ru: {
    approved: {
      title: "Заявка на компанию одобрена",
      message: (company) => `Ваша заявка на ${company} одобрена. Теперь вы можете управлять профилем компании.`,
      subject: (company) => `Ваша заявка на ${company} одобрена`,
      emailTitle: "Проверка компании завершена",
      cta: "Управлять компанией",
    },
    rejected: {
      title: "Заявка на компанию отклонена",
      message: (company, note) => `Ваша заявка на ${company} отклонена.${note ? ` Причина: ${note}` : ""}`,
      subject: (company) => `Ваша заявка на ${company} отклонена`,
      emailTitle: "Заявка на компанию отклонена",
      cta: "Посмотреть заявку",
    },
    needs_info: {
      title: "Нужна дополнительная информация",
      message: (company, note) => `Для заявки на ${company} нужна дополнительная информация.${note ? ` ${note}` : ""}`,
      subject: (company) => `Дополните заявку на ${company}`,
      emailTitle: "Нужна дополнительная информация",
      cta: "Дополнить заявку",
    },
  },
  pl: {
    approved: {
      title: "Zgłoszenie firmy zatwierdzone",
      message: (company) => `Twoje zgłoszenie dotyczące ${company} zostało zatwierdzone. Możesz teraz zarządzać profilem firmy.`,
      subject: (company) => `Twoje zgłoszenie dotyczące ${company} zostało zatwierdzone`,
      emailTitle: "Weryfikacja firmy została zatwierdzona",
      cta: "Zarządzaj firmą",
    },
    rejected: {
      title: "Zgłoszenie firmy odrzucone",
      message: (company, note) => `Twoje zgłoszenie dotyczące ${company} zostało odrzucone.${note ? ` Powód: ${note}` : ""}`,
      subject: (company) => `Twoje zgłoszenie dotyczące ${company} zostało odrzucone`,
      emailTitle: "Weryfikacja firmy została odrzucona",
      cta: "Zobacz zgłoszenie",
    },
    needs_info: {
      title: "Potrzebujemy dodatkowych informacji",
      message: (company, note) => `Potrzebujemy dodatkowych informacji dotyczących zgłoszenia ${company}.${note ? ` ${note}` : ""}`,
      subject: (company) => `Uzupełnij zgłoszenie dotyczące ${company}`,
      emailTitle: "Potrzebujemy dodatkowych informacji",
      cta: "Uzupełnij zgłoszenie",
    },
  },
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function normalizeLocale(value: string | null | undefined): Locale {
  return ["sv", "en", "uk", "ru", "pl"].includes(value || "")
    ? (value as Locale)
    : "sv"
}

function getCompany(claim: ClaimContext) {
  if (!claim.companies) return null
  return Array.isArray(claim.companies) ? claim.companies[0] ?? null : claim.companies
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) redirect("/login?next=/admin")

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    redirect("/dashboard")
  }

  return user
}

async function loadClaim(adminSupabase: ReturnType<typeof createAdminClient>, claimId: string) {
  const { data, error } = await adminSupabase
    .from("company_claim_requests")
    .select(`
      id,
      company_id,
      user_id,
      locale,
      business_email,
      status,
      updated_at,
      companies (
        id,
        name,
        slug
      )
    `)
    .eq("id", claimId)
    .maybeSingle()

  if (error || !data) {
    throw new Error(error?.message || "Claim request not found.")
  }

  return data as ClaimContext
}

async function createDecisionNotification({
  adminSupabase,
  claim,
  decision,
  actorId,
  note,
}: {
  adminSupabase: ReturnType<typeof createAdminClient>
  claim: ClaimContext
  decision: Decision
  actorId: string
  note?: string | null
}) {
  const company = getCompany(claim)
  if (!company) return

  const locale = normalizeLocale(claim.locale)
  const t = copy[locale][decision]
  const href =
    decision === "approved"
      ? `/dashboard/companies/${company.id}/onboarding`
      : decision === "needs_info"
        ? `/companies/${company.slug}/claim`
        : `/dashboard/company-claims#claim-${claim.id}`

  const dedupeKey = `company-claim:${claim.id}:${decision}:${Date.now()}`

  const { error } = await adminSupabase.from("notifications").insert({
    user_id: claim.user_id,
    actor_id: actorId,
    job_id: null,
    application_id: null,
    type: `company_claim_${decision}`,
    title: t.title,
    message: t.message(company.name, note || undefined),
    is_read: false,
    href,
    entity_type: "company_claim",
    entity_id: claim.id,
    dedupe_key: dedupeKey,
  })

  if (error) {
    console.error("Company claim notification error:", error)
  }
}

async function sendDecisionEmail({
  adminSupabase,
  claim,
  decision,
  note,
}: {
  adminSupabase: ReturnType<typeof createAdminClient>
  claim: ClaimContext
  decision: Decision
  note?: string | null
}) {
  if (!process.env.RESEND_API_KEY) return

  const company = getCompany(claim)
  if (!company) return

  try {
    const { data, error } = await adminSupabase.auth.admin.getUserById(claim.user_id)
    const recipient = data.user?.email || claim.business_email

    if (error || !recipient) {
      console.error("Company claim email recipient error:", error)
      return
    }

    const locale = normalizeLocale(claim.locale)
    const t = copy[locale][decision]
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"
    const href =
      decision === "approved"
        ? `${baseUrl}/dashboard/companies/${company.id}/onboarding`
        : decision === "needs_info"
          ? `${baseUrl}/companies/${encodeURIComponent(company.slug)}/claim`
          : `${baseUrl}/dashboard/company-claims#claim-${claim.id}`

    const { sendEmail } = await import("@/lib/resend")

    await sendEmail({
      to: recipient,
      subject: t.subject(company.name),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto">
          <h2>${escapeHtml(t.emailTitle)}</h2>
          <p>${escapeHtml(t.message(company.name, note || undefined))}</p>
          <p style="margin-top:24px">
            <a href="${href}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:700">
              ${escapeHtml(t.cta)}
            </a>
          </p>
          <p style="margin-top:28px;color:#64748b;font-size:13px">Clean Jobs</p>
        </div>
      `,
    })
  } catch (error) {
    console.error("Company claim decision email error:", error)
  }
}

function revalidateClaimPaths(companySlug?: string) {
  revalidatePath("/admin")
  revalidatePath("/dashboard/company-claims")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")

  if (companySlug) {
    revalidatePath(`/companies/${companySlug}`)
    revalidatePath(`/companies/${companySlug}/claim`)
  }
}

export async function approveCompanyClaimAction(formData: FormData) {
  const adminUser = await requireAdmin()
  const claimId = getFormValue(formData, "claimId")

  if (!claimId) redirect("/admin?claimError=missing-claim")

  const adminSupabase = createAdminClient()

  try {
    const claimBefore = await loadClaim(adminSupabase, claimId)
    const company = getCompany(claimBefore)

    const { data: competingClaims } = await adminSupabase
      .from("company_claim_requests")
      .select(`
        id,
        company_id,
        user_id,
        locale,
        business_email,
        status,
        updated_at,
        companies (id, name, slug)
      `)
      .eq("company_id", claimBefore.company_id)
      .neq("id", claimBefore.id)
      .in("status", ["pending", "needs_info"])

    const { error } = await adminSupabase.rpc("approve_company_claim", {
      claim_request_id: claimId,
      reviewer_user_id: adminUser.id,
    })

    if (error) throw error

    const approvedClaim = await loadClaim(adminSupabase, claimId)

    await Promise.all([
      createDecisionNotification({
        adminSupabase,
        claim: approvedClaim,
        decision: "approved",
        actorId: adminUser.id,
      }),
      sendDecisionEmail({
        adminSupabase,
        claim: approvedClaim,
        decision: "approved",
      }),
    ])

    for (const rawClaim of competingClaims ?? []) {
      const competing = rawClaim as ClaimContext
      const competingCompany = getCompany(competing)
      const note = "Another verified claim for this company was approved."

      await Promise.all([
        createDecisionNotification({
          adminSupabase,
          claim: competing,
          decision: "rejected",
          actorId: adminUser.id,
          note,
        }),
        sendDecisionEmail({
          adminSupabase,
          claim: competing,
          decision: "rejected",
          note,
        }),
      ])

      if (competingCompany?.slug) revalidatePath(`/companies/${competingCompany.slug}/claim`)
    }

    revalidateClaimPaths(company?.slug)
    redirect("/admin?claimSuccess=approved")
  } catch (error) {
    console.error("Approve company claim error:", error)
    const message = error instanceof Error ? error.message : "Could not approve company claim."
    redirect(`/admin?claimError=${encodeURIComponent(message)}`)
  }
}

export async function rejectCompanyClaimAction(formData: FormData) {
  const adminUser = await requireAdmin()
  const claimId = getFormValue(formData, "claimId")
  const adminNote = getFormValue(formData, "adminNote")

  if (!claimId) redirect("/admin?claimError=missing-claim")
  if (adminNote.length < 5) redirect("/admin?claimError=rejection-note-required")

  const adminSupabase = createAdminClient()

  try {
    const claim = await loadClaim(adminSupabase, claimId)
    const company = getCompany(claim)

    const { error } = await adminSupabase.rpc("reject_company_claim", {
      claim_request_id: claimId,
      reviewer_user_id: adminUser.id,
      rejection_note: adminNote,
    })

    if (error) throw error

    const updatedClaim = await loadClaim(adminSupabase, claimId)

    await Promise.all([
      createDecisionNotification({
        adminSupabase,
        claim: updatedClaim,
        decision: "rejected",
        actorId: adminUser.id,
        note: adminNote,
      }),
      sendDecisionEmail({
        adminSupabase,
        claim: updatedClaim,
        decision: "rejected",
        note: adminNote,
      }),
    ])

    revalidateClaimPaths(company?.slug)
    redirect("/admin?claimSuccess=rejected")
  } catch (error) {
    console.error("Reject company claim error:", error)
    const message = error instanceof Error ? error.message : "Could not reject company claim."
    redirect(`/admin?claimError=${encodeURIComponent(message)}`)
  }
}

export async function requestMoreInfoCompanyClaimAction(formData: FormData) {
  const adminUser = await requireAdmin()
  const claimId = getFormValue(formData, "claimId")
  const adminNote = getFormValue(formData, "adminNote")

  if (!claimId) redirect("/admin?claimError=missing-claim")
  if (adminNote.length < 5) redirect("/admin?claimError=info-note-required")

  const adminSupabase = createAdminClient()

  try {
    const claim = await loadClaim(adminSupabase, claimId)
    const company = getCompany(claim)

    const { error } = await adminSupabase.rpc("request_more_info_company_claim", {
      claim_request_id: claimId,
      reviewer_user_id: adminUser.id,
      request_note: adminNote,
    })

    if (error) throw error

    const updatedClaim = await loadClaim(adminSupabase, claimId)

    await Promise.all([
      createDecisionNotification({
        adminSupabase,
        claim: updatedClaim,
        decision: "needs_info",
        actorId: adminUser.id,
        note: adminNote,
      }),
      sendDecisionEmail({
        adminSupabase,
        claim: updatedClaim,
        decision: "needs_info",
        note: adminNote,
      }),
    ])

    revalidateClaimPaths(company?.slug)
    redirect("/admin?claimSuccess=needs-info")
  } catch (error) {
    console.error("Request more info company claim error:", error)
    const message = error instanceof Error ? error.message : "Could not request more information."
    redirect(`/admin?claimError=${encodeURIComponent(message)}`)
  }
}
