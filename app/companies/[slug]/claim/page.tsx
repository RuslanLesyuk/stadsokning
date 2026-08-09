import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { CompanyClaimForm } from "@/components/companies/company-claim-form"
import { createClient } from "@/lib/supabase-server"
import { cancelCompanyClaimAction } from "./actions"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"
type ClaimStatus = "pending" | "needs_info" | "approved" | "rejected" | "cancelled"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ submitted?: string }>
}

type ClaimRow = {
  id: string
  status: ClaimStatus
  business_email: string | null
  business_phone: string | null
  message: string | null
  admin_note: string | null
  evidence_paths: string[] | null
  created_at: string
  updated_at: string
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
  yourCompanyTitle: string
  yourCompanyDescription: string
  manageCompany: string
  pendingTitle: string
  pendingDescription: string
  needsInfoTitle: string
  needsInfoDescription: string
  adminRequest: string
  rejectedTitle: string
  rejectedDescription: string
  cancelledTitle: string
  cancelledDescription: string
  tryAgain: string
  submittedTitle: string
  submittedDescription: string
  reviewTitle: string
  reviewItems: string[]
  cancel: string
  cancelHelp: string
  status: Record<ClaimStatus, string>
}

const supportedLocales: Locale[] = ["sv", "en", "uk", "ru", "pl"]

const dictionaries: Record<Locale, Dictionary> = {
  sv: {
    metadataTitle: "Gör anspråk på företag",
    metadataDescription: "Skicka en begäran om att hantera ett företag på Clean Jobs.",
    eyebrow: "Företagsverifiering",
    title: "Gör anspråk på {company}",
    description:
      "Skicka dina företagsuppgifter och verifieringsunderlag så granskar vi att du har rätt att representera företaget.",
    signInTitle: "Logga in för att fortsätta",
    signInDescription: "Du behöver ett Clean Jobs-konto för att skicka en begäran.",
    signInButton: "Logga in",
    backToCompany: "Tillbaka till företaget",
    alreadyClaimedTitle: "Företaget har redan en ägare",
    alreadyClaimedDescription: "Det här företaget har redan kopplats till ett annat användarkonto.",
    yourCompanyTitle: "Du hanterar redan företaget",
    yourCompanyDescription: "Företaget är kopplat till ditt konto och kan redigeras från företagspanelen.",
    manageCompany: "Hantera företaget",
    pendingTitle: "Begäran granskas",
    pendingDescription: "Din begäran väntar på granskning. Du behöver inte skicka en ny.",
    needsInfoTitle: "Vi behöver mer information",
    needsInfoDescription:
      "Komplettera uppgifterna nedan och skicka in begäran igen. Den återgår då till granskningskön.",
    adminRequest: "Meddelande från granskningen",
    rejectedTitle: "Begäran avslogs",
    rejectedDescription: "Du kan skicka en ny begäran om du kan lämna bättre verifieringsunderlag.",
    cancelledTitle: "Begäran återkallades",
    cancelledDescription: "Du kan skicka en ny begäran när du vill.",
    tryAgain: "Skicka en ny begäran",
    submittedTitle: "Begäran har skickats",
    submittedDescription: "Vi granskar uppgifterna innan företaget kopplas till ditt konto.",
    reviewTitle: "Så fungerar granskningen",
    reviewItems: [
      "Vi kontrollerar kontaktuppgifterna och företagets domän.",
      "Vi granskar eventuella verifieringsdokument.",
      "Du får en avisering och e-post när beslutet är klart.",
    ],
    cancel: "Återkalla begäran",
    cancelHelp: "Använd detta om du skickade begäran av misstag eller inte längre vill fortsätta.",
    status: {
      pending: "Väntar på granskning",
      needs_info: "Behöver kompletteras",
      approved: "Godkänd",
      rejected: "Avslagen",
      cancelled: "Återkallad",
    },
  },
  en: {
    metadataTitle: "Claim company",
    metadataDescription: "Submit a request to manage a company on Clean Jobs.",
    eyebrow: "Company verification",
    title: "Claim {company}",
    description:
      "Submit your business details and verification evidence so we can confirm that you are authorised to represent the company.",
    signInTitle: "Sign in to continue",
    signInDescription: "You need a Clean Jobs account to submit a claim request.",
    signInButton: "Sign in",
    backToCompany: "Back to company",
    alreadyClaimedTitle: "This company is already claimed",
    alreadyClaimedDescription: "The company has already been connected to another user account.",
    yourCompanyTitle: "You already manage this company",
    yourCompanyDescription: "The company is connected to your account and can be edited from the company dashboard.",
    manageCompany: "Manage company",
    pendingTitle: "Your request is being reviewed",
    pendingDescription: "Your claim is waiting for review. You do not need to submit another one.",
    needsInfoTitle: "We need more information",
    needsInfoDescription:
      "Update the details below and resubmit the claim. It will return to the review queue.",
    adminRequest: "Message from the review",
    rejectedTitle: "Claim rejected",
    rejectedDescription: "You can submit a new claim if you can provide stronger verification evidence.",
    cancelledTitle: "Claim cancelled",
    cancelledDescription: "You can submit a new claim whenever you are ready.",
    tryAgain: "Submit a new claim",
    submittedTitle: "Request submitted",
    submittedDescription: "We will verify the information before connecting the company to your account.",
    reviewTitle: "How verification works",
    reviewItems: [
      "We check the contact details and company domain.",
      "We review any verification documents you attach.",
      "You receive a notification and email when a decision is made.",
    ],
    cancel: "Cancel claim",
    cancelHelp: "Use this if the claim was submitted by mistake or you no longer want to continue.",
    status: {
      pending: "Pending review",
      needs_info: "Needs more information",
      approved: "Approved",
      rejected: "Rejected",
      cancelled: "Cancelled",
    },
  },
  uk: {
    metadataTitle: "Підтвердити право на компанію",
    metadataDescription: "Надішліть заявку на керування компанією у Clean Jobs.",
    eyebrow: "Перевірка компанії",
    title: "Підтвердити право на {company}",
    description:
      "Надішліть робочі контактні дані та підтвердження, і ми перевіримо ваше право представляти компанію.",
    signInTitle: "Увійдіть, щоб продовжити",
    signInDescription: "Для подання заявки потрібен обліковий запис Clean Jobs.",
    signInButton: "Увійти",
    backToCompany: "Назад до компанії",
    alreadyClaimedTitle: "Компанія вже має власника",
    alreadyClaimedDescription: "Цю компанію вже прив’язано до іншого облікового запису.",
    yourCompanyTitle: "Ви вже керуєте цією компанією",
    yourCompanyDescription: "Компанію прив’язано до вашого акаунта, і її можна редагувати в кабінеті.",
    manageCompany: "Керувати компанією",
    pendingTitle: "Заявка перевіряється",
    pendingDescription: "Заявка очікує перевірки. Надсилати нову не потрібно.",
    needsInfoTitle: "Потрібна додаткова інформація",
    needsInfoDescription:
      "Доповніть дані нижче та надішліть заявку повторно. Вона знову потрапить у чергу перевірки.",
    adminRequest: "Повідомлення від перевірки",
    rejectedTitle: "Заявку відхилено",
    rejectedDescription: "Ви можете подати нову заявку, якщо маєте кращі докази зв’язку з компанією.",
    cancelledTitle: "Заявку відкликано",
    cancelledDescription: "Ви можете подати нову заявку, коли будете готові.",
    tryAgain: "Подати нову заявку",
    submittedTitle: "Заявку надіслано",
    submittedDescription: "Ми перевіримо інформацію перед прив’язкою компанії до вашого облікового запису.",
    reviewTitle: "Як відбувається перевірка",
    reviewItems: [
      "Ми перевіряємо контактні дані та домен компанії.",
      "Ми переглядаємо додані документи для підтвердження.",
      "Після рішення ви отримаєте сповіщення та email.",
    ],
    cancel: "Відкликати заявку",
    cancelHelp: "Скористайтеся цим, якщо заявку подано помилково або ви більше не хочете продовжувати.",
    status: {
      pending: "Очікує перевірки",
      needs_info: "Потрібне доповнення",
      approved: "Схвалено",
      rejected: "Відхилено",
      cancelled: "Відкликано",
    },
  },
  ru: {
    metadataTitle: "Подтвердить право на компанию",
    metadataDescription: "Отправьте заявку на управление компанией в Clean Jobs.",
    eyebrow: "Проверка компании",
    title: "Подтвердить право на {company}",
    description:
      "Отправьте рабочие контактные данные и подтверждения, и мы проверим ваше право представлять компанию.",
    signInTitle: "Войдите, чтобы продолжить",
    signInDescription: "Для отправки заявки нужна учетная запись Clean Jobs.",
    signInButton: "Войти",
    backToCompany: "Назад к компании",
    alreadyClaimedTitle: "У компании уже есть владелец",
    alreadyClaimedDescription: "Эта компания уже привязана к другой учетной записи.",
    yourCompanyTitle: "Вы уже управляете этой компанией",
    yourCompanyDescription: "Компания привязана к вашему аккаунту и доступна для редактирования в кабинете.",
    manageCompany: "Управлять компанией",
    pendingTitle: "Заявка проверяется",
    pendingDescription: "Заявка ожидает проверки. Отправлять новую не нужно.",
    needsInfoTitle: "Нужна дополнительная информация",
    needsInfoDescription:
      "Дополните данные ниже и отправьте заявку повторно. Она снова попадет в очередь проверки.",
    adminRequest: "Сообщение от проверки",
    rejectedTitle: "Заявка отклонена",
    rejectedDescription: "Вы можете подать новую заявку, если у вас есть более убедительные подтверждения.",
    cancelledTitle: "Заявка отозвана",
    cancelledDescription: "Вы можете подать новую заявку, когда будете готовы.",
    tryAgain: "Подать новую заявку",
    submittedTitle: "Заявка отправлена",
    submittedDescription: "Мы проверим информацию перед привязкой компании к вашей учетной записи.",
    reviewTitle: "Как проходит проверка",
    reviewItems: [
      "Мы проверяем контактные данные и домен компании.",
      "Мы проверяем приложенные документы.",
      "После решения вы получите уведомление и email.",
    ],
    cancel: "Отозвать заявку",
    cancelHelp: "Используйте это, если заявка была отправлена по ошибке или вы больше не хотите продолжать.",
    status: {
      pending: "Ожидает проверки",
      needs_info: "Нужно дополнение",
      approved: "Одобрено",
      rejected: "Отклонено",
      cancelled: "Отозвано",
    },
  },
  pl: {
    metadataTitle: "Przejmij profil firmy",
    metadataDescription: "Wyślij zgłoszenie dotyczące zarządzania firmą w Clean Jobs.",
    eyebrow: "Weryfikacja firmy",
    title: "Przejmij profil {company}",
    description:
      "Prześlij dane firmowe i dokumenty weryfikacyjne, a sprawdzimy, czy masz prawo reprezentować firmę.",
    signInTitle: "Zaloguj się, aby kontynuować",
    signInDescription: "Do wysłania zgłoszenia potrzebne jest konto Clean Jobs.",
    signInButton: "Zaloguj się",
    backToCompany: "Wróć do firmy",
    alreadyClaimedTitle: "Firma ma już właściciela profilu",
    alreadyClaimedDescription: "Ta firma została już połączona z innym kontem użytkownika.",
    yourCompanyTitle: "Już zarządzasz tą firmą",
    yourCompanyDescription: "Firma jest połączona z Twoim kontem i można ją edytować z panelu firmy.",
    manageCompany: "Zarządzaj firmą",
    pendingTitle: "Zgłoszenie jest sprawdzane",
    pendingDescription: "Zgłoszenie oczekuje na weryfikację. Nie musisz wysyłać kolejnego.",
    needsInfoTitle: "Potrzebujemy dodatkowych informacji",
    needsInfoDescription:
      "Uzupełnij dane poniżej i wyślij zgłoszenie ponownie. Wróci ono do kolejki weryfikacji.",
    adminRequest: "Wiadomość z weryfikacji",
    rejectedTitle: "Zgłoszenie odrzucone",
    rejectedDescription: "Możesz wysłać nowe zgłoszenie, jeśli masz lepsze dokumenty potwierdzające.",
    cancelledTitle: "Zgłoszenie anulowane",
    cancelledDescription: "Możesz wysłać nowe zgłoszenie, kiedy będziesz gotowy.",
    tryAgain: "Wyślij nowe zgłoszenie",
    submittedTitle: "Zgłoszenie zostało wysłane",
    submittedDescription: "Sprawdzimy dane przed połączeniem firmy z Twoim kontem.",
    reviewTitle: "Jak działa weryfikacja",
    reviewItems: [
      "Sprawdzamy dane kontaktowe i domenę firmy.",
      "Weryfikujemy załączone dokumenty.",
      "Po decyzji otrzymasz powiadomienie i e-mail.",
    ],
    cancel: "Anuluj zgłoszenie",
    cancelHelp: "Użyj tej opcji, jeśli zgłoszenie zostało wysłane omyłkowo lub nie chcesz kontynuować.",
    status: {
      pending: "Oczekuje na weryfikację",
      needs_info: "Wymaga uzupełnienia",
      approved: "Zatwierdzone",
      rejected: "Odrzucone",
      cancelled: "Anulowane",
    },
  },
}

function isSupportedLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale)
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeValue = cookieStore.get("clean_jobs_locale")?.value
  return isSupportedLocale(localeValue) ? localeValue : "sv"
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const dictionary = dictionaries[locale]
  const supabase = await createClient()
  const { data: company } = await supabase.from("companies").select("name").eq("slug", slug).maybeSingle()
  const companyName = company?.name ?? "company"

  return {
    title: `${dictionary.metadataTitle} — ${companyName} | Clean Jobs`,
    description: dictionary.metadataDescription,
    robots: { index: false, follow: false },
  }
}

export default async function CompanyClaimPage({ params, searchParams }: PageProps) {
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

  if (companyError || !company) notFound()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let latestClaim: ClaimRow | null = null

  if (user) {
    const { data } = await supabase
      .from("company_claim_requests")
      .select(
        "id, status, business_email, business_phone, message, admin_note, evidence_paths, created_at, updated_at",
      )
      .eq("company_id", company.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    latestClaim = (data ?? null) as ClaimRow | null
  }

  const pageTitle = dictionary.title.replace("{company}", company.name)
  const isSubmitted = submitted === "true"
  const isOwnCompany = Boolean(user && company.owner_id === user.id)
  const claimedByOther = Boolean(company.owner_id && !isOwnCompany)
  const canCreateNewClaim =
    Boolean(user) &&
    !company.owner_id &&
    (!latestClaim || ["rejected", "cancelled"].includes(latestClaim.status))

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
                <img src={company.logo_url} alt={`${company.name} logo`} className="h-full w-full object-contain p-3" />
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-3xl font-black text-white shadow-sm">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">{dictionary.eyebrow}</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{pageTitle}</h1>
              <p className="mt-4 max-w-2xl leading-7 text-slate-600">{dictionary.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {isOwnCompany ? (
            <StatusMessage
              title={dictionary.yourCompanyTitle}
              description={dictionary.yourCompanyDescription}
              success
              action={
                <Link
                  href={`/dashboard/companies/${company.id}/edit`}
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                >
                  {dictionary.manageCompany}
                </Link>
              }
            />
          ) : claimedByOther ? (
            <StatusMessage title={dictionary.alreadyClaimedTitle} description={dictionary.alreadyClaimedDescription} />
          ) : !user ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">🔒</div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">{dictionary.signInTitle}</h2>
              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">{dictionary.signInDescription}</p>
              <Link
                href={`/login?next=/companies/${company.slug}/claim`}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                {dictionary.signInButton}
              </Link>
            </div>
          ) : latestClaim?.status === "needs_info" ? (
            <div>
              <StatusHeader
                statusLabel={dictionary.status.needs_info}
                title={dictionary.needsInfoTitle}
                description={dictionary.needsInfoDescription}
                tone="amber"
              />

              {latestClaim.admin_note ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-amber-700">{dictionary.adminRequest}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-950">{latestClaim.admin_note}</p>
                </div>
              ) : null}

              <div className="mt-7 border-t border-slate-200 pt-7">
                <CompanyClaimForm
                  companyId={company.id}
                  companySlug={company.slug}
                  companyName={company.name}
                  locale={locale}
                  defaultEmail={latestClaim.business_email || user.email || ""}
                  defaultPhone={latestClaim.business_phone || ""}
                  defaultMessage={latestClaim.message || ""}
                  claimId={latestClaim.id}
                  existingEvidenceCount={latestClaim.evidence_paths?.length ?? 0}
                  mode="resubmit"
                />
              </div>

              <CancelClaimForm
                claimId={latestClaim.id}
                companySlug={company.slug}
                locale={locale}
                label={dictionary.cancel}
                help={dictionary.cancelHelp}
              />
            </div>
          ) : latestClaim?.status === "pending" || isSubmitted ? (
            <div>
              <StatusMessage
                title={isSubmitted ? dictionary.submittedTitle : dictionary.pendingTitle}
                description={isSubmitted ? dictionary.submittedDescription : dictionary.pendingDescription}
                success
              />
              {latestClaim?.status === "pending" ? (
                <CancelClaimForm
                  claimId={latestClaim.id}
                  companySlug={company.slug}
                  locale={locale}
                  label={dictionary.cancel}
                  help={dictionary.cancelHelp}
                />
              ) : null}
            </div>
          ) : latestClaim?.status === "rejected" ? (
            <div>
              <StatusHeader
                statusLabel={dictionary.status.rejected}
                title={dictionary.rejectedTitle}
                description={dictionary.rejectedDescription}
                tone="red"
              />
              {latestClaim.admin_note ? (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-red-700">{dictionary.adminRequest}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-red-900">{latestClaim.admin_note}</p>
                </div>
              ) : null}
              {canCreateNewClaim ? (
                <div className="mt-7 border-t border-slate-200 pt-7">
                  <h3 className="mb-5 text-lg font-black text-slate-950">{dictionary.tryAgain}</h3>
                  <CompanyClaimForm
                    companyId={company.id}
                    companySlug={company.slug}
                    companyName={company.name}
                    locale={locale}
                    defaultEmail={user.email || latestClaim.business_email || ""}
                    defaultPhone={latestClaim.business_phone || ""}
                    defaultMessage=""
                  />
                </div>
              ) : null}
            </div>
          ) : latestClaim?.status === "cancelled" ? (
            <div>
              <StatusHeader
                statusLabel={dictionary.status.cancelled}
                title={dictionary.cancelledTitle}
                description={dictionary.cancelledDescription}
                tone="slate"
              />
              {canCreateNewClaim ? (
                <div className="mt-7 border-t border-slate-200 pt-7">
                  <h3 className="mb-5 text-lg font-black text-slate-950">{dictionary.tryAgain}</h3>
                  <CompanyClaimForm
                    companyId={company.id}
                    companySlug={company.slug}
                    companyName={company.name}
                    locale={locale}
                    defaultEmail={user.email || ""}
                  />
                </div>
              ) : null}
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
          <h2 className="text-lg font-black text-slate-950">{dictionary.reviewTitle}</h2>
          <ol className="mt-5 space-y-5">
            {dictionary.reviewItems.map((item, index) => (
              <li key={item} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800">
                  {index + 1}
                </span>
                <span className="pt-0.5 text-sm leading-6 text-slate-600">{item}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>
    </main>
  )
}

function CancelClaimForm({
  claimId,
  companySlug,
  locale,
  label,
  help,
}: {
  claimId: string
  companySlug: string
  locale: Locale
  label: string
  help: string
}) {
  return (
    <div className="mt-7 border-t border-slate-200 pt-6">
      <p className="text-sm leading-6 text-slate-500">{help}</p>
      <form action={cancelCompanyClaimAction} className="mt-3">
        <input type="hidden" name="claimId" value={claimId} />
        <input type="hidden" name="companySlug" value={companySlug} />
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-50"
        >
          {label}
        </button>
      </form>
    </div>
  )
}

function StatusHeader({
  statusLabel,
  title,
  description,
  tone,
}: {
  statusLabel: string
  title: string
  description: string
  tone: "amber" | "red" | "slate"
}) {
  const styles = {
    amber: "border-amber-200 bg-amber-50 text-amber-800",
    red: "border-red-200 bg-red-50 text-red-800",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
  }

  return (
    <div>
      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${styles[tone]}`}>{statusLabel}</span>
      <h2 className="mt-4 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
    </div>
  )
}

function StatusMessage({
  title,
  description,
  success = false,
  action,
}: {
  title: string
  description: string
  success?: boolean
  action?: React.ReactNode
}) {
  return (
    <div className="py-8 text-center">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-3xl text-2xl ${
          success ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
        }`}
      >
        {success ? "✓" : "i"}
      </div>
      <h2 className="mt-5 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">{description}</p>
      {action}
    </div>
  )
}
