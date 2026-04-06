"use client"

import { useFormStatus } from "react-dom"

type StatusActionButtonProps = {
  idleLabel: string
  loadingLabel: string
  variant?: "primary" | "secondary" | "danger"
  className?: string
}

function getVariantClass(variant: StatusActionButtonProps["variant"]) {
  switch (variant) {
    case "secondary":
      return "border border-black/10 bg-white text-black hover:bg-black/[0.03]"
    case "danger":
      return "bg-red-600 text-white hover:opacity-90"
    default:
      return "bg-black text-white hover:opacity-90"
  }
}

export default function StatusActionButton({
  idleLabel,
  loadingLabel,
  variant = "primary",
  className = "",
}: StatusActionButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${getVariantClass(
        variant,
      )} ${className}`}
    >
      {pending ? loadingLabel : idleLabel}
    </button>
  )
}