import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import TakeJobForm from "@/components/take-job-form"

export const dynamic = "force-dynamic"

type JobStatus = "new" | "assigned" | "in_progress" | "done" | "cancelled" | null

type Job = {
  id: string
  title: string
  description: string | null
  city: string | null
  address: string | null
  budget: number | null
  job_type: string | null
  property_type: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  status: JobStatus
  created_at: string
  created_by: string
  assigned_to: string | null
}

type Profile = {
  id: string
  full_name: string | null
  city: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
}

type Review = {
  id: string
  reviewer_id: string
  review_target_id: string
  rating: number
  comment: string | null
  created_at: string
}

type Activity = {
  id: string
  type: string
  actor_id: string | null
  created_at: string
}

type Copy = {
  back: string
  city_missing: string
  budget_missing: string
  address_missing: string
  schedule_missing: string
  type_missing: string
  property_missing: string
  author: string
  worker: string
  unknown_user: string
  status: string
  created: string
  city: string
  address: string
  budget: string
  job_type: string
  property_type: string
  schedule: string
  description: string
  no_description: string
  chat: string
  edit: string
  reviews: string
  no_reviews: string
  activity: string
  no_activity: string
  rating: string
  take_job: string
  your_job: string
  worker_assigned: string
  history_state: string
  completed_hint: string
  cancelled_hint: string
  no_company: string
  status_new: string
  status_assigned: string
  status_in_progress: string
  status_done: string
  status_cancelled: string
  activity_job_created: string
  activity_job_assigned: string
  activity_status_changed: string
  activity_review_left: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    back: "Назад",
    city_missing: "Місто не вказано",
    budget_missing: "Бюджет не вказано",
    address_missing: "Адресу не вказано",
    schedule_missing: "Не вказано",
    type_missing: "Не вказано",
    property_missing: "Не вказано",
    author: "Автор",
    worker: "Виконавець",
    unknown_user: "Користувач",
    status: "Статус",
    created: "Створено",
    city: "Місто",
    address: "Адреса",
    budget: "Бюджет",
    job_type: "Тип роботи",
    property_type: "Тип об'єкта",
    schedule: "Дата і час",
    description: "Опис",
    no_description: "Опис не додано.",
    chat: "Відкрити чат",
    edit: "Редагувати",
    reviews: "Відгуки",
    no_reviews: "Ще немає відгуків.",
    activity: "Історія активності",
    no_activity: "Ще немає подій.",
    rating: "Оцінка",
    take_job: "Взяти замовлення",
    your_job: "Ваше замовлення",
    worker_assigned: "Є виконавець",
    history_state: "Історія",
    completed_hint: "Це замовлення завершене і збережене в історії.",
    cancelled_hint: "Це замовлення скасоване і збережене в історії.",
    no_company: "Без компанії",
    status_new: "Нове",
    status_assigned: "Призначено",
    status_in_progress: "В процесі",
    status_done: "Завершено",
    status_cancelled: "Скасовано",
    activity_job_created: "Замовлення створено",
    activity_job_assigned: "Виконавця призначено",
    activity_status_changed: "Статус змінено",
    activity_review_left: "Залишено відгук",
  },
  ru: {
    back: "Назад",
    city_missing: "Город не указан",
    budget_missing: "Бюджет не указан",
    address_missing: "Адрес не указан",
    schedule_missing: "Не указано",
    type_missing: "Не указано",
    property_missing: "Не указано",
    author: "Автор",
    worker: "Исполнитель",
    unknown_user: "Пользователь",
    status: "Статус",
    created: "Создано",
    city: "Город",
    address: "Адрес",
    budget: "Бюджет",
    job_type: "Тип работы",
    property_type: "Тип объекта",
    schedule: "Дата и время",
    description: "Описание",
    no_description: "Описание не добавлено.",
    chat: "Открыть чат",
    edit: "Редактировать",
    reviews: "Отзывы",
    no_reviews: "Отзывов пока нет.",
    activity: "История активности",
    no_activity: "Событий пока нет.",
    rating: "Оценка",
    take_job: "Взять заказ",
    your_job: "Ваш заказ",
    worker_assigned: "Есть исполнитель",
    history_state: "История",
    completed_hint: "Этот заказ завершён и сохранён в истории.",
    cancelled_hint: "Этот заказ отменён и сохранён в истории.",
    no_company: "Без компании",
    status_new: "Новый",
    status_assigned: "Назначено",
    status_in_progress: "В процессе",
    status_done: "Завершено",
    status_cancelled: "Отменено",
    activity_job_created: "Заказ создан",
    activity_job_assigned: "Исполнитель назначен",
    activity_status_changed: "Статус изменён",
    activity_review_left: "Оставлен отзыв",
  },
  en: {
    back: "Back",
    city_missing: "City not specified",
    budget_missing: "Budget not specified",
    address_missing: "Address not specified",
    schedule_missing: "Not specified",
    type_missing: "Not specified",
    property_missing: "Not specified",
    author: "Author",
    worker: "Worker",
    unknown_user: "User",
    status: "Status",
    created: "Created",
    city: "City",
    address: "Address",
    budget: "Budget",
    job_type: "Job type",
    property_type: "Property type",
    schedule: "Date and time",
    description: "Description",
    no_description: "No description added.",
    chat: "Open chat",
    edit: "Edit",
    reviews: "Reviews",
    no_reviews: "No reviews yet.",
    activity: "Activity timeline",
    no_activity: "No activity yet.",
    rating: "Rating",
    take_job: "Take job",
    your_job: "Your job",
    worker_assigned: "Worker assigned",
    history_state: "History",
    completed_hint: "This job is completed and kept in history.",
    cancelled_hint: "This job is cancelled and kept in history.",
    no_company: "No company",
    status_new: "New",
    status_assigned: "Assigned",
    status_in_progress: "In progress",
    status_done: "Done",
    status_cancelled: "Cancelled",
    activity_job_created: "Job created",
    activity_job_assigned: "Worker assigned",
    activity_status_changed: "Status changed",
    activity_review_left: "Review left",
  },
  sv: {
    back: "Tillbaka",
    city_missing: "Ingen stad angiven",
    budget_missing: "Ingen budget angiven",
    address_missing: "Ingen adress angiven",
    schedule_missing: "Inte angivet",
    type_missing: "Inte angivet",
    property_missing: "Inte angivet",
    author: "Skapad av",
    worker: "Arbetare",
    unknown_user: "Användare",
    status: "Status",
    created: "Skapad",
    city: "Stad",
    address: "Adress",
    budget: "Budget",
    job_type: "Jobbtyp",
    property_type: "Typ av objekt",
    schedule: "Datum och tid",
    description: "Beskrivning",
    no_description: "Ingen beskrivning tillagd.",
    chat: "Öppna chatt",
    edit: "Redigera",
    reviews: "Recensioner",
    no_reviews: "Inga recensioner ännu.",
    activity: "Aktivitetshistorik",
    no_activity: "Inga händelser ännu.",
    rating: "Betyg",
    take_job: "Ta jobbet",
    your_job: "Ditt jobb",
    worker_assigned: "Arbetare tilldelad",
    history_state: "Historik",
    completed_hint: "Det här jobbet är slutfört och sparat i historiken.",
    cancelled_hint: "Det här jobbet är avbrutet och sparat i historiken.",
    no_company: "Inget företag",
    status_new: "Ny",
    status_assigned: "Tilldelad",
    status_in_progress: "Pågår",
    status_done: "Klar",
    status_cancelled: "Avbruten",
    activity_job_created: "Jobb skapat",
    activity_job_assigned: "Arbetare tilldelad",
    activity_status_changed: "Status ändrad",
    activity_review_left: "Recension lämnad",
  },
  pl: {
    back: "Wróć",
    city_missing: "Nie podano miasta",
    budget_missing: "Nie podano budżetu",
    address_missing: "Nie podano adresu",
    schedule_missing: "Nie podano",
    type_missing: "Nie podano",
    property_missing: "Nie podano",
    author: "Autor",
    worker: "Wykonawca",
    unknown_user: "Użytkownik",
    status: "Status",
    created: "Utworzono",
    city: "Miasto",
    address: "Adres",
    budget: "Budżet",
    job_type: "Typ pracy",
    property_type: "Typ obiektu",
    schedule: "Data i godzina",
    description: "Opis",
    no_description: "Brak opisu.",
    chat: "Otwórz czat",
    edit: "Edytuj",
    reviews: "Opinie",
    no_reviews: "Brak opinii.",
    activity: "Historia aktywności",
    no_activity: "Brak zdarzeń.",
    rating: "Ocena",
    take_job: "Przyjmij zlecenie",
    your_job: "Twoje zlecenie",
    worker_assigned: "Pracownik przypisany",
    history_state: "Historia",
    completed_hint: "To zlecenie jest zakończone i zapisane w historii.",
    cancelled_hint: "To zlecenie jest anulowane i zapisane w historii.",
    no_company: "Bez firmy",
    status_new: "Nowe",
    status_assigned: "Przypisane",
    status_in_progress: "W trakcie",
    status_done: "Zakończone",
    status_cancelled: "Anulowane",
    activity_job_created: "Zlecenie utworzone",
    activity_job_assigned: "Przypisano wykonawcę",
    activity_status_changed: "Zmieniono status",
    activity_review_left: "Dodano opinię",
  },
}

function formatBudget(value: number | null, t: Copy) {
  if (value == null) return t.budget_missing
  return `${value} kr`
}

function formatDate(value: string, locale: Locale) {
  const map: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(map[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatDateTime(value: string, locale: Locale) {
  const map: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(map[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatSchedule(date: string | null, time: string | null, t: Copy) {
  if (!date && !time) return t.schedule_missing
  if (date && time) return `${date} • ${time}`
  return date || time || t.schedule_missing
}

function getStatusLabel(status: JobStatus, t: Copy) {
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function getActivityLabel(type: string, t: Copy) {
  switch (type) {
    case "job_created":
      return t.activity_job_created
    case "job_assigned":
      return t.activity_job_assigned
    case "status_changed":
      return t.activity_status_changed
    case "review_left":
      return t.activity_review_left
    default:
      return type.replaceAll("_", " ")
  }
}

function isHistoryStatus(status: JobStatus) {
  return status === "done" || status === "cancelled"
}

function PersonCard({
  label,
  profile,
  fallbackName,
  subdued = false,
  noCompanyLabel,
}: {
  label: string
  profile?: Profile | null
  fallbackName: string
  subdued?: boolean
  noCompanyLabel: string
}) {
  const name = profile?.full_name?.trim() || fallbackName
  const companyName = profile?.company_name?.trim() || noCompanyLabel

  return (
    <div
      className={
        subdued
          ? "rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-6"
          : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
      }
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            className={
              subdued
                ? "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-sm font-semibold text-white md:h-14 md:w-14 md:text-base"
                : "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white md:h-14 md:w-14 md:text-base"
            }
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
            ) : (
              getInitials(name)
            )}
          </div>

          {profile?.company_logo_url ? (
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
              <img
                src={profile.company_logo_url}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
            {label}
          </div>
          <div className="truncate text-base font-semibold tracking-tight text-slate-900 md:text-lg">
            {name}
          </div>
          <div className="mt-0.5 truncate text-sm text-slate-500">{companyName}</div>
          {profile?.city ? <div className="mt-0.5 text-sm text-slate-500">{profile.city}</div> : null}
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  subdued = false,
}: {
  label: string
  value: string
  subdued?: boolean
}) {
  return (
    <div
      className={
        subdued
          ? "rounded-3xl border border-slate-200 bg-white/90 p-4 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-5"
          : "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
      }
    >
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-medium text-slate-900 md:text-[15px]">
        {value}
      </div>
    </div>
  )
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 md:p-8">
      {text}
    </div>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: job } = await supabase
    .from("jobs")
    .select("title, description, city, budget")
    .eq("id", id)
    .single()

  if (!job) {
    return {
      title: "Job not found | Clean Jobs",
    }
  }

  const title = `${job.title}${job.city ? ` • ${job.city}` : ""}`
  const description =
    job.description?.trim() ||
    `Cleaning job${job.city ? ` in ${job.city}` : ""}${
      job.budget != null ? ` for ${job.budget} kr` : ""
    }`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  }
}

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/jobs/${id}`)
  }

  const { data: jobRaw, error: jobError } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      description,
      city,
      address,
      budget,
      job_type,
      property_type,
      scheduled_date,
      scheduled_time,
      status,
      created_at,
      created_by,
      assigned_to
    `)
    .eq("id", id)
    .single()

  if (jobError || !jobRaw) {
    notFound()
  }

  const job = jobRaw as Job
  const isOwner = job.created_by === user.id
  const isHistory = isHistoryStatus(job.status)

  const profileIds = Array.from(
    new Set([job.created_by, job.assigned_to].filter(Boolean) as string[]),
  )

  let profiles: Profile[] = []

  if (profileIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, city, avatar_url, company_logo_url, company_name")
      .in("id", profileIds)

    profiles = (data ?? []) as Profile[]
  }

  const profileById = new Map<string, Profile>()
  for (const profile of profiles) {
    profileById.set(profile.id, profile)
  }

  const author = profileById.get(job.created_by)
  const worker = job.assigned_to ? profileById.get(job.assigned_to) : null

  const authorName = author?.full_name?.trim() || t.unknown_user
  const workerName = worker?.full_name?.trim() || t.unknown_user

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("id, reviewer_id, review_target_id, rating, comment, created_at")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false })

  const reviews = (reviewsRaw ?? []) as Review[]

  const reviewUserIds = Array.from(
    new Set(reviews.flatMap((review) => [review.reviewer_id, review.review_target_id])),
  )

  if (reviewUserIds.length > 0) {
    const missingIds = reviewUserIds.filter((profileId) => !profileById.has(profileId))

    if (missingIds.length > 0) {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, city, avatar_url, company_logo_url, company_name")
        .in("id", missingIds)

      for (const profile of (data ?? []) as Profile[]) {
        profileById.set(profile.id, profile)
      }
    }
  }

  const { data: activityRaw } = await supabase
    .from("job_activity")
    .select("id, type, actor_id, created_at")
    .eq("job_id", job.id)
    .order("created_at", { ascending: false })

  const activity = (activityRaw ?? []) as Activity[]

  const canTakeJob =
    job.status === "new" &&
    job.assigned_to === null &&
    job.created_by !== user.id

  const canOpenChat =
    job.assigned_to !== null &&
    (job.created_by === user.id || job.assigned_to === user.id)

  const canEdit = isOwner && !isHistory

  const heroHint =
    job.status === "done"
      ? t.completed_hint
      : job.status === "cancelled"
        ? t.cancelled_hint
        : null

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-5 md:mb-6">
          <Link
            href="/jobs"
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.98]"
          >
            {t.back}
          </Link>
        </div>

        <section
          className={
            isHistory
              ? "rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] md:p-8"
              : "rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-rose-50/40 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8"
          }
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
                >
                  {getStatusLabel(job.status, t)}
                </span>

                {isOwner ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {t.your_job}
                  </span>
                ) : null}

                {job.assigned_to ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {t.worker_assigned}
                  </span>
                ) : null}

                {isHistory ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {t.history_state}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.city}: {job.city || t.city_missing}
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.budget}: {formatBudget(job.budget, t)}
                </span>
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.created}: {formatDate(job.created_at, locale)}
                </span>
              </div>

              {heroHint ? (
                <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
                  {heroHint}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <div className="flex flex-wrap gap-3">
                {author?.avatar_url ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-sm">
                    <img
                      src={author.avatar_url}
                      alt={authorName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-sm">
                    {getInitials(authorName)}
                  </div>
                )}

                {author?.company_logo_url ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
                    <img
                      src={author.company_logo_url}
                      alt={author.company_name?.trim() || t.no_company}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap">
                {canOpenChat ? (
                  <Link
                    href={`/jobs/${job.id}/chat`}
                    prefetch={false}
                    className={
                      isHistory
                        ? "inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
                        : "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-700"
                    }
                  >
                    {t.chat}
                  </Link>
                ) : null}

                {canEdit ? (
                  <Link
                    href={`/jobs/${job.id}/edit`}
                    prefetch={false}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
                  >
                    {t.edit}
                  </Link>
                ) : null}

                {canTakeJob ? <TakeJobForm jobId={job.id} /> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 md:mt-8">
          <PersonCard
            label={t.author}
            profile={author}
            fallbackName={authorName}
            subdued={isHistory}
            noCompanyLabel={t.no_company}
          />
          {worker ? (
            <PersonCard
              label={t.worker}
              profile={worker}
              fallbackName={workerName}
              subdued={isHistory}
              noCompanyLabel={t.no_company}
            />
          ) : null}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 md:mt-8">
          <InfoCard label={t.status} value={getStatusLabel(job.status, t)} subdued={isHistory} />
          <InfoCard label={t.city} value={job.city || t.city_missing} subdued={isHistory} />
          <InfoCard label={t.address} value={job.address || t.address_missing} subdued={isHistory} />
          <InfoCard label={t.budget} value={formatBudget(job.budget, t)} subdued={isHistory} />
          <InfoCard label={t.job_type} value={job.job_type || t.type_missing} subdued={isHistory} />
          <InfoCard
            label={t.property_type}
            value={job.property_type || t.property_missing}
            subdued={isHistory}
          />
          <InfoCard
            label={t.schedule}
            value={formatSchedule(job.scheduled_date, job.scheduled_time, t)}
            subdued={isHistory}
          />
        </section>

        <section
          className={
            isHistory
              ? "mt-6 rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:mt-8 md:p-6"
              : "mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-8 md:p-6"
          }
        >
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {t.description}
          </h2>

          <div className="mt-4 break-words text-sm leading-7 text-slate-700">
            {job.description?.trim() ? job.description : t.no_description}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr] md:mt-8 md:gap-8">
          <div
            className={
              isHistory
                ? "rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-6"
                : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            }
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {t.reviews}
            </h2>

            <div className="mt-5 space-y-4">
              {reviews.length === 0 ? (
                <EmptyPanel text={t.no_reviews} />
              ) : (
                reviews.map((review) => {
                  const reviewer = profileById.get(review.reviewer_id)
                  const target = profileById.get(review.review_target_id)

                  const reviewerName = reviewer?.full_name?.trim() || t.unknown_user
                  const targetName = target?.full_name?.trim() || t.unknown_user

                  return (
                    <article
                      key={review.id}
                      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
                            {reviewer?.avatar_url ? (
                              <img
                                src={reviewer.avatar_url}
                                alt={reviewerName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getInitials(reviewerName)
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="break-words text-sm font-semibold text-slate-900">
                              {reviewerName} → {targetName}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {formatDateTime(review.created_at, locale)}
                            </div>
                          </div>
                        </div>

                        <div className="inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                          {t.rating}: {review.rating}/5
                        </div>
                      </div>

                      {review.comment?.trim() ? (
                        <p className="mt-4 break-words text-sm leading-6 text-slate-700">
                          {review.comment}
                        </p>
                      ) : null}
                    </article>
                  )
                })
              )}
            </div>
          </div>

          <div
            className={
              isHistory
                ? "rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-6"
                : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            }
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {t.activity}
            </h2>

            <div className="mt-5 space-y-4">
              {activity.length === 0 ? (
                <EmptyPanel text={t.no_activity} />
              ) : (
                activity.map((item, index) => {
                  const actor = item.actor_id ? profileById.get(item.actor_id) : null
                  const actorName = actor?.full_name?.trim() || t.unknown_user

                  return (
                    <div key={item.id} className="relative pl-8">
                      {index !== activity.length - 1 ? (
                        <span className="absolute left-[11px] top-6 h-[calc(100%+16px)] w-px bg-slate-200" />
                      ) : null}

                      <span
                        className={
                          isHistory
                            ? "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-[10px] font-semibold text-white"
                            : "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white"
                        }
                      >
                        •
                      </span>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          {actor ? (
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xs font-semibold text-white">
                              {actor.avatar_url ? (
                                <img
                                  src={actor.avatar_url}
                                  alt={actorName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitials(actorName)
                              )}
                            </div>
                          ) : null}

                          <div className="min-w-0">
                            <div className="break-words text-sm font-semibold text-slate-900">
                              {getActivityLabel(item.type, t)}
                            </div>

                            <div className="mt-1 break-words text-xs text-slate-500">
                              {item.actor_id ? `${actorName} • ` : ""}
                              {formatDateTime(item.created_at, locale)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}