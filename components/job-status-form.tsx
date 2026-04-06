"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateJobStatusAction } from "@/app/dashboard/actions"

type JobStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "done"
  | "cancelled"
  | null
  | undefined

type ActionType = "start" | "mark_done" | "cancel" | "reopen"

type ActionConfig = {
  label: string
  pendingLabel: string
  variant: "primary" | "success" | "danger" | "secondary"
  helperText: string
}

type DashboardActionState = {
  success: boolean
  message: string
}

type Props = {
  jobId: string
  currentStatus: JobStatus
  isAuthor?: boolean
  isAssignedWorker?: boolean
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  start: {
    label: "Start job",
    pendingLabel: "Starting...",
    variant: "primary",
    helperText: "Move the job into progress.",
  },
  mark_done: {
    label: "Mark as done",
    pendingLabel: "Saving...",
    variant: "success",
    helperText: "Mark the job as completed.",
  },
  cancel: {
    label: "Cancel job",
    pendingLabel: "Cancelling...",
    variant: "danger",
    helperText: "Cancel this job.",
  },
  reopen: {
    label: "Reopen job",
    pendingLabel: "Reopening...",
    variant: "secondary",
    helperText: "Move the job back to assigned status.",
  },
}

function getButtonClasses(variant: ActionConfig["variant"]) {
  if (variant === "success") {
    return "bg-emerald-600 text-white hover:bg-emerald-700"
  }

  if (variant === "danger") {
    return "bg-red-600 text-white hover:bg-red-700"
  }

  if (variant === "secondary") {
    return "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50"
  }

  return "bg-zinc-900 text-white hover:bg-zinc-800"
}

function ActionButton({
  label,
  pendingLabel,
  variant,
}: {
  label: string
  pendingLabel: string
  variant: ActionConfig["variant"]
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${getButtonClasses(
        variant
      )}`}
    >
      {pending ? pendingLabel : label}
    </button>
  )
}

function getAvailableActions(params: {
  currentStatus: JobStatus
  isAuthor: boolean
  isAssignedWorker: boolean
}): ActionType[] {
  const { currentStatus, isAuthor, isAssignedWorker } = params

  switch (currentStatus) {
    case "assigned":
      if (isAssignedWorker) {
        return ["start", "cancel"]
      }
      if (isAuthor) {
        return ["cancel"]
      }
      return []

    case "in_progress":
      if (isAssignedWorker) {
        return ["mark_done", "cancel"]
      }
      if (isAuthor) {
        return ["cancel"]
      }
      return []

    case "done":
      if (isAuthor || isAssignedWorker) {
        return ["reopen"]
      }
      return []

    case "cancelled":
      if (isAuthor || isAssignedWorker) {
        return ["reopen"]
      }
      return []

    case "new":
    case null:
    case undefined:
    default:
      return []
  }
}

function getTargetStatus(actionType: ActionType): Exclude<JobStatus, null | undefined> {
  switch (actionType) {
    case "start":
      return "in_progress"
    case "mark_done":
      return "done"
    case "cancel":
      return "cancelled"
    case "reopen":
      return "assigned"
  }
}

function StatusActionForm({
  jobId,
  actionType,
}: {
  jobId: string
  actionType: ActionType
}) {
  const [state, formAction] = useActionState(updateJobStatusAction, initialState)
  const config = ACTION_CONFIG[actionType]

  if (!config) {
    return null
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="status" value={getTargetStatus(actionType)} />
      <input type="hidden" name="actionType" value={actionType} />

      <ActionButton
        label={config.label}
        pendingLabel={config.pendingLabel}
        variant={config.variant}
      />

      <p className="text-xs text-zinc-500">{config.helperText}</p>

      {!state.success && state.message ? (
        <p className="text-xs text-red-600">{state.message}</p>
      ) : null}
    </form>
  )
}

export default function JobStatusForm({
  jobId,
  currentStatus,
  isAuthor = false,
  isAssignedWorker = false,
}: Props) {
  const availableActions = getAvailableActions({
    currentStatus,
    isAuthor,
    isAssignedWorker,
  })

  if (availableActions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
        No status actions available right now.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {availableActions.map((actionType) => (
        <StatusActionForm
          key={actionType}
          jobId={jobId}
          actionType={actionType}
        />
      ))}
    </div>
  )
}