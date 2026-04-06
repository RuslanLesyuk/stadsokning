"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import { updateProfileAction } from "@/app/profile/actions"

type Props = {
  email: string
  defaultFullName: string
  defaultPhone: string
  defaultCity: string
}

type ProfileActionState = {
  success: boolean
  message: string
}

const initialState: ProfileActionState = {
  success: false,
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Save changes"}
    </button>
  )
}

export default function ProfileEditForm({
  email,
  defaultFullName,
  defaultPhone,
  defaultCity,
}: Props) {
  const [state, formAction] = useActionState(updateProfileAction, initialState)

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message)
      return
    }

    toast.error(state.message)
  }, [state])

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="full_name"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          defaultValue={defaultFullName}
          placeholder="Your full name"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-500 outline-none"
        />
        <p className="mt-2 text-xs text-zinc-500">
          Email is managed by your account login.
        </p>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          defaultValue={defaultPhone}
          placeholder="+46 ..."
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </div>

      <div>
        <label
          htmlFor="city"
          className="mb-2 block text-sm font-medium text-zinc-900"
        >
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          defaultValue={defaultCity}
          placeholder="Stockholm"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400"
        />
      </div>

      {!state.success && state.message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      ) : null}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  )
}