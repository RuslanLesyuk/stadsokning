"use client"

import {
  useEffect,
  useRef,
} from "react"
import {
  usePathname,
  useSearchParams,
} from "next/navigation"

import {
  captureAcquisitionAttribution,
  clearAcquisitionAttribution,
  hasAnalyticsConsent,
  sendAnalyticsEvent,
} from "@/lib/analytics/acquisition-client"
import type {
  AnalyticsConsent,
} from "@/lib/privacy/consent"

type Props = {
  initialConsent: AnalyticsConsent | null
}

const LANDING_EVENT_KEY =
  "clean_jobs_landing_view_tracked"

function trackLandingOnce() {
  if (
    !hasAnalyticsConsent() ||
    typeof window === "undefined"
  ) {
    return
  }

  try {
    if (
      window.sessionStorage.getItem(
        LANDING_EVENT_KEY,
      ) === "1"
    ) {
      return
    }

    sendAnalyticsEvent("landing_view")

    window.sessionStorage.setItem(
      LANDING_EVENT_KEY,
      "1",
    )
  } catch {
    sendAnalyticsEvent("landing_view")
  }
}

function getJobIdFromPath(pathname: string) {
  const match = pathname.match(
    /^\/jobs\/([^/]+)$/,
  )

  return match?.[1] || ""
}

export default function AcquisitionTracker({
  initialConsent,
}: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialHrefRef =
    useRef<string | null>(null)

  const initialReferrerRef =
    useRef<string>("")

  useEffect(() => {
    if (initialHrefRef.current === null) {
      initialHrefRef.current =
        window.location.href

      initialReferrerRef.current =
        document.referrer
    }

    function enableTracking() {
      captureAcquisitionAttribution(
        initialHrefRef.current ||
          window.location.href,
        initialReferrerRef.current,
      )

      trackLandingOnce()
    }

    function handleConsent(
      event: Event,
    ) {
      const customEvent =
        event as CustomEvent<{
          consent?: AnalyticsConsent
        }>

      if (
        customEvent.detail?.consent ===
        "granted"
      ) {
        enableTracking()
        return
      }

      if (
        customEvent.detail?.consent ===
        "denied"
      ) {
        clearAcquisitionAttribution()
      }
    }

    window.addEventListener(
      "clean-jobs:analytics-consent",
      handleConsent,
    )

    if (initialConsent === "granted") {
      enableTracking()
    }

    if (initialConsent === "denied") {
      clearAcquisitionAttribution()
    }

    return () => {
      window.removeEventListener(
        "clean-jobs:analytics-consent",
        handleConsent,
      )
    }
  }, [initialConsent])

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      const anchor =
        target.closest("a[href]")

      if (
        !(anchor instanceof HTMLAnchorElement)
      ) {
        return
      }

      let url: URL

      try {
        url = new URL(
          anchor.href,
          window.location.href,
        )
      } catch {
        return
      }

      if (
        url.origin !==
        window.location.origin
      ) {
        return
      }

      if (
        url.pathname === "/jobs/create"
      ) {
        sendAnalyticsEvent(
          "create_job_click",
          {
            from_path:
              window.location.pathname,
          },
        )
      }
    }

    document.addEventListener(
      "click",
      handleClick,
    )

    return () => {
      document.removeEventListener(
        "click",
        handleClick,
      )
    }
  }, [])

  useEffect(() => {
    if (
      searchParams.get("job_created") !== "1"
    ) {
      return
    }

    const jobId =
      getJobIdFromPath(pathname)

    if (!jobId) {
      return
    }

    const dedupeKey =
      `clean_jobs_job_published_${jobId}`

    let alreadyTracked = false

    try {
      alreadyTracked =
        window.sessionStorage.getItem(
          dedupeKey,
        ) === "1"
    } catch {
      alreadyTracked = false
    }

    if (!alreadyTracked) {
      sendAnalyticsEvent(
        "job_published",
        {
          job_id: jobId.slice(0, 80),
        },
      )

      try {
        window.sessionStorage.setItem(
          dedupeKey,
          "1",
        )
      } catch {
        // Tracking still succeeded.
      }
    }

    const url =
      new URL(window.location.href)

    url.searchParams.delete(
      "job_created",
    )

    window.history.replaceState(
      window.history.state,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    )
  }, [pathname, searchParams])

  return null
}
