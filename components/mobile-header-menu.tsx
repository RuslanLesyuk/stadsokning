"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type MobileHeaderMenuProps = {
  jobsLabel: string
  dashboardLabel: string
  createJobLabel: string
  loginLabel: string
  signupLabel: string
  logoutLabel: string
  profileLabel: string
  openMenuLabel: string
  closeMenuLabel: string
  profileName: string | null
  profileInitials: string
  unreadCount: number
  isAuthenticated: boolean
  avatarUrl?: string | null
  companyLogoUrl?: string | null
  companyName?: string | null
  servicesLabel: string
  companiesLabel: string
  myServicesLabel: string
  companyLeadsLabel?: string
  companyClaimsLabel?: string
  companyWebsitesLabel?: string
  myBookingsLabel?: string
  companyBookingsLabel?: string
  companyDashboardLabel?: string
  showCompanyLeads?: boolean
  companyLeadsCount?: number
  companyClaimsCount?: number
  companyBookingsCount?: number
}

function itemClass(primary = false) {
  if (primary) {
    return "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
  }

  return "inline-flex min-h-11 items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] active:bg-rose-100"
}

export default function MobileHeaderMenu({
  jobsLabel,
  servicesLabel,
  companiesLabel,
  myServicesLabel,
  companyLeadsLabel = "Company requests",
  companyClaimsLabel = "My company claims",
  companyWebsitesLabel = "Company websites",
  myBookingsLabel = "My bookings",
  companyBookingsLabel = "Company bookings",
  companyDashboardLabel = "Company dashboard",
  dashboardLabel,
  createJobLabel,
  loginLabel,
  signupLabel,
  logoutLabel,
  profileLabel,
  openMenuLabel,
  closeMenuLabel,
  profileName,
  profileInitials,
  unreadCount,
  isAuthenticated,
  avatarUrl,
  companyLogoUrl,
  companyName,
  showCompanyLeads = false,
  companyLeadsCount = 0,
  companyClaimsCount = 0,
  companyBookingsCount = 0,
}: MobileHeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!containerRef.current) return

      const target = event.target
      if (!(target instanceof Node)) return

      if (!containerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown, { passive: true })
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  function closeMenu() {
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={isOpen ? closeMenuLabel : openMenuLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-slate-800 transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] ${
          isOpen
            ? "border-rose-200 bg-rose-50"
            : "border-slate-200 bg-white hover:bg-rose-50 active:bg-rose-100"
        }`}
      >
        <span className="text-xl leading-none">☰</span>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label={closeMenuLabel}
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-black/5"
          />

          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-[280px] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/jobs"
                onClick={closeMenu}
                prefetch={false}
                className={itemClass()}
              >
                {jobsLabel}
              </Link>

              <Link
                href="/services"
                onClick={closeMenu}
                prefetch={false}
                className={itemClass()}
              >
                {servicesLabel}
              </Link>

              <Link
                href="/companies"
                onClick={closeMenu}
                prefetch={false}
                className={itemClass()}
              >
                {companiesLabel}
              </Link>

              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  prefetch={false}
                  className={`${itemClass()} justify-between`}
                >
                  <span>{dashboardLabel}</span>
                  {unreadCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {isAuthenticated ? (
                <Link
                  href="/dashboard/bookings"
                  onClick={closeMenu}
                  prefetch={false}
                  className={itemClass()}
                >
                  {myBookingsLabel}
                </Link>
              ) : null}

              {isAuthenticated ? (
                <Link
                  href="/dashboard/company-claims"
                  onClick={closeMenu}
                  prefetch={false}
                  className={`${itemClass()} justify-between`}
                >
                  <span>{companyClaimsLabel}</span>
                  {companyClaimsCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {companyClaimsCount > 99 ? "99+" : companyClaimsCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {isAuthenticated && showCompanyLeads ? (
                <Link
                  href="/dashboard/company"
                  onClick={closeMenu}
                  prefetch={false}
                  className={`${itemClass()} bg-slate-950 text-white hover:bg-slate-800 hover:text-white`}
                >
                  {companyDashboardLabel}
                </Link>
              ) : null}

              {isAuthenticated && showCompanyLeads ? (
                <Link
                  href="/dashboard/company-leads"
                  onClick={closeMenu}
                  prefetch={false}
                  className={`${itemClass()} justify-between`}
                >
                  <span>{companyLeadsLabel}</span>
                  {companyLeadsCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {companyLeadsCount > 99 ? "99+" : companyLeadsCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {isAuthenticated && showCompanyLeads ? (
                <Link
                  href="/dashboard/websites"
                  onClick={closeMenu}
                  prefetch={false}
                  className={itemClass()}
                >
                  {companyWebsitesLabel}
                </Link>
              ) : null}

              {isAuthenticated && showCompanyLeads ? (
                <Link
                  href="/dashboard/company-bookings"
                  onClick={closeMenu}
                  prefetch={false}
                  className={`${itemClass()} justify-between`}
                >
                  <span>{companyBookingsLabel}</span>
                  {companyBookingsCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {companyBookingsCount > 99 ? "99+" : companyBookingsCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {isAuthenticated ? (
                <Link
                  href="/jobs/create"
                  onClick={closeMenu}
                  prefetch={false}
                  className={itemClass()}
                >
                  {createJobLabel}
                </Link>
              ) : null}

              {isAuthenticated ? (
                <Link
                  href="/dashboard/services"
                  onClick={closeMenu}
                  prefetch={false}
                  className={itemClass()}
                >
                  {myServicesLabel}
                </Link>
              ) : null}

              <div className="my-1 h-px bg-slate-200" />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    prefetch={false}
                    className={`${itemClass()} items-start gap-3`}
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-600 text-xs font-semibold text-white ring-1 ring-slate-200">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={profileName || profileLabel}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      ) : (
                        profileInitials
                      )}
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-xs text-slate-500">{profileLabel}</p>
                      <p className="truncate text-sm font-medium text-slate-900">
                        {profileName || profileLabel}
                      </p>

                      {companyName ? (
                        <div className="mt-1 flex items-center gap-2">
                          {companyLogoUrl ? (
                            <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                              <Image
                                src={companyLogoUrl}
                                alt={companyName}
                                fill
                                sizes="20px"
                                className="object-cover"
                              />
                            </div>
                          ) : null}

                          <p className="truncate text-xs font-medium text-slate-500">
                            {companyName}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </Link>

                  <a
                    href="/auth/signout"
                    onClick={closeMenu}
                    className={itemClass()}
                  >
                    {logoutLabel}
                  </a>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    prefetch={false}
                    className={itemClass()}
                  >
                    {loginLabel}
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    prefetch={false}
                    className={itemClass(true)}
                  >
                    {signupLabel}
                  </Link>
                </>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}