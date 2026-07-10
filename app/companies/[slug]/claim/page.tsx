import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { CompanyClaimForm } from "@/components/companies/company-claim-form"
import { createClient } from "@/lib/supabase-server"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type PageProps = {
  params: Promise<{
    slug: string
  }>

  searchParams: Promise<{
    submitted?: string
  }>
}

type Dictionary = {
  metadataTitle: string
  metadataDescription: string
  eyebrow: string
  title: string
  description: string
  signInTitle: string
  signInDescription: string
  signInButton: string
  backToCompany: string
  alreadyClaimedTitle: string
  alreadyClaimedDescription: string
  pendingTitle: string
  pendingDescription: string
  submittedTitle: string
  submittedDescription: string
  reviewTitle: string
  reviewItems: string[]
}

const supportedLocales: Locale[] = ["sv", "en", "uk", "ru", "pl"]

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    metadataTitle: "Gör anspråk på företag",
    metadataDescription:
      "Skicka en begäran om att hantera ett företag på Clean Jobs.",
    eyebrow: "Företagsverifiering",
    title: "Gör anspråk på {company}",
    description:
      "Skicka dina företagsuppgifter så granskar vi att du har rätt att representera företaget.",
    signInTitle: "Logga in för att fortsätta",
    signInDescription:
      "Du behöver ett Clean Jobs-konto för att skicka en begäran.",
    signInButton: "Logga in",
    backToCompany: "Tillbaka till företaget",
    alreadyClaimedTitle: "Företaget har redan en ägare",
    alreadyClaimedDescription:
      "Det här företaget har redan kopplats till ett användarkonto.",
    pendingTitle: "Du har redan skickat en begäran",
    pendingDescription:
      "Din begäran granskas. Du behöver inte skicka en ny.",
    submittedTitle: "Begäran har skickats",
    submittedDescription:
      "Vi granskar uppgifterna innan företaget kopplas till ditt konto.",
    reviewTitle: "Så fungerar granskningen",
    reviewItems: [
      "Vi kontrollerar dina kontaktuppgifter.",
      "Vi verifierar din koppling till företaget.",
      "Du får tillgång när begäran har godkänts.",
    ],
  },

  en: {
    metadataTitle: "Claim company",
    metadataDescription:
      "Submit a request to manage a company on Clean Jobs.",
    eyebrow: "Company verification",
    title: "Claim {company}",
    description:
      "Submit your business details and we will verify that you are authorised to represent the company.",
    signInTitle: "Sign in to continue",
    signInDescription:
      "You need a Clean Jobs account to submit a claim request.",
    signInButton: "Sign in",
    backToCompany: "Back to company",
    alreadyClaimedTitle: "This company is already claimed",
    alreadyClaimedDescription:
      "The company has already been connected to a user account.",
    pendingTitle: "You already have a pending request",
    pendingDescription:
      "Your request is being reviewed. You do not need to submit another one.",
    submittedTitle: "Request submitted",
    submittedDescription:
      "We will verify the information before connecting the company to your account.",
    reviewTitle: "How verification works",
    reviewItems: [
      "We check the submitted contact information.",
      "We verify your connection to the company.",
      "Access is granted after approval.",
    ],
  },

  uk: {
    metadataTitle: "Підтвердити право на компанію",
    metadataDescription:
      "Надішліть заявку на керування компанією у Clean Jobs.",
    eyebrow: "Перевірка компанії",
    title: "Підтвердити право на {company}",
    description:
      "Надішліть робочі контактні дані, і ми перевіримо ваше право представляти компанію.",
    signInTitle: "Увійдіть, щоб продовжити",
    signInDescription:
      "Для подання заявки потрібен обліковий запис Clean Jobs.",
    signInButton: "Увійти",
    backToCompany: "Назад до компанії",
    alreadyClaimedTitle: "Компанія вже має власника",
    alreadyClaimedDescription:
      "Цю компанію вже прив’язано до облікового запису.",
    pendingTitle: "Ви вже подали заявку",
    pendingDescription:
      "Заявка перебуває на перевірці. Надсилати нову не потрібно.",
    submittedTitle: "Заявку надіслано",
    submittedDescription:
      "Ми перевіримо інформацію перед прив’язкою компанії до вашого облікового запису.",
    reviewTitle: "Як відбувається перевірка",
    reviewItems: [
      "Ми перевіряємо надані контактні дані.",
      "Ми підтверджуємо ваш зв’язок із компанією.",
      "Після схвалення ви отримаєте доступ.",
    ],
  },

  ru: {
    metadataTitle: "Подтвердить право на компанию",
    metadataDescription:
      "Отправьте заявку на управление компанией в Clean Jobs.",
    eyebrow: "Проверка компании",
    title: "Подтвердить право на {company}",
    description:
      "Отправьте рабочие контактные данные, и мы проверим ваше право представлять компанию.",
    signInTitle: "Войдите, чтобы продолжить",
    signInDescription:
      "Для отправки заявки нужна учетная запись Clean Jobs.",
    signInButton: "Войти",
    backToCompany: "Назад к компании",
    alreadyClaimedTitle: "У компании уже есть владелец",
    alreadyClaimedDescription:
      "Эта компания уже привязана к учетной записи.",
    pendingTitle: "Вы уже отправили заявку",
    pendingDescription:
      "Заявка находится на проверке. Отправлять новую не нужно.",
    submittedTitle: "Заявка отправлена",
    submittedDescription:
      "Мы проверим информацию перед привязкой компании к вашей учетной записи.",
    reviewTitle: "Как проходит проверка",
    reviewItems: [
      "Мы проверяем предоставленные контакты.",
      "Мы подтверждаем вашу связь с компанией.",
      "После одобрения вы получите доступ.",
    ],
  },

  pl: {
    metadataTitle: "Przejmij profil firmy",
    metadataDescription:
      "Wyślij zgłoszenie dotyczące zarządzania firmą w Clean Jobs.",
    eyebrow: "Weryfikacja firmy",
    title: "Przejmij profil {company}",
    description:
      "Prześlij dane firmowe, a my sprawdzimy, czy masz prawo reprezentować firmę.",
    signInTitle: "Zaloguj się, aby kontynuować",
    signInDescription:
      "Do wysłania zgłoszenia potrzebne jest konto Clean Jobs.",
    signInButton: "Zaloguj się",
    backToCompany: "Wróć do firmy",
    alreadyClaimedTitle: "Firma ma już właściciela profilu",
    alreadyClaimedDescription:
      "Ta firma została już połączona z kontem użytkownika.",
    pendingTitle: "Masz już oczekujące zgłoszenie",
    pendingDescription:
      "Zgłoszenie jest sprawdzane. Nie musisz wysyłać kolejnego.",
    submittedTitle: "Zgłoszenie zostało wysłane",
    submittedDescription:
      "Sprawdzimy dane przed połączeniem firmy z Twoim kontem.",
    reviewTitle: "Jak działa weryfikacja",
    reviewItems: [
      "Sprawdzamy przesłane dane kontaktowe.",
      "Potwierdzamy Twój związek z firmą.",
      "Dostęp zostaje przyznany po zatwierdzeniu.",
    ],
  },
}

function isSupportedLocale(
  value: string | undefined,
): value is Locale {
  return supportedLocales.includes(value as Locale)
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeValue =
    cookieStore.get("clean_jobs_locale")?.value

  return isSupportedLocale(localeValue) ? localeValue : "sv"
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  const supabase = await createClient()

  const { data: company } = await supabase
    .from("companies")
    .select("name")
    .eq("slug", slug)
    .maybeSingle()

  const companyName = company?.name ?? "company"

  return {
    title: `${dictionary.metadataTitle} — ${companyName} | Clean Jobs`,
    description: dictionary.metadataDescription,
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function CompanyClaimPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params
  const { submitted } = await searchParams

  const locale = await getLocale()
  const dictionary = dictionaries[locale]

  const supabase = await createClient()

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("id, name, slug, city, logo_url, owner_id")
    .eq("slug", slug)
    .maybeSingle()

  if (companyError || !company) {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let pendingClaim = null

  if (user) {
    const { data } = await supabase
      .from("company_claim_requests")
      .select("id, status, created_at")
      .eq("company_id", company.id)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .maybeSingle()

    pendingClaim = data
  }

  const pageTitle = dictionary.title.replace(
    "{company}",
    company.name,
  )

  const isSubmitted = submitted === "true"

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href={`/companies/${company.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-emerald-700"
          >
            <span aria-hidden="true">←</span>
            {dictionary.backToCompany}
          </Link>

          <div className="mt-8 flex items-start gap-5">
            {company.logo_url ? (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <img
                  src={company.logo_url}
                  alt={`${company.name} logo`}
                  className="h-full w-full object-contain p-3"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-black text-white shadow-sm">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
                {dictionary.eyebrow}
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle}
              </h1>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                {dictionary.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {company.owner_id ? (
            <StatusMessage
              title={dictionary.alreadyClaimedTitle}
              description={dictionary.alreadyClaimedDescription}
            />
          ) : isSubmitted || pendingClaim ? (
            <StatusMessage
              title={
                isSubmitted
                  ? dictionary.submittedTitle
                  : dictionary.pendingTitle
              }
              description={
                isSubmitted
                  ? dictionary.submittedDescription
                  : dictionary.pendingDescription
              }
              success
            />
          ) : !user ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🔒
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                {dictionary.signInTitle}
              </h2>

              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
                {dictionary.signInDescription}
              </p>

              <Link
                href={`/login?next=/companies/${company.slug}/claim`}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                {dictionary.signInButton}
              </Link>
            </div>
          ) : (
            <CompanyClaimForm
              companyId={company.id}
              companySlug={company.slug}
              companyName={company.name}
              locale={locale}
              defaultEmail={user.email ?? ""}
            />
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">
            {dictionary.reviewTitle}
          </h2>

          <ol className="mt-5 space-y-5">
            {dictionary.reviewItems.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                  {index + 1}
                </span>

                <span className="pt-0.5 text-sm leading-6 text-slate-600">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  )
}

function StatusMessage({
  title,
  description,
  success = false,
}: {
  title: string
  description: string
  success?: boolean
}) {
  return (
    <div className="py-8 text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-2xl ${
          success
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-100 text-slate-700"
        }`}
      >
        {success ? "✓" : "i"}
      </div>

      <h2 className="mt-5 text-2xl font-black text-slate-950">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
        {description}
      </p>
    </div>
  )
}