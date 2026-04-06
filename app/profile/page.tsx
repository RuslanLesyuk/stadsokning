import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  getProfileReviewWord,
  normalizeLocale,
} from "@/lib/i18n"
import FormSubmitButton from "@/components/form-submit-button"

export const dynamic = "force-dynamic"

type ProfileRow = {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
}

type ReviewAggregateRow = {
  rating: number | null
}

function formatRating(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/profile")
  }

  async function saveProfileAction(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect("/login?next=/profile")
    }

    const fullName = String(formData.get("full_name") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const city = String(formData.get("city") || "").trim()

    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName || null,
      phone: phone || null,
      city: city || null,
    })

    redirect("/profile")
  }

  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city")
    .eq("id", user.id)
    .maybeSingle()

  const profile = (profileData as ProfileRow | null) || null

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("review_target_user_id", user.id)

  const reviews = (reviewsData || []) as ReviewAggregateRow[]
  const reviewCount = reviews.length
  const ratings = reviews
    .map((item) => item.rating)
    .filter((value): value is number => typeof value === "number")
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, value) => sum + value, 0) / ratings.length
      : null

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-black">
          {dictionary.profile.title}
        </h1>
        <p className="mt-2 text-sm text-black/60">
          {dictionary.profile.subtitle}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <form action={saveProfileAction} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {dictionary.profile.fullName}
              </label>
              <input
                name="full_name"
                defaultValue={profile?.full_name || ""}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {dictionary.profile.phone}
              </label>
              <input
                name="phone"
                defaultValue={profile?.phone || ""}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                {dictionary.profile.city}
              </label>
              <input
                name="city"
                defaultValue={profile?.city || ""}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 text-sm outline-none transition focus:border-black/30"
              />
            </div>

            <FormSubmitButton
              locale={locale}
              idleLabel={dictionary.profile.save}
              loadingLabel={dictionary.profile.saving}
            />
          </form>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm text-black/50">{dictionary.profile.rating}</div>
            <div className="mt-2 text-3xl font-semibold text-black">
              {averageRating !== null
                ? `${formatRating(averageRating)} ★`
                : dictionary.profile.noRating}
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="text-sm text-black/50">{dictionary.profile.reviews}</div>
            <div className="mt-2 text-3xl font-semibold text-black">
              {reviewCount}
            </div>
            <div className="mt-2 text-sm text-black/60">
              {getProfileReviewWord(locale, reviewCount)}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}