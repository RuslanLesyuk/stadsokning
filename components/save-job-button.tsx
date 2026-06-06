"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

type Props = {
  jobId: string
  initialSaved: boolean
  disabled?: boolean
}

export default function SaveJobButton({
  jobId,
  initialSaved,
  disabled = false,
}: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (disabled || isPending) return

    startTransition(async () => {
      const response = await fetch("/api/saved-jobs/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Failed to update saved job.")
        return
      }

      setSaved(Boolean(data.saved))

      if (data.saved) {
        toast.success("Job saved.")
      } else {
        toast.success("Job removed from saved jobs.")
      }

      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending}
      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
    >
      <span className="mr-2">{saved ? "❤️" : "♡"}</span>
      {isPending ? "Saving..." : saved ? "Saved" : "Save job"}
    </button>
  )
}
