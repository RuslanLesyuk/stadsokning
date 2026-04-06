"use client"

import { useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"

type Props = {
  interval?: number
}

export default function ChatLiveRefresh({ interval = 30000 }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    const id = setInterval(() => {
      startTransition(() => {
        router.refresh()
      })
    }, interval)

    return () => clearInterval(id)
  }, [interval, router])

  return null
}