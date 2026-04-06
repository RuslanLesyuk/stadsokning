"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function ToastListener() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const handledRef = useRef("")

  useEffect(() => {
    const success = searchParams.get("success")
    const error = searchParams.get("error")

    const key = `${success ?? ""}|${error ?? ""}`
    if (!success && !error) return
    if (handledRef.current === key) return

    handledRef.current = key

    if (success) toast.success(success)
    if (error) toast.error(error)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("success")
    params.delete("error")

    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname)
  }, [searchParams, router, pathname])

  return null
}