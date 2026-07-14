"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"

const SERVICE_IMAGES_BUCKET = "service-logos"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_GALLERY_IMAGES = 10

type WorkingHours = {
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
}

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

function getFiles(values: FormDataEntryValue[]) {
  return values.filter(
    (value): value is File => value instanceof File && value.size > 0,
  )
}

function getFileExtension(file: File) {
  return file.name.split(".").pop()?.toLowerCase() || "jpg"
}

function validateImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be under 5MB.")
  }
}

function parseWorkingHours(formData: FormData): WorkingHours {
  return {
    monday: cleanText(formData.get("working_hours_monday")) || "",
    tuesday: cleanText(formData.get("working_hours_tuesday")) || "",
    wednesday: cleanText(formData.get("working_hours_wednesday")) || "",
    thursday: cleanText(formData.get("working_hours_thursday")) || "",
    friday: cleanText(formData.get("working_hours_friday")) || "",
    saturday: cleanText(formData.get("working_hours_saturday")) || "",
    sunday: cleanText(formData.get("working_hours_sunday")) || "",
  }
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

  validateImage(file)

  const extension = getFileExtension(file)
  const path = `${userId}/${serviceId}/logo-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from(SERVICE_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from(SERVICE_IMAGES_BUCKET)
    .getPublicUrl(path)

  return data.publicUrl
}

async function uploadGalleryImages({
  supabase,
  userId,
  serviceId,
  files,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  serviceId: string
  files: File[]
}) {
  if (files.length === 0) {
    return []
  }

  if (files.length > MAX_GALLERY_IMAGES) {
    throw new Error(
      `You can upload a maximum of ${MAX_GALLERY_IMAGES} gallery images.`,
    )
  }

  const uploadedUrls: string[] = []

  for (const [index, file] of files.entries()) {
    validateImage(file)

    const extension = getFileExtension(file)
    const path = `${userId}/${serviceId}/gallery/gallery-${Date.now()}-${index}.${extension}`

    const { error } = await supabase.storage
      .from(SERVICE_IMAGES_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      throw new Error(error.message)
    }

    const { data } = supabase.storage
      .from(SERVICE_IMAGES_BUCKET)
      .getPublicUrl(path)

    uploadedUrls.push(data.publicUrl)
  }

  return uploadedUrls
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

  const { data: currentService } = await supabase
    .from("service_profiles")
    .select("id, slug, gallery_urls")
    .eq("id", serviceId)
    .eq("user_id", user.id)
    .single()

  if (!currentService) {
    redirect("/dashboard/services")
  }

  const logoFile = getFile(formData.get("logo"))
  const galleryFiles = getFiles(formData.getAll("gallery"))

  let logoUrl: string | null = null

  if (logoFile) {
    logoUrl = await uploadServiceLogo({
      supabase,
      userId: user.id,
      serviceId,
      file: logoFile,
    })
  }

  const uploadedGalleryUrls = await uploadGalleryImages({
    supabase,
    userId: user.id,
    serviceId,
    files: galleryFiles,
  })

  const existingGalleryUrls = Array.isArray(currentService.gallery_urls)
    ? currentService.gallery_urls.filter(
        (url): url is string => typeof url === "string" && url.length > 0,
      )
    : []

  const galleryUrls = [
    ...existingGalleryUrls,
    ...uploadedGalleryUrls,
  ].slice(0, MAX_GALLERY_IMAGES)

  const payload: Record<
    string,
    string | number | boolean | string[] | WorkingHours | null
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
    gallery_urls: galleryUrls,
    working_hours: parseWorkingHours(formData),
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
    console.error("Update service error:", error)
    redirect(`/dashboard/services/${serviceId}/edit`)
  }

  revalidatePath("/services")
  revalidatePath("/services/city/stockholm")
  revalidatePath(`/services/${data.slug}`)
  revalidatePath("/dashboard/services")
  revalidatePath(`/dashboard/services/${serviceId}/edit`)

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

  const { data: storedFiles } = await supabase.storage
    .from(SERVICE_IMAGES_BUCKET)
    .list(`${user.id}/${serviceId}`, {
      limit: 100,
    })

  if (storedFiles && storedFiles.length > 0) {
    const rootFiles = storedFiles
      .filter((file) => file.name)
      .map((file) => `${user.id}/${serviceId}/${file.name}`)

    if (rootFiles.length > 0) {
      await supabase.storage.from(SERVICE_IMAGES_BUCKET).remove(rootFiles)
    }
  }

  const { data: galleryFiles } = await supabase.storage
    .from(SERVICE_IMAGES_BUCKET)
    .list(`${user.id}/${serviceId}/gallery`, {
      limit: 100,
    })

  if (galleryFiles && galleryFiles.length > 0) {
    const galleryPaths = galleryFiles
      .filter((file) => file.name)
      .map(
        (file) => `${user.id}/${serviceId}/gallery/${file.name}`,
      )

    if (galleryPaths.length > 0) {
      await supabase.storage
        .from(SERVICE_IMAGES_BUCKET)
        .remove(galleryPaths)
    }
  }

  revalidatePath("/services")
  revalidatePath("/services/city/stockholm")
  revalidatePath("/dashboard/services")
  revalidatePath(`/services/${service.slug}`)

  redirect("/dashboard/services")
}