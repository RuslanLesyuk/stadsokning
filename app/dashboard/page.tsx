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
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
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
  completed_posted_jobs: string
  completed_taken_jobs: string
  completed_description: string
  show_completed: string
  completed_count: string
  empty_posted: string
  empty_taken: string
  empty_posted_description: string
  empty_taken_description: string
  empty_posted_cta: string
  empty_taken_cta: string
  empty_posted_secondary_cta: string
  empty_taken_secondary_cta: string
  empty_completed_posted: string
  empty_completed_taken: string
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
  no_company: string
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
    posted_jobs: "Мої активні замовлення",
    taken_jobs: "Активні замовлення, які я виконую",
    completed_posted_jobs: "Завершені та скасовані мої замовлення",
    completed_taken_jobs: "Завершені та скасовані замовлення, які я виконував",
    completed_description: "Ці замовлення залишаються в історії, але не відволікають від активної роботи.",
    show_completed: "Показати завершені",
    completed_count: "в історії",
    empty_posted: "У вас ще немає створених замовлень",
    empty_taken: "У вас ще немає взятих у роботу замовлень",
    empty_posted_description:
      "Створіть перше оголошення, щоб швидко знайти виконавця та почати отримувати відгуки.",
    empty_taken_description:
      "Перейдіть до списку доступних замовлень і виберіть роботу, яка вам підходить.",
    empty_posted_cta: "Створити замовлення",
    empty_taken_cta: "Перейти до замовлень",
    empty_posted_secondary_cta: "Переглянути всі замовлення",
    empty_taken_secondary_cta: "Створити своє замовлення",
    empty_completed_posted: "У вас ще немає завершених або скасованих створених замовлень",
    empty_completed_taken: "У вас ще немає завершених або скасованих взятих у роботу замовлень",
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
    no_company: "Без компанії",
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
    posted_jobs: "Мои активные заказы",
    taken_jobs: "Активные заказы, которые я выполняю",
    completed_posted_jobs: "Завершённые и отменённые мои заказы",
    completed_taken_jobs: "Завершённые и отменённые заказы, которые я выполнял",
    completed_description: "Эти заказы остаются в истории, но не засоряют активную рабочую зону.",
    show_completed: "Показать завершённые",
    completed_count: "в истории",
    empty_posted: "У вас пока нет созданных заказов",
    empty_taken: "У вас пока нет взятых в работу заказов",
    empty_posted_description:
      "Создайте первое задание, чтобы быстрее найти исполнителя и начать получать отзывы.",
    empty_taken_description:
      "Перейдите к списку доступных заказов и выберите работу, которая вам подходит.",
    empty_posted_cta: "Создать заказ",
    empty_taken_cta: "Перейти к заказам",
    empty_posted_secondary_cta: "Посмотреть все заказы",
    empty_taken_secondary_cta: "Создать свой заказ",
    empty_completed_posted: "У вас пока нет завершённых или отменённых созданных заказов",
    empty_completed_taken: "У вас пока нет завершённых или отменённых взятых в работу заказов",
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
    no_company: "Без компании",
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
    posted_jobs: "My active posted jobs",
    taken_jobs: "Active jobs I am working on",
    completed_posted_jobs: "My completed and cancelled posted jobs",
    completed_taken_jobs: "Completed and cancelled jobs I worked on",
    completed_description: "These jobs stay in your history without cluttering your active workspace.",
    show_completed: "Show completed",
    completed_count: "in history",
    empty_posted: "You haven’t posted any jobs yet",
    empty_taken: "You haven’t taken any jobs yet",
    empty_posted_description:
      "Create your first job to find a worker faster and start collecting reviews.",
    empty_taken_description:
      "Browse available jobs and pick a task that matches your schedule.",
    empty_posted_cta: "Post a job",
    empty_taken_cta: "Browse jobs",
    empty_posted_secondary_cta: "See all jobs",
    empty_taken_secondary_cta: "Post your own job",
    empty_completed_posted: "You do not have any completed or cancelled posted jobs yet",
    empty_completed_taken: "You do not have any completed or cancelled taken jobs yet",
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
    no_company: "No company",
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
    posted_jobs: "Mina aktiva upplagda jobb",
    taken_jobs: "Aktiva jobb jag arbetar med",
    completed_posted_jobs: "Mina slutförda och avbrutna upplagda jobb",
    completed_taken_jobs: "Slutförda och avbrutna jobb jag har arbetat med",
    completed_description: "De här jobben finns kvar i historiken utan att störa den aktiva översikten.",
    show_completed: "Visa slutförda",
    completed_count: "i historiken",
    empty_posted: "Du har inte lagt upp några jobb ännu",
    empty_taken: "Du har inte tagit några jobb ännu",
    empty_posted_description:
      "Skapa ditt första jobb för att snabbare hitta en arbetare och börja få recensioner.",
    empty_taken_description:
      "Bläddra bland tillgängliga jobb och välj ett uppdrag som passar dig.",
    empty_posted_cta: "Lägg upp jobb",
    empty_taken_cta: "Visa jobb",
    empty_posted_secondary_cta: "Se alla jobb",
    empty_taken_secondary_cta: "Skapa eget jobb",
    empty_completed_posted: "Du har ännu inga slutförda eller avbrutna upplagda jobb",
    empty_completed_taken: "Du har ännu inga slutförda eller avbrutna tagna jobb",
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
    no_company: "Inget företag",
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
    posted_jobs: "Moje aktywne zlecenia",
    taken_jobs: "Aktywne zlecenia, które wykonuję",
    completed_posted_jobs: "Moje zakończone i anulowane zlecenia",
    completed_taken_jobs: "Zakończone i anulowane zlecenia, które wykonywałem",
    completed_description: "Te zlecenia zostają w historii, ale nie zaśmiecają aktywnego widoku.",
    show_completed: "Pokaż zakończone",
    completed_count: "w historii",
    empty_posted: "Nie masz jeszcze dodanych zleceń",
    empty_taken: "Nie masz jeszcze przyjętych zleceń",
    empty_posted_description:
      "Dodaj pierwsze zlecenie, aby szybciej znaleźć wykonawcę i zacząć zbierać opinie.",
    empty_taken_description:
      "Przejrzyj dostępne zlecenia i wybierz pracę, która Ci odpowiada.",
    empty_posted_cta: "Dodaj zlecenie",
    empty_taken_cta: "Przeglądaj zlecenia",
    empty_posted_secondary_cta: "Zobacz wszystkie zlecenia",
    empty_taken_secondary_cta: "Dodaj własne zlecenie",
    empty_completed_posted: "Nie masz jeszcze zakończonych lub anulowanych dodanych zleceń",
    empty_completed_taken: "Nie masz jeszcze zakończonych lub anulowanych przyjętych zleceń",
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
    no_company: "Bez firmy",
    status_new: "Nowe",
    status_assigned: "Przypisane",
    status_in_progress: "W trakcie",
    status_done: "Zakończone",
    status_cancelled: "Anulowane",
  } as DashboardCopy,
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

function isCompletedStatus(status: Job["status"]) {
  return status === "done" || status === "cancelled"
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] md:p-6">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500 md:text-sm">
        {label}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {value}
      </div>
    </div>
  )
}

function PersonBadge({
  label,
  name,
  avatarUrl,
  companyLogoUrl,
  companyName,
  muted = false,
  fallbackCompany,
}: {
  label: string
  name: string
  avatarUrl?: string | null
  companyLogoUrl?: string | null
  companyName?: string | null
  muted?: boolean
  fallbackCompany: string
}) {
  return (
    <div
      className={
        muted
          ? "flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3"
          : "flex items-center gap-3 rounded-2xl bg-slate-50/90 px-3 py-3"
      }
    >
      <div className="relative shrink-0">
        <div
          className={
            muted
              ? "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-sm font-semibold text-white"
              : "flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white"
          }
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            getInitials(name)
          )}
        </div>

        {companyLogoUrl ? (
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
            <img
              src={companyLogoUrl}
              alt={companyName || fallbackCompany}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="truncate text-sm font-medium text-slate-800">{name}</div>
        <div className="truncate text-xs text-slate-500">
          {companyName?.trim() || fallbackCompany}
        </div>
      </div>
    </div>
  )
}

function DashboardEmptyState({
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
  secondaryLabel?: string
  secondaryHref?: string
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/90 bg-white p-8 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-2xl">
          ✨
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
          {title}
        </h3>

        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 md:text-base">
          {description}
        </p>

        <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={primaryHref}
            prefetch={false}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-700"
          >
            {primaryLabel}
          </Link>

          {secondaryLabel && secondaryHref ? (
            <Link
              href={secondaryHref}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
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
  authorProfile,
  workerProfile,
  subdued = false,
}: {
  job: Job
  locale: Locale
  t: DashboardCopy
  isOwner: boolean
  unreadCount: number
  lastMessage?: Message
  authorProfile?: Profile
  workerProfile?: Profile | null
  subdued?: boolean
}) {
  const completed = isCompletedStatus(job.status)
  const isSubdued = subdued || completed
  const authorName = authorProfile?.full_name?.trim() || t.unknown_user
  const workerName = workerProfile?.full_name?.trim() || t.unknown_user

  return (
    <article
      className={
        isSubdued
          ? "group flex flex-col rounded-[28px] border border-slate-200/80 bg-white/90 p-5 opacity-80 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition duration-200 md:p-6"
          : "group flex flex-col rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-6"
      }
    >
      <div className="flex flex-col gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
            >
              {getStatusLabel(job.status, t)}
            </span>

            {isOwner ? (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {t.your_job}
              </span>
            ) : null}

            {job.assigned_to ? (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {t.assigned_worker}
              </span>
            ) : null}

            {!isSubdued && unreadCount > 0 ? (
              <span className="inline-flex rounded-full bg-rose-600 px-3 py-1 text-xs font-medium text-white">
                {unreadCount} {t.unread}
              </span>
            ) : null}
          </div>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
            {job.title}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {job.city || t.no_city}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {formatBudget(job.budget, t)}
            </span>
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {t.created}: {formatDate(job.created_at, locale)}
            </span>
          </div>

          {job.description ? (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              {truncate(job.description, 180)}
            </p>
          ) : (
            <div className="mt-4 text-sm leading-6 text-slate-400">—</div>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <PersonBadge
            label={t.author}
            name={authorName}
            avatarUrl={authorProfile?.avatar_url}
            companyLogoUrl={authorProfile?.company_logo_url}
            companyName={authorProfile?.company_name}
            muted={isSubdued}
            fallbackCompany={t.no_company}
          />
          {workerProfile ? (
            <PersonBadge
              label={t.worker}
              name={workerName}
              avatarUrl={workerProfile.avatar_url}
              companyLogoUrl={workerProfile.company_logo_url}
              companyName={workerProfile.company_name}
              muted={isSubdued}
              fallbackCompany={t.no_company}
            />
          ) : null}
        </div>

        <div className="rounded-2xl bg-slate-50/80 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {t.last_message}
            </div>

            {lastMessage ? (
              <div className="text-xs text-slate-500">
                {formatDateTime(lastMessage.created_at, locale)}
              </div>
            ) : null}
          </div>

          <div className="mt-2 text-sm leading-6 text-slate-700">
            {lastMessage?.content?.trim()
              ? truncate(lastMessage.content, 140)
              : t.no_messages}
          </div>
        </div>

        <div className={`grid gap-3 ${isOwner ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          <Link
            href={`/jobs/${job.id}`}
            prefetch={false}
            className={
              isSubdued
                ? "inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
                : "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-700"
            }
          >
            {t.open_job}
          </Link>

          {isOwner ? (
            completed ? (
              <div className="hidden sm:block" />
            ) : (
              <Link
                href={`/jobs/${job.id}/edit`}
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
              >
                {t.edit_job}
              </Link>
            )
          ) : null}

          {job.assigned_to ? (
            <Link
              href={`/jobs/${job.id}/chat`}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
            >
              {t.open_chat}
            </Link>
          ) : isOwner ? (
            <div className="hidden sm:block" />
          ) : null}
        </div>
      </div>
    </article>
  )
}

function JobsSection({
  title,
  ctaLabel,
  ctaHref,
  jobs,
  locale,
  t,
  unreadByJob,
  lastMessageByJob,
  profileById,
  isOwnerSection,
  emptyTitle,
  emptyDescription,
  emptyPrimaryLabel,
  emptyPrimaryHref,
  emptySecondaryLabel,
  emptySecondaryHref,
}: {
  title: string
  ctaLabel: string
  ctaHref: string
  jobs: Job[]
  locale: Locale
  t: DashboardCopy
  unreadByJob: Map<string, number>
  lastMessageByJob: Map<string, Message>
  profileById: Map<string, Profile>
  isOwnerSection: boolean
  emptyTitle: string
  emptyDescription: string
  emptyPrimaryLabel: string
  emptyPrimaryHref: string
  emptySecondaryLabel?: string
  emptySecondaryHref?: string
}) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">
          {title}
        </h2>

        <Link
          href={ctaHref}
          prefetch={false}
          className={
            isOwnerSection
              ? "inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-700"
              : "inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97] active:bg-slate-100"
          }
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="space-y-5">
        {jobs.length === 0 ? (
          <DashboardEmptyState
            title={emptyTitle}
            description={emptyDescription}
            primaryLabel={emptyPrimaryLabel}
            primaryHref={emptyPrimaryHref}
            secondaryLabel={emptySecondaryLabel}
            secondaryHref={emptySecondaryHref}
          />
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              locale={locale}
              t={t}
              isOwner={isOwnerSection}
              unreadCount={unreadByJob.get(job.id) ?? 0}
              lastMessage={lastMessageByJob.get(job.id)}
              authorProfile={profileById.get(job.created_by)}
              workerProfile={job.assigned_to ? profileById.get(job.assigned_to) || null : null}
            />
          ))
        )}
      </div>
    </section>
  )
}

function CompletedSection({
  title,
  description,
  jobs,
  locale,
  t,
  unreadByJob,
  lastMessageByJob,
  profileById,
  isOwnerSection,
  emptyTitle,
}: {
  title: string
  description: string
  jobs: Job[]
  locale: Locale
  t: DashboardCopy
  unreadByJob: Map<string, number>
  lastMessageByJob: Map<string, Message>
  profileById: Map<string, Profile>
  isOwnerSection: boolean
  emptyTitle: string
}) {
  return (
    <section className="mt-6">
      <details className="group rounded-[28px] border border-slate-200/80 bg-white/80 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[28px] px-5 py-5 outline-none transition hover:bg-slate-50/80 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-inset active:scale-[0.998] md:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                {title}
              </h3>
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {jobs.length} {t.completed_count}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          </div>

          <div className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 transition group-open:bg-rose-50 group-open:text-rose-700">
            {t.show_completed}
          </div>
        </summary>

        <div className="border-t border-slate-200/80 px-5 py-5 md:px-6">
          {jobs.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-6 text-sm text-slate-500">
              {emptyTitle}
            </div>
          ) : (
            <div className="space-y-5">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  locale={locale}
                  t={t}
                  isOwner={isOwnerSection}
                  unreadCount={unreadByJob.get(job.id) ?? 0}
                  lastMessage={lastMessageByJob.get(job.id)}
                  authorProfile={profileById.get(job.created_by)}
                  workerProfile={job.assigned_to ? profileById.get(job.assigned_to) || null : null}
                  subdued
                />
              ))}
            </div>
          )}
        </div>
      </details>
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
    redirect("/login")
  }

  const { data: jobsRaw, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title, description, city, budget, status, created_at, created_by, assigned_to")
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
      jobs.flatMap((job) => [job.created_by, job.assigned_to].filter(Boolean) as string[]),
    ),
  )

  let profiles: Profile[] = []

  if (userIds.length > 0) {
    const { data: profilesRaw, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, company_logo_url, company_name")
      .in("id", userIds)

    if (profilesError) {
      throw new Error(profilesError.message)
    }

    profiles = (profilesRaw ?? []) as Profile[]
  }

  const profileById = new Map<string, Profile>()

  for (const profile of profiles) {
    profileById.set(profile.id, profile)
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

  const postedActiveJobs = postedJobs.filter((job) => !isCompletedStatus(job.status))
  const postedCompletedJobs = postedJobs.filter((job) => isCompletedStatus(job.status))
  const takenActiveJobs = takenJobs.filter((job) => !isCompletedStatus(job.status))
  const takenCompletedJobs = takenJobs.filter((job) => isCompletedStatus(job.status))

  const unreadTotal = [...unreadByJob.values()].reduce((sum, n) => sum + n, 0)
  const doneTotal = jobs.filter((job) => job.status === "done").length

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
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

        <JobsSection
          title={t.posted_jobs}
          ctaLabel={t.empty_posted_cta}
          ctaHref="/jobs/create"
          jobs={postedActiveJobs}
          locale={locale}
          t={t}
          unreadByJob={unreadByJob}
          lastMessageByJob={lastMessageByJob}
          profileById={profileById}
          isOwnerSection
          emptyTitle={t.empty_posted}
          emptyDescription={t.empty_posted_description}
          emptyPrimaryLabel={t.empty_posted_cta}
          emptyPrimaryHref="/jobs/create"
          emptySecondaryLabel={t.empty_posted_secondary_cta}
          emptySecondaryHref="/jobs"
        />

        <CompletedSection
          title={t.completed_posted_jobs}
          description={t.completed_description}
          jobs={postedCompletedJobs}
          locale={locale}
          t={t}
          unreadByJob={unreadByJob}
          lastMessageByJob={lastMessageByJob}
          profileById={profileById}
          isOwnerSection
          emptyTitle={t.empty_completed_posted}
        />

        <JobsSection
          title={t.taken_jobs}
          ctaLabel={t.empty_taken_cta}
          ctaHref="/jobs"
          jobs={takenActiveJobs}
          locale={locale}
          t={t}
          unreadByJob={unreadByJob}
          lastMessageByJob={lastMessageByJob}
          profileById={profileById}
          isOwnerSection={false}
          emptyTitle={t.empty_taken}
          emptyDescription={t.empty_taken_description}
          emptyPrimaryLabel={t.empty_taken_cta}
          emptyPrimaryHref="/jobs"
          emptySecondaryLabel={t.empty_taken_secondary_cta}
          emptySecondaryHref="/jobs/create"
        />

        <CompletedSection
          title={t.completed_taken_jobs}
          description={t.completed_description}
          jobs={takenCompletedJobs}
          locale={locale}
          t={t}
          unreadByJob={unreadByJob}
          lastMessageByJob={lastMessageByJob}
          profileById={profileById}
          isOwnerSection={false}
          emptyTitle={t.empty_completed_taken}
        />
      </div>
    </div>
  )
}