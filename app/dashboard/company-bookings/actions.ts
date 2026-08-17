"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { notifyCustomerAboutBookingStatus } from "@/lib/bookings/server"
import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

function refreshBookingPaths(id: string) {
  revalidatePath("/dashboard/company")
  revalidatePath("/dashboard/company-bookings")
  revalidatePath("/dashboard/company-customers")
  revalidatePath(`/dashboard/company-bookings/${id}`)
  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/bookings/${id}`)
  revalidatePath("/notifications")
  revalidatePath("/", "layout")
}

async function getOwnerBooking(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-bookings/${id}`)

  const { data, error } = await supabase
    .from("company_bookings")
    .select(`
      id, company_id, customer_id, customer_email, customer_name, service_type,
      start_date, preferred_time, status, agreed_price,
      companies ( id, name, slug )
    `)
    .eq("id", id)
    .maybeSingle()

  if (error || !data) return { supabase, user, booking: null, companyName: "" }
  const companyRaw = data.companies
  const company = Array.isArray(companyRaw) ? companyRaw[0] : companyRaw
  return { supabase, user, booking: data, companyName: company?.name || "Clean Jobs" }
}

export async function setCompanyBookingStatusAction(formData: FormData) {
  const bookingId = getString(formData, "booking_id")
  const status = getString(formData, "status")
  const reason = getString(formData, "reason")
  if (!bookingId || !["confirmed", "declined", "cancelled"].includes(status)) return

  const { supabase, user, booking, companyName } = await getOwnerBooking(bookingId)
  if (!booking) redirect("/dashboard/company-bookings")

  const now = new Date().toISOString()

  if (status === "confirmed") {
    const [{ data: occurrences }, { data: settings }] = await Promise.all([
      supabase
        .from("company_booking_occurrences")
        .select("id, scheduled_start, scheduled_end")
        .eq("booking_id", bookingId)
        .eq("status", "pending"),
      supabase
        .from("company_booking_settings")
        .select("buffer_minutes")
        .eq("company_id", booking.company_id)
        .maybeSingle(),
    ])

    const bufferMs = Number(settings?.buffer_minutes || 0) * 60_000
    for (const occurrence of occurrences ?? []) {
      const start = new Date(occurrence.scheduled_start).getTime() - bufferMs
      const end = new Date(occurrence.scheduled_end).getTime() + bufferMs
      const { data: conflicts, error: conflictError } = await supabase
        .from("company_booking_occurrences")
        .select("id")
        .eq("company_id", booking.company_id)
        .neq("booking_id", bookingId)
        .in("status", ["confirmed", "in_progress"])
        .lt("scheduled_start", new Date(end).toISOString())
        .gt("scheduled_end", new Date(start).toISOString())
        .limit(1)

      if (conflictError) {
        console.error("Confirm booking conflict check error:", conflictError)
        redirect(`/dashboard/company-bookings/${bookingId}?error=conflict-check`)
      }

      if ((conflicts ?? []).length > 0) {
        redirect(`/dashboard/company-bookings/${bookingId}?error=conflict`)
      }
    }
  }

  const payload: Record<string, unknown> = { status }
  if (status === "confirmed") {
    payload.confirmed_at = now
    payload.declined_at = null
  }
  if (status === "declined") {
    payload.declined_at = now
    payload.cancellation_reason = reason || null
  }
  if (status === "cancelled") {
    payload.cancelled_at = now
    payload.cancelled_by = user.id
    payload.cancellation_reason = reason || null
  }

  const { data: updated, error } = await supabase
    .from("company_bookings")
    .update(payload)
    .eq("id", bookingId)
    .select("id, customer_id, customer_email, customer_name, service_type, start_date, preferred_time, status")
    .maybeSingle()

  if (error || !updated) {
    console.error("Update company booking status error:", error)
    redirect(`/dashboard/company-bookings/${bookingId}?error=status`)
  }

  if (status === "confirmed") {
    const { error: occurrenceError } = await supabase
      .from("company_booking_occurrences")
      .update({ status: "confirmed", confirmed_at: now })
      .eq("booking_id", bookingId)
      .eq("status", "pending")
    if (occurrenceError) console.error("Confirm booking occurrences error:", occurrenceError)
  } else {
    const { error: occurrenceError } = await supabase
      .from("company_booking_occurrences")
      .update({ status: "cancelled", cancelled_at: now, cancellation_reason: reason || null })
      .eq("booking_id", bookingId)
      .in("status", ["pending", "confirmed"])
    if (occurrenceError) console.error("Cancel booking occurrences error:", occurrenceError)
  }

  await notifyCustomerAboutBookingStatus({
    booking: updated,
    companyName,
    actorId: user.id,
  })

  refreshBookingPaths(bookingId)
  redirect(`/dashboard/company-bookings/${bookingId}?saved=status`)
}

export async function updateCompanyBookingPriceAction(formData: FormData) {
  const bookingId = getString(formData, "booking_id")
  const raw = getString(formData, "agreed_price")
  if (!bookingId) return
  const price = raw ? Number(raw.replace(",", ".")) : null
  if (price !== null && (!Number.isFinite(price) || price < 0)) {
    redirect(`/dashboard/company-bookings/${bookingId}?error=price`)
  }

  const { supabase, booking } = await getOwnerBooking(bookingId)
  if (!booking) redirect("/dashboard/company-bookings")

  const { error } = await supabase
    .from("company_bookings")
    .update({ agreed_price: price })
    .eq("id", bookingId)

  if (error) {
    console.error("Update booking price error:", error)
    redirect(`/dashboard/company-bookings/${bookingId}?error=price`)
  }

  const { error: occurrenceError } = await supabase
    .from("company_booking_occurrences")
    .update({ price })
    .eq("booking_id", bookingId)
    .in("status", ["pending", "confirmed"])

  if (occurrenceError) console.error("Update occurrence prices error:", occurrenceError)
  refreshBookingPaths(bookingId)
  redirect(`/dashboard/company-bookings/${bookingId}?saved=price`)
}

export async function setBookingOccurrenceStatusAction(formData: FormData) {
  const occurrenceId = getString(formData, "occurrence_id")
  const bookingId = getString(formData, "booking_id")
  const target = getString(formData, "status")
  const reason = getString(formData, "reason")
  if (!occurrenceId || !bookingId || !["in_progress", "completed", "cancelled"].includes(target)) return

  const { supabase, user, booking, companyName } = await getOwnerBooking(bookingId)
  if (!booking) redirect("/dashboard/company-bookings")
  const now = new Date().toISOString()
  const payload: Record<string, unknown> = { status: target }
  if (target === "in_progress") payload.started_at = now
  if (target === "completed") payload.completed_at = now
  if (target === "cancelled") {
    payload.cancelled_at = now
    payload.cancellation_reason = reason || null
  }

  const { data: occurrence, error } = await supabase
    .from("company_booking_occurrences")
    .update(payload)
    .eq("id", occurrenceId)
    .eq("booking_id", bookingId)
    .select("id")
    .maybeSingle()

  if (error || !occurrence) {
    console.error("Update booking occurrence status error:", error)
    redirect(`/dashboard/company-bookings/${bookingId}?error=occurrence`)
  }

  let bookingStatus = booking.status
  if (target === "in_progress") {
    bookingStatus = "in_progress"
  } else {
    const { data: openRows } = await supabase
      .from("company_booking_occurrences")
      .select("id, status")
      .eq("booking_id", bookingId)
      .in("status", ["pending", "confirmed", "in_progress"])
      .limit(1)

    if ((openRows ?? []).length === 0) {
      const { data: completedRows } = await supabase
        .from("company_booking_occurrences")
        .select("id")
        .eq("booking_id", bookingId)
        .eq("status", "completed")
        .limit(1)
      bookingStatus = (completedRows ?? []).length > 0 ? "completed" : "cancelled"
    } else if (target === "completed" && booking.status === "in_progress") {
      bookingStatus = "confirmed"
    }
  }

  if (bookingStatus !== booking.status) {
    const statusPayload: Record<string, unknown> = { status: bookingStatus }
    if (bookingStatus === "completed") statusPayload.completed_at = now
    if (bookingStatus === "cancelled") {
      statusPayload.cancelled_at = now
      statusPayload.cancelled_by = user.id
    }

    const { data: updated } = await supabase
      .from("company_bookings")
      .update(statusPayload)
      .eq("id", bookingId)
      .select("id, customer_id, customer_email, customer_name, service_type, start_date, preferred_time, status")
      .maybeSingle()

    if (updated) {
      await notifyCustomerAboutBookingStatus({ booking: updated, companyName, actorId: user.id })
    }
  }

  refreshBookingPaths(bookingId)
  redirect(`/dashboard/company-bookings/${bookingId}?saved=occurrence`)
}
