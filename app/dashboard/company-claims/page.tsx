import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase-server"
import { cancelCompanyClaimAction } from "@/app/companies/[slug]/claim/actions"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type ClaimStatus = "pending" | "needs_info" | "approved" | "rejected" | "cancelled"

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
  requested_info_at: string | null
  cancelled_at: string | null
  evidence_paths: string[] | null
  email_domain_match: boolean | null
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

type EvidenceLink = { path: string; url: string; name: string }

type Dictionary = {
  eyebrow: string
  title: string
  description: string
  total: string
  pending: string
  needsInfo: string
  approved: string
  rejected: string
  cancelled: string
  submitted: string
  reviewed: string
  email: string
  phone: string
  message: string
  adminNote: string
  evidence: string
  domainMatch: string
  domainMismatch: string
  viewCompany: string
  manageCompany: string
  provideInfo: string
  cancelClaim: string
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
    eyebrow: "Företagsverifiering",
    title: "Mina företagsanspråk",
    description: "Följ status, komplettera uppgifter och hantera dina verifieringsförfrågningar.",
    total: "Totalt",
    pending: "Väntar",
    needsInfo: "Behöver info",
    approved: "Godkända",
    rejected: "Avslagna",
    cancelled: "Återkallade",
    submitted: "Skickad",
    reviewed: "Granskad",
    email: "Företagets e-post",
    phone: "Företagets telefon",
    message: "Ditt meddelande",
    adminNote: "Kommentar från granskningen",
    evidence: "Verifieringsunderlag",
    domainMatch: "E-postdomänen matchar företaget",
    domainMismatch: "E-postdomänen kunde inte matchas automatiskt",
    viewCompany: "Visa företaget",
    manageCompany: "Hantera företaget",
    provideInfo: "Komplettera uppgifter",
    cancelClaim: "Återkalla",
    emptyTitle: "Du har inga företagsanspråk",
    emptyDescription: "När du skickar en begäran om att hantera ett företag visas den här.",
    browseCompanies: "Bläddra bland företag",
    loadErrorTitle: "Anspråken kunde inte hämtas",
    loadErrorDescription: "Ett tekniskt fel uppstod när dina företagsanspråk skulle laddas.",
    statusLabels: {
      pending: "Väntar på granskning",
      needs_info: "Behöver kompletteras",
      approved: "Godkänd",
      rejected: "Avslagen",
      cancelled: "Återkallad",
    },
  },
  en: {
    eyebrow: "Company verification",
    title: "My company claims",
    description: "Track status, provide additional information and manage your company verification requests.",
    total: "Total",
    pending: "Pending",
    needsInfo: "Needs info",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
    submitted: "Submitted",
    reviewed: "Reviewed",
    email: "Business email",
    phone: "Business phone",
    message: "Your message",
    adminNote: "Review note",
    evidence: "Verification evidence",
    domainMatch: "Email domain matches the company",
    domainMismatch: "Email domain could not be matched automatically",
    viewCompany: "View company",
    manageCompany: "Manage company",
    provideInfo: "Provide more information",
    cancelClaim: "Cancel claim",
    emptyTitle: "You have no company claims",
    emptyDescription: "Requests to manage company profiles will appear here after submission.",
    browseCompanies: "Browse companies",
    loadErrorTitle: "Claims could not be loaded",
    loadErrorDescription: "A technical error occurred while loading your company claims.",
    statusLabels: {
      pending: "Pending review",
      needs_info: "Needs more information",
      approved: "Approved",
      rejected: "Rejected",
      cancelled: "Cancelled",
    },
  },
  uk: {
    eyebrow: "Перевірка компаній",
    title: "Мої заявки на компанії",
    description: "Відстежуйте статус, доповнюйте дані та керуйте заявками на підтвердження компаній.",
    total: "Усього",
    pending: "На перевірці",
    needsInfo: "Потрібні дані",
    approved: "Схвалені",
    rejected: "Відхилені",
    cancelled: "Відкликані",
    submitted: "Надіслано",
    reviewed: "Перевірено",
    email: "Робоча електронна адреса",
    phone: "Робочий телефон",
    message: "Ваше повідомлення",
    adminNote: "Коментар перевірки",
    evidence: "Документи підтвердження",
    domainMatch: "Домен email збігається з компанією",
    domainMismatch: "Домен email не вдалося автоматично підтвердити",
    viewCompany: "Переглянути компанію",
    manageCompany: "Керувати компанією",
    provideInfo: "Доповнити інформацію",
    cancelClaim: "Відкликати",
    emptyTitle: "У вас ще немає заявок",
    emptyDescription: "Після подання заявки на компанію вона з’явиться на цій сторінці.",
    browseCompanies: "Переглянути компанії",
    loadErrorTitle: "Не вдалося завантажити заявки",
    loadErrorDescription: "Під час завантаження заявок сталася технічна помилка.",
    statusLabels: {
      pending: "Очікує перевірки",
      needs_info: "Потрібне доповнення",
      approved: "Схвалено",
      rejected: "Відхилено",
      cancelled: "Відкликано",
    },
  },
  ru: {
    eyebrow: "Проверка компаний",
    title: "Мои заявки на компании",
    description: "Отслеживайте статус, дополняйте данные и управляйте заявками на подтверждение компаний.",
    total: "Всего",
    pending: "На проверке",
    needsInfo: "Нужны данные",
    approved: "Одобрены",
    rejected: "Отклонены",
    cancelled: "Отозваны",
    submitted: "Отправлено",
    reviewed: "Проверено",
    email: "Рабочая электронная почта",
    phone: "Рабочий телефон",
    message: "Ваше сообщение",
    adminNote: "Комментарий проверки",
    evidence: "Документы подтверждения",
    domainMatch: "Домен email совпадает с компанией",
    domainMismatch: "Домен email не удалось автоматически подтвердить",
    viewCompany: "Посмотреть компанию",
    manageCompany: "Управлять компанией",
    provideInfo: "Дополнить информацию",
    cancelClaim: "Отозвать",
    emptyTitle: "У вас пока нет заявок",
    emptyDescription: "После подачи заявки на компанию она появится на этой странице.",
    browseCompanies: "Посмотреть компании",
    loadErrorTitle: "Не удалось загрузить заявки",
    loadErrorDescription: "При загрузке заявок произошла техническая ошибка.",
    statusLabels: {
      pending: "Ожидает проверки",
      needs_info: "Нужно дополнение",
      approved: "Одобрено",
      rejected: "Отклонено",
      cancelled: "Отозвано",
    },
  },
  pl: {
    eyebrow: "Weryfikacja firm",
    title: "Moje zgłoszenia firm",
    description: "Śledź status, uzupełniaj dane i zarządzaj zgłoszeniami dotyczącymi weryfikacji firm.",
    total: "Łącznie",
    pending: "Oczekujące",
    needsInfo: "Wymaga danych",
    approved: "Zatwierdzone",
    rejected: "Odrzucone",
    cancelled: "Anulowane",
    submitted: "Wysłano",
    reviewed: "Sprawdzono",
    email: "Firmowy adres e-mail",
    phone: "Firmowy telefon",
    message: "Twoja wiadomość",
    adminNote: "Komentarz z weryfikacji",
    evidence: "Dokumenty weryfikacyjne",
    domainMatch: "Domena e-mail pasuje do firmy",
    domainMismatch: "Nie udało się automatycznie potwierdzić domeny e-mail",
    viewCompany: "Zobacz firmę",
    manageCompany: "Zarządzaj firmą",
    provideInfo: "Uzupełnij informacje",
    cancelClaim: "Anuluj",
    emptyTitle: "Nie masz jeszcze żadnych zgłoszeń",
    emptyDescription: "Po wysłaniu zgłoszenia dotyczącego firmy pojawi się ono tutaj.",
    browseCompanies: "Przeglądaj firmy",
    loadErrorTitle: "Nie udało się załadować zgłoszeń",
    loadErrorDescription: "Podczas ładowania zgłoszeń wystąpił błąd techniczny.",
    statusLabels: {
      pending: "Oczekuje na sprawdzenie",
      needs_info: "Wymaga uzupełnienia",
      approved: "Zatwierdzone",
      rejected: "Odrzucone",
      cancelled: "Anulowane",
    },
  },
}

function isSupportedLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale)
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeValue = cookieStore.get("clean_jobs_locale")?.value
  return isSupportedLocale(localeValue) ? localeValue : "sv"
}

function getCompany(claim: CompanyClaim) {
  if (!claim.companies) return null
  return Array.isArray(claim.companies) ? claim.companies[0] ?? null : claim.companies
}

function formatDate(value: string, locale: Locale): string {
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
  const map: Record<ClaimStatus, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    needs_info: "border-orange-200 bg-orange-50 text-orange-800",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rejected: "border-red-200 bg-red-50 text-red-800",
    cancelled: "border-slate-200 bg-slate-100 text-slate-700",
  }
  return map[status]
}

function getStatusIcon(status: ClaimStatus): string {
  if (status === "approved") return "✓"
  if (status === "rejected") return "×"
  if (status === "cancelled") return "–"
  if (status === "needs_info") return "!"
  return "…"
}

async function createEvidenceLinks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paths: string[] | null,
): Promise<EvidenceLink[]> {
  const validPaths = (paths ?? []).filter(Boolean)
  if (validPaths.length === 0) return []

  const { data } = await supabase.storage
    .from("company-claim-evidence")
    .createSignedUrls(validPaths, 30 * 60)

  return (data ?? [])
    .filter((item) => Boolean(item.signedUrl))
    .map((item) => ({
      path: item.path,
      url: item.signedUrl,
      name: item.path.split("/").pop() || "document",
    }))
}

export const metadata: Metadata = {
  title: "Company claims | Clean Jobs",
  description: "Manage your Clean Jobs company claim requests.",
  robots: { index: false, follow: false },
}

export default async function CompanyClaimsPage() {
  const locale = await getLocale()
  const dictionary = dictionaries[locale]
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/dashboard/company-claims")

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
      requested_info_at,
      cancelled_at,
      evidence_paths,
      email_domain_match,
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
  const evidenceEntries = await Promise.all(
    claims.map(async (claim) => [claim.id, await createEvidenceLinks(supabase, claim.evidence_paths)] as const),
  )
  const evidenceByClaim = new Map<string, EvidenceLink[]>(evidenceEntries)

  const counts = {
    pending: claims.filter((claim) => claim.status === "pending").length,
    needs_info: claims.filter((claim) => claim.status === "needs_info").length,
    approved: claims.filter((claim) => claim.status === "approved").length,
    rejected: claims.filter((claim) => claim.status === "rejected").length,
    cancelled: claims.filter((claim) => claim.status === "cancelled").length,
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">{dictionary.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{dictionary.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">{dictionary.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <StatisticCard value={claims.length} label={dictionary.total} />
            <StatisticCard value={counts.pending} label={dictionary.pending} />
            <StatisticCard value={counts.needs_info} label={dictionary.needsInfo} />
            <StatisticCard value={counts.approved} label={dictionary.approved} />
            <StatisticCard value={counts.rejected} label={dictionary.rejected} />
            <StatisticCard value={counts.cancelled} label={dictionary.cancelled} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-black text-red-950">{dictionary.loadErrorTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-red-800">{dictionary.loadErrorDescription}</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">🏢</div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">{dictionary.emptyTitle}</h2>
            <p className="mx-auto mt-3 max-w-lg leading-7 text-slate-600">{dictionary.emptyDescription}</p>
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
              const evidence = evidenceByClaim.get(claim.id) ?? []

              return (
                <article
                  id={`claim-${claim.id}`}
                  key={claim.id}
                  className="scroll-mt-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    {company?.logo_url ? (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <img src={company.logo_url} alt={`${company.name} logo`} className="h-full w-full object-contain p-2" />
                      </div>
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-black text-white">
                        {company?.name.charAt(0).toUpperCase() ?? "C"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="text-xl font-black text-slate-950">{company?.name ?? "Company"}</h2>
                          {company?.city ? <p className="mt-1 text-sm font-medium text-slate-500">{company.city}</p> : null}
                        </div>
                        <span className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(claim.status)}`}>
                          <span aria-hidden="true">{getStatusIcon(claim.status)}</span>
                          {dictionary.statusLabels[claim.status]}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                        <ClaimDetail label={dictionary.submitted} value={formatDate(claim.created_at, locale)} />
                        {claim.reviewed_at ? <ClaimDetail label={dictionary.reviewed} value={formatDate(claim.reviewed_at, locale)} /> : null}
                        {claim.business_email ? <ClaimDetail label={dictionary.email} value={claim.business_email} /> : null}
                        {claim.business_phone ? <ClaimDetail label={dictionary.phone} value={claim.business_phone} /> : null}
                      </div>

                      <div className={`mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold ${claim.email_domain_match ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}>
                        {claim.email_domain_match ? dictionary.domainMatch : dictionary.domainMismatch}
                      </div>

                      {claim.message ? (
                        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{dictionary.message}</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{claim.message}</p>
                        </div>
                      ) : null}

                      {claim.admin_note ? (
                        <div className={`mt-4 rounded-2xl border p-4 ${claim.status === "rejected" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{dictionary.adminNote}</p>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{claim.admin_note}</p>
                        </div>
                      ) : null}

                      {evidence.length > 0 ? (
                        <div className="mt-5">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{dictionary.evidence}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {evidence.map((file, index) => (
                              <a
                                key={file.path}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                              >
                                {index + 1}. {file.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {company ? (
                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link href={`/companies/${company.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
                            {dictionary.viewCompany}
                          </Link>

                          {claim.status === "approved" && company.owner_id === user.id ? (
                            <Link href={`/dashboard/companies/${company.id}/edit`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600">
                              {dictionary.manageCompany}
                            </Link>
                          ) : null}

                          {claim.status === "needs_info" ? (
                            <Link href={`/companies/${company.slug}/claim`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-700">
                              {dictionary.provideInfo}
                            </Link>
                          ) : null}

                          {["pending", "needs_info"].includes(claim.status) ? (
                            <form action={cancelCompanyClaimAction}>
                              <input type="hidden" name="claimId" value={claim.id} />
                              <input type="hidden" name="companySlug" value={company.slug} />
                              <input type="hidden" name="locale" value={locale} />
                              <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50">
                                {dictionary.cancelClaim}
                              </button>
                            </form>
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

function StatisticCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  )
}

function ClaimDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
    </div>
  )
}
