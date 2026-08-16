"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function intValue(formData: FormData, name: string) {
  const value = Number(getString(formData, name))
  return Number.isInteger(value) ? value : null
}

export async function updateBookingSettingsAction(formData: FormData) {
  const companyId = getString(formData, "company_id")
  if (!companyId) redirect("/dashboard/company-bookings")

  const minNotice = intValue(formData, "min_notice_hours")
  const maxDays = intValue(formData, "max_days_ahead")
  const duration = intValue(formData, "default_duration_minutes")
  const buffer = intValue(formData, "buffer_minutes")
  const timezone = getString(formData, "timezone") || "Europe/Stockholm"

  if (
    minNotice === null || minNotice < 0 || minNotice > 720 ||
    maxDays === null || maxDays < 1 || maxDays > 365 ||
    duration === null || duration < 30 || duration > 1440 ||
    buffer === null || buffer < 0 || buffer > 240 ||
    timezone.length > 100
  ) {
    redirect(`/dashboard/company-bookings/settings/${companyId}?error=validation`)
  }

  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date())
  } catch {
    redirect(`/dashboard/company-bookings/settings/${companyId}?error=timezone`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-bookings/settings/${companyId}`)

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .eq("owner_id", user.id)
    .maybeSingle()
  if (!company) redirect("/dashboard/company-bookings")

  const { error } = await supabase
    .from("company_booking_settings")
    .upsert({
      company_id: companyId,
      booking_enabled: formData.get("booking_enabled") === "on",
      recurring_enabled: formData.get("recurring_enabled") === "on",
      min_notice_hours: minNotice,
      max_days_ahead: maxDays,
      default_duration_minutes: duration,
      buffer_minutes: buffer,
      auto_confirm: formData.get("auto_confirm") === "on",
      timezone,
    }, { onConflict: "company_id" })

  if (error) {
    console.error("Update booking settings error:", error)
    redirect(`/dashboard/company-bookings/settings/${companyId}?error=save`)
  }

  revalidatePath(`/dashboard/company-bookings/settings/${companyId}`)
  revalidatePath(`/companies`, "layout")
  revalidatePath(`/site`, "layout")
  redirect(`/dashboard/company-bookings/settings/${companyId}?saved=true`)
}
