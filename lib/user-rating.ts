import { createClient } from "@/lib/supabase-server"

export type UserRatingStats = {
  userId: string
  averageRating: number | null
  reviewsCount: number
}

export async function getRatingStatsForUsers(
  userIds: Array<string | null | undefined>
): Promise<Record<string, UserRatingStats>> {
  const uniqueIds = Array.from(
    new Set(userIds.filter((value): value is string => Boolean(value)))
  )

  if (uniqueIds.length === 0) {
    return {}
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("reviews")
    .select("reviewee_id, rating")
    .in("reviewee_id", uniqueIds)

  if (error || !data) {
    return Object.fromEntries(
      uniqueIds.map((userId) => [
        userId,
        {
          userId,
          averageRating: null,
          reviewsCount: 0,
        },
      ])
    )
  }

  const grouped = new Map<
    string,
    {
      sum: number
      count: number
    }
  >()

  for (const row of data) {
    const revieweeId = row.reviewee_id as string | null
    const rating = Number(row.rating)

    if (!revieweeId || Number.isNaN(rating)) {
      continue
    }

    const current = grouped.get(revieweeId) ?? { sum: 0, count: 0 }
    current.sum += rating
    current.count += 1
    grouped.set(revieweeId, current)
  }

  return Object.fromEntries(
    uniqueIds.map((userId) => {
      const stats = grouped.get(userId)

      return [
        userId,
        {
          userId,
          averageRating:
            stats && stats.count > 0
              ? Number((stats.sum / stats.count).toFixed(1))
              : null,
          reviewsCount: stats?.count ?? 0,
        },
      ]
    })
  )
}

export function formatRatingLabel(
  averageRating: number | null,
  reviewsCount: number
) {
  if (!averageRating || reviewsCount === 0) {
    return "No rating yet"
  }

  return `${averageRating.toFixed(1)} ★ (${reviewsCount})`
}