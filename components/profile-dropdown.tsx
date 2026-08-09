"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

type Props = {
  profileLabel: string
  dashboardLabel: string
  myServicesLabel: string
  companyLeadsLabel?: string
  companyClaimsLabel?: string
  logoutLabel: string
  profileName: string
  companyLabel: string
  profileInitials: string
  avatarUrl: string | null
  companyLogoUrl: string | null
  showCompanyLeads?: boolean
  companyLeadsCount?: number
  companyClaimsCount?: number
}

export default function ProfileDropdown({
  profileLabel,
  dashboardLabel,
  myServicesLabel,
  companyLeadsLabel = "Company requests",
  companyClaimsLabel = "My company claims",
  logoutLabel,
  profileName,
  companyLabel,
  profileInitials,
  avatarUrl,
  companyLogoUrl,
  showCompanyLeads = false,
  companyLeadsCount = 0,
  companyClaimsCount = 0,
}: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-2.5 pr-5 text-sm font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50"
      >
        <span className="relative shrink-0">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-rose-600 text-xs font-semibold text-white">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileName}
                className="h-full w-full object-cover"
              />
            ) : (
              profileInitials
            )}
          </span>

          {companyLogoUrl ? (
            <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
              <img
                src={companyLogoUrl}
                alt={companyLabel}
                className="h-full w-full object-cover"
              />
            </span>
          ) : null}
        </span>

        <span className="min-w-0 text-left">
          <span className="block max-w-40 truncate text-sm font-medium text-slate-900">
            {profileName}
          </span>
          <span className="block max-w-40 truncate text-xs text-slate-500">
            {companyLabel}
          </span>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-3xl border border-slate-200 bg-white p-2 shadow-xl">
          <Link
            href="/profile"
            className="block rounded-2xl px-4 py-3 text-sm hover:bg-rose-50"
          >
            {profileLabel}
          </Link>

          <Link
            href="/dashboard"
            className="block rounded-2xl px-4 py-3 text-sm hover:bg-rose-50"
          >
            {dashboardLabel}
          </Link>

          <Link
            href="/dashboard/company-claims"
            className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-rose-50"
          >
            <span>{companyClaimsLabel}</span>
            {companyClaimsCount > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {companyClaimsCount > 99 ? "99+" : companyClaimsCount}
              </span>
            ) : null}
          </Link>

          {showCompanyLeads ? (
            <Link
              href="/dashboard/company-leads"
              className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm hover:bg-rose-50"
            >
              <span>{companyLeadsLabel}</span>
              {companyLeadsCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {companyLeadsCount > 99 ? "99+" : companyLeadsCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          <Link
            href="/dashboard/services"
            className="block rounded-2xl px-4 py-3 text-sm hover:bg-rose-50"
          >
            {myServicesLabel}
          </Link>

          <a
            href="/auth/signout"
            className="block rounded-2xl px-4 py-3 text-sm text-rose-700 hover:bg-rose-50"
          >
            {logoutLabel}
          </a>
        </div>
      ) : null}
    </div>
  )
}
