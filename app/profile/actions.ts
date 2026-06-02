"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export type ProfileActionState = {
  success: boolean
  message: string
}

const initialProfileState: ProfileActionState = {
  success: false,
  message: "",
}

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function updateProfile(formData: FormData) {
  const result = await saveProfile(formData)

  if (!result.success) {
    throw new Error(result.message)
  }
}

export async function updateProfileAction(
  _prevState: ProfileActionState = initialProfileState,
  formData: FormData,
): Promise<ProfileActionState> {
  return saveProfile(formData)
}

async function saveProfile(formData: FormData): Promise<ProfileActionState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      success: false,
      message: "You must be logged in to update your profile.",
    }
  }

  const fullName = cleanText(formData.get("full_name"))
  const phone = cleanText(formData.get("phone"))
  const city = cleanText(formData.get("city"))

  const admin = createAdminClient()

  const { error } = await admin.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      phone,
      city,
    },
    {
      onConflict: "id",
    },
  )

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  revalidatePath("/profile")
  revalidatePath("/")
  revalidatePath("/jobs")

  return {
    success: true,
    message: "Profile updated successfully.",
  }
}