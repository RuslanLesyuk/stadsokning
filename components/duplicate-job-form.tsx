"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { duplicateJobAction } from "@/app/dashboard/actions"

type DashboardActionState = {
  success: boolean
  message: string
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Duplicating..." : "Duplicate"}
    </button>
  )
}

export default function DuplicateJobForm({ jobId }: { jobId: string }) {
  const [state, formAction] = useActionState(duplicateJobAction, initialState)

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      return
    }

    toast.error(state.message)
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="jobId" value={jobId} />
      <SubmitButton />
    </form>
  )
}