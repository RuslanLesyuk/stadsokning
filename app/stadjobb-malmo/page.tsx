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
    metaTitle: "Робота з прибирання в Мальме 2026 | Clean Jobs",
    metaDescription:
      "Знайдіть роботу з прибирання в Мальме. Гід по прибиранню дому, офісу, після переїзду, підробітку та роботі прибиральником.",
    metaOgTitle: "Робота з прибирання в Мальме | Clean Jobs",
    metaOgDescription:
      "Знайдіть роботу прибиральником у Мальме або найміть прибиральника для дому, офісу чи прибирання після переїзду.",
    metaOgAlt: "Робота з прибирання в Мальме",

    faqOneQuestion: "Як знайти роботу з прибирання в Мальме?",
    faqOneAnswer:
      "Роботу з прибирання в Мальме можна знайти через клінінгові компанії, локальні контакти, сайти вакансій і нішеві платформи, такі як Clean Jobs.",
    faqTwoQuestion: "Які типи робіт з прибирання є в Мальме?",
    faqTwoAnswer:
      "Поширені роботи — прибирання дому, офісу, після переїзду, генеральне прибирання та регулярні замовлення.",
    faqThreeQuestion: "Чи можна знайти роботу з прибирання без ідеальної шведської?",
    faqThreeAnswer:
      "Так, деякі роботи з прибирання не потребують ідеальної шведської. Надійність, пунктуальність і чітка комунікація часто важливіші.",

    heroEyebrow: "Робота з прибирання в Мальме",
    heroTitle:
      "Робота з прибирання в Мальме: знайдіть роботу або найміть допомогу",
    heroText:
      "У Мальме є багато можливостей для прибиральників, клінінгових компаній і людей, які шукають підробіток або часткову зайнятість у прибиранні. Clean Jobs допомагає простіше знаходити прибирання дому, офісу, після переїзду та регулярні замовлення.",
    findJobs: "Знайти роботи з прибирання",
    postJob: "Опублікувати роботу з прибирання",

    guideEyebrow: "Гід",
    guideTitle: "Що означає робота з прибирання в Мальме?",
    guideText1:
      "Робота з прибирання в Мальме може бути коротким завданням у приватному домі, регулярним прибиранням дому, офісу, після переїзду або допомогою після ремонту. Деяким клієнтам потрібна одноразова допомога, інші шукають людину для постійної роботи.",
    guideText2:
      "Для працівників важливо показати, у яких районах вони можуть працювати, який тип прибирання можуть виконувати та коли доступні. Чітка інформація допомагає клієнтам швидше вибрати правильного прибиральника.",

    stepOneTitle: "Створіть профіль",
    stepOneText:
      "Додайте ім’я, місто, номер телефону, досвід і, якщо можливо, фото або логотип компанії.",
    stepTwoTitle: "Шукайте завдання",
    stepTwoText:
      "Переглядайте роботи з прибирання в Мальме та вибирайте ті, що підходять за часом і місцем.",
    stepThreeTitle: "Будуйте довіру",
    stepThreeText:
      "Відповідайте швидко, приходьте вчасно та виконуйте роботу якісно, щоб отримувати більше можливостей.",

    typesEyebrow: "Типи робіт",
    typesTitle: "Поширені роботи з прибирання в Мальме",
    typesText1:
      "Поширені завдання — прибирання дому, квартири, офісу, після переїзду, генеральне та регулярне прибирання. Клієнти часто шукають людину, яка надійна, гнучка та легко комунікує.",
    typesText2:
      "Клінінгові компанії можуть використовувати Clean Jobs, щоб бути видимими, знаходити нові завдання та контактувати з людьми й компаніями, яким уже потрібна допомога з прибиранням.",

    areasEyebrow: "Райони",
    areasTitle: "Шукайте роботи з прибирання в Мальме та поруч",
    areasText1:
      "Можливості є як у центрі Мальме, так і в районах Limhamn, Hyllie, Västra Hamnen, Rosengård, Lund, Trelleborg, Staffanstorp, Burlöv, Lomma і Vellinge. Якщо ви можете їздити між кількома районами, шанси знайти завдання зростають.",
    areasText2:
      "Коли створюєте профіль, напишіть, у яких районах можете працювати, чи можете брати вечірні, вихідні або термінові завдання.",

    clientsEyebrow: "Для клієнтів",
    clientsTitle: "Як знайти правильного прибиральника в Мальме",
    clientsText1:
      "Якщо вам потрібна допомога з прибиранням, опишіть розмір житла, тип прибирання, бажану дату, бюджет і чи є засоби для прибирання. Чіткі дані допомагають правильному прибиральнику або компанії відповісти швидше.",
    clientsText2:
      "Clean Jobs створений, щоб спростити контакт між клієнтами, прибиральниками та клінінговими компаніями. Ви можете опублікувати роботу й продовжити розмову через платформу.",

    ctaTitle: "Почніть знаходити роботи з прибирання в Мальме",
    ctaText:
      "Clean Jobs допомагає працівникам, клієнтам і клінінговим компаніям швидше знаходити одне одного. Створіть акаунт або почніть із перегляду доступних завдань.",
    seeJobs: "Переглянути роботи з прибирання",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Работа по уборке в Мальмё 2026 | Clean Jobs",
    metaDescription:
      "Найдите работу по уборке в Мальмё. Гид по уборке дома, офиса, после переезда, подработке и работе уборщиком.",
    metaOgTitle: "Работа по уборке в Мальмё | Clean Jobs",
    metaOgDescription:
      "Найдите работу уборщиком в Мальмё или наймите уборщика для дома, офиса и уборки после переезда.",
    metaOgAlt: "Работа по уборке в Мальмё",

    faqOneQuestion: "Как найти работу по уборке в Мальмё?",
    faqOneAnswer:
      "Работу по уборке в Мальмё можно найти через клининговые компании, локальные контакты, сайты вакансий и нишевые платформы, такие как Clean Jobs.",
    faqTwoQuestion: "Какие типы работ по уборке есть в Мальмё?",
    faqTwoAnswer:
      "Распространённые работы — уборка дома, офиса, после переезда, генеральная уборка и регулярные задания.",
    faqThreeQuestion: "Можно ли найти работу по уборке без идеального шведского?",
    faqThreeAnswer:
      "Да, некоторые работы по уборке не требуют идеального шведского. Надёжность, пунктуальность и понятная коммуникация часто важнее.",

    heroEyebrow: "Работа по уборке в Мальмё",
    heroTitle:
      "Работа по уборке в Мальмё: найдите работу или наймите помощь",
    heroText:
      "В Мальмё есть много возможностей для уборщиков, клининговых компаний и людей, которые ищут подработку или частичную занятость в уборке. Clean Jobs помогает проще находить уборку дома, офиса, после переезда и регулярные задания.",
    findJobs: "Найти работы по уборке",
    postJob: "Опубликовать работу по уборке",

    guideEyebrow: "Гид",
    guideTitle: "Что означает работа по уборке в Мальмё?",
    guideText1:
      "Работа по уборке в Мальмё может быть коротким заданием в частном доме, регулярной уборкой дома, офиса, после переезда или помощью после ремонта. Некоторым клиентам нужна разовая помощь, другие ищут человека для постоянной работы.",
    guideText2:
      "Для работников важно показать, в каких районах они могут работать, какой тип уборки могут выполнять и когда доступны. Чёткая информация помогает клиентам быстрее выбрать подходящего уборщика.",

    stepOneTitle: "Создайте профиль",
    stepOneText:
      "Добавьте имя, город, номер телефона, опыт и, если возможно, фото или логотип компании.",
    stepTwoTitle: "Ищите задания",
    stepTwoText:
      "Просматривайте работы по уборке в Мальмё и выбирайте те, которые подходят по времени и месту.",
    stepThreeTitle: "Стройте доверие",
    stepThreeText:
      "Отвечайте быстро, приходите вовремя и выполняйте работу качественно, чтобы получать больше возможностей.",

    typesEyebrow: "Типы работ",
    typesTitle: "Распространённые работы по уборке в Мальмё",
    typesText1:
      "Распространённые задания — уборка дома, квартиры, офиса, после переезда, генеральная и регулярная уборка. Клиенты часто ищут человека, который надёжен, гибок и легко общается.",
    typesText2:
      "Клининговые компании могут использовать Clean Jobs, чтобы быть видимыми, находить новые задания и контактировать с людьми и компаниями, которым уже нужна помощь с уборкой.",

    areasEyebrow: "Районы",
    areasTitle: "Ищите работы по уборке в Мальмё и рядом",
    areasText1:
      "Возможности есть как в центре Мальмё, так и в районах Limhamn, Hyllie, Västra Hamnen, Rosengård, Lund, Trelleborg, Staffanstorp, Burlöv, Lomma и Vellinge. Если вы можете ездить между несколькими районами, шансы найти задания растут.",
    areasText2:
      "Когда создаёте профиль, напишите, в каких районах можете работать, можете ли брать вечерние, выходные или срочные задания.",

    clientsEyebrow: "Для клиентов",
    clientsTitle: "Как найти подходящего уборщика в Мальмё",
    clientsText1:
      "Если вам нужна помощь с уборкой, опишите размер жилья, тип уборки, желаемую дату, бюджет и есть ли средства для уборки. Чёткие данные помогают подходящему уборщику или компании ответить быстрее.",
    clientsText2:
      "Clean Jobs создан, чтобы упростить контакт между клиентами, уборщиками и клининговыми компаниями. Вы можете опубликовать работу и продолжить разговор через платформу.",

    ctaTitle: "Начните находить работы по уборке в Мальмё",
    ctaText:
      "Clean Jobs помогает работникам, клиентам и клининговым компаниям быстрее находить друг друга. Создайте аккаунт или начните с просмотра доступных заданий.",
    seeJobs: "Смотреть работы по уборке",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaning Jobs Malmö 2026 | Find Cleaner Work",
    metaDescription:
      "Find cleaning jobs in Malmö. Guide to home cleaning, office cleaning, move-out cleaning, extra work and cleaner jobs in Malmö.",
    metaOgTitle: "Cleaning Jobs Malmö | Clean Jobs",
    metaOgDescription:
      "Find cleaning jobs in Malmö or hire cleaners for home cleaning, office cleaning and move-out cleaning.",
    metaOgAlt: "Cleaning Jobs Malmö",

    faqOneQuestion: "How do I find cleaning jobs in Malmö?",
    faqOneAnswer:
      "You can find cleaning jobs in Malmö through cleaning companies, local contacts, job sites and niche platforms such as Clean Jobs.",
    faqTwoQuestion: "What types of cleaning jobs are available in Malmö?",
    faqTwoAnswer:
      "Common cleaning jobs in Malmö include home cleaning, office cleaning, move-out cleaning, deep cleaning and recurring cleaning assignments.",
    faqThreeQuestion: "Can I find cleaning jobs without perfect Swedish?",
    faqThreeAnswer:
      "Yes, some cleaning jobs do not require perfect Swedish. Reliability, punctuality and clear communication are often most important.",

    heroEyebrow: "Cleaning jobs Malmö",
    heroTitle:
      "Cleaning jobs in Malmö: find cleaner work or hire cleaning help",
    heroText:
      "Malmö has many opportunities for cleaners, cleaning companies and people looking for extra work or part-time work in cleaning. Clean Jobs makes it easier to find home cleaning, office cleaning, move-out cleaning and recurring assignments.",
    findJobs: "Find cleaning jobs",
    postJob: "Post cleaning job",

    guideEyebrow: "Guide",
    guideTitle: "What do cleaning jobs in Malmö include?",
    guideText1:
      "Cleaning jobs in Malmö can be short assignments in private homes, regular home cleaning, office cleaning, move-out cleaning or help after renovation. Some clients need help once, while others are looking for someone for recurring work.",
    guideText2:
      "For workers, it is important to show which areas you can work in, what type of cleaning you can do and when you are available. Clear information makes it easier for clients to choose the right cleaner.",

    stepOneTitle: "Create profile",
    stepOneText:
      "Add name, city, phone number, experience and preferably a photo or company logo.",
    stepTwoTitle: "Find assignments",
    stepTwoText:
      "Browse cleaning jobs in Malmö and choose assignments that fit your time and location.",
    stepThreeTitle: "Build trust",
    stepThreeText:
      "Reply quickly, arrive on time and do careful work to get more opportunities.",

    typesEyebrow: "Work types",
    typesTitle: "Common cleaning jobs in Malmö",
    typesText1:
      "Common assignments include home cleaning, apartment cleaning, office cleaning, move-out cleaning, deep cleaning and recurring cleaning. Clients often look for someone reliable, flexible and easy to communicate with.",
    typesText2:
      "Cleaning companies can use Clean Jobs to become more visible, find new assignments and contact people and companies that already need cleaning help.",

    areasEyebrow: "Areas",
    areasTitle: "Search cleaning jobs in Malmö and nearby areas",
    areasText1:
      "There are opportunities both in central Malmö and in areas such as Limhamn, Hyllie, Västra Hamnen, Rosengård, Lund, Trelleborg, Staffanstorp, Burlöv, Lomma and Vellinge. If you can travel between several areas, your chances of finding assignments increase.",
    areasText2:
      "When creating a profile, write which areas you can work in and whether you can take evening jobs, weekend jobs or short-notice assignments.",

    clientsEyebrow: "For clients",
    clientsTitle: "How to find the right cleaner in Malmö",
    clientsText1:
      "If you need cleaning help, describe the home size, cleaning type, preferred date, budget and whether cleaning materials are available. Clear information helps the right cleaner or cleaning company answer faster.",
    clientsText2:
      "Clean Jobs is built to make contact easier between clients, cleaners and cleaning companies. You can post a job and continue the conversation through the platform.",

    ctaTitle: "Start finding cleaning jobs in Malmö",
    ctaText:
      "Clean Jobs helps workers, clients and cleaning companies find each other faster. Create an account or start by viewing available assignments.",
    seeJobs: "See cleaning jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Städjobb Malmö 2026 | Hitta jobb som städare",
    metaDescription:
      "Hitta städjobb i Malmö. Guide till hemstädning, kontorsstädning, flyttstädning, extrajobb och arbete som städare i Malmö.",
    metaOgTitle: "Städjobb Malmö | Clean Jobs",
    metaOgDescription:
      "Hitta städjobb i Malmö eller anlita städare för hemstädning, kontorsstädning och flyttstädning.",
    metaOgAlt: "Städjobb Malmö",

    faqOneQuestion: "Hur hittar jag städjobb i Malmö?",
    faqOneAnswer:
      "Du kan hitta städjobb i Malmö genom städfirmor, lokala kontakter, jobbsidor och nischade plattformar som Clean Jobs.",
    faqTwoQuestion: "Vilka typer av städjobb finns i Malmö?",
    faqTwoAnswer:
      "Vanliga städjobb i Malmö är hemstädning, kontorsstädning, flyttstädning, storstädning och återkommande städuppdrag.",
    faqThreeQuestion: "Kan jag hitta städjobb utan perfekt svenska?",
    faqThreeAnswer:
      "Ja, vissa städjobb kräver inte perfekt svenska. Pålitlighet, punktlighet och tydlig kommunikation är ofta viktigast.",

    heroEyebrow: "Städjobb Malmö",
    heroTitle:
      "Städjobb i Malmö: hitta arbete som städare eller anlita städhjälp",
    heroText:
      "Malmö har många möjligheter för städare, städfirmor och personer som söker extrajobb eller deltidsjobb inom städning. Clean Jobs gör det enklare att hitta hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag.",
    findJobs: "Hitta städjobb",
    postJob: "Lägg upp städjobb",

    guideEyebrow: "Guide",
    guideTitle: "Vad innebär städjobb i Malmö?",
    guideText1:
      "Städjobb i Malmö kan vara korta uppdrag i privata hem, regelbunden hemstädning, kontorsstädning, flyttstädning eller hjälp efter renovering. Vissa kunder behöver hjälp en gång, medan andra söker någon för återkommande arbete.",
    guideText2:
      "För arbetare är det viktigt att visa vilka områden man kan arbeta i, vilken typ av städning man kan utföra och när man är tillgänglig. Tydlig information gör det enklare för kunder att välja rätt städare.",

    stepOneTitle: "Skapa profil",
    stepOneText:
      "Lägg till namn, stad, telefonnummer, erfarenhet och gärna bild eller företagslogotyp.",
    stepTwoTitle: "Sök uppdrag",
    stepTwoText:
      "Bläddra bland städjobb i Malmö och välj uppdrag som passar din tid och plats.",
    stepThreeTitle: "Bygg förtroende",
    stepThreeText:
      "Svara snabbt, kom i tid och gör ett noggrant jobb för att få fler möjligheter.",

    typesEyebrow: "Arbetstyper",
    typesTitle: "Vanliga städjobb i Malmö",
    typesText1:
      "Vanliga uppdrag är hemstädning, lägenhetsstädning, kontorsstädning, flyttstädning, storstädning och återkommande städning. Kunder letar ofta efter någon som är pålitlig, flexibel och lätt att kommunicera med.",
    typesText2:
      "Städfirmor kan använda Clean Jobs för att synas bättre, hitta nya uppdrag och få kontakt med personer och företag som redan behöver städhjälp.",

    areasEyebrow: "Områden",
    areasTitle: "Sök städjobb i Malmö med omnejd",
    areasText1:
      "Det finns möjligheter både i centrala Malmö och i områden som Limhamn, Hyllie, Västra Hamnen, Rosengård, Lund, Trelleborg, Staffanstorp, Burlöv, Lomma och Vellinge. Om du kan resa mellan flera områden ökar dina chanser att hitta uppdrag.",
    areasText2:
      "När du skapar profil är det bra att skriva vilka områden du kan arbeta i och om du kan ta kvällsjobb, helgjobb eller uppdrag med kort varsel.",

    clientsEyebrow: "För kunder",
    clientsTitle: "Så hittar du rätt städare i Malmö",
    clientsText1:
      "Om du behöver städhjälp bör du beskriva bostadens storlek, typ av städning, önskat datum, budget och om städmaterial finns. Tydliga uppgifter gör att rätt städare eller städfirma kan svara snabbare.",
    clientsText2:
      "Clean Jobs är byggt för att göra kontakten enklare mellan kunder, städare och städfirmor. Du kan lägga upp ett jobb och fortsätta konversationen via plattformen.",

    ctaTitle: "Börja hitta städjobb i Malmö",
    ctaText:
      "Clean Jobs hjälper arbetare, kunder och städfirmor att hitta varandra snabbare. Skapa konto eller börja med att se lediga uppdrag.",
    seeJobs: "Se städjobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Prace sprzątania Malmö 2026 | Clean Jobs",
    metaDescription:
      "Znajdź prace sprzątania w Malmö. Poradnik o sprzątaniu domu, biura, po przeprowadzce, pracy dodatkowej i pracy jako sprzątacz.",
    metaOgTitle: "Prace sprzątania Malmö | Clean Jobs",
    metaOgDescription:
      "Znajdź prace sprzątania w Malmö albo zatrudnij sprzątacza do domu, biura i sprzątania po przeprowadzce.",
    metaOgAlt: "Prace sprzątania Malmö",

    faqOneQuestion: "Jak znaleźć prace sprzątania w Malmö?",
    faqOneAnswer:
      "Prace sprzątania w Malmö można znaleźć przez firmy sprzątające, lokalne kontakty, portale pracy i niszowe platformy takie jak Clean Jobs.",
    faqTwoQuestion: "Jakie typy prac sprzątania są w Malmö?",
    faqTwoAnswer:
      "Popularne prace to sprzątanie domu, biura, po przeprowadzce, sprzątanie generalne i regularne zlecenia.",
    faqThreeQuestion: "Czy można znaleźć prace sprzątania bez perfekcyjnego szwedzkiego?",
    faqThreeAnswer:
      "Tak, niektóre prace sprzątania nie wymagają perfekcyjnego szwedzkiego. Niezawodność, punktualność i jasna komunikacja są często najważniejsze.",

    heroEyebrow: "Prace sprzątania Malmö",
    heroTitle:
      "Prace sprzątania w Malmö: znajdź pracę albo zatrudnij pomoc",
    heroText:
      "Malmö ma wiele możliwości dla sprzątaczy, firm sprzątających i osób szukających pracy dodatkowej lub części etatu w sprzątaniu. Clean Jobs ułatwia znajdowanie sprzątania domu, biura, po przeprowadzce i regularnych zleceń.",
    findJobs: "Znajdź prace sprzątania",
    postJob: "Dodaj pracę sprzątania",

    guideEyebrow: "Poradnik",
    guideTitle: "Co oznaczają prace sprzątania w Malmö?",
    guideText1:
      "Prace sprzątania w Malmö mogą być krótkimi zleceniami w prywatnych domach, regularnym sprzątaniem domu, biura, po przeprowadzce albo pomocą po remoncie. Niektórzy klienci potrzebują jednorazowej pomocy, inni szukają osoby do stałej pracy.",
    guideText2:
      "Dla pracowników ważne jest pokazanie, w jakich obszarach mogą pracować, jaki typ sprzątania wykonują i kiedy są dostępni. Jasne informacje pomagają klientom szybciej wybrać właściwego sprzątacza.",

    stepOneTitle: "Utwórz profil",
    stepOneText:
      "Dodaj imię, miasto, numer telefonu, doświadczenie i najlepiej zdjęcie albo logo firmy.",
    stepTwoTitle: "Szukaj zleceń",
    stepTwoText:
      "Przeglądaj prace sprzątania w Malmö i wybieraj zlecenia pasujące do Twojego czasu i miejsca.",
    stepThreeTitle: "Buduj zaufanie",
    stepThreeText:
      "Odpowiadaj szybko, przychodź punktualnie i wykonuj dokładną pracę, aby mieć więcej możliwości.",

    typesEyebrow: "Typy pracy",
    typesTitle: "Popularne prace sprzątania w Malmö",
    typesText1:
      "Popularne zlecenia to sprzątanie domu, mieszkania, biura, po przeprowadzce, sprzątanie generalne i regularne. Klienci często szukają osoby niezawodnej, elastycznej i łatwej w komunikacji.",
    typesText2:
      "Firmy sprzątające mogą używać Clean Jobs, aby być bardziej widoczne, znajdować nowe zlecenia i kontaktować się z osobami oraz firmami, które już potrzebują pomocy w sprzątaniu.",

    areasEyebrow: "Obszary",
    areasTitle: "Szukaj prac sprzątania w Malmö i okolicy",
    areasText1:
      "Możliwości są zarówno w centrum Malmö, jak i w obszarach takich jak Limhamn, Hyllie, Västra Hamnen, Rosengård, Lund, Trelleborg, Staffanstorp, Burlöv, Lomma i Vellinge. Jeśli możesz dojeżdżać między kilkoma obszarami, zwiększasz szanse na zlecenia.",
    areasText2:
      "Tworząc profil, warto napisać, w jakich obszarach możesz pracować i czy możesz brać prace wieczorne, weekendowe albo pilne zlecenia.",

    clientsEyebrow: "Dla klientów",
    clientsTitle: "Jak znaleźć właściwego sprzątacza w Malmö",
    clientsText1:
      "Jeśli potrzebujesz pomocy w sprzątaniu, opisz wielkość mieszkania, typ sprzątania, preferowaną datę, budżet i czy środki czystości są dostępne. Jasne informacje pomagają właściwemu sprzątaczowi lub firmie odpowiedzieć szybciej.",
    clientsText2:
      "Clean Jobs został stworzony, aby ułatwić kontakt między klientami, sprzątaczami i firmami sprzątającymi. Możesz dodać pracę i kontynuować rozmowę przez platformę.",

    ctaTitle: "Zacznij znajdować prace sprzątania w Malmö",
    ctaText:
      "Clean Jobs pomaga pracownikom, klientom i firmom sprzątającym szybciej znaleźć się nawzajem. Utwórz konto albo zacznij od przeglądania dostępnych zleceń.",
    seeJobs: "Zobacz prace sprzątania",
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
      canonical: "/stadjobb-malmo",
    },
    keywords: [
      "städjobb Malmö",
      "städjobb Malmo",
      "städare jobb Malmö",
      "hemstädning jobb Malmö",
      "kontorsstädning jobb Malmö",
      "flyttstädning jobb Malmö",
      "extrajobb städning Malmö",
      "deltidsjobb städning Malmö",
      "städfirma Malmö jobb",
      "jobb som städare Malmö",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/stadjobb-malmo`,
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
        name: t.faqOneQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqOneAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqTwoQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqTwoAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqThreeQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqThreeAnswer,
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

function StepCard({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-sm font-semibold text-white">
        {number}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function StadjobbMalmoPage() {
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
              {t.findJobs}
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
          <Section eyebrow={t.guideEyebrow} title={t.guideTitle}>
            <p>{t.guideText1}</p>
            <p>{t.guideText2}</p>
          </Section>

          <section className="grid gap-5 md:grid-cols-3">
            <StepCard number="1" title={t.stepOneTitle} text={t.stepOneText} />
            <StepCard number="2" title={t.stepTwoTitle} text={t.stepTwoText} />
            <StepCard
              number="3"
              title={t.stepThreeTitle}
              text={t.stepThreeText}
            />
          </section>

          <Section eyebrow={t.typesEyebrow} title={t.typesTitle}>
            <p>{t.typesText1}</p>
            <p>{t.typesText2}</p>
          </Section>

          <Section eyebrow={t.areasEyebrow} title={t.areasTitle}>
            <p>{t.areasText1}</p>
            <p>{t.areasText2}</p>
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
                {t.seeJobs}
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

          <RelatedGuides currentPath="/stadjobb-malmo" />
        </div>
      </main>
    </div>
  )
}