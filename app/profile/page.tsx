import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  city: string | null
}

type Copy = {
  title: string
  subtitle: string
  full_name: string
  email: string
  phone: string
  city: string
  no_phone: string
  no_city: string
  no_name: string
  stats_title: string
  rating: string
  reviews: string
  account_title: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    title: "Профіль",
    subtitle: "Ваші дані та рейтинг на платформі.",
    full_name: "Ім’я",
    email: "Email",
    phone: "Телефон",
    city: "Місто",
    no_phone: "Не вказано",
    no_city: "Не вказано",
    no_name: "Користувач",
    stats_title: "Статистика",
    rating: "Рейтинг",
    reviews: "Відгуки",
    account_title: "Дані акаунта",
  },
  ru: {
    title: "Профиль",
    subtitle: "Ваши данные и рейтинг на платформе.",
    full_name: "Имя",
    email: "Email",
    phone: "Телефон",
    city: "Город",
    no_phone: "Не указано",
    no_city: "Не указано",
    no_name: "Пользователь",
    stats_title: "Статистика",
    rating: "Рейтинг",
    reviews: "Отзывы",
    account_title: "Данные аккаунта",
  },
  en: {
    title: "Profile",
    subtitle: "Your details and rating on the platform.",
    full_name: "Name",
    email: "Email",
    phone: "Phone",
    city: "City",
    no_phone: "Not specified",
    no_city: "Not specified",
    no_name: "User",
    stats_title: "Stats",
    rating: "Rating",
    reviews: "Reviews",
    account_title: "Account details",
  },
  sv: {
    title: "Profil",
    subtitle: "Dina uppgifter och ditt betyg på plattformen.",
    full_name: "Namn",
    email: "E-post",
    phone: "Telefon",
    city: "Stad",
    no_phone: "Inte angivet",
    no_city: "Inte angivet",
    no_name: "Användare",
    stats_title: "Statistik",
    rating: "Betyg",
    reviews: "Recensioner",
    account_title: "Kontouppgifter",
  },
  pl: {
    title: "Profil",
    subtitle: "Twoje dane i ocena na platformie.",
    full_name: "Imię",
    email: "Email",
    phone: "Telefon",
    city: "Miasto",
    no_phone: "Nie podano",
    no_city: "Nie podano",
    no_name: "Użytkownik",
    stats_title: "Statystyki",
    rating: "Ocena",
    reviews: "Opinie",
    account_title: "Dane konta",
  },
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
        {value}
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-medium text-slate-900 md:text-base">
        {value}
      </div>
    </div>
  )
}

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city")
    .eq("id", user.id)
    .single()

  const profile = profileRaw as Profile | null

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("rating")
    .eq("review_target_id", user.id)

  const ratings = (reviewsRaw ?? []) as Array<{ rating: number }>
  const reviewsCount = ratings.length
  const averageRating =
    reviewsCount > 0
      ? (ratings.reduce((sum, item) => sum + item.rating, 0) / reviewsCount).toFixed(1)
      : "0.0"

  const displayName = profile?.full_name?.trim() || user.email || t.no_name

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white md:h-20 md:w-20 md:text-2xl">
              {getInitials(displayName)}
            </div>

            <div className="min-w-0">
              <div className="text-sm font-medium text-slate-500">{t.title}</div>

              <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {displayName}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                {t.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
            {t.stats_title}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StatCard label={t.rating} value={averageRating} />
            <StatCard label={t.reviews} value={String(reviewsCount)} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-8 md:p-6">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
          {t.account_title}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <InfoCard label={t.full_name} value={profile?.full_name?.trim() || t.no_name} />
          <InfoCard label={t.email} value={user.email || "—"} />
          <InfoCard label={t.phone} value={profile?.phone?.trim() || t.no_phone} />
          <InfoCard label={t.city} value={profile?.city?.trim() || t.no_city} />
        </div>
      </section>
    </div>
  )
}