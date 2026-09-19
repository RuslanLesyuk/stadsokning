"use server"

import { randomUUID } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { getVacancyDictionary } from "@/lib/vacancies/i18n"
import { canPublishVacancy, VACANCY_POSTING_REQUIRES_PREMIUM } from "@/lib/vacancies/config"
import {
  VACANCY_LIMITS,
  buildVacancySlug,
  isLikelyEmail,
} from "@/lib/vacancies/validation"

export type VacancyActionState = {
  success: boolean
  message: string
}

const initialFailure = (message: string): VacancyActionState => ({ success: false, message })

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

async function getMessages() {
  const store = await cookies()
  const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale
  return getVacancyDictionary(locale).errors
}

function validateVacancy(formData: FormData, e: ReturnType<typeof getVacancyDictionary>["errors"]) {
  const title = text(formData, "title")
  const companyName = text(formData, "company_name")
  const city = text(formData, "city")
  const description = text(formData, "description")
  const schedule = text(formData, "schedule")
  const salary = text(formData, "salary")
  const requirements = text(formData, "requirements")
  const contactEmail = text(formData, "contact_email")
  const contactPhone = text(formData, "contact_phone")

  if (title.length < 2 || title.length > VACANCY_LIMITS.title) return { error: e.title }
  if (companyName.length < 2 || companyName.length > VACANCY_LIMITS.companyName) return { error: e.company }
  if (city.length < 2 || city.length > VACANCY_LIMITS.city) return { error: e.city }
  if (description.length < 20 || description.length > VACANCY_LIMITS.description) return { error: e.description }
  if (schedule.length > VACANCY_LIMITS.schedule) return { error: e.schedule }
  if (salary && (!/^\d+(?:[.,]\d+)?$/.test(salary) || Number(salary.replace(",", ".")) <= 0)) return { error: e.salary }
  if (salary.length > VACANCY_LIMITS.salary) return { error: e.salary }
  if (requirements.length > VACANCY_LIMITS.requirements) return { error: e.requirements }
  if (!contactEmail && !contactPhone) return { error: e.contact }
  if (contactEmail && (contactEmail.length > VACANCY_LIMITS.contactEmail || !isLikelyEmail(contactEmail))) return { error: e.email }
  if (contactPhone.length > VACANCY_LIMITS.contactPhone) return { error: e.phone }

  return {
    data: {
      title,
      company_name: companyName,
      city,
      description,
      schedule: schedule || null,
      salary: salary ? salary.replace(",", ".") : null,
      requirements: requirements || null,
      contact_email: contactEmail || null,
      contact_phone: contactPhone || null,
    },
  }
}

export async function createVacancyAction(
  _prevState: VacancyActionState,
  formData: FormData,
): Promise<VacancyActionState> {
  const e = await getMessages()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return initialFailure(e.loginPublish)

  const allowed = await canPublishVacancy(user.id)
  if (!allowed) {
    return initialFailure(
      VACANCY_POSTING_REQUIRES_PREMIUM
        ? e.premium
        : e.publishBlocked,
    )
  }

  const validated = validateVacancy(formData, e)
  if ("error" in validated) return initialFailure(validated.error)

  const id = randomUUID()
  const slug = buildVacancySlug({
    title: validated.data.title,
    companyName: validated.data.company_name,
    city: validated.data.city,
    id,
  })

  const { error } = await supabase.from("vacancies").insert({
    id,
    slug,
    ...validated.data,
    status: "active",
    created_by: user.id,
  })

  if (error) return initialFailure(error.message || e.publishFailed)

  revalidatePath("/lediga-jobb")
  revalidatePath("/dashboard/vacancies")
  redirect(`/lediga-jobb/${slug}`)
}

export async function updateVacancyAction(
  _prevState: VacancyActionState,
  formData: FormData,
): Promise<VacancyActionState> {
  const e = await getMessages()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return initialFailure(e.login)

  const vacancyId = text(formData, "vacancy_id")
  const slug = text(formData, "slug")
  if (!vacancyId || !slug) return initialFailure(e.identify)

  const validated = validateVacancy(formData, e)
  if ("error" in validated) return initialFailure(validated.error)

  const { data: vacancy } = await supabase
    .from("vacancies")
    .select("id, created_by")
    .eq("id", vacancyId)
    .maybeSingle()

  if (!vacancy || vacancy.created_by !== user.id) return initialFailure(e.ownOnly)

  const { error } = await supabase
    .from("vacancies")
    .update(validated.data)
    .eq("id", vacancyId)
    .eq("created_by", user.id)

  if (error) return initialFailure(error.message || e.saveFailed)

  revalidatePath("/lediga-jobb")
  revalidatePath(`/lediga-jobb/${slug}`)
  revalidatePath("/dashboard/vacancies")
  redirect(`/lediga-jobb/${slug}`)
}

export async function closeVacancyAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const vacancyId = text(formData, "vacancy_id")
  if (!vacancyId) redirect("/dashboard/vacancies")

  await supabase
    .from("vacancies")
    .update({ status: "closed", closed_at: new Date().toISOString() })
    .eq("id", vacancyId)
    .eq("created_by", user.id)

  revalidatePath("/lediga-jobb")
  revalidatePath("/dashboard/vacancies")
  redirect("/dashboard/vacancies")
}

export async function deleteVacancyAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/dashboard/vacancies")

  const vacancyId = text(formData, "vacancy_id")
  const slug = text(formData, "slug")
  if (!vacancyId) redirect("/dashboard/vacancies")

  const { data: deletedVacancy, error } = await supabase
    .from("vacancies")
    .delete()
    .eq("id", vacancyId)
    .eq("created_by", user.id)
    .select("id")
    .maybeSingle()

  if (error || !deletedVacancy) {
    throw new Error(error?.message || "Vacancy could not be deleted")
  }

  revalidatePath("/lediga-jobb")
  revalidatePath("/dashboard/vacancies")
  if (slug) revalidatePath(`/lediga-jobb/${slug}`)
  redirect("/dashboard/vacancies")
}

export async function applyToVacancyAction(
  _prevState: VacancyActionState,
  formData: FormData,
): Promise<VacancyActionState> {
  const e = await getMessages()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return initialFailure(e.loginApply)

  const vacancyId = text(formData, "vacancy_id")
  const vacancySlug = text(formData, "vacancy_slug")
  const applicantName = text(formData, "applicant_name")
  const email = text(formData, "email") || user.email || ""
  const phone = text(formData, "phone")
  const message = text(formData, "message")

  if (!vacancyId || !vacancySlug) return initialFailure(e.identify)
  if (applicantName.length < 2 || applicantName.length > VACANCY_LIMITS.applicationName) return initialFailure(e.name)
  if (!isLikelyEmail(email)) return initialFailure(e.email)
  if (phone.length > VACANCY_LIMITS.contactPhone) return initialFailure(e.phone)
  if (message.length < 10 || message.length > VACANCY_LIMITS.applicationMessage) return initialFailure(e.message)

  const { data: vacancy } = await supabase
    .from("vacancies")
    .select("id, status, created_by")
    .eq("id", vacancyId)
    .maybeSingle()

  if (!vacancy || vacancy.status !== "active") return initialFailure(e.noLongerOpen)
  if (vacancy.created_by === user.id) return initialFailure(e.ownApplication)

  const { error } = await supabase.from("vacancy_applications").insert({
    vacancy_id: vacancyId,
    applicant_id: user.id,
    applicant_name: applicantName,
    email,
    phone: phone || null,
    message,
  })

  if (error) {
    if (error.code === "23505") return initialFailure(e.duplicateApplication)
    return initialFailure(error.message || e.applicationFailed)
  }

  revalidatePath(`/lediga-jobb/${vacancySlug}`)
  revalidatePath("/dashboard/vacancies")
  return { success: true, message: e.applicationSent }
}
