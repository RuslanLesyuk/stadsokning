import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
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
  status: JobStatus
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
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
  is_premium: boolean | null
  verified: boolean | null
  subscription_ends_at: string | null
}

type DashboardCopy = {
  title: string
  subtitle: string
  admin_panel: string
  create_job: string
  browse_jobs: string
  edit_profile: string
  saved_jobs: string
  premium_status: string
  premium_active: string
  free_account: string
  verified: string
  not_verified: string
  stats_posted: string
  stats_taken: string
  stats_unread: string
  stats_done: string
  quick_actions: string
  posted_jobs: string
  taken_jobs: string
  history: string
  active_workspace: string
  open_job: string
  edit_job: string
  open_chat: string
  no_budget: string
  no_city: string
  unread: string
  last_message: string
  no_messages: string
  created: string
  assigned_worker: string
  author: string
  worker: string
  empty_posted: string
  empty_taken: string
  empty_history: string
  empty_posted_description: string
  empty_taken_description: string
  status_new: string
  status_assigned: string
  status_in_progress: string
  status_done: string
  status_cancelled: string
}

const copy: Record<Locale, DashboardCopy> = {
  uk: {
    title: "Кабінет",
    subtitle: "Особистий простір для ваших замовлень, чатів і статусу профілю.",
    admin_panel: "Адмін панель",
    create_job: "Створити замовлення",
    browse_jobs: "Переглянути роботи",
    edit_profile: "Редагувати профіль",
    saved_jobs: "Збережені роботи",
    premium_status: "Premium статус",
    premium_active: "Premium активний",
    free_account: "Free акаунт",
    verified: "Профіль підтверджено",
    not_verified: "Профіль не підтверджено",
    stats_posted: "Мої оголошення",
    stats_taken: "Взяті роботи",
    stats_unread: "Непрочитані",
    stats_done: "В історії",
    quick_actions: "Швидкі дії",
    posted_jobs: "Мої активні оголошення",
    taken_jobs: "Роботи, які я виконую",
    history: "Історія",
    active_workspace: "Активна робоча зона",
    open_job: "Відкрити",
    edit_job: "Редагувати",
    open_chat: "Чат",
    no_budget: "Бюджет не вказано",
    no_city: "Місто не вказано",
    unread: "непрочитано",
    last_message: "Останнє повідомлення",
    no_messages: "Повідомлень ще немає",
    created: "Створено",
    assigned_worker: "Є виконавець",
    author: "Автор",
    worker: "Виконавець",
    empty_posted: "У вас ще немає активних оголошень",
    empty_taken: "Ви ще не взяли активні роботи",
    empty_history: "Історія поки порожня",
    empty_posted_description: "Створіть перше замовлення, щоб знайти виконавця.",
    empty_taken_description: "Перейдіть до біржі робіт і виберіть замовлення.",
    status_new: "Нове",
    status_assigned: "Призначено",
    status_in_progress: "В процесі",
    status_done: "Завершено",
    status_cancelled: "Скасовано",
  },
  ru: {
    title: "Кабинет",
    subtitle: "Личное пространство для ваших заказов, чатов и статуса профиля.",
    admin_panel: "Админ панель",
    create_job: "Создать заказ",
    browse_jobs: "Смотреть работы",
    edit_profile: "Редактировать профиль",
    saved_jobs: "Сохранённые работы",
    premium_status: "Premium статус",
    premium_active: "Premium активен",
    free_account: "Free аккаунт",
    verified: "Профиль подтверждён",
    not_verified: "Профиль не подтверждён",
    stats_posted: "Мои объявления",
    stats_taken: "Взятые работы",
    stats_unread: "Непрочитанные",
    stats_done: "В истории",
    quick_actions: "Быстрые действия",
    posted_jobs: "Мои активные объявления",
    taken_jobs: "Работы, которые я выполняю",
    history: "История",
    active_workspace: "Активная рабочая зона",
    open_job: "Открыть",
    edit_job: "Редактировать",
    open_chat: "Чат",
    no_budget: "Бюджет не указан",
    no_city: "Город не указан",
    unread: "непрочитано",
    last_message: "Последнее сообщение",
    no_messages: "Сообщений пока нет",
    created: "Создано",
    assigned_worker: "Есть исполнитель",
    author: "Автор",
    worker: "Исполнитель",
    empty_posted: "У вас пока нет активных объявлений",
    empty_taken: "Вы ещё не взяли активные работы",
    empty_history: "История пока пустая",
    empty_posted_description: "Создайте первый заказ, чтобы найти исполнителя.",
    empty_taken_description: "Перейдите на биржу работ и выберите заказ.",
    status_new: "Новый",
    status_assigned: "Назначено",
    status_in_progress: "В процессе",
    status_done: "Завершено",
    status_cancelled: "Отменено",
  },
  en: {
    title: "Dashboard",
    subtitle: "Your personal workspace for jobs, chats, and profile status.",
    admin_panel: "Admin panel",
    create_job: "Post job",
    browse_jobs: "Browse jobs",
    edit_profile: "Edit profile",
    saved_jobs: "Saved jobs",
    premium_status: "Premium status",
    premium_active: "Premium active",
    free_account: "Free account",
    verified: "Profile verified",
    not_verified: "Profile not verified",
    stats_posted: "My listings",
    stats_taken: "Accepted jobs",
    stats_unread: "Unread",
    stats_done: "In history",
    quick_actions: "Quick actions",
    posted_jobs: "My active listings",
    taken_jobs: "Jobs I am working on",
    history: "History",
    active_workspace: "Active workspace",
    open_job: "Open",
    edit_job: "Edit",
    open_chat: "Chat",
    no_budget: "Budget not specified",
    no_city: "City not specified",
    unread: "unread",
    last_message: "Last message",
    no_messages: "No messages yet",
    created: "Created",
    assigned_worker: "Worker assigned",
    author: "Author",
    worker: "Worker",
    empty_posted: "You do not have active listings yet",
    empty_taken: "You have not accepted active jobs yet",
    empty_history: "Your history is empty",
    empty_posted_description: "Post your first job to find a cleaner.",
    empty_taken_description: "Go to the marketplace and pick a job.",
    status_new: "New",
    status_assigned: "Assigned",
    status_in_progress: "In progress",
    status_done: "Done",
    status_cancelled: "Cancelled",
  },
  sv: {
    title: "Dashboard",
    subtitle: "Din personliga arbetsyta för jobb, chattar och profilstatus.",
    admin_panel: "Adminpanel",
    create_job: "Skapa jobb",
    browse_jobs: "Visa jobb",
    edit_profile: "Redigera profil",
    saved_jobs: "Sparade jobb",
    premium_status: "Premium-status",
    premium_active: "Premium aktiv",
    free_account: "Free konto",
    verified: "Profil verifierad",
    not_verified: "Profil ej verifierad",
    stats_posted: "Mina annonser",
    stats_taken: "Tagna jobb",
    stats_unread: "Olästa",
    stats_done: "I historik",
    quick_actions: "Snabba åtgärder",
    posted_jobs: "Mina aktiva annonser",
    taken_jobs: "Jobb jag arbetar med",
    history: "Historik",
    active_workspace: "Aktiv arbetsyta",
    open_job: "Öppna",
    edit_job: "Redigera",
    open_chat: "Chatt",
    no_budget: "Ingen budget angiven",
    no_city: "Ingen stad angiven",
    unread: "olästa",
    last_message: "Senaste meddelande",
    no_messages: "Inga meddelanden ännu",
    created: "Skapad",
    assigned_worker: "Arbetare tilldelad",
    author: "Skapare",
    worker: "Arbetare",
    empty_posted: "Du har inga aktiva annonser ännu",
    empty_taken: "Du har inte tagit några aktiva jobb ännu",
    empty_history: "Historiken är tom",
    empty_posted_description: "Skapa ditt första jobb för att hitta en städare.",
    empty_taken_description: "Gå till marknadsplatsen och välj ett jobb.",
    status_new: "Ny",
    status_assigned: "Tilldelad",
    status_in_progress: "Pågår",
    status_done: "Klar",
    status_cancelled: "Avbruten",
  },
  pl: {
    title: "Panel",
    subtitle: "Twoje centrum pracy, czatów i statusu profilu.",
    admin_panel: "Panel admina",
    create_job: "Dodaj zlecenie",
    browse_jobs: "Przeglądaj prace",
    edit_profile: "Edytuj profil",
    saved_jobs: "Zapisane prace",
    premium_status: "Status Premium",
    premium_active: "Premium aktywny",
    free_account: "Konto Free",
    verified: "Profil zweryfikowany",
    not_verified: "Profil niezweryfikowany",
    stats_posted: "Moje ogłoszenia",
    stats_taken: "Przyjęte prace",
    stats_unread: "Nieprzeczytane",
    stats_done: "W historii",
    quick_actions: "Szybkie akcje",
    posted_jobs: "Moje aktywne ogłoszenia",
    taken_jobs: "Prace, które wykonuję",
    history: "Historia",
    active_workspace: "Aktywna przestrzeń pracy",
    open_job: "Otwórz",
    edit_job: "Edytuj",
    open_chat: "Czat",
    no_budget: "Brak budżetu",
    no_city: "Brak miasta",
    unread: "nieprzeczytane",
    last_message: "Ostatnia wiadomość",
    no_messages: "Brak wiadomości",
    created: "Utworzono",
    assigned_worker: "Wykonawca przypisany",
    author: "Autor",
    worker: "Wykonawca",
    empty_posted: "Nie masz jeszcze aktywnych ogłoszeń",
    empty_taken: "Nie przyjąłeś jeszcze aktywnych prac",
    empty_history: "Historia jest pusta",
    empty_posted_description: "Dodaj pierwsze zlecenie, aby znaleźć wykonawcę.",
    empty_taken_description: "Przejdź do marketplace i wybierz pracę.",
    status_new: "Nowe",
    status_assigned: "Przypisane",
    status_in_progress: "W trakcie",
    status_done: "Zakończone",
    status_cancelled: "Anulowane",
  },
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isHistoryStatus(status: JobStatus) {
  return status === "done" || status === "cancelled"
}

function getStatusLabel(status: JobStatus, t: DashboardCopy) {
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

function formatBudget(value: number | null, t: DashboardCopy) {
  if (value == null) return t.no_budget
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

function truncate(text: string | null | undefined, max = 110) {
  if (!text) return ""
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
    </div>
  )
}

function EmptyState({
  title,
  description,
  primaryLabel,
  primaryHref,
}: {
  title: string
  description: string
  primaryLabel: string
  primaryHref: string
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.03)]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl">
        ✨
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      <Link
        href={primaryHref}
        prefetch={false}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
      >
        {primaryLabel}
      </Link>
    </div>
  )
}

function JobCard({
  job,
  locale,
  t,
  unreadCount,
  lastMessage,
  isOwnerSection,
}: {
  job: Job
  locale: Locale
  t: DashboardCopy
  unreadCount: number
  lastMessage?: Message
  isOwnerSection: boolean
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
            job.status,
          )}`}
        >
          {getStatusLabel(job.status, t)}
        </span>

        {unreadCount > 0 ? (
          <span className="inline-flex rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
            {unreadCount} {t.unread}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
        {job.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {job.city || t.no_city}
        </span>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
          {formatBudget(job.budget, t)}
        </span>
        {job.assigned_to ? (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
            {t.assigned_worker}
          </span>
        ) : null}
      </div>

      {job.description ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {truncate(job.description)}
        </p>
      ) : null}

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {t.last_message}
        </div>
        <div className="mt-2 text-sm leading-6 text-slate-700">
          {lastMessage?.content ? truncate(lastMessage.content, 140) : t.no_messages}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/jobs/${job.id}`}
          prefetch={false}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
        >
          {t.open_job}
        </Link>

        {job.assigned_to ? (
          <Link
            href={`/jobs/${job.id}/chat`}
            prefetch={false}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
          >
            {t.open_chat}
          </Link>
        ) : null}

        {isOwnerSection && !isHistoryStatus(job.status) ? (
          <Link
            href={`/jobs/${job.id}/edit`}
            prefetch={false}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.97]"
          >
            {t.edit_job}
          </Link>
        ) : null}
      </div>

      <div className="mt-4 text-xs text-slate-400">
        {t.created}: {formatDate(job.created_at, locale)}
      </div>
    </article>
  )
}

function JobsSection({
  title,
  jobs,
  locale,
  t,
  unreadByJob,
  lastMessageByJob,
  isOwnerSection,
  emptyTitle,
  emptyDescription,
  emptyCta,
  emptyHref,
}: {
  title: string
  jobs: Job[]
  locale: Locale
  t: DashboardCopy
  unreadByJob: Map<string, number>
  lastMessageByJob: Map<string, Message>
  isOwnerSection: boolean
  emptyTitle: string
  emptyDescription: string
  emptyCta: string
  emptyHref: string
}) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white/60 p-4 shadow-[0_2px_12px_rgba(15,23,42,0.03)] md:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
          {title}
        </h2>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600">
          {jobs.length}
        </span>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          primaryLabel={emptyCta}
          primaryHref={emptyHref}
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              locale={locale}
              t={t}
              unreadCount={unreadByJob.get(job.id) ?? 0}
              lastMessage={lastMessageByJob.get(job.id)}
              isOwnerSection={isOwnerSection}
            />
          ))}
        </div>
      )}
    </section>
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
    redirect("/login?next=/dashboard")
  }

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, company_logo_url, company_name, is_premium, verified, subscription_ends_at",
    )
    .eq("id", user.id)
    .maybeSingle()

  const profile = profileRaw as Profile | null

  const { data: jobsRaw, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title, description, city, budget, status, created_at, created_by, assigned_to")
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (jobsError) {
    throw new Error(jobsError.message)
  }

  const { count: savedJobsCountRaw } = await supabase
    .from("saved_jobs")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id)

  const savedJobsCount = savedJobsCountRaw ?? 0

  const jobs = (jobsRaw ?? []) as Job[]
  const activeJobs = jobs.filter((job) => !isHistoryStatus(job.status))
  const historyJobs = jobs.filter((job) => isHistoryStatus(job.status))
  const postedActiveJobs = activeJobs.filter((job) => job.created_by === user.id)
  const takenActiveJobs = activeJobs.filter((job) => job.assigned_to === user.id)
  const doneJobs = historyJobs.length

  const jobIds = jobs.map((job) => job.id)
  const unreadByJob = new Map<string, number>()
  const lastMessageByJob = new Map<string, Message>()

  if (jobIds.length > 0) {
    const { data: messagesRaw } = await supabase
      .from("messages")
      .select("id, job_id, sender_id, content, created_at, read_at")
      .in("job_id", jobIds)
      .order("created_at", { ascending: false })
      .limit(200)

    const messages = (messagesRaw ?? []) as Message[]

    for (const message of messages) {
      if (!lastMessageByJob.has(message.job_id)) {
        lastMessageByJob.set(message.job_id, message)
      }

      if (message.sender_id !== user.id && message.read_at === null) {
        unreadByJob.set(message.job_id, (unreadByJob.get(message.job_id) ?? 0) + 1)
      }
    }
  }

  const unreadTotal = Array.from(unreadByJob.values()).reduce(
    (sum, count) => sum + count,
    0,
  )
  const adminEmails = getAdminEmails()
  const isAdmin = Boolean(user.email && adminEmails.includes(user.email.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/40 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                {t.active_workspace}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                {t.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isAdmin ? (
                <Link
                  href="/admin"
                  prefetch={false}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.97]"
                >
                  {t.admin_panel}
                </Link>
              ) : null}

              <Link
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.create_job}
              </Link>

              <Link
                href="/profile"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
              >
                {t.edit_profile}
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label={t.stats_posted} value={postedActiveJobs.length} />
          <StatCard label={t.stats_taken} value={takenActiveJobs.length} />
          <StatCard label={t.stats_unread} value={unreadTotal} />
          <StatCard label={t.stats_done} value={doneJobs} />
          <StatCard label={t.saved_jobs} value={savedJobsCount} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              {t.premium_status}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={
                  profile?.is_premium
                    ? "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                }
              >
                {profile?.is_premium ? t.premium_active : t.free_account}
              </span>
              <span
                className={
                  profile?.verified
                    ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                }
              >
                {profile?.verified ? t.verified : t.not_verified}
              </span>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              {t.quick_actions}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
              >
                {t.browse_jobs}
              </Link>

              <Link
                href="/dashboard/saved"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100 active:scale-[0.97]"
              >
                ❤️ {t.saved_jobs}
              </Link>

              <Link
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.create_job}
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-8 space-y-6">
          <JobsSection
            title={t.posted_jobs}
            jobs={postedActiveJobs}
            locale={locale}
            t={t}
            unreadByJob={unreadByJob}
            lastMessageByJob={lastMessageByJob}
            isOwnerSection={true}
            emptyTitle={t.empty_posted}
            emptyDescription={t.empty_posted_description}
            emptyCta={t.create_job}
            emptyHref="/jobs/create"
          />

          <JobsSection
            title={t.taken_jobs}
            jobs={takenActiveJobs}
            locale={locale}
            t={t}
            unreadByJob={unreadByJob}
            lastMessageByJob={lastMessageByJob}
            isOwnerSection={false}
            emptyTitle={t.empty_taken}
            emptyDescription={t.empty_taken_description}
            emptyCta={t.browse_jobs}
            emptyHref="/jobs"
          />

          <JobsSection
            title={t.history}
            jobs={historyJobs}
            locale={locale}
            t={t}
            unreadByJob={unreadByJob}
            lastMessageByJob={lastMessageByJob}
            isOwnerSection={false}
            emptyTitle={t.empty_history}
            emptyDescription={t.empty_history}
            emptyCta={t.browse_jobs}
            emptyHref="/jobs"
          />
        </div>
      </div>
    </div>
  )
}