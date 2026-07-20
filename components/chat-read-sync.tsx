"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

type ChatReadSyncProps = {
  jobId: string
}

export default function ChatReadSync({
  jobId,
}: ChatReadSyncProps) {
  const router = useRouter()
  const syncedRef = useRef(false)

  useEffect(() => {
    if (syncedRef.current) {
      return
    }

    syncedRef.current = true

    const controller = new AbortController()

    async function markChatAsRead() {
      try {
        const response = await fetch(
          `/jobs/${jobId}/chat/read`,
          {
            method: "POST",
            cache: "no-store",
            signal: controller.signal,
          },
        )

        if (!response.ok) {
          const result = await response
            .json()
            .catch(() => null)

          console.error(
            "Failed to mark chat as read:",
            result?.error || response.statusText,
          )

          return
        }

        router.refresh()
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return
        }

        console.error(
          "Failed to synchronize chat read state:",
          error,
        )
      }
    }

    void markChatAsRead()

    return () => {
      controller.abort()
    }
  }, [jobId, router])

  return null
}