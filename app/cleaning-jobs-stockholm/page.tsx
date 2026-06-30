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
  "cleaning jobs Stockholm",
  "cleaner jobs Stockholm",
  "home cleaning jobs Stockholm",
  "office cleaning jobs Stockholm",
  "move out cleaning Stockholm",
  "part time cleaning jobs Stockholm",
  "cleaning work Stockholm",
  "hire cleaner Stockholm",
]

const copy = {
  uk: {
    metaTitle: "Робота з прибирання в Стокгольмі 2026 | Clean Jobs",
    metaDescription:
      "Знайдіть роботу з прибирання в Стокгольмі. Гід по прибиранню дому, офісу, після переїзду та роботі прибиральником у Stockholm і поруч.",
    metaOgTitle: "Робота з прибирання в Стокгольмі | Clean Jobs",
    metaOgDescription:
      "Знайдіть роботу прибиральником у Стокгольмі або найміть надійних прибиральників для дому, офісу й прибирання після переїзду.",
    metaOgAlt: "Робота з прибирання в Стокгольмі",

    faqHelpQuestion: "Як Clean Jobs може допомогти?",
    faqHelpAnswer:
      "Clean Jobs з’єднує людей, яким потрібні послуги прибирання, з прибиральниками та клінінговими компаніями, які шукають роботу.",
    faqOnlyQuestion: "Clean Jobs тільки для роботи з прибирання?",
    faqOnlyAnswer:
      "Clean Jobs фокусується на роботі з прибирання, але люди, які шукають роботу у Швеції загалом, також можуть використовувати гіди, щоб краще зрозуміти можливості в сервісному секторі.",

    heroEyebrow: "Clean Jobs",
    heroTitle:
      "Робота з прибирання в Стокгольмі: знайдіть роботу або найміть надійних прибиральників",
    heroText:
      "Стокгольм має один із найсильніших ринків роботи з прибирання у Швеції. Приватні доми, квартири, офіси, магазини й орендна нерухомість часто потребують надійних прибиральників для разових і регулярних робіт. Clean Jobs допомагає прибиральникам, клієнтам і клінінговим компаніям знаходити одне одного в одному місці.",
    browseStockholmJobs: "Переглянути роботи в Стокгольмі",
    postCleaningJob: "Опублікувати роботу з прибирання",

    overviewEyebrow: "Огляд",
    overviewTitle: "Чому Стокгольм сильний для роботи з прибирання",
    overviewText1:
      "Стокгольм — великий міський регіон із багатьма квартирами, офісами, бізнесами та переїздами. Це створює стабільний попит на прибирання дому, офісу, генеральне прибирання та прибирання після переїзду.",
    overviewText2:
      "Багато клієнтів віддають перевагу прибиральникам із чіткими профілями, надійною комунікацією та видимим досвідом. Профіль на маркетплейсі допомагає клієнтам зрозуміти, хто ви і які роботи з прибирання ви приймаєте.",

    typesEyebrow: "Типи робіт",
    typesTitle: "Поширені роботи з прибирання в Стокгольмі",
    typesText1:
      "Найпоширеніші роботи з прибирання в Стокгольмі включають прибирання квартир, будинків, офісів, сходів, після переїзду та регулярне щотижневе прибирання.",
    typesText2:
      "Клінінгові компанії також можуть використовувати Clean Jobs, щоб знаходити додаткові роботи, отримувати запити від нових клієнтів і показувати назву компанії, верифікацію та premium-інформацію профілю.",

    areasEyebrow: "Райони",
    areasTitle: "Райони біля Стокгольма, де прибиральники можуть знайти роботу",
    areasText1:
      "Якщо ви шукаєте роботу з прибирання в Стокгольмі, також розглядайте сусідні райони й комуни для поїздок: Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge і Botkyrka.",
    areasText2:
      "Прибиральники, які можуть їздити між кількома районами, мають більше шансів знайти регулярну роботу й будувати довгострокові відносини з клієнтами.",

    clientsEyebrow: "Для клієнтів",
    clientsTitle: "Як найняти прибиральника в Стокгольмі",
    clientsText1:
      "Якщо вам потрібен прибиральник у Стокгольмі, створіть чітке оголошення з містом, районом адреси, бюджетом, датою, часом і описом. Вкажіть тип прибирання та чи це разова або регулярна робота.",
    clientsText2:
      "Clean Jobs створений для приватних клієнтів і клінінгових компаній. Ви можете опублікувати роботу, отримати інтерес від прибиральників і продовжити розмову через сторінку роботи та чат.",

    topicsTitle: "SEO-пошукові теми",
    topicsText:
      "Ця сторінка написана природно навколо найрелевантніших пошукових фраз для роботи, прибирання, Швеції, Стокгольма та клінінгового ринку.",

    ctaTitle: "Почніть із Clean Jobs",
    ctaText:
      "Clean Jobs допомагає працівникам, клієнтам і клінінговим компаніям з’єднуватися через спеціалізований маркетплейс для клінінгових послуг і роботи з прибирання у Швеції.",
    browseJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа по уборке в Стокгольме 2026 | Clean Jobs",
    metaDescription:
      "Найдите работу по уборке в Стокгольме. Гид по уборке дома, офиса, после переезда и работе уборщиком в Stockholm и рядом.",
    metaOgTitle: "Работа по уборке в Стокгольме | Clean Jobs",
    metaOgDescription:
      "Найдите работу уборщиком в Стокгольме или наймите надёжных уборщиков для дома, офиса и уборки после переезда.",
    metaOgAlt: "Работа по уборке в Стокгольме",

    faqHelpQuestion: "Как Clean Jobs может помочь?",
    faqHelpAnswer:
      "Clean Jobs соединяет людей, которым нужны услуги уборки, с уборщиками и клининговыми компаниями, которые ищут работу.",
    faqOnlyQuestion: "Clean Jobs только для работы по уборке?",
    faqOnlyAnswer:
      "Clean Jobs фокусируется на работе по уборке, но люди, которые ищут работу в Швеции в целом, также могут использовать страницы-гиды, чтобы лучше понять возможности в сервисном секторе.",

    heroEyebrow: "Clean Jobs",
    heroTitle:
      "Работа по уборке в Стокгольме: найдите работу или наймите надёжных уборщиков",
    heroText:
      "Стокгольм имеет один из самых сильных рынков работы по уборке в Швеции. Частные дома, квартиры, офисы, магазины и арендная недвижимость часто нуждаются в надёжных уборщиках для разовых и регулярных работ. Clean Jobs помогает уборщикам, клиентам и клининговым компаниям находить друг друга в одном месте.",
    browseStockholmJobs: "Смотреть работы в Стокгольме",
    postCleaningJob: "Опубликовать работу по уборке",

    overviewEyebrow: "Обзор",
    overviewTitle: "Почему Стокгольм силён для работы по уборке",
    overviewText1:
      "Стокгольм — крупный городской регион с большим количеством квартир, офисов, бизнесов и переездов. Это создаёт стабильный спрос на уборку дома, офиса, генеральную уборку и уборку после переезда.",
    overviewText2:
      "Многие клиенты предпочитают уборщиков с понятными профилями, надёжной коммуникацией и видимым опытом. Профиль на маркетплейсе помогает клиентам понять, кто вы и какие работы по уборке вы принимаете.",

    typesEyebrow: "Типы работ",
    typesTitle: "Распространённые работы по уборке в Стокгольме",
    typesText1:
      "Самые распространённые работы по уборке в Стокгольме включают уборку квартир, домов, офисов, лестниц, после переезда и регулярную еженедельную уборку.",
    typesText2:
      "Клининговые компании также могут использовать Clean Jobs, чтобы находить дополнительные работы, получать запросы от новых клиентов и показывать название компании, верификацию и premium-информацию профиля.",

    areasEyebrow: "Районы",
    areasTitle: "Районы рядом со Стокгольмом, где уборщики могут найти работу",
    areasText1:
      "Если вы ищете работу по уборке в Стокгольме, также рассматривайте соседние районы и коммуны для поездок: Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge и Botkyrka.",
    areasText2:
      "Уборщики, которые могут ездить между несколькими районами, имеют больше шансов найти регулярную работу и строить долгосрочные отношения с клиентами.",

    clientsEyebrow: "Для клиентов",
    clientsTitle: "Как нанять уборщика в Стокгольме",
    clientsText1:
      "Если вам нужен уборщик в Стокгольме, создайте понятное объявление с городом, районом адреса, бюджетом, датой, временем и описанием. Укажите тип уборки и является ли работа разовой или регулярной.",
    clientsText2:
      "Clean Jobs создан для частных клиентов и клининговых компаний. Вы можете опубликовать работу, получить интерес от уборщиков и продолжить разговор через страницу работы и чат.",

    topicsTitle: "SEO-поисковые темы",
    topicsText:
      "Эта страница написана естественно вокруг самых релевантных поисковых фраз для работы, уборки, Швеции, Стокгольма и клинингового рынка.",

    ctaTitle: "Начните с Clean Jobs",
    ctaText:
      "Clean Jobs помогает работникам, клиентам и клининговым компаниям соединяться через специализированный маркетплейс для клининговых услуг и работы по уборке в Швеции.",
    browseJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
    metaDescription:
      "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Stockholm and nearby areas.",
    metaOgTitle: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",
    metaOgDescription:
      "Find cleaning jobs in Stockholm. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Stockholm and nearby areas.",
    metaOgAlt: "Cleaning Jobs in Stockholm 2026 | Find Cleaner Work",

    faqHelpQuestion: "How can Clean Jobs help?",
    faqHelpAnswer:
      "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
    faqOnlyQuestion: "Is Clean Jobs only for cleaning work?",
    faqOnlyAnswer:
      "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",

    heroEyebrow: "Clean Jobs",
    heroTitle:
      "Cleaning jobs in Stockholm: find cleaner work or hire trusted cleaners",
    heroText:
      "Stockholm has one of Sweden’s strongest markets for cleaning work. Private homes, apartments, offices, shops and rental properties often need reliable cleaners for one-time and recurring jobs. Clean Jobs helps cleaners, clients and cleaning companies connect in one place.",
    browseStockholmJobs: "Browse Stockholm jobs",
    postCleaningJob: "Post a cleaning job",

    overviewEyebrow: "Overview",
    overviewTitle: "Why Stockholm is strong for cleaning work",
    overviewText1:
      "Stockholm is a large metropolitan area with many apartments, offices, businesses and moving households. This creates steady demand for home cleaning, office cleaning, deep cleaning and move-out cleaning.",
    overviewText2:
      "Many clients prefer cleaners with clear profiles, reliable communication and visible experience. A marketplace profile makes it easier for clients to understand who you are and what type of cleaning jobs you accept.",

    typesEyebrow: "Types of work",
    typesTitle: "Common cleaning jobs in Stockholm",
    typesText1:
      "The most common cleaning jobs in Stockholm include apartment cleaning, house cleaning, office cleaning, stair cleaning, move-out cleaning and recurring weekly cleaning.",
    typesText2:
      "Cleaning companies can also use Clean Jobs to find extra work, receive requests from new clients and show their company name, verification and premium profile information.",

    areasEyebrow: "Areas",
    areasTitle: "Areas near Stockholm where cleaners can find work",
    areasText1:
      "If you are searching for cleaning jobs in Stockholm, also consider nearby areas and commuter municipalities such as Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge and Botkyrka.",
    areasText2:
      "Cleaners who can travel across several areas have a better chance of finding regular work and building long-term relationships with clients.",

    clientsEyebrow: "For clients",
    clientsTitle: "How to hire a cleaner in Stockholm",
    clientsText1:
      "If you need a cleaner in Stockholm, create a clear job with city, address area, budget, date, time and description. Include the type of cleaning you need and whether the job is one-time or recurring.",
    clientsText2:
      "Clean Jobs is built for both private clients and cleaning companies. You can post a job, receive interest from cleaners and continue the conversation through the job page and chat.",

    topicsTitle: "SEO search topics",
    topicsText:
      "This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.",

    ctaTitle: "Start with Clean Jobs",
    ctaText:
      "Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.",
    browseJobs: "Browse jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Städjobb i Stockholm 2026 | Hitta städarbete",
    metaDescription:
      "Hitta städjobb i Stockholm. Guide till hemstädning, kontorsstädning, flyttstädning och jobb som städare i Stockholm och närliggande områden.",
    metaOgTitle: "Städjobb i Stockholm | Clean Jobs",
    metaOgDescription:
      "Hitta städjobb i Stockholm eller anlita pålitliga städare för hemstädning, kontorsstädning och flyttstädning.",
    metaOgAlt: "Städjobb i Stockholm",

    faqHelpQuestion: "Hur kan Clean Jobs hjälpa?",
    faqHelpAnswer:
      "Clean Jobs kopplar ihop personer som behöver städtjänster med städare och städföretag som söker arbete.",
    faqOnlyQuestion: "Är Clean Jobs bara för städarbete?",
    faqOnlyAnswer:
      "Clean Jobs fokuserar på städarbete, men personer som söker arbete i Sverige generellt kan också använda guiderna för att förstå möjligheter i servicesektorn.",

    heroEyebrow: "Clean Jobs",
    heroTitle:
      "Städjobb i Stockholm: hitta städarbete eller anlita pålitliga städare",
    heroText:
      "Stockholm har en av Sveriges starkaste marknader för städarbete. Privata hem, lägenheter, kontor, butiker och hyresfastigheter behöver ofta pålitliga städare för engångsjobb och återkommande uppdrag. Clean Jobs hjälper städare, kunder och städföretag att mötas på ett ställe.",
    browseStockholmJobs: "Bläddra bland jobb i Stockholm",
    postCleaningJob: "Lägg upp städjobb",

    overviewEyebrow: "Översikt",
    overviewTitle: "Varför Stockholm är starkt för städarbete",
    overviewText1:
      "Stockholm är ett stort storstadsområde med många lägenheter, kontor, företag och flyttande hushåll. Det skapar stabil efterfrågan på hemstädning, kontorsstädning, storstädning och flyttstädning.",
    overviewText2:
      "Många kunder föredrar städare med tydliga profiler, pålitlig kommunikation och synlig erfarenhet. En marknadsplatsprofil gör det lättare för kunder att förstå vem du är och vilka typer av städjobb du accepterar.",

    typesEyebrow: "Typer av arbete",
    typesTitle: "Vanliga städjobb i Stockholm",
    typesText1:
      "De vanligaste städjobben i Stockholm inkluderar lägenhetsstädning, hemstädning, kontorsstädning, trappstädning, flyttstädning och återkommande veckostädning.",
    typesText2:
      "Städföretag kan också använda Clean Jobs för att hitta extra arbete, få förfrågningar från nya kunder och visa företagsnamn, verifiering och premiuminformation i profilen.",

    areasEyebrow: "Områden",
    areasTitle: "Områden nära Stockholm där städare kan hitta arbete",
    areasText1:
      "Om du söker städjobb i Stockholm bör du också överväga närliggande områden och pendlingskommuner som Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge och Botkyrka.",
    areasText2:
      "Städare som kan resa mellan flera områden har större chans att hitta återkommande arbete och bygga långsiktiga relationer med kunder.",

    clientsEyebrow: "För kunder",
    clientsTitle: "Så anlitar du städare i Stockholm",
    clientsText1:
      "Om du behöver en städare i Stockholm, skapa ett tydligt jobb med stad, adressområde, budget, datum, tid och beskrivning. Ange vilken typ av städning du behöver och om jobbet är engångsarbete eller återkommande.",
    clientsText2:
      "Clean Jobs är byggt för både privatkunder och städföretag. Du kan lägga upp ett jobb, få intresse från städare och fortsätta konversationen via jobbsidan och chatten.",

    topicsTitle: "SEO-sökämnen",
    topicsText:
      "Den här sidan är skriven naturligt kring de mest relevanta jobb- och städsökfraserna för Sverige, Stockholm och städmarknaden.",

    ctaTitle: "Börja med Clean Jobs",
    ctaText:
      "Clean Jobs hjälper arbetare, kunder och städföretag att mötas via en fokuserad marknadsplats för städtjänster och städarbete i Sverige.",
    browseJobs: "Bläddra bland jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Praca sprzątania w Sztokholmie 2026 | Clean Jobs",
    metaDescription:
      "Znajdź prace sprzątania w Sztokholmie. Poradnik o sprzątaniu domu, biura, po przeprowadzce i pracy jako sprzątacz w Stockholm i okolicy.",
    metaOgTitle: "Praca sprzątania w Sztokholmie | Clean Jobs",
    metaOgDescription:
      "Znajdź pracę jako sprzątacz w Sztokholmie albo zatrudnij zaufanych sprzątaczy do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Praca sprzątania w Sztokholmie",

    faqHelpQuestion: "Jak Clean Jobs może pomóc?",
    faqHelpAnswer:
      "Clean Jobs łączy osoby, które potrzebują usług sprzątania, ze sprzątaczami i firmami sprzątającymi szukającymi pracy.",
    faqOnlyQuestion: "Czy Clean Jobs jest tylko dla pracy sprzątania?",
    faqOnlyAnswer:
      "Clean Jobs skupia się na pracy sprzątania, ale osoby szukające ogólnej pracy w Szwecji mogą też używać stron poradnikowych, aby zrozumieć możliwości w sektorze usług.",

    heroEyebrow: "Clean Jobs",
    heroTitle:
      "Prace sprzątania w Sztokholmie: znajdź pracę albo zatrudnij zaufanych sprzątaczy",
    heroText:
      "Sztokholm ma jeden z najsilniejszych rynków pracy sprzątania w Szwecji. Prywatne domy, mieszkania, biura, sklepy i nieruchomości na wynajem często potrzebują zaufanych sprzątaczy do jednorazowych i regularnych prac. Clean Jobs pomaga sprzątaczom, klientom i firmom sprzątającym łączyć się w jednym miejscu.",
    browseStockholmJobs: "Przeglądaj prace w Sztokholmie",
    postCleaningJob: "Dodaj pracę sprzątania",

    overviewEyebrow: "Przegląd",
    overviewTitle: "Dlaczego Sztokholm jest silny dla pracy sprzątania",
    overviewText1:
      "Sztokholm to duży region metropolitalny z wieloma mieszkaniami, biurami, firmami i przeprowadzkami. To tworzy stabilny popyt na sprzątanie domu, biura, sprzątanie generalne i po przeprowadzce.",
    overviewText2:
      "Wielu klientów preferuje sprzątaczy z jasnymi profilami, wiarygodną komunikacją i widocznym doświadczeniem. Profil na marketplace ułatwia klientom zrozumienie, kim jesteś i jakie prace sprzątania przyjmujesz.",

    typesEyebrow: "Typy pracy",
    typesTitle: "Popularne prace sprzątania w Sztokholmie",
    typesText1:
      "Najczęstsze prace sprzątania w Sztokholmie obejmują sprzątanie mieszkań, domów, biur, klatek schodowych, po przeprowadzce i regularne cotygodniowe sprzątanie.",
    typesText2:
      "Firmy sprzątające mogą też używać Clean Jobs, aby znaleźć dodatkową pracę, otrzymywać zapytania od nowych klientów i pokazywać nazwę firmy, weryfikację oraz informacje premium w profilu.",

    areasEyebrow: "Obszary",
    areasTitle: "Obszary blisko Sztokholmu, gdzie sprzątacze mogą znaleźć pracę",
    areasText1:
      "Jeśli szukasz prac sprzątania w Sztokholmie, rozważ także pobliskie obszary i gminy dojazdowe, takie jak Solna, Sundbyberg, Nacka, Täby, Järfälla, Huddinge i Botkyrka.",
    areasText2:
      "Sprzątacze, którzy mogą podróżować między kilkoma obszarami, mają większą szansę na regularną pracę i budowanie długoterminowych relacji z klientami.",

    clientsEyebrow: "Dla klientów",
    clientsTitle: "Jak zatrudnić sprzątacza w Sztokholmie",
    clientsText1:
      "Jeśli potrzebujesz sprzątacza w Sztokholmie, utwórz jasne ogłoszenie z miastem, obszarem adresu, budżetem, datą, godziną i opisem. Dodaj typ sprzątania oraz informację, czy praca jest jednorazowa czy regularna.",
    clientsText2:
      "Clean Jobs jest stworzony dla klientów prywatnych i firm sprzątających. Możesz dodać pracę, otrzymać zainteresowanie od sprzątaczy i kontynuować rozmowę przez stronę pracy oraz czat.",

    topicsTitle: "Tematy wyszukiwania SEO",
    topicsText:
      "Ta strona jest napisana naturalnie wokół najważniejszych fraz wyszukiwania dotyczących pracy, sprzątania, Szwecji, Sztokholmu i rynku sprzątania.",

    ctaTitle: "Zacznij z Clean Jobs",
    ctaText:
      "Clean Jobs pomaga pracownikom, klientom i firmom sprzątającym łączyć się przez wyspecjalizowany marketplace dla usług sprzątania i pracy sprzątania w Szwecji.",
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
      canonical: "/cleaning-jobs-stockholm",
    },
    keywords: topics,
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/cleaning-jobs-stockholm`,
      siteName: "Clean Jobs",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t.metaOgAlt,
        },
      ],
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
      {
        "@type": "Question",
        name: t.faqHelpQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqHelpAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqOnlyQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqOnlyAnswer,
        },
      },
    ],
  }
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children: ReactNode
}) {
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
            <Link
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              {t.browseStockholmJobs}
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.postCleaningJob}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow={t.overviewEyebrow} title={t.overviewTitle}>
            <p>{t.overviewText1}</p>
            <p>{t.overviewText2}</p>
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
                <span
                  key={topic}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700"
                >
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
              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.browseJobs}
              </Link>

              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                {t.createAccount}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/cleaning-jobs-stockholm" />
        </div>
      </main>
    </div>
  )
}