"use client"

import { deleteServiceProfile } from "@/app/dashboard/services/actions"

type Props = {
  serviceId: string
  buttonLabel: string
  confirmMessage: string
}

export default function DeleteServiceButton({
  serviceId,
  buttonLabel,
  confirmMessage,
}: Props) {
  return (
    <form
      action={deleteServiceProfile}
      onSubmit={(event) => {
        const confirmed = window.confirm(confirmMessage)

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
        {buttonLabel}
      </button>
    </form>
  )
}