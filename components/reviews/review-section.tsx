import Link from "next/link"

import {
  deleteReviewAction,
  type ReviewEntityType,
} from "@/app/reviews/actions"
import ReviewForm from "@/components/reviews/review-form"
import { createClient } from "@/lib/supabase-server"

type ReviewRow = {
  id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
}

type ReviewerProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

type ReviewsSectionProps = {
  entityType: ReviewEntityType
  entityId: string
  revieweeId: string
  pathname: string
  locale: string
  allowReview?: boolean
  labels: {
    title: string
    summaryReviews: string
    noReviews: string
    anonymousUser: string
    leaveReview: string
    leaveReviewSubtitle: string
    rating: string
    comment: string
    commentPlaceholder: string
    submit: string
    submitting: string
    success: string
    alreadyReviewed: string
    ownEntity: string
    loginRequired: string
    loginButton: string
    deleteReview: string
  }
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "U"
}

function formatDate(value: string, locale: string) {
  const localeMap: Record<string, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(localeMap[locale] || "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function createStars(rating: number) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)))

  return Array.from({ length: 5 }, (_, index) => index < normalizedRating)
}

export default async function ReviewsSection({
  entityType,
  entityId,
  revieweeId,
  pathname,
  locale,
  allowReview = true,
  labels,
}: ReviewsSectionProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: reviewsData, error: reviewsError } = await supabase
    .from("reviews")
    .select(
      `
        id,
        reviewer_id,
        reviewee_id,
        rating,
        comment,
        created_at
      `,
    )
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })

  if (reviewsError) {
    console.error("Load reviews error:", reviewsError)
  }

  const reviews = (reviewsData || []) as ReviewRow[]

  const reviewerIds = Array.from(
    new Set(
      reviews
        .map((review) => review.reviewer_id)
        .filter((id): id is string => Boolean(id)),
    ),
  )

  const profileById = new Map<string, ReviewerProfile>()

  if (reviewerIds.length > 0) {
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", reviewerIds)

    if (profilesError) {
      console.error("Load review profiles error:", profilesError)
    }

    for (const profile of (profilesData || []) as ReviewerProfile[]) {
      profileById.set(profile.id, profile)
    }
  }

  const ratings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating))

  const averageRating =
    ratings.length > 0
      ? Number(
          (
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
          ).toFixed(1),
        )
      : null

  const currentUserReview = user
    ? reviews.find((review) => review.reviewer_id === user.id) || null
    : null

  const isOwnEntity = Boolean(user && user.id === revieweeId)

  const canShowReviewForm =
    allowReview &&
    Boolean(user) &&
    !isOwnEntity &&
    !currentUserReview

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            {labels.title}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {reviews.length} {labels.summaryReviews}
          </p>
        </div>

        {averageRating !== null ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
            <div className="flex items-center gap-1" aria-hidden="true">
              {createStars(averageRating).map((active, index) => (
                <span
                  key={index}
                  className={
                    active ? "text-xl text-amber-400" : "text-xl text-slate-300"
                  }
                >
                  ★
                </span>
              ))}
            </div>

            <p className="mt-1 text-right text-sm font-bold text-slate-950">
              {averageRating.toFixed(1)} / 5
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-8">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            {labels.noReviews}
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const reviewer = profileById.get(review.reviewer_id)
              const reviewerName =
                reviewer?.full_name?.trim() || labels.anonymousUser
              const isOwnReview = user?.id === review.reviewer_id

              return (
                <article
                  key={review.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {reviewer?.avatar_url ? (
                          <img
                            src={reviewer.avatar_url}
                            alt={reviewerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(reviewerName)
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {reviewerName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(review.created_at, locale)}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`${review.rating} of 5`}
                      >
                        {createStars(review.rating).map((active, index) => (
                          <span
                            key={index}
                            className={
                              active
                                ? "text-base text-amber-400"
                                : "text-base text-slate-300"
                            }
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <p className="mt-1 text-right text-xs font-semibold text-slate-600">
                        {review.rating}/5
                      </p>
                    </div>
                  </div>

                  {review.comment?.trim() ? (
                    <p className="mt-4 whitespace-pre-line break-words text-sm leading-7 text-slate-700">
                      {review.comment}
                    </p>
                  ) : null}

                  {isOwnReview ? (
                    <form action={deleteReviewAction} className="mt-4">
                      <input
                        type="hidden"
                        name="review_id"
                        value={review.id}
                      />

                      <input
                        type="hidden"
                        name="pathname"
                        value={pathname}
                      />

                      <button
                        type="submit"
                        className="text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        {labels.deleteReview}
                      </button>
                    </form>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-slate-200 pt-8">
        {!allowReview ? null : !user ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm leading-6 text-slate-600">
              {labels.loginRequired}
            </p>

            <Link
              href={`/login?next=${encodeURIComponent(pathname)}`}
              prefetch={false}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {labels.loginButton}
            </Link>
          </div>
        ) : isOwnEntity ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            {labels.ownEntity}
          </div>
        ) : currentUserReview ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-700">
            {labels.alreadyReviewed}
          </div>
        ) : canShowReviewForm ? (
          <ReviewForm
            entityType={entityType}
            entityId={entityId}
            labels={{
              title: labels.leaveReview,
              subtitle: labels.leaveReviewSubtitle,
              rating: labels.rating,
              comment: labels.comment,
              commentPlaceholder: labels.commentPlaceholder,
              submit: labels.submit,
              submitting: labels.submitting,
              success: labels.success,
            }}
          />
        ) : null}
      </div>
    </section>
  )
}