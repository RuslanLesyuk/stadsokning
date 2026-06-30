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
  "Göteborg City",
  "Hisingen",
  "Mölndal",
  "Partille",
  "Lerum",
  "Kungälv",
  "Kungsbacka",
  "Majorna",
  "Linné",
  "Frölunda",
  "Angered",
  "Västra Götaland",
]

const copy = {
  uk: {
    metaTitle: "Робота з прибирання в Гетеборзі 2026 | Clean Jobs",
    metaDescription:
      "Знайдіть роботу з прибирання в Гетеборзі. Гід по прибиранню дому, офісу, після переїзду та роботі прибиральником у Göteborg і поруч.",
    metaOgTitle: "Робота з прибирання в Гетеборзі | Clean Jobs",
    metaOgDescription:
      "Знайдіть роботу прибиральником у Гетеборзі або найміть надійних прибиральників для дому, офісу чи прибирання після переїзду.",
    metaOgAlt: "Робота з прибирання в Гетеборзі",

    faqFindQuestion: "Де знайти роботу з прибирання в Гетеборзі?",
    faqFindAnswer:
      "Роботу з прибирання в Гетеборзі можна знайти через клінінгові компанії, сайти вакансій, локальні контакти та спеціалізовані платформи, такі як Clean Jobs.",
    faqCommonQuestion: "Які роботи з прибирання поширені в Гетеборзі?",
    faqCommonAnswer:
      "Поширені роботи — прибирання дому, квартири, офісу, після переїзду, генеральне та регулярне прибирання.",
    faqCompaniesQuestion: "Чи можуть клінінгові компанії використовувати Clean Jobs у Гетеборзі?",
    faqCompaniesAnswer:
      "Так. Клінінгові компанії можуть використовувати Clean Jobs, щоб стати видимими, знаходити нових клієнтів і отримувати запити на прибирання в Гетеборзі та поруч.",

    heroEyebrow: "Гетеборг",
    heroTitle:
      "Робота з прибирання в Гетеборзі: знайдіть роботу або найміть надійних прибиральників",
    heroText:
      "Гетеборг — один із найсильніших сервісних ринків Швеції, де є попит на прибирання дому, квартир, офісів, після переїзду та регулярну допомогу з прибиранням. Clean Jobs допомагає прибиральникам, клієнтам і клінінговим компаніям знаходити одне одного в одному маркетплейсі.",
    browseJobs: "Переглянути роботи в Гетеборзі",
    postJob: "Опублікувати роботу з прибирання",

    overviewEyebrow: "Огляд",
    overviewTitle: "Чому Гетеборг підходить для роботи з прибирання",
    overviewText1:
      "У Гетеборзі багато квартир, приватних будинків, офісів, магазинів, ресторанів і локального бізнесу. Це створює постійний попит на прибиральників, які працюють уважно, приходять вчасно та чітко спілкуються з клієнтами.",
    overviewText2:
      "Роботи з прибирання в Гетеборзі можуть бути разовими або регулярними. Для багатьох працівників прибирання — практичний спосіб почати заробляти, будувати довіру та знаходити клієнтів без великої особистої мережі.",

    typesEyebrow: "Типи робіт",
    typesTitle: "Поширені роботи з прибирання в Гетеборзі",
    typesText1:
      "Поширені роботи включають прибирання дому, офісу, після переїзду, квартири, генеральне прибирання та регулярне щотижневе або щомісячне прибирання. Клієнти часто шукають прибиральників, які можуть пояснити доступність, райони роботи та попередній досвід.",
    typesText2:
      "Клінінгові компанії також можуть отримати користь від Clean Jobs, створивши видимий профіль, отримуючи запити на роботи та знаходячи клієнтів, яким уже потрібна допомога з прибиранням у районі Гетеборга.",

    areasTitle: "Райони біля Гетеборга, де прибиральники можуть знайти роботу",
    areasText:
      "Якщо ви шукаєте роботу з прибирання в Гетеборзі, варто включати сусідні райони та комуни для поїздок. Багато клієнтів живуть за межами центру, але також потребують регулярної допомоги з прибиранням.",

    workersEyebrow: "Для працівників",
    workersTitle: "Як отримувати більше робіт з прибирання в Гетеборзі",
    workersText1:
      "Сильний профіль підвищує ваші шанси. Додайте ім’я, місто, номер телефону, доступність і досвід у прибиранні. Якщо ви працюєте в компанії, додайте назву компанії та логотип, щоб клієнти впізнавали ваш бренд.",
    workersText2:
      "Напишіть, чи можете працювати ввечері, у вихідні або брати термінові роботи. Також опишіть, що вам більше підходить: прибирання дому, офісу, після переїзду чи регулярні замовлення.",

    clientsEyebrow: "Для клієнтів",
    clientsTitle: "Як найняти прибиральника в Гетеборзі",
    clientsText1:
      "Якщо вам потрібен прибиральник у Гетеборзі, створіть чітке оголошення з містом, приблизним районом адреси, типом прибирання, датою, часом, бюджетом і описом. Чіткі деталі допомагають прибиральникам краще зрозуміти завдання та швидше відповісти.",
    clientsText2:
      "Clean Jobs створений для приватних клієнтів, працівників і клінінгових компаній. Ви можете опублікувати роботу, отримати інтерес і продовжити розмову через сторінку роботи та чат.",

    ctaTitle: "Почніть із робіт з прибирання в Гетеборзі",
    ctaText:
      "Шукаєте роботу з прибирання або хочете найняти прибиральника? Clean Jobs дає вам спеціалізований маркетплейс для Гетеборга та сусідніх районів.",
    findJobs: "Знайти роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа по уборке в Гётеборге 2026 | Clean Jobs",
    metaDescription:
      "Найдите работу по уборке в Гётеборге. Гид по уборке дома, офиса, после переезда и работе уборщиком в Göteborg и рядом.",
    metaOgTitle: "Работа по уборке в Гётеборге | Clean Jobs",
    metaOgDescription:
      "Найдите работу уборщиком в Гётеборге или наймите надёжных уборщиков для дома, офиса и уборки после переезда.",
    metaOgAlt: "Работа по уборке в Гётеборге",

    faqFindQuestion: "Где найти работу по уборке в Гётеборге?",
    faqFindAnswer:
      "Работу по уборке в Гётеборге можно найти через клининговые компании, сайты вакансий, локальные контакты и специализированные платформы, такие как Clean Jobs.",
    faqCommonQuestion: "Какие работы по уборке распространены в Гётеборге?",
    faqCommonAnswer:
      "Распространённые работы — уборка дома, квартиры, офиса, после переезда, генеральная и регулярная уборка.",
    faqCompaniesQuestion: "Могут ли клининговые компании использовать Clean Jobs в Гётеборге?",
    faqCompaniesAnswer:
      "Да. Клининговые компании могут использовать Clean Jobs, чтобы стать видимыми, находить новых клиентов и получать запросы на уборку в Гётеборге и рядом.",

    heroEyebrow: "Гётеборг",
    heroTitle:
      "Работа по уборке в Гётеборге: найдите работу или наймите надёжных уборщиков",
    heroText:
      "Гётеборг — один из самых сильных сервисных рынков Швеции, где есть спрос на уборку дома, квартир, офисов, после переезда и регулярную помощь с уборкой. Clean Jobs помогает уборщикам, клиентам и клининговым компаниям находить друг друга в одном маркетплейсе.",
    browseJobs: "Смотреть работы в Гётеборге",
    postJob: "Опубликовать работу по уборке",

    overviewEyebrow: "Обзор",
    overviewTitle: "Почему Гётеборг подходит для работы по уборке",
    overviewText1:
      "В Гётеборге много квартир, частных домов, офисов, магазинов, ресторанов и локального бизнеса. Это создаёт постоянный спрос на уборщиков, которые работают аккуратно, приходят вовремя и понятно общаются с клиентами.",
    overviewText2:
      "Работы по уборке в Гётеборге могут быть разовыми или регулярными. Для многих работников уборка — практичный способ начать зарабатывать, строить доверие и находить клиентов без большой личной сети.",

    typesEyebrow: "Типы работ",
    typesTitle: "Распространённые работы по уборке в Гётеборге",
    typesText1:
      "Распространённые работы включают уборку дома, офиса, после переезда, квартиры, генеральную уборку и регулярную еженедельную или ежемесячную уборку. Клиенты часто ищут уборщиков, которые могут объяснить доступность, районы работы и предыдущий опыт.",
    typesText2:
      "Клининговые компании также могут получить пользу от Clean Jobs, создав видимый профиль, получая запросы на работы и находя клиентов, которым уже нужна помощь с уборкой в районе Гётеборга.",

    areasTitle: "Районы рядом с Гётеборгом, где уборщики могут найти работу",
    areasText:
      "Если вы ищете работу по уборке в Гётеборге, полезно включать соседние районы и коммуны для поездок. Многие клиенты живут за пределами центра, но им также нужна регулярная помощь с уборкой.",

    workersEyebrow: "Для работников",
    workersTitle: "Как получать больше работ по уборке в Гётеборге",
    workersText1:
      "Сильный профиль повышает ваши шансы. Добавьте имя, город, номер телефона, доступность и опыт уборки. Если вы работаете в компании, добавьте название компании и логотип, чтобы клиенты узнавали ваш бренд.",
    workersText2:
      "Укажите, можете ли работать вечером, по выходным или брать срочные работы. Также опишите, что вам больше подходит: уборка дома, офиса, после переезда или регулярные заказы.",

    clientsEyebrow: "Для клиентов",
    clientsTitle: "Как нанять уборщика в Гётеборге",
    clientsText1:
      "Если вам нужен уборщик в Гётеборге, создайте понятное объявление с городом, примерным районом адреса, типом уборки, датой, временем, бюджетом и описанием. Чёткие детали помогают уборщикам понять задачу и быстрее ответить.",
    clientsText2:
      "Clean Jobs создан для частных клиентов, работников и клининговых компаний. Вы можете опубликовать работу, получить интерес и продолжить разговор через страницу работы и чат.",

    ctaTitle: "Начните с работ по уборке в Гётеборге",
    ctaText:
      "Ищете работу по уборке или хотите нанять уборщика? Clean Jobs даёт вам специализированный маркетплейс для Гётеборга и соседних районов.",
    findJobs: "Найти работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaning Jobs in Gothenburg 2026 | Find Cleaner Work",
    metaDescription:
      "Find cleaning jobs in Gothenburg. Guide to home cleaning, office cleaning, move-out cleaning and cleaner jobs in Göteborg and nearby areas.",
    metaOgTitle: "Cleaning Jobs in Gothenburg | Clean Jobs",
    metaOgDescription:
      "Find cleaner work in Gothenburg or hire trusted cleaners for home cleaning, office cleaning and move-out cleaning.",
    metaOgAlt: "Cleaning jobs in Gothenburg",

    faqFindQuestion: "Where can I find cleaning jobs in Gothenburg?",
    faqFindAnswer:
      "You can find cleaning jobs in Gothenburg through cleaning companies, job boards, local networks and specialized platforms such as Clean Jobs.",
    faqCommonQuestion: "What cleaning jobs are common in Gothenburg?",
    faqCommonAnswer:
      "Common cleaning jobs in Gothenburg include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and recurring cleaning tasks.",
    faqCompaniesQuestion: "Can cleaning companies use Clean Jobs in Gothenburg?",
    faqCompaniesAnswer:
      "Yes. Cleaning companies can use Clean Jobs to become visible, find new clients and receive cleaning job requests in Gothenburg and nearby areas.",

    heroEyebrow: "Gothenburg",
    heroTitle:
      "Cleaning jobs in Gothenburg: find cleaner work or hire trusted cleaners",
    heroText:
      "Gothenburg is one of Sweden’s strongest service markets, with demand for home cleaning, apartment cleaning, office cleaning, move-out cleaning and recurring cleaning help. Clean Jobs helps cleaners, clients and cleaning companies connect in one focused marketplace.",
    browseJobs: "Browse Gothenburg jobs",
    postJob: "Post a cleaning job",

    overviewEyebrow: "Overview",
    overviewTitle: "Why Gothenburg is good for cleaning work",
    overviewText1:
      "Gothenburg has a large mix of apartments, private homes, offices, shops, restaurants and local businesses. This creates ongoing demand for cleaners who can work carefully, arrive on time and communicate clearly with clients.",
    overviewText2:
      "Cleaning jobs in Gothenburg can be one-time assignments or recurring work. For many workers, cleaning is a practical way to start earning money, build trust and connect with clients without needing a large personal network.",

    typesEyebrow: "Types of work",
    typesTitle: "Common cleaning jobs in Gothenburg",
    typesText1:
      "Common cleaning jobs include home cleaning, office cleaning, move-out cleaning, apartment cleaning, deep cleaning and recurring weekly or monthly cleaning. Clients often look for cleaners who can explain availability, travel areas and previous experience.",
    typesText2:
      "Cleaning companies can also benefit from Clean Jobs by creating a visible profile, receiving job requests and finding clients who already need cleaning help in the Gothenburg area.",

    areasTitle: "Areas near Gothenburg where cleaners can find work",
    areasText:
      "If you are searching for cleaning jobs in Gothenburg, it can help to include nearby areas and commuter municipalities. Many clients live outside the city center but still need regular cleaning help.",

    workersEyebrow: "For workers",
    workersTitle: "How to get more cleaning jobs in Gothenburg",
    workersText1:
      "A strong profile improves your chances. Add your name, city, phone number, availability and cleaning experience. If you work for a company, add the company name and logo so clients can recognize your brand.",
    workersText2:
      "Mention whether you can work evenings, weekends or short-notice jobs. Also describe whether you prefer home cleaning, office cleaning, move-out cleaning or recurring jobs.",

    clientsEyebrow: "For clients",
    clientsTitle: "How to hire a cleaner in Gothenburg",
    clientsText1:
      "If you need a cleaner in Gothenburg, create a clear job post with the city, approximate address area, cleaning type, date, time, budget and description. Clear job details help cleaners understand the task and respond faster.",
    clientsText2:
      "Clean Jobs is designed for private clients, workers and cleaning companies. You can post a job, receive interest and continue the conversation through the job page and chat.",

    ctaTitle: "Start with cleaning jobs in Gothenburg",
    ctaText:
      "Whether you are searching for cleaning work or need to hire a cleaner, Clean Jobs gives you a focused marketplace for Gothenburg and nearby areas.",
    findJobs: "Find jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Städjobb i Göteborg 2026 | Hitta städarbete",
    metaDescription:
      "Hitta städjobb i Göteborg. Guide till hemstädning, kontorsstädning, flyttstädning och jobb som städare i Göteborg och närliggande områden.",
    metaOgTitle: "Städjobb i Göteborg | Clean Jobs",
    metaOgDescription:
      "Hitta städarbete i Göteborg eller anlita pålitliga städare för hemstädning, kontorsstädning och flyttstädning.",
    metaOgAlt: "Städjobb i Göteborg",

    faqFindQuestion: "Var kan jag hitta städjobb i Göteborg?",
    faqFindAnswer:
      "Du kan hitta städjobb i Göteborg via städföretag, jobbsajter, lokala nätverk och specialiserade plattformar som Clean Jobs.",
    faqCommonQuestion: "Vilka städjobb är vanliga i Göteborg?",
    faqCommonAnswer:
      "Vanliga städjobb i Göteborg är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, storstädning och återkommande städuppdrag.",
    faqCompaniesQuestion: "Kan städföretag använda Clean Jobs i Göteborg?",
    faqCompaniesAnswer:
      "Ja. Städföretag kan använda Clean Jobs för att synas, hitta nya kunder och få förfrågningar om städjobb i Göteborg och närliggande områden.",

    heroEyebrow: "Göteborg",
    heroTitle:
      "Städjobb i Göteborg: hitta städarbete eller anlita pålitliga städare",
    heroText:
      "Göteborg är en av Sveriges starkaste servicemarknader, med efterfrågan på hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning och återkommande städhjälp. Clean Jobs hjälper städare, kunder och städföretag att mötas på en fokuserad marknadsplats.",
    browseJobs: "Bläddra bland jobb i Göteborg",
    postJob: "Lägg upp städjobb",

    overviewEyebrow: "Översikt",
    overviewTitle: "Varför Göteborg är bra för städarbete",
    overviewText1:
      "Göteborg har en stor blandning av lägenheter, privata hem, kontor, butiker, restauranger och lokala företag. Det skapar löpande efterfrågan på städare som arbetar noggrant, kommer i tid och kommunicerar tydligt med kunder.",
    overviewText2:
      "Städjobb i Göteborg kan vara engångsuppdrag eller återkommande arbete. För många arbetare är städning ett praktiskt sätt att börja tjäna pengar, bygga förtroende och hitta kunder utan ett stort personligt nätverk.",

    typesEyebrow: "Typer av arbete",
    typesTitle: "Vanliga städjobb i Göteborg",
    typesText1:
      "Vanliga städjobb är hemstädning, kontorsstädning, flyttstädning, lägenhetsstädning, storstädning och återkommande städning varje vecka eller månad. Kunder söker ofta städare som kan förklara tillgänglighet, arbetsområden och tidigare erfarenhet.",
    typesText2:
      "Städföretag kan också dra nytta av Clean Jobs genom att skapa en synlig profil, ta emot jobbförfrågningar och hitta kunder som redan behöver städhjälp i Göteborgsområdet.",

    areasTitle: "Områden nära Göteborg där städare kan hitta arbete",
    areasText:
      "Om du söker städjobb i Göteborg kan det hjälpa att inkludera närliggande områden och pendlingskommuner. Många kunder bor utanför centrum men behöver ändå regelbunden städhjälp.",

    workersEyebrow: "För arbetare",
    workersTitle: "Så får du fler städjobb i Göteborg",
    workersText1:
      "En stark profil förbättrar dina chanser. Lägg till namn, stad, telefonnummer, tillgänglighet och erfarenhet av städning. Om du arbetar för ett företag, lägg till företagsnamn och logotyp så att kunder känner igen ditt varumärke.",
    workersText2:
      "Nämn om du kan arbeta kvällar, helger eller med kort varsel. Beskriv också om du föredrar hemstädning, kontorsstädning, flyttstädning eller återkommande jobb.",

    clientsEyebrow: "För kunder",
    clientsTitle: "Så anlitar du städare i Göteborg",
    clientsText1:
      "Om du behöver en städare i Göteborg, skapa en tydlig jobbannons med stad, ungefärligt adressområde, typ av städning, datum, tid, budget och beskrivning. Tydliga detaljer hjälper städare att förstå uppdraget och svara snabbare.",
    clientsText2:
      "Clean Jobs är byggt för privatkunder, arbetare och städföretag. Du kan lägga upp ett jobb, få intresse och fortsätta konversationen via jobbsidan och chatten.",

    ctaTitle: "Börja med städjobb i Göteborg",
    ctaText:
      "Oavsett om du söker städarbete eller behöver anlita en städare ger Clean Jobs dig en fokuserad marknadsplats för Göteborg och närliggande områden.",
    findJobs: "Hitta jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Praca sprzątania w Göteborgu 2026 | Clean Jobs",
    metaDescription:
      "Znajdź prace sprzątania w Göteborgu. Poradnik o sprzątaniu domu, biura, po przeprowadzce i pracy jako sprzątacz w Göteborgu i okolicy.",
    metaOgTitle: "Praca sprzątania w Göteborgu | Clean Jobs",
    metaOgDescription:
      "Znajdź pracę jako sprzątacz w Göteborgu albo zatrudnij zaufanych sprzątaczy do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Praca sprzątania w Göteborgu",

    faqFindQuestion: "Gdzie znaleźć prace sprzątania w Göteborgu?",
    faqFindAnswer:
      "Prace sprzątania w Göteborgu można znaleźć przez firmy sprzątające, portale pracy, lokalne kontakty i wyspecjalizowane platformy takie jak Clean Jobs.",
    faqCommonQuestion: "Jakie prace sprzątania są popularne w Göteborgu?",
    faqCommonAnswer:
      "Popularne prace to sprzątanie domu, mieszkania, biura, po przeprowadzce, sprzątanie generalne i regularne zadania sprzątania.",
    faqCompaniesQuestion: "Czy firmy sprzątające mogą używać Clean Jobs w Göteborgu?",
    faqCompaniesAnswer:
      "Tak. Firmy sprzątające mogą używać Clean Jobs, aby stać się widoczne, znaleźć nowych klientów i otrzymywać zapytania o sprzątanie w Göteborgu i okolicy.",

    heroEyebrow: "Göteborg",
    heroTitle:
      "Prace sprzątania w Göteborgu: znajdź pracę albo zatrudnij zaufanych sprzątaczy",
    heroText:
      "Göteborg jest jednym z najsilniejszych rynków usług w Szwecji, z popytem na sprzątanie domu, mieszkań, biur, po przeprowadzce i regularną pomoc w sprzątaniu. Clean Jobs pomaga sprzątaczom, klientom i firmom sprzątającym łączyć się w jednym marketplace.",
    browseJobs: "Przeglądaj prace w Göteborgu",
    postJob: "Dodaj pracę sprzątania",

    overviewEyebrow: "Przegląd",
    overviewTitle: "Dlaczego Göteborg jest dobry dla pracy sprzątania",
    overviewText1:
      "Göteborg ma dużą mieszankę mieszkań, prywatnych domów, biur, sklepów, restauracji i lokalnych firm. To tworzy stały popyt na sprzątaczy, którzy pracują dokładnie, przychodzą na czas i jasno komunikują się z klientami.",
    overviewText2:
      "Prace sprzątania w Göteborgu mogą być jednorazowe albo regularne. Dla wielu pracowników sprzątanie jest praktycznym sposobem na rozpoczęcie zarabiania, budowanie zaufania i kontakt z klientami bez dużej sieci znajomości.",

    typesEyebrow: "Typy pracy",
    typesTitle: "Popularne prace sprzątania w Göteborgu",
    typesText1:
      "Popularne prace obejmują sprzątanie domu, biura, po przeprowadzce, mieszkania, sprzątanie generalne i regularne sprzątanie co tydzień lub co miesiąc. Klienci często szukają sprzątaczy, którzy potrafią wyjaśnić dostępność, obszary dojazdu i wcześniejsze doświadczenie.",
    typesText2:
      "Firmy sprzątające również mogą skorzystać z Clean Jobs, tworząc widoczny profil, otrzymując zapytania o prace i znajdując klientów, którzy już potrzebują pomocy w sprzątaniu w okolicy Göteborga.",

    areasTitle: "Obszary w pobliżu Göteborga, gdzie sprzątacze mogą znaleźć pracę",
    areasText:
      "Jeśli szukasz prac sprzątania w Göteborgu, warto uwzględnić pobliskie obszary i gminy dojazdowe. Wielu klientów mieszka poza centrum, ale nadal potrzebuje regularnej pomocy w sprzątaniu.",

    workersEyebrow: "Dla pracowników",
    workersTitle: "Jak zdobyć więcej prac sprzątania w Göteborgu",
    workersText1:
      "Silny profil zwiększa Twoje szanse. Dodaj imię, miasto, numer telefonu, dostępność i doświadczenie w sprzątaniu. Jeśli pracujesz dla firmy, dodaj nazwę firmy i logo, aby klienci rozpoznawali markę.",
    workersText2:
      "Napisz, czy możesz pracować wieczorami, w weekendy albo przy pilnych zleceniach. Opisz też, czy wolisz sprzątanie domu, biura, po przeprowadzce czy regularne prace.",

    clientsEyebrow: "Dla klientów",
    clientsTitle: "Jak zatrudnić sprzątacza w Göteborgu",
    clientsText1:
      "Jeśli potrzebujesz sprzątacza w Göteborgu, utwórz jasne ogłoszenie z miastem, przybliżonym obszarem adresu, typem sprzątania, datą, godziną, budżetem i opisem. Jasne szczegóły pomagają sprzątaczom zrozumieć zadanie i szybciej odpowiedzieć.",
    clientsText2:
      "Clean Jobs jest stworzony dla klientów prywatnych, pracowników i firm sprzątających. Możesz dodać pracę, otrzymać zainteresowanie i kontynuować rozmowę przez stronę pracy oraz czat.",

    ctaTitle: "Zacznij od prac sprzątania w Göteborgu",
    ctaText:
      "Niezależnie od tego, czy szukasz pracy sprzątania, czy chcesz zatrudnić sprzątacza, Clean Jobs daje Ci wyspecjalizowany marketplace dla Göteborga i pobliskich obszarów.",
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
      canonical: "/cleaning-jobs-gothenburg",
    },
    keywords: [
      "cleaning jobs Gothenburg",
      "cleaning jobs Göteborg",
      "cleaner jobs Gothenburg",
      "cleaner jobs Göteborg",
      "home cleaning jobs Gothenburg",
      "office cleaning jobs Gothenburg",
      "move out cleaning Gothenburg",
      "part time cleaning jobs Gothenburg",
      "cleaning work Gothenburg",
      "hire cleaner Gothenburg",
      "Gothenburg cleaning marketplace",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/cleaning-jobs-gothenburg`,
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

export default async function CleaningJobsGothenburgPage() {
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
              href="/jobs?city=Göteborg"
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
                href="/jobs?city=Göteborg"
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

        <RelatedGuides currentPath="/cleaning-jobs-gothenburg" />
      </main>
    </div>
  )
}