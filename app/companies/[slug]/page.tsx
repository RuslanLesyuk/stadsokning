import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase-server"
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"
import { getLanguageAlternates } from "@/lib/seo"

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

type Company = {
  id: string
  name: string
  slug: string
  city: string | null
  website: string | null
  phone: string | null
  email: string | null
  description: string | null
  logo_url: string | null
  verified: boolean | null
  owner_id: string | null
}

type Copy = {
  verified: string
  cleaningCompany: string
  about: string
  contactInformation: string
  phone: string
  email: string
  website: string
  visitWebsite: string
  callCompany: string
  sendEmail: string
  findJobs: string
  relatedCompanies: string
  relatedCompaniesText: string
  viewCompany: string
  backToCompanies: string
  fallbackDescription: string
  noContactInformation: string
  companyLocation: string
  claimCompany: string
  claimCompanyText: string
  claimCompanyButton: string
  claimPending: string
  claimPendingText: string
  manageCompany: string
  ownedCompany: string
  ownedCompanyText: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    verified: "Перевірена компанія",
    cleaningCompany: "Клінінгова компанія",
    about: "Про компанію",
    contactInformation: "Контактна інформація",
    phone: "Телефон",
    email: "Email",
    website: "Вебсайт",
    visitWebsite: "Відвідати вебсайт",
    callCompany: "Зателефонувати",
    sendEmail: "Надіслати email",
    findJobs: "Знайти роботу з прибирання",
    relatedCompanies: "Схожі компанії",
    relatedCompaniesText:
      "Перегляньте інші клінінгові компанії, доступні на Clean Jobs.",
    viewCompany: "Переглянути компанію",
    backToCompanies: "Усі компанії",
    fallbackDescription:
      "Перегляньте інформацію про цю клінінгову компанію, її місцезнаходження та контактні дані.",
    noContactInformation:
      "Контактна інформація цієї компанії поки що не вказана.",
    companyLocation: "Місцезнаходження",
    claimCompany: "Це ваша компанія?",
claimCompanyText:
  "Підтвердьте право представляти компанію та отримайте доступ до керування профілем.",
claimCompanyButton: "Підтвердити право на компанію",
claimPending: "Заявка на перевірці",
claimPendingText:
  "Ви вже подали заявку. Ми перевіряємо надану інформацію.",
manageCompany: "Керувати компанією",
ownedCompany: "Ви керуєте цією компанією",
ownedCompanyText:
  "Профіль компанії прив’язано до вашого облікового запису.",
  },
  ru: {
    verified: "Проверенная компания",
    cleaningCompany: "Клининговая компания",
    about: "О компании",
    contactInformation: "Контактная информация",
    phone: "Телефон",
    email: "Email",
    website: "Веб-сайт",
    visitWebsite: "Посетить веб-сайт",
    callCompany: "Позвонить",
    sendEmail: "Отправить email",
    findJobs: "Найти работу по уборке",
    relatedCompanies: "Похожие компании",
    relatedCompaniesText:
      "Посмотрите другие клининговые компании, доступные на Clean Jobs.",
    viewCompany: "Посмотреть компанию",
    backToCompanies: "Все компании",
    fallbackDescription:
      "Посмотрите информацию об этой клининговой компании, её местоположении и контактных данных.",
    noContactInformation:
      "Контактная информация этой компании пока не указана.",
    companyLocation: "Местоположение",
    claimCompany: "Это ваша компания?",
claimCompanyText:
  "Подтвердите право представлять компанию и получите доступ к управлению профилем.",
claimCompanyButton: "Подтвердить право на компанию",
claimPending: "Заявка на проверке",
claimPendingText:
  "Вы уже отправили заявку. Мы проверяем предоставленную информацию.",
manageCompany: "Управлять компанией",
ownedCompany: "Вы управляете этой компанией",
ownedCompanyText:
  "Профиль компании привязан к вашей учетной записи.",
  },
  en: {
    verified: "Verified company",
    cleaningCompany: "Cleaning company",
    about: "About the company",
    contactInformation: "Contact information",
    phone: "Phone",
    email: "Email",
    website: "Website",
    visitWebsite: "Visit website",
    callCompany: "Call company",
    sendEmail: "Send email",
    findJobs: "Find cleaning jobs",
    relatedCompanies: "Related companies",
    relatedCompaniesText:
      "Explore other cleaning companies available on Clean Jobs.",
    viewCompany: "View company",
    backToCompanies: "All companies",
    fallbackDescription:
      "View information about this cleaning company, its location and contact details.",
    noContactInformation:
      "Contact information for this company has not been added yet.",
    companyLocation: "Location",
    claimCompany: "Is this your company?",
claimCompanyText:
  "Verify that you represent this company and get access to manage its profile.",
claimCompanyButton: "Claim this company",
claimPending: "Claim under review",
claimPendingText:
  "You have already submitted a request. We are reviewing the information.",
manageCompany: "Manage company",
ownedCompany: "You manage this company",
ownedCompanyText:
  "This company profile is connected to your account.",
  },
  sv: {
    verified: "Verifierat företag",
    cleaningCompany: "Städföretag",
    about: "Om företaget",
    contactInformation: "Kontaktinformation",
    phone: "Telefon",
    email: "E-post",
    website: "Webbplats",
    visitWebsite: "Besök webbplatsen",
    callCompany: "Ring företaget",
    sendEmail: "Skicka e-post",
    findJobs: "Hitta städjobb",
    relatedCompanies: "Liknande företag",
    relatedCompaniesText:
      "Utforska andra städföretag som finns på Clean Jobs.",
    viewCompany: "Visa företag",
    backToCompanies: "Alla företag",
    fallbackDescription:
      "Se information om detta städföretag, dess plats och kontaktuppgifter.",
    noContactInformation:
      "Kontaktinformation för detta företag har ännu inte lagts till.",
    companyLocation: "Plats",
    claimCompany: "Är detta ditt företag?",
claimCompanyText:
  "Verifiera att du representerar företaget och få tillgång till att hantera profilen.",
claimCompanyButton: "Gör anspråk på företaget",
claimPending: "Begäran granskas",
claimPendingText:
  "Du har redan skickat en begäran. Vi granskar uppgifterna.",
manageCompany: "Hantera företaget",
ownedCompany: "Du hanterar detta företag",
ownedCompanyText:
  "Företagsprofilen är kopplad till ditt konto.",
  },
  pl: {
    verified: "Zweryfikowana firma",
    cleaningCompany: "Firma sprzątająca",
    about: "O firmie",
    contactInformation: "Dane kontaktowe",
    phone: "Telefon",
    email: "Email",
    website: "Strona internetowa",
    visitWebsite: "Odwiedź stronę",
    callCompany: "Zadzwoń",
    sendEmail: "Wyślij email",
    findJobs: "Znajdź pracę w sprzątaniu",
    relatedCompanies: "Podobne firmy",
    relatedCompaniesText:
      "Zobacz inne firmy sprzątające dostępne w Clean Jobs.",
    viewCompany: "Zobacz firmę",
    backToCompanies: "Wszystkie firmy",
    fallbackDescription:
      "Zobacz informacje o tej firmie sprzątającej, jej lokalizacji i danych kontaktowych.",
    noContactInformation:
      "Dane kontaktowe tej firmy nie zostały jeszcze dodane.",
    companyLocation: "Lokalizacja",
    claimCompany: "Czy to Twoja firma?",
claimCompanyText:
  "Potwierdź, że reprezentujesz firmę, i uzyskaj dostęp do zarządzania profilem.",
claimCompanyButton: "Przejmij profil firmy",
claimPending: "Zgłoszenie jest sprawdzane",
claimPendingText:
  "Zgłoszenie zostało już wysłane. Sprawdzamy podane informacje.",
manageCompany: "Zarządzaj firmą",
ownedCompany: "Zarządzasz tą firmą",
ownedCompanyText:
  "Profil firmy jest połączony z Twoim kontem.",
  },
}

function normalizeWebsiteUrl(website: string) {
  if (/^https?:\/\//i.test(website)) {
    return website
  }

  return `https://${website}`
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

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <path
        d="M12 21s7-5.35 7-12a7 7 0 1 0-14 0c0 6.65 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="9"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <path
        d="M8.2 3.5 10 7.8a1.5 1.5 0 0 1-.35 1.65l-1.4 1.4a14.4 14.4 0 0 0 4.9 4.9l1.4-1.4A1.5 1.5 0 0 1 16.2 14l4.3 1.8a1.5 1.5 0 0 1 .9 1.55V20a2 2 0 0 1-2 2C9.8 22 2 14.2 2 4.6a2 2 0 0 1 2-2h2.65a1.5 1.5 0 0 1 1.55.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.5 12h17M12 3c2.3 2.45 3.5 5.45 3.5 9S14.3 18.55 12 21M12 3C9.7 5.45 8.5 8.45 8.5 12S9.7 18.55 12 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path
        d="m10 1.8 2 1.35 2.4-.15.8 2.25 2 1.3-.65 2.3.65 2.3-2 1.3-.8 2.25-2.4-.15L10 18.2l-2-1.35-2.4.15-.8-2.25-2-1.3.65-2.3-.65-2.3 2-1.3.8-2.25 2.4.15L10 1.8Z"
        fill="currentColor"
      />
      <path
        d="m6.8 10 2 2 4.4-4.4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CompanyLogo({
  company,
  size = "large",
}: {
  company: Company
  size?: "large" | "small"
}) {
  const sizeClass =
    size === "large"
      ? "h-24 w-24 rounded-3xl text-4xl md:h-28 md:w-28"
      : "h-14 w-14 rounded-2xl text-xl"

  if (company.logo_url) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white shadow-sm ${sizeClass}`}
      >
        <img
          src={company.logo_url}
          alt={`${company.name} logo`}
          className="h-full w-full object-contain p-3"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br from-rose-500 to-rose-700 font-bold text-white shadow-sm ${sizeClass}`}
    >
      {getCompanyInitial(company.name)}
    </div>
  )
}

async function getCompany(slug: string) {
  const supabase = await createClient()
  

  const { data } = await supabase
    .from("companies")
    .select(
  "id, name, slug, city, website, phone, email, description, logo_url, verified, owner_id",
)
    .eq("slug", slug)
    .maybeSingle()

  return data as Company | null
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const company = await getCompany(slug)

  if (!company) {
    return {
      title: "Company Not Found | Clean Jobs",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const city = company.city || "Sweden"
  const canonicalPath = `/companies/${company.slug}`

  return {
    title: `${company.name} | Cleaning Company in ${city} | Clean Jobs`,
    description:
      company.description ||
      `Find information and contact details for ${company.name}, a cleaning company in ${city}.`,
    alternates: {
      canonical: `https://cleansjob.com${canonicalPath}`,
      languages: getLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title: `${company.name} | Clean Jobs`,
      description:
        company.description ||
        `Cleaning services and company information for ${company.name}.`,
      url: `https://cleansjob.com${canonicalPath}`,
      type: "website",
    },
  }
}

export default async function CompanyPage({ params }: PageProps) {
  const { slug } = await params

  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  )
  const t = copy[locale]

  const company = await getCompany(slug)

  if (!company) {
    notFound()
  }

  const supabase = await createClient()
const {
  data: { user },
} = await supabase.auth.getUser()

let pendingClaim: {
  id: string
  status: string
} | null = null

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

const isCompanyOwner = Boolean(
  user && company.owner_id === user.id,
)
  let relatedQuery = supabase
    .from("companies")
    .select(
  "id, name, slug, city, website, phone, email, description, logo_url, verified, owner_id",
)
    .neq("id", company.id)
    .order("verified", { ascending: false })
    .order("name", { ascending: true })
    .limit(3)

  if (company.city) {
    relatedQuery = relatedQuery.eq("city", company.city)
  }

  const { data: relatedData } = await relatedQuery

  let relatedCompanies = (relatedData ?? []) as Company[]

  if (relatedCompanies.length < 3) {
    const existingIds = [company.id, ...relatedCompanies.map((item) => item.id)]

    const { data: fallbackData } = await supabase
      .from("companies")
      .select(
  "id, name, slug, city, website, phone, email, description, logo_url, verified, owner_id",
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.description || t.fallbackDescription,
    url: websiteUrl || `https://cleansjob.com/companies/${company.slug}`,
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.email ? { email: company.email } : {}),
    ...(company.logo_url ? { logo: company.logo_url } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city || "Sweden",
      addressCountry: "SE",
    },
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        >
          <Link
            href="/companies"
            prefetch={false}
            className="transition hover:text-rose-600"
          >
            {t.backToCompanies}
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-slate-900">{company.name}</span>
        </nav>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400" />

          <div className="p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <CompanyLogo company={company} />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-rose-600">
                    {t.cleaningCompany}
                  </p>

                  {company.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <VerifiedIcon />
                      {t.verified}
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-3 break-words text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                  {company.name}
                </h1>

                <div className="mt-4 flex items-center gap-2 text-base text-slate-600">
                  <LocationIcon />
                  <span>{company.city || "Sweden"}</span>
                </div>

                <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                  {company.description || t.fallbackDescription}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {websiteUrl ? (
                    <a
                      href={websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
                    >
                      <GlobeIcon />
                      {t.visitWebsite}
                    </a>
                  ) : null}

                  {company.phone ? (
                    <a
                      href={`tel:${company.phone.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      <PhoneIcon />
                      {t.callCompany}
                    </a>
                  ) : null}

                  {company.email ? (
                    <a
                      href={`mailto:${company.email}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      <EmailIcon />
                      {t.sendEmail}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-bold text-slate-950">{t.about}</h2>

            <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
              {company.description || t.fallbackDescription}
            </p>

            <div className="mt-8 rounded-3xl bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm ring-1 ring-slate-200">
                  <LocationIcon />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {t.companyLocation}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {company.city || "Sweden"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-slate-950">
              {t.contactInformation}
            </h2>

            {hasContactInformation ? (
              <div className="mt-6 space-y-5">
                {company.phone ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">
                      <PhoneIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.phone}
                      </p>

                      <a
                        href={`tel:${company.phone.replace(/\s+/g, "")}`}
                        className="mt-1 block break-words text-sm font-medium text-slate-900 transition hover:text-rose-600"
                      >
                        {company.phone}
                      </a>
                    </div>
                  </div>
                ) : null}

                {company.email ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">
                      <EmailIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.email}
                      </p>

                      <a
                        href={`mailto:${company.email}`}
                        className="mt-1 block break-all text-sm font-medium text-slate-900 transition hover:text-rose-600"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                ) : null}

                {websiteUrl && company.website ? (
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-slate-400">
                      <GlobeIcon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {t.website}
                      </p>

                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block break-all text-sm font-medium text-slate-900 transition hover:text-rose-600"
                      >
                        {getWebsiteLabel(company.website)}
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-slate-500">
                {t.noContactInformation}
              </p>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6">
  {isCompanyOwner ? (
    <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
        ✓
      </div>

      <h3 className="mt-4 text-base font-bold text-emerald-950">
        {t.ownedCompany}
      </h3>

      <p className="mt-2 text-sm leading-6 text-emerald-800">
        {t.ownedCompanyText}
      </p>

      <Link
        href={`/dashboard/companies/${company.id}/edit`}
        prefetch={false}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-emerald-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        {t.manageCompany}
      </Link>
    </div>
  ) : pendingClaim ? (
    <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-lg font-bold text-amber-700">
        …
      </div>

      <h3 className="mt-4 text-base font-bold text-amber-950">
        {t.claimPending}
      </h3>

      <p className="mt-2 text-sm leading-6 text-amber-800">
        {t.claimPendingText}
      </p>

      <Link
        href="/dashboard/company-claims"
        prefetch={false}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-amber-300 bg-white px-4 py-2.5 text-center text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
      >
        {t.claimPending}
      </Link>
    </div>
  ) : !company.owner_id ? (
    <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-lg font-bold text-rose-700">
        ?
      </div>

      <h3 className="mt-4 text-base font-bold text-rose-950">
        {t.claimCompany}
      </h3>

      <p className="mt-2 text-sm leading-6 text-rose-800">
        {t.claimCompanyText}
      </p>

      <Link
        href={`/companies/${company.slug}/claim`}
        prefetch={false}
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-rose-700"
      >
        {t.claimCompanyButton}
      </Link>
    </div>
  ) : null}

  <Link
    href="/jobs"
    prefetch={false}
    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
  >
    {t.findJobs}
  </Link>
</div>
          </aside>
        </div>

        {relatedCompanies.length > 0 ? (
          <section className="mt-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-950">
                {t.relatedCompanies}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {t.relatedCompaniesText}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedCompanies.map((related) => (
                <Link
                  key={related.id}
                  href={`/companies/${related.slug}`}
                  prefetch={false}
                  className="group flex min-w-0 items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                >
                  <CompanyLogo company={related} size="small" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="min-w-0 flex-1 truncate font-bold text-slate-950">
                        {related.name}
                      </h3>

                      {related.verified ? (
                        <span className="shrink-0 text-emerald-600">
                          <VerifiedIcon />
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                      <LocationIcon />
                      <span className="truncate">
                        {related.city || "Sweden"}
                      </span>
                    </p>

                    <p className="mt-3 text-sm font-semibold text-rose-600">
                      {t.viewCompany}{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}