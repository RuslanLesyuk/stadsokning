import EmptyState from "@/components/empty-state"

type Reviewer = {
  full_name: string | null
}

export type ReviewListItem = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer: Reviewer | null
}

type ReviewsListProps = {
  reviews: ReviewListItem[]
  emptyTitle: string
  emptyDescription: string
  anonymousLabel: string
}

export default function ReviewsList({
  reviews,
  emptyTitle,
  emptyDescription,
  anonymousLabel,
}: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon="⭐"
      />
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-zinc-900">
                {review.reviewer?.full_name || anonymousLabel}
              </h3>
              <p className="mt-1 text-sm text-zinc-500">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-900">
              {review.rating}/5
            </div>
          </div>

          {review.comment ? (
            <p className="mt-4 text-sm leading-6 text-zinc-700">
              {review.comment}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}