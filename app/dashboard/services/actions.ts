"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

const SERVICE_LOGOS_BUCKET = "service-logos"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

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

function getFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) return null
  if (value.size <= 0) return null
  return value
}

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() || "jpg"
}

async function uploadServiceLogo({
  supabase,
  userId,
  serviceId,
  file,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  serviceId: string
  file: File | null
}) {
  if (!file) return null

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be under 5MB.")
  }

  const extension = getFileExtension(file)
  const path = `${userId}/${serviceId}/logo-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from(SERVICE_LOGOS_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(SERVICE_LOGOS_BUCKET).getPublicUrl(path)

  return data.publicUrl
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

  const logoFile = getFile(formData.get("logo"))

  let logoUrl: string | null = null

  if (logoFile) {
    logoUrl = await uploadServiceLogo({
      supabase,
      userId: user.id,
      serviceId,
      file: logoFile,
    })
  }

  const payload: Record<
    string,
    string | number | boolean | string[] | null
  > = {
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

  if (logoUrl) {
    payload.logo_url = logoUrl
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
  revalidatePath("/services/city/stockholm")
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
    .select("id, slug, user_id")
    .eq("id", serviceId)
    .eq("user_id", user.id)
    .single()

  if (!service) {
    redirect("/dashboard/services")
  }

  const { error } = await supabase
    .from("service_profiles")
    .delete()
    .eq("id", serviceId)
    .eq("user_id", user.id)

  if (error) {
    console.error("Delete service error:", error)
    redirect("/dashboard/services")
  }

  revalidatePath("/services")
  revalidatePath("/services/city/stockholm")
  revalidatePath("/dashboard/services")
  revalidatePath(`/services/${service.slug}`)

  redirect("/dashboard/services")
}