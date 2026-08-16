import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { billingCopy } from "@/lib/billing/copy"
import { getBillingAccessForUser } from "@/lib/billing/server"
import { getPremiumPricePresentation } from "@/lib/billing/stripe"
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, normalizeLocale, type Locale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Premium & Billing | Clean Jobs",
  description: "Manage your Clean Jobs Premium subscription and billing.",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ error?: string }>
}

function formatMoney(amount: number | null, currency: string, locale: Locale) {
  if (amount === null) return null
  const locales: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  return new Intl.NumberFormat(locales[locale], {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount / 100)
}

function formatDate(value: string | null, locale: Locale) {
  if (!value) return "—"
  const locales: Record<Locale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat(locales[locale], { dateStyle: "medium" }).format(date)
}

export default async function BillingPage({ searchParams }: PageProps) {
  const query = await searchParams
  const cookieStore = await cookies()
  const locale = normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE,
  ) as Locale
  const t = billingCopy[locale]

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login?next=/billing")

  const [access, monthlyResult, yearlyResult] = await Promise.all([
    getBillingAccessForUser(user.id),
    getPremiumPricePresentation("monthly").catch((error) => {
      console.error("Load monthly Premium price error:", error)
      return null
    }),
    getPremiumPricePresentation("yearly").catch((error) => {
      console.error("Load yearly Premium price error:", error)
      return null
    }),
  ])

  const statusText = access.isInGracePeriod
    ? t.grace
    : access.source === "admin"
      ? t.managedByAdmin
      : access.source === "legacy"
        ? t.legacy
        : access.isPremium
          ? t.active
          : t.free

  const canOpenPortal = Boolean(access.customerId)
  const hasStripeSubscription = Boolean(access.subscriptionId)
  const canStartSubscription =
    !hasStripeSubscription ||
    access.status === "canceled" ||
    access.status === "incomplete_expired" ||
    access.status === "inactive" ||
    (access.status === "legacy" && !access.isPremium)

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <Link href="/profile" className="text-sm font-bold text-slate-500 hover:text-rose-600">
            ← {t.back}
          </Link>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-rose-600">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">{t.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        {query.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">
            {t.error} ({query.error})
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{t.currentPlan}</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">
                {access.isPremium ? t.premium : t.free}
              </h2>
              <p className={`mt-2 text-sm font-bold ${access.isInGracePeriod ? "text-amber-700" : "text-slate-600"}`}>
                {statusText}
              </p>
              {access.currentPeriodEnd ? (
                <p className="mt-2 text-sm text-slate-500">
                  {access.cancelAtPeriodEnd ? t.ends : t.renews}: {formatDate(access.currentPeriodEnd, locale)}
                </p>
              ) : access.overrideUntil ? (
                <p className="mt-2 text-sm text-slate-500">{t.ends}: {formatDate(access.overrideUntil, locale)}</p>
              ) : null}
            </div>

            {canOpenPortal ? (
              <div className="max-w-sm">
                <form action="/api/stripe/portal" method="POST">
                  <button className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-600">
                    {t.manageBilling}
                  </button>
                </form>
                <p className="mt-2 text-xs leading-5 text-slate-500">{t.portalHelp}</p>
              </div>
            ) : null}
          </div>
        </div>

        {canStartSubscription ? (
          <div className="grid gap-5 md:grid-cols-2">
            <PlanCard
              title={t.monthly}
              price={monthlyResult ? formatMoney(monthlyResult.amount, monthlyResult.currency, locale) : null}
              suffix={t.perMonth}
              button={t.chooseMonthly}
              unavailable={t.priceUnavailable}
              interval="monthly"
              enabled={Boolean(monthlyResult)}
            />
            <PlanCard
              title={t.yearly}
              price={yearlyResult ? formatMoney(yearlyResult.amount, yearlyResult.currency, locale) : null}
              suffix={t.perYear}
              button={t.chooseYearly}
              unavailable={t.priceUnavailable}
              interval="yearly"
              enabled={Boolean(yearlyResult)}
            />
          </div>
        ) : null}

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black text-slate-950">{t.featuresTitle}</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[t.featureRanking, t.featureTemplates, t.featureLanguages, t.featureDomain, t.featureBranding].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-700">
                <span className="text-emerald-600">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-500">{t.paymentSync}</p>
        </section>
      </section>
    </main>
  )
}

function PlanCard({
  title,
  price,
  suffix,
  button,
  unavailable,
  interval,
  enabled,
}: {
  title: string
  price: string | null
  suffix: string
  button: string
  unavailable: string
  interval: "monthly" | "yearly"
  enabled: boolean
}) {
  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-rose-600">{title}</p>
      {price ? (
        <p className="mt-4 text-4xl font-black text-slate-950">
          {price} <span className="text-base font-bold text-slate-500">{suffix}</span>
        </p>
      ) : (
        <p className="mt-4 text-sm font-bold text-slate-500">{unavailable}</p>
      )}
      <form action="/api/stripe/checkout" method="POST" className="mt-6">
        <input type="hidden" name="type" value="premium" />
        <input type="hidden" name="interval" value={interval} />
        <button
          type="submit"
          disabled={!enabled}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {button}
        </button>
      </form>
    </article>
  )
}
