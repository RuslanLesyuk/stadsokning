"use client"

import { useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = {
  interval?: number
}

export default function ChatLiveRefresh({
  interval = 10000,
}: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const hiddenRef = useRef(false)

  useEffect(() => {
    const handleVisibility = () => {
      hiddenRef.current = document.hidden
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    )

    handleVisibility()

    const id = setInterval(() => {
      if (hiddenRef.current) return

      startTransition(() => {
        router.refresh()
      })
    }, interval)

    return () => {
      clearInterval(id)

      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      )
    }
  }, [interval, router])

  return null
}