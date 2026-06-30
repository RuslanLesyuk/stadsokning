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
  "städjobb Stockholm",
  "städare jobb Stockholm",
  "hemstädning jobb Stockholm",
  "kontorsstädning jobb Stockholm",
  "flyttstädning jobb Stockholm",
  "extrajobb städning Stockholm",
  "deltidsjobb städning",
  "städfirma Stockholm jobb",
]

const copy = {
  uk: {
    metaTitle: "Робота з прибирання в Стокгольмі 2026 | Clean Jobs",
    metaDescription:
      "Знайдіть роботу з прибирання в Стокгольмі. Гід по прибиранню дому, офісу, після переїзду, підробітку та роботі прибиральником.",
    metaOgTitle: "Робота з прибирання в Стокгольмі | Clean Jobs",
    metaOgDescription:
      "Знайдіть роботу прибиральником у Стокгольмі або найміть прибиральника для дому, офісу чи прибирання після переїзду.",
    metaOgAlt: "Робота з прибирання в Стокгольмі",

    faqOneQuestion: "Як Clean Jobs може допомогти?",
    faqOneAnswer:
      "Clean Jobs з’єднує людей, яким потрібні послуги прибирання, з прибиральниками та клінінговими компаніями, які шукають роботу.",
    faqTwoQuestion: "Clean Jobs тільки для роботи з прибирання?",
    faqTwoAnswer:
      "Clean Jobs фокусується на роботі з прибирання, але гіди також допомагають краще зрозуміти можливості в сервісному секторі Швеції.",

    heroEyebrow: "Робота з прибирання в Стокгольмі",
    heroTitle:
      "Робота з прибирання в Стокгольмі: знайдіть роботу або найміть допомогу",
    heroText:
      "У Стокгольмі є великий попит на прибиральників для дому, офісу, після переїзду та регулярних замовлень. Clean Jobs допомагає працівникам, приватним клієнтам і клінінговим компаніям простіше знаходити одне одного.",
    findJobs: "Знайти роботи з прибирання",
    postJob: "Опублікувати роботу з прибирання",

    guideEyebrow: "Гід",
    guideTitle: "Що таке робота з прибирання в Стокгольмі?",
    guideText1:
      "Робота з прибирання в Стокгольмі може бути коротким завданням у квартирі, регулярним прибиранням дому, прибиранням офісу, після переїзду або допомогою після ремонту.",
    guideText2:
      "Щоб отримувати більше замовлень, важливо чітко показати, у яких районах ви можете працювати, коли доступні та який тип прибирання маєте досвід виконувати.",

    typesEyebrow: "Типи робіт",
    typesTitle: "Поширені роботи з прибирання в Стокгольмі",
    typesText1:
      "Найпоширеніші завдання — прибирання дому, квартири, офісу, після переїзду, після ремонту, генеральне та регулярне прибирання.",
    typesText2:
      "Клінінгові компанії можуть використовувати Clean Jobs, щоб показати компанію, знаходити нових клієнтів і отримувати більше запитів без залежності лише від власної реклами або рекомендацій.",

    areasEyebrow: "Райони",
    areasTitle: "Шукайте роботи з прибирання по всьому Стокгольмському регіону",
    areasText1:
      "Варто шукати не лише в центрі Стокгольма. Часто є замовлення в Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge і Botkyrka.",
    areasText2:
      "Клієнти цінують, коли прибиральник чітко пише, де може працювати. Якщо ви працюєте тільки в одному районі — вкажіть це. Якщо можете їздити — також додайте це в профіль.",

    clientsEyebrow: "Для клієнтів",
    clientsTitle: "Як знайти правильного прибиральника в Стокгольмі",
    clientsText1:
      "Коли ви публікуєте роботу з прибирання, опишіть розмір житла, тип прибирання, бажану дату, бюджет і чи є матеріали на місці.",
    clientsText2:
      "Clean Jobs спрощує контакт із прибиральниками та компаніями, які активно шукають замовлення. Ви можете опублікувати роботу, відкрити чат і вибрати людину або фірму, яка підходить найкраще.",

    topicsTitle: "SEO-пошукові теми",
    topicsText:
      "Ця сторінка природно побудована навколо релевантних пошукових фраз для роботи, клінінгу, Стокгольма та ринку прибирання.",

    ctaTitle: "Почніть із Clean Jobs",
    ctaText:
      "Clean Jobs допомагає працівникам, клієнтам і клінінговим компаніям з’єднуватися через спеціалізований маркетплейс для послуг прибирання у Швеції.",
    browseJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа по уборке в Стокгольме 2026 | Clean Jobs",
    metaDescription:
      "Найдите работу по уборке в Стокгольме. Гид по уборке дома, офиса, после переезда, подработке и работе уборщиком.",
    metaOgTitle: "Работа по уборке в Стокгольме | Clean Jobs",
    metaOgDescription:
      "Найдите работу уборщиком в Стокгольме или наймите уборщика для дома, офиса и уборки после переезда.",
    metaOgAlt: "Работа по уборке в Стокгольме",

    faqOneQuestion: "Как Clean Jobs может помочь?",
    faqOneAnswer:
      "Clean Jobs соединяет людей, которым нужны услуги уборки, с уборщиками и клининговыми компаниями, которые ищут работу.",
    faqTwoQuestion: "Clean Jobs только для работы по уборке?",
    faqTwoAnswer:
      "Clean Jobs фокусируется на работе по уборке, но гайды также помогают лучше понять возможности в сервисном секторе Швеции.",

    heroEyebrow: "Работа по уборке в Стокгольме",
    heroTitle:
      "Работа по уборке в Стокгольме: найдите работу или наймите помощь",
    heroText:
      "В Стокгольме есть большой спрос на уборщиков для дома, офиса, уборки после переезда и регулярных заказов. Clean Jobs помогает работникам, частным клиентам и клининговым компаниям проще находить друг друга.",
    findJobs: "Найти работы по уборке",
    postJob: "Опубликовать работу по уборке",

    guideEyebrow: "Гид",
    guideTitle: "Что такое работа по уборке в Стокгольме?",
    guideText1:
      "Работа по уборке в Стокгольме может быть коротким заданием в квартире, регулярной уборкой дома, уборкой офиса, после переезда или помощью после ремонта.",
    guideText2:
      "Чтобы получать больше заказов, важно чётко показать, в каких районах вы можете работать, когда доступны и какой тип уборки умеете выполнять.",

    typesEyebrow: "Типы работ",
    typesTitle: "Распространённые работы по уборке в Стокгольме",
    typesText1:
      "Самые распространённые задания — уборка дома, квартиры, офиса, после переезда, после ремонта, генеральная и регулярная уборка.",
    typesText2:
      "Клининговые компании могут использовать Clean Jobs, чтобы показывать компанию, находить новых клиентов и получать больше запросов без зависимости только от собственной рекламы или рекомендаций.",

    areasEyebrow: "Районы",
    areasTitle: "Ищите работы по уборке по всему Стокгольмскому региону",
    areasText1:
      "Стоит искать не только в центре Стокгольма. Часто есть заказы в Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge и Botkyrka.",
    areasText2:
      "Клиенты ценят, когда уборщик чётко пишет, где может работать. Если вы работаете только в одном районе — укажите это. Если можете ездить — также добавьте это в профиль.",

    clientsEyebrow: "Для клиентов",
    clientsTitle: "Как найти подходящего уборщика в Стокгольме",
    clientsText1:
      "Когда вы публикуете работу по уборке, опишите размер жилья, тип уборки, желаемую дату, бюджет и есть ли материалы на месте.",
    clientsText2:
      "Clean Jobs упрощает контакт с уборщиками и компаниями, которые активно ищут заказы. Вы можете опубликовать работу, открыть чат и выбрать человека или фирму, которая подходит лучше всего.",

    topicsTitle: "SEO-поисковые темы",
    topicsText:
      "Эта страница естественно построена вокруг релевантных поисковых фраз для работы, клининга, Стокгольма и рынка уборки.",

    ctaTitle: "Начните с Clean Jobs",
    ctaText:
      "Clean Jobs помогает работникам, клиентам и клининговым компаниям соединяться через специализированный маркетплейс для услуг уборки в Швеции.",
    browseJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaning Jobs Stockholm 2026 | Find Cleaner Work",
    metaDescription:
      "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning, extra work and cleaner jobs in Stockholm.",
    metaOgTitle: "Cleaning Jobs Stockholm | Clean Jobs",
    metaOgDescription:
      "Find cleaning jobs in Stockholm or hire cleaners for home cleaning, office cleaning and move-out cleaning.",
    metaOgAlt: "Cleaning Jobs Stockholm",

    faqOneQuestion: "How can Clean Jobs help?",
    faqOneAnswer:
      "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
    faqTwoQuestion: "Is Clean Jobs only for cleaning work?",
    faqTwoAnswer:
      "Clean Jobs focuses on cleaning work, but the guide pages also help people understand opportunities in Sweden’s service sector.",

    heroEyebrow: "Cleaning jobs Stockholm",
    heroTitle:
      "Cleaning jobs in Stockholm: find cleaner work or hire cleaning help",
    heroText:
      "Stockholm has strong demand for cleaners for home cleaning, office cleaning, move-out cleaning and recurring assignments. Clean Jobs helps workers, private clients and cleaning companies find each other more easily.",
    findJobs: "Find cleaning jobs",
    postJob: "Post cleaning job",

    guideEyebrow: "Guide",
    guideTitle: "What is a cleaning job in Stockholm?",
    guideText1:
      "A cleaning job in Stockholm can be a short assignment in an apartment, recurring home cleaning, office cleaning for a company, move-out cleaning or help after renovation.",
    guideText2:
      "To get more assignments, it is important to be clear about which areas you can work in, when you are available and what type of cleaning experience you have.",

    typesEyebrow: "Work types",
    typesTitle: "Common cleaning jobs in Stockholm",
    typesText1:
      "The most common assignments are home cleaning, apartment cleaning, office cleaning, move-out cleaning, construction cleaning and deep cleaning.",
    typesText2:
      "Cleaning companies can use Clean Jobs to show their company, find new customers and receive more assignments without depending only on their own ads or recommendations.",

    areasEyebrow: "Areas",
    areasTitle: "Search cleaning jobs across the Stockholm area",
    areasText1:
      "It is smart not to search only in central Stockholm. There are often assignments in Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge and Botkyrka.",
    areasText2:
      "Customers appreciate when a cleaner clearly writes where they can work. If you can only work in one area, write that. If you can travel, write that in your profile too.",

    clientsEyebrow: "For clients",
    clientsTitle: "How to find the right cleaner in Stockholm",
    clientsText1:
      "When you post a cleaning job, describe the home size, cleaning type, preferred date, budget and whether materials are available.",
    clientsText2:
      "Clean Jobs makes it easier to contact cleaners and companies that actively look for assignments. You can post the job, open the chat and choose the person or company that fits best.",

    topicsTitle: "SEO search topics",
    topicsText:
      "This page is written naturally around the most relevant job and cleaning search phrases for Stockholm and the cleaning market.",

    ctaTitle: "Start with Clean Jobs",
    ctaText:
      "Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.",
    browseJobs: "Browse jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Städjobb Stockholm 2026 | Hitta jobb som städare",
    metaDescription:
      "Hitta städjobb i Stockholm. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Stockholm.",
    metaOgTitle: "Städjobb Stockholm | Clean Jobs",
    metaOgDescription:
      "Hitta städjobb i Stockholm eller anlita städare för hemstädning, kontorsstädning och flyttstädning.",
    metaOgAlt: "Städjobb Stockholm",

    faqOneQuestion: "Hur kan Clean Jobs hjälpa?",
    faqOneAnswer:
      "Clean Jobs kopplar ihop personer som behöver städtjänster med städare och städföretag som söker arbete.",
    faqTwoQuestion: "Är Clean Jobs bara för städarbete?",
    faqTwoAnswer:
      "Clean Jobs fokuserar på städarbete, men guidesidorna hjälper också människor att förstå möjligheter i Sveriges servicesektor.",

    heroEyebrow: "Städjobb Stockholm",
    heroTitle:
      "Städjobb i Stockholm: hitta arbete som städare eller anlita städhjälp",
    heroText:
      "Stockholm har ett stort behov av städare för hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag. Clean Jobs hjälper arbetare, privatpersoner och städfirmor att hitta varandra på ett enklare sätt.",
    findJobs: "Hitta städjobb",
    postJob: "Lägg upp städjobb",

    guideEyebrow: "Guide",
    guideTitle: "Vad är ett städjobb i Stockholm?",
    guideText1:
      "Ett städjobb i Stockholm kan vara ett kort uppdrag i en lägenhet, återkommande hemstädning, kontorsstädning för ett företag, flyttstädning eller hjälp efter renovering.",
    guideText2:
      "För att få fler uppdrag är det viktigt att vara tydlig med vilka områden du kan arbeta i, vilka tider du är tillgänglig och vilken typ av städning du har erfarenhet av.",

    typesEyebrow: "Arbetstyper",
    typesTitle: "Vanliga städjobb i Stockholm",
    typesText1:
      "De vanligaste uppdragen är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, byggstädning och storstädning.",
    typesText2:
      "Städfirmor kan använda Clean Jobs för att visa sitt företag, hitta nya kunder och få fler uppdrag utan att vara beroende av endast egna annonser eller rekommendationer.",

    areasEyebrow: "Områden",
    areasTitle: "Sök städjobb i hela Stockholmsområdet",
    areasText1:
      "Det är klokt att inte bara söka i centrala Stockholm. Det finns ofta uppdrag i Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge och Botkyrka.",
    areasText2:
      "Kunder uppskattar när en städare tydligt skriver var de kan arbeta. Om du bara kan arbeta i ett område, skriv det. Om du kan resa, skriv också det i din profil.",

    clientsEyebrow: "För kunder",
    clientsTitle: "Så hittar du rätt städare i Stockholm",
    clientsText1:
      "När du lägger upp ett städjobb bör du beskriva bostadens storlek, typ av städning, önskat datum, budget och om material finns på plats.",
    clientsText2:
      "Clean Jobs gör det enklare att få kontakt med städare och företag som aktivt söker uppdrag. Du kan lägga upp jobbet, öppna chatten och välja den person eller firma som passar bäst.",

    topicsTitle: "SEO-sökämnen",
    topicsText:
      "Den här sidan är skriven naturligt kring de mest relevanta jobb- och städsökfraserna för Stockholm och städmarknaden.",

    ctaTitle: "Börja med Clean Jobs",
    ctaText:
      "Clean Jobs hjälper arbetare, kunder och städföretag att mötas via en fokuserad marknadsplats för städtjänster och städarbete i Sverige.",
    browseJobs: "Bläddra bland jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Prace sprzątania Sztokholm 2026 | Clean Jobs",
    metaDescription:
      "Znajdź prace sprzątania w Sztokholmie. Poradnik o sprzątaniu domu, biura, po przeprowadzce, pracy dodatkowej i pracy jako sprzątacz.",
    metaOgTitle: "Prace sprzątania Sztokholm | Clean Jobs",
    metaOgDescription:
      "Znajdź prace sprzątania w Sztokholmie albo zatrudnij sprzątacza do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Prace sprzątania Sztokholm",

    faqOneQuestion: "Jak Clean Jobs może pomóc?",
    faqOneAnswer:
      "Clean Jobs łączy osoby, które potrzebują usług sprzątania, ze sprzątaczami i firmami sprzątającymi szukającymi pracy.",
    faqTwoQuestion: "Czy Clean Jobs jest tylko dla pracy sprzątania?",
    faqTwoAnswer:
      "Clean Jobs skupia się na pracy sprzątania, ale strony poradnikowe pomagają też zrozumieć możliwości w szwedzkim sektorze usług.",

    heroEyebrow: "Prace sprzątania Sztokholm",
    heroTitle:
      "Prace sprzątania w Sztokholmie: znajdź pracę albo zatrudnij pomoc",
    heroText:
      "W Sztokholmie jest duży popyt na sprzątaczy do sprzątania domu, biura, po przeprowadzce i regularnych zleceń. Clean Jobs pomaga pracownikom, klientom prywatnym i firmom sprzątającym łatwiej znaleźć się nawzajem.",
    findJobs: "Znajdź prace sprzątania",
    postJob: "Dodaj pracę sprzątania",

    guideEyebrow: "Poradnik",
    guideTitle: "Czym jest praca sprzątania w Sztokholmie?",
    guideText1:
      "Praca sprzątania w Sztokholmie może być krótkim zleceniem w mieszkaniu, regularnym sprzątaniem domu, sprzątaniem biura, po przeprowadzce albo pomocą po remoncie.",
    guideText2:
      "Aby zdobywać więcej zleceń, ważne jest jasne pokazanie, w jakich obszarach możesz pracować, kiedy jesteś dostępny i jakie masz doświadczenie w sprzątaniu.",

    typesEyebrow: "Typy pracy",
    typesTitle: "Popularne prace sprzątania w Sztokholmie",
    typesText1:
      "Najczęstsze zlecenia to sprzątanie domu, mieszkania, biura, po przeprowadzce, po budowie i sprzątanie generalne.",
    typesText2:
      "Firmy sprzątające mogą używać Clean Jobs, aby pokazać firmę, znaleźć nowych klientów i otrzymywać więcej zleceń bez zależności tylko od własnych reklam lub poleceń.",

    areasEyebrow: "Obszary",
    areasTitle: "Szukaj prac sprzątania w całym regionie Sztokholmu",
    areasText1:
      "Warto szukać nie tylko w centrum Sztokholmu. Często są zlecenia w Solna, Sundbyberg, Nacka, Täby, Järfälla, Sollentuna, Huddinge i Botkyrka.",
    areasText2:
      "Klienci doceniają, gdy sprzątacz jasno pisze, gdzie może pracować. Jeśli możesz pracować tylko w jednym obszarze — napisz to. Jeśli możesz dojeżdżać — dodaj to też w profilu.",

    clientsEyebrow: "Dla klientów",
    clientsTitle: "Jak znaleźć właściwego sprzątacza w Sztokholmie",
    clientsText1:
      "Kiedy dodajesz pracę sprzątania, opisz wielkość mieszkania, typ sprzątania, preferowaną datę, budżet i czy materiały są dostępne na miejscu.",
    clientsText2:
      "Clean Jobs ułatwia kontakt ze sprzątaczami i firmami, które aktywnie szukają zleceń. Możesz dodać pracę, otworzyć czat i wybrać osobę lub firmę, która pasuje najlepiej.",

    topicsTitle: "Tematy wyszukiwania SEO",
    topicsText:
      "Ta strona jest napisana naturalnie wokół najważniejszych fraz wyszukiwania dotyczących pracy, sprzątania, Sztokholmu i rynku sprzątania.",

    ctaTitle: "Zacznij z Clean Jobs",
    ctaText:
      "Clean Jobs pomaga pracownikom, klientom i firmom sprzątającym łączyć się przez wyspecjalizowany marketplace dla usług sprzątania w Szwecji.",
    browseJobs: "Przeglądaj prace",
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
      canonical: "/stadjobb-stockholm",
    },
    keywords: topics,
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/stadjobb-stockholm`,
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

function Section({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      {eyebrow ? <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">{eyebrow}</div> : null}
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">{children}</div>
    </section>
  )
}

export default async function StadjobbStockholmPage() {
  const locale = await getLocale()
  const t = copy[locale]
  const faqJsonLd = createFaqJsonLd(t)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />

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
            <Link href="/jobs?city=Stockholm" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
              {t.findJobs}
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

          <Section eyebrow={t.typesEyebrow} title={t.typesTitle}>
            <p>{t.typesText1}</p>
            <p>{t.typesText2}</p>
          </Section>

          <Section eyebrow={t.areasEyebrow} title={t.areasTitle}>
            <p>{t.areasText1}</p>
            <p>{t.areasText2}</p>
          </Section>

          <Section eyebrow={t.clientsEyebrow} title={t.clientsTitle}>
            <p>{t.clientsText1}</p>
            <p>{t.clientsText2}</p>
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
              <Link href="/jobs?city=Stockholm" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
                {t.browseJobs}
              </Link>

              <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">
                {t.createAccount}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/stadjobb-stockholm" />
        </div>
      </main>
    </div>
  )
}