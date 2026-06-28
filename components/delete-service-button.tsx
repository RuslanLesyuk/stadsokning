"use client"

import { deleteServiceProfile } from "@/app/dashboard/services/actions"
import { getDictionary, normalizeLocale } from "@/lib/i18n"

type Props = {
  serviceId: string
}

function getLocale() {
  if (typeof document === "undefined") return "en"

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("clean_jobs_locale="))

  return normalizeLocale(match?.split("=")[1])
}

const confirmCopy = {
  uk: "Ти точно хочеш видалити цей сервіс?",
  ru: "Ты точно хочешь удалить этот сервис?",
  en: "Are you sure you want to delete this service?",
  sv: "Är du säker på att du vill radera den här tjänsten?",
  pl: "Czy na pewno chcesz usunąć tę usługę?",
}

export default function DeleteServiceButton({ serviceId }: Props) {
  const locale = getLocale()
  const dictionary = getDictionary(locale)

  return (
    <form
      action={deleteServiceProfile}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          confirmCopy[locale] ?? confirmCopy.en
        )

        if (!confirmed) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="service_id" value={serviceId} />

      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
      >
        {dictionary.common.delete}
      </button>
    </form>
  )
}