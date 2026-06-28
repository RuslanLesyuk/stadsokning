import type { Locale } from "@/lib/i18n"

export type SeoServiceType =
  | "stadfirma"
  | "hemstadning"
  | "flyttstadning"
  | "kontorsstadning"
  | "fonsterputs"

export type SeoLandingPage = {
  slug: string
  city: string
  serviceType: SeoServiceType
}

export const seoLandingPages: SeoLandingPage[] = [
  { slug: "stadfirma-stockholm", city: "Stockholm", serviceType: "stadfirma" },
  { slug: "hemstadning-stockholm", city: "Stockholm", serviceType: "hemstadning" },
  { slug: "flyttstadning-stockholm", city: "Stockholm", serviceType: "flyttstadning" },
  { slug: "kontorsstadning-stockholm", city: "Stockholm", serviceType: "kontorsstadning" },
  { slug: "fonsterputs-stockholm", city: "Stockholm", serviceType: "fonsterputs" },
]

const serviceNames: Record<Locale, Record<SeoServiceType, string>> = {
  sv: {
    stadfirma: "Städfirma",
    hemstadning: "Hemstädning",
    flyttstadning: "Flyttstädning",
    kontorsstadning: "Kontorsstädning",
    fonsterputs: "Fönsterputs",
  },
  en: {
    stadfirma: "Cleaning company",
    hemstadning: "Home cleaning",
    flyttstadning: "Moving cleaning",
    kontorsstadning: "Office cleaning",
    fonsterputs: "Window cleaning",
  },
  uk: {
    stadfirma: "Клінінгова компанія",
    hemstadning: "Прибирання дому",
    flyttstadning: "Прибирання після переїзду",
    kontorsstadning: "Прибирання офісу",
    fonsterputs: "Миття вікон",
  },
  ru: {
    stadfirma: "Клининговая компания",
    hemstadning: "Уборка дома",
    flyttstadning: "Уборка после переезда",
    kontorsstadning: "Уборка офиса",
    fonsterputs: "Мойка окон",
  },
  pl: {
    stadfirma: "Firma sprzątająca",
    hemstadning: "Sprzątanie domu",
    flyttstadning: "Sprzątanie po przeprowadzce",
    kontorsstadning: "Sprzątanie biura",
    fonsterputs: "Mycie okien",
  },
}

export function getSeoLandingPage(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug) || null
}

export function getSeoLandingCopy(page: SeoLandingPage, locale: Locale) {
  const serviceName = serviceNames[locale][page.serviceType]
  const city = page.city

  const copy = {
    sv: {
      title: `${serviceName} i ${city} | Clean Jobs`,
      description: `Hitta ${serviceName.toLowerCase()} i ${city}. Jämför företag, priser, tjänster och kontaktuppgifter på Clean Jobs.`,
      h1: `${serviceName} i ${city}`,
      intro: `Letar du efter ${serviceName.toLowerCase()} i ${city}? På Clean Jobs kan du hitta och jämföra städföretag, privata städare och tjänster i ${city}.`,
      providersTitle: `Företag för ${serviceName.toLowerCase()} i ${city}`,
      popularTitle: "Populära städtjänster",
      faqTitle: "Vanliga frågor",
      morePages: "Fler sidor",
      primaryButton: "Hitta städfirma",
      secondaryButton: "Alla städtjänster",
      priceFrom: "Från",
      perHour: "SEK/timme",
      viewCompany: "Visa företag",
      fallback: "Städfirma listad på Clean Jobs.",
      faq: [
        {
          question: `Hur hittar jag ${serviceName.toLowerCase()} i ${city}?`,
          answer: `Du kan jämföra företag och städtjänster på Clean Jobs och kontakta leverantörer direkt.`,
        },
        {
          question: "Kan jag jämföra flera företag?",
          answer: "Ja, Clean Jobs gör det lättare att jämföra företag, områden, priser och kontaktuppgifter.",
        },
        {
          question: "Finns RUT-avdrag?",
          answer: "Många städtjänster kan omfattas av RUT-avdrag. Kontrollera alltid detta med företaget.",
        },
      ],
    },
    en: {
      title: `${serviceName} in ${city} | Clean Jobs`,
      description: `Find ${serviceName.toLowerCase()} in ${city}. Compare companies, prices, services and contact details on Clean Jobs.`,
      h1: `${serviceName} in ${city}`,
      intro: `Looking for ${serviceName.toLowerCase()} in ${city}? Clean Jobs helps you find and compare cleaning companies, private cleaners and local services.`,
      providersTitle: `${serviceName} providers in ${city}`,
      popularTitle: "Popular cleaning services",
      faqTitle: "FAQ",
      morePages: "More pages",
      primaryButton: "Find cleaning company",
      secondaryButton: "All cleaning services",
      priceFrom: "From",
      perHour: "SEK/hour",
      viewCompany: "View company",
      fallback: "Cleaning company listed on Clean Jobs.",
      faq: [
        {
          question: `How do I find ${serviceName.toLowerCase()} in ${city}?`,
          answer: "You can compare providers on Clean Jobs and contact them directly.",
        },
        {
          question: "Can I compare several companies?",
          answer: "Yes, you can compare services, areas, prices and contact details.",
        },
        {
          question: "Is RUT deduction available?",
          answer: "Many cleaning services may support RUT deduction. Always check with the company.",
        },
      ],
    },
    uk: {
      title: `${serviceName} у ${city} | Clean Jobs`,
      description: `Знайдіть ${serviceName.toLowerCase()} у ${city}. Порівнюйте компанії, ціни, послуги та контакти на Clean Jobs.`,
      h1: `${serviceName} у ${city}`,
      intro: `Шукаєте ${serviceName.toLowerCase()} у ${city}? Clean Jobs допомагає знайти та порівняти клінінгові компанії, приватних прибиральників і локальні послуги.`,
      providersTitle: `${serviceName} у ${city}`,
      popularTitle: "Популярні клінінгові послуги",
      faqTitle: "Питання та відповіді",
      morePages: "Інші сторінки",
      primaryButton: "Знайти компанію",
      secondaryButton: "Усі послуги",
      priceFrom: "Від",
      perHour: "SEK/год",
      viewCompany: "Переглянути компанію",
      fallback: "Клінінгова компанія на Clean Jobs.",
      faq: [
        {
          question: `Як знайти ${serviceName.toLowerCase()} у ${city}?`,
          answer: "На Clean Jobs можна порівнювати компанії та напряму зв’язуватися з ними.",
        },
        {
          question: "Чи можна порівняти кілька компаній?",
          answer: "Так, можна порівняти послуги, райони роботи, ціни та контакти.",
        },
        {
          question: "Чи доступний RUT?",
          answer: "Багато клінінгових послуг можуть підтримувати RUT. Уточнюйте це у компанії.",
        },
      ],
    },
    ru: {
      title: `${serviceName} в ${city} | Clean Jobs`,
      description: `Найдите ${serviceName.toLowerCase()} в ${city}. Сравнивайте компании, цены, услуги и контакты на Clean Jobs.`,
      h1: `${serviceName} в ${city}`,
      intro: `Ищете ${serviceName.toLowerCase()} в ${city}? Clean Jobs помогает находить и сравнивать клининговые компании, частных уборщиков и локальные услуги.`,
      providersTitle: `${serviceName} в ${city}`,
      popularTitle: "Популярные клининговые услуги",
      faqTitle: "Вопросы и ответы",
      morePages: "Другие страницы",
      primaryButton: "Найти компанию",
      secondaryButton: "Все услуги",
      priceFrom: "От",
      perHour: "SEK/час",
      viewCompany: "Открыть компанию",
      fallback: "Клининговая компания на Clean Jobs.",
      faq: [
        {
          question: `Как найти ${serviceName.toLowerCase()} в ${city}?`,
          answer: "На Clean Jobs можно сравнивать компании и связываться с ними напрямую.",
        },
        {
          question: "Можно ли сравнить несколько компаний?",
          answer: "Да, можно сравнить услуги, районы работы, цены и контакты.",
        },
        {
          question: "Доступен ли RUT?",
          answer: "Многие клининговые услуги могут поддерживать RUT. Уточняйте это у компании.",
        },
      ],
    },
    pl: {
      title: `${serviceName} w ${city} | Clean Jobs`,
      description: `Znajdź ${serviceName.toLowerCase()} w ${city}. Porównuj firmy, ceny, usługi i dane kontaktowe w Clean Jobs.`,
      h1: `${serviceName} w ${city}`,
      intro: `Szukasz ${serviceName.toLowerCase()} w ${city}? Clean Jobs pomaga znaleźć i porównać firmy sprzątające, prywatnych wykonawców i lokalne usługi.`,
      providersTitle: `${serviceName} w ${city}`,
      popularTitle: "Popularne usługi sprzątania",
      faqTitle: "FAQ",
      morePages: "Więcej stron",
      primaryButton: "Znajdź firmę",
      secondaryButton: "Wszystkie usługi",
      priceFrom: "Od",
      perHour: "SEK/godz.",
      viewCompany: "Zobacz firmę",
      fallback: "Firma sprzątająca w Clean Jobs.",
      faq: [
        {
          question: `Jak znaleźć ${serviceName.toLowerCase()} w ${city}?`,
          answer: "W Clean Jobs możesz porównać firmy i skontaktować się z nimi bezpośrednio.",
        },
        {
          question: "Czy można porównać kilka firm?",
          answer: "Tak, możesz porównać usługi, obszary działania, ceny i dane kontaktowe.",
        },
        {
          question: "Czy dostępny jest RUT?",
          answer: "Wiele usług sprzątania może obsługiwać RUT. Zawsze sprawdź to z firmą.",
        },
      ],
    },
  }

  return copy[locale]
}