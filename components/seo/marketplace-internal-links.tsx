import Link from "next/link"

import type { Locale } from "@/lib/i18n"
import {
  getMarketplaceInternalLinks,
  type MarketplaceLinkKind,
} from "@/lib/seo/marketplace-links"

type Copy = {
  eyebrow: string
  title: string
  description: string
  cityHub: (city: string) => string
  cityJobs: (city: string) => string
  homeService: (city: string) => string
  officeService: (city: string) => string
  companies: (city: string) => string
  services: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Utforska vidare",
    title: "Relaterat i Clean Jobs",
    description:
      "Fortsätt mellan aktuella jobb, städtjänster och företag utan att lämna den lokala marknaden.",
    cityHub: (city) => `Städjobb i ${city}`,
    cityJobs: (city) => `Alla lediga jobb i ${city}`,
    homeService: (city) => `Hemstädning i ${city}`,
    officeService: (city) =>
      `Kontorsstädning i ${city}`,
    companies: (city) =>
      `Städföretag i ${city}`,
    services: "Alla städtjänster",
  },
  en: {
    eyebrow: "Explore more",
    title: "Related on Clean Jobs",
    description:
      "Move between current jobs, cleaning services and companies while staying within the same local market.",
    cityHub: (city) => `Cleaning jobs in ${city}`,
    cityJobs: (city) =>
      `All open jobs in ${city}`,
    homeService: (city) =>
      `Home cleaning in ${city}`,
    officeService: (city) =>
      `Office cleaning in ${city}`,
    companies: (city) =>
      `Cleaning companies in ${city}`,
    services: "All cleaning services",
  },
  uk: {
    eyebrow: "Дивіться також",
    title: "Пов’язане на Clean Jobs",
    description:
      "Переходьте між актуальними роботами, послугами та компаніями в межах того самого локального ринку.",
    cityHub: (city) =>
      `Роботи з прибирання — ${city}`,
    cityJobs: (city) =>
      `Усі відкриті роботи — ${city}`,
    homeService: (city) =>
      `Прибирання дому — ${city}`,
    officeService: (city) =>
      `Прибирання офісів — ${city}`,
    companies: (city) =>
      `Клінінгові компанії — ${city}`,
    services: "Усі послуги прибирання",
  },
  ru: {
    eyebrow: "Смотрите также",
    title: "Связанное на Clean Jobs",
    description:
      "Переходите между актуальными заказами, услугами и компаниями в рамках одного локального рынка.",
    cityHub: (city) =>
      `Работы по уборке — ${city}`,
    cityJobs: (city) =>
      `Все открытые работы — ${city}`,
    homeService: (city) =>
      `Уборка дома — ${city}`,
    officeService: (city) =>
      `Уборка офисов — ${city}`,
    companies: (city) =>
      `Клининговые компании — ${city}`,
    services: "Все услуги уборки",
  },
  pl: {
    eyebrow: "Zobacz także",
    title: "Powiązane w Clean Jobs",
    description:
      "Przechodź między aktualnymi zleceniami, usługami i firmami w obrębie tego samego lokalnego rynku.",
    cityHub: (city) =>
      `Zlecenia sprzątania — ${city}`,
    cityJobs: (city) =>
      `Wszystkie otwarte zlecenia — ${city}`,
    homeService: (city) =>
      `Sprzątanie domu — ${city}`,
    officeService: (city) =>
      `Sprzątanie biur — ${city}`,
    companies: (city) =>
      `Firmy sprzątające — ${city}`,
    services: "Wszystkie usługi sprzątania",
  },
}

function getLabel(
  kind: MarketplaceLinkKind,
  city: string,
  t: Copy,
) {
  switch (kind) {
    case "city-hub":
      return t.cityHub(city)
    case "city-jobs":
      return t.cityJobs(city)
    case "home-service":
      return t.homeService(city)
    case "office-service":
      return t.officeService(city)
    case "companies":
      return t.companies(city)
    case "services":
      return t.services
  }
}

export default function MarketplaceInternalLinks({
  city,
  locale,
  jobType,
  currentPath,
  compact = false,
}: {
  city: string | null | undefined
  locale: Locale
  jobType?: string | null
  currentPath?: string
  compact?: boolean
}) {
  const t = copy[locale] || copy.sv

  const links = getMarketplaceInternalLinks({
    city,
    jobType,
  }).filter(
    (link) =>
      !currentPath ||
      link.href !== currentPath,
  )

  if (links.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={t.title}
      className={
        compact
          ? "mt-6 rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm"
          : "mt-8 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8"
      }
    >
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600">
        {t.eyebrow}
      </div>

      <h2
        className={
          compact
            ? "mt-2 text-xl font-semibold tracking-tight text-slate-950"
            : "mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl"
        }
      >
        {t.title}
      </h2>

      {!compact ? (
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          {t.description}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={`${link.kind}:${link.href}`}
            href={link.href}
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
          >
            {getLabel(
              link.kind,
              link.city,
              t,
            )}
            <span
              className="ml-2 text-slate-400"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
