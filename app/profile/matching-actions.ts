"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

function text(
  formData: FormData,
  key: string,
) {
  return String(
    formData.get(key) || "",
  ).trim()
}

function parseCities(value: string) {
  const seen = new Set<string>()
  const cities: string[] = []

  for (const raw of value.split(/[,\n;]/)) {
    const city = raw.trim()

    if (!city) {
      continue
    }

    const key = city.toLocaleLowerCase("sv-SE")

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    cities.push(city)

    if (cities.length >= 25) {
      break
    }
  }

  return cities
}

export async function saveJobMatchPreferencesAction(
  formData: FormData,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(
      "/login?next=/profile#job-matching",
    )
  }

  const enabled =
    formData.get("enabled") === "on"

  const inAppEnabled =
    formData.get("in_app_enabled") === "on"

  const emailEnabled =
    formData.get("email_enabled") === "on"

  const selectedJobTypes: string[] = []

  if (
    formData.get("home_cleaning") === "on"
  ) {
    selectedJobTypes.push(
      "home_cleaning",
    )
  }

  if (
    formData.get("office_cleaning") === "on"
  ) {
    selectedJobTypes.push(
      "office_cleaning",
    )
  }

  if (
    enabled &&
    !inAppEnabled &&
    !emailEnabled
  ) {
    redirect(
      "/profile?matching_error=channel#job-matching",
    )
  }

  if (
    enabled &&
    selectedJobTypes.length === 0
  ) {
    redirect(
      "/profile?matching_error=job_type#job-matching",
    )
  }

  let cities = parseCities(
    text(formData, "cities"),
  )

  if (enabled && cities.length === 0) {
    const [
      { data: profile },
      { data: services },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("city")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("service_profiles")
        .select(
          "city,service_areas",
        )
        .eq("user_id", user.id),
    ])

    cities = parseCities(
      [
        profile?.city || "",
        ...(services || []).flatMap(
          (service) => [
            service.city || "",
            ...(service.service_areas ||
              []),
          ],
        ),
      ].join(","),
    )
  }

  if (enabled && cities.length === 0) {
    redirect(
      "/profile?matching_error=city#job-matching",
    )
  }

  if (emailEnabled && !user.email) {
    redirect(
      "/profile?matching_error=email#job-matching",
    )
  }

  const { error } = await supabase
    .from("job_match_preferences")
    .upsert(
      {
        user_id: user.id,
        enabled,
        in_app_enabled: inAppEnabled,
        email_enabled: emailEnabled,
        cities,
        job_types:
          selectedJobTypes.length > 0
            ? selectedJobTypes
            : [
                "home_cleaning",
                "office_cleaning",
              ],
        updated_at:
          new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      },
    )

  if (error) {
    console.error(
      "Save job match preferences error:",
      error,
    )

    redirect(
      "/profile?matching_error=save#job-matching",
    )
  }

  revalidatePath("/profile")
  revalidatePath("/notifications")
  revalidatePath("/", "layout")

  redirect(
    "/profile?matching_saved=1#job-matching",
  )
}
