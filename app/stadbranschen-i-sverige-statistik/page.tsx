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

const copy = {
  uk: {
    metaTitle: "Статистика клінінгової галузі у Швеції 2026 | Clean Jobs",
    metaDescription:
      "Статистика та гід по клінінговій галузі у Швеції. Дізнайтеся про клінінгові компанії, попит, працівників, ринок і можливості.",
    metaOgTitle: "Статистика клінінгової галузі у Швеції | Clean Jobs",
    metaOgDescription:
      "Гід по клінінговій галузі у Швеції, клінінгових компаніях, роботах з прибирання та розвитку ринку.",
    metaOgAlt: "Статистика клінінгової галузі у Швеції",

    faqStatsQuestion: "Де знайти статистику про клінінгову галузь у Швеції?",
    faqStatsAnswer:
      "Офіційна статистика про компанії та працівників доступна у SCB, зокрема у Företagsregistret і статистичній базі за галузями.",
    faqImportantQuestion: "Чи важлива клінінгова галузь у Швеції?",
    faqImportantAnswer:
      "Так. Галузь включає прибирання дому, офісу, facility management, прибирання після переїзду та клінінгові компанії для приватних і бізнес-клієнтів.",
    faqClientsQuestion: "Як клінінговим компаніям отримувати більше клієнтів?",
    faqClientsAnswer:
      "Клінінгові компанії можуть отримувати більше клієнтів через локальну видимість, чіткий профіль, швидку комунікацію, хороші відгуки та платформи як Clean Jobs.",

    heroEyebrow: "Статистика клінінгової галузі",
    heroTitle: "Клінінгова галузь у Швеції: статистика, ринок і можливості",
    heroText:
      "Клінінгова галузь у Швеції включає прибирання дому, офісу, facility management, прибирання після переїзду, санітарні роботи та компанії, які працюють із приватними й бізнес-клієнтами. Цей гід пояснює галузь і чому цифрова видимість стає все важливішою.",
    seeJobs: "Переглянути роботи з прибирання",
    postJob: "Опублікувати роботу з прибирання",

    statOfficialTitle: "Офіційні дані компаній",
    statOfficialValue: "SCB",
    statOfficialText:
      "Företagsregistret від SCB показує кількість компаній і працівників за галузями та розмірами компаній.",
    statTrendTitle: "Розвиток галузі",
    statTrendValue: "Фаза росту",
    statTrendText:
      "Звіт Almega Serviceföretagen 2024 описує клінінг, FM і домашні сервіси як галузь у фазі росту.",
    statTurnoverTitle: "Оборот на працівника",
    statTurnoverValue: "€54,7k",
    statTurnoverText:
      "Міжнародний dataset для cleaning services вказував близько 54,7 тисячі євро обороту на працівника у Швеції у 2023 році.",

    overviewEyebrow: "Огляд",
    overviewTitle: "Що входить у клінінгову галузь?",
    overviewText1:
      "Клінінгова галузь ширша, ніж тільки прибирання дому. Вона включає прибирання офісів, сходів, після переїзду, генеральне прибирання, facility management, санітарні роботи та постійні послуги для компаній, житлових асоціацій, власників нерухомості й приватних осіб.",
    overviewText2:
      "Тому різні клієнти шукають по-різному. Приватна особа може шукати “städfirma Stockholm”, а компанія — “kontorsstädning Göteborg” або “facility services Sverige”.",

    statisticsEyebrow: "Статистика",
    statisticsTitle: "Звідки береться статистика?",
    statisticsText1:
      "Найнадійніше джерело офіційної статистики — SCB. Företagsregistret показує кількість компаній і працівників за галузями та розмірами компаній.",
    statisticsText2:
      "Галузеві організації також публікують звіти. Almega Serviceföretagen 2024 описує клінінг, facility management і home-service компанії як галузь, що продовжує розвиватися навіть у складнішому середовищі.",

    demandEyebrow: "Попит",
    demandTitle: "Чому попит залишається сильним?",
    demandText1:
      "Прибирання — це повторювана потреба. Житло, офіси, магазини, ресторани, орендні квартири та власники нерухомості потребують прибирання.",
    demandText2:
      "Це створює можливості як для окремих прибиральників, так і для клінінгових компаній. Працівники можуть знаходити прибирання дому, офісу й після переїзду, а компанії — будувати довгострокові клієнтські відносини.",

    digitalEyebrow: "Диджиталізація",
    digitalTitle: "Чому клінінговим компаніям потрібно бути видимими онлайн?",
    digitalText1:
      "Багато клінінгових компаній досі залежать від рекомендацій, локальних груп, старих каталогів або ручних продажів. Це може працювати, але повільно.",
    digitalText2:
      "Clean Jobs створений, щоб зробити це простішим. Клінінгова компанія може створити профіль, показати назву й логотип, отримувати запити та ставати видимою для людей, які вже шукають допомогу з прибиранням.",

    citiesEyebrow: "Міста",
    citiesTitle: "Сильні клінінгові ринки у Швеції",
    citiesText1:
      "Найсильніші ринки часто знаходяться у Стокгольмі, Гетеборзі та Мальме. Там багато житла, офісів, переїздів і локального бізнесу.",
    citiesText2:
      "Тому довгострокова стратегія має включати як національні сторінки, так і локальні сторінки міст. Національні сторінки будують довіру, а міські сторінки ловлять локальні пошуки.",

    ctaTitle: "Розвивайте клінінгову компанію з Clean Jobs",
    ctaText:
      "Clean Jobs допомагає клінінговим компаніям, прибиральникам і клієнтам знаходити одне одного у спеціалізованому маркетплейсі. Створіть профіль, знайдіть завдання або опублікуйте роботу вже сьогодні.",
    createAccount: "Створити акаунт",
    stockholmCompany: "Клінінгова фірма Стокгольм",
  },

  ru: {
    metaTitle: "Статистика клининговой отрасли в Швеции 2026 | Clean Jobs",
    metaDescription:
      "Статистика и гид по клининговой отрасли в Швеции. Узнайте о клининговых компаниях, спросе, работниках, рынке и возможностях.",
    metaOgTitle: "Статистика клининговой отрасли в Швеции | Clean Jobs",
    metaOgDescription:
      "Гид по клининговой отрасли в Швеции, клининговым компаниям, работам по уборке и развитию рынка.",
    metaOgAlt: "Статистика клининговой отрасли в Швеции",

    faqStatsQuestion: "Где найти статистику о клининговой отрасли в Швеции?",
    faqStatsAnswer:
      "Официальная статистика о компаниях и работниках доступна в SCB, включая Företagsregistret и статистическую базу по отраслям.",
    faqImportantQuestion: "Важна ли клининговая отрасль в Швеции?",
    faqImportantAnswer:
      "Да. Отрасль включает уборку дома, офиса, facility management, уборку после переезда и клининговые компании для частных и бизнес-клиентов.",
    faqClientsQuestion: "Как клининговым компаниям получать больше клиентов?",
    faqClientsAnswer:
      "Клининговые компании могут получать больше клиентов через локальную видимость, понятный профиль, быструю коммуникацию, хорошие отзывы и платформы вроде Clean Jobs.",

    heroEyebrow: "Статистика клининговой отрасли",
    heroTitle: "Клининговая отрасль в Швеции: статистика, рынок и возможности",
    heroText:
      "Клининговая отрасль в Швеции включает уборку дома, офиса, facility management, уборку после переезда, санитарные работы и компании, работающие с частными и бизнес-клиентами. Этот гид объясняет отрасль и почему цифровая видимость становится всё важнее.",
    seeJobs: "Смотреть работы по уборке",
    postJob: "Опубликовать работу по уборке",

    statOfficialTitle: "Официальные данные компаний",
    statOfficialValue: "SCB",
    statOfficialText:
      "Företagsregistret от SCB показывает количество компаний и работников по отраслям и размерам компаний.",
    statTrendTitle: "Развитие отрасли",
    statTrendValue: "Фаза роста",
    statTrendText:
      "Отчёт Almega Serviceföretagen 2024 описывает клининг, FM и домашние сервисы как отрасль в фазе роста.",
    statTurnoverTitle: "Оборот на работника",
    statTurnoverValue: "€54,7k",
    statTurnoverText:
      "Международный dataset для cleaning services указывал около 54,7 тысячи евро оборота на работника в Швеции в 2023 году.",

    overviewEyebrow: "Обзор",
    overviewTitle: "Что входит в клининговую отрасль?",
    overviewText1:
      "Клининговая отрасль шире, чем только уборка дома. Она включает уборку офисов, лестниц, после переезда, генеральную уборку, facility management, санитарные работы и постоянные услуги для компаний, жилищных ассоциаций, владельцев недвижимости и частных лиц.",
    overviewText2:
      "Поэтому разные клиенты ищут по-разному. Частное лицо может искать “städfirma Stockholm”, а компания — “kontorsstädning Göteborg” или “facility services Sverige”.",

    statisticsEyebrow: "Статистика",
    statisticsTitle: "Откуда берётся статистика?",
    statisticsText1:
      "Самый надёжный источник официальной статистики — SCB. Företagsregistret показывает количество компаний и работников по отраслям и размерам компаний.",
    statisticsText2:
      "Отраслевые организации также публикуют отчёты. Almega Serviceföretagen 2024 описывает клининг, facility management и home-service компании как отрасль, которая продолжает развиваться даже в более сложной среде.",

    demandEyebrow: "Спрос",
    demandTitle: "Почему спрос остаётся сильным?",
    demandText1:
      "Уборка — это повторяющаяся потребность. Жильё, офисы, магазины, рестораны, арендные квартиры и владельцы недвижимости нуждаются в уборке.",
    demandText2:
      "Это создаёт возможности как для отдельных уборщиков, так и для клининговых компаний. Работники могут находить уборку дома, офиса и после переезда, а компании — строить долгосрочные отношения с клиентами.",

    digitalEyebrow: "Диджитализация",
    digitalTitle: "Почему клининговым компаниям нужно быть видимыми онлайн?",
    digitalText1:
      "Многие клининговые компании всё ещё зависят от рекомендаций, локальных групп, старых каталогов или ручных продаж. Это может работать, но медленно.",
    digitalText2:
      "Clean Jobs создан, чтобы сделать это проще. Клининговая компания может создать профиль, показать название и логотип, получать запросы и становиться видимой для людей, которые уже ищут помощь с уборкой.",

    citiesEyebrow: "Города",
    citiesTitle: "Сильные клининговые рынки в Швеции",
    citiesText1:
      "Самые сильные рынки часто находятся в Стокгольме, Гётеборге и Мальмё. Там много жилья, офисов, переездов и локального бизнеса.",
    citiesText2:
      "Поэтому долгосрочная стратегия должна включать как национальные страницы, так и локальные страницы городов. Национальные страницы строят доверие, а городские страницы ловят локальные поиски.",

    ctaTitle: "Развивайте клининговую компанию с Clean Jobs",
    ctaText:
      "Clean Jobs помогает клининговым компаниям, уборщикам и клиентам находить друг друга в специализированном маркетплейсе. Создайте профиль, найдите задание или опубликуйте работу уже сегодня.",
    createAccount: "Создать аккаунт",
    stockholmCompany: "Клининговая фирма Стокгольм",
  },

  en: {
    metaTitle: "Cleaning Industry in Sweden Statistics 2026 | Market Guide",
    metaDescription:
      "Statistics and guide about the cleaning industry in Sweden. Learn about cleaning companies, demand, employees, market and opportunities.",
    metaOgTitle: "Cleaning Industry in Sweden Statistics | Clean Jobs",
    metaOgDescription:
      "Guide to the cleaning industry in Sweden, cleaning companies, cleaning jobs and market development.",
    metaOgAlt: "Cleaning industry in Sweden statistics",

    faqStatsQuestion: "Where can you find statistics about the cleaning industry in Sweden?",
    faqStatsAnswer:
      "Official statistics about companies and employees are available from SCB, including the Business Register and the statistical database by industry.",
    faqImportantQuestion: "Is the cleaning industry important in Sweden?",
    faqImportantAnswer:
      "Yes. The cleaning industry includes home cleaning, office cleaning, facility management, move-out cleaning and cleaning companies helping both private individuals and businesses.",
    faqClientsQuestion: "How can cleaning companies get more clients?",
    faqClientsAnswer:
      "Cleaning companies can get more clients through local visibility, a clear profile, fast communication, good reviews and platforms like Clean Jobs.",

    heroEyebrow: "Cleaning industry statistics",
    heroTitle: "The cleaning industry in Sweden: statistics, market and opportunities",
    heroText:
      "The cleaning industry in Sweden includes home cleaning, office cleaning, facility management, move-out cleaning, sanitation and cleaning companies working with both private individuals and businesses. This guide summarizes the industry and why digital visibility is becoming increasingly important.",
    seeJobs: "See cleaning jobs",
    postJob: "Post cleaning job",

    statOfficialTitle: "Official company data",
    statOfficialValue: "SCB",
    statOfficialText:
      "SCB’s Business Register reports the number of companies and employees by industry and company size.",
    statTrendTitle: "Industry development",
    statTrendValue: "Growth phase",
    statTrendText:
      "Almega Serviceföretagen’s 2024 industry report describes cleaning, FM and home services as an industry in a growth phase.",
    statTurnoverTitle: "Turnover per employee",
    statTurnoverValue: "€54.7k",
    statTurnoverText:
      "An international cleaning-services dataset reported about 54.7 thousand euros in turnover per employee in Sweden in 2023.",

    overviewEyebrow: "Overview",
    overviewTitle: "What is included in the cleaning industry?",
    overviewText1:
      "The cleaning industry is broader than home cleaning. It also includes office cleaning, stair cleaning, move-out cleaning, deep cleaning, facility management, sanitation and ongoing cleaning services for companies, housing associations, property owners and private individuals.",
    overviewText2:
      "That means different customers search in different ways. A private person may search for “städfirma Stockholm”, while a business may search for “kontorsstädning Göteborg” or “facility services Sverige”.",

    statisticsEyebrow: "Statistics",
    statisticsTitle: "Where does the statistics come from?",
    statisticsText1:
      "The most reliable source for official statistics is SCB. The Business Register shows the number of companies and employees by industry and company size.",
    statisticsText2:
      "Industry organizations also publish reports. Almega Serviceföretagen’s 2024 report covers cleaning, facility management and home-service companies and describes an industry that continues to develop despite a tougher external environment.",

    demandEyebrow: "Demand",
    demandTitle: "Why does demand remain strong?",
    demandText1:
      "Cleaning is a recurring need. Homes, offices, shops, restaurants, rental apartments and property owners need cleaning.",
    demandText2:
      "This creates opportunities for both individual cleaners and cleaning companies. Workers can find home cleaning, office cleaning and move-out cleaning, while companies can build long-term customer relationships.",

    digitalEyebrow: "Digitalization",
    digitalTitle: "Why do cleaning companies need digital visibility?",
    digitalText1:
      "Many cleaning companies still depend on recommendations, local groups, old directories or manual sales. That can work, but it is slow.",
    digitalText2:
      "Clean Jobs is built to make this easier. A cleaning company can create a profile, show company name and logo, receive requests and become visible to people already looking for cleaning help.",

    citiesEyebrow: "Cities",
    citiesTitle: "Strong cleaning markets in Sweden",
    citiesText1:
      "The strongest markets are often Stockholm, Gothenburg and Malmö. These areas have many homes, offices, moves and local businesses.",
    citiesText2:
      "That is why a long-term strategy should include both national pages and local city pages. National pages build trust, while city pages capture local searches.",

    ctaTitle: "Grow as a cleaning company with Clean Jobs",
    ctaText:
      "Clean Jobs helps cleaning companies, cleaners and customers find each other in a focused marketplace. Create a profile, find assignments or post a cleaning job today.",
    createAccount: "Create account",
    stockholmCompany: "Cleaning company Stockholm",
  },

  sv: {
    metaTitle: "Städbranschen i Sverige Statistik 2026 | Marknadsguide",
    metaDescription:
      "Statistik och guide om städbranschen i Sverige. Läs om städföretag, efterfrågan, anställda, marknad och möjligheter för städare och kunder.",
    metaOgTitle: "Städbranschen i Sverige Statistik | Clean Jobs",
    metaOgDescription:
      "Guide till städbranschen i Sverige, städföretag, städjobb och marknadens utveckling.",
    metaOgAlt: "Städbranschen i Sverige statistik",

    faqStatsQuestion: "Var hittar man statistik om städbranschen i Sverige?",
    faqStatsAnswer:
      "Officiell statistik om företag och anställda finns hos SCB, bland annat i Företagsregistret och statistikdatabasen efter bransch.",
    faqImportantQuestion: "Är städbranschen viktig i Sverige?",
    faqImportantAnswer:
      "Ja. Städbranschen omfattar hemstädning, kontorsstädning, facility management, flyttstädning och städföretag som hjälper både privatpersoner och företag.",
    faqClientsQuestion: "Hur kan städföretag få fler kunder?",
    faqClientsAnswer:
      "Städföretag kan få fler kunder genom lokal synlighet, tydlig profil, snabb kommunikation, bra omdömen och plattformar som Clean Jobs.",

    heroEyebrow: "Städbranschen statistik",
    heroTitle: "Städbranschen i Sverige: statistik, marknad och möjligheter",
    heroText:
      "Städbranschen i Sverige omfattar hemstädning, kontorsstädning, facility management, flyttstädning, sanering och städföretag som arbetar mot både privatpersoner och företag. Den här guiden sammanfattar branschen och varför digital synlighet blir allt viktigare.",
    seeJobs: "Se städjobb",
    postJob: "Lägg upp städjobb",

    statOfficialTitle: "Officiell företagsdata",
    statOfficialValue: "SCB",
    statOfficialText:
      "SCB:s Företagsregister redovisar antal företag och anställda efter bransch och storleksklass.",
    statTrendTitle: "Branschens utveckling",
    statTrendValue: "Tillväxtfas",
    statTrendText:
      "Almega Serviceföretagens branschrapport 2024 beskriver städ-, FM- och hemservicebranschen som en bransch i tillväxtfas.",
    statTurnoverTitle: "Omsättning per anställd",
    statTurnoverValue: "€54,7k",
    statTurnoverText:
      "En internationell dataset för cleaning services angav cirka 54,7 tusen euro i omsättning per anställd i Sverige 2023.",

    overviewEyebrow: "Översikt",
    overviewTitle: "Vad ingår i städbranschen?",
    overviewText1:
      "Städbranschen är bredare än bara hemstädning. Den omfattar även kontorsstädning, trappstädning, flyttstädning, storstädning, facility management, sanering och löpande städservice åt företag, bostadsrättsföreningar, fastighetsägare och privatpersoner.",
    overviewText2:
      "Det gör att olika kunder söker på olika sätt. En privatperson kan söka efter “städfirma Stockholm”, medan ett företag kan söka efter “kontorsstädning Göteborg” eller “facility services Sverige”.",

    statisticsEyebrow: "Statistik",
    statisticsTitle: "Varifrån kommer statistiken?",
    statisticsText1:
      "Den mest tillförlitliga källan för officiell statistik är SCB. Företagsregistret visar antal företag och anställda efter bransch och storleksklass.",
    statisticsText2:
      "Branschorganisationer publicerar också rapporter. Almega Serviceföretagens branschrapport 2024 behandlar städ-, facility management- och hemserviceföretag och beskriver en bransch som fortsätter utvecklas trots ett tuffare omvärldsläge.",

    demandEyebrow: "Efterfrågan",
    demandTitle: "Varför finns det fortsatt efterfrågan?",
    demandText1:
      "Städning är ett återkommande behov. Bostäder, kontor, butiker, restauranger, hyreslägenheter och fastighetsägare behöver städning.",
    demandText2:
      "Det skapar möjligheter för både enskilda städare och städföretag. Arbetare kan hitta hemstädning, kontorsstädning och flyttstädning, medan företag kan bygga långsiktiga kundrelationer.",

    digitalEyebrow: "Digitalisering",
    digitalTitle: "Varför behöver städföretag synas digitalt?",
    digitalText1:
      "Många städföretag är fortfarande beroende av rekommendationer, lokala grupper, gamla kataloger eller manuell försäljning. Det kan fungera, men det går långsamt.",
    digitalText2:
      "Clean Jobs är byggt för att göra detta enklare. Ett städföretag kan skapa profil, visa företagsnamn och logotyp, ta emot förfrågningar och bli synligt för personer som redan söker städhjälp.",

    citiesEyebrow: "Städer",
    citiesTitle: "Starka städmarknader i Sverige",
    citiesText1:
      "De starkaste marknaderna finns ofta i Stockholm, Göteborg och Malmö. Där finns många bostäder, kontor, flyttar och lokala företag.",
    citiesText2:
      "Därför bör en långsiktig strategi innehålla både nationella sidor och lokala stadssidor. Nationella sidor bygger förtroende, medan stadssidor fångar lokala sökningar.",

    ctaTitle: "Väx som städföretag med Clean Jobs",
    ctaText:
      "Clean Jobs hjälper städföretag, städare och kunder att hitta varandra i en fokuserad marknadsplats. Skapa profil, hitta uppdrag eller lägg upp ett städjobb idag.",
    createAccount: "Skapa konto",
    stockholmCompany: "Städfirma Stockholm",
  },

  pl: {
    metaTitle: "Statystyki branży sprzątania w Szwecji 2026 | Clean Jobs",
    metaDescription:
      "Statystyki i poradnik o branży sprzątania w Szwecji. Dowiedz się o firmach sprzątających, popycie, pracownikach, rynku i możliwościach.",
    metaOgTitle: "Statystyki branży sprzątania w Szwecji | Clean Jobs",
    metaOgDescription:
      "Poradnik o branży sprzątania w Szwecji, firmach sprzątających, pracach sprzątania i rozwoju rynku.",
    metaOgAlt: "Statystyki branży sprzątania w Szwecji",

    faqStatsQuestion: "Gdzie znaleźć statystyki o branży sprzątania w Szwecji?",
    faqStatsAnswer:
      "Oficjalne statystyki o firmach i pracownikach są dostępne w SCB, między innymi w Företagsregistret i bazie statystycznej według branży.",
    faqImportantQuestion: "Czy branża sprzątania jest ważna w Szwecji?",
    faqImportantAnswer:
      "Tak. Branża obejmuje sprzątanie domu, biura, facility management, sprzątanie po przeprowadzce i firmy sprzątające pomagające klientom prywatnym oraz biznesowym.",
    faqClientsQuestion: "Jak firmy sprzątające mogą zdobyć więcej klientów?",
    faqClientsAnswer:
      "Firmy sprzątające mogą zdobywać więcej klientów przez lokalną widoczność, jasny profil, szybką komunikację, dobre opinie i platformy takie jak Clean Jobs.",

    heroEyebrow: "Statystyki branży sprzątania",
    heroTitle: "Branża sprzątania w Szwecji: statystyki, rynek i możliwości",
    heroText:
      "Branża sprzątania w Szwecji obejmuje sprzątanie domu, biura, facility management, sprzątanie po przeprowadzce, dezynfekcję i firmy pracujące z klientami prywatnymi oraz biznesowymi. Ten poradnik podsumowuje branżę i wyjaśnia, dlaczego widoczność cyfrowa staje się coraz ważniejsza.",
    seeJobs: "Zobacz prace sprzątania",
    postJob: "Dodaj pracę sprzątania",

    statOfficialTitle: "Oficjalne dane firm",
    statOfficialValue: "SCB",
    statOfficialText:
      "Företagsregistret od SCB pokazuje liczbę firm i pracowników według branży oraz wielkości firmy.",
    statTrendTitle: "Rozwój branży",
    statTrendValue: "Faza wzrostu",
    statTrendText:
      "Raport Almega Serviceföretagen 2024 opisuje sprzątanie, FM i usługi domowe jako branżę w fazie wzrostu.",
    statTurnoverTitle: "Obrót na pracownika",
    statTurnoverValue: "€54,7k",
    statTurnoverText:
      "Międzynarodowy dataset dla cleaning services wskazał około 54,7 tysiąca euro obrotu na pracownika w Szwecji w 2023 roku.",

    overviewEyebrow: "Przegląd",
    overviewTitle: "Co obejmuje branża sprzątania?",
    overviewText1:
      "Branża sprzątania jest szersza niż samo sprzątanie domu. Obejmuje także sprzątanie biur, klatek schodowych, po przeprowadzce, sprzątanie generalne, facility management, dezynfekcję i stałe usługi dla firm, wspólnot mieszkaniowych, właścicieli nieruchomości oraz osób prywatnych.",
    overviewText2:
      "Dlatego różni klienci szukają na różne sposoby. Osoba prywatna może szukać “städfirma Stockholm”, a firma “kontorsstädning Göteborg” albo “facility services Sverige”.",

    statisticsEyebrow: "Statystyki",
    statisticsTitle: "Skąd pochodzą statystyki?",
    statisticsText1:
      "Najbardziej wiarygodnym źródłem oficjalnych statystyk jest SCB. Företagsregistret pokazuje liczbę firm i pracowników według branży oraz wielkości firmy.",
    statisticsText2:
      "Organizacje branżowe również publikują raporty. Raport Almega Serviceföretagen 2024 opisuje firmy sprzątające, facility management i home-service jako branżę, która nadal się rozwija mimo trudniejszego otoczenia.",

    demandEyebrow: "Popyt",
    demandTitle: "Dlaczego popyt pozostaje silny?",
    demandText1:
      "Sprzątanie jest powtarzalną potrzebą. Mieszkania, biura, sklepy, restauracje, lokale na wynajem i właściciele nieruchomości potrzebują sprzątania.",
    demandText2:
      "To tworzy możliwości zarówno dla pojedynczych sprzątaczy, jak i firm sprzątających. Pracownicy mogą znaleźć sprzątanie domu, biura i po przeprowadzce, a firmy budować długoterminowe relacje z klientami.",

    digitalEyebrow: "Cyfryzacja",
    digitalTitle: "Dlaczego firmy sprzątające muszą być widoczne cyfrowo?",
    digitalText1:
      "Wiele firm sprzątających nadal zależy od poleceń, lokalnych grup, starych katalogów albo ręcznej sprzedaży. To może działać, ale jest wolne.",
    digitalText2:
      "Clean Jobs został stworzony, aby to ułatwić. Firma sprzątająca może utworzyć profil, pokazać nazwę i logo, otrzymywać zapytania oraz stać się widoczna dla osób, które już szukają pomocy w sprzątaniu.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Silne rynki sprzątania w Szwecji",
    citiesText1:
      "Najsilniejsze rynki często znajdują się w Sztokholmie, Göteborgu i Malmö. Jest tam wiele mieszkań, biur, przeprowadzek i lokalnych firm.",
    citiesText2:
      "Dlatego długoterminowa strategia powinna zawierać zarówno strony krajowe, jak i lokalne strony miast. Strony krajowe budują zaufanie, a strony miejskie przechwytują lokalne wyszukiwania.",

    ctaTitle: "Rozwijaj firmę sprzątającą z Clean Jobs",
    ctaText:
      "Clean Jobs pomaga firmom sprzątającym, sprzątaczom i klientom znaleźć się nawzajem w wyspecjalizowanym marketplace. Utwórz profil, znajdź zlecenia albo dodaj pracę sprzątania już dziś.",
    createAccount: "Utwórz konto",
    stockholmCompany: "Firma sprzątająca Sztokholm",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/stadbranschen-i-sverige-statistik",
    },
    keywords: [
      "städbranschen Sverige statistik",
      "städbranschen Sverige",
      "städföretag Sverige",
      "städmarknaden Sverige",
      "städservice Sverige",
      "hemstädning Sverige",
      "kontorsstädning Sverige",
      "städjobb Sverige",
      "facility management Sverige",
      "städfirma statistik",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/stadbranschen-i-sverige-statistik`,
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
      { "@type": "Question", name: t.faqStatsQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqStatsAnswer } },
      { "@type": "Question", name: t.faqImportantQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqImportantAnswer } },
      { "@type": "Question", name: t.faqClientsQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqClientsAnswer } },
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

function StatCard({ title, value, text }: { title: string; value: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function StadbranschenStatistikPage() {
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

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">{t.heroTitle}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">{t.heroText}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
              {t.seeJobs}
            </Link>
            <Link href="/jobs/create" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]">
              {t.postJob}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard title={t.statOfficialTitle} value={t.statOfficialValue} text={t.statOfficialText} />
            <StatCard title={t.statTrendTitle} value={t.statTrendValue} text={t.statTrendText} />
            <StatCard title={t.statTurnoverTitle} value={t.statTurnoverValue} text={t.statTurnoverText} />
          </section>

          <Section eyebrow={t.overviewEyebrow} title={t.overviewTitle}>
            <p>{t.overviewText1}</p>
            <p>{t.overviewText2}</p>
          </Section>

          <Section eyebrow={t.statisticsEyebrow} title={t.statisticsTitle}>
            <p>{t.statisticsText1}</p>
            <p>{t.statisticsText2}</p>
          </Section>

          <Section eyebrow={t.demandEyebrow} title={t.demandTitle}>
            <p>{t.demandText1}</p>
            <p>{t.demandText2}</p>
          </Section>

          <Section eyebrow={t.digitalEyebrow} title={t.digitalTitle}>
            <p>{t.digitalText1}</p>
            <p>{t.digitalText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{t.ctaText}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
                {t.createAccount}
              </Link>
              <Link href="/stadfirma-stockholm" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">
                {t.stockholmCompany}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/stadbranschen-i-sverige-statistik" />
        </div>
      </main>
    </div>
  )
}