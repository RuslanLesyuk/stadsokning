"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseInteger(value: FormDataEntryValue | null) {
  const text = cleanText(value)
  if (!text) return null

  const number = Number(text)
  return Number.isFinite(number) ? Math.round(number) : null
}

function parseList(value: FormDataEntryValue | null) {
  const text = cleanText(value)
  if (!text) return []

  return text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

export async function updateServiceProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const serviceId = cleanText(formData.get("service_id"))

  if (!serviceId) {
    redirect("/dashboard/services")
  }

  const payload = {
    company_name: cleanText(formData.get("company_name")),
    description: cleanText(formData.get("description")),
    city: cleanText(formData.get("city")) || "Stockholm",
    phone: cleanText(formData.get("phone")),
    email: cleanText(formData.get("email")),
    website: cleanText(formData.get("website")),
    hourly_rate: parseInteger(formData.get("hourly_rate")),
    minimum_order: parseInteger(formData.get("minimum_order")),
    rut_available: cleanText(formData.get("rut_available")) === "yes",
    languages: parseList(formData.get("languages")),
    service_types: parseList(formData.get("service_types")),
    service_areas: parseList(formData.get("service_areas")),
  }

  const { data, error } = await supabase
    .from("service_profiles")
    .update(payload)
    .eq("id", serviceId)
    .eq("user_id", user.id)
    .select("slug")
    .single()

  if (error || !data) {
    redirect(`/dashboard/services/${serviceId}/edit`)
  }

  revalidatePath("/services")
  revalidatePath("/services/stockholm")
  revalidatePath(`/services/${data.slug}`)
  revalidatePath("/dashboard/services")

  redirect("/dashboard/services")
}

export async function deleteServiceProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const serviceId = cleanText(formData.get("service_id"))

  if (!serviceId) {
    redirect("/dashboard/services")
  }

  const { data: service } = await supabase
    .from("service_profiles")
    .select("slug")
    .eq("id", serviceId)
    .eq("user_id", user.id)
    .single()

  await supabase
    .from("service_profiles")
    .delete()
    .eq("id", serviceId)
    .eq("user_id", user.id)

  revalidatePath("/services")
  revalidatePath("/services/stockholm")
  revalidatePath("/dashboard/services")

  if (service?.slug) {
    revalidatePath(`/services/${service.slug}`)
  }

  redirect("/dashboard/services")
}