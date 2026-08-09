import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import FormSubmitButton from "@/components/form-submit-button"
import { Input, Select, Textarea } from "@/components/ui/field"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"
import { updateCompanyProfile } from "../../actions"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    saved?: string
    error?: string
  }>
}

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

type WorkingHours = Partial<Record<DayKey, string>>

type FaqItem = {
  question: string
  answer: string
}

type Company = {
  id: string
  name: string
  slug: string
  city: string | null
  address: string | null
  postal_code: string | null
  organization_number: string | null
  founded_year: number | null
  website: string | null
  phone: string | null
  email: string | null
  description: string | null
  logo_url: string | null
  cover_url: string | null
  gallery_urls: unknown
  service_types: unknown
  service_areas: unknown
  languages: unknown
  hourly_rate: number | null
  minimum_order: number | null
  rut_available: boolean | null
  working_hours: unknown
  faq: unknown
  verified: boolean | null
  owner_id: string | null
}

type Labels = {
  eyebrow: string
  title: string
  subtitle: string
  back: string
  viewProfile: string
  manageWebsite: string
  saved: string
  error: string
  verified: string
  notVerified: string
  mediaTitle: string
  mediaText: string
  logo: string
  cover: string
  gallery: string
  logoHelp: string
  coverHelp: string
  galleryHelp: string
  removeImage: string
  noGallery: string
  detailsTitle: string
  companyName: string
  description: string
  city: string
  address: string
  postalCode: string
  organizationNumber: string
  foundedYear: string
  contactTitle: string
  phone: string
  email: string
  website: string
  offerTitle: string
  hourlyRate: string
  minimumOrder: string
  rutAvailable: string
  yes: string
  no: string
  languages: string
  serviceTypes: string
  serviceAreas: string
  workingHoursTitle: string
  workingHoursText: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
  closedPlaceholder: string
  faqTitle: string
  faqText: string
  question: string
  answer: string
  save: string
  saving: string
}

const dayOrder: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

const labels: Record<Locale, Labels> = {
  sv: {
    eyebrow: "Företagsprofil",
    title: "Hantera företaget",
    subtitle:
      "Komplettera profilen så att den fungerar som företagets professionella minisajt på Clean Jobs.",
    back: "Mina företagsanspråk",
    viewProfile: "Visa offentlig profil",
    manageWebsite: "Hantera webbplats",
    saved: "Ändringarna har sparats.",
    error:
      "Profilen kunde inte sparas. Kontrollera obligatoriska fält, bilder och numeriska värden.",
    verified: "Verifierat företag",
    notVerified: "Företaget är ännu inte verifierat",
    mediaTitle: "Varumärke och bilder",
    mediaText:
      "Använd tydliga bilder från riktiga uppdrag. Det ökar förtroendet och förbättrar konverteringen.",
    logo: "Företagslogotyp",
    cover: "Omslagsbild",
    gallery: "Bildgalleri",
    logoHelp: "Kvadratisk bild rekommenderas. JPG, PNG, WebP eller AVIF, högst 5 MB.",
    coverHelp: "Bred bild rekommenderas. JPG, PNG, WebP eller AVIF, högst 5 MB.",
    galleryHelp: "Ladda upp högst 10 bilder totalt. Varje bild får vara högst 5 MB.",
    removeImage: "Ta bort bilden",
    noGallery: "Inga galleribilder har lagts till ännu.",
    detailsTitle: "Företagsinformation",
    companyName: "Företagsnamn",
    description: "Beskrivning",
    city: "Ort",
    address: "Gatuadress",
    postalCode: "Postnummer",
    organizationNumber: "Organisationsnummer",
    foundedYear: "Grundat år",
    contactTitle: "Kontaktuppgifter",
    phone: "Telefon",
    email: "E-post",
    website: "Webbplats",
    offerTitle: "Tjänster och priser",
    hourlyRate: "Pris från, kr per timme",
    minimumOrder: "Minsta bokning, timmar",
    rutAvailable: "RUT-avdrag erbjuds",
    yes: "Ja",
    no: "Nej",
    languages: "Språk, separerade med kommatecken",
    serviceTypes: "Tjänster, separerade med kommatecken",
    serviceAreas: "Serviceområden, separerade med kommatecken",
    workingHoursTitle: "Öppettider",
    workingHoursText:
      "Ange exempelvis 08:00–17:00. Skriv Stängt när företaget inte arbetar.",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
    closedPlaceholder: "08:00–17:00 eller Stängt",
    faqTitle: "Vanliga frågor",
    faqText:
      "Lägg till upp till sex frågor och svar. Endast kompletta par publiceras.",
    question: "Fråga",
    answer: "Svar",
    save: "Spara företagsprofil",
    saving: "Sparar...",
  },
  en: {
    eyebrow: "Company profile",
    title: "Manage company",
    subtitle:
      "Complete the profile so it works as the company’s professional mini-site on Clean Jobs.",
    back: "My company claims",
    viewProfile: "View public profile",
    manageWebsite: "Manage website",
    saved: "Changes have been saved.",
    error:
      "The profile could not be saved. Check required fields, images and numeric values.",
    verified: "Verified company",
    notVerified: "The company is not verified yet",
    mediaTitle: "Brand and images",
    mediaText:
      "Use clear photos from real jobs. This increases trust and improves conversion.",
    logo: "Company logo",
    cover: "Cover image",
    gallery: "Photo gallery",
    logoHelp: "A square image is recommended. JPG, PNG, WebP or AVIF, maximum 5 MB.",
    coverHelp: "A wide image is recommended. JPG, PNG, WebP or AVIF, maximum 5 MB.",
    galleryHelp: "Upload no more than 10 images in total. Maximum 5 MB per image.",
    removeImage: "Remove image",
    noGallery: "No gallery images have been added yet.",
    detailsTitle: "Company information",
    companyName: "Company name",
    description: "Description",
    city: "City",
    address: "Street address",
    postalCode: "Postal code",
    organizationNumber: "Organisation number",
    foundedYear: "Founded year",
    contactTitle: "Contact details",
    phone: "Phone",
    email: "Email",
    website: "Website",
    offerTitle: "Services and pricing",
    hourlyRate: "Price from, SEK per hour",
    minimumOrder: "Minimum booking, hours",
    rutAvailable: "RUT deduction available",
    yes: "Yes",
    no: "No",
    languages: "Languages, separated by commas",
    serviceTypes: "Services, separated by commas",
    serviceAreas: "Service areas, separated by commas",
    workingHoursTitle: "Opening hours",
    workingHoursText:
      "Use a format such as 08:00–17:00. Enter Closed when the company does not work.",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closedPlaceholder: "08:00–17:00 or Closed",
    faqTitle: "Frequently asked questions",
    faqText: "Add up to six questions and answers. Only complete pairs are published.",
    question: "Question",
    answer: "Answer",
    save: "Save company profile",
    saving: "Saving...",
  },
  uk: {
    eyebrow: "Профіль компанії",
    title: "Керування компанією",
    subtitle:
      "Заповніть профіль, щоб він працював як професійний мінісайт компанії у Clean Jobs.",
    back: "Мої заявки на компанії",
    viewProfile: "Переглянути публічний профіль",
    manageWebsite: "Керувати сайтом",
    saved: "Зміни збережено.",
    error:
      "Не вдалося зберегти профіль. Перевірте обов’язкові поля, зображення та числові значення.",
    verified: "Перевірена компанія",
    notVerified: "Компанію ще не перевірено",
    mediaTitle: "Бренд і фотографії",
    mediaText:
      "Використовуйте чіткі фотографії реальних робіт. Це підвищує довіру та конверсію.",
    logo: "Логотип компанії",
    cover: "Обкладинка",
    gallery: "Фотогалерея",
    logoHelp: "Рекомендовано квадратне зображення. JPG, PNG, WebP або AVIF, до 5 МБ.",
    coverHelp: "Рекомендовано широке зображення. JPG, PNG, WebP або AVIF, до 5 МБ.",
    galleryHelp: "Усього можна мати до 10 фотографій. Кожна — до 5 МБ.",
    removeImage: "Видалити зображення",
    noGallery: "Фотографії в галерею ще не додані.",
    detailsTitle: "Інформація про компанію",
    companyName: "Назва компанії",
    description: "Опис",
    city: "Місто",
    address: "Адреса",
    postalCode: "Поштовий індекс",
    organizationNumber: "Організаційний номер",
    foundedYear: "Рік заснування",
    contactTitle: "Контактні дані",
    phone: "Телефон",
    email: "Email",
    website: "Вебсайт",
    offerTitle: "Послуги та ціни",
    hourlyRate: "Ціна від, крон за годину",
    minimumOrder: "Мінімальне замовлення, годин",
    rutAvailable: "Доступний RUT-avdrag",
    yes: "Так",
    no: "Ні",
    languages: "Мови через кому",
    serviceTypes: "Послуги через кому",
    serviceAreas: "Райони роботи через кому",
    workingHoursTitle: "Графік роботи",
    workingHoursText:
      "Вкажіть, наприклад, 08:00–17:00. Напишіть Зачинено, якщо компанія не працює.",
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П’ятниця",
    saturday: "Субота",
    sunday: "Неділя",
    closedPlaceholder: "08:00–17:00 або Зачинено",
    faqTitle: "Поширені запитання",
    faqText: "Додайте до шести запитань і відповідей. Публікуються лише повні пари.",
    question: "Запитання",
    answer: "Відповідь",
    save: "Зберегти профіль компанії",
    saving: "Збереження...",
  },
  ru: {
    eyebrow: "Профиль компании",
    title: "Управление компанией",
    subtitle:
      "Заполните профиль, чтобы он работал как профессиональный мини-сайт компании в Clean Jobs.",
    back: "Мои заявки на компании",
    viewProfile: "Открыть публичный профиль",
    manageWebsite: "Управлять сайтом",
    saved: "Изменения сохранены.",
    error:
      "Не удалось сохранить профиль. Проверьте обязательные поля, изображения и числовые значения.",
    verified: "Проверенная компания",
    notVerified: "Компания пока не проверена",
    mediaTitle: "Бренд и фотографии",
    mediaText:
      "Используйте четкие фотографии реальных работ. Это повышает доверие и конверсию.",
    logo: "Логотип компании",
    cover: "Обложка",
    gallery: "Фотогалерея",
    logoHelp: "Рекомендуется квадратное изображение. JPG, PNG, WebP или AVIF, до 5 МБ.",
    coverHelp: "Рекомендуется широкое изображение. JPG, PNG, WebP или AVIF, до 5 МБ.",
    galleryHelp: "Всего можно добавить до 10 фотографий. Каждая — до 5 МБ.",
    removeImage: "Удалить изображение",
    noGallery: "Фотографии в галерею еще не добавлены.",
    detailsTitle: "Информация о компании",
    companyName: "Название компании",
    description: "Описание",
    city: "Город",
    address: "Адрес",
    postalCode: "Почтовый индекс",
    organizationNumber: "Организационный номер",
    foundedYear: "Год основания",
    contactTitle: "Контактные данные",
    phone: "Телефон",
    email: "Email",
    website: "Веб-сайт",
    offerTitle: "Услуги и цены",
    hourlyRate: "Цена от, крон в час",
    minimumOrder: "Минимальный заказ, часов",
    rutAvailable: "Доступен RUT-avdrag",
    yes: "Да",
    no: "Нет",
    languages: "Языки через запятую",
    serviceTypes: "Услуги через запятую",
    serviceAreas: "Районы работы через запятую",
    workingHoursTitle: "График работы",
    workingHoursText:
      "Укажите, например, 08:00–17:00. Напишите Закрыто, если компания не работает.",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье",
    closedPlaceholder: "08:00–17:00 или Закрыто",
    faqTitle: "Частые вопросы",
    faqText: "Добавьте до шести вопросов и ответов. Публикуются только полные пары.",
    question: "Вопрос",
    answer: "Ответ",
    save: "Сохранить профиль компании",
    saving: "Сохранение...",
  },
  pl: {
    eyebrow: "Profil firmy",
    title: "Zarządzaj firmą",
    subtitle:
      "Uzupełnij profil, aby działał jako profesjonalna mini-strona firmy w Clean Jobs.",
    back: "Moje zgłoszenia firm",
    viewProfile: "Zobacz profil publiczny",
    manageWebsite: "Zarządzaj stroną",
    saved: "Zmiany zostały zapisane.",
    error:
      "Nie udało się zapisać profilu. Sprawdź wymagane pola, zdjęcia i wartości liczbowe.",
    verified: "Zweryfikowana firma",
    notVerified: "Firma nie jest jeszcze zweryfikowana",
    mediaTitle: "Marka i zdjęcia",
    mediaText:
      "Dodaj wyraźne zdjęcia prawdziwych realizacji. Zwiększa to zaufanie i konwersję.",
    logo: "Logo firmy",
    cover: "Zdjęcie okładkowe",
    gallery: "Galeria zdjęć",
    logoHelp: "Zalecane zdjęcie kwadratowe. JPG, PNG, WebP lub AVIF, maksymalnie 5 MB.",
    coverHelp: "Zalecane zdjęcie szerokie. JPG, PNG, WebP lub AVIF, maksymalnie 5 MB.",
    galleryHelp: "Łącznie można dodać maksymalnie 10 zdjęć. Każde do 5 MB.",
    removeImage: "Usuń zdjęcie",
    noGallery: "Nie dodano jeszcze zdjęć do galerii.",
    detailsTitle: "Informacje o firmie",
    companyName: "Nazwa firmy",
    description: "Opis",
    city: "Miasto",
    address: "Adres",
    postalCode: "Kod pocztowy",
    organizationNumber: "Numer organizacyjny",
    foundedYear: "Rok założenia",
    contactTitle: "Dane kontaktowe",
    phone: "Telefon",
    email: "Email",
    website: "Strona internetowa",
    offerTitle: "Usługi i ceny",
    hourlyRate: "Cena od, SEK za godzinę",
    minimumOrder: "Minimalne zamówienie, godziny",
    rutAvailable: "Dostępna ulga RUT",
    yes: "Tak",
    no: "Nie",
    languages: "Języki, oddzielone przecinkami",
    serviceTypes: "Usługi, oddzielone przecinkami",
    serviceAreas: "Obszary działania, oddzielone przecinkami",
    workingHoursTitle: "Godziny otwarcia",
    workingHoursText:
      "Wpisz na przykład 08:00–17:00. Wpisz Zamknięte, gdy firma nie pracuje.",
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
    closedPlaceholder: "08:00–17:00 lub Zamknięte",
    faqTitle: "Najczęstsze pytania",
    faqText: "Dodaj do sześciu pytań i odpowiedzi. Publikowane są tylko pełne pary.",
    question: "Pytanie",
    answer: "Odpowiedź",
    save: "Zapisz profil firmy",
    saving: "Zapisywanie...",
  },
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) return []

  return value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  )
}

function normalizeWorkingHours(value: unknown): WorkingHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}

  const source = value as Record<string, unknown>
  const result: WorkingHours = {}

  for (const day of dayOrder) {
    if (typeof source[day] === "string") {
      result[day] = source[day]
    }
  }

  return result
}

function normalizeFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null

      const record = item as Record<string, unknown>
      const question = typeof record.question === "string" ? record.question : ""
      const answer = typeof record.answer === "string" ? record.answer : ""

      return question && answer ? { question, answer } : null
    })
    .filter((item): item is FaqItem => Boolean(item))
    .slice(0, 6)
}

function joinList(value: unknown) {
  return normalizeStringArray(value).join(", ")
}

export default async function EditCompanyPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params
  const query = await searchParams

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const t = labels[locale]

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/dashboard/companies/${id}/edit`)
  }

  const { data } = await supabase
    .from("companies")
    .select(
      "id, name, slug, city, address, postal_code, organization_number, founded_year, website, phone, email, description, logo_url, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, verified, owner_id",
    )
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle()

  const company = data as Company | null

  if (!company) {
    redirect("/dashboard/company-claims")
  }

  const galleryUrls = normalizeStringArray(company.gallery_urls)
  const workingHours = normalizeWorkingHours(company.working_hours)
  const faqItems = normalizeFaq(company.faq)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/dashboard/company-claims"
                prefetch={false}
                className="text-sm font-semibold text-slate-500 transition hover:text-rose-600"
              >
                ← {t.back}
              </Link>

              <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-rose-600">
                {t.eyebrow}
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                {t.title}
              </h1>

              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                {t.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/companies/${company.slug}`}
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
              >
                {t.viewProfile}
              </Link>
              <Link
                href={`/dashboard/companies/${company.id}/website`}
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-600"
              >
                {t.manageWebsite}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {query.saved === "true" ? (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
            {t.saved}
          </div>
        ) : null}

        {query.error === "true" ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">
            {t.error}
          </div>
        ) : null}

        <section className="mb-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div
            className="h-40 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-800 bg-cover bg-center sm:h-52"
            style={
              company.cover_url
                ? { backgroundImage: `url(${company.cover_url})` }
                : undefined
            }
          />

          <div className="relative px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
              {company.logo_url ? (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-white shadow-lg">
                  <img
                    src={company.logo_url}
                    alt={`${company.name} logo`}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-rose-600 text-4xl font-black text-white shadow-lg">
                  {company.name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-950">
                    {company.name}
                  </h2>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      company.verified
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {company.verified ? t.verified : t.notVerified}
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-slate-500">
                  {company.city || "Sweden"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <form
  action={updateCompanyProfile}
  className="space-y-8"
>
          <input type="hidden" name="company_id" value={company.id} />

          <Section title={t.mediaTitle} description={t.mediaText}>
            <div className="grid gap-6 lg:grid-cols-2">
              <MediaField
                id="logo"
                name="logo"
                label={t.logo}
                help={t.logoHelp}
                currentUrl={company.logo_url}
                removeLabel={t.removeImage}
                removeName="remove_logo"
                square
              />

              <MediaField
                id="cover"
                name="cover"
                label={t.cover}
                help={t.coverHelp}
                currentUrl={company.cover_url}
                removeLabel={t.removeImage}
                removeName="remove_cover"
              />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h3 className="text-lg font-black text-slate-950">{t.gallery}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{t.galleryHelp}</p>

              {galleryUrls.length > 0 ? (
                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {galleryUrls.map((url, index) => (
                    <label
                      key={`${url}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                    >
                      <img
                        src={url}
                        alt={`${company.name} gallery image ${index + 1}`}
                        className="aspect-square h-full w-full object-cover"
                      />

                      <span className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-xl bg-black/75 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                        <input
                          type="checkbox"
                          name="remove_gallery_url"
                          value={url}
                          className="h-4 w-4 rounded border-white/50"
                        />
                        {t.removeImage}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  {t.noGallery}
                </div>
              )}

              <input
                id="gallery"
                name="gallery"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="mt-5 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              />
            </div>
          </Section>

          <Section title={t.detailsTitle}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  id="name"
                  name="name"
                  required
                  label={t.companyName}
                  defaultValue={company.name}
                />
              </div>

              <div className="md:col-span-2">
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={8}
                  label={t.description}
                  defaultValue={company.description || ""}
                />
              </div>

              <Input
                id="city"
                name="city"
                required
                label={t.city}
                defaultValue={company.city || "Stockholm"}
              />

              <Input
                id="address"
                name="address"
                label={t.address}
                defaultValue={company.address || ""}
              />

              <Input
                id="postal_code"
                name="postal_code"
                label={t.postalCode}
                defaultValue={company.postal_code || ""}
              />

              <Input
                id="organization_number"
                name="organization_number"
                label={t.organizationNumber}
                defaultValue={company.organization_number || ""}
              />

              <Input
                id="founded_year"
                name="founded_year"
                type="number"
                min="1800"
                max="2100"
                step="1"
                label={t.foundedYear}
                defaultValue={company.founded_year?.toString() || ""}
              />
            </div>
          </Section>

          <Section title={t.contactTitle}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                id="phone"
                name="phone"
                label={t.phone}
                defaultValue={company.phone || ""}
              />

              <Input
                id="email"
                name="email"
                type="email"
                label={t.email}
                defaultValue={company.email || ""}
              />

              <div className="md:col-span-2">
                <Input
                  id="website"
                  name="website"
                  type="url"
                  label={t.website}
                  defaultValue={company.website || ""}
                />
              </div>
            </div>
          </Section>

          <Section title={t.offerTitle}>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                min="0"
                step="1"
                label={t.hourlyRate}
                defaultValue={company.hourly_rate?.toString() || ""}
              />

              <Input
                id="minimum_order"
                name="minimum_order"
                type="number"
                min="0"
                step="1"
                label={t.minimumOrder}
                defaultValue={company.minimum_order?.toString() || ""}
              />

              <Select
                id="rut_available"
                name="rut_available"
                label={t.rutAvailable}
                defaultValue={company.rut_available ? "yes" : "no"}
              >
                <option value="yes">{t.yes}</option>
                <option value="no">{t.no}</option>
              </Select>

              <Input
                id="languages"
                name="languages"
                label={t.languages}
                defaultValue={joinList(company.languages)}
              />

              <div className="md:col-span-2">
                <Input
                  id="service_types"
                  name="service_types"
                  label={t.serviceTypes}
                  defaultValue={joinList(company.service_types)}
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  id="service_areas"
                  name="service_areas"
                  label={t.serviceAreas}
                  defaultValue={joinList(company.service_areas)}
                />
              </div>
            </div>
          </Section>

          <Section
            title={t.workingHoursTitle}
            description={t.workingHoursText}
          >
            <div className="grid gap-5 md:grid-cols-2">
              {dayOrder.map((day) => (
                <Input
                  key={day}
                  id={`working_hours_${day}`}
                  name={`working_hours_${day}`}
                  label={t[day]}
                  placeholder={t.closedPlaceholder}
                  defaultValue={workingHours[day] || ""}
                />
              ))}
            </div>
          </Section>

          <Section title={t.faqTitle} description={t.faqText}>
            <div className="space-y-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <Input
                    id={`faq_question_${index}`}
                    name={`faq_question_${index}`}
                    label={`${t.question} ${index + 1}`}
                    defaultValue={faqItems[index]?.question || ""}
                  />

                  <Textarea
                    id={`faq_answer_${index}`}
                    name={`faq_answer_${index}`}
                    rows={4}
                    label={`${t.answer} ${index + 1}`}
                    defaultValue={faqItems[index]?.answer || ""}
                  />
                </div>
              ))}
            </div>
          </Section>

          <div className="sticky bottom-4 z-20 rounded-3xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
            <FormSubmitButton
              locale={locale}
              idleLabel={t.save}
              loadingLabel={t.saving}
            />
          </div>
        </form>
      </div>
    </main>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-black tracking-tight text-slate-950">
          {title}
        </h2>

        {description ? (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      {children}
    </section>
  )
}

function MediaField({
  id,
  name,
  label,
  help,
  currentUrl,
  removeLabel,
  removeName,
  square = false,
}: {
  id: string
  name: string
  label: string
  help: string
  currentUrl: string | null
  removeLabel: string
  removeName: string
  square?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-bold text-slate-900">
        {label}
      </label>

      {currentUrl ? (
        <div
          className={`mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${
            square ? "h-36 w-36" : "h-40 w-full"
          }`}
        >
          <img
            src={currentUrl}
            alt=""
            className={`h-full w-full ${square ? "object-contain p-3" : "object-cover"}`}
          />
        </div>
      ) : null}

      {currentUrl ? (
        <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-700">
          <input
            type="checkbox"
            name={removeName}
            value="yes"
            className="h-4 w-4 rounded border-red-300"
          />
          {removeLabel}
        </label>
      ) : null}

      <input
        id={id}
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="mt-4 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
      />

      <p className="mt-2 text-xs leading-5 text-slate-500">{help}</p>
    </div>
  )
}
