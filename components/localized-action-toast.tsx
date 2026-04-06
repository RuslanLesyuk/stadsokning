"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { getActionMessage, inferActionMessageKey } from "@/lib/action-messages"

type LocalizedActionToastProps = {
  locale?: string
  error?: string | null
  success?: string | null
  successKey?: Parameters<typeof getActionMessage>[1]
}

export default function LocalizedActionToast({
  locale,
  error,
  success,
  successKey = "saved",
}: LocalizedActionToastProps) {
  useEffect(() => {
    if (error) {
      const key = inferActionMessageKey(error)
      toast.error(getActionMessage(locale, key))
    }
  }, [error, locale])

  useEffect(() => {
    if (success) {
      toast.success(getActionMessage(locale, successKey))
    }
  }, [success, successKey, locale])

  return null
}