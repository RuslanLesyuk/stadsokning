import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { CompanyOfferForm } from "@/components/companies/company-offer-form"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { getLanguageAlternates } from "@/lib/seo"
import { createClient } from "@/lib/supabase-server"

type PageProps = {
  params: Promise<{ slug: string }>
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
  updated_at: string | null
}

type Review = {
  id: string
  reviewer_id: string | null
  rating: number
  comment: string | null
  created_at: string
}

type ReviewerProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
}

type Copy = {
  metadataFallback: string
  verified: string
  cleaningCompany: string
  about: string
  services: string
  servicesText: string
  pricing: string
  from: string
  perHour: string
  minimumOrder: string
  hours: string
  rutAvailable: string
  rutText: string
  serviceAreas: string
  languages: string
  workingHours: string
  gallery: string
  galleryText: string
  reviews: string
  reviewsText: string
  noReviews: string
  reviewerFallback: string
  faq: string
  contactInformation: string
  phone: string
  email: string
  website: string
  visitWebsite: string
  callCompany: string
  sendEmail: string
  location: string
  organizationNumber: string
  foundedYear: string
  requestQuote: string
  relatedCompanies: string
  relatedCompaniesText: string
  viewCompany: string
  backToCompanies: string
  fallbackDescription: string
  noContactInformation: string
  claimCompany: string
  claimCompanyText: string
  claimCompanyButton: string
  claimPending: string
  claimPendingText: string
  manageCompany: string
  ownedCompany: string
  ownedCompanyText: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
  closed: string
  ratingLabel: string
  lastUpdated: string
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

const copy: Record<Locale, Copy> = {
  sv: {
    metadataFallback:
      "Se tjänster, priser, omdömen och kontaktuppgifter för detta städföretag.",
    verified: "Verifierat företag",
    cleaningCompany: "Städföretag",
    about: "Om företaget",
    services: "Städtjänster",
    servicesText: "Tjänster som företaget erbjuder.",
    pricing: "Pris och villkor",
    from: "Från",
    perHour: "kr/timme",
    minimumOrder: "Minsta bokning",
    hours: "timmar",
    rutAvailable: "RUT-avdrag",
    rutText: "Företaget erbjuder tjänster som kan omfattas av RUT-avdrag.",
    serviceAreas: "Serviceområden",
    languages: "Språk",
    workingHours: "Öppettider",
    gallery: "Utförda arbeten",
    galleryText: "Bilder från företagets städuppdrag.",
    reviews: "Omdömen",
    reviewsText: "Verifierade omdömen från Clean Jobs.",
    noReviews: "Företaget har ännu inga publicerade omdömen.",
    reviewerFallback: "Clean Jobs-kund",
    faq: "Vanliga frågor",
    contactInformation: "Kontaktinformation",
    phone: "Telefon",
    email: "E-post",
    website: "Webbplats",
    visitWebsite: "Besök webbplatsen",
    callCompany: "Ring företaget",
    sendEmail: "Skicka e-post",
    location: "Plats",
    organizationNumber: "Organisationsnummer",
    foundedYear: "Grundat",
    requestQuote: "Begär offert",
    relatedCompanies: "Liknande städföretag",
    relatedCompaniesText: "Utforska andra städföretag på Clean Jobs.",
    viewCompany: "Visa företag",
    backToCompanies: "Alla företag",
    fallbackDescription:
      "Se information om detta städföretag, dess tjänster, plats och kontaktuppgifter.",
    noContactInformation:
      "Kontaktinformation för detta företag har ännu inte lagts till.",
    claimCompany: "Är detta ditt företag?",
    claimCompanyText:
      "Verifiera att du representerar företaget och få tillgång till att hantera profilen.",
    claimCompanyButton: "Gör anspråk på företaget",
    claimPending: "Begäran granskas",
    claimPendingText: "Din begäran har skickats och granskas.",
    manageCompany: "Hantera företaget",
    ownedCompany: "Du hanterar detta företag",
    ownedCompanyText: "Företagsprofilen är kopplad till ditt konto.",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
    closed: "Stängt",
    ratingLabel: "av 5",
    lastUpdated: "Senast uppdaterad",
  },
  en: {
    metadataFallback:
      "View services, pricing, reviews and contact details for this cleaning company.",
    verified: "Verified company",
    cleaningCompany: "Cleaning company",
    about: "About the company",
    services: "Cleaning services",
    servicesText: "Services offered by the company.",
    pricing: "Pricing and terms",
    from: "From",
    perHour: "SEK/hour",
    minimumOrder: "Minimum booking",
    hours: "hours",
    rutAvailable: "RUT deduction",
    rutText: "The company offers services that may qualify for the RUT deduction.",
    serviceAreas: "Service areas",
    languages: "Languages",
    workingHours: "Opening hours",
    gallery: "Completed work",
    galleryText: "Photos from the company’s cleaning jobs.",
    reviews: "Reviews",
    reviewsText: "Verified reviews from Clean Jobs.",
    noReviews: "The company has no published reviews yet.",
    reviewerFallback: "Clean Jobs customer",
    faq: "Frequently asked questions",
    contactInformation: "Contact information",
    phone: "Phone",
    email: "Email",
    website: "Website",
    visitWebsite: "Visit website",
    callCompany: "Call company",
    sendEmail: "Send email",
    location: "Location",
    organizationNumber: "Organisation number",
    foundedYear: "Founded",
    requestQuote: "Request a quote",
    relatedCompanies: "Similar cleaning companies",
    relatedCompaniesText: "Explore other cleaning companies on Clean Jobs.",
    viewCompany: "View company",
    backToCompanies: "All companies",
    fallbackDescription:
      "View information about this cleaning company, its services, location and contact details.",
    noContactInformation:
      "Contact information for this company has not been added yet.",
    claimCompany: "Is this your company?",
    claimCompanyText:
      "Verify that you represent this company and get access to manage its profile.",
    claimCompanyButton: "Claim this company",
    claimPending: "Claim under review",
    claimPendingText: "Your request has been submitted and is being reviewed.",
    manageCompany: "Manage company",
    ownedCompany: "You manage this company",
    ownedCompanyText: "This company profile is connected to your account.",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
    ratingLabel: "out of 5",
    lastUpdated: "Last updated",
  },
  uk: {
    metadataFallback:
      "Перегляньте послуги, ціни, відгуки та контактні дані цієї клінінгової компанії.",
    verified: "Перевірена компанія",
    cleaningCompany: "Клінінгова компанія",
    about: "Про компанію",
    services: "Послуги прибирання",
    servicesText: "Послуги, які пропонує компанія.",
    pricing: "Ціни та умови",
    from: "Від",
    perHour: "крон/год",
    minimumOrder: "Мінімальне замовлення",
    hours: "годин",
    rutAvailable: "RUT-avdrag",
    rutText: "Компанія пропонує послуги, які можуть підпадати під RUT-avdrag.",
    serviceAreas: "Райони роботи",
    languages: "Мови",
    workingHours: "Графік роботи",
    gallery: "Виконані роботи",
    galleryText: "Фотографії з виконаних компанією замовлень.",
    reviews: "Відгуки",
    reviewsText: "Перевірені відгуки у Clean Jobs.",
    noReviews: "Компанія ще не має опублікованих відгуків.",
    reviewerFallback: "Клієнт Clean Jobs",
    faq: "Поширені запитання",
    contactInformation: "Контактна інформація",
    phone: "Телефон",
    email: "Email",
    website: "Вебсайт",
    visitWebsite: "Відвідати вебсайт",
    callCompany: "Зателефонувати",
    sendEmail: "Надіслати email",
    location: "Місцезнаходження",
    organizationNumber: "Організаційний номер",
    foundedYear: "Засновано",
    requestQuote: "Отримати пропозицію",
    relatedCompanies: "Схожі клінінгові компанії",
    relatedCompaniesText: "Перегляньте інші клінінгові компанії у Clean Jobs.",
    viewCompany: "Переглянути компанію",
    backToCompanies: "Усі компанії",
    fallbackDescription:
      "Перегляньте інформацію про клінінгову компанію, її послуги, місцезнаходження та контакти.",
    noContactInformation: "Контактні дані компанії ще не додано.",
    claimCompany: "Це ваша компанія?",
    claimCompanyText:
      "Підтвердьте право представляти компанію та отримайте доступ до керування профілем.",
    claimCompanyButton: "Підтвердити право на компанію",
    claimPending: "Заявка на перевірці",
    claimPendingText: "Вашу заявку надіслано та передано на перевірку.",
    manageCompany: "Керувати компанією",
    ownedCompany: "Ви керуєте цією компанією",
    ownedCompanyText: "Профіль компанії прив’язано до вашого облікового запису.",
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П’ятниця",
    saturday: "Субота",
    sunday: "Неділя",
    closed: "Зачинено",
    ratingLabel: "з 5",
    lastUpdated: "Останнє оновлення",
  },
  ru: {
    metadataFallback:
      "Посмотрите услуги, цены, отзывы и контактные данные этой клининговой компании.",
    verified: "Проверенная компания",
    cleaningCompany: "Клининговая компания",
    about: "О компании",
    services: "Услуги уборки",
    servicesText: "Услуги, которые предлагает компания.",
    pricing: "Цены и условия",
    from: "От",
    perHour: "крон/час",
    minimumOrder: "Минимальный заказ",
    hours: "часов",
    rutAvailable: "RUT-avdrag",
    rutText: "Компания предлагает услуги, которые могут подпадать под RUT-avdrag.",
    serviceAreas: "Районы работы",
    languages: "Языки",
    workingHours: "График работы",
    gallery: "Выполненные работы",
    galleryText: "Фотографии выполненных компанией заказов.",
    reviews: "Отзывы",
    reviewsText: "Проверенные отзывы в Clean Jobs.",
    noReviews: "У компании пока нет опубликованных отзывов.",
    reviewerFallback: "Клиент Clean Jobs",
    faq: "Частые вопросы",
    contactInformation: "Контактная информация",
    phone: "Телефон",
    email: "Email",
    website: "Веб-сайт",
    visitWebsite: "Посетить веб-сайт",
    callCompany: "Позвонить",
    sendEmail: "Отправить email",
    location: "Местоположение",
    organizationNumber: "Организационный номер",
    foundedYear: "Основано",
    requestQuote: "Получить предложение",
    relatedCompanies: "Похожие клининговые компании",
    relatedCompaniesText: "Посмотрите другие клининговые компании в Clean Jobs.",
    viewCompany: "Посмотреть компанию",
    backToCompanies: "Все компании",
    fallbackDescription:
      "Посмотрите информацию о клининговой компании, ее услугах, местоположении и контактах.",
    noContactInformation: "Контактные данные компании пока не добавлены.",
    claimCompany: "Это ваша компания?",
    claimCompanyText:
      "Подтвердите право представлять компанию и получите доступ к управлению профилем.",
    claimCompanyButton: "Подтвердить право на компанию",
    claimPending: "Заявка на проверке",
    claimPendingText: "Ваша заявка отправлена и находится на проверке.",
    manageCompany: "Управлять компанией",
    ownedCompany: "Вы управляете этой компанией",
    ownedCompanyText: "Профиль компании связан с вашей учетной записью.",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье",
    closed: "Закрыто",
    ratingLabel: "из 5",
    lastUpdated: "Последнее обновление",
  },
  pl: {
    metadataFallback:
      "Zobacz usługi, ceny, opinie i dane kontaktowe tej firmy sprzątającej.",
    verified: "Zweryfikowana firma",
    cleaningCompany: "Firma sprzątająca",
    about: "O firmie",
    services: "Usługi sprzątania",
    servicesText: "Usługi oferowane przez firmę.",
    pricing: "Ceny i warunki",
    from: "Od",
    perHour: "SEK/godz.",
    minimumOrder: "Minimalne zamówienie",
    hours: "godziny",
    rutAvailable: "Ulga RUT",
    rutText: "Firma oferuje usługi, które mogą kwalifikować się do ulgi RUT.",
    serviceAreas: "Obszary działania",
    languages: "Języki",
    workingHours: "Godziny otwarcia",
    gallery: "Wykonane prace",
    galleryText: "Zdjęcia z realizacji firmy.",
    reviews: "Opinie",
    reviewsText: "Zweryfikowane opinie w Clean Jobs.",
    noReviews: "Firma nie ma jeszcze opublikowanych opinii.",
    reviewerFallback: "Klient Clean Jobs",
    faq: "Najczęstsze pytania",
    contactInformation: "Dane kontaktowe",
    phone: "Telefon",
    email: "Email",
    website: "Strona internetowa",
    visitWebsite: "Odwiedź stronę",
    callCompany: "Zadzwoń",
    sendEmail: "Wyślij email",
    location: "Lokalizacja",
    organizationNumber: "Numer organizacyjny",
    foundedYear: "Założono",
    requestQuote: "Poproś o wycenę",
    relatedCompanies: "Podobne firmy sprzątające",
    relatedCompaniesText: "Zobacz inne firmy sprzątające w Clean Jobs.",
    viewCompany: "Zobacz firmę",
    backToCompanies: "Wszystkie firmy",
    fallbackDescription:
      "Zobacz informacje o firmie sprzątającej, jej usługach, lokalizacji i danych kontaktowych.",
    noContactInformation: "Dane kontaktowe firmy nie zostały jeszcze dodane.",
    claimCompany: "Czy to Twoja firma?",
    claimCompanyText:
      "Potwierdź, że reprezentujesz firmę, i uzyskaj dostęp do zarządzania profilem.",
    claimCompanyButton: "Przejmij profil firmy",
    claimPending: "Zgłoszenie jest sprawdzane",
    claimPendingText: "Zgłoszenie zostało wysłane i jest sprawdzane.",
    manageCompany: "Zarządzaj firmą",
    ownedCompany: "Zarządzasz tą firmą",
    ownedCompanyText: "Profil firmy jest połączony z Twoim kontem.",
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
    closed: "Zamknięte",
    ratingLabel: "na 5",
    lastUpdated: "Ostatnia aktualizacja",
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
    if (typeof source[day] === "string") result[day] = source[day]
  }

  return result
}

function normalizeFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null

      const record = item as Record<string, unknown>
      const question = typeof record.question === "string" ? record.question.trim() : ""
      const answer = typeof record.answer === "string" ? record.answer.trim() : ""

      return question && answer ? { question, answer } : null
    })
    .filter((item): item is FaqItem => Boolean(item))
}

function normalizeWebsiteUrl(website: string) {
  return /^https?:\/\//i.test(website) ? website : `https://${website}`
}

function getWebsiteLabel(website: string) {
  try {
    return new URL(normalizeWebsiteUrl(website)).hostname.replace(/^www\./, "")
  } catch {
    return website
  }
}

function getCompanyInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "C"
}

function truncateDescription(value: string, length = 160) {
  if (value.length <= length) return value
  return `${value.slice(0, length - 1).trimEnd()}…`
}

function formatDate(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value))
}

function getOpeningHoursSpecifications(workingHours: WorkingHours) {
  const schemaDays: Record<DayKey, string> = {
    monday: "https://schema.org/Monday",
    tuesday: "https://schema.org/Tuesday",
    wednesday: "https://schema.org/Wednesday",
    thursday: "https://schema.org/Thursday",
    friday: "https://schema.org/Friday",
    saturday: "https://schema.org/Saturday",
    sunday: "https://schema.org/Sunday",
  }

  return dayOrder.flatMap((day) => {
    const value = workingHours[day]
    if (!value) return []

    const match = value.match(/(\d{1,2}:\d{2})\s*[–—-]\s*(\d{1,2}:\d{2})/)
    if (!match) return []

    return [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: schemaDays[day],
        opens: match[1],
        closes: match[2],
      },
    ]
  })
}

async function getLocale() {
  const cookieStore = await cookies()
  return normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
}

async function getCompany(slug: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("companies")
    .select(
      "id, name, slug, city, address, postal_code, organization_number, founded_year, website, phone, email, description, logo_url, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, verified, owner_id, updated_at",
    )
    .eq("slug", slug)
    .maybeSingle()

  return data as Company | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const t = copy[locale]
  const company = await getCompany(slug)

  if (!company) {
    return {
      title: "Company Not Found | Clean Jobs",
      robots: { index: false, follow: false },
    }
  }

  const city = company.city || "Sweden"
  const canonicalPath = `/companies/${company.slug}`
  const title = `${company.name} – Städföretag i ${city} | Clean Jobs`
  const description = truncateDescription(
    company.description || `${company.name}: ${t.metadataFallback}`,
  )

  return {
    title,
    description,
    alternates: {
      canonical: `https://cleansjob.com${canonicalPath}`,
      languages: getLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title,
      description,
      url: `https://cleansjob.com${canonicalPath}`,
      type: "website",
      images: company.cover_url
        ? [{ url: company.cover_url, alt: company.name }]
        : company.logo_url
          ? [{ url: company.logo_url, alt: `${company.name} logo` }]
          : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: company.cover_url || company.logo_url || undefined,
    },
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params
  const locale = await getLocale()
  const t = copy[locale]
  const company = await getCompany(slug)

  if (!company) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const serviceTypes = normalizeStringArray(company.service_types)
  const serviceAreas = normalizeStringArray(company.service_areas)
  const languages = normalizeStringArray(company.languages)
  const galleryUrls = normalizeStringArray(company.gallery_urls)
  const workingHours = normalizeWorkingHours(company.working_hours)
  const faqItems = normalizeFaq(company.faq)

  let pendingClaim: { id: string; status: string } | null = null

  if (user && !company.owner_id) {
    const { data } = await supabase
      .from("company_claim_requests")
      .select("id, status")
      .eq("company_id", company.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle()

    pendingClaim = data
  }

  const isCompanyOwner = Boolean(user && company.owner_id === user.id)

  const { data: reviewData } = await supabase
    .from("reviews")
    .select("id, reviewer_id, rating, comment, created_at")
    .eq("entity_type", "company")
    .eq("entity_id", company.id)
    .order("created_at", { ascending: false })
    .limit(12)

  const reviews = ((reviewData ?? []) as Review[]).filter(
    (review) => Number.isFinite(Number(review.rating)),
  )

  const reviewerIds = Array.from(
    new Set(
      reviews
        .map((review) => review.reviewer_id)
        .filter((id): id is string => Boolean(id)),
    ),
  )

  let reviewerProfiles: ReviewerProfile[] = []

  if (reviewerIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url")
      .in("id", reviewerIds)

    reviewerProfiles = (data ?? []) as ReviewerProfile[]
  }

  const reviewerMap = new Map(
    reviewerProfiles.map((profile) => [profile.id, profile]),
  )

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      : null

  let relatedQuery = supabase
    .from("companies")
    .select(
      "id, name, slug, city, description, logo_url, verified, owner_id, website, phone, email, address, postal_code, organization_number, founded_year, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, updated_at",
    )
    .neq("id", company.id)
    .order("verified", { ascending: false })
    .order("name", { ascending: true })
    .limit(3)

  if (company.city) relatedQuery = relatedQuery.eq("city", company.city)

  const { data: relatedData } = await relatedQuery
  let relatedCompanies = (relatedData ?? []) as Company[]

  if (relatedCompanies.length < 3) {
    const existingIds = [company.id, ...relatedCompanies.map((item) => item.id)]

    const { data: fallbackData } = await supabase
      .from("companies")
      .select(
        "id, name, slug, city, description, logo_url, verified, owner_id, website, phone, email, address, postal_code, organization_number, founded_year, cover_url, gallery_urls, service_types, service_areas, languages, hourly_rate, minimum_order, rut_available, working_hours, faq, updated_at",
      )
      .not("id", "in", `(${existingIds.join(",")})`)
      .order("verified", { ascending: false })
      .order("name", { ascending: true })
      .limit(3 - relatedCompanies.length)

    relatedCompanies = [
      ...relatedCompanies,
      ...((fallbackData ?? []) as Company[]),
    ]
  }

  const websiteUrl = company.website
    ? normalizeWebsiteUrl(company.website)
    : null

  const hasContactInformation = Boolean(
    company.phone || company.email || company.website,
  )

  const profileUrl = `https://cleansjob.com/companies/${company.slug}`
  const openingHoursSpecification = getOpeningHoursSpecifications(workingHours)

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "CleaningService",
    "@id": `${profileUrl}#business`,
    name: company.name,
    description: company.description || t.fallbackDescription,
    url: profileUrl,
    ...(company.logo_url ? { logo: company.logo_url, image: company.logo_url } : {}),
    ...(company.cover_url ? { image: company.cover_url } : {}),
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.email ? { email: company.email } : {}),
    ...(websiteUrl ? { sameAs: [websiteUrl] } : {}),
    ...(company.founded_year ? { foundingDate: String(company.founded_year) } : {}),
    address: {
      "@type": "PostalAddress",
      ...(company.address ? { streetAddress: company.address } : {}),
      ...(company.postal_code ? { postalCode: company.postal_code } : {}),
      addressLocality: company.city || "Sweden",
      addressCountry: "SE",
    },
    ...(serviceAreas.length > 0
      ? { areaServed: serviceAreas.map((name) => ({ "@type": "Place", name })) }
      : {}),
    ...(serviceTypes.length > 0
      ? {
          makesOffer: serviceTypes.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name },
          })),
        }
      : {}),
    ...(openingHoursSpecification.length > 0
      ? { openingHoursSpecification }
      : {}),
    ...(company.hourly_rate
      ? { priceRange: `${company.hourly_rate} SEK/hour` }
      : {}),
    ...(averageRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating.toFixed(1),
            reviewCount: reviews.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviews.length > 0
      ? {
          review: reviews.slice(0, 5).map((review) => {
            const reviewer = review.reviewer_id
              ? reviewerMap.get(review.reviewer_id)
              : null

            return {
              "@type": "Review",
              author: {
                "@type": "Person",
                name: reviewer?.full_name || t.reviewerFallback,
              },
              datePublished: review.created_at,
              reviewRating: {
                "@type": "Rating",
                ratingValue: review.rating,
                bestRating: 5,
                worstRating: 1,
              },
              ...(review.comment ? { reviewBody: review.comment } : {}),
            }
          }),
        }
      : {}),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.backToCompanies,
        item: "https://cleansjob.com/companies",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: company.name,
        item: profileUrl,
      },
    ],
  }

  const faqJsonLd = faqItems.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <main>
        <section className="relative overflow-hidden bg-slate-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-45"
            style={
              company.cover_url
                ? { backgroundImage: `url(${company.cover_url})` }
                : undefined
            }
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/55" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <nav
              aria-label="Breadcrumb"
              className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/60"
            >
              <Link
                href="/companies"
                prefetch={false}
                className="transition hover:text-white"
              >
                {t.backToCompanies}
              </Link>
              <span>/</span>
              <span className="font-semibold text-white">{company.name}</span>
            </nav>

            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <CompanyLogo company={company} size="large" />

                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-rose-300">
                      {t.cleaningCompany}
                    </span>

                    {company.verified ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-emerald-200 ring-1 ring-inset ring-emerald-300/30">
                        <VerifiedIcon />
                        {t.verified}
                      </span>
                    ) : null}

                    {averageRating ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-white/15">
                        <span className="text-amber-300">★</span>
                        {averageRating.toFixed(1)} {t.ratingLabel} · {reviews.length}
                      </span>
                    ) : null}
                  </div>

                  <h1 className="mt-4 break-words text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {company.name}
                  </h1>

                  <p className="mt-4 flex items-center gap-2 text-base font-medium text-white/75">
                    <LocationIcon />
                    {[company.address, company.postal_code, company.city]
                      .filter(Boolean)
                      .join(", ") || "Sweden"}
                  </p>

                  <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
                    {company.description || t.fallbackDescription}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <a
                  href="#offer"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-rose-950/25 transition hover:bg-rose-500"
                >
                  {t.requestQuote}
                </a>

                {company.phone ? (
                  <a
                    href={`tel:${company.phone.replace(/\s+/g, "")}`}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                  >
                    <PhoneIcon />
                    {t.callCompany}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
            <QuickFact label={t.location} value={company.city || "Sweden"} />
            <QuickFact
              label={t.pricing}
              value={
                company.hourly_rate
                  ? `${t.from} ${company.hourly_rate} ${t.perHour}`
                  : "—"
              }
            />
            <QuickFact
              label={t.rutAvailable}
              value={company.rut_available ? "✓" : "—"}
            />
            <QuickFact
              label={t.services}
              value={serviceTypes.length > 0 ? String(serviceTypes.length) : "—"}
            />
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-14">
          <div className="space-y-8">
            <ContentSection title={t.about}>
              <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                {company.description || t.fallbackDescription}
              </p>

              {(company.organization_number || company.founded_year) ? (
                <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                  {company.organization_number ? (
                    <DefinitionCard
                      label={t.organizationNumber}
                      value={company.organization_number}
                    />
                  ) : null}

                  {company.founded_year ? (
                    <DefinitionCard
                      label={t.foundedYear}
                      value={String(company.founded_year)}
                    />
                  ) : null}
                </dl>
              ) : null}
            </ContentSection>

            {serviceTypes.length > 0 ? (
              <ContentSection title={t.services} description={t.servicesText}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {serviceTypes.map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-lg font-black text-rose-700">
                        ✓
                      </span>
                      <span className="font-bold text-slate-900">{service}</span>
                    </div>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            {(company.hourly_rate || company.minimum_order || company.rut_available) ? (
              <ContentSection title={t.pricing}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {company.hourly_rate ? (
                    <MetricCard
                      label={t.from}
                      value={`${company.hourly_rate} ${t.perHour}`}
                    />
                  ) : null}

                  {company.minimum_order ? (
                    <MetricCard
                      label={t.minimumOrder}
                      value={`${company.minimum_order} ${t.hours}`}
                    />
                  ) : null}

                  {company.rut_available ? (
                    <MetricCard label={t.rutAvailable} value="✓" accent />
                  ) : null}
                </div>

                {company.rut_available ? (
                  <p className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-800">
                    {t.rutText}
                  </p>
                ) : null}
              </ContentSection>
            ) : null}

            {(serviceAreas.length > 0 || languages.length > 0) ? (
              <ContentSection title={t.serviceAreas}>
                <div className="grid gap-7 md:grid-cols-2">
                  {serviceAreas.length > 0 ? (
                    <TagGroup title={t.serviceAreas} values={serviceAreas} />
                  ) : null}

                  {languages.length > 0 ? (
                    <TagGroup title={t.languages} values={languages} muted />
                  ) : null}
                </div>
              </ContentSection>
            ) : null}

            {Object.values(workingHours).some(Boolean) ? (
              <ContentSection title={t.workingHours}>
                <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
                  {dayOrder.map((day) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-5 px-4 py-3.5 text-sm"
                    >
                      <span className="font-bold text-slate-800">{t[day]}</span>
                      <span className="text-right font-medium text-slate-500">
                        {workingHours[day] || t.closed}
                      </span>
                    </div>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            {galleryUrls.length > 0 ? (
              <ContentSection title={t.gallery} description={t.galleryText}>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {galleryUrls.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className={`overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 ${
                        index === 0 ? "col-span-2 row-span-2" : ""
                      }`}
                    >
                      <img
                        src={url}
                        alt={`${company.name} cleaning work ${index + 1}`}
                        loading="lazy"
                        className="h-full min-h-44 w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            <ContentSection title={t.reviews} description={t.reviewsText}>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const reviewer = review.reviewer_id
                      ? reviewerMap.get(review.reviewer_id)
                      : null

                    return (
                      <article
                        key={review.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {reviewer?.avatar_url ? (
                              <img
                                src={reviewer.avatar_url}
                                alt=""
                                className="h-11 w-11 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200 font-black text-slate-600">
                                {(reviewer?.full_name || t.reviewerFallback)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-bold text-slate-900">
                                {reviewer?.full_name || t.reviewerFallback}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {formatDate(review.created_at, locale)}
                              </p>
                            </div>
                          </div>

                          <div
                            className="flex text-amber-400"
                            aria-label={`${review.rating} ${t.ratingLabel}`}
                          >
                            {Array.from({ length: 5 }).map((_, index) => (
                              <span key={index}>{index < review.rating ? "★" : "☆"}</span>
                            ))}
                          </div>
                        </div>

                        {review.comment ? (
                          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                            {review.comment}
                          </p>
                        ) : null}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  {t.noReviews}
                </div>
              )}
            </ContentSection>

            {faqItems.length > 0 ? (
              <ContentSection title={t.faq}>
                <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200">
                  {faqItems.map((item) => (
                    <details key={item.question} className="group bg-white p-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-900">
                        {item.question}
                        <span className="text-xl text-rose-600 transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </ContentSection>
            ) : null}

            <section
              id="offer"
              className="scroll-mt-24 rounded-[2rem] border border-rose-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <CompanyOfferForm
                companyId={company.id}
                companySlug={company.slug}
                companyName={company.name}
                locale={locale}
                serviceTypes={serviceTypes}
                defaultCity={company.city || ""}
                defaultEmail={user?.email || ""}
              />
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                {t.contactInformation}
              </h2>

              {hasContactInformation ? (
                <div className="mt-6 space-y-5">
                  {company.phone ? (
                    <ContactRow
                      icon={<PhoneIcon />}
                      label={t.phone}
                      value={company.phone}
                      href={`tel:${company.phone.replace(/\s+/g, "")}`}
                    />
                  ) : null}

                  {company.email ? (
                    <ContactRow
                      icon={<EmailIcon />}
                      label={t.email}
                      value={company.email}
                      href={`mailto:${company.email}`}
                    />
                  ) : null}

                  {websiteUrl && company.website ? (
                    <ContactRow
                      icon={<GlobeIcon />}
                      label={t.website}
                      value={getWebsiteLabel(company.website)}
                      href={websiteUrl}
                      external
                    />
                  ) : null}
                </div>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {t.noContactInformation}
                </p>
              )}

              <a
                href="#offer"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-rose-700"
              >
                {t.requestQuote}
              </a>
            </section>

            {isCompanyOwner ? (
              <OwnerCard
                tone="green"
                title={t.ownedCompany}
                description={t.ownedCompanyText}
                href={`/dashboard/companies/${company.id}/edit`}
                button={t.manageCompany}
                icon="✓"
              />
            ) : pendingClaim ? (
              <OwnerCard
                tone="amber"
                title={t.claimPending}
                description={t.claimPendingText}
                href="/dashboard/company-claims"
                button={t.claimPending}
                icon="…"
              />
            ) : !company.owner_id ? (
              <OwnerCard
                tone="rose"
                title={t.claimCompany}
                description={t.claimCompanyText}
                href={`/companies/${company.slug}/claim`}
                button={t.claimCompanyButton}
                icon="?"
              />
            ) : null}

            {company.updated_at ? (
              <p className="px-2 text-xs text-slate-400">
                {t.lastUpdated}: {formatDate(company.updated_at, locale)}
              </p>
            ) : null}
          </aside>
        </div>

        {relatedCompanies.length > 0 ? (
          <section className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                {t.relatedCompanies}
              </h2>
              <p className="mt-3 text-slate-600">{t.relatedCompaniesText}</p>

              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedCompanies.map((related) => (
                  <Link
                    key={related.id}
                    href={`/companies/${related.slug}`}
                    prefetch={false}
                    className="group flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg"
                  >
                    <CompanyLogo company={related} size="small" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate font-black text-slate-950">
                          {related.name}
                        </h3>
                        {related.verified ? (
                          <span className="text-emerald-600"><VerifiedIcon /></span>
                        ) : null}
                      </div>
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <LocationIcon />
                        <span className="truncate">{related.city || "Sweden"}</span>
                      </p>
                      <p className="mt-4 text-sm font-black text-rose-600">
                        {t.viewCompany} <span className="transition-transform group-hover:translate-x-1">→</span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}

function ContentSection({
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
      <h2 className="text-2xl font-black tracking-tight text-slate-950">{title}</h2>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function QuickFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-5 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-base font-black text-slate-900">{value}</p>
    </div>
  )
}

function DefinitionCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-2 font-bold text-slate-900">{value}</dd>
    </div>
  )
}

function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${accent ? "text-emerald-600" : "text-slate-400"}`}>{label}</p>
      <p className={`mt-2 text-xl font-black ${accent ? "text-emerald-800" : "text-slate-900"}`}>{value}</p>
    </div>
  )
}

function TagGroup({
  title,
  values,
  muted = false,
}: {
  title: string
  values: string[]
  muted?: boolean
}) {
  return (
    <div>
      <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${muted ? "bg-slate-100 text-slate-700" : "bg-rose-50 text-rose-700"}`}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  external?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-1 block break-all text-sm font-bold text-slate-900 transition hover:text-rose-600"
        >
          {value}
        </a>
      </div>
    </div>
  )
}

function OwnerCard({
  tone,
  title,
  description,
  href,
  button,
  icon,
}: {
  tone: "green" | "amber" | "rose"
  title: string
  description: string
  href: string
  button: string
  icon: string
}) {
  const styles = {
    green: {
      container: "border-emerald-200 bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-700",
      title: "text-emerald-950",
      text: "text-emerald-800",
      button: "bg-emerald-700 hover:bg-emerald-800",
    },
    amber: {
      container: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-700",
      title: "text-amber-950",
      text: "text-amber-800",
      button: "bg-amber-700 hover:bg-amber-800",
    },
    rose: {
      container: "border-rose-200 bg-rose-50",
      icon: "bg-rose-100 text-rose-700",
      title: "text-rose-950",
      text: "text-rose-800",
      button: "bg-rose-600 hover:bg-rose-700",
    },
  }[tone]

  return (
    <section className={`rounded-[2rem] border p-6 ${styles.container}`}>
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black ${styles.icon}`}>{icon}</div>
      <h2 className={`mt-4 text-lg font-black ${styles.title}`}>{title}</h2>
      <p className={`mt-2 text-sm leading-6 ${styles.text}`}>{description}</p>
      <Link
        href={href}
        prefetch={false}
        className={`mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 py-2.5 text-center text-sm font-black text-white transition ${styles.button}`}
      >
        {button}
      </Link>
    </section>
  )
}

function CompanyLogo({
  company,
  size,
}: {
  company: Company
  size: "large" | "small"
}) {
  const sizeClass = size === "large" ? "h-24 w-24 rounded-3xl text-4xl sm:h-28 sm:w-28" : "h-14 w-14 rounded-2xl text-xl"

  if (company.logo_url) {
    return (
      <div className={`flex shrink-0 items-center justify-center overflow-hidden border border-white/25 bg-white shadow-xl ${sizeClass}`}>
        <img src={company.logo_url} alt={`${company.name} logo`} className="h-full w-full object-contain p-3" />
      </div>
    )
  }

  return (
    <div className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-rose-500 to-rose-700 font-black text-white shadow-xl ${sizeClass}`}>
      {getCompanyInitial(company.name)}
    </div>
  )
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path d="M12 21s7-5.35 7-12a7 7 0 1 0-14 0c0 6.65 7 12 7 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path d="M8.2 3.5 10 7.8a1.5 1.5 0 0 1-.35 1.65l-1.4 1.4a14.4 14.4 0 0 0 4.9 4.9l1.4-1.4A1.5 1.5 0 0 1 16.2 14l4.3 1.8a1.5 1.5 0 0 1 .9 1.55V20a2 2 0 0 1-2 2C9.8 22 2 14.2 2 4.6a2 2 0 0 1 2-2h2.65a1.5 1.5 0 0 1 1.55.9Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12h17M12 3c2.3 2.45 3.5 5.45 3.5 9S14.3 18.55 12 21M12 3C9.7 5.45 8.5 8.45 8.5 12S9.7 18.55 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function VerifiedIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="m10 1.8 2 1.35 2.4-.15.8 2.25 2 1.3-.65 2.3.65 2.3-2 1.3-.8 2.25-2.4-.15L10 18.2l-2-1.35-2.4.15-.8-2.25-2-1.3.65-2.3-.65-2.3 2-1.3.8-2.25 2.4.15L10 1.8Z" fill="currentColor" />
      <path d="m6.8 10 2 2 4.4-4.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
