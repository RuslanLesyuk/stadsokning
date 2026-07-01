import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Contact | Clean Jobs",
  description: "Contact Clean Jobs support.",
}

type ContactCopy = {
  back: string
  title: string
  subtitle: string
  emailLabel: string
  emailValue: string
  locationLabel: string
  locationValue: string
  responseLabel: string
  responseValue: string
  supportTitle: string
  supportText: string
  legalTitle: string
  legalText: string
  terms: string
  privacy: string
}

const copy: Record<Locale, ContactCopy> = {
  uk: {
    back: "Назад на головну",
    title: "Контакти",
    subtitle:
      "Маєте питання щодо Clean Jobs, профілю, оголошень або роботи платформи? Зв’яжіться з нами.",
    emailLabel: "Email підтримки",
    emailValue: "support@cleanjobs.com",
    locationLabel: "Локація",
    locationValue: "Stockholm, Sweden",
    responseLabel: "Час відповіді",
    responseValue: "Зазвичай протягом 1–2 робочих днів.",
    supportTitle: "Підтримка користувачів",
    supportText:
      "Ми можемо допомогти з акаунтом, оголошеннями, профілем, чатом або питаннями щодо використання Clean Jobs.",
    legalTitle: "Юридична інформація",
    legalText:
      "Перед використанням платформи ознайомтеся з умовами користування та політикою конфіденційності.",
    terms: "Умови користування",
    privacy: "Політика конфіденційності",
  },
  ru: {
    back: "Назад на главную",
    title: "Контакты",
    subtitle:
      "Есть вопросы о Clean Jobs, профиле, объявлениях или работе платформы? Свяжитесь с нами.",
    emailLabel: "Email поддержки",
    emailValue: "support@cleanjobs.app",
    locationLabel: "Локация",
    locationValue: "Stockholm, Sweden",
    responseLabel: "Время ответа",
    responseValue: "Обычно в течение 1–2 рабочих дней.",
    supportTitle: "Поддержка пользователей",
    supportText:
      "Мы можем помочь с аккаунтом, объявлениями, профилем, чатом или вопросами по использованию Clean Jobs.",
    legalTitle: "Юридическая информация",
    legalText:
      "Перед использованием платформы ознакомьтесь с условиями использования и политикой конфиденциальности.",
    terms: "Условия использования",
    privacy: "Политика конфиденциальности",
  },
  en: {
    back: "Back to home",
    title: "Contact",
    subtitle:
      "Have a question about Clean Jobs, your profile, job listings, or how the platform works? Contact us.",
    emailLabel: "Support email",
    emailValue: "support@cleanjobs.app",
    locationLabel: "Location",
    locationValue: "Stockholm, Sweden",
    responseLabel: "Response time",
    responseValue: "Usually within 1–2 business days.",
    supportTitle: "User support",
    supportText:
      "We can help with account access, listings, profiles, chat, or general questions about using Clean Jobs.",
    legalTitle: "Legal information",
    legalText:
      "Before using the platform, please review the Terms of Service and Privacy Policy.",
    terms: "Terms",
    privacy: "Privacy",
  },
  sv: {
    back: "Tillbaka till startsidan",
    title: "Kontakt",
    subtitle:
      "Har du frågor om Clean Jobs, din profil, annonser eller hur plattformen fungerar? Kontakta oss.",
    emailLabel: "Supportmejl",
    emailValue: "support@cleanjobs.app",
    locationLabel: "Plats",
    locationValue: "Stockholm, Sweden",
    responseLabel: "Svarstid",
    responseValue: "Vanligtvis inom 1–2 arbetsdagar.",
    supportTitle: "Användarsupport",
    supportText:
      "Vi kan hjälpa till med konto, annonser, profil, chatt eller allmänna frågor om Clean Jobs.",
    legalTitle: "Juridisk information",
    legalText:
      "Läs användarvillkoren och integritetspolicyn innan du använder plattformen.",
    terms: "Villkor",
    privacy: "Integritet",
  },
  pl: {
    back: "Wróć na stronę główną",
    title: "Kontakt",
    subtitle:
      "Masz pytanie dotyczące Clean Jobs, profilu, ogłoszeń lub działania platformy? Skontaktuj się z nami.",
    emailLabel: "Email wsparcia",
    emailValue: "support@cleanjobs.app",
    locationLabel: "Lokalizacja",
    locationValue: "Stockholm, Sweden",
    responseLabel: "Czas odpowiedzi",
    responseValue: "Zwykle w ciągu 1–2 dni roboczych.",
    supportTitle: "Wsparcie użytkowników",
    supportText:
      "Możemy pomóc z kontem, ogłoszeniami, profilem, czatem lub ogólnymi pytaniami dotyczącymi Clean Jobs.",
    legalTitle: "Informacje prawne",
    legalText:
      "Przed korzystaniem z platformy zapoznaj się z regulaminem i polityką prywatności.",
    terms: "Regulamin",
    privacy: "Prywatność",
  },
}

function InfoCard({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 break-words text-base font-semibold text-slate-950">
        {value}
      </div>
    </div>
  )
}

export default async function ContactPage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.en

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
        >
          {t.back}
        </Link>

        <section className="mt-6 rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            {t.subtitle}
          </p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard label={t.emailLabel} value={t.emailValue} />
          <InfoCard label={t.locationLabel} value={t.locationValue} />
          <InfoCard label={t.responseLabel} value={t.responseValue} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              {t.supportTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              {t.supportText}
            </p>
          </article>

          <article className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-6">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">
              {t.legalTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              {t.legalText}
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/terms"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
              >
                {t.terms}
              </Link>

              <Link
                href="/privacy"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97]"
              >
                {t.privacy}
              </Link>
            </div>
          </article>
        </section>
      </div>
    </div>
  )
}