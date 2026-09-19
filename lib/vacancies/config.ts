import { getBillingAccessForUser } from "@/lib/billing/server"

/**
 * Launch switch for vacancy publishing.
 * false = any authenticated user can publish.
 * true  = only users with effective Premium access can publish.
 */
export const VACANCY_POSTING_REQUIRES_PREMIUM = false

export async function canPublishVacancy(userId: string) {
  if (!VACANCY_POSTING_REQUIRES_PREMIUM) return true

  const access = await getBillingAccessForUser(userId)
  return access.isPremium
}
