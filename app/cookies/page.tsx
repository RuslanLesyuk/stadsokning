import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import CookieSettingsButton from "@/components/privacy/cookie-settings-button"
import { LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Cookies | Clean Jobs",
  description: "Cookie and analytics consent information for Clean Jobs.",
}

type Copy = {
  title: string
  subtitle: string
  back: string
  updated: string
  settings: string
  sections: Array<{ title: string; text: string }>
}

const copy: Record<Locale, Copy> = {
  sv: {
    title: "Cookies",
    subtitle: "Information om cookies, lokal lagring och valfri analys på Clean Jobs.",
    back: "Tillbaka",
    updated: "Uppdaterad: 20 augusti 2026",
    settings: "Ändra cookieinställningar",
    sections: [
      { title: "Nödvändiga cookies", text: "Clean Jobs använder nödvändiga cookies för Supabase-inloggning och sessionshantering. De krävs för att du ska kunna logga in och använda skyddade delar av tjänsten." },
      { title: "Språkpreferens", text: "Cookien clean_jobs_locale sparar det språk du väljer. Språkvalet används för att visa rätt språk vid nästa besök." },
      { title: "Ditt analysval", text: "Cookien clean_jobs_analytics_consent sparar om du har tillåtit eller avvisat valfri analys. Den används för att respektera ditt val vid senare besök." },
      { title: "Microsoft Clarity och Google Analytics", text: "Microsoft Clarity och Google Analytics, när Google Analytics är konfigurerat, laddas inte av Clean Jobs innan du uttryckligen har tillåtit analys. Om du avvisar analys laddas dessa verktyg inte. Du kan senare ändra eller återkalla ditt val på denna sida." },
      { title: "Vercel Web Analytics", text: "Clean Jobs kan använda Vercel Web Analytics separat för övergripande trafikmätning. Om vår tekniska konfiguration eller användning av cookies ändras uppdaterar vi denna information och begär samtycke där det krävs." },
    ],
  },
  en: {
    title: "Cookies",
    subtitle: "Information about cookies, local storage, and optional analytics on Clean Jobs.",
    back: "Back",
    updated: "Updated: 20 August 2026",
    settings: "Change cookie settings",
    sections: [
      { title: "Essential cookies", text: "Clean Jobs uses essential cookies for Supabase authentication and session management. They are required for signing in and using protected parts of the service." },
      { title: "Language preference", text: "The clean_jobs_locale cookie stores the language you choose and is used to show the same language on later visits." },
      { title: "Your analytics choice", text: "The clean_jobs_analytics_consent cookie stores whether you allowed or rejected optional analytics so that Clean Jobs can respect your choice on later visits." },
      { title: "Microsoft Clarity and Google Analytics", text: "Microsoft Clarity and Google Analytics, when Google Analytics is configured, are not loaded by Clean Jobs until you explicitly allow analytics. If you reject analytics, these tools are not loaded. You can later change or withdraw your choice on this page." },
      { title: "Vercel Web Analytics", text: "Clean Jobs may use Vercel Web Analytics separately for high-level traffic measurement. If our technical configuration or use of cookies changes, we will update this information and request consent where required." },
    ],
  },
  uk: {
    title: "Cookies",
    subtitle: "Інформація про cookies, локальне зберігання та необов’язкову аналітику Clean Jobs.",
    back: "Назад",
    updated: "Оновлено: 20 серпня 2026",
    settings: "Змінити налаштування cookies",
    sections: [
      { title: "Необхідні cookies", text: "Clean Jobs використовує необхідні cookies для авторизації Supabase та керування сесіями. Вони потрібні для входу й використання захищених частин сервісу." },
      { title: "Мовні налаштування", text: "Cookie clean_jobs_locale зберігає вибрану вами мову, щоб показувати ту саму мову під час наступних відвідувань." },
      { title: "Ваш вибір аналітики", text: "Cookie clean_jobs_analytics_consent зберігає, чи дозволили ви або відхилили необов’язкову аналітику, щоб Clean Jobs поважав цей вибір надалі." },
      { title: "Microsoft Clarity і Google Analytics", text: "Microsoft Clarity і Google Analytics, якщо Google Analytics налаштовано, не завантажуються Clean Jobs до вашої явної згоди на аналітику. Якщо аналітику відхилено, ці інструменти не завантажуються. Вибір можна змінити або відкликати на цій сторінці." },
      { title: "Vercel Web Analytics", text: "Clean Jobs може окремо використовувати Vercel Web Analytics для загального вимірювання трафіку. Якщо технічна конфігурація або використання cookies зміниться, ми оновимо цю інформацію та запросимо згоду там, де це потрібно." },
    ],
  },
  ru: {
    title: "Cookies",
    subtitle: "Информация о cookies, локальном хранении и необязательной аналитике Clean Jobs.",
    back: "Назад",
    updated: "Обновлено: 20 августа 2026",
    settings: "Изменить настройки cookies",
    sections: [
      { title: "Необходимые cookies", text: "Clean Jobs использует необходимые cookies для авторизации Supabase и управления сессиями. Они нужны для входа и использования защищённых частей сервиса." },
      { title: "Языковые настройки", text: "Cookie clean_jobs_locale сохраняет выбранный язык, чтобы показывать тот же язык при последующих посещениях." },
      { title: "Ваш выбор аналитики", text: "Cookie clean_jobs_analytics_consent хранит, разрешили вы или отклонили необязательную аналитику, чтобы Clean Jobs соблюдал этот выбор при следующих посещениях." },
      { title: "Microsoft Clarity и Google Analytics", text: "Microsoft Clarity и Google Analytics, если Google Analytics настроен, не загружаются Clean Jobs до вашего явного согласия на аналитику. Если аналитика отклонена, эти инструменты не загружаются. Выбор можно изменить или отозвать на этой странице." },
      { title: "Vercel Web Analytics", text: "Clean Jobs может отдельно использовать Vercel Web Analytics для общего измерения трафика. Если техническая конфигурация или использование cookies изменится, мы обновим эту информацию и запросим согласие там, где это требуется." },
    ],
  },
  pl: {
    title: "Pliki cookie",
    subtitle: "Informacje o plikach cookie, pamięci lokalnej i opcjonalnej analityce w Clean Jobs.",
    back: "Wstecz",
    updated: "Zaktualizowano: 20 sierpnia 2026",
    settings: "Zmień ustawienia plików cookie",
    sections: [
      { title: "Niezbędne pliki cookie", text: "Clean Jobs używa niezbędnych plików cookie do uwierzytelniania Supabase i zarządzania sesją. Są wymagane do logowania i korzystania z chronionych części usługi." },
      { title: "Preferencja języka", text: "Plik clean_jobs_locale zapisuje wybrany język, aby wyświetlać ten sam język podczas kolejnych wizyt." },
      { title: "Twój wybór analityki", text: "Plik clean_jobs_analytics_consent zapisuje, czy zezwoliłeś na opcjonalną analitykę, czy ją odrzuciłeś, aby Clean Jobs respektował Twój wybór podczas kolejnych wizyt." },
      { title: "Microsoft Clarity i Google Analytics", text: "Microsoft Clarity oraz Google Analytics, jeśli Google Analytics jest skonfigurowany, nie są ładowane przez Clean Jobs przed wyraźną zgodą na analitykę. Jeśli odrzucisz analitykę, narzędzia te nie są ładowane. Wybór możesz później zmienić lub wycofać na tej stronie." },
      { title: "Vercel Web Analytics", text: "Clean Jobs może osobno używać Vercel Web Analytics do ogólnego pomiaru ruchu. Jeśli konfiguracja techniczna lub użycie plików cookie ulegnie zmianie, zaktualizujemy te informacje i poprosimy o zgodę tam, gdzie będzie to wymagane." },
    ],
  },
}

export default async function CookiesPage() {
  const store = await cookies()
  const locale = normalizeLocale(store.get(LOCALE_COOKIE_NAME)?.value) as Locale
  const t = copy[locale] || copy.sv

  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-700">
          ← {t.back}
        </Link>

        <header className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8">
          <p className="text-sm font-bold text-rose-700">{t.updated}</p>
          <h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{t.title}</h1>
          <p className="mt-4 leading-7 text-slate-600">{t.subtitle}</p>
        </header>

        <section className="mt-6 space-y-4">
          {t.sections.map((section) => (
            <article key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="text-lg font-black text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{section.text}</p>
            </article>
          ))}
        </section>

        <div className="mt-6">
          <CookieSettingsButton label={t.settings} />
        </div>
      </div>
    </main>
  )
}
