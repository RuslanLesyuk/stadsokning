import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { createCompanyAction } from "./actions"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Create company | Clean Jobs",
  description:
    "Create and manage a cleaning company profile on Clean Jobs.",
  robots: {
    index: false,
    follow: false,
  },
}

type PageProps = {
  searchParams: Promise<{
    error?: string
  }>
}

type Copy = {
  eyebrow: string
  title: string
  description: string
  existingTitle: string
  existingText: string
  findExisting: string
  companyInfo: string
  name: string
  namePlaceholder: string
  organizationNumber: string
  organizationNumberHint: string
  city: string
  cityPlaceholder: string
  descriptionLabel: string
  descriptionPlaceholder: string
  contactTitle: string
  email: string
  phone: string
  contactHint: string
  website: string
  websitePlaceholder: string
  submit: string
  notice: string
  back: string
  errors: Record<string, string>
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Företagskonto",
    title: "Lägg till ditt städföretag",
    description:
      "Skapa företagets profil och få tillgång till företagsytan, leads, bokningar och webbplatsverktyg.",
    existingTitle: "Finns företaget redan på Clean Jobs?",
    existingText:
      "Skapa inte en dubblett. Hitta företaget i katalogen och gör anspråk på den befintliga profilen.",
    findExisting: "Sök efter mitt företag",
    companyInfo: "Företagsuppgifter",
    name: "Företagsnamn",
    namePlaceholder: "Exempel Städ AB",
    organizationNumber: "Organisationsnummer",
    organizationNumberHint:
      "Valfritt. Om det anges används det även för att upptäcka dubbletter.",
    city: "Stad",
    cityPlaceholder: "Stockholm",
    descriptionLabel: "Beskrivning",
    descriptionPlaceholder:
      "Beskriv företagets tjänster, kunder och arbetsområde. Minst 40 tecken.",
    contactTitle: "Kontakt",
    email: "E-post",
    phone: "Telefon",
    contactHint:
      "Minst e-post eller telefon krävs.",
    website: "Webbplats",
    websitePlaceholder: "https://example.se",
    submit: "Skapa företag",
    notice:
      "Företaget skapas som ej verifierat. Du kan komplettera profil, tjänster, priser, bilder och webbplats direkt efteråt.",
    back: "Till företagskatalogen",
    errors: {
      required:
        "Fyll i företagsnamn, stad och en beskrivning på minst 40 tecken.",
      contact:
        "Ange minst e-post eller telefon.",
      email: "Kontrollera e-postadressen.",
      website: "Kontrollera webbadressen.",
      limit:
        "Du har nått gränsen för antal företag på ett konto.",
      create:
        "Företaget kunde inte skapas. Försök igen.",
    },
  },

  en: {
    eyebrow: "Business account",
    title: "Add your cleaning company",
    description:
      "Create the company profile and get access to the company workspace, leads, bookings and website tools.",
    existingTitle: "Is the company already on Clean Jobs?",
    existingText:
      "Do not create a duplicate. Find the company in the directory and claim the existing profile.",
    findExisting: "Find my company",
    companyInfo: "Company information",
    name: "Company name",
    namePlaceholder: "Example Cleaning AB",
    organizationNumber: "Organisation number",
    organizationNumberHint:
      "Optional. If provided, it is also used to detect duplicate companies.",
    city: "City",
    cityPlaceholder: "Stockholm",
    descriptionLabel: "Description",
    descriptionPlaceholder:
      "Describe the company's services, customers and service area. Minimum 40 characters.",
    contactTitle: "Contact",
    email: "Email",
    phone: "Phone",
    contactHint:
      "At least email or phone is required.",
    website: "Website",
    websitePlaceholder: "https://example.se",
    submit: "Create company",
    notice:
      "The company is created as unverified. You can complete the profile, services, pricing, images and website immediately afterwards.",
    back: "Back to company directory",
    errors: {
      required:
        "Enter a company name, city and a description of at least 40 characters.",
      contact:
        "Enter at least an email address or phone number.",
      email: "Check the email address.",
      website: "Check the website address.",
      limit:
        "You have reached the company limit for one account.",
      create:
        "The company could not be created. Please try again.",
    },
  },

  uk: {
    eyebrow: "Бізнес-акаунт",
    title: "Додайте свою клінінгову компанію",
    description:
      "Створіть профіль компанії та отримайте доступ до простору компанії, лідів, бронювань і конструктора сайту.",
    existingTitle: "Компанія вже є на Clean Jobs?",
    existingText:
      "Не створюйте дублікат. Знайдіть компанію в каталозі та подайте заявку на вже існуючий профіль.",
    findExisting: "Знайти мою компанію",
    companyInfo: "Дані компанії",
    name: "Назва компанії",
    namePlaceholder: "Example Städ AB",
    organizationNumber: "Організаційний номер",
    organizationNumberHint:
      "Необов’язково. Якщо вказати, він також використовується для пошуку дублікатів.",
    city: "Місто",
    cityPlaceholder: "Stockholm",
    descriptionLabel: "Опис",
    descriptionPlaceholder:
      "Опишіть послуги компанії, клієнтів та територію роботи. Мінімум 40 символів.",
    contactTitle: "Контакти",
    email: "Email",
    phone: "Телефон",
    contactHint:
      "Потрібно вказати хоча б email або телефон.",
    website: "Вебсайт",
    websitePlaceholder: "https://example.se",
    submit: "Створити компанію",
    notice:
      "Компанія створюється неперевіреною. Одразу після цього можна додати послуги, ціни, фото та створити сайт.",
    back: "До каталогу компаній",
    errors: {
      required:
        "Вкажіть назву, місто та опис щонайменше з 40 символів.",
      contact:
        "Вкажіть хоча б email або номер телефону.",
      email: "Перевірте email.",
      website: "Перевірте адресу вебсайту.",
      limit:
        "Досягнуто ліміту компаній для одного акаунта.",
      create:
        "Не вдалося створити компанію. Спробуйте ще раз.",
    },
  },

  ru: {
    eyebrow: "Бизнес-аккаунт",
    title: "Добавьте свою клининговую компанию",
    description:
      "Создайте профиль компании и получите доступ к пространству компании, лидам, бронированиям и конструктору сайта.",
    existingTitle: "Компания уже есть на Clean Jobs?",
    existingText:
      "Не создавайте дубликат. Найдите компанию в каталоге и подайте заявку на существующий профиль.",
    findExisting: "Найти мою компанию",
    companyInfo: "Данные компании",
    name: "Название компании",
    namePlaceholder: "Example Städ AB",
    organizationNumber: "Организационный номер",
    organizationNumberHint:
      "Необязательно. Если указан, он также используется для поиска дубликатов.",
    city: "Город",
    cityPlaceholder: "Stockholm",
    descriptionLabel: "Описание",
    descriptionPlaceholder:
      "Опишите услуги компании, клиентов и территорию работы. Минимум 40 символов.",
    contactTitle: "Контакты",
    email: "Email",
    phone: "Телефон",
    contactHint:
      "Нужно указать хотя бы email или телефон.",
    website: "Веб-сайт",
    websitePlaceholder: "https://example.se",
    submit: "Создать компанию",
    notice:
      "Компания создается непроверенной. Сразу после этого можно добавить услуги, цены, фото и создать сайт.",
    back: "К каталогу компаний",
    errors: {
      required:
        "Укажите название, город и описание минимум из 40 символов.",
      contact:
        "Укажите хотя бы email или номер телефона.",
      email: "Проверьте email.",
      website: "Проверьте адрес сайта.",
      limit:
        "Достигнут лимит компаний для одного аккаунта.",
      create:
        "Не удалось создать компанию. Попробуйте ещё раз.",
    },
  },

  pl: {
    eyebrow: "Konto firmowe",
    title: "Dodaj swoją firmę sprzątającą",
    description:
      "Utwórz profil firmy i uzyskaj dostęp do przestrzeni firmy, leadów, rezerwacji oraz narzędzi strony internetowej.",
    existingTitle: "Firma jest już w Clean Jobs?",
    existingText:
      "Nie twórz duplikatu. Znajdź firmę w katalogu i zgłoś istniejący profil.",
    findExisting: "Znajdź moją firmę",
    companyInfo: "Dane firmy",
    name: "Nazwa firmy",
    namePlaceholder: "Example Städ AB",
    organizationNumber: "Numer organizacyjny",
    organizationNumberHint:
      "Opcjonalnie. Jeśli zostanie podany, służy również do wykrywania duplikatów.",
    city: "Miasto",
    cityPlaceholder: "Stockholm",
    descriptionLabel: "Opis",
    descriptionPlaceholder:
      "Opisz usługi firmy, klientów i obszar działania. Minimum 40 znaków.",
    contactTitle: "Kontakt",
    email: "Email",
    phone: "Telefon",
    contactHint:
      "Wymagany jest co najmniej email lub telefon.",
    website: "Strona internetowa",
    websitePlaceholder: "https://example.se",
    submit: "Utwórz firmę",
    notice:
      "Firma zostanie utworzona jako niezweryfikowana. Następnie możesz uzupełnić usługi, ceny, zdjęcia i stronę internetową.",
    back: "Do katalogu firm",
    errors: {
      required:
        "Podaj nazwę firmy, miasto i opis zawierający co najmniej 40 znaków.",
      contact:
        "Podaj co najmniej email lub numer telefonu.",
      email: "Sprawdź adres email.",
      website: "Sprawdź adres strony internetowej.",
      limit:
        "Osiągnięto limit firm dla jednego konta.",
      create:
        "Nie udało się utworzyć firmy. Spróbuj ponownie.",
    },
  },
}

function fieldClass() {
  return "mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
}

export default async function CreateCompanyPage({
  searchParams,
}: PageProps) {
  const query = await searchParams

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value ||
      DEFAULT_LOCALE,
  ) as Locale

  const t = copy[locale] || copy.en

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=/companies/create")
  }

  const errorMessage = query.error
    ? t.errors[query.error] || t.errors.create
    : null

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          href="/companies"
          prefetch={false}
          className="text-sm font-bold text-slate-500 transition hover:text-rose-600"
        >
          ← {t.back}
        </Link>

        <section className="mt-7 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-gradient-to-br from-white via-white to-rose-50 px-6 py-8 sm:px-9">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-rose-600">
              {t.eyebrow}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {t.title}
            </h1>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              {t.description}
            </p>
          </div>

          <div className="p-6 sm:p-9">
            {errorMessage ? (
              <div className="mb-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">
                {errorMessage}
              </div>
            ) : null}

            <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="font-black text-amber-950">
                {t.existingTitle}
              </h2>

              <p className="mt-2 text-sm leading-6 text-amber-900/80">
                {t.existingText}
              </p>

              <Link
                href="/companies"
                prefetch={false}
                className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl border border-amber-300 bg-white px-4 text-sm font-black text-amber-900 transition hover:bg-amber-100"
              >
                {t.findExisting}
              </Link>
            </div>

            <form
              action={createCompanyAction}
              className="space-y-8"
            >
              <section>
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  {t.companyInfo}
                </h2>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      {t.name} *
                    </span>

                    <input
                      name="name"
                      required
                      minLength={2}
                      maxLength={160}
                      autoComplete="organization"
                      placeholder={t.namePlaceholder}
                      className={fieldClass()}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      {t.organizationNumber}
                    </span>

                    <input
                      name="organization_number"
                      maxLength={64}
                      inputMode="numeric"
                      placeholder="556123-4567"
                      className={fieldClass()}
                    />

                    <span className="mt-2 block text-xs leading-5 text-slate-500">
                      {t.organizationNumberHint}
                    </span>
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-slate-700">
                      {t.city} *
                    </span>

                    <input
                      name="city"
                      required
                      minLength={2}
                      maxLength={120}
                      autoComplete="address-level2"
                      placeholder={t.cityPlaceholder}
                      className={fieldClass()}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-slate-700">
                      {t.descriptionLabel} *
                    </span>

                    <textarea
                      name="description"
                      required
                      minLength={40}
                      maxLength={2000}
                      rows={6}
                      placeholder={t.descriptionPlaceholder}
                      className={`${fieldClass()} resize-y`}
                    />
                  </label>
                </div>
              </section>

              <section className="border-t border-slate-200 pt-8">
                <h2 className="text-xl font-black tracking-tight text-slate-950">
                  {t.contactTitle}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {t.contactHint}
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      {t.email}
                    </span>

                    <input
                      name="email"
                      type="email"
                      maxLength={254}
                      autoComplete="email"
                      defaultValue={user.email || ""}
                      className={fieldClass()}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      {t.phone}
                    </span>

                    <input
                      name="phone"
                      type="tel"
                      maxLength={60}
                      autoComplete="tel"
                      placeholder="+46..."
                      className={fieldClass()}
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-slate-700">
                      {t.website}
                    </span>

                    <input
                      name="website"
                      type="text"
                      maxLength={500}
                      inputMode="url"
                      placeholder={t.websitePlaceholder}
                      className={fieldClass()}
                    />
                  </label>
                </div>
              </section>

              <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                {t.notice}
              </div>

              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-black text-white transition hover:bg-rose-700 active:scale-[0.99] sm:w-auto"
              >
                {t.submit}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
