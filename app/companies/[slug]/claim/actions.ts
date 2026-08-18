"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type FieldErrors = {
  businessEmail?: string
  businessPhone?: string
  message?: string
  evidence?: string
}

export type CompanyClaimFormState = {
  status: "idle" | "error"
  message: string
  fieldErrors?: FieldErrors
}

const EVIDENCE_BUCKET = "company-claim-evidence"
const MAX_EVIDENCE_FILES = 5
const MAX_EVIDENCE_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_EVIDENCE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
])

const messages: Record<
  Locale,
  {
    validation: string
    companyMissing: string
    companyNotFound: string
    signIn: string
    alreadyClaimed: string
    existingPending: string
    invalidResubmit: string
    emailRequired: string
    emailInvalid: string
    phoneRequired: string
    phoneInvalid: string
    messageRequired: string
    messageShort: string
    messageLong: string
    evidenceTooMany: string
    evidenceTooLarge: string
    evidenceInvalid: string
    submitError: string
    cancelError: string
  }
> = {
  sv: {
    validation: "Kontrollera de markerade fälten.",
    companyMissing: "Företagsinformationen saknas.",
    companyNotFound: "Företaget kunde inte hittas.",
    signIn: "Du måste vara inloggad för att göra anspråk på ett företag.",
    alreadyClaimed: "Företaget har redan kopplats till ett konto.",
    existingPending: "Du har redan en aktiv begäran för företaget.",
    invalidResubmit: "Begäran kan inte skickas in igen i sitt nuvarande läge.",
    emailRequired: "Ange företagets e-postadress.",
    emailInvalid: "Ange en giltig e-postadress.",
    phoneRequired: "Ange företagets telefonnummer.",
    phoneInvalid: "Ange ett giltigt telefonnummer.",
    messageRequired: "Beskriv din koppling till företaget.",
    messageShort: "Beskrivningen måste innehålla minst 20 tecken.",
    messageLong: "Beskrivningen får innehålla högst 2 000 tecken.",
    evidenceTooMany: "Du kan bifoga högst 5 verifieringsfiler.",
    evidenceTooLarge: "Varje verifieringsfil får vara högst 8 MB.",
    evidenceInvalid: "Endast PDF, JPG, PNG och WebP är tillåtna.",
    submitError: "Begäran kunde inte skickas. Försök igen.",
    cancelError: "Begäran kunde inte återkallas.",
  },
  en: {
    validation: "Check the highlighted fields.",
    companyMissing: "Company information is missing.",
    companyNotFound: "The company could not be found.",
    signIn: "You must be signed in to claim a company.",
    alreadyClaimed: "This company is already connected to an account.",
    existingPending: "You already have an active claim for this company.",
    invalidResubmit: "This claim cannot be resubmitted in its current state.",
    emailRequired: "Enter the business email address.",
    emailInvalid: "Enter a valid email address.",
    phoneRequired: "Enter the business phone number.",
    phoneInvalid: "Enter a valid phone number.",
    messageRequired: "Explain your connection to the company.",
    messageShort: "The description must contain at least 20 characters.",
    messageLong: "The description cannot exceed 2,000 characters.",
    evidenceTooMany: "You can attach a maximum of 5 verification files.",
    evidenceTooLarge: "Each verification file must be 8 MB or smaller.",
    evidenceInvalid: "Only PDF, JPG, PNG and WebP files are allowed.",
    submitError: "The request could not be submitted. Please try again.",
    cancelError: "The request could not be cancelled.",
  },
  uk: {
    validation: "Перевірте виділені поля.",
    companyMissing: "Інформація про компанію відсутня.",
    companyNotFound: "Компанію не знайдено.",
    signIn: "Щоб подати заявку, потрібно увійти в акаунт.",
    alreadyClaimed: "Компанію вже прив’язано до іншого акаунта.",
    existingPending: "У вас уже є активна заявка на цю компанію.",
    invalidResubmit: "Цю заявку зараз не можна подати повторно.",
    emailRequired: "Вкажіть робочу електронну адресу.",
    emailInvalid: "Вкажіть правильну електронну адресу.",
    phoneRequired: "Вкажіть робочий номер телефону.",
    phoneInvalid: "Вкажіть правильний номер телефону.",
    messageRequired: "Опишіть ваш зв’язок із компанією.",
    messageShort: "Опис має містити щонайменше 20 символів.",
    messageLong: "Опис не може перевищувати 2 000 символів.",
    evidenceTooMany: "Можна додати не більше 5 файлів підтвердження.",
    evidenceTooLarge: "Кожен файл підтвердження має бути не більшим за 8 МБ.",
    evidenceInvalid: "Дозволені лише PDF, JPG, PNG та WebP.",
    submitError: "Не вдалося надіслати заявку. Спробуйте ще раз.",
    cancelError: "Не вдалося відкликати заявку.",
  },
  ru: {
    validation: "Проверьте выделенные поля.",
    companyMissing: "Информация о компании отсутствует.",
    companyNotFound: "Компания не найдена.",
    signIn: "Чтобы подать заявку, нужно войти в аккаунт.",
    alreadyClaimed: "Компания уже привязана к другому аккаунту.",
    existingPending: "У вас уже есть активная заявка на эту компанию.",
    invalidResubmit: "Эту заявку сейчас нельзя отправить повторно.",
    emailRequired: "Укажите рабочую электронную почту.",
    emailInvalid: "Укажите корректную электронную почту.",
    phoneRequired: "Укажите рабочий номер телефона.",
    phoneInvalid: "Укажите корректный номер телефона.",
    messageRequired: "Опишите вашу связь с компанией.",
    messageShort: "Описание должно содержать не менее 20 символов.",
    messageLong: "Описание не может превышать 2 000 символов.",
    evidenceTooMany: "Можно добавить не более 5 файлов подтверждения.",
    evidenceTooLarge: "Каждый файл подтверждения должен быть не больше 8 МБ.",
    evidenceInvalid: "Разрешены только PDF, JPG, PNG и WebP.",
    submitError: "Не удалось отправить заявку. Попробуйте еще раз.",
    cancelError: "Не удалось отозвать заявку.",
  },
  pl: {
    validation: "Sprawdź zaznaczone pola.",
    companyMissing: "Brakuje informacji o firmie.",
    companyNotFound: "Nie znaleziono firmy.",
    signIn: "Aby zgłosić firmę, musisz się zalogować.",
    alreadyClaimed: "Firma jest już połączona z innym kontem.",
    existingPending: "Masz już aktywne zgłoszenie dotyczące tej firmy.",
    invalidResubmit: "Tego zgłoszenia nie można teraz wysłać ponownie.",
    emailRequired: "Podaj firmowy adres e-mail.",
    emailInvalid: "Podaj prawidłowy adres e-mail.",
    phoneRequired: "Podaj firmowy numer telefonu.",
    phoneInvalid: "Podaj prawidłowy numer telefonu.",
    messageRequired: "Opisz swój związek z firmą.",
    messageShort: "Opis musi zawierać co najmniej 20 znaków.",
    messageLong: "Opis nie może przekraczać 2 000 znaków.",
    evidenceTooMany: "Możesz dołączyć maksymalnie 5 plików weryfikacyjnych.",
    evidenceTooLarge: "Każdy plik weryfikacyjny może mieć maksymalnie 8 MB.",
    evidenceInvalid: "Dozwolone są tylko PDF, JPG, PNG i WebP.",
    submitError: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
    cancelError: "Nie udało się anulować zgłoszenia.",
  },
}

function getStringValue(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName)
  return typeof value === "string" ? value.trim() : ""
}

function getLocale(value: string): Locale {
  return ["sv", "en", "uk", "ru", "pl"].includes(value)
    ? (value as Locale)
    : "sv"
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getFiles(values: FormDataEntryValue[]) {
  return values.filter(
    (value): value is File => value instanceof File && value.size > 0,
  )
}

function safeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "evidence"
}

function getEmailDomain(email: string) {
  return email.split("@")[1]?.trim().toLowerCase().replace(/^www\./, "") || null
}

function getWebsiteDomain(value: string | null | undefined) {
  const raw = value?.trim()
  if (!raw) return null

  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return null
  }
}

function domainsMatch(first: string | null, second: string | null) {
  if (!first || !second) return false
  return (
    first === second ||
    first.endsWith(`.${second}`) ||
    second.endsWith(`.${first}`)
  )
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

async function uploadEvidence({
  supabase,
  userId,
  claimId,
  files,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  claimId: string
  files: File[]
}) {
  const uploadedPaths: string[] = []

  for (const [index, file] of files.entries()) {
    const name = safeFilename(file.name)
    const path = `${userId}/${claimId}/${Date.now()}-${index}-${name}`

    const { error } = await supabase.storage
      .from(EVIDENCE_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(EVIDENCE_BUCKET).remove(uploadedPaths)
      }

      throw new Error(error.message)
    }

    uploadedPaths.push(path)
  }

  return uploadedPaths
}

async function writeAudit({
  claimId,
  companyId,
  userId,
  action,
  note,
}: {
  claimId: string
  companyId: string
  userId: string
  action: string
  note?: string | null
}) {
  try {
    const admin = createAdminClient()
    await admin.from("company_claim_audit").insert({
      claim_id: claimId,
      company_id: companyId,
      user_id: userId,
      actor_id: userId,
      action,
      note: note || null,
    })
  } catch (error) {
    console.error("Company claim audit error:", error)
  }
}

async function emailAdmins({
  companyName,
  companySlug,
  businessEmail,
  action,
}: {
  companyName: string
  companySlug: string
  businessEmail: string
  action: "submitted" | "resubmitted"
}) {
  const recipients = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)

  if (recipients.length === 0 || !process.env.RESEND_API_KEY) return

  try {
    const { sendEmail } = await import("@/lib/resend")
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com"
    const verb = action === "resubmitted" ? "resubmitted" : "submitted"

    for (const to of recipients) {
      await sendEmail({
        to,
        subject: `Company claim ${verb}: ${companyName}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
            <h2>Company claim ${verb}</h2>
            <p><strong>${escapeHtml(companyName)}</strong></p>
            <p>Business email: ${escapeHtml(businessEmail)}</p>
            <p><a href="${baseUrl}/admin">Open admin review</a></p>
            <p><a href="${baseUrl}/companies/${encodeURIComponent(companySlug)}">Open company profile</a></p>
          </div>
        `,
      })
    }
  } catch (error) {
    console.error("Company claim admin email error:", error)
  }
}

export async function submitCompanyClaim(
  _previousState: CompanyClaimFormState,
  formData: FormData,
): Promise<CompanyClaimFormState> {
  const locale = getLocale(getStringValue(formData, "locale"))
  const t = messages[locale]
  const companyId = getStringValue(formData, "companyId")
  const companySlug = getStringValue(formData, "companySlug")
  const existingClaimId = getStringValue(formData, "claimId")
  const businessEmail = getStringValue(formData, "businessEmail")
  const businessPhone = getStringValue(formData, "businessPhone")
  const claimMessage = getStringValue(formData, "message")
  const evidenceFiles = getFiles(formData.getAll("evidence"))

  const fieldErrors: FieldErrors = {}

  if (!businessEmail) {
    fieldErrors.businessEmail = t.emailRequired
  } else if (businessEmail.length > 254 || !isValidEmail(businessEmail)) {
    fieldErrors.businessEmail = t.emailInvalid
  }

  if (!businessPhone) {
    fieldErrors.businessPhone = t.phoneRequired
  } else if (businessPhone.length > 40 || businessPhone.replace(/\D/g, "").length < 6) {
    fieldErrors.businessPhone = t.phoneInvalid
  }

  if (!claimMessage) {
    fieldErrors.message = t.messageRequired
  } else if (claimMessage.length < 20) {
    fieldErrors.message = t.messageShort
  } else if (claimMessage.length > 2000) {
    fieldErrors.message = t.messageLong
  }

  if (evidenceFiles.length > MAX_EVIDENCE_FILES) {
    fieldErrors.evidence = t.evidenceTooMany
  }

  for (const file of evidenceFiles) {
    if (!ALLOWED_EVIDENCE_TYPES.has(file.type)) {
      fieldErrors.evidence = t.evidenceInvalid
      break
    }

    if (file.size > MAX_EVIDENCE_FILE_SIZE) {
      fieldErrors.evidence = t.evidenceTooLarge
      break
    }
  }

  if (!companyId || !companySlug) {
    return { status: "error", message: t.companyMissing }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: t.validation,
      fieldErrors,
    }
  }

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { status: "error", message: t.signIn }
  }

  // Claim rows are written through the trusted server path. The final security
  // migration removes direct authenticated INSERT/UPDATE privileges so clients
  // cannot spoof review metadata or verification signals through PostgREST.
  const admin = createAdminClient()

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, owner_id, website, email")
    .eq("id", companyId)
    .eq("slug", companySlug)
    .maybeSingle()

  if (companyError || !company) {
    console.error("Company claim lookup error:", companyError)
    return { status: "error", message: t.companyNotFound }
  }

  if (company.owner_id && company.owner_id !== user.id) {
    return { status: "error", message: t.alreadyClaimed }
  }

  if (company.owner_id === user.id) {
    redirect(`/dashboard/companies/${company.id}/edit`)
  }

  const businessEmailDomain = getEmailDomain(businessEmail)
  const websiteDomain = getWebsiteDomain(company.website)
  const companyEmailDomain = company.email ? getEmailDomain(company.email) : null
  const companyDomain = websiteDomain || companyEmailDomain
  const emailDomainMatch =
    domainsMatch(businessEmailDomain, websiteDomain) ||
    domainsMatch(businessEmailDomain, companyEmailDomain)

  if (existingClaimId) {
    const { data: existingClaim, error: existingClaimError } = await supabase
      .from("company_claim_requests")
      .select("id, company_id, user_id, status, evidence_paths")
      .eq("id", existingClaimId)
      .eq("company_id", company.id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (existingClaimError || !existingClaim || existingClaim.status !== "needs_info") {
      console.error("Company claim resubmit lookup error:", existingClaimError)
      return { status: "error", message: t.invalidResubmit }
    }

    const existingPaths = Array.isArray(existingClaim.evidence_paths)
      ? existingClaim.evidence_paths.filter(
          (value): value is string => typeof value === "string" && value.length > 0,
        )
      : []

    if (existingPaths.length + evidenceFiles.length > MAX_EVIDENCE_FILES) {
      return {
        status: "error",
        message: t.validation,
        fieldErrors: { evidence: t.evidenceTooMany },
      }
    }

    let uploadedPaths: string[] = []

    try {
      uploadedPaths = await uploadEvidence({
        supabase,
        userId: user.id,
        claimId: existingClaim.id,
        files: evidenceFiles,
      })
    } catch (error) {
      console.error("Company claim evidence upload error:", error)
      return {
        status: "error",
        message: t.submitError,
        fieldErrors: { evidence: t.submitError },
      }
    }

    const { error: updateError } = await admin
      .from("company_claim_requests")
      .update({
        business_email: businessEmail,
        business_phone: businessPhone,
        message: claimMessage,
        evidence_paths: [...existingPaths, ...uploadedPaths],
        locale,
        business_email_domain: businessEmailDomain,
        company_domain: companyDomain,
        email_domain_match: emailDomainMatch,
        status: "pending",
        resubmitted_at: new Date().toISOString(),
        cancelled_at: null,
      })
      .eq("id", existingClaim.id)
      .eq("user_id", user.id)
      .eq("status", "needs_info")

    if (updateError) {
      console.error("Company claim resubmit error:", updateError)
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(EVIDENCE_BUCKET).remove(uploadedPaths)
      }
      return { status: "error", message: t.submitError }
    }

    await writeAudit({
      claimId: existingClaim.id,
      companyId: company.id,
      userId: user.id,
      action: "resubmitted",
      note: claimMessage,
    })

    await emailAdmins({
      companyName: company.name,
      companySlug: company.slug,
      businessEmail,
      action: "resubmitted",
    })

    revalidatePath(`/companies/${company.slug}`)
    revalidatePath(`/companies/${company.slug}/claim`)
    revalidatePath("/dashboard/company-claims")
    revalidatePath("/admin")

    redirect(`/companies/${company.slug}/claim?submitted=true`)
  }

  const { data: activeClaim, error: activeClaimError } = await supabase
    .from("company_claim_requests")
    .select("id, status")
    .eq("company_id", company.id)
    .eq("user_id", user.id)
    .in("status", ["pending", "needs_info"])
    .maybeSingle()

  if (activeClaimError) {
    console.error("Existing company claim lookup error:", activeClaimError)
    return { status: "error", message: t.submitError }
  }

  if (activeClaim) {
    if (activeClaim.status === "needs_info") {
      redirect(`/companies/${company.slug}/claim`)
    }

    return { status: "error", message: t.existingPending }
  }

  const claimId = crypto.randomUUID()
  let uploadedPaths: string[] = []

  try {
    uploadedPaths = await uploadEvidence({
      supabase,
      userId: user.id,
      claimId,
      files: evidenceFiles,
    })
  } catch (error) {
    console.error("Company claim evidence upload error:", error)
    return {
      status: "error",
      message: t.submitError,
      fieldErrors: { evidence: t.submitError },
    }
  }

  const { error: insertError } = await admin
    .from("company_claim_requests")
    .insert({
      id: claimId,
      company_id: company.id,
      user_id: user.id,
      business_email: businessEmail,
      business_phone: businessPhone,
      message: claimMessage,
      evidence_paths: uploadedPaths,
      locale,
      business_email_domain: businessEmailDomain,
      company_domain: companyDomain,
      email_domain_match: emailDomainMatch,
      status: "pending",
    })

  if (insertError) {
    console.error("Company claim insert error:", insertError)
    if (uploadedPaths.length > 0) {
      await supabase.storage.from(EVIDENCE_BUCKET).remove(uploadedPaths)
    }
    return { status: "error", message: t.submitError }
  }

  await writeAudit({
    claimId,
    companyId: company.id,
    userId: user.id,
    action: "submitted",
    note: claimMessage,
  })

  await emailAdmins({
    companyName: company.name,
    companySlug: company.slug,
    businessEmail,
    action: "submitted",
  })

  revalidatePath(`/companies/${company.slug}`)
  revalidatePath(`/companies/${company.slug}/claim`)
  revalidatePath("/dashboard/company-claims")
  revalidatePath("/admin")

  redirect(`/companies/${company.slug}/claim?submitted=true`)
}

export async function cancelCompanyClaimAction(formData: FormData) {
  const claimId = getStringValue(formData, "claimId")
  const companySlug = getStringValue(formData, "companySlug")
  const locale = getLocale(getStringValue(formData, "locale"))
  const t = messages[locale]

  if (!claimId) {
    redirect("/dashboard/company-claims")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/company-claims`)
  }

  const { data: claim } = await supabase
    .from("company_claim_requests")
    .select("id, company_id, user_id, status")
    .eq("id", claimId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!claim || !["pending", "needs_info"].includes(claim.status)) {
    redirect("/dashboard/company-claims")
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("company_claim_requests")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", claim.id)
    .eq("user_id", user.id)
    .in("status", ["pending", "needs_info"])

  if (error) {
    console.error("Cancel company claim error:", error)
    redirect(`/dashboard/company-claims?error=${encodeURIComponent(t.cancelError)}`)
  }

  await writeAudit({
    claimId: claim.id,
    companyId: claim.company_id,
    userId: user.id,
    action: "cancelled",
    note: "Cancelled by claimant.",
  })

  revalidatePath("/dashboard/company-claims")
  revalidatePath("/admin")
  if (companySlug) {
    revalidatePath(`/companies/${companySlug}`)
    revalidatePath(`/companies/${companySlug}/claim`)
  }

  redirect("/dashboard/company-claims")
}
