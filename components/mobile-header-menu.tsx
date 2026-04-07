"use client"

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
}

function itemClass(primary = false) {
  if (primary) {
    return "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
  }

  return "inline-flex min-h-11 items-center rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] active:bg-rose-100"
}

export default function MobileHeaderMenu({
  jobsLabel,
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
                      {unreadCount}
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

              <div className="my-1 h-px bg-slate-200" />

              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    prefetch={false}
                    className={`${itemClass()} gap-3`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-semibold text-white">
                      {profileInitials}
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="text-xs text-slate-500">{profileLabel}</p>
                      <p className="truncate text-sm text-slate-800">
                        {profileName || profileLabel}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/auth/signout"
                    onClick={closeMenu}
                    prefetch={false}
                    className={itemClass()}
                  >
                    {logoutLabel}
                  </Link>
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