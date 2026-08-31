import Link from "next/link"

import { getSeoMarketplaceSnapshot } from "./marketplace"
import type { createSeoEngine } from "./index"

type SeoEngine = NonNullable<ReturnType<typeof createSeoEngine>>

type SeoPageProps = {
  seo: SeoEngine
}

type SafeRelatedLink = {
  href: string
  label?: string
  name?: string
  title?: string
}

const labels = {
  sv: {
    faq: "Vanliga frågor",
    relatedServices: "Relaterade städtjänster",
    relatedCities: "Städning i andra orter",
    directory: "Jämför städföretag",
    services: "Se städtjänster",
    localCompanies: "Städföretag i området",
    localCompaniesText: "Publicerade företagsprofiler på Clean Jobs",
    verified: "Verifierad",
    serviceMatch: "Tjänsten finns i profilen",
    from: "Från",
    perHour: "SEK/timme",
    rut: "RUT",
    contact: "Kontakt finns",
    viewCompany: "Visa företag",
    allCompanies: "Se alla företag i staden",
  },
  en: {
    faq: "Frequently asked questions",
    relatedServices: "Related cleaning services",
    relatedCities: "Cleaning in other cities",
    directory: "Compare cleaning companies",
    services: "See cleaning services",
    localCompanies: "Cleaning companies in the area",
    localCompaniesText: "Published company profiles on Clean Jobs",
    verified: "Verified",
    serviceMatch: "Service listed in profile",
    from: "From",
    perHour: "SEK/hour",
    rut: "RUT",
    contact: "Contact details available",
    viewCompany: "View company",
    allCompanies: "See all companies in the city",
  },
  uk: {
    faq: "Поширені запитання",
    relatedServices: "Пов’язані послуги",
    relatedCities: "Прибирання в інших містах",
    directory: "Порівняти компанії",
    services: "Переглянути послуги",
    localCompanies: "Клінінгові компанії в цьому районі",
    localCompaniesText: "Опубліковані профілі компаній на Clean Jobs",
    verified: "Перевірено",
    serviceMatch: "Послуга вказана у профілі",
    from: "Від",
    perHour: "SEK/год",
    rut: "RUT",
    contact: "Є контактні дані",
    viewCompany: "Переглянути компанію",
    allCompanies: "Усі компанії міста",
  },
  ru: {
    faq: "Частые вопросы",
    relatedServices: "Похожие услуги",
    relatedCities: "Уборка в других городах",
    directory: "Сравнить компании",
    services: "Посмотреть услуги",
    localCompanies: "Клининговые компании в этом районе",
    localCompaniesText: "Опубликованные профили компаний на Clean Jobs",
    verified: "Проверено",
    serviceMatch: "Услуга указана в профиле",
    from: "От",
    perHour: "SEK/час",
    rut: "RUT",
    contact: "Есть контактные данные",
    viewCompany: "Открыть компанию",
    allCompanies: "Все компании города",
  },
  pl: {
    faq: "Najczęstsze pytania",
    relatedServices: "Powiązane usługi",
    relatedCities: "Sprzątanie w innych miastach",
    directory: "Porównaj firmy",
    services: "Zobacz usługi",
    localCompanies: "Firmy sprzątające w okolicy",
    localCompaniesText: "Opublikowane profile firm w Clean Jobs",
    verified: "Zweryfikowana",
    serviceMatch: "Usługa znajduje się w profilu",
    from: "Od",
    perHour: "SEK/godz.",
    rut: "RUT",
    contact: "Dane kontaktowe dostępne",
    viewCompany: "Zobacz firmę",
    allCompanies: "Wszystkie firmy w mieście",
  },
} as const

function getRelatedLabel(item: SafeRelatedLink) {
  return item.label ?? item.name ?? item.title ?? item.href
}

function hasContact(company: {
  website: string | null
  phone: string | null
  email: string | null
}) {
  return Boolean(company.website || company.phone || company.email)
}

export async function SeoPage({ seo }: SeoPageProps) {
  const {
    content,
    schema,
    breadcrumbs,
    related,
    locale,
    city,
    service,
  } = seo

  const t = labels[locale]
  const cityQuery = encodeURIComponent(city.name)

  const marketplace = await getSeoMarketplaceSnapshot({
    city,
    service,
    limit: 6,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((item, index) => (
              <li
                key={`${item.href}-${item.name}`}
                className="flex items-center gap-2"
              >
                {index > 0 ? <span>/</span> : null}
                <Link href={item.href} className="hover:text-gray-900">
                  {item.name}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <section className="rounded-3xl bg-gray-950 px-6 py-12 text-white sm:px-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-emerald-300">
            {content.hero.eyebrow}
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            {content.hero.title}
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            {content.hero.text}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/companies?city=${cityQuery}`}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100"
            >
              {content.hero.primaryCta}
            </Link>

            <Link
              href="/jobs/create"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {content.hero.secondaryCta}
            </Link>
          </div>
        </section>

        {marketplace.companies.length > 0 ? (
          <section className="mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {t.localCompaniesText}
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-950">
                  {t.localCompanies} – {city.name}
                </h2>
                <p className="mt-3 max-w-3xl text-gray-600">
                  {marketplace.totalCityCompanies} {t.localCompaniesText.toLowerCase()}.
                  {marketplace.serviceMatchCount > 0
                    ? ` ${marketplace.serviceMatchCount} ${t.serviceMatch.toLowerCase()}.`
                    : ""}
                </p>
              </div>

              <Link
                href={`/companies?city=${cityQuery}`}
                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
              >
                {t.allCompanies} →
              </Link>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {marketplace.companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  prefetch={false}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-gray-950">
                      {company.name}
                    </h3>

                    {company.verified ? (
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                        {t.verified}
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {company.city || city.name}
                  </p>

                  {company.description ? (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                      {company.description}
                    </p>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.matchesService ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        {t.serviceMatch}
                      </span>
                    ) : null}

                    {company.rut_available ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {t.rut}
                      </span>
                    ) : null}

                    {hasContact(company) ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                        {t.contact}
                      </span>
                    ) : null}
                  </div>

                  {company.hourly_rate ? (
                    <p className="mt-5 text-sm font-semibold text-gray-950">
                      {t.from} {company.hourly_rate} {t.perHour}
                    </p>
                  ) : null}

                  {company.service_types.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {company.service_types.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] text-gray-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="mt-6 inline-flex text-sm font-semibold text-emerald-700 group-hover:text-emerald-900">
                    {t.viewCompany} →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {content.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                {section.eyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-gray-950">
                {section.title}
              </h2>

              <div className="mt-4 space-y-4 text-gray-600">
                {section.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-950">{t.faq}</h2>

          <div className="mt-6 space-y-5">
            {content.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-950">{item.question}</h3>
                <p className="mt-2 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-emerald-50 p-8">
          <h2 className="text-3xl font-bold text-gray-950">
            {content.cta.title}
          </h2>
          <p className="mt-3 max-w-3xl text-gray-700">{content.cta.text}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/companies?city=${cityQuery}`}
              className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              {t.directory}
            </Link>
            <Link
              href="/services"
              className="inline-flex rounded-full border border-emerald-300 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
            >
              {t.services}
            </Link>
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              {t.relatedServices}
            </h2>
            <ul className="mt-4 space-y-2">
              {related.services.map((item) => {
                const link = item as SafeRelatedLink

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      {getRelatedLabel(link)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-950">
              {t.relatedCities}
            </h2>
            <ul className="mt-4 space-y-2">
              {related.cities.map((item) => {
                const link = item as SafeRelatedLink

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-emerald-700 hover:text-emerald-900"
                    >
                      {getRelatedLabel(link)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>
    </>
  )
}
