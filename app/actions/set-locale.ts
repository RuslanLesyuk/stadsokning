"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from "@/lib/i18n"

export async function setLocaleAction(formData: FormData) {
  const cookieStore = await cookies()

  const nextPathRaw = String(formData.get("nextPath") || "/")
  const localeRaw = String(formData.get("locale") || DEFAULT_LOCALE)

  const locale = normalizeLocale(localeRaw)
  const nextPath =
    nextPathRaw && nextPathRaw.startsWith("/") ? nextPathRaw : "/"

  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })

  redirect(nextPath)
}