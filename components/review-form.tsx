"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"
import {
  leaveReviewAction,
  type ReviewActionState,
} from "@/app/jobs/[id]/reviews/actions"
import { DEFAULT_LOCALE, normalizeLocale } from "@/lib/i18n"

type ReviewFormProps = {
  jobId: string
  reviewTargetUserId: string
  reviewTargetName: string
  locale?: string
}

const initialState: ReviewActionState = {
  success: false,
  message: "",
}

const reviewLabels = {
  uk: {
    title: "Залишити відгук",
    subtitle: "Оцініть користувача",
    rating: "Оцінка",
    comment: "Коментар",
    placeholder: "Напишіть короткий відгук...",
    submit: "Надіслати відгук",
    sending: "Надсилання...",
    success: "Відгук надіслано.",
  },
  ru: {
    title: "Оставить отзыв",
    subtitle: "Оцените пользователя",
    rating: "Оценка",
    comment: "Комментарий",
    placeholder: "Напишите короткий отзыв...",
    submit: "Отправить отзыв",
    sending: "Отправка...",
    success: "Отзыв отправлен.",
  },
  en: {
    title: "Leave a review",
    subtitle: "Rate this user",
    rating: "Rating",
    comment: "Comment",
    placeholder: "Write a short review...",
    submit: "Submit review",
    sending: "Submitting...",
    success: "Review submitted.",
  },
  sv: {
    title: "Lämna en recension",
    subtitle: "Betygsätt användaren",
    rating: "Betyg",
    comment: "Kommentar",
    placeholder: "Skriv en kort recension...",
    submit: "Skicka recension",
    sending: "Skickar...",
    success: "Recension skickad.",
  },
  pl: {
    title: "Dodaj opinię",
    subtitle: "Oceń użytkownika",
    rating: "Ocena",
    comment: "Komentarz",
    placeholder: "Napisz krótką opinię...",
    submit: "Wyślij opinię",
    sending: "Wysyłanie...",
    success: "Opinia została wysłana.",
  },
} as const

function SubmitButton({
  idleLabel,
  loadingLabel,
}: {
  idleLabel: string
  loadingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? loadingLabel : idleLabel}
    </button>
  )
}

export default function ReviewForm({
  jobId,
  reviewTargetUserId,
  reviewTargetName,
  locale = DEFAULT_LOCALE,
}: ReviewFormProps) {
  const resolvedLocale = normalizeLocale(locale)
  const labels = reviewLabels[resolvedLocale]

  const formRef = useRef<HTMLFormElement>(null)
  const [rating, setRating] = useState("5")
  const [comment, setComment] = useState("")

  const [state, formAction] = useActionState(leaveReviewAction, initialState)

  useEffect(() => {
    if (!state.message) return

    if (state.success) {
      toast.success(state.message || labels.success)
      setRating("5")
      setComment("")
      formRef.current?.reset()
    } else {
      toast.error(state.message)
    }
  }, [state, labels.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input
        type="hidden"
        name="reviewTargetUserId"
        value={reviewTargetUserId}
      />

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-black">{labels.title}</h3>
        <p className="mt-1 text-sm text-black/60">
          {labels.subtitle}: {reviewTargetName}
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            {labels.rating}
          </label>

          <select
            name="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
          >
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-black">
            {labels.comment}
          </label>

          <textarea
            name="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={labels.placeholder}
            className="w-full rounded-2xl border border-black/10 px-4 py-3 text-sm outline-none transition focus:border-black/30"
          />
        </div>

        <SubmitButton
          idleLabel={labels.submit}
          loadingLabel={labels.sending}
        />
      </div>
    </form>
  )
}