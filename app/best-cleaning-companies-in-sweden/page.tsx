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
  if (value && locales.includes(value as Locale)) {
    return value as Locale
  }

  return "uk"
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value)
}

const copy = {
  uk: {
    metaTitle: "Найкращі клінінгові компанії у Швеції 2026 | Clean Jobs",
    metaDescription:
      "Гід, як знайти найкращі клінінгові компанії у Швеції. Порівнюйте прибирання дому, офісу, після переїзду, відгуки, ціни та локальні послуги.",
    metaOgTitle: "Найкращі клінінгові компанії у Швеції | Clean Jobs",
    metaOgDescription:
      "Дізнайтеся, як порівнювати клінінгові компанії у Швеції та знаходити надійних прибиральників для дому, офісу й переїзду.",
    metaOgAlt: "Найкращі клінінгові компанії у Швеції",

    faqChooseQuestion: "Як вибрати найкращу клінінгову компанію у Швеції?",
    faqChooseAnswer:
      "Порівнюйте послуги, ціни, доступність, комунікацію, відгуки, страхування, інформацію про компанію та те, чи пропонує компанія потрібний вам тип прибирання.",
    faqServicesQuestion: "Які клінінгові послуги поширені у Швеції?",
    faqServicesAnswer:
      "Поширені послуги — прибирання дому, офісу, після переїзду, квартири, генеральне прибирання, прибирання сходів і регулярне прибирання.",
    faqCleanJobsQuestion: "Чи може Clean Jobs допомогти знайти клінінгові компанії?",
    faqCleanJobsAnswer:
      "Так. Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям знаходити одне одного через спеціалізований маркетплейс для робіт і послуг з прибирання.",

    heroEyebrow: "Клінінгові компанії",
    heroTitle:
      "Найкращі клінінгові компанії у Швеції: як вибрати правильну",
    heroText:
      "Вибір клінінгової компанії у Швеції — це більше, ніж просто ціна. Найкращі компанії надійні, зрозуміло комунікують, прозоро описують послуги та легко доступні для контакту. Цей гід пояснює, як порівнювати компанії для прибирання дому, офісу, після переїзду та регулярного прибирання.",
    postCleaningJob: "Опублікувати роботу з прибирання",
    hireCleanerStockholm: "Найняти прибиральника в Стокгольмі",

    comparisonEyebrow: "Порівняння",
    comparisonTitle: "Що робить клінінгову компанію однією з найкращих?",
    comparisonText1:
      "Сильна клінінгова компанія має чітко показувати, які послуги пропонує, де працює, як із нею зв’язатися та яким клієнтам допомагає. Для приватних клієнтів довіра особливо важлива, бо прибиральник може заходити в дім. Для бізнес-клієнтів найважливішими часто є надійність і довгострокова якість сервісу.",
    comparisonText2:
      "Clean Jobs створений, щоб зробити це порівняння простішим. Клієнти можуть публікувати роботи з прибирання, прибиральники й компанії можуть показувати свої профілі, а комунікація може відбуватися напряму через платформу.",

    cardServicesTitle: "Чіткі послуги",
    cardServicesText:
      "Хороша компанія пояснює, чи пропонує прибирання дому, офісу, після переїзду або регулярне прибирання.",
    cardLocalTitle: "Локальне покриття",
    cardLocalText:
      "Перевірте, чи працює компанія у вашому місті, поблизу та саме в тому районі, де вам потрібна допомога.",
    cardFastTitle: "Швидкі відповіді",
    cardFastText:
      "Хороша комунікація часто є сильним сигналом, що компанія організована й надійна.",
    cardTrustTitle: "Сигнали довіри",
    cardTrustText:
      "Звертайте увагу на назву компанії, інформацію профілю, відгуки, верифікацію, логотип і професійну презентацію.",

    servicesEyebrow: "Послуги",
    servicesTitle: "Поширені клінінгові послуги у Швеції",
    servicesText1:
      "Найпоширеніші послуги — прибирання дому, квартири, офісу, після переїзду, сходів, генеральне прибирання та регулярне щотижневе або щомісячне прибирання. Деякі компанії також пропонують миття вікон, прибирання після ремонту або прибирання для житлових асоціацій.",
    servicesText2:
      "Перед вибором компанії чітко опишіть роботу. Додайте місто, приблизний район, розмір об’єкта, тип прибирання, бажану дату, час і бюджет. Чітка інформація допомагає компаніям відповідати швидше й точніше.",

    citiesEyebrow: "Міста",
    citiesTitle: "Де знайти клінінгові компанії у Швеції",
    citiesText1:
      "Найсильніші ринки зазвичай у Стокгольмі, Гетеборзі та Мальме, тому що там багато житла, офісів, орендних квартир і бізнесів. Також є високий попит в Уппсалі, Вестеросі, Еребру, Лінчепінгу, Гельсінборзі, Лунді та Єнчепінгу.",
    citiesText2:
      "Якщо ви клієнт, спочатку шукайте локально. Якщо ви клінінгова компанія, переконайтеся, що ваш профіль чітко показує міста й райони, які ви покриваєте. Локальна видимість є одним із найважливіших факторів для клінінгових послуг.",

    clientsEyebrow: "Клієнти",
    clientsTitle: "Як безпечніше найняти прибиральника",
    clientsText1:
      "Почніть із чіткого опису роботи й уникайте нечітких повідомлень. Поясніть, що потрібно прибрати, який розмір об’єкта та чи є засоби для прибирання на місці. Поставте практичні питання до початку роботи й тримайте комунікацію в одному місці.",
    clientsText2:
      "На Clean Jobs ви можете опублікувати роботу з прибирання й отримати інтерес від прибиральників або клінінгових компаній. Це простіше, ніж вручну контактувати багато компаній.",

    companiesEyebrow: "Компанії",
    companiesTitle: "Як клінінгові компанії можуть з’явитися в майбутніх списках",
    companiesText1:
      "Ця сторінка зараз є гідом, а не рейтингом конкретних компаній. У майбутньому Clean Jobs може показувати реальні зареєстровані клінінгові компанії на основі якості профілю, верифікації, відгуків, активності та покриття послуг.",
    companiesText2:
      "Це означає, що клінінговим компаніям варто створити повний профіль уже зараз: назва компанії, логотип, місто, зони обслуговування та чіткі описи. Чим кращий профіль, тим легше клієнтам довіряти компанії.",

    ctaTitle: "Знайдіть надійну допомогу з прибиранням у Швеції",
    ctaText:
      "Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям з’єднуватися в одному маркетплейсі. Опублікуйте роботу або створіть профіль компанії вже сьогодні.",
    postJob: "Опублікувати роботу",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Лучшие клининговые компании в Швеции 2026 | Clean Jobs",
    metaDescription:
      "Гид по поиску лучших клининговых компаний в Швеции. Сравнивайте уборку дома, офиса, после переезда, отзывы, цены и локальные услуги.",
    metaOgTitle: "Лучшие клининговые компании в Швеции | Clean Jobs",
    metaOgDescription:
      "Узнайте, как сравнивать клининговые компании в Швеции и находить надёжных уборщиков для дома, офиса и переезда.",
    metaOgAlt: "Лучшие клининговые компании в Швеции",

    faqChooseQuestion: "Как выбрать лучшую клининговую компанию в Швеции?",
    faqChooseAnswer:
      "Сравнивайте услуги, цены, доступность, коммуникацию, отзывы, страхование, информацию о компании и то, предлагает ли компания нужный вам тип уборки.",
    faqServicesQuestion: "Какие клининговые услуги распространены в Швеции?",
    faqServicesAnswer:
      "Распространённые услуги — уборка дома, офиса, после переезда, квартиры, генеральная уборка, уборка лестниц и регулярная уборка.",
    faqCleanJobsQuestion: "Может ли Clean Jobs помочь найти клининговые компании?",
    faqCleanJobsAnswer:
      "Да. Clean Jobs помогает клиентам, уборщикам и клининговым компаниям находить друг друга через специализированный маркетплейс для работ и услуг по уборке.",

    heroEyebrow: "Клининговые компании",
    heroTitle:
      "Лучшие клининговые компании в Швеции: как выбрать подходящую",
    heroText:
      "Выбор клининговой компании в Швеции — это больше, чем просто цена. Лучшие компании надёжны, понятно общаются, прозрачно описывают услуги и легко доступны для контакта. Этот гид объясняет, как сравнивать компании для уборки дома, офиса, после переезда и регулярной уборки.",
    postCleaningJob: "Опубликовать работу по уборке",
    hireCleanerStockholm: "Нанять уборщика в Стокгольме",

    comparisonEyebrow: "Сравнение",
    comparisonTitle: "Что делает клининговую компанию одной из лучших?",
    comparisonText1:
      "Сильная клининговая компания должна ясно показывать, какие услуги предлагает, где работает, как с ней связаться и каким клиентам помогает. Для частных клиентов доверие особенно важно, потому что уборщик может заходить в дом. Для бизнес-клиентов чаще всего важны надёжность и долгосрочное качество сервиса.",
    comparisonText2:
      "Clean Jobs создан, чтобы сделать это сравнение проще. Клиенты могут публиковать работы по уборке, уборщики и компании могут показывать свои профили, а коммуникация может происходить напрямую через платформу.",

    cardServicesTitle: "Понятные услуги",
    cardServicesText:
      "Хорошая компания объясняет, предлагает ли уборку дома, офиса, после переезда или регулярную уборку.",
    cardLocalTitle: "Локальное покрытие",
    cardLocalText:
      "Проверьте, работает ли компания в вашем городе, пригородах и конкретном районе, где вам нужна помощь.",
    cardFastTitle: "Быстрые ответы",
    cardFastText:
      "Хорошая коммуникация часто является сильным признаком, что компания организована и надёжна.",
    cardTrustTitle: "Сигналы доверия",
    cardTrustText:
      "Обращайте внимание на название компании, информацию профиля, отзывы, верификацию, логотип и профессиональную презентацию.",

    servicesEyebrow: "Услуги",
    servicesTitle: "Распространённые клининговые услуги в Швеции",
    servicesText1:
      "Самые распространённые услуги — уборка дома, квартиры, офиса, после переезда, лестниц, генеральная уборка и регулярная еженедельная или ежемесячная уборка. Некоторые компании также предлагают мойку окон, уборку после ремонта или уборку для жилищных ассоциаций.",
    servicesText2:
      "Перед выбором компании чётко опишите работу. Добавьте город, примерный район, размер объекта, тип уборки, желаемую дату, время и бюджет. Чёткая информация помогает компаниям отвечать быстрее и точнее.",

    citiesEyebrow: "Города",
    citiesTitle: "Где найти клининговые компании в Швеции",
    citiesText1:
      "Самые сильные рынки обычно в Стокгольме, Гётеборге и Мальмё, потому что там много домов, офисов, арендных квартир и бизнесов. Также высокий спрос есть в Уппсале, Вестеросе, Эребру, Линчёпинге, Хельсингборге, Лунде и Йёнчёпинге.",
    citiesText2:
      "Если вы клиент, сначала ищите локально. Если вы клининговая компания, убедитесь, что ваш профиль ясно показывает города и районы, которые вы покрываете. Локальная видимость — один из самых важных факторов для клининговых услуг.",

    clientsEyebrow: "Клиенты",
    clientsTitle: "Как безопаснее нанять уборщика",
    clientsText1:
      "Начните с чёткого описания работы и избегайте расплывчатых сообщений. Объясните, что нужно убрать, какой размер объекта и есть ли средства для уборки на месте. Задайте практические вопросы до начала работы и держите коммуникацию в одном месте.",
    clientsText2:
      "На Clean Jobs вы можете опубликовать работу по уборке и получить интерес от уборщиков или клининговых компаний. Это проще, чем вручную связываться со многими компаниями.",

    companiesEyebrow: "Компании",
    companiesTitle: "Как клининговые компании могут появиться в будущих списках",
    companiesText1:
      "Эта страница сейчас является гидом, а не рейтингом конкретных компаний. В будущем Clean Jobs может показывать реальные зарегистрированные клининговые компании на основе качества профиля, верификации, отзывов, активности и покрытия услуг.",
    companiesText2:
      "Это означает, что клининговым компаниям стоит создать полный профиль уже сейчас: название компании, логотип, город, зоны обслуживания и чёткие описания. Чем лучше профиль, тем легче клиентам доверять компании.",

    ctaTitle: "Найдите надёжную помощь с уборкой в Швеции",
    ctaText:
      "Clean Jobs помогает клиентам, уборщикам и клининговым компаниям соединяться в одном маркетплейсе. Опубликуйте работу или создайте профиль компании уже сегодня.",
    postJob: "Опубликовать работу",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Best Cleaning Companies in Sweden 2026 | Clean Jobs",
    metaDescription:
      "Guide to finding the best cleaning companies in Sweden. Compare home cleaning, office cleaning, move-out cleaning, reviews, prices and local cleaning services.",
    metaOgTitle: "Best Cleaning Companies in Sweden | Clean Jobs",
    metaOgDescription:
      "Learn how to compare cleaning companies in Sweden and find trusted cleaners for homes, offices and move-out cleaning.",
    metaOgAlt: "Best cleaning companies in Sweden",

    faqChooseQuestion: "How do I choose the best cleaning company in Sweden?",
    faqChooseAnswer:
      "Compare services, prices, availability, communication, reviews, insurance, company information and whether the company offers the type of cleaning you need.",
    faqServicesQuestion: "What cleaning services are common in Sweden?",
    faqServicesAnswer:
      "Common services include home cleaning, office cleaning, move-out cleaning, apartment cleaning, deep cleaning, stair cleaning and recurring cleaning.",
    faqCleanJobsQuestion: "Can Clean Jobs help me find cleaning companies?",
    faqCleanJobsAnswer:
      "Yes. Clean Jobs helps clients, cleaners and cleaning companies connect through a focused marketplace for cleaning jobs and cleaning services.",

    heroEyebrow: "Cleaning companies",
    heroTitle: "Best cleaning companies in Sweden: how to choose the right one",
    heroText:
      "Choosing a cleaning company in Sweden is about more than price. The best cleaning companies are reliable, clear in communication, transparent about services and easy to contact. This guide explains how to compare cleaning companies for home cleaning, office cleaning, move-out cleaning and recurring cleaning.",
    postCleaningJob: "Post a cleaning job",
    hireCleanerStockholm: "Hire cleaner Stockholm",

    comparisonEyebrow: "Comparison",
    comparisonTitle: "What makes a cleaning company one of the best?",
    comparisonText1:
      "A strong cleaning company should make it easy to understand what services are offered, where the company works, how to contact them and what type of clients they help. For private clients, trust is especially important because the cleaner may enter the home. For business clients, reliability and long-term service quality are often the most important factors.",
    comparisonText2:
      "Clean Jobs is designed to help this comparison become easier. Clients can post cleaning jobs, cleaners and companies can show their profiles, and communication can happen directly through the platform.",

    cardServicesTitle: "Clear services",
    cardServicesText:
      "A good company explains whether it offers home cleaning, office cleaning, move-out cleaning or recurring cleaning.",
    cardLocalTitle: "Local coverage",
    cardLocalText:
      "Check whether the company works in your city, nearby suburbs and the specific area where you need help.",
    cardFastTitle: "Fast replies",
    cardFastText:
      "Good communication is often a strong sign that the company is organized and reliable.",
    cardTrustTitle: "Trust signals",
    cardTrustText:
      "Look for company name, profile information, reviews, verification, logo and professional presentation.",

    servicesEyebrow: "Services",
    servicesTitle: "Common cleaning services in Sweden",
    servicesText1:
      "The most common services are home cleaning, apartment cleaning, office cleaning, move-out cleaning, stair cleaning, deep cleaning and recurring weekly or monthly cleaning. Some companies also offer window cleaning, post-renovation cleaning or cleaning for housing associations.",
    servicesText2:
      "Before choosing a company, describe the job clearly. Include the city, approximate area, property size, type of cleaning, preferred date, time and budget. Clear information helps cleaning companies answer faster and more accurately.",

    citiesEyebrow: "Cities",
    citiesTitle: "Where to find cleaning companies in Sweden",
    citiesText1:
      "The strongest markets are usually Stockholm, Gothenburg and Malmö, because these cities have many homes, offices, rental apartments and businesses. There is also strong demand in Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund and Jönköping.",
    citiesText2:
      "If you are a client, search locally first. If you are a cleaning company, make sure your profile clearly shows which cities and areas you cover. Local visibility is one of the most important factors for cleaning services.",

    clientsEyebrow: "Clients",
    clientsTitle: "How to hire a cleaner safely",
    clientsText1:
      "Start with a clear job description and avoid vague messages. Explain what needs to be cleaned, how large the property is and whether cleaning materials are available. Ask practical questions before the job starts and keep communication in one place.",
    clientsText2:
      "On Clean Jobs, you can post a cleaning job and receive interest from cleaners or cleaning companies. This makes the process easier than contacting many companies manually.",

    companiesEyebrow: "Companies",
    companiesTitle: "How cleaning companies can appear on future lists",
    companiesText1:
      "This page is currently a guide, not a ranking of specific companies. In the future, Clean Jobs can highlight real registered cleaning companies based on profile quality, verification, reviews, activity and service coverage.",
    companiesText2:
      "That means cleaning companies should create a complete profile now: company name, logo, city, service areas and clear descriptions. The better the profile, the easier it becomes for clients to trust the company.",

    ctaTitle: "Find trusted cleaning help in Sweden",
    ctaText:
      "Clean Jobs helps clients, cleaners and cleaning companies connect in one marketplace. Post a job or create a company profile today.",
    postJob: "Post job",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Bästa städföretagen i Sverige 2026 | Clean Jobs",
    metaDescription:
      "Guide till att hitta de bästa städföretagen i Sverige. Jämför hemstädning, kontorsstädning, flyttstädning, omdömen, priser och lokala städtjänster.",
    metaOgTitle: "Bästa städföretagen i Sverige | Clean Jobs",
    metaOgDescription:
      "Lär dig jämföra städföretag i Sverige och hitta pålitliga städare för hem, kontor och flyttstädning.",
    metaOgAlt: "Bästa städföretagen i Sverige",

    faqChooseQuestion: "Hur väljer jag bästa städföretaget i Sverige?",
    faqChooseAnswer:
      "Jämför tjänster, priser, tillgänglighet, kommunikation, omdömen, försäkring, företagsinformation och om företaget erbjuder den typ av städning du behöver.",
    faqServicesQuestion: "Vilka städtjänster är vanliga i Sverige?",
    faqServicesAnswer:
      "Vanliga tjänster är hemstädning, kontorsstädning, flyttstädning, lägenhetsstädning, storstädning, trappstädning och återkommande städning.",
    faqCleanJobsQuestion: "Kan Clean Jobs hjälpa mig hitta städföretag?",
    faqCleanJobsAnswer:
      "Ja. Clean Jobs hjälper kunder, städare och städföretag att hitta varandra via en fokuserad marknadsplats för städjobb och städtjänster.",

    heroEyebrow: "Städföretag",
    heroTitle: "Bästa städföretagen i Sverige: så väljer du rätt",
    heroText:
      "Att välja städföretag i Sverige handlar om mer än pris. De bästa städföretagen är pålitliga, tydliga i kommunikationen, transparenta med tjänster och enkla att kontakta. Den här guiden förklarar hur du jämför städföretag för hemstädning, kontorsstädning, flyttstädning och återkommande städning.",
    postCleaningJob: "Lägg upp städjobb",
    hireCleanerStockholm: "Anlita städare Stockholm",

    comparisonEyebrow: "Jämförelse",
    comparisonTitle: "Vad gör ett städföretag till ett av de bästa?",
    comparisonText1:
      "Ett starkt städföretag ska göra det enkelt att förstå vilka tjänster som erbjuds, var företaget arbetar, hur man kontaktar dem och vilken typ av kunder de hjälper. För privatkunder är förtroende extra viktigt eftersom städaren kan komma in i hemmet. För företagskunder är pålitlighet och långsiktig servicekvalitet ofta viktigast.",
    comparisonText2:
      "Clean Jobs är byggt för att göra jämförelsen enklare. Kunder kan lägga upp städjobb, städare och företag kan visa sina profiler och kommunikationen kan ske direkt via plattformen.",

    cardServicesTitle: "Tydliga tjänster",
    cardServicesText:
      "Ett bra företag förklarar om det erbjuder hemstädning, kontorsstädning, flyttstädning eller återkommande städning.",
    cardLocalTitle: "Lokal täckning",
    cardLocalText:
      "Kontrollera om företaget arbetar i din stad, närliggande områden och exakt där du behöver hjälp.",
    cardFastTitle: "Snabba svar",
    cardFastText:
      "Bra kommunikation är ofta ett starkt tecken på att företaget är organiserat och pålitligt.",
    cardTrustTitle: "Förtroendesignaler",
    cardTrustText:
      "Leta efter företagsnamn, profilinformation, omdömen, verifiering, logotyp och professionell presentation.",

    servicesEyebrow: "Tjänster",
    servicesTitle: "Vanliga städtjänster i Sverige",
    servicesText1:
      "De vanligaste tjänsterna är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, trappstädning, storstädning och återkommande städning varje vecka eller månad. Vissa företag erbjuder även fönsterputs, städning efter renovering eller städning för bostadsrättsföreningar.",
    servicesText2:
      "Innan du väljer företag bör du beskriva jobbet tydligt. Ange stad, ungefärligt område, fastighetens storlek, typ av städning, önskat datum, tid och budget. Tydlig information hjälper städföretag att svara snabbare och mer exakt.",

    citiesEyebrow: "Städer",
    citiesTitle: "Var hittar man städföretag i Sverige",
    citiesText1:
      "De starkaste marknaderna är oftast Stockholm, Göteborg och Malmö, eftersom dessa städer har många bostäder, kontor, hyreslägenheter och företag. Det finns också stark efterfrågan i Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund och Jönköping.",
    citiesText2:
      "Om du är kund, sök lokalt först. Om du är ett städföretag, se till att din profil tydligt visar vilka städer och områden du täcker. Lokal synlighet är en av de viktigaste faktorerna för städtjänster.",

    clientsEyebrow: "Kunder",
    clientsTitle: "Så anlitar du städare tryggare",
    clientsText1:
      "Börja med en tydlig jobbeskrivning och undvik otydliga meddelanden. Förklara vad som ska städas, hur stor fastigheten är och om städmaterial finns tillgängligt. Ställ praktiska frågor innan jobbet startar och samla kommunikationen på ett ställe.",
    clientsText2:
      "På Clean Jobs kan du lägga upp ett städjobb och få intresse från städare eller städföretag. Det gör processen enklare än att kontakta många företag manuellt.",

    companiesEyebrow: "Företag",
    companiesTitle: "Hur städföretag kan synas på framtida listor",
    companiesText1:
      "Den här sidan är just nu en guide, inte en ranking av specifika företag. I framtiden kan Clean Jobs lyfta fram riktiga registrerade städföretag baserat på profilkvalitet, verifiering, omdömen, aktivitet och tjänsteområden.",
    companiesText2:
      "Det betyder att städföretag bör skapa en komplett profil redan nu: företagsnamn, logotyp, stad, serviceområden och tydliga beskrivningar. Ju bättre profil, desto lättare blir det för kunder att lita på företaget.",

    ctaTitle: "Hitta pålitlig städhjälp i Sverige",
    ctaText:
      "Clean Jobs hjälper kunder, städare och städföretag att mötas på en marknadsplats. Lägg upp ett jobb eller skapa en företagsprofil idag.",
    postJob: "Lägg upp jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Najlepsze firmy sprzątające w Szwecji 2026 | Clean Jobs",
    metaDescription:
      "Poradnik, jak znaleźć najlepsze firmy sprzątające w Szwecji. Porównuj sprzątanie domu, biura, po przeprowadzce, opinie, ceny i lokalne usługi.",
    metaOgTitle: "Najlepsze firmy sprzątające w Szwecji | Clean Jobs",
    metaOgDescription:
      "Dowiedz się, jak porównywać firmy sprzątające w Szwecji i znaleźć zaufanych sprzątaczy do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Najlepsze firmy sprzątające w Szwecji",

    faqChooseQuestion: "Jak wybrać najlepszą firmę sprzątającą w Szwecji?",
    faqChooseAnswer:
      "Porównuj usługi, ceny, dostępność, komunikację, opinie, ubezpieczenie, informacje o firmie oraz to, czy firma oferuje typ sprzątania, którego potrzebujesz.",
    faqServicesQuestion: "Jakie usługi sprzątania są popularne w Szwecji?",
    faqServicesAnswer:
      "Popularne usługi to sprzątanie domu, biura, po przeprowadzce, mieszkania, sprzątanie generalne, sprzątanie klatek schodowych i regularne sprzątanie.",
    faqCleanJobsQuestion: "Czy Clean Jobs może pomóc znaleźć firmy sprzątające?",
    faqCleanJobsAnswer:
      "Tak. Clean Jobs pomaga klientom, sprzątaczom i firmom sprzątającym łączyć się przez wyspecjalizowany marketplace dla prac i usług sprzątania.",

    heroEyebrow: "Firmy sprzątające",
    heroTitle:
      "Najlepsze firmy sprzątające w Szwecji: jak wybrać odpowiednią",
    heroText:
      "Wybór firmy sprzątającej w Szwecji to coś więcej niż cena. Najlepsze firmy są wiarygodne, jasno komunikują, przejrzyście opisują usługi i łatwo się z nimi skontaktować. Ten poradnik wyjaśnia, jak porównywać firmy do sprzątania domu, biura, po przeprowadzce i regularnego sprzątania.",
    postCleaningJob: "Dodaj pracę sprzątania",
    hireCleanerStockholm: "Zatrudnij sprzątacza w Sztokholmie",

    comparisonEyebrow: "Porównanie",
    comparisonTitle: "Co sprawia, że firma sprzątająca jest jedną z najlepszych?",
    comparisonText1:
      "Silna firma sprzątająca powinna ułatwiać zrozumienie, jakie usługi oferuje, gdzie działa, jak się z nią skontaktować i jakim klientom pomaga. Dla klientów prywatnych zaufanie jest szczególnie ważne, ponieważ sprzątacz może wejść do domu. Dla klientów biznesowych najważniejsze są często niezawodność i długoterminowa jakość usług.",
    comparisonText2:
      "Clean Jobs został zaprojektowany, aby ułatwić takie porównanie. Klienci mogą publikować prace sprzątania, sprzątacze i firmy mogą pokazywać swoje profile, a komunikacja może odbywać się bezpośrednio przez platformę.",

    cardServicesTitle: "Jasne usługi",
    cardServicesText:
      "Dobra firma wyjaśnia, czy oferuje sprzątanie domu, biura, po przeprowadzce albo regularne sprzątanie.",
    cardLocalTitle: "Lokalny zasięg",
    cardLocalText:
      "Sprawdź, czy firma działa w Twoim mieście, pobliskich dzielnicach i dokładnie tam, gdzie potrzebujesz pomocy.",
    cardFastTitle: "Szybkie odpowiedzi",
    cardFastText:
      "Dobra komunikacja jest często mocnym sygnałem, że firma jest zorganizowana i wiarygodna.",
    cardTrustTitle: "Sygnały zaufania",
    cardTrustText:
      "Zwracaj uwagę na nazwę firmy, informacje w profilu, opinie, weryfikację, logo i profesjonalną prezentację.",

    servicesEyebrow: "Usługi",
    servicesTitle: "Popularne usługi sprzątania w Szwecji",
    servicesText1:
      "Najczęstsze usługi to sprzątanie domu, mieszkania, biura, po przeprowadzce, klatek schodowych, sprzątanie generalne oraz regularne sprzątanie co tydzień lub co miesiąc. Niektóre firmy oferują także mycie okien, sprzątanie po remoncie albo sprzątanie dla wspólnot mieszkaniowych.",
    servicesText2:
      "Przed wyborem firmy jasno opisz pracę. Podaj miasto, przybliżony obszar, wielkość obiektu, typ sprzątania, preferowaną datę, godzinę i budżet. Jasne informacje pomagają firmom odpowiadać szybciej i dokładniej.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Gdzie znaleźć firmy sprzątające w Szwecji",
    citiesText1:
      "Najsilniejsze rynki to zwykle Sztokholm, Göteborg i Malmö, ponieważ te miasta mają wiele domów, biur, mieszkań na wynajem i firm. Duży popyt jest też w Uppsali, Västerås, Örebro, Linköping, Helsingborgu, Lund i Jönköping.",
    citiesText2:
      "Jeśli jesteś klientem, najpierw szukaj lokalnie. Jeśli jesteś firmą sprzątającą, upewnij się, że Twój profil jasno pokazuje miasta i obszary, które obsługujesz. Lokalna widoczność jest jednym z najważniejszych czynników dla usług sprzątania.",

    clientsEyebrow: "Klienci",
    clientsTitle: "Jak bezpiecznie zatrudnić sprzątacza",
    clientsText1:
      "Zacznij od jasnego opisu pracy i unikaj nieprecyzyjnych wiadomości. Wyjaśnij, co ma być posprzątane, jak duży jest obiekt i czy środki czystości są dostępne. Zadaj praktyczne pytania przed rozpoczęciem pracy i trzymaj komunikację w jednym miejscu.",
    clientsText2:
      "Na Clean Jobs możesz opublikować pracę sprzątania i otrzymać zainteresowanie od sprzątaczy albo firm sprzątających. To ułatwia proces bardziej niż ręczne kontaktowanie się z wieloma firmami.",

    companiesEyebrow: "Firmy",
    companiesTitle: "Jak firmy sprzątające mogą pojawić się na przyszłych listach",
    companiesText1:
      "Ta strona jest obecnie poradnikiem, a nie rankingiem konkretnych firm. W przyszłości Clean Jobs może wyróżniać prawdziwe zarejestrowane firmy sprzątające na podstawie jakości profilu, weryfikacji, opinii, aktywności i zakresu usług.",
    companiesText2:
      "To oznacza, że firmy sprzątające powinny już teraz stworzyć kompletny profil: nazwa firmy, logo, miasto, obszary usług i jasne opisy. Im lepszy profil, tym łatwiej klientom zaufać firmie.",

    ctaTitle: "Znajdź zaufaną pomoc w sprzątaniu w Szwecji",
    ctaText:
      "Clean Jobs pomaga klientom, sprzątaczom i firmom sprzątającym połączyć się w jednym marketplace. Dodaj pracę albo utwórz profil firmy już dziś.",
    postJob: "Dodaj pracę",
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
      canonical: "/best-cleaning-companies-in-sweden",
    },
    keywords: [
      "best cleaning companies in Sweden",
      "cleaning companies Sweden",
      "cleaning company Sweden",
      "home cleaning Sweden",
      "office cleaning Sweden",
      "move out cleaning Sweden",
      "hire cleaner Sweden",
      "cleaning services Sweden",
      "trusted cleaners Sweden",
      "cleaning marketplace Sweden",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/best-cleaning-companies-in-sweden`,
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
        name: t.faqChooseQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqChooseAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqServicesQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqServicesAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqCleanJobsQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqCleanJobsAnswer,
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

function CheckCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-lg text-rose-700">
        ✓
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function BestCleaningCompaniesInSwedenPage() {
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
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              {t.postCleaningJob}
            </Link>

            <Link
              href="/hire-cleaner-stockholm"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.hireCleanerStockholm}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow={t.comparisonEyebrow} title={t.comparisonTitle}>
            <p>{t.comparisonText1}</p>
            <p>{t.comparisonText2}</p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <CheckCard title={t.cardServicesTitle} text={t.cardServicesText} />
            <CheckCard title={t.cardLocalTitle} text={t.cardLocalText} />
            <CheckCard title={t.cardFastTitle} text={t.cardFastText} />
            <CheckCard title={t.cardTrustTitle} text={t.cardTrustText} />
          </section>

          <Section eyebrow={t.servicesEyebrow} title={t.servicesTitle}>
            <p>{t.servicesText1}</p>
            <p>{t.servicesText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
          </Section>

          <Section eyebrow={t.clientsEyebrow} title={t.clientsTitle}>
            <p>{t.clientsText1}</p>
            <p>{t.clientsText2}</p>
          </Section>

          <Section eyebrow={t.companiesEyebrow} title={t.companiesTitle}>
            <p>{t.companiesText1}</p>
            <p>{t.companiesText2}</p>
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
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.postJob}
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

          <RelatedGuides currentPath="/best-cleaning-companies-in-sweden" />
        </div>
      </main>
    </div>
  )
}