import Link from "next/link"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

type JobStatus = "new" | "assigned" | "in_progress" | "done" | "cancelled" | null

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
  no_city: string
  no_budget: string
  created: string
  budget: string
  status: string
  job_type: string
  property_type: string
  post_job: string
  browse_hint: string
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
    no_jobs: "Наразі немає замовлень за цими фільтрами.",
    no_city: "Місто не вказано",
    no_budget: "Бюджет не вказано",
    created: "Створено",
    budget: "Бюджет",
    status: "Статус",
    job_type: "Тип роботи",
    property_type: "Тип об'єкта",
    post_job: "Створити роботу",
    browse_hint: "Переглядайте замовлення, фільтруйте та відкривайте деталі.",
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
    no_jobs: "Сейчас нет заказов по этим фильтрам.",
    no_city: "Город не указан",
    no_budget: "Бюджет не указан",
    created: "Создано",
    budget: "Бюджет",
    status: "Статус",
    job_type: "Тип работы",
    property_type: "Тип объекта",
    post_job: "Создать работу",
    browse_hint: "Просматривайте заказы, фильтруйте и открывайте детали.",
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
    no_jobs: "There are no jobs for these filters right now.",
    no_city: "City not specified",
    no_budget: "Budget not specified",
    created: "Created",
    budget: "Budget",
    status: "Status",
    job_type: "Job type",
    property_type: "Property type",
    post_job: "Post job",
    browse_hint: "Browse jobs, filter them, and open details.",
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
    no_jobs: "Det finns inga jobb för de här filtren just nu.",
    no_city: "Ingen stad angiven",
    no_budget: "Ingen budget angiven",
    created: "Skapad",
    budget: "Budget",
    status: "Status",
    job_type: "Jobbtyp",
    property_type: "Typ av objekt",
    post_job: "Skapa jobb",
    browse_hint: "Bläddra bland jobb, filtrera och öppna detaljer.",
  },
  pl: {
    title: "Prace",
    subtitle: "Znajdź pracę przy sprzątaniu w swoim mieście.",
    filters: "Filtry",
    search_placeholder: "Szukaj po tytule lub opisie",
    city_placeholder: "Miasto",
    all_statuses: "Wszystkie statusy",
    all_job_types: "Wszystkie typy prac",
    all_property_types: "Wszystkie typy obiektów",
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
    no_jobs: "Brak zleceń dla tych filtrów.",
    no_city: "Nie podano miasta",
    no_budget: "Nie podano budżetu",
    created: "Utworzono",
    budget: "Budżet",
    status: "Status",
    job_type: "Typ pracy",
    property_type: "Typ obiektu",
    post_job: "Dodaj zlecenie",
    browse_hint: "Przeglądaj zlecenia, filtruj i otwieraj szczegóły.",
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
      return "border-blue-200 bg-blue-50 text-blue-700"
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

function truncate(text: string | null | undefined, max = 160) {
  if (!text) return ""
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

function buildClearHref() {
  return "/jobs"
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

  const supabase = await createClient()

  let query = supabase
    .from("jobs")
    .select(
      "id, title, description, city, budget, job_type, property_type, status, created_at"
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {t.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              {t.subtitle}
            </p>
            <p className="mt-2 text-sm text-slate-500">{t.browse_hint}</p>
          </div>

          <Link
            href="/jobs/create"
            className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            {t.post_job}
          </Link>
        </div>

        <form method="get" className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 md:p-5">
          <div className="mb-4 text-sm font-semibold text-slate-900">{t.filters}</div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t.search_placeholder}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />

            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder={t.city_placeholder}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            />

            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">{t.all_statuses}</option>
              <option value="new">{t.status_new}</option>
              <option value="assigned">{t.status_assigned}</option>
              <option value="in_progress">{t.status_in_progress}</option>
              <option value="done">{t.status_done}</option>
              <option value="cancelled">{t.status_cancelled}</option>
            </select>

            <select
              name="jobType"
              defaultValue={jobType}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">{t.all_job_types}</option>
              <option value="home_cleaning">{t.job_type_home_cleaning}</option>
              <option value="office_cleaning">{t.job_type_office_cleaning}</option>
            </select>

            <select
              name="propertyType"
              defaultValue={propertyType}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="">{t.all_property_types}</option>
              <option value="apartment">{t.property_type_apartment}</option>
              <option value="house">{t.property_type_house}</option>
              <option value="office">{t.property_type_office}</option>
              <option value="other">{t.property_type_other}</option>
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="newest">{t.newest}</option>
              <option value="oldest">{t.oldest}</option>
              <option value="highest_budget">{t.highest_budget}</option>
              <option value="lowest_budget">{t.lowest_budget}</option>
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              {t.apply}
            </button>

            <Link
              href={buildClearHref()}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.clear}
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {t.results}
          </h2>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600">
            {jobs.length}
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <p className="mx-auto max-w-xl text-slate-500">{t.no_jobs}</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
                  >
                    {getStatusLabel(job.status, t)}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                  {job.title}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">{t.budget}</span>
                    <span className="text-right font-medium text-slate-900">
                      {formatBudget(job.budget, t)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">{t.status}</span>
                    <span className="text-right font-medium text-slate-900">
                      {getStatusLabel(job.status, t)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">{t.job_type}</span>
                    <span className="text-right font-medium text-slate-900">
                      {getJobTypeLabel(job.job_type, t)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">{t.property_type}</span>
                    <span className="text-right font-medium text-slate-900">
                      {getPropertyTypeLabel(job.property_type, t)}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">City</span>
                    <span className="text-right font-medium text-slate-900">
                      {job.city || t.no_city}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">{t.created}</span>
                    <span className="text-right font-medium text-slate-900">
                      {formatDate(job.created_at, locale)}
                    </span>
                  </div>
                </div>

                {job.description ? (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {truncate(job.description)}
                  </p>
                ) : null}

                <div className="mt-5 pt-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
                  >
                    {t.open_job}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}