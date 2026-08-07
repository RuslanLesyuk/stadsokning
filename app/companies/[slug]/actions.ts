"use server"

import { revalidatePath } from "next/cache"

import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type FieldErrors = {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  serviceType?: string
  city?: string
  preferredDate?: string
  message?: string
}

export type CompanyLeadFormState = {
  status: "idle" | "success" | "error"
  message: string
  fieldErrors?: FieldErrors
}

type CompanyRow = {
  id: string
  slug: string
  name: string
  owner_id: string | null
}

type QuoteRequestRow = {
  id: string
  created_at: string | null
}

type NotifyCompanyOwnerInput = {
  company: CompanyRow
  quoteRequest: QuoteRequestRow
  actorId: string | null
  customerName: string
  customerEmail: string
  customerPhone: string | null
  serviceType: string
  city: string
  preferredDate: string | null
  message: string
}

const messages: Record<
  Locale,
  {
    validation: string
    companyMissing: string
    companyNotFound: string
    submitError: string
    success: string
    nameRequired: string
    emailRequired: string
    emailInvalid: string
    phoneInvalid: string
    serviceRequired: string
    cityRequired: string
    dateInvalid: string
    messageRequired: string
    messageShort: string
    messageLong: string
  }
> = {
  sv: {
    validation: "Kontrollera de markerade fälten.",
    companyMissing: "Företagsinformationen saknas.",
    companyNotFound: "Företaget kunde inte hittas.",
    submitError: "Förfrågan kunde inte skickas. Försök igen.",
    success: "Tack! Din offertförfrågan har skickats till företaget.",
    nameRequired: "Ange ditt namn.",
    emailRequired: "Ange din e-postadress.",
    emailInvalid: "Ange en giltig e-postadress.",
    phoneInvalid: "Ange ett giltigt telefonnummer.",
    serviceRequired: "Välj en tjänst.",
    cityRequired: "Ange ort eller område.",
    dateInvalid: "Välj dagens datum eller ett senare datum.",
    messageRequired: "Beskriv vad du behöver hjälp med.",
    messageShort: "Beskrivningen måste vara minst 20 tecken.",
    messageLong: "Beskrivningen får vara högst 2 000 tecken.",
  },
  en: {
    validation: "Check the highlighted fields.",
    companyMissing: "Company information is missing.",
    companyNotFound: "The company could not be found.",
    submitError: "The request could not be sent. Please try again.",
    success: "Thank you! Your quote request has been sent to the company.",
    nameRequired: "Enter your name.",
    emailRequired: "Enter your email address.",
    emailInvalid: "Enter a valid email address.",
    phoneInvalid: "Enter a valid phone number.",
    serviceRequired: "Select a service.",
    cityRequired: "Enter a city or area.",
    dateInvalid: "Choose today or a later date.",
    messageRequired: "Describe what you need help with.",
    messageShort: "The description must contain at least 20 characters.",
    messageLong: "The description cannot exceed 2,000 characters.",
  },
  uk: {
    validation: "Перевірте виділені поля.",
    companyMissing: "Інформація про компанію відсутня.",
    companyNotFound: "Компанію не знайдено.",
    submitError: "Не вдалося надіслати заявку. Спробуйте ще раз.",
    success: "Дякуємо! Запит на пропозицію надіслано компанії.",
    nameRequired: "Вкажіть ваше ім’я.",
    emailRequired: "Вкажіть електронну адресу.",
    emailInvalid: "Вкажіть правильну електронну адресу.",
    phoneInvalid: "Вкажіть правильний номер телефону.",
    serviceRequired: "Оберіть послугу.",
    cityRequired: "Вкажіть місто або район.",
    dateInvalid: "Оберіть сьогоднішню або майбутню дату.",
    messageRequired: "Опишіть, яка допомога вам потрібна.",
    messageShort: "Опис має містити щонайменше 20 символів.",
    messageLong: "Опис не може перевищувати 2 000 символів.",
  },
  ru: {
    validation: "Проверьте выделенные поля.",
    companyMissing: "Информация о компании отсутствует.",
    companyNotFound: "Компания не найдена.",
    submitError: "Не удалось отправить заявку. Попробуйте еще раз.",
    success: "Спасибо! Запрос на предложение отправлен компании.",
    nameRequired: "Укажите ваше имя.",
    emailRequired: "Укажите электронную почту.",
    emailInvalid: "Укажите корректную электронную почту.",
    phoneInvalid: "Укажите корректный номер телефона.",
    serviceRequired: "Выберите услугу.",
    cityRequired: "Укажите город или район.",
    dateInvalid: "Выберите сегодняшнюю или будущую дату.",
    messageRequired: "Опишите, какая помощь вам нужна.",
    messageShort: "Описание должно содержать не менее 20 символов.",
    messageLong: "Описание не может превышать 2 000 символов.",
  },
  pl: {
    validation: "Sprawdź zaznaczone pola.",
    companyMissing: "Brakuje informacji o firmie.",
    companyNotFound: "Nie znaleziono firmy.",
    submitError: "Nie udało się wysłać zapytania. Spróbuj ponownie.",
    success: "Dziękujemy! Zapytanie ofertowe zostało wysłane do firmy.",
    nameRequired: "Podaj swoje imię.",
    emailRequired: "Podaj adres e-mail.",
    emailInvalid: "Podaj prawidłowy adres e-mail.",
    phoneInvalid: "Podaj prawidłowy numer telefonu.",
    serviceRequired: "Wybierz usługę.",
    cityRequired: "Podaj miasto lub obszar.",
    dateInvalid: "Wybierz dzisiejszą lub późniejszą datę.",
    messageRequired: "Opisz, jakiej pomocy potrzebujesz.",
    messageShort: "Opis musi zawierać co najmniej 20 znaków.",
    messageLong: "Opis nie może przekraczać 2 000 znaków.",
  },
}

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function getLocale(value: string): Locale {
  return ["sv", "en", "uk", "ru", "pl"].includes(value)
    ? (value as Locale)
    : "sv"
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function getTodayUtcDateString() {
  const now = new Date()

  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )
    .toISOString()
    .slice(0, 10)
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://cleansjob.com").replace(
    /\/$/,
    "",
  )
}

async function createOwnerNotification({
  company,
  quoteRequest,
  actorId,
  customerName,
  serviceType,
  city,
}: NotifyCompanyOwnerInput) {
  if (!company.owner_id || company.owner_id === actorId) {
    return
  }

  const href = `/dashboard/company-leads?lead=${quoteRequest.id}#lead-${quoteRequest.id}`
  const admin = createAdminClient()

  const { error } = await admin.from("notifications").upsert(
    {
      user_id: company.owner_id,
      actor_id: actorId,
      job_id: null,
      application_id: null,
      type: "company_quote_request",
      title: `Ny offertförfrågan för ${company.name}`,
      message: `${customerName} söker ${serviceType} i ${city}.`,
      is_read: false,
      href,
      entity_type: "company_quote_request",
      entity_id: quoteRequest.id,
      dedupe_key: `company_quote_request:${quoteRequest.id}`,
    },
    {
      onConflict: "dedupe_key",
      ignoreDuplicates: true,
    },
  )

  if (error) {
    console.error("Create company lead notification error:", error)
  }
}

async function sendOwnerEmail({
  company,
  quoteRequest,
  actorId,
  customerName,
  customerEmail,
  customerPhone,
  serviceType,
  city,
  preferredDate,
  message,
}: NotifyCompanyOwnerInput) {
  if (!company.owner_id || company.owner_id === actorId) {
    return
  }

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return
  }

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.getUserById(company.owner_id)

  if (error) {
    console.error("Load company owner email error:", error)
    return
  }

  const recipient = data.user?.email?.trim()

  if (!recipient) {
    return
  }

  const siteUrl = getSiteUrl()
  const leadUrl = `${siteUrl}/dashboard/company-leads?lead=${quoteRequest.id}#lead-${quoteRequest.id}`
  const from =
    process.env.RESEND_FROM_EMAIL ||
    process.env.RESEND_FROM ||
    "Clean Jobs <support@cleansjob.com>"

  const safeCompanyName = escapeHtml(company.name)
  const safeCustomerName = escapeHtml(customerName)
  const safeCustomerEmail = escapeHtml(customerEmail)
  const safeCustomerPhone = escapeHtml(customerPhone || "Ej angivet")
  const safeServiceType = escapeHtml(serviceType)
  const safeCity = escapeHtml(city)
  const safePreferredDate = escapeHtml(preferredDate || "Ej angivet")
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />")

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: customerEmail,
      subject: `Ny offertförfrågan för ${company.name}`,
      text: [
        `Ny offertförfrågan för ${company.name}`,
        "",
        `Kund: ${customerName}`,
        `E-post: ${customerEmail}`,
        `Telefon: ${customerPhone || "Ej angivet"}`,
        `Tjänst: ${serviceType}`,
        `Ort: ${city}`,
        `Önskat datum: ${preferredDate || "Ej angivet"}`,
        "",
        message,
        "",
        `Öppna förfrågan: ${leadUrl}`,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:640px;margin:0 auto;padding:24px;">
          <p style="margin:0 0 8px;color:#e11d48;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Clean Jobs</p>
          <h1 style="margin:0 0 20px;font-size:26px;line-height:1.25;">Ny offertförfrågan för ${safeCompanyName}</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tbody>
              <tr><td style="padding:7px 0;color:#64748b;">Kund</td><td style="padding:7px 0;font-weight:700;">${safeCustomerName}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;">E-post</td><td style="padding:7px 0;font-weight:700;">${safeCustomerEmail}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;">Telefon</td><td style="padding:7px 0;font-weight:700;">${safeCustomerPhone}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;">Tjänst</td><td style="padding:7px 0;font-weight:700;">${safeServiceType}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;">Ort</td><td style="padding:7px 0;font-weight:700;">${safeCity}</td></tr>
              <tr><td style="padding:7px 0;color:#64748b;">Önskat datum</td><td style="padding:7px 0;font-weight:700;">${safePreferredDate}</td></tr>
            </tbody>
          </table>
          <div style="padding:18px;border-radius:16px;background:#f8fafc;margin-bottom:24px;">${safeMessage}</div>
          <a href="${leadUrl}" style="display:inline-block;padding:13px 20px;border-radius:14px;background:#e11d48;color:white;text-decoration:none;font-weight:700;">Öppna förfrågan</a>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    console.error(
      "Send company lead email error:",
      response.status,
      await response.text(),
    )
  }
}

async function notifyCompanyOwner(input: NotifyCompanyOwnerInput) {
  const results = await Promise.allSettled([
    createOwnerNotification(input),
    sendOwnerEmail(input),
  ])

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Unexpected company lead notification error:", result.reason)
    }
  }
}

export async function submitCompanyLead(
  _previousState: CompanyLeadFormState,
  formData: FormData,
): Promise<CompanyLeadFormState> {
  const locale = getLocale(getString(formData, "locale"))
  const t = messages[locale]

  const companyId = getString(formData, "companyId")
  const companySlug = getString(formData, "companySlug")
  const customerName = getString(formData, "customerName")
  const customerEmail = getString(formData, "customerEmail")
  const customerPhone = getString(formData, "customerPhone")
  const serviceType = getString(formData, "serviceType")
  const city = getString(formData, "city")
  const preferredDate = getString(formData, "preferredDate")
  const message = getString(formData, "message")
  const website = getString(formData, "website")

  if (website) {
    return {
      status: "success",
      message: t.success,
    }
  }

  if (!companyId || !companySlug) {
    return {
      status: "error",
      message: t.companyMissing,
    }
  }

  const fieldErrors: FieldErrors = {}

  if (!customerName) {
    fieldErrors.customerName = t.nameRequired
  }

  if (!customerEmail) {
    fieldErrors.customerEmail = t.emailRequired
  } else if (!isValidEmail(customerEmail)) {
    fieldErrors.customerEmail = t.emailInvalid
  }

  if (customerPhone && customerPhone.replace(/\D/g, "").length < 6) {
    fieldErrors.customerPhone = t.phoneInvalid
  }

  if (!serviceType) {
    fieldErrors.serviceType = t.serviceRequired
  }

  if (!city) {
    fieldErrors.city = t.cityRequired
  }

  if (preferredDate && preferredDate < getTodayUtcDateString()) {
    fieldErrors.preferredDate = t.dateInvalid
  }

  if (!message) {
    fieldErrors.message = t.messageRequired
  } else if (message.length < 20) {
    fieldErrors.message = t.messageShort
  } else if (message.length > 2000) {
    fieldErrors.message = t.messageLong
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: t.validation,
      fieldErrors,
    }
  }

  const supabase = await createClient()

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("id, slug, name, owner_id")
    .eq("id", companyId)
    .eq("slug", companySlug)
    .maybeSingle()

  const company = companyData as CompanyRow | null

  if (companyError || !company) {
    console.error("Company lead company lookup error:", companyError)

    return {
      status: "error",
      message: t.companyNotFound,
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: quoteData, error: insertError } = await supabase
    .from("company_quote_requests")
    .insert({
      company_id: company.id,
      user_id: user?.id || null,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      service_type: serviceType,
      city,
      preferred_date: preferredDate || null,
      message,
      status: "new",
    })
    .select("id, created_at")
    .single()

  const quoteRequest = quoteData as QuoteRequestRow | null

  if (insertError || !quoteRequest) {
    console.error("Company lead insert error:", insertError)

    return {
      status: "error",
      message: t.submitError,
    }
  }

  await notifyCompanyOwner({
    company,
    quoteRequest,
    actorId: user?.id || null,
    customerName,
    customerEmail,
    customerPhone: customerPhone || null,
    serviceType,
    city,
    preferredDate: preferredDate || null,
    message,
  })

  revalidatePath(`/companies/${company.slug}`)
  revalidatePath("/dashboard/company-leads")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")

  return {
    status: "success",
    message: t.success,
  }
}
