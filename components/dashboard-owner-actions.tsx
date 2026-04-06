"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import {
  deleteJobAction,
  duplicateJobAction,
  type DashboardActionState,
} from "@/app/dashboard/actions"

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  )
}

function DuplicateButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Duplicating..." : "Duplicate"}
    </button>
  )
}

type Props = {
  jobId: string
}

export default function DashboardOwnerActions({ jobId }: Props) {
  const [deleteState, deleteFormAction] = useActionState(
    deleteJobAction,
    initialState,
  )
  const [duplicateState, duplicateFormAction] = useActionState(
    duplicateJobAction,
    initialState,
  )

  const lastDeleteMessage = useRef("")
  const lastDuplicateMessage = useRef("")

  useEffect(() => {
    if (!deleteState.message) return
    if (lastDeleteMessage.current === deleteState.message) return

    lastDeleteMessage.current = deleteState.message

    if (deleteState.success) toast.success(deleteState.message)
    else toast.error(deleteState.message)
  }, [deleteState])

  useEffect(() => {
    if (!duplicateState.message) return
    if (lastDuplicateMessage.current === duplicateState.message) return

    lastDuplicateMessage.current = duplicateState.message

    if (duplicateState.success) toast.success(duplicateState.message)
    else toast.error(duplicateState.message)
  }, [duplicateState])

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={`/jobs/${jobId}`}
        className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        Open
      </Link>

      <Link
        href={`/jobs/${jobId}/edit`}
        className="rounded-xl border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
      >
        Edit
      </Link>

      <form action={duplicateFormAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <DuplicateButton />
      </form>

      <form action={deleteFormAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <DeleteButton />
      </form>
    </div>
  )
}