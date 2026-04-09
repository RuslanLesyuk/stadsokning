import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import LanguageSwitcher from "@/components/language-switcher"
import MobileHeaderMenu from "@/components/mobile-header-menu"

type HeaderCopy = {
  jobs: string
  dashboard: string
  createJob: string
  login: string
  signup: string
  logout: string
  profile: string
  openMenu: string
  closeMenu: string
  noCompany: string
}

const copy: Record<Locale, HeaderCopy> = {
  uk: {
    jobs: "Роботи",
    dashboard: "Кабінет",
    createJob: "Створити роботу",
    login: "Увійти",
    signup: "Реєстрація",
    logout: "Вийти",
    profile: "Профіль",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
    noCompany: "Без компанії",
  },
  ru: {
    jobs: "Работы",
    dashboard: "Кабинет",
    createJob: "Создать работу",
    login: "Войти",
    signup: "Регистрация",
    logout: "Выйти",
    profile: "Профиль",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    noCompany: "Без компании",
  },
  en: {
    jobs: "Jobs",
    dashboard: "Dashboard",
    createJob: "Post job",
    login: "Login",
    signup: "Sign up",
    logout: "Logout",
    profile: "Profile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    noCompany: "No company",
  },
  sv: {
    jobs: "Jobb",
    dashboard: "Dashboard",
    createJob: "Skapa jobb",
    login: "Logga in",
    signup: "Registrera dig",
    logout: "Logga ut",
    profile: "Profil",
    openMenu: "Öppna meny",
    closeMenu: "Stäng meny",
    noCompany: "Inget företag",
  },
  pl: {
    jobs: "Prace",
    dashboard: "Panel",
    createJob: "Dodaj zlecenie",
    login: "Zaloguj się",
    signup: "Rejestracja",
    logout: "Wyloguj",
    profile: "Profil",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    noCompany: "Bez firmy",
  },
}

type ProfileRow = {
  full_name: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function navLinkClass() {
  return "inline-flex min-h-11 items-center rounded-xl px-2 py-2 text-sm font-medium text-slate-700 transition hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
}

function actionLinkClass(variant: "primary" | "secondary" = "secondary") {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:bg-rose-50 active:bg-rose-100",
  }

  return `${base} ${variants[variant]}`
}

export default async function SiteHeader() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName: string | null = null
  let companyName: string | null = null
  let avatarUrl: string | null = null
  let companyLogoUrl: string | null = null
  let unreadCount = 0

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, company_logo_url, company_name")
      .eq("id", user.id)
      .single()

    const profileRow = profile as ProfileRow | null

    fullName = profileRow?.full_name?.trim() || user.email || null
    companyName = profileRow?.company_name?.trim() || null
    avatarUrl = profileRow?.avatar_url || null
    companyLogoUrl = profileRow?.company_logo_url || null

    const { data: jobs } = await supabase
      .from("jobs")
      .select("id")
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)

    const jobIds = (jobs ?? []).map((job) => job.id)

    if (jobIds.length > 0) {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("job_id", jobIds)
        .neq("sender_id", user.id)
        .is("read_at", null)

      unreadCount = count ?? 0
    }
  }

  const profileLabel = fullName || "User"
  const profileInitials = getInitials(profileLabel)
  const companyLabel = companyName || t.noCompany

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/"
              prefetch={false}
              className="shrink-0 rounded-xl text-2xl font-bold leading-none tracking-tight text-slate-950 transition hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
            >
              Clean Jobs
            </Link>

            <nav className="hidden items-center gap-2 md:flex">
              <Link href="/jobs" prefetch={false} className={navLinkClass()}>
                {t.jobs}
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className={`${navLinkClass()} relative gap-2`}
                >
                  <span>{t.dashboard}</span>
                  {unreadCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {user ? (
                <Link
                  href="/jobs/create"
                  prefetch={false}
                  className={navLinkClass()}
                >
                  {t.createJob}
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher locale={locale} />

            {user ? (
              <>
                <Link
                  href="/profile"
                  prefetch={false}
                  className={`${actionLinkClass("secondary")} gap-3 pr-5`}
                >
                  <div className="relative shrink-0">
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-rose-600 text-xs font-semibold text-white">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={profileLabel}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        profileInitials
                      )}
                    </span>

                    {companyLogoUrl ? (
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
                        <img
                          src={companyLogoUrl}
                          alt={companyLabel}
                          className="h-full w-full object-cover"
                        />
                      </span>
                    ) : null}
                  </div>

                  <span className="min-w-0 text-left">
                    <span className="block max-w-40 truncate text-sm font-medium text-slate-900">
                      {profileLabel}
                    </span>
                    <span className="block max-w-40 truncate text-xs text-slate-500">
                      {companyLabel}
                    </span>
                  </span>
                </Link>

                <Link
                  href="/auth/signout"
                  prefetch={false}
                  className={actionLinkClass("secondary")}
                >
                  {t.logout}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  prefetch={false}
                  className={actionLinkClass("secondary")}
                >
                  {t.login}
                </Link>

                <Link
                  href="/signup"
                  prefetch={false}
                  className={actionLinkClass("primary")}
                >
                  {t.signup}
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher locale={locale} />

            <MobileHeaderMenu
              jobsLabel={t.jobs}
              dashboardLabel={t.dashboard}
              createJobLabel={t.createJob}
              loginLabel={t.login}
              signupLabel={t.signup}
              logoutLabel={t.logout}
              profileLabel={t.profile}
              openMenuLabel={t.openMenu}
              closeMenuLabel={t.closeMenu}
              profileName={profileLabel}
              profileInitials={profileInitials}
              unreadCount={unreadCount}
              isAuthenticated={Boolean(user)}
            />
          </div>
        </div>
      </div>
    </header>
  )
}