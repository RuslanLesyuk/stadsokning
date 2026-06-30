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
  "jobb i Sverige",
  "städjobb",
  "städjobb Stockholm",
  "städare jobb",
  "jobb utan svenska",
  "extrajobb Sverige",
  "deltidsjobb Sverige",
  "heltidsjobb Sverige",
  "städfirma jobb",
  "hemstädning jobb",
]

const copy = {
  uk: {
    metaTitle: "Робота у Швеції 2026 | Клінінг, підробіток і праця",
    metaDescription:
      "Гід по роботі у Швеції 2026. Дізнайтеся про клінінг, роботу без ідеальної шведської, часткову зайнятість, повний день і Clean Jobs.",
    metaOgTitle: "Робота у Швеції 2026 | Клінінг, підробіток і праця",
    metaOgDescription:
      "Гід по роботі у Швеції 2026: клінінг, робота без ідеальної шведської, часткова й повна зайнятість.",
    metaOgAlt: "Робота у Швеції 2026",

    faqHelpQuestion: "Як Clean Jobs може допомогти?",
    faqHelpAnswer:
      "Clean Jobs з’єднує людей, яким потрібні послуги прибирання, з прибиральниками та клінінговими компаніями, які шукають роботу.",
    faqOnlyQuestion: "Clean Jobs тільки для роботи з прибирання?",
    faqOnlyAnswer:
      "Clean Jobs фокусується на роботі з прибирання, але люди, які шукають роботу у Швеції загалом, також можуть використовувати гіди, щоб краще зрозуміти можливості в сервісному секторі.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Робота у Швеції: клінінг, підробіток і практичні шляхи до роботи",
    heroText:
      "Знайти роботу у Швеції може бути складно, особливо якщо ви нові в країні або ще вивчаєте шведську. Робота з прибирання, прибирання дому, офісу та після переїзду може бути хорошим входом на ринок праці, бо попит є в багатьох містах.",
    showJobs: "Показати роботи з прибирання",
    postJob: "Опублікувати роботу",

    marketEyebrow: "Ринок праці",
    marketTitle: "Як знайти роботу у Швеції",
    marketText1:
      "Почніть із визначення, який тип роботи ви шукаєте: повний день, часткова зайнятість, підробіток, сезонна робота або завдання поруч із місцем проживання.",
    marketText2:
      "Чітке CV, активний номер телефону й швидка відповідь мають велике значення. Якщо ви шукаєте роботу з прибирання, покажіть місто, доступний час і типи прибирання, які можете виконувати.",

    cleaningEyebrow: "Клінінг",
    cleaningTitle: "Робота з прибирання у Швеції",
    cleaningText1:
      "Робота з прибирання може включати прибирання дому, офісу, сходів, після будівництва, після переїзду або регулярні замовлення.",
    cleaningText2:
      "Clean Jobs створений, щоб простіше знаходити роботи з прибирання й прибиральників в одному місці. Працівники можуть знаходити завдання, клієнти — публікувати роботи, а компанії — показувати профіль.",

    languageEyebrow: "Мова",
    languageTitle: "Робота без ідеальної шведської",
    languageText1:
      "Деякі роботи потребують багато шведської, але не всі. Для клінінгу іноді достатньо базової шведської, англійської або чітких інструкцій.",
    languageText2:
      "Якщо ви ще вивчаєте шведську, напишіть профіль простою шведською або англійською. Додайте місто, досвід, доступність і чи можете працювати вечорами або у вихідні.",

    citiesEyebrow: "Міста",
    citiesTitle: "Де найбільше можливостей?",
    citiesText1:
      "Стокгольм, Гетеборг і Мальме — сильні регіони для клінінгу та сервісних робіт, але менші міста й комуни також потребують прибирання.",
    citiesText2:
      "Якщо ви живете біля Стокгольма, варто також шукати в Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby і Botkyrka.",

    topicsTitle: "SEO-пошукові теми",
    topicsText:
      "Ця сторінка природно побудована навколо релевантних пошукових фраз для роботи, клінінгу, Швеції, Стокгольма та ринку прибирання.",

    ctaTitle: "Почніть із Clean Jobs",
    ctaText:
      "Clean Jobs допомагає працівникам, клієнтам і клінінговим компаніям з’єднуватися через спеціалізований маркетплейс для клінінгових послуг і роботи з прибирання у Швеції.",
    browseJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа в Швеции 2026 | Клининг, подработка и труд",
    metaDescription:
      "Гид по работе в Швеции 2026. Узнайте о клининге, работе без идеального шведского, частичной занятости, полном дне и Clean Jobs.",
    metaOgTitle: "Работа в Швеции 2026 | Клининг, подработка и труд",
    metaOgDescription:
      "Гид по работе в Швеции 2026: клининг, работа без идеального шведского, частичная и полная занятость.",
    metaOgAlt: "Работа в Швеции 2026",

    faqHelpQuestion: "Как Clean Jobs может помочь?",
    faqHelpAnswer:
      "Clean Jobs соединяет людей, которым нужны услуги уборки, с уборщиками и клининговыми компаниями, которые ищут работу.",
    faqOnlyQuestion: "Clean Jobs только для работы по уборке?",
    faqOnlyAnswer:
      "Clean Jobs фокусируется на работе по уборке, но люди, которые ищут работу в Швеции в целом, также могут использовать страницы-гиды, чтобы лучше понять возможности в сервисном секторе.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Работа в Швеции: клининг, подработка и практические пути к работе",
    heroText:
      "Найти работу в Швеции может быть сложно, особенно если вы недавно в стране или ещё учите шведский. Работа по уборке, уборка дома, офиса и после переезда может быть хорошим входом на рынок труда, потому что спрос есть во многих городах.",
    showJobs: "Показать работы по уборке",
    postJob: "Опубликовать работу",

    marketEyebrow: "Рынок труда",
    marketTitle: "Как найти работу в Швеции",
    marketText1:
      "Начните с выбора типа работы: полный день, частичная занятость, подработка, сезонная работа или задания рядом с местом проживания.",
    marketText2:
      "Понятное CV, активный номер телефона и быстрый ответ имеют большое значение. Если вы ищете работу по уборке, покажите город, доступное время и типы уборки, которые можете выполнять.",

    cleaningEyebrow: "Клининг",
    cleaningTitle: "Работа по уборке в Швеции",
    cleaningText1:
      "Работа по уборке может включать уборку дома, офиса, лестниц, после строительства, после переезда или регулярные заказы.",
    cleaningText2:
      "Clean Jobs создан, чтобы проще находить работы по уборке и уборщиков в одном месте. Работники могут находить задания, клиенты — публиковать работы, а компании — показывать профиль.",

    languageEyebrow: "Язык",
    languageTitle: "Работа без идеального шведского",
    languageText1:
      "Некоторые работы требуют много шведского, но не все. Для клининга иногда достаточно базового шведского, английского или понятных инструкций.",
    languageText2:
      "Если вы ещё учите шведский, напишите профиль простым шведским или английским. Добавьте город, опыт, доступность и можете ли работать вечером или по выходным.",

    citiesEyebrow: "Города",
    citiesTitle: "Где больше всего возможностей?",
    citiesText1:
      "Стокгольм, Гётеборг и Мальмё — сильные регионы для клининга и сервисных работ, но меньшие города и коммуны тоже нуждаются в уборке.",
    citiesText2:
      "Если вы живёте рядом со Стокгольмом, стоит также искать в Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby и Botkyrka.",

    topicsTitle: "SEO-поисковые темы",
    topicsText:
      "Эта страница естественно построена вокруг релевантных поисковых фраз для работы, клининга, Швеции, Стокгольма и рынка уборки.",

    ctaTitle: "Начните с Clean Jobs",
    ctaText:
      "Clean Jobs помогает работникам, клиентам и клининговым компаниям соединяться через специализированный маркетплейс для клининговых услуг и работы по уборке в Швеции.",
    browseJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Jobs in Sweden 2026 | Cleaning Jobs, Extra Work and Employment",
    metaDescription:
      "Guide to jobs in Sweden 2026. Learn about cleaning jobs, jobs without perfect Swedish, part-time jobs, full-time jobs and how Clean Jobs helps.",
    metaOgTitle: "Jobs in Sweden 2026 | Cleaning Jobs, Extra Work and Employment",
    metaOgDescription:
      "Guide to jobs in Sweden 2026: cleaning jobs, jobs without perfect Swedish, part-time and full-time work.",
    metaOgAlt: "Jobs in Sweden 2026",

    faqHelpQuestion: "How can Clean Jobs help?",
    faqHelpAnswer:
      "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
    faqOnlyQuestion: "Is Clean Jobs only for cleaning work?",
    faqOnlyAnswer:
      "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Jobs in Sweden: cleaning jobs, extra work and practical paths to employment",
    heroText:
      "Finding a job in Sweden can feel difficult, especially if you are new in the country or still learning Swedish. Cleaning jobs, home cleaning, office cleaning and move-out cleaning can be a good way into the labour market because demand exists in many cities.",
    showJobs: "Show cleaning jobs",
    postJob: "Post job",

    marketEyebrow: "Labour market",
    marketTitle: "How to find jobs in Sweden",
    marketText1:
      "Start by deciding what type of work you are looking for: full-time, part-time, extra work, seasonal work or tasks close to where you live.",
    marketText2:
      "A clear CV, an active phone number and fast responses make a big difference. If you are looking for cleaning jobs, show which city you can work in, when you are available and what type of cleaning you can do.",

    cleaningEyebrow: "Cleaning jobs",
    cleaningTitle: "Cleaning jobs in Sweden",
    cleaningText1:
      "Cleaning jobs can include home cleaning, office cleaning, stair cleaning, construction cleaning, move-out cleaning or recurring cleaning assignments.",
    cleaningText2:
      "Clean Jobs is built to make it easier to find cleaning jobs and cleaners in one place. Workers can find assignments, clients can post jobs and cleaning companies can show their profile.",

    languageEyebrow: "Language",
    languageTitle: "Jobs without perfect Swedish",
    languageText1:
      "Some jobs require a lot of Swedish, but not all jobs do. For cleaning jobs, basic Swedish, English or clear instructions may sometimes be enough.",
    languageText2:
      "If you are still learning Swedish, you can write your profile in simple Swedish or English. Add your city, experience, availability and whether you can work evenings or weekends.",

    citiesEyebrow: "Cities",
    citiesTitle: "Where are the most opportunities?",
    citiesText1:
      "Stockholm, Gothenburg and Malmö are strong areas for cleaning jobs and service jobs, but smaller cities and municipalities also need cleaning services.",
    citiesText2:
      "If you live near Stockholm, it can be smart to also search in Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby and Botkyrka.",

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
    metaTitle: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
    metaDescription:
      "Guide till jobb i Sverige 2026. Läs om städjobb, jobb utan perfekt svenska, deltidsjobb, heltidsjobb och hur Clean Jobs hjälper städare och kunder att hitta varandra.",
    metaOgTitle: "Jobb i Sverige 2026 | Städjobb, extrajobb och arbete",
    metaOgDescription:
      "Guide till jobb i Sverige 2026. Läs om städjobb, jobb utan perfekt svenska, deltidsjobb, heltidsjobb och Clean Jobs.",
    metaOgAlt: "Jobb i Sverige 2026",

    faqHelpQuestion: "How can Clean Jobs help?",
    faqHelpAnswer:
      "Clean Jobs connects people who need cleaning services with cleaners and cleaning companies looking for work.",
    faqOnlyQuestion: "Is Clean Jobs only for cleaning work?",
    faqOnlyAnswer:
      "Clean Jobs focuses on cleaning work, but people searching for general work in Sweden can also use the guide pages to understand opportunities in the service sector.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Jobb i Sverige: städjobb, extrajobb och praktiska vägar till arbete",
    heroText:
      "Att hitta jobb i Sverige kan kännas svårt, särskilt om man är ny i landet eller fortfarande lär sig svenska. Städjobb, hemstädning, kontorsstädning och flyttstädning kan vara en bra väg in på arbetsmarknaden eftersom behovet finns i många städer.",
    showJobs: "Visa städjobb",
    postJob: "Lägg upp jobb",

    marketEyebrow: "Arbetsmarknad",
    marketTitle: "Så hittar du jobb i Sverige",
    marketText1:
      "Börja med att bestämma vilken typ av arbete du söker: heltid, deltid, extrajobb, säsongsarbete eller uppdrag nära där du bor.",
    marketText2:
      "Ett tydligt CV, ett aktivt telefonnummer och snabb respons gör stor skillnad. Om du söker städjobb bör du också visa i vilken stad du kan arbeta, vilka tider du är tillgänglig och vilken typ av städning du kan utföra.",

    cleaningEyebrow: "Städjobb",
    cleaningTitle: "Städjobb i Sverige",
    cleaningText1:
      "Städjobb kan vara hemstädning, kontorsstädning, trappstädning, byggstädning, flyttstädning eller återkommande städuppdrag.",
    cleaningText2:
      "Clean Jobs är byggt för att göra det enklare att hitta städjobb och städare på ett ställe. Arbetare kan hitta uppdrag, kunder kan lägga upp jobb och städfirmor kan visa sin profil.",

    languageEyebrow: "Språk",
    languageTitle: "Jobb utan perfekt svenska",
    languageText1:
      "Vissa arbeten kräver mycket svenska, men alla jobb gör inte det. För städjobb kan det ibland räcka med grundläggande svenska, engelska eller tydliga instruktioner.",
    languageText2:
      "Om du fortfarande lär dig svenska kan du skriva din profil på enkel svenska eller engelska. Lägg till din stad, erfarenhet, tillgänglighet och om du kan arbeta kvällar eller helger.",

    citiesEyebrow: "Städer",
    citiesTitle: "Var finns det flest möjligheter?",
    citiesText1:
      "Stockholm, Göteborg och Malmö är starka områden för städjobb och servicejobb, men även mindre städer och kommuner har behov av städning.",
    citiesText2:
      "För dig som bor nära Stockholm kan det vara smart att söka även i Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby och Botkyrka.",

    topicsTitle: "SEO search topics",
    topicsText:
      "This page is written naturally around the most relevant job and cleaning search phrases for Sweden, Stockholm and the cleaning market.",

    ctaTitle: "Start with Clean Jobs",
    ctaText:
      "Clean Jobs helps workers, clients and cleaning companies connect through a focused marketplace for cleaning services and cleaning work in Sweden.",
    browseJobs: "Browse jobs",
    createAccount: "Create account",
  },

  pl: {
    metaTitle: "Praca w Szwecji 2026 | Sprzątanie, praca dodatkowa i zatrudnienie",
    metaDescription:
      "Poradnik o pracy w Szwecji 2026. Dowiedz się o pracach sprzątania, pracy bez perfekcyjnego szwedzkiego, pracy na część etatu i Clean Jobs.",
    metaOgTitle: "Praca w Szwecji 2026 | Sprzątanie i zatrudnienie",
    metaOgDescription:
      "Poradnik o pracy w Szwecji 2026: sprzątanie, praca bez perfekcyjnego szwedzkiego, część etatu i pełny etat.",
    metaOgAlt: "Praca w Szwecji 2026",

    faqHelpQuestion: "Jak Clean Jobs może pomóc?",
    faqHelpAnswer:
      "Clean Jobs łączy osoby, które potrzebują usług sprzątania, ze sprzątaczami i firmami sprzątającymi szukającymi pracy.",
    faqOnlyQuestion: "Czy Clean Jobs jest tylko dla pracy sprzątania?",
    faqOnlyAnswer:
      "Clean Jobs skupia się na pracy sprzątania, ale osoby szukające ogólnej pracy w Szwecji mogą też używać stron poradnikowych, aby zrozumieć możliwości w sektorze usług.",

    heroEyebrow: "Clean Jobs",
    heroTitle: "Praca w Szwecji: sprzątanie, praca dodatkowa i praktyczne drogi do zatrudnienia",
    heroText:
      "Znalezienie pracy w Szwecji może być trudne, szczególnie jeśli jesteś nowy w kraju albo nadal uczysz się szwedzkiego. Prace sprzątania, sprzątanie domu, biura i po przeprowadzce mogą być dobrą drogą wejścia na rynek pracy.",
    showJobs: "Pokaż prace sprzątania",
    postJob: "Dodaj pracę",

    marketEyebrow: "Rynek pracy",
    marketTitle: "Jak znaleźć pracę w Szwecji",
    marketText1:
      "Zacznij od określenia, jakiej pracy szukasz: pełny etat, część etatu, praca dodatkowa, sezonowa albo zadania blisko miejsca zamieszkania.",
    marketText2:
      "Jasne CV, aktywny numer telefonu i szybka odpowiedź robią dużą różnicę. Jeśli szukasz prac sprzątania, pokaż miasto, dostępność i typy sprzątania, które możesz wykonać.",

    cleaningEyebrow: "Sprzątanie",
    cleaningTitle: "Prace sprzątania w Szwecji",
    cleaningText1:
      "Prace sprzątania mogą obejmować sprzątanie domu, biura, klatek schodowych, po budowie, po przeprowadzce albo regularne zlecenia.",
    cleaningText2:
      "Clean Jobs powstał, aby łatwiej znaleźć prace sprzątania i sprzątaczy w jednym miejscu. Pracownicy mogą znajdować zlecenia, klienci publikować prace, a firmy pokazywać profil.",

    languageEyebrow: "Język",
    languageTitle: "Praca bez perfekcyjnego szwedzkiego",
    languageText1:
      "Niektóre prace wymagają dużo szwedzkiego, ale nie wszystkie. W sprzątaniu czasem wystarczy podstawowy szwedzki, angielski albo jasne instrukcje.",
    languageText2:
      "Jeśli nadal uczysz się szwedzkiego, możesz napisać profil prostym szwedzkim albo angielskim. Dodaj miasto, doświadczenie, dostępność i czy możesz pracować wieczorami lub w weekendy.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Gdzie jest najwięcej możliwości?",
    citiesText1:
      "Sztokholm, Göteborg i Malmö są silnymi obszarami dla prac sprzątania i usług, ale mniejsze miasta oraz gminy też potrzebują sprzątania.",
    citiesText2:
      "Jeśli mieszkasz blisko Sztokholmu, warto też szukać w Solna, Sundbyberg, Järfälla, Nacka, Huddinge, Täby i Botkyrka.",

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
      canonical: "/jobb-i-sverige",
    },
    keywords: topics,
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/jobb-i-sverige`,
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
  eyebrow: string
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
              {t.showJobs}
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.postJob}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow={t.marketEyebrow} title={t.marketTitle}>
            <p>{t.marketText1}</p>
            <p>{t.marketText2}</p>
          </Section>

          <Section eyebrow={t.cleaningEyebrow} title={t.cleaningTitle}>
            <p>{t.cleaningText1}</p>
            <p>{t.cleaningText2}</p>
          </Section>

          <Section eyebrow={t.languageEyebrow} title={t.languageTitle}>
            <p>{t.languageText1}</p>
            <p>{t.languageText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
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

          <RelatedGuides currentPath="/jobb-i-sverige" />
        </div>
      </main>
    </div>
  )
}