import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import RelatedGuides from "@/components/related-guides"

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

const copy = {
  uk: {
    metaTitle: "Як знайти роботу у Швеції у 2026 році",
    metaDescription:
      "Повний гід, як знайти роботу у Швеції. Дізнайтеся, де шукати, як іноземцям отримати роботу та які галузі наймають.",
    title: "Як знайти роботу у Швеції",
    intro:
      "Швеція залишається однією з найпривабливіших країн Європи для міжнародних працівників. Щороку тисячі людей шукають роботу в Стокгольмі, Гетеборзі, Мальме та інших містах.",
    h2Cv: "1. Підготуйте CV у шведському стилі",
    cvText:
      "Чітке CV дуже важливе. Додайте досвід роботи, освіту, мовні навички та контактну інформацію.",
    h2Platforms: "2. Використовуйте спеціалізовані платформи для роботи",
    platformsText1:
      "Багато працівників шукають лише на великих сайтах вакансій. Але спеціалізовані платформи часто дають кращі можливості, бо конкуренція нижча.",
    platformsText2:
      "Для робіт з прибирання та клінінгових компаній Clean Jobs фокусується саме на з’єднанні працівників і клієнтів.",
    h2Apply: "3. Подавайте заявки регулярно",
    applyText:
      "Найбільша помилка — податися лише на кілька вакансій. Успішні кандидати зазвичай надсилають багато заявок і відповідають, коли роботодавці виходять на контакт.",
    h2Swedish: "4. Вивчайте базову шведську",
    swedishText:
      "Деякі роботи доступні англійською, але базова шведська значно підвищує шанси та допомагає будувати довіру з роботодавцями.",
    h2Industries: "Галузі, які наймають у Швеції",
    industries: [
      "Клінінг і facility services",
      "Будівництво",
      "Охорона здоров’я",
      "Ресторани та готелі",
      "Склади й логістика",
      "IT і розробка програмного забезпечення",
    ],
    h2Cleaning: "Робота з прибирання у Швеції",
    cleaningText:
      "Клінінг залишається однією з найдоступніших галузей для новачків. Прибирання дому, офісу та після переїзду затребувані по всій Швеції.",
    browseJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Как найти работу в Швеции в 2026 году",
    metaDescription:
      "Полный гид, как найти работу в Швеции. Узнайте, где искать, как иностранцам получить работу и какие отрасли нанимают.",
    title: "Как найти работу в Швеции",
    intro:
      "Швеция остаётся одной из самых привлекательных стран Европы для международных работников. Каждый год тысячи людей ищут работу в Стокгольме, Гётеборге, Мальмё и других городах.",
    h2Cv: "1. Подготовьте CV в шведском стиле",
    cvText:
      "Чёткое CV очень важно. Добавьте опыт работы, образование, языковые навыки и контактную информацию.",
    h2Platforms: "2. Используйте специализированные платформы для работы",
    platformsText1:
      "Многие работники ищут только на больших сайтах вакансий. Но специализированные платформы часто дают лучшие возможности, потому что конкуренция ниже.",
    platformsText2:
      "Для работ по уборке и клининговых компаний Clean Jobs фокусируется именно на соединении работников и клиентов.",
    h2Apply: "3. Подавайте заявки регулярно",
    applyText:
      "Самая большая ошибка — податься только на несколько вакансий. Успешные кандидаты обычно отправляют много заявок и отвечают, когда работодатели выходят на контакт.",
    h2Swedish: "4. Учите базовый шведский",
    swedishText:
      "Некоторые работы доступны на английском, но базовый шведский значительно повышает ваши шансы и помогает строить доверие с работодателями.",
    h2Industries: "Отрасли, которые нанимают в Швеции",
    industries: [
      "Клининг и facility services",
      "Строительство",
      "Здравоохранение",
      "Рестораны и отели",
      "Склады и логистика",
      "IT и разработка программного обеспечения",
    ],
    h2Cleaning: "Работа по уборке в Швеции",
    cleaningText:
      "Клининг остаётся одной из самых доступных отраслей для новичков. Уборка дома, офиса и после переезда востребованы по всей Швеции.",
    browseJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "How to Find a Job in Sweden in 2026",
    metaDescription:
      "Complete guide on how to find a job in Sweden. Learn where to search, how foreigners get hired and what industries are hiring.",
    title: "How to Find a Job in Sweden",
    intro:
      "Sweden remains one of the most attractive countries in Europe for international workers. Every year thousands of people search for jobs in Stockholm, Gothenburg, Malmö and other cities.",
    h2Cv: "1. Prepare a Swedish-style CV",
    cvText:
      "A clear CV is essential. Include work experience, education, language skills and contact information.",
    h2Platforms: "2. Use specialized job platforms",
    platformsText1:
      "Many workers search only on large job websites. However, specialized platforms often provide better opportunities because competition is lower.",
    platformsText2:
      "For cleaning jobs and cleaning companies, Clean Jobs focuses specifically on connecting workers and clients.",
    h2Apply: "3. Apply consistently",
    applyText:
      "The biggest mistake is applying to only a few jobs. Successful candidates usually send many applications and follow up when employers respond.",
    h2Swedish: "4. Learn basic Swedish",
    swedishText:
      "While some jobs are available in English, basic Swedish improves your chances significantly and helps build trust with employers.",
    h2Industries: "Industries Hiring in Sweden",
    industries: [
      "Cleaning and facility services",
      "Construction",
      "Healthcare",
      "Restaurants and hotels",
      "Warehouses and logistics",
      "IT and software development",
    ],
    h2Cleaning: "Cleaning Jobs in Sweden",
    cleaningText:
      "Cleaning remains one of the most accessible industries for newcomers. Home cleaning, office cleaning and move-out cleaning services are in demand across Sweden.",
    browseJobs: "Browse Jobs",
    createAccount: "Create Account",
  },

  sv: {
    metaTitle: "Hur du hittar jobb i Sverige 2026",
    metaDescription:
      "Komplett guide till hur du hittar jobb i Sverige. Lär dig var du söker, hur utlänningar får jobb och vilka branscher som anställer.",
    title: "Hur du hittar jobb i Sverige",
    intro:
      "Sverige är fortfarande ett av Europas mest attraktiva länder för internationella arbetare. Varje år söker tusentals människor jobb i Stockholm, Göteborg, Malmö och andra städer.",
    h2Cv: "1. Förbered ett svenskt CV",
    cvText:
      "Ett tydligt CV är viktigt. Inkludera arbetslivserfarenhet, utbildning, språkkunskaper och kontaktuppgifter.",
    h2Platforms: "2. Använd specialiserade jobbplattformar",
    platformsText1:
      "Många arbetare söker bara på stora jobbsajter. Specialiserade plattformar kan ofta ge bättre möjligheter eftersom konkurrensen är lägre.",
    platformsText2:
      "För städjobb och städföretag fokuserar Clean Jobs specifikt på att koppla ihop arbetare och kunder.",
    h2Apply: "3. Sök regelbundet",
    applyText:
      "Det största misstaget är att bara söka några få jobb. Framgångsrika kandidater skickar vanligtvis många ansökningar och följer upp när arbetsgivare svarar.",
    h2Swedish: "4. Lär dig grundläggande svenska",
    swedishText:
      "Vissa jobb finns på engelska, men grundläggande svenska förbättrar dina chanser betydligt och hjälper till att bygga förtroende med arbetsgivare.",
    h2Industries: "Branscher som anställer i Sverige",
    industries: [
      "Städning och facility services",
      "Bygg",
      "Vård och omsorg",
      "Restauranger och hotell",
      "Lager och logistik",
      "IT och mjukvaruutveckling",
    ],
    h2Cleaning: "Städjobb i Sverige",
    cleaningText:
      "Städning är fortfarande en av de mest tillgängliga branscherna för nykomlingar. Hemstädning, kontorsstädning och flyttstädning efterfrågas i hela Sverige.",
    browseJobs: "Bläddra bland jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Jak znaleźć pracę w Szwecji w 2026 roku",
    metaDescription:
      "Kompletny poradnik, jak znaleźć pracę w Szwecji. Dowiedz się, gdzie szukać, jak obcokrajowcy dostają pracę i jakie branże zatrudniają.",
    title: "Jak znaleźć pracę w Szwecji",
    intro:
      "Szwecja pozostaje jednym z najbardziej atrakcyjnych krajów Europy dla pracowników międzynarodowych. Każdego roku tysiące osób szuka pracy w Sztokholmie, Göteborgu, Malmö i innych miastach.",
    h2Cv: "1. Przygotuj CV w szwedzkim stylu",
    cvText:
      "Jasne CV jest bardzo ważne. Dodaj doświadczenie zawodowe, edukację, umiejętności językowe i dane kontaktowe.",
    h2Platforms: "2. Korzystaj ze specjalistycznych platform pracy",
    platformsText1:
      "Wielu pracowników szuka tylko na dużych portalach pracy. Jednak specjalistyczne platformy często dają lepsze możliwości, ponieważ konkurencja jest mniejsza.",
    platformsText2:
      "Dla prac sprzątania i firm sprzątających Clean Jobs skupia się konkretnie na łączeniu pracowników i klientów.",
    h2Apply: "3. Aplikuj regularnie",
    applyText:
      "Największym błędem jest aplikowanie tylko na kilka ofert. Skuteczni kandydaci zwykle wysyłają wiele aplikacji i odpowiadają, gdy pracodawcy się kontaktują.",
    h2Swedish: "4. Ucz się podstaw szwedzkiego",
    swedishText:
      "Niektóre prace są dostępne po angielsku, ale podstawowy szwedzki znacząco zwiększa szanse i pomaga budować zaufanie z pracodawcami.",
    h2Industries: "Branże zatrudniające w Szwecji",
    industries: [
      "Sprzątanie i facility services",
      "Budownictwo",
      "Opieka zdrowotna",
      "Restauracje i hotele",
      "Magazyny i logistyka",
      "IT i rozwój oprogramowania",
    ],
    h2Cleaning: "Prace sprzątania w Szwecji",
    cleaningText:
      "Sprzątanie pozostaje jedną z najbardziej dostępnych branż dla nowych osób. Sprzątanie domu, biura i po przeprowadzce jest poszukiwane w całej Szwecji.",
    browseJobs: "Przeglądaj prace",
    createAccount: "Utwórz konto",
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string
    metaDescription: string
    title: string
    intro: string
    h2Cv: string
    cvText: string
    h2Platforms: string
    platformsText1: string
    platformsText2: string
    h2Apply: string
    applyText: string
    h2Swedish: string
    swedishText: string
    h2Industries: string
    industries: string[]
    h2Cleaning: string
    cleaningText: string
    browseJobs: string
    createAccount: string
  }
>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/how-to-find-a-job-in-sweden",
    },
    keywords: [
      "how to find a job in Sweden",
      "jobs in Sweden",
      "work in Sweden",
      "get a job in Sweden",
      "jobs for foreigners in Sweden",
      "English speaking jobs Sweden",
      "jobs in Stockholm",
      "jobs in Gothenburg",
      "jobs in Malmö",
      "cleaning jobs Sweden",
    ],
  }
}

export default async function HowToFindJobInSwedenPage() {
  const locale = await getLocale()
  const t = copy[locale]

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">{t.intro}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Cv}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.cvText}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Platforms}</h2>

          <p className="mt-4 leading-7 text-slate-600">
            {t.platformsText1}
          </p>

          <p className="mt-4 leading-7 text-slate-600">
            {t.platformsText2}
          </p>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Apply}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.applyText}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Swedish}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.swedishText}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Industries}</h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
            {t.industries.map((industry) => (
              <li key={industry}>{industry}</li>
            ))}
          </ul>

          <h2 className="mt-10 text-3xl font-semibold">{t.h2Cleaning}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.cleaningText}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              prefetch={false}
              className="rounded-2xl bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              {t.browseJobs}
            </Link>

            <Link
              href="/signup"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-50 active:scale-[0.97]"
            >
              {t.createAccount}
            </Link>
          </div>

          <RelatedGuides currentPath="/how-to-find-a-job-in-sweden" />
        </article>
      </main>
    </div>
  )
}