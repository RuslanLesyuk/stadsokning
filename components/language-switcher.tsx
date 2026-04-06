"use client"

import { useMemo } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { setLocaleAction } from "@/app/actions/set-locale"
import {
  type Locale,
  SUPPORTED_LOCALES,
  getDictionary,
} from "@/lib/i18n"

type LanguageSwitcherProps = {
  locale: Locale
}

const localeFlags: Record<Locale, string> = {
  uk: "🇺🇦",
  ru: "🇷🇺",
  en: "🇬🇧",
  sv: "🇸🇪",
  pl: "🇵🇱",
}

export default function LanguageSwitcher({
  locale,
}: LanguageSwitcherProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const dictionary = getDictionary(locale)

  const currentPath = useMemo(() => {
    const query = searchParams?.toString()
    if (!pathname) return "/"
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  return (
    <details className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm text-black transition hover:bg-black/[0.03]">
        <span className="text-base leading-none">{localeFlags[locale]}</span>
        <span>{dictionary.language.label}</span>
        <span className="font-medium uppercase">{locale}</span>
      </summary>

      <div className="absolute right-0 z-50 mt-2 min-w-[240px] rounded-2xl border border-black/10 bg-white p-2 shadow-xl">
        <div className="mb-1 px-2 py-1 text-xs font-medium uppercase tracking-wide text-black/40">
          {dictionary.language.label}
        </div>

        <div className="space-y-1">
          {SUPPORTED_LOCALES.map((item) => {
            const isActive = item === locale

            return (
              <form key={item} action={setLocaleAction}>
                <input type="hidden" name="locale" value={item} />
                <input type="hidden" name="nextPath" value={currentPath} />

                <button
                  type="submit"
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black hover:bg-black/[0.03]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-base leading-none">
                      {localeFlags[item]}
                    </span>
                    <span>{dictionary.locales[item]}</span>
                  </span>

                  <span className="text-xs uppercase">{item}</span>
                </button>
              </form>
            )
          })}
        </div>
      </div>
    </details>
  )
}