"use client"

import { deleteVacancyAction } from "@/app/lediga-jobb/actions"

type VacancyDeleteButtonProps = {
  vacancyId: string
  slug: string
  label: string
  confirmMessage: string
}

export function VacancyDeleteButton({
  vacancyId,
  slug,
  label,
  confirmMessage,
}: VacancyDeleteButtonProps) {
  return (
    <form
      action={deleteVacancyAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault()
        }
      }}
    >
      <input type="hidden" name="vacancy_id" value={vacancyId} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="min-h-10 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        {label}
      </button>
    </form>
  )
}
