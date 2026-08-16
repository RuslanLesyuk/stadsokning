import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import LeadStatusSelect from "@/components/company-leads/lead-status-select"
import LeadViewTracker from "@/components/company-leads/lead-view-tracker"
import { bookingCopy } from "@/lib/bookings/copy"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import {
  COMPANY_LEAD_PRIORITIES,
  type CompanyLeadPriority,
  type CompanyLeadStatus,
} from "@/lib/company-leads/types"
import {
  normalizeCompanyLeadPriority,
  normalizeCompanyLeadSource,
  normalizeCompanyLeadStatus,
} from "@/lib/company-leads/utils"
import { createClient } from "@/lib/supabase-server"
import { updateCompanyLeadDetailsAction } from "../actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Customer lead | Clean Jobs",
  robots: { index: false, follow: false },
}

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; error?: string }>
}

type Lead = {
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
  first_viewed_at: string | null
  owner_notes: string | null
  lead_score: number | null
  estimated_value: number | string | null
  quoted_value: number | string | null
  currency: string
  lost_reason: string | null
  follow_up_at: string | null
  lead_access: string
  is_paid: boolean
  lead_price: number | string | null
  unlocked_at: string | null
  last_activity_at: string
  created_at: string
  updated_at: string
  companies:
    | { id: string; name: string; slug: string }
    | { id: string; name: string; slug: string }[]
    | null
}

type Activity = {
  id: string
  event_type: string
  from_status: string | null
  to_status: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

type Copy = {
  back: string
  eyebrow: string
  title: string
  company: string
  customer: string
  contact: string
  service: string
  city: string
  preferredDate: string
  submitted: string
  source: string
  leadType: string
  access: string
  firstViewed: string
  lastActivity: string
  status: string
  priority: string
  score: string
  estimatedValue: string
  quotedValue: string
  followUp: string
  notes: string
  lostReason: string
  save: string
  saved: string
  saveError: string
  call: string
  email: string
  openCompany: string
  openSource: string
  message: string
  timeline: string
  noActivity: string
  direct: string
  marketplaceType: string
  distributed: string
  included: string
  paid: string
  locked: string
  event_created: string
  event_viewed: string
  event_status_changed: string
  event_priority_changed: string
  event_notes_updated: string
  event_score_updated: string
  event_value_updated: string
  event_follow_up_changed: string
  event_lost_reason_updated: string
  event_access_updated: string
} & Record<CompanyLeadStatus | CompanyLeadPriority | "company_profile" | "company_site" | "marketplace" | "manual" | "admin" | "seo" | "google" | "other", string>

const copy: Record<Locale, Copy> = {
  sv: {
    back: "Till alla leads", eyebrow: "Kundlead", title: "Lead-detaljer", company: "Företag", customer: "Kund", contact: "Kontakt", service: "Tjänst", city: "Ort", preferredDate: "Önskat datum", submitted: "Skickad", source: "Källa", leadType: "Leadtyp", access: "Åtkomst", firstViewed: "Först visad", lastActivity: "Senaste aktivitet", status: "Status", priority: "Prioritet", score: "Lead-poäng", estimatedValue: "Uppskattat värde, SEK", quotedValue: "Offertvärde, SEK", followUp: "Följ upp", notes: "Interna anteckningar", lostReason: "Orsak till förlust", save: "Spara lead", saved: "Leadet har sparats.", saveError: "Leadet kunde inte sparas.", call: "Ring", email: "E-post", openCompany: "Visa företag", openSource: "Öppna källa", message: "Kundens beskrivning", timeline: "Aktivitet", noActivity: "Ingen aktivitet registrerad ännu.", direct: "Direkt", marketplaceType: "Marknadsplats", distributed: "Distribuerad", included: "Ingår", paid: "Betald", locked: "Låst",
    event_created: "Lead skapades", event_viewed: "Lead visades", event_status_changed: "Status ändrades", event_priority_changed: "Prioritet ändrades", event_notes_updated: "Anteckningar uppdaterades", event_score_updated: "Poäng uppdaterades", event_value_updated: "Värde uppdaterades", event_follow_up_changed: "Uppföljning ändrades", event_lost_reason_updated: "Förlustorsak uppdaterades", event_access_updated: "Åtkomst uppdaterades",
    new: "Ny", viewed: "Visad", contacted: "Kontaktad", qualified: "Kvalificerad", quoted: "Offert skickad", won: "Vunnen", lost: "Förlorad", archived: "Arkiverad", low: "Låg", normal: "Normal", high: "Hög", urgent: "Brådskande", company_profile: "Företagsprofil", company_site: "Företagswebbplats", marketplace: "Marknadsplats", manual: "Manuell", admin: "Admin", seo: "SEO", google: "Google", other: "Annan",
  },
  en: {
    back: "Back to leads", eyebrow: "Customer lead", title: "Lead details", company: "Company", customer: "Customer", contact: "Contact", service: "Service", city: "City", preferredDate: "Preferred date", submitted: "Submitted", source: "Source", leadType: "Lead type", access: "Access", firstViewed: "First viewed", lastActivity: "Last activity", status: "Status", priority: "Priority", score: "Lead score", estimatedValue: "Estimated value, SEK", quotedValue: "Quoted value, SEK", followUp: "Follow up", notes: "Internal notes", lostReason: "Lost reason", save: "Save lead", saved: "Lead saved.", saveError: "Lead could not be saved.", call: "Call", email: "Email", openCompany: "View company", openSource: "Open source", message: "Customer description", timeline: "Activity", noActivity: "No activity recorded yet.", direct: "Direct", marketplaceType: "Marketplace", distributed: "Distributed", included: "Included", paid: "Paid", locked: "Locked",
    event_created: "Lead created", event_viewed: "Lead viewed", event_status_changed: "Status changed", event_priority_changed: "Priority changed", event_notes_updated: "Notes updated", event_score_updated: "Score updated", event_value_updated: "Value updated", event_follow_up_changed: "Follow-up changed", event_lost_reason_updated: "Lost reason updated", event_access_updated: "Access updated",
    new: "New", viewed: "Viewed", contacted: "Contacted", qualified: "Qualified", quoted: "Quoted", won: "Won", lost: "Lost", archived: "Archived", low: "Low", normal: "Normal", high: "High", urgent: "Urgent", company_profile: "Company profile", company_site: "Company website", marketplace: "Marketplace", manual: "Manual", admin: "Admin", seo: "SEO", google: "Google", other: "Other",
  },
  uk: {
    back: "До всіх лідів", eyebrow: "Клієнтський лід", title: "Деталі ліда", company: "Компанія", customer: "Клієнт", contact: "Контакти", service: "Послуга", city: "Місто", preferredDate: "Бажана дата", submitted: "Надіслано", source: "Джерело", leadType: "Тип ліда", access: "Доступ", firstViewed: "Перший перегляд", lastActivity: "Остання активність", status: "Статус", priority: "Пріоритет", score: "Оцінка ліда", estimatedValue: "Орієнтовна вартість, SEK", quotedValue: "Запропонована ціна, SEK", followUp: "Follow-up", notes: "Внутрішні нотатки", lostReason: "Причина втрати", save: "Зберегти лід", saved: "Лід збережено.", saveError: "Не вдалося зберегти лід.", call: "Подзвонити", email: "Email", openCompany: "Переглянути компанію", openSource: "Відкрити джерело", message: "Опис клієнта", timeline: "Активність", noActivity: "Активності поки немає.", direct: "Прямий", marketplaceType: "Маркетплейс", distributed: "Розподілений", included: "Включено", paid: "Платний", locked: "Заблокований",
    event_created: "Лід створено", event_viewed: "Лід переглянуто", event_status_changed: "Статус змінено", event_priority_changed: "Пріоритет змінено", event_notes_updated: "Нотатки оновлено", event_score_updated: "Оцінку оновлено", event_value_updated: "Вартість оновлено", event_follow_up_changed: "Follow-up змінено", event_lost_reason_updated: "Причину втрати оновлено", event_access_updated: "Доступ оновлено",
    new: "Новий", viewed: "Переглянутий", contacted: "Зв’язалися", qualified: "Кваліфікований", quoted: "Ціну надіслано", won: "Виграний", lost: "Втрачений", archived: "Архів", low: "Низький", normal: "Звичайний", high: "Високий", urgent: "Терміновий", company_profile: "Профіль компанії", company_site: "Сайт компанії", marketplace: "Маркетплейс", manual: "Вручну", admin: "Адмін", seo: "SEO", google: "Google", other: "Інше",
  },
  ru: {
    back: "Ко всем лидам", eyebrow: "Клиентский лид", title: "Детали лида", company: "Компания", customer: "Клиент", contact: "Контакты", service: "Услуга", city: "Город", preferredDate: "Желаемая дата", submitted: "Отправлено", source: "Источник", leadType: "Тип лида", access: "Доступ", firstViewed: "Первый просмотр", lastActivity: "Последняя активность", status: "Статус", priority: "Приоритет", score: "Оценка лида", estimatedValue: "Ориентировочная стоимость, SEK", quotedValue: "Предложенная цена, SEK", followUp: "Follow-up", notes: "Внутренние заметки", lostReason: "Причина потери", save: "Сохранить лид", saved: "Лид сохранен.", saveError: "Не удалось сохранить лид.", call: "Позвонить", email: "Email", openCompany: "Посмотреть компанию", openSource: "Открыть источник", message: "Описание клиента", timeline: "Активность", noActivity: "Активности пока нет.", direct: "Прямой", marketplaceType: "Маркетплейс", distributed: "Распределенный", included: "Включено", paid: "Платный", locked: "Заблокирован",
    event_created: "Лид создан", event_viewed: "Лид просмотрен", event_status_changed: "Статус изменен", event_priority_changed: "Приоритет изменен", event_notes_updated: "Заметки обновлены", event_score_updated: "Оценка обновлена", event_value_updated: "Стоимость обновлена", event_follow_up_changed: "Follow-up изменен", event_lost_reason_updated: "Причина потери обновлена", event_access_updated: "Доступ обновлен",
    new: "Новый", viewed: "Просмотрен", contacted: "Связались", qualified: "Квалифицирован", quoted: "Цена отправлена", won: "Выигран", lost: "Потерян", archived: "Архив", low: "Низкий", normal: "Обычный", high: "Высокий", urgent: "Срочный", company_profile: "Профиль компании", company_site: "Сайт компании", marketplace: "Маркетплейс", manual: "Вручную", admin: "Админ", seo: "SEO", google: "Google", other: "Другое",
  },
  pl: {
    back: "Do wszystkich leadów", eyebrow: "Lead klienta", title: "Szczegóły leada", company: "Firma", customer: "Klient", contact: "Kontakt", service: "Usługa", city: "Miasto", preferredDate: "Preferowana data", submitted: "Wysłano", source: "Źródło", leadType: "Typ leada", access: "Dostęp", firstViewed: "Pierwsze wyświetlenie", lastActivity: "Ostatnia aktywność", status: "Status", priority: "Priorytet", score: "Ocena leada", estimatedValue: "Szacowana wartość, SEK", quotedValue: "Wartość wyceny, SEK", followUp: "Follow-up", notes: "Notatki wewnętrzne", lostReason: "Powód utraty", save: "Zapisz lead", saved: "Lead zapisany.", saveError: "Nie udało się zapisać leada.", call: "Zadzwoń", email: "Email", openCompany: "Zobacz firmę", openSource: "Otwórz źródło", message: "Opis klienta", timeline: "Aktywność", noActivity: "Brak zarejestrowanej aktywności.", direct: "Bezpośredni", marketplaceType: "Marketplace", distributed: "Dystrybuowany", included: "W cenie", paid: "Płatny", locked: "Zablokowany",
    event_created: "Lead utworzony", event_viewed: "Lead wyświetlony", event_status_changed: "Status zmieniony", event_priority_changed: "Priorytet zmieniony", event_notes_updated: "Notatki zaktualizowane", event_score_updated: "Ocena zaktualizowana", event_value_updated: "Wartość zaktualizowana", event_follow_up_changed: "Follow-up zmieniony", event_lost_reason_updated: "Powód utraty zaktualizowany", event_access_updated: "Dostęp zaktualizowany",
    new: "Nowy", viewed: "Wyświetlony", contacted: "Skontaktowano", qualified: "Zakwalifikowany", quoted: "Wycena wysłana", won: "Wygrany", lost: "Utracony", archived: "Archiwum", low: "Niski", normal: "Normalny", high: "Wysoki", urgent: "Pilny", company_profile: "Profil firmy", company_site: "Strona firmy", marketplace: "Marketplace", manual: "Ręcznie", admin: "Admin", seo: "SEO", google: "Google", other: "Inne",
  },
}

function getCompany(lead: Lead) {
  if (!lead.companies) return null
  return Array.isArray(lead.companies) ? lead.companies[0] ?? null : lead.companies
}

function formatDate(value: string | null, locale: Locale, withTime = false) {
  if (!value) return "—"
  const localeMap: Record<Locale, string> = { sv: "sv-SE", en: "en-GB", uk: "uk-UA", ru: "ru-RU", pl: "pl-PL" }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat(localeMap[locale], withTime ? { dateStyle: "medium", timeStyle: "short" } : { dateStyle: "medium" }).format(date)
}

function toInputDateTime(value: string | null) {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function eventLabel(eventType: string, t: Copy) {
  const key = `event_${eventType}` as keyof Copy
  return typeof t[key] === "string" ? t[key] : eventType.replaceAll("_", " ")
}

function sourceHref(value: string | null) {
  if (!value) return null
  if (value.startsWith("/")) return value
  if (/^https?:\/\//i.test(value)) return value
  return null
}

export default async function CompanyLeadDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE)
  const t = copy[locale]
  const bookingT = bookingCopy[locale]
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/dashboard/company-leads/${id}`)

  const { data, error } = await supabase
    .from("company_quote_requests")
    .select(`
      id, company_id, customer_name, customer_email, customer_phone, service_type,
      city, preferred_date, message, status, priority, source, source_url, lead_type,
      first_viewed_at, owner_notes, lead_score, estimated_value, quoted_value, currency,
      lost_reason, follow_up_at, lead_access, is_paid, lead_price, unlocked_at,
      last_activity_at, created_at, updated_at,
      companies ( id, name, slug )
    `)
    .eq("id", id)
    .maybeSingle()

  if (error) console.error("Load company lead detail error:", error)
  if (!data) notFound()

  const lead = data as Lead
  const company = getCompany(lead)
  const status = normalizeCompanyLeadStatus(lead.status)
  const priority = normalizeCompanyLeadPriority(lead.priority)
  const source = normalizeCompanyLeadSource(lead.source)
  const href = sourceHref(lead.source_url)

  const { data: activityData, error: activityError } = await supabase
    .from("company_quote_request_activity")
    .select("id, event_type, from_status, to_status, metadata, created_at")
    .eq("quote_request_id", id)
    .order("created_at", { ascending: false })
    .limit(100)

  if (activityError) console.error("Load company lead activity error:", activityError)
  const activities = (activityData ?? []) as Activity[]

  const statusLabels = Object.fromEntries([
    "new", "viewed", "contacted", "qualified", "quoted", "won", "lost", "archived",
  ].map((key) => [key, t[key as CompanyLeadStatus]])) as Record<CompanyLeadStatus, string>

  const leadTypeLabel = lead.lead_type === "distributed" ? t.distributed : lead.lead_type === "marketplace" ? t.marketplaceType : t.direct
  const accessLabel = lead.lead_access === "locked" ? t.locked : lead.lead_access === "paid" ? t.paid : t.included

  return (
    <main className="min-h-screen bg-slate-50">
      <LeadViewTracker leadId={lead.id} />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8">
          <Link href="/dashboard/company-leads" className="text-sm font-bold text-slate-500 hover:text-rose-600">← {t.back}</Link>
          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-rose-600">{t.eyebrow}</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">{lead.customer_name}</h1>
              <p className="mt-3 text-slate-600">{company?.name || t.company} · {lead.service_type || "—"} · {lead.city || "—"}</p>
            </div>
            <div className="w-full max-w-xs"><p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">{t.status}</p><LeadStatusSelect leadId={lead.id} value={status} labels={statusLabels} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="space-y-7">
          {query.saved === "true" ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">{t.saved}</div> : null}
          {query.error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{t.saveError}</div> : null}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">{t.customer}</h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Detail label={t.email} value={lead.customer_email} href={`mailto:${lead.customer_email}`} />
              {lead.customer_phone ? <Detail label={t.contact} value={lead.customer_phone} href={`tel:${lead.customer_phone.replace(/\s+/g, "")}`} /> : null}
              <Detail label={t.service} value={lead.service_type || "—"} />
              <Detail label={t.city} value={lead.city || "—"} />
              <Detail label={t.preferredDate} value={formatDate(lead.preferred_date, locale)} />
              <Detail label={t.submitted} value={formatDate(lead.created_at, locale, true)} />
            </dl>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-slate-400">{t.message}</p><p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">{lead.message}</p></div>
            <div className="mt-5 flex flex-wrap gap-3">
              {lead.customer_phone ? <a href={`tel:${lead.customer_phone.replace(/\s+/g, "")}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-black text-white">{t.call}</a> : null}
              <a href={`mailto:${lead.customer_email}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700">{t.email}</a>
              {company ? <Link href={`/companies/${company.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-black text-slate-700">{t.openCompany}</Link> : null}
              {href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-black text-rose-700">{t.openSource}</a> : null}
              {company && ["quoted", "won"].includes(status) ? (
                <Link href={`/dashboard/company-bookings/new?lead=${lead.id}`} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700">
                  {bookingT.convertLead}
                </Link>
              ) : null}
            </div>
          </section>

          <form action={updateCompanyLeadDetailsAction} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <input type="hidden" name="lead_id" value={lead.id} />
            <h2 className="text-2xl font-black text-slate-950">Lead management</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <FieldSelect name="priority" label={t.priority} defaultValue={priority}>{COMPANY_LEAD_PRIORITIES.map((item) => <option key={item} value={item}>{t[item]}</option>)}</FieldSelect>
              <FieldInput name="lead_score" label={t.score} type="number" min="0" max="100" step="1" defaultValue={lead.lead_score?.toString() || ""} />
              <FieldInput name="estimated_value" label={t.estimatedValue} type="number" min="0" step="1" defaultValue={lead.estimated_value?.toString() || ""} />
              <FieldInput name="quoted_value" label={t.quotedValue} type="number" min="0" step="1" defaultValue={lead.quoted_value?.toString() || ""} />
              <FieldInput name="follow_up_at" label={t.followUp} type="datetime-local" defaultValue={toInputDateTime(lead.follow_up_at)} />
              <div className="sm:col-span-2"><label className="text-sm font-black text-slate-900">{t.notes}</label><textarea name="owner_notes" rows={6} defaultValue={lead.owner_notes || ""} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100" /></div>
              <div className="sm:col-span-2"><label className="text-sm font-black text-slate-900">{t.lostReason}</label><textarea name="lost_reason" rows={3} defaultValue={lead.lost_reason || ""} className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100" /></div>
            </div>
            <button type="submit" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 text-sm font-black text-white hover:bg-rose-700">{t.save}</button>
          </form>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">{t.timeline}</h2>
            {activities.length ? <div className="mt-6 space-y-4">{activities.map((activity) => <div key={activity.id} className="flex gap-4"><div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-rose-500" /><div><p className="font-black text-slate-900">{eventLabel(activity.event_type, t)}</p>{activity.from_status && activity.to_status ? <p className="mt-1 text-sm text-slate-500">{t[normalizeCompanyLeadStatus(activity.from_status)]} → {t[normalizeCompanyLeadStatus(activity.to_status)]}</p> : null}<p className="mt-1 text-xs text-slate-400">{formatDate(activity.created_at, locale, true)}</p></div></div>)}</div> : <p className="mt-5 text-sm text-slate-500">{t.noActivity}</p>}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Lead metadata</h2>
            <dl className="mt-5 space-y-4">
              <Detail label={t.source} value={t[source]} />
              <Detail label={t.leadType} value={leadTypeLabel} />
              <Detail label={t.access} value={`${accessLabel}${lead.is_paid ? " · paid" : ""}`} />
              <Detail label={t.firstViewed} value={formatDate(lead.first_viewed_at, locale, true)} />
              <Detail label={t.lastActivity} value={formatDate(lead.last_activity_at, locale, true)} />
              {lead.lead_price !== null ? <Detail label="Lead price" value={`${lead.lead_price} SEK`} /> : null}
            </dl>
          </section>
        </aside>
      </section>
    </main>
  )
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  return <div><dt className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-bold text-slate-800">{href ? <a href={href} className="hover:text-rose-600">{value}</a> : value}</dd></div>
}

function FieldInput(props: { name: string; label: string; type?: string; min?: string; max?: string; step?: string; defaultValue?: string }) {
  const { label, ...inputProps } = props
  return <label><span className="text-sm font-black text-slate-900">{label}</span><input {...inputProps} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100" /></label>
}

function FieldSelect({ name, label, defaultValue, children }: { name: string; label: string; defaultValue: string; children: React.ReactNode }) {
  return <label><span className="text-sm font-black text-slate-900">{label}</span><select name={name} defaultValue={defaultValue} className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100">{children}</select></label>
}
