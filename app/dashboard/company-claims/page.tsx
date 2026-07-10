import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type ClaimStatus = "pending" | "approved" | "rejected"

type CompanyClaim = {
  id: string
  company_id: string
  business_email: string | null
  business_phone: string | null
  message: string | null
  status: ClaimStatus
  admin_note: string | null
  created_at: string
  reviewed_at: string | null
  companies:
    | {
        id: string
        name: string
        slug: string
        city: string | null
        logo_url: string | null
        verified: boolean
        owner_id: string | null
      }
    | {
        id: string
        name: string
        slug: string
        city: string | null
        logo_url: string | null
        verified: boolean
        owner_id: string | null
      }[]
    | null
}

type Dictionary = {
  metadataTitle: string
  metadataDescription: string
  eyebrow: string
  title: string
  description: string
  total: string
  pending: string
  approved: string
  rejected: string
  submitted: string
  reviewed: string
  email: string
  phone: string
  message: string
  adminNote: string
  viewCompany: string
  manageCompany: string
  emptyTitle: string
  emptyDescription: string
  browseCompanies: string
  loadErrorTitle: string
  loadErrorDescription: string
  statusLabels: Record<ClaimStatus, string>
}

const supportedLocales: Locale[] = ["sv", "en", "uk", "ru", "pl"]

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    metadataTitle: "Mina företagsanspråk | Clean Jobs",
    metadataDescription:
      "Se status för dina förfrågningar om att hantera företag på Clean Jobs.",
    eyebrow: "Företagsverifiering",
    title: "Mina företagsanspråk",
    description:
      "Följ statusen för dina förfrågningar om att representera och hantera företag.",
    total: "Totalt",
    pending: "Väntar",
    approved: "Godkända",
    rejected: "Avslagna",
    submitted: "Skickad",
    reviewed: "Granskad",
    email: "Företagets e-post",
    phone: "Företagets telefon",
    message: "Ditt meddelande",
    adminNote: "Kommentar från granskningen",
    viewCompany: "Visa företaget",
    manageCompany: "Hantera företaget",
    emptyTitle: "Du har inga företagsanspråk",
    emptyDescription:
      "När du skickar en begäran om att hantera ett företag visas den här.",
    browseCompanies: "Bläddra bland företag",
    loadErrorTitle: "Anspråken kunde inte hämtas",
    loadErrorDescription:
      "Ett tekniskt fel uppstod när dina företagsanspråk skulle laddas.",
    statusLabels: {
      pending: "Väntar på granskning",
      approved: "Godkänd",
      rejected: "Avslagen",
    },
  },

  en: {
    metadataTitle: "My company claims | Clean Jobs",
    metadataDescription:
      "View the status of your requests to manage companies on Clean Jobs.",
    eyebrow: "Company verification",
    title: "My company claims",
    description:
      "Track your requests to represent and manage company profiles.",
    total: "Total",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    submitted: "Submitted",
    reviewed: "Reviewed",
    email: "Business email",
    phone: "Business phone",
    message: "Your message",
    adminNote: "Review note",
    viewCompany: "View company",
    manageCompany: "Manage company",
    emptyTitle: "You have no company claims",
    emptyDescription:
      "Requests to manage company profiles will appear here after submission.",
    browseCompanies: "Browse companies",
    loadErrorTitle: "Claims could not be loaded",
    loadErrorDescription:
      "A technical error occurred while loading your company claims.",
    statusLabels: {
      pending: "Pending review",
      approved: "Approved",
      rejected: "Rejected",
    },
  },

  uk: {
    metadataTitle: "Мої заявки на компанії | Clean Jobs",
    metadataDescription:
      "Переглядайте статус заявок на керування компаніями у Clean Jobs.",
    eyebrow: "Перевірка компаній",
    title: "Мої заявки на компанії",
    description:
      "Відстежуйте заявки на підтвердження права представляти й керувати компаніями.",
    total: "Усього",
    pending: "На перевірці",
    approved: "Схвалені",
    rejected: "Відхилені",
    submitted: "Надіслано",
    reviewed: "Перевірено",
    email: "Робоча електронна адреса",
    phone: "Робочий телефон",
    message: "Ваше повідомлення",
    adminNote: "Коментар перевірки",
    viewCompany: "Переглянути компанію",
    manageCompany: "Керувати компанією",
    emptyTitle: "У вас ще немає заявок",
    emptyDescription:
      "Після подання заявки на компанію вона з’явиться на цій сторінці.",
    browseCompanies: "Переглянути компанії",
    loadErrorTitle: "Не вдалося завантажити заявки",
    loadErrorDescription:
      "Під час завантаження заявок сталася технічна помилка.",
    statusLabels: {
      pending: "Очікує перевірки",
      approved: "Схвалено",
      rejected: "Відхилено",
    },
  },

  ru: {
    metadataTitle: "Мои заявки на компании | Clean Jobs",
    metadataDescription:
      "Просматривайте статус заявок на управление компаниями в Clean Jobs.",
    eyebrow: "Проверка компаний",
    title: "Мои заявки на компании",
    description:
      "Отслеживайте заявки на подтверждение права представлять компании.",
    total: "Всего",
    pending: "На проверке",
    approved: "Одобрены",
    rejected: "Отклонены",
    submitted: "Отправлено",
    reviewed: "Проверено",
    email: "Рабочая электронная почта",
    phone: "Рабочий телефон",
    message: "Ваше сообщение",
    adminNote: "Комментарий проверки",
    viewCompany: "Посмотреть компанию",
    manageCompany: "Управлять компанией",
    emptyTitle: "У вас пока нет заявок",
    emptyDescription:
      "После подачи заявки на компанию она появится на этой странице.",
    browseCompanies: "Посмотреть компании",
    loadErrorTitle: "Не удалось загрузить заявки",
    loadErrorDescription:
      "При загрузке заявок произошла техническая ошибка.",
    statusLabels: {
      pending: "Ожидает проверки",
      approved: "Одобрено",
      rejected: "Отклонено",
    },
  },

  pl: {
    metadataTitle: "Moje zgłoszenia firm | Clean Jobs",
    metadataDescription:
      "Sprawdź status zgłoszeń dotyczących zarządzania firmami w Clean Jobs.",
    eyebrow: "Weryfikacja firm",
    title: "Moje zgłoszenia firm",
    description:
      "Śledź zgłoszenia dotyczące reprezentowania i zarządzania profilami firm.",
    total: "Łącznie",
    pending: "Oczekujące",
    approved: "Zatwierdzone",
    rejected: "Odrzucone",
    submitted: "Wysłano",
    reviewed: "Sprawdzono",
    email: "Firmowy adres e-mail",
    phone: "Firmowy telefon",
    message: "Twoja wiadomość",
    adminNote: "Komentarz z weryfikacji",
    viewCompany: "Zobacz firmę",
    manageCompany: "Zarządzaj firmą",
    emptyTitle: "Nie masz jeszcze żadnych zgłoszeń",
    emptyDescription:
      "Po wysłaniu zgłoszenia dotyczącego firmy pojawi się ono tutaj.",
    browseCompanies: "Przeglądaj firmy",
    loadErrorTitle: "Nie udało się załadować zgłoszeń",
    loadErrorDescription:
      "Podczas ładowania zgłoszeń wystąpił błąd techniczny.",
    statusLabels: {
      pending: "Oczekuje na sprawdzenie",
      approved: "Zatwierdzone",
      rejected: "Odrzucone",
    },
  },
}

function isSupportedLocale(
  value: string | undefined,
): value is Locale {
  return supportedLocales.includes(value as Locale)
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeValue =
    cookieStore.get("clean_jobs_locale")?.value

  return isSupportedLocale(localeValue) ? localeValue : "sv"
}

function getCompany(claim: CompanyClaim) {
  if (!claim.companies) {
    return null
  }

  return Array.isArray(claim.companies)
    ? claim.companies[0] ?? null
    : claim.companies
}

function formatDate(
  value: string,
  locale: Locale,
): string {
  const localeMap: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

function getStatusStyles(status: ClaimStatus): string {
  if (status === "approved") {
    return "border-emerald-200 bg-emerald-50 text-emerald-800"
  }

  if (status === "rejected") {
    return "border-red-200 bg-red-50 text-red-800"
  }

  return "border-amber-200 bg-amber-50 text-amber-800"
}

function getStatusIcon(status: ClaimStatus): string {
  if (status === "approved") {
    return "✓"
  }

  if (status === "rejected") {
    return "×"
  }

  return "…"
}

export const metadata: Metadata = {
  title: "Company claims | Clean Jobs",
  description: "Manage your Clean Jobs company claim requests.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function CompanyClaimsPage() {
  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company-claims")
  }

  const { data, error } = await supabase
    .from("company_claim_requests")
    .select(`
      id,
      company_id,
      business_email,
      business_phone,
      message,
      status,
      admin_note,
      created_at,
      reviewed_at,
      companies (
        id,
        name,
        slug,
        city,
        logo_url,
        verified,
        owner_id
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const claims = (data ?? []) as CompanyClaim[]

  const pendingCount = claims.filter(
    (claim) => claim.status === "pending",
  ).length

  const approvedCount = claims.filter(
    (claim) => claim.status === "approved",
  ).length

  const rejectedCount = claims.filter(
    (claim) => claim.status === "rejected",
  ).length

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            {dictionary.eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {dictionary.title}
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            {dictionary.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatisticCard
              value={claims.length}
              label={dictionary.total}
            />

            <StatisticCard
              value={pendingCount}
              label={dictionary.pending}
            />

            <StatisticCard
              value={approvedCount}
              label={dictionary.approved}
            />

            <StatisticCard
              value={rejectedCount}
              label={dictionary.rejected}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-2xl font-black text-red-700">
              !
            </div>

            <h2 className="mt-5 text-xl font-black text-red-950">
              {dictionary.loadErrorTitle}
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-800">
              {dictionary.loadErrorDescription}
            </p>
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
              🏢
            </div>

            <h2 className="mt-5 text-2xl font-black text-slate-950">
              {dictionary.emptyTitle}
            </h2>

            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">
              {dictionary.emptyDescription}
            </p>

            <Link
              href="/companies"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
            >
              {dictionary.browseCompanies}
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {claims.map((claim) => {
              const company = getCompany(claim)

              return (
                <article
                  key={claim.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {company?.logo_url ? (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img
                          src={company.logo_url}
                          alt={`${company.name} logo`}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-black text-white">
                        {company?.name.charAt(0).toUpperCase() ?? "C"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl font-black text-slate-950">
                            {company?.name ?? "Company"}
                          </h2>

                          {company?.city ? (
                            <p className="mt-1 text-sm font-medium text-slate-500">
                              {company.city}
                            </p>
                          ) : null}
                        </div>

                        <span
                          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                            claim.status,
                          )}`}
                        >
                          <span
                            aria-hidden="true"
                            className="flex h-4 w-4 items-center justify-center"
                          >
                            {getStatusIcon(claim.status)}
                          </span>

                          {dictionary.statusLabels[claim.status]}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                        <ClaimDetail
                          label={dictionary.submitted}
                          value={formatDate(claim.created_at, locale)}
                        />

                        {claim.reviewed_at ? (
                          <ClaimDetail
                            label={dictionary.reviewed}
                            value={formatDate(
                              claim.reviewed_at,
                              locale,
                            )}
                          />
                        ) : null}

                        {claim.business_email ? (
                          <ClaimDetail
                            label={dictionary.email}
                            value={claim.business_email}
                          />
                        ) : null}

                        {claim.business_phone ? (
                          <ClaimDetail
                            label={dictionary.phone}
                            value={claim.business_phone}
                          />
                        ) : null}
                      </div>

                      {claim.message ? (
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            {dictionary.message}
                          </p>

                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {claim.message}
                          </p>
                        </div>
                      ) : null}

                      {claim.admin_note ? (
                        <div
                          className={`mt-4 rounded-2xl border p-4 ${
                            claim.status === "rejected"
                              ? "border-red-200 bg-red-50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <p
                            className={`text-xs font-bold uppercase tracking-wide ${
                              claim.status === "rejected"
                                ? "text-red-700"
                                : "text-slate-500"
                            }`}
                          >
                            {dictionary.adminNote}
                          </p>

                          <p
                            className={`mt-2 whitespace-pre-wrap text-sm leading-6 ${
                              claim.status === "rejected"
                                ? "text-red-800"
                                : "text-slate-700"
                            }`}
                          >
                            {claim.admin_note}
                          </p>
                        </div>
                      ) : null}

                      {company ? (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={`/companies/${company.slug}`}
                            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            {dictionary.viewCompany}
                          </Link>

                          {claim.status === "approved" &&
                          company.owner_id === user.id ? (
                            <Link
                              href={`/dashboard/companies/${company.id}/edit`}
                              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600"
                            >
                              {dictionary.manageCompany}
                            </Link>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

function StatisticCard({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {label}
      </p>
    </div>
  )
}

function ClaimDetail({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  )
}