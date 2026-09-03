"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
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

type PriceMode = "fixed" | "hourly"

const labels: Record<Locale, Record<string, string>> = {
  sv: {
    title: "Skicka en ansökan",
    description: "Börja med ditt pris och ett kort meddelande. Fler detaljer är valfria.",
    choosePrice: "Hur vill du ange priset?",
    fixedPrice: "Fast pris",
    hourlyRate: "Timpris",
    pricePlaceholder: "Till exempel 1500",
    hourlyPlaceholder: "Till exempel 250",
    message: "Kort meddelande till beställaren",
    messagePlaceholder: "Till exempel: Jag har erfarenhet av liknande jobb och kan hjälpa dig på önskat datum.",
    moreDetails: "Lägg till fler detaljer (valfritt)",
    estimatedHours: "Beräknat antal timmar",
    estimatedHoursPlaceholder: "Till exempel 5",
    availableFrom: "Tillgänglig från",
    submit: "Skicka ansökan",
    submitting: "Skickar...",
    sentToast: "Ansökan skickades.",
    withdrawnToast: "Ansökan återkallades.",
    pendingTitle: "Ansökan är skickad",
    pendingText: "Du behöver inte göra något nu. Beställaren ser din ansökan och väljer vem som går vidare.",
    acceptedTitle: "Du har fått jobbet",
    acceptedText: "Beställaren har valt dig. Nästa steg är att öppna chatten och komma överens om detaljerna.",
    rejectedTitle: "Beställaren valde en annan utförare",
    rejectedText: "Din ansökan är avslutad. Du kan fortsätta leta efter andra lediga jobb.",
    withdrawnTitle: "Ansökan är återkallad",
    withdrawnText: "Ansökan deltar inte längre i urvalet.",
    withdraw: "Återkalla ansökan",
    withdrawing: "Återkallar...",
    openChat: "Öppna chatten",
    browseJobs: "Hitta fler jobb",
    yourOffer: "Din ansökan",
    hourlyShort: "per timme",
    fixedShort: "fast pris",
    hoursShort: "timmar",
  },
  en: {
    title: "Send an application",
    description: "Start with your price and a short message. Extra details are optional.",
    choosePrice: "How do you want to price the job?",
    fixedPrice: "Fixed price",
    hourlyRate: "Hourly rate",
    pricePlaceholder: "For example 1500",
    hourlyPlaceholder: "For example 250",
    message: "Short message to the customer",
    messagePlaceholder: "For example: I have experience with similar jobs and can help on your preferred date.",
    moreDetails: "Add more details (optional)",
    estimatedHours: "Estimated hours",
    estimatedHoursPlaceholder: "For example 5",
    availableFrom: "Available from",
    submit: "Send application",
    submitting: "Sending...",
    sentToast: "Application sent.",
    withdrawnToast: "Application withdrawn.",
    pendingTitle: "Application sent",
    pendingText: "You do not need to do anything now. The customer can see your application and will choose who to continue with.",
    acceptedTitle: "You got the job",
    acceptedText: "The customer selected you. Next, open the chat and agree on the details.",
    rejectedTitle: "The customer selected another worker",
    rejectedText: "This application is closed. You can continue looking for other available jobs.",
    withdrawnTitle: "Application withdrawn",
    withdrawnText: "This application is no longer part of the selection.",
    withdraw: "Withdraw application",
    withdrawing: "Withdrawing...",
    openChat: "Open chat",
    browseJobs: "Find more jobs",
    yourOffer: "Your application",
    hourlyShort: "per hour",
    fixedShort: "fixed price",
    hoursShort: "hours",
  },
  uk: {
    title: "Надіслати заявку",
    description: "Спочатку вкажіть ціну та коротке повідомлення. Решта деталей необов'язкова.",
    choosePrice: "Як хочете вказати ціну?",
    fixedPrice: "Фіксована ціна",
    hourlyRate: "Ціна за годину",
    pricePlaceholder: "Наприклад 1500",
    hourlyPlaceholder: "Наприклад 250",
    message: "Коротке повідомлення замовнику",
    messagePlaceholder: "Наприклад: Маю досвід подібних робіт і можу допомогти у потрібну дату.",
    moreDetails: "Додати більше деталей (необов'язково)",
    estimatedHours: "Орієнтовна кількість годин",
    estimatedHoursPlaceholder: "Наприклад 5",
    availableFrom: "Можу почати з",
    submit: "Надіслати заявку",
    submitting: "Надсилаємо...",
    sentToast: "Заявку надіслано.",
    withdrawnToast: "Заявку відкликано.",
    pendingTitle: "Заявку надіслано",
    pendingText: "Зараз нічого робити не потрібно. Замовник бачить вашу заявку і сам обере виконавця.",
    acceptedTitle: "Ви отримали роботу",
    acceptedText: "Замовник обрав вас. Наступний крок — відкрити чат і домовитися про деталі.",
    rejectedTitle: "Замовник обрав іншого виконавця",
    rejectedText: "Цю заявку завершено. Ви можете продовжити пошук інших робіт.",
    withdrawnTitle: "Заявку відкликано",
    withdrawnText: "Заявка більше не бере участі у відборі.",
    withdraw: "Відкликати заявку",
    withdrawing: "Відкликаємо...",
    openChat: "Відкрити чат",
    browseJobs: "Знайти інші роботи",
    yourOffer: "Ваша заявка",
    hourlyShort: "за годину",
    fixedShort: "фіксована ціна",
    hoursShort: "год.",
  },
  ru: {
    title: "Отправить заявку",
    description: "Сначала укажите цену и короткое сообщение. Остальные детали необязательны.",
    choosePrice: "Как хотите указать цену?",
    fixedPrice: "Фиксированная цена",
    hourlyRate: "Цена за час",
    pricePlaceholder: "Например 1500",
    hourlyPlaceholder: "Например 250",
    message: "Короткое сообщение заказчику",
    messagePlaceholder: "Например: У меня есть опыт похожих работ, и я могу помочь в нужную дату.",
    moreDetails: "Добавить больше деталей (необязательно)",
    estimatedHours: "Примерное количество часов",
    estimatedHoursPlaceholder: "Например 5",
    availableFrom: "Могу начать с",
    submit: "Отправить заявку",
    submitting: "Отправляем...",
    sentToast: "Заявка отправлена.",
    withdrawnToast: "Заявка отозвана.",
    pendingTitle: "Заявка отправлена",
    pendingText: "Сейчас ничего делать не нужно. Заказчик видит вашу заявку и сам выберет исполнителя.",
    acceptedTitle: "Вы получили работу",
    acceptedText: "Заказчик выбрал вас. Следующий шаг — открыть чат и договориться о деталях.",
    rejectedTitle: "Заказчик выбрал другого исполнителя",
    rejectedText: "Эта заявка завершена. Вы можете продолжить искать другие работы.",
    withdrawnTitle: "Заявка отозвана",
    withdrawnText: "Заявка больше не участвует в отборе.",
    withdraw: "Отозвать заявку",
    withdrawing: "Отзываем...",
    openChat: "Открыть чат",
    browseJobs: "Найти другие работы",
    yourOffer: "Ваша заявка",
    hourlyShort: "в час",
    fixedShort: "фиксированная цена",
    hoursShort: "ч.",
  },
  pl: {
    title: "Wyślij ofertę",
    description: "Zacznij od ceny i krótkiej wiadomości. Dodatkowe szczegóły są opcjonalne.",
    choosePrice: "Jak chcesz podać cenę?",
    fixedPrice: "Cena stała",
    hourlyRate: "Stawka godzinowa",
    pricePlaceholder: "Na przykład 1500",
    hourlyPlaceholder: "Na przykład 250",
    message: "Krótka wiadomość do klienta",
    messagePlaceholder: "Na przykład: Mam doświadczenie w podobnych zleceniach i mogę pomóc w wybranym terminie.",
    moreDetails: "Dodaj więcej szczegółów (opcjonalnie)",
    estimatedHours: "Szacowana liczba godzin",
    estimatedHoursPlaceholder: "Na przykład 5",
    availableFrom: "Dostępny od",
    submit: "Wyślij ofertę",
    submitting: "Wysyłanie...",
    sentToast: "Oferta została wysłana.",
    withdrawnToast: "Oferta została wycofana.",
    pendingTitle: "Oferta została wysłana",
    pendingText: "Nie musisz teraz nic robić. Klient widzi Twoją ofertę i wybierze wykonawcę.",
    acceptedTitle: "Masz to zlecenie",
    acceptedText: "Klient wybrał Ciebie. Następny krok to otwarcie czatu i ustalenie szczegółów.",
    rejectedTitle: "Klient wybrał innego wykonawcę",
    rejectedText: "Ta oferta jest zakończona. Możesz szukać innych dostępnych zleceń.",
    withdrawnTitle: "Oferta została wycofana",
    withdrawnText: "Oferta nie bierze już udziału w wyborze.",
    withdraw: "Wycofaj ofertę",
    withdrawing: "Wycofywanie...",
    openChat: "Otwórz czat",
    browseJobs: "Znajdź więcej zleceń",
    yourOffer: "Twoja oferta",
    hourlyShort: "za godzinę",
    fixedShort: "cena stała",
    hoursShort: "godz.",
  },
}

function ApplySubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? t.submitting : t.submit}
    </button>
  )
}

function WithdrawSubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus()
  const t = labels[locale]
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-rose-200 bg-white px-5 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? t.withdrawing : t.withdraw}
    </button>
  )
}

function ApplicationDetails({ application, locale }: { application: CurrentJobApplication; locale: Locale }) {
  const t = labels[locale]
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t.yourOffer}</div>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {application.hourly_rate !== null ? <div><strong>{application.hourly_rate} kr</strong> {t.hourlyShort}</div> : null}
        {application.fixed_price !== null ? <div><strong>{application.fixed_price} kr</strong> {t.fixedShort}</div> : null}
        {application.estimated_hours !== null ? <div><strong>{application.estimated_hours}</strong> {t.hoursShort}</div> : null}
        {application.available_from ? <div>{application.available_from}</div> : null}
        {application.message ? <div className="whitespace-pre-wrap break-words text-slate-600">{application.message}</div> : null}
      </div>
    </div>
  )
}

export default function TakeJobForm({ jobId, locale, application }: TakeJobFormProps) {
  const router = useRouter()
  const t = labels[locale]
  const [priceMode, setPriceMode] = useState<PriceMode>("fixed")
  const [applyState, applyAction] = useActionState(applyToJobAction, initialState)
  const [withdrawState, withdrawAction] = useActionState(withdrawJobApplicationAction, initialState)

  useEffect(() => {
    if (!applyState.message) return
    if (applyState.success) {
      toast.success(t.sentToast)
      router.refresh()
      return
    }
    toast.error(applyState.message)
  }, [applyState, router, t.sentToast])

  useEffect(() => {
    if (!withdrawState.message) return
    if (withdrawState.success) {
      toast.success(t.withdrawnToast)
      router.refresh()
      return
    }
    toast.error(withdrawState.message)
  }, [withdrawState, router, t.withdrawnToast])

  if (application) {
    const statusCopy = {
      pending: { title: t.pendingTitle, text: t.pendingText },
      accepted: { title: t.acceptedTitle, text: t.acceptedText },
      rejected: { title: t.rejectedTitle, text: t.rejectedText },
      withdrawn: { title: t.withdrawnTitle, text: t.withdrawnText },
    }[application.status]

    return (
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-xl font-semibold text-slate-950">{statusCopy.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{statusCopy.text}</p>
        <div className="mt-5"><ApplicationDetails application={application} locale={locale} /></div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {application.status === "accepted" ? (
            <Link href={`/jobs/${jobId}/chat`} prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700">
              {t.openChat}
            </Link>
          ) : null}
          {application.status === "rejected" || application.status === "withdrawn" ? (
            <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {t.browseJobs}
            </Link>
          ) : null}
          {application.status === "pending" ? (
            <form action={withdrawAction}>
              <input type="hidden" name="applicationId" value={application.id} />
              <input type="hidden" name="jobId" value={jobId} />
              <WithdrawSubmitButton locale={locale} />
            </form>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <form action={applyAction} className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <input type="hidden" name="jobId" value={jobId} />

      <h2 className="text-xl font-semibold text-slate-950">{t.title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{t.description}</p>

      <div className="mt-6">
        <div className="text-sm font-medium text-slate-800">{t.choosePrice}</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setPriceMode("fixed")} className={`min-h-11 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${priceMode === "fixed" ? "border-rose-600 bg-rose-50 text-rose-800" : "border-slate-300 bg-white text-slate-700"}`}>
            {t.fixedPrice}
          </button>
          <button type="button" onClick={() => setPriceMode("hourly")} className={`min-h-11 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${priceMode === "hourly" ? "border-rose-600 bg-rose-50 text-rose-800" : "border-slate-300 bg-white text-slate-700"}`}>
            {t.hourlyRate}
          </button>
        </div>

        <div className="relative mt-3">
          {priceMode === "fixed" ? (
            <input type="number" name="fixedPrice" min="1" step="0.01" inputMode="decimal" required placeholder={t.pricePlaceholder} className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
          ) : (
            <input type="number" name="hourlyRate" min="1" step="0.01" inputMode="decimal" required placeholder={t.hourlyPlaceholder} className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
          )}
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">{priceMode === "hourly" ? "kr/h" : "kr"}</span>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-slate-800">{t.message}</span>
        <textarea name="message" rows={4} maxLength={2000} placeholder={t.messagePlaceholder} className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
      </label>

      <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-700">{t.moreDetails}</summary>
        <div className="grid gap-4 border-t border-slate-200 p-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.estimatedHours}</span>
            <input type="number" name="estimatedHours" min="0.5" step="0.5" inputMode="decimal" placeholder={t.estimatedHoursPlaceholder} className="mt-2 min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.availableFrom}</span>
            <input type="date" name="availableFrom" className="mt-2 min-h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100" />
          </label>
        </div>
      </details>

      <div className="mt-6"><ApplySubmitButton locale={locale} /></div>
    </form>
  )
}
