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
  },
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
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
  let unreadCount = 0

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    fullName = profile?.full_name?.trim() || user.email || null

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

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-20 items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/"
              className="shrink-0 text-2xl font-bold leading-none tracking-tight text-slate-950"
            >
              Clean Jobs
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/jobs"
                className="text-sm font-medium text-slate-700 transition hover:text-black"
              >
                {t.jobs}
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className="relative inline-flex items-center text-sm font-medium text-slate-700 transition hover:text-black"
                >
                  <span>{t.dashboard}</span>
                  {unreadCount > 0 ? (
                    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {user ? (
                <Link
                  href="/jobs/create"
                  prefetch={false}
                  className="text-sm font-medium text-slate-700 transition hover:text-black"
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
                  className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {profileInitials}
                  </span>
                  <span className="max-w-36 truncate">{profileLabel}</span>
                </Link>

                <Link
                  href="/auth/signout"
                  prefetch={false}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  {t.logout}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                >
                  {t.login}
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
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