export type EnrichmentSourceStatus =
  | "never_scanned"
  | "not_found"
  | "timeout"
  | "invalid_site"
  | "failed"

export type EnrichmentBatchStatus =
  | "queued"
  | "running"
  | "completed"

export type EnrichmentBatchSummary = {
  id: string
  status: EnrichmentBatchStatus
  total: number
  queued: number
  processing: number
  completed: number
  found: number
  notFound: number
  timeout: number
  invalidSite: number
  failed: number
  skipped: number
  remaining: number
}

export type EnrichmentImportBatchOption = {
  id: string
  fileName: string
  totalRows: number
  createdAt: string
}

export type EnrichmentActionResult = {
  ok: boolean
  message: string
  batch: EnrichmentBatchSummary | null
  claimed?: number
}
