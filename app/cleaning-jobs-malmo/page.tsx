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

const areas = [
  "Malmö City",
  "Limhamn",
  "Hyllie",
  "Rosengård",
  "Västra Hamnen",
  "Lund",
  "Trelleborg",
  "Staffanstorp",
  "Burlöv",
  "Lomma",
  "Vellinge",
  "Skåne",
]

const copy = {
  uk: {
    metaTitle: "Робота з прибирання в Мальме 2026 | Clean Jobs",
    metaDescription:
      "Знайдіть роботу з прибирання в Мальме. Гід по прибиранню дому, офісу, після переїзду та роботі прибиральником у Malmö і поруч.",
    metaOgTitle: "Робота з прибирання в Мальме | Clean Jobs",
    metaOgDescription:
      "Знайдіть роботу прибиральником у Мальме або найміть надійних прибиральників для дому, офісу чи прибирання після переїзду.",
    metaOgAlt: "Робота з прибирання в Мальме",

    faqFindQuestion: "Де знайти роботу з прибирання в Мальме?",
    faqFindAnswer:
      "Роботу з прибирання в Мальме можна знайти через клінінгові компанії, сайти вакансій, локальні контакти та спеціалізовані платформи, такі як Clean Jobs.",
    faqCommonQuestion: "Які роботи з прибирання поширені в Мальме?",
    faqCommonAnswer:
      "Поширені роботи — прибирання дому, квартири, офісу, після переїзду, генеральне та регулярне прибирання.",
    faqCompaniesQuestion: "Чи можуть клінінгові компанії використовувати Clean Jobs у Мальме?",
    faqCompaniesAnswer:
      "Так. Клінінгові компанії можуть використовувати Clean Jobs, щоб стати видимими, знаходити клієнтів і отримувати запити на прибирання в Мальме та поруч.",

    heroEyebrow: "Мальме",
    heroTitle:
      "Робота з прибирання в Мальме: знайдіть роботу або найміть надійних прибиральників",
    heroText:
      "У Мальме є сильний попит на надійних прибиральників для приватних домів, квартир, офісів та орендної нерухомості. Clean Jobs допомагає прибиральникам, клієнтам і клінінговим компаніям швидше знаходити одне одного для прибирання дому, офісу, після переїзду та регулярної роботи.",
    browseJobs: "Переглянути роботи в Мальме",
    postJob: "Опублікувати роботу з прибирання",

    overviewEyebrow: "Огляд",
    overviewTitle: "Чому Мальме підходить для роботи з прибирання",
    overviewText1:
      "Мальме — місто, що розвивається, з багатьма квартирами, офісами, магазинами, ресторанами та локальним бізнесом. Це створює стабільний попит на прибиральників, які працюють уважно, чітко комунікують і можуть виконувати різні типи прибирання.",
    overviewText2:
      "Робота з прибирання в Мальме може бути практичним варіантом для людей, які шукають часткову зайнятість, повний робочий день, додатковий дохід або перший крок на шведському ринку праці.",

    typesEyebrow: "Типи робіт",
    typesTitle: "Поширені роботи з прибирання в Мальме",
    typesText1:
      "Поширені роботи включають прибирання дому, квартири, офісу, після переїзду, генеральне прибирання та регулярне щотижневе або щомісячне прибирання. Деяким клієнтам потрібна термінова разова допомога, інші шукають довгострокову підтримку.",
    typesText2:
      "Clean Jobs дає прибиральникам і клінінговим компаніям спеціалізоване місце, щоб стати видимими, отримувати запити на роботи й будувати довіру з клієнтами в Мальме та навколишніх районах.",

    areasTitle: "Райони біля Мальме, де прибиральники можуть знайти роботу",
    areasText:
      "Якщо ви шукаєте роботу з прибирання в Мальме, варто включати сусідні комуни та райони для поїздок. Багато клієнтів живуть за межами центру, але також потребують регулярної допомоги з прибиранням.",

    workersEyebrow: "Для працівників",
    workersTitle: "Як отримувати більше робіт з прибирання в Мальме",
    workersText1:
      "Чіткий профіль може допомогти отримувати більше відповідей. Додайте ім’я, місто, номер телефону, доступність і досвід у прибиранні. Якщо ви представляєте клінінгову компанію, додайте назву компанії та логотип для довіри.",
    workersText2:
      "Напишіть, чи можете працювати ввечері, у вихідні, брати термінові роботи, прибирання дому, офісу, після переїзду або регулярні замовлення.",

    clientsEyebrow: "Для клієнтів",
    clientsTitle: "Як найняти прибиральника в Мальме",
    clientsText1:
      "Якщо вам потрібен прибиральник у Мальме, створіть оголошення з містом, приблизним районом, типом прибирання, датою, часом, бюджетом і описом. Чіткі деталі допомагають прибиральникам зрозуміти завдання та відповісти швидше.",
    clientsText2:
      "Clean Jobs створений для приватних клієнтів, працівників і клінінгових компаній. Ви можете опублікувати роботу, отримати інтерес і продовжити розмову через сторінку роботи та чат.",

    ctaTitle: "Почніть із робіт з прибирання в Мальме",
    ctaText:
      "Шукаєте роботу з прибирання або хочете найняти прибиральника? Clean Jobs дає вам спеціалізований маркетплейс для Мальме та сусідніх районів.",
    findJobs: "Знайти роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа по уборке в Мальмё 2026 | Clean Jobs",
    metaDescription:
      "Найдите работу по уборке в Мальмё. Гид по уборке дома, офиса, после переезда и работе уборщиком в Malmö и рядом.",
    metaOgTitle: "Работа по уборке в Мальмё | Clean Jobs",
    metaOgDescription:
      "Найдите работу уборщиком в Мальмё или наймите надёжных уборщиков для дома, офиса и уборки после переезда.",
    metaOgAlt: "Работа по уборке в Мальмё",

    faqFindQuestion: "Где найти работу по уборке в Мальмё?",
    faqFindAnswer:
      "Работу по уборке в Мальмё можно найти через клининговые компании, сайты вакансий, локальные контакты и специализированные платформы, такие как Clean Jobs.",
    faqCommonQuestion: "Какие работы по уборке распространены в Мальмё?",
    faqCommonAnswer:
      "Распространённые работы — уборка дома, квартиры, офиса, после переезда, генеральная и регулярная уборка.",
    faqCompaniesQuestion: "Могут ли клининговые компании использовать Clean Jobs в Мальмё?",
    faqCompaniesAnswer:
      "Да. Клининговые компании могут использовать Clean Jobs, чтобы стать видимыми, находить клиентов и получать запросы на уборку в Мальмё и рядом.",

    heroEyebrow: "Мальмё",
    heroTitle:
      "Работа по уборке в Мальмё: найдите работу или наймите надёжных уборщиков",
    heroText:
      "В Мальмё есть высокий спрос на надёжных уборщиков для частных домов, квартир, офисов и арендной недвижимости. Clean Jobs помогает уборщикам, клиентам и клининговым компаниям быстрее находить друг друга для уборки дома, офиса, после переезда и регулярной работы.",
    browseJobs: "Смотреть работы в Мальмё",
    postJob: "Опубликовать работу по уборке",

    overviewEyebrow: "Обзор",
    overviewTitle: "Почему Мальмё подходит для работы по уборке",
    overviewText1:
      "Мальмё — развивающийся город с большим количеством квартир, офисов, магазинов, ресторанов и локального бизнеса. Это создаёт стабильный спрос на уборщиков, которые работают аккуратно, понятно общаются и справляются с разными типами уборки.",
    overviewText2:
      "Работа по уборке в Мальмё может быть практичным вариантом для людей, которые ищут частичную занятость, полный день, дополнительный доход или первый шаг на шведском рынке труда.",

    typesEyebrow: "Типы работ",
    typesTitle: "Распространённые работы по уборке в Мальмё",
    typesText1:
      "Распространённые работы включают уборку дома, квартиры, офиса, после переезда, генеральную уборку и регулярную еженедельную или ежемесячную уборку. Некоторым клиентам нужна срочная разовая помощь, другие ищут долгосрочную поддержку.",
    typesText2:
      "Clean Jobs даёт уборщикам и клининговым компаниям специализированное место, чтобы стать видимыми, получать запросы на работы и строить доверие с клиентами в Мальмё и окрестностях.",

    areasTitle: "Районы рядом с Мальмё, где уборщики могут найти работу",
    areasText:
      "Если вы ищете работу по уборке в Мальмё, полезно включать соседние коммуны и районы для поездок. Многие клиенты живут за пределами центра, но им также нужна регулярная помощь с уборкой.",

    workersEyebrow: "Для работников",
    workersTitle: "Как получать больше работ по уборке в Мальмё",
    workersText1:
      "Чёткий профиль может помочь получать больше ответов. Добавьте имя, город, номер телефона, доступность и опыт уборки. Если вы представляете клининговую компанию, добавьте название компании и логотип для доверия.",
    workersText2:
      "Укажите, можете ли работать вечером, по выходным, брать срочные работы, уборку дома, офиса, после переезда или регулярные заказы.",

    clientsEyebrow: "Для клиентов",
    clientsTitle: "Как нанять уборщика в Мальмё",
    clientsText1:
      "Если вам нужен уборщик в Мальмё, создайте объявление с городом, примерным районом, типом уборки, датой, временем, бюджетом и описанием. Чёткие детали помогают уборщикам понять задачу и ответить быстрее.",
    clientsText2:
      "Clean Jobs создан для частных клиентов, работников и клининговых компаний. Вы можете опубликовать работу, получить интерес и продолжить разговор через страницу работы и чат.",

    ctaTitle: "Начните с работ по уборке в Мальмё",
    ctaText:
      "Ищете работу по уборке или хотите нанять уборщика? Clean Jobs даёт вам специализированный маркетплейс для Мальмё и соседних районов.",
    findJobs: "Найти работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaning Jobs in Malmö 2026 | Find Cleaner Work",
    metaDescription:
      "Find cleaning jobs in Malmö. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Malmö and nearby areas.",
    metaOgTitle: "Cleaning Jobs in Malmö | Clean Jobs",
    metaOgDescription:
      "Find cleaner work in Malmö or hire trusted cleaners for home cleaning, office cleaning and move-out cleaning.",
    metaOgAlt: "Cleaning jobs in Malmö",

    faqFindQuestion: "Where can I find cleaning jobs in Malmö?",
    faqFindAnswer:
      "You can find cleaning jobs in Malmö through cleaning companies, job boards, local networks and specialized platforms such as Clean Jobs.",
    faqCommonQuestion: "What cleaning jobs are common in Malmö?",
    faqCommonAnswer:
      "Common cleaning jobs in Malmö include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and recurring cleaning tasks.",
    faqCompaniesQuestion: "Can cleaning companies use Clean Jobs in Malmö?",
    faqCompaniesAnswer:
      "Yes. Cleaning companies can use Clean Jobs to become visible, find clients and receive cleaning job requests in Malmö and nearby areas.",

    heroEyebrow: "Malmö",
    heroTitle:
      "Cleaning jobs in Malmö: find cleaner work or hire trusted cleaners",
    heroText:
      "Malmö has strong demand for reliable cleaners in private homes, apartments, offices and rental properties. Clean Jobs helps cleaners, clients and cleaning companies connect faster for home cleaning, office cleaning, move-out cleaning and recurring cleaning work.",
    browseJobs: "Browse Malmö jobs",
    postJob: "Post a cleaning job",

    overviewEyebrow: "Overview",
    overviewTitle: "Why Malmö is good for cleaning work",
    overviewText1:
      "Malmö is a growing city with many apartments, offices, shops, restaurants and local businesses. This creates steady demand for cleaners who can work carefully, communicate clearly and handle different types of cleaning tasks.",
    overviewText2:
      "Cleaning jobs in Malmö can be a practical option for people looking for part-time work, full-time work, extra income or a first step into the Swedish labour market.",

    typesEyebrow: "Types of work",
    typesTitle: "Common cleaning jobs in Malmö",
    typesText1:
      "Common jobs include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and recurring weekly or monthly cleaning. Some clients need urgent one-time help, while others search for long-term cleaning support.",
    typesText2:
      "Clean Jobs gives cleaners and cleaning companies a focused place to become visible, receive job requests and build trust with clients in Malmö and surrounding areas.",

    areasTitle: "Areas near Malmö where cleaners can find work",
    areasText:
      "If you are searching for cleaning jobs in Malmö, include nearby municipalities and commuter areas. Many clients live outside the city center but still need regular cleaning help.",

    workersEyebrow: "For workers",
    workersTitle: "How to get more cleaning jobs in Malmö",
    workersText1:
      "A clear profile can help you get more responses. Add your name, city, phone number, availability and cleaning experience. If you represent a cleaning company, add the company name and logo to build trust.",
    workersText2:
      "Mention whether you can work evenings, weekends, short-notice jobs, home cleaning, office cleaning, move-out cleaning or recurring jobs.",

    clientsEyebrow: "For clients",
    clientsTitle: "How to hire a cleaner in Malmö",
    clientsText1:
      "If you need a cleaner in Malmö, create a job with the city, approximate area, cleaning type, date, time, budget and description. Clear details help cleaners understand the task and answer faster.",
    clientsText2:
      "Clean Jobs is made for private clients, workers and cleaning companies. You can post a job, receive interest and continue the conversation through the job page and chat.",

    ctaTitle: "Start with cleaning jobs in Malmö",
    ctaText:
      "Whether you are searching for cleaning work or need to hire a cleaner, Clean Jobs gives you a focused marketplace for Malmö and nearby areas.",
    findJobs: "Find jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Städjobb i Malmö 2026 | Hitta städarbete",
    metaDescription:
      "Hitta städjobb i Malmö. Guide till hemstädning, kontorsstädning, flyttstädning och jobb som städare i Malmö och närliggande områden.",
    metaOgTitle: "Städjobb i Malmö | Clean Jobs",
    metaOgDescription:
      "Hitta städarbete i Malmö eller anlita pålitliga städare för hemstädning, kontorsstädning och flyttstädning.",
    metaOgAlt: "Städjobb i Malmö",

    faqFindQuestion: "Var kan jag hitta städjobb i Malmö?",
    faqFindAnswer:
      "Du kan hitta städjobb i Malmö via städföretag, jobbsajter, lokala nätverk och specialiserade plattformar som Clean Jobs.",
    faqCommonQuestion: "Vilka städjobb är vanliga i Malmö?",
    faqCommonAnswer:
      "Vanliga städjobb i Malmö är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, storstädning och återkommande städuppdrag.",
    faqCompaniesQuestion: "Kan städföretag använda Clean Jobs i Malmö?",
    faqCompaniesAnswer:
      "Ja. Städföretag kan använda Clean Jobs för att synas, hitta kunder och få förfrågningar om städjobb i Malmö och närliggande områden.",

    heroEyebrow: "Malmö",
    heroTitle:
      "Städjobb i Malmö: hitta städarbete eller anlita pålitliga städare",
    heroText:
      "Malmö har stark efterfrågan på pålitliga städare i privata hem, lägenheter, kontor och hyresfastigheter. Clean Jobs hjälper städare, kunder och städföretag att snabbare mötas för hemstädning, kontorsstädning, flyttstädning och återkommande städarbete.",
    browseJobs: "Bläddra bland jobb i Malmö",
    postJob: "Lägg upp städjobb",

    overviewEyebrow: "Översikt",
    overviewTitle: "Varför Malmö är bra för städarbete",
    overviewText1:
      "Malmö är en växande stad med många lägenheter, kontor, butiker, restauranger och lokala företag. Det skapar stabil efterfrågan på städare som kan arbeta noggrant, kommunicera tydligt och hantera olika typer av städuppgifter.",
    overviewText2:
      "Städjobb i Malmö kan vara ett praktiskt alternativ för personer som söker deltidsarbete, heltidsarbete, extra inkomst eller ett första steg in på den svenska arbetsmarknaden.",

    typesEyebrow: "Typer av arbete",
    typesTitle: "Vanliga städjobb i Malmö",
    typesText1:
      "Vanliga jobb är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, storstädning och återkommande städning varje vecka eller månad. Vissa kunder behöver akut engångshjälp, medan andra söker långsiktigt stöd.",
    typesText2:
      "Clean Jobs ger städare och städföretag en fokuserad plats att bli synliga, ta emot jobbförfrågningar och bygga förtroende med kunder i Malmö och omgivande områden.",

    areasTitle: "Områden nära Malmö där städare kan hitta arbete",
    areasText:
      "Om du söker städjobb i Malmö, inkludera närliggande kommuner och pendlingsområden. Många kunder bor utanför centrum men behöver ändå regelbunden städhjälp.",

    workersEyebrow: "För arbetare",
    workersTitle: "Så får du fler städjobb i Malmö",
    workersText1:
      "En tydlig profil kan hjälpa dig att få fler svar. Lägg till namn, stad, telefonnummer, tillgänglighet och erfarenhet av städning. Om du representerar ett städföretag, lägg till företagsnamn och logotyp för att bygga förtroende.",
    workersText2:
      "Nämn om du kan arbeta kvällar, helger, med kort varsel, hemstädning, kontorsstädning, flyttstädning eller återkommande jobb.",

    clientsEyebrow: "För kunder",
    clientsTitle: "Så anlitar du städare i Malmö",
    clientsText1:
      "Om du behöver en städare i Malmö, skapa ett jobb med stad, ungefärligt område, typ av städning, datum, tid, budget och beskrivning. Tydliga detaljer hjälper städare att förstå uppdraget och svara snabbare.",
    clientsText2:
      "Clean Jobs är byggt för privatkunder, arbetare och städföretag. Du kan lägga upp ett jobb, få intresse och fortsätta konversationen via jobbsidan och chatten.",

    ctaTitle: "Börja med städjobb i Malmö",
    ctaText:
      "Oavsett om du söker städarbete eller behöver anlita en städare ger Clean Jobs dig en fokuserad marknadsplats för Malmö och närliggande områden.",
    findJobs: "Hitta jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Praca sprzątania w Malmö 2026 | Clean Jobs",
    metaDescription:
      "Znajdź prace sprzątania w Malmö. Poradnik o sprzątaniu domu, biura, po przeprowadzce i pracy jako sprzątacz w Malmö i okolicy.",
    metaOgTitle: "Praca sprzątania w Malmö | Clean Jobs",
    metaOgDescription:
      "Znajdź pracę jako sprzątacz w Malmö albo zatrudnij zaufanych sprzątaczy do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Praca sprzątania w Malmö",

    faqFindQuestion: "Gdzie znaleźć prace sprzątania w Malmö?",
    faqFindAnswer:
      "Prace sprzątania w Malmö można znaleźć przez firmy sprzątające, portale pracy, lokalne kontakty i wyspecjalizowane platformy takie jak Clean Jobs.",
    faqCommonQuestion: "Jakie prace sprzątania są popularne w Malmö?",
    faqCommonAnswer:
      "Popularne prace w Malmö to sprzątanie domu, mieszkania, biura, po przeprowadzce, sprzątanie generalne i regularne zadania sprzątania.",
    faqCompaniesQuestion: "Czy firmy sprzątające mogą używać Clean Jobs w Malmö?",
    faqCompaniesAnswer:
      "Tak. Firmy sprzątające mogą używać Clean Jobs, aby stać się widoczne, znaleźć klientów i otrzymywać zapytania o sprzątanie w Malmö i okolicy.",

    heroEyebrow: "Malmö",
    heroTitle:
      "Prace sprzątania w Malmö: znajdź pracę albo zatrudnij zaufanych sprzątaczy",
    heroText:
      "W Malmö jest duży popyt na zaufanych sprzątaczy do prywatnych domów, mieszkań, biur i nieruchomości na wynajem. Clean Jobs pomaga sprzątaczom, klientom i firmom sprzątającym szybciej łączyć się przy sprzątaniu domu, biura, po przeprowadzce i regularnych pracach.",
    browseJobs: "Przeglądaj prace w Malmö",
    postJob: "Dodaj pracę sprzątania",

    overviewEyebrow: "Przegląd",
    overviewTitle: "Dlaczego Malmö jest dobre dla pracy sprzątania",
    overviewText1:
      "Malmö to rozwijające się miasto z wieloma mieszkaniami, biurami, sklepami, restauracjami i lokalnymi firmami. To tworzy stały popyt na sprzątaczy, którzy pracują dokładnie, jasno komunikują się i obsługują różne typy sprzątania.",
    overviewText2:
      "Prace sprzątania w Malmö mogą być praktyczną opcją dla osób szukających pracy na część etatu, pełny etat, dodatkowego dochodu albo pierwszego kroku na szwedzkim rynku pracy.",

    typesEyebrow: "Typy pracy",
    typesTitle: "Popularne prace sprzątania w Malmö",
    typesText1:
      "Popularne prace obejmują sprzątanie domu, mieszkania, biura, po przeprowadzce, sprzątanie generalne i regularne sprzątanie co tydzień lub co miesiąc. Niektórzy klienci potrzebują pilnej jednorazowej pomocy, inni szukają długoterminowego wsparcia.",
    typesText2:
      "Clean Jobs daje sprzątaczom i firmom sprzątającym wyspecjalizowane miejsce, aby stać się widoczne, otrzymywać zapytania o prace i budować zaufanie z klientami w Malmö i okolicy.",

    areasTitle: "Obszary w pobliżu Malmö, gdzie sprzątacze mogą znaleźć pracę",
    areasText:
      "Jeśli szukasz prac sprzątania w Malmö, uwzględnij pobliskie gminy i obszary dojazdowe. Wielu klientów mieszka poza centrum, ale nadal potrzebuje regularnej pomocy w sprzątaniu.",

    workersEyebrow: "Dla pracowników",
    workersTitle: "Jak zdobyć więcej prac sprzątania w Malmö",
    workersText1:
      "Jasny profil może pomóc uzyskać więcej odpowiedzi. Dodaj imię, miasto, numer telefonu, dostępność i doświadczenie w sprzątaniu. Jeśli reprezentujesz firmę sprzątającą, dodaj nazwę firmy i logo, aby budować zaufanie.",
    workersText2:
      "Napisz, czy możesz pracować wieczorami, w weekendy, przy pilnych zleceniach, sprzątaniu domu, biura, po przeprowadzce albo przy regularnych pracach.",

    clientsEyebrow: "Dla klientów",
    clientsTitle: "Jak zatrudnić sprzątacza w Malmö",
    clientsText1:
      "Jeśli potrzebujesz sprzątacza w Malmö, utwórz ogłoszenie z miastem, przybliżonym obszarem, typem sprzątania, datą, godziną, budżetem i opisem. Jasne szczegóły pomagają sprzątaczom zrozumieć zadanie i szybciej odpowiedzieć.",
    clientsText2:
      "Clean Jobs jest stworzony dla klientów prywatnych, pracowników i firm sprzątających. Możesz dodać pracę, otrzymać zainteresowanie i kontynuować rozmowę przez stronę pracy oraz czat.",

    ctaTitle: "Zacznij od prac sprzątania w Malmö",
    ctaText:
      "Niezależnie od tego, czy szukasz pracy sprzątania, czy chcesz zatrudnić sprzątacza, Clean Jobs daje Ci wyspecjalizowany marketplace dla Malmö i pobliskich obszarów.",
    findJobs: "Znajdź prace",
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
      canonical: "/cleaning-jobs-malmo",
    },
    keywords: [
      "cleaning jobs Malmö",
      "cleaning jobs Malmo",
      "cleaner jobs Malmö",
      "cleaner jobs Malmo",
      "home cleaning jobs Malmö",
      "office cleaning jobs Malmö",
      "move out cleaning Malmö",
      "part time cleaning jobs Malmö",
      "cleaning work Malmö",
      "hire cleaner Malmö",
      "Malmö cleaning marketplace",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/cleaning-jobs-malmo`,
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
        name: t.faqFindQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqFindAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqCommonQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqCommonAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqCompaniesQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqCompaniesAnswer,
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

function AreaCard({ area }: { area: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
      {area}
    </div>
  )
}

export default async function CleaningJobsMalmoPage() {
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
              href="/jobs?city=Malmö"
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
          <Section eyebrow={t.overviewEyebrow} title={t.overviewTitle}>
            <p>{t.overviewText1}</p>
            <p>{t.overviewText2}</p>
          </Section>

          <Section eyebrow={t.typesEyebrow} title={t.typesTitle}>
            <p>{t.typesText1}</p>
            <p>{t.typesText2}</p>
          </Section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t.areasTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t.areasText}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {areas.map((area) => (
                <AreaCard key={area} area={area} />
              ))}
            </div>
          </section>

          <Section eyebrow={t.workersEyebrow} title={t.workersTitle}>
            <p>{t.workersText1}</p>
            <p>{t.workersText2}</p>
          </Section>

          <Section eyebrow={t.clientsEyebrow} title={t.clientsTitle}>
            <p>{t.clientsText1}</p>
            <p>{t.clientsText2}</p>
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
                href="/jobs?city=Malmö"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.findJobs}
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

        <RelatedGuides currentPath="/cleaning-jobs-malmo" />
      </main>
    </div>
  )
}