import Link from "next/link"

import { CompanyOfferForm } from "@/components/companies/company-offer-form"
import { companySitePublicCopy } from "@/lib/company-sites/copy"
import {
  getLocalizedContent,
  normalizeContent,
  normalizeEnabledLocales,
  normalizeSectionSettings,
  normalizeSocialLinks,
  normalizeStringArray,
} from "@/lib/company-sites/utils"
import type {
  CompanySiteCompany,
  CompanySiteLocale,
  CompanySiteReview,
  CompanySiteRow,
} from "@/lib/company-sites/types"

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

type WorkingHours = Partial<Record<DayKey, string>>
type FaqItem = { question: string; answer: string }

const dayOrder: DayKey[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]

function normalizeWorkingHours(value: unknown): WorkingHours {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  const source = value as Record<string, unknown>
  const result: WorkingHours = {}

  for (const day of dayOrder) {
    if (typeof source[day] === "string" && source[day].trim()) {
      result[day] = source[day].trim()
    }
  }

  return result
}

function normalizeFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null
      const row = item as Record<string, unknown>
      const question = typeof row.question === "string" ? row.question.trim() : ""
      const answer = typeof row.answer === "string" ? row.answer.trim() : ""
      return question && answer ? { question, answer } : null
    })
    .filter((item): item is FaqItem => Boolean(item))
}

function formatReviewDate(value: string, locale: CompanySiteLocale) {
  const locales: Record<CompanySiteLocale, string> = {
    sv: "sv-SE",
    en: "en-GB",
    uk: "uk-UA",
    ru: "ru-RU",
    pl: "pl-PL",
  }

  return new Intl.DateTimeFormat(locales[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value))
}

function getTemplateClasses(template: CompanySiteRow["template"]) {
  if (template === "minimal") {
    return {
      page: "bg-white text-slate-950",
      nav: "border-b border-slate-200 bg-white/95 text-slate-950",
      hero: "bg-white text-slate-950",
      section: "bg-white",
      card: "border-slate-200 bg-slate-50",
      heading: "tracking-tight",
      rounded: "rounded-2xl",
    }
  }

  if (template === "elegant") {
    return {
      page: "bg-stone-50 text-slate-950",
      nav: "border-b border-white/10 bg-slate-950/95 text-white",
      hero: "bg-slate-950 text-white",
      section: "bg-stone-50",
      card: "border-stone-200 bg-white",
      heading: "font-serif tracking-tight",
      rounded: "rounded-[2rem]",
    }
  }

  return {
    page: "bg-slate-50 text-slate-950",
    nav: "border-b border-slate-200/80 bg-white/90 text-slate-950",
    hero: "bg-slate-950 text-white",
    section: "bg-slate-50",
    card: "border-slate-200 bg-white",
    heading: "tracking-tight",
    rounded: "rounded-[2rem]",
  }
}

export function CompanySiteRenderer({
  site,
  company,
  reviews,
  locale,
  preview = false,
  editorHref,
  defaultEmail = "",
}: {
  site: CompanySiteRow
  company: CompanySiteCompany
  reviews: CompanySiteReview[]
  locale: CompanySiteLocale
  preview?: boolean
  editorHref?: string
  defaultEmail?: string
}) {
  const t = companySitePublicCopy[locale]
  const theme = getTemplateClasses(site.template)
  const content = normalizeContent(site.content)
  const localized = getLocalizedContent(content, locale, site.default_locale)
  const sections = normalizeSectionSettings(site.section_settings)
  const social = normalizeSocialLinks(site.social_links)
  const enabledLocales = normalizeEnabledLocales(
    site.enabled_locales,
    site.default_locale,
  )
  const serviceTypes = normalizeStringArray(company.service_types)
  const serviceAreas = normalizeStringArray(company.service_areas)
  const languages = normalizeStringArray(company.languages)
  const gallery = normalizeStringArray(company.gallery_urls)
  const workingHours = normalizeWorkingHours(company.working_hours)
  const faq = normalizeFaq(company.faq)

  const heroTitle =
    localized.hero_title ||
    (company.city
      ? `${company.name} – professionell städning i ${company.city}`
      : company.name)
  const heroSubtitle =
    localized.hero_subtitle ||
    company.description ||
    t.servicesText
  const aboutTitle = localized.about_title || t.about
  const aboutText = localized.about_text || company.description || heroSubtitle
  const ctaTitle = localized.cta_title || t.requestQuote
  const ctaText = localized.cta_text || t.servicesText
  const accent = site.primary_color
  const secondary = site.secondary_color
  const isMinimal = site.template === "minimal"

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      : null

  return (
    <div
      className={`min-h-screen ${theme.page}`}
      style={
        {
          "--site-accent": accent,
          "--site-secondary": secondary,
        } as React.CSSProperties
      }
    >
      {preview ? (
        <div className="sticky top-0 z-[70] flex items-center justify-between gap-4 bg-amber-300 px-4 py-2 text-sm font-bold text-amber-950">
          <span>{t.preview}</span>
          {editorHref ? (
            <Link href={editorHref} className="underline underline-offset-2">
              {t.backToEditor}
            </Link>
          ) : null}
        </div>
      ) : null}

      <header className={`sticky ${preview ? "top-10" : "top-0"} z-50 backdrop-blur ${theme.nav}`}>
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-1 shadow-sm"
              />
            ) : (
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white"
                style={{ backgroundColor: accent }}
              >
                {company.name.charAt(0).toUpperCase()}
              </span>
            )}

            <span className="truncate text-lg font-black">{company.name}</span>
          </a>

          <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
            {sections.services && serviceTypes.length > 0 ? (
              <a href="#services" className="opacity-75 transition hover:opacity-100">
                {t.services}
              </a>
            ) : null}
            {sections.about ? (
              <a href="#about" className="opacity-75 transition hover:opacity-100">
                {t.about}
              </a>
            ) : null}
            {sections.reviews && reviews.length > 0 ? (
              <a href="#reviews" className="opacity-75 transition hover:opacity-100">
                {t.reviews}
              </a>
            ) : null}
            {sections.contact ? (
              <a href="#contact" className="opacity-75 transition hover:opacity-100">
                {t.contact}
              </a>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            {enabledLocales.length > 1 ? (
              <div className="hidden items-center gap-1 rounded-xl border border-current/15 p-1 sm:flex">
                {enabledLocales.map((item) => (
                  <Link
                    key={item}
                    href={`?lang=${item}`}
                    className={`rounded-lg px-2 py-1 text-xs font-bold uppercase ${
                      item === locale ? "bg-current/10" : "opacity-55 hover:opacity-100"
                    }`}
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ) : null}

            <a
              href="#quote"
              className="inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-black text-white shadow-sm transition hover:brightness-110"
              style={{ backgroundColor: accent }}
            >
              {t.requestQuote}
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className={`relative overflow-hidden ${theme.hero}`}>
          {!isMinimal && company.cover_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-35"
              style={{ backgroundImage: `url(${company.cover_url})` }}
            />
          ) : null}
          {!isMinimal ? (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(110deg, ${secondary} 0%, ${secondary}ee 48%, ${accent}99 100%)`,
              }}
            />
          ) : null}

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)] lg:items-center lg:px-8 lg:py-28">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {company.verified ? (
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black"
                    style={
                      isMinimal
                        ? { backgroundColor: `${accent}15`, color: accent }
                        : { backgroundColor: "rgba(255,255,255,.12)", color: "white" }
                    }
                  >
                    ✓ {t.verified}
                  </span>
                ) : null}
                {averageRating ? (
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-black ${
                      isMinimal ? "bg-amber-50 text-amber-700" : "bg-white/10 text-white"
                    }`}
                  >
                    ★ {averageRating.toFixed(1)} · {reviews.length}
                  </span>
                ) : null}
              </div>

              <h1
                className={`mt-6 max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl ${theme.heading}`}
              >
                {heroTitle}
              </h1>

              <p
                className={`mt-6 max-w-2xl text-base leading-8 sm:text-lg ${
                  isMinimal ? "text-slate-600" : "text-white/75"
                }`}
              >
                {heroSubtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#quote"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl px-6 py-3 text-sm font-black text-white shadow-lg transition hover:brightness-110"
                  style={{ backgroundColor: accent }}
                >
                  {t.requestQuote}
                </a>
                {company.phone ? (
                  <a
                    href={`tel:${company.phone.replace(/\s+/g, "")}`}
                    className={`inline-flex min-h-12 items-center justify-center rounded-2xl border px-6 py-3 text-sm font-black transition ${
                      isMinimal
                        ? "border-slate-300 bg-white hover:bg-slate-50"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {t.call}
                  </a>
                ) : null}
              </div>
            </div>

            {company.cover_url ? (
              <div className={`overflow-hidden border border-white/10 bg-white shadow-2xl ${theme.rounded}`}>
                <img
                  src={company.cover_url}
                  alt={company.name}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>
            ) : (
              <div
                className={`flex aspect-[4/3] items-center justify-center p-10 text-center text-4xl font-black text-white shadow-2xl ${theme.rounded}`}
                style={{ backgroundColor: accent }}
              >
                {company.name}
              </div>
            )}
          </div>
        </section>

        {sections.services && serviceTypes.length > 0 ? (
          <SiteSection id="services" title={t.services} subtitle={t.servicesText} theme={theme}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {serviceTypes.map((service, index) => (
                <div
                  key={service}
                  className={`border p-5 ${theme.card} ${theme.rounded}`}
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-5 text-lg font-black">{service}</h3>
                </div>
              ))}
            </div>
          </SiteSection>
        ) : null}

        {sections.pricing &&
        (company.hourly_rate || company.minimum_order || company.rut_available) ? (
          <SiteSection id="pricing" title={t.pricing} theme={theme}>
            <div className="grid gap-4 md:grid-cols-3">
              {company.hourly_rate ? (
                <Metric
                  label={t.from}
                  value={`${company.hourly_rate} ${t.perHour}`}
                  theme={theme}
                />
              ) : null}
              {company.minimum_order ? (
                <Metric
                  label={t.minimumOrder}
                  value={`${company.minimum_order} ${t.hours}`}
                  theme={theme}
                />
              ) : null}
              {company.rut_available ? (
                <Metric label={t.rut} value="✓" theme={theme} accent={accent} />
              ) : null}
            </div>
            {company.rut_available ? (
              <p className="mt-5 text-sm leading-7 text-slate-600">{t.rutText}</p>
            ) : null}
          </SiteSection>
        ) : null}

        {sections.about ? (
          <SiteSection id="about" title={aboutTitle} theme={theme}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                {aboutText}
              </p>
              <dl className={`border p-5 ${theme.card} ${theme.rounded}`}>
                {company.city ? <Detail label={t.location} value={company.city} /> : null}
                {company.founded_year ? (
                  <Detail label={t.founded} value={String(company.founded_year)} />
                ) : null}
                {company.organization_number ? (
                  <Detail label={t.organizationNumber} value={company.organization_number} />
                ) : null}
                {languages.length > 0 ? (
                  <Detail label={t.languages} value={languages.join(", ")} />
                ) : null}
              </dl>
            </div>
          </SiteSection>
        ) : null}

        {sections.gallery && gallery.length > 0 ? (
          <SiteSection id="gallery" title={t.gallery} theme={theme}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {gallery.map((url, index) => (
                <div
                  key={`${url}-${index}`}
                  className={`overflow-hidden bg-slate-100 ${theme.rounded} ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <img
                    src={url}
                    alt={`${company.name} ${index + 1}`}
                    loading="lazy"
                    className="h-full min-h-48 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </SiteSection>
        ) : null}

        {sections.areas && serviceAreas.length > 0 ? (
          <SiteSection id="areas" title={t.areas} theme={theme}>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full border px-4 py-2 text-sm font-bold"
                  style={{ borderColor: `${accent}45`, color: accent, backgroundColor: `${accent}0d` }}
                >
                  {area}
                </span>
              ))}
            </div>
          </SiteSection>
        ) : null}

        {sections.reviews ? (
          <SiteSection id="reviews" title={t.reviews} theme={theme}>
            {reviews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reviews.slice(0, 9).map((review) => (
                  <article key={review.id} className={`border p-5 ${theme.card} ${theme.rounded}`}>
                    <div className="text-amber-400">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>{index < Number(review.rating) ? "★" : "☆"}</span>
                      ))}
                    </div>
                    {review.comment ? (
                      <p className="mt-4 text-sm leading-7 text-slate-600">“{review.comment}”</p>
                    ) : null}
                    <div className="mt-5 flex items-center gap-3">
                      {review.reviewer_avatar_url ? (
                        <img
                          src={review.reviewer_avatar_url}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-black text-slate-600">
                          {(review.reviewer_name || "C").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-black">{review.reviewer_name || t.reviewerFallback}</p>
                        <p className="text-xs text-slate-400">{formatReviewDate(review.created_at, locale)}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">{t.noReviews}</p>
            )}
          </SiteSection>
        ) : null}

        {sections.hours && Object.keys(workingHours).length > 0 ? (
          <SiteSection id="hours" title={t.openingHours} theme={theme}>
            <div className={`overflow-hidden border ${theme.card} ${theme.rounded}`}>
              {dayOrder.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between gap-5 border-b border-slate-200/70 px-5 py-3.5 text-sm last:border-0"
                >
                  <span className="font-black">{t[day]}</span>
                  <span className="text-slate-500">{workingHours[day] || t.closed}</span>
                </div>
              ))}
            </div>
          </SiteSection>
        ) : null}

        {sections.faq && faq.length > 0 ? (
          <SiteSection id="faq" title={t.faq} theme={theme}>
            <div className={`overflow-hidden border ${theme.card} ${theme.rounded}`}>
              {faq.map((item) => (
                <details key={item.question} className="group border-b border-slate-200/70 p-5 last:border-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black">
                    {item.question}
                    <span style={{ color: accent }}>+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </SiteSection>
        ) : null}

        <section id="quote" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div
            className={`mx-auto grid max-w-7xl gap-8 overflow-hidden ${theme.rounded} lg:grid-cols-[.8fr_1.2fr]`}
            style={{ backgroundColor: secondary }}
          >
            <div className="p-7 text-white sm:p-10 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.16em]" style={{ color: accent }}>
                {company.name}
              </p>
              <h2 className={`mt-4 text-3xl font-black sm:text-4xl ${theme.heading}`}>
                {ctaTitle}
              </h2>
              <p className="mt-4 leading-8 text-white/70">{ctaText}</p>

              {sections.contact ? (
                <div id="contact" className="mt-8 space-y-3 text-sm">
                  {company.phone ? (
                    <a href={`tel:${company.phone.replace(/\s+/g, "")}`} className="block font-bold hover:underline">
                      {company.phone}
                    </a>
                  ) : null}
                  {company.email ? (
                    <a href={`mailto:${company.email}`} className="block font-bold hover:underline">
                      {company.email}
                    </a>
                  ) : null}
                  {[company.address, company.postal_code, company.city].filter(Boolean).length > 0 ? (
                    <p className="text-white/65">
                      {[company.address, company.postal_code, company.city].filter(Boolean).join(", ")}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {Object.keys(social).length > 0 ? (
                <div className="mt-7 flex flex-wrap gap-2">
                  {Object.entries(social).map(([name, url]) =>
                    url ? (
                      <a
                        key={name}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold capitalize text-white/80 hover:bg-white/10"
                      >
                        {name}
                      </a>
                    ) : null,
                  )}
                </div>
              ) : null}
            </div>

            <div className="bg-white p-6 sm:p-8 lg:p-10">
              <CompanyOfferForm
                companyId={company.id}
                companySlug={company.slug}
                companyName={company.name}
                locale={locale}
                serviceTypes={serviceTypes}
                defaultCity={company.city || ""}
                defaultEmail={defaultEmail}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="font-black text-slate-900">{company.name}</p>
            {company.city ? <p className="mt-1">{company.city}, Sweden</p> : null}
          </div>
          <a href="https://cleansjob.com" className="font-semibold hover:text-slate-900">
            {t.poweredBy}
          </a>
        </div>
      </footer>
    </div>
  )
}

function SiteSection({
  id,
  title,
  subtitle,
  theme,
  children,
}: {
  id: string
  title: string
  subtitle?: string
  theme: ReturnType<typeof getTemplateClasses>
  children: React.ReactNode
}) {
  return (
    <section id={id} className={`scroll-mt-24 border-b border-slate-200/70 ${theme.section}`}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 max-w-3xl">
          <h2 className={`text-3xl font-black sm:text-4xl ${theme.heading}`}>{title}</h2>
          {subtitle ? <p className="mt-3 leading-7 text-slate-500">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </section>
  )
}

function Metric({
  label,
  value,
  theme,
  accent,
}: {
  label: string
  value: string
  theme: ReturnType<typeof getTemplateClasses>
  accent?: string
}) {
  return (
    <div className={`border p-5 ${theme.card} ${theme.rounded}`}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-black" style={accent ? { color: accent } : undefined}>
        {value}
      </p>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200/70 py-3 first:pt-0 last:border-0 last:pb-0">
      <dt className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-bold text-slate-800">{value}</dd>
    </div>
  )
}
