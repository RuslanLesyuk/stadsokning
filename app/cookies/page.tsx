import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import { normalizeLocale, type Locale } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Cookies | Clean Jobs", description: "Cookie information for Clean Jobs." }

const copy: Record<Locale, { title: string; subtitle: string; back: string; updated: string; sections: Array<{ title: string; text: string }> }> = {
  sv: { title: "Cookies", subtitle: "Information om cookies och liknande teknik på Clean Jobs.", back: "Tillbaka", updated: "Uppdaterad: 17 augusti 2026", sections: [
    { title: "Nödvändiga cookies", text: "Clean Jobs använder nödvändiga cookies för Supabase-inloggning och sessionshantering. De krävs för att du ska kunna logga in och använda skyddade delar av tjänsten." },
    { title: "Språkpreferens", text: "Cookien clean_jobs_locale sparar det språk du själv väljer så att tjänsten kan visa rätt språk vid nästa besök." },
    { title: "Analytics", text: "Om Vercel Web Analytics är aktiverat används den nuvarande tjänsten utan cookies och med anonymiserad trafikdata. Clean Jobs använder inte cookie-baserade annons- eller marknadsföringsspårare i den nuvarande konfigurationen." },
    { title: "Framtida icke-nödvändig teknik", text: "Om vi senare inför icke-nödvändiga cookies eller liknande lagring som kräver samtycke kommer de inte att aktiveras innan ett giltigt val har gjorts. Du ska då också kunna ändra eller återkalla valet." },
  ]},
  en: { title: "Cookies", subtitle: "Information about cookies and similar technologies used by Clean Jobs.", back: "Back", updated: "Updated: 17 August 2026", sections: [
    { title: "Essential cookies", text: "Clean Jobs uses essential cookies for Supabase authentication and session management. They are required for signing in and using protected parts of the service." },
    { title: "Language preference", text: "The clean_jobs_locale cookie stores the language you choose so the service can display the same language on future visits." },
    { title: "Analytics", text: "If Vercel Web Analytics is enabled, the current service operates without cookies and uses anonymised traffic data. Clean Jobs does not currently use cookie-based advertising or marketing trackers." },
    { title: "Future non-essential technology", text: "If we later add non-essential cookies or similar storage that requires consent, it will not be activated before a valid choice is made, and you will be able to change or withdraw that choice." },
  ]},
  uk: { title: "Cookies", subtitle: "Інформація про cookies та подібні технології Clean Jobs.", back: "Назад", updated: "Оновлено: 17 серпня 2026", sections: [
    { title: "Необхідні cookies", text: "Clean Jobs використовує необхідні cookies для Supabase authentication і керування сесією. Вони потрібні для входу та захищених функцій." },
    { title: "Мова", text: "Cookie clean_jobs_locale зберігає обрану вами мову." },
    { title: "Analytics", text: "Якщо активовано Vercel Web Analytics, поточний сервіс працює без cookies і використовує анонімізовані дані трафіку. Зараз Clean Jobs не використовує cookie-based advertising/marketing trackers." },
    { title: "Майбутні необов’язкові cookies", text: "Якщо з’являться необов’язкові cookies або подібне зберігання, для якого потрібна згода, вони не активуватимуться до вашого вибору, а згоду можна буде змінити або відкликати." },
  ]},
  ru: { title: "Cookies", subtitle: "Информация о cookies и аналогичных технологиях Clean Jobs.", back: "Назад", updated: "Обновлено: 17 августа 2026", sections: [
    { title: "Необходимые cookies", text: "Clean Jobs использует необходимые cookies для Supabase authentication и управления сессией. Они нужны для входа и защищённых функций." },
    { title: "Язык", text: "Cookie clean_jobs_locale сохраняет выбранный вами язык." },
    { title: "Analytics", text: "Если включён Vercel Web Analytics, текущий сервис работает без cookies и использует анонимизированные данные трафика. Сейчас Clean Jobs не использует cookie-based рекламные или маркетинговые трекеры." },
    { title: "Будущие необязательные cookies", text: "Если появятся необязательные cookies или аналогичное хранение, для которого требуется согласие, они не будут активированы до вашего выбора, а согласие можно будет изменить или отозвать." },
  ]},
  pl: { title: "Cookies", subtitle: "Informacje o cookies i podobnych technologiach Clean Jobs.", back: "Wróć", updated: "Zaktualizowano: 17 sierpnia 2026", sections: [
    { title: "Niezbędne cookies", text: "Clean Jobs używa niezbędnych cookies do uwierzytelniania Supabase i zarządzania sesją. Są wymagane do logowania i chronionych funkcji." },
    { title: "Preferencja języka", text: "Cookie clean_jobs_locale zapisuje wybrany przez Ciebie język." },
    { title: "Analytics", text: "Jeśli Vercel Web Analytics jest włączony, obecna usługa działa bez cookies i używa zanonimizowanych danych ruchu. Clean Jobs nie używa obecnie cookie-based trackerów reklamowych ani marketingowych." },
    { title: "Przyszłe niekonieczne cookies", text: "Jeśli później dodamy niekonieczne cookies lub podobne przechowywanie wymagające zgody, nie zostaną uruchomione przed dokonaniem ważnego wyboru, który będzie można zmienić lub wycofać." },
  ]},
}

export default async function CookiesPage() {
  const store = await cookies(); const locale = normalizeLocale(store.get("clean_jobs_locale")?.value) as Locale; const t = copy[locale] || copy.en
  return <main className="min-h-screen bg-[#fafafa]"><div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12"><Link href="/" className="text-sm font-bold text-slate-600 hover:text-rose-700">← {t.back}</Link><header className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 md:p-8"><p className="text-sm font-bold text-rose-700">{t.updated}</p><h1 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl">{t.title}</h1><p className="mt-4 leading-7 text-slate-600">{t.subtitle}</p></header><section className="mt-6 space-y-4">{t.sections.map((section) => <article key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-5 md:p-6"><h2 className="text-lg font-black text-slate-950">{section.title}</h2><p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{section.text}</p></article>)}</section><div className="mt-6 flex gap-3"><Link href="/privacy" className="font-bold text-rose-700">Privacy</Link><Link href="/terms" className="font-bold text-rose-700">Terms</Link></div></div></main>
}
