import type { BookingStatus } from "@/lib/bookings/types"
import type { CompanyLeadStatus } from "@/lib/company-leads/types"
import type { Locale } from "@/lib/i18n"

export type CompanyWorkspaceSection =
  | "overview"
  | "leads"
  | "bookings"
  | "websites"
  | "services"
  | "billing"

export type CompanyDashboardCopy = {
  eyebrow: string
  title: string
  subtitle: string
  personalDashboard: string
  company: string
  selectCompany: string
  switchCompany: string
  verified: string
  notVerified: string
  premium: string
  free: string
  publicProfile: string
  openWebsite: string
  editCompany: string
  newLeads: string
  conversion: string
  pipeline: string
  pendingBookings: string
  nextSevenDays: string
  revenueThisMonth: string
  attention: string
  attentionText: string
  attentionEmpty: string
  lead: string
  booking: string
  openLead: string
  openBooking: string
  upcoming: string
  upcomingText: string
  upcomingEmpty: string
  setup: string
  website: string
  published: string
  draft: string
  noWebsite: string
  bookingOnline: string
  bookingOffline: string
  recurringOn: string
  recurringOff: string
  customDomain: string
  noDomain: string
  rutOn: string
  rutOff: string
  quickActions: string
  leads: string
  bookings: string
  websites: string
  services: string
  bookingSettings: string
  billing: string
  recentActivity: string
  recentActivityText: string
  activityEmpty: string
  leadActivity: string
  bookingActivity: string
  websiteActivity: string
  created: string
  updated: string
  price: string
  customer: string
  service: string
  noCompaniesTitle: string
  noCompaniesText: string
  browseCompanies: string
  claims: string
  navOverview: string
  navLeads: string
  navBookings: string
  navWebsites: string
  navServices: string
  navBilling: string
  leadStatuses: Record<CompanyLeadStatus, string>
  bookingStatuses: Record<BookingStatus, string>
}

export const companyDashboardCopy: Record<Locale, CompanyDashboardCopy> = {
  sv: {
    eyebrow: "Företagsyta",
    title: "Företagsdashboard",
    subtitle: "En samlad arbetsyta för leads, bokningar, kommande städningar, webbplats och affärsstatus.",
    personalDashboard: "Personlig dashboard",
    company: "Företag",
    selectCompany: "Välj företag",
    switchCompany: "Byt företag",
    verified: "Verifierat företag",
    notVerified: "Ej verifierat",
    premium: "Premium aktiv",
    free: "Gratis plan",
    publicProfile: "Öppna företagsprofil",
    openWebsite: "Öppna webbplats",
    editCompany: "Redigera företag",
    newLeads: "Nya leads",
    conversion: "Konvertering",
    pipeline: "Pipeline-värde",
    pendingBookings: "Väntande bokningar",
    nextSevenDays: "Nästa 7 dagar",
    revenueThisMonth: "Intäkt denna månad",
    attention: "Behöver uppmärksamhet",
    attentionText: "Nya leads och bokningar som väntar på åtgärd.",
    attentionEmpty: "Inga nya leads eller väntande bokningar just nu.",
    lead: "Lead",
    booking: "Bokning",
    openLead: "Öppna lead",
    openBooking: "Öppna bokning",
    upcoming: "Kommande städningar",
    upcomingText: "Bekräftade städtillfällen under de kommande sju dagarna.",
    upcomingEmpty: "Inga bekräftade städningar under de kommande sju dagarna.",
    setup: "Företagsstatus",
    website: "Webbplats",
    published: "Publicerad",
    draft: "Utkast",
    noWebsite: "Ingen webbplats",
    bookingOnline: "Onlinebokning aktiv",
    bookingOffline: "Onlinebokning av",
    recurringOn: "Återkommande bokningar aktiva",
    recurringOff: "Återkommande bokningar av",
    customDomain: "Egen domän",
    noDomain: "Ingen egen domän",
    rutOn: "RUT tillgängligt",
    rutOff: "RUT ej aktiverat",
    quickActions: "Snabba åtgärder",
    leads: "Kundleads",
    bookings: "Företagsbokningar",
    websites: "Företagswebbplatser",
    services: "Mina tjänster",
    bookingSettings: "Bokningsinställningar",
    billing: "Premium & fakturering",
    recentActivity: "Senaste aktivitet",
    recentActivityText: "Senaste förändringar i leads, bokningar och webbplats.",
    activityEmpty: "Ingen företagsaktivitet ännu.",
    leadActivity: "Lead uppdaterad",
    bookingActivity: "Bokning uppdaterad",
    websiteActivity: "Webbplats uppdaterad",
    created: "Skapad",
    updated: "Uppdaterad",
    price: "Värde",
    customer: "Kund",
    service: "Tjänst",
    noCompaniesTitle: "Du hanterar inget företag ännu",
    noCompaniesText: "Gör anspråk på ett företag eller hitta företaget i katalogen för att öppna företagsarbetsytan.",
    browseCompanies: "Bläddra bland företag",
    claims: "Mina företagsanspråk",
    navOverview: "Översikt",
    navLeads: "Leads",
    navBookings: "Bokningar",
    navWebsites: "Webbplatser",
    navServices: "Tjänster",
    navBilling: "Premium",
    leadStatuses: {
      new: "Ny", viewed: "Visad", contacted: "Kontaktad", qualified: "Kvalificerad",
      quoted: "Offert skickad", won: "Vunnen", lost: "Förlorad", archived: "Arkiverad",
    },
    bookingStatuses: {
      pending: "Väntar", confirmed: "Bekräftad", in_progress: "Pågår",
      completed: "Klar", declined: "Avböjd", cancelled: "Avbokad",
    },
  },
  en: {
    eyebrow: "Company workspace",
    title: "Company dashboard",
    subtitle: "One workspace for leads, bookings, upcoming cleaning work, website and business status.",
    personalDashboard: "Personal dashboard",
    company: "Company",
    selectCompany: "Select company",
    switchCompany: "Switch company",
    verified: "Verified company",
    notVerified: "Not verified",
    premium: "Premium active",
    free: "Free plan",
    publicProfile: "Open company profile",
    openWebsite: "Open website",
    editCompany: "Edit company",
    newLeads: "New leads",
    conversion: "Conversion",
    pipeline: "Pipeline value",
    pendingBookings: "Pending bookings",
    nextSevenDays: "Next 7 days",
    revenueThisMonth: "Revenue this month",
    attention: "Needs attention",
    attentionText: "New leads and bookings waiting for an action.",
    attentionEmpty: "No new leads or pending bookings right now.",
    lead: "Lead",
    booking: "Booking",
    openLead: "Open lead",
    openBooking: "Open booking",
    upcoming: "Upcoming cleaning",
    upcomingText: "Confirmed cleaning occurrences during the next seven days.",
    upcomingEmpty: "No confirmed cleaning occurrences during the next seven days.",
    setup: "Business setup",
    website: "Website",
    published: "Published",
    draft: "Draft",
    noWebsite: "No website",
    bookingOnline: "Online booking enabled",
    bookingOffline: "Online booking disabled",
    recurringOn: "Recurring bookings enabled",
    recurringOff: "Recurring bookings disabled",
    customDomain: "Custom domain",
    noDomain: "No custom domain",
    rutOn: "RUT available",
    rutOff: "RUT not enabled",
    quickActions: "Quick actions",
    leads: "Customer leads",
    bookings: "Company bookings",
    websites: "Company websites",
    services: "My services",
    bookingSettings: "Booking settings",
    billing: "Premium & billing",
    recentActivity: "Recent activity",
    recentActivityText: "Latest changes across leads, bookings and the company website.",
    activityEmpty: "No company activity yet.",
    leadActivity: "Lead updated",
    bookingActivity: "Booking updated",
    websiteActivity: "Website updated",
    created: "Created",
    updated: "Updated",
    price: "Value",
    customer: "Customer",
    service: "Service",
    noCompaniesTitle: "You do not manage a company yet",
    noCompaniesText: "Claim a company or find it in the directory to unlock the company workspace.",
    browseCompanies: "Browse companies",
    claims: "My company claims",
    navOverview: "Overview",
    navLeads: "Leads",
    navBookings: "Bookings",
    navWebsites: "Websites",
    navServices: "Services",
    navBilling: "Premium",
    leadStatuses: {
      new: "New", viewed: "Viewed", contacted: "Contacted", qualified: "Qualified",
      quoted: "Quoted", won: "Won", lost: "Lost", archived: "Archived",
    },
    bookingStatuses: {
      pending: "Pending", confirmed: "Confirmed", in_progress: "In progress",
      completed: "Completed", declined: "Declined", cancelled: "Cancelled",
    },
  },
  uk: {
    eyebrow: "Простір компанії",
    title: "Кабінет компанії",
    subtitle: "Єдиний робочий простір для лідів, бронювань, майбутніх прибирань, сайту та стану бізнесу.",
    personalDashboard: "Особистий кабінет",
    company: "Компанія",
    selectCompany: "Оберіть компанію",
    switchCompany: "Змінити компанію",
    verified: "Перевірена компанія",
    notVerified: "Не перевірено",
    premium: "Premium активний",
    free: "Безкоштовний план",
    publicProfile: "Відкрити профіль компанії",
    openWebsite: "Відкрити сайт",
    editCompany: "Редагувати компанію",
    newLeads: "Нові ліди",
    conversion: "Конверсія",
    pipeline: "Вартість pipeline",
    pendingBookings: "Очікують підтвердження",
    nextSevenDays: "Наступні 7 днів",
    revenueThisMonth: "Дохід цього місяця",
    attention: "Потребує уваги",
    attentionText: "Нові ліди та бронювання, які очікують вашої дії.",
    attentionEmpty: "Зараз немає нових лідів або бронювань в очікуванні.",
    lead: "Лід",
    booking: "Бронювання",
    openLead: "Відкрити лід",
    openBooking: "Відкрити бронювання",
    upcoming: "Майбутні прибирання",
    upcomingText: "Підтверджені прибирання на найближчі сім днів.",
    upcomingEmpty: "На найближчі сім днів підтверджених прибирань немає.",
    setup: "Стан компанії",
    website: "Сайт",
    published: "Опублікований",
    draft: "Чернетка",
    noWebsite: "Сайту немає",
    bookingOnline: "Онлайн-бронювання увімкнено",
    bookingOffline: "Онлайн-бронювання вимкнено",
    recurringOn: "Регулярні бронювання увімкнено",
    recurringOff: "Регулярні бронювання вимкнено",
    customDomain: "Власний домен",
    noDomain: "Власного домену немає",
    rutOn: "RUT доступний",
    rutOff: "RUT не активовано",
    quickActions: "Швидкі дії",
    leads: "Клієнтські ліди",
    bookings: "Бронювання компанії",
    websites: "Сайти компаній",
    services: "Мої послуги",
    bookingSettings: "Налаштування бронювань",
    billing: "Premium та оплата",
    recentActivity: "Остання активність",
    recentActivityText: "Останні зміни у лідах, бронюваннях та сайті компанії.",
    activityEmpty: "Активності компанії поки немає.",
    leadActivity: "Лід оновлено",
    bookingActivity: "Бронювання оновлено",
    websiteActivity: "Сайт оновлено",
    created: "Створено",
    updated: "Оновлено",
    price: "Вартість",
    customer: "Клієнт",
    service: "Послуга",
    noCompaniesTitle: "Ви ще не керуєте жодною компанією",
    noCompaniesText: "Подайте заявку на компанію або знайдіть її в каталозі, щоб відкрити бізнес-простір.",
    browseCompanies: "Переглянути компанії",
    claims: "Мої заявки на компанії",
    navOverview: "Огляд",
    navLeads: "Ліди",
    navBookings: "Бронювання",
    navWebsites: "Сайти",
    navServices: "Послуги",
    navBilling: "Premium",
    leadStatuses: {
      new: "Новий", viewed: "Переглянутий", contacted: "Зв’язалися", qualified: "Кваліфікований",
      quoted: "Ціну надіслано", won: "Виграний", lost: "Втрачений", archived: "Архів",
    },
    bookingStatuses: {
      pending: "Очікує", confirmed: "Підтверджено", in_progress: "В процесі",
      completed: "Завершено", declined: "Відхилено", cancelled: "Скасовано",
    },
  },
  ru: {
    eyebrow: "Пространство компании",
    title: "Кабинет компании",
    subtitle: "Единое рабочее пространство для лидов, бронирований, предстоящих уборок, сайта и состояния бизнеса.",
    personalDashboard: "Личный кабинет",
    company: "Компания",
    selectCompany: "Выберите компанию",
    switchCompany: "Сменить компанию",
    verified: "Проверенная компания",
    notVerified: "Не проверено",
    premium: "Premium активен",
    free: "Бесплатный план",
    publicProfile: "Открыть профиль компании",
    openWebsite: "Открыть сайт",
    editCompany: "Редактировать компанию",
    newLeads: "Новые лиды",
    conversion: "Конверсия",
    pipeline: "Стоимость pipeline",
    pendingBookings: "Ожидают подтверждения",
    nextSevenDays: "Следующие 7 дней",
    revenueThisMonth: "Доход в этом месяце",
    attention: "Требует внимания",
    attentionText: "Новые лиды и бронирования, ожидающие вашего действия.",
    attentionEmpty: "Сейчас нет новых лидов или ожидающих бронирований.",
    lead: "Лид",
    booking: "Бронирование",
    openLead: "Открыть лид",
    openBooking: "Открыть бронирование",
    upcoming: "Предстоящие уборки",
    upcomingText: "Подтвержденные уборки на ближайшие семь дней.",
    upcomingEmpty: "На ближайшие семь дней подтвержденных уборок нет.",
    setup: "Состояние компании",
    website: "Сайт",
    published: "Опубликован",
    draft: "Черновик",
    noWebsite: "Сайта нет",
    bookingOnline: "Онлайн-бронирование включено",
    bookingOffline: "Онлайн-бронирование выключено",
    recurringOn: "Регулярные бронирования включены",
    recurringOff: "Регулярные бронирования выключены",
    customDomain: "Свой домен",
    noDomain: "Своего домена нет",
    rutOn: "RUT доступен",
    rutOff: "RUT не активирован",
    quickActions: "Быстрые действия",
    leads: "Клиентские лиды",
    bookings: "Бронирования компании",
    websites: "Сайты компаний",
    services: "Мои услуги",
    bookingSettings: "Настройки бронирований",
    billing: "Premium и оплата",
    recentActivity: "Последняя активность",
    recentActivityText: "Последние изменения в лидах, бронированиях и сайте компании.",
    activityEmpty: "Активности компании пока нет.",
    leadActivity: "Лид обновлен",
    bookingActivity: "Бронирование обновлено",
    websiteActivity: "Сайт обновлен",
    created: "Создано",
    updated: "Обновлено",
    price: "Стоимость",
    customer: "Клиент",
    service: "Услуга",
    noCompaniesTitle: "Вы пока не управляете компанией",
    noCompaniesText: "Подайте заявку на компанию или найдите ее в каталоге, чтобы открыть бизнес-пространство.",
    browseCompanies: "Посмотреть компании",
    claims: "Мои заявки на компании",
    navOverview: "Обзор",
    navLeads: "Лиды",
    navBookings: "Бронирования",
    navWebsites: "Сайты",
    navServices: "Услуги",
    navBilling: "Premium",
    leadStatuses: {
      new: "Новый", viewed: "Просмотрен", contacted: "Связались", qualified: "Квалифицирован",
      quoted: "Цена отправлена", won: "Выигран", lost: "Потерян", archived: "Архив",
    },
    bookingStatuses: {
      pending: "Ожидает", confirmed: "Подтверждено", in_progress: "В процессе",
      completed: "Завершено", declined: "Отклонено", cancelled: "Отменено",
    },
  },
  pl: {
    eyebrow: "Przestrzeń firmy",
    title: "Panel firmy",
    subtitle: "Jedna przestrzeń do obsługi leadów, rezerwacji, nadchodzących sprzątań, strony i statusu biznesu.",
    personalDashboard: "Panel osobisty",
    company: "Firma",
    selectCompany: "Wybierz firmę",
    switchCompany: "Zmień firmę",
    verified: "Zweryfikowana firma",
    notVerified: "Niezweryfikowana",
    premium: "Premium aktywny",
    free: "Plan darmowy",
    publicProfile: "Otwórz profil firmy",
    openWebsite: "Otwórz stronę",
    editCompany: "Edytuj firmę",
    newLeads: "Nowe leady",
    conversion: "Konwersja",
    pipeline: "Wartość pipeline",
    pendingBookings: "Oczekujące rezerwacje",
    nextSevenDays: "Następne 7 dni",
    revenueThisMonth: "Przychód w tym miesiącu",
    attention: "Wymaga uwagi",
    attentionText: "Nowe leady i rezerwacje oczekujące na działanie.",
    attentionEmpty: "Brak nowych leadów i oczekujących rezerwacji.",
    lead: "Lead",
    booking: "Rezerwacja",
    openLead: "Otwórz lead",
    openBooking: "Otwórz rezerwację",
    upcoming: "Nadchodzące sprzątania",
    upcomingText: "Potwierdzone terminy sprzątania na najbliższe siedem dni.",
    upcomingEmpty: "Brak potwierdzonych sprzątań na najbliższe siedem dni.",
    setup: "Status firmy",
    website: "Strona",
    published: "Opublikowana",
    draft: "Szkic",
    noWebsite: "Brak strony",
    bookingOnline: "Rezerwacje online aktywne",
    bookingOffline: "Rezerwacje online wyłączone",
    recurringOn: "Rezerwacje cykliczne aktywne",
    recurringOff: "Rezerwacje cykliczne wyłączone",
    customDomain: "Własna domena",
    noDomain: "Brak własnej domeny",
    rutOn: "RUT dostępny",
    rutOff: "RUT nieaktywny",
    quickActions: "Szybkie akcje",
    leads: "Leady klientów",
    bookings: "Rezerwacje firmy",
    websites: "Strony firm",
    services: "Moje usługi",
    bookingSettings: "Ustawienia rezerwacji",
    billing: "Premium i rozliczenia",
    recentActivity: "Ostatnia aktywność",
    recentActivityText: "Ostatnie zmiany w leadach, rezerwacjach i stronie firmy.",
    activityEmpty: "Brak aktywności firmy.",
    leadActivity: "Lead zaktualizowany",
    bookingActivity: "Rezerwacja zaktualizowana",
    websiteActivity: "Strona zaktualizowana",
    created: "Utworzono",
    updated: "Zaktualizowano",
    price: "Wartość",
    customer: "Klient",
    service: "Usługa",
    noCompaniesTitle: "Nie zarządzasz jeszcze firmą",
    noCompaniesText: "Zgłoś firmę lub znajdź ją w katalogu, aby otworzyć przestrzeń biznesową.",
    browseCompanies: "Przeglądaj firmy",
    claims: "Moje zgłoszenia firm",
    navOverview: "Przegląd",
    navLeads: "Leady",
    navBookings: "Rezerwacje",
    navWebsites: "Strony",
    navServices: "Usługi",
    navBilling: "Premium",
    leadStatuses: {
      new: "Nowy", viewed: "Wyświetlony", contacted: "Skontaktowano", qualified: "Zakwalifikowany",
      quoted: "Wycena wysłana", won: "Wygrany", lost: "Utracony", archived: "Archiwum",
    },
    bookingStatuses: {
      pending: "Oczekuje", confirmed: "Potwierdzona", in_progress: "W trakcie",
      completed: "Zakończona", declined: "Odrzucona", cancelled: "Anulowana",
    },
  },
}
