"use client"

import { useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = {
  interval?: number
}

export default function DashboardLiveRefresh({ interval = 60000 }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const lastRefreshRef = useRef(Date.now())
  const refreshingRef = useRef(false)
  const minimumStaleMs = Math.max(interval, 30000)

  useEffect(() => {
    function refreshIfStale() {
      if (document.hidden || refreshingRef.current) return
      if (Date.now() - lastRefreshRef.current < minimumStaleMs) return

      refreshingRef.current = true
      lastRefreshRef.current = Date.now()

      startTransition(() => {
        router.refresh()
        window.setTimeout(() => {
          refreshingRef.current = false
        }, 1000)
      })
    }

    function handleVisibility() {
      if (!document.hidden) refreshIfStale()
    }

    window.addEventListener("focus", refreshIfStale)
    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      window.removeEventListener("focus", refreshIfStale)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [minimumStaleMs, router])

  return null
}
