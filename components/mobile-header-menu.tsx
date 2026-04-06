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
  profileName: string | null
  profileInitials: string
  unreadCount: number
  isAuthenticated: boolean
}

export default function MobileHeaderMenu({
  jobsLabel,
  dashboardLabel,
  createJobLabel,
  loginLabel,
  signupLabel,
  logoutLabel,
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
        aria-label="Open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-50"
      >
        <span className="text-xl leading-none">☰</span>
      </button>

      {isOpen ? (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            onClick={closeMenu}
            className="fixed inset-0 z-40 bg-transparent"
          />

          <div className="absolute right-0 z-50 mt-2 w-[280px] rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">
            <div className="flex flex-col gap-2">
              <Link
                href="/jobs"
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                {jobsLabel}
              </Link>

              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  <span>{dashboardLabel}</span>
                  {unreadCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {isAuthenticated ? (
                <Link
                  href="/jobs/create"
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
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
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {profileInitials}
                    </span>
                    <span className="truncate">{profileName}</span>
                  </Link>

                  <Link
                    href="/auth/signout"
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {logoutLabel}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
                  >
                    {loginLabel}
                  </Link>

                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white"
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