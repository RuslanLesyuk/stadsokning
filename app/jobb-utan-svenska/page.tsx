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
    metaTitle: "Робота без шведської 2026 | Знайти роботу у Швеції",
    metaDescription:
      "Гід по роботі без ідеальної шведської. Дізнайтеся про клінінг, сервіс, підробіток і як знайти роботу у Швеції, поки ви вчите мову.",
    metaOgTitle: "Робота без шведської | Clean Jobs",
    metaOgDescription:
      "Практичний гід для тих, хто шукає роботу у Швеції, але ще не говорить шведською вільно.",
    metaOgAlt: "Робота без шведської",

    faqOneQuestion: "Чи можна отримати роботу у Швеції без вільної шведської?",
    faqOneAnswer:
      "Так, деякі роботи не вимагають вільної шведської. Клінінг, склад, ресторан, готель і деякі сервісні роботи іноді можуть підходити з англійською або базовою шведською.",
    faqTwoQuestion: "Які роботи можуть підходити без ідеальної шведської?",
    faqTwoAnswer:
      "Клінінг, прибирання дому, офісу, після переїзду, склад, миття посуду, готельне прибирання та прості сервісні роботи можуть бути можливими варіантами.",
    faqThreeQuestion: "Чи може Clean Jobs допомогти знайти роботу з прибирання?",
    faqThreeAnswer:
      "Так. Clean Jobs — це маркетплейс, де працівники можуть знаходити роботи з прибирання, а клієнти або клінінгові компанії можуть знаходити людей для роботи.",

    heroEyebrow: "Робота без шведської",
    heroTitle: "Робота без шведської: знайдіть роботу у Швеції, поки вчите мову",
    heroText:
      "Знайти роботу у Швеції може бути складно, якщо ви ще не говорите шведською вільно. Але є практичні шляхи на ринок праці. Клінінг, сервіс, готелі, ресторани, склади та деякі прості завдання іноді можливі з англійською, базовою шведською або чіткими інструкціями.",
    seeCleaningJobs: "Переглянути роботи з прибирання",
    createProfile: "Створити профіль",

    startEyebrow: "Старт",
    startTitle: "Чи можна отримати роботу без вільної шведської?",
    startText1:
      "Так, деякі роботи можна знайти без вільної шведської. Це залежить від завдання, роботодавця та того, скільки контакту з клієнтами потребує робота.",
    startText2:
      "Це не означає, що шведська неважлива. Вивчення шведської значно підвищує ваші шанси. Але не завжди потрібно чекати ідеального рівня, щоб почати шукати практичну роботу.",

    tipCleaningTitle: "Клінінг",
    tipCleaningText:
      "Прибирання дому, офісу та після переїзду іноді можливі з простою комунікацією.",
    tipWarehouseTitle: "Склад",
    tipWarehouseText:
      "Деякі складські роботи базуються на чітких рутинах і можуть підходити, якщо ви можете виконувати інструкції.",
    tipRestaurantTitle: "Ресторан",
    tipRestaurantText:
      "Миття посуду, допомога на кухні та прості сервісні завдання можуть бути першою роботою.",
    tipHotelTitle: "Готель",
    tipHotelText:
      "Готельне прибирання та сервісна робота можуть бути варіантом у великих містах.",

    cleaningEyebrow: "Прибирання",
    cleaningTitle: "Чому робота з прибирання може бути хорошим першим кроком",
    cleaningText1:
      "Роботи з прибирання часто практичні та зрозумілі. Клієнту потрібна допомога з конкретним завданням: прибирання дому, офісу, квартири, після переїзду або регулярне прибирання.",
    cleaningText2:
      "Clean Jobs фокусується саме на роботах з прибирання, бо попит є в багатьох містах. Платформа допомагає працівникам, клієнтам і клінінговим компаніям знаходити одне одного.",

    profileEyebrow: "Профіль",
    profileTitle: "Як підвищити свої шанси",
    profileText1:
      "Створіть чіткий профіль із вашим ім’ям, містом, телефоном, досвідом і доступністю. Напишіть, які роботи можете виконувати: прибирання дому, офісу, після переїзду, вечорами, у вихідні або регулярні замовлення.",
    profileText2:
      "Відповідайте швидко, коли хтось контактує з вами. Чесно вкажіть рівень мови й напишіть, що можете спілкуватися англійською або простою шведською.",

    citiesEyebrow: "Міста",
    citiesTitle: "Де найбільше робіт без ідеальної шведської?",
    citiesText1:
      "Найбільше можливостей часто є в Стокгольмі, Гетеборзі та Мальме, але Уппсала, Вестерос, Еребру, Гельсінборг, Лунд, Лінчепінг та інші великі міста також можуть мати багато сервісних і клінінгових робіт.",
    citiesText2:
      "Якщо ви можете їздити в сусідні комуни, у вас буде більше можливостей. Багато робіт з прибирання є не лише в центрі, а й у житлових районах, офісах і малих компаніях.",

    languageEyebrow: "Мова",
    languageTitle: "Продовжуйте вчити шведську паралельно",
    languageText1:
      "Навіть якщо ви можете знайти деякі роботи без вільної шведської, продовжуйте вчити мову. Шведська допомагає краще розуміти договори, інструкції, безпеку, клієнтів і роботодавців.",
    languageText2:
      "Хороша стратегія — працювати, збирати досвід і одночасно вивчати шведську. Кожен робочий день також може бути практикою мови.",

    ctaTitle: "Почніть із робіт з прибирання на Clean Jobs",
    ctaText:
      "Якщо ви шукаєте роботу без ідеальної шведської, клінінг може бути практичним першим кроком. Створіть профіль, покажіть доступність і почніть шукати завдання поруч.",
    seeJobs: "Переглянути роботи",
    readGuide: "Читати гід по роботі",
  },
  ru: {
    metaTitle: "Работа без шведского 2026 | Найти работу в Швеции",
    metaDescription:
      "Гид по работе без идеального шведского. Узнайте о клининге, сервисе, подработке и как найти работу в Швеции, пока вы учите язык.",
    metaOgTitle: "Работа без шведского | Clean Jobs",
    metaOgDescription:
      "Практический гид для тех, кто ищет работу в Швеции, но ещё не говорит свободно по-шведски.",
    metaOgAlt: "Работа без шведского",

    faqOneQuestion: "Можно ли получить работу в Швеции без свободного шведского?",
    faqOneAnswer:
      "Да, некоторые работы не требуют свободного шведского. Клининг, склад, ресторан, отель и некоторые сервисные работы иногда подходят с английским или базовым шведским.",
    faqTwoQuestion: "Какие работы могут подойти без идеального шведского?",
    faqTwoAnswer:
      "Клининг, уборка дома, офиса, после переезда, склад, мойка посуды, гостиничная уборка и простые сервисные работы могут быть возможными вариантами.",
    faqThreeQuestion: "Может ли Clean Jobs помочь найти работу по уборке?",
    faqThreeAnswer:
      "Да. Clean Jobs — это маркетплейс, где работники могут находить работы по уборке, а клиенты или клининговые компании могут находить людей для работы.",

    heroEyebrow: "Работа без шведского",
    heroTitle: "Работа без шведского: найдите работу в Швеции, пока учите язык",
    heroText:
      "Найти работу в Швеции может быть сложно, если вы ещё не говорите свободно по-шведски. Но есть практические пути на рынок труда. Клининг, сервис, отели, рестораны, склады и некоторые простые задания иногда возможны с английским, базовым шведским или понятными инструкциями.",
    seeCleaningJobs: "Смотреть работы по уборке",
    createProfile: "Создать профиль",

    startEyebrow: "Старт",
    startTitle: "Можно ли получить работу без свободного шведского?",
    startText1:
      "Да, некоторые работы можно найти без свободного шведского. Это зависит от задачи, работодателя и того, сколько контакта с клиентами требует работа.",
    startText2:
      "Это не значит, что шведский не важен. Изучение шведского сильно повышает ваши шансы. Но не всегда нужно ждать идеального уровня, чтобы начать искать практическую работу.",

    tipCleaningTitle: "Клининг",
    tipCleaningText:
      "Уборка дома, офиса и после переезда иногда возможны с простой коммуникацией.",
    tipWarehouseTitle: "Склад",
    tipWarehouseText:
      "Некоторые складские работы основаны на понятных рутинах и могут подойти, если вы можете выполнять инструкции.",
    tipRestaurantTitle: "Ресторан",
    tipRestaurantText:
      "Мойка посуды, помощь на кухне и простые сервисные задачи могут быть первой работой.",
    tipHotelTitle: "Отель",
    tipHotelText:
      "Гостиничная уборка и сервисная работа могут быть вариантом в больших городах.",

    cleaningEyebrow: "Уборка",
    cleaningTitle: "Почему работа по уборке может быть хорошим первым шагом",
    cleaningText1:
      "Работы по уборке часто практичные и понятные. Клиенту нужна помощь с конкретной задачей: уборка дома, офиса, квартиры, после переезда или регулярная уборка.",
    cleaningText2:
      "Clean Jobs фокусируется именно на работах по уборке, потому что спрос есть во многих городах. Платформа помогает работникам, клиентам и клининговым компаниям находить друг друга.",

    profileEyebrow: "Профиль",
    profileTitle: "Как повысить свои шансы",
    profileText1:
      "Создайте понятный профиль с вашим именем, городом, телефоном, опытом и доступностью. Напишите, какие работы можете выполнять: уборка дома, офиса, после переезда, вечером, по выходным или регулярные заказы.",
    profileText2:
      "Отвечайте быстро, когда кто-то связывается с вами. Честно укажите уровень языка и напишите, что можете общаться на английском или простом шведском.",

    citiesEyebrow: "Города",
    citiesTitle: "Где больше всего работ без идеального шведского?",
    citiesText1:
      "Больше всего возможностей часто есть в Стокгольме, Гётеборге и Мальмё, но Уппсала, Вестерос, Эребру, Хельсингборг, Лунд, Линчёпинг и другие большие города тоже могут иметь много сервисных и клининговых работ.",
    citiesText2:
      "Если вы можете ездить в соседние коммуны, у вас будет больше возможностей. Многие работы по уборке есть не только в центре, но и в жилых районах, офисах и небольших компаниях.",

    languageEyebrow: "Язык",
    languageTitle: "Продолжайте учить шведский параллельно",
    languageText1:
      "Даже если вы можете найти некоторые работы без свободного шведского, продолжайте учить язык. Шведский помогает лучше понимать договоры, инструкции, безопасность, клиентов и работодателей.",
    languageText2:
      "Хорошая стратегия — работать, получать опыт и одновременно учить шведский. Каждый рабочий день также может быть практикой языка.",

    ctaTitle: "Начните с работ по уборке на Clean Jobs",
    ctaText:
      "Если вы ищете работу без идеального шведского, клининг может быть практичным первым шагом. Создайте профиль, покажите доступность и начните искать задания рядом.",
    seeJobs: "Смотреть работы",
    readGuide: "Читать гид по работе",
  },

  pl: {
    metaTitle: "Praca bez szwedzkiego 2026 | Znajdź pracę w Szwecji",
    metaDescription:
      "Poradnik o pracy bez perfekcyjnego szwedzkiego. Dowiedz się o sprzątaniu, usługach, pracy dodatkowej i jak znaleźć pracę w Szwecji podczas nauki języka.",
    metaOgTitle: "Praca bez szwedzkiego | Clean Jobs",
    metaOgDescription:
      "Praktyczny poradnik dla osób szukających pracy w Szwecji, które nie mówią jeszcze płynnie po szwedzku.",
    metaOgAlt: "Praca bez szwedzkiego",

    faqOneQuestion: "Czy można dostać pracę w Szwecji bez płynnego szwedzkiego?",
    faqOneAnswer:
      "Tak, niektóre prace nie wymagają płynnego szwedzkiego. Sprzątanie, magazyn, restauracja, hotel i niektóre prace usługowe czasem są możliwe z angielskim lub podstawowym szwedzkim.",
    faqTwoQuestion: "Jakie prace mogą pasować bez perfekcyjnego szwedzkiego?",
    faqTwoAnswer:
      "Sprzątanie, sprzątanie domu, biura, po przeprowadzce, magazyn, zmywanie naczyń, sprzątanie hotelowe i proste prace usługowe mogą być możliwymi opcjami.",
    faqThreeQuestion: "Czy Clean Jobs może pomóc znaleźć prace sprzątania?",
    faqThreeAnswer:
      "Tak. Clean Jobs to marketplace, gdzie pracownicy mogą znajdować prace sprzątania, a klienci lub firmy sprzątające mogą znajdować osoby do pracy.",

    heroEyebrow: "Praca bez szwedzkiego",
    heroTitle: "Praca bez szwedzkiego: znajdź pracę w Szwecji podczas nauki języka",
    heroText:
      "Znalezienie pracy w Szwecji może być trudne, jeśli nie mówisz jeszcze płynnie po szwedzku. Ale istnieją praktyczne drogi wejścia na rynek pracy. Sprzątanie, usługi, hotele, restauracje, magazyny i niektóre proste zadania czasem są możliwe z angielskim, podstawowym szwedzkim lub jasnymi instrukcjami.",
    seeCleaningJobs: "Zobacz prace sprzątania",
    createProfile: "Utwórz profil",

    startEyebrow: "Start",
    startTitle: "Czy można dostać pracę bez płynnego szwedzkiego?",
    startText1:
      "Tak, można znaleźć niektóre prace bez płynnego szwedzkiego. Zależy to od zadania, pracodawcy i tego, ile kontaktu z klientem wymaga praca.",
    startText2:
      "To nie znaczy, że szwedzki nie jest ważny. Nauka szwedzkiego mocno zwiększa szanse. Ale nie zawsze trzeba czekać na idealny poziom, aby zacząć szukać praktycznej pracy.",

    tipCleaningTitle: "Sprzątanie",
    tipCleaningText:
      "Sprzątanie domu, biura i po przeprowadzce czasem jest możliwe z prostą komunikacją.",
    tipWarehouseTitle: "Magazyn",
    tipWarehouseText:
      "Niektóre prace magazynowe opierają się na jasnych rutynach i mogą pasować, jeśli potrafisz wykonywać instrukcje.",
    tipRestaurantTitle: "Restauracja",
    tipRestaurantText:
      "Zmywanie naczyń, pomoc w kuchni i proste zadania usługowe mogą być pierwszą pracą.",
    tipHotelTitle: "Hotel",
    tipHotelText:
      "Sprzątanie hotelowe i praca usługowa mogą być opcją w większych miastach.",

    cleaningEyebrow: "Sprzątanie",
    cleaningTitle: "Dlaczego prace sprzątania mogą być dobrym pierwszym krokiem",
    cleaningText1:
      "Prace sprzątania są często praktyczne i jasne. Klient potrzebuje pomocy z konkretnym zadaniem: sprzątanie domu, biura, mieszkania, po przeprowadzce albo regularne sprzątanie.",
    cleaningText2:
      "Clean Jobs skupia się właśnie na pracach sprzątania, ponieważ popyt istnieje w wielu miastach. Platforma pomaga pracownikom, klientom i firmom sprzątającym znaleźć się nawzajem.",

    profileEyebrow: "Profil",
    profileTitle: "Jak zwiększyć swoje szanse",
    profileText1:
      "Utwórz jasny profil z imieniem, miastem, telefonem, doświadczeniem i dostępnością. Napisz, jakie prace możesz wykonywać: sprzątanie domu, biura, po przeprowadzce, wieczorami, w weekendy lub regularne zlecenia.",
    profileText2:
      "Odpowiadaj szybko, gdy ktoś się z Tobą kontaktuje. Uczciwie podaj poziom języka i napisz, że możesz komunikować się po angielsku lub prostym szwedzkim.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Gdzie jest najwięcej prac bez perfekcyjnego szwedzkiego?",
    citiesText1:
      "Najwięcej możliwości często jest w Sztokholmie, Göteborgu i Malmö, ale Uppsala, Västerås, Örebro, Helsingborg, Lund, Linköping i inne większe miasta też mogą mieć wiele prac usługowych i sprzątania.",
    citiesText2:
      "Jeśli możesz dojeżdżać do pobliskich gmin, masz więcej możliwości. Wiele prac sprzątania jest nie tylko w centrum, ale też w dzielnicach mieszkalnych, biurach i małych firmach.",

    languageEyebrow: "Język",
    languageTitle: "Kontynuuj naukę szwedzkiego równolegle",
    languageText1:
      "Nawet jeśli możesz znaleźć niektóre prace bez płynnego szwedzkiego, kontynuuj naukę języka. Szwedzki pomaga lepiej rozumieć umowy, instrukcje, bezpieczeństwo, klientów i pracodawców.",
    languageText2:
      "Dobra strategia to pracować, zdobywać doświadczenie i jednocześnie uczyć się szwedzkiego. Każdy dzień pracy może też być praktyką języka.",

    ctaTitle: "Zacznij od prac sprzątania na Clean Jobs",
    ctaText:
      "Jeśli szukasz pracy bez perfekcyjnego szwedzkiego, sprzątanie może być praktycznym pierwszym krokiem. Utwórz profil, pokaż dostępność i zacznij szukać zadań w pobliżu.",
    seeJobs: "Zobacz prace",
    readGuide: "Czytaj poradnik pracy",
  },
  en: {
    metaTitle: "Jobs Without Swedish 2026 | Find Work in Sweden",
    metaDescription:
      "Guide to jobs without perfect Swedish. Learn about cleaning jobs, service jobs, extra work and how to find work in Sweden while learning Swedish.",
    metaOgTitle: "Jobs Without Swedish | Clean Jobs",
    metaOgDescription:
      "Practical guide for people looking for work in Sweden while not yet speaking fluent Swedish.",
    metaOgAlt: "Jobs without Swedish",

    faqOneQuestion: "Can you get a job in Sweden without fluent Swedish?",
    faqOneAnswer:
      "Yes, some jobs do not require fluent Swedish. Cleaning jobs, warehouse work, restaurants, hotels and some service jobs may sometimes work with English or basic Swedish.",
    faqTwoQuestion: "Which jobs can fit without perfect Swedish?",
    faqTwoAnswer:
      "Cleaning jobs, home cleaning, office cleaning, move-out cleaning, warehouse work, dishwashing, hotel cleaning and simpler service jobs can be possible options.",
    faqThreeQuestion: "Can Clean Jobs help me find cleaning jobs?",
    faqThreeAnswer:
      "Yes. Clean Jobs is a marketplace where workers can find cleaning jobs and where clients or cleaning companies can find people who want to work.",

    heroEyebrow: "Jobs without Swedish",
    heroTitle: "Jobs without Swedish: find work in Sweden while learning the language",
    heroText:
      "It can be difficult to find work in Sweden if you do not yet speak fluent Swedish. But there are practical ways into the labour market. Cleaning jobs, service jobs, hotels, restaurants, warehouses and some simpler assignments can sometimes work with English, basic Swedish or clear instructions.",
    seeCleaningJobs: "See cleaning jobs",
    createProfile: "Create profile",

    startEyebrow: "Start",
    startTitle: "Can you get a job without fluent Swedish?",
    startText1:
      "Yes, it is possible to find some jobs without speaking fluent Swedish. It depends on the task, employer and how much customer contact the job requires.",
    startText2:
      "That does not mean Swedish is unimportant. Learning Swedish increases your chances a lot. But you do not always need to wait until you are perfect before you start applying for practical jobs.",

    tipCleaningTitle: "Cleaning jobs",
    tipCleaningText:
      "Home cleaning, office cleaning and move-out cleaning can sometimes work with simple communication.",
    tipWarehouseTitle: "Warehouse",
    tipWarehouseText:
      "Some warehouse jobs are based on clear routines and can fit if you can follow instructions.",
    tipRestaurantTitle: "Restaurant",
    tipRestaurantText:
      "Dishwashing, kitchen help and simpler service tasks can be possible first jobs.",
    tipHotelTitle: "Hotel",
    tipHotelText:
      "Hotel cleaning and service work can be an option in larger cities.",

    cleaningEyebrow: "Cleaning",
    cleaningTitle: "Why cleaning jobs can be a good first step",
    cleaningText1:
      "Cleaning jobs are often practical and clear. The client needs help with a concrete problem: home cleaning, office cleaning, apartment cleaning, move-out cleaning or recurring cleaning.",
    cleaningText2:
      "Clean Jobs focuses specifically on cleaning jobs because the need exists in many cities. The platform helps workers, clients and cleaning companies find each other without relying only on large general job sites.",

    profileEyebrow: "Profile",
    profileTitle: "How to increase your chances",
    profileText1:
      "Create a clear profile with your name, city, phone number, experience and availability. Write what types of jobs you can do: home cleaning, office cleaning, move-out cleaning, evening work, weekend work or recurring assignments.",
    profileText2:
      "Reply quickly when someone contacts you. Be honest about your language level and write that you can communicate in English or simple Swedish.",

    citiesEyebrow: "Cities",
    citiesTitle: "Where are there most jobs without perfect Swedish?",
    citiesText1:
      "The biggest opportunities are often in Stockholm, Gothenburg and Malmö, but Uppsala, Västerås, Örebro, Helsingborg, Lund, Linköping and other larger cities can also have many service jobs and cleaning jobs.",
    citiesText2:
      "If you can travel to nearby municipalities, you get more opportunities. Many cleaning jobs are not only in the centre but also in residential areas, offices and smaller companies outside the city centre.",

    languageEyebrow: "Language",
    languageTitle: "Keep learning Swedish at the same time",
    languageText1:
      "Even if you can find some jobs without fluent Swedish, you should keep learning the language. Swedish helps you understand agreements, instructions, safety, clients and employers better.",
    languageText2:
      "A good strategy is to work, collect experience and study Swedish at the same time. Every customer contact and every working day can also become a way to practise the language.",

    ctaTitle: "Start with cleaning jobs on Clean Jobs",
    ctaText:
      "If you are looking for work without perfect Swedish, cleaning jobs can be a practical first step. Create a profile, show your availability and start looking for assignments near you.",
    seeJobs: "See jobs",
    readGuide: "Read job guide",
  },

  sv: {
    metaTitle: "Jobb utan svenska 2026 | Hitta arbete i Sverige",
    metaDescription:
      "Guide till jobb utan perfekt svenska. Läs om städjobb, servicejobb, extrajobb och hur du kan hitta arbete i Sverige även om du lär dig svenska.",
    metaOgTitle: "Jobb utan svenska | Clean Jobs",
    metaOgDescription:
      "Praktisk guide för dig som söker jobb i Sverige men ännu inte talar flytande svenska.",
    metaOgAlt: "Jobb utan svenska",

    faqOneQuestion: "Kan man få jobb i Sverige utan flytande svenska?",
    faqOneAnswer:
      "Ja, vissa jobb kräver inte flytande svenska. Städjobb, lagerarbete, restaurang, hotell och vissa servicejobb kan ibland fungera med engelska eller grundläggande svenska.",
    faqTwoQuestion: "Vilka jobb kan passa utan perfekt svenska?",
    faqTwoAnswer:
      "Städjobb, hemstädning, kontorsstädning, flyttstädning, lagerarbete, disk, hotellstädning och enklare servicejobb kan vara möjliga alternativ.",
    faqThreeQuestion: "Kan Clean Jobs hjälpa mig hitta städjobb?",
    faqThreeAnswer:
      "Ja. Clean Jobs är en marknadsplats där arbetare kan hitta städjobb och där kunder eller städfirmor kan hitta personer som vill arbeta.",

    heroEyebrow: "Jobb utan svenska",
    heroTitle: "Jobb utan svenska: hitta arbete i Sverige medan du lär dig språket",
    heroText:
      "Det kan vara svårt att hitta jobb i Sverige om du ännu inte talar flytande svenska. Men det finns praktiska vägar in på arbetsmarknaden. Städjobb, servicejobb, hotell, restaurang, lager och vissa enklare uppdrag kan ibland fungera med engelska, grundläggande svenska eller tydliga instruktioner.",
    seeCleaningJobs: "Se städjobb",
    createProfile: "Skapa profil",

    startEyebrow: "Start",
    startTitle: "Kan man få jobb utan flytande svenska?",
    startText1:
      "Ja, det är möjligt att hitta vissa jobb utan att tala flytande svenska. Det beror på arbetsuppgiften, arbetsgivaren och hur mycket kundkontakt jobbet kräver.",
    startText2:
      "Det betyder inte att svenska är oviktigt. Att lära sig svenska ökar dina chanser mycket. Men du behöver inte alltid vänta tills du är perfekt innan du börjar söka praktiska jobb.",

    tipCleaningTitle: "Städjobb",
    tipCleaningText:
      "Hemstädning, kontorsstädning och flyttstädning kan ibland fungera med enkel kommunikation.",
    tipWarehouseTitle: "Lager",
    tipWarehouseText:
      "Vissa lagerjobb bygger på tydliga rutiner och kan passa om du kan följa instruktioner.",
    tipRestaurantTitle: "Restaurang",
    tipRestaurantText:
      "Disk, kökshjälp och enklare serviceuppgifter kan vara möjliga första jobb.",
    tipHotelTitle: "Hotell",
    tipHotelText:
      "Hotellstädning och servicearbete kan vara ett alternativ i större städer.",

    cleaningEyebrow: "Städning",
    cleaningTitle: "Varför städjobb kan vara ett bra första steg",
    cleaningText1:
      "Städjobb är ofta praktiska och tydliga. Kunden behöver hjälp med ett konkret problem: hemstädning, kontorsstädning, lägenhetsstädning, flyttstädning eller återkommande städning.",
    cleaningText2:
      "Clean Jobs fokuserar på just städjobb eftersom behovet finns i många städer. Plattformen hjälper arbetare, kunder och städfirmor att hitta varandra utan att allt måste gå via stora generella jobbsajter.",

    profileEyebrow: "Profil",
    profileTitle: "Så ökar du dina chanser",
    profileText1:
      "Skapa en tydlig profil med ditt namn, stad, telefonnummer, erfarenhet och tillgänglighet. Skriv vilka typer av jobb du kan göra: hemstädning, kontorsstädning, flyttstädning, kvällsjobb, helgjobb eller återkommande uppdrag.",
    profileText2:
      "Svara snabbt när någon kontaktar dig. Var ärlig med din språknivå och skriv gärna att du kan kommunicera på engelska eller enkel svenska.",

    citiesEyebrow: "Städer",
    citiesTitle: "Var finns det flest jobb utan perfekt svenska?",
    citiesText1:
      "De största möjligheterna finns ofta i Stockholm, Göteborg och Malmö, men även Uppsala, Västerås, Örebro, Helsingborg, Lund, Linköping och andra större städer kan ha många servicejobb och städjobb.",
    citiesText2:
      "Om du kan resa till närliggande kommuner får du fler möjligheter. Många städjobb finns inte bara i centrum utan också i bostadsområden, kontor och mindre företag utanför stadskärnan.",

    languageEyebrow: "Språk",
    languageTitle: "Fortsätt lära dig svenska samtidigt",
    languageText1:
      "Även om du kan hitta vissa jobb utan flytande svenska bör du fortsätta lära dig språket. Svenska hjälper dig förstå avtal, instruktioner, säkerhet, kunder och arbetsgivare bättre.",
    languageText2:
      "En bra strategi är att arbeta, samla erfarenhet och samtidigt studera svenska. Varje kundkontakt och varje arbetsdag kan också bli ett sätt att träna språket.",

    ctaTitle: "Börja med städjobb på Clean Jobs",
    ctaText:
      "Om du söker jobb utan perfekt svenska kan städjobb vara ett praktiskt första steg. Skapa profil, visa din tillgänglighet och börja söka uppdrag nära dig.",
    seeJobs: "Se jobb",
    readGuide: "Läs jobbguiden",
  },
} satisfies Record<Locale, Record<string, string>>

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale]

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: "/jobb-utan-svenska",
    },
    keywords: [
      "jobb utan svenska",
      "jobb i Sverige utan svenska",
      "jobb utan flytande svenska",
      "städjobb utan svenska",
      "extrajobb utan svenska",
      "jobb för nyanlända",
      "jobb för utlänningar Sverige",
      "arbete utan svenska",
      "jobb med engelska Sverige",
      "städare jobb utan svenska",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/jobb-utan-svenska`,
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

function TipCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function JobbUtanSvenskaPage() {
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
              {t.seeCleaningJobs}
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
            <TipCard title={t.tipCleaningTitle} text={t.tipCleaningText} />
            <TipCard title={t.tipWarehouseTitle} text={t.tipWarehouseText} />
            <TipCard title={t.tipRestaurantTitle} text={t.tipRestaurantText} />
            <TipCard title={t.tipHotelTitle} text={t.tipHotelText} />
          </section>

          <Section eyebrow={t.cleaningEyebrow} title={t.cleaningTitle}>
            <p>{t.cleaningText1}</p>
            <p>{t.cleaningText2}</p>
          </Section>

          <Section eyebrow={t.profileEyebrow} title={t.profileTitle}>
            <p>{t.profileText1}</p>
            <p>{t.profileText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
          </Section>

          <Section eyebrow={t.languageEyebrow} title={t.languageTitle}>
            <p>{t.languageText1}</p>
            <p>{t.languageText2}</p>
          </Section>

          <section className="rounded-[36px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t.ctaTitle}</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">{t.ctaText}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]">
                {t.seeJobs}
              </Link>
              <Link href="/jobb-i-sverige" prefetch={false} className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15 active:scale-[0.97]">
                {t.readGuide}
              </Link>
            </div>
          </section>

          <RelatedGuides currentPath="/jobb-utan-svenska" />
        </div>
      </main>
    </div>
  )
}