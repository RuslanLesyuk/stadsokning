type Props = {
  averageRating: number | null | undefined
  reviewsCount: number | null | undefined
  size?: "sm" | "md"
}

export default function UserRatingBadge({
  averageRating,
  reviewsCount,
  size = "sm",
}: Props) {
  const hasRating = Boolean(averageRating) && Boolean(reviewsCount)

  const classes =
    size === "md"
      ? "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800"
      : "inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800"

  if (!hasRating) {
    return (
      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500">
        No rating yet
      </span>
    )
  }

  return (
    <span className={classes}>
      <span aria-hidden="true">★</span>
      <span>{Number(averageRating).toFixed(1)}</span>
      <span className="text-amber-700/80">({reviewsCount})</span>
    </span>
  )
}