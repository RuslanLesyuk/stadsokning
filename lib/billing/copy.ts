import type { Locale } from "@/lib/i18n"

export type BillingCopy = {
  eyebrow: string
  title: string
  subtitle: string
  currentPlan: string
  premium: string
  free: string
  active: string
  grace: string
  managedByAdmin: string
  legacy: string
  renews: string
  ends: string
  monthly: string
  yearly: string
  perMonth: string
  perYear: string
  chooseMonthly: string
  chooseYearly: string
  currentSubscription: string
  manageBilling: string
  portalHelp: string
  priceUnavailable: string
  featuresTitle: string
  featureRanking: string
  featureTemplates: string
  featureLanguages: string
  featureDomain: string
  featureBranding: string
  back: string
  paymentSync: string
  error: string
}

export const billingCopy: Record<Locale, BillingCopy> = {
  sv: {
    eyebrow: "Premium / fakturering",
    title: "Premium för Clean Jobs",
    subtitle: "Hantera abonnemang, betalningar och Premium-funktioner på ett ställe.",
    currentPlan: "Nuvarande plan",
    premium: "Premium",
    free: "Gratis",
    active: "Aktiv",
    grace: "Betalning behöver åtgärdas – Premium är tillfälligt aktivt",
    managedByAdmin: "Premium aktiverat av administratör",
    legacy: "Befintlig Premium-status",
    renews: "Nuvarande period slutar",
    ends: "Premium till",
    monthly: "Månadsvis",
    yearly: "Årsvis",
    perMonth: "/ månad",
    perYear: "/ år",
    chooseMonthly: "Välj månadsplan",
    chooseYearly: "Välj årsplan",
    currentSubscription: "Nuvarande abonnemang",
    manageBilling: "Hantera abonnemang och betalmetod",
    portalHelp: "Öppnar Stripes säkra kundportal.",
    priceUnavailable: "Pris är inte konfigurerat ännu.",
    featuresTitle: "Premium-funktioner",
    featureRanking: "Premium-märke och prioriterad synlighet i jobbflödet",
    featureTemplates: "Avancerade företagsmallar: Minimal och Elegant",
    featureLanguages: "Upp till 5 språk på företagets webbplats",
    featureDomain: "Grund för egen domän",
    featureBranding: "Möjlighet att ta bort Clean Jobs-branding från företagssidan",
    back: "Till profil",
    paymentSync: "Stripe-webhooken är källan för betalningsstatus. Uppdateringen kan ta några sekunder.",
    error: "Faktureringen kunde inte öppnas. Försök igen.",
  },
  en: {
    eyebrow: "Premium / billing",
    title: "Clean Jobs Premium",
    subtitle: "Manage your subscription, payments and Premium features in one place.",
    currentPlan: "Current plan",
    premium: "Premium",
    free: "Free",
    active: "Active",
    grace: "Payment needs attention – Premium remains temporarily active",
    managedByAdmin: "Premium enabled by an administrator",
    legacy: "Existing Premium status",
    renews: "Current period ends",
    ends: "Premium until",
    monthly: "Monthly",
    yearly: "Yearly",
    perMonth: "/ month",
    perYear: "/ year",
    chooseMonthly: "Choose monthly plan",
    chooseYearly: "Choose yearly plan",
    currentSubscription: "Current subscription",
    manageBilling: "Manage subscription and payment method",
    portalHelp: "Opens Stripe's secure customer portal.",
    priceUnavailable: "This price is not configured yet.",
    featuresTitle: "Premium features",
    featureRanking: "Premium badge and priority visibility in the jobs flow",
    featureTemplates: "Advanced company-site templates: Minimal and Elegant",
    featureLanguages: "Up to 5 languages on the company website",
    featureDomain: "Custom-domain foundation",
    featureBranding: "Option to remove Clean Jobs branding from the company website",
    back: "Back to profile",
    paymentSync: "Stripe webhooks are the source of truth for payment status. Updates can take a few seconds.",
    error: "Billing could not be opened. Please try again.",
  },
  uk: {
    eyebrow: "Premium / оплата",
    title: "Clean Jobs Premium",
    subtitle: "Керуйте підпискою, оплатами та Premium-функціями в одному місці.",
    currentPlan: "Поточний план",
    premium: "Premium",
    free: "Безкоштовний",
    active: "Активний",
    grace: "Потрібна увага до оплати — Premium тимчасово залишається активним",
    managedByAdmin: "Premium активовано адміністратором",
    legacy: "Існуючий Premium-статус",
    renews: "Поточний період завершується",
    ends: "Premium до",
    monthly: "Щомісячно",
    yearly: "Щорічно",
    perMonth: "/ місяць",
    perYear: "/ рік",
    chooseMonthly: "Обрати місячний план",
    chooseYearly: "Обрати річний план",
    currentSubscription: "Поточна підписка",
    manageBilling: "Керувати підпискою та способом оплати",
    portalHelp: "Відкриває захищений Customer Portal Stripe.",
    priceUnavailable: "Ціну ще не налаштовано.",
    featuresTitle: "Premium-функції",
    featureRanking: "Premium badge та пріоритетна видимість у списку робіт",
    featureTemplates: "Розширені шаблони сайту компанії: Minimal та Elegant",
    featureLanguages: "До 5 мов на сайті компанії",
    featureDomain: "Основа для власного домену",
    featureBranding: "Можливість прибрати branding Clean Jobs із сайту компанії",
    back: "До профілю",
    paymentSync: "Джерелом правди для статусу оплати є Stripe webhook. Оновлення може зайняти кілька секунд.",
    error: "Не вдалося відкрити оплату. Спробуйте ще раз.",
  },
  ru: {
    eyebrow: "Premium / оплата",
    title: "Clean Jobs Premium",
    subtitle: "Управляйте подпиской, оплатами и Premium-функциями в одном месте.",
    currentPlan: "Текущий план",
    premium: "Premium",
    free: "Бесплатный",
    active: "Активен",
    grace: "Требуется внимание к оплате — Premium временно остаётся активным",
    managedByAdmin: "Premium активирован администратором",
    legacy: "Существующий Premium-статус",
    renews: "Текущий период заканчивается",
    ends: "Premium до",
    monthly: "Ежемесячно",
    yearly: "Ежегодно",
    perMonth: "/ месяц",
    perYear: "/ год",
    chooseMonthly: "Выбрать месячный план",
    chooseYearly: "Выбрать годовой план",
    currentSubscription: "Текущая подписка",
    manageBilling: "Управлять подпиской и способом оплаты",
    portalHelp: "Открывает защищённый Customer Portal Stripe.",
    priceUnavailable: "Цена ещё не настроена.",
    featuresTitle: "Premium-функции",
    featureRanking: "Premium badge и приоритетная видимость в списке работ",
    featureTemplates: "Расширенные шаблоны сайта компании: Minimal и Elegant",
    featureLanguages: "До 5 языков на сайте компании",
    featureDomain: "Основа для собственного домена",
    featureBranding: "Возможность убрать branding Clean Jobs с сайта компании",
    back: "К профилю",
    paymentSync: "Источником истины для статуса оплаты является Stripe webhook. Обновление может занять несколько секунд.",
    error: "Не удалось открыть оплату. Попробуйте ещё раз.",
  },
  pl: {
    eyebrow: "Premium / rozliczenia",
    title: "Clean Jobs Premium",
    subtitle: "Zarządzaj subskrypcją, płatnościami i funkcjami Premium w jednym miejscu.",
    currentPlan: "Aktualny plan",
    premium: "Premium",
    free: "Darmowy",
    active: "Aktywny",
    grace: "Płatność wymaga uwagi — Premium pozostaje tymczasowo aktywny",
    managedByAdmin: "Premium włączony przez administratora",
    legacy: "Istniejący status Premium",
    renews: "Bieżący okres kończy się",
    ends: "Premium do",
    monthly: "Miesięcznie",
    yearly: "Rocznie",
    perMonth: "/ miesiąc",
    perYear: "/ rok",
    chooseMonthly: "Wybierz plan miesięczny",
    chooseYearly: "Wybierz plan roczny",
    currentSubscription: "Aktualna subskrypcja",
    manageBilling: "Zarządzaj subskrypcją i metodą płatności",
    portalHelp: "Otwiera bezpieczny portal klienta Stripe.",
    priceUnavailable: "Cena nie jest jeszcze skonfigurowana.",
    featuresTitle: "Funkcje Premium",
    featureRanking: "Odznaka Premium i priorytetowa widoczność w ofertach pracy",
    featureTemplates: "Zaawansowane szablony strony firmy: Minimal i Elegant",
    featureLanguages: "Do 5 języków na stronie firmy",
    featureDomain: "Podstawa dla własnej domeny",
    featureBranding: "Możliwość usunięcia brandingu Clean Jobs ze strony firmy",
    back: "Do profilu",
    paymentSync: "Webhook Stripe jest źródłem prawdy dla statusu płatności. Aktualizacja może potrwać kilka sekund.",
    error: "Nie udało się otworzyć rozliczeń. Spróbuj ponownie.",
  },
}
