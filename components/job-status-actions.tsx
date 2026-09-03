"use client"

import {
  useState,
  useTransition,
} from "react"
import { useRouter } from "next/navigation"
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
  actionType:
    | "start"
    | "mark_done"
    | "cancel"
    | "reopen"
  nextStatus:
    | "assigned"
    | "in_progress"
    | "done"
    | "cancelled"
  label: string
  pendingLabel: string
  variant:
    | "primary"
    | "success"
    | "danger"
    | "secondary"
  confirmText?: string
  successLabel: string
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
    genericError: string
    completeConfirm: string
    startedSuccess: string
    completedSuccess: string
    cancelledSuccess: string
    reopenedSuccess: string
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
    cancelConfirm:
      "Ти точно хочеш скасувати це замовлення?",
    reopenConfirm:
      "Ти точно хочеш знову відкрити це замовлення?",
    genericError:
      "Сталася помилка. Спробуй ще раз.",
    completeConfirm: "Робота точно завершена? Після завершення чат стане доступним лише для перегляду.",
    startedSuccess: "Роботу розпочато.",
    completedSuccess: "Роботу завершено.",
    cancelledSuccess: "Замовлення скасовано.",
    reopenedSuccess: "Замовлення відкрито знову.",
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
    cancelConfirm:
      "Ты точно хочешь отменить этот заказ?",
    reopenConfirm:
      "Ты точно хочешь снова открыть этот заказ?",
    genericError:
      "Произошла ошибка. Попробуй ещё раз.",
    completeConfirm: "Работа точно завершена? После завершения чат станет доступен только для просмотра.",
    startedSuccess: "Работа начата.",
    completedSuccess: "Работа завершена.",
    cancelledSuccess: "Заказ отменён.",
    reopenedSuccess: "Заказ открыт снова.",
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
    cancelConfirm:
      "Are you sure you want to cancel this job?",
    reopenConfirm:
      "Are you sure you want to reopen this job?",
    genericError:
      "Something went wrong. Please try again.",
    completeConfirm: "Is the job finished? After completion, the chat becomes read-only.",
    startedSuccess: "Job started.",
    completedSuccess: "Job completed.",
    cancelledSuccess: "Job cancelled.",
    reopenedSuccess: "Job reopened.",
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
    cancelConfirm:
      "Är du säker på att du vill avbryta jobbet?",
    reopenConfirm:
      "Är du säker på att du vill öppna jobbet igen?",
    genericError:
      "Något gick fel. Försök igen.",
    completeConfirm: "Är jobbet färdigt? När du markerar det som klart blir chatten skrivskyddad.",
    startedSuccess: "Jobbet har startats.",
    completedSuccess: "Jobbet är klart.",
    cancelledSuccess: "Jobbet har avbrutits.",
    reopenedSuccess: "Jobbet har öppnats igen.",
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
    cancelConfirm:
      "Czy na pewno chcesz anulować to zlecenie?",
    reopenConfirm:
      "Czy na pewno chcesz ponownie otworzyć to zlecenie?",
    genericError:
      "Wystąpił błąd. Spróbuj ponownie.",
    completeConfirm: "Czy zlecenie jest zakończone? Po zakończeniu czat będzie tylko do odczytu.",
    startedSuccess: "Zlecenie rozpoczęte.",
    completedSuccess: "Zlecenie zakończone.",
    cancelledSuccess: "Zlecenie anulowane.",
    reopenedSuccess: "Zlecenie otwarte ponownie.",
  },
}

function getButtonClasses(
  variant: StatusActionConfig["variant"],
) {
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

function StatusActionButton({
  jobId,
  config,
  errorMessage,
}: {
  jobId: string
  config: StatusActionConfig
  errorMessage: string
}) {
  const router = useRouter()

  const [isLoading, setIsLoading] =
    useState(false)

  const [
    isTransitionPending,
    startTransition,
  ] = useTransition()

  const isPending =
    isLoading || isTransitionPending

  function handleClick() {
    if (isPending) {
      return
    }

    if (
      config.confirmText &&
      !window.confirm(config.confirmText)
    ) {
      return
    }

    setIsLoading(true)

    const formData = new FormData()

    formData.set("jobId", jobId)
    formData.set(
      "status",
      config.nextStatus,
    )
    formData.set(
      "actionType",
      config.actionType,
    )

    startTransition(async () => {
      try {
        const result =
          await updateJobStatusAction(
            initialState,
            formData,
          )

        if (!result.success) {
          toast.error(result.message)
          setIsLoading(false)
          return
        }

        toast.success(config.successLabel)

        /*
         * Спочатку оновлюємо серверні компоненти
         * через Next.js router.
         */
        router.refresh()

        /*
         * Потім примусово перезавантажуємо документ.
         * requestAnimationFrame гарантує, що браузер
         * виконає навігацію без додаткового кліку.
         */
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            window.location.reload()
          })
        })
      } catch (error) {
        console.error(
          "Update job status error:",
          error,
        )

        toast.error(errorMessage)
        setIsLoading(false)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-disabled={isPending}
      className={getButtonClasses(
        config.variant,
      )}
    >
      {isPending
        ? config.pendingLabel
        : config.label}
    </button>
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

  const isAuthor =
    currentUserId === createdBy

  const isAssignedWorker =
    Boolean(assignedTo) &&
    currentUserId === assignedTo

  const isParticipant =
    isAuthor || isAssignedWorker

  if (!assignedTo || !isParticipant) {
    return null
  }

  const actions: StatusActionConfig[] = []

  if (
    status === "assigned" &&
    isAssignedWorker
  ) {
    actions.push({
      actionType: "start",
      nextStatus: "in_progress",
      label: t.start,
      pendingLabel: t.starting,
      variant: "primary",
      successLabel: t.startedSuccess,
    })
  }

  if (
    status === "in_progress" &&
    isAssignedWorker
  ) {
    actions.push({
      actionType: "mark_done",
      nextStatus: "done",
      label: t.complete,
      pendingLabel: t.completing,
      variant: "success",
      confirmText: t.completeConfirm,
      successLabel: t.completedSuccess,
    })
  }

  if (
    (status === "assigned" ||
      status === "in_progress") &&
    isAuthor
  ) {
    actions.push({
      actionType: "cancel",
      nextStatus: "cancelled",
      label: t.cancel,
      pendingLabel: t.cancelling,
      variant: "danger",
      confirmText: t.cancelConfirm,
      successLabel: t.cancelledSuccess,
    })
  }

  if (
    (status === "done" ||
      status === "cancelled") &&
    isAuthor
  ) {
    actions.push({
      actionType: "reopen",
      nextStatus: "assigned",
      label: t.reopen,
      pendingLabel: t.reopening,
      variant: "secondary",
      confirmText: t.reopenConfirm,
      successLabel: t.reopenedSuccess,
    })
  }

  if (actions.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
      {actions.map((config) => (
        <StatusActionButton
          key={config.actionType}
          jobId={jobId}
          config={config}
          errorMessage={t.genericError}
        />
      ))}
    </div>
  )
}
