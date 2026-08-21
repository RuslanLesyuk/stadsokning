"use server"

import { randomUUID } from "node:crypto"

import { processCompanyLead } from "@/lib/email-enrichment/scanner"
import type {
  EnrichmentActionResult,
  EnrichmentBatchSummary,
  EnrichmentSourceStatus,
} from "@/lib/email-enrichment/batch-types"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@/lib/supabase-server"

const SOURCE_STATUSES: EnrichmentSourceStatus[] = [
  "never_scanned",
  "not_found",
  "timeout",
  "invalid_site",
  "failed",
]

const QUEUE_LIMITS = new Set([100, 250, 500, 1000, 2500, 5000])
const CHUNK_SIZES = new Set([4, 8, 12])
const PROCESS_CONCURRENCY = 2

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
    return null
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    return null
  }

  return {
    admin: createAdminClient(),
    userId: user.id,
  }
}

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function integer(value: unknown, fallback = 0) {
  const parsed = Number(value ?? fallback)
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : fallback
}

function parseSummary(value: unknown): EnrichmentBatchSummary | null {
  if (!value || typeof value !== "object") {
    return null
  }

  const raw = value as Record<string, unknown>
  const id = typeof raw.id === "string" ? raw.id : ""
  const status = String(raw.status || "queued")

  if (!id || !["queued", "running", "completed"].includes(status)) {
    return null
  }

  return {
    id,
    status: status as EnrichmentBatchSummary["status"],
    total: integer(raw.total),
    queued: integer(raw.queued),
    processing: integer(raw.processing),
    completed: integer(raw.completed),
    found: integer(raw.found),
    notFound: integer(raw.not_found),
    timeout: integer(raw.timeout),
    invalidSite: integer(raw.invalid_site),
    failed: integer(raw.failed),
    skipped: integer(raw.skipped),
    remaining: integer(raw.remaining),
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function parseSourceStatus(value: string): EnrichmentSourceStatus {
  return SOURCE_STATUSES.includes(value as EnrichmentSourceStatus)
    ? (value as EnrichmentSourceStatus)
    : "never_scanned"
}

function parseQueueLimit(value: string) {
  const parsed = Number(value)
  return QUEUE_LIMITS.has(parsed) ? parsed : 1000
}

function parseMaxAttempts(value: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 5 ? parsed : 3
}

function parseChunkSize(value: number) {
  return CHUNK_SIZES.has(value) ? value : 8
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  handler: (item: T) => Promise<R>,
) {
  if (!items.length) return []

  const results: R[] = new Array(items.length)
  let cursor = 0
  const workers = Math.min(Math.max(1, concurrency), items.length)

  async function worker() {
    while (true) {
      const index = cursor
      cursor += 1
      if (index >= items.length) return
      results[index] = await handler(items[index])
    }
  }

  await Promise.all(Array.from({ length: workers }, () => worker()))
  return results
}

type ClaimedItem = {
  item_id: string
  lead_id: string
  company_name: string
  website: string
  source_status: EnrichmentSourceStatus
  catalog_company_id: string | null
}

export async function createCompanyEnrichmentBatchAction(
  formData: FormData,
): Promise<EnrichmentActionResult> {
  const auth = await requireAdmin()

  if (!auth) {
    return {
      ok: false,
      message: "Admin authentication is required.",
      batch: null,
    }
  }

  const sourceStatus = parseSourceStatus(text(formData, "sourceStatus"))
  const scope = text(formData, "scope") || "all_imported"
  const queueLimit = parseQueueLimit(text(formData, "queueLimit"))
  const maxAttempts = parseMaxAttempts(text(formData, "maxAttempts"))

  let importBatchId: string | null = null
  let importedOnly = true

  if (scope === "all_leads") {
    importedOnly = false
  } else if (scope === "all_imported") {
    importedOnly = true
  } else if (isUuid(scope)) {
    importBatchId = scope
    importedOnly = true
  } else {
    return {
      ok: false,
      message: "Invalid enrichment scope.",
      batch: null,
    }
  }

  const { data, error } = await auth.admin.rpc(
    "create_company_enrichment_batch",
    {
      p_created_by: auth.userId,
      p_source_status: sourceStatus,
      p_import_batch_id: importBatchId,
      p_imported_only: importedOnly,
      p_limit: queueLimit,
      p_max_attempts: maxAttempts,
    },
  )

  if (error) {
    console.error("Create company enrichment batch error:", error)
    return {
      ok: false,
      message: "Could not create the enrichment batch.",
      batch: null,
    }
  }

  const batch = parseSummary(data)

  if (!batch) {
    return {
      ok: false,
      message: "The enrichment batch was created but its summary could not be read.",
      batch: null,
    }
  }

  return {
    ok: true,
    message:
      batch.total > 0
        ? `Queued ${batch.total} companies for enrichment.`
        : "No eligible companies matched this queue.",
    batch,
  }
}

export async function processCompanyEnrichmentChunkAction(
  batchId: string,
  requestedChunkSize: number,
): Promise<EnrichmentActionResult> {
  const auth = await requireAdmin()

  if (!auth) {
    return {
      ok: false,
      message: "Admin authentication is required.",
      batch: null,
      claimed: 0,
    }
  }

  if (!isUuid(batchId)) {
    return {
      ok: false,
      message: "Invalid enrichment batch ID.",
      batch: null,
      claimed: 0,
    }
  }

  const chunkSize = parseChunkSize(requestedChunkSize)
  const workerToken = randomUUID()

  const { data: claimedData, error: claimError } = await auth.admin.rpc(
    "claim_company_enrichment_items",
    {
      p_batch_id: batchId,
      p_limit: chunkSize,
      p_worker_token: workerToken,
    },
  )

  if (claimError) {
    console.error("Claim company enrichment items error:", claimError)
    return {
      ok: false,
      message: "Could not claim the next enrichment chunk.",
      batch: null,
      claimed: 0,
    }
  }

  const claimed = (Array.isArray(claimedData) ? claimedData : []).filter(
    (item): item is ClaimedItem => {
      if (!item || typeof item !== "object") return false
      const row = item as Record<string, unknown>
      return (
        typeof row.item_id === "string" &&
        typeof row.lead_id === "string" &&
        typeof row.company_name === "string" &&
        typeof row.website === "string"
      )
    },
  )

  await mapWithConcurrency(claimed, PROCESS_CONCURRENCY, async (item) => {
    const result = await processCompanyLead({
      id: item.lead_id,
      company_name: item.company_name,
      website: item.website,
    })

    const { error: completeError } = await auth.admin.rpc(
      "complete_company_enrichment_item",
      {
        p_item_id: item.item_id,
        p_worker_token: workerToken,
        p_result_status: result.status,
        p_email: result.email,
        p_email_source: result.emailSource,
        p_email_source_url: result.emailSourceUrl,
        p_error: result.error,
      },
    )

    if (completeError) {
      console.error(
        `Complete enrichment item ${item.item_id} error:`,
        completeError,
      )

      const fallbackError = `Database result save failed: ${completeError.message}`.slice(
        0,
        1000,
      )

      const { error: fallbackUpdateError } = await auth.admin
        .from("company_enrichment_batch_items")
        .update({
          status: "completed",
          result_status: "failed",
          completed_at: new Date().toISOString(),
          worker_token: null,
          error_message: fallbackError,
        })
        .eq("id", item.item_id)
        .eq("worker_token", workerToken)
        .eq("status", "processing")

      if (fallbackUpdateError) {
        console.error(
          `Fallback enrichment item ${item.item_id} update error:`,
          fallbackUpdateError,
        )
      }
    }
  })

  const { data: summaryData, error: summaryError } = await auth.admin.rpc(
    "refresh_company_enrichment_batch",
    { p_batch_id: batchId },
  )

  if (summaryError) {
    console.error("Refresh company enrichment batch error:", summaryError)
    return {
      ok: false,
      message: "The chunk finished, but progress could not be refreshed.",
      batch: null,
      claimed: claimed.length,
    }
  }

  const batch = parseSummary(summaryData)

  if (!batch) {
    return {
      ok: false,
      message: "The chunk finished, but its batch summary could not be read.",
      batch: null,
      claimed: claimed.length,
    }
  }

  return {
    ok: true,
    message:
      batch.remaining === 0
        ? "Enrichment batch completed."
        : `Processed ${claimed.length} companies. ${batch.remaining} remain.`,
    batch,
    claimed: claimed.length,
  }
}
