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
  companyCustomers: string
  companyClaims: string
  companyWebsites: string
  myBookings: string
  companyBookings: string
  companyDashboard: string
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
    jobs: "Знайти роботу",
    services: "Послуги",
    companies: "Знайти компанію",
    myServices: "Мої послуги",
    companyLeads: "Заявки компанії",
    companyCustomers: "Клієнти компанії",
    companyClaims: "Мої заявки на компанії",
    companyWebsites: "Сайти компаній",
    myBookings: "Мої бронювання",
    companyBookings: "Бронювання компанії",
    companyDashboard: "Простір компанії",
    dashboard: "Мої справи",
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
    jobs: "Найти работу",
    services: "Услуги",
    companies: "Найти компанию",
    myServices: "Мои услуги",
    companyLeads: "Заявки компании",
    companyCustomers: "Клиенты компании",
    companyClaims: "Мои заявки на компании",
    companyWebsites: "Сайты компаний",
    myBookings: "Мои бронирования",
    companyBookings: "Бронирования компании",
    companyDashboard: "Пространство компании",
    dashboard: "Мои дела",
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
    jobs: "Find jobs",
    services: "Services",
    companies: "Find a cleaning company",
    myServices: "My services",
    companyLeads: "Company requests",
    companyCustomers: "Company customers",
    companyClaims: "My company claims",
    companyWebsites: "Company websites",
    myBookings: "My bookings",
    companyBookings: "Company bookings",
    companyDashboard: "Company workspace",
    dashboard: "My activity",
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
    jobs: "Hitta jobb",
    services: "Tjänster",
    companies: "Hitta städföretag",
    myServices: "Mina tjänster",
    companyLeads: "Offertförfrågningar",
    companyCustomers: "Företagskunder",
    companyClaims: "Mina företagsanspråk",
    companyWebsites: "Företagswebbplatser",
    myBookings: "Mina bokningar",
    companyBookings: "Företagsbokningar",
    companyDashboard: "Företagsyta",
    dashboard: "Mina ärenden",
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
    jobs: "Znajdź pracę",
    services: "Usługi",
    companies: "Znajdź firmę sprzątającą",
    myServices: "Moje usługi",
    companyLeads: "Zapytania firmowe",
    companyCustomers: "Klienci firmy",
    companyClaims: "Moje zgłoszenia firm",
    companyWebsites: "Strony firm",
    myBookings: "Moje rezerwacje",
    companyBookings: "Rezerwacje firmy",
    companyDashboard: "Strefa firmy",
    dashboard: "Moje sprawy",
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

type HeaderSnapshot = {
  full_name: string | null
  avatar_url: string | null
  profile_company_name: string | null
  profile_company_logo_url: string | null
  primary_company_name: string | null
  primary_company_logo_url: string | null
  has_owned_company: boolean
  unread_notifications_count: number
  active_claims_count: number
  new_company_leads_count: number
  pending_company_bookings_count: number
  unread_messages_count: number
}

function numberCount(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0
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
  let companyBookingsCount = 0
  let companyClaimsCount = 0
  let unreadMessagesCount = 0
  let unreadNotificationsCount = 0

  if (user) {
    const { data: snapshotRaw, error: snapshotError } = await supabase.rpc(
      "get_header_snapshot",
    )

    if (snapshotError) {
      console.error("Load header snapshot error:", snapshotError)
    }

    const raw =
      snapshotRaw && typeof snapshotRaw === "object"
        ? (snapshotRaw as Partial<HeaderSnapshot>)
        : {}

    fullName = raw.full_name?.trim() || user.email || null
    companyName =
      raw.primary_company_name?.trim() ||
      raw.profile_company_name?.trim() ||
      null
    avatarUrl = raw.avatar_url || null
    companyLogoUrl =
      raw.primary_company_logo_url || raw.profile_company_logo_url || null
    showCompanyLeads = Boolean(raw.has_owned_company)
    companyLeadsCount = numberCount(raw.new_company_leads_count)
    companyBookingsCount = numberCount(raw.pending_company_bookings_count)
    companyClaimsCount = numberCount(raw.active_claims_count)
    unreadMessagesCount = numberCount(raw.unread_messages_count)
    unreadNotificationsCount = numberCount(raw.unread_notifications_count)
  }

  const profileLabel = fullName || "User"
  const profileInitials = getInitials(profileLabel)
  const companyLabel = companyName || t.noCompany

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
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

              {user && showCompanyLeads ? (
                <Link href="/dashboard/company" prefetch={false} className={navLinkClass()}>
                  {t.companyDashboard}
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
                  companyCustomersLabel={t.companyCustomers}
                  companyClaimsLabel={t.companyClaims}
                  companyWebsitesLabel={t.companyWebsites}
                  myBookingsLabel={t.myBookings}
                  companyBookingsLabel={t.companyBookings}
                  companyDashboardLabel={t.companyDashboard}
                  logoutLabel={t.logout}
                  profileName={profileLabel}
                  companyLabel={companyLabel}
                  profileInitials={profileInitials}
                  avatarUrl={avatarUrl}
                  companyLogoUrl={companyLogoUrl}
                  showCompanyLeads={showCompanyLeads}
                  companyLeadsCount={companyLeadsCount}
                  companyClaimsCount={companyClaimsCount}
                  companyBookingsCount={companyBookingsCount}
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
              companiesLabel={t.companies}
              dashboardLabel={t.dashboard}
              myBookingsLabel={t.myBookings}
              companyDashboardLabel={t.companyDashboard}
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
              companyAttentionCount={
                companyLeadsCount + companyClaimsCount + companyBookingsCount
              }
            />
          </div>
        </div>
      </div>
    </header>
  )
}
