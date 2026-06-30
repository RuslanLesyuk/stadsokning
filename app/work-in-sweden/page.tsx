import type { Metadata } from "next"
import type { ReactNode } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

const siteUrl = "https://cleansjob.com"
const LOCALE_COOKIE_NAME = "clean_jobs_locale"

const locales = ["uk", "ru", "en", "sv", "pl"] as const
type Locale = (typeof locales)[number]

function normalizeLocale(value?: string | null): Locale {
  if (value && locales.includes(value as Locale)) return value as Locale
  return "uk"
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)
}

const topics = [
  "jobs in Sweden",
  "work in Sweden",
  "jobs for foreigners in Sweden",
  "cleaning jobs Sweden",
  "cleaner jobs Sweden",
  "jobs in Stockholm",
  "jobs in Gothenburg",
  "jobs in Malmö",
  "part time jobs Sweden",
  "full time jobs Sweden",
]

const copy = {
  uk: {
    metaTitle: "Робота у Швеції 2026 | Вакансії, клінінг і гід",
    metaDescription:
      "Повний гід, як знайти роботу у Швеції у 2026 році. Клінінг, робота для іноземців, Стокгольм, часткова й повна зайнятість.",
    metaOgTitle: "Робота у Швеції 2026 | Clean Jobs",
    metaOgDescription:
      "Гід по роботі у Швеції: клінінг, робота для іноземців, міста та практичні поради.",
    metaOgAlt: "Робота у Швеції 2026",

    faqOneQuestion: "Як Clean Jobs може допомогти?",
    faqOneAnswer:
      "Clean Jobs з’єднує людей, яким потрібні послуги прибирання, з прибиральниками та клінінговими компаніями, які шукають роботу.",
    faqTwoQuestion: "Clean Jobs тільки для роботи з прибирання?",
    faqTwoAnswer:
      "Clean Jobs фокусується на роботі з прибирання, але гіди також допомагають людям зрозуміти можливості у сервісному секторі Швеції.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Робота у Швеції: вакансії, клінінг і практичні поради на 2026",
    heroText:
      "У Швеції є попит на надійних працівників у клінінгу, facility services, готелях, ресторанах, складах, будівництві та домашніх сервісах. Цей гід пояснює, як знайти роботу у Швеції та як Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям швидше знаходити одне одного.",
    browseJobs: "Переглянути роботи з прибирання",
    postJob: "Опублікувати роботу з прибирання",

    guideEyebrow: "Гід",
    guideTitle: "Як знайти роботу у Швеції",
    guideText1:
      "Якщо ви шукаєте роботу у Швеції, почніть із вибору типу роботи, який відповідає вашим навичкам, рівню мови та графіку. Багато людей починають із сервісу, клінінгу, складів, будівельної допомоги, ресторанів, доставки або готелів.",
    guideText2:
      "Хороша стратегія — підготувати просте CV, тримати телефон і email активними, швидко відповідати на повідомлення та подаватися на кілька вакансій щотижня. Якщо вас цікавить клінінг, Clean Jobs дає спеціалізований маркетплейс для пошуку робіт і побудови довіри через профіль.",

    cleaningEyebrow: "Клінінг",
    cleaningTitle: "Робота з прибирання у Швеції",
    cleaningText1:
      "Робота з прибирання у Швеції може включати прибирання дому, квартири, офісу, після переїзду, генеральне та регулярне прибирання. Клієнти зазвичай цінують надійність, чітку комунікацію, пунктуальність і якість.",
    cleaningText2:
      "Клінінг також корисний для компаній, яким потрібні додаткові працівники, підрядники або нові клієнти. Clean Jobs допомагає з’єднати людей, яким потрібне прибирання, з тими, хто готовий працювати.",

    citiesEyebrow: "Міста",
    citiesTitle: "Найкращі міста для роботи у Швеції",
    citiesText1:
      "Найбільші ринки праці зазвичай у Стокгольмі, Гетеборзі та Мальме, але багато можливостей також є в Уппсалі, Вестеросі, Еребру, Лінчепінгу, Гельсінборзі, Лунді та сусідніх комунах.",
    citiesText2:
      "Якщо ви живете біля Стокгольма, варто шукати роботи з прибирання також у Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge і Botkyrka.",

    foreignersEyebrow: "Іноземні працівники",
    foreignersTitle: "Робота у Швеції для іноземців",
    foreignersText1:
      "Багато іноземців шукають роботу у Швеції, поки ще вивчають шведську. Деякі роботи потребують вільної шведської, але сервісні ролі іноді можливі з англійською, базовою шведською або іншою спільною мовою.",
    foreignersText2:
      "Щоб підвищити шанси, створіть профіль із вашим ім’ям, містом, телефоном і досвідом. Додайте професійне фото або логотип компанії, якщо маєте.",

    topicsTitle: "SEO-пошукові теми",
    topicsText:
      "Ця сторінка природно побудована навколо релевантних пошукових фраз для роботи, клінінгу, Швеції, Стокгольма та ринку прибирання.",

    ctaTitle: "Почніть із Clean Jobs",
    ctaText:
      "Clean Jobs допомагає працівникам, клієнтам і клінінговим компаніям з’єднуватися через спеціалізований маркетплейс для клінінгових послуг і роботи з прибирання у Швеції.",
    ctaBrowse: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа в Швеции 2026 | Вакансии, клининг и гид",
    metaDescription:
      "Полный гид, как найти работу в Швеции в 2026 году. Клининг, работа для иностранцев, Стокгольм, частичная и полная занятость.",
    metaOgTitle: "Работа в Швеции 2026 | Clean Jobs",
    metaOgDescription:
      "Гид по работе в Швеции: клининг, работа для иностранцев, города и практические советы.",
    metaOgAlt: "Работа в Швеции 2026",

    faqOneQuestion: "Как Clean Jobs может помочь?",
    faqOneAnswer:
      "Clean Jobs соединяет людей, которым нужны услуги уборки, с уборщиками и клининговыми компаниями, которые ищут работу.",
    faqTwoQuestion: "Clean Jobs только для работы по уборке?",
    faqTwoAnswer:
      "Clean Jobs фокусируется на работе по уборке, но гайды также помогают людям понять возможности в сервисном секторе Швеции.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Работа в Швеции: вакансии, клининг и практические советы на 2026",
    heroText:
      "В Швеции есть спрос на надёжных работников в клининге, facility services, отелях, ресторанах, складах, строительстве и домашних сервисах. Этот гид объясняет, как найти работу в Швеции и как Clean Jobs помогает клиентам, уборщикам и клининговым компаниям быстрее находить друг друга.",
    browseJobs: "Смотреть работы по уборке",
    postJob: "Опубликовать работу по уборке",

    guideEyebrow: "Гид",
    guideTitle: "Как найти работу в Швеции",
    guideText1:
      "Если вы ищете работу в Швеции, начните с выбора типа работы, который соответствует вашим навыкам, уровню языка и графику. Многие начинают с сервиса, клининга, складов, строительной помощи, ресторанов, доставки или отелей.",
    guideText2:
      "Хорошая стратегия — подготовить простое CV, держать телефон и email активными, быстро отвечать на сообщения и подаваться на несколько вакансий каждую неделю. Если вас интересует клининг, Clean Jobs даёт специализированный маркетплейс для поиска работ и построения доверия через профиль.",

    cleaningEyebrow: "Клининг",
    cleaningTitle: "Работа по уборке в Швеции",
    cleaningText1:
      "Работа по уборке в Швеции может включать уборку дома, квартиры, офиса, после переезда, генеральную и регулярную уборку. Клиенты обычно ценят надёжность, понятную коммуникацию, пунктуальность и качество.",
    cleaningText2:
      "Клининг также полезен для компаний, которым нужны дополнительные работники, подрядчики или новые клиенты. Clean Jobs помогает соединить людей, которым нужна уборка, с теми, кто готов работать.",

    citiesEyebrow: "Города",
    citiesTitle: "Лучшие города для работы в Швеции",
    citiesText1:
      "Крупнейшие рынки труда обычно в Стокгольме, Гётеборге и Мальмё, но много возможностей также есть в Уппсале, Вестеросе, Эребру, Линчёпинге, Хельсингборге, Лунде и соседних коммунах.",
    citiesText2:
      "Если вы живёте рядом со Стокгольмом, стоит искать работы по уборке также в Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge и Botkyrka.",

    foreignersEyebrow: "Иностранные работники",
    foreignersTitle: "Работа в Швеции для иностранцев",
    foreignersText1:
      "Многие иностранцы ищут работу в Швеции, пока ещё учат шведский. Некоторые работы требуют свободного шведского, но сервисные роли иногда возможны с английским, базовым шведским или другим общим языком.",
    foreignersText2:
      "Чтобы повысить шансы, создайте профиль с вашим именем, городом, телефоном и опытом. Добавьте профессиональное фото или логотип компании, если есть.",

    topicsTitle: "SEO-поисковые темы",
    topicsText:
      "Эта страница естественно построена вокруг релевантных поисковых фраз для работы, клининга, Швеции, Стокгольма и рынка уборки.",

    ctaTitle: "Начните с Clean Jobs",
    ctaText:
      "Clean Jobs помогает работникам, клиентам и клининговым компаниям соединяться через специализированный маркетплейс для клининговых услуг и работы по уборке в Швеции.",
    ctaBrowse: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
    metaDescription:
      "Complete guide to finding work in Sweden in 2026. Learn about cleaning jobs, jobs for foreigners, Stockholm jobs, part-time work, full-time work and how Clean Jobs helps workers and companies connect.",
    metaOgTitle: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",
    metaOgDescription:
      "Complete guide to finding work in Sweden in 2026. Learn about cleaning jobs, jobs for foreigners, Stockholm jobs, part-time work, full-time work and how Clean Jobs helps workers and companies connect.",
    metaOgAlt: "Work in Sweden 2026 | Jobs, Cleaning Work & Hiring Guide",

    faqOneQuestion: "How can Clean Jobs help?",
    faqOneAnswer:
      "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
    faqTwoQuestion: "Is Clean Jobs only for cleaning work?",
    faqTwoAnswer:
      "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Work in Sweden: jobs, cleaning work and practical advice for 2026",
    heroText:
      "Sweden has a strong service economy with demand for reliable workers in cleaning, facility services, hotels, restaurants, warehouses, construction and home services. This guide explains how to find work in Sweden and how Clean Jobs helps clients, cleaners and cleaning companies connect faster.",
    browseJobs: "Browse cleaning jobs",
    postJob: "Post a cleaning job",

    guideEyebrow: "Guide",
    guideTitle: "How to find work in Sweden",
    guideText1:
      "If you are searching for jobs in Sweden, start by choosing the type of work that matches your skills, language level and schedule. Many people begin with service jobs, cleaning jobs, warehouse jobs, construction support, restaurant work, delivery work or hotel jobs.",
    guideText2:
      "A good strategy is to prepare a simple CV, keep your phone number and email active, respond quickly to messages and apply to several jobs every week. If you are interested in cleaning work, Clean Jobs gives you a focused marketplace where you can browse cleaning jobs and build trust through your profile.",

    cleaningEyebrow: "Cleaning work",
    cleaningTitle: "Cleaning jobs in Sweden",
    cleaningText1:
      "Cleaning jobs in Sweden can include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and regular recurring cleaning. Clients usually care about reliability, clear communication, punctuality and quality.",
    cleaningText2:
      "Cleaning work is also useful for cleaning companies that need extra workers, subcontractors or new clients. A marketplace like Clean Jobs helps connect people who need cleaning with people who are ready to work.",

    citiesEyebrow: "Cities",
    citiesTitle: "Best cities for jobs in Sweden",
    citiesText1:
      "The biggest job markets are usually found in Stockholm, Gothenburg and Malmö, but many opportunities also exist in Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund and surrounding commuter towns.",
    citiesText2:
      "If you live near Stockholm, it can be useful to search for cleaning jobs in several nearby areas, including Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge and Botkyrka.",

    foreignersEyebrow: "Foreign workers",
    foreignersTitle: "Jobs in Sweden for foreigners",
    foreignersText1:
      "Many foreigners search for work in Sweden while they are still learning Swedish. Some jobs require fluent Swedish, but service roles can sometimes work with English, basic Swedish or another shared language.",
    foreignersText2:
      "To increase your chances, create a profile with your name, city, phone number and experience. Add a professional photo or company logo if you have one.",

    topicsTitle: "SEO search topics",
    topicsText:
      "This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.",

    ctaTitle: "Start with Clean Jobs",
    ctaText:
      "Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.",
    ctaBrowse: "Browse jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Arbeta i Sverige 2026 | Jobb, städarbete och guide",
    metaDescription:
      "Komplett guide till att hitta arbete i Sverige 2026. Läs om städjobb, jobb för utlänningar, Stockholm, deltidsjobb och heltidsjobb.",
    metaOgTitle: "Arbeta i Sverige 2026 | Clean Jobs",
    metaOgDescription:
      "Guide till arbete i Sverige: städjobb, jobb för utlänningar, städer och praktiska tips.",
    metaOgAlt: "Arbeta i Sverige 2026",

    faqOneQuestion: "Hur kan Clean Jobs hjälpa?",
    faqOneAnswer:
      "Clean Jobs kopplar ihop personer som behöver städtjänster med städare och städföretag som söker arbete.",
    faqTwoQuestion: "Är Clean Jobs bara för städarbete?",
    faqTwoAnswer:
      "Clean Jobs fokuserar på städarbete, men guidesidorna hjälper också personer att förstå möjligheter i Sveriges servicesektor.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Arbeta i Sverige: jobb, städarbete och praktiska råd för 2026",
    heroText:
      "Sverige har en stark serviceekonomi med efterfrågan på pålitliga arbetare inom städning, facility services, hotell, restaurang, lager, bygg och hemservice. Den här guiden förklarar hur du hittar arbete i Sverige och hur Clean Jobs hjälper kunder, städare och städföretag att mötas snabbare.",
    browseJobs: "Bläddra bland städjobb",
    postJob: "Lägg upp städjobb",

    guideEyebrow: "Guide",
    guideTitle: "Så hittar du arbete i Sverige",
    guideText1:
      "Om du söker jobb i Sverige, börja med att välja en typ av arbete som passar dina färdigheter, språknivå och schema. Många börjar med servicejobb, städjobb, lagerjobb, byggstöd, restaurangarbete, leveransarbete eller hotelljobb.",
    guideText2:
      "En bra strategi är att förbereda ett enkelt CV, hålla telefonnummer och e-post aktiva, svara snabbt på meddelanden och söka flera jobb varje vecka. Om du är intresserad av städarbete ger Clean Jobs dig en fokuserad marknadsplats där du kan bläddra bland städjobb och bygga förtroende genom din profil.",

    cleaningEyebrow: "Städarbete",
    cleaningTitle: "Städjobb i Sverige",
    cleaningText1:
      "Städjobb i Sverige kan vara hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, storstädning och regelbunden återkommande städning. Kunder bryr sig ofta om pålitlighet, tydlig kommunikation, punktlighet och kvalitet.",
    cleaningText2:
      "Städarbete är också användbart för städföretag som behöver extra arbetare, underleverantörer eller nya kunder. Clean Jobs hjälper till att koppla ihop personer som behöver städning med personer som är redo att arbeta.",

    citiesEyebrow: "Städer",
    citiesTitle: "Bästa städerna för jobb i Sverige",
    citiesText1:
      "De största arbetsmarknaderna finns vanligtvis i Stockholm, Göteborg och Malmö, men många möjligheter finns också i Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund och omgivande pendlingsorter.",
    citiesText2:
      "Om du bor nära Stockholm kan det vara användbart att söka städjobb i flera närliggande områden, inklusive Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge och Botkyrka.",

    foreignersEyebrow: "Utländska arbetare",
    foreignersTitle: "Jobb i Sverige för utlänningar",
    foreignersText1:
      "Många utlänningar söker arbete i Sverige medan de fortfarande lär sig svenska. Vissa jobb kräver flytande svenska, men serviceroller kan ibland fungera med engelska, grundläggande svenska eller ett annat gemensamt språk.",
    foreignersText2:
      "För att öka dina chanser, skapa en profil med namn, stad, telefonnummer och erfarenhet. Lägg till en professionell bild eller företagslogotyp om du har en.",

    topicsTitle: "SEO-sökämnen",
    topicsText:
      "Den här sidan är skriven naturligt kring de mest relevanta jobb- och städsökfraserna för Sverige, Stockholm och städmarknaden.",

    ctaTitle: "Börja med Clean Jobs",
    ctaText:
      "Clean Jobs hjälper arbetare, kunder och städföretag att mötas via en fokuserad marknadsplats för städtjänster och städarbete i Sverige.",
    ctaBrowse: "Bläddra bland jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Praca w Szwecji 2026 | Oferty, sprzątanie i poradnik",
    metaDescription:
      "Kompletny poradnik, jak znaleźć pracę w Szwecji w 2026 roku. Sprzątanie, praca dla obcokrajowców, Sztokholm, część etatu i pełny etat.",
    metaOgTitle: "Praca w Szwecji 2026 | Clean Jobs",
    metaOgDescription:
      "Poradnik o pracy w Szwecji: sprzątanie, praca dla obcokrajowców, miasta i praktyczne wskazówki.",
    metaOgAlt: "Praca w Szwecji 2026",

    faqOneQuestion: "Jak Clean Jobs może pomóc?",
    faqOneAnswer:
      "Clean Jobs łączy osoby, które potrzebują usług sprzątania, ze sprzątaczami i firmami sprzątającymi szukającymi pracy.",
    faqTwoQuestion: "Czy Clean Jobs jest tylko dla pracy sprzątania?",
    faqTwoAnswer:
      "Clean Jobs skupia się na pracy sprzątania, ale poradniki pomagają też zrozumieć możliwości w szwedzkim sektorze usług.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Praca w Szwecji: oferty, sprzątanie i praktyczne porady na 2026",
    heroText:
      "Szwecja ma silną gospodarkę usługową z popytem na niezawodnych pracowników w sprzątaniu, facility services, hotelach, restauracjach, magazynach, budownictwie i usługach domowych. Ten poradnik wyjaśnia, jak znaleźć pracę w Szwecji i jak Clean Jobs pomaga klientom, sprzątaczom oraz firmom sprzątającym szybciej się połączyć.",
    browseJobs: "Przeglądaj prace sprzątania",
    postJob: "Dodaj pracę sprzątania",

    guideEyebrow: "Poradnik",
    guideTitle: "Jak znaleźć pracę w Szwecji",
    guideText1:
      "Jeśli szukasz pracy w Szwecji, zacznij od wyboru typu pracy, który pasuje do Twoich umiejętności, poziomu języka i grafiku. Wiele osób zaczyna od usług, sprzątania, magazynów, pomocy budowlanej, restauracji, dostaw albo hoteli.",
    guideText2:
      "Dobra strategia to przygotować proste CV, mieć aktywny telefon i email, szybko odpowiadać na wiadomości i aplikować na kilka prac każdego tygodnia. Jeśli interesuje Cię sprzątanie, Clean Jobs daje wyspecjalizowany marketplace, gdzie możesz przeglądać prace i budować zaufanie przez profil.",

    cleaningEyebrow: "Sprzątanie",
    cleaningTitle: "Prace sprzątania w Szwecji",
    cleaningText1:
      "Prace sprzątania w Szwecji mogą obejmować sprzątanie domu, mieszkania, biura, po przeprowadzce, sprzątanie generalne i regularne sprzątanie. Klienci zwykle cenią niezawodność, jasną komunikację, punktualność i jakość.",
    cleaningText2:
      "Sprzątanie jest też użyteczne dla firm sprzątających, które potrzebują dodatkowych pracowników, podwykonawców albo nowych klientów. Clean Jobs pomaga łączyć osoby, które potrzebują sprzątania, z osobami gotowymi do pracy.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Najlepsze miasta do pracy w Szwecji",
    citiesText1:
      "Największe rynki pracy zwykle znajdują się w Sztokholmie, Göteborgu i Malmö, ale wiele możliwości jest też w Uppsali, Västerås, Örebro, Linköping, Helsingborgu, Lund i pobliskich miejscowościach dojazdowych.",
    citiesText2:
      "Jeśli mieszkasz blisko Sztokholmu, warto szukać prac sprzątania w kilku pobliskich obszarach, takich jak Solna, Sundbyberg, Täby, Järfälla, Nacka, Huddinge i Botkyrka.",

    foreignersEyebrow: "Pracownicy z zagranicy",
    foreignersTitle: "Praca w Szwecji dla obcokrajowców",
    foreignersText1:
      "Wielu obcokrajowców szuka pracy w Szwecji, nadal ucząc się szwedzkiego. Niektóre prace wymagają płynnego szwedzkiego, ale role usługowe czasem są możliwe z angielskim, podstawowym szwedzkim albo innym wspólnym językiem.",
    foreignersText2:
      "Aby zwiększyć szanse, utwórz profil z imieniem, miastem, numerem telefonu i doświadczeniem. Dodaj profesjonalne zdjęcie albo logo firmy, jeśli je masz.",

    topicsTitle: "Tematy wyszukiwania SEO",
    topicsText:
      "Ta strona jest napisana naturalnie wokół najważniejszych fraz wyszukiwania dotyczących pracy, sprzątania, Szwecji, Sztokholmu i rynku sprzątania.",

    ctaTitle: "Zacznij z Clean Jobs",
    ctaText:
      "Clean Jobs pomaga pracownikom, klientom i firmom sprzątającym łączyć się przez wyspecjalizowany marketplace dla usług sprzątania i pracy sprzątania w Szwecji.",
    ctaBrowse: "Przeglądaj prace",
    createAccount: "Utwórz konto",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/work-in-sweden",
    },
    keywords: topics,
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/work-in-sweden`,
      siteName: "Clean Jobs",
      type: "article",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: t.metaOgAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      images: ["/og-image.png"],
    },
  }
}

function createFaqJsonLd(t: (typeof copy)[Locale]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: t.faqOneQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqOneAnswer } },
      { "@type": "Question", name: t.faqTwoQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqTwoAnswer } },
    ],
  }
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
        {children}
      </div>
    </section>
  )
}

export default async function SeoLandingPage() {
  const locale = await getLocale()
  const t = copy[locale]
  const faqJsonLd = createFaqJsonLd(t)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <section className="rounded-[36px] border border-slate-200 bg-gradient-to-br from-white via-white to-rose-50/50 p-6 shadow-[0_2px_14px_rgba(15,23,42,0.04)] md:p-10">
          <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            {t.heroEyebrow}
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
            {t.heroTitle}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            {t.heroText}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
              {t.browseJobs}
            </Link>

            <Link href="/jobs/create" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]">
              {t.postJob}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow={t.guideEyebrow} title={t.guideTitle}>
            <p>{t.guideText1}</p>
            <p>{t.guideText2}</p>
          </Section>

          <Section eyebrow={t.cleaningEyebrow} title={t.cleaningTitle}>
            <p>{t.cleaningText1}</p>
            <p>{t.cleaningText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
          </Section>

          <Section eyebrow={t.foreignersEyebrow} title={t.foreignersTitle}>
            <p>{t.foreignersText1}</p>
            <p>{t.foreignersText2}</p>
          </Section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t.topicsTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t.topicsText}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {topics.map((topic) => (
                <span key={topic} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {t.ctaTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              {t.ctaText}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
                {t.ctaBrowse}
              </Link>

              <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">
                {t.createAccount}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/work-in-sweden" />
        </div>
      </main>
    </div>
  )
}