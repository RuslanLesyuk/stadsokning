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

const cities = [
  { name: "Stockholm", slug: "stockholm" },
  { name: "Göteborg", slug: "goteborg" },
  { name: "Malmö", slug: "malmo" },
  { name: "Uppsala", slug: "uppsala" },
  { name: "Västerås", slug: "vasteras" },
  { name: "Örebro", slug: "orebro" },
  { name: "Linköping", slug: "linkoping" },
  { name: "Helsingborg", slug: "helsingborg" },
  { name: "Jönköping", slug: "jonkoping" },
  { name: "Lund", slug: "lund" },
  { name: "Umeå", slug: "umea" },
]

const serviceTypes: SeoServiceType[] = [
  "stadfirma",
  "hemstadning",
  "flyttstadning",
  "kontorsstadning",
  "fonsterputs",
]

export const seoLandingPages: SeoLandingPage[] = cities.flatMap((city) =>
  serviceTypes.map((serviceType) => ({
    slug: `${serviceType}-${city.slug}`,
    city: city.name,
    serviceType,
  })),
)

const cityContent: Record<
  string,
  {
    introExtra: Record<Locale, string>
    districts: string[]
  }
> = {
  stockholm: {
    introExtra: {
      sv: "I Stockholm finns stor efterfrågan på städtjänster för lägenheter, villor, kontor och flyttar. Många kunder söker flexibla företag som kan arbeta i innerstaden, närförorter och större bostadsområden.",
      en: "In Stockholm, there is strong demand for cleaning services for apartments, houses, offices and moving. Many customers look for flexible providers working across the city centre, suburbs and residential areas.",
      uk: "У Стокгольмі високий попит на клінінгові послуги для квартир, будинків, офісів і переїздів. Багато клієнтів шукають компанії, які працюють у центрі, передмістях і житлових районах.",
      ru: "В Стокгольме высокий спрос на клининговые услуги для квартир, домов, офисов и переездов. Многие клиенты ищут компании, которые работают в центре, пригородах и жилых районах.",
      pl: "W Sztokholmie jest duże zapotrzebowanie na usługi sprzątania mieszkań, domów, biur i przeprowadzek. Wielu klientów szuka firm działających w centrum, na przedmieściach i w dzielnicach mieszkalnych.",
    },
    districts: ["Södermalm", "Vasastan", "Östermalm", "Kungsholmen", "Solna", "Nacka", "Järfälla"],
  },
  goteborg: {
    introExtra: {
      sv: "Göteborg har många hushåll, kontor och företag som regelbundet behöver städning. Särskilt efterfrågat är hemstädning, flyttstädning och kontorsstädning i centrala Göteborg och närliggande områden.",
      en: "Gothenburg has many households, offices and businesses that regularly need cleaning. Home cleaning, moving cleaning and office cleaning are especially common in central Gothenburg and nearby areas.",
      uk: "У Гетеборзі багато домогосподарств, офісів і компаній, яким регулярно потрібне прибирання. Особливо популярні прибирання дому, прибирання після переїзду та офісне прибирання.",
      ru: "В Гётеборге много домов, офисов и компаний, которым регулярно нужна уборка. Особенно востребованы уборка дома, уборка после переезда и уборка офисов.",
      pl: "W Göteborgu wiele gospodarstw domowych, biur i firm regularnie potrzebuje sprzątania. Szczególnie popularne są sprzątanie domu, sprzątanie po przeprowadzce i sprzątanie biur.",
    },
    districts: ["Centrum", "Hisingen", "Majorna", "Linné", "Mölndal", "Partille", "Frölunda"],
  },
  malmo: {
    introExtra: {
      sv: "Malmö har en växande marknad för städtjänster med många bostäder, kontor och mindre företag. Kunder söker ofta prisvärda och flexibla städfirmor i hela Malmöområdet.",
      en: "Malmö has a growing market for cleaning services with many homes, offices and smaller businesses. Customers often look for affordable and flexible cleaning companies across the Malmö area.",
      uk: "У Мальме зростає попит на клінінгові послуги для житла, офісів і малого бізнесу. Клієнти часто шукають доступні та гнучкі клінінгові компанії.",
      ru: "В Мальмё растет спрос на клининговые услуги для жилья, офисов и малого бизнеса. Клиенты часто ищут доступные и гибкие клининговые компании.",
      pl: "W Malmö rośnie zapotrzebowanie na usługi sprzątania mieszkań, biur i małych firm. Klienci często szukają przystępnych cenowo i elastycznych firm sprzątających.",
    },
    districts: ["Centrum", "Limhamn", "Hyllie", "Rosengård", "Västra Hamnen", "Lund", "Trelleborg"],
  },
  uppsala: {
    introExtra: {
      sv: "Uppsala har många studenter, familjer och företag som behöver återkommande städning. Hemstädning, flyttstädning och kontorsstädning är vanliga tjänster i området.",
      en: "Uppsala has many students, families and businesses that need recurring cleaning. Home cleaning, moving cleaning and office cleaning are common services in the area.",
      uk: "В Уппсалі багато студентів, сімей і компаній, яким потрібне регулярне прибирання. Популярні послуги — прибирання дому, після переїзду та офісів.",
      ru: "В Уппсале много студентов, семей и компаний, которым нужна регулярная уборка. Популярны уборка дома, после переезда и офисов.",
      pl: "W Uppsali wielu studentów, rodzin i firm potrzebuje regularnego sprzątania. Popularne są sprzątanie domu, po przeprowadzce i biur.",
    },
    districts: ["Centrum", "Fålhagen", "Luthagen", "Gottsunda", "Gränby", "Sävja"],
  },
}

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
  const citySlug = page.slug.split("-").at(-1) || ""
  const localCityContent = cityContent[citySlug]
  const introExtra = localCityContent?.introExtra[locale] || ""
  const districts = localCityContent?.districts || []

  const copy = {
    sv: {
      title: `${serviceName} i ${city} | Clean Jobs`,
      description: `Hitta ${serviceName.toLowerCase()} i ${city}. Jämför företag, priser, tjänster och kontaktuppgifter på Clean Jobs.`,
      h1: `${serviceName} i ${city}`,
      intro: `Letar du efter ${serviceName.toLowerCase()} i ${city}? På Clean Jobs kan du hitta och jämföra städföretag, privata städare och tjänster i ${city}.${introExtra ? ` ${introExtra}` : ""}`,
      providersTitle: `Företag för ${serviceName.toLowerCase()} i ${city}`,
      popularTitle: "Populära städtjänster",
      faqTitle: "Vanliga frågor",
      morePages: "Fler sidor",
      districtsTitle: "Populära områden",
      primaryButton: "Hitta städfirma",
      secondaryButton: "Alla städtjänster",
      priceFrom: "Från",
      perHour: "SEK/timme",
      viewCompany: "Visa företag",
      fallback: "Städfirma listad på Clean Jobs.",
      districts,
      faq: [
        {
          question: `Hur hittar jag ${serviceName.toLowerCase()} i ${city}?`,
          answer: "Du kan jämföra företag och städtjänster på Clean Jobs och kontakta leverantörer direkt.",
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
      intro: `Looking for ${serviceName.toLowerCase()} in ${city}? Clean Jobs helps you find and compare cleaning companies, private cleaners and local services.${introExtra ? ` ${introExtra}` : ""}`,
      providersTitle: `${serviceName} providers in ${city}`,
      popularTitle: "Popular cleaning services",
      faqTitle: "FAQ",
      morePages: "More pages",
      districtsTitle: "Popular areas",
      primaryButton: "Find cleaning company",
      secondaryButton: "All cleaning services",
      priceFrom: "From",
      perHour: "SEK/hour",
      viewCompany: "View company",
      fallback: "Cleaning company listed on Clean Jobs.",
      districts,
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
      intro: `Шукаєте ${serviceName.toLowerCase()} у ${city}? Clean Jobs допомагає знайти та порівняти клінінгові компанії, приватних прибиральників і локальні послуги.${introExtra ? ` ${introExtra}` : ""}`,
      providersTitle: `${serviceName} у ${city}`,
      popularTitle: "Популярні клінінгові послуги",
      faqTitle: "Питання та відповіді",
      morePages: "Інші сторінки",
      districtsTitle: "Популярні райони",
      primaryButton: "Знайти компанію",
      secondaryButton: "Усі послуги",
      priceFrom: "Від",
      perHour: "SEK/год",
      viewCompany: "Переглянути компанію",
      fallback: "Клінінгова компанія на Clean Jobs.",
      districts,
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
      intro: `Ищете ${serviceName.toLowerCase()} в ${city}? Clean Jobs помогает находить и сравнивать клининговые компании, частных уборщиков и локальные услуги.${introExtra ? ` ${introExtra}` : ""}`,
      providersTitle: `${serviceName} в ${city}`,
      popularTitle: "Популярные клининговые услуги",
      faqTitle: "Вопросы и ответы",
      morePages: "Другие страницы",
      districtsTitle: "Популярные районы",
      primaryButton: "Найти компанию",
      secondaryButton: "Все услуги",
      priceFrom: "От",
      perHour: "SEK/час",
      viewCompany: "Открыть компанию",
      fallback: "Клининговая компания на Clean Jobs.",
      districts,
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
      intro: `Szukasz ${serviceName.toLowerCase()} w ${city}? Clean Jobs pomaga znaleźć i porównać firmy sprzątające, prywatnych wykonawców i lokalne usługi.${introExtra ? ` ${introExtra}` : ""}`,
      providersTitle: `${serviceName} w ${city}`,
      popularTitle: "Popularne usługi sprzątania",
      faqTitle: "FAQ",
      morePages: "Więcej stron",
      districtsTitle: "Popularne dzielnice",
      primaryButton: "Znajdź firmę",
      secondaryButton: "Wszystkie usługi",
      priceFrom: "Od",
      perHour: "SEK/godz.",
      viewCompany: "Zobacz firmę",
      fallback: "Firma sprzątająca w Clean Jobs.",
      districts,
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