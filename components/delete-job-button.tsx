"use client"

export default function DeleteJobButton({
  label,
  confirmText,
}: {
  label: string
  confirmText: string
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const confirmed = window.confirm(confirmText)

        if (!confirmed) {
          e.preventDefault()
        }
      }}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
    >
      {label}
    </button>
  )
}