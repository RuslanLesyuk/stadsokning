"use client"

import { useEffect } from "react"

type ChatReadSyncProps = {
  jobId: string
}

export default function ChatReadSync({ jobId }: ChatReadSyncProps) {
  useEffect(() => {
    let cancelled = false

    async function markAsRead() {
      try {
        await fetch(`/api/jobs/${jobId}/chat/read`, {
          method: "POST",
          cache: "no-store",
        })
      } catch {
        if (cancelled) return
      }
    }

    markAsRead()

    return () => {
      cancelled = true
    }
  }, [jobId])

  return null
}