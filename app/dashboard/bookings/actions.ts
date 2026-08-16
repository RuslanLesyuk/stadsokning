"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { notifyOwnerAboutBookingCancellation } from "@/lib/bookings/server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

function getString(formData: FormData, name: string) {
  const value = formData.get(name)
  return typeof value === "string" ? value.trim() : ""
}

export async function cancelCustomerBookingAction(formData: FormData) {
  const bookingId = getString(formData, "booking_id")
  const reason = getString(formData, "reason")
  if (!bookingId) redirect("/dashboard/bookings")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/bookings/${bookingId}`)

  const { data: booking, error } = await supabase
    .from("company_bookings")
    .select("id, company_id, customer_id, customer_name, service_type, status, companies ( id, name, owner_id )")
    .eq("id", bookingId)
    .eq("customer_id", user.id)
    .maybeSingle()

  if (error || !booking) redirect("/dashboard/bookings")
  if (!["pending", "confirmed"].includes(booking.status)) {
    redirect(`/dashboard/bookings/${bookingId}?error=cannot-cancel`)
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()
  const { error: updateError } = await admin
    .from("company_bookings")
    .update({
      status: "cancelled",
      cancelled_at: now,
      cancelled_by: user.id,
      cancellation_reason: reason || null,
    })
    .eq("id", bookingId)
    .eq("customer_id", user.id)

  if (updateError) {
    console.error("Customer cancel booking error:", updateError)
    redirect(`/dashboard/bookings/${bookingId}?error=cancel`)
  }

  await admin
    .from("company_booking_occurrences")
    .update({ status: "cancelled", cancelled_at: now, cancellation_reason: reason || null })
    .eq("booking_id", bookingId)
    .in("status", ["pending", "confirmed"])

  await notifyOwnerAboutBookingCancellation({
    companyId: booking.company_id,
    bookingId,
    customerName: booking.customer_name,
    serviceType: booking.service_type,
    actorId: user.id,
  })

  revalidatePath("/dashboard/bookings")
  revalidatePath(`/dashboard/bookings/${bookingId}`)
  revalidatePath("/dashboard/company-bookings")
  revalidatePath(`/dashboard/company-bookings/${bookingId}`)
  revalidatePath("/notifications")
  revalidatePath("/", "layout")
  redirect(`/dashboard/bookings/${bookingId}?saved=cancelled`)
}
