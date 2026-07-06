import Link from "next/link"

import type { createSeoEngine } from "./index"

import {
  SEO_DEFAULT_LOCALE,
  SEO_PRIMARY_JOB_URL,
  SEO_SERVICES_URL,
  SEO_SIGNUP_URL,
} from "./constants"

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

function getLocalizedPath(locale: string, path: string) {
  if (locale === SEO_DEFAULT_LOCALE) {
    return path
  }

  return `/${locale}${path}`
}

function getRelatedLabel(item: SafeRelatedLink) {
  return item.label ?? item.name ?? item.title ?? item.href
}

export function SeoPage({ seo }: SeoPageProps) {
  const { content, schema, breadcrumbs, related, locale } = seo

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
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

          <p className="mt-6 max-w-3xl text-lg text-gray-300">
            {content.hero.text}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={getLocalizedPath(locale, SEO_SIGNUP_URL)}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-950 hover:bg-gray-100"
            >
              {content.hero.primaryCta}
            </Link>

            <Link
              href={getLocalizedPath(locale, SEO_SERVICES_URL)}
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
              <h2 className="text-2xl font-bold text-gray-950">
                {section.title}
              </h2>

              <p className="mt-3 text-gray-600">{section.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <h2 className="text-2xl font-bold text-gray-950">
            Frequently asked questions
          </h2>

          <div className="mt-6 space-y-5">
            {content.faq.map((item) => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-950">
                  {item.question}
                </h3>

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

          <Link
            href={getLocalizedPath(locale, SEO_PRIMARY_JOB_URL)}
            className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {content.cta.primaryCta}
          </Link>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold text-gray-950">
              Related services
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
            <h2 className="text-lg font-bold text-gray-950">Related cities</h2>

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