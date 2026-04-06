import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import LanguageSwitcher from "@/components/language-switcher"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  type Locale,
  getDictionary,
  getReviewWord,
  normalizeLocale,
} from "@/lib/i18n"

type ProfileRow = {
  id: string
  full_name: string | null
}

type JobRow = {
  id: string
}

type MessageRow = {
  id: string
  job_id: string
  sender_id: string
  read_at: string | null
}

type ReviewRow = {
  rating: number | null
}

function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export default async function SiteHeader() {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  ) as Locale

  const dictionary = getDictionary(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName: string | null = null
  let unreadCount = 0
  let reviewsCount = 0
  let averageRating: number | null = null

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle()

    const profile = (profileData as ProfileRow | null) || null
    fullName = profile?.full_name || null

    const { data: jobsData } = await supabase
      .from("jobs")
      .select("id")
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)

    const jobs = (jobsData || []) as JobRow[]
    const jobIds = jobs.map((job) => job.id)

    if (jobIds.length > 0) {
      const { data: unreadMessagesData } = await supabase
        .from("messages")
        .select("id, job_id, sender_id, read_at")
        .in("job_id", jobIds)
        .is("read_at", null)
        .neq("sender_id", user.id)

      const unreadMessages = (unreadMessagesData || []) as MessageRow[]
      unreadCount = unreadMessages.length
    }

    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("rating")
      .eq("review_target_user_id", user.id)

    if (!reviewsError) {
      const reviews = (reviewsData || []) as ReviewRow[]
      reviewsCount = reviews.length

      if (reviews.length > 0) {
        const ratings = reviews
          .map((item) => item.rating)
          .filter((value): value is number => typeof value === "number")

        if (ratings.length > 0) {
          averageRating =
            ratings.reduce((sum, value) => sum + value, 0) / ratings.length
        }
      }
    }
  }

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-semibold text-black">
            Clean Jobs
          </Link>

          <nav className="flex items-center gap-6 text-sm text-black/70">
            <Link href="/jobs" className="transition hover:text-black">
              {dictionary.header.jobs}
            </Link>

            <Link href="/dashboard" className="transition hover:text-black">
              <span className="inline-flex items-center gap-2">
                <span>{dictionary.header.dashboard}</span>

                {unreadCount > 0 ? (
                  <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {unreadCount}
                  </span>
                ) : null}
              </span>
            </Link>

            <Link href="/jobs/create" className="transition hover:text-black">
              {dictionary.header.createJob}
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} />

          {user ? (
            <>
              <Link
                href="/profile"
                className="rounded-2xl border border-black/10 px-4 py-3 transition hover:bg-black/[0.03]"
              >
                <div className="text-sm font-semibold text-black">
                  {fullName || user.email || "Profile"}
                </div>

                {averageRating !== null ? (
                  <div className="mt-1 text-sm text-black/50">
                    {formatRating(averageRating)} ★ · {reviewsCount}{" "}
                    {getReviewWord(locale, reviewsCount)}
                  </div>
                ) : null}
              </Link>

              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-2xl border border-black/10 px-6 py-4 text-sm font-medium text-black transition hover:bg-black/[0.03]"
                >
                  {dictionary.header.signOut}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-medium text-black transition hover:bg-black/[0.03]"
              >
                {dictionary.header.logIn}
              </Link>

              <Link
                href="/signup"
                className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                {dictionary.header.signUp}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}