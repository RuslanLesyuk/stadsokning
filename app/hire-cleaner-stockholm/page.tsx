import type { Metadata } from "next"
import { cookies } from "next/headers"
import Link from "next/link"

import RelatedGuides from "@/components/related-guides"
import {
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n"

type Benefit = {
  title: string
  text: string
}

type Step = {
  number: string
  title: string
  text: string
}

type UseCase = {
  label: string
  title: string
  text: string
}

type FaqItem = {
  question: string
  answer: string
}

type LandingCopy = {
  metaTitle: string
  metaDescription: string
  eyebrow: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  freeNote: string
  proofTitle: string
  proofText: string
  benefits: Benefit[]
  howEyebrow: string
  howTitle: string
  howText: string
  steps: Step[]
  useCasesEyebrow: string
  useCasesTitle: string
  useCasesText: string
  useCases: UseCase[]
  compareEyebrow: string
  compareTitle: string
  compareText: string
  comparePoints: string[]
  customerTitle: string
  customerPoints: string[]
  faqEyebrow: string
  faqTitle: string
  faq: FaqItem[]
  finalEyebrow: string
  finalTitle: string
  finalText: string
  finalCta: string
  browseCompanies: string
}

const copy: Record<Locale, LandingCopy> = {
  sv: {
    metaTitle: "Anlita städare i Stockholm – lägg upp jobbet gratis | Clean Jobs",
    metaDescription:
      "Behöver du städhjälp i Stockholm? Lägg upp jobbet gratis på Clean Jobs och jämför ansökningar från städare och städföretag.",
    eyebrow: "Städhjälp i Stockholm",
    title: "Lägg upp ditt städjobb gratis och jämför ansökningar",
    subtitle:
      "Beskriv vad du behöver hjälp med, ange område och tid och låt städare eller städföretag ansöka med pris, tillgänglighet och meddelande.",
    primaryCta: "Lägg upp jobbet gratis",
    secondaryCta: "Se städföretag i Stockholm",
    freeNote: "Det kostar inget att skapa ett vanligt städjobb på Clean Jobs.",
    proofTitle: "Du behåller kontrollen",
    proofText:
      "Du väljer själv vem du vill gå vidare med. Ett jobb tilldelas inte automatiskt till någon.",
    benefits: [
      {
        title: "Beskriv jobbet en gång",
        text:
          "Samla information om städningen, platsen, önskat datum och eventuell budget i ett tydligt jobb.",
      },
      {
        title: "Jämför ansökningar",
        text:
          "Se pris, tillgänglighet och meddelande från personer eller företag som vill utföra jobbet.",
      },
      {
        title: "Välj själv",
        text:
          "Granska ansökningarna och välj den utförare som passar ditt jobb bäst.",
      },
    ],
    howEyebrow: "Så fungerar det",
    howTitle: "Från städbehov till vald utförare",
    howText:
      "Clean Jobs är byggt som en marknadsplats: du beskriver behovet först och kan sedan jämföra de ansökningar som kommer in.",
    steps: [
      {
        number: "01",
        title: "Skapa ditt jobb",
        text:
          "Välj hemstädning eller kontorsstädning och beskriv vad som ska göras.",
      },
      {
        number: "02",
        title: "Ta emot ansökningar",
        text:
          "Intresserade utförare kan skicka pris, tillgänglighet och ett meddelande.",
      },
      {
        number: "03",
        title: "Jämför och välj",
        text:
          "Du bestämmer vem du vill gå vidare med innan arbetet startar.",
      },
    ],
    useCasesEyebrow: "Vanliga behov",
    useCasesTitle: "För både hem och arbetsplats",
    useCasesText:
      "Skapa ett konkret jobb när du vill få hjälp och låt utförarna bedöma om uppdraget passar dem.",
    useCases: [
      {
        label: "Hemstädning",
        title: "Lägenhet eller hus",
        text:
          "Beskriv storlek, rum, vad som ska städas och när du vill att jobbet ska utföras.",
      },
      {
        label: "Kontorsstädning",
        title: "Kontor och mindre lokaler",
        text:
          "Ange typ av lokal, område, omfattning och önskad tid så att rätt utförare kan bedöma jobbet.",
      },
      {
        label: "Flexibelt",
        title: "Engångsjobb eller återkommande behov",
        text:
          "Använd beskrivningen för att förklara om du söker hjälp vid ett tillfälle eller vill diskutera återkommande städning.",
      },
    ],
    compareEyebrow: "Varför marknadsplats?",
    compareTitle: "Få flera möjligheter utan att kontakta varje företag separat",
    compareText:
      "I stället för att börja med ett enskilt företag kan du publicera behovet och låta relevanta utförare ta ställning till jobbet.",
    comparePoints: [
      "Ett jobb med samma information till alla sökande",
      "Ansökningar samlade på samma plats",
      "Pris och tillgänglighet kan jämföras innan du väljer",
      "Du kan öppna jobbdetaljer och kommunicera i Clean Jobs-flödet",
    ],
    customerTitle: "Det här passar dig som",
    customerPoints: [
      "behöver städhjälp i Stockholm eller närliggande områden",
      "vill jämföra flera alternativ innan du bestämmer dig",
      "vill beskriva jobbet själv i stället för att fylla i flera olika offertformulär",
      "söker hemstädning eller kontorsstädning",
    ],
    faqEyebrow: "Frågor och svar",
    faqTitle: "Vanliga frågor innan du lägger upp ett jobb",
    faq: [
      {
        question: "Kostar det något att lägga upp ett städjobb?",
        answer:
          "Nej. Att skapa ett vanligt städjobb på Clean Jobs är gratis.",
      },
      {
        question: "Måste jag välja den första som ansöker?",
        answer:
          "Nej. Du kan granska ansökningarna och själv välja vem du vill gå vidare med.",
      },
      {
        question: "Vilken information bör jag skriva i jobbet?",
        answer:
          "Beskriv typen av städning, stad eller område, objektet, önskat datum och vad du vill ha gjort. Du kan även ange en budget om du vill.",
      },
      {
        question: "Kan både städare och städföretag ansöka?",
        answer:
          "Clean Jobs är byggt för en marknadsplats där användare och företag kan hitta relevanta städjobb och skicka ansökningar.",
      },
      {
        question: "Vad händer efter att jag valt en utförare?",
        answer:
          "När en ansökan väljs fortsätter jobbet i Clean Jobs arbetsflöde med tilldelning, chatt och jobbstatus.",
      },
    ],
    finalEyebrow: "Redo att börja?",
    finalTitle: "Beskriv städningen – låt marknaden svara",
    finalText:
      "Det tar bara några steg att skapa jobbet. Därefter kan du jämföra de ansökningar som kommer in och själv bestämma nästa steg.",
    finalCta: "Skapa städjobb",
    browseCompanies: "Bläddra bland städföretag",
  },

  en: {
    metaTitle: "Hire a Cleaner in Stockholm – Post Your Job Free | Clean Jobs",
    metaDescription:
      "Need cleaning help in Stockholm? Post your job for free on Clean Jobs and compare applications from cleaners and cleaning companies.",
    eyebrow: "Cleaning help in Stockholm",
    title: "Post your cleaning job for free and compare applications",
    subtitle:
      "Describe what you need, add the area and preferred time, and let cleaners or cleaning companies apply with price, availability and a message.",
    primaryCta: "Post the job for free",
    secondaryCta: "See cleaning companies in Stockholm",
    freeNote: "Creating a regular cleaning job on Clean Jobs is free.",
    proofTitle: "You stay in control",
    proofText:
      "You decide who you want to continue with. A job is not automatically assigned to anyone.",
    benefits: [
      {
        title: "Describe the job once",
        text:
          "Put the cleaning details, location, preferred date and optional budget into one clear job.",
      },
      {
        title: "Compare applications",
        text:
          "Review price, availability and messages from people or companies interested in the job.",
      },
      {
        title: "Choose yourself",
        text:
          "Review the applications and select the provider that best fits your job.",
      },
    ],
    howEyebrow: "How it works",
    howTitle: "From cleaning need to selected provider",
    howText:
      "Clean Jobs works as a marketplace: describe the need first, then compare the applications that arrive.",
    steps: [
      {
        number: "01",
        title: "Create your job",
        text:
          "Choose home or office cleaning and describe what needs to be done.",
      },
      {
        number: "02",
        title: "Receive applications",
        text:
          "Interested providers can send their price, availability and a message.",
      },
      {
        number: "03",
        title: "Compare and choose",
        text:
          "You decide who you want to continue with before the work starts.",
      },
    ],
    useCasesEyebrow: "Common needs",
    useCasesTitle: "For homes and workplaces",
    useCasesText:
      "Create a concrete job when you need help and let providers decide whether the assignment fits them.",
    useCases: [
      {
        label: "Home cleaning",
        title: "Apartment or house",
        text:
          "Describe the size, rooms, what should be cleaned and when you want the job completed.",
      },
      {
        label: "Office cleaning",
        title: "Offices and smaller premises",
        text:
          "Add the type of premises, area, scope and preferred time so providers can assess the job.",
      },
      {
        label: "Flexible",
        title: "One-off or recurring needs",
        text:
          "Use the description to explain whether you need one visit or want to discuss recurring cleaning.",
      },
    ],
    compareEyebrow: "Why a marketplace?",
    compareTitle: "Get several options without contacting every company separately",
    compareText:
      "Instead of starting with a single company, publish your need and let relevant providers decide whether to apply.",
    comparePoints: [
      "One job with the same information for every applicant",
      "Applications collected in one place",
      "Compare price and availability before choosing",
      "Open job details and continue communication in the Clean Jobs flow",
    ],
    customerTitle: "A good fit if you",
    customerPoints: [
      "need cleaning help in Stockholm or nearby areas",
      "want to compare several options before deciding",
      "prefer describing the job once instead of filling in several quote forms",
      "need home cleaning or office cleaning",
    ],
    faqEyebrow: "Questions and answers",
    faqTitle: "Common questions before posting a job",
    faq: [
      {
        question: "Does it cost anything to post a cleaning job?",
        answer:
          "No. Creating a regular cleaning job on Clean Jobs is free.",
      },
      {
        question: "Do I have to choose the first applicant?",
        answer:
          "No. You can review the applications and decide who you want to continue with.",
      },
      {
        question: "What should I include in the job?",
        answer:
          "Describe the type of cleaning, city or area, property, preferred date and what you want done. You can also add a budget if you want.",
      },
      {
        question: "Can both cleaners and cleaning companies apply?",
        answer:
          "Clean Jobs is built as a marketplace where users and companies can find relevant cleaning jobs and submit applications.",
      },
      {
        question: "What happens after I choose a provider?",
        answer:
          "After an application is selected, the job continues through the Clean Jobs workflow with assignment, chat and job status.",
      },
    ],
    finalEyebrow: "Ready to start?",
    finalTitle: "Describe the cleaning – let the marketplace respond",
    finalText:
      "It only takes a few steps to create the job. Then you can compare the applications that arrive and decide what happens next.",
    finalCta: "Create cleaning job",
    browseCompanies: "Browse cleaning companies",
  },

  uk: {
    metaTitle: "Знайти прибиральника у Стокгольмі – розмістіть замовлення безкоштовно | Clean Jobs",
    metaDescription:
      "Потрібне прибирання у Стокгольмі? Безкоштовно створіть замовлення на Clean Jobs і порівнюйте заявки від прибиральників та клінінгових компаній.",
    eyebrow: "Прибирання у Стокгольмі",
    title: "Створіть замовлення на прибирання безкоштовно та порівнюйте заявки",
    subtitle:
      "Опишіть, що потрібно прибрати, вкажіть район і бажаний час, а прибиральники та клінінгові компанії зможуть подати заявку з ціною, доступністю та повідомленням.",
    primaryCta: "Створити замовлення безкоштовно",
    secondaryCta: "Переглянути компанії у Стокгольмі",
    freeNote: "Створення звичайного замовлення на прибирання в Clean Jobs безкоштовне.",
    proofTitle: "Ви контролюєте вибір",
    proofText:
      "Ви самі вирішуєте, з ким продовжити. Виконавець не призначається автоматично.",
    benefits: [
      {
        title: "Опишіть роботу один раз",
        text:
          "Зберіть в одному замовленні інформацію про прибирання, місце, бажану дату та необов'язковий бюджет.",
      },
      {
        title: "Порівнюйте заявки",
        text:
          "Переглядайте ціну, доступність і повідомлення від людей або компаній, які хочуть виконати роботу.",
      },
      {
        title: "Обирайте самі",
        text:
          "Перегляньте заявки та виберіть виконавця, який найкраще підходить для вашого замовлення.",
      },
    ],
    howEyebrow: "Як це працює",
    howTitle: "Від потреби у прибиранні до обраного виконавця",
    howText:
      "Clean Jobs працює як маркетплейс: спочатку ви описуєте потребу, а потім порівнюєте заявки, що надходять.",
    steps: [
      {
        number: "01",
        title: "Створіть замовлення",
        text:
          "Оберіть домашнє або офісне прибирання та опишіть, що саме потрібно зробити.",
      },
      {
        number: "02",
        title: "Отримайте заявки",
        text:
          "Зацікавлені виконавці можуть надіслати ціну, доступність і повідомлення.",
      },
      {
        number: "03",
        title: "Порівняйте та оберіть",
        text:
          "Ви самі вирішуєте, з ким продовжити до початку роботи.",
      },
    ],
    useCasesEyebrow: "Типові потреби",
    useCasesTitle: "Для дому та робочих приміщень",
    useCasesText:
      "Створіть конкретне замовлення, коли вам потрібна допомога, і дозвольте виконавцям оцінити, чи підходить їм робота.",
    useCases: [
      {
        label: "Домашнє прибирання",
        title: "Квартира або будинок",
        text:
          "Опишіть розмір, кімнати, що саме потрібно прибрати та коли ви хочете виконати роботу.",
      },
      {
        label: "Офісне прибирання",
        title: "Офіси та невеликі приміщення",
        text:
          "Вкажіть тип приміщення, район, обсяг і бажаний час, щоб виконавці могли оцінити роботу.",
      },
      {
        label: "Гнучко",
        title: "Разова або регулярна потреба",
        text:
          "У описі можна зазначити, чи потрібне одноразове прибирання, чи ви хочете обговорити регулярну допомогу.",
      },
    ],
    compareEyebrow: "Навіщо маркетплейс?",
    compareTitle: "Отримайте кілька варіантів без окремого звернення до кожної компанії",
    compareText:
      "Замість починати з однієї компанії, опублікуйте свою потребу й дозвольте відповідним виконавцям вирішити, чи подавати заявку.",
    comparePoints: [
      "Одне замовлення з однаковою інформацією для всіх",
      "Усі заявки зібрані в одному місці",
      "Ціну та доступність можна порівняти до вибору",
      "Деталі роботи й подальше спілкування залишаються у потоці Clean Jobs",
    ],
    customerTitle: "Підійде вам, якщо ви",
    customerPoints: [
      "потребуєте прибирання у Стокгольмі або поблизу",
      "хочете порівняти кілька варіантів перед рішенням",
      "хочете описати роботу один раз замість заповнення кількох форм",
      "шукаєте домашнє або офісне прибирання",
    ],
    faqEyebrow: "Питання та відповіді",
    faqTitle: "Часті питання перед створенням замовлення",
    faq: [
      {
        question: "Чи коштує щось створити замовлення?",
        answer:
          "Ні. Створення звичайного замовлення на прибирання в Clean Jobs безкоштовне.",
      },
      {
        question: "Чи мушу я вибирати першого кандидата?",
        answer:
          "Ні. Ви можете переглянути заявки й самі вирішити, з ким продовжити.",
      },
      {
        question: "Що варто вказати в замовленні?",
        answer:
          "Опишіть тип прибирання, місто або район, об'єкт, бажану дату та що саме потрібно зробити. За бажанням можна вказати бюджет.",
      },
      {
        question: "Чи можуть подаватися і прибиральники, і компанії?",
        answer:
          "Clean Jobs побудований як маркетплейс, де користувачі та компанії можуть знаходити відповідні замовлення на прибирання й подавати заявки.",
      },
      {
        question: "Що відбувається після вибору виконавця?",
        answer:
          "Після вибору заявки робота продовжується у потоці Clean Jobs із призначенням виконавця, чатом і статусами.",
      },
    ],
    finalEyebrow: "Готові почати?",
    finalTitle: "Опишіть прибирання — нехай маркетплейс відповість",
    finalText:
      "Створення замовлення займає лише кілька кроків. Потім ви можете порівняти заявки та самостійно вирішити, що робити далі.",
    finalCta: "Створити замовлення",
    browseCompanies: "Переглянути клінінгові компанії",
  },

  ru: {
    metaTitle: "Найти уборщика в Стокгольме – разместите заказ бесплатно | Clean Jobs",
    metaDescription:
      "Нужна уборка в Стокгольме? Бесплатно создайте заказ на Clean Jobs и сравнивайте заявки от уборщиков и клининговых компаний.",
    eyebrow: "Уборка в Стокгольме",
    title: "Разместите заказ на уборку бесплатно и сравнивайте заявки",
    subtitle:
      "Опишите, что нужно убрать, укажите район и желаемое время, а уборщики и клининговые компании смогут подать заявку с ценой, доступностью и сообщением.",
    primaryCta: "Разместить заказ бесплатно",
    secondaryCta: "Посмотреть компании в Стокгольме",
    freeNote: "Создание обычного заказа на уборку в Clean Jobs бесплатно.",
    proofTitle: "Вы контролируете выбор",
    proofText:
      "Вы сами решаете, с кем продолжить. Исполнитель не назначается автоматически.",
    benefits: [
      {
        title: "Опишите работу один раз",
        text:
          "Соберите в одном заказе информацию об уборке, месте, желаемой дате и необязательном бюджете.",
      },
      {
        title: "Сравнивайте заявки",
        text:
          "Смотрите цену, доступность и сообщения от людей или компаний, которые хотят выполнить работу.",
      },
      {
        title: "Выбирайте сами",
        text:
          "Просмотрите заявки и выберите исполнителя, который лучше подходит для вашего заказа.",
      },
    ],
    howEyebrow: "Как это работает",
    howTitle: "От потребности в уборке до выбранного исполнителя",
    howText:
      "Clean Jobs работает как маркетплейс: сначала вы описываете потребность, затем сравниваете поступившие заявки.",
    steps: [
      {
        number: "01",
        title: "Создайте заказ",
        text:
          "Выберите домашнюю или офисную уборку и опишите, что нужно сделать.",
      },
      {
        number: "02",
        title: "Получите заявки",
        text:
          "Заинтересованные исполнители могут отправить цену, доступность и сообщение.",
      },
      {
        number: "03",
        title: "Сравните и выберите",
        text:
          "Вы сами решаете, с кем продолжить до начала работы.",
      },
    ],
    useCasesEyebrow: "Типичные задачи",
    useCasesTitle: "Для дома и рабочего помещения",
    useCasesText:
      "Создайте конкретный заказ, когда нужна помощь, и дайте исполнителям возможность оценить, подходит ли им работа.",
    useCases: [
      {
        label: "Домашняя уборка",
        title: "Квартира или дом",
        text:
          "Опишите размер, комнаты, что нужно убрать и когда вы хотите выполнить работу.",
      },
      {
        label: "Офисная уборка",
        title: "Офисы и небольшие помещения",
        text:
          "Укажите тип помещения, район, объём и желаемое время, чтобы исполнители могли оценить работу.",
      },
      {
        label: "Гибко",
        title: "Разовая или регулярная потребность",
        text:
          "В описании можно указать, нужна ли разовая уборка или вы хотите обсудить регулярную помощь.",
      },
    ],
    compareEyebrow: "Почему маркетплейс?",
    compareTitle: "Получите несколько вариантов без обращения к каждой компании отдельно",
    compareText:
      "Вместо того чтобы начинать с одной компании, опубликуйте свою потребность и позвольте подходящим исполнителям решить, подавать ли заявку.",
    comparePoints: [
      "Один заказ с одинаковой информацией для всех",
      "Все заявки собраны в одном месте",
      "Цену и доступность можно сравнить до выбора",
      "Детали работы и дальнейшее общение остаются в потоке Clean Jobs",
    ],
    customerTitle: "Подойдёт вам, если вы",
    customerPoints: [
      "нуждаетесь в уборке в Стокгольме или поблизости",
      "хотите сравнить несколько вариантов перед решением",
      "хотите описать работу один раз вместо заполнения нескольких форм",
      "ищете домашнюю или офисную уборку",
    ],
    faqEyebrow: "Вопросы и ответы",
    faqTitle: "Частые вопросы перед созданием заказа",
    faq: [
      {
        question: "Стоит ли что-то создать заказ?",
        answer:
          "Нет. Создание обычного заказа на уборку в Clean Jobs бесплатно.",
      },
      {
        question: "Обязательно выбирать первого кандидата?",
        answer:
          "Нет. Вы можете просмотреть заявки и сами решить, с кем продолжить.",
      },
      {
        question: "Что стоит указать в заказе?",
        answer:
          "Опишите тип уборки, город или район, объект, желаемую дату и что нужно сделать. При желании можно указать бюджет.",
      },
      {
        question: "Могут ли подаваться и уборщики, и компании?",
        answer:
          "Clean Jobs построен как маркетплейс, где пользователи и компании могут находить подходящие заказы на уборку и подавать заявки.",
      },
      {
        question: "Что происходит после выбора исполнителя?",
        answer:
          "После выбора заявки работа продолжается в потоке Clean Jobs с назначением исполнителя, чатом и статусами.",
      },
    ],
    finalEyebrow: "Готовы начать?",
    finalTitle: "Опишите уборку — пусть маркетплейс ответит",
    finalText:
      "Создание заказа занимает всего несколько шагов. Затем вы сможете сравнить заявки и самостоятельно решить, что делать дальше.",
    finalCta: "Создать заказ",
    browseCompanies: "Посмотреть клининговые компании",
  },

  pl: {
    metaTitle: "Zatrudnij sprzątacza w Sztokholmie – dodaj zlecenie bezpłatnie | Clean Jobs",
    metaDescription:
      "Potrzebujesz sprzątania w Sztokholmie? Dodaj zlecenie bezpłatnie w Clean Jobs i porównaj zgłoszenia od wykonawców i firm sprzątających.",
    eyebrow: "Sprzątanie w Sztokholmie",
    title: "Dodaj zlecenie sprzątania bezpłatnie i porównaj zgłoszenia",
    subtitle:
      "Opisz, czego potrzebujesz, podaj obszar i preferowany termin, a wykonawcy lub firmy sprzątające będą mogli zgłosić cenę, dostępność i wiadomość.",
    primaryCta: "Dodaj zlecenie bezpłatnie",
    secondaryCta: "Zobacz firmy w Sztokholmie",
    freeNote: "Utworzenie zwykłego zlecenia sprzątania w Clean Jobs jest bezpłatne.",
    proofTitle: "To Ty decydujesz",
    proofText:
      "Sam wybierasz, z kim chcesz kontynuować. Zlecenie nie jest automatycznie przydzielane wykonawcy.",
    benefits: [
      {
        title: "Opisz zlecenie raz",
        text:
          "Zbierz informacje o sprzątaniu, lokalizacji, preferowanej dacie i opcjonalnym budżecie w jednym zleceniu.",
      },
      {
        title: "Porównaj zgłoszenia",
        text:
          "Sprawdź cenę, dostępność i wiadomość od osób lub firm zainteresowanych zleceniem.",
      },
      {
        title: "Wybierz samodzielnie",
        text:
          "Przejrzyj zgłoszenia i wybierz wykonawcę najlepiej pasującego do Twojego zlecenia.",
      },
    ],
    howEyebrow: "Jak to działa",
    howTitle: "Od potrzeby sprzątania do wybranego wykonawcy",
    howText:
      "Clean Jobs działa jak marketplace: najpierw opisujesz potrzebę, a następnie porównujesz otrzymane zgłoszenia.",
    steps: [
      {
        number: "01",
        title: "Utwórz zlecenie",
        text:
          "Wybierz sprzątanie domu lub biura i opisz, co trzeba zrobić.",
      },
      {
        number: "02",
        title: "Otrzymaj zgłoszenia",
        text:
          "Zainteresowani wykonawcy mogą przesłać cenę, dostępność i wiadomość.",
      },
      {
        number: "03",
        title: "Porównaj i wybierz",
        text:
          "To Ty decydujesz, z kim kontynuować przed rozpoczęciem pracy.",
      },
    ],
    useCasesEyebrow: "Typowe potrzeby",
    useCasesTitle: "Dla domu i miejsca pracy",
    useCasesText:
      "Utwórz konkretne zlecenie, gdy potrzebujesz pomocy, i pozwól wykonawcom ocenić, czy zadanie do nich pasuje.",
    useCases: [
      {
        label: "Sprzątanie domu",
        title: "Mieszkanie lub dom",
        text:
          "Opisz wielkość, pomieszczenia, zakres sprzątania i oczekiwany termin wykonania.",
      },
      {
        label: "Sprzątanie biura",
        title: "Biura i mniejsze lokale",
        text:
          "Podaj typ lokalu, obszar, zakres i preferowany czas, aby wykonawcy mogli ocenić zlecenie.",
      },
      {
        label: "Elastycznie",
        title: "Jednorazowo lub regularnie",
        text:
          "W opisie możesz zaznaczyć, czy potrzebujesz jednorazowej wizyty, czy chcesz omówić regularne sprzątanie.",
      },
    ],
    compareEyebrow: "Dlaczego marketplace?",
    compareTitle: "Uzyskaj kilka opcji bez kontaktowania się osobno z każdą firmą",
    compareText:
      "Zamiast zaczynać od jednej firmy, opublikuj swoją potrzebę i pozwól odpowiednim wykonawcom zdecydować, czy chcą się zgłosić.",
    comparePoints: [
      "Jedno zlecenie z tymi samymi informacjami dla wszystkich",
      "Zgłoszenia zebrane w jednym miejscu",
      "Porównanie ceny i dostępności przed wyborem",
      "Szczegóły zlecenia i dalsza komunikacja pozostają w przepływie Clean Jobs",
    ],
    customerTitle: "Dobre rozwiązanie, jeśli",
    customerPoints: [
      "potrzebujesz sprzątania w Sztokholmie lub okolicy",
      "chcesz porównać kilka opcji przed decyzją",
      "wolisz opisać zlecenie raz zamiast wypełniać kilka formularzy",
      "potrzebujesz sprzątania domu lub biura",
    ],
    faqEyebrow: "Pytania i odpowiedzi",
    faqTitle: "Najczęstsze pytania przed dodaniem zlecenia",
    faq: [
      {
        question: "Czy dodanie zlecenia kosztuje?",
        answer:
          "Nie. Utworzenie zwykłego zlecenia sprzątania w Clean Jobs jest bezpłatne.",
      },
      {
        question: "Czy muszę wybrać pierwszego zgłaszającego się?",
        answer:
          "Nie. Możesz przejrzeć zgłoszenia i samodzielnie zdecydować, z kim kontynuować.",
      },
      {
        question: "Co warto opisać w zleceniu?",
        answer:
          "Podaj rodzaj sprzątania, miasto lub obszar, typ obiektu, preferowaną datę i zakres prac. Możesz też dodać budżet.",
      },
      {
        question: "Czy mogą zgłaszać się zarówno osoby, jak i firmy?",
        answer:
          "Clean Jobs działa jako marketplace, gdzie użytkownicy i firmy mogą znajdować odpowiednie zlecenia sprzątania i wysyłać zgłoszenia.",
      },
      {
        question: "Co dzieje się po wyborze wykonawcy?",
        answer:
          "Po wybraniu zgłoszenia zlecenie przechodzi dalej w przepływie Clean Jobs z przydzieleniem wykonawcy, czatem i statusami.",
      },
    ],
    finalEyebrow: "Gotowy, aby zacząć?",
    finalTitle: "Opisz sprzątanie – pozwól marketplace'owi odpowiedzieć",
    finalText:
      "Utworzenie zlecenia zajmuje tylko kilka kroków. Potem możesz porównać zgłoszenia i samodzielnie zdecydować o kolejnym kroku.",
    finalCta: "Utwórz zlecenie",
    browseCompanies: "Przeglądaj firmy sprzątające",
  },
}

async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return normalizeLocale(
    cookieStore.get(LOCALE_COOKIE_NAME)?.value,
  )
}

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
      {children}
    </div>
  )
}

function CheckItem({ children }: { children: string }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700"
      >
        ✓
      </span>
      <span className="text-sm leading-6 text-slate-600 md:text-base">
        {children}
      </span>
    </li>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = copy[locale] || copy.sv

  return {
    title: {
      absolute: t.metaTitle,
    },
    description: t.metaDescription,
    alternates: {
      canonical:
        "https://cleansjob.com/hire-cleaner-stockholm",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      url:
        "https://cleansjob.com/hire-cleaner-stockholm",
      title: t.metaTitle,
      description: t.metaDescription,
      siteName: "Clean Jobs",
    },
    twitter: {
      card: "summary_large_image",
      title: t.metaTitle,
      description: t.metaDescription,
    },
  }
}

export default async function HireCleanerStockholmPage() {
  const locale = await getLocale()
  const t = copy[locale] || copy.sv

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-br from-white via-white to-rose-50 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12">
            <div>
              <Eyebrow>{t.eyebrow}</Eyebrow>

              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 md:text-6xl md:leading-[1.02]">
                {t.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                {t.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/jobs/create"
                  prefetch={false}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(225,29,72,0.18)] transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {t.primaryCta}
                </Link>

                <Link
                  href="/companies?city=Stockholm"
                  prefetch={false}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98]"
                >
                  {t.secondaryCta}
                </Link>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500 md:text-sm">
                {t.freeNote}
              </p>
            </div>

            <div className="rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.16)] md:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
                Clean Jobs
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                {t.proofTitle}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                {t.proofText}
              </p>

              <div className="mt-7 grid gap-3">
                {t.benefits.map((benefit, index) => (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-sm font-bold text-rose-200">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="font-semibold text-white">
                          {benefit.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="max-w-3xl">
            <Eyebrow>{t.howEyebrow}</Eyebrow>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t.howTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t.howText}
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {t.steps.map((step) => (
              <article
                key={step.number}
                className="rounded-[28px] border border-slate-200 bg-slate-50/60 p-6"
              >
                <div className="text-sm font-bold tracking-[0.16em] text-rose-600">
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="max-w-3xl">
            <Eyebrow>{t.useCasesEyebrow}</Eyebrow>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t.useCasesTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t.useCasesText}
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {t.useCases.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-7"
              >
                <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                  {item.label}
                </div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <Eyebrow>{t.compareEyebrow}</Eyebrow>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t.compareTitle}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t.compareText}
            </p>

            <ul className="mt-6 space-y-4">
              {t.comparePoints.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>
          </article>

          <article className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
              Stockholm
            </div>

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {t.customerTitle}
            </h2>

            <ul className="mt-6 space-y-4">
              {t.customerPoints.map((point) => (
                <CheckItem key={point}>{point}</CheckItem>
              ))}
            </ul>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.98] sm:w-auto"
            >
              {t.primaryCta}
            </Link>
          </article>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="max-w-3xl">
            <Eyebrow>{t.faqEyebrow}</Eyebrow>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t.faqTitle}
            </h2>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {t.faq.map((item) => (
              <article
                key={item.question}
                className="rounded-[24px] border border-slate-200 bg-slate-50/60 p-5 md:p-6"
              >
                <h3 className="text-base font-semibold leading-6 text-slate-950 md:text-lg">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)] md:p-8 lg:p-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-300">
              {t.finalEyebrow}
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
              {t.finalTitle}
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
              {t.finalText}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/jobs/create"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98]"
              >
                {t.finalCta}
              </Link>

              <Link
                href="/companies?city=Stockholm"
                prefetch={false}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-slate-950 active:scale-[0.98]"
              >
                {t.browseCompanies}
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-10">
          <RelatedGuides
            currentPath="/hire-cleaner-stockholm"
          />
        </div>
      </div>
    </div>
  )
}
