"use client"

import { useFormStatus } from "react-dom"

import { enrichCompanyLeadsAction } from "./actions"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending
        ? "Scanning company websites..."
        : "Find missing emails"}
    </button>
  )
}

export default function EnrichLeadsForm() {
  return (
    <form
      action={enrichCompanyLeadsAction}
      className="space-y-5"
    >
      <div className="space-y-2">
        <label
          htmlFor="batch_size"
          className="block text-sm font-semibold text-slate-900"
        >
          Companies per scan
        </label>

        <select
          id="batch_size"
          name="batch_size"
          defaultValue="10"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-950 outline-none transition focus:border-slate-950"
        >
          <option value="5">5 companies</option>
          <option value="10">10 companies</option>
          <option value="15">15 companies</option>
          <option value="20">20 companies</option>
        </select>

        <p className="text-sm leading-6 text-slate-600">
          Start with 10 companies. Larger batches can take
          longer and may reach the server execution limit.
        </p>
      </div>

      <SubmitButton />
    </form>
  )
}