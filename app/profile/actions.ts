"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export type ProfileActionState = {
  success: boolean
  message: string
}

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return ""

  return value.trim()
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

  const { error } = await admin
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      city,
    })
    .eq("id", user.id)

  if (error) {
    return {
      success: false,
      message: error.message,
    }
  }

  revalidatePath("/profile")
  revalidatePath("/")
  revalidatePath("/jobs")
  revalidatePath("/dashboard")

  return {
    success: true,
    message: "Profile updated successfully.",
  }
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  return saveProfile(formData)
}

export async function updateProfile(formData: FormData) {
  const result = await saveProfile(formData)

  if (!result.success) {
    throw new Error(result.message)
  }
}