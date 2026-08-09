"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { markCompanyLeadViewedAction } from "@/app/dashboard/company-leads/actions"

export default function LeadViewTracker({ leadId }: { leadId: string }) {
  const router = useRouter()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    void markCompanyLeadViewedAction(leadId).then((result) => {
      if (result.ok) router.refresh()
    })
  }, [leadId, router])

  return null
}
