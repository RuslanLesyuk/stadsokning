"use client"

import { useActionState, useState } from "react"

import {
  createReviewAction,
  type ReviewActionState,
  type ReviewEntityType,
} from "@/app/reviews/actions"

type ReviewFormProps = {
  entityType: ReviewEntityType
  entityId: string
  labels: {
    title: string
    subtitle: string
    rating: string
    comment: string
    commentPlaceholder: string
    submit: string
    submitting: string
    success: string
  }
}

const initialState: ReviewActionState = {
  ok: false,
  error: null,
  success: null,
}

export default function ReviewForm({
  entityType,
  entityId,
  labels,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    createReviewAction,
    initialState,
  )

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)

  const visibleRating = hoveredRating || rating

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-950">{labels.title}</h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {labels.subtitle}
      </p>

      <form action={formAction} className="mt-6 space-y-5">
        <input type="hidden" name="entity_type" value={entityType} />
        <input type="hidden" name="entity_id" value={entityId} />
        <input type="hidden" name="rating" value={rating} />

        <div>
          <span className="block text-sm font-semibold text-slate-900">
            {labels.rating}
          </span>

          <div
            className="mt-3 flex items-center gap-1"
            onMouseLeave={() => setHoveredRating(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => {
              const active = value <= visibleRating

              return (
                <button
                  key={value}
                  type="button"
                  aria-label={`${value} of 5`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  className={`rounded-lg p-1 text-3xl transition ${
                    active
                      ? "text-amber-400"
                      : "text-slate-300 hover:text-amber-300"
                  }`}
                >
                  ★
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-slate-900"
          >
            {labels.comment}
          </label>

          <textarea
            id="comment"
            name="comment"
            rows={5}
            maxLength={1000}
            placeholder={labels.commentPlaceholder}
            className="mt-3 block w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
          />
        </div>

        {state.error ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
          >
            {state.error}
          </div>
        ) : null}

        {state.ok ? (
          <div
            role="status"
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {state.success || labels.success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending || rating === 0 || state.ok}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? labels.submitting : labels.submit}
        </button>
      </form>
    </section>
  )
}