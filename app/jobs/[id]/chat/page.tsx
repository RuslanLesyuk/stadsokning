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

function ChatEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-12 text-center">
      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
          💬
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-black md:text-xl">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-black/55 md:text-base">
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
    ["assigned", "in_progress", "done"].includes(job.status || "")

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-8">
      <ChatLiveRefresh interval={30000} />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href={`/jobs/${id}`}
            prefetch={false}
            className="text-sm text-black/60 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 rounded-md"
          >
            {dictionary.chat.backToJob}
          </Link>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-black md:text-3xl">
            {dictionary.chat.title}
          </h1>

          <p className="mt-1 text-sm text-black/60">
            {job.title || dictionary.jobs.untitledJob}
          </p>
        </div>

        <div className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm text-black/70 shadow-sm">
          {dictionary.chat.autoRefresh}: {dictionary.chat.every30Seconds}
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-black/50">
            {dictionary.chat.author}
          </p>
          <p className="mt-1 text-base font-medium text-black">
            {authorProfile?.full_name || dictionary.chat.unknownUser}
          </p>
          <p className="mt-1 text-sm text-black/60">
            {authorProfile?.city || dictionary.chat.cityNotSpecified}
          </p>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-black/50">
            {dictionary.chat.worker}
          </p>
          <p className="mt-1 text-base font-medium text-black">
            {workerProfile?.full_name || dictionary.chat.unknownUser}
          </p>
          <p className="mt-1 text-sm text-black/60">
            {workerProfile?.city || dictionary.chat.cityNotSpecified}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-black">
            {dictionary.chat.messages}
          </h2>

          <p className="text-sm text-black/50">
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm sm:max-w-[80%] ${
                      isMine
                        ? "bg-black text-white"
                        : "border border-black/10 bg-white text-black"
                    }`}
                  >
                    <div
                      className={`mb-1 text-xs ${
                        isMine ? "text-white/70" : "text-black/50"
                      }`}
                    >
                      {senderName}
                    </div>

                    <div className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.body || ""}
                    </div>

                    <div
                      className={`mt-2 text-[11px] ${
                        isMine ? "text-white/70" : "text-black/40"
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
        <ChatMessageForm jobId={id} locale={locale} />
      </div>
    </div>
  )
}