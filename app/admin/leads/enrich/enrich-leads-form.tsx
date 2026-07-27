"use client"

import { useFormStatus } from "react-dom"

import { enrichCompanyLeadsAction } from "./actions"

type ScanStatus =
  | "never_scanned"
  | "not_found"
  | "timeout"
  | "invalid_site"
  | "failed"

type EnrichLeadsFormProps = {
  title?: string
  scanStatus?: ScanStatus
  defaultBatchSize?: 5 | 10 | 15 | 20
  compact?: boolean
}

function SubmitButton({
  title,
  compact,
}: {
  title: string
  compact: boolean
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={[
        "inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60",
        compact ? "w-full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {pending ? "Scanning company websites..." : title}
    </button>
  )
}

export default function EnrichLeadsForm({
  title = "Find missing emails",
  scanStatus = "never_scanned",
  defaultBatchSize = 10,
  compact = false,
}: EnrichLeadsFormProps) {
  const fieldId = `batch_size_${scanStatus}`

  return (
    <form
      action={enrichCompanyLeadsAction}
      className={compact ? "space-y-3" : "space-y-5"}
    >
      <input
        type="hidden"
        name="scan_status"
        value={scanStatus}
      />

      <div className="space-y-2">
        <label
          htmlFor={fieldId}
          className="block text-sm font-semibold text-slate-900"
        >
          Companies per scan
        </label>

        <select
          id={fieldId}
          name="batch_size"
          defaultValue={String(defaultBatchSize)}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-950"
        >
          <option value="5">5 companies</option>
          <option value="10">10 companies</option>
          <option value="15">15 companies</option>
          <option value="20">20 companies</option>
        </select>

        {!compact ? (
          <p className="text-sm leading-6 text-slate-600">
            Start with 10 companies. Larger batches can take
            longer and may reach the server execution limit.
          </p>
        ) : null}
      </div>

      <SubmitButton
        title={title}
        compact={compact}
      />
    </form>
  )
}