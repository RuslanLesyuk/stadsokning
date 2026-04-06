"use client"

import { useFormStatus } from "react-dom"
import { getUiDictionary } from "@/lib/ui-i18n"

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
      return "border border-black/10 bg-white text-black hover:bg-black/[0.03]"
    case "danger":
      return "bg-red-600 text-white hover:opacity-90"
    default:
      return "bg-black text-white hover:opacity-90"
  }
}

export default function FormSubmitButton({
  locale,
  idleLabel,
  loadingLabel,
  variant = "primary",
  className = "",
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()
  const ui = getUiDictionary(locale)

  const resolvedIdleLabel = idleLabel || ui.common.save
  const resolvedLoadingLabel = loadingLabel || ui.common.saving

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-12 items-center justify-center rounded-2xl px-6 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getVariantClass(
        variant,
      )} ${className}`}
    >
      {pending ? resolvedLoadingLabel : resolvedIdleLabel}
    </button>
  )
}