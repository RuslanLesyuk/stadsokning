"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  applyToJobAction,
  withdrawJobApplicationAction,
  type DashboardActionState,
} from "@/app/dashboard/actions"
import type { Locale } from "@/lib/i18n"

export type CurrentJobApplication = {
  id: string
  hourly_rate: number | null
  fixed_price: number | null
  message: string | null
  available_from: string | null
  estimated_hours: number | null
  status: "pending" | "accepted" | "rejected" | "withdrawn"
}

type TakeJobFormProps = {
  jobId: string
  locale: Locale
  application: CurrentJobApplication | null
}

const initialState: DashboardActionState = {
  success: false,
  message: "",
}

const labels: Record<
  Locale,
  {
    title: string
    description: string
    hourlyRate: string
    hourlyRatePlaceholder: string
    fixedPrice: string
    fixedPricePlaceholder: string
    estimatedHours: string
    estimatedHoursPlaceholder: string
    availableFrom: string
    message: string
    messagePlaceholder: string
    priceHint: string
    submit: string
    submitting: string
    pendingTitle: string
    pendingText: string
    acceptedTitle: string
    acceptedText: string
    rejectedTitle: string
    rejectedText: string
    withdrawnTitle: string
    withdrawnText: string
    withdraw: string
    withdrawing: string
    hourlyShort: string
    fixedShort: string
    hoursShort: string
  }
> = {
  uk: {
    title: "Подати заявку",
    description:
      "Вкажіть свою ціну, доступність і коротко опишіть свою пропозицію.",
    hourlyRate: "Ціна за годину",
    hourlyRatePlaceholder: "Наприклад, 250",
    fixedPrice: "Фіксована ціна",
    fixedPricePlaceholder: "Наприклад, 1500",
    estimatedHours: "Орієнтовна кількість годин",
    estimatedHoursPlaceholder: "Наприклад, 5",
    availableFrom: "Можу почати з",
    message: "Повідомлення замовнику",
    messagePlaceholder:
      "Розкажіть про свій досвід і чому ви підходите для цієї роботи.",
    priceHint:
      "Потрібно вказати ціну за годину або фіксовану ціну.",
    submit: "Надіслати заявку",
    submitting: "Надсилаємо заявку...",
    pendingTitle: "Заявку надіслано",
    pendingText:
      "Власник оголошення розгляне вашу пропозицію.",
    acceptedTitle: "Вашу заявку прийнято",
    acceptedText:
      "Ви призначені виконавцем. Тепер доступний чат із замовником.",
    rejectedTitle: "Заявку відхилено",
    rejectedText:
      "Власник оголошення обрав іншу пропозицію.",
    withdrawnTitle: "Заявку відкликано",
    withdrawnText:
      "Ця заявка більше не бере участі у відборі.",
    withdraw: "Відкликати заявку",
    withdrawing: "Відкликаємо...",
    hourlyShort: "за годину",
    fixedShort: "фіксована ціна",
    hoursShort: "год.",
  },
  ru: {
    title: "Подать заявку",
    description:
      "Укажите свою цену, доступность и кратко опишите предложение.",
    hourlyRate: "Цена за час",
    hourlyRatePlaceholder: "Например, 250",
    fixedPrice: "Фиксированная цена",
    fixedPricePlaceholder: "Например, 1500",
    estimatedHours: "Примерное количество часов",
    estimatedHoursPlaceholder: "Например, 5",
    availableFrom: "Могу начать с",
    message: "Сообщение заказчику",
    messagePlaceholder:
      "Расскажите о своём опыте и почему вы подходите для этой работы.",
    priceHint:
      "Нужно указать цену за час или фиксированную цену.",
    submit: "Отправить заявку",
    submitting: "Отправляем заявку...",
    pendingTitle: "Заявка отправлена",
    pendingText:
      "Владелец объявления рассмотрит ваше предложение.",
    acceptedTitle: "Ваша заявка принята",
    acceptedText:
      "Вы назначены исполнителем. Теперь доступен чат с заказчиком.",
    rejectedTitle: "Заявка отклонена",
    rejectedText:
      "Владелец объявления выбрал другое предложение.",
    withdrawnTitle: "Заявка отозвана",
    withdrawnText:
      "Эта заявка больше не участвует в отборе.",
    withdraw: "Отозвать заявку",
    withdrawing: "Отзываем...",
    hourlyShort: "в час",
    fixedShort: "фиксированная цена",
    hoursShort: "ч.",
  },
  en: {
    title: "Apply for this job",
    description:
      "Enter your price, availability and a short message for the job owner.",
    hourlyRate: "Hourly rate",
    hourlyRatePlaceholder: "For example, 250",
    fixedPrice: "Fixed price",
    fixedPricePlaceholder: "For example, 1500",
    estimatedHours: "Estimated hours",
    estimatedHoursPlaceholder: "For example, 5",
    availableFrom: "Available from",
    message: "Message to the job owner",
    messagePlaceholder:
      "Describe your experience and why you are suitable for this job.",
    priceHint:
      "Enter either an hourly rate or a fixed price.",
    submit: "Submit application",
    submitting: "Submitting application...",
    pendingTitle: "Application submitted",
    pendingText:
      "The job owner will review your offer.",
    acceptedTitle: "Your application was accepted",
    acceptedText:
      "You are now assigned to this job. Chat with the job owner is available.",
    rejectedTitle: "Application rejected",
    rejectedText:
      "The job owner selected another offer.",
    withdrawnTitle: "Application withdrawn",
    withdrawnText:
      "This application is no longer participating in the selection.",
    withdraw: "Withdraw application",
    withdrawing: "Withdrawing...",
    hourlyShort: "per hour",
    fixedShort: "fixed price",
    hoursShort: "hours",
  },
  sv: {
    title: "Ansök om jobbet",
    description:
      "Ange ditt pris, din tillgänglighet och ett kort meddelande till beställaren.",
    hourlyRate: "Timpris",
    hourlyRatePlaceholder: "Till exempel 250",
    fixedPrice: "Fast pris",
    fixedPricePlaceholder: "Till exempel 1500",
    estimatedHours: "Beräknat antal timmar",
    estimatedHoursPlaceholder: "Till exempel 5",
    availableFrom: "Tillgänglig från",
    message: "Meddelande till beställaren",
    messagePlaceholder:
      "Beskriv din erfarenhet och varför du passar för jobbet.",
    priceHint:
      "Ange antingen ett timpris eller ett fast pris.",
    submit: "Skicka ansökan",
    submitting: "Skickar ansökan...",
    pendingTitle: "Ansökan skickad",
    pendingText:
      "Beställaren kommer att granska ditt erbjudande.",
    acceptedTitle: "Din ansökan har godkänts",
    acceptedText:
      "Du har tilldelats jobbet. Chatten med beställaren är nu tillgänglig.",
    rejectedTitle: "Ansökan avvisad",
    rejectedText:
      "Beställaren valde ett annat erbjudande.",
    withdrawnTitle: "Ansökan återkallad",
    withdrawnText:
      "Den här ansökan deltar inte längre i urvalet.",
    withdraw: "Återkalla ansökan",
    withdrawing: "Återkallar...",
    hourlyShort: "per timme",
    fixedShort: "fast pris",
    hoursShort: "timmar",
  },
  pl: {
    title: "Złóż ofertę",
    description:
      "Podaj swoją cenę, dostępność i krótką wiadomość dla właściciela zlecenia.",
    hourlyRate: "Stawka godzinowa",
    hourlyRatePlaceholder: "Na przykład 250",
    fixedPrice: "Cena stała",
    fixedPricePlaceholder: "Na przykład 1500",
    estimatedHours: "Szacowana liczba godzin",
    estimatedHoursPlaceholder: "Na przykład 5",
    availableFrom: "Dostępny od",
    message: "Wiadomość do zleceniodawcy",
    messagePlaceholder:
      "Opisz swoje doświadczenie i dlaczego pasujesz do tego zlecenia.",
    priceHint:
      "Podaj stawkę godzinową albo cenę stałą.",
    submit: "Wyślij ofertę",
    submitting: "Wysyłanie oferty...",
    pendingTitle: "Oferta została wysłana",
    pendingText:
      "Właściciel zlecenia sprawdzi Twoją propozycję.",
    acceptedTitle: "Twoja oferta została przyjęta",
    acceptedText:
      "Zlecenie zostało Ci przypisane. Czat ze zleceniodawcą jest już dostępny.",
    rejectedTitle: "Oferta została odrzucona",
    rejectedText:
      "Właściciel zlecenia wybrał inną propozycję.",
    withdrawnTitle: "Oferta została wycofana",
    withdrawnText:
      "Ta oferta nie bierze już udziału w wyborze.",
    withdraw: "Wycofaj ofertę",
    withdrawing: "Wycofywanie...",
    hourlyShort: "za godzinę",
    fixedShort: "cena stała",
    hoursShort: "godz.",
  },
}

function ApplySubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.submitting : t.submit}
    </button>
  )
}

function WithdrawSubmitButton({
  locale,
}: {
  locale: Locale
}) {
  const { pending } = useFormStatus()
  const t = labels[locale]

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? t.withdrawing : t.withdraw}
    </button>
  )
}

function ApplicationDetails({
  application,
  locale,
}: {
  application: CurrentJobApplication
  locale: Locale
}) {
  const t = labels[locale]

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      {application.hourly_rate !== null ? (
        <div>
          <span className="font-semibold">
            {application.hourly_rate} kr
          </span>{" "}
          {t.hourlyShort}
        </div>
      ) : null}

      {application.fixed_price !== null ? (
        <div>
          <span className="font-semibold">
            {application.fixed_price} kr
          </span>{" "}
          {t.fixedShort}
        </div>
      ) : null}

      {application.estimated_hours !== null ? (
        <div>
          <span className="font-semibold">
            {application.estimated_hours}
          </span>{" "}
          {t.hoursShort}
        </div>
      ) : null}

      {application.available_from ? (
        <div>{application.available_from}</div>
      ) : null}

      {application.message ? (
        <div className="whitespace-pre-wrap break-words text-slate-600">
          {application.message}
        </div>
      ) : null}
    </div>
  )
}

export default function TakeJobForm({
  jobId,
  locale,
  application,
}: TakeJobFormProps) {
  const router = useRouter()
  const [applyState, applyAction] = useActionState(
    applyToJobAction,
    initialState,
  )

  const [withdrawState, withdrawAction] = useActionState(
    withdrawJobApplicationAction,
    initialState,
  )

    useEffect(() => {
    if (!applyState.message) {
      return
    }

    if (applyState.success) {
      toast.success(applyState.message)
      router.refresh()
      return
    }

    toast.error(applyState.message)
  }, [applyState, router])

  useEffect(() => {
    if (!withdrawState.message) {
      return
    }

    if (withdrawState.success) {
      toast.success(withdrawState.message)
      router.refresh()
      return
    }

    toast.error(withdrawState.message)
  }, [withdrawState, router])

  const t = labels[locale]

  if (application) {
    const statusCopy = {
      pending: {
        title: t.pendingTitle,
        text: t.pendingText,
      },
      accepted: {
        title: t.acceptedTitle,
        text: t.acceptedText,
      },
      rejected: {
        title: t.rejectedTitle,
        text: t.rejectedText,
      },
      withdrawn: {
        title: t.withdrawnTitle,
        text: t.withdrawnText,
      },
    }[application.status]

    return (
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          {statusCopy.title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {statusCopy.text}
        </p>

        <div className="mt-4">
          <ApplicationDetails
            application={application}
            locale={locale}
          />
        </div>

        {application.status === "pending" ? (
          <form
            action={withdrawAction}
            className="mt-4"
          >
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

            <WithdrawSubmitButton locale={locale} />
          </form>
        ) : null}
      </div>
    )
  }

  return (
    <form
      action={applyAction}
      className="w-full space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <input type="hidden" name="jobId" value={jobId} />

      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {t.title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {t.description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t.hourlyRate}
          </span>

          <div className="relative mt-2">
            <input
              type="number"
              name="hourlyRate"
              min="1"
              step="0.01"
              inputMode="decimal"
              placeholder={t.hourlyRatePlaceholder}
              className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              kr
            </span>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t.fixedPrice}
          </span>

          <div className="relative mt-2">
            <input
              type="number"
              name="fixedPrice"
              min="1"
              step="0.01"
              inputMode="decimal"
              placeholder={t.fixedPricePlaceholder}
              className="min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
              kr
            </span>
          </div>
        </label>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {t.priceHint}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t.estimatedHours}
          </span>

          <input
            type="number"
            name="estimatedHours"
            min="0.5"
            step="0.5"
            inputMode="decimal"
            placeholder={t.estimatedHoursPlaceholder}
            className="mt-2 min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t.availableFrom}
          </span>

          <input
            type="date"
            name="availableFrom"
            className="mt-2 min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">
          {t.message}
        </span>

        <textarea
          name="message"
          rows={5}
          maxLength={2000}
          placeholder={t.messagePlaceholder}
          className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
        />
      </label>

      <ApplySubmitButton locale={locale} />
    </form>
  )
}