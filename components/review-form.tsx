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
    subtitle: "Оцініть співпрацю з користувачем",
    rating: "Оцінка",
    comment: "Коментар",
    placeholder: "Напишіть коротко, як пройшла робота...",
    submit: "Надіслати відгук",
    sending: "Надсилання...",
    success: "Відгук надіслано.",
    trust: "Ваш відгук допоможе іншим користувачам довіряти профілям на Clean Jobs.",
  },
  ru: {
    title: "Оставить отзыв",
    subtitle: "Оцените сотрудничество с пользователем",
    rating: "Оценка",
    comment: "Комментарий",
    placeholder: "Коротко напишите, как прошла работа...",
    submit: "Отправить отзыв",
    sending: "Отправка...",
    success: "Отзыв отправлен.",
    trust: "Ваш отзыв поможет другим пользователям доверять профилям на Clean Jobs.",
  },
  en: {
    title: "Leave a review",
    subtitle: "Rate your experience with this user",
    rating: "Rating",
    comment: "Comment",
    placeholder: "Briefly describe how the job went...",
    submit: "Submit review",
    sending: "Submitting...",
    success: "Review submitted.",
    trust: "Your review helps other users trust profiles on Clean Jobs.",
  },
  sv: {
    title: "Lämna en recension",
    subtitle: "Betygsätt samarbetet med användaren",
    rating: "Betyg",
    comment: "Kommentar",
    placeholder: "Beskriv kort hur jobbet gick...",
    submit: "Skicka recension",
    sending: "Skickar...",
    success: "Recension skickad.",
    trust: "Din recension hjälper andra användare att känna förtroende på Clean Jobs.",
  },
  pl: {
    title: "Dodaj opinię",
    subtitle: "Oceń współpracę z użytkownikiem",
    rating: "Ocena",
    comment: "Komentarz",
    placeholder: "Krótko opisz, jak przebiegła praca...",
    submit: "Wyślij opinię",
    sending: "Wysyłanie...",
    success: "Opinia została wysłana.",
    trust: "Twoja opinia pomaga innym użytkownikom ufać profilom na Clean Jobs.",
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
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
      return
    }

    toast.error(state.message)
  }, [state, labels.success])

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6"
    >
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="reviewTargetUserId" value={reviewTargetUserId} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            Review
          </div>

          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
            {labels.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {labels.subtitle}:{" "}
            <span className="font-medium text-slate-800">
              {reviewTargetName}
            </span>
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 sm:max-w-xs">
          {labels.trust}
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.rating}
          </label>

          <select
            name="rating"
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
          >
            <option value="5">★★★★★ 5</option>
            <option value="4">★★★★☆ 4</option>
            <option value="3">★★★☆☆ 3</option>
            <option value="2">★★☆☆☆ 2</option>
            <option value="1">★☆☆☆☆ 1</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            {labels.comment}
          </label>

          <textarea
            name="comment"
            rows={4}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={labels.placeholder}
            className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
          />
        </div>

        <SubmitButton idleLabel={labels.submit} loadingLabel={labels.sending} />
      </div>
    </form>
  )
}