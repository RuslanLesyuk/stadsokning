"use client"

import {
  useEffect,
  useState,
  useTransition,
} from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import type { Locale } from "@/lib/i18n"

type LanguageOption = {
  value: Locale
  label: string
  nativeLabel: string
  flag: string
}

type ModalStep = "language" | "welcome"

type WelcomeCopy = {
  eyebrow: string
  title: string
  description: string
  steps: Array<{
    title: string
    description: string
  }>
  start: string
  faq: string
  changeLanguage: string
}

const languages: LanguageOption[] = [
  {
    value: "sv",
    label: "Svenska",
    nativeLabel: "Svenska",
    flag: "🇸🇪",
  },
  {
    value: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
  },
  {
    value: "uk",
    label: "Ukrainska",
    nativeLabel: "Українська",
    flag: "🇺🇦",
  },
  {
    value: "ru",
    label: "Ryska",
    nativeLabel: "Русский",
    flag: "🇷🇺",
  },
  {
    value: "pl",
    label: "Polska",
    nativeLabel: "Polski",
    flag: "🇵🇱",
  },
]

const welcomeCopy: Record<Locale, WelcomeCopy> = {
  uk: {
    eyebrow: "Як працює Clean Jobs",
    title: "Ласкаво просимо до Clean Jobs",
    description:
      "Тут ви можете знайти роботу з прибирання, опублікувати замовлення або запропонувати послуги своєї компанії.",
    steps: [
      {
        title: "Знайдіть або створіть замовлення",
        description:
          "Переглядайте доступні роботи або опублікуйте власне замовлення на прибирання.",
      },
      {
        title: "Подайте або отримайте заявки",
        description:
          "Виконавці пропонують свою ціну, а замовник порівнює профілі, рейтинг і умови.",
      },
      {
        title: "Оберіть виконавця та відкрийте чат",
        description:
          "Після схвалення заявки учасники отримують доступ до приватного чату.",
      },
      {
        title: "Завершіть роботу та залиште відгук",
        description:
          "Після завершення роботи обидві сторони можуть оцінити співпрацю.",
      },
    ],
    start: "Почати користування",
    faq: "Переглянути FAQ",
    changeLanguage: "Змінити мову",
  },

  ru: {
    eyebrow: "Как работает Clean Jobs",
    title: "Добро пожаловать в Clean Jobs",
    description:
      "Здесь вы можете найти работу по уборке, опубликовать заказ или предложить услуги своей компании.",
    steps: [
      {
        title: "Найдите или создайте заказ",
        description:
          "Просматривайте доступные работы или опубликуйте собственный заказ на уборку.",
      },
      {
        title: "Подайте или получите заявки",
        description:
          "Исполнители предлагают цену, а заказчик сравнивает профили, рейтинг и условия.",
      },
      {
        title: "Выберите исполнителя и откройте чат",
        description:
          "После одобрения заявки участники получают доступ к приватному чату.",
      },
      {
        title: "Завершите работу и оставьте отзыв",
        description:
          "После завершения работы обе стороны могут оценить сотрудничество.",
      },
    ],
    start: "Начать пользоваться",
    faq: "Посмотреть FAQ",
    changeLanguage: "Изменить язык",
  },

  en: {
    eyebrow: "How Clean Jobs works",
    title: "Welcome to Clean Jobs",
    description:
      "Find cleaning work, publish a cleaning request or promote your company’s services across Sweden.",
    steps: [
      {
        title: "Find or publish a job",
        description:
          "Browse available cleaning jobs or publish your own cleaning request.",
      },
      {
        title: "Send or receive applications",
        description:
          "Workers submit their price and details while clients compare profiles, ratings and terms.",
      },
      {
        title: "Choose a worker and open the chat",
        description:
          "After an application is accepted, both participants receive access to a private chat.",
      },
      {
        title: "Complete the job and leave a review",
        description:
          "After the job is completed, both participants can review their experience.",
      },
    ],
    start: "Start using Clean Jobs",
    faq: "View FAQ",
    changeLanguage: "Change language",
  },

  sv: {
    eyebrow: "Så fungerar Clean Jobs",
    title: "Välkommen till Clean Jobs",
    description:
      "Här kan du hitta städjobb, publicera ett städuppdrag eller erbjuda ditt företags tjänster.",
    steps: [
      {
        title: "Hitta eller publicera ett jobb",
        description:
          "Bläddra bland tillgängliga städjobb eller publicera ditt eget städuppdrag.",
      },
      {
        title: "Skicka eller ta emot ansökningar",
        description:
          "Arbetare lämnar pris och information medan kunden jämför profiler, betyg och villkor.",
      },
      {
        title: "Välj en arbetare och öppna chatten",
        description:
          "När en ansökan godkänns får båda deltagarna tillgång till en privat chatt.",
      },
      {
        title: "Slutför jobbet och lämna en recension",
        description:
          "När jobbet är klart kan båda deltagarna betygsätta samarbetet.",
      },
    ],
    start: "Börja använda Clean Jobs",
    faq: "Visa vanliga frågor",
    changeLanguage: "Byt språk",
  },

  pl: {
    eyebrow: "Jak działa Clean Jobs",
    title: "Witamy w Clean Jobs",
    description:
      "Tutaj możesz znaleźć pracę przy sprzątaniu, opublikować zlecenie lub zaoferować usługi swojej firmy.",
    steps: [
      {
        title: "Znajdź lub opublikuj zlecenie",
        description:
          "Przeglądaj dostępne prace albo opublikuj własne zlecenie sprzątania.",
      },
      {
        title: "Wyślij lub otrzymaj zgłoszenia",
        description:
          "Wykonawcy proponują cenę i warunki, a klient porównuje profile oraz opinie.",
      },
      {
        title: "Wybierz wykonawcę i otwórz czat",
        description:
          "Po zaakceptowaniu zgłoszenia obie strony otrzymują dostęp do prywatnego czatu.",
      },
      {
        title: "Zakończ pracę i dodaj opinię",
        description:
          "Po zakończeniu pracy obie strony mogą ocenić współpracę.",
      },
    ],
    start: "Rozpocznij korzystanie",
    faq: "Zobacz FAQ",
    changeLanguage: "Zmień język",
  },
}

const ONBOARDING_STORAGE_KEY =
  "clean_jobs_welcome_seen_v1"

function getCookieLocale(): Locale | null {
  const cookie = document.cookie
    .split("; ")
    .find((item) =>
      item.startsWith("clean_jobs_locale="),
    )

  const value = cookie?.split("=")[1]

  if (
    value === "uk" ||
    value === "ru" ||
    value === "en" ||
    value === "sv" ||
    value === "pl"
  ) {
    return value
  }

  return null
}

export default function LanguageWelcomeModal() {
  const router = useRouter()

  const [isVisible, setIsVisible] =
    useState(false)

  const [step, setStep] =
    useState<ModalStep>("language")

  const [selectedLocale, setSelectedLocale] =
    useState<Locale>("sv")

  const [isPending, startTransition] =
    useTransition()

  useEffect(() => {
    const onboardingSeen =
      window.localStorage.getItem(
        ONBOARDING_STORAGE_KEY,
      )

    if (onboardingSeen === "true") {
      return
    }

    const hasChosenLanguage = document.cookie
      .split("; ")
      .some((cookie) =>
        cookie.startsWith(
          "clean_jobs_language_selected=",
        ),
      )

    const existingLocale = getCookieLocale()

    if (existingLocale) {
      setSelectedLocale(existingLocale)
    }

    const timer = window.setTimeout(() => {
      if (hasChosenLanguage && existingLocale) {
        setStep("welcome")
      } else {
        setStep("language")
      }

      setIsVisible(true)
    }, 500)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

  function chooseLanguage(locale: Locale) {
    document.cookie =
      `clean_jobs_locale=${locale}; ` +
      "path=/; max-age=31536000; samesite=lax"

    document.cookie =
      "clean_jobs_language_selected=true; " +
      "path=/; max-age=31536000; samesite=lax"

    setSelectedLocale(locale)
    setStep("welcome")

    startTransition(() => {
      router.refresh()
    })
  }

  function completeOnboarding() {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      "true",
    )

    setIsVisible(false)
  }

  function openFaq() {
    window.localStorage.setItem(
      ONBOARDING_STORAGE_KEY,
      "true",
    )

    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  const t = welcomeCopy[selectedLocale]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 px-4 py-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)]">
        {step === "language" ? (
          <>
            <div className="bg-gradient-to-br from-white via-white to-rose-50 px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                Clean Jobs
              </div>

              <h2
                id="welcome-modal-title"
                className="mt-5 text-3xl font-semibold tracking-tight text-slate-950"
              >
                Välj språk
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Välj vilket språk du vill använda på
                Clean Jobs. Du kan ändra språket
                senare i menyn.
              </p>
            </div>

            <div className="grid gap-2 px-4 pb-4 sm:px-5 sm:pb-5">
              {languages.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    chooseLanguage(item.value)
                  }
                  disabled={isPending}
                  className="flex min-h-14 items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-rose-200 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl leading-none">
                      {item.flag}
                    </span>

                    <span>
                      <span className="block text-sm font-semibold text-slate-950">
                        {item.nativeLabel}
                      </span>

                      <span className="block text-xs text-slate-500">
                        {item.label}
                      </span>
                    </span>
                  </span>

                  <span className="text-sm font-semibold text-rose-600">
                    →
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-white via-white to-rose-50 px-6 py-7 sm:px-8">
              <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">
                {t.eyebrow}
              </div>

              <h2
                id="welcome-modal-title"
                className="mt-5 text-3xl font-semibold tracking-tight text-slate-950"
              >
                {t.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                {t.description}
              </p>
            </div>

            <div className="px-4 pb-5 sm:px-6 sm:pb-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {t.steps.map((item, index) => (
                  <article
                    key={item.title}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-600 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={completeOnboarding}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {t.start}
                </button>

                <Link
                  href="/faq"
                  prefetch={false}
                  onClick={openFaq}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {t.faq}
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setStep("language")}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              >
                ← {t.changeLanguage}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}