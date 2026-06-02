"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"

function cleanText(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
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
    throw new Error(error.message)
  }

  revalidatePath("/profile")
  revalidatePath("/")
  revalidatePath("/jobs")

  redirect("/profile")
}