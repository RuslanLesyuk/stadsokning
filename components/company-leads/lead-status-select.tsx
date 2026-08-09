"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { setCompanyLeadStatusAction } from "@/app/dashboard/company-leads/actions"
import {
  COMPANY_LEAD_STATUSES,
  type CompanyLeadStatus,
} from "@/lib/company-leads/types"

type Props = {
  leadId: string
  value: CompanyLeadStatus
  labels: Record<CompanyLeadStatus, string>
}

export default function LeadStatusSelect({ leadId, value, labels }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<CompanyLeadStatus>(value)
  const [pending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(event) => {
        const nextStatus = event.target.value as CompanyLeadStatus
        const previous = status
        setStatus(nextStatus)

        startTransition(async () => {
          const result = await setCompanyLeadStatusAction(leadId, nextStatus)
          if (!result.ok) setStatus(previous)
          router.refresh()
        })
      }}
      className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-bold text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100 disabled:opacity-60"
    >
      {COMPANY_LEAD_STATUSES.map((item) => (
        <option key={item} value={item}>
          {labels[item]}
        </option>
      ))}
    </select>
  )
}
