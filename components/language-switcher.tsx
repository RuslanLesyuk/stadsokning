"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n"

type LanguageSwitcherProps = {
  locale: Locale
}

type LanguageOption = {
  value: Locale
  label: string
  flag: string
}

const languages: LanguageOption[] = [
  { value: "uk", label: "Українська", flag: "🇺🇦" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "sv", label: "Svenska", flag: "🇸🇪" },
  { value: "pl", label: "Polski", flag: "🇵🇱" },
]

function getCurrentLanguage(locale: Locale) {
  return languages.find((item) => item.value === locale) ?? languages[2]
}

function getLocaleFromSeoPath(pathname: string): Locale | null {
  const cleanPath = pathname.split("?")[0]

  if (/^\/seo\/[^/]+\/[^/]+\/?$/.test(cleanPath)) {
    return "sv"
  }

  const localizedSeoMatch = cleanPath.match(
    /^\/(en|uk|ru|pl)\/seo\/[^/]+\/[^/]+\/?$/,
  )

  if (!localizedSeoMatch) {
    return null
  }

  return localizedSeoMatch[1] as Locale
}

function getSeoLocalizedPath(pathname: string, nextLocale: Locale) {
  const cleanPath = pathname.split("?")[0]

  const localizedSeoMatch = cleanPath.match(
    /^\/(en|uk|ru|pl)\/seo\/([^/]+)\/([^/]+)\/?$/,
  )

  if (localizedSeoMatch) {
    const city = localizedSeoMatch[2]
    const service = localizedSeoMatch[3]

    if (nextLocale === "sv") {
      return `/seo/${city}/${service}`
    }

    return `/${nextLocale}/seo/${city}/${service}`
  }

  const defaultSeoMatch = cleanPath.match(/^\/seo\/([^/]+)\/([^/]+)\/?$/)

  if (defaultSeoMatch) {
    const city = defaultSeoMatch[1]
    const service = defaultSeoMatch[2]

    if (nextLocale === "sv") {
      return `/seo/${city}/${service}`
    }

    return `/${nextLocale}/seo/${city}/${service}`
  }

  return null
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const activeLocale = useMemo(() => {
    return getLocaleFromSeoPath(pathname) ?? locale
  }, [pathname, locale])

  const current = getCurrentLanguage(activeLocale)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current) return

      const target = event.target
      if (!(target instanceof Node)) return

      if (!containerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown, { passive: true })
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  function closeMenu() {
    setIsOpen(false)
  }

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === activeLocale) {
      closeMenu()
      return
    }

    document.cookie = `clean_jobs_locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`
    closeMenu()

    const seoPath = getSeoLocalizedPath(pathname, nextLocale)

    startTransition(() => {
      if (seoPath) {
        window.location.href = seoPath
        return
      }

      router.refresh()
    })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
        className={`inline-flex h-11 items-center gap-2 rounded-2xl border px-3 text-sm font-medium text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] disabled:opacity-60 ${
          isOpen
            ? "border-rose-200 bg-rose-50"
            : "border-slate-200 bg-white hover:bg-rose-50 active:bg-rose-100"
        }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close language menu overlay"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/5"
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-[220px] rounded-3xl border border-slate-200 bg-white p-2 shadow-xl"
          >
            <div className="flex flex-col gap-1">
              {languages.map((item) => {
                const isActive = item.value === activeLocale

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => changeLocale(item.value)}
                    disabled={isPending}
                    className={`flex min-h-11 items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] ${
                      isActive
                        ? "bg-rose-50 text-rose-700"
                        : "text-slate-800 hover:bg-rose-50 active:bg-rose-100"
                    } disabled:opacity-60`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-base leading-none">{item.flag}</span>
                      <span>{item.label}</span>
                    </span>

                    {isActive ? (
                      <span className="text-xs font-semibold text-rose-600">
                        ✓
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}