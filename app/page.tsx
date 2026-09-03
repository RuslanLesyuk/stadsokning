import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { getUiDictionary } from "@/lib/ui-i18n"

export const metadata: Metadata = {
  title: {
    absolute: "Städjobb och städföretag i Sverige | Clean Jobs",
  },
  description:
    "Hitta städjobb, jämför städföretag och hitta städtjänster i Sverige. Clean Jobs samlar jobb, företag och lokala städtjänster på en plats.",
  alternates: {
    canonical: "https://cleansjob.com/",
  },
}

type LocalText = Record<Locale, string>

type Guide = {
  href: string
  label: LocalText
  title: LocalText
  description: LocalText
}

const homeCopy: Record<
  Locale,
  {
    companiesBadge: string
    companiesTitle: string
    companiesText: string
    viewAllCompanies: string
    guidesBadge: string
    guidesTitle: string
    guidesText: string
    readGuide: string
    chooseTitle: string
    chooseText: string
    customerTitle: string
    customerText: string
    customerCta: string
    workerTitle: string
    workerText: string
    workerCta: string
    companyTitle: string
    companyText: string
    companyCta: string
  }
> = {
  uk: {
    companiesBadge: "Компанії",
    companiesTitle: "Клінінгові компанії у Стокгольмі",
    companiesText:
      "Переглядайте клінінгові компанії у Стокгольмі. Порівнюйте послуги, контактні дані та профілі компаній.",
    viewAllCompanies: "Переглянути всі компанії →",
    guidesBadge: "Гайди",
    guidesTitle: "Популярні гайди про роботу та клінінг у Швеції",
    guidesText:
      "Дізнайтеся, як знайти роботу у Швеції, як працюють клінінгові вакансії та як клієнти можуть знайти надійних прибиральників.",
    readGuide: "Читати гайд →",
    chooseTitle: "Що ви хочете зробити?",
    chooseText: "Оберіть один варіант — ми покажемо найкоротший шлях.",
    customerTitle: "Мені потрібне прибирання",
    customerText: "Знайдіть клінінгову компанію та перегляньте її послуги й контакти.",
    customerCta: "Знайти компанію",
    workerTitle: "Я шукаю роботу з прибирання",
    workerText: "Переглядайте доступні замовлення та знаходьте роботу у своєму місті.",
    workerCta: "Знайти роботу",
    companyTitle: "Я керую клінінговою компанією",
    companyText: "Знайдіть профіль своєї компанії, підтвердьте його та керуйте ним у Clean Jobs.",
    companyCta: "Знайти свою компанію",
  },
  ru: {
    companiesBadge: "Компании",
    companiesTitle: "Клининговые компании в Стокгольме",
    companiesText:
      "Просматривайте клининговые компании в Стокгольме. Сравнивайте услуги, контакты и профили компаний.",
    viewAllCompanies: "Посмотреть все компании →",
    guidesBadge: "Гайды",
    guidesTitle: "Популярные гайды о работе и клининге в Швеции",
    guidesText:
      "Узнайте, как найти работу в Швеции, как работают клининговые вакансии и как клиентам найти надежных уборщиков.",
    readGuide: "Читать гайд →",
    chooseTitle: "Что вы хотите сделать?",
    chooseText: "Выберите один вариант — мы покажем самый короткий путь.",
    customerTitle: "Мне нужна уборка",
    customerText: "Найдите клининговую компанию и посмотрите её услуги и контакты.",
    customerCta: "Найти компанию",
    workerTitle: "Я ищу работу по уборке",
    workerText: "Просматривайте доступные заказы и находите работу в своём городе.",
    workerCta: "Найти работу",
    companyTitle: "Я управляю клининговой компанией",
    companyText: "Найдите профиль своей компании, подтвердите его и управляйте им в Clean Jobs.",
    companyCta: "Найти свою компанию",
  },
  en: {
    companiesBadge: "Companies",
    companiesTitle: "Cleaning Companies in Stockholm",
    companiesText:
      "Browse cleaning companies in Stockholm. Compare services, contact information and company profiles.",
    viewAllCompanies: "View all companies →",
    guidesBadge: "Guides",
    guidesTitle: "Popular guides about jobs and cleaning work in Sweden",
    guidesText:
      "Learn how to find work in Sweden, how cleaning jobs work, and how clients can find cleaning companies.",
    readGuide: "Read guide →",
    chooseTitle: "What do you want to do?",
    chooseText: "Choose one option and we will take you to the simplest next step.",
    customerTitle: "I need cleaning",
    customerText: "Find a cleaning company and view its services and contact details.",
    customerCta: "Find a company",
    workerTitle: "I am looking for cleaning work",
    workerText: "Browse available cleaning jobs and find work in your city.",
    workerCta: "Find jobs",
    companyTitle: "I run a cleaning company",
    companyText: "Find your company profile, claim it and manage it on Clean Jobs.",
    companyCta: "Find my company",
  },
  sv: {
    companiesBadge: "Företag",
    companiesTitle: "Städföretag i Stockholm",
    companiesText:
      "Bläddra bland städföretag i Stockholm. Jämför tjänster, kontaktuppgifter och företagsprofiler.",
    viewAllCompanies: "Visa alla företag →",
    guidesBadge: "Guider",
    guidesTitle: "Populära guider om jobb och städarbete i Sverige",
    guidesText:
      "Lär dig hur du hittar arbete i Sverige, hur städjobb fungerar och hur kunder kan hitta städföretag.",
    readGuide: "Läs guide →",
    chooseTitle: "Vad vill du göra?",
    chooseText: "Välj ett alternativ så visar vi den enklaste vägen vidare.",
    customerTitle: "Jag behöver städning",
    customerText: "Hitta ett städföretag och se tjänster, kontaktuppgifter och företagsprofil.",
    customerCta: "Hitta städföretag",
    workerTitle: "Jag söker städjobb",
    workerText: "Se lediga städjobb och hitta arbete i din stad.",
    workerCta: "Hitta jobb",
    companyTitle: "Jag driver städföretag",
    companyText: "Hitta din företagsprofil, gör anspråk på den och hantera företaget på Clean Jobs.",
    companyCta: "Hitta mitt företag",
  },
  pl: {
    companiesBadge: "Firmy",
    companiesTitle: "Firmy sprzątające w Sztokholmie",
    companiesText:
      "Przeglądaj firmy sprzątające w Sztokholmie. Porównuj usługi, dane kontaktowe i profile firm.",
    viewAllCompanies: "Zobacz wszystkie firmy →",
    guidesBadge: "Poradniki",
    guidesTitle: "Popularne poradniki o pracy i sprzątaniu w Szwecji",
    guidesText:
      "Dowiedz się, jak znaleźć pracę w Szwecji, jak działają zlecenia sprzątania i jak klienci mogą znaleźć firmy sprzątające.",
    readGuide: "Czytaj poradnik →",
    chooseTitle: "Co chcesz zrobić?",
    chooseText: "Wybierz jedną opcję, a pokażemy najprostszy następny krok.",
    customerTitle: "Potrzebuję sprzątania",
    customerText: "Znajdź firmę sprzątającą i sprawdź jej usługi oraz dane kontaktowe.",
    customerCta: "Znajdź firmę",
    workerTitle: "Szukam pracy przy sprzątaniu",
    workerText: "Przeglądaj dostępne zlecenia i znajdź pracę w swoim mieście.",
    workerCta: "Znajdź pracę",
    companyTitle: "Prowadzę firmę sprzątającą",
    companyText: "Znajdź profil swojej firmy, zgłoś do niego prawa i zarządzaj nim w Clean Jobs.",
    companyCta: "Znajdź moją firmę",
  },
}

const guides: Guide[] = [
  {
    href: "/work-in-sweden",
    label: {
      uk: "Робота",
      ru: "Работа",
      en: "English",
      sv: "Arbete",
      pl: "Praca",
    },
    title: {
      uk: "Робота у Швеції",
      ru: "Работа в Швеции",
      en: "Work in Sweden",
      sv: "Jobba i Sverige",
      pl: "Praca w Szwecji",
    },
    description: {
      uk: "Повний гайд про роботу у Швеції, клінінгові вакансії, підробіток і можливості для іноземців.",
      ru: "Полный гайд о работе в Швеции, клининговых вакансиях, подработке и возможностях для иностранцев.",
      en: "Complete guide to jobs in Sweden, cleaning work, part-time jobs and opportunities for foreigners.",
      sv: "Guide till arbete i Sverige, städjobb, extrajobb och möjligheter för utländska arbetare.",
      pl: "Kompletny poradnik o pracy w Szwecji, sprzątaniu, pracy dodatkowej i możliwościach dla obcokrajowców.",
    },
  },
  {
    href: "/jobb-i-sverige",
    label: {
      uk: "Швеція",
      ru: "Швеция",
      en: "Sweden",
      sv: "Svenska",
      pl: "Szwecja",
    },
    title: {
      uk: "Робота у Швеції",
      ru: "Работа в Швеции",
      en: "Jobs in Sweden",
      sv: "Jobb i Sverige",
      pl: "Praca w Szwecji",
    },
    description: {
      uk: "Гайд про роботу у Швеції, клінінг, підробіток і можливості для працівників та компаній.",
      ru: "Гайд о работе в Швеции, клининге, подработке и возможностях для работников и компаний.",
      en: "Guide to work in Sweden, cleaning jobs, extra work and opportunities for workers and companies.",
      sv: "Guide till arbete i Sverige, städjobb, extrajobb och möjligheter för arbetare och företag.",
      pl: "Poradnik o pracy w Szwecji, sprzątaniu, pracy dodatkowej i możliwościach dla pracowników i firm.",
    },
  },
  {
    href: "/cleaning-jobs-stockholm",
    label: {
      uk: "Стокгольм",
      ru: "Стокгольм",
      en: "Stockholm",
      sv: "Stockholm",
      pl: "Sztokholm",
    },
    title: {
      uk: "Клінінгові роботи у Стокгольмі",
      ru: "Клининговые работы в Стокгольме",
      en: "Cleaning Jobs Stockholm",
      sv: "Städjobb Stockholm",
      pl: "Praca sprzątanie Sztokholm",
    },
    description: {
      uk: "Знайдіть клінінгові роботи, замовлення на прибирання та компанії у Стокгольмі й поблизу.",
      ru: "Найдите клининговые работы, заказы на уборку и компании в Стокгольме и рядом.",
      en: "Find cleaning jobs, cleaner work and cleaning companies in Stockholm and nearby areas.",
      sv: "Hitta städjobb, städarbete och städföretag i Stockholm och närliggande områden.",
      pl: "Znajdź zlecenia sprzątania, pracę przy sprzątaniu i firmy sprzątające w Sztokholmie.",
    },
  },
  {
    href: "/stadjobb-stockholm",
    label: {
      uk: "Стокгольм",
      ru: "Стокгольм",
      en: "Stockholm",
      sv: "Svenska",
      pl: "Sztokholm",
    },
    title: {
      uk: "Робота з прибирання у Стокгольмі",
      ru: "Работа по уборке в Стокгольме",
      en: "Cleaning Work Stockholm",
      sv: "Städjobb Stockholm",
      pl: "Praca sprzątanie Sztokholm",
    },
    description: {
      uk: "Знайдіть домашнє прибирання, офісне прибирання та прибирання після переїзду у Стокгольмі.",
      ru: "Найдите уборку домов, офисов и уборку после переезда в Стокгольме.",
      en: "Find home cleaning, office cleaning and moving cleaning jobs in Stockholm.",
      sv: "Hitta städjobb, hemstädning, kontorsstädning och flyttstädning i Stockholm.",
      pl: "Znajdź sprzątanie domów, biur i sprzątanie po przeprowadzce w Sztokholmie.",
    },
  },
  {
    href: "/cleaning-jobs-gothenburg",
    label: {
      uk: "Гетеборг",
      ru: "Гётеборг",
      en: "Gothenburg",
      sv: "Göteborg",
      pl: "Göteborg",
    },
    title: {
      uk: "Клінінгові роботи у Гетеборзі",
      ru: "Клининговые работы в Гётеборге",
      en: "Cleaning Jobs Gothenburg",
      sv: "Städjobb Göteborg",
      pl: "Praca sprzątanie Göteborg",
    },
    description: {
      uk: "Знайдіть клінінгові роботи, замовлення та клінінгові компанії у Гетеборзі.",
      ru: "Найдите клининговые работы, заказы и компании в Гётеборге.",
      en: "Find cleaning jobs, cleaner work and cleaning companies in Gothenburg.",
      sv: "Hitta städjobb, städarbete och städföretag i Göteborg.",
      pl: "Znajdź zlecenia sprzątania, pracę i firmy sprzątające w Göteborgu.",
    },
  },
  {
    href: "/stadjobb-goteborg",
    label: {
      uk: "Гетеборг",
      ru: "Гётеборг",
      en: "Gothenburg",
      sv: "Svenska",
      pl: "Göteborg",
    },
    title: {
      uk: "Робота з прибирання у Гетеборзі",
      ru: "Работа по уборке в Гётеборге",
      en: "Cleaning Work Gothenburg",
      sv: "Städjobb Göteborg",
      pl: "Praca sprzątanie Göteborg",
    },
    description: {
      uk: "Знайдіть домашнє, офісне та переїзне прибирання у Гетеборзі.",
      ru: "Найдите домашнюю, офисную и переездную уборку в Гётеборге.",
      en: "Find home cleaning, office cleaning and moving cleaning jobs in Gothenburg.",
      sv: "Hitta städjobb, hemstädning, kontorsstädning och flyttstädning i Göteborg.",
      pl: "Znajdź sprzątanie domów, biur i po przeprowadzce w Göteborgu.",
    },
  },
  {
    href: "/jobs-for-foreigners-in-sweden",
    label: {
      uk: "Іноземці",
      ru: "Иностранцы",
      en: "Sweden",
      sv: "Utländska arbetare",
      pl: "Obcokrajowcy",
    },
    title: {
      uk: "Робота для іноземців у Швеції",
      ru: "Работа для иностранцев в Швеции",
      en: "Jobs for Foreigners in Sweden",
      sv: "Jobb för utlänningar i Sverige",
      pl: "Praca dla obcokrajowców w Szwecji",
    },
    description: {
      uk: "Гайд для іммігрантів, експатів і новоприбулих, які шукають роботу у Швеції.",
      ru: "Гайд для иммигрантов, экспатов и новичков, которые ищут работу в Швеции.",
      en: "Guide for immigrants, expats and newcomers looking for jobs in Sweden.",
      sv: "Guide för invandrare, expats och nyanlända som söker jobb i Sverige.",
      pl: "Poradnik dla imigrantów, ekspatów i nowych osób szukających pracy w Szwecji.",
    },
  },
  {
    href: "/jobb-utan-svenska",
    label: {
      uk: "Без шведської",
      ru: "Без шведского",
      en: "Without Swedish",
      sv: "Svenska",
      pl: "Bez szwedzkiego",
    },
    title: {
      uk: "Робота без шведської",
      ru: "Работа без шведского",
      en: "Jobs without Swedish",
      sv: "Jobb utan svenska",
      pl: "Praca bez szwedzkiego",
    },
    description: {
      uk: "Дізнайтеся, як знайти роботу у Швеції, навіть якщо ви ще не говорите шведською вільно.",
      ru: "Узнайте, как найти работу в Швеции, даже если вы ещё не говорите по-шведски свободно.",
      en: "Find jobs in Sweden even if you do not speak fluent Swedish yet.",
      sv: "Hitta jobb i Sverige även om du inte talar flytande svenska.",
      pl: "Znajdź pracę w Szwecji nawet bez płynnej znajomości języka szwedzkiego.",
    },
  },
  {
    href: "/how-to-find-a-job-in-sweden",
    label: {
      uk: "Гайд",
      ru: "Гайд",
      en: "Guide",
      sv: "Guide",
      pl: "Poradnik",
    },
    title: {
      uk: "Як знайти роботу у Швеції",
      ru: "Как найти работу в Швеции",
      en: "How to Find a Job in Sweden",
      sv: "Hur man hittar jobb i Sverige",
      pl: "Jak znaleźć pracę w Szwecji",
    },
    description: {
      uk: "Дізнайтеся, де шукати роботу, як подаватися та як швидше отримати пропозицію.",
      ru: "Узнайте, где искать работу, как подаваться и как быстрее получить предложение.",
      en: "Learn where to search, how to apply and how to get hired faster.",
      sv: "Lär dig var du söker jobb, hur du ansöker och hur du snabbare blir anställd.",
      pl: "Dowiedz się, gdzie szukać pracy, jak aplikować i jak szybciej dostać ofertę.",
    },
  },
  {
    href: "/hur-man-far-jobb-i-sverige",
    label: {
      uk: "Гайд",
      ru: "Гайд",
      en: "Guide",
      sv: "Guide",
      pl: "Poradnik",
    },
    title: {
      uk: "Як отримати роботу у Швеції",
      ru: "Как получить работу в Швеции",
      en: "How to Get a Job in Sweden",
      sv: "Hur man får jobb i Sverige",
      pl: "Jak dostać pracę w Szwecji",
    },
    description: {
      uk: "Практичний гайд, як знайти роботу та отримати більше співбесід.",
      ru: "Практический гайд, как найти работу и получить больше собеседований.",
      en: "Practical guide to finding work and getting more interviews.",
      sv: "Praktisk guide för att hitta arbete och få fler intervjuer.",
      pl: "Praktyczny poradnik, jak znaleźć pracę i dostać więcej rozmów.",
    },
  },
  {
    href: "/how-much-do-cleaners-earn-in-sweden",
    label: {
      uk: "Зарплата",
      ru: "Зарплата",
      en: "Salary",
      sv: "Lön",
      pl: "Wynagrodzenie",
    },
    title: {
      uk: "Скільки заробляють прибиральники у Швеції",
      ru: "Сколько зарабатывают уборщики в Швеции",
      en: "How Much Do Cleaners Earn in Sweden",
      sv: "Vad tjänar städare i Sverige",
      pl: "Ile zarabiają osoby sprzątające w Szwecji",
    },
    description: {
      uk: "Гайд по зарплатах у клінінгу: місячна оплата, фактори зарплати та як знайти більше роботи.",
      ru: "Гайд по зарплатам в клининге: месячная оплата, факторы зарплаты и как найти больше работы.",
      en: "Cleaner salary guide with monthly pay, salary factors and tips for getting more cleaning work.",
      sv: "Guide till städarlön, månadslön och tips för att hitta mer städarbete.",
      pl: "Poradnik o wynagrodzeniach w sprzątaniu, pensji miesięcznej i sposobach na więcej zleceń.",
    },
  },
  {
    href: "/vad-tjanar-en-stadare-i-sverige",
    label: {
      uk: "Зарплата",
      ru: "Зарплата",
      en: "Salary",
      sv: "Lön",
      pl: "Wynagrodzenie",
    },
    title: {
      uk: "Скільки заробляє прибиральник у Швеції",
      ru: "Сколько зарабатывает уборщик в Швеции",
      en: "Cleaner Salary in Sweden",
      sv: "Vad tjänar en städare i Sverige",
      pl: "Ile zarabia sprzątacz w Szwecji",
    },
    description: {
      uk: "Гайд про зарплату прибиральника, місячну оплату та як знаходити більше клінінгової роботи.",
      ru: "Гайд о зарплате уборщика, месячной оплате и поиске клининговой работы.",
      en: "Guide to cleaner salary, monthly pay and how to find more cleaning jobs.",
      sv: "Guide till städare lön, månadslön och hur du kan hitta fler städjobb.",
      pl: "Poradnik o pensji sprzątacza, miesięcznej wypłacie i szukaniu większej liczby zleceń.",
    },
  },
  {
    href: "/hire-cleaner-stockholm",
    label: {
      uk: "Клієнти",
      ru: "Клиенты",
      en: "Clients",
      sv: "Kunder",
      pl: "Klienci",
    },
    title: {
      uk: "Найняти прибиральника у Стокгольмі",
      ru: "Нанять уборщика в Стокгольме",
      en: "Hire a Cleaner in Stockholm",
      sv: "Anlita städare i Stockholm",
      pl: "Zatrudnij sprzątacza w Sztokholmie",
    },
    description: {
      uk: "Знайдіть надійних прибиральників і клінінгові компанії у Стокгольмі.",
      ru: "Найдите надежных уборщиков и клининговые компании в Стокгольме.",
      en: "Find trusted cleaners and cleaning companies in Stockholm.",
      sv: "Hitta pålitliga städare och städföretag i Stockholm.",
      pl: "Znajdź zaufanych wykonawców i firmy sprzątające w Sztokholmie.",
    },
  },
  {
    href: "/stadfirma-stockholm",
    label: {
      uk: "Стокгольм",
      ru: "Стокгольм",
      en: "Stockholm",
      sv: "Stockholm",
      pl: "Sztokholm",
    },
    title: {
      uk: "Клінінгова компанія у Стокгольмі",
      ru: "Клининговая компания в Стокгольме",
      en: "Cleaning Company Stockholm",
      sv: "Städfirma Stockholm",
      pl: "Firma sprzątająca w Sztokholmie",
    },
    description: {
      uk: "Знайдіть клінінгові компанії, домашнє та офісне прибирання у Стокгольмі.",
      ru: "Найдите клининговые компании, уборку дома и офисов в Стокгольме.",
      en: "Find cleaning companies, home cleaning and office cleaning in Stockholm.",
      sv: "Hitta städfirmor, hemstädning och kontorsstädning i Stockholm.",
      pl: "Znajdź firmy sprzątające, sprzątanie domów i biur w Sztokholmie.",
    },
  },
  {
    href: "/cleaning-company-statistics-sweden",
    label: {
      uk: "Статистика",
      ru: "Статистика",
      en: "Statistics",
      sv: "Statistik",
      pl: "Statystyki",
    },
    title: {
      uk: "Статистика клінінгових компаній у Швеції",
      ru: "Статистика клининговых компаний в Швеции",
      en: "Cleaning Company Statistics Sweden",
      sv: "Statistik om städföretag i Sverige",
      pl: "Statystyki firm sprzątających w Szwecji",
    },
    description: {
      uk: "Дані ринку, тренди галузі, клінінгові компанії та можливості у Швеції.",
      ru: "Данные рынка, тренды отрасли, клининговые компании и возможности в Швеции.",
      en: "Market data, industry trends, cleaning companies and opportunities in Sweden.",
      sv: "Marknadsdata, branschtrender, städföretag och möjligheter i Sverige.",
      pl: "Dane rynkowe, trendy branżowe, firmy sprzątające i możliwości w Szwecji.",
    },
  },
  {
    href: "/stadbranschen-i-sverige-statistik",
    label: {
      uk: "Статистика",
      ru: "Статистика",
      en: "Statistics",
      sv: "Statistik",
      pl: "Statystyki",
    },
    title: {
      uk: "Статистика клінінгової галузі у Швеції",
      ru: "Статистика клининговой отрасли в Швеции",
      en: "Cleaning Industry Statistics in Sweden",
      sv: "Städbranschen i Sverige Statistik",
      pl: "Statystyki branży sprzątania w Szwecji",
    },
    description: {
      uk: "Гайд про клінінгову галузь, компанії, розвиток ринку та статистику у Швеції.",
      ru: "Гайд о клининговой отрасли, компаниях, развитии рынка и статистике в Швеции.",
      en: "Guide to the cleaning industry, companies, market development and statistics in Sweden.",
      sv: "Guide till städbranschen, städföretag, marknadsutveckling och statistik i Sverige.",
      pl: "Poradnik o branży sprzątania, firmach, rozwoju rynku i statystykach w Szwecji.",
    },
  },
  {
    href: "/best-cleaning-companies-in-sweden",
    label: {
      uk: "Компанії",
      ru: "Компании",
      en: "Companies",
      sv: "Företag",
      pl: "Firmy",
    },
    title: {
      uk: "Найкращі клінінгові компанії у Швеції",
      ru: "Лучшие клининговые компании в Швеции",
      en: "Best Cleaning Companies in Sweden",
      sv: "Bästa städföretag i Sverige",
      pl: "Najlepsze firmy sprzątające w Szwecji",
    },
    description: {
      uk: "Знайдіть надійні клінінгові компанії, домашнє прибирання та офісні послуги по всій Швеції.",
      ru: "Найдите надежные клининговые компании, уборку дома и офисные услуги по всей Швеции.",
      en: "Find trusted cleaning companies, home cleaning services and office cleaning providers across Sweden.",
      sv: "Hitta pålitliga städföretag, hemstädning och kontorsstädning i hela Sverige.",
      pl: "Znajdź zaufane firmy sprzątające, sprzątanie domów i biur w całej Szwecji.",
    },
  },
  {
    href: "/basta-stadforetag-i-sverige",
    label: {
      uk: "Компанії",
      ru: "Компании",
      en: "Companies",
      sv: "Företag",
      pl: "Firmy",
    },
    title: {
      uk: "Найкращі клінінгові компанії у Швеції",
      ru: "Лучшие клининговые компании в Швеции",
      en: "Best Cleaning Companies in Sweden",
      sv: "Bästa Städföretag i Sverige",
      pl: "Najlepsze firmy sprzątające w Szwecji",
    },
    description: {
      uk: "Знайдіть клінінгові компанії, домашнє та офісне прибирання по всій Швеції.",
      ru: "Найдите клининговые компании, уборку домов и офисов по всей Швеции.",
      en: "Find cleaning companies, home cleaning and office cleaning across Sweden.",
      sv: "Hitta städföretag, hemstädning och kontorsstädning i hela Sverige.",
      pl: "Znajdź firmy sprzątające, sprzątanie domów i biur w całej Szwecji.",
    },
  },
]

function JourneyCard({
  href,
  icon,
  title,
  description,
  cta,
}: {
  href: string
  icon: string
  title: string
  description: string
  cta: string
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition hover:border-rose-200 hover:bg-rose-50/40 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-base font-semibold tracking-tight text-slate-950">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-5 text-slate-600">{description}</p>
        <div className="mt-2 text-sm font-semibold text-rose-700">
          {cta} →
        </div>
      </div>
    </Link>
  )
}

function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-7">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
        {description}
      </p>
    </div>
  )
}

function StepCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-7">
      <h3 className="text-lg font-semibold tracking-tight text-slate-950 md:text-xl">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 md:text-[15px]">
        {description}
      </p>
    </div>
  )
}

function GuideCard({
  href,
  title,
  description,
  label,
  readGuide,
}: {
  href: string
  title: string
  description: string
  label: string
  readGuide: string
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="group rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
    >
      <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
        {label}
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-700 md:text-xl">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>

      <div className="mt-5 text-sm font-semibold text-rose-700">
        {readGuide}
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value)
  const dict = getUiDictionary(locale)
  const landing = dict.landing
  const home = homeCopy[locale] || homeCopy.sv
  const swedishGuidePaths = new Set([
    "/jobb-i-sverige",
    "/stadjobb-stockholm",
    "/stadjobb-goteborg",
    "/jobb-utan-svenska",
    "/hur-man-far-jobb-i-sverige",
    "/vad-tjanar-en-stadare-i-sverige",
    "/stadfirma-stockholm",
    "/stadbranschen-i-sverige-statistik",
    "/basta-stadforetag-i-sverige",
  ])
  const displayedGuides =
    locale === "sv"
      ? guides.filter((guide) => swedishGuidePaths.has(guide.href))
      : guides

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-rose-50/40 p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
                {landing.hero_title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                {landing.hero_description}
              </p>

              <div className="mt-8">
                <div className="mb-4">
                  <div className="text-lg font-semibold tracking-tight text-slate-950">
                    {home.chooseTitle}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {home.chooseText}
                  </p>
                </div>

                <div className="grid gap-3">
                  <JourneyCard
                    href="/companies"
                    icon="🧹"
                    title={home.customerTitle}
                    description={home.customerText}
                    cta={home.customerCta}
                  />
                  <JourneyCard
                    href="/jobs"
                    icon="💼"
                    title={home.workerTitle}
                    description={home.workerText}
                    cta={home.workerCta}
                  />
                  <JourneyCard
                    href="/companies"
                    icon="🏢"
                    title={home.companyTitle}
                    description={home.companyText}
                    cta={home.companyCta}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-rose-100/60 blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
                <Image
                  src="/hero-cleaner.png"
                  alt="Professional cleaner in a bright modern home"
                  width={1536}
                  height={1024}
                  priority
                  className="h-[280px] w-full object-cover object-center sm:h-[360px] lg:h-[500px]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-5 md:grid-cols-3">
            <FeatureCard
              title={landing.trust_fast_title}
              description={landing.trust_fast_desc}
            />
            <FeatureCard
              title={landing.trust_safe_title}
              description={landing.trust_safe_desc}
            />
            <FeatureCard
              title={landing.trust_simple_title}
              description={landing.trust_simple_desc}
            />
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                {home.companiesBadge}
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {home.companiesTitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                {home.companiesText}
              </p>
            </div>

            <Link
              href="/companies"
              prefetch={false}
              className="hidden rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 md:inline-flex"
            >
              {home.viewAllCompanies}
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {[
              ["hemfrid-stockholm", "Hemfrid"],
              ["homemaid-stockholm", "HomeMaid"],
              ["freska-stockholm", "Freska"],
              ["hello-clean-stockholm", "Hello Clean"],
              ["veterankraft-stockholm", "Veterankraft"],
            ].map(([slug, name]) => (
              <Link
                key={slug}
                href={`/companies/${slug}`}
                prefetch={false}
                className="rounded-3xl border border-slate-200 p-5 transition hover:border-rose-200 hover:shadow-md"
              >
                <h3 className="font-semibold text-slate-950">{name}</h3>
                <p className="mt-2 text-sm text-slate-500">Stockholm</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link
              href="/companies"
              prefetch={false}
              className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {home.viewAllCompanies}
            </Link>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
              {landing.how_title}
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <StepCard title={landing.step1_title} description={landing.step1_desc} />
            <StepCard title={landing.step2_title} description={landing.step2_desc} />
            <StepCard title={landing.step3_title} description={landing.step3_desc} />
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {landing.seo_title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {landing.seo_description}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
                {home.guidesBadge}
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {home.guidesTitle}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
                {home.guidesText}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {displayedGuides.map((guide) => (
              <GuideCard
                key={guide.href}
                href={guide.href}
                label={guide.label[locale]}
                title={guide.title[locale]}
                description={guide.description[locale]}
                readGuide={home.readGuide}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[32px] border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8 lg:p-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {landing.cta_title}
            </h2>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-800"
              >
                {landing.create_account}
              </Link>

              <Link
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-2 active:scale-[0.97] active:bg-rose-100"
              >
                {landing.browse_jobs}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
