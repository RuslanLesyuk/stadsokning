import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

type JobStatus = "new" | "assigned" | "in_progress" | "done" | "cancelled" | null
type JobsView = "active" | "completed"

type Job = {
  id: string
  title: string
  description: string | null
  city: string | null
  budget: number | null
  job_type: string | null
  property_type: string | null
  status: JobStatus
  created_at: string
  created_by: string | null
  assigned_to: string | null
}

type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
}

type JobsCopy = {
  title: string
  subtitle: string
  filters: string
  search_placeholder: string
  city_placeholder: string
  all_statuses: string
  all_job_types: string
  all_property_types: string
  active_tab: string
  completed_tab: string
  active_results: string
  completed_results: string
  active_description: string
  completed_description: string
  in_history: string
  status_new: string
  status_assigned: string
  status_in_progress: string
  status_done: string
  status_cancelled: string
  job_type_home_cleaning: string
  job_type_office_cleaning: string
  property_type_apartment: string
  property_type_house: string
  property_type_office: string
  property_type_other: string
  newest: string
  oldest: string
  highest_budget: string
  lowest_budget: string
  apply: string
  clear: string
  results: string
  open_job: string
  no_jobs: string
  no_jobs_description_active: string
  no_jobs_description_completed: string
  no_jobs_secondary_cta: string
  no_city: string
  no_budget: string
  created: string
  budget: string
  status: string
  job_type: string
  property_type: string
  city: string
  post_job: string
  browse_hint: string
  author: string
  worker: string
  no_company: string
  unknown_user: string
}

const copy: Record<Locale, JobsCopy> = {
  uk: {
    title: "Роботи",
    subtitle: "Знайдіть клінінгову роботу у вашому місті.",
    filters: "Фільтри",
    search_placeholder: "Пошук за назвою або описом",
    city_placeholder: "Місто",
    all_statuses: "Усі статуси",
    all_job_types: "Усі типи робіт",
    all_property_types: "Усі типи об'єктів",
    active_tab: "Активні",
    completed_tab: "Завершені",
    active_results: "Активні роботи",
    completed_results: "Завершені та скасовані",
    active_description: "Поточні замовлення для пошуку та роботи.",
    completed_description: "Історія завершених і скасованих замовлень без шуму в основному потоці.",
    in_history: "в історії",
    status_new: "Нове",
    status_assigned: "Призначено",
    status_in_progress: "В процесі",
    status_done: "Завершено",
    status_cancelled: "Скасовано",
    job_type_home_cleaning: "Прибирання дому",
    job_type_office_cleaning: "Прибирання офісу",
    property_type_apartment: "Квартира",
    property_type_house: "Будинок",
    property_type_office: "Офіс",
    property_type_other: "Інше",
    newest: "Спочатку нові",
    oldest: "Спочатку старі",
    highest_budget: "Найвищий бюджет",
    lowest_budget: "Найнижчий бюджет",
    apply: "Застосувати",
    clear: "Очистити",
    results: "Результати",
    open_job: "Відкрити",
    no_jobs: "Нічого не знайдено",
    no_jobs_description_active:
      "Зараз немає активних замовлень за цими фільтрами. Спробуйте змінити пошук або створіть нове оголошення.",
    no_jobs_description_completed:
      "У завершеній історії зараз немає замовлень за цими фільтрами. Спробуйте змінити пошук або скинути фільтри.",
    no_jobs_secondary_cta: "Скинути фільтри",
    no_city: "Місто не вказано",
    no_budget: "Бюджет не вказано",
    created: "Створено",
    budget: "Бюджет",
    status: "Статус",
    job_type: "Тип роботи",
    property_type: "Тип об'єкта",
    city: "Місто",
    post_job: "Створити роботу",
    browse_hint: "Переглядайте замовлення, фільтруйте та відкривайте деталі.",
    author: "Автор",
    worker: "Виконавець",
    no_company: "Без компанії",
    unknown_user: "Користувач",
  },
  ru: {
    title: "Работы",
    subtitle: "Найдите клининговую работу в вашем городе.",
    filters: "Фильтры",
    search_placeholder: "Поиск по названию или описанию",
    city_placeholder: "Город",
    all_statuses: "Все статусы",
    all_job_types: "Все типы работ",
    all_property_types: "Все типы объектов",
    active_tab: "Активные",
    completed_tab: "Завершённые",
    active_results: "Активные работы",
    completed_results: "Завершённые и отменённые",
    active_description: "Текущие заказы для поиска и работы.",
    completed_description: "История завершённых и отменённых заказов без шума в основном потоке.",
    in_history: "в истории",
    status_new: "Новый",
    status_assigned: "Назначено",
    status_in_progress: "В процессе",
    status_done: "Завершено",
    status_cancelled: "Отменено",
    job_type_home_cleaning: "Уборка дома",
    job_type_office_cleaning: "Уборка офиса",
    property_type_apartment: "Квартира",
    property_type_house: "Дом",
    property_type_office: "Офис",
    property_type_other: "Другое",
    newest: "Сначала новые",
    oldest: "Сначала старые",
    highest_budget: "Самый высокий бюджет",
    lowest_budget: "Самый низкий бюджет",
    apply: "Применить",
    clear: "Очистить",
    results: "Результаты",
    open_job: "Открыть",
    no_jobs: "Ничего не найдено",
    no_jobs_description_active:
      "Сейчас нет активных заказов по этим фильтрам. Попробуйте изменить поиск или создайте новое объявление.",
    no_jobs_description_completed:
      "В завершённой истории сейчас нет заказов по этим фильтрам. Попробуйте изменить поиск или сбросить фильтры.",
    no_jobs_secondary_cta: "Сбросить фильтры",
    no_city: "Город не указан",
    no_budget: "Бюджет не указан",
    created: "Создано",
    budget: "Бюджет",
    status: "Статус",
    job_type: "Тип работы",
    property_type: "Тип объекта",
    city: "Город",
    post_job: "Создать работу",
    browse_hint: "Просматривайте заказы, фильтруйте и открывайте детали.",
    author: "Автор",
    worker: "Исполнитель",
    no_company: "Без компании",
    unknown_user: "Пользователь",
  },
  en: {
    title: "Jobs",
    subtitle: "Find cleaning jobs in your city.",
    filters: "Filters",
    search_placeholder: "Search by title or description",
    city_placeholder: "City",
    all_statuses: "All statuses",
    all_job_types: "All job types",
    all_property_types: "All property types",
    active_tab: "Active",
    completed_tab: "Completed",
    active_results: "Active jobs",
    completed_results: "Completed and cancelled",
    active_description: "Current jobs available for browsing and work.",
    completed_description: "History of completed and cancelled jobs without cluttering the main flow.",
    in_history: "in history",
    status_new: "New",
    status_assigned: "Assigned",
    status_in_progress: "In progress",
    status_done: "Done",
    status_cancelled: "Cancelled",
    job_type_home_cleaning: "Home cleaning",
    job_type_office_cleaning: "Office cleaning",
    property_type_apartment: "Apartment",
    property_type_house: "House",
    property_type_office: "Office",
    property_type_other: "Other",
    newest: "Newest first",
    oldest: "Oldest first",
    highest_budget: "Highest budget",
    lowest_budget: "Lowest budget",
    apply: "Apply",
    clear: "Clear",
    results: "Results",
    open_job: "Open",
    no_jobs: "No jobs found",
    no_jobs_description_active:
      "There are no active jobs matching these filters right now. Try adjusting your search or create a new job.",
    no_jobs_description_completed:
      "There are no completed jobs matching these filters right now. Try adjusting your search or reset the filters.",
    no_jobs_secondary_cta: "Reset filters",
    no_city: "City not specified",
    no_budget: "Budget not specified",
    created: "Created",
    budget: "Budget",
    status: "Status",
    job_type: "Job type",
    property_type: "Property type",
    city: "City",
    post_job: "Post job",
    browse_hint: "Browse jobs, filter them, and open details.",
    author: "Author",
    worker: "Worker",
    no_company: "No company",
    unknown_user: "User",
  },
  sv: {
    title: "Jobb",
    subtitle: "Hitta städjobb i din stad.",
    filters: "Filter",
    search_placeholder: "Sök på titel eller beskrivning",
    city_placeholder: "Stad",
    all_statuses: "Alla statusar",
    all_job_types: "Alla jobbtyper",
    all_property_types: "Alla objekttyper",
    active_tab: "Aktiva",
    completed_tab: "Slutförda",
    active_results: "Aktiva jobb",
    completed_results: "Slutförda och avbrutna",
    active_description: "Aktuella jobb för sökning och arbete.",
    completed_description: "Historik över slutförda och avbrutna jobb utan att störa huvudflödet.",
    in_history: "i historiken",
    status_new: "Ny",
    status_assigned: "Tilldelad",
    status_in_progress: "Pågår",
    status_done: "Klar",
    status_cancelled: "Avbruten",
    job_type_home_cleaning: "Hemstädning",
    job_type_office_cleaning: "Kontorsstädning",
    property_type_apartment: "Lägenhet",
    property_type_house: "Hus",
    property_type_office: "Kontor",
    property_type_other: "Annat",
    newest: "Nyaste först",
    oldest: "Äldsta först",
    highest_budget: "Högst budget",
    lowest_budget: "Lägst budget",
    apply: "Använd",
    clear: "Rensa",
    results: "Resultat",
    open_job: "Öppna",
    no_jobs: "Inga jobb hittades",
    no_jobs_description_active:
      "Det finns inga aktiva jobb som matchar dessa filter just nu. Prova att ändra din sökning eller skapa ett nytt jobb.",
    no_jobs_description_completed:
      "Det finns inga slutförda jobb som matchar dessa filter just nu. Prova att ändra din sökning eller återställ filtren.",
    no_jobs_secondary_cta: "Återställ filter",
    no_city: "Ingen stad angiven",
    no_budget: "Ingen budget angiven",
    created: "Skapad",
    budget: "Budget",
    status: "Status",
    job_type: "Jobbtyp",
    property_type: "Typ av objekt",
    city: "Stad",
    post_job: "Skapa jobb",
    browse_hint: "Bläddra bland jobb, filtrera och öppna detaljer.",
    author: "Skapad av",
    worker: "Arbetare",
    no_company: "Inget företag",
    unknown_user: "Användare",
  },
  pl: {
    title: "Prace",
    subtitle: "Znajdź pracę przy sprzątaniu w swoim mieście.",
    filters: "Filtry",
    search_placeholder: "Szukaj po tytule lub opisie",
    city_placeholder: "Miasto",
    all_statuses: "Wszystkie statusy",
    all_job_types: "Wszystkie typy prac",
    all_propertyTypes: "Wszystkie typy obiektów",
    all_property_types: "Wszystkie typy obiektów",
    active_tab: "Aktywne",
    completed_tab: "Zakończone",
    active_results: "Aktywne zlecenia",
    completed_results: "Zakończone i anulowane",
    active_description: "Bieżące zlecenia do przeglądania i wykonywania.",
    completed_description: "Historia zakończonych i anulowanych zleceń bez zaśmiecania głównego widoku.",
    in_history: "w historii",
    status_new: "Nowe",
    status_assigned: "Przypisane",
    status_in_progress: "W trakcie",
    status_done: "Zakończone",
    status_cancelled: "Anulowane",
    job_type_home_cleaning: "Sprzątanie domu",
    job_type_office_cleaning: "Sprzątanie biura",
    property_type_apartment: "Mieszkanie",
    property_type_house: "Dom",
    property_type_office: "Biuro",
    property_type_other: "Inne",
    newest: "Najnowsze",
    oldest: "Najstarsze",
    highest_budget: "Najwyższy budżet",
    lowest_budget: "Najniższy budżet",
    apply: "Zastosuj",
    clear: "Wyczyść",
    results: "Wyniki",
    open_job: "Otwórz",
    no_jobs: "Nie znaleziono zleceń",
    no_jobs_description_active:
      "Obecnie nie ma aktywnych zleceń pasujących do tych filtrów. Spróbuj zmienić wyszukiwanie lub dodaj nowe zlecenie.",
    no_jobs_description_completed:
      "Obecnie nie ma zakończonych zleceń pasujących do tych filtrów. Spróbuj zmienić wyszukiwanie lub zresetuj filtry.",
    no_jobs_secondary_cta: "Resetuj filtry",
    no_city: "Nie podano miasta",
    no_budget: "Nie podano budżetu",
    created: "Utworzono",
    budget: "Budżet",
    status: "Status",
    job_type: "Typ pracy",
    property_type: "Typ obiektu",
    city: "Miasto",
    post_job: "Dodaj zlecenie",
    browse_hint: "Przeglądaj zlecenia, filtruj i otwieraj szczegóły.",
    author: "Autor",
    worker: "Wykonawca",
    no_company: "Bez firmy",
    unknown_user: "Użytkownik",
  },
}

function formatDate(value: string, locale: Locale) {
  try {
    const map: Record<Locale, string> = {
      uk: "uk-UA",
      ru: "ru-RU",
      en: "en-US",
      sv: "sv-SE",
      pl: "pl-PL",
    }

    return new Intl.DateTimeFormat(map[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatBudget(value: number | null, t: JobsCopy) {
  if (value == null) return t.no_budget
  return `${value} kr`
}

function getStatusLabel(status: JobStatus, t: JobsCopy) {
  switch (status) {
    case "new":
      return t.status_new
    case "assigned":
      return t.status_assigned
    case "in_progress":
      return t.status_in_progress
    case "done":
      return t.status_done
    case "cancelled":
      return t.status_cancelled
    default:
      return "—"
  }
}

function getStatusClasses(status: JobStatus) {
  switch (status) {
    case "new":
      return "border-slate-200 bg-slate-100 text-slate-700"
    case "assigned":
      return "border-sky-200 bg-sky-50 text-sky-700"
    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "done":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700"
    default:
      return "border-slate-200 bg-slate-100 text-slate-700"
  }
}

function getJobTypeLabel(jobType: string | null, t: JobsCopy) {
  switch (jobType) {
    case "home_cleaning":
      return t.job_type_home_cleaning
    case "office_cleaning":
      return t.job_type_office_cleaning
    default:
      return "—"
  }
}

function getPropertyTypeLabel(propertyType: string | null, t: JobsCopy) {
  switch (propertyType) {
    case "apartment":
      return t.property_type_apartment
    case "house":
      return t.property_type_house
    case "office":
      return t.property_type_office
    case "other":
      return t.property_type_other
    default:
      return "—"
  }
}

function truncate(text: string | null | undefined, max = 170) {
  if (!text) return ""
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

function isCompletedStatus(status: JobStatus) {
  return status === "done" || status === "cancelled"
}

function getInitials(name: string) {
  const clean = name.trim()
  if (!clean) return "U"
  const parts = clean.split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function buildHref(params: {
  view?: JobsView
  q?: string
  city?: string
  status?: string
  jobType?: string
  propertyType?: string
  sort?: string
}) {
  const search = new URLSearchParams()

  if (params.view && params.view !== "active") {
    search.set("view", params.view)
  }

  if (params.q) search.set("q", params.q)
  if (params.city) search.set("city", params.city)
  if (params.status) search.set("status", params.status)
  if (params.jobType) search.set("jobType", params.jobType)
  if (params.propertyType) search.set("propertyType", params.propertyType)
  if (params.sort && params.sort !== "newest") search.set("sort", params.sort)

  const queryString = search.toString()
  return queryString ? `/jobs?${queryString}` : "/jobs"
}

function JobsEmptyState({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/90 bg-white p-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
          🔎
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
          {title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
          {description}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={primaryHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
          >
            {primaryLabel}
          </Link>

          <Link
            href={secondaryHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

function FilterLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
      {children}
    </div>
  )
}

function PersonMiniCard({
  label,
  profile,
  fallbackName,
  fallbackCompany,
}: {
  label: string
  profile?: Profile | null
  fallbackName: string
  fallbackCompany: string
}) {
  const name = profile?.full_name?.trim() || fallbackName
  const companyName = profile?.company_name?.trim() || fallbackCompany

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 px-3 py-3">
      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            getInitials(name)
          )}
        </div>

        {profile?.company_logo_url ? (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
            <img
              src={profile.company_logo_url}
              alt={companyName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="truncate text-sm font-medium text-slate-900">{name}</div>
        <div className="truncate text-xs text-slate-500">{companyName}</div>
      </div>
    </div>
  )
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const params = (await searchParams) ?? {}

  const q = typeof params.q === "string" ? params.q.trim() : ""
  const city = typeof params.city === "string" ? params.city.trim() : ""
  const status = typeof params.status === "string" ? params.status.trim() : ""
  const jobType = typeof params.jobType === "string" ? params.jobType.trim() : ""
  const propertyType =
    typeof params.propertyType === "string" ? params.propertyType.trim() : ""
  const sort = typeof params.sort === "string" ? params.sort.trim() : "newest"
  const rawView = typeof params.view === "string" ? params.view.trim() : "active"
  const view: JobsView = rawView === "completed" ? "completed" : "active"

  const supabase = await createClient()

  let query = supabase
    .from("jobs")
    .select(
      "id, title, description, city, budget, job_type, property_type, status, created_at, created_by, assigned_to",
    )

  if (q) {
    const escaped = q.replaceAll(",", " ")
    query = query.or(`title.ilike.%${escaped}%,description.ilike.%${escaped}%`)
  }

  if (city) {
    query = query.ilike("city", `%${city}%`)
  }

  if (status) {
    query = query.eq("status", status)
  } else if (view === "completed") {
    query = query.in("status", ["done", "cancelled"])
  } else {
    query = query.in("status", ["new", "assigned", "in_progress"])
  }

  if (jobType) {
    query = query.eq("job_type", jobType)
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType)
  }

  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true })
  } else if (sort === "highest_budget") {
    query = query.order("budget", { ascending: false, nullsFirst: false })
  } else if (sort === "lowest_budget") {
    query = query.order("budget", { ascending: true, nullsFirst: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const { data, error } = await query.limit(100)

  if (error) {
    throw new Error(error.message)
  }

  const jobs = (data ?? []) as Job[]

  const profileIds = Array.from(
    new Set(
      jobs.flatMap((job) => [job.created_by, job.assigned_to].filter(Boolean) as string[]),
    ),
  )

  let profiles: Profile[] = []

  if (profileIds.length > 0) {
    const { data: profilesRaw, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, company_logo_url, company_name")
      .in("id", profileIds)

    if (profilesError) {
      throw new Error(profilesError.message)
    }

    profiles = (profilesRaw ?? []) as Profile[]
  }

  const profileById = new Map<string, Profile>()
  for (const profile of profiles) {
    profileById.set(profile.id, profile)
  }

  const clearHref = buildHref({ view })
  const activeTabHref = buildHref({
    view: "active",
    q,
    city,
    status: status && !isCompletedStatus(status as JobStatus) ? status : "",
    jobType,
    propertyType,
    sort,
  })
  const completedTabHref = buildHref({
    view: "completed",
    q,
    city,
    status: status && isCompletedStatus(status as JobStatus) ? status : "",
    jobType,
    propertyType,
    sort,
  })

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <section className="rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {t.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                {t.subtitle}
              </p>

              <p className="mt-2 text-sm text-slate-500">{t.browse_hint}</p>
            </div>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
            >
              {t.post_job}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={activeTabHref}
              prefetch={false}
              className={
                view === "active"
                  ? "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
                  : "inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
              }
            >
              {t.active_tab}
            </Link>

            <Link
              href={completedTabHref}
              prefetch={false}
              className={
                view === "completed"
                  ? "inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-950"
                  : "inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
              }
            >
              {t.completed_tab}
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
              {view === "active" ? t.active_description : t.completed_description}
            </div>

            {view === "completed" ? (
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                {jobs.length} {t.in_history}
              </div>
            ) : null}
          </div>

          <form
            method="get"
            className="mt-8 rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-5"
          >
            <input type="hidden" name="view" value={view} />

            <div className="mb-5 text-sm font-semibold tracking-tight text-slate-900">
              {t.filters}
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
              <div>
                <FilterLabel>{t.search_placeholder}</FilterLabel>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder={t.search_placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                />
              </div>

              <div>
                <FilterLabel>{t.city}</FilterLabel>
                <input
                  type="text"
                  name="city"
                  defaultValue={city}
                  placeholder={t.city_placeholder}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                />
              </div>

              <div>
                <FilterLabel>{t.status}</FilterLabel>
                <select
                  name="status"
                  defaultValue={status}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                >
                  <option value="">{t.all_statuses}</option>
                  {view === "active" ? (
                    <>
                      <option value="new">{t.status_new}</option>
                      <option value="assigned">{t.status_assigned}</option>
                      <option value="in_progress">{t.status_in_progress}</option>
                    </>
                  ) : (
                    <>
                      <option value="done">{t.status_done}</option>
                      <option value="cancelled">{t.status_cancelled}</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <FilterLabel>{t.job_type}</FilterLabel>
                <select
                  name="jobType"
                  defaultValue={jobType}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                >
                  <option value="">{t.all_job_types}</option>
                  <option value="home_cleaning">{t.job_type_home_cleaning}</option>
                  <option value="office_cleaning">{t.job_type_office_cleaning}</option>
                </select>
              </div>

              <div>
                <FilterLabel>{t.property_type}</FilterLabel>
                <select
                  name="propertyType"
                  defaultValue={propertyType}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                >
                  <option value="">{t.all_property_types}</option>
                  <option value="apartment">{t.property_type_apartment}</option>
                  <option value="house">{t.property_type_house}</option>
                  <option value="office">{t.property_type_office}</option>
                  <option value="other">{t.property_type_other}</option>
                </select>
              </div>

              <div>
                <FilterLabel>{t.results}</FilterLabel>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 active:scale-[0.995]"
                >
                  <option value="newest">{t.newest}</option>
                  <option value="oldest">{t.oldest}</option>
                  <option value="highest_budget">{t.highest_budget}</option>
                  <option value="lowest_budget">{t.lowest_budget}</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
              >
                {t.apply}
              </button>

              <Link
                href={clearHref}
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
              >
                {t.clear}
              </Link>
            </div>
          </form>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
                {view === "active" ? t.active_results : t.completed_results}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {view === "active" ? t.active_description : t.completed_description}
              </p>
            </div>

            <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-[0_1px_4px_rgba(15,23,42,0.03)]">
              {jobs.length}
            </div>
          </div>

          {jobs.length === 0 ? (
            <JobsEmptyState
              title={t.no_jobs}
              description={
                view === "active"
                  ? t.no_jobs_description_active
                  : t.no_jobs_description_completed
              }
              primaryLabel={t.post_job}
              primaryHref="/jobs/create"
              secondaryLabel={t.no_jobs_secondary_cta}
              secondaryHref={clearHref}
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => {
                const subdued = view === "completed" || isCompletedStatus(job.status)
                const authorProfile = job.created_by ? profileById.get(job.created_by) : null
                const workerProfile = job.assigned_to ? profileById.get(job.assigned_to) : null
                const authorName = authorProfile?.full_name?.trim() || t.unknown_user
                const workerName = workerProfile?.full_name?.trim() || t.unknown_user

                return (
                  <article
                    key={job.id}
                    className={
                      subdued
                        ? "group flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white/90 p-5 opacity-80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition duration-200"
                        : "group flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
                        >
                          {getStatusLabel(job.status, t)}
                        </span>
                      </div>

                      <div
                        className={
                          subdued
                            ? "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                            : "rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                        }
                      >
                        {formatDate(job.created_at, locale)}
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                      {job.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {job.city || t.no_city}
                      </span>

                      <span
                        className={
                          subdued
                            ? "inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                            : "inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                        }
                      >
                        {formatBudget(job.budget, t)}
                      </span>
                    </div>

                    {job.description ? (
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {truncate(job.description)}
                      </p>
                    ) : (
                      <div className="mt-4 text-sm leading-6 text-slate-400">—</div>
                    )}

                    <div className="mt-5 grid gap-3">
                      <PersonMiniCard
                        label={t.author}
                        profile={authorProfile}
                        fallbackName={authorName}
                        fallbackCompany={t.no_company}
                      />
                      {workerProfile ? (
                        <PersonMiniCard
                          label={t.worker}
                          profile={workerProfile}
                          fallbackName={workerName}
                          fallbackCompany={t.no_company}
                        />
                      ) : null}
                    </div>

                    <div className="mt-5 space-y-3 rounded-2xl bg-slate-50/80 p-4">
                      <div className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-slate-500">{t.job_type}</span>
                        <span className="text-right font-medium text-slate-900">
                          {getJobTypeLabel(job.job_type, t)}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-slate-500">{t.property_type}</span>
                        <span className="text-right font-medium text-slate-900">
                          {getPropertyTypeLabel(job.property_type, t)}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 text-sm">
                        <span className="text-slate-500">{t.status}</span>
                        <span className="text-right font-medium text-slate-900">
                          {getStatusLabel(job.status, t)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-1">
                      <Link
                        href={`/jobs/${job.id}`}
                        prefetch={false}
                        className={
                          subdued
                            ? "inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
                            : "inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
                        }
                      >
                        {t.open_job}
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}