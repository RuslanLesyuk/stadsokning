"use client"

import { useFormStatus } from "react-dom"
import { GoogleIcon } from "@/components/auth/google-icon"


type OAuthSubmitButtonProps = {
  label: string
  loadingLabel: string
}

export function OAuthSubmitButton({ label, loadingLabel }: OAuthSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <GoogleIcon className="h-5 w-5 shrink-0" />
      <span>{pending ? loadingLabel : label}</span>
    </button>
  )
}