"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import {
  createBookingRecord,
  loadBookingCompany,
  notifyCustomerAboutBookingStatus,
  validateBookingSchedule,
} from "@/lib/bookings/server"
import { BOOKING_FREQUENCIES, type BookingFrequency } from "@/lib/bookings/types"
import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

export async function createBookingFromLeadAction(formData: FormData) {
  const leadId = getString(formData, "lead_id")
  const companyId = getString(formData, "company_id")
  const address = getString(formData, "address")
  const postalCode = getString(formData, "postal_code")
  const city = getString(formData, "city")
  const startDate = getString(formData, "start_date")
  const preferredTime = getString(formData, "preferred_time")
  const durationMinutes = Number(getString(formData, "duration_minutes"))
  const frequencyRaw = getString(formData, "frequency")
  const notes = getString(formData, "customer_notes")
  const frequency = BOOKING_FREQUENCIES.includes(frequencyRaw as BookingFrequency)
    ? (frequencyRaw as BookingFrequency)
    : null

  if (!leadId || !companyId || !address || !city || !startDate || !preferredTime || !frequency || !Number.isInteger(durationMinutes) || durationMinutes < 30 || durationMinutes > 1440) {
    redirect(`/dashboard/company-bookings/new?lead=${encodeURIComponent(leadId)}&error=validation`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-bookings/new?lead=${encodeURIComponent(leadId)}`)

  const { data: lead, error: leadError } = await supabase
    .from("company_quote_requests")
    .select("id, company_id, user_id, customer_name, customer_email, customer_phone, service_type, city, preferred_date, message, quoted_value, estimated_value, status")
    .eq("id", leadId)
    .eq("company_id", companyId)
    .maybeSingle()

  if (leadError || !lead) redirect("/dashboard/company-leads")

  const loaded = await loadBookingCompany(companyId)
  if (!loaded || loaded.company.owner_id !== user.id) redirect("/dashboard/company-leads")

  const settings = { ...loaded.settings, auto_confirm: true }
  const schedule = await validateBookingSchedule({ company: loaded.company, settings, startDate, preferredTime, durationMinutes, frequency })
  if (schedule.code !== "ok") {
    redirect(`/dashboard/company-bookings/new?lead=${encodeURIComponent(leadId)}&error=${schedule.code}`)
  }

  const booking = await createBookingRecord({
    company: loaded.company,
    settings,
    customerId: lead.user_id || null,
    quoteRequestId: lead.id,
    customerName: lead.customer_name,
    customerEmail: lead.customer_email,
    customerPhone: lead.customer_phone || null,
    serviceType: lead.service_type || "Cleaning",
    address,
    postalCode: postalCode || null,
    city: city || lead.city || loaded.company.city || "",
    frequency,
    startDate,
    preferredTime,
    durationMinutes,
    rutRequested: Boolean(loaded.company.rut_available && formData.get("rut_requested") === "on"),
    customerNotes: notes || lead.message || null,
    source: "lead_conversion",
    sourceUrl: `/dashboard/company-leads/${lead.id}`,
  })

  if (!booking) {
    redirect(`/dashboard/company-bookings/new?lead=${encodeURIComponent(leadId)}&error=create`)
  }

  await supabase
    .from("company_quote_requests")
    .update({ status: "won", quoted_value: lead.quoted_value || lead.estimated_value || null })
    .eq("id", lead.id)

  await notifyCustomerAboutBookingStatus({ booking, companyName: loaded.company.name, actorId: user.id })

  revalidatePath("/dashboard/company-leads")
  revalidatePath(`/dashboard/company-leads/${lead.id}`)
  revalidatePath("/dashboard/company-bookings")
  revalidatePath(`/dashboard/company-bookings/${booking.id}`)
  redirect(`/dashboard/company-bookings/${booking.id}?saved=created-from-lead`)
}
