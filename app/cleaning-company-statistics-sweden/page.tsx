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
    metaTitle: "Статистика клінінгових компаній у Швеції 2026 | Clean Jobs",
    metaDescription:
      "Статистика клінінгових компаній і гід по ринку Швеції. Дізнайтеся про індустрію прибирання, попит, компанії, зайнятість і можливості.",
    metaOgTitle: "Статистика клінінгових компаній у Швеції | Clean Jobs",
    metaOgDescription:
      "Гід по ринку клінінгових компаній, робіт з прибирання та індустрії клінінгових послуг у Швеції.",
    metaOgAlt: "Статистика клінінгових компаній у Швеції",

    faqIndustryQuestion: "Чи важлива клінінгова індустрія у Швеції?",
    faqIndustryAnswer:
      "Так. Клінінгові послуги є частиною ширшої сервісної економіки Швеції та включають прибирання дому, офісу, facility services, прибирання після переїзду й компанії, які працюють із приватними та бізнес-клієнтами.",
    faqDataQuestion: "Де знайти офіційні дані про клінінгові компанії у Швеції?",
    faqDataAnswer:
      "Офіційні дані про компанії та зайнятість можна знайти через Statistics Sweden, зокрема Statistical Business Register та іншу статистику SCB за галузями.",
    faqClientsQuestion: "Як клінінговим компаніям отримувати більше клієнтів у Швеції?",
    faqClientsAnswer:
      "Клінінгові компанії можуть підвищити видимість, створивши онлайн-профіль, показавши інформацію про компанію, швидко відповідаючи на запити та використовуючи маркетплейси, такі як Clean Jobs.",

    heroEyebrow: "Клінінгова індустрія Швеції",
    heroTitle: "Статистика клінінгових компаній у Швеції",
    heroText:
      "Клінінгова індустрія Швеції включає прибирання дому, офісу, facility services, прибирання після переїзду, санітарне прибирання та компанії, які працюють із приватними домами, власниками нерухомості й бізнесами. Цей гід пояснює ринок і чому цифрова видимість важлива для прибиральників та клінінгових компаній.",
    browseJobs: "Переглянути роботи з прибирання",
    postJob: "Опублікувати роботу з прибирання",

    statOfficialTitle: "Офіційні дані компаній",
    statOfficialValue: "SCB",
    statOfficialText:
      "Statistics Sweden показує кількість підприємств і працівників за галузями та розмірами компаній через Statistical Business Register.",
    statTrendTitle: "Тренд індустрії",
    statTrendValue: "Фаза росту",
    statTrendText:
      "Звіт Almega Serviceföretagen 2024 описує індустрію клінінгу, FM і домашніх сервісів як сектор у фазі росту, попри складніше зовнішнє середовище.",
    statProductivityTitle: "Орієнтир продуктивності",
    statProductivityValue: "€54.7k",
    statProductivityText:
      "Дані по cleaning services за 2023 рік показували turnover per employee у Швеції приблизно 54,7 тисячі євро, з прогнозами близько 55 тисяч євро.",

    overviewEyebrow: "Огляд ринку",
    overviewTitle: "Що входить у клінінгову індустрію Швеції?",
    overviewText1:
      "Шведський ринок прибирання ширший, ніж лише приватне прибирання дому. Він включає клінінгові компанії, facility management, прибирання офісів, домашні сервіси, прибирання після переїзду, сходів, санітарне прибирання, прибирання магазинів і послуги для власників нерухомості.",
    overviewText2:
      "Для SEO та розвитку бізнесу це важливо, бо різні клієнти шукають по-різному. Приватний клієнт може шукати “hire cleaner Stockholm”, а бізнес-клієнт — “office cleaning company Sweden” або “cleaning company Stockholm”.",

    statisticsEyebrow: "Статистика",
    statisticsTitle: "Звідки беруться цифри",
    statisticsText1:
      "Найнадійніше офіційне джерело для даних про компанії та зайнятість — Statistics Sweden. Statistical Business Register від SCB показує підприємства й працівників за галузями та розмірами компаній.",
    statisticsText2:
      "Галузеві організації також публікують ринкові звіти. Звіт Almega Serviceföretagen 2024 охоплює клінінг, facility management і home-service компанії та описує сектор як такий, що продовжує розвиватися навіть у складнішій економіці.",

    demandEyebrow: "Попит",
    demandTitle: "Чому попит на клінінгові послуги залишається сильним",
    demandText1:
      "Прибирання — це регулярна потреба. Доми, офіси, орендні квартири, магазини, ресторани та власники нерухомості постійно потребують прибирання.",
    demandText2:
      "Це створює можливості як для окремих прибиральників, так і для клінінгових компаній. Працівники можуть знаходити роботи з прибирання дому, офісу й після переїзду, а компанії можуть будувати постійні клієнтські відносини та локальну впізнаваність.",

    digitalEyebrow: "Цифрова видимість",
    digitalTitle: "Чому клінінговим компаніям потрібна онлайн-видимість",
    digitalText1:
      "Багато клінінгових компаній досі залежать від рекомендацій, локальних Facebook-груп, старих каталогів або ручного пошуку клієнтів. Це може працювати, але повільно.",
    digitalText2:
      "Clean Jobs створений, щоб зробити це простішим. Клінінгова компанія може створити профіль, показати назву й логотип, отримувати запити на роботи та ставати видимою для людей, які вже шукають допомогу з прибиранням.",

    citiesEyebrow: "Міста",
    citiesTitle: "Сильні клінінгові ринки у Швеції",
    citiesText1:
      "Найсильніші ринки зазвичай у найбільших міських регіонах: Стокгольм, Гетеборг і Мальме. У цих районах багато квартир, офісів, орендної нерухомості та локального бізнесу.",
    citiesText2:
      "Довгострокова стратегія має включати як національні сторінки, так і міські сторінки. Національні сторінки пояснюють ринок, а міські сторінки покривають локальні запити.",

    ctaTitle: "Розвивайте клінінгову компанію з Clean Jobs",
    ctaText:
      "Clean Jobs допомагає клінінговим компаніям, прибиральникам і клієнтам зустрічатися в одному спеціалізованому маркетплейсі. Створіть профіль, переглядайте роботи або опублікуйте роботу з прибирання вже сьогодні.",
    createAccount: "Створити акаунт",
    hireCleanerStockholm: "Найняти прибиральника в Стокгольмі",
  },

  ru: {
    metaTitle: "Статистика клининговых компаний в Швеции 2026 | Clean Jobs",
    metaDescription:
      "Статистика клининговых компаний и гид по рынку Швеции. Узнайте об индустрии уборки, спросе, компаниях, занятости и возможностях.",
    metaOgTitle: "Статистика клининговых компаний в Швеции | Clean Jobs",
    metaOgDescription:
      "Гид по рынку клининговых компаний, работ по уборке и индустрии клининговых услуг в Швеции.",
    metaOgAlt: "Статистика клининговых компаний в Швеции",

    faqIndustryQuestion: "Важна ли клининговая индустрия в Швеции?",
    faqIndustryAnswer:
      "Да. Клининговые услуги являются частью широкой сервисной экономики Швеции и включают уборку дома, офиса, facility services, уборку после переезда и компании, работающие с частными и бизнес-клиентами.",
    faqDataQuestion: "Где найти официальные данные о клининговых компаниях в Швеции?",
    faqDataAnswer:
      "Официальные данные о компаниях и занятости можно найти через Statistics Sweden, включая Statistical Business Register и другую статистику SCB по отраслям.",
    faqClientsQuestion: "Как клининговым компаниям получать больше клиентов в Швеции?",
    faqClientsAnswer:
      "Клининговые компании могут повысить видимость, создав онлайн-профиль, показав информацию о компании, быстро отвечая на запросы и используя маркетплейсы, такие как Clean Jobs.",

    heroEyebrow: "Клининговая индустрия Швеции",
    heroTitle: "Статистика клининговых компаний в Швеции",
    heroText:
      "Клининговая индустрия Швеции включает уборку дома, офиса, facility services, уборку после переезда, санитарную уборку и компании, которые работают с частными домами, владельцами недвижимости и бизнесом. Этот гид объясняет рынок и почему цифровая видимость важна для уборщиков и клининговых компаний.",
    browseJobs: "Смотреть работы по уборке",
    postJob: "Опубликовать работу по уборке",

    statOfficialTitle: "Официальные данные компаний",
    statOfficialValue: "SCB",
    statOfficialText:
      "Statistics Sweden показывает количество предприятий и работников по отраслям и размерам компаний через Statistical Business Register.",
    statTrendTitle: "Тренд индустрии",
    statTrendValue: "Фаза роста",
    statTrendText:
      "Отчёт Almega Serviceföretagen 2024 описывает индустрию клининга, FM и домашних сервисов как сектор в фазе роста, несмотря на сложную внешнюю среду.",
    statProductivityTitle: "Ориентир продуктивности",
    statProductivityValue: "€54.7k",
    statProductivityText:
      "Данные по cleaning services за 2023 год показывали turnover per employee в Швеции около 54,7 тысячи евро, с прогнозами около 55 тысяч евро.",

    overviewEyebrow: "Обзор рынка",
    overviewTitle: "Что входит в клининговую индустрию Швеции?",
    overviewText1:
      "Шведский рынок уборки шире, чем только частная уборка дома. Он включает клининговые компании, facility management, уборку офисов, домашние сервисы, уборку после переезда, лестниц, санитарную уборку, уборку магазинов и услуги для владельцев недвижимости.",
    overviewText2:
      "Для SEO и развития бизнеса это важно, потому что разные клиенты ищут по-разному. Частный клиент может искать “hire cleaner Stockholm”, а бизнес-клиент — “office cleaning company Sweden” или “cleaning company Stockholm”.",

    statisticsEyebrow: "Статистика",
    statisticsTitle: "Откуда берутся цифры",
    statisticsText1:
      "Самый надёжный официальный источник данных о компаниях и занятости — Statistics Sweden. Statistical Business Register от SCB показывает предприятия и работников по отраслям и размерам компаний.",
    statisticsText2:
      "Отраслевые организации также публикуют рыночные отчёты. Отчёт Almega Serviceföretagen 2024 охватывает клининг, facility management и home-service компании и описывает сектор как продолжающий развиваться даже в более сложной экономике.",

    demandEyebrow: "Спрос",
    demandTitle: "Почему спрос на клининговые услуги остаётся сильным",
    demandText1:
      "Уборка — это регулярная потребность. Дома, офисы, арендные квартиры, магазины, рестораны и владельцы недвижимости постоянно нуждаются в уборке.",
    demandText2:
      "Это создаёт возможности как для отдельных уборщиков, так и для клининговых компаний. Работники могут находить работы по уборке дома, офиса и после переезда, а компании могут строить постоянные отношения с клиентами и локальную узнаваемость.",

    digitalEyebrow: "Цифровая видимость",
    digitalTitle: "Почему клининговым компаниям нужна онлайн-видимость",
    digitalText1:
      "Многие клининговые компании всё ещё зависят от рекомендаций, локальных Facebook-групп, старых каталогов или ручного поиска клиентов. Это может работать, но медленно.",
    digitalText2:
      "Clean Jobs создан, чтобы сделать это проще. Клининговая компания может создать профиль, показать название и логотип, получать запросы на работы и становиться видимой для людей, которые уже ищут помощь с уборкой.",

    citiesEyebrow: "Города",
    citiesTitle: "Сильные клининговые рынки в Швеции",
    citiesText1:
      "Самые сильные рынки обычно в крупнейших городских регионах: Стокгольм, Гётеборг и Мальмё. В этих районах много квартир, офисов, арендной недвижимости и локального бизнеса.",
    citiesText2:
      "Долгосрочная стратегия должна включать как национальные страницы, так и городские страницы. Национальные страницы объясняют рынок, а городские страницы покрывают локальные запросы.",

    ctaTitle: "Развивайте клининговую компанию с Clean Jobs",
    ctaText:
      "Clean Jobs помогает клининговым компаниям, уборщикам и клиентам встречаться в одном специализированном маркетплейсе. Создайте профиль, смотрите работы или опубликуйте работу по уборке уже сегодня.",
    createAccount: "Создать аккаунт",
    hireCleanerStockholm: "Нанять уборщика в Стокгольме",
  },

  en: {
    metaTitle: "Cleaning Company Statistics Sweden 2026 | Market Guide",
    metaDescription:
      "Cleaning company statistics and market guide for Sweden. Learn about the cleaning services industry, demand, companies, employment and opportunities for cleaners and clients.",
    metaOgTitle: "Cleaning Company Statistics Sweden | Clean Jobs",
    metaOgDescription:
      "Market guide for cleaning companies, cleaning jobs and the cleaning services industry in Sweden.",
    metaOgAlt: "Cleaning company statistics Sweden",

    faqIndustryQuestion: "Is the cleaning industry important in Sweden?",
    faqIndustryAnswer:
      "Yes. Cleaning services are part of Sweden's broader service economy and include home cleaning, office cleaning, facility services, move-out cleaning and cleaning companies serving private and business clients.",
    faqDataQuestion: "Where can I find official cleaning company data in Sweden?",
    faqDataAnswer:
      "Official company and employment data can be found through Statistics Sweden's Statistical Business Register and other SCB statistics by industry.",
    faqClientsQuestion: "How can cleaning companies get more clients in Sweden?",
    faqClientsAnswer:
      "Cleaning companies can improve visibility by building an online profile, showing company information, responding quickly to requests and using marketplaces such as Clean Jobs.",

    heroEyebrow: "Cleaning industry Sweden",
    heroTitle: "Cleaning company statistics in Sweden",
    heroText:
      "Sweden’s cleaning services industry includes home cleaning, office cleaning, facility services, move-out cleaning, sanitation and cleaning companies serving private homes, property owners and businesses. This guide summarizes the market and explains why digital visibility is important for cleaners and cleaning companies.",
    browseJobs: "Browse cleaning jobs",
    postJob: "Post a cleaning job",

    statOfficialTitle: "Official company data",
    statOfficialValue: "SCB",
    statOfficialText:
      "Statistics Sweden reports the number of enterprises and employees by industry and size class through the Statistical Business Register.",
    statTrendTitle: "Industry trend",
    statTrendValue: "Growth phase",
    statTrendText:
      "Almega Serviceföretagen’s 2024 report describes the cleaning, FM and home-service industry as being in a growth phase despite a challenging external environment.",
    statProductivityTitle: "Productivity benchmark",
    statProductivityValue: "€54.7k",
    statProductivityText:
      "A 2023 cleaning-services dataset reported turnover per employee in Sweden at about 54.7 thousand euros, with forecasts staying close to 55 thousand euros.",

    overviewEyebrow: "Market overview",
    overviewTitle: "What counts as the cleaning industry in Sweden?",
    overviewText1:
      "The Swedish cleaning market is broader than only private home cleaning. It includes cleaning companies, facility management, office cleaning, home services, move-out cleaning, stair cleaning, sanitation, retail cleaning and cleaning for property owners.",
    overviewText2:
      "For SEO and business development, this matters because different clients search in different ways. A private client may search for “hire cleaner Stockholm”, while a business client may search for “office cleaning company Sweden” or “cleaning company Stockholm”.",

    statisticsEyebrow: "Statistics",
    statisticsTitle: "Where the numbers come from",
    statisticsText1:
      "The most reliable official source for company and employment data is Statistics Sweden. SCB’s Statistical Business Register reports enterprises and employees by industry and size class.",
    statisticsText2:
      "Industry organizations also publish market reports. Almega Serviceföretagen’s 2024 branch report covers cleaning, facility management and home-service companies and describes the sector as continuing to develop even during a more challenging economy.",

    demandEyebrow: "Demand",
    demandTitle: "Why demand for cleaning services remains strong",
    demandText1:
      "Cleaning is a recurring need. Homes, offices, rental apartments, shops, restaurants and property owners all need cleaning.",
    demandText2:
      "This creates opportunities for both individual cleaners and cleaning companies. Workers can find home cleaning, office cleaning and move-out cleaning jobs, while companies can build recurring client relationships and local brand visibility.",

    digitalEyebrow: "Digital visibility",
    digitalTitle: "Why cleaning companies need online visibility",
    digitalText1:
      "Many cleaning companies still depend on referrals, local Facebook groups, old directories or manual outreach. That can work, but it is slow.",
    digitalText2:
      "Clean Jobs is designed to make that easier. A cleaning company can create a profile, show company name and logo, receive job requests and become visible to people who are already looking for cleaning help.",

    citiesEyebrow: "Cities",
    citiesTitle: "Strong cleaning markets in Sweden",
    citiesText1:
      "The strongest markets are usually the largest city regions: Stockholm, Gothenburg and Malmö. These areas have many apartments, offices, rental properties and local businesses.",
    citiesText2:
      "A long-term strategy should include both national pages and city pages. National pages explain the market, while city pages target local searches.",

    ctaTitle: "Grow your cleaning company with Clean Jobs",
    ctaText:
      "Clean Jobs helps cleaning companies, cleaners and clients meet in one focused marketplace. Create a profile, browse jobs or post cleaning work today.",
    createAccount: "Create account",
    hireCleanerStockholm: "Hire cleaner Stockholm",
  },

  sv: {
    metaTitle: "Statistik för städföretag i Sverige 2026 | Clean Jobs",
    metaDescription:
      "Statistik och marknadsguide för städföretag i Sverige. Läs om städbranschen, efterfrågan, företag, sysselsättning och möjligheter.",
    metaOgTitle: "Statistik för städföretag i Sverige | Clean Jobs",
    metaOgDescription:
      "Marknadsguide för städföretag, städjobb och städtjänster i Sverige.",
    metaOgAlt: "Statistik för städföretag i Sverige",

    faqIndustryQuestion: "Är städbranschen viktig i Sverige?",
    faqIndustryAnswer:
      "Ja. Städtjänster är en del av Sveriges bredare tjänsteekonomi och omfattar hemstädning, kontorsstädning, facility services, flyttstädning och städföretag som arbetar med privata kunder och företagskunder.",
    faqDataQuestion: "Var hittar jag officiell data om städföretag i Sverige?",
    faqDataAnswer:
      "Officiell företags- och sysselsättningsdata finns hos Statistics Sweden, bland annat via SCB:s Företagsregister och annan branschstatistik.",
    faqClientsQuestion: "Hur kan städföretag få fler kunder i Sverige?",
    faqClientsAnswer:
      "Städföretag kan förbättra sin synlighet genom att skapa en onlineprofil, visa företagsinformation, svara snabbt på förfrågningar och använda marknadsplatser som Clean Jobs.",

    heroEyebrow: "Städbranschen i Sverige",
    heroTitle: "Statistik för städföretag i Sverige",
    heroText:
      "Sveriges städtjänstebransch omfattar hemstädning, kontorsstädning, facility services, flyttstädning, sanering och städföretag som arbetar med privata hem, fastighetsägare och företag. Den här guiden sammanfattar marknaden och förklarar varför digital synlighet är viktig för städare och städföretag.",
    browseJobs: "Bläddra bland städjobb",
    postJob: "Lägg upp städjobb",

    statOfficialTitle: "Officiell företagsdata",
    statOfficialValue: "SCB",
    statOfficialText:
      "Statistics Sweden rapporterar antal företag och anställda efter bransch och storleksklass via Företagsregistret.",
    statTrendTitle: "Branschtrend",
    statTrendValue: "Tillväxtfas",
    statTrendText:
      "Almega Serviceföretagens rapport 2024 beskriver städ-, FM- och hemservicebranschen som en sektor i tillväxtfas trots en utmanande omvärld.",
    statProductivityTitle: "Produktivitetsnivå",
    statProductivityValue: "€54.7k",
    statProductivityText:
      "Ett dataset för städtjänster 2023 rapporterade omsättning per anställd i Sverige på cirka 54,7 tusen euro, med prognoser nära 55 tusen euro.",

    overviewEyebrow: "Marknadsöversikt",
    overviewTitle: "Vad räknas som städbranschen i Sverige?",
    overviewText1:
      "Den svenska städmarknaden är bredare än bara privat hemstädning. Den omfattar städföretag, facility management, kontorsstädning, hushållsnära tjänster, flyttstädning, trappstädning, sanering, butiksstädning och städning för fastighetsägare.",
    overviewText2:
      "För SEO och affärsutveckling spelar detta roll eftersom olika kunder söker på olika sätt. En privatkund kan söka efter “hire cleaner Stockholm”, medan en företagskund kan söka efter “office cleaning company Sweden” eller “cleaning company Stockholm”.",

    statisticsEyebrow: "Statistik",
    statisticsTitle: "Var siffrorna kommer från",
    statisticsText1:
      "Den mest pålitliga officiella källan för företags- och sysselsättningsdata är Statistics Sweden. SCB:s Företagsregister rapporterar företag och anställda efter bransch och storleksklass.",
    statisticsText2:
      "Branschorganisationer publicerar också marknadsrapporter. Almega Serviceföretagens branschrapport 2024 omfattar städning, facility management och hemserviceföretag och beskriver sektorn som fortsatt utvecklande även i en mer utmanande ekonomi.",

    demandEyebrow: "Efterfrågan",
    demandTitle: "Varför efterfrågan på städtjänster är fortsatt stark",
    demandText1:
      "Städning är ett återkommande behov. Hem, kontor, hyreslägenheter, butiker, restauranger och fastighetsägare behöver alla städning.",
    demandText2:
      "Det skapar möjligheter för både enskilda städare och städföretag. Arbetare kan hitta hemstädning, kontorsstädning och flyttstädning, medan företag kan bygga återkommande kundrelationer och lokal synlighet.",

    digitalEyebrow: "Digital synlighet",
    digitalTitle: "Varför städföretag behöver synas online",
    digitalText1:
      "Många städföretag är fortfarande beroende av rekommendationer, lokala Facebook-grupper, gamla kataloger eller manuell kundkontakt. Det kan fungera, men det är långsamt.",
    digitalText2:
      "Clean Jobs är byggt för att göra detta enklare. Ett städföretag kan skapa en profil, visa företagsnamn och logotyp, ta emot jobbförfrågningar och bli synligt för människor som redan söker städhjälp.",

    citiesEyebrow: "Städer",
    citiesTitle: "Starka städmarknader i Sverige",
    citiesText1:
      "De starkaste marknaderna är vanligtvis de största stadsregionerna: Stockholm, Göteborg och Malmö. Dessa områden har många lägenheter, kontor, hyresfastigheter och lokala företag.",
    citiesText2:
      "En långsiktig strategi bör innehålla både nationella sidor och stadssidor. Nationella sidor förklarar marknaden, medan stadssidor fångar lokala sökningar.",

    ctaTitle: "Utveckla ditt städföretag med Clean Jobs",
    ctaText:
      "Clean Jobs hjälper städföretag, städare och kunder att mötas på en fokuserad marknadsplats. Skapa en profil, bläddra bland jobb eller lägg upp städarbete idag.",
    createAccount: "Skapa konto",
    hireCleanerStockholm: "Anlita städare Stockholm",
  },

  pl: {
    metaTitle: "Statystyki firm sprzątających w Szwecji 2026 | Clean Jobs",
    metaDescription:
      "Statystyki firm sprzątających i przewodnik po rynku Szwecji. Dowiedz się o branży sprzątania, popycie, firmach, zatrudnieniu i możliwościach.",
    metaOgTitle: "Statystyki firm sprzątających w Szwecji | Clean Jobs",
    metaOgDescription:
      "Przewodnik po rynku firm sprzątających, prac sprzątania i usług sprzątania w Szwecji.",
    metaOgAlt: "Statystyki firm sprzątających w Szwecji",

    faqIndustryQuestion: "Czy branża sprzątania jest ważna w Szwecji?",
    faqIndustryAnswer:
      "Tak. Usługi sprzątania są częścią szerszej gospodarki usługowej Szwecji i obejmują sprzątanie domu, biura, facility services, sprzątanie po przeprowadzce oraz firmy obsługujące klientów prywatnych i biznesowych.",
    faqDataQuestion: "Gdzie znaleźć oficjalne dane o firmach sprzątających w Szwecji?",
    faqDataAnswer:
      "Oficjalne dane o firmach i zatrudnieniu można znaleźć przez Statistics Sweden, w tym Statistical Business Register oraz inne statystyki SCB według branży.",
    faqClientsQuestion: "Jak firmy sprzątające mogą zdobyć więcej klientów w Szwecji?",
    faqClientsAnswer:
      "Firmy sprzątające mogą zwiększyć widoczność, tworząc profil online, pokazując informacje o firmie, szybko odpowiadając na zapytania i korzystając z marketplace takich jak Clean Jobs.",

    heroEyebrow: "Branża sprzątania w Szwecji",
    heroTitle: "Statystyki firm sprzątających w Szwecji",
    heroText:
      "Szwedzka branża usług sprzątania obejmuje sprzątanie domu, biura, facility services, sprzątanie po przeprowadzce, dezynfekcję oraz firmy obsługujące prywatne domy, właścicieli nieruchomości i biznesy. Ten przewodnik podsumowuje rynek i wyjaśnia, dlaczego widoczność cyfrowa jest ważna dla sprzątaczy i firm sprzątających.",
    browseJobs: "Przeglądaj prace sprzątania",
    postJob: "Dodaj pracę sprzątania",

    statOfficialTitle: "Oficjalne dane firm",
    statOfficialValue: "SCB",
    statOfficialText:
      "Statistics Sweden raportuje liczbę przedsiębiorstw i pracowników według branży oraz wielkości firmy przez Statistical Business Register.",
    statTrendTitle: "Trend branży",
    statTrendValue: "Faza wzrostu",
    statTrendText:
      "Raport Almega Serviceföretagen 2024 opisuje branżę sprzątania, FM i usług domowych jako sektor w fazie wzrostu mimo trudniejszego otoczenia.",
    statProductivityTitle: "Poziom produktywności",
    statProductivityValue: "€54.7k",
    statProductivityText:
      "Dataset usług sprzątania z 2023 roku wskazywał turnover per employee w Szwecji na około 54,7 tysiąca euro, z prognozami blisko 55 tysięcy euro.",

    overviewEyebrow: "Przegląd rynku",
    overviewTitle: "Co obejmuje branża sprzątania w Szwecji?",
    overviewText1:
      "Szwedzki rynek sprzątania jest szerszy niż tylko prywatne sprzątanie domu. Obejmuje firmy sprzątające, facility management, sprzątanie biur, usługi domowe, sprzątanie po przeprowadzce, sprzątanie klatek schodowych, dezynfekcję, sprzątanie sklepów i usługi dla właścicieli nieruchomości.",
    overviewText2:
      "Dla SEO i rozwoju biznesu ma to znaczenie, ponieważ różni klienci szukają na różne sposoby. Klient prywatny może szukać “hire cleaner Stockholm”, a klient biznesowy “office cleaning company Sweden” albo “cleaning company Stockholm”.",

    statisticsEyebrow: "Statystyki",
    statisticsTitle: "Skąd pochodzą liczby",
    statisticsText1:
      "Najbardziej wiarygodnym oficjalnym źródłem danych o firmach i zatrudnieniu jest Statistics Sweden. Statistical Business Register od SCB pokazuje przedsiębiorstwa i pracowników według branży oraz wielkości firmy.",
    statisticsText2:
      "Organizacje branżowe również publikują raporty rynkowe. Raport Almega Serviceföretagen 2024 obejmuje sprzątanie, facility management i firmy home-service oraz opisuje sektor jako nadal rozwijający się nawet w trudniejszej gospodarce.",

    demandEyebrow: "Popyt",
    demandTitle: "Dlaczego popyt na usługi sprzątania pozostaje silny",
    demandText1:
      "Sprzątanie jest regularną potrzebą. Domy, biura, mieszkania na wynajem, sklepy, restauracje i właściciele nieruchomości potrzebują sprzątania.",
    demandText2:
      "To tworzy możliwości zarówno dla pojedynczych sprzątaczy, jak i firm sprzątających. Pracownicy mogą znajdować sprzątanie domów, biur i po przeprowadzce, a firmy mogą budować stałe relacje z klientami i lokalną rozpoznawalność.",

    digitalEyebrow: "Widoczność cyfrowa",
    digitalTitle: "Dlaczego firmy sprzątające muszą być widoczne online",
    digitalText1:
      "Wiele firm sprzątających nadal zależy od poleceń, lokalnych grup na Facebooku, starych katalogów albo ręcznego kontaktu z klientami. To może działać, ale jest wolne.",
    digitalText2:
      "Clean Jobs został stworzony, aby to ułatwić. Firma sprzątająca może utworzyć profil, pokazać nazwę i logo, otrzymywać zapytania o prace i stać się widoczna dla osób, które już szukają pomocy w sprzątaniu.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Silne rynki sprzątania w Szwecji",
    citiesText1:
      "Najsilniejsze rynki to zwykle największe regiony miejskie: Sztokholm, Göteborg i Malmö. Te obszary mają wiele mieszkań, biur, nieruchomości na wynajem i lokalnych firm.",
    citiesText2:
      "Długoterminowa strategia powinna obejmować zarówno strony krajowe, jak i strony miejskie. Strony krajowe wyjaśniają rynek, a strony miejskie pokrywają lokalne wyszukiwania.",

    ctaTitle: "Rozwijaj firmę sprzątającą z Clean Jobs",
    ctaText:
      "Clean Jobs pomaga firmom sprzątającym, sprzątaczom i klientom spotkać się w jednym wyspecjalizowanym marketplace. Utwórz profil, przeglądaj prace albo dodaj pracę sprzątania już dziś.",
    createAccount: "Utwórz konto",
    hireCleanerStockholm: "Zatrudnij sprzątacza w Sztokholmie",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/cleaning-company-statistics-sweden",
    },
    keywords: [
      "cleaning company statistics Sweden",
      "cleaning industry Sweden",
      "cleaning market Sweden",
      "cleaning companies Sweden",
      "cleaning services Sweden",
      "cleaning business Sweden",
      "cleaning jobs Sweden",
      "facility management Sweden",
      "home cleaning Sweden",
      "office cleaning Sweden",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/cleaning-company-statistics-sweden`,
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
        name: t.faqIndustryQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqIndustryAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqDataQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqDataAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqClientsQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqClientsAnswer,
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
      {eyebrow ? (
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          {eyebrow}
        </div>
      ) : null}

      <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {title}
      </h2>

      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 md:text-base">
        {children}
      </div>
    </section>
  )
}

function StatCard({
  title,
  value,
  text,
}: {
  title: string
  value: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function CleaningCompanyStatisticsSwedenPage() {
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
              {t.browseJobs}
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
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title={t.statOfficialTitle}
              value={t.statOfficialValue}
              text={t.statOfficialText}
            />

            <StatCard
              title={t.statTrendTitle}
              value={t.statTrendValue}
              text={t.statTrendText}
            />

            <StatCard
              title={t.statProductivityTitle}
              value={t.statProductivityValue}
              text={t.statProductivityText}
            />
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
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {t.ctaTitle}
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
              {t.ctaText}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.createAccount}
              </Link>

              <Link
                href="/hire-cleaner-stockholm"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]"
              >
                {t.hireCleanerStockholm}
              </Link>
            </div>
          </section>
        </div>

        <RelatedGuides currentPath="/cleaning-company-statistics-sweden" />
      </main>
    </div>
  )
}