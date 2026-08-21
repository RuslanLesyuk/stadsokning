
import Link from "next/link"

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
  },
  en: {
    faq: "Frequently asked questions",
    relatedServices: "Related cleaning services",
    relatedCities: "Cleaning in other cities",
    directory: "Compare cleaning companies",
    services: "See cleaning services",
  },
  uk: {
    faq: "Поширені запитання",
    relatedServices: "Пов’язані послуги",
    relatedCities: "Прибирання в інших містах",
    directory: "Порівняти компанії",
    services: "Переглянути послуги",
  },
  ru: {
    faq: "Частые вопросы",
    relatedServices: "Похожие услуги",
    relatedCities: "Уборка в других городах",
    directory: "Сравнить компании",
    services: "Посмотреть услуги",
  },
  pl: {
    faq: "Najczęstsze pytania",
    relatedServices: "Powiązane usługi",
    relatedCities: "Sprzątanie w innych miastach",
    directory: "Porównaj firmy",
    services: "Zobacz usługi",
  },
} as const

function getRelatedLabel(item: SafeRelatedLink) {
  return item.label ?? item.name ?? item.title ?? item.href
}

export function SeoPage({ seo }: SeoPageProps) {
  const { content, schema, breadcrumbs, related, locale, city } = seo
  const t = labels[locale]
  const cityQuery = encodeURIComponent(city.name)

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
