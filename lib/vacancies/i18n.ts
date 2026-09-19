import type { Locale } from "@/lib/i18n"

export type VacancyDictionary = {
  list: {
    eyebrow: string
    title: string
    subtitle: string
    offerTab: string
    seekerTab: string
    offerTabDescription: string
    seekerTabDescription: string
    addOffer: string
    addSeeker: string
    filterCity: string
    allCities: string
    citySearchPlaceholder: string
    popularCities: string
    cityFilterHint: string
    show: string
    clear: string
    emptyOffer: string
    emptySeeker: string
    offerBadge: string
    seekerBadge: string
  }
  create: {
    back: string
    offerEyebrow: string
    seekerEyebrow: string
    offerTitle: string
    seekerTitle: string
    freeLaunch: string
    premiumFeature: string
    premiumRequired: string
    seePremium: string
    publishOffer: string
    publishSeeker: string
    switchToOffer: string
    switchToSeeker: string
  }
  edit: { back: string; offerTitle: string; seekerTitle: string; save: string }
  form: {
    saving: string
    offerTitle: string
    offerTitlePlaceholder: string
    seekerTitle: string
    seekerTitlePlaceholder: string
    company: string
    companyPlaceholder: string
    personName: string
    personNamePlaceholder: string
    city: string
    cityPlaceholder: string
    offerSchedule: string
    offerSchedulePlaceholder: string
    seekerSchedule: string
    seekerSchedulePlaceholder: string
    offerSalary: string
    seekerSalary: string
    salaryPlaceholder: string
    salaryUnit: string
    offerDescription: string
    offerDescriptionPlaceholder: string
    seekerDescription: string
    seekerDescriptionPlaceholder: string
    offerRequirements: string
    offerRequirementsPlaceholder: string
    seekerRequirements: string
    seekerRequirementsPlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    contactHint: string
  }
  detail: {
    back: string
    offerBadge: string
    seekerBadge: string
    aboutOffer: string
    aboutSeeker: string
    requirementsOffer: string
    requirementsSeeker: string
    contact: string
    email: string
    phone: string
    edit: string
    applyTitle: string
    applyFree: string
    loginToApply: string
    seekerContactNote: string
    notFound: string
    offerMetaDescription: (title: string, company: string, city: string) => string
    seekerMetaDescription: (title: string, person: string, city: string) => string
    offerOgDescription: (city: string) => string
    seekerOgDescription: (city: string) => string
  }
  application: {
    sending: string
    submit: string
    name: string
    email: string
    phone: string
    message: string
    messagePlaceholder: string
  }
  dashboard: {
    eyebrow: string
    title: string
    add: string
    empty: string
    active: string
    closed: string
    offerBadge: string
    seekerBadge: string
    view: string
    edit: string
    close: string
    delete: string
    deleteConfirm: string
    applications: string
    noApplications: string
    seekerDirectContact: string
  }
  errors: {
    title: string
    company: string
    person: string
    listingType: string
    city: string
    description: string
    schedule: string
    salary: string
    requirements: string
    contact: string
    email: string
    phone: string
    loginPublish: string
    premium: string
    publishBlocked: string
    publishFailed: string
    login: string
    identify: string
    ownOnly: string
    saveFailed: string
    loginApply: string
    name: string
    message: string
    noLongerOpen: string
    applicationsOfferOnly: string
    ownApplication: string
    duplicateApplication: string
    applicationFailed: string
    applicationSent: string
  }
}

const dictionaries: Record<Locale, VacancyDictionary> = {
  sv: {
    list: {
      eyebrow: "Jobbmarknad",
      title: "Jobb inom städning i Sverige",
      subtitle: "Välj om du vill se arbetsgivare som erbjuder jobb eller personer som söker arbete. Kundernas städuppdrag finns fortfarande separat på Clean Jobs.",
      offerTab: "Erbjuder jobb",
      seekerTab: "Söker jobb",
      offerTabDescription: "Lediga tjänster från företag och andra arbetsgivare.",
      seekerTabDescription: "Personer som söker arbete inom städning och lokalvård.",
      addOffer: "Lägg ut ett jobb",
      addSeeker: "Lägg ut att jag söker jobb",
      filterCity: "Filtrera efter ort",
      allCities: "Alla orter",
      citySearchPlaceholder: "Sök eller välj ort",
      popularCities: "Populära orter",
      cityFilterHint: "Du kan söka bland alla Sveriges 290 kommuner. Orter med aktiva annonser markeras automatiskt.",
      show: "Visa",
      clear: "Rensa",
      emptyOffer: "Inga lediga jobb hittades för den valda orten.",
      emptySeeker: "Inga personer som söker jobb hittades för den valda orten.",
      offerBadge: "Erbjuder jobb",
      seekerBadge: "Söker jobb",
    },
    create: {
      back: "Till jobbmarknaden",
      offerEyebrow: "Arbetsgivare",
      seekerEyebrow: "Arbetssökande",
      offerTitle: "Erbjud ett jobb",
      seekerTitle: "Jag söker jobb",
      freeLaunch: "gratis under lanseringen",
      premiumFeature: "en Premium-funktion",
      premiumRequired: "Premium krävs för att publicera.",
      seePremium: "Se Premium",
      publishOffer: "Publicera jobb",
      publishSeeker: "Publicera min annons",
      switchToOffer: "Jag erbjuder jobb",
      switchToSeeker: "Jag söker jobb",
    },
    edit: { back: "Till annonsen", offerTitle: "Redigera jobbannons", seekerTitle: "Redigera jobbsökarannons", save: "Spara ändringar" },
    form: {
      saving: "Sparar…",
      offerTitle: "Jobbtitel",
      offerTitlePlaceholder: "Ex. Lokalvårdare",
      seekerTitle: "Jobb jag söker",
      seekerTitlePlaceholder: "Ex. Lokalvårdare / städare",
      company: "Företag",
      companyPlaceholder: "Företagsnamn",
      personName: "Namn",
      personNamePlaceholder: "Ditt namn",
      city: "Ort",
      cityPlaceholder: "Stockholm",
      offerSchedule: "Arbetstid / schema",
      offerSchedulePlaceholder: "Heltid, vardagar 07:00–16:00",
      seekerSchedule: "Tillgänglighet",
      seekerSchedulePlaceholder: "Ex. heltid, vardagar, kan börja direkt",
      offerSalary: "Timlön (valfritt)",
      seekerSalary: "Önskad timlön (valfritt)",
      salaryPlaceholder: "165",
      salaryUnit: "SEK / timme",
      offerDescription: "Beskrivning",
      offerDescriptionPlaceholder: "Beskriv arbetsuppgifter, arbetsplats och vad rollen innebär.",
      seekerDescription: "Om mig / erfarenhet",
      seekerDescriptionPlaceholder: "Berätta om din erfarenhet, vilken typ av arbete du söker och när du kan börja.",
      offerRequirements: "Krav",
      offerRequirementsPlaceholder: "Erfarenhet, språk, körkort eller andra krav.",
      seekerRequirements: "Kompetenser",
      seekerRequirementsPlaceholder: "Språk, körkort, erfarenhet, utbildning eller andra styrkor.",
      email: "Kontakt e-post",
      emailPlaceholder: "namn@email.se",
      phone: "Kontakt telefon",
      phonePlaceholder: "070-123 45 67",
      contactHint: "Minst e-post eller telefon krävs.",
    },
    detail: {
      back: "Alla jobbannonser",
      offerBadge: "Erbjuder jobb",
      seekerBadge: "Söker jobb",
      aboutOffer: "Om jobbet",
      aboutSeeker: "Om personen",
      requirementsOffer: "Krav",
      requirementsSeeker: "Erfarenhet och kompetenser",
      contact: "Kontakt",
      email: "E-post",
      phone: "Telefon",
      edit: "Redigera annonsen",
      applyTitle: "Ansök via Clean Jobs",
      applyFree: "Det är gratis att ansöka.",
      loginToApply: "Logga in för att ansöka",
      seekerContactNote: "Arbetsgivare kan kontakta personen direkt via kontaktuppgifterna ovan.",
      notFound: "Annonsen hittades inte",
      offerMetaDescription: (t, c, city) => `${c} söker ${t} i ${city}. Se arbetsbeskrivning, krav och kontaktuppgifter på Clean Jobs.`,
      seekerMetaDescription: (t, p, city) => `${p} söker arbete som ${t} i ${city}. Se erfarenhet och kontaktuppgifter på Clean Jobs.`,
      offerOgDescription: city => `Ledigt jobb i ${city}.`,
      seekerOgDescription: city => `Person söker jobb i ${city}.`,
    },
    application: { sending: "Skickar…", submit: "Skicka ansökan", name: "Namn", email: "E-post", phone: "Telefon", message: "Meddelande", messagePlaceholder: "Berätta kort om din erfarenhet och varför du söker tjänsten." },
    dashboard: {
      eyebrow: "Jobbmarknad",
      title: "Mina jobbannonser",
      add: "Lägg till annons",
      empty: "Du har inte publicerat några jobbannonser ännu.",
      active: "Aktiv",
      closed: "Stängd",
      offerBadge: "Erbjuder jobb",
      seekerBadge: "Söker jobb",
      view: "Visa",
      edit: "Redigera",
      close: "Stäng annons",
      delete: "Ta bort",
      deleteConfirm: "Ta bort den här annonsen permanent? Eventuella ansökningar tas också bort.",
      applications: "Ansökningar",
      noApplications: "Inga ansökningar ännu.",
      seekerDirectContact: "Arbetsgivare kontaktar dig direkt via kontaktuppgifterna i annonsen.",
    },
    errors: {
      title: "Ange en giltig jobbtitel.", company: "Ange ett giltigt företagsnamn.", person: "Ange ett giltigt namn.", listingType: "Välj vilken typ av jobbannons du vill publicera.", city: "Ange en giltig ort.", description: "Beskrivningen måste vara mellan 20 och 10 000 tecken.", schedule: "Texten om schema eller tillgänglighet är för lång.", salary: "Ange timlönen som ett nummer, till exempel 165.", requirements: "Texten om krav eller kompetenser är för lång.", contact: "Ange minst e-post eller telefon som kontakt.", email: "Ange en giltig e-postadress.", phone: "Telefonnumret är för långt.", loginPublish: "Du måste vara inloggad för att publicera en annons.", premium: "Premium krävs för att publicera jobbannonser.", publishBlocked: "Du kan inte publicera just nu.", publishFailed: "Annonsen kunde inte publiceras.", login: "Du måste vara inloggad.", identify: "Annonsen kunde inte identifieras.", ownOnly: "Du kan bara redigera dina egna annonser.", saveFailed: "Det gick inte att spara ändringarna.", loginApply: "Logga in eller skapa ett konto för att ansöka.", name: "Ange ditt namn.", message: "Skriv ett meddelande på minst 10 tecken.", noLongerOpen: "Den här annonsen är inte längre aktiv.", applicationsOfferOnly: "Ansökningar kan bara skickas till arbetsgivares jobbannonser.", ownApplication: "Du kan inte ansöka till din egen annons.", duplicateApplication: "Du har redan ansökt till den här tjänsten.", applicationFailed: "Ansökan kunde inte skickas.", applicationSent: "Ansökan är skickad.",
    },
  },
  en: {
    list: {
      eyebrow: "Job marketplace", title: "Cleaning work in Sweden", subtitle: "Choose between employers offering jobs and people looking for work. Customer cleaning assignments remain a separate section on Clean Jobs.", offerTab: "Offering jobs", seekerTab: "Looking for work", offerTabDescription: "Open positions from companies and other employers.", seekerTabDescription: "People looking for cleaning and facility-service work.", addOffer: "Post a job", addSeeker: "Post that I am looking for work", filterCity: "Filter by city", allCities: "All cities", citySearchPlaceholder: "Search or choose a city", popularCities: "Popular cities", cityFilterHint: "Search across all 290 Swedish municipalities. Cities with active ads are highlighted automatically.", show: "Show", clear: "Clear", emptyOffer: "No job offers were found for the selected city.", emptySeeker: "No job seekers were found for the selected city.", offerBadge: "Offering job", seekerBadge: "Looking for work",
    },
    create: { back: "Back to job marketplace", offerEyebrow: "Employer", seekerEyebrow: "Job seeker", offerTitle: "Offer a job", seekerTitle: "I am looking for work", freeLaunch: "free during launch", premiumFeature: "a Premium feature", premiumRequired: "Premium is required to publish.", seePremium: "See Premium", publishOffer: "Publish job", publishSeeker: "Publish my ad", switchToOffer: "I am offering a job", switchToSeeker: "I am looking for work" },
    edit: { back: "Back to ad", offerTitle: "Edit job offer", seekerTitle: "Edit job seeker ad", save: "Save changes" },
    form: { saving: "Saving…", offerTitle: "Job title", offerTitlePlaceholder: "e.g. Cleaner", seekerTitle: "Work I am looking for", seekerTitlePlaceholder: "e.g. Cleaner / facility worker", company: "Company", companyPlaceholder: "Company name", personName: "Name", personNamePlaceholder: "Your name", city: "City", cityPlaceholder: "Stockholm", offerSchedule: "Working hours / schedule", offerSchedulePlaceholder: "Full time, weekdays 07:00–16:00", seekerSchedule: "Availability", seekerSchedulePlaceholder: "e.g. full time, weekdays, available immediately", offerSalary: "Hourly salary (optional)", seekerSalary: "Desired hourly salary (optional)", salaryPlaceholder: "165", salaryUnit: "SEK / hour", offerDescription: "Description", offerDescriptionPlaceholder: "Describe the duties, workplace and role.", seekerDescription: "About me / experience", seekerDescriptionPlaceholder: "Describe your experience, the work you want and when you can start.", offerRequirements: "Requirements", offerRequirementsPlaceholder: "Experience, languages, driving licence or other requirements.", seekerRequirements: "Skills", seekerRequirementsPlaceholder: "Languages, driving licence, experience, training or other strengths.", email: "Contact email", emailPlaceholder: "name@email.se", phone: "Contact phone", phonePlaceholder: "070-123 45 67", contactHint: "At least an email or phone number is required." },
    detail: { back: "All job ads", offerBadge: "Offering job", seekerBadge: "Looking for work", aboutOffer: "About the job", aboutSeeker: "About the person", requirementsOffer: "Requirements", requirementsSeeker: "Experience and skills", contact: "Contact", email: "Email", phone: "Phone", edit: "Edit ad", applyTitle: "Apply via Clean Jobs", applyFree: "Applying is free.", loginToApply: "Log in to apply", seekerContactNote: "Employers can contact this person directly using the contact details above.", notFound: "Ad not found", offerMetaDescription: (t,c,city) => `${c} is hiring a ${t} in ${city}. See the description, requirements and contact details on Clean Jobs.`, seekerMetaDescription: (t,p,city) => `${p} is looking for work as ${t} in ${city}. See experience and contact details on Clean Jobs.`, offerOgDescription: city => `Job offer in ${city}.`, seekerOgDescription: city => `Job seeker in ${city}.` },
    application: { sending: "Sending…", submit: "Send application", name: "Name", email: "Email", phone: "Phone", message: "Message", messagePlaceholder: "Briefly describe your experience and why you are applying." },
    dashboard: { eyebrow: "Job marketplace", title: "My job ads", add: "Add ad", empty: "You have not published any job ads yet.", active: "Active", closed: "Closed", offerBadge: "Offering job", seekerBadge: "Looking for work", view: "View", edit: "Edit", close: "Close ad", delete: "Delete", deleteConfirm: "Permanently delete this ad? Any applications to it will also be deleted.", applications: "Applications", noApplications: "No applications yet.", seekerDirectContact: "Employers contact you directly using the contact details in your ad." },
    errors: { title: "Enter a valid job title.", company: "Enter a valid company name.", person: "Enter a valid name.", listingType: "Choose the type of job ad you want to publish.", city: "Enter a valid city.", description: "The description must be between 20 and 10,000 characters.", schedule: "The schedule or availability text is too long.", salary: "Enter the hourly salary as a number, for example 165.", requirements: "The requirements or skills text is too long.", contact: "Provide at least an email or phone number.", email: "Enter a valid email address.", phone: "The phone number is too long.", loginPublish: "You must be logged in to publish an ad.", premium: "Premium is required to publish job ads.", publishBlocked: "You cannot publish right now.", publishFailed: "The ad could not be published.", login: "You must be logged in.", identify: "The ad could not be identified.", ownOnly: "You can only edit your own ads.", saveFailed: "The changes could not be saved.", loginApply: "Log in or create an account to apply.", name: "Enter your name.", message: "Write a message of at least 10 characters.", noLongerOpen: "This ad is no longer active.", applicationsOfferOnly: "Applications can only be sent to employer job offers.", ownApplication: "You cannot apply to your own ad.", duplicateApplication: "You have already applied to this job.", applicationFailed: "The application could not be sent.", applicationSent: "Application sent." },
  },
  uk: {
    list: {
      eyebrow: "Ринок роботи", title: "Робота у сфері прибирання у Швеції", subtitle: "Окремо переглядайте роботодавців, які пропонують вакансії, і людей, які шукають роботу. Клієнтські замовлення на прибирання залишаються окремим розділом Clean Jobs.", offerTab: "Пропоную вакансію", seekerTab: "Шукаю роботу", offerTabDescription: "Вакансії від клінінгових компаній та інших роботодавців.", seekerTabDescription: "Оголошення людей, які шукають роботу у сфері прибирання.", addOffer: "Додати вакансію", addSeeker: "Додати оголошення про пошук роботи", filterCity: "Фільтр за містом", allCities: "Усі міста", citySearchPlaceholder: "Почніть вводити або виберіть місто", popularCities: "Популярні міста", cityFilterHint: "Пошук працює по всіх 290 комунах Швеції. Міста з активними оголошеннями підсвічуються автоматично.", show: "Показати", clear: "Очистити", emptyOffer: "У вибраному місті вакансій не знайдено.", emptySeeker: "У вибраному місті оголошень про пошук роботи не знайдено.", offerBadge: "Пропоную вакансію", seekerBadge: "Шукаю роботу",
    },
    create: { back: "До ринку роботи", offerEyebrow: "Роботодавець", seekerEyebrow: "Шукач роботи", offerTitle: "Додати вакансію", seekerTitle: "Я шукаю роботу", freeLaunch: "безкоштовно на етапі запуску", premiumFeature: "функція Premium", premiumRequired: "Для публікації потрібен Premium.", seePremium: "Переглянути Premium", publishOffer: "Опублікувати вакансію", publishSeeker: "Опублікувати моє оголошення", switchToOffer: "Я пропоную вакансію", switchToSeeker: "Я шукаю роботу" },
    edit: { back: "До оголошення", offerTitle: "Редагувати вакансію", seekerTitle: "Редагувати оголошення про пошук роботи", save: "Зберегти зміни" },
    form: { saving: "Збереження…", offerTitle: "Назва посади", offerTitlePlaceholder: "Напр. прибиральник", seekerTitle: "Яку роботу шукаю", seekerTitlePlaceholder: "Напр. прибиральник / клінер", company: "Компанія", companyPlaceholder: "Назва компанії", personName: "Ім’я", personNamePlaceholder: "Ваше ім’я", city: "Місто", cityPlaceholder: "Stockholm", offerSchedule: "Графік роботи", offerSchedulePlaceholder: "Повний день, будні 07:00–16:00", seekerSchedule: "Коли можу працювати", seekerSchedulePlaceholder: "Напр. повний день, будні, можу почати одразу", offerSalary: "Оплата за годину (необов’язково)", seekerSalary: "Бажана оплата за годину (необов’язково)", salaryPlaceholder: "165", salaryUnit: "SEK / год", offerDescription: "Опис вакансії", offerDescriptionPlaceholder: "Опишіть обов’язки, місце роботи та саму посаду.", seekerDescription: "Про себе / досвід", seekerDescriptionPlaceholder: "Розкажіть про свій досвід, яку роботу шукаєте та коли можете почати.", offerRequirements: "Вимоги", offerRequirementsPlaceholder: "Досвід, мови, водійські права або інші вимоги.", seekerRequirements: "Навички", seekerRequirementsPlaceholder: "Мови, водійські права, досвід, навчання або інші сильні сторони.", email: "Контактний email", emailPlaceholder: "name@email.se", phone: "Контактний телефон", phonePlaceholder: "070-123 45 67", contactHint: "Потрібно вказати щонайменше email або телефон." },
    detail: { back: "Усі оголошення", offerBadge: "Пропоную вакансію", seekerBadge: "Шукаю роботу", aboutOffer: "Про вакансію", aboutSeeker: "Про кандидата", requirementsOffer: "Вимоги", requirementsSeeker: "Досвід і навички", contact: "Контакти", email: "Email", phone: "Телефон", edit: "Редагувати оголошення", applyTitle: "Відгукнутися через Clean Jobs", applyFree: "Відгук на вакансію безкоштовний.", loginToApply: "Увійти, щоб відгукнутися", seekerContactNote: "Роботодавець може зв’язатися з кандидатом напряму за контактами вище.", notFound: "Оголошення не знайдено", offerMetaDescription: (t,c,city) => `${c} шукає ${t} у ${city}. Перегляньте опис, вимоги та контакти на Clean Jobs.`, seekerMetaDescription: (t,p,city) => `${p} шукає роботу як ${t} у ${city}. Перегляньте досвід і контакти на Clean Jobs.`, offerOgDescription: city => `Вакансія у ${city}.`, seekerOgDescription: city => `Кандидат шукає роботу у ${city}.` },
    application: { sending: "Надсилання…", submit: "Надіслати відгук", name: "Ім’я", email: "Email", phone: "Телефон", message: "Повідомлення", messagePlaceholder: "Коротко розкажіть про свій досвід і чому вас цікавить ця вакансія." },
    dashboard: { eyebrow: "Ринок роботи", title: "Мої оголошення", add: "Додати оголошення", empty: "Ви ще не опублікували жодного оголошення.", active: "Активне", closed: "Закрите", offerBadge: "Пропоную вакансію", seekerBadge: "Шукаю роботу", view: "Переглянути", edit: "Редагувати", close: "Закрити оголошення", delete: "Видалити", deleteConfirm: "Видалити це оголошення назавжди? Усі відгуки на нього також буде видалено.", applications: "Відгуки", noApplications: "Відгуків поки немає.", seekerDirectContact: "Роботодавці зв’язуються з вами напряму за контактами, вказаними в оголошенні." },
    errors: { title: "Вкажіть коректну назву роботи або посади.", company: "Вкажіть коректну назву компанії.", person: "Вкажіть коректне ім’я.", listingType: "Виберіть тип оголошення.", city: "Вкажіть коректне місто.", description: "Опис має містити від 20 до 10 000 символів.", schedule: "Текст графіка або доступності занадто довгий.", salary: "Вкажіть оплату за годину числом, наприклад 165.", requirements: "Текст вимог або навичок занадто довгий.", contact: "Вкажіть щонайменше email або телефон.", email: "Вкажіть коректний email.", phone: "Номер телефону занадто довгий.", loginPublish: "Щоб опублікувати оголошення, потрібно увійти.", premium: "Для публікації оголошень потрібен Premium.", publishBlocked: "Зараз публікація недоступна.", publishFailed: "Не вдалося опублікувати оголошення.", login: "Потрібно увійти в акаунт.", identify: "Не вдалося визначити оголошення.", ownOnly: "Можна редагувати лише власні оголошення.", saveFailed: "Не вдалося зберегти зміни.", loginApply: "Увійдіть або створіть акаунт, щоб відгукнутися.", name: "Вкажіть своє ім’я.", message: "Напишіть повідомлення щонайменше з 10 символів.", noLongerOpen: "Це оголошення вже неактивне.", applicationsOfferOnly: "Відгук можна надіслати лише на вакансію роботодавця.", ownApplication: "Не можна відгукуватися на власне оголошення.", duplicateApplication: "Ви вже відгукнулися на цю вакансію.", applicationFailed: "Не вдалося надіслати відгук.", applicationSent: "Відгук надіслано." },
  },
  ru: {
    list: { eyebrow: "Рынок работы", title: "Работа в сфере уборки в Швеции", subtitle: "Отдельно смотрите работодателей, которые предлагают вакансии, и людей, которые ищут работу. Клиентские заказы на уборку остаются отдельным разделом Clean Jobs.", offerTab: "Предлагаю вакансию", seekerTab: "Ищу работу", offerTabDescription: "Вакансии от клининговых компаний и других работодателей.", seekerTabDescription: "Объявления людей, которые ищут работу в сфере уборки.", addOffer: "Добавить вакансию", addSeeker: "Добавить объявление о поиске работы", filterCity: "Фильтр по городу", allCities: "Все города", citySearchPlaceholder: "Начните вводить или выберите город", popularCities: "Популярные города", cityFilterHint: "Поиск работает по всем 290 коммунам Швеции. Города с активными объявлениями подсвечиваются автоматически.", show: "Показать", clear: "Очистить", emptyOffer: "В выбранном городе вакансий не найдено.", emptySeeker: "В выбранном городе объявлений о поиске работы не найдено.", offerBadge: "Предлагаю вакансию", seekerBadge: "Ищу работу" },
    create: { back: "К рынку работы", offerEyebrow: "Работодатель", seekerEyebrow: "Соискатель", offerTitle: "Добавить вакансию", seekerTitle: "Я ищу работу", freeLaunch: "бесплатно на этапе запуска", premiumFeature: "функция Premium", premiumRequired: "Для публикации нужен Premium.", seePremium: "Посмотреть Premium", publishOffer: "Опубликовать вакансию", publishSeeker: "Опубликовать моё объявление", switchToOffer: "Я предлагаю вакансию", switchToSeeker: "Я ищу работу" },
    edit: { back: "К объявлению", offerTitle: "Редактировать вакансию", seekerTitle: "Редактировать объявление о поиске работы", save: "Сохранить изменения" },
    form: { saving: "Сохранение…", offerTitle: "Должность", offerTitlePlaceholder: "Напр. уборщик", seekerTitle: "Какую работу ищу", seekerTitlePlaceholder: "Напр. уборщик / клинер", company: "Компания", companyPlaceholder: "Название компании", personName: "Имя", personNamePlaceholder: "Ваше имя", city: "Город", cityPlaceholder: "Stockholm", offerSchedule: "График работы", offerSchedulePlaceholder: "Полный день, будни 07:00–16:00", seekerSchedule: "Когда могу работать", seekerSchedulePlaceholder: "Напр. полный день, будни, могу начать сразу", offerSalary: "Оплата за час (необязательно)", seekerSalary: "Желаемая оплата за час (необязательно)", salaryPlaceholder: "165", salaryUnit: "SEK / час", offerDescription: "Описание вакансии", offerDescriptionPlaceholder: "Опишите обязанности, место работы и саму должность.", seekerDescription: "О себе / опыт", seekerDescriptionPlaceholder: "Расскажите о своём опыте, какую работу ищете и когда можете начать.", offerRequirements: "Требования", offerRequirementsPlaceholder: "Опыт, языки, водительские права или другие требования.", seekerRequirements: "Навыки", seekerRequirementsPlaceholder: "Языки, водительские права, опыт, обучение или другие сильные стороны.", email: "Контактный email", emailPlaceholder: "name@email.se", phone: "Контактный телефон", phonePlaceholder: "070-123 45 67", contactHint: "Нужно указать как минимум email или телефон." },
    detail: { back: "Все объявления", offerBadge: "Предлагаю вакансию", seekerBadge: "Ищу работу", aboutOffer: "О вакансии", aboutSeeker: "О кандидате", requirementsOffer: "Требования", requirementsSeeker: "Опыт и навыки", contact: "Контакты", email: "Email", phone: "Телефон", edit: "Редактировать объявление", applyTitle: "Откликнуться через Clean Jobs", applyFree: "Отклик на вакансию бесплатный.", loginToApply: "Войти, чтобы откликнуться", seekerContactNote: "Работодатель может связаться с кандидатом напрямую по контактам выше.", notFound: "Объявление не найдено", offerMetaDescription: (t,c,city) => `${c} ищет ${t} в ${city}. Посмотрите описание, требования и контакты на Clean Jobs.`, seekerMetaDescription: (t,p,city) => `${p} ищет работу как ${t} в ${city}. Посмотрите опыт и контакты на Clean Jobs.`, offerOgDescription: city => `Вакансия в ${city}.`, seekerOgDescription: city => `Кандидат ищет работу в ${city}.` },
    application: { sending: "Отправка…", submit: "Отправить отклик", name: "Имя", email: "Email", phone: "Телефон", message: "Сообщение", messagePlaceholder: "Кратко расскажите о своем опыте и почему вас интересует эта вакансия." },
    dashboard: { eyebrow: "Рынок работы", title: "Мои объявления", add: "Добавить объявление", empty: "Вы ещё не опубликовали ни одного объявления.", active: "Активное", closed: "Закрытое", offerBadge: "Предлагаю вакансию", seekerBadge: "Ищу работу", view: "Посмотреть", edit: "Редактировать", close: "Закрыть объявление", delete: "Удалить", deleteConfirm: "Удалить это объявление навсегда? Все отклики на него также будут удалены.", applications: "Отклики", noApplications: "Откликов пока нет.", seekerDirectContact: "Работодатели связываются с вами напрямую по контактам из объявления." },
    errors: { title: "Укажите корректное название работы или должности.", company: "Укажите корректное название компании.", person: "Укажите корректное имя.", listingType: "Выберите тип объявления.", city: "Укажите корректный город.", description: "Описание должно содержать от 20 до 10 000 символов.", schedule: "Текст графика или доступности слишком длинный.", salary: "Укажите оплату за час числом, например 165.", requirements: "Текст требований или навыков слишком длинный.", contact: "Укажите как минимум email или телефон.", email: "Укажите корректный email.", phone: "Номер телефона слишком длинный.", loginPublish: "Чтобы опубликовать объявление, нужно войти.", premium: "Для публикации объявлений нужен Premium.", publishBlocked: "Сейчас публикация недоступна.", publishFailed: "Не удалось опубликовать объявление.", login: "Нужно войти в аккаунт.", identify: "Не удалось определить объявление.", ownOnly: "Можно редактировать только свои объявления.", saveFailed: "Не удалось сохранить изменения.", loginApply: "Войдите или создайте аккаунт, чтобы откликнуться.", name: "Укажите своё имя.", message: "Напишите сообщение минимум из 10 символов.", noLongerOpen: "Это объявление уже неактивно.", applicationsOfferOnly: "Отклик можно отправить только на вакансию работодателя.", ownApplication: "Нельзя откликаться на собственное объявление.", duplicateApplication: "Вы уже откликнулись на эту вакансию.", applicationFailed: "Не удалось отправить отклик.", applicationSent: "Отклик отправлен." },
  },
  pl: {
    list: { eyebrow: "Rynek pracy", title: "Praca w sprzątaniu w Szwecji", subtitle: "Osobno przeglądaj pracodawców oferujących pracę oraz osoby szukające zatrudnienia. Zlecenia sprzątania od klientów pozostają oddzielną sekcją Clean Jobs.", offerTab: "Oferuję pracę", seekerTab: "Szukam pracy", offerTabDescription: "Oferty zatrudnienia od firm i innych pracodawców.", seekerTabDescription: "Ogłoszenia osób szukających pracy w sprzątaniu.", addOffer: "Dodaj ofertę pracy", addSeeker: "Dodaj ogłoszenie, że szukam pracy", filterCity: "Filtruj według miasta", allCities: "Wszystkie miasta", citySearchPlaceholder: "Wpisz lub wybierz miasto", popularCities: "Popularne miasta", cityFilterHint: "Możesz wyszukiwać we wszystkich 290 gminach Szwecji. Miasta z aktywnymi ogłoszeniami są automatycznie wyróżniane.", show: "Pokaż", clear: "Wyczyść", emptyOffer: "Nie znaleziono ofert pracy w wybranym mieście.", emptySeeker: "Nie znaleziono osób szukających pracy w wybranym mieście.", offerBadge: "Oferuję pracę", seekerBadge: "Szukam pracy" },
    create: { back: "Do rynku pracy", offerEyebrow: "Pracodawca", seekerEyebrow: "Osoba szukająca pracy", offerTitle: "Dodaj ofertę pracy", seekerTitle: "Szukam pracy", freeLaunch: "bezpłatnie podczas uruchomienia", premiumFeature: "funkcja Premium", premiumRequired: "Do publikacji wymagany jest Premium.", seePremium: "Zobacz Premium", publishOffer: "Opublikuj ofertę", publishSeeker: "Opublikuj moje ogłoszenie", switchToOffer: "Oferuję pracę", switchToSeeker: "Szukam pracy" },
    edit: { back: "Do ogłoszenia", offerTitle: "Edytuj ofertę pracy", seekerTitle: "Edytuj ogłoszenie osoby szukającej pracy", save: "Zapisz zmiany" },
    form: { saving: "Zapisywanie…", offerTitle: "Stanowisko", offerTitlePlaceholder: "np. pracownik sprzątający", seekerTitle: "Jakiej pracy szukam", seekerTitlePlaceholder: "np. pracownik sprzątający", company: "Firma", companyPlaceholder: "Nazwa firmy", personName: "Imię", personNamePlaceholder: "Twoje imię", city: "Miasto", cityPlaceholder: "Stockholm", offerSchedule: "Godziny / grafik", offerSchedulePlaceholder: "Pełny etat, dni robocze 07:00–16:00", seekerSchedule: "Dostępność", seekerSchedulePlaceholder: "np. pełny etat, dni robocze, mogę zacząć od razu", offerSalary: "Stawka godzinowa (opcjonalnie)", seekerSalary: "Oczekiwana stawka godzinowa (opcjonalnie)", salaryPlaceholder: "165", salaryUnit: "SEK / godz.", offerDescription: "Opis oferty", offerDescriptionPlaceholder: "Opisz obowiązki, miejsce pracy i rolę.", seekerDescription: "O mnie / doświadczenie", seekerDescriptionPlaceholder: "Opisz swoje doświadczenie, jakiej pracy szukasz i kiedy możesz zacząć.", offerRequirements: "Wymagania", offerRequirementsPlaceholder: "Doświadczenie, języki, prawo jazdy lub inne wymagania.", seekerRequirements: "Umiejętności", seekerRequirementsPlaceholder: "Języki, prawo jazdy, doświadczenie, szkolenia lub inne atuty.", email: "Email kontaktowy", emailPlaceholder: "name@email.se", phone: "Telefon kontaktowy", phonePlaceholder: "070-123 45 67", contactHint: "Wymagany jest co najmniej email lub numer telefonu." },
    detail: { back: "Wszystkie ogłoszenia", offerBadge: "Oferuję pracę", seekerBadge: "Szukam pracy", aboutOffer: "O pracy", aboutSeeker: "O kandydacie", requirementsOffer: "Wymagania", requirementsSeeker: "Doświadczenie i umiejętności", contact: "Kontakt", email: "Email", phone: "Telefon", edit: "Edytuj ogłoszenie", applyTitle: "Aplikuj przez Clean Jobs", applyFree: "Aplikowanie jest bezpłatne.", loginToApply: "Zaloguj się, aby aplikować", seekerContactNote: "Pracodawca może skontaktować się z kandydatem bezpośrednio przez dane kontaktowe powyżej.", notFound: "Nie znaleziono ogłoszenia", offerMetaDescription: (t,c,city) => `${c} szuka osoby na stanowisko ${t} w ${city}. Zobacz opis, wymagania i dane kontaktowe w Clean Jobs.`, seekerMetaDescription: (t,p,city) => `${p} szuka pracy jako ${t} w ${city}. Zobacz doświadczenie i dane kontaktowe w Clean Jobs.`, offerOgDescription: city => `Oferta pracy w ${city}.`, seekerOgDescription: city => `Osoba szuka pracy w ${city}.` },
    application: { sending: "Wysyłanie…", submit: "Wyślij aplikację", name: "Imię", email: "Email", phone: "Telefon", message: "Wiadomość", messagePlaceholder: "Krótko opisz swoje doświadczenie i dlaczego aplikujesz." },
    dashboard: { eyebrow: "Rynek pracy", title: "Moje ogłoszenia", add: "Dodaj ogłoszenie", empty: "Nie opublikowano jeszcze żadnych ogłoszeń.", active: "Aktywne", closed: "Zamknięte", offerBadge: "Oferuję pracę", seekerBadge: "Szukam pracy", view: "Zobacz", edit: "Edytuj", close: "Zamknij ogłoszenie", delete: "Usuń", deleteConfirm: "Usunąć to ogłoszenie na stałe? Wszystkie aplikacje również zostaną usunięte.", applications: "Aplikacje", noApplications: "Brak aplikacji.", seekerDirectContact: "Pracodawcy kontaktują się z Tobą bezpośrednio przez dane w ogłoszeniu." },
    errors: { title: "Podaj prawidłową nazwę pracy lub stanowiska.", company: "Podaj prawidłową nazwę firmy.", person: "Podaj prawidłowe imię.", listingType: "Wybierz typ ogłoszenia.", city: "Podaj prawidłowe miasto.", description: "Opis musi mieć od 20 do 10 000 znaków.", schedule: "Opis grafiku lub dostępności jest za długi.", salary: "Podaj stawkę godzinową jako liczbę, np. 165.", requirements: "Opis wymagań lub umiejętności jest za długi.", contact: "Podaj co najmniej email lub numer telefonu.", email: "Podaj prawidłowy adres email.", phone: "Numer telefonu jest za długi.", loginPublish: "Musisz się zalogować, aby opublikować ogłoszenie.", premium: "Premium jest wymagany do publikowania ogłoszeń.", publishBlocked: "Publikowanie jest teraz niedostępne.", publishFailed: "Nie udało się opublikować ogłoszenia.", login: "Musisz się zalogować.", identify: "Nie udało się zidentyfikować ogłoszenia.", ownOnly: "Możesz edytować tylko własne ogłoszenia.", saveFailed: "Nie udało się zapisać zmian.", loginApply: "Zaloguj się lub utwórz konto, aby aplikować.", name: "Podaj swoje imię.", message: "Napisz wiadomość o długości co najmniej 10 znaków.", noLongerOpen: "To ogłoszenie nie jest już aktywne.", applicationsOfferOnly: "Aplikacje można wysyłać tylko na oferty pracy pracodawców.", ownApplication: "Nie możesz aplikować na własne ogłoszenie.", duplicateApplication: "Już aplikowałeś na tę ofertę.", applicationFailed: "Nie udało się wysłać aplikacji.", applicationSent: "Aplikacja została wysłana." },
  },
}

export function getVacancyDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.sv
}
