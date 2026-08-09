import type { CompanySiteLocale } from "./types"

export type CompanySitePublicCopy = {
  services: string
  servicesText: string
  pricing: string
  from: string
  perHour: string
  minimumOrder: string
  hours: string
  rut: string
  rutText: string
  about: string
  areas: string
  languages: string
  gallery: string
  reviews: string
  noReviews: string
  openingHours: string
  faq: string
  contact: string
  call: string
  email: string
  requestQuote: string
  verified: string
  poweredBy: string
  location: string
  founded: string
  organizationNumber: string
  reviewerFallback: string
  preview: string
  backToEditor: string
  monday: string
  tuesday: string
  wednesday: string
  thursday: string
  friday: string
  saturday: string
  sunday: string
  closed: string
}

export const companySitePublicCopy: Record<
  CompanySiteLocale,
  CompanySitePublicCopy
> = {
  sv: {
    services: "Våra tjänster",
    servicesText: "Professionella städtjänster anpassade efter dina behov.",
    pricing: "Priser och villkor",
    from: "Från",
    perHour: "kr/timme",
    minimumOrder: "Minsta bokning",
    hours: "timmar",
    rut: "RUT-avdrag",
    rutText: "RUT-avdrag kan vara tillgängligt för berättigade tjänster.",
    about: "Om oss",
    areas: "Vi arbetar i",
    languages: "Språk",
    gallery: "Våra arbeten",
    reviews: "Vad kunder säger",
    noReviews: "Inga publicerade omdömen ännu.",
    openingHours: "Öppettider",
    faq: "Vanliga frågor",
    contact: "Kontakta oss",
    call: "Ring oss",
    email: "Skicka e-post",
    requestQuote: "Begär offert",
    verified: "Verifierat företag",
    poweredBy: "Webbplats skapad med Clean Jobs",
    location: "Ort",
    founded: "Grundat",
    organizationNumber: "Organisationsnummer",
    reviewerFallback: "Clean Jobs-kund",
    preview: "Förhandsvisning",
    backToEditor: "Tillbaka till redigeraren",
    monday: "Måndag",
    tuesday: "Tisdag",
    wednesday: "Onsdag",
    thursday: "Torsdag",
    friday: "Fredag",
    saturday: "Lördag",
    sunday: "Söndag",
    closed: "Stängt",
  },
  en: {
    services: "Our services",
    servicesText: "Professional cleaning services tailored to your needs.",
    pricing: "Pricing and terms",
    from: "From",
    perHour: "SEK/hour",
    minimumOrder: "Minimum booking",
    hours: "hours",
    rut: "RUT deduction",
    rutText: "RUT deduction may be available for eligible services.",
    about: "About us",
    areas: "Areas we serve",
    languages: "Languages",
    gallery: "Our work",
    reviews: "What customers say",
    noReviews: "No published reviews yet.",
    openingHours: "Opening hours",
    faq: "Frequently asked questions",
    contact: "Contact us",
    call: "Call us",
    email: "Send email",
    requestQuote: "Request a quote",
    verified: "Verified company",
    poweredBy: "Website powered by Clean Jobs",
    location: "Location",
    founded: "Founded",
    organizationNumber: "Organisation number",
    reviewerFallback: "Clean Jobs customer",
    preview: "Preview",
    backToEditor: "Back to editor",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
  },
  uk: {
    services: "Наші послуги",
    servicesText: "Професійні клінінгові послуги під ваші потреби.",
    pricing: "Ціни та умови",
    from: "Від",
    perHour: "крон/год",
    minimumOrder: "Мінімальне замовлення",
    hours: "годин",
    rut: "RUT-avdrag",
    rutText: "Для відповідних послуг може бути доступний RUT-avdrag.",
    about: "Про нас",
    areas: "Ми працюємо в",
    languages: "Мови",
    gallery: "Наші роботи",
    reviews: "Відгуки клієнтів",
    noReviews: "Опублікованих відгуків поки немає.",
    openingHours: "Графік роботи",
    faq: "Поширені запитання",
    contact: "Зв’язатися з нами",
    call: "Зателефонувати",
    email: "Надіслати email",
    requestQuote: "Отримати пропозицію",
    verified: "Перевірена компанія",
    poweredBy: "Сайт працює на Clean Jobs",
    location: "Місто",
    founded: "Засновано",
    organizationNumber: "Організаційний номер",
    reviewerFallback: "Клієнт Clean Jobs",
    preview: "Попередній перегляд",
    backToEditor: "Назад до редактора",
    monday: "Понеділок",
    tuesday: "Вівторок",
    wednesday: "Середа",
    thursday: "Четвер",
    friday: "П’ятниця",
    saturday: "Субота",
    sunday: "Неділя",
    closed: "Зачинено",
  },
  ru: {
    services: "Наши услуги",
    servicesText: "Профессиональные клининговые услуги под ваши потребности.",
    pricing: "Цены и условия",
    from: "От",
    perHour: "крон/час",
    minimumOrder: "Минимальный заказ",
    hours: "часов",
    rut: "RUT-avdrag",
    rutText: "Для подходящих услуг может быть доступен RUT-avdrag.",
    about: "О нас",
    areas: "Мы работаем в",
    languages: "Языки",
    gallery: "Наши работы",
    reviews: "Отзывы клиентов",
    noReviews: "Опубликованных отзывов пока нет.",
    openingHours: "График работы",
    faq: "Частые вопросы",
    contact: "Связаться с нами",
    call: "Позвонить",
    email: "Отправить email",
    requestQuote: "Получить предложение",
    verified: "Проверенная компания",
    poweredBy: "Сайт работает на Clean Jobs",
    location: "Город",
    founded: "Основано",
    organizationNumber: "Организационный номер",
    reviewerFallback: "Клиент Clean Jobs",
    preview: "Предпросмотр",
    backToEditor: "Назад в редактор",
    monday: "Понедельник",
    tuesday: "Вторник",
    wednesday: "Среда",
    thursday: "Четверг",
    friday: "Пятница",
    saturday: "Суббота",
    sunday: "Воскресенье",
    closed: "Закрыто",
  },
  pl: {
    services: "Nasze usługi",
    servicesText: "Profesjonalne usługi sprzątania dopasowane do Twoich potrzeb.",
    pricing: "Ceny i warunki",
    from: "Od",
    perHour: "SEK/godz.",
    minimumOrder: "Minimalne zamówienie",
    hours: "godziny",
    rut: "Ulga RUT",
    rutText: "Ulga RUT może być dostępna dla kwalifikujących się usług.",
    about: "O nas",
    areas: "Obsługiwane obszary",
    languages: "Języki",
    gallery: "Nasze realizacje",
    reviews: "Opinie klientów",
    noReviews: "Brak opublikowanych opinii.",
    openingHours: "Godziny otwarcia",
    faq: "Najczęstsze pytania",
    contact: "Skontaktuj się z nami",
    call: "Zadzwoń",
    email: "Wyślij email",
    requestQuote: "Poproś o wycenę",
    verified: "Zweryfikowana firma",
    poweredBy: "Strona działa dzięki Clean Jobs",
    location: "Lokalizacja",
    founded: "Założono",
    organizationNumber: "Numer organizacyjny",
    reviewerFallback: "Klient Clean Jobs",
    preview: "Podgląd",
    backToEditor: "Wróć do edytora",
    monday: "Poniedziałek",
    tuesday: "Wtorek",
    wednesday: "Środa",
    thursday: "Czwartek",
    friday: "Piątek",
    saturday: "Sobota",
    sunday: "Niedziela",
    closed: "Zamknięte",
  },
}
