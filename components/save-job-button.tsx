"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import type { Locale } from "@/lib/i18n"

type Props = {
  jobId: string
  initialSaved: boolean
  disabled?: boolean
  locale?: Locale
}

const copy = {
  uk: {
    save: "Зберегти",
    saved: "Збережено",
    saving: "Збереження...",
    savedToast: "Роботу збережено.",
    removedToast: "Роботу видалено зі збережених.",
    error: "Не вдалося оновити збережену роботу.",
  },
  ru: {
    save: "Сохранить",
    saved: "Сохранено",
    saving: "Сохранение...",
    savedToast: "Работа сохранена.",
    removedToast: "Работа удалена из сохранённых.",
    error: "Не удалось обновить сохранённую работу.",
  },
  en: {
    save: "Save job",
    saved: "Saved",
    saving: "Saving...",
    savedToast: "Job saved.",
    removedToast: "Job removed from saved jobs.",
    error: "Failed to update saved job.",
  },
  sv: {
    save: "Spara jobb",
    saved: "Sparad",
    saving: "Sparar...",
    savedToast: "Jobbet sparades.",
    removedToast: "Jobbet togs bort från sparade jobb.",
    error: "Kunde inte uppdatera sparat jobb.",
  },
  pl: {
    save: "Zapisz ofertę",
    saved: "Zapisano",
    saving: "Zapisywanie...",
    savedToast: "Oferta została zapisana.",
    removedToast: "Oferta została usunięta z zapisanych.",
    error: "Nie udało się zaktualizować zapisanej oferty.",
  },
} as const

export default function SaveJobButton({
  jobId,
  initialSaved,
  disabled = false,
  locale = "en",
}: Props) {
  const router = useRouter()
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()

  const t = copy[locale] || copy.en

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
        toast.error(data.error || t.error)
        return
      }

      setSaved(Boolean(data.saved))

      if (data.saved) {
        toast.success(t.savedToast)
      } else {
        toast.success(t.removedToast)
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

      {isPending ? t.saving : saved ? t.saved : t.save}
    </button>
  )
}