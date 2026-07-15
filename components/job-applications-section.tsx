"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import {
  acceptJobApplicationAction,
  rejectJobApplicationAction,
  type DashboardActionState,
} from "@/app/dashboard/actions"
import type { Locale } from "@/lib/i18n"

export type JobApplicationItem = {
  id: string
  job_id: string
  applicant_id: string
  hourly_rate: number | null
  fixed_price: number | null
  message: string | null
  available_from: string | null
  estimated_hours: number | null
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  created_at: string
  profile: {
    id: string
    full_name: string | null
    city: string | null
    avatar_url: string | null
    company_logo_url: string | null
    company_name: string | null
    bankid_verified: boolean | null
  } | null
  rating: {
    average: number
    count: number
  }
}

type JobApplicationsSectionProps = {
  jobId: string
  locale: Locale
  applications: JobApplicationItem[]
  jobStatus:
    | "new"
    | "assigned"
    | "in_progress"
    | "done"
    | "cancelled"
    | null
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const labels = {
  uk: {
    title: "Заявки на роботу",
    subtitle:
      "Перегляньте пропозиції кандидатів і виберіть виконавця.",
    total: "Усього",
    pending: "Очікують",
    accepted: "Прийнято",
    noApplications: "На це оголошення ще немає заявок.",
    unknownUser: "Користувач",
    noCompany: "Без компанії",
    verified: "BankID",
    hourlyRate: "Ціна за годину",
    fixedPrice: "Фіксована ціна",
    estimatedHours: "Орієнтовний час",
    availableFrom: "Може почати",
    message: "Повідомлення",
    submitted: "Подано",
    accept: "Прийняти заявку",
    accepting: "Приймаємо...",
    reject: "Відхилити",
    rejecting: "Відхиляємо...",
    pendingStatus: "Очікує",
    acceptedStatus: "Прийнято",
    rejectedStatus: "Відхилено",
    withdrawnStatus: "Відкликано",
    reviews: "відгуків",
    noReviews: "Ще немає відгуків",
    hours: "год.",
    selectionClosed:
      "Виконавця вже обрано. Інші заявки більше не можна прийняти.",
  },
  ru: {
    title: "Заявки на работу",
    subtitle:
      "Просмотрите предложения кандидатов и выберите исполнителя.",
    total: "Всего",
    pending: "Ожидают",
    accepted: "Принято",
    noApplications: "На это объявление пока нет заявок.",
    unknownUser: "Пользователь",
    noCompany: "Без компании",
    verified: "BankID",
    hourlyRate: "Цена за час",
    fixedPrice: "Фиксированная цена",
    estimatedHours: "Примерное время",
    availableFrom: "Может начать",
    message: "Сообщение",
    submitted: "Отправлено",
    accept: "Принять заявку",
    accepting: "Принимаем...",
    reject: "Отклонить",
    rejecting: "Отклоняем...",
    pendingStatus: "Ожидает",
    acceptedStatus: "Принято",
    rejectedStatus: "Отклонено",
    withdrawnStatus: "Отозвано",
    reviews: "отзывов",
    noReviews: "Отзывов пока нет",
    hours: "ч.",
    selectionClosed:
      "Исполнитель уже выбран. Другие заявки больше нельзя принять.",
  },
  en: {
    title: "Job applications",
    subtitle:
      "Review candidate offers and select the most suitable worker.",
    total: "Total",
    pending: "Pending",
    accepted: "Accepted",
    noApplications: "This job has no applications yet.",
    unknownUser: "User",
    noCompany: "No company",
    verified: "BankID",
    hourlyRate: "Hourly rate",
    fixedPrice: "Fixed price",
    estimatedHours: "Estimated time",
    availableFrom: "Available from",
    message: "Message",
    submitted: "Submitted",
    accept: "Accept application",
    accepting: "Accepting...",
    reject: "Reject",
    rejecting: "Rejecting...",
    pendingStatus: "Pending",
    acceptedStatus: "Accepted",
    rejectedStatus: "Rejected",
    withdrawnStatus: "Withdrawn",
    reviews: "reviews",
    noReviews: "No reviews yet",
    hours: "hours",
    selectionClosed:
      "A worker has already been selected. Other applications can no longer be accepted.",
  },
  sv: {
    title: "Jobbansökningar",
    subtitle:
      "Granska kandidaternas erbjudanden och välj den bästa utföraren.",
    total: "Totalt",
    pending: "Väntar",
    accepted: "Godkänd",
    noApplications: "Det finns inga ansökningar till jobbet ännu.",
    unknownUser: "Användare",
    noCompany: "Inget företag",
    verified: "BankID",
    hourlyRate: "Timpris",
    fixedPrice: "Fast pris",
    estimatedHours: "Beräknad tid",
    availableFrom: "Tillgänglig från",
    message: "Meddelande",
    submitted: "Skickad",
    accept: "Godkänn ansökan",
    accepting: "Godkänner...",
    reject: "Avvisa",
    rejecting: "Avvisar...",
    pendingStatus: "Väntar",
    acceptedStatus: "Godkänd",
    rejectedStatus: "Avvisad",
    withdrawnStatus: "Återkallad",
    reviews: "recensioner",
    noReviews: "Inga recensioner ännu",
    hours: "timmar",
    selectionClosed:
      "En utförare har redan valts. Andra ansökningar kan inte längre godkännas.",
  },
  pl: {
    title: "Oferty wykonawców",
    subtitle:
      "Sprawdź propozycje kandydatów i wybierz odpowiedniego wykonawcę.",
    total: "Wszystkie",
    pending: "Oczekujące",
    accepted: "Przyjęte",
    noApplications: "To zlecenie nie ma jeszcze żadnych ofert.",
    unknownUser: "Użytkownik",
    noCompany: "Bez firmy",
    verified: "BankID",
    hourlyRate: "Stawka godzinowa",
    fixedPrice: "Cena stała",
    estimatedHours: "Szacowany czas",
    availableFrom: "Dostępny od",
    message: "Wiadomość",
    submitted: "Wysłano",
    accept: "Przyjmij ofertę",
    accepting: "Przyjmowanie...",
    reject: "Odrzuć",
    rejecting: "Odrzucanie...",
    pendingStatus: "Oczekuje",
    acceptedStatus: "Przyjęta",
    rejectedStatus: "Odrzucona",
    withdrawnStatus: "Wycofana",
    reviews: "opinii",
    noReviews: "Brak opinii",
    hours: "godz.",
    selectionClosed:
      "Wykonawca został już wybrany. Innych ofert nie można już przyjąć.",
  },
} satisfies Record<Locale, Record<string, string>>

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "U"
}

function getLocaleCode(locale: Locale) {
  const map: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  return map[locale]
}

function formatDate(value: string, locale: Locale) {
  try {
    return new Intl.DateTimeFormat(getLocaleCode(locale), {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function getStatusLabel(
  status: JobApplicationItem["status"],
  locale: Locale,
) {
  const t = labels[locale]

  switch (status) {
    case "accepted":
      return t.acceptedStatus
    case "rejected":
      return t.rejectedStatus
    case "withdrawn":
      return t.withdrawnStatus
    default:
      return t.pendingStatus
  }
}

function getStatusClasses(
  status: JobApplicationItem["status"],
) {
  switch (status) {
    case "accepted":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "rejected":
      return "border-rose-200 bg-rose-50 text-rose-700"
    case "withdrawn":
      return "border-slate-200 bg-slate-100 text-slate-600"
    default:
      return "border-amber-200 bg-amber-50 text-amber-700"
  }
}

function AcceptButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.accepting : t.accept}
    </button>
  )
}

function RejectButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.rejecting : t.reject}
    </button>
  )
}

function ApplicationCard({
  jobId,
  locale,
  application,
  selectionClosed,
}: {
  jobId: string
  locale: Locale
  application: JobApplicationItem
  selectionClosed: boolean
}) {
  const router = useRouter()
  const t = labels[locale]

  const [acceptState, acceptAction] = useActionState(
    acceptJobApplicationAction,
    initialState,
  )

  const [rejectState, rejectAction] = useActionState(
    rejectJobApplicationAction,
    initialState,
  )

  useEffect(() => {
    if (!acceptState.message) {
      return
    }

    if (acceptState.success) {
      toast.success(acceptState.message)
      router.refresh()
      return
    }

    toast.error(acceptState.message)
  }, [acceptState, router])

  useEffect(() => {
    if (!rejectState.message) {
      return
    }

    if (rejectState.success) {
      toast.success(rejectState.message)
      router.refresh()
      return
    }

    toast.error(rejectState.message)
  }, [rejectState, router])

  const profile = application.profile
  const name = profile?.full_name?.trim() || t.unknownUser
  const company =
    profile?.company_name?.trim() || t.noCompany

  const canManage =
    application.status === "pending" &&
    !selectionClosed

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(name)
              )}
            </div>

            {profile?.company_logo_url ? (
              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border-2 border-white bg-white shadow-sm">
                <img
                  src={profile.company_logo_url}
                  alt={company}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-lg font-semibold text-slate-900">
                {name}
              </h3>

              {profile?.bankid_verified ? (
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                  ✓ {t.verified}
                </span>
              ) : null}

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                  application.status,
                )}`}
              >
                {getStatusLabel(application.status, locale)}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {company}
              {profile?.city ? ` • ${profile.city}` : ""}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {application.rating.count > 0 ? (
                <>
                  <span className="font-semibold text-amber-600">
                    ★ {application.rating.average.toFixed(1)}
                  </span>

                  <span className="text-slate-500">
                    ({application.rating.count} {t.reviews})
                  </span>
                </>
              ) : (
                <span className="text-slate-500">
                  {t.noReviews}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {t.submitted}:{" "}
          {formatDate(application.created_at, locale)}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {application.hourly_rate !== null ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.hourlyRate}
            </div>

            <div className="mt-2 text-lg font-semibold text-slate-900">
              {application.hourly_rate} kr/h
            </div>
          </div>
        ) : null}

        {application.fixed_price !== null ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.fixedPrice}
            </div>

            <div className="mt-2 text-lg font-semibold text-slate-900">
              {application.fixed_price} kr
            </div>
          </div>
        ) : null}

        {application.estimated_hours !== null ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.estimatedHours}
            </div>

            <div className="mt-2 text-lg font-semibold text-slate-900">
              {application.estimated_hours} {t.hours}
            </div>
          </div>
        ) : null}

        {application.available_from ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {t.availableFrom}
            </div>

            <div className="mt-2 text-lg font-semibold text-slate-900">
              {formatDate(
                application.available_from,
                locale,
              )}
            </div>
          </div>
        ) : null}
      </div>

      {application.message ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {t.message}
          </div>

          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
            {application.message}
          </p>
        </div>
      ) : null}

      {canManage ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <form action={acceptAction}>
            <input
              type="hidden"
              name="applicationId"
              value={application.id}
            />

            <input
              type="hidden"
              name="jobId"
              value={jobId}
            />

            <AcceptButton locale={locale} />
          </form>

          <form action={rejectAction}>
            <input
              type="hidden"
              name="applicationId"
              value={application.id}
            />

            <input
              type="hidden"
              name="jobId"
              value={jobId}
            />

            <RejectButton locale={locale} />
          </form>
        </div>
      ) : null}
    </article>
  )
}

export default function JobApplicationsSection({
  jobId,
  locale,
  applications,
  jobStatus,
}: JobApplicationsSectionProps) {
  const t = labels[locale]

  const pendingCount = applications.filter(
    (application) => application.status === "pending",
  ).length

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted",
  ).length

  const selectionClosed =
    jobStatus !== "new" || acceptedCount > 0

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-8 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {t.title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
            <div className="text-lg font-semibold text-slate-900">
              {applications.length}
            </div>
            <div className="text-xs text-slate-500">
              {t.total}
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
            <div className="text-lg font-semibold text-amber-700">
              {pendingCount}
            </div>
            <div className="text-xs text-amber-700">
              {t.pending}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
            <div className="text-lg font-semibold text-emerald-700">
              {acceptedCount}
            </div>
            <div className="text-xs text-emerald-700">
              {t.accepted}
            </div>
          </div>
        </div>
      </div>

      {selectionClosed && applications.length > 0 ? (
        <div className="mt-5 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700">
          {t.selectionClosed}
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {applications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 md:p-8">
            {t.noApplications}
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              jobId={jobId}
              locale={locale}
              application={application}
              selectionClosed={selectionClosed}
            />
          ))
        )}
      </div>
    </section>
  )
}