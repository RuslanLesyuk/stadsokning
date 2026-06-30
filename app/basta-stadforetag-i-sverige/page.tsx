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
      "Гід, як знайти хорошу клінінгову компанію у Швеції. Порівнюйте прибирання дому, офісу, переїзду, ціни, відгуки та локальні послуги.",
    metaOgTitle: "Найкращі клінінгові компанії у Швеції | Clean Jobs",
    metaOgDescription:
      "Гід, як порівнювати клінінгові компанії у Швеції та знайти правильну допомогу з прибиранням.",
    metaOgAlt: "Найкращі клінінгові компанії у Швеції",
    keywordBest: "найкращі клінінгові компанії у Швеції",
    keywordCompany: "клінінгова компанія Швеція",
    keywordFirm: "клінінгова фірма Швеція",
    keywordHome: "прибирання дому Швеція",
    keywordOffice: "прибирання офісу Швеція",
    keywordMove: "прибирання після переїзду Швеція",
    keywordHire: "найняти прибиральника Швеція",
    keywordHelp: "допомога з прибиранням Швеція",
    keywordStockholm: "клінінгова фірма Стокгольм",
    keywordService: "клінінгові послуги Швеція",

    faqChooseQuestion: "Як вибрати найкращу клінінгову компанію?",
    faqChooseAnswer:
      "Порівнюйте послуги, ціну, доступність, комунікацію, відгуки, інформацію про компанію та те, чи пропонує компанія саме той тип прибирання, який вам потрібен.",
    faqServicesQuestion: "Які клінінгові послуги найпоширеніші?",
    faqServicesAnswer:
      "Найпоширеніші послуги — прибирання дому, офісу, після переїзду, квартири, генеральне та регулярне прибирання.",
    faqCleanJobsQuestion: "Чи може Clean Jobs допомогти знайти клінінгову компанію?",
    faqCleanJobsAnswer:
      "Так. Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям знаходити одне одного через спеціалізований маркетплейс для робіт і послуг з прибирання.",

    heroEyebrow: "Клінінгові компанії",
    heroTitle:
      "Найкращі клінінгові компанії у Швеції: як вибрати правильну допомогу з прибиранням",
    heroText:
      "Вибір клінінгової компанії — це не лише ціна. Найкращі компанії надійні, зрозуміло комунікують, легко доступні для контакту та відкрито показують, які послуги вони пропонують. Цей гід допоможе порівняти прибирання дому, офісу, після переїзду та регулярне прибирання.",
    postCleaningJob: "Опублікувати роботу з прибирання",
    stockholmCleaningCompany: "Клінінгова фірма Стокгольм",

    comparisonEyebrow: "Порівняння",
    comparisonTitle: "Що робить клінінгову компанію однією з найкращих?",
    comparisonText1:
      "Хороша клінінгова компанія має чітко показувати, які послуги вона пропонує, у яких районах працює та як із нею зв’язатися. Для приватних клієнтів довіра особливо важлива, бо прибиральник може працювати вдома. Для бізнесу найважливіші надійність і стабільна якість.",
    comparisonText2:
      "Clean Jobs створений, щоб зробити порівняння простішим. Клієнти можуть публікувати роботи з прибирання, а прибиральники й компанії — показувати свої профілі та спілкуватися напряму на платформі.",

    cardServicesTitle: "Чіткі послуги",
    cardServicesText:
      "Хороша компанія показує, чи пропонує вона прибирання дому, офісу, після переїзду або регулярне прибирання.",
    cardLocalTitle: "Локальне покриття",
    cardLocalText:
      "Перевірте, чи працює компанія у вашому місті, районі та сусідніх комунах.",
    cardFastTitle: "Швидкі відповіді",
    cardFastText:
      "Хороша комунікація часто показує, що компанія організована й надійна.",
    cardTrustTitle: "Сигнали довіри",
    cardTrustText:
      "Звертайте увагу на назву компанії, інформацію профілю, відгуки, верифікацію, логотип і професійну презентацію.",

    servicesEyebrow: "Послуги",
    servicesTitle: "Поширені клінінгові послуги у Швеції",
    servicesText1:
      "Найпоширеніші послуги — прибирання дому, квартири, офісу, після переїзду, сходових кліток, генеральне та регулярне прибирання. Деякі компанії також пропонують миття вікон, будівельне прибирання або прибирання для житлових асоціацій.",
    servicesText2:
      "Перед вибором компанії варто чітко описати роботу. Вкажіть місто, приблизний район, розмір житла, тип прибирання, дату, час і бюджет. Чітка інформація допомагає компаніям відповідати швидше.",

    citiesEyebrow: "Міста",
    citiesTitle: "Де знайти клінінгові компанії у Швеції?",
    citiesText1:
      "Найбільші ринки — Стокгольм, Гетеборг і Мальме, тому що в цих містах багато житла, офісів, переїздів і компаній. Попит також є в Уппсалі, Вестеросі, Еребру, Лінчепінгу, Гельсінборзі, Лунді та Єнчепінгу.",
    citiesText2:
      "Якщо ви клієнт, найкраще починати локально. Якщо ви керуєте клінінговою компанією, профіль має чітко показувати, які міста й райони ви покриваєте. Локальна видимість дуже важлива для клінінгових послуг.",

    customersEyebrow: "Клієнти",
    customersTitle: "Як безпечніше наймати прибиральника",
    customersText1:
      "Почніть із чіткого опису й уникайте нечітких повідомлень. Поясніть, що потрібно прибрати, який розмір житла або приміщення, і чи є засоби для прибирання на місці. Поставте практичні питання до початку роботи й тримайте комунікацію в одному місці.",
    customersText2:
      "На Clean Jobs ви можете опублікувати роботу з прибирання й отримати інтерес від прибиральників або клінінгових компаній. Це простіше, ніж вручну писати багатьом компаніям.",

    companiesEyebrow: "Компанії",
    companiesTitle: "Як клінінгові компанії можуть потрапити в майбутні списки",
    companiesText1:
      "Ця сторінка зараз є гідом, а не рейтингом конкретних компаній. У майбутньому Clean Jobs може показувати зареєстровані клінінгові компанії на основі якості профілю, верифікації, відгуків, активності та районів роботи.",
    companiesText2:
      "Тому клінінговим компаніям варто створити повний профіль уже зараз: назва компанії, логотип, місто, зони обслуговування та чіткий опис. Чим кращий профіль, тим легше клієнтам довіряти компанії.",

    ctaTitle: "Знайдіть правильну допомогу з прибиранням у Швеції",
    ctaText:
      "Clean Jobs допомагає клієнтам, прибиральникам і клінінговим компаніям знаходити одне одного на маркетплейсі для робіт і послуг з прибирання.",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Лучшие клининговые компании в Швеции 2026 | Clean Jobs",
    metaDescription:
      "Гид по поиску хорошей клининговой компании в Швеции. Сравнивайте уборку дома, офиса, переезда, цены, отзывы и локальные услуги.",
    metaOgTitle: "Лучшие клининговые компании в Швеции | Clean Jobs",
    metaOgDescription:
      "Гид по сравнению клининговых компаний в Швеции и поиску подходящей помощи с уборкой.",
    metaOgAlt: "Лучшие клининговые компании в Швеции",
    keywordBest: "лучшие клининговые компании в Швеции",
    keywordCompany: "клининговая компания Швеция",
    keywordFirm: "клининговая фирма Швеция",
    keywordHome: "уборка дома Швеция",
    keywordOffice: "уборка офиса Швеция",
    keywordMove: "уборка после переезда Швеция",
    keywordHire: "нанять уборщика Швеция",
    keywordHelp: "помощь с уборкой Швеция",
    keywordStockholm: "клининговая фирма Стокгольм",
    keywordService: "клининговые услуги Швеция",

    faqChooseQuestion: "Как выбрать лучшую клининговую компанию?",
    faqChooseAnswer:
      "Сравнивайте услуги, цену, доступность, коммуникацию, отзывы, информацию о компании и то, предлагает ли компания именно тот тип уборки, который вам нужен.",
    faqServicesQuestion: "Какие клининговые услуги самые распространённые?",
    faqServicesAnswer:
      "Самые распространённые услуги — уборка дома, офиса, после переезда, квартиры, генеральная и регулярная уборка.",
    faqCleanJobsQuestion: "Может ли Clean Jobs помочь найти клининговую компанию?",
    faqCleanJobsAnswer:
      "Да. Clean Jobs помогает клиентам, уборщикам и клининговым компаниям находить друг друга через специализированный маркетплейс для работ и услуг по уборке.",

    heroEyebrow: "Клининговые компании",
    heroTitle:
      "Лучшие клининговые компании в Швеции: как выбрать подходящую помощь с уборкой",
    heroText:
      "Выбор клининговой компании — это не только цена. Лучшие компании надёжны, понятно общаются, легко доступны для контакта и открыто показывают, какие услуги предлагают. Этот гид поможет сравнить уборку дома, офиса, после переезда и регулярную уборку.",
    postCleaningJob: "Опубликовать работу по уборке",
    stockholmCleaningCompany: "Клининговая фирма Стокгольм",

    comparisonEyebrow: "Сравнение",
    comparisonTitle: "Что делает клининговую компанию одной из лучших?",
    comparisonText1:
      "Хорошая клининговая компания должна чётко показывать, какие услуги предлагает, в каких районах работает и как с ней связаться. Для частных клиентов доверие особенно важно, потому что уборщик может работать дома. Для бизнеса чаще всего важны надёжность и стабильное качество.",
    comparisonText2:
      "Clean Jobs создан, чтобы сделать сравнение проще. Клиенты могут публиковать работы по уборке, а уборщики и компании — показывать свои профили и общаться напрямую на платформе.",

    cardServicesTitle: "Понятные услуги",
    cardServicesText:
      "Хорошая компания показывает, предлагает ли она уборку дома, офиса, после переезда или регулярную уборку.",
    cardLocalTitle: "Локальное покрытие",
    cardLocalText:
      "Проверьте, работает ли компания в вашем городе, районе и соседних коммунах.",
    cardFastTitle: "Быстрые ответы",
    cardFastText:
      "Хорошая коммуникация часто показывает, что компания организована и надёжна.",
    cardTrustTitle: "Сигналы доверия",
    cardTrustText:
      "Обращайте внимание на название компании, информацию профиля, отзывы, верификацию, логотип и профессиональную презентацию.",

    servicesEyebrow: "Услуги",
    servicesTitle: "Распространённые клининговые услуги в Швеции",
    servicesText1:
      "Самые распространённые услуги — уборка дома, квартиры, офиса, после переезда, подъездов, генеральная и регулярная уборка. Некоторые компании также предлагают мойку окон, строительную уборку или уборку для жилищных ассоциаций.",
    servicesText2:
      "Перед выбором компании стоит чётко описать работу. Укажите город, примерный район, размер жилья, тип уборки, дату, время и бюджет. Чёткая информация помогает компаниям отвечать быстрее.",

    citiesEyebrow: "Города",
    citiesTitle: "Где найти клининговые компании в Швеции?",
    citiesText1:
      "Крупнейшие рынки — Стокгольм, Гётеборг и Мальмё, потому что в этих городах много жилья, офисов, переездов и компаний. Спрос также есть в Уппсале, Вестеросе, Эребру, Линчёпинге, Хельсингборге, Лунде и Йёнчёпинге.",
    citiesText2:
      "Если вы клиент, лучше начинать локально. Если вы управляете клининговой компанией, профиль должен чётко показывать, какие города и районы вы покрываете. Локальная видимость очень важна для клининговых услуг.",

    customersEyebrow: "Клиенты",
    customersTitle: "Как безопаснее нанимать уборщика",
    customersText1:
      "Начните с понятного описания и избегайте расплывчатых сообщений. Объясните, что нужно убрать, какой размер жилья или помещения, и есть ли средства для уборки на месте. Задайте практические вопросы до начала работы и держите коммуникацию в одном месте.",
    customersText2:
      "На Clean Jobs вы можете опубликовать работу по уборке и получить интерес от уборщиков или клининговых компаний. Это проще, чем вручную писать многим компаниям.",

    companiesEyebrow: "Компании",
    companiesTitle: "Как клининговые компании могут попасть в будущие списки",
    companiesText1:
      "Эта страница сейчас является гидом, а не рейтингом конкретных компаний. В будущем Clean Jobs может показывать зарегистрированные клининговые компании на основе качества профиля, верификации, отзывов, активности и районов работы.",
    companiesText2:
      "Поэтому клининговым компаниям стоит уже сейчас создать полный профиль: название компании, логотип, город, зоны обслуживания и понятное описание. Чем лучше профиль, тем легче клиентам доверять компании.",

    ctaTitle: "Найдите подходящую помощь с уборкой в Швеции",
    ctaText:
      "Clean Jobs помогает клиентам, уборщикам и клининговым компаниям находить друг друга на маркетплейсе для работ и услуг по уборке.",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Best Cleaning Companies in Sweden 2026 | Clean Jobs",
    metaDescription:
      "Guide to finding the best cleaning company in Sweden. Compare home cleaning, office cleaning, move-out cleaning, prices, reviews and local cleaning help.",
    metaOgTitle: "Best Cleaning Companies in Sweden | Clean Jobs",
    metaOgDescription:
      "Guide to comparing cleaning companies in Sweden and finding the right cleaning help.",
    metaOgAlt: "Best cleaning companies in Sweden",
    keywordBest: "best cleaning companies in Sweden",
    keywordCompany: "cleaning company Sweden",
    keywordFirm: "cleaning firm Sweden",
    keywordHome: "home cleaning Sweden",
    keywordOffice: "office cleaning Sweden",
    keywordMove: "move out cleaning Sweden",
    keywordHire: "hire cleaner Sweden",
    keywordHelp: "cleaning help Sweden",
    keywordStockholm: "cleaning company Stockholm",
    keywordService: "cleaning service Sweden",

    faqChooseQuestion: "How do you choose the best cleaning company?",
    faqChooseAnswer:
      "Compare services, price, availability, communication, reviews, company information and whether the company offers the type of cleaning you need.",
    faqServicesQuestion: "Which cleaning services are most common?",
    faqServicesAnswer:
      "Common services include home cleaning, office cleaning, move-out cleaning, apartment cleaning, deep cleaning and recurring cleaning.",
    faqCleanJobsQuestion: "Can Clean Jobs help me find a cleaning company?",
    faqCleanJobsAnswer:
      "Yes. Clean Jobs helps customers, cleaners and cleaning companies find each other through a focused marketplace for cleaning jobs and cleaning services.",

    heroEyebrow: "Cleaning companies",
    heroTitle:
      "Best cleaning companies in Sweden: how to choose the right cleaning help",
    heroText:
      "Choosing a cleaning company is not only about price. The best cleaning companies are reliable, clear in communication, easy to contact and transparent about the services they offer. This guide helps you compare home cleaning, office cleaning, move-out cleaning and recurring cleaning.",
    postCleaningJob: "Post cleaning job",
    stockholmCleaningCompany: "Cleaning company Stockholm",

    comparisonEyebrow: "Comparison",
    comparisonTitle: "What makes a cleaning company one of the best?",
    comparisonText1:
      "A good cleaning company should clearly show which services it offers, which areas it works in and how to contact it. For private customers, trust is especially important because the cleaner may work inside the home. For businesses, reliability and long-term quality are often most important.",
    comparisonText2:
      "Clean Jobs is built to make comparison easier. Customers can post cleaning jobs, cleaners and companies can show their profiles, and communication can happen directly on the platform.",

    cardServicesTitle: "Clear services",
    cardServicesText:
      "A good company shows whether it offers home cleaning, office cleaning, move-out cleaning or recurring cleaning.",
    cardLocalTitle: "Local coverage",
    cardLocalText:
      "Check whether the company works in your city, district and nearby municipalities.",
    cardFastTitle: "Fast replies",
    cardFastText:
      "Good communication is often a sign that the company is organised and reliable.",
    cardTrustTitle: "Trust signals",
    cardTrustText:
      "Look for company name, profile information, reviews, verification, logo and professional presentation.",

    servicesEyebrow: "Services",
    servicesTitle: "Common cleaning services in Sweden",
    servicesText1:
      "The most common services are home cleaning, apartment cleaning, office cleaning, move-out cleaning, stairwell cleaning, deep cleaning and recurring cleaning. Some companies also offer window cleaning, construction cleaning or cleaning for housing associations.",
    servicesText2:
      "Before choosing a company, describe the job clearly. Add city, approximate area, home size, type of cleaning, date, time and budget. Clear information helps cleaning companies reply faster.",

    citiesEyebrow: "Cities",
    citiesTitle: "Where can you find cleaning companies in Sweden?",
    citiesText1:
      "The largest markets are Stockholm, Gothenburg and Malmö because these cities have many homes, offices, moves and businesses. There is also demand in Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund and Jönköping.",
    citiesText2:
      "If you are a customer, it is best to start locally. If you run a cleaning company, your profile should clearly show which cities and areas you cover. Local visibility is very important for cleaning services.",

    customersEyebrow: "Customers",
    customersTitle: "How to hire a cleaner more safely",
    customersText1:
      "Start with a clear description and avoid vague messages. Explain what should be cleaned, how large the home or premises are and whether cleaning materials are available on site. Ask practical questions before the job starts and keep communication in one place.",
    customersText2:
      "On Clean Jobs, you can post a cleaning job and receive interest from cleaners or cleaning companies. It is easier than contacting many companies manually.",

    companiesEyebrow: "Companies",
    companiesTitle: "How cleaning companies can appear in future lists",
    companiesText1:
      "This page is currently a guide, not a ranking of specific companies. In the future, Clean Jobs may highlight registered cleaning companies based on profile quality, verification, reviews, activity and the areas they work in.",
    companiesText2:
      "That is why cleaning companies should create a complete profile now: company name, logo, city, service areas and a clear description. The better the profile, the easier it is for customers to trust the company.",

    ctaTitle: "Find the right cleaning help in Sweden",
    ctaText:
      "Clean Jobs helps customers, cleaners and cleaning companies find each other on a marketplace for cleaning jobs and cleaning services.",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Bästa Städföretag i Sverige 2026 | Clean Jobs",
    metaDescription:
      "Guide till att hitta bästa städföretag i Sverige. Jämför hemstädning, kontorsstädning, flyttstädning, priser, omdömen och lokal städhjälp.",
    metaOgTitle: "Bästa Städföretag i Sverige | Clean Jobs",
    metaOgDescription:
      "Guide till att jämföra städföretag i Sverige och hitta rätt städhjälp.",
    metaOgAlt: "Bästa städföretag i Sverige",
    keywordBest: "bästa städföretag i Sverige",
    keywordCompany: "städföretag Sverige",
    keywordFirm: "städfirma Sverige",
    keywordHome: "hemstädning Sverige",
    keywordOffice: "kontorsstädning Sverige",
    keywordMove: "flyttstädning Sverige",
    keywordHire: "anlita städare Sverige",
    keywordHelp: "städhjälp Sverige",
    keywordStockholm: "städfirma Stockholm",
    keywordService: "städservice Sverige",

    faqChooseQuestion: "Hur väljer man bästa städföretaget?",
    faqChooseAnswer:
      "Jämför tjänster, pris, tillgänglighet, kommunikation, omdömen, företagsinformation och om företaget erbjuder den typ av städning du behöver.",
    faqServicesQuestion: "Vilka städtjänster är vanligast?",
    faqServicesAnswer:
      "Vanliga tjänster är hemstädning, kontorsstädning, flyttstädning, lägenhetsstädning, storstädning och återkommande städning.",
    faqCleanJobsQuestion: "Kan Clean Jobs hjälpa mig hitta städföretag?",
    faqCleanJobsAnswer:
      "Ja. Clean Jobs hjälper kunder, städare och städföretag att hitta varandra via en fokuserad marknadsplats för städjobb och städtjänster.",

    heroEyebrow: "Städföretag",
    heroTitle: "Bästa städföretag i Sverige: så väljer du rätt städhjälp",
    heroText:
      "Att välja städföretag handlar inte bara om pris. De bästa städföretagen är pålitliga, tydliga i kommunikationen, enkla att kontakta och transparenta med vilka tjänster de erbjuder. Den här guiden hjälper dig jämföra hemstädning, kontorsstädning, flyttstädning och återkommande städning.",
    postCleaningJob: "Lägg upp städjobb",
    stockholmCleaningCompany: "Städfirma Stockholm",

    comparisonEyebrow: "Jämförelse",
    comparisonTitle: "Vad gör ett städföretag till ett av de bästa?",
    comparisonText1:
      "Ett bra städföretag ska tydligt visa vilka tjänster som erbjuds, vilka områden företaget arbetar i och hur man kontaktar dem. För privatkunder är förtroende extra viktigt eftersom städaren kan arbeta i hemmet. För företag är pålitlighet och långsiktig kvalitet ofta viktigast.",
    comparisonText2:
      "Clean Jobs är byggt för att göra jämförelsen enklare. Kunder kan lägga upp städjobb, städare och företag kan visa sina profiler och kommunikationen kan ske direkt på plattformen.",

    cardServicesTitle: "Tydliga tjänster",
    cardServicesText:
      "Ett bra företag visar om det erbjuder hemstädning, kontorsstädning, flyttstädning eller återkommande städning.",
    cardLocalTitle: "Lokal täckning",
    cardLocalText:
      "Kontrollera om företaget arbetar i din stad, stadsdel och närliggande kommuner.",
    cardFastTitle: "Snabba svar",
    cardFastText:
      "Bra kommunikation är ofta ett tecken på att företaget är organiserat och pålitligt.",
    cardTrustTitle: "Förtroendesignaler",
    cardTrustText:
      "Leta efter företagsnamn, profilinformation, omdömen, verifiering, logotyp och professionell presentation.",

    servicesEyebrow: "Tjänster",
    servicesTitle: "Vanliga städtjänster i Sverige",
    servicesText1:
      "De vanligaste tjänsterna är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, trappstädning, storstädning och återkommande städning. Vissa företag erbjuder även fönsterputs, byggstädning eller städning för bostadsrättsföreningar.",
    servicesText2:
      "Innan du väljer företag bör du beskriva jobbet tydligt. Ange stad, ungefärligt område, bostadens storlek, typ av städning, datum, tid och budget. Tydlig information gör att städföretag kan svara snabbare.",

    citiesEyebrow: "Städer",
    citiesTitle: "Var hittar man städföretag i Sverige?",
    citiesText1:
      "De största marknaderna är Stockholm, Göteborg och Malmö, eftersom dessa städer har många bostäder, kontor, flyttar och företag. Det finns också efterfrågan i Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund och Jönköping.",
    citiesText2:
      "Om du är kund är det bäst att börja lokalt. Om du driver städföretag bör din profil tydligt visa vilka städer och områden du täcker. Lokal synlighet är mycket viktig för städtjänster.",

    customersEyebrow: "Kunder",
    customersTitle: "Så anlitar du städare tryggare",
    customersText1:
      "Börja med en tydlig beskrivning och undvik otydliga meddelanden. Förklara vad som ska städas, hur stor bostaden eller lokalen är och om städmaterial finns på plats. Ställ praktiska frågor innan jobbet startar och samla kommunikationen på ett ställe.",
    customersText2:
      "På Clean Jobs kan du lägga upp ett städjobb och få intresse från städare eller städföretag. Det är enklare än att kontakta många företag manuellt.",

    companiesEyebrow: "Företag",
    companiesTitle: "Hur städföretag kan synas på framtida listor",
    companiesText1:
      "Den här sidan är just nu en guide, inte en ranking av specifika företag. I framtiden kan Clean Jobs lyfta fram registrerade städföretag baserat på profilkvalitet, verifiering, omdömen, aktivitet och vilka områden de arbetar i.",
    companiesText2:
      "Därför bör städföretag skapa en komplett profil redan nu: företagsnamn, logotyp, stad, serviceområden och tydlig beskrivning. Ju bättre profil, desto lättare blir det för kunder att känna förtroende.",

    ctaTitle: "Hitta rätt städhjälp i Sverige",
    ctaText:
      "Clean Jobs hjälper kunder, städare och städföretag att hitta varandra på en marknadsplats för städjobb och städtjänster.",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Najlepsze firmy sprzątające w Szwecji 2026 | Clean Jobs",
    metaDescription:
      "Poradnik, jak znaleźć dobrą firmę sprzątającą w Szwecji. Porównuj sprzątanie domu, biura, po przeprowadzce, ceny, opinie i lokalne usługi.",
    metaOgTitle: "Najlepsze firmy sprzątające w Szwecji | Clean Jobs",
    metaOgDescription:
      "Poradnik, jak porównywać firmy sprzątające w Szwecji i znaleźć odpowiednią pomoc w sprzątaniu.",
    metaOgAlt: "Najlepsze firmy sprzątające w Szwecji",
    keywordBest: "najlepsze firmy sprzątające w Szwecji",
    keywordCompany: "firma sprzątająca Szwecja",
    keywordFirm: "firma sprzątająca Szwecja",
    keywordHome: "sprzątanie domu Szwecja",
    keywordOffice: "sprzątanie biura Szwecja",
    keywordMove: "sprzątanie po przeprowadzce Szwecja",
    keywordHire: "zatrudnić sprzątacza Szwecja",
    keywordHelp: "pomoc w sprzątaniu Szwecja",
    keywordStockholm: "firma sprzątająca Sztokholm",
    keywordService: "usługi sprzątania Szwecja",

    faqChooseQuestion: "Jak wybrać najlepszą firmę sprzątającą?",
    faqChooseAnswer:
      "Porównuj usługi, cenę, dostępność, komunikację, opinie, informacje o firmie oraz to, czy firma oferuje typ sprzątania, którego potrzebujesz.",
    faqServicesQuestion: "Jakie usługi sprzątania są najczęstsze?",
    faqServicesAnswer:
      "Najczęstsze usługi to sprzątanie domu, biura, po przeprowadzce, mieszkania, sprzątanie generalne i regularne.",
    faqCleanJobsQuestion: "Czy Clean Jobs może pomóc znaleźć firmę sprzątającą?",
    faqCleanJobsAnswer:
      "Tak. Clean Jobs pomaga klientom, sprzątaczom i firmom sprzątającym znaleźć się nawzajem przez wyspecjalizowany marketplace dla prac i usług sprzątania.",

    heroEyebrow: "Firmy sprzątające",
    heroTitle:
      "Najlepsze firmy sprzątające w Szwecji: jak wybrać odpowiednią pomoc",
    heroText:
      "Wybór firmy sprzątającej to nie tylko cena. Najlepsze firmy są wiarygodne, jasno komunikują, łatwo się z nimi skontaktować i przejrzyście pokazują, jakie usługi oferują. Ten poradnik pomoże porównać sprzątanie domu, biura, po przeprowadzce i regularne sprzątanie.",
    postCleaningJob: "Dodaj pracę sprzątania",
    stockholmCleaningCompany: "Firma sprzątająca Sztokholm",

    comparisonEyebrow: "Porównanie",
    comparisonTitle: "Co sprawia, że firma sprzątająca należy do najlepszych?",
    comparisonText1:
      "Dobra firma sprzątająca powinna jasno pokazywać, jakie usługi oferuje, w jakich obszarach działa i jak się z nią skontaktować. Dla klientów prywatnych zaufanie jest szczególnie ważne, ponieważ sprzątacz może pracować w domu. Dla firm najważniejsza jest często niezawodność i stabilna jakość.",
    comparisonText2:
      "Clean Jobs powstał, aby ułatwić porównywanie. Klienci mogą publikować prace sprzątania, a sprzątacze i firmy mogą pokazywać swoje profile oraz komunikować się bezpośrednio na platformie.",

    cardServicesTitle: "Jasne usługi",
    cardServicesText:
      "Dobra firma pokazuje, czy oferuje sprzątanie domu, biura, po przeprowadzce albo regularne sprzątanie.",
    cardLocalTitle: "Lokalny zasięg",
    cardLocalText:
      "Sprawdź, czy firma działa w Twoim mieście, dzielnicy i pobliskich gminach.",
    cardFastTitle: "Szybkie odpowiedzi",
    cardFastText:
      "Dobra komunikacja często pokazuje, że firma jest zorganizowana i wiarygodna.",
    cardTrustTitle: "Sygnały zaufania",
    cardTrustText:
      "Zwracaj uwagę na nazwę firmy, informacje w profilu, opinie, weryfikację, logo i profesjonalną prezentację.",

    servicesEyebrow: "Usługi",
    servicesTitle: "Popularne usługi sprzątania w Szwecji",
    servicesText1:
      "Najczęstsze usługi to sprzątanie domu, mieszkania, biura, po przeprowadzce, klatek schodowych, sprzątanie generalne i regularne. Niektóre firmy oferują także mycie okien, sprzątanie budowlane albo sprzątanie dla wspólnot mieszkaniowych.",
    servicesText2:
      "Przed wyborem firmy warto jasno opisać pracę. Podaj miasto, przybliżony obszar, wielkość mieszkania, typ sprzątania, datę, godzinę i budżet. Jasne informacje pomagają firmom odpowiadać szybciej.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Gdzie znaleźć firmy sprzątające w Szwecji?",
    citiesText1:
      "Największe rynki to Sztokholm, Göteborg i Malmö, ponieważ w tych miastach jest dużo mieszkań, biur, przeprowadzek i firm. Popyt istnieje też w Uppsali, Västerås, Örebro, Linköping, Helsingborgu, Lund i Jönköping.",
    citiesText2:
      "Jeśli jesteś klientem, najlepiej zacząć lokalnie. Jeśli prowadzisz firmę sprzątającą, profil powinien jasno pokazywać, jakie miasta i obszary obsługujesz. Lokalna widoczność jest bardzo ważna dla usług sprzątania.",

    customersEyebrow: "Klienci",
    customersTitle: "Jak bezpieczniej zatrudnić sprzątacza",
    customersText1:
      "Zacznij od jasnego opisu i unikaj nieprecyzyjnych wiadomości. Wyjaśnij, co ma być posprzątane, jak duży jest dom lub lokal i czy środki czystości są dostępne na miejscu. Zadaj praktyczne pytania przed rozpoczęciem pracy i trzymaj komunikację w jednym miejscu.",
    customersText2:
      "Na Clean Jobs możesz opublikować pracę sprzątania i otrzymać zainteresowanie od sprzątaczy albo firm sprzątających. To prostsze niż ręczne kontaktowanie się z wieloma firmami.",

    companiesEyebrow: "Firmy",
    companiesTitle: "Jak firmy sprzątające mogą pojawić się na przyszłych listach",
    companiesText1:
      "Ta strona jest obecnie poradnikiem, a nie rankingiem konkretnych firm. W przyszłości Clean Jobs może wyróżniać zarejestrowane firmy sprzątające na podstawie jakości profilu, weryfikacji, opinii, aktywności i obszarów działania.",
    companiesText2:
      "Dlatego firmy sprzątające powinny już teraz stworzyć kompletny profil: nazwa firmy, logo, miasto, obszary usług i jasny opis. Im lepszy profil, tym łatwiej klientom zaufać firmie.",

    ctaTitle: "Znajdź odpowiednią pomoc w sprzątaniu w Szwecji",
    ctaText:
      "Clean Jobs pomaga klientom, sprzątaczom i firmom sprzątającym znaleźć się nawzajem na marketplace dla prac i usług sprzątania.",
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
      canonical: "/basta-stadforetag-i-sverige",
    },
    keywords: [
      t.keywordBest,
      t.keywordCompany,
      t.keywordFirm,
      t.keywordHome,
      t.keywordOffice,
      t.keywordMove,
      t.keywordHire,
      t.keywordHelp,
      t.keywordStockholm,
      t.keywordService,
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/basta-stadforetag-i-sverige`,
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

export default async function BastaStadforetagISverigePage() {
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
              href="/stadfirma-stockholm"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.stockholmCleaningCompany}
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

          <Section eyebrow={t.customersEyebrow} title={t.customersTitle}>
            <p>{t.customersText1}</p>
            <p>{t.customersText2}</p>
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
                {t.postCleaningJob}
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
        </div>

        <RelatedGuides currentPath="/basta-stadforetag-i-sverige" />
      </main>
    </div>
  )
}