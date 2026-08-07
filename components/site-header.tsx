import Link from "next/link"
import { cookies } from "next/headers"

import LanguageSwitcher from "@/components/language-switcher"
import MobileHeaderMenu from "@/components/mobile-header-menu"
import ProfileDropdown from "@/components/profile-dropdown"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

type HeaderCopy = {
  jobs: string
  services: string
  companies: string
  myServices: string
  companyLeads: string
  dashboard: string
  createJob: string
  login: string
  signup: string
  logout: string
  profile: string
  openMenu: string
  closeMenu: string
  noCompany: string
  notifications: string
}

const copy: Record<Locale, HeaderCopy> = {
  uk: {
    jobs: "Роботи",
    services: "Послуги",
    companies: "Компанії",
    myServices: "Мої послуги",
    companyLeads: "Заявки компанії",
    dashboard: "Кабінет",
    createJob: "Створити роботу",
    login: "Увійти",
    signup: "Реєстрація",
    logout: "Вийти",
    profile: "Профіль",
    openMenu: "Відкрити меню",
    closeMenu: "Закрити меню",
    noCompany: "Без компанії",
    notifications: "Повідомлення",
  },
  ru: {
    jobs: "Работы",
    services: "Услуги",
    companies: "Компании",
    myServices: "Мои услуги",
    companyLeads: "Заявки компании",
    dashboard: "Кабинет",
    createJob: "Создать работу",
    login: "Войти",
    signup: "Регистрация",
    logout: "Выйти",
    profile: "Профиль",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    noCompany: "Без компании",
    notifications: "Уведомления",
  },
  en: {
    jobs: "Jobs",
    services: "Services",
    companies: "Companies",
    myServices: "My services",
    companyLeads: "Company requests",
    dashboard: "Dashboard",
    createJob: "Post job",
    login: "Login",
    signup: "Sign up",
    logout: "Logout",
    profile: "Profile",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    noCompany: "No company",
    notifications: "Notifications",
  },
  sv: {
    jobs: "Jobb",
    services: "Tjänster",
    companies: "Företag",
    myServices: "Mina tjänster",
    companyLeads: "Offertförfrågningar",
    dashboard: "Dashboard",
    createJob: "Skapa jobb",
    login: "Logga in",
    signup: "Registrera dig",
    logout: "Logga ut",
    profile: "Profil",
    openMenu: "Öppna meny",
    closeMenu: "Stäng meny",
    noCompany: "Inget företag",
    notifications: "Aviseringar",
  },
  pl: {
    jobs: "Prace",
    services: "Usługi",
    companies: "Firmy",
    myServices: "Moje usługi",
    companyLeads: "Zapytania firmowe",
    dashboard: "Panel",
    createJob: "Dodaj zlecenie",
    login: "Zaloguj się",
    signup: "Rejestracja",
    logout: "Wyloguj",
    profile: "Profil",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    noCompany: "Bez firmy",
    notifications: "Powiadomienia",
  },
}

type ProfileRow = {
  full_name: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
}

type OwnedCompanyRow = {
  id: string
  name: string
  logo_url: string | null
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)

  const initials = parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "U"
}

function navLinkClass() {
  return "inline-flex min-h-11 items-center rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
}

function actionLinkClass(
  variant: "primary" | "secondary" = "secondary",
) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"

  const variants = {
    primary:
      "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800",
    secondary:
      "border border-slate-200/80 bg-white text-slate-800 shadow-sm hover:border-rose-200 hover:bg-rose-50 active:bg-rose-100",
  }

  return `${base} ${variants[variant]}`
}

function NotificationBell({
  label,
  unreadCount,
}: {
  label: string
  unreadCount: number
}) {
  return (
    <Link
      href="/notifications"
      prefetch={false}
      aria-label={label}
      title={label}
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-700 shadow-sm transition duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="h-5 w-5"
      >
        <path
          d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M10 21h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>

      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Link>
  )
}

export default async function SiteHeader() {
  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale

  const t = copy[locale] || copy.en
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let fullName: string | null = null
  let companyName: string | null = null
  let avatarUrl: string | null = null
  let companyLogoUrl: string | null = null
  let showCompanyLeads = false
  let companyLeadsCount = 0
  let unreadMessagesCount = 0
  let unreadNotificationsCount = 0

  if (user) {
    const [
      { data: profile, error: profileError },
      {
        count: notificationsCount,
        error: notificationsError,
      },
      { data: jobs, error: jobsError },
      { data: ownedCompaniesData, error: ownedCompaniesError },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, avatar_url, company_logo_url, company_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("notifications")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false),
      supabase
        .from("jobs")
        .select("id")
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`),
      supabase
        .from("companies")
        .select("id, name, logo_url")
        .eq("owner_id", user.id)
        .order("name", { ascending: true })
        .limit(20),
    ])

    if (profileError) {
      console.error("Load header profile error:", profileError)
    }

    if (notificationsError) {
      console.error("Load unread notifications error:", notificationsError)
    }

    if (jobsError) {
      console.error("Load header jobs error:", jobsError)
    }

    if (ownedCompaniesError) {
      console.error("Load header owned companies error:", ownedCompaniesError)
    }

    const profileRow = profile as ProfileRow | null
    const ownedCompanies = (ownedCompaniesData ?? []) as OwnedCompanyRow[]
    const primaryOwnedCompany = ownedCompanies[0] ?? null

    fullName = profileRow?.full_name?.trim() || user.email || null
    companyName =
      primaryOwnedCompany?.name?.trim() ||
      profileRow?.company_name?.trim() ||
      null
    avatarUrl = profileRow?.avatar_url || null
    companyLogoUrl =
      primaryOwnedCompany?.logo_url || profileRow?.company_logo_url || null
    unreadNotificationsCount = notificationsCount ?? 0
    showCompanyLeads = ownedCompanies.length > 0

    const companyIds = ownedCompanies.map((company) => company.id)

    if (companyIds.length > 0) {
      const { count, error: companyLeadsError } = await supabase
        .from("company_quote_requests")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("company_id", companyIds)
        .eq("status", "new")

      if (companyLeadsError) {
        console.error("Load new company leads error:", companyLeadsError)
      }

      companyLeadsCount = count ?? 0
    }

    const jobIds = (jobs ?? []).map((job) => job.id)

    if (jobIds.length > 0) {
      const { count, error: messagesError } = await supabase
        .from("messages")
        .select("id", {
          count: "exact",
          head: true,
        })
        .in("job_id", jobIds)
        .neq("sender_id", user.id)
        .is("read_at", null)

      if (messagesError) {
        console.error("Load unread messages error:", messagesError)
      }

      unreadMessagesCount = count ?? 0
    }
  }

  const profileLabel = fullName || "User"
  const profileInitials = getInitials(profileLabel)
  const companyLabel = companyName || t.noCompany

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex min-h-[76px] items-center justify-between gap-3 py-3">
          <div className="flex min-w-0 items-center gap-4 md:gap-6">
            <Link
              href="/"
              prefetch={false}
              className="shrink-0 rounded-xl text-[26px] font-semibold leading-none tracking-[-0.03em] transition duration-200 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
            >
              <span className="text-rose-600">Clean</span>{" "}
              <span className="text-slate-950">Jobs</span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              <Link href="/jobs" prefetch={false} className={navLinkClass()}>
                {t.jobs}
              </Link>

              <Link href="/services" prefetch={false} className={navLinkClass()}>
                {t.services}
              </Link>

              <Link href="/companies" prefetch={false} className={navLinkClass()}>
                {t.companies}
              </Link>

              {user ? (
                <Link
                  href="/dashboard"
                  prefetch={false}
                  className={`${navLinkClass()} relative gap-2`}
                >
                  <span>{t.dashboard}</span>

                  {unreadMessagesCount > 0 ? (
                    <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
                      {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              {user ? (
                <Link href="/jobs/create" prefetch={false} className={navLinkClass()}>
                  {t.createJob}
                </Link>
              ) : null}

              {user ? (
                <Link
                  href="/dashboard/services"
                  prefetch={false}
                  className={navLinkClass()}
                >
                  {t.myServices}
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <LanguageSwitcher locale={locale} />

            {user ? (
              <>
                <NotificationBell
                  label={t.notifications}
                  unreadCount={unreadNotificationsCount}
                />

                <ProfileDropdown
                  profileLabel={t.profile}
                  dashboardLabel={t.dashboard}
                  myServicesLabel={t.myServices}
                  companyLeadsLabel={t.companyLeads}
                  logoutLabel={t.logout}
                  profileName={profileLabel}
                  companyLabel={companyLabel}
                  profileInitials={profileInitials}
                  avatarUrl={avatarUrl}
                  companyLogoUrl={companyLogoUrl}
                  showCompanyLeads={showCompanyLeads}
                  companyLeadsCount={companyLeadsCount}
                />
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

            {user ? (
              <NotificationBell
                label={t.notifications}
                unreadCount={unreadNotificationsCount}
              />
            ) : null}

            <MobileHeaderMenu
              jobsLabel={t.jobs}
              servicesLabel={t.services}
              companiesLabel={t.companies}
              myServicesLabel={t.myServices}
              companyLeadsLabel={t.companyLeads}
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
              unreadCount={unreadMessagesCount}
              isAuthenticated={Boolean(user)}
              avatarUrl={avatarUrl}
              companyLogoUrl={companyLogoUrl}
              companyName={companyName}
              showCompanyLeads={showCompanyLeads}
              companyLeadsCount={companyLeadsCount}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
