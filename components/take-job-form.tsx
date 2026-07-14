"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { takeJobAction } from "@/app/jobs/actions"
import type { Locale } from "@/lib/i18n"

type State = {
  success: boolean
  message: string
}

type TakeJobFormProps = {
  jobId: string
  locale: Locale
}

const initialState: State = {
  success: false,
  message: "",
}

const labels: Record<
  Locale,
  {
    idle: string
    pending: string
  }
> = {
  uk: {
    idle: "Взяти замовлення",
    pending: "Беремо замовлення...",
  },
  ru: {
    idle: "Взять заказ",
    pending: "Берём заказ...",
  },
  en: {
    idle: "Take job",
    pending: "Taking job...",
  },
  sv: {
    idle: "Ta jobbet",
    pending: "Tar jobbet...",
  },
  pl: {
    idle: "Przyjmij zlecenie",
    pending: "Przyjmowanie zlecenia...",
  },
}

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.pending : t.idle}
    </button>
  )
}

export default function TakeJobForm({
  jobId,
  locale,
}: TakeJobFormProps) {
  const [state, formAction] = useActionState(
    takeJobAction,
    initialState,
  )

  useEffect(() => {
    if (!state.message) {
      return
    }

    if (state.success) {
      toast.success(state.message)
      return
    }

    toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="jobId" value={jobId} />

      <SubmitButton locale={locale} />
    </form>
  )
}