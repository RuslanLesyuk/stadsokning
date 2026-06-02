"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

export type ProfileActionState = {
  message: string
  type: "success" | "error" | null
}

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      type: "error",
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
      type: "error",
      message: error.message,
    }
  }

  revalidatePath("/profile")
  revalidatePath("/")
  revalidatePath("/jobs")

  return {
    type: "success",
    message: "Profile updated successfully.",
  }
}

export const updateProfile = updateProfileAction