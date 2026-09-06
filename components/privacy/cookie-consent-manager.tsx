"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

import type { Locale } from "@/lib/i18n"
import { ACQUISITION_COOKIE_NAME } from "@/lib/analytics/acquisition-shared"
import {
  ANALYTICS_CONSENT_COOKIE,
  ANALYTICS_CONSENT_MAX_AGE,
  type AnalyticsConsent,
} from "@/lib/privacy/consent"

type Props = {
  locale: Locale
  initialConsent: AnalyticsConsent | null
  clarityProjectId: string | null
  googleAnalyticsId: string | null
}

type Copy = {
  title: string
  text: string
  allow: string
  reject: string
  settingsTitle: string
  settingsText: string
  currentAllowed: string
  currentRejected: string
  close: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    title: "Analyscookies",
    text: "Vi vill använda Microsoft Clarity och, om det är konfigurerat, Google Analytics för att förstå hur Clean Jobs används. De aktiveras först om du godkänner analys.",
    allow: "Tillåt analys",
    reject: "Avvisa",
    settingsTitle: "Cookieinställningar",
    settingsText: "Du kan när som helst ändra ditt val. Om du återkallar samtycke stoppas Clean Jobs valfria analysverktyg efter omladdning.",
    currentAllowed: "Analys är tillåten.",
    currentRejected: "Analys är avvisad.",
    close: "Stäng",
  },
  en: {
    title: "Analytics cookies",
    text: "We would like to use Microsoft Clarity and, when configured, Google Analytics to understand how Clean Jobs is used. They are enabled only after you allow analytics.",
    allow: "Allow analytics",
    reject: "Reject",
    settingsTitle: "Cookie settings",
    settingsText: "You can change your choice at any time. If you withdraw consent, Clean Jobs optional analytics tools stop after the page reloads.",
    currentAllowed: "Analytics is allowed.",
    currentRejected: "Analytics is rejected.",
    close: "Close",
  },
  uk: {
    title: "Аналітичні cookies",
    text: "Ми хочемо використовувати Microsoft Clarity і, якщо налаштовано, Google Analytics, щоб розуміти використання Clean Jobs. Вони вмикаються лише після вашої згоди на аналітику.",
    allow: "Дозволити аналітику",
    reject: "Відхилити",
    settingsTitle: "Налаштування cookies",
    settingsText: "Ви можете змінити вибір у будь-який момент. Після відкликання згоди необов’язкова аналітика Clean Jobs припиняється після перезавантаження сторінки.",
    currentAllowed: "Аналітику дозволено.",
    currentRejected: "Аналітику відхилено.",
    close: "Закрити",
  },
  ru: {
    title: "Аналитические cookies",
    text: "Мы хотим использовать Microsoft Clarity и, если настроено, Google Analytics, чтобы понимать использование Clean Jobs. Они включаются только после вашего согласия на аналитику.",
    allow: "Разрешить аналитику",
    reject: "Отклонить",
    settingsTitle: "Настройки cookies",
    settingsText: "Вы можете изменить выбор в любой момент. После отзыва согласия необязательная аналитика Clean Jobs прекращается после перезагрузки страницы.",
    currentAllowed: "Аналитика разрешена.",
    currentRejected: "Аналитика отклонена.",
    close: "Закрыть",
  },
  pl: {
    title: "Analityczne pliki cookie",
    text: "Chcemy używać Microsoft Clarity oraz, jeśli skonfigurowano, Google Analytics, aby rozumieć sposób korzystania z Clean Jobs. Są uruchamiane dopiero po wyrażeniu zgody na analitykę.",
    allow: "Zezwól na analitykę",
    reject: "Odrzuć",
    settingsTitle: "Ustawienia plików cookie",
    settingsText: "Możesz zmienić wybór w dowolnym momencie. Po wycofaniu zgody opcjonalna analityka Clean Jobs zostanie zatrzymana po przeładowaniu strony.",
    currentAllowed: "Analityka jest dozwolona.",
    currentRejected: "Analityka jest odrzucona.",
    close: "Zamknij",
  },
}

function writeConsentCookie(value: AnalyticsConsent) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Path=/; Max-Age=${ANALYTICS_CONSENT_MAX_AGE}; SameSite=Lax${secure}`
}

function clearCookie(name: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : ""
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`
  document.cookie = `${name}=; Path=/; Domain=.${window.location.hostname}; Max-Age=0; SameSite=Lax${secure}`
}

function clearKnownAnalyticsCookies() {
  const exact = ["_clck", "_clsk", "_ga", "_gid", "_gat"]
  const discovered = document.cookie
    .split(";")
    .map((item) => item.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name))
    .filter((name) => name.startsWith("_ga_") || name.startsWith("_cl"))

  for (const name of new Set([...exact, ...discovered])) {
    clearCookie(name)
  }
}

export default function CookieConsentManager({
  locale,
  initialConsent,
  clarityProjectId,
  googleAnalyticsId,
}: Props) {
  const [consent, setConsent] = useState<AnalyticsConsent | null>(initialConsent)
  const [settingsOpen, setSettingsOpen] = useState(initialConsent === null)
  const t = copy[locale] || copy.sv

  useEffect(() => {
    function openSettings() {
      setSettingsOpen(true)
    }

    window.addEventListener("clean-jobs:open-cookie-settings", openSettings)
    return () =>
      window.removeEventListener("clean-jobs:open-cookie-settings", openSettings)
  }, [])

  function choose(next: AnalyticsConsent) {
    const mustReload = consent === "granted" && next === "denied"

    writeConsentCookie(next)

    if (next === "denied") {
      clearKnownAnalyticsCookies()
      clearCookie(ACQUISITION_COOKIE_NAME)
    }

    window.dispatchEvent(
      new CustomEvent(
        "clean-jobs:analytics-consent",
        {
          detail: {
            consent: next,
          },
        },
      ),
    )

    setConsent(next)
    setSettingsOpen(false)

    if (mustReload) {
      window.location.reload()
    }
  }

  const analyticsAllowed = consent === "granted"

  return (
    <>
      {analyticsAllowed && clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
          `}
        </Script>
      ) : null}

      {analyticsAllowed && googleAnalyticsId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(googleAnalyticsId)}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(googleAnalyticsId)}, { page_path: window.location.pathname });
            `}
          </Script>
        </>
      ) : null}

      {settingsOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-[200] px-3 pb-3 sm:px-5 sm:pb-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            className="mx-auto max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.24)] sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-rose-600">Clean Jobs</p>
                <h2 id="cookie-consent-title" className="mt-2 text-xl font-black text-slate-950">
                  {consent === null ? t.title : t.settingsTitle}
                </h2>
              </div>
              {consent !== null ? (
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  {t.close}
                </button>
              ) : null}
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {consent === null ? t.text : t.settingsText}
            </p>

            {consent !== null ? (
              <p className="mt-3 text-sm font-semibold text-slate-800">
                {consent === "granted" ? t.currentAllowed : t.currentRejected}
              </p>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                {t.allow}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
