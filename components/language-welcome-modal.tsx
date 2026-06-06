"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n"

type LanguageOption = {
  value: Locale
  label: string
  nativeLabel: string
  flag: string
}

const languages: LanguageOption[] = [
  { value: "sv", label: "Svenska", nativeLabel: "Svenska", flag: "🇸🇪" },
  { value: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { value: "uk", label: "Ukrainska", nativeLabel: "Українська", flag: "🇺🇦" },
  { value: "ru", label: "Ryska", nativeLabel: "Русский", flag: "🇷🇺" },
  { value: "pl", label: "Polska", nativeLabel: "Polski", flag: "🇵🇱" },
]

export default function LanguageWelcomeModal() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const hasChosenLanguage = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("clean_jobs_language_selected="))

    if (!hasChosenLanguage) {
      const timer = window.setTimeout(() => {
        setIsVisible(true)
      }, 500)

      return () => window.clearTimeout(timer)
    }
  }, [])

  function chooseLanguage(locale: Locale) {
    document.cookie = `clean_jobs_locale=${locale}; path=/; max-age=31536000; samesite=lax`
    document.cookie = `clean_jobs_language_selected=true; path=/; max-age=31536000; samesite=lax`

    setIsVisible(false)

    startTransition(() => {
      router.refresh()
    })
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]">
        <div className="bg-gradient-to-br from-white via-white to-rose-50 px-6 py-7 sm:px-8">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            Clean Jobs
          </div>

          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Välj språk
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Välj vilket språk du vill använda på Clean Jobs. Du kan ändra språket senare i menyn.
          </p>
        </div>

        <div className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
          {languages.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => chooseLanguage(item.value)}
              disabled={isPending}
              className="flex min-h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-rose-200 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="flex items-center gap-3">
                <span className="text-xl leading-none">{item.flag}</span>
                <span>
                  <span className="block text-sm font-semibold text-slate-950">
                    {item.nativeLabel}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {item.label}
                  </span>
                </span>
              </span>

              <span className="text-sm font-semibold text-rose-600">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}