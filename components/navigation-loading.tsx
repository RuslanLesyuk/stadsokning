"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  usePathname,
  useSearchParams,
} from "next/navigation"

type NavigationLoadingProps = {
  locale?: string
}

const SHOW_DELAY_MS = 140
const SAFETY_TIMEOUT_MS = 12000

const labels: Record<string, string> = {
  sv: "Laddar…",
  en: "Loading…",
  uk: "Завантаження…",
  ru: "Загрузка…",
  pl: "Ładowanie…",
}

function shouldHandleNavigationClick(event: MouseEvent) {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false

  if (
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false
  }

  const target = event.target

  if (!(target instanceof Element)) {
    return false
  }

  const anchor = target.closest("a[href]")

  if (!(anchor instanceof HTMLAnchorElement)) {
    return false
  }

  if (
    anchor.hasAttribute("download") ||
    anchor.target === "_blank" ||
    anchor.closest("[data-no-navigation-loading]")
  ) {
    return false
  }

  let url: URL

  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return false
  }

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    return false
  }

  if (url.origin !== window.location.origin) {
    return false
  }

  const sameDocument =
    url.pathname === window.location.pathname &&
    url.search === window.location.search

  // Hash links and clicks on the exact current URL should not show
  // a page-transition loader because no new route is being loaded.
  if (sameDocument) {
    return false
  }

  return true
}

export default function NavigationLoading({
  locale = "sv",
}: NavigationLoadingProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [visible, setVisible] = useState(false)
  const showTimerRef = useRef<number | null>(null)
  const safetyTimerRef = useRef<number | null>(null)

  const routeKey = useMemo(
    () => `${pathname}?${searchParams.toString()}`,
    [pathname, searchParams],
  )

  const previousRouteKeyRef = useRef(routeKey)

  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }

    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current)
      safetyTimerRef.current = null
    }
  }, [])

  const stopLoading = useCallback(() => {
    clearTimers()
    setVisible(false)
  }, [clearTimers])

  const startLoading = useCallback(() => {
    clearTimers()
    setVisible(false)

    showTimerRef.current = window.setTimeout(() => {
      setVisible(true)
      showTimerRef.current = null
    }, SHOW_DELAY_MS)

    safetyTimerRef.current = window.setTimeout(() => {
      setVisible(false)
      safetyTimerRef.current = null
    }, SAFETY_TIMEOUT_MS)
  }, [clearTimers])

  useEffect(() => {
    if (previousRouteKeyRef.current === routeKey) {
      return
    }

    previousRouteKeyRef.current = routeKey

    // Let the new route paint first so the transition does not end
    // one frame before the replacement UI becomes visible.
    const frame = window.requestAnimationFrame(() => {
      stopLoading()
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [routeKey, stopLoading])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!shouldHandleNavigationClick(event)) {
        return
      }

      startLoading()
    }

    function handlePageShow() {
      stopLoading()
    }

    function handlePopState() {
      stopLoading()
    }

    document.addEventListener("click", handleClick)
    window.addEventListener("pageshow", handlePageShow)
    window.addEventListener("popstate", handlePopState)

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("pageshow", handlePageShow)
      window.removeEventListener("popstate", handlePopState)
      clearTimers()
    }
  }, [clearTimers, startLoading, stopLoading])

  if (!visible) {
    return null
  }

  const label = labels[locale] || labels.sv

  return (
    <div
      className="navigation-loading-overlay"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="navigation-loading-card">
        <span
          aria-hidden="true"
          className="navigation-loading-spinner"
        />
        <span className="navigation-loading-label">
          {label}
        </span>
      </div>
    </div>
  )
}
