"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import type { Locale } from "@/lib/i18n"

type Reason = "spam" | "scam" | "fake_job" | "inappropriate_content" | "other"

type Props = {
  jobId: string
  locale?: Locale
}

type ReportCopy = {
  button: string
  badge: string
  title: string
  description: string
  extraDetails: string
  placeholder: string
  cancel: string
  send: string
  sending: string
  success: string
  error: string
  reasons: Record<
    Reason,
    {
      label: string
      description: string
    }
  >
}

const copy: Record<Locale, ReportCopy> = {
  uk: {
    button: "Поскаржитися",
    badge: "Скарга",
    title: "Поскаржитися на роботу",
    description:
      "Поясніть, чому цю роботу має перевірити команда модерації Clean Jobs.",
    extraDetails: "Додаткові деталі",
    placeholder: "Додайте пояснення для адміністратора...",
    cancel: "Скасувати",
    send: "Надіслати скаргу",
    sending: "Надсилання...",
    success: "Скаргу надіслано. Дякуємо, що допомагаєте зробити Clean Jobs безпечнішим.",
    error: "Не вдалося надіслати скаргу.",
    reasons: {
      spam: {
        label: "Спам",
        description: "Повторюваний, нерелевантний або рекламний контент.",
      },
      scam: {
        label: "Шахрайство",
        description: "Підозріла оплата, особисті дані або ризик обману.",
      },
      fake_job: {
        label: "Фейкова робота",
        description: "Робота виглядає нереальною або ненадійною.",
      },
      inappropriate_content: {
        label: "Неприйнятний контент",
        description: "Образливий, небезпечний або агресивний контент.",
      },
      other: {
        label: "Інше",
        description: "Інша причина, яку має перевірити модератор.",
      },
    },
  },
  ru: {
    button: "Пожаловаться",
    badge: "Жалоба",
    title: "Пожаловаться на работу",
    description:
      "Объясните, почему эту работу должна проверить команда модерации Clean Jobs.",
    extraDetails: "Дополнительные детали",
    placeholder: "Добавьте пояснение для администратора...",
    cancel: "Отмена",
    send: "Отправить жалобу",
    sending: "Отправка...",
    success: "Жалоба отправлена. Спасибо, что помогаете сделать Clean Jobs безопаснее.",
    error: "Не удалось отправить жалобу.",
    reasons: {
      spam: {
        label: "Спам",
        description: "Повторяющийся, нерелевантный или рекламный контент.",
      },
      scam: {
        label: "Мошенничество",
        description: "Подозрительная оплата, личные данные или риск обмана.",
      },
      fake_job: {
        label: "Фейковая работа",
        description: "Работа выглядит нереальной или ненадёжной.",
      },
      inappropriate_content: {
        label: "Неприемлемый контент",
        description: "Оскорбительный, опасный или агрессивный контент.",
      },
      other: {
        label: "Другое",
        description: "Другая причина, которую должен проверить модератор.",
      },
    },
  },
  en: {
    button: "Report job",
    badge: "Report",
    title: "Report this job",
    description:
      "Tell us why this job should be reviewed by the Clean Jobs moderation team.",
    extraDetails: "Extra details",
    placeholder: "Add context for the admin team...",
    cancel: "Cancel",
    send: "Send report",
    sending: "Sending...",
    success: "Report sent. Thank you for helping keep Clean Jobs safe.",
    error: "Failed to send report.",
    reasons: {
      spam: {
        label: "Spam",
        description: "Repeated, irrelevant or promotional content.",
      },
      scam: {
        label: "Scam",
        description: "Suspicious payment, identity or fraud risk.",
      },
      fake_job: {
        label: "Fake job",
        description: "The job does not look real or trustworthy.",
      },
      inappropriate_content: {
        label: "Inappropriate content",
        description: "Offensive, unsafe or abusive content.",
      },
      other: {
        label: "Other",
        description: "Something else that should be reviewed.",
      },
    },
  },
  sv: {
    button: "Rapportera jobb",
    badge: "Rapport",
    title: "Rapportera detta jobb",
    description:
      "Berätta varför detta jobb bör granskas av Clean Jobs modereringsteam.",
    extraDetails: "Extra detaljer",
    placeholder: "Lägg till mer information för administratören...",
    cancel: "Avbryt",
    send: "Skicka rapport",
    sending: "Skickar...",
    success: "Rapporten har skickats. Tack för att du hjälper till att hålla Clean Jobs säkert.",
    error: "Det gick inte att skicka rapporten.",
    reasons: {
      spam: {
        label: "Spam",
        description: "Upprepat, irrelevant eller reklaminriktat innehåll.",
      },
      scam: {
        label: "Bedrägeri",
        description: "Misstänkt betalning, identitet eller risk för bedrägeri.",
      },
      fake_job: {
        label: "Falskt jobb",
        description: "Jobbet verkar inte vara riktigt eller pålitligt.",
      },
      inappropriate_content: {
        label: "Olämpligt innehåll",
        description: "Stötande, osäkert eller kränkande innehåll.",
      },
      other: {
        label: "Annat",
        description: "Något annat som bör granskas.",
      },
    },
  },
  pl: {
    button: "Zgłoś ofertę",
    badge: "Zgłoszenie",
    title: "Zgłoś tę ofertę",
    description:
      "Napisz, dlaczego ta oferta powinna zostać sprawdzona przez zespół moderacji Clean Jobs.",
    extraDetails: "Dodatkowe szczegóły",
    placeholder: "Dodaj informacje dla administratora...",
    cancel: "Anuluj",
    send: "Wyślij zgłoszenie",
    sending: "Wysyłanie...",
    success: "Zgłoszenie wysłane. Dziękujemy za pomoc w utrzymaniu bezpieczeństwa Clean Jobs.",
    error: "Nie udało się wysłać zgłoszenia.",
    reasons: {
      spam: {
        label: "Spam",
        description: "Powtarzalna, nieistotna lub reklamowa treść.",
      },
      scam: {
        label: "Oszustwo",
        description: "Podejrzana płatność, tożsamość lub ryzyko oszustwa.",
      },
      fake_job: {
        label: "Fałszywa oferta",
        description: "Oferta wygląda na nieprawdziwą lub niewiarygodną.",
      },
      inappropriate_content: {
        label: "Nieodpowiednia treść",
        description: "Obraźliwa, niebezpieczna lub agresywna treść.",
      },
      other: {
        label: "Inne",
        description: "Inny powód wymagający sprawdzenia.",
      },
    },
  },
}

const reasonOrder: Reason[] = [
  "spam",
  "scam",
  "fake_job",
  "inappropriate_content",
  "other",
]

export default function ReportJobForm({ jobId, locale = "en" }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<Reason>("spam")
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const t = copy[locale] || copy.en

  function closeModal() {
    if (isPending) return

    setIsOpen(false)
    setReason("spam")
    setMessage("")
  }

  function submitReport() {
    if (isPending) return

    startTransition(async () => {
      const response = await fetch("/api/job-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId,
          reason,
          message,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        toast.error(data?.error || t.error)
        return
      }

      toast.success(t.success)
      closeModal()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.97]"
      >
        {t.button}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 px-4 py-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.28)]">
            <div className="bg-gradient-to-br from-white via-white to-rose-50 px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                {t.badge}
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                {t.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.description}
              </p>
            </div>

            <div className="space-y-5 px-5 py-5 sm:px-6">
              <div className="grid gap-2">
                {reasonOrder.map((item) => {
                  const current = t.reasons[item]
                  const isActive = item === reason

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setReason(item)}
                      disabled={isPending}
                      className={`rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
                        isActive
                          ? "border-rose-200 bg-rose-50"
                          : "border-slate-200 bg-white hover:border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      <span className="block text-sm font-semibold text-slate-950">
                        {current.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        {current.description}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div>
                <label
                  htmlFor="report-message"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  {t.extraDetails}
                </label>

                <textarea
                  id="report-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={1000}
                  rows={4}
                  placeholder={t.placeholder}
                  className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t.cancel}
                </button>

                <button
                  type="button"
                  onClick={submitReport}
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? t.sending : t.send}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}