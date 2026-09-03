import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getBillingAccessForUser } from "@/lib/billing/server"
import { createClient } from "@/lib/supabase-server"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import DashboardLiveRefresh from "@/components/dashboard-live-refresh"

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
  bankid_verified: boolean | null
  subscription_ends_at: string | null
}

type OwnedCompany = {
  id: string
  name: string
  slug: string
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
  bankid_verified: string
  bankid_not_verified: string
  status_unknown: string
  currency: string
  stats_posted: string
  stats_taken: string
  stats_unread: string
  stats_done: string
  quick_actions: string
  next_steps: string
  next_steps_description: string
  applications_waiting: string
  applications_waiting_description: string
  unread_messages_action: string
  unread_messages_description: string
  continue_work: string
  continue_work_description: string
  open_applications: string
  open_message: string
  open_active_job: string
  all_clear: string
  all_clear_description: string
  need_cleaning: string
  find_work: string
  company_workspace: string
  company_workspace_description: string
  open_company_dashboard: string
  managed_companies: string
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
    title: "Мої справи",
    subtitle: "Тут показано, що потребує вашої уваги зараз.",
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
    bankid_verified: "✓ BankID підтверджено",
    bankid_not_verified: "BankID не підтверджено",
    status_unknown: "Невідомо",
    currency: "kr",
    stats_posted: "Мої оголошення",
    stats_taken: "Взяті роботи",
    stats_unread: "Непрочитані",
    stats_done: "В історії",
    quick_actions: "Інші дії",
    next_steps: "Що потрібно зробити",
    next_steps_description: "Найважливіші дії з ваших замовлень і повідомлень.",
    applications_waiting: "нових заявок",
    applications_waiting_description: "Перегляньте кандидатів і виберіть виконавця.",
    unread_messages_action: "непрочитаних повідомлень",
    unread_messages_description: "Відкрийте чат і перегляньте нові повідомлення.",
    continue_work: "Продовжити активну роботу",
    continue_work_description: "У вас є робота, яка вже призначена або виконується.",
    open_applications: "Переглянути заявки",
    open_message: "Відкрити чат",
    open_active_job: "Відкрити роботу",
    all_clear: "Зараз нічого термінового",
    all_clear_description: "Ви можете створити нове замовлення або знайти роботу.",
    need_cleaning: "Мені потрібне прибирання",
    find_work: "Я шукаю роботу",
    company_workspace: "Простір компанії",
    company_workspace_description: "Керуйте лідами, бронюваннями, сайтом і бізнес-показниками в одному місці.",
    open_company_dashboard: "Відкрити кабінет компанії",
    managed_companies: "Компаній під керуванням",
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
    title: "Мои дела",
    subtitle: "Здесь показано, что требует вашего внимания сейчас.",
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
    bankid_verified: "✓ BankID подтвержден",
    bankid_not_verified: "BankID не подтвержден",
    status_unknown: "Неизвестно",
    currency: "kr",
    stats_posted: "Мои объявления",
    stats_taken: "Взятые работы",
    stats_unread: "Непрочитанные",
    stats_done: "В истории",
    quick_actions: "Другие действия",
    next_steps: "Что нужно сделать",
    next_steps_description: "Самые важные действия по вашим заказам и сообщениям.",
    applications_waiting: "новых заявок",
    applications_waiting_description: "Просмотрите кандидатов и выберите исполнителя.",
    unread_messages_action: "непрочитанных сообщений",
    unread_messages_description: "Откройте чат и прочитайте новые сообщения.",
    continue_work: "Продолжить активную работу",
    continue_work_description: "У вас есть работа, которая уже назначена или выполняется.",
    open_applications: "Посмотреть заявки",
    open_message: "Открыть чат",
    open_active_job: "Открыть работу",
    all_clear: "Сейчас ничего срочного",
    all_clear_description: "Вы можете создать новый заказ или найти работу.",
    need_cleaning: "Мне нужна уборка",
    find_work: "Я ищу работу",
    company_workspace: "Пространство компании",
    company_workspace_description: "Управляйте лидами, бронированиями, сайтом и бизнес-показателями в одном месте.",
    open_company_dashboard: "Открыть кабинет компании",
    managed_companies: "Компаний под управлением",
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
    title: "My activity",
    subtitle: "See what needs your attention right now.",
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
    bankid_verified: "✓ BankID Verified",
    bankid_not_verified: "BankID Not Verified",
    status_unknown: "Unknown",
    currency: "kr",
    stats_posted: "My listings",
    stats_taken: "Accepted jobs",
    stats_unread: "Unread",
    stats_done: "In history",
    quick_actions: "Other actions",
    next_steps: "Next steps",
    next_steps_description: "The most important actions from your jobs and messages.",
    applications_waiting: "new applications",
    applications_waiting_description: "Review the candidates and choose who should do the job.",
    unread_messages_action: "unread messages",
    unread_messages_description: "Open the chat and read the new messages.",
    continue_work: "Continue active job",
    continue_work_description: "You have a job that is assigned or already in progress.",
    open_applications: "Review applications",
    open_message: "Open chat",
    open_active_job: "Open job",
    all_clear: "Nothing urgent right now",
    all_clear_description: "You can post a new cleaning request or look for work.",
    need_cleaning: "I need cleaning",
    find_work: "I am looking for work",
    company_workspace: "Company workspace",
    company_workspace_description: "Manage leads, bookings, website and business metrics from one place.",
    open_company_dashboard: "Open company dashboard",
    managed_companies: "Managed companies",
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
    title: "Mina ärenden",
    subtitle: "Här ser du vad som behöver din uppmärksamhet just nu.",
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
    bankid_verified: "✓ BankID verifierad",
    bankid_not_verified: "BankID ej verifierad",
    status_unknown: "Okänd",
    currency: "kr",
    stats_posted: "Mina annonser",
    stats_taken: "Tagna jobb",
    stats_unread: "Olästa",
    stats_done: "I historik",
    quick_actions: "Andra saker",
    next_steps: "Nästa steg",
    next_steps_description: "De viktigaste sakerna att göra i dina jobb och meddelanden.",
    applications_waiting: "nya ansökningar",
    applications_waiting_description: "Öppna jobbet, jämför kandidaterna och välj utförare.",
    unread_messages_action: "olästa meddelanden",
    unread_messages_description: "Öppna chatten och läs de nya meddelandena.",
    continue_work: "Fortsätt med aktivt jobb",
    continue_work_description: "Du har ett jobb som är tilldelat eller redan pågår.",
    open_applications: "Se ansökningar",
    open_message: "Öppna chatten",
    open_active_job: "Öppna jobbet",
    all_clear: "Inget brådskande just nu",
    all_clear_description: "Du kan lägga upp ett nytt städjobb eller hitta lediga jobb.",
    need_cleaning: "Jag behöver städning",
    find_work: "Jag söker jobb",
    company_workspace: "Företagsyta",
    company_workspace_description: "Hantera leads, bokningar, webbplats och affärsdata från en samlad arbetsyta.",
    open_company_dashboard: "Öppna företagsdashboard",
    managed_companies: "Företag du hanterar",
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
    title: "Moje sprawy",
    subtitle: "Tutaj zobaczysz, co wymaga teraz Twojej uwagi.",
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
    bankid_verified: "✓ BankID zweryfikowany",
    bankid_not_verified: "BankID niezweryfikowany",
    status_unknown: "Nieznany",
    currency: "kr",
    stats_posted: "Moje ogłoszenia",
    stats_taken: "Przyjęte prace",
    stats_unread: "Nieprzeczytane",
    stats_done: "W historii",
    quick_actions: "Inne działania",
    next_steps: "Co dalej",
    next_steps_description: "Najważniejsze działania związane z Twoimi zleceniami i wiadomościami.",
    applications_waiting: "nowych zgłoszeń",
    applications_waiting_description: "Przejrzyj kandydatów i wybierz wykonawcę.",
    unread_messages_action: "nieprzeczytanych wiadomości",
    unread_messages_description: "Otwórz czat i przeczytaj nowe wiadomości.",
    continue_work: "Kontynuuj aktywne zlecenie",
    continue_work_description: "Masz zlecenie, które zostało przydzielone lub jest w trakcie.",
    open_applications: "Zobacz zgłoszenia",
    open_message: "Otwórz czat",
    open_active_job: "Otwórz zlecenie",
    all_clear: "Teraz nic pilnego",
    all_clear_description: "Możesz dodać nowe zlecenie sprzątania lub poszukać pracy.",
    need_cleaning: "Potrzebuję sprzątania",
    find_work: "Szukam pracy",
    company_workspace: "Przestrzeń firmy",
    company_workspace_description: "Zarządzaj leadami, rezerwacjami, stroną i wynikami biznesu w jednym miejscu.",
    open_company_dashboard: "Otwórz panel firmy",
    managed_companies: "Zarządzane firmy",
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
      return t.status_unknown
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
  return `${value} ${t.currency}`
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

function NextActionCard({
  title,
  description,
  href,
  label,
  emphasis = false,
}: {
  title: string
  description: string
  href: string
  label: string
  emphasis?: boolean
}) {
  return (
    <article
      className={
        emphasis
          ? "rounded-[28px] border border-rose-200 bg-rose-50/70 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
          : "rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
      }
    >
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <Link
        href={href}
        prefetch={false}
        className={
          emphasis
            ? "mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
            : "mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
        }
      >
        {label}
      </Link>
    </article>
  )
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

  const billing = await getBillingAccessForUser(user.id)

  const { data: profileRaw } = await supabase
    .from("profiles")
    .select(
      "id, full_name, avatar_url, company_logo_url, company_name, is_premium, verified, bankid_verified, subscription_ends_at",
    )
    .eq("id", user.id)
    .maybeSingle()

  const profile = profileRaw as Profile | null

  const { data: ownedCompaniesRaw, error: ownedCompaniesError } = await supabase
    .from("companies")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("name", { ascending: true })
    .limit(20)

  if (ownedCompaniesError) {
    console.error("Load dashboard owned companies error:", ownedCompaniesError)
  }

  const ownedCompanies = (ownedCompaniesRaw ?? []) as OwnedCompany[]
  const primaryOwnedCompany = ownedCompanies[0] ?? null

  const { data: jobsRaw, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title, description, city, budget, status, created_at, created_by, assigned_to")
    .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    .order("created_at", { ascending: false })

  if (jobsError) {
    throw new Error(jobsError.message)
  }

  const jobs = (jobsRaw ?? []) as Job[]
  const activeJobs = jobs.filter((job) => !isHistoryStatus(job.status))
  const historyJobs = jobs.filter((job) => isHistoryStatus(job.status))
  const postedActiveJobs = activeJobs.filter((job) => job.created_by === user.id)
  const takenActiveJobs = activeJobs.filter((job) => job.assigned_to === user.id)

  const pendingApplicationsByJob = new Map<string, number>()

  if (postedActiveJobs.length > 0) {
    const { data: applicationsRaw, error: applicationsError } = await supabase
      .from("job_applications")
      .select("job_id, status")
      .in(
        "job_id",
        postedActiveJobs.map((job) => job.id),
      )
      .eq("status", "pending")

    if (applicationsError) {
      console.error(
        "Load dashboard pending applications error:",
        applicationsError,
      )
    }

    for (const application of applicationsRaw ?? []) {
      pendingApplicationsByJob.set(
        application.job_id,
        (pendingApplicationsByJob.get(application.job_id) ?? 0) + 1,
      )
    }
  }

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

  const pendingJob =
    postedActiveJobs.find(
      (job) => (pendingApplicationsByJob.get(job.id) ?? 0) > 0,
    ) ?? null

  const unreadJob =
    jobs.find((job) => (unreadByJob.get(job.id) ?? 0) > 0) ?? null

  const activeTakenJob =
    takenActiveJobs.find(
      (job) => job.status === "assigned" || job.status === "in_progress",
    ) ?? null

  const hasNextSteps = Boolean(
    pendingJob || unreadJob || activeTakenJob,
  )

  const adminEmails = getAdminEmails()
  const isAdmin = Boolean(user.email && adminEmails.includes(user.email.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <DashboardLiveRefresh interval={60000} />

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

        <section className="mt-6 rounded-[32px] border border-slate-200 bg-white/70 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              {t.next_steps}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {t.next_steps_description}
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {pendingJob ? (
              <NextActionCard
                title={`${pendingApplicationsByJob.get(pendingJob.id) ?? 0} ${t.applications_waiting}`}
                description={t.applications_waiting_description}
                href={`/jobs/${pendingJob.id}`}
                label={t.open_applications}
                emphasis
              />
            ) : null}

            {unreadJob ? (
              <NextActionCard
                title={`${unreadByJob.get(unreadJob.id) ?? 0} ${t.unread_messages_action}`}
                description={t.unread_messages_description}
                href={`/jobs/${unreadJob.id}/chat`}
                label={t.open_message}
                emphasis
              />
            ) : null}

            {activeTakenJob ? (
              <NextActionCard
                title={t.continue_work}
                description={`${activeTakenJob.title}. ${t.continue_work_description}`}
                href={`/jobs/${activeTakenJob.id}`}
                label={t.open_active_job}
              />
            ) : null}

            {!hasNextSteps ? (
              <>
                <NextActionCard
                  title={t.all_clear}
                  description={t.all_clear_description}
                  href="/jobs/create"
                  label={t.need_cleaning}
                  emphasis
                />
                <NextActionCard
                  title={t.find_work}
                  description={t.empty_taken_description}
                  href="/jobs"
                  label={t.browse_jobs}
                />
              </>
            ) : null}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard label={t.stats_posted} value={postedActiveJobs.length} />
          <StatCard label={t.stats_taken} value={takenActiveJobs.length} />
          <StatCard label={t.stats_unread} value={unreadTotal} />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
            <div className="text-sm font-semibold tracking-tight text-slate-950">
              {t.premium_status}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={
                  billing.isPremium
                    ? "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                }
              >
                {billing.isPremium ? t.premium_active : t.free_account}
              </span>

              <span
                className={
                  profile?.bankid_verified
                    ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                }
              >
                {profile?.bankid_verified
                  ? t.bankid_verified
                  : t.bankid_not_verified}
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

        {primaryOwnedCompany ? (
          <section className="mt-6 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-5 text-white shadow-[0_12px_34px_rgba(15,23,42,0.14)] md:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
                  {t.company_workspace}
                </div>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                  {primaryOwnedCompany.name}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
                  {t.company_workspace_description}
                </p>
                <p className="mt-3 text-xs font-medium text-white/50">
                  {t.managed_companies}: {ownedCompanies.length}
                </p>
              </div>

              <Link
                href={`/dashboard/company?company=${primaryOwnedCompany.id}`}
                prefetch={false}
                className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-rose-50 active:scale-[0.97]"
              >
                {t.open_company_dashboard}
              </Link>
            </div>
          </section>
        ) : null}

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
