import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import ChatMessageForm from "@/components/chat-message-form"
import ChatLiveRefresh from "@/components/chat-live-refresh"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getDictionary,
  getMessageWord,
  normalizeLocale,
} from "@/lib/i18n"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

type JobRow = {
  id: string
  title: string | null
  created_by: string | null
  assigned_to: string | null
  status: string | null
}

type ProfileRow = {
  id: string
  full_name: string | null
  city: string | null
}

type MessageRow = {
  id: string
  job_id: string
  sender_id: string
  body: string | null
  created_at: string
  read_at: string | null
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-SE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

function isHistoryStatus(status: string | null) {
  return status === "done" || status === "cancelled"
}

function getStatusLabel(
  status: string | null,
  locale: "uk" | "ru" | "en" | "sv" | "pl",
) {
  if (locale === "uk") {
    switch (status) {
      case "new":
        return "Нове"
      case "assigned":
        return "Призначено"
      case "in_progress":
        return "В процесі"
      case "done":
        return "Завершено"
      case "cancelled":
        return "Скасовано"
      default:
        return "—"
    }
  }

  if (locale === "ru") {
    switch (status) {
      case "new":
        return "Новый"
      case "assigned":
        return "Назначено"
      case "in_progress":
        return "В процессе"
      case "done":
        return "Завершено"
      case "cancelled":
        return "Отменено"
      default:
        return "—"
    }
  }

  if (locale === "sv") {
    switch (status) {
      case "new":
        return "Ny"
      case "assigned":
        return "Tilldelad"
      case "in_progress":
        return "Pågår"
      case "done":
        return "Klar"
      case "cancelled":
        return "Avbruten"
      default:
        return "—"
    }
  }

  if (locale === "pl") {
    switch (status) {
      case "new":
        return "Nowe"
      case "assigned":
        return "Przypisane"
      case "in_progress":
        return "W trakcie"
      case "done":
        return "Zakończone"
      case "cancelled":
        return "Anulowane"
      default:
        return "—"
    }
  }

  switch (status) {
    case "new":
      return "New"
    case "assigned":
      return "Assigned"
    case "in_progress":
      return "In progress"
    case "done":
      return "Done"
    case "cancelled":
      return "Cancelled"
    default:
      return "—"
  }
}

function getStatusClasses(status: string | null) {
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

function getHistoryHint(locale: "uk" | "ru" | "en" | "sv" | "pl", status: string | null) {
  if (status === "done") {
    if (locale === "uk") return "Робота завершена. Чат лишається доступним для фінальних деталей та історії."
    if (locale === "ru") return "Работа завершена. Чат остаётся доступным для финальных деталей и истории."
    if (locale === "sv") return "Jobbet är slutfört. Chatten finns kvar för slutliga detaljer och historik."
    if (locale === "pl") return "Zlecenie zostało zakończone. Czat pozostaje dostępny dla końcowych ustaleń i historii."
    return "This job is completed. The chat stays available for final details and history."
  }

  if (status === "cancelled") {
    if (locale === "uk") return "Роботу скасовано. Історія листування збережена для контексту."
    if (locale === "ru") return "Работа отменена. История переписки сохранена для контекста."
    if (locale === "sv") return "Jobbet är avbrutet. Chatthistoriken finns kvar som referens."
    if (locale === "pl") return "Zlecenie zostało anulowane. Historia rozmowy pozostaje dostępna jako kontekst."
    return "This job is cancelled. The conversation history remains available for context."
  }

  return null
}

function getReadOnlyCopy(
  locale: "uk" | "ru" | "en" | "sv" | "pl",
  status: string | null,
) {
  if (status === "done") {
    if (locale === "uk") {
      return {
        title: "Чат закрито для нових повідомлень",
        description:
          "Замовлення завершене, тому нові повідомлення вимкнені. Історія переписки збережена для перегляду.",
      }
    }

    if (locale === "ru") {
      return {
        title: "Чат закрыт для новых сообщений",
        description:
          "Заказ завершён, поэтому новые сообщения отключены. История переписки сохранена для просмотра.",
      }
    }

    if (locale === "sv") {
      return {
        title: "Chatten är stängd för nya meddelanden",
        description:
          "Jobbet är slutfört, därför är nya meddelanden avstängda. Chatthistoriken finns kvar för visning.",
      }
    }

    if (locale === "pl") {
      return {
        title: "Czat jest zamknięty dla nowych wiadomości",
        description:
          "Zlecenie zostało zakończone, dlatego nowe wiadomości są wyłączone. Historia czatu pozostaje dostępna do podglądu.",
      }
    }

    return {
      title: "Chat is closed for new messages",
      description:
        "This job is completed, so new messages are disabled. The conversation history remains available to review.",
    }
  }

  if (status === "cancelled") {
    if (locale === "uk") {
      return {
        title: "Чат закрито для нових повідомлень",
        description:
          "Замовлення скасоване, тому нові повідомлення вимкнені. Історія переписки лишається доступною для перегляду.",
      }
    }

    if (locale === "ru") {
      return {
        title: "Чат закрыт для новых сообщений",
        description:
          "Заказ отменён, поэтому новые сообщения отключены. История переписки остаётся доступной для просмотра.",
      }
    }

    if (locale === "sv") {
      return {
        title: "Chatten är stängd för nya meddelanden",
        description:
          "Jobbet är avbrutet, därför är nya meddelanden avstängda. Chatthistoriken finns kvar för visning.",
      }
    }

    if (locale === "pl") {
      return {
        title: "Czat jest zamknięty dla nowych wiadomości",
        description:
          "Zlecenie zostało anulowane, dlatego nowe wiadomości są wyłączone. Historia czatu pozostaje dostępna do podglądu.",
      }
    }

    return {
      title: "Chat is closed for new messages",
      description:
        "This job is cancelled, so new messages are disabled. The conversation history remains available to review.",
    }
  }

  return {
    title: "",
    description: "",
  }
}

function ChatEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300/90 bg-slate-50/70 px-6 py-12 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          💬
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500 md:text-base">
          {description}
        </p>
      </div>
    </div>
  )
}

export default async function JobChatPage({ params }: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const dictionary = getDictionary(locale)

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/jobs/${id}/chat`)
  }

  const { data: jobData, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, created_by, assigned_to, status")
    .eq("id", id)
    .single()

  const job = jobData as JobRow | null

  if (jobError || !job) {
    notFound()
  }

  const isParticipant =
    job.created_by === user.id || job.assigned_to === user.id

  const canUseChat =
    !!job.created_by &&
    !!job.assigned_to &&
    ["assigned", "in_progress", "done", "cancelled"].includes(job.status || "")

  if (!isParticipant || !canUseChat) {
    redirect(`/jobs/${id}`)
  }

  await supabase
    .from("messages")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("job_id", id)
    .neq("sender_id", user.id)
    .is("read_at", null)

  const participantIds = [job.created_by, job.assigned_to].filter(
    Boolean,
  ) as string[]

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name, city")
    .in("id", participantIds)

  const profiles = (profilesData || []) as ProfileRow[]
  const profilesMap = new Map(profiles.map((profile) => [profile.id, profile]))

  const { data: messagesData } = await supabase
    .from("messages")
    .select("id, job_id, sender_id, body, created_at, read_at")
    .eq("job_id", id)
    .order("created_at", { ascending: true })

  const messages = (messagesData || []) as MessageRow[]

  const authorProfile = job.created_by
    ? profilesMap.get(job.created_by) || null
    : null

  const workerProfile = job.assigned_to
    ? profilesMap.get(job.assigned_to) || null
    : null

  const isHistory = isHistoryStatus(job.status)
  const historyHint = getHistoryHint(locale, job.status)
  const isReadOnly = isHistory
  const readOnlyCopy = getReadOnlyCopy(locale, job.status)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
        <ChatLiveRefresh interval={30000} />

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href={`/jobs/${id}`}
              prefetch={false}
              className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.98]"
            >
              {dictionary.chat.backToJob}
            </Link>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(job.status)}`}
              >
                {getStatusLabel(job.status, locale)}
              </span>

              {isHistory ? (
                <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {locale === "uk"
                    ? "Історія"
                    : locale === "ru"
                      ? "История"
                      : locale === "sv"
                        ? "Historik"
                        : locale === "pl"
                          ? "Historia"
                          : "History"}
                </span>
              ) : null}
            </div>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {dictionary.chat.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {job.title || dictionary.jobs.untitledJob}
            </p>

            {historyHint ? (
              <div className="mt-3 inline-flex rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                {historyHint}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            {dictionary.chat.autoRefresh}: {dictionary.chat.every30Seconds}
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div
            className={
              isHistory
                ? "rounded-[28px] border border-slate-200 bg-white/90 p-4 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
                : "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
            }
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {dictionary.chat.author}
            </p>
            <p className="mt-1 text-base font-medium text-slate-900">
              {authorProfile?.full_name || dictionary.chat.unknownUser}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {authorProfile?.city || dictionary.chat.cityNotSpecified}
            </p>
          </div>

          <div
            className={
              isHistory
                ? "rounded-[28px] border border-slate-200 bg-white/90 p-4 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
                : "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
            }
          >
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              {dictionary.chat.worker}
            </p>
            <p className="mt-1 text-base font-medium text-slate-900">
              {workerProfile?.full_name || dictionary.chat.unknownUser}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {workerProfile?.city || dictionary.chat.cityNotSpecified}
            </p>
          </div>
        </div>

        <div
          className={
            isHistory
              ? "rounded-[28px] border border-slate-200 bg-white/90 p-4 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-5"
              : "rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:p-5"
          }
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">
              {dictionary.chat.messages}
            </h2>

            <p className="text-sm text-slate-500">
              {messages.length} {getMessageWord(locale, messages.length)}
            </p>
          </div>

          {messages.length === 0 ? (
            <ChatEmptyState
              title={dictionary.chat.noMessages}
              description={
                locale === "uk"
                  ? "Почніть розмову, щоб узгодити деталі роботи."
                  : locale === "ru"
                    ? "Начните разговор, чтобы обсудить детали работы."
                    : locale === "sv"
                      ? "Starta konversationen för att diskutera detaljerna kring jobbet."
                      : locale === "pl"
                        ? "Rozpocznij rozmowę, aby ustalić szczegóły zlecenia."
                        : "Start the conversation to discuss the job details."
              }
            />
          ) : (
            <div className="space-y-3">
              {messages.map((message) => {
                const isMine = message.sender_id === user.id
                const senderProfile = profilesMap.get(message.sender_id)
                const senderName =
                  senderProfile?.full_name || dictionary.chat.unknownUser

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[24px] px-4 py-3 shadow-sm sm:max-w-[80%] ${
                        isMine
                          ? isHistory
                            ? "bg-slate-900 text-white"
                            : "bg-rose-600 text-white"
                          : "border border-slate-200 bg-white text-slate-900"
                      }`}
                    >
                      <div
                        className={`mb-1 text-xs ${
                          isMine ? "text-white/70" : "text-slate-500"
                        }`}
                      >
                        {senderName}
                      </div>

                      <div className="whitespace-pre-wrap break-words text-sm leading-6">
                        {message.body || ""}
                      </div>

                      <div
                        className={`mt-2 text-[11px] ${
                          isMine ? "text-white/70" : "text-slate-400"
                        }`}
                      >
                        {formatDateTime(message.created_at)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-6">
          <ChatMessageForm
            jobId={id}
            locale={locale}
            readOnly={isReadOnly}
            readOnlyTitle={readOnlyCopy.title}
            readOnlyDescription={readOnlyCopy.description}
          />
        </div>
      </div>
    </div>
  )
}