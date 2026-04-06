import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

type Job = {
  id: string
  title: string
  description: string | null
  city: string | null
  budget: number | null
  status: "new" | "assigned" | "in_progress" | "done" | "cancelled" | null
  created_at: string
  created_by: string
  assigned_to: string | null
}

type Message = {
  id: string
  job_id: string
  sender_id: string
  content: string | null
  created_at: string
  read_at: string | null
}

type Profile = {
  id: string
  full_name: string | null
}

type DashboardCopy = {
  title: string
  subtitle: string
  stats_posted: string
  stats_taken: string
  stats_unread: string
  stats_done: string
  posted_jobs: string
  taken_jobs: string
  empty_posted: string
  empty_taken: string
  empty_posted_cta: string
  empty_taken_cta: string
  open_job: string
  edit_job: string
  open_chat: string
  no_budget: string
  no_city: string
  last_message: string
  no_messages: string
  unread: string
  created: string
  assigned_worker: string
  your_job: string
  author: string
  worker: string
  unknown_user: string
  status_new: string
  status_assigned: string
  status_in_progress: string
  status_done: string
  status_cancelled: string
}

const copy: Record<Locale, DashboardCopy> = {
  uk: {
    title: "Дашборд",
    subtitle: "Ваші замовлення, чати та поточний статус роботи.",
    stats_posted: "Створено замовлень",
    stats_taken: "Взято в роботу",
    stats_unread: "Непрочитані повідомлення",
    stats_done: "Завершено",
    posted_jobs: "Мої створені замовлення",
    taken_jobs: "Замовлення, які я виконую",
    empty_posted: "У вас ще немає створених замовлень.",
    empty_taken: "У вас ще немає взятих у роботу замовлень.",
    empty_posted_cta: "Створити замовлення",
    empty_taken_cta: "Перейти до замовлень",
    open_job: "Відкрити",
    edit_job: "Редагувати",
    open_chat: "Чат",
    no_budget: "Бюджет не вказано",
    no_city: "Місто не вказано",
    last_message: "Останнє повідомлення",
    no_messages: "Ще немає повідомлень",
    unread: "непрочитано",
    created: "Створено",
    assigned_worker: "Є виконавець",
    your_job: "Ваше замовлення",
    author: "Автор",
    worker: "Виконавець",
    unknown_user: "Користувач",
    status_new: "Нове",
    status_assigned: "Призначено",
    status_in_progress: "В процесі",
    status_done: "Завершено",
    status_cancelled: "Скасовано",
  },
  ru: {
    title: "Дашборд",
    subtitle: "Ваши заказы, чаты и текущий статус работы.",
    stats_posted: "Создано заказов",
    stats_taken: "Взято в работу",
    stats_unread: "Непрочитанные сообщения",
    stats_done: "Завершено",
    posted_jobs: "Мои созданные заказы",
    taken_jobs: "Заказы, которые я выполняю",
    empty_posted: "У вас пока нет созданных заказов.",
    empty_taken: "У вас пока нет взятых в работу заказов.",
    empty_posted_cta: "Создать заказ",
    empty_taken_cta: "Перейти к заказам",
    open_job: "Открыть",
    edit_job: "Редактировать",
    open_chat: "Чат",
    no_budget: "Бюджет не указан",
    no_city: "Город не указан",
    last_message: "Последнее сообщение",
    no_messages: "Сообщений пока нет",
    unread: "непрочитано",
    created: "Создано",
    assigned_worker: "Есть исполнитель",
    your_job: "Ваш заказ",
    author: "Автор",
    worker: "Исполнитель",
    unknown_user: "Пользователь",
    status_new: "Новый",
    status_assigned: "Назначено",
    status_in_progress: "В процессе",
    status_done: "Завершено",
    status_cancelled: "Отменено",
  },
  en: {
    title: "Dashboard",
    subtitle: "Your jobs, chats, and current work status.",
    stats_posted: "Posted jobs",
    stats_taken: "Taken jobs",
    stats_unread: "Unread messages",
    stats_done: "Completed",
    posted_jobs: "Jobs I posted",
    taken_jobs: "Jobs I am working on",
    empty_posted: "You have not posted any jobs yet.",
    empty_taken: "You have not taken any jobs yet.",
    empty_posted_cta: "Post a job",
    empty_taken_cta: "Browse jobs",
    open_job: "Open",
    edit_job: "Edit",
    open_chat: "Chat",
    no_budget: "Budget not specified",
    no_city: "City not specified",
    last_message: "Last message",
    no_messages: "No messages yet",
    unread: "unread",
    created: "Created",
    assigned_worker: "Worker assigned",
    your_job: "Your job",
    author: "Author",
    worker: "Worker",
    unknown_user: "User",
    status_new: "New",
    status_assigned: "Assigned",
    status_in_progress: "In progress",
    status_done: "Done",
    status_cancelled: "Cancelled",
  },
  sv: {
    title: "Dashboard",
    subtitle: "Dina jobb, chattar och aktuell status.",
    stats_posted: "Skapade jobb",
    stats_taken: "Tagna jobb",
    stats_unread: "Olästa meddelanden",
    stats_done: "Slutförda",
    posted_jobs: "Jobb jag har lagt upp",
    taken_jobs: "Jobb jag arbetar med",
    empty_posted: "Du har inte lagt upp några jobb ännu.",
    empty_taken: "Du har inte tagit några jobb ännu.",
    empty_posted_cta: "Lägg upp jobb",
    empty_taken_cta: "Visa jobb",
    open_job: "Öppna",
    edit_job: "Redigera",
    open_chat: "Chatt",
    no_budget: "Ingen budget angiven",
    no_city: "Ingen stad angiven",
    last_message: "Senaste meddelandet",
    no_messages: "Inga meddelanden ännu",
    unread: "olästa",
    created: "Skapad",
    assigned_worker: "Arbetare tilldelad",
    your_job: "Ditt jobb",
    author: "Skapad av",
    worker: "Arbetare",
    unknown_user: "Användare",
    status_new: "Ny",
    status_assigned: "Tilldelad",
    status_in_progress: "Pågår",
    status_done: "Klar",
    status_cancelled: "Avbruten",
  },
  pl: {
    title: "Panel",
    subtitle: "Twoje zlecenia, czaty i aktualny status pracy.",
    stats_posted: "Dodane zlecenia",
    stats_taken: "Przyjęte zlecenia",
    stats_unread: "Nieprzeczytane wiadomości",
    stats_done: "Zakończone",
    posted_jobs: "Zlecenia, które dodałem",
    taken_jobs: "Zlecenia, które wykonuję",
    empty_posted: "Nie masz jeszcze dodanych zleceń.",
    empty_taken: "Nie masz jeszcze przyjętych zleceń.",
    empty_posted_cta: "Dodaj zlecenie",
    empty_taken_cta: "Przeglądaj zlecenia",
    open_job: "Otwórz",
    edit_job: "Edytuj",
    open_chat: "Czat",
    no_budget: "Nie podano budżetu",
    no_city: "Nie podano miasta",
    last_message: "Ostatnia wiadomość",
    no_messages: "Brak wiadomości",
    unread: "nieprzeczytane",
    created: "Utworzono",
    assigned_worker: "Pracownik przypisany",
    your_job: "Twoje zlecenie",
    author: "Autor",
    worker: "Wykonawca",
    unknown_user: "Użytkownik",
    status_new: "Nowe",
    status_assigned: "Przypisane",
    status_in_progress: "W trakcie",
    status_done: "Zakończone",
    status_cancelled: "Anulowane",
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

function formatDateTime(value: string, locale: Locale) {
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
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatBudget(value: number | null, t: DashboardCopy) {
  if (value == null) return t.no_budget
  return `${value} kr`
}

function getStatusLabel(status: Job["status"], t: DashboardCopy) {
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

function getStatusClasses(status: Job["status"]) {
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

function truncate(text: string | null | undefined, max = 120) {
  if (!text) return ""
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

function getInitials(name: string) {
  const clean = name.trim()
  if (!clean) return "U"

  const parts = clean.split(/\s+/).slice(0, 2)
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join("")
  return initials || "U"
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  )
}

function PersonBadge({
  label,
  name,
}: {
  label: string
  name: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {getInitials(name)}
      </div>

      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="truncate text-sm font-medium text-slate-800">{name}</div>
      </div>
    </div>
  )
}

function EmptyState({
  text,
  ctaLabel,
  ctaHref,
}: {
  text: string
  ctaLabel: string
  ctaHref: string
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
      <p className="mx-auto max-w-xl text-slate-500">{text}</p>

      <div className="mt-6">
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}

function JobCard({
  job,
  locale,
  t,
  isOwner,
  unreadCount,
  lastMessage,
  authorName,
  workerName,
}: {
  job: Job
  locale: Locale
  t: DashboardCopy
  isOwner: boolean
  unreadCount: number
  lastMessage?: Message
  authorName: string
  workerName: string | null
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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
                  {t.assigned_worker}
                </span>
              ) : null}

              {unreadCount > 0 ? (
                <span className="inline-flex rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                  {unreadCount} {t.unread}
                </span>
              ) : null}
            </div>

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
              {job.title}
            </h2>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
              <span>{job.city || t.no_city}</span>
              <span>{formatBudget(job.budget, t)}</span>
              <span>
                {t.created}: {formatDate(job.created_at, locale)}
              </span>
            </div>

            {job.description ? (
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {truncate(job.description, 180)}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-col gap-2 lg:w-40">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              {t.open_job}
            </Link>

            {isOwner ? (
              <Link
                href={`/jobs/${job.id}/edit`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.edit_job}
              </Link>
            ) : null}

            {job.assigned_to ? (
              <Link
                href={`/jobs/${job.id}/chat`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.open_chat}
              </Link>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <PersonBadge label={t.author} name={authorName} />
          {workerName ? <PersonBadge label={t.worker} name={workerName} /> : null}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.last_message}
            </div>

            {lastMessage ? (
              <div className="text-xs text-slate-500">
                {formatDateTime(lastMessage.created_at, locale)}
              </div>
            ) : null}
          </div>

          <div className="mt-2 text-sm text-slate-700">
            {lastMessage?.content?.trim()
              ? truncate(lastMessage.content, 140)
              : t.no_messages}
          </div>
        </div>
      </div>
    </article>
  )
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: jobsRaw, error: jobsError } = await supabase
    .from("jobs")
    .select(
      "id, title, description, city, budget, status, created_at, created_by, assigned_to"
    )
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (jobsError) {
    throw new Error(jobsError.message)
  }

  const jobs = (jobsRaw ?? []) as Job[]
  const jobIds = jobs.map((job) => job.id)

  let messages: Message[] = []

  if (jobIds.length > 0) {
    const { data: messagesRaw, error: messagesError } = await supabase
      .from("messages")
      .select("id, job_id, sender_id, content, created_at, read_at")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false })
      .limit(500)

    if (messagesError) {
      throw new Error(messagesError.message)
    }

    messages = (messagesRaw ?? []) as Message[]
  }

  const userIds = Array.from(
    new Set(
      jobs.flatMap((job) => [job.created_by, job.assigned_to].filter(Boolean) as string[])
    )
  )

  let profiles: Profile[] = []

  if (userIds.length > 0) {
    const { data: profilesRaw, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds)

    if (profilesError) {
      throw new Error(profilesError.message)
    }

    profiles = (profilesRaw ?? []) as Profile[]
  }

  const profileNameById = new Map<string, string>()

  for (const profile of profiles) {
    profileNameById.set(profile.id, profile.full_name?.trim() || t.unknown_user)
  }

  const unreadByJob = new Map<string, number>()
  const lastMessageByJob = new Map<string, Message>()

  for (const message of messages) {
    if (!lastMessageByJob.has(message.job_id)) {
      lastMessageByJob.set(message.job_id, message)
    }

    const isUnreadForCurrentUser =
      message.sender_id !== user.id && message.read_at === null

    if (isUnreadForCurrentUser) {
      unreadByJob.set(message.job_id, (unreadByJob.get(message.job_id) ?? 0) + 1)
    }
  }

  const postedJobs = jobs.filter((job) => job.created_by === user.id)
  const takenJobs = jobs.filter((job) => job.assigned_to === user.id)

  const unreadTotal = [...unreadByJob.values()].reduce((sum, n) => sum + n, 0)
  const doneTotal = jobs.filter((job) => job.status === "done").length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
          {t.title}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          {t.subtitle}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t.stats_posted} value={postedJobs.length} />
          <StatCard label={t.stats_taken} value={takenJobs.length} />
          <StatCard label={t.stats_unread} value={unreadTotal} />
          <StatCard label={t.stats_done} value={doneTotal} />
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.posted_jobs}
          </h2>

          <Link
            href="/jobs/create"
            className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            {t.empty_posted_cta}
          </Link>
        </div>

        <div className="space-y-4">
          {postedJobs.length === 0 ? (
            <EmptyState
              text={t.empty_posted}
              ctaLabel={t.empty_posted_cta}
              ctaHref="/jobs/create"
            />
          ) : (
            postedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                locale={locale}
                t={t}
                isOwner
                unreadCount={unreadByJob.get(job.id) ?? 0}
                lastMessage={lastMessageByJob.get(job.id)}
                authorName={profileNameById.get(job.created_by) ?? t.unknown_user}
                workerName={
                  job.assigned_to
                    ? profileNameById.get(job.assigned_to) ?? t.unknown_user
                    : null
                }
              />
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.taken_jobs}
          </h2>

          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t.empty_taken_cta}
          </Link>
        </div>

        <div className="space-y-4">
          {takenJobs.length === 0 ? (
            <EmptyState
              text={t.empty_taken}
              ctaLabel={t.empty_taken_cta}
              ctaHref="/jobs"
            />
          ) : (
            takenJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                locale={locale}
                t={t}
                isOwner={false}
                unreadCount={unreadByJob.get(job.id) ?? 0}
                lastMessage={lastMessageByJob.get(job.id)}
                authorName={profileNameById.get(job.created_by) ?? t.unknown_user}
                workerName={
                  job.assigned_to
                    ? profileNameById.get(job.assigned_to) ?? t.unknown_user
                    : null
                }
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}