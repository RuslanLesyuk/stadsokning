import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { updateProfile } from "@/app/profile/actions"
import BankIdVerifyButton from "@/components/bankid-verify-button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Profile | Clean Jobs",
  description: "Manage your Clean Jobs profile.",
}

type Copy = {
  title: string
  subtitle: string
  profile_information: string
  full_name: string
  email: string
  phone: string
  city: string
  company_name: string
  avatar: string
  company_logo: string
  save_changes: string
  premium_title: string
  premium_active: string
  premium_free: string
  premium_description: string
  upgrade_now: string
  subscription_until: string
  verified_title: string
  verified_yes: string
  verified_no: string
  back_to_jobs: string
  bankid_success: string
  bankid_failed: string
  logo: string
  verified_on: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    title: "Профіль",
    subtitle: "Керуйте вашим профілем та Premium статусом.",
    profile_information: "Інформація профілю",
    full_name: "Ім’я",
    email: "Email",
    phone: "Телефон",
    city: "Місто",
    company_name: "Назва компанії",
    avatar: "Аватар",
    company_logo: "Логотип компанії",
    save_changes: "Зберегти зміни",
    premium_title: "Premium статус",
    premium_active: "Premium активний",
    premium_free: "Безкоштовний акаунт",
    premium_description:
      "Premium профілі отримують вищу видимість та пріоритет у списках.",
    upgrade_now: "Перейти на Premium",
    subscription_until: "Підписка активна до",
    verified_title: "Верифікація",
    verified_yes: "Профіль підтверджено",
    verified_no: "Профіль не підтверджено",
    back_to_jobs: "← Назад до робіт",
    bankid_success: "✓ BankID успішно підтверджено.",
    bankid_failed: "Помилка перевірки BankID",
    logo: "Логотип",
    verified_on: "Підтверджено",
  },
  ru: {
    title: "Профиль",
    subtitle: "Управляйте профилем и Premium статусом.",
    profile_information: "Информация профиля",
    full_name: "Имя",
    email: "Email",
    phone: "Телефон",
    city: "Город",
    company_name: "Название компании",
    avatar: "Аватар",
    company_logo: "Логотип компании",
    save_changes: "Сохранить изменения",
    premium_title: "Premium статус",
    premium_active: "Premium активен",
    premium_free: "Бесплатный аккаунт",
    premium_description:
      "Premium профили получают лучшую видимость и приоритет.",
    upgrade_now: "Перейти на Premium",
    subscription_until: "Подписка активна до",
    verified_title: "Верификация",
    verified_yes: "Профиль подтвержден",
    verified_no: "Профиль не подтвержден",
    back_to_jobs: "← Назад к работам",
    bankid_success: "✓ BankID успешно подтвержден.",
    bankid_failed: "Ошибка проверки BankID",
    logo: "Логотип",
    verified_on: "Подтверждено",
  },
  en: {
    title: "Profile",
    subtitle: "Manage your profile and Premium status.",
    profile_information: "Profile information",
    full_name: "Full name",
    email: "Email",
    phone: "Phone",
    city: "City",
    company_name: "Company name",
    avatar: "Avatar",
    company_logo: "Company logo",
    save_changes: "Save changes",
    premium_title: "Premium status",
    premium_active: "Premium active",
    premium_free: "Free account",
    premium_description:
      "Premium profiles receive better visibility and priority ranking.",
    upgrade_now: "Upgrade to Premium",
    subscription_until: "Subscription active until",
    verified_title: "Verification",
    verified_yes: "Verified profile",
    verified_no: "Not verified",
    back_to_jobs: "← Back to jobs",
    bankid_success: "✓ BankID verification completed successfully.",
    bankid_failed: "BankID verification failed",
    logo: "Logo",
    verified_on: "Verified on",
  },
  sv: {
    title: "Profil",
    subtitle: "Hantera din profil och Premium-status.",
    profile_information: "Profilinformation",
    full_name: "Namn",
    email: "E-post",
    phone: "Telefon",
    city: "Stad",
    company_name: "Företagsnamn",
    avatar: "Avatar",
    company_logo: "Företagslogotyp",
    save_changes: "Spara ändringar",
    premium_title: "Premium-status",
    premium_active: "Premium aktiv",
    premium_free: "Gratis konto",
    premium_description:
      "Premium-profiler får bättre synlighet och högre prioritet.",
    upgrade_now: "Uppgradera till Premium",
    subscription_until: "Prenumerationen aktiv till",
    verified_title: "Verifiering",
    verified_yes: "Verifierad profil",
    verified_no: "Inte verifierad",
    back_to_jobs: "← Tillbaka till jobb",
    bankid_success: "✓ BankID-verifiering slutförd.",
    bankid_failed: "BankID-verifiering misslyckades",
    logo: "Logotyp",
    verified_on: "Verifierad den",
  },
  pl: {
    title: "Profil",
    subtitle: "Zarządzaj profilem i statusem Premium.",
    profile_information: "Informacje o profilu",
    full_name: "Imię",
    email: "Email",
    phone: "Telefon",
    city: "Miasto",
    company_name: "Nazwa firmy",
    avatar: "Avatar",
    company_logo: "Logo firmy",
    save_changes: "Zapisz zmiany",
    premium_title: "Status Premium",
    premium_active: "Premium aktywny",
    premium_free: "Darmowe konto",
    premium_description:
      "Profile Premium mają większą widoczność i priorytet.",
    upgrade_now: "Przejdź na Premium",
    subscription_until: "Subskrypcja aktywna do",
    verified_title: "Weryfikacja",
    verified_yes: "Zweryfikowany profil",
    verified_no: "Profil niezweryfikowany",
    back_to_jobs: "← Powrót do ofert",
    bankid_success: "✓ BankID został pomyślnie zweryfikowany.",
    bankid_failed: "Weryfikacja BankID nie powiodła się",
    logo: "Logo",
    verified_on: "Zweryfikowano",
  },
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{
    bankid_verified?: string
    bankid_error?: string
  }>
}) {
  
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en
  const params = await searchParams

const bankidVerified = params.bankid_verified === "1"
const bankidError = params.bankid_error

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

    

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {t.subtitle}
            </p>
          </div>

          <Link
            href="/jobs"
            prefetch={false}
            className="hidden rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:inline-flex"
          >
            {t.back_to_jobs}
          </Link>
        </div>
{bankidVerified ? (
  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
    {t.bankid_success}
  </div>
) : null}

{bankidError ? (
  <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
    {t.bankid_failed}: {decodeURIComponent(bankidError)}
  </div>
) : null}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {t.profile_information}
            </div>

            <form action={updateProfile} className="mt-6 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    {t.avatar}
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-xl font-semibold text-rose-700">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        "U"
                      )}
                    </div>

                    <input
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-rose-700 hover:file:bg-rose-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-700">
                    {t.company_logo}
                  </label>

                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-xl font-semibold text-slate-500">
                      {profile?.company_logo_url ? (
                        <img
                          src={profile.company_logo_url}
                          alt={t.company_logo}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        t.logo
                      )}
                    </div>

                    <input
                      name="company_logo"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">
                  {t.full_name}
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  defaultValue={profile?.full_name || ""}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                />
              </div>

              <div>
                <label htmlFor="company_name" className="mb-2 block text-sm font-medium text-slate-700">
                  {t.company_name}
                </label>
                <input
                  id="company_name"
                  name="company_name"
                  type="text"
                  defaultValue={profile?.company_name || ""}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                  {t.email}
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                  {t.phone}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  defaultValue={profile?.phone || ""}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-700">
                  {t.city}
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  defaultValue={profile?.city || ""}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.98]"
              >
                {t.save_changes}
              </button>
            </form>
          </section>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                {t.premium_title}
              </div>

              <div className="mt-3 text-2xl font-semibold text-slate-950">
                {profile?.is_premium ? t.premium_active : t.premium_free}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.premium_description}
              </p>

              {profile?.subscription_ends_at ? (
                <p className="mt-4 text-sm text-slate-500">
                  {t.subscription_until}:{" "}
                  {new Date(profile.subscription_ends_at).toLocaleDateString()}
                </p>
              ) : null}

              {!profile?.is_premium ? (
                <form action="/api/stripe/checkout" method="POST" className="mt-6">
                  <input type="hidden" name="type" value="premium" />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 active:scale-[0.98]"
                  >
                    {t.upgrade_now}
                  </button>
                </form>
              ) : null}
            </section>

            <section className="rounded-[28px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
    {t.verified_title}
  </div>

  <div className="mt-3 text-2xl font-semibold text-slate-950">
    {profile?.bankid_verified
      ? "✓ Verified with BankID"
      : t.verified_no}
  </div>

  {profile?.bankid_verified_at ? (
    <p className="mt-3 text-sm text-slate-500">
      {t.verified_on}
      {new Date(profile.bankid_verified_at).toLocaleDateString()}
    </p>
  ) : null}

  <div className="mt-5">
    <BankIdVerifyButton
      verified={Boolean(profile?.bankid_verified)}
    />
  </div>
</section>
          </div>
        </div>
      </div>
    </div>
  )
}