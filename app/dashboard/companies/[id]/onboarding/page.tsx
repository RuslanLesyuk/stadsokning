import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { normalizeLocale, type Locale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

type PageProps = {
  params: Promise<{ id: string }>
}

type Copy = {
  eyebrow: string
  title: string
  description: string
  checklist: string
  steps: Array<{ title: string; text: string }>
  edit: string
  view: string
  claims: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Företaget är verifierat",
    title: "Välkommen som företagsägare på Clean Jobs",
    description: "Din företagsprofil är nu kopplad till ditt konto. Slutför profilen så att kunder kan hitta, jämföra och kontakta företaget.",
    checklist: "Rekommenderade nästa steg",
    steps: [
      { title: "Fyll i företagsprofilen", text: "Lägg till beskrivning, tjänster, priser, RUT, områden och arbetstider." },
      { title: "Lägg till bilder", text: "Ladda upp logotyp, omslagsbild och bilder från riktiga städuppdrag." },
      { title: "Kontrollera kontaktuppgifterna", text: "Se till att telefon, e-post, webbplats och adress är aktuella." },
      { title: "Börja ta emot förfrågningar", text: "Kunder kan skicka offertförfrågningar direkt från företagets profil." },
    ],
    edit: "Slutför företagsprofilen",
    view: "Visa offentlig profil",
    claims: "Mina företagsanspråk",
  },
  en: {
    eyebrow: "Company verified",
    title: "Welcome as a company owner on Clean Jobs",
    description: "Your company profile is now connected to your account. Complete it so customers can find, compare and contact your business.",
    checklist: "Recommended next steps",
    steps: [
      { title: "Complete the company profile", text: "Add description, services, pricing, RUT, service areas and working hours." },
      { title: "Add real photos", text: "Upload a logo, cover image and photos from real cleaning work." },
      { title: "Check contact details", text: "Make sure phone, email, website and address are current." },
      { title: "Start receiving requests", text: "Customers can send quote requests directly from your company profile." },
    ],
    edit: "Complete company profile",
    view: "View public profile",
    claims: "My company claims",
  },
  uk: {
    eyebrow: "Компанію підтверджено",
    title: "Вітаємо як власника компанії в Clean Jobs",
    description: "Профіль компанії тепер прив’язано до вашого акаунта. Доповніть його, щоб клієнти могли знаходити, порівнювати та контактувати з компанією.",
    checklist: "Рекомендовані наступні кроки",
    steps: [
      { title: "Заповніть профіль компанії", text: "Додайте опис, послуги, ціни, RUT, райони та робочі години." },
      { title: "Додайте реальні фото", text: "Завантажте логотип, обкладинку та фотографії виконаних робіт." },
      { title: "Перевірте контакти", text: "Переконайтеся, що телефон, email, сайт та адреса актуальні." },
      { title: "Почніть отримувати заявки", text: "Клієнти можуть надсилати Begär offert прямо з профілю компанії." },
    ],
    edit: "Завершити профіль компанії",
    view: "Переглянути публічний профіль",
    claims: "Мої заявки на компанії",
  },
  ru: {
    eyebrow: "Компания подтверждена",
    title: "Добро пожаловать как владелец компании в Clean Jobs",
    description: "Профиль компании теперь привязан к вашему аккаунту. Заполните его, чтобы клиенты могли находить, сравнивать и связываться с компанией.",
    checklist: "Рекомендуемые следующие шаги",
    steps: [
      { title: "Заполните профиль компании", text: "Добавьте описание, услуги, цены, RUT, районы и рабочие часы." },
      { title: "Добавьте реальные фото", text: "Загрузите логотип, обложку и фотографии выполненных работ." },
      { title: "Проверьте контакты", text: "Убедитесь, что телефон, email, сайт и адрес актуальны." },
      { title: "Начните получать заявки", text: "Клиенты могут отправлять запросы прямо из профиля компании." },
    ],
    edit: "Завершить профиль компании",
    view: "Посмотреть публичный профиль",
    claims: "Мои заявки на компании",
  },
  pl: {
    eyebrow: "Firma zweryfikowana",
    title: "Witamy jako właściciela firmy w Clean Jobs",
    description: "Profil firmy jest teraz połączony z Twoim kontem. Uzupełnij go, aby klienci mogli znaleźć, porównać i skontaktować się z firmą.",
    checklist: "Zalecane kolejne kroki",
    steps: [
      { title: "Uzupełnij profil firmy", text: "Dodaj opis, usługi, ceny, RUT, obszary działania i godziny pracy." },
      { title: "Dodaj prawdziwe zdjęcia", text: "Prześlij logo, zdjęcie w tle i zdjęcia wykonanych prac." },
      { title: "Sprawdź dane kontaktowe", text: "Upewnij się, że telefon, e-mail, strona i adres są aktualne." },
      { title: "Zacznij otrzymywać zapytania", text: "Klienci mogą wysyłać zapytania ofertowe bezpośrednio z profilu firmy." },
    ],
    edit: "Uzupełnij profil firmy",
    view: "Zobacz profil publiczny",
    claims: "Moje zgłoszenia firm",
  },
}

export const dynamic = "force-dynamic"

export default async function CompanyOnboardingPage({ params }: PageProps) {
  const { id } = await params
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value) as Locale
  const t = copy[locale] || copy.sv
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/dashboard/companies/${id}/onboarding`)

  const { data: company } = await supabase
    .from("companies")
    .select("id, name, slug, city, logo_url, owner_id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle()

  if (!company) redirect("/dashboard/company-claims")

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">{t.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{t.title}</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">{t.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt={`${company.name} logo`} className="h-16 w-16 rounded-2xl border border-slate-200 object-contain p-2" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-2xl font-black text-white">{company.name.charAt(0).toUpperCase()}</div>
            )}
            <div>
              <h2 className="text-2xl font-black text-slate-950">{company.name}</h2>
              {company.city ? <p className="mt-1 text-sm font-semibold text-slate-500">{company.city}</p> : null}
            </div>
          </div>

          <h3 className="mt-8 text-lg font-black text-slate-950">{t.checklist}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {t.steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">{index + 1}</span>
                <h4 className="mt-4 font-black text-slate-950">{step.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/dashboard/companies/${company.id}/edit`} className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600">
              {t.edit}
            </Link>
            <Link href={`/companies/${company.slug}`} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
              {t.view}
            </Link>
            <Link href="/dashboard/company-claims" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
              {t.claims}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
