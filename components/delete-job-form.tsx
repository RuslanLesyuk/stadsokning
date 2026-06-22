"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { deleteJobAction } from "@/app/dashboard/actions"

type DashboardActionState = {
  success: boolean
  message: string
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const copy = {
  uk: {
    delete: "Видалити",
    deleting: "Видалення...",
    confirm: "Ти точно хочеш видалити цю роботу?",
  },
  ru: {
    delete: "Удалить",
    deleting: "Удаление...",
    confirm: "Ты точно хочешь удалить эту работу?",
  },
  en: {
    delete: "Delete",
    deleting: "Deleting...",
    confirm: "Are you sure you want to delete this job?",
  },
  sv: {
    delete: "Radera",
    deleting: "Raderar...",
    confirm: "Är du säker på att du vill radera det här jobbet?",
  },
  pl: {
    delete: "Usuń",
    deleting: "Usuwanie...",
    confirm: "Czy na pewno chcesz usunąć tę pracę?",
  },
}

function getLocale() {
  if (typeof document === "undefined") return "en"

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("clean_jobs_locale="))

  return match?.split("=")[1] || "en"
}

function SubmitButton({ locale }: { locale: keyof typeof copy }) {
  const { pending } = useFormStatus()
  const t = copy[locale] || copy.en

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        const confirmed = window.confirm(t.confirm)

        if (!confirmed) {
          event.preventDefault()
          event.stopPropagation()
        }
      }}
      className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.deleting : t.delete}
    </button>
  )
}

export default function DeleteJobForm({ jobId }: { jobId: string }) {
  const [state, formAction] = useActionState(deleteJobAction, initialState)
  const locale = getLocale() as keyof typeof copy

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
      <SubmitButton locale={locale} />
    </form>
  )
}