import type { Metadata } from "next"
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

const copy = {
  uk: {
    metaTitle: "Як отримати роботу у Швеції 2026",
    metaDescription:
      "Повний гід, як знайти роботу у Швеції. Пошук роботи, шведські роботодавці, клінінг і робота для іноземців.",
    metaOgTitle: "Як отримати роботу у Швеції",
    metaOgDescription:
      "Практичний гід, як знайти роботу у Швеції для місцевих жителів та іноземців.",
    metaOgAlt: "Як отримати роботу у Швеції",

    title: "Як отримати роботу у Швеції",
    intro:
      "Швеція є однією з найпривабливіших країн Європи для роботи. Щороку тисячі людей шукають роботу в Стокгольмі, Гетеборзі, Мальме та інших шведських містах.",
    cvTitle: "1. Створіть професійне CV",
    cvText:
      "Чітке CV часто є першим, що бачить роботодавець. Опишіть попередній досвід, освіту, мови та контактні дані просто й професійно.",
    platformsTitle: "2. Використовуйте спеціалізовані сайти для роботи",
    platformsText1:
      "Багато людей користуються лише великими сайтами вакансій, але менші нішеві платформи можуть давати кращі можливості, бо конкуренція часто нижча.",
    platformsText2:
      "Clean Jobs, наприклад, фокусується на роботах з прибирання та допомагає працівникам, клієнтам і клінінговим компаніям знаходити одне одного.",
    applyTitle: "3. Подавайтеся на багато вакансій",
    applyText:
      "Поширена помилка — надіслати лише кілька заявок. Люди, які знаходять роботу швидше, зазвичай подаються на багато вакансій і відповідають, коли роботодавці виходять на контакт.",
    swedishTitle: "4. Вивчайте шведську",
    swedishText:
      "Деякі роботи можна знайти англійською, але шведська значно збільшує можливості. Навіть базова шведська може сильно допомогти в контакті з роботодавцями та клієнтами.",
    industriesTitle: "Галузі, які наймають у Швеції",
    industries: [
      "Клінінг і facility services",
      "Будівництво",
      "Охорона здоров’я та догляд",
      "Готелі та ресторани",
      "Склади й логістика",
      "IT і розробка програмного забезпечення",
    ],
    cleaningTitle: "Робота з прибирання у Швеції",
    cleaningText:
      "Клінінг залишається одним із найпростіших шляхів на ринок праці для багатьох новоприбулих. Прибирання дому, офісу та після переїзду затребувані по всій Швеції.",
    marketsTitle: "Найбільші ринки праці",
    marketsText:
      "Стокгольм, Гетеборг і Мальме пропонують найбільше можливостей, але Уппсала, Вестерос, Еребру, Лінчепінг і Гельсінборг також мають багато вакансій у сервісі, клінінгу та інших сферах.",
    jobsButton: "Переглянути роботи",
    signupButton: "Створити акаунт",
  },

  ru: {
    metaTitle: "Как получить работу в Швеции 2026",
    metaDescription:
      "Полный гид, как найти работу в Швеции. Поиск работы, шведские работодатели, клининг и работа для иностранцев.",
    metaOgTitle: "Как получить работу в Швеции",
    metaOgDescription:
      "Практический гид, как найти работу в Швеции для местных жителей и иностранцев.",
    metaOgAlt: "Как получить работу в Швеции",

    title: "Как получить работу в Швеции",
    intro:
      "Швеция является одной из самых привлекательных стран Европы для работы. Каждый год тысячи людей ищут работу в Стокгольме, Гётеборге, Мальмё и других шведских городах.",
    cvTitle: "1. Создайте профессиональное CV",
    cvText:
      "Чёткое CV часто является первым, что видит работодатель. Опишите предыдущий опыт, образование, языки и контактные данные просто и профессионально.",
    platformsTitle: "2. Используйте специализированные сайты для работы",
    platformsText1:
      "Многие люди используют только большие сайты вакансий, но меньшие нишевые платформы могут давать лучшие возможности, потому что конкуренция часто ниже.",
    platformsText2:
      "Clean Jobs, например, фокусируется на работах по уборке и помогает работникам, клиентам и клининговым компаниям находить друг друга.",
    applyTitle: "3. Подавайтесь на много вакансий",
    applyText:
      "Распространённая ошибка — отправить только несколько заявок. Люди, которые быстрее находят работу, обычно подаются на много вакансий и отвечают, когда работодатели выходят на контакт.",
    swedishTitle: "4. Учите шведский",
    swedishText:
      "Некоторые работы можно найти на английском, но шведский значительно увеличивает возможности. Даже базовый шведский может сильно помочь в контакте с работодателями и клиентами.",
    industriesTitle: "Отрасли, которые нанимают в Швеции",
    industries: [
      "Клининг и facility services",
      "Строительство",
      "Здравоохранение и уход",
      "Отели и рестораны",
      "Склады и логистика",
      "IT и разработка программного обеспечения",
    ],
    cleaningTitle: "Работа по уборке в Швеции",
    cleaningText:
      "Клининг остаётся одним из самых простых путей на рынок труда для многих новоприбывших. Уборка дома, офиса и после переезда востребованы по всей Швеции.",
    marketsTitle: "Крупнейшие рынки труда",
    marketsText:
      "Стокгольм, Гётеборг и Мальмё предлагают больше всего возможностей, но Уппсала, Вестерос, Эребру, Линчёпинг и Хельсингборг также имеют много вакансий в сервисе, клининге и других сферах.",
    jobsButton: "Смотреть работы",
    signupButton: "Создать аккаунт",
  },

  en: {
    metaTitle: "How to Get a Job in Sweden 2026",
    metaDescription:
      "Complete guide to finding a job in Sweden. Learn about job search, Swedish employers, cleaning jobs and work for foreigners.",
    metaOgTitle: "How to Get a Job in Sweden",
    metaOgDescription:
      "Practical guide to finding work in Sweden as a local resident or foreigner.",
    metaOgAlt: "How to get a job in Sweden",

    title: "How to Get a Job in Sweden",
    intro:
      "Sweden is one of Europe’s most attractive countries for work. Every year thousands of people search for jobs in Stockholm, Gothenburg, Malmö and other Swedish cities.",
    cvTitle: "1. Create a professional CV",
    cvText:
      "A clear CV is often the first thing an employer sees. Describe previous experience, education, languages and contact information in a simple and professional way.",
    platformsTitle: "2. Use specialized job sites",
    platformsText1:
      "Many people only use large job boards, but smaller niche platforms can offer better opportunities because competition is often lower.",
    platformsText2:
      "Clean Jobs, for example, focuses on cleaning jobs and helps workers, clients and cleaning companies find each other.",
    applyTitle: "3. Apply for many jobs",
    applyText:
      "A common mistake is sending only a few applications. People who succeed faster usually apply for many jobs and follow up when employers respond.",
    swedishTitle: "4. Learn Swedish",
    swedishText:
      "It is possible to find some jobs in English, but Swedish increases your opportunities significantly. Even basic Swedish can make a big difference when contacting employers and clients.",
    industriesTitle: "Industries hiring in Sweden",
    industries: [
      "Cleaning and facility services",
      "Construction",
      "Healthcare and care work",
      "Hotels and restaurants",
      "Warehouses and logistics",
      "IT and software development",
    ],
    cleaningTitle: "Cleaning jobs in Sweden",
    cleaningText:
      "Cleaning is still one of the easiest ways into the labour market for many newcomers. Home cleaning, office cleaning and move-out cleaning are in demand across Sweden.",
    marketsTitle: "Largest job markets",
    marketsText:
      "Stockholm, Gothenburg and Malmö offer the most opportunities, but Uppsala, Västerås, Örebro, Linköping and Helsingborg also have many open roles in services, cleaning and other occupations.",
    jobsButton: "See jobs",
    signupButton: "Create account",
  },

  sv: {
    metaTitle: "Hur man får jobb i Sverige 2026",
    metaDescription:
      "Komplett guide för att hitta jobb i Sverige. Läs om jobbsökning, svenska arbetsgivare, städjobb och arbete för utlänningar.",
    metaOgTitle: "Hur man får jobb i Sverige",
    metaOgDescription:
      "Praktisk guide för att hitta arbete i Sverige som svensk eller utlänning.",
    metaOgAlt: "Hur man får jobb i Sverige",

    title: "Hur man får jobb i Sverige",
    intro:
      "Sverige är ett av Europas mest attraktiva länder för arbete. Varje år söker tusentals människor jobb i Stockholm, Göteborg, Malmö och andra svenska städer.",
    cvTitle: "1. Skapa ett professionellt CV",
    cvText:
      "Ett tydligt CV är ofta det första en arbetsgivare ser. Beskriv tidigare erfarenhet, utbildning, språk och kontaktuppgifter på ett enkelt och professionellt sätt.",
    platformsTitle: "2. Använd specialiserade jobbsajter",
    platformsText1:
      "Många använder bara stora jobbsidor, men mindre nischade plattformar kan ge bättre möjligheter eftersom konkurrensen ofta är lägre.",
    platformsText2:
      "Clean Jobs fokuserar exempelvis på städjobb och hjälper arbetare, kunder och städfirmor att hitta varandra.",
    applyTitle: "3. Sök många jobb",
    applyText:
      "En vanlig miss är att bara skicka några få ansökningar. Personer som lyckas snabbare brukar söka många jobb och följa upp när arbetsgivare svarar.",
    swedishTitle: "4. Lär dig svenska",
    swedishText:
      "Det går att hitta vissa jobb på engelska, men svenska ökar dina möjligheter betydligt. Även grundläggande svenska kan göra stor skillnad i kontakten med arbetsgivare och kunder.",
    industriesTitle: "Branscher som anställer i Sverige",
    industries: [
      "Städning och facility services",
      "Byggbranschen",
      "Vård och omsorg",
      "Hotell och restaurang",
      "Lager och logistik",
      "IT och mjukvaruutveckling",
    ],
    cleaningTitle: "Städjobb i Sverige",
    cleaningText:
      "Städning är fortfarande en av de enklaste vägarna in på arbetsmarknaden för många nyanlända. Hemstädning, kontorsstädning och flyttstädning efterfrågas i hela Sverige.",
    marketsTitle: "Största arbetsmarknaderna",
    marketsText:
      "Stockholm, Göteborg och Malmö erbjuder flest möjligheter, men även Uppsala, Västerås, Örebro, Linköping och Helsingborg har många lediga tjänster inom service, städning och andra yrken.",
    jobsButton: "Se jobb",
    signupButton: "Skapa konto",
  },

  pl: {
    metaTitle: "Jak dostać pracę w Szwecji 2026",
    metaDescription:
      "Kompletny poradnik, jak znaleźć pracę w Szwecji. Szukanie pracy, szwedzcy pracodawcy, sprzątanie i praca dla obcokrajowców.",
    metaOgTitle: "Jak dostać pracę w Szwecji",
    metaOgDescription:
      "Praktyczny poradnik, jak znaleźć pracę w Szwecji jako mieszkaniec lub obcokrajowiec.",
    metaOgAlt: "Jak dostać pracę w Szwecji",

    title: "Jak dostać pracę w Szwecji",
    intro:
      "Szwecja jest jednym z najbardziej atrakcyjnych krajów Europy do pracy. Każdego roku tysiące osób szuka pracy w Sztokholmie, Göteborgu, Malmö i innych szwedzkich miastach.",
    cvTitle: "1. Stwórz profesjonalne CV",
    cvText:
      "Jasne CV jest często pierwszą rzeczą, którą widzi pracodawca. Opisz wcześniejsze doświadczenie, edukację, języki i dane kontaktowe w prosty oraz profesjonalny sposób.",
    platformsTitle: "2. Korzystaj ze specjalistycznych portali pracy",
    platformsText1:
      "Wiele osób używa tylko dużych portali pracy, ale mniejsze niszowe platformy mogą dawać lepsze możliwości, ponieważ konkurencja jest często niższa.",
    platformsText2:
      "Clean Jobs skupia się na pracach sprzątania i pomaga pracownikom, klientom oraz firmom sprzątającym znaleźć się nawzajem.",
    applyTitle: "3. Aplikuj na wiele ofert",
    applyText:
      "Częstym błędem jest wysłanie tylko kilku aplikacji. Osoby, które szybciej odnoszą sukces, zwykle aplikują na wiele ofert i odpowiadają, gdy pracodawcy się kontaktują.",
    swedishTitle: "4. Ucz się szwedzkiego",
    swedishText:
      "Można znaleźć niektóre prace po angielsku, ale szwedzki znacząco zwiększa możliwości. Nawet podstawowy szwedzki może bardzo pomóc w kontakcie z pracodawcami i klientami.",
    industriesTitle: "Branże zatrudniające w Szwecji",
    industries: [
      "Sprzątanie i facility services",
      "Budownictwo",
      "Opieka zdrowotna i opieka",
      "Hotele i restauracje",
      "Magazyny i logistyka",
      "IT i rozwój oprogramowania",
    ],
    cleaningTitle: "Prace sprzątania w Szwecji",
    cleaningText:
      "Sprzątanie nadal jest jedną z najprostszych dróg wejścia na rynek pracy dla wielu nowych osób. Sprzątanie domu, biura i po przeprowadzce jest poszukiwane w całej Szwecji.",
    marketsTitle: "Największe rynki pracy",
    marketsText:
      "Sztokholm, Göteborg i Malmö oferują najwięcej możliwości, ale Uppsala, Västerås, Örebro, Linköping i Helsingborg również mają wiele ofert w usługach, sprzątaniu i innych zawodach.",
    jobsButton: "Zobacz prace",
    signupButton: "Utwórz konto",
  },
} satisfies Record<
  Locale,
  {
    metaTitle: string
    metaDescription: string
    metaOgTitle: string
    metaOgDescription: string
    metaOgAlt: string
    title: string
    intro: string
    cvTitle: string
    cvText: string
    platformsTitle: string
    platformsText1: string
    platformsText2: string
    applyTitle: string
    applyText: string
    swedishTitle: string
    swedishText: string
    industriesTitle: string
    industries: string[]
    cleaningTitle: string
    cleaningText: string
    marketsTitle: string
    marketsText: string
    jobsButton: string
    signupButton: string
  }
>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/hur-man-far-jobb-i-sverige",
    },
    keywords: [
      "hur man får jobb i Sverige",
      "jobb i Sverige",
      "arbete i Sverige",
      "jobb för utlänningar",
      "jobb utan svenska",
      "städjobb Sverige",
      "jobb Stockholm",
      "jobb Göteborg",
      "jobb Malmö",
      "jobbsökning Sverige",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/hur-man-far-jobb-i-sverige`,
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
  }
}

export default async function HurManFarJobbISverigePage() {
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

          <h2 className="mt-10 text-3xl font-semibold">{t.cvTitle}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.cvText}</p>

          <h2 className="mt-10 text-3xl font-semibold">
            {t.platformsTitle}
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            {t.platformsText1}
          </p>

          <p className="mt-4 leading-7 text-slate-600">
            {t.platformsText2}
          </p>

          <h2 className="mt-10 text-3xl font-semibold">{t.applyTitle}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.applyText}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.swedishTitle}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.swedishText}</p>

          <h2 className="mt-10 text-3xl font-semibold">
            {t.industriesTitle}
          </h2>

          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
            {t.industries.map((industry) => (
              <li key={industry}>{industry}</li>
            ))}
          </ul>

          <h2 className="mt-10 text-3xl font-semibold">{t.cleaningTitle}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.cleaningText}</p>

          <h2 className="mt-10 text-3xl font-semibold">{t.marketsTitle}</h2>

          <p className="mt-4 leading-7 text-slate-600">{t.marketsText}</p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/jobs"
              prefetch={false}
              className="rounded-2xl bg-rose-600 px-6 py-3 font-medium text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              {t.jobsButton}
            </Link>

            <Link
              href="/signup"
              prefetch={false}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-50 active:scale-[0.97]"
            >
              {t.signupButton}
            </Link>
          </div>

          <RelatedGuides currentPath="/hur-man-far-jobb-i-sverige" />
        </article>
      </main>
    </div>
  )
}