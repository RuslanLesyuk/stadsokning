"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase-server"

export type ProfileActionState = {
  success: boolean
  message: string
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      success: false,
      message: "You must be logged in.",
    }
  }

  const fullName = String(formData.get("full_name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const city = String(formData.get("city") ?? "").trim()

  if (!fullName) {
    return {
      success: false,
      message: "Full name is required.",
    }
  }

  const payload = {
    id: user.id,
    full_name: fullName,
    phone: phone || null,
    city: city || null,
  }

  const { error } = await supabase.from("profiles").upsert(payload, {
    onConflict: "id",
  })

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to update profile.",
    }
  }

  revalidatePath("/profile")
  revalidatePath("/dashboard")
  revalidatePath("/jobs")
  revalidatePath("/")

  return {
    success: true,
    message: "Profile updated.",
  }
}