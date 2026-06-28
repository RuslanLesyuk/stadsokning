"use client"

import { useActionState, useEffect, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { deleteJobAction } from "@/app/dashboard/actions"
import { getDictionary, normalizeLocale } from "@/lib/i18n"

type DashboardActionState = {
  success: boolean
  message: string
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const dialogCopy = {
  uk: {
    title: "Видалити роботу?",
    text: "Ти точно хочеш видалити цю роботу? Цю дію не можна скасувати.",
    confirm: "Так, видалити",
  },
  ru: {
    title: "Удалить работу?",
    text: "Ты точно хочешь удалить эту работу? Это действие нельзя отменить.",
    confirm: "Да, удалить",
  },
  en: {
    title: "Delete job?",
    text: "Are you sure you want to delete this job? This action cannot be undone.",
    confirm: "Yes, delete",
  },
  sv: {
    title: "Radera jobbet?",
    text: "Är du säker på att du vill radera det här jobbet? Åtgärden kan inte ångras.",
    confirm: "Ja, radera",
  },
  pl: {
    title: "Usunąć pracę?",
    text: "Czy na pewno chcesz usunąć tę pracę? Tej akcji nie można cofnąć.",
    confirm: "Tak, usuń",
  },
}

function getLocale() {
  if (typeof document === "undefined") return "en"

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("clean_jobs_locale="))

  return normalizeLocale(match?.split("=")[1])
}

function ConfirmDeleteButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  const locale = getLocale()
  const dictionary = getDictionary(locale)

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? dictionary.common.deleting : label}
    </button>
  )
}

export default function DeleteJobForm({ jobId }: { jobId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(deleteJobAction, initialState)

  const locale = getLocale()
  const dictionary = getDictionary(locale)
  const common = dictionary.common
  const dialog = dialogCopy[locale] || dialogCopy.en

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      setIsOpen(false)
      return
    }

    toast.error(state.message)
  }, [state])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
      >
        {common.delete}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-black">
              {dialog.title}
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/60">
              {dialog.text}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium text-black transition hover:bg-black/[0.03]"
              >
                {common.cancel}
              </button>

              <form action={formAction}>
                <input type="hidden" name="jobId" value={jobId} />
                <ConfirmDeleteButton label={dialog.confirm} />
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}