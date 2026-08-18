"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

const AVATAR_BUCKET = "avatars"
const COMPANY_LOGO_BUCKET = "company-logos"
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
])

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function getFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File)) return null
  if (value.size <= 0) return null
  return value
}

function getFileExtension(file: File) {
  return ALLOWED_IMAGE_TYPES.get(file.type) || "jpg"
}

async function uploadProfileImage({
  bucket,
  userId,
  file,
  prefix,
}: {
  bucket: string
  userId: string
  file: File | null
  prefix: string
}) {
  if (!file) return null

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPG, PNG, WebP and AVIF images are allowed.")
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be under 5MB.")
  }

  const admin = createAdminClient()
  const extension = getFileExtension(file)
  const path = `${userId}/${prefix}-${Date.now()}.${extension}`

  const { error } = await admin.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(path)

  return data.publicUrl
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/login")
  }

  const fullName = cleanText(formData.get("full_name"))
  const phone = cleanText(formData.get("phone"))
  const city = cleanText(formData.get("city"))
  const companyName = cleanText(formData.get("company_name"))

  if (
    (fullName?.length || 0) > 120 ||
    (phone?.length || 0) > 50 ||
    (city?.length || 0) > 120 ||
    (companyName?.length || 0) > 200
  ) {
    throw new Error("One or more profile fields are too long.")
  }

  const avatarFile = getFile(formData.get("avatar"))
  const companyLogoFile = getFile(formData.get("company_logo"))

  const avatarUrl = await uploadProfileImage({
    bucket: AVATAR_BUCKET,
    userId: user.id,
    file: avatarFile,
    prefix: "avatar",
  })

  const companyLogoUrl = await uploadProfileImage({
    bucket: COMPANY_LOGO_BUCKET,
    userId: user.id,
    file: companyLogoFile,
    prefix: "company-logo",
  })

  const payload: Record<string, string | null> = {
    full_name: fullName,
    phone,
    city,
    company_name: companyName,
  }

  if (avatarUrl) {
    payload.avatar_url = avatarUrl
  }

  if (companyLogoUrl) {
    payload.company_logo_url = companyLogoUrl
  }

  const admin = createAdminClient()

  const { error } = await admin.from("profiles").update(payload).eq("id", user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/profile")
  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  redirect("/profile")
}

export async function updateProfileAction(
  _prevState: { success: boolean; message: string },
  formData: FormData,
) {
  try {
    await updateProfile(formData)

    return {
      success: true,
      message: "Profile updated successfully.",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile.",
    }
  }
}
