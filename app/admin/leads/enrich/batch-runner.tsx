"use client"

import { useRef, useState } from "react"

import type {
  EnrichmentBatchSummary,
  EnrichmentImportBatchOption,
} from "@/lib/email-enrichment/batch-types"

import {
  createCompanyEnrichmentBatchAction,
  processCompanyEnrichmentChunkAction,
} from "./batch-actions"

type Props = {
  initialBatch: EnrichmentBatchSummary | null
  importBatches: EnrichmentImportBatchOption[]
  preselectedImportBatchId?: string
}

function percentage(batch: EnrichmentBatchSummary) {
  if (batch.total <= 0) return 100
  return Math.min(100, Math.round((batch.completed / batch.total) * 100))
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  )
}

export default function BatchRunner({
  initialBatch,
  importBatches,
  preselectedImportBatchId,
}: Props) {
  const [batch, setBatch] = useState<EnrichmentBatchSummary | null>(initialBatch)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [running, setRunning] = useState(false)
  const [chunkSize, setChunkSize] = useState(8)
  const stopRequested = useRef(false)

  async function createBatch(formData: FormData) {
    setCreating(true)
    setError("")
    setMessage("")

    try {
      const result = await createCompanyEnrichmentBatchAction(formData)

      if (!result.ok || !result.batch) {
        setError(result.message)
        return
      }

      setBatch(result.batch)
      setMessage(result.message)

      if (result.batch.id) {
        window.history.replaceState(
          null,
          "",
          `/admin/leads/enrich?batch=${encodeURIComponent(result.batch.id)}`,
        )
      }
    } finally {
      setCreating(false)
    }
  }

  async function runBatch() {
    if (!batch || batch.remaining <= 0 || running) return

    stopRequested.current = false
    setRunning(true)
    setError("")
    setMessage("Running enrichment batch…")

    let currentBatch = batch

    try {
      while (!stopRequested.current && currentBatch.remaining > 0) {
        const result = await processCompanyEnrichmentChunkAction(
          currentBatch.id,
          chunkSize,
        )

        if (!result.ok || !result.batch) {
          setError(result.message)
          break
        }

        currentBatch = result.batch
        setBatch(currentBatch)
        setMessage(result.message)

        if ((result.claimed ?? 0) === 0 && currentBatch.remaining > 0) {
          setError(
            "No queued records could be claimed. Wait a moment and press Continue batch; abandoned claims are automatically requeued after 15 minutes.",
          )
          break
        }

        if (currentBatch.remaining > 0 && !stopRequested.current) {
          await new Promise((resolve) => window.setTimeout(resolve, 250))
        }
      }
    } finally {
      setRunning(false)
    }
  }

  function pauseBatch() {
    stopRequested.current = true
    setMessage("Pause requested. The current server chunk will finish first.")
  }

  const defaultScope =
    preselectedImportBatchId && importBatches.some((item) => item.id === preselectedImportBatchId)
      ? preselectedImportBatchId
      : "all_imported"

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-violet-800">
            Mass Import 3/4
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
            Persistent batch enrichment
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Queue hundreds or thousands of companies, then process them in small safe chunks. Progress survives refreshes and the same lead cannot be actively queued in two enrichment batches.
          </p>
        </div>

        {batch ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <div className="font-bold text-slate-900">Batch</div>
            <code className="mt-1 block max-w-[260px] truncate">{batch.id}</code>
          </div>
        ) : null}
      </div>

      {!batch ? (
        <form action={createBatch} className="mt-7 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-slate-900">Scan status</span>
            <select
              name="sourceStatus"
              defaultValue="never_scanned"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="never_scanned">Never scanned</option>
              <option value="not_found">Retry: not found</option>
              <option value="timeout">Retry: timeout</option>
              <option value="invalid_site">Retry: invalid website</option>
              <option value="failed">Retry: failed</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">Scope</span>
            <select
              name="scope"
              defaultValue={defaultScope}
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="all_imported">All mass-import leads</option>
              <option value="all_leads">All CRM leads</option>
              {importBatches.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fileName} · {item.totalRows} rows
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">Queue size</span>
            <select
              name="queueLimit"
              defaultValue="1000"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="100">100 companies</option>
              <option value="250">250 companies</option>
              <option value="500">500 companies</option>
              <option value="1000">1,000 companies</option>
              <option value="2500">2,500 companies</option>
              <option value="5000">5,000 companies</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-slate-900">Maximum scan attempts</span>
            <select
              name="maxAttempts"
              defaultValue="3"
              className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              <option value="1">1 attempt</option>
              <option value="2">2 attempts</option>
              <option value="3">3 attempts</option>
              <option value="4">4 attempts</option>
              <option value="5">5 attempts</option>
            </select>
          </label>

          <div className="lg:col-span-2 xl:col-span-4">
            <button
              type="submit"
              disabled={creating}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-black text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating queue…" : "Create enrichment queue"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-bold text-slate-900">Progress</span>
                <span className="font-black text-slate-700">{percentage(batch)}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all"
                  style={{ width: `${percentage(batch)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {batch.completed} of {batch.total} completed · {batch.remaining} remaining · status {batch.status}
              </p>
            </div>

            <label className="block sm:w-44">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Per server chunk</span>
              <select
                value={chunkSize}
                onChange={(event) => setChunkSize(Number(event.target.value))}
                disabled={running}
                className="mt-1 min-h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                <option value={4}>4 companies</option>
                <option value={8}>8 companies</option>
                <option value={12}>12 companies</option>
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <Metric label="Queued" value={batch.queued} />
            <Metric label="Processing" value={batch.processing} />
            <Metric label="Found" value={batch.found} />
            <Metric label="Not found" value={batch.notFound} />
            <Metric label="Timeout" value={batch.timeout} />
            <Metric label="Invalid site" value={batch.invalidSite} />
            <Metric label="Failed" value={batch.failed} />
            <Metric label="Skipped" value={batch.skipped} />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {batch.remaining > 0 ? (
              running ? (
                <button
                  type="button"
                  onClick={pauseBatch}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-amber-300 bg-amber-50 px-6 text-sm font-black text-amber-900 hover:bg-amber-100"
                >
                  Pause after current chunk
                </button>
              ) : (
                <button
                  type="button"
                  onClick={runBatch}
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-6 text-sm font-black text-white hover:bg-violet-700"
                >
                  Continue batch
                </button>
              )
            ) : (
              <span className="inline-flex min-h-12 items-center rounded-xl border border-emerald-200 bg-emerald-50 px-5 text-sm font-black text-emerald-800">
                Batch completed
              </span>
            )}

            <a
              href="/admin/leads/enrich"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Create another batch
            </a>
          </div>
        </div>
      )}

      {message ? (
        <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-600">
        Keep this browser tab open while automatic chunks are running. You can pause safely and continue later. If the tab disappears during a network request, abandoned claims are automatically requeued after 15 minutes. Email enrichment never sends outreach messages.
      </div>
    </section>
  )
}
