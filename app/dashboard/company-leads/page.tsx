import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import CompanyWorkspaceNav from "@/components/company-dashboard/company-workspace-nav"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import {
  COMPANY_LEAD_PRIORITIES,
  COMPANY_LEAD_SOURCES,
  COMPANY_LEAD_STATUSES,
  type CompanyLeadPriority,
  type CompanyLeadSource,
  type CompanyLeadStatus,
} from "@/lib/company-leads/types"
import {
  normalizeCompanyLeadPriority,
  normalizeCompanyLeadSource,
  normalizeCompanyLeadStatus,
} from "@/lib/company-leads/utils"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Company leads | Clean Jobs",
  description: "Manage customer leads sent to your cleaning companies.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{
    status?: string
    priority?: string
    source?: string
    company?: string
    search?: string
    sort?: string
    lead?: string
  }>
}

type OwnedCompany = {
  id: string
  name: string
  slug: string
}

type CompanyLead = {
  id: string
  company_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  service_type: string | null
  city: string | null
  preferred_date: string | null
  message: string
  status: string
  priority: string
  source: string
  source_url: string | null
  lead_type: string
  lead_score: number | null
  estimated_value: number | string | null
  quoted_value: number | string | null
  follow_up_at: string | null
  first_viewed_at: string | null
  lead_access: string
  is_paid: boolean
  created_at: string
  updated_at: string
  companies:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
}

type Copy = {
  eyebrow: string
  title: string
  subtitle: string
  total: string
  newLeads: string
  wonMetric: string
  conversion: string
  pipeline: string
  search: string
  searchPlaceholder: string
  allStatuses: string
  allPriorities: string
  allSources: string
  allCompanies: string
  newest: string
  oldest: string
  followUp: string
  highestValue: string
  filter: string
  reset: string
  customer: string
  service: string
  city: string
  company: string
  source: string
  priority: string
  status: string
  value: string
  created: string
  followUpLabel: string
  open: string
  noLeadsTitle: string
  noLeadsText: string
  loadError: string
  score: string
} & Record<CompanyLeadStatus | CompanyLeadPriority | CompanyLeadSource, string>

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Lead Generation 2.0",
    title: "Kundleads",
    subtitle: "Prioritera, följ upp och konvertera offertförfrågningar från företagsprofiler och företagswebbplatser.",
    total: "Totalt", newLeads: "Nya", wonMetric: "Vunna", conversion: "Konvertering", pipeline: "Pipeline-värde",
    search: "Sök", searchPlaceholder: "Namn, e-post, telefon, tjänst eller ort", allStatuses: "Alla statusar", allPriorities: "Alla prioriteringar", allSources: "Alla källor", allCompanies: "Alla företag",
    newest: "Nyast först", oldest: "Äldst först", followUp: "Närmaste uppföljning", highestValue: "Högst värde", filter: "Filtrera", reset: "Återställ",
    customer: "Kund", service: "Tjänst", city: "Ort", company: "Företag", source: "Källa", priority: "Prioritet", status: "Status", value: "Värde", created: "Skapad", followUpLabel: "Följ upp", open: "Öppna lead", noLeadsTitle: "Inga leads hittades", noLeadsText: "Ändra filtren eller vänta på nästa offertförfrågan.", loadError: "Kundleads kunde inte laddas.", score: "Poäng",
    new: "Ny", viewed: "Visad", contacted: "Kontaktad", qualified: "Kvalificerad", quoted: "Offert skickad", won: "Vunnen", lost: "Förlorad", archived: "Arkiverad",
    low: "Låg", normal: "Normal", high: "Hög", urgent: "Brådskande",
    company_profile: "Företagsprofil", company_site: "Företagswebbplats", marketplace: "Marknadsplats", manual: "Manuell", admin: "Admin", seo: "SEO", google: "Google", other: "Annan",
  },
  en: {
    eyebrow: "Lead Generation 2.0", title: "Customer leads", subtitle: "Prioritise, follow up and convert quote requests from company profiles and company websites.",
    total: "Total", newLeads: "New", wonMetric: "Won", conversion: "Conversion", pipeline: "Pipeline value",
    search: "Search", searchPlaceholder: "Name, email, phone, service or city", allStatuses: "All statuses", allPriorities: "All priorities", allSources: "All sources", allCompanies: "All companies",
    newest: "Newest first", oldest: "Oldest first", followUp: "Nearest follow-up", highestValue: "Highest value", filter: "Filter", reset: "Reset",
    customer: "Customer", service: "Service", city: "City", company: "Company", source: "Source", priority: "Priority", status: "Status", value: "Value", created: "Created", followUpLabel: "Follow up", open: "Open lead", noLeadsTitle: "No leads found", noLeadsText: "Change the filters or wait for the next quote request.", loadError: "Customer leads could not be loaded.", score: "Score",
    new: "New", viewed: "Viewed", contacted: "Contacted", qualified: "Qualified", quoted: "Quoted", won: "Won", lost: "Lost", archived: "Archived",
    low: "Low", normal: "Normal", high: "High", urgent: "Urgent",
    company_profile: "Company profile", company_site: "Company website", marketplace: "Marketplace", manual: "Manual", admin: "Admin", seo: "SEO", google: "Google", other: "Other",
  },
  uk: {
    eyebrow: "Lead Generation 2.0", title: "Клієнтські ліди", subtitle: "Пріоритезуйте, супроводжуйте та конвертуйте запити з профілів і сайтів компаній.",
    total: "Усього", newLeads: "Нові", wonMetric: "Виграні", conversion: "Конверсія", pipeline: "Вартість pipeline",
    search: "Пошук", searchPlaceholder: "Ім’я, email, телефон, послуга або місто", allStatuses: "Усі статуси", allPriorities: "Усі пріоритети", allSources: "Усі джерела", allCompanies: "Усі компанії",
    newest: "Спочатку нові", oldest: "Спочатку старі", followUp: "Найближчий follow-up", highestValue: "Найвища вартість", filter: "Фільтрувати", reset: "Скинути",
    customer: "Клієнт", service: "Послуга", city: "Місто", company: "Компанія", source: "Джерело", priority: "Пріоритет", status: "Статус", value: "Вартість", created: "Створено", followUpLabel: "Follow-up", open: "Відкрити лід", noLeadsTitle: "Лідів не знайдено", noLeadsText: "Змініть фільтри або дочекайтеся наступного запиту.", loadError: "Не вдалося завантажити клієнтські ліди.", score: "Оцінка",
    new: "Новий", viewed: "Переглянутий", contacted: "Зв’язалися", qualified: "Кваліфікований", quoted: "Ціну надіслано", won: "Виграний", lost: "Втрачений", archived: "Архів",
    low: "Низький", normal: "Звичайний", high: "Високий", urgent: "Терміновий",
    company_profile: "Профіль компанії", company_site: "Сайт компанії", marketplace: "Маркетплейс", manual: "Вручну", admin: "Адмін", seo: "SEO", google: "Google", other: "Інше",
  },
  ru: {
    eyebrow: "Lead Generation 2.0", title: "Клиентские лиды", subtitle: "Приоритизируйте, сопровождайте и конвертируйте запросы из профилей и сайтов компаний.",
    total: "Всего", newLeads: "Новые", wonMetric: "Выигранные", conversion: "Конверсия", pipeline: "Стоимость pipeline",
    search: "Поиск", searchPlaceholder: "Имя, email, телефон, услуга или город", allStatuses: "Все статусы", allPriorities: "Все приоритеты", allSources: "Все источники", allCompanies: "Все компании",
    newest: "Сначала новые", oldest: "Сначала старые", followUp: "Ближайший follow-up", highestValue: "Наивысшая стоимость", filter: "Фильтровать", reset: "Сбросить",
    customer: "Клиент", service: "Услуга", city: "Город", company: "Компания", source: "Источник", priority: "Приоритет", status: "Статус", value: "Стоимость", created: "Создан", followUpLabel: "Follow-up", open: "Открыть лид", noLeadsTitle: "Лиды не найдены", noLeadsText: "Измените фильтры или дождитесь следующего запроса.", loadError: "Не удалось загрузить клиентские лиды.", score: "Оценка",
    new: "Новый", viewed: "Просмотрен", contacted: "Связались", qualified: "Квалифицирован", quoted: "Цена отправлена", won: "Выигран", lost: "Потерян", archived: "Архив",
    low: "Низкий", normal: "Обычный", high: "Высокий", urgent: "Срочный",
    company_profile: "Профиль компании", company_site: "Сайт компании", marketplace: "Маркетплейс", manual: "Вручную", admin: "Админ", seo: "SEO", google: "Google", other: "Другое",
  },
  pl: {
    eyebrow: "Lead Generation 2.0", title: "Leady klientów", subtitle: "Priorytetyzuj, obsługuj i konwertuj zapytania z profili i stron firm.",
    total: "Łącznie", newLeads: "Nowe", wonMetric: "Wygrane", conversion: "Konwersja", pipeline: "Wartość pipeline",
    search: "Szukaj", searchPlaceholder: "Imię, email, telefon, usługa lub miasto", allStatuses: "Wszystkie statusy", allPriorities: "Wszystkie priorytety", allSources: "Wszystkie źródła", allCompanies: "Wszystkie firmy",
    newest: "Najnowsze", oldest: "Najstarsze", followUp: "Najbliższy follow-up", highestValue: "Najwyższa wartość", filter: "Filtruj", reset: "Resetuj",
    customer: "Klient", service: "Usługa", city: "Miasto", company: "Firma", source: "Źródło", priority: "Priorytet", status: "Status", value: "Wartość", created: "Utworzono", followUpLabel: "Follow-up", open: "Otwórz lead", noLeadsTitle: "Nie znaleziono leadów", noLeadsText: "Zmień filtry lub poczekaj na kolejne zapytanie.", loadError: "Nie udało się załadować leadów klientów.", score: "Ocena",
    new: "Nowy", viewed: "Wyświetlony", contacted: "Skontaktowano", qualified: "Zakwalifikowany", quoted: "Wycena wysłana", won: "Wygrany", lost: "Utracony", archived: "Archiwum",
    low: "Niski", normal: "Normalny", high: "Wysoki", urgent: "Pilny",
    company_profile: "Profil firmy", company_site: "Strona firmy", marketplace: "Marketplace", manual: "Ręcznie", admin: "Admin", seo: "SEO", google: "Google", other: "Inne",
  },
}

function getCompany(lead: CompanyLead) {
  if (!lead.companies) return null
  return Array.isArray(lead.companies) ? lead.companies[0] ?? null : lead.companies
}

function formatDate(value: string | null, locale: Locale, withTime = false) {
  if (!value) return "—"
  const localeMap: Record<Locale, string> = { sv: "sv-SE", en: "en-GB", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" }
  return new Intl.DateTimeFormat(localeMap[locale], withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(new Date(value))
}

function numberValue(value: number | string | null) {
  if (value === null || value === undefined || value === "") return 0
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function money(value: number | string | null) {
  const number = numberValue(value)
  return number > 0 ? `${Math.round(number).toLocaleString("sv-SE")} SEK` : "—"
}

function safeSearch(value: string) {
  return value.replace(/[%,()_]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100)
}

function statusStyle(status: CompanyLeadStatus) {
  const map: Record<CompanyLeadStatus, string> = {
    new: "border-blue-200 bg-blue-50 text-blue-800", viewed: "border-violet-200 bg-violet-50 text-violet-800", contacted: "border-amber-200 bg-amber-50 text-amber-800", qualified: "border-cyan-200 bg-cyan-50 text-cyan-800", quoted: "border-indigo-200 bg-indigo-50 text-indigo-800", won: "border-emerald-200 bg-emerald-50 text-emerald-800", lost: "border-red-200 bg-red-50 text-red-800", archived: "border-slate-200 bg-slate-100 text-slate-700",
  }
  return map[status]
}

function priorityStyle(priority: CompanyLeadPriority) {
  const map: Record<CompanyLeadPriority, string> = {
    low: "bg-slate-100 text-slate-600", normal: "bg-blue-50 text-blue-700", high: "bg-orange-50 text-orange-700", urgent: "bg-red-100 text-red-800",
  }
  return map[priority]
}

export default async function CompanyLeadsPage({ searchParams }: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE)
  const t = copy[locale]
  const moreFilters = {
    sv: "Fler filter",
    en: "More filters",
    uk: "Інші фільтри",
    ru: "Другие фильтры",
    pl: "Więcej filtrów",
  }[locale]
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login?next=/dashboard/company-leads")

  if (query.lead?.trim()) redirect(`/dashboard/company-leads/${query.lead.trim()}`)

  const { data: companyData, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("name")

  if (companyError) console.error("Load owned companies for lead filters error:", companyError)
  const ownedCompanies = (companyData ?? []) as OwnedCompany[]
  const ownedCompanyIds = ownedCompanies.map((company) => company.id)

  const selectedStatus = COMPANY_LEAD_STATUSES.includes(query.status as CompanyLeadStatus) ? (query.status as CompanyLeadStatus) : ""
  const selectedPriority = COMPANY_LEAD_PRIORITIES.includes(query.priority as CompanyLeadPriority) ? (query.priority as CompanyLeadPriority) : ""
  const selectedSource = COMPANY_LEAD_SOURCES.includes(query.source as CompanyLeadSource) ? (query.source as CompanyLeadSource) : ""
  const selectedCompany = ownedCompanyIds.includes(query.company || "") ? String(query.company) : ""
  const search = safeSearch(query.search || "")
  const sort = ["newest", "oldest", "follow_up", "value"].includes(query.sort || "") ? query.sort! : "newest"

  let leadsQuery = supabase
    .from("company_quote_requests")
    .select(`
      id, company_id, customer_name, customer_email, customer_phone, service_type,
      city, preferred_date, message, status, priority, source, source_url, lead_type,
      lead_score, estimated_value, quoted_value, follow_up_at, first_viewed_at,
      lead_access, is_paid, created_at, updated_at,
      companies ( id, name, slug )
    `)

  if (selectedStatus) leadsQuery = leadsQuery.eq("status", selectedStatus)
  if (selectedPriority) leadsQuery = leadsQuery.eq("priority", selectedPriority)
  if (selectedSource) leadsQuery = leadsQuery.eq("source", selectedSource)
  if (selectedCompany) leadsQuery = leadsQuery.eq("company_id", selectedCompany)
  if (search) {
    leadsQuery = leadsQuery.or([
      `customer_name.ilike.%${search}%`, `customer_email.ilike.%${search}%`, `customer_phone.ilike.%${search}%`, `service_type.ilike.%${search}%`, `city.ilike.%${search}%`,
    ].join(","))
  }

  if (sort === "oldest") leadsQuery = leadsQuery.order("created_at", { ascending: true })
  else if (sort === "follow_up") leadsQuery = leadsQuery.order("follow_up_at", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false })
  else if (sort === "value") leadsQuery = leadsQuery.order("estimated_value", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false })
  else leadsQuery = leadsQuery.order("created_at", { ascending: false })

  const { data, error } = await leadsQuery.limit(200)
  const leads = (data ?? []) as CompanyLead[]

  const { data: statData, error: statError } = await supabase
    .from("company_quote_requests")
    .select("status, estimated_value, quoted_value")

  if (statError) console.error("Load company lead stats error:", statError)
  const all = (statData ?? []) as Array<{ status: string; estimated_value: number | string | null; quoted_value: number | string | null }>
  const total = all.length
  const newCount = all.filter((item) => item.status === "new").length
  const wonCount = all.filter((item) => item.status === "won").length
  const conversion = total > 0 ? Math.round((wonCount / total) * 1000) / 10 : 0
  const pipeline = all.filter((item) => !["won", "lost", "archived"].includes(item.status)).reduce((sum, item) => sum + numberValue(item.quoted_value || item.estimated_value), 0)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{t.title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{t.subtitle}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label={t.total} value={String(total)} />
            <Stat label={t.newLeads} value={String(newCount)} />
            <Stat label={t.wonMetric} value={String(wonCount)} />
            <Stat label={t.conversion} value={`${conversion}%`} />
            <Stat label={t.pipeline} value={`${Math.round(pipeline).toLocaleString("sv-SE")} SEK`} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CompanyWorkspaceNav
          locale={locale}
          active="leads"
          companyId={selectedCompany || ownedCompanies[0]?.id || null}
          newLeadsCount={newCount}
        />

        <form
          method="get"
          className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-3 lg:grid-cols-6">
            <input
              name="search"
              defaultValue={search}
              placeholder={t.searchPlaceholder}
              className="min-h-11 rounded-xl border border-slate-300 px-3 text-sm lg:col-span-2"
            />

            <select
              name="status"
              defaultValue={selectedStatus}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="">{t.allStatuses}</option>
              {COMPANY_LEAD_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {t[item]}
                </option>
              ))}
            </select>

            <select
              name="company"
              defaultValue={selectedCompany}
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
            >
              <option value="">{t.allCompanies}</option>
              {ownedCompanies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>

            <button className="min-h-11 rounded-xl bg-slate-950 px-5 text-sm font-black text-white">
              {t.filter}
            </button>

            <Link
              href="/dashboard/company-leads"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700"
            >
              {t.reset}
            </Link>
          </div>

          <details
            className="mt-4 border-t border-slate-100 pt-4"
            open={Boolean(
              selectedPriority ||
                selectedSource ||
                sort !== "newest",
            )}
          >
            <summary className="cursor-pointer list-none text-sm font-black text-slate-600 hover:text-rose-700">
              {moreFilters} ▾
            </summary>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <select
                name="priority"
                defaultValue={selectedPriority}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">{t.allPriorities}</option>
                {COMPANY_LEAD_PRIORITIES.map((item) => (
                  <option key={item} value={item}>
                    {t[item]}
                  </option>
                ))}
              </select>

              <select
                name="source"
                defaultValue={selectedSource}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="">{t.allSources}</option>
                {COMPANY_LEAD_SOURCES.map((item) => (
                  <option key={item} value={item}>
                    {t[item]}
                  </option>
                ))}
              </select>

              <select
                name="sort"
                defaultValue={sort}
                className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              >
                <option value="newest">{t.newest}</option>
                <option value="oldest">{t.oldest}</option>
                <option value="follow_up">{t.followUp}</option>
                <option value="value">{t.highestValue}</option>
              </select>
            </div>
          </details>
        </form>

        {error ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-bold text-red-800">{t.loadError}</div>
        ) : leads.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center"><h2 className="text-2xl font-black text-slate-950">{t.noLeadsTitle}</h2><p className="mt-3 text-slate-600">{t.noLeadsText}</p></div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-200">
              {leads.map((lead) => {
                const status = normalizeCompanyLeadStatus(lead.status)
                const priority = normalizeCompanyLeadPriority(lead.priority)
                const source = normalizeCompanyLeadSource(lead.source)
                const company = getCompany(lead)
                const displayValue = lead.quoted_value || lead.estimated_value
                return (
                  <article key={lead.id} className="p-5 transition hover:bg-slate-50 sm:p-6">
                    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_180px_160px_150px] xl:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link href={`/dashboard/company-leads/${lead.id}`} className="text-lg font-black text-slate-950 hover:text-rose-600">{lead.customer_name || t.customer}</Link>
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusStyle(status)}`}>{t[status]}</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-black ${priorityStyle(priority)}`}>{t[priority]}</span>
                          {lead.lead_score !== null ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{t.score}: {lead.lead_score}</span> : null}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span>{company?.name || t.company}</span><span>{lead.service_type || "—"}</span><span>{lead.city || "—"}</span><span>{lead.customer_email}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500"><span>{t[source]}</span><span>·</span><span>{formatDate(lead.created_at, locale, true)}</span>{lead.follow_up_at ? <><span>·</span><span className="text-amber-700">{t.followUpLabel}: {formatDate(lead.follow_up_at, locale, true)}</span></> : null}</div>
                      </div>
                      <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t.value}</p><p className="mt-1 font-black text-slate-950">{money(displayValue)}</p></div>
                      <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{t.source}</p><p className="mt-1 text-sm font-bold text-slate-700">{t[source]}</p></div>
                      <Link href={`/dashboard/company-leads/${lead.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white hover:bg-rose-700">{t.open}</Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-2xl font-black text-slate-950">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p></div>
}
