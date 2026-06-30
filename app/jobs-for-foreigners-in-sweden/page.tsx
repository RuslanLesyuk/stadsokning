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
    metaTitle: "Робота для іноземців у Швеції 2026 | Clean Jobs",
    metaDescription:
      "Гід для іноземців, які шукають роботу у Швеції. Клінінг, сервіс, робота без вільної шведської та практичні кроки для новоприбулих.",
    metaOgTitle: "Робота для іноземців у Швеції | Clean Jobs",
    metaOgDescription:
      "Практичний гід для іноземців, новоприбулих та іммігрантів, які шукають роботу у Швеції.",
    metaOgAlt: "Робота для іноземців у Швеції",

    faqOneQuestion: "Чи можуть іноземці знайти роботу у Швеції без вільної шведської?",
    faqOneAnswer:
      "Так. Деякі роботи у Швеції потребують шведської, але клінінг, сервіс, склад, ресторан і деякі міжнародні ролі можуть бути можливими з англійською або базовою шведською.",
    faqTwoQuestion: "Які роботи легше отримати іноземцям у Швеції?",
    faqTwoAnswer:
      "Клінінг, склад, ресторан, готель, доставка та допоміжні будівельні роботи можуть бути практичними стартовими варіантами для іноземців у Швеції.",
    faqThreeQuestion: "Як Clean Jobs може допомогти іноземцям знайти роботу?",
    faqThreeAnswer:
      "Clean Jobs допомагає працівникам знаходити роботи з прибирання, а клієнтам і клінінговим компаніям — знаходити людей, готових працювати у Швеції.",

    heroEyebrow: "Робота для іноземців",
    heroTitle: "Робота для іноземців у Швеції: практичні варіанти для новоприбулих",
    heroText:
      "Знайти роботу у Швеції іноземцю може бути складно, особливо якщо ви ще вивчаєте шведську. Але є практичні варіанти, де надійність, комунікація та готовність працювати можуть бути важливішими за ідеальну мову. Клінінг, сервіс, склади, ресторани та локальні допоміжні роботи можуть бути хорошим стартом.",
    browseJobs: "Переглянути роботи з прибирання",
    createProfile: "Створити профіль",

    startEyebrow: "Початок",
    startTitle: "Як іноземцям знайти роботу у Швеції",
    startText1:
      "Перший крок — зрозуміти, які роботи відповідають вашому рівню мови, досвіду та графіку. Багато роботодавців віддають перевагу шведській, але не кожна робота вимагає вільної шведської з першого дня.",
    startText2:
      "Щоб підвищити шанси, підготуйте просте CV, оновіть контактні дані, подавайтеся часто й швидко відповідайте, коли з вами зв’язуються. Профіль із містом, доступністю та досвідом допомагає клієнтам і компаніям швидше довіряти вам.",

    cardCleaningTitle: "Клінінг",
    cardCleaningText:
      "Прибирання дому, офісу та після переїзду може бути практичним стартом для іноземців у Швеції.",
    cardServiceTitle: "Сервіс",
    cardServiceText:
      "Готелі, ресторани та локальні сервісні бізнеси часто потребують надійних працівників.",
    cardWarehouseTitle: "Склад",
    cardWarehouseText:
      "Логістика та складські ролі можуть підходити, якщо ви можете виконувати інструкції та стабільно працювати.",
    cardConstructionTitle: "Допомога на будівництві",
    cardConstructionText:
      "Деяким будівельним і ремонтним компаніям потрібні помічники, прибиральники та допоміжні працівники.",

    cleaningEyebrow: "Клінінг",
    cleaningTitle: "Чому робота з прибирання може бути хорошим першим кроком",
    cleaningText1:
      "Роботи з прибирання у Швеції можуть бути легшими для розуміння, ніж багато офісних робіт, бо завдання практичне й чітке. Клієнтам часто потрібне прибирання дому, квартири, офісу, після переїзду або регулярне прибирання.",
    cleaningText2:
      "Clean Jobs фокусується на клінінгу, тому що ця потреба реальна. Працівники можуть переглядати роботи, клієнти — публікувати запити, а клінінгові компанії — показувати себе новим клієнтам.",

    languageEyebrow: "Мова",
    languageTitle: "Чи потрібна шведська для роботи?",
    languageText1:
      "Деякі роботи у Швеції потребують шведської, особливо там, де є клієнтський сервіс, документація або правила безпеки. Але багато іноземців починають із ролей, де достатньо простої комунікації.",
    languageText2:
      "Для робіт з прибирання часто достатньо зрозуміти завдання, час, місце та очікування. Короткий профіль англійською або простою шведською краще, ніж відсутність профілю.",

    citiesEyebrow: "Міста",
    citiesTitle: "Найкращі міста для іноземних працівників у Швеції",
    citiesText1:
      "Найбільші ринки праці зазвичай у Стокгольмі, Гетеборзі та Мальме, а також в Уппсалі, Вестеросі, Еребру, Лінчепінгу, Гельсінборзі, Лунді та Єнчепінгу.",
    citiesText2:
      "Якщо ви живете біля великого міста, шукайте і в самому місті, і в сусідніх комунах. Багато клієнтів живуть поза центром, але також потребують прибиральників або сервісних працівників.",

    profileEyebrow: "Профіль",
    profileTitle: "Як зробити профіль більш довірливим",
    profileText1:
      "Використовуйте справжнє ім’я, додайте місто, доступність і поясніть, яку роботу можете виконувати. Якщо маєте досвід у клінінгу, згадайте прибирання дому, офісу, після переїзду або регулярне прибирання.",
    profileText2:
      "Довіра дуже важлива у Швеції, особливо коли клієнти запрошують когось у свій дім. Чіткий профіль, швидкі відповіді та ввічлива комунікація можуть мати велике значення.",

    ctaTitle: "Почніть із робіт з прибирання у Швеції",
    ctaText:
      "Якщо ви іноземець і шукаєте роботу у Швеції, Clean Jobs може допомогти знайти роботи з прибирання та зв’язатися з клієнтами або клінінговими компаніями, яким потрібні надійні працівники.",
    findJobs: "Знайти роботи",
    readGuide: "Читати гід по роботі",
  },

  ru: {
    metaTitle: "Работа для иностранцев в Швеции 2026 | Clean Jobs",
    metaDescription:
      "Гид для иностранцев, которые ищут работу в Швеции. Клининг, сервис, работа без свободного шведского и практические шаги для новоприбывших.",
    metaOgTitle: "Работа для иностранцев в Швеции | Clean Jobs",
    metaOgDescription:
      "Практический гид для иностранцев, новоприбывших и иммигрантов, которые ищут работу в Швеции.",
    metaOgAlt: "Работа для иностранцев в Швеции",

    faqOneQuestion: "Могут ли иностранцы найти работу в Швеции без свободного шведского?",
    faqOneAnswer:
      "Да. Некоторые работы в Швеции требуют шведского, но клининг, сервис, склад, ресторан и некоторые международные роли могут быть возможны с английским или базовым шведским.",
    faqTwoQuestion: "Какие работы легче получить иностранцам в Швеции?",
    faqTwoAnswer:
      "Клининг, склад, ресторан, отель, доставка и вспомогательные строительные работы могут быть практичными стартовыми вариантами для иностранцев в Швеции.",
    faqThreeQuestion: "Как Clean Jobs может помочь иностранцам найти работу?",
    faqThreeAnswer:
      "Clean Jobs помогает работникам находить работы по уборке, а клиентам и клининговым компаниям — находить людей, готовых работать в Швеции.",

    heroEyebrow: "Работа для иностранцев",
    heroTitle: "Работа для иностранцев в Швеции: практические варианты для новоприбывших",
    heroText:
      "Найти работу в Швеции иностранцу может быть сложно, особенно если вы ещё учите шведский. Но есть практические варианты, где надёжность, коммуникация и готовность работать могут быть важнее идеального языка. Клининг, сервис, склады, рестораны и локальные вспомогательные работы могут быть хорошим стартом.",
    browseJobs: "Смотреть работы по уборке",
    createProfile: "Создать профиль",

    startEyebrow: "Начало",
    startTitle: "Как иностранцам найти работу в Швеции",
    startText1:
      "Первый шаг — понять, какие работы подходят вашему уровню языка, опыту и графику. Многие работодатели предпочитают шведский, но не каждая работа требует свободного шведского с первого дня.",
    startText2:
      "Чтобы повысить шансы, подготовьте простое CV, обновите контактные данные, подавайтесь часто и быстро отвечайте, когда с вами связываются. Профиль с городом, доступностью и опытом помогает клиентам и компаниям быстрее доверять вам.",

    cardCleaningTitle: "Клининг",
    cardCleaningText:
      "Уборка дома, офиса и после переезда может быть практичным стартом для иностранцев в Швеции.",
    cardServiceTitle: "Сервис",
    cardServiceText:
      "Отели, рестораны и локальные сервисные бизнесы часто нуждаются в надёжных работниках.",
    cardWarehouseTitle: "Склад",
    cardWarehouseText:
      "Логистика и складские роли могут подойти, если вы можете выполнять инструкции и стабильно работать.",
    cardConstructionTitle: "Помощь на стройке",
    cardConstructionText:
      "Некоторым строительным и ремонтным компаниям нужны помощники, уборщики и вспомогательные работники.",

    cleaningEyebrow: "Клининг",
    cleaningTitle: "Почему работа по уборке может быть хорошим первым шагом",
    cleaningText1:
      "Работы по уборке в Швеции могут быть проще для понимания, чем многие офисные работы, потому что задача практичная и понятная. Клиентам часто нужна уборка дома, квартиры, офиса, после переезда или регулярная уборка.",
    cleaningText2:
      "Clean Jobs фокусируется на клининге, потому что эта потребность реальна. Работники могут просматривать работы, клиенты — публиковать запросы, а клининговые компании — показывать себя новым клиентам.",

    languageEyebrow: "Язык",
    languageTitle: "Нужен ли шведский для работы?",
    languageText1:
      "Некоторые работы в Швеции требуют шведского, особенно там, где есть клиентский сервис, документация или правила безопасности. Но многие иностранцы начинают с ролей, где достаточно простой коммуникации.",
    languageText2:
      "Для работ по уборке часто достаточно понять задачу, время, место и ожидания. Короткий профиль на английском или простом шведском лучше, чем отсутствие профиля.",

    citiesEyebrow: "Города",
    citiesTitle: "Лучшие города для иностранных работников в Швеции",
    citiesText1:
      "Крупнейшие рынки труда обычно в Стокгольме, Гётеборге и Мальмё, а также в Уппсале, Вестеросе, Эребру, Линчёпинге, Хельсингборге, Лунде и Йёнчёпинге.",
    citiesText2:
      "Если вы живёте рядом с большим городом, ищите и в самом городе, и в соседних коммунах. Многие клиенты живут за пределами центра, но тоже нуждаются в уборщиках или сервисных работниках.",

    profileEyebrow: "Профиль",
    profileTitle: "Как сделать профиль более доверительным",
    profileText1:
      "Используйте настоящее имя, добавьте город, доступность и объясните, какую работу можете выполнять. Если есть опыт в клининге, укажите уборку дома, офиса, после переезда или регулярную уборку.",
    profileText2:
      "Доверие очень важно в Швеции, особенно когда клиенты приглашают кого-то в свой дом. Чёткий профиль, быстрые ответы и вежливая коммуникация могут иметь большое значение.",

    ctaTitle: "Начните с работ по уборке в Швеции",
    ctaText:
      "Если вы иностранец и ищете работу в Швеции, Clean Jobs может помочь найти работы по уборке и связаться с клиентами или клининговыми компаниями, которым нужны надёжные работники.",
    findJobs: "Найти работы",
    readGuide: "Читать гид по работе",
  },

  en: {
    metaTitle: "Jobs for Foreigners in Sweden 2026 | Work Without Perfect Swedish",
    metaDescription:
      "Guide to finding jobs for foreigners in Sweden. Learn about cleaning jobs, service work, jobs without fluent Swedish and how newcomers can find work faster.",
    metaOgTitle: "Jobs for Foreigners in Sweden | Clean Jobs",
    metaOgDescription:
      "A practical guide for foreigners, newcomers and immigrants looking for work in Sweden.",
    metaOgAlt: "Jobs for foreigners in Sweden",

    faqOneQuestion: "Can foreigners find jobs in Sweden without fluent Swedish?",
    faqOneAnswer:
      "Yes. Some jobs in Sweden require Swedish, but cleaning work, service jobs, warehouse work, restaurant work and some international roles may be possible with English or basic Swedish.",
    faqTwoQuestion: "What jobs are easier for foreigners to get in Sweden?",
    faqTwoAnswer:
      "Cleaning jobs, warehouse jobs, restaurant jobs, hotel work, delivery work and construction support can be practical entry points for foreigners in Sweden.",
    faqThreeQuestion: "How can Clean Jobs help foreigners find work?",
    faqThreeAnswer:
      "Clean Jobs helps workers find cleaning jobs and helps clients or cleaning companies connect with people who are ready to work in Sweden.",

    heroEyebrow: "Jobs for foreigners",
    heroTitle: "Jobs for foreigners in Sweden: practical work options for newcomers",
    heroText:
      "Finding work in Sweden as a foreigner can be challenging, especially if you are still learning Swedish. But there are practical job options where reliability, communication and willingness to work can matter more than perfect language skills. Cleaning jobs, service work, warehouses, restaurants and local support roles can be good entry points.",
    browseJobs: "Browse cleaning jobs",
    createProfile: "Create profile",

    startEyebrow: "Start here",
    startTitle: "How foreigners can find work in Sweden",
    startText1:
      "The first step is to understand which jobs match your current language level, experience and schedule. Many employers prefer Swedish, but not every job requires fluent Swedish from day one.",
    startText2:
      "To improve your chances, prepare a simple CV, keep your contact details updated, apply often and answer quickly when someone contacts you. A professional profile with your city, availability and work experience can help clients and companies trust you faster.",

    cardCleaningTitle: "Cleaning jobs",
    cardCleaningText:
      "Home cleaning, office cleaning and move-out cleaning can be practical entry jobs for foreigners in Sweden.",
    cardServiceTitle: "Service jobs",
    cardServiceText:
      "Hotels, restaurants and local service businesses often need reliable workers.",
    cardWarehouseTitle: "Warehouse jobs",
    cardWarehouseText:
      "Logistics and warehouse roles can be suitable if you can follow instructions and work consistently.",
    cardConstructionTitle: "Construction support",
    cardConstructionText:
      "Some construction and renovation companies need helpers, cleaners and support workers.",

    cleaningEyebrow: "Cleaning work",
    cleaningTitle: "Why cleaning jobs can be a good first step",
    cleaningText1:
      "Cleaning jobs in Sweden can be easier to understand than many office jobs because the task is practical and clear. Clients often need help with home cleaning, apartment cleaning, office cleaning, move-out cleaning and recurring cleaning.",
    cleaningText2:
      "Clean Jobs focuses on cleaning work because it connects a real need with people who are ready to work. Workers can browse jobs, clients can post requests, and cleaning companies can present themselves to new customers.",

    languageEyebrow: "Language",
    languageTitle: "Do you need Swedish to get a job?",
    languageText1:
      "Some jobs in Sweden require Swedish, especially roles with customer service, documentation or safety rules. But many foreigners start with roles where simple communication is enough.",
    languageText2:
      "For cleaning jobs, it can be enough to understand the task, time, place and expectations. A short profile in English or simple Swedish is better than no profile at all.",

    citiesEyebrow: "Cities",
    citiesTitle: "Best cities for foreign workers in Sweden",
    citiesText1:
      "The biggest job markets are usually Stockholm, Gothenburg and Malmö, followed by cities such as Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund and Jönköping.",
    citiesText2:
      "If you live near a large city, search both in the city and in nearby municipalities. Many clients are outside the city center but still need cleaners or service workers.",

    profileEyebrow: "Profile",
    profileTitle: "How to make clients trust your profile",
    profileText1:
      "Use your real name, add your city, write your availability and explain what work you can do. If you have cleaning experience, mention home cleaning, office cleaning, move-out cleaning or recurring cleaning.",
    profileText2:
      "Trust is very important in Sweden, especially when clients invite someone into their home. A clear profile, fast replies and polite communication can make a big difference.",

    ctaTitle: "Start with cleaning jobs in Sweden",
    ctaText:
      "If you are a foreigner looking for work in Sweden, Clean Jobs can help you find cleaning jobs and connect with clients or cleaning companies that need reliable workers.",
    findJobs: "Find jobs",
    readGuide: "Read work guide",
  },

  sv: {
    metaTitle: "Jobb för utlänningar i Sverige 2026 | Clean Jobs",
    metaDescription:
      "Guide för utlänningar som söker jobb i Sverige. Läs om städjobb, servicearbete, jobb utan flytande svenska och praktiska steg för nyanlända.",
    metaOgTitle: "Jobb för utlänningar i Sverige | Clean Jobs",
    metaOgDescription:
      "Praktisk guide för utlänningar, nyanlända och immigranter som söker arbete i Sverige.",
    metaOgAlt: "Jobb för utlänningar i Sverige",

    faqOneQuestion: "Kan utlänningar hitta jobb i Sverige utan flytande svenska?",
    faqOneAnswer:
      "Ja. Vissa jobb i Sverige kräver svenska, men städarbete, servicejobb, lagerarbete, restaurangjobb och vissa internationella roller kan vara möjliga med engelska eller grundläggande svenska.",
    faqTwoQuestion: "Vilka jobb är lättare för utlänningar att få i Sverige?",
    faqTwoAnswer:
      "Städjobb, lagerjobb, restaurangjobb, hotellarbete, leveransarbete och byggstöd kan vara praktiska ingångar för utlänningar i Sverige.",
    faqThreeQuestion: "Hur kan Clean Jobs hjälpa utlänningar att hitta arbete?",
    faqThreeAnswer:
      "Clean Jobs hjälper arbetare att hitta städjobb och hjälper kunder eller städföretag att hitta personer som är redo att arbeta i Sverige.",

    heroEyebrow: "Jobb för utlänningar",
    heroTitle: "Jobb för utlänningar i Sverige: praktiska arbetsmöjligheter för nyanlända",
    heroText:
      "Att hitta arbete i Sverige som utlänning kan vara utmanande, särskilt om du fortfarande lär dig svenska. Men det finns praktiska jobb där pålitlighet, kommunikation och vilja att arbeta kan vara viktigare än perfekta språkkunskaper.",
    browseJobs: "Bläddra bland städjobb",
    createProfile: "Skapa profil",

    startEyebrow: "Börja här",
    startTitle: "Hur utlänningar kan hitta arbete i Sverige",
    startText1:
      "Första steget är att förstå vilka jobb som passar din nuvarande språknivå, erfarenhet och tillgänglighet. Många arbetsgivare föredrar svenska, men alla jobb kräver inte flytande svenska från första dagen.",
    startText2:
      "För att öka dina chanser bör du förbereda ett enkelt CV, hålla kontaktuppgifter uppdaterade, söka ofta och svara snabbt när någon kontaktar dig.",

    cardCleaningTitle: "Städjobb",
    cardCleaningText:
      "Hemstädning, kontorsstädning och flyttstädning kan vara praktiska ingångsjobb för utlänningar i Sverige.",
    cardServiceTitle: "Servicejobb",
    cardServiceText:
      "Hotell, restauranger och lokala serviceföretag behöver ofta pålitliga arbetare.",
    cardWarehouseTitle: "Lagerjobb",
    cardWarehouseText:
      "Logistik- och lagerroller kan passa om du kan följa instruktioner och arbeta stabilt.",
    cardConstructionTitle: "Byggstöd",
    cardConstructionText:
      "Vissa bygg- och renoveringsföretag behöver hjälpare, städare och stödpersonal.",

    cleaningEyebrow: "Städarbete",
    cleaningTitle: "Varför städjobb kan vara ett bra första steg",
    cleaningText1:
      "Städjobb i Sverige kan vara enklare att förstå än många kontorsjobb eftersom uppgiften är praktisk och tydlig.",
    cleaningText2:
      "Clean Jobs fokuserar på städarbete eftersom det kopplar ett verkligt behov till människor som är redo att arbeta.",

    languageEyebrow: "Språk",
    languageTitle: "Behöver du svenska för att få jobb?",
    languageText1:
      "Vissa jobb i Sverige kräver svenska, särskilt roller med kundservice, dokumentation eller säkerhetsregler. Men många utlänningar börjar med roller där enkel kommunikation räcker.",
    languageText2:
      "För städjobb kan det räcka att förstå uppgiften, tiden, platsen och förväntningarna. En kort profil på engelska eller enkel svenska är bättre än ingen profil alls.",

    citiesEyebrow: "Städer",
    citiesTitle: "Bästa städerna för utländska arbetare i Sverige",
    citiesText1:
      "De största arbetsmarknaderna är vanligtvis Stockholm, Göteborg och Malmö, följt av Uppsala, Västerås, Örebro, Linköping, Helsingborg, Lund och Jönköping.",
    citiesText2:
      "Om du bor nära en större stad, sök både i staden och i närliggande kommuner. Många kunder finns utanför centrum men behöver fortfarande städare eller servicearbetare.",

    profileEyebrow: "Profil",
    profileTitle: "Så får du kunder att lita på din profil",
    profileText1:
      "Använd ditt riktiga namn, lägg till din stad, skriv din tillgänglighet och förklara vilket arbete du kan göra.",
    profileText2:
      "Förtroende är mycket viktigt i Sverige, särskilt när kunder bjuder in någon i sitt hem. En tydlig profil, snabba svar och artig kommunikation kan göra stor skillnad.",

    ctaTitle: "Börja med städjobb i Sverige",
    ctaText:
      "Om du är utlänning och söker arbete i Sverige kan Clean Jobs hjälpa dig att hitta städjobb och komma i kontakt med kunder eller städföretag som behöver pålitliga arbetare.",
    findJobs: "Hitta jobb",
    readGuide: "Läs arbetsguiden",
  },

  pl: {
    metaTitle: "Praca dla obcokrajowców w Szwecji 2026 | Clean Jobs",
    metaDescription:
      "Poradnik dla obcokrajowców szukających pracy w Szwecji. Sprzątanie, usługi, praca bez płynnego szwedzkiego i praktyczne kroki dla nowych osób.",
    metaOgTitle: "Praca dla obcokrajowców w Szwecji | Clean Jobs",
    metaOgDescription:
      "Praktyczny poradnik dla obcokrajowców, nowych osób i imigrantów szukających pracy w Szwecji.",
    metaOgAlt: "Praca dla obcokrajowców w Szwecji",

    faqOneQuestion: "Czy obcokrajowcy mogą znaleźć pracę w Szwecji bez płynnego szwedzkiego?",
    faqOneAnswer:
      "Tak. Niektóre prace w Szwecji wymagają szwedzkiego, ale sprzątanie, usługi, magazyn, restauracja i niektóre role międzynarodowe mogą być możliwe z angielskim lub podstawowym szwedzkim.",
    faqTwoQuestion: "Jakie prace są łatwiejsze dla obcokrajowców w Szwecji?",
    faqTwoAnswer:
      "Sprzątanie, magazyn, restauracja, hotel, dostawy i pomoc budowlana mogą być praktycznymi punktami startowymi dla obcokrajowców w Szwecji.",
    faqThreeQuestion: "Jak Clean Jobs może pomóc obcokrajowcom znaleźć pracę?",
    faqThreeAnswer:
      "Clean Jobs pomaga pracownikom znajdować prace sprzątania, a klientom i firmom sprzątającym znaleźć osoby gotowe do pracy w Szwecji.",

    heroEyebrow: "Praca dla obcokrajowców",
    heroTitle: "Praca dla obcokrajowców w Szwecji: praktyczne opcje dla nowych osób",
    heroText:
      "Znalezienie pracy w Szwecji jako obcokrajowiec może być trudne, szczególnie jeśli nadal uczysz się szwedzkiego. Istnieją jednak praktyczne opcje, gdzie niezawodność, komunikacja i chęć pracy mogą być ważniejsze niż perfekcyjny język.",
    browseJobs: "Przeglądaj prace sprzątania",
    createProfile: "Utwórz profil",

    startEyebrow: "Start",
    startTitle: "Jak obcokrajowcy mogą znaleźć pracę w Szwecji",
    startText1:
      "Pierwszym krokiem jest zrozumienie, które prace pasują do Twojego poziomu języka, doświadczenia i grafiku.",
    startText2:
      "Aby zwiększyć szanse, przygotuj proste CV, aktualizuj dane kontaktowe, aplikuj często i odpowiadaj szybko, gdy ktoś się z Tobą kontaktuje.",

    cardCleaningTitle: "Sprzątanie",
    cardCleaningText:
      "Sprzątanie domu, biura i po przeprowadzce może być praktycznym startem dla obcokrajowców w Szwecji.",
    cardServiceTitle: "Usługi",
    cardServiceText:
      "Hotele, restauracje i lokalne firmy usługowe często potrzebują niezawodnych pracowników.",
    cardWarehouseTitle: "Magazyn",
    cardWarehouseText:
      "Logistyka i role magazynowe mogą pasować, jeśli potrafisz wykonywać instrukcje i pracować stabilnie.",
    cardConstructionTitle: "Pomoc budowlana",
    cardConstructionText:
      "Niektóre firmy budowlane i remontowe potrzebują pomocników, sprzątaczy i pracowników wsparcia.",

    cleaningEyebrow: "Sprzątanie",
    cleaningTitle: "Dlaczego prace sprzątania mogą być dobrym pierwszym krokiem",
    cleaningText1:
      "Prace sprzątania w Szwecji mogą być łatwiejsze do zrozumienia niż wiele prac biurowych, ponieważ zadanie jest praktyczne i jasne.",
    cleaningText2:
      "Clean Jobs skupia się na sprzątaniu, ponieważ łączy realną potrzebę z ludźmi gotowymi do pracy.",

    languageEyebrow: "Język",
    languageTitle: "Czy potrzebujesz szwedzkiego, aby dostać pracę?",
    languageText1:
      "Niektóre prace w Szwecji wymagają szwedzkiego, szczególnie role z obsługą klienta, dokumentacją lub zasadami bezpieczeństwa.",
    languageText2:
      "W pracach sprzątania często wystarczy zrozumieć zadanie, czas, miejsce i oczekiwania. Krótki profil po angielsku lub prostym szwedzku jest lepszy niż brak profilu.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Najlepsze miasta dla pracowników z zagranicy w Szwecji",
    citiesText1:
      "Największe rynki pracy są zwykle w Sztokholmie, Göteborgu i Malmö, a także w Uppsali, Västerås, Örebro, Linköping, Helsingborgu, Lund i Jönköping.",
    citiesText2:
      "Jeśli mieszkasz blisko dużego miasta, szukaj zarówno w mieście, jak i w pobliskich gminach.",

    profileEyebrow: "Profil",
    profileTitle: "Jak sprawić, aby klienci ufali Twojemu profilowi",
    profileText1:
      "Użyj prawdziwego imienia, dodaj miasto, dostępność i wyjaśnij, jaką pracę możesz wykonywać.",
    profileText2:
      "Zaufanie jest bardzo ważne w Szwecji, szczególnie gdy klienci zapraszają kogoś do domu. Jasny profil, szybkie odpowiedzi i uprzejma komunikacja mogą zrobić dużą różnicę.",

    ctaTitle: "Zacznij od prac sprzątania w Szwecji",
    ctaText:
      "Jeśli jesteś obcokrajowcem i szukasz pracy w Szwecji, Clean Jobs może pomóc znaleźć prace sprzątania oraz połączyć się z klientami lub firmami sprzątającymi.",
    findJobs: "Znajdź prace",
    readGuide: "Czytaj poradnik pracy",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/jobs-for-foreigners-in-sweden",
    },
    keywords: [
      "jobs for foreigners in Sweden",
      "work in Sweden for foreigners",
      "jobs in Sweden without Swedish",
      "English speaking jobs Sweden",
      "jobs for immigrants in Sweden",
      "cleaning jobs for foreigners Sweden",
      "jobs for Ukrainians in Sweden",
      "newcomer jobs Sweden",
      "part time jobs Sweden foreigners",
      "work in Stockholm for foreigners",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/jobs-for-foreigners-in-sweden`,
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
      { "@type": "Question", name: t.faqThreeQuestion, acceptedAnswer: { "@type": "Answer", text: t.faqThreeAnswer } },
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

function JobTypeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function JobsForForeignersInSwedenPage() {
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
              {t.browseJobs}
            </Link>
            <Link href="/signup" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]">
              {t.createProfile}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <Section eyebrow={t.startEyebrow} title={t.startTitle}>
            <p>{t.startText1}</p>
            <p>{t.startText2}</p>
          </Section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <JobTypeCard title={t.cardCleaningTitle} text={t.cardCleaningText} />
            <JobTypeCard title={t.cardServiceTitle} text={t.cardServiceText} />
            <JobTypeCard title={t.cardWarehouseTitle} text={t.cardWarehouseText} />
            <JobTypeCard title={t.cardConstructionTitle} text={t.cardConstructionText} />
          </section>

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

          <Section eyebrow={t.profileEyebrow} title={t.profileTitle}>
            <p>{t.profileText1}</p>
            <p>{t.profileText2}</p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{t.ctaText}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
                {t.findJobs}
              </Link>
              <Link href="/work-in-sweden" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">
                {t.readGuide}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/jobs-for-foreigners-in-sweden" />
        </div>
      </main>
    </div>
  )
}