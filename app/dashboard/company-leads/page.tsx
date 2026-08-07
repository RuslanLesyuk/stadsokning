import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { updateCompanyLeadStatus } from "./actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Company quote requests | Clean Jobs",
  description: "Manage quote requests sent to your companies.",
  robots: { index: false, follow: false },
}

type LeadStatus = "new" | "contacted" | "won" | "lost" | "archived"

type PageProps = {
  searchParams: Promise<{ status?: string; lead?: string }>
}

type CompanyLead = {
  id: string
  company_id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  service_type: string | null
  city: string | null
  preferred_date: string | null
  message: string | null
  status: string | null
  created_at: string | null
  companies:
    | {
        id: string
        name: string
        slug: string
      }
    | {
        id: string
        name: string
        slug: string
      }[]
    | null
}

type Copy = {
  eyebrow: string
  title: string
  subtitle: string
  total: string
  new: string
  contacted: string
  won: string
  lost: string
  archived: string
  all: string
  service: string
  location: string
  preferredDate: string
  submitted: string
  customer: string
  email: string
  phone: string
  message: string
  viewCompany: string
  noLeadsTitle: string
  noLeadsText: string
  browseCompanies: string
  loadError: string
  statusLabel: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Företagsleads",
    title: "Offertförfrågningar",
    subtitle:
      "Hantera kunder som har skickat en offertförfrågan via företagets profil.",
    total: "Totalt",
    new: "Nya",
    contacted: "Kontaktade",
    won: "Vunna",
    lost: "Förlorade",
    archived: "Arkiverade",
    all: "Alla",
    service: "Tjänst",
    location: "Ort eller område",
    preferredDate: "Önskat datum",
    submitted: "Skickad",
    customer: "Kund",
    email: "E-post",
    phone: "Telefon",
    message: "Beskrivning",
    viewCompany: "Visa företag",
    noLeadsTitle: "Inga offertförfrågningar ännu",
    noLeadsText:
      "Nya förfrågningar visas här när kunder använder offertformuläret på företagets profil.",
    browseCompanies: "Visa företagsprofiler",
    loadError: "Offertförfrågningarna kunde inte laddas.",
    statusLabel: "Status",
  },
  en: {
    eyebrow: "Company quote requests",
    title: "Quote requests",
    subtitle:
      "Manage customers who submitted a quote request through a company profile.",
    total: "Total",
    new: "New",
    contacted: "Contacted",
    won: "Won",
    lost: "Lost",
    archived: "Archived",
    all: "All",
    service: "Service",
    location: "City or area",
    preferredDate: "Preferred date",
    submitted: "Submitted",
    customer: "Customer",
    email: "Email",
    phone: "Phone",
    message: "Description",
    viewCompany: "View company",
    noLeadsTitle: "No quote requests yet",
    noLeadsText:
      "New requests will appear here when customers use the quote form on a company profile.",
    browseCompanies: "View company profiles",
    loadError: "Quote requests could not be loaded.",
    statusLabel: "Status",
  },
  uk: {
    eyebrow: "Ліди компаній",
    title: "Запити на пропозицію",
    subtitle:
      "Керуйте клієнтами, які надіслали запит через профіль компанії.",
    total: "Усього",
    new: "Нові",
    contacted: "Зв’язалися",
    won: "Отримані",
    lost: "Втрачені",
    archived: "Архів",
    all: "Усі",
    service: "Послуга",
    location: "Місто або район",
    preferredDate: "Бажана дата",
    submitted: "Надіслано",
    customer: "Клієнт",
    email: "Email",
    phone: "Телефон",
    message: "Опис",
    viewCompany: "Переглянути компанію",
    noLeadsTitle: "Запитів поки немає",
    noLeadsText:
      "Нові запити з’являться тут, коли клієнти використають форму у профілі компанії.",
    browseCompanies: "Переглянути профілі компаній",
    loadError: "Не вдалося завантажити запити.",
    statusLabel: "Статус",
  },
  ru: {
    eyebrow: "Лиды компаний",
    title: "Запросы на предложение",
    subtitle:
      "Управляйте клиентами, которые отправили запрос через профиль компании.",
    total: "Всего",
    new: "Новые",
    contacted: "Связались",
    won: "Получены",
    lost: "Потеряны",
    archived: "Архив",
    all: "Все",
    service: "Услуга",
    location: "Город или район",
    preferredDate: "Желаемая дата",
    submitted: "Отправлено",
    customer: "Клиент",
    email: "Email",
    phone: "Телефон",
    message: "Описание",
    viewCompany: "Посмотреть компанию",
    noLeadsTitle: "Запросов пока нет",
    noLeadsText:
      "Новые запросы появятся здесь, когда клиенты используют форму в профиле компании.",
    browseCompanies: "Посмотреть профили компаний",
    loadError: "Не удалось загрузить запросы.",
    statusLabel: "Статус",
  },
  pl: {
    eyebrow: "Leady firmowe",
    title: "Zapytania ofertowe",
    subtitle:
      "Zarządzaj klientami, którzy wysłali zapytanie przez profil firmy.",
    total: "Łącznie",
    new: "Nowe",
    contacted: "Skontaktowano",
    won: "Pozyskane",
    lost: "Utracone",
    archived: "Archiwum",
    all: "Wszystkie",
    service: "Usługa",
    location: "Miasto lub obszar",
    preferredDate: "Preferowana data",
    submitted: "Wysłano",
    customer: "Klient",
    email: "Email",
    phone: "Telefon",
    message: "Opis",
    viewCompany: "Zobacz firmę",
    noLeadsTitle: "Brak zapytań ofertowych",
    noLeadsText:
      "Nowe zapytania pojawią się tutaj, gdy klienci skorzystają z formularza w profilu firmy.",
    browseCompanies: "Zobacz profile firm",
    loadError: "Nie udało się załadować zapytań.",
    statusLabel: "Status",
  },
}

const statuses: LeadStatus[] = ["new", "contacted", "won", "lost", "archived"]

function normalizeStatus(value: string | null | undefined): LeadStatus {
  return statuses.includes(value as LeadStatus) ? (value as LeadStatus) : "new"
}

function getCompany(lead: CompanyLead) {
  if (!lead.companies) return null
  return Array.isArray(lead.companies) ? lead.companies[0] ?? null : lead.companies
}

function formatDate(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function getStatusStyles(status: LeadStatus) {
  const map: Record<LeadStatus, string> = {
    new: "border-blue-200 bg-blue-50 text-blue-800",
    contacted: "border-amber-200 bg-amber-50 text-amber-800",
    won: "border-emerald-200 bg-emerald-50 text-emerald-800",
    lost: "border-red-200 bg-red-50 text-red-800",
    archived: "border-slate-200 bg-slate-100 text-slate-700",
  }

  return map[status]
}

export default async function CompanyLeadsPage({ searchParams }: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const t = copy[locale]

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/dashboard/company-leads")
  }

  const selectedStatus = statuses.includes(query.status as LeadStatus)
    ? (query.status as LeadStatus)
    : null
  const highlightedLeadId = query.lead?.trim() || null

  let leadsQuery = supabase
    .from("company_quote_requests")
    .select(`
      id,
      company_id,
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      city,
      preferred_date,
      message,
      status,
      created_at,
      companies (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false })

  if (selectedStatus) {
    leadsQuery = leadsQuery.eq("status", selectedStatus)
  }

  const { data, error } = await leadsQuery
  const leads = (data ?? []) as CompanyLead[]

  const { data: countData } = await supabase
    .from("company_quote_requests")
    .select("status")

  const allStatuses = ((countData ?? []) as Array<{ status: string | null }>).map(
    (item) => normalizeStatus(item.status),
  )

  const counts: Record<LeadStatus, number> = {
    new: 0,
    contacted: 0,
    won: 0,
    lost: 0,
    archived: 0,
  }

  for (const status of allStatuses) counts[status] += 1

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">{t.subtitle}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <Stat value={allStatuses.length} label={t.total} />
            {statuses.map((status) => (
              <Stat key={status} value={counts[status]} label={t[status]} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-wrap gap-2">
          <FilterLink href="/dashboard/company-leads" active={!selectedStatus}>
            {t.all}
          </FilterLink>
          {statuses.map((status) => (
            <FilterLink
              key={status}
              href={`/dashboard/company-leads?status=${status}`}
              active={selectedStatus === status}
            >
              {t[status]} ({counts[status]})
            </FilterLink>
          ))}
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-800">
            {t.loadError}
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50 text-3xl">
              ✉
            </div>
            <h2 className="mt-5 text-2xl font-black text-slate-950">{t.noLeadsTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">{t.noLeadsText}</p>
            <Link
              href="/companies"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-white transition hover:bg-rose-600"
            >
              {t.browseCompanies}
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {leads.map((lead) => {
              const status = normalizeStatus(lead.status)
              const company = getCompany(lead)

              return (
                <article
                  key={lead.id}
                  id={`lead-${lead.id}`}
                  className={`scroll-mt-28 rounded-3xl border bg-white p-6 shadow-sm transition sm:p-7 ${
                    highlightedLeadId === lead.id
                      ? "border-rose-400 ring-4 ring-rose-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-black text-slate-950">
                          {lead.customer_name || t.customer}
                        </h2>
                        <span className={`rounded-full border px-3 py-1 text-xs font-black ${getStatusStyles(status)}`}>
                          {t[status]}
                        </span>
                      </div>

                      {company ? (
                        <p className="mt-2 text-sm font-bold text-rose-600">
                          {company.name}
                        </p>
                      ) : null}

                      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {lead.customer_email ? <Detail label={t.email} value={lead.customer_email} href={`mailto:${lead.customer_email}`} /> : null}
                        {lead.customer_phone ? <Detail label={t.phone} value={lead.customer_phone} href={`tel:${lead.customer_phone.replace(/\s+/g, "")}`} /> : null}
                        {lead.service_type ? <Detail label={t.service} value={lead.service_type} /> : null}
                        {lead.city ? <Detail label={t.location} value={lead.city} /> : null}
                        {lead.preferred_date ? <Detail label={t.preferredDate} value={formatDate(lead.preferred_date, locale)} /> : null}
                        {lead.created_at ? <Detail label={t.submitted} value={formatDate(lead.created_at, locale)} /> : null}
                      </dl>

                      {lead.message ? (
                        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-400">{t.message}</p>
                          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">{lead.message}</p>
                        </div>
                      ) : null}

                      {company ? (
                        <Link
                          href={`/companies/${company.slug}`}
                          className="mt-5 inline-flex text-sm font-black text-rose-600 transition hover:text-rose-700"
                        >
                          {t.viewCompany} →
                        </Link>
                      ) : null}
                    </div>

                    <div className="w-full shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:w-64">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{t.statusLabel}</p>
                      <div className="mt-3 grid gap-2">
                        {statuses.map((nextStatus) => (
                          <form key={nextStatus} action={updateCompanyLeadStatus}>
                            <input type="hidden" name="lead_id" value={lead.id} />
                            <input type="hidden" name="status" value={nextStatus} />
                            <button
                              type="submit"
                              disabled={status === nextStatus}
                              className={`min-h-10 w-full rounded-xl px-3 py-2 text-sm font-black transition ${
                                status === nextStatus
                                  ? "cursor-default bg-slate-950 text-white"
                                  : "border border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                              }`}
                            >
                              {t[nextStatus]}
                            </button>
                          </form>
                        ))}
                      </div>
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

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  )
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-black transition ${
        active
          ? "bg-slate-950 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:text-rose-700"
      }`}
    >
      {children}
    </Link>
  )
}

function Detail({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href?: string
}) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-slate-800">
        {href ? (
          <a href={href} className="transition hover:text-rose-600">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  )
}
