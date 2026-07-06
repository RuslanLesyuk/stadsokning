import type { SeoLocale } from "./types"

export type SeoDictionary = {
  cleaningMarketplace: string
  primaryCta: string
  secondaryCta: string
  browseJobs: string
  createAccount: string
  postJob: string

  serviceCity: {
    metaTitle: string
    metaDescription: string
    heroEyebrow: string
    heroTitle: string
    heroText: string

    introEyebrow: string
    introTitle: string
    introText1: string
    introText2: string

    trustEyebrow: string
    trustTitle: string
    trustText1: string
    trustText2: string

    areasEyebrow: string
    areasTitle: string
    areasText1: string
    areasText2: string

    faqOneQuestion: string
    faqOneAnswer: string
    faqTwoQuestion: string
    faqTwoAnswer: string
    faqThreeQuestion: string
    faqThreeAnswer: string
  }

  jobsCity: {
    metaTitle: string
    metaDescription: string
    heroEyebrow: string
    heroTitle: string
    heroText: string
  }

  companyCity: {
    metaTitle: string
    metaDescription: string
    heroEyebrow: string
    heroTitle: string
    heroText: string
  }
}

export const seoDictionary: Record<SeoLocale, SeoDictionary> = {
  uk: {
    cleaningMarketplace: "Маркетплейс клінінгу у Швеції",
    primaryCta: "Переглянути роботи",
    secondaryCta: "Створити акаунт",
    browseJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
    postJob: "Опублікувати роботу",

    serviceCity: {
      metaTitle: "{service} у {city} | Clean Jobs",
      metaDescription:
        "Знайдіть {serviceLower} у {city}. Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям швидше знаходити одне одного.",
      heroEyebrow: "{service} у {city}",
      heroTitle: "{service} у {city}: знайдіть допомогу або запропонуйте послуги",
      heroText:
        "Clean Jobs допомагає знаходити {serviceLower} у {city}. Платформа з’єднує клієнтів, прибиральників і клінінгові компанії, щоб легше домовлятися про роботи з прибирання.",

      introEyebrow: "Огляд",
      introTitle: "Що включає {serviceLower} у {city}?",
      introText1:
        "{service} у {city} може бути одноразовим замовленням, регулярною послугою або частиною ширшої клінінгової роботи. Клієнти часто шукають надійних виконавців, які можуть швидко відповісти й чітко пояснити умови.",
      introText2:
        "Для прибиральників і компаній важливо мати зрозумілий профіль, описати досвід, район роботи, доступність і типи послуг, які вони можуть виконувати.",

      trustEyebrow: "Довіра",
      trustTitle: "Як обрати надійного виконавця",
      trustText1:
        "У Швеції довіра має велике значення, особливо коли йдеться про прибирання дому або офісу. Чіткий опис роботи, швидка комунікація й прозорі очікування допомагають уникнути непорозумінь.",
      trustText2:
        "Clean Jobs створений, щоб зробити перший контакт простішим: клієнт може опублікувати роботу, а виконавець або компанія — показати свої послуги та відповісти на запит.",

      areasEyebrow: "Локація",
      areasTitle: "{service} у {city} та поруч",
      areasText1:
        "У {city} попит на клінінгові послуги може відрізнятися залежно від району, типу житла, офісів і кількості переїздів.",
      areasText2:
        "Якщо ви працюєте у кількох районах біля {city}, вкажіть це у профілі. Це може збільшити кількість релевантних запитів.",

      faqOneQuestion: "Як знайти {serviceLower} у {city}?",
      faqOneAnswer:
        "Ви можете скористатися Clean Jobs, щоб знайти прибиральників, клінінгові компанії або опублікувати роботу з прибирання у {city}.",
      faqTwoQuestion: "Чи підходить Clean Jobs для клінінгових компаній?",
      faqTwoAnswer:
        "Так. Клінінгові компанії можуть створювати профілі, показувати послуги та отримувати запити від клієнтів.",
      faqThreeQuestion: "Чи можна знайти роботу з прибирання у {city}?",
      faqThreeAnswer:
        "Так. Працівники можуть переглядати доступні роботи з прибирання та створювати профіль, щоб клієнти могли швидше їх знайти.",
    },

    jobsCity: {
      metaTitle: "Робота з прибирання у {city} | Clean Jobs",
      metaDescription:
        "Знайдіть роботу з прибирання у {city}. Прибирання дому, офісу, після переїзду та регулярні замовлення.",
      heroEyebrow: "Робота з прибирання у {city}",
      heroTitle: "Робота з прибирання у {city}",
      heroText:
        "Clean Jobs допомагає прибиральникам і клінінговим компаніям знаходити роботи з прибирання у {city}.",
    },

    companyCity: {
      metaTitle: "Клінінгові компанії у {city} | Clean Jobs",
      metaDescription:
        "Знайдіть клінінгові компанії у {city}. Послуги прибирання дому, офісу та після переїзду.",
      heroEyebrow: "Клінінгові компанії у {city}",
      heroTitle: "Клінінгові компанії у {city}",
      heroText:
        "Clean Jobs допомагає клієнтам знаходити клінінгові компанії та послуги прибирання у {city}.",
    },
  },

  ru: {
    cleaningMarketplace: "Маркетплейс клининга в Швеции",
    primaryCta: "Смотреть работы",
    secondaryCta: "Создать аккаунт",
    browseJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
    postJob: "Опубликовать работу",

    serviceCity: {
      metaTitle: "{service} в {city} | Clean Jobs",
      metaDescription:
        "Найдите {serviceLower} в {city}. Clean Jobs помогает клиентам, уборщикам и клининговым компаниям быстрее находить друг друга.",
      heroEyebrow: "{service} в {city}",
      heroTitle: "{service} в {city}: найдите помощь или предложите услуги",
      heroText:
        "Clean Jobs помогает находить {serviceLower} в {city}. Платформа соединяет клиентов, уборщиков и клининговые компании, чтобы проще договариваться о работах по уборке.",

      introEyebrow: "Обзор",
      introTitle: "Что включает {serviceLower} в {city}?",
      introText1:
        "{service} в {city} может быть разовым заказом, регулярной услугой или частью более широкой клининговой работы.",
      introText2:
        "Для уборщиков и компаний важно иметь понятный профиль, описать опыт, район работы, доступность и типы услуг.",

      trustEyebrow: "Доверие",
      trustTitle: "Как выбрать надёжного исполнителя",
      trustText1:
        "В Швеции доверие имеет большое значение, особенно когда речь идёт об уборке дома или офиса.",
      trustText2:
        "Clean Jobs создан, чтобы сделать первый контакт проще: клиент может опубликовать работу, а исполнитель или компания — показать свои услуги.",

      areasEyebrow: "Локация",
      areasTitle: "{service} в {city} и рядом",
      areasText1:
        "В {city} спрос на клининговые услуги может отличаться в зависимости от района, типа жилья, офисов и количества переездов.",
      areasText2:
        "Если вы работаете в нескольких районах рядом с {city}, укажите это в профиле.",

      faqOneQuestion: "Как найти {serviceLower} в {city}?",
      faqOneAnswer:
        "Вы можете использовать Clean Jobs, чтобы найти уборщиков, клининговые компании или опубликовать работу по уборке в {city}.",
      faqTwoQuestion: "Подходит ли Clean Jobs для клининговых компаний?",
      faqTwoAnswer:
        "Да. Клининговые компании могут создавать профили, показывать услуги и получать запросы от клиентов.",
      faqThreeQuestion: "Можно ли найти работу по уборке в {city}?",
      faqThreeAnswer:
        "Да. Работники могут просматривать доступные работы по уборке и создавать профиль, чтобы клиенты быстрее их находили.",
    },

    jobsCity: {
      metaTitle: "Работа по уборке в {city} | Clean Jobs",
      metaDescription:
        "Найдите работу по уборке в {city}. Уборка дома, офиса, после переезда и регулярные заказы.",
      heroEyebrow: "Работа по уборке в {city}",
      heroTitle: "Работа по уборке в {city}",
      heroText:
        "Clean Jobs помогает уборщикам и клининговым компаниям находить работы по уборке в {city}.",
    },

    companyCity: {
      metaTitle: "Клининговые компании в {city} | Clean Jobs",
      metaDescription:
        "Найдите клининговые компании в {city}. Услуги уборки дома, офиса и после переезда.",
      heroEyebrow: "Клининговые компании в {city}",
      heroTitle: "Клининговые компании в {city}",
      heroText:
        "Clean Jobs помогает клиентам находить клининговые компании и услуги уборки в {city}.",
    },
  },

  en: {
    cleaningMarketplace: "Cleaning marketplace in Sweden",
    primaryCta: "Browse jobs",
    secondaryCta: "Create account",
    browseJobs: "Browse jobs",
    createAccount: "Create account",
    postJob: "Post job",

    serviceCity: {
      metaTitle: "{service} in {city} | Clean Jobs",
      metaDescription:
        "Find {serviceLower} in {city}. Clean Jobs helps clients, cleaners and cleaning companies connect faster.",
      heroEyebrow: "{service} in {city}",
      heroTitle: "{service} in {city}: find help or offer services",
      heroText:
        "Clean Jobs helps people find {serviceLower} in {city}. The platform connects clients, cleaners and cleaning companies so it is easier to arrange cleaning work.",

      introEyebrow: "Overview",
      introTitle: "What does {serviceLower} in {city} include?",
      introText1:
        "{service} in {city} can be a one-time request, a recurring service or part of a wider cleaning assignment.",
      introText2:
        "For cleaners and companies, it is important to have a clear profile, describe experience, working areas, availability and service types.",

      trustEyebrow: "Trust",
      trustTitle: "How to choose a reliable provider",
      trustText1:
        "In Sweden, trust matters a lot, especially when cleaning takes place in a home or office.",
      trustText2:
        "Clean Jobs is built to make the first contact easier: clients can post jobs, while providers and companies can show services and respond to requests.",

      areasEyebrow: "Location",
      areasTitle: "{service} in {city} and nearby",
      areasText1:
        "In {city}, demand for cleaning services can differ depending on area, housing type, offices and moving activity.",
      areasText2:
        "If you work in several areas near {city}, write that in your profile. It can increase the number of relevant requests.",

      faqOneQuestion: "How can I find {serviceLower} in {city}?",
      faqOneAnswer:
        "You can use Clean Jobs to find cleaners, cleaning companies or post a cleaning job in {city}.",
      faqTwoQuestion: "Is Clean Jobs useful for cleaning companies?",
      faqTwoAnswer:
        "Yes. Cleaning companies can create profiles, show services and receive requests from clients.",
      faqThreeQuestion: "Can I find cleaning work in {city}?",
      faqThreeAnswer:
        "Yes. Workers can browse available cleaning jobs and create a profile so clients can find them faster.",
    },

    jobsCity: {
      metaTitle: "Cleaning jobs in {city} | Clean Jobs",
      metaDescription:
        "Find cleaning jobs in {city}. Home cleaning, office cleaning, move-out cleaning and recurring assignments.",
      heroEyebrow: "Cleaning jobs in {city}",
      heroTitle: "Cleaning jobs in {city}",
      heroText:
        "Clean Jobs helps cleaners and cleaning companies find cleaning jobs in {city}.",
    },

    companyCity: {
      metaTitle: "Cleaning companies in {city} | Clean Jobs",
      metaDescription:
        "Find cleaning companies in {city}. Home cleaning, office cleaning and move-out cleaning services.",
      heroEyebrow: "Cleaning companies in {city}",
      heroTitle: "Cleaning companies in {city}",
      heroText:
        "Clean Jobs helps clients find cleaning companies and cleaning services in {city}.",
    },
  },

  sv: {
    cleaningMarketplace: "Städmarknadsplats i Sverige",
    primaryCta: "Bläddra bland jobb",
    secondaryCta: "Skapa konto",
    browseJobs: "Bläddra bland jobb",
    createAccount: "Skapa konto",
    postJob: "Lägg upp jobb",

    serviceCity: {
      metaTitle: "{service} i {city} | Clean Jobs",
      metaDescription:
        "Hitta {serviceLower} i {city}. Clean Jobs hjälper kunder, städare och städföretag att hitta varandra snabbare.",
      heroEyebrow: "{service} i {city}",
      heroTitle: "{service} i {city}: hitta hjälp eller erbjud tjänster",
      heroText:
        "Clean Jobs hjälper människor att hitta {serviceLower} i {city}. Plattformen kopplar ihop kunder, städare och städföretag så att det blir enklare att ordna städarbete.",

      introEyebrow: "Översikt",
      introTitle: "Vad ingår i {serviceLower} i {city}?",
      introText1:
        "{service} i {city} kan vara en engångsförfrågan, en återkommande tjänst eller en del av ett större städuppdrag.",
      introText2:
        "För städare och företag är det viktigt att ha en tydlig profil, beskriva erfarenhet, arbetsområden, tillgänglighet och tjänstetyper.",

      trustEyebrow: "Förtroende",
      trustTitle: "Så väljer du en pålitlig utförare",
      trustText1:
        "I Sverige är förtroende viktigt, särskilt när städning sker i hem eller kontor.",
      trustText2:
        "Clean Jobs är byggt för att göra första kontakten enklare: kunder kan lägga upp jobb, medan utförare och företag kan visa tjänster och svara på förfrågningar.",

      areasEyebrow: "Plats",
      areasTitle: "{service} i {city} med omnejd",
      areasText1:
        "I {city} kan efterfrågan på städtjänster variera beroende på område, bostadstyp, kontor och flyttar.",
      areasText2:
        "Om du arbetar i flera områden nära {city}, skriv det i din profil. Det kan öka antalet relevanta förfrågningar.",

      faqOneQuestion: "Hur hittar jag {serviceLower} i {city}?",
      faqOneAnswer:
        "Du kan använda Clean Jobs för att hitta städare, städföretag eller lägga upp ett städjobb i {city}.",
      faqTwoQuestion: "Är Clean Jobs användbart för städföretag?",
      faqTwoAnswer:
        "Ja. Städföretag kan skapa profiler, visa tjänster och få förfrågningar från kunder.",
      faqThreeQuestion: "Kan jag hitta städjobb i {city}?",
      faqThreeAnswer:
        "Ja. Arbetare kan bläddra bland lediga städjobb och skapa profil så att kunder hittar dem snabbare.",
    },

    jobsCity: {
      metaTitle: "Städjobb i {city} | Clean Jobs",
      metaDescription:
        "Hitta städjobb i {city}. Hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag.",
      heroEyebrow: "Städjobb i {city}",
      heroTitle: "Städjobb i {city}",
      heroText:
        "Clean Jobs hjälper städare och städföretag att hitta städjobb i {city}.",
    },

    companyCity: {
      metaTitle: "Städföretag i {city} | Clean Jobs",
      metaDescription:
        "Hitta städföretag i {city}. Hemstädning, kontorsstädning och flyttstädning.",
      heroEyebrow: "Städföretag i {city}",
      heroTitle: "Städföretag i {city}",
      heroText:
        "Clean Jobs hjälper kunder att hitta städföretag och städtjänster i {city}.",
    },
  },

  pl: {
    cleaningMarketplace: "Marketplace sprzątania w Szwecji",
    primaryCta: "Przeglądaj prace",
    secondaryCta: "Utwórz konto",
    browseJobs: "Przeglądaj prace",
    createAccount: "Utwórz konto",
    postJob: "Dodaj pracę",

    serviceCity: {
      metaTitle: "{service} w {city} | Clean Jobs",
      metaDescription:
        "Znajdź {serviceLower} w {city}. Clean Jobs pomaga klientom, sprzątaczom i firmom sprzątającym szybciej się połączyć.",
      heroEyebrow: "{service} w {city}",
      heroTitle: "{service} w {city}: znajdź pomoc albo oferuj usługi",
      heroText:
        "Clean Jobs pomaga znaleźć {serviceLower} w {city}. Platforma łączy klientów, sprzątaczy i firmy sprzątające, aby łatwiej umawiać prace sprzątania.",

      introEyebrow: "Przegląd",
      introTitle: "Co obejmuje {serviceLower} w {city}?",
      introText1:
        "{service} w {city} może być jednorazowym zleceniem, regularną usługą albo częścią większej pracy sprzątania.",
      introText2:
        "Dla sprzątaczy i firm ważne jest posiadanie jasnego profilu, opisanie doświadczenia, obszarów pracy, dostępności i typów usług.",

      trustEyebrow: "Zaufanie",
      trustTitle: "Jak wybrać wiarygodnego wykonawcę",
      trustText1:
        "W Szwecji zaufanie ma duże znaczenie, szczególnie gdy sprzątanie odbywa się w domu albo biurze.",
      trustText2:
        "Clean Jobs został stworzony, aby ułatwić pierwszy kontakt: klienci mogą dodawać prace, a wykonawcy i firmy pokazywać usługi oraz odpowiadać na zapytania.",

      areasEyebrow: "Lokalizacja",
      areasTitle: "{service} w {city} i okolicy",
      areasText1:
        "W {city} popyt na usługi sprzątania może różnić się zależnie od obszaru, typu mieszkań, biur i liczby przeprowadzek.",
      areasText2:
        "Jeśli pracujesz w kilku obszarach blisko {city}, napisz to w profilu. Może to zwiększyć liczbę trafnych zapytań.",

      faqOneQuestion: "Jak znaleźć {serviceLower} w {city}?",
      faqOneAnswer:
        "Możesz użyć Clean Jobs, aby znaleźć sprzątaczy, firmy sprzątające albo dodać pracę sprzątania w {city}.",
      faqTwoQuestion: "Czy Clean Jobs jest przydatny dla firm sprzątających?",
      faqTwoAnswer:
        "Tak. Firmy sprzątające mogą tworzyć profile, pokazywać usługi i otrzymywać zapytania od klientów.",
      faqThreeQuestion: "Czy mogę znaleźć pracę sprzątania w {city}?",
      faqThreeAnswer:
        "Tak. Pracownicy mogą przeglądać dostępne prace sprzątania i tworzyć profil, aby klienci szybciej ich znajdowali.",
    },

    jobsCity: {
      metaTitle: "Prace sprzątania w {city} | Clean Jobs",
      metaDescription:
        "Znajdź prace sprzątania w {city}. Sprzątanie domu, biura, po przeprowadzce i regularne zlecenia.",
      heroEyebrow: "Prace sprzątania w {city}",
      heroTitle: "Prace sprzątania w {city}",
      heroText:
        "Clean Jobs pomaga sprzątaczom i firmom sprzątającym znajdować prace sprzątania w {city}.",
    },

    companyCity: {
      metaTitle: "Firmy sprzątające w {city} | Clean Jobs",
      metaDescription:
        "Znajdź firmy sprzątające w {city}. Usługi sprzątania domu, biura i po przeprowadzce.",
      heroEyebrow: "Firmy sprzątające w {city}",
      heroTitle: "Firmy sprzątające w {city}",
      heroText:
        "Clean Jobs pomaga klientom znajdować firmy sprzątające i usługi sprzątania w {city}.",
    },
  },
}

export function replaceSeoVars(
  text: string,
  vars: {
    city: string
    service?: string
    serviceLower?: string
  }
) {
  return text
    .replaceAll("{city}", vars.city)
    .replaceAll("{service}", vars.service ?? "")
    .replaceAll("{serviceLower}", vars.serviceLower ?? "")
}

export function getSeoDictionary(locale: SeoLocale): SeoDictionary {
  return seoDictionary[locale]
}