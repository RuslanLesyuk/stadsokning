"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import {
  updateJobStatusAction,
  type DashboardActionState,
} from "@/app/dashboard/actions"
import type { Locale } from "@/lib/i18n"

type JobStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "done"
  | "cancelled"
  | null

type JobStatusActionsProps = {
  jobId: string
  status: JobStatus
  currentUserId: string
  createdBy: string
  assignedTo: string | null
  locale: Locale
}

type StatusActionConfig = {
  actionType: "start" | "mark_done" | "cancel" | "reopen"
  nextStatus: "assigned" | "in_progress" | "done" | "cancelled"
  label: string
  pendingLabel: string
  variant: "primary" | "success" | "danger" | "secondary"
  confirmText?: string
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const labels: Record<
  Locale,
  {
    start: string
    starting: string
    complete: string
    completing: string
    cancel: string
    cancelling: string
    reopen: string
    reopening: string
    cancelConfirm: string
    reopenConfirm: string
  }
> = {
  uk: {
    start: "Почати роботу",
    starting: "Починаємо...",
    complete: "Завершити роботу",
    completing: "Завершуємо...",
    cancel: "Скасувати замовлення",
    cancelling: "Скасовуємо...",
    reopen: "Відкрити знову",
    reopening: "Відкриваємо...",
    cancelConfirm: "Ти точно хочеш скасувати це замовлення?",
    reopenConfirm: "Ти точно хочеш знову відкрити це замовлення?",
  },
  ru: {
    start: "Начать работу",
    starting: "Начинаем...",
    complete: "Завершить работу",
    completing: "Завершаем...",
    cancel: "Отменить заказ",
    cancelling: "Отменяем...",
    reopen: "Открыть снова",
    reopening: "Открываем...",
    cancelConfirm: "Ты точно хочешь отменить этот заказ?",
    reopenConfirm: "Ты точно хочешь снова открыть этот заказ?",
  },
  en: {
    start: "Start job",
    starting: "Starting...",
    complete: "Mark as done",
    completing: "Completing...",
    cancel: "Cancel job",
    cancelling: "Cancelling...",
    reopen: "Reopen job",
    reopening: "Reopening...",
    cancelConfirm: "Are you sure you want to cancel this job?",
    reopenConfirm: "Are you sure you want to reopen this job?",
  },
  sv: {
    start: "Starta jobbet",
    starting: "Startar...",
    complete: "Markera som klart",
    completing: "Slutför...",
    cancel: "Avbryt jobbet",
    cancelling: "Avbryter...",
    reopen: "Öppna jobbet igen",
    reopening: "Öppnar igen...",
    cancelConfirm: "Är du säker på att du vill avbryta jobbet?",
    reopenConfirm: "Är du säker på att du vill öppna jobbet igen?",
  },
  pl: {
    start: "Rozpocznij pracę",
    starting: "Rozpoczynanie...",
    complete: "Oznacz jako zakończone",
    completing: "Kończenie...",
    cancel: "Anuluj zlecenie",
    cancelling: "Anulowanie...",
    reopen: "Otwórz ponownie",
    reopening: "Ponowne otwieranie...",
    cancelConfirm: "Czy na pewno chcesz anulować to zlecenie?",
    reopenConfirm: "Czy na pewno chcesz ponownie otworzyć to zlecenie?",
  },
}

function getButtonClasses(variant: StatusActionConfig["variant"]) {
  const base =
    "inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"

  switch (variant) {
    case "success":
      return `${base} bg-emerald-600 text-white hover:bg-emerald-700`

    case "danger":
      return `${base} border border-rose-300 bg-white text-rose-700 hover:bg-rose-50`

    case "secondary":
      return `${base} border border-slate-300 bg-white text-slate-700 hover:bg-slate-50`

    default:
      return `${base} bg-slate-950 text-white hover:bg-slate-800`
  }
}

function StatusSubmitButton({
  config,
}: {
  config: StatusActionConfig
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={getButtonClasses(config.variant)}
    >
      {pending ? config.pendingLabel : config.label}
    </button>
  )
}

function StatusActionForm({
  jobId,
  config,
}: {
  jobId: string
  config: StatusActionConfig
}) {
  const router = useRouter()

  const [state, formAction] = useActionState(
    updateJobStatusAction,
    initialState,
  )

  useEffect(() => {
    if (!state.message) {
      return
    }

    if (state.success) {
      toast.success(state.message)
      router.refresh()
      return
    }

    toast.error(state.message)
  }, [router, state])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!config.confirmText) {
      return
    }

    const confirmed = window.confirm(config.confirmText)

    if (!confirmed) {
      event.preventDefault()
    }
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      className="w-full sm:w-auto"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input
        type="hidden"
        name="status"
        value={config.nextStatus}
      />
      <input
        type="hidden"
        name="actionType"
        value={config.actionType}
      />

      <StatusSubmitButton config={config} />
    </form>
  )
}

export default function JobStatusActions({
  jobId,
  status,
  currentUserId,
  createdBy,
  assignedTo,
  locale,
}: JobStatusActionsProps) {
  const t = labels[locale]

  const isAuthor = currentUserId === createdBy
  const isAssignedWorker =
    Boolean(assignedTo) && currentUserId === assignedTo
  const isParticipant = isAuthor || isAssignedWorker

  if (!assignedTo || !isParticipant) {
    return null
  }

  const actions: StatusActionConfig[] = []

  if (status === "assigned" && isAssignedWorker) {
    actions.push({
      actionType: "start",
      nextStatus: "in_progress",
      label: t.start,
      pendingLabel: t.starting,
      variant: "primary",
    })
  }

  if (status === "in_progress" && isAssignedWorker) {
    actions.push({
      actionType: "mark_done",
      nextStatus: "done",
      label: t.complete,
      pendingLabel: t.completing,
      variant: "success",
    })
  }

  if (
    (status === "assigned" || status === "in_progress") &&
    isParticipant
  ) {
    actions.push({
      actionType: "cancel",
      nextStatus: "cancelled",
      label: t.cancel,
      pendingLabel: t.cancelling,
      variant: "danger",
      confirmText: t.cancelConfirm,
    })
  }

  if (
    (status === "done" || status === "cancelled") &&
    isParticipant
  ) {
    actions.push({
      actionType: "reopen",
      nextStatus: "assigned",
      label: t.reopen,
      pendingLabel: t.reopening,
      variant: "secondary",
      confirmText: t.reopenConfirm,
    })
  }

  if (actions.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      {actions.map((config) => (
        <StatusActionForm
          key={config.actionType}
          jobId={jobId}
          config={config}
        />
      ))}
    </div>
  )
}