import type { Locale } from "@/lib/i18n"

export type VacancyDictionary = {
  list: {
    eyebrow: string
    title: string
    subtitle: string
    add: string
    filterCity: string
    allCities: string
    show: string
    clear: string
    empty: string
  }
  create: {
    back: string
    eyebrow: string
    title: string
    freeLaunch: string
    premiumFeature: string
    premiumRequired: string
    seePremium: string
    publish: string
  }
  edit: { back: string; title: string; save: string }
  form: {
    saving: string
    title: string
    titlePlaceholder: string
    company: string
    companyPlaceholder: string
    city: string
    cityPlaceholder: string
    schedule: string
    schedulePlaceholder: string
    salary: string
    salaryPlaceholder: string
    salaryUnit: string
    description: string
    descriptionPlaceholder: string
    requirements: string
    requirementsPlaceholder: string
    email: string
    emailPlaceholder: string
    phone: string
    phonePlaceholder: string
    contactHint: string
  }
  detail: {
    back: string
    about: string
    requirements: string
    contact: string
    email: string
    phone: string
    edit: string
    applyTitle: string
    applyFree: string
    loginToApply: string
    notFound: string
    metaDescription: (title: string, company: string, city: string) => string
    ogDescription: (city: string) => string
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
    view: string
    edit: string
    close: string
    applications: string
    noApplications: string
  }
  errors: {
    title: string
    company: string
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
    ownApplication: string
    duplicateApplication: string
    applicationFailed: string
    applicationSent: string
  }
}

const dictionaries: Record<Locale, VacancyDictionary> = {
  sv: {
    list: { eyebrow: "Lediga jobb", title: "Lediga städjobb i Sverige", subtitle: "Anställningar hos städföretag och arbetsgivare. Det här är separat från kundernas städuppdrag på Clean Jobs.", add: "Lägg till ledigt jobb", filterCity: "Filtrera efter ort", allCities: "Alla orter", show: "Visa jobb", clear: "Rensa", empty: "Inga lediga jobb hittades för den valda orten." },
    create: { back: "Till lediga jobb", eyebrow: "Arbetsgivare", title: "Lägg till ledigt jobb", freeLaunch: "gratis under lanseringen", premiumFeature: "en Premium-funktion", premiumRequired: "Premium krävs för att publicera.", seePremium: "Se Premium", publish: "Publicera jobb" },
    edit: { back: "Till annonsen", title: "Redigera ledigt jobb", save: "Spara ändringar" },
    form: { saving: "Sparar…", title: "Jobbtitel", titlePlaceholder: "Ex. Lokalvårdare", company: "Företag", companyPlaceholder: "Företagsnamn", city: "Ort", cityPlaceholder: "Stockholm", schedule: "Arbetstid / schema", schedulePlaceholder: "Heltid, vardagar 07:00–16:00", salary: "Timlön (valfritt)", salaryPlaceholder: "165", salaryUnit: "SEK / timme", description: "Beskrivning", descriptionPlaceholder: "Beskriv arbetsuppgifter, arbetsplats och vad rollen innebär.", requirements: "Krav", requirementsPlaceholder: "Erfarenhet, språk, körkort eller andra krav.", email: "Kontakt e-post", emailPlaceholder: "jobb@foretag.se", phone: "Kontakt telefon", phonePlaceholder: "070-123 45 67", contactHint: "Minst e-post eller telefon krävs." },
    detail: { back: "Alla lediga jobb", about: "Om jobbet", requirements: "Krav", contact: "Kontakt", email: "E-post", phone: "Telefon", edit: "Redigera annonsen", applyTitle: "Ansök via Clean Jobs", applyFree: "Det är gratis att ansöka.", loginToApply: "Logga in för att ansöka", notFound: "Ledigt jobb hittades inte", metaDescription: (t,c,city) => `${c} söker ${t} i ${city}. Se arbetsbeskrivning, krav och kontaktuppgifter på Clean Jobs.`, ogDescription: city => `Ledigt jobb i ${city}.` },
    application: { sending: "Skickar…", submit: "Skicka ansökan", name: "Namn", email: "E-post", phone: "Telefon", message: "Meddelande", messagePlaceholder: "Berätta kort om din erfarenhet och varför du söker tjänsten." },
    dashboard: { eyebrow: "Arbetsgivare", title: "Mina lediga jobb", add: "Lägg till jobb", empty: "Du har inte publicerat några lediga jobb ännu.", active: "Aktiv", closed: "Stängd", view: "Visa", edit: "Redigera", close: "Stäng jobb", applications: "Ansökningar", noApplications: "Inga ansökningar ännu." },
    errors: { title: "Ange en giltig jobbtitel.", company: "Ange ett giltigt företagsnamn.", city: "Ange en giltig ort.", description: "Beskrivningen måste vara mellan 20 och 10 000 tecken.", schedule: "Arbetstiden är för lång.", salary: "Ange timlönen som ett nummer, till exempel 165.", requirements: "Kraven är för långa.", contact: "Ange minst e-post eller telefon som kontakt.", email: "Ange en giltig e-postadress.", phone: "Telefonnumret är för långt.", loginPublish: "Du måste vara inloggad för att publicera en ledig tjänst.", premium: "Premium krävs för att publicera lediga jobb.", publishBlocked: "Du kan inte publicera just nu.", publishFailed: "Det gick inte att publicera jobbet.", login: "Du måste vara inloggad.", identify: "Jobbet kunde inte identifieras.", ownOnly: "Du kan bara redigera dina egna jobb.", saveFailed: "Det gick inte att spara ändringarna.", loginApply: "Logga in eller skapa ett konto för att ansöka.", name: "Ange ditt namn.", message: "Skriv ett meddelande på minst 10 tecken.", noLongerOpen: "Den här tjänsten är inte längre öppen.", ownApplication: "Du kan inte ansöka till din egen annons.", duplicateApplication: "Du har redan ansökt till den här tjänsten.", applicationFailed: "Ansökan kunde inte skickas.", applicationSent: "Ansökan är skickad." },
  },
  en: {
    list: { eyebrow: "Vacancies", title: "Cleaning jobs in Sweden", subtitle: "Employment opportunities from cleaning companies and employers. These are separate from customer cleaning assignments on Clean Jobs.", add: "Post a vacancy", filterCity: "Filter by city", allCities: "All cities", show: "Show jobs", clear: "Clear", empty: "No vacancies found for the selected city." },
    create: { back: "Back to vacancies", eyebrow: "Employer", title: "Post a vacancy", freeLaunch: "free during launch", premiumFeature: "a Premium feature", premiumRequired: "Premium is required to publish.", seePremium: "See Premium", publish: "Publish vacancy" },
    edit: { back: "Back to vacancy", title: "Edit vacancy", save: "Save changes" },
    form: { saving: "Saving…", title: "Job title", titlePlaceholder: "e.g. Cleaner", company: "Company", companyPlaceholder: "Company name", city: "City", cityPlaceholder: "Stockholm", schedule: "Working hours / schedule", schedulePlaceholder: "Full time, weekdays 07:00–16:00", salary: "Hourly salary (optional)", salaryPlaceholder: "165", salaryUnit: "SEK / hour", description: "Description", descriptionPlaceholder: "Describe the duties, workplace and role.", requirements: "Requirements", requirementsPlaceholder: "Experience, languages, driving licence or other requirements.", email: "Contact email", emailPlaceholder: "jobs@company.se", phone: "Contact phone", phonePlaceholder: "070-123 45 67", contactHint: "At least an email or phone number is required." },
    detail: { back: "All vacancies", about: "About the job", requirements: "Requirements", contact: "Contact", email: "Email", phone: "Phone", edit: "Edit vacancy", applyTitle: "Apply via Clean Jobs", applyFree: "Applying is free.", loginToApply: "Log in to apply", notFound: "Vacancy not found", metaDescription: (t,c,city) => `${c} is hiring a ${t} in ${city}. See the description, requirements and contact details on Clean Jobs.`, ogDescription: city => `Vacancy in ${city}.` },
    application: { sending: "Sending…", submit: "Send application", name: "Name", email: "Email", phone: "Phone", message: "Message", messagePlaceholder: "Briefly describe your experience and why you are applying." },
    dashboard: { eyebrow: "Employer", title: "My vacancies", add: "Add vacancy", empty: "You have not published any vacancies yet.", active: "Active", closed: "Closed", view: "View", edit: "Edit", close: "Close vacancy", applications: "Applications", noApplications: "No applications yet." },
    errors: { title: "Enter a valid job title.", company: "Enter a valid company name.", city: "Enter a valid city.", description: "The description must be between 20 and 10,000 characters.", schedule: "The schedule text is too long.", salary: "Enter the hourly salary as a number, for example 165.", requirements: "The requirements text is too long.", contact: "Provide at least an email or phone number.", email: "Enter a valid email address.", phone: "The phone number is too long.", loginPublish: "You must be logged in to publish a vacancy.", premium: "Premium is required to publish vacancies.", publishBlocked: "You cannot publish right now.", publishFailed: "The vacancy could not be published.", login: "You must be logged in.", identify: "The vacancy could not be identified.", ownOnly: "You can only edit your own vacancies.", saveFailed: "The changes could not be saved.", loginApply: "Log in or create an account to apply.", name: "Enter your name.", message: "Write a message of at least 10 characters.", noLongerOpen: "This vacancy is no longer open.", ownApplication: "You cannot apply to your own vacancy.", duplicateApplication: "You have already applied to this vacancy.", applicationFailed: "The application could not be sent.", applicationSent: "Application sent." },
  },
  uk: {
    list: { eyebrow: "Вакансії", title: "Вакансії у сфері клінінгу в Швеції", subtitle: "Робота в клінінгових компаніях та в інших роботодавців. Це окремий розділ від замовлень клієнтів на прибирання в Clean Jobs.", add: "Додати вакансію", filterCity: "Фільтр за містом", allCities: "Усі міста", show: "Показати вакансії", clear: "Очистити", empty: "У вибраному місті вакансій не знайдено." },
    create: { back: "До вакансій", eyebrow: "Роботодавець", title: "Додати вакансію", freeLaunch: "безкоштовна на етапі запуску", premiumFeature: "функція Premium", premiumRequired: "Для публікації потрібен Premium.", seePremium: "Переглянути Premium", publish: "Опублікувати вакансію" },
    edit: { back: "До вакансії", title: "Редагувати вакансію", save: "Зберегти зміни" },
    form: { saving: "Збереження…", title: "Посада", titlePlaceholder: "Напр. прибиральник", company: "Компанія", companyPlaceholder: "Назва компанії", city: "Місто", cityPlaceholder: "Stockholm", schedule: "Графік роботи", schedulePlaceholder: "Повний день, будні 07:00–16:00", salary: "Оплата за годину (необов’язково)", salaryPlaceholder: "165", salaryUnit: "SEK / год", description: "Опис", descriptionPlaceholder: "Опишіть обов’язки, місце роботи та саму посаду.", requirements: "Вимоги", requirementsPlaceholder: "Досвід, мови, водійське посвідчення або інші вимоги.", email: "Контактний email", emailPlaceholder: "jobs@company.se", phone: "Контактний телефон", phonePlaceholder: "070-123 45 67", contactHint: "Потрібно вказати щонайменше email або телефон." },
    detail: { back: "Усі вакансії", about: "Про вакансію", requirements: "Вимоги", contact: "Контакти", email: "Email", phone: "Телефон", edit: "Редагувати вакансію", applyTitle: "Відгукнутися через Clean Jobs", applyFree: "Відгук на вакансію безкоштовний.", loginToApply: "Увійти, щоб відгукнутися", notFound: "Вакансію не знайдено", metaDescription: (t,c,city) => `${c} шукає ${t} у ${city}. Перегляньте опис, вимоги та контакти на Clean Jobs.`, ogDescription: city => `Вакансія у ${city}.` },
    application: { sending: "Надсилання…", submit: "Надіслати відгук", name: "Ім’я", email: "Email", phone: "Телефон", message: "Повідомлення", messagePlaceholder: "Коротко розкажіть про свій досвід і чому вас цікавить ця вакансія." },
    dashboard: { eyebrow: "Роботодавець", title: "Мої вакансії", add: "Додати вакансію", empty: "Ви ще не опублікували жодної вакансії.", active: "Активна", closed: "Закрита", view: "Переглянути", edit: "Редагувати", close: "Закрити вакансію", applications: "Відгуки", noApplications: "Відгуків поки немає." },
    errors: { title: "Вкажіть коректну назву посади.", company: "Вкажіть коректну назву компанії.", city: "Вкажіть коректне місто.", description: "Опис має містити від 20 до 10 000 символів.", schedule: "Текст графіка занадто довгий.", salary: "Вкажіть оплату за годину числом, наприклад 165.", requirements: "Текст вимог занадто довгий.", contact: "Вкажіть щонайменше email або телефон.", email: "Вкажіть коректний email.", phone: "Номер телефону занадто довгий.", loginPublish: "Щоб опублікувати вакансію, потрібно увійти.", premium: "Для публікації вакансій потрібен Premium.", publishBlocked: "Зараз публікація недоступна.", publishFailed: "Не вдалося опублікувати вакансію.", login: "Потрібно увійти в акаунт.", identify: "Не вдалося визначити вакансію.", ownOnly: "Можна редагувати лише власні вакансії.", saveFailed: "Не вдалося зберегти зміни.", loginApply: "Увійдіть або створіть акаунт, щоб відгукнутися.", name: "Вкажіть своє ім’я.", message: "Напишіть повідомлення щонайменше з 10 символів.", noLongerOpen: "Ця вакансія вже закрита.", ownApplication: "Не можна відгукуватися на власну вакансію.", duplicateApplication: "Ви вже відгукнулися на цю вакансію.", applicationFailed: "Не вдалося надіслати відгук.", applicationSent: "Відгук надіслано." },
  },
  ru: {
    list: { eyebrow: "Вакансии", title: "Вакансии в клининге в Швеции", subtitle: "Работа в клининговых компаниях и у других работодателей. Это отдельный раздел от заказов клиентов на уборку в Clean Jobs.", add: "Добавить вакансию", filterCity: "Фильтр по городу", allCities: "Все города", show: "Показать вакансии", clear: "Очистить", empty: "В выбранном городе вакансий не найдено." },
    create: { back: "К вакансиям", eyebrow: "Работодатель", title: "Добавить вакансию", freeLaunch: "бесплатна на этапе запуска", premiumFeature: "функция Premium", premiumRequired: "Для публикации нужен Premium.", seePremium: "Посмотреть Premium", publish: "Опубликовать вакансию" },
    edit: { back: "К вакансии", title: "Редактировать вакансию", save: "Сохранить изменения" },
    form: { saving: "Сохранение…", title: "Должность", titlePlaceholder: "Напр. уборщик", company: "Компания", companyPlaceholder: "Название компании", city: "Город", cityPlaceholder: "Stockholm", schedule: "График работы", schedulePlaceholder: "Полный день, будни 07:00–16:00", salary: "Оплата за час (необязательно)", salaryPlaceholder: "165", salaryUnit: "SEK / час", description: "Описание", descriptionPlaceholder: "Опишите обязанности, место работы и саму должность.", requirements: "Требования", requirementsPlaceholder: "Опыт, языки, водительские права или другие требования.", email: "Контактный email", emailPlaceholder: "jobs@company.se", phone: "Контактный телефон", phonePlaceholder: "070-123 45 67", contactHint: "Нужно указать как минимум email или телефон." },
    detail: { back: "Все вакансии", about: "О вакансии", requirements: "Требования", contact: "Контакты", email: "Email", phone: "Телефон", edit: "Редактировать вакансию", applyTitle: "Откликнуться через Clean Jobs", applyFree: "Отклик на вакансию бесплатный.", loginToApply: "Войти, чтобы откликнуться", notFound: "Вакансия не найдена", metaDescription: (t,c,city) => `${c} ищет ${t} в ${city}. Посмотрите описание, требования и контакты на Clean Jobs.`, ogDescription: city => `Вакансия в ${city}.` },
    application: { sending: "Отправка…", submit: "Отправить отклик", name: "Имя", email: "Email", phone: "Телефон", message: "Сообщение", messagePlaceholder: "Кратко расскажите о своем опыте и почему вас интересует эта вакансия." },
    dashboard: { eyebrow: "Работодатель", title: "Мои вакансии", add: "Добавить вакансию", empty: "Вы еще не опубликовали ни одной вакансии.", active: "Активна", closed: "Закрыта", view: "Посмотреть", edit: "Редактировать", close: "Закрыть вакансию", applications: "Отклики", noApplications: "Откликов пока нет." },
    errors: { title: "Укажите корректную должность.", company: "Укажите корректное название компании.", city: "Укажите корректный город.", description: "Описание должно содержать от 20 до 10 000 символов.", schedule: "Текст графика слишком длинный.", salary: "Укажите оплату за час числом, например 165.", requirements: "Текст требований слишком длинный.", contact: "Укажите как минимум email или телефон.", email: "Укажите корректный email.", phone: "Номер телефона слишком длинный.", loginPublish: "Чтобы опубликовать вакансию, нужно войти.", premium: "Для публикации вакансий нужен Premium.", publishBlocked: "Сейчас публикация недоступна.", publishFailed: "Не удалось опубликовать вакансию.", login: "Нужно войти в аккаунт.", identify: "Не удалось определить вакансию.", ownOnly: "Можно редактировать только свои вакансии.", saveFailed: "Не удалось сохранить изменения.", loginApply: "Войдите или создайте аккаунт, чтобы откликнуться.", name: "Укажите свое имя.", message: "Напишите сообщение минимум из 10 символов.", noLongerOpen: "Эта вакансия уже закрыта.", ownApplication: "Нельзя откликаться на собственную вакансию.", duplicateApplication: "Вы уже откликнулись на эту вакансию.", applicationFailed: "Не удалось отправить отклик.", applicationSent: "Отклик отправлен." },
  },
  pl: {
    list: { eyebrow: "Oferty pracy", title: "Praca w sprzątaniu w Szwecji", subtitle: "Oferty zatrudnienia od firm sprzątających i innych pracodawców. To osobna sekcja od zleceń sprzątania klientów w Clean Jobs.", add: "Dodaj ofertę pracy", filterCity: "Filtruj według miasta", allCities: "Wszystkie miasta", show: "Pokaż oferty", clear: "Wyczyść", empty: "Nie znaleziono ofert pracy w wybranym mieście." },
    create: { back: "Do ofert pracy", eyebrow: "Pracodawca", title: "Dodaj ofertę pracy", freeLaunch: "bezpłatna podczas uruchomienia", premiumFeature: "funkcja Premium", premiumRequired: "Do publikacji wymagany jest Premium.", seePremium: "Zobacz Premium", publish: "Opublikuj ofertę" },
    edit: { back: "Do oferty", title: "Edytuj ofertę pracy", save: "Zapisz zmiany" },
    form: { saving: "Zapisywanie…", title: "Stanowisko", titlePlaceholder: "np. pracownik sprzątający", company: "Firma", companyPlaceholder: "Nazwa firmy", city: "Miasto", cityPlaceholder: "Stockholm", schedule: "Godziny / grafik", schedulePlaceholder: "Pełny etat, dni robocze 07:00–16:00", salary: "Stawka godzinowa (opcjonalnie)", salaryPlaceholder: "165", salaryUnit: "SEK / godz.", description: "Opis", descriptionPlaceholder: "Opisz obowiązki, miejsce pracy i rolę.", requirements: "Wymagania", requirementsPlaceholder: "Doświadczenie, języki, prawo jazdy lub inne wymagania.", email: "Email kontaktowy", emailPlaceholder: "jobs@company.se", phone: "Telefon kontaktowy", phonePlaceholder: "070-123 45 67", contactHint: "Wymagany jest co najmniej email lub numer telefonu." },
    detail: { back: "Wszystkie oferty", about: "O pracy", requirements: "Wymagania", contact: "Kontakt", email: "Email", phone: "Telefon", edit: "Edytuj ofertę", applyTitle: "Aplikuj przez Clean Jobs", applyFree: "Aplikowanie jest bezpłatne.", loginToApply: "Zaloguj się, aby aplikować", notFound: "Nie znaleziono oferty", metaDescription: (t,c,city) => `${c} szuka osoby na stanowisko ${t} w ${city}. Zobacz opis, wymagania i dane kontaktowe w Clean Jobs.`, ogDescription: city => `Oferta pracy w ${city}.` },
    application: { sending: "Wysyłanie…", submit: "Wyślij aplikację", name: "Imię", email: "Email", phone: "Telefon", message: "Wiadomość", messagePlaceholder: "Krótko opisz swoje doświadczenie i dlaczego aplikujesz." },
    dashboard: { eyebrow: "Pracodawca", title: "Moje oferty pracy", add: "Dodaj ofertę", empty: "Nie opublikowano jeszcze żadnych ofert pracy.", active: "Aktywna", closed: "Zamknięta", view: "Zobacz", edit: "Edytuj", close: "Zamknij ofertę", applications: "Aplikacje", noApplications: "Brak aplikacji." },
    errors: { title: "Podaj prawidłową nazwę stanowiska.", company: "Podaj prawidłową nazwę firmy.", city: "Podaj prawidłowe miasto.", description: "Opis musi mieć od 20 do 10 000 znaków.", schedule: "Opis grafiku jest za długi.", salary: "Podaj stawkę godzinową jako liczbę, np. 165.", requirements: "Wymagania są za długie.", contact: "Podaj co najmniej email lub numer telefonu.", email: "Podaj prawidłowy adres email.", phone: "Numer telefonu jest za długi.", loginPublish: "Musisz się zalogować, aby opublikować ofertę.", premium: "Premium jest wymagany do publikowania ofert pracy.", publishBlocked: "Publikowanie jest teraz niedostępne.", publishFailed: "Nie udało się opublikować oferty.", login: "Musisz się zalogować.", identify: "Nie udało się zidentyfikować oferty.", ownOnly: "Możesz edytować tylko własne oferty.", saveFailed: "Nie udało się zapisać zmian.", loginApply: "Zaloguj się lub utwórz konto, aby aplikować.", name: "Podaj swoje imię.", message: "Napisz wiadomość o długości co najmniej 10 znaków.", noLongerOpen: "Ta oferta nie jest już aktywna.", ownApplication: "Nie możesz aplikować na własną ofertę.", duplicateApplication: "Już aplikowałeś na tę ofertę.", applicationFailed: "Nie udało się wysłać aplikacji.", applicationSent: "Aplikacja została wysłana." },
  },
}

export function getVacancyDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.sv
}
