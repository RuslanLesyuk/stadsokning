"use client"

import { useFormStatus } from "react-dom"
import { getUiDictionary } from "@/lib/ui-i18n"
import { cn } from "@/lib/utils"

type FormSubmitButtonProps = {
  locale?: string
  idleLabel?: string
  loadingLabel?: string
  variant?: "primary" | "secondary" | "danger"
  className?: string
}

function getVariantClass(variant: FormSubmitButtonProps["variant"]) {
  switch (variant) {
    case "secondary":
      return "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 active:bg-slate-100"
    case "danger":
      return "bg-red-600 text-white hover:opacity-90 active:bg-red-700"
    default:
      return "bg-black text-white hover:opacity-90 active:bg-black/80"
  }
}

export default function FormSubmitButton({
  locale,
  idleLabel,
  loadingLabel,
  variant = "primary",
  className,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()
  const ui = getUiDictionary(locale)

  const resolvedIdleLabel = idleLabel || ui.common.save
  const resolvedLoadingLabel = loadingLabel || ui.common.saving

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-11 items-center justify-center px-6 text-sm font-medium rounded-2xl transition-all duration-150 select-none",
        "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2",
        "active:scale-[0.97]",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        getVariantClass(variant),
        className,
      )}
    >
      {pending ? resolvedLoadingLabel : resolvedIdleLabel}
    </button>
  )
}