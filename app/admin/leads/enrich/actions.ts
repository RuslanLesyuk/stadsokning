"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { processCompanyLead } from "@/lib/email-enrichment/scanner"
import type {
  EmailScanStatus,
  ScannableCompanyLead,
} from "@/lib/email-enrichment/types"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const DEFAULT_BATCH_SIZE = 10
const MAX_BATCH_SIZE = 20
const CONCURRENCY = 4

type ScanSourceStatus =
  | "never_scanned"
  | "not_found"
  | "timeout"
  | "invalid_site"
  | "failed"

type ScanCounters = {
  found: number
  notFound: number
  timeout: number
  invalidSite: number
  failed: number
}

const ALLOWED_SCAN_STATUSES: ScanSourceStatus[] = [
  "never_scanned",
  "not_found",
  "timeout",
  "invalid_site",
  "failed",
]

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect(
      `/login?next=${encodeURIComponent(
        "/admin/leads/enrich",
      )}`,
    )
  }

  const isAdmin = getAdminEmails().includes(
    user.email.toLowerCase(),
  )

  if (!isAdmin) {
    redirect("/dashboard")
  }

  return createAdminClient()
}

function redirectWithError(message: string): never {
  redirect(
    `/admin/leads/enrich?error=${encodeURIComponent(
      message,
    )}`,
  )
}

function parseScanStatus(
  value: FormDataEntryValue | null,
): ScanSourceStatus {
  if (
    typeof value === "string" &&
    ALLOWED_SCAN_STATUSES.includes(
      value as ScanSourceStatus,
    )
  ) {
    return value as ScanSourceStatus
  }

  return "never_scanned"
}

function parseBatchSize(
  value: FormDataEntryValue | null,
) {
  const requestedBatchSize = Number(
    value || DEFAULT_BATCH_SIZE,
  )

  if (!Number.isFinite(requestedBatchSize)) {
    return DEFAULT_BATCH_SIZE
  }

  return Math.min(
    MAX_BATCH_SIZE,
    Math.max(
      1,
      Math.floor(requestedBatchSize),
    ),
  )
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  handler: (item: T) => Promise<R>,
) {
  if (!items.length) {
    return []
  }

  const results: R[] = new Array(items.length)
  const workerCount = Math.min(
    Math.max(1, concurrency),
    items.length,
  )

  let currentIndex = 0

  async function worker() {
    while (true) {
      const index = currentIndex
      currentIndex += 1

      if (index >= items.length) {
        return
      }

      results[index] = await handler(
        items[index],
      )
    }
  }

  await Promise.all(
    Array.from(
      { length: workerCount },
      () => worker(),
    ),
  )

  return results
}

function incrementStatusCounter(
  status: EmailScanStatus,
  counters: ScanCounters,
) {
  switch (status) {
    case "found":
      counters.found += 1
      break

    case "not_found":
      counters.notFound += 1
      break

    case "timeout":
      counters.timeout += 1
      break

    case "invalid_site":
      counters.invalidSite += 1
      break

    case "failed":
      counters.failed += 1
      break
  }
}

export async function enrichCompanyLeadsAction(
  formData: FormData,
) {
  const admin = await requireAdmin()

  const batchSize = parseBatchSize(
    formData.get("batch_size"),
  )

  const sourceStatus = parseScanStatus(
    formData.get("scan_status"),
  )

  const { data, error } = await admin
    .from("company_leads")
    .select("id, company_name, website")
    .not("website", "is", null)
    .neq("website", "")
    .or("email.is.null,email.eq.")
    .eq("email_scan_status", sourceStatus)
    .order("created_at", {
      ascending: true,
    })
    .limit(batchSize)

  if (error) {
    console.error(
      "Company lead enrichment query error:",
      error.message,
    )

    redirectWithError(
      "Could not load companies for email enrichment.",
    )
  }

  const leads = (data ?? []).filter(
    (lead): lead is ScannableCompanyLead =>
      typeof lead.id === "string" &&
      typeof lead.company_name === "string" &&
      typeof lead.website === "string" &&
      lead.website.trim().length > 0,
  )

  if (!leads.length) {
    const params = new URLSearchParams({
      success: "no-companies",
      sourceStatus,
    })

    redirect(
      `/admin/leads/enrich?${params.toString()}`,
    )
  }

  const results = await mapWithConcurrency(
    leads,
    CONCURRENCY,
    processCompanyLead,
  )

  const counters: ScanCounters = {
    found: 0,
    notFound: 0,
    timeout: 0,
    invalidSite: 0,
    failed: 0,
  }

  let savedCount = 0
  let databaseErrorCount = 0

  const checkedAt = new Date().toISOString()

  for (const result of results) {
    incrementStatusCounter(
      result.status,
      counters,
    )

    if (result.status === "found") {
      const {
        data: updatedLead,
        error: updateError,
      } = await admin
        .from("company_leads")
        .update({
          email: result.email,
          email_source:
            result.emailSource,
          email_source_url:
            result.emailSourceUrl,
          email_scan_status: "found",
          email_checked_at: checkedAt,
          email_scan_error: null,
        })
        .eq("id", result.leadId)
        .eq(
          "email_scan_status",
          sourceStatus,
        )
        .or("email.is.null,email.eq.")
        .select("id")
        .maybeSingle()

      if (updateError) {
        databaseErrorCount += 1

        console.error(
          `Could not save email for ${result.companyName}:`,
          updateError.message,
        )

        continue
      }

      if (updatedLead) {
        savedCount += 1
      }

      continue
    }

    const { error: statusUpdateError } =
      await admin
        .from("company_leads")
        .update({
          email_scan_status:
            result.status,
          email_checked_at: checkedAt,
          email_scan_error:
            result.error,
          email_source: null,
          email_source_url: null,
        })
        .eq("id", result.leadId)
        .eq(
          "email_scan_status",
          sourceStatus,
        )
        .or("email.is.null,email.eq.")

    if (statusUpdateError) {
      databaseErrorCount += 1

      console.error(
        `Could not save scan status for ${result.companyName}:`,
        statusUpdateError.message,
      )
    }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/leads")
  revalidatePath("/admin/leads/enrich")

  const params = new URLSearchParams({
    success: "enrichment-completed",
    sourceStatus,
    scanned: String(leads.length),
    found: String(counters.found),
    saved: String(savedCount),
    notFound: String(
      counters.notFound,
    ),
    timeout: String(counters.timeout),
    invalidSite: String(
      counters.invalidSite,
    ),
    failed: String(counters.failed),
    databaseErrors: String(
      databaseErrorCount,
    ),
  })

  redirect(
    `/admin/leads/enrich?${params.toString()}`,
  )
}