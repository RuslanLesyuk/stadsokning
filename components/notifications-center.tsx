"use client"

import Link from "next/link"
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react"
import { useRouter } from "next/navigation"

import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
  type DashboardActionState,
} from "@/app/dashboard/actions"

export type NotificationItem = {
  id: string
  type: string
  title: string
  message: string | null
  is_read: boolean
  job_id: string | null
  application_id: string | null
  href: string | null
  entity_type: string | null
  entity_id: string | null
  created_at: string
}

type NotificationsCopy = {
  markAllRead: string
  markingAll: string
  markRead: string
  opening: string
  openJob: string
  openCompanyLead: string
  openCompanyClaim: string
  read: string
  unread: string
  emptyTitle: string
  emptyText: string
  browseJobs: string
}

type NotificationsCenterProps = {
  notifications: NotificationItem[]
  copy: NotificationsCopy
  locale: string
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

function formatNotificationDate(value: string, locale: string) {
  const localeMap: Record<string, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-GB",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return new Intl.DateTimeFormat(localeMap[locale] || "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "application_received":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M19 8v6M22 11h-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case "application_accepted":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m8 12 2.5 2.5L16 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "application_rejected":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m9 9 6 6M15 9l-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case "new_message":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "review_received":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="m12 2 3 6 6.5 1-4.75 4.5L18 20l-6-3.25L6 20l1.25-6.5L2.5 9 9 8l3-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )

    case "company_quote_request":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m5 7 7 5 7-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8 16h5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      )

    case "company_claim_approved":
    case "company_claim_rejected":
    case "company_claim_needs_info":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
          <path
            d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
  }
}

function getNotificationHref(notification: NotificationItem) {
  const explicitHref = notification.href?.trim()

  if (explicitHref) {
    return explicitHref
  }

  if (notification.job_id) {
    return `/jobs/${notification.job_id}`
  }

  return "/dashboard"
}

function NotificationCard({
  notification,
  copy,
  locale,
}: {
  notification: NotificationItem
  copy: NotificationsCopy
  locale: string
}) {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    markNotificationReadAction,
    initialState,
  )

  const [targetHref, setTargetHref] = useState<string | null>(null)
  const href = getNotificationHref(notification)
  const openLabel =
    notification.entity_type === "company_claim" ||
    notification.type.startsWith("company_claim_")
      ? copy.openCompanyClaim
      : notification.type === "company_quote_request"
        ? copy.openCompanyLead
        : copy.openJob

  useEffect(() => {
    if (state.success && targetHref) {
      router.push(targetHref)
      router.refresh()
    }
  }, [router, state.success, targetHref])

  function openNotification() {
    if (notification.is_read) {
      router.push(href)
      return
    }

    setTargetHref(href)

    const formData = new FormData()
    formData.set("notificationId", notification.id)

    startTransition(() => {
      action(formData)
    })
  }

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-5 shadow-sm transition duration-200 sm:p-6 ${
        notification.is_read
          ? "border-slate-200 bg-white hover:border-slate-300"
          : "border-rose-200 bg-rose-50/50 hover:border-rose-300"
      }`}
    >
      {!notification.is_read ? (
        <div className="absolute inset-y-0 left-0 w-1 bg-rose-600" />
      ) : null}

      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            notification.is_read
              ? "bg-slate-100 text-slate-600"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {getNotificationIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-semibold text-slate-950">
                  {notification.title}
                </h2>

                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    notification.is_read
                      ? "bg-slate-100 text-slate-600"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {notification.is_read ? copy.read : copy.unread}
                </span>
              </div>

              {notification.message ? (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                  {notification.message}
                </p>
              ) : null}
            </div>

            <time
              dateTime={notification.created_at}
              className="shrink-0 text-xs font-medium text-slate-500"
            >
              {formatNotificationDate(notification.created_at, locale)}
            </time>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openNotification}
              disabled={isPending}
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? copy.opening : openLabel}
            </button>

            {!notification.is_read ? (
              <form action={action}>
                <input type="hidden" name="notificationId" value={notification.id} />

                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {copy.markRead}
                </button>
              </form>
            ) : (
              <Link
                href={href}
                prefetch={false}
                className="text-sm font-medium text-slate-500 transition hover:text-rose-700"
              >
                {openLabel}
              </Link>
            )}
          </div>

          {!state.success && state.message ? (
            <p className="mt-3 text-sm font-medium text-red-600">{state.message}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function MarkAllReadButton({ copy }: { copy: NotificationsCopy }) {
  const router = useRouter()

  const [state, action, isPending] = useActionState(
    markAllNotificationsReadAction,
    initialState,
  )

  useEffect(() => {
    if (state.success) {
      router.refresh()
    }
  }, [router, state.success])

  return (
    <form action={action}>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? copy.markingAll : copy.markAllRead}
      </button>
    </form>
  )
}

export default function NotificationsCenter({
  notifications,
  copy,
  locale,
}: NotificationsCenterProps) {
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.is_read,
  )

  if (notifications.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          {getNotificationIcon("default")}
        </div>

        <h2 className="mt-5 text-xl font-semibold text-slate-950">{copy.emptyTitle}</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
          {copy.emptyText}
        </p>

        <Link
          href="/jobs"
          prefetch={false}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
        >
          {copy.browseJobs}
        </Link>
      </div>
    )
  }

  return (
    <div>
      {hasUnreadNotifications ? (
        <div className="mb-5 flex justify-end">
          <MarkAllReadButton copy={copy} />
        </div>
      ) : null}

      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            copy={copy}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}
