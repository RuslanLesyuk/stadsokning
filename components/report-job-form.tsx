"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

type Reason = "spam" | "scam" | "fake_job" | "inappropriate_content" | "other"

type Props = {
  jobId: string
}

const reasons: Array<{
  value: Reason
  label: string
  description: string
}> = [
  {
    value: "spam",
    label: "Spam",
    description: "Repeated, irrelevant or promotional content.",
  },
  {
    value: "scam",
    label: "Scam",
    description: "Suspicious payment, identity or fraud risk.",
  },
  {
    value: "fake_job",
    label: "Fake job",
    description: "The job does not look real or trustworthy.",
  },
  {
    value: "inappropriate_content",
    label: "Inappropriate content",
    description: "Offensive, unsafe or abusive content.",
  },
  {
    value: "other",
    label: "Other",
    description: "Something else that should be reviewed.",
  },
]

export default function ReportJobForm({ jobId }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<Reason>("spam")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  function closeModal() {
    if (isPending) return

    setIsOpen(false)
    setReason("spam")
    setMessage("")
  }

  function submitReport() {
    if (isPending) return

    startTransition(async () => {
      const response = await fetch("/api/job-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          reason,
          message,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(data?.error || "Failed to send report.")
        return
      }

      toast.success("Report sent. Thank you for helping keep Clean Jobs safe.")
      closeModal()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97]"
      >
        Report job
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]">
            <div className="bg-gradient-to-br from-white via-white to-rose-50 px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                Report
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                Report this job
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Tell us why this job should be reviewed by the Clean Jobs moderation team.
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="grid gap-2">
                {reasons.map((item) => {
                  const isActive = item.value === reason

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setReason(item.value)}
                      disabled={isPending}
                      className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                        isActive
                          ? "border-rose-200 bg-rose-50"
                          : "border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-slate-950">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {item.description}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div>
                <label
                  htmlFor="report-message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Extra details
                </label>

                <textarea
                  id="report-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder="Add context for the admin team..."
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={submitReport}
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? "Sending..." : "Send report"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
