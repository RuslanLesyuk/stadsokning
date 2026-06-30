import Link from "next/link"
import { cookies } from "next/headers"
import { normalizeLocale, type Locale } from "@/lib/i18n"

type LocalText = Record<Locale, string>

type Guide = {
  href: string
  label: LocalText
  title: LocalText
  description: LocalText
}

const copy: Record<
  Locale,
  {
    badge: string
    title: string
    description: string
    readGuide: string
  }
> = {
  uk: {
    badge: "SEO хаб",
    title: "Схожі гайди",
    description:
      "Перегляньте більше гайдів про роботу, клінінг, зарплати та клінінгові компанії у Швеції.",
    readGuide: "Читати гайд →",
  },
  ru: {
    badge: "SEO хаб",
    title: "Похожие гайды",
    description:
      "Посмотрите больше гайдов о работе, клининге, зарплатах и клининговых компаниях в Швеции.",
    readGuide: "Читать гайд →",
  },
  en: {
    badge: "SEO hub",
    title: "Related guides",
    description:
      "Explore more guides about jobs, cleaning work, salaries and cleaning companies in Sweden.",
    readGuide: "Read guide →",
  },
  sv: {
    badge: "SEO-hubb",
    title: "Relaterade guider",
    description:
      "Utforska fler guider om jobb, städarbete, löner och städföretag i Sverige.",
    readGuide: "Läs guide →",
  },
  pl: {
    badge: "SEO hub",
    title: "Powiązane poradniki",
    description:
      "Zobacz więcej poradników o pracy, sprzątaniu, wynagrodzeniach i firmach sprzątających w Szwecji.",
    readGuide: "Czytaj poradnik →",
  },
}

const guides: Guide[] = [
  {
    href: "/work-in-sweden",
    label: {
      uk: "Робота",
      ru: "Работа",
      en: "Guide",
      sv: "Guide",
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
      uk: "Повний гайд про роботу, вакансії та можливості у Швеції.",
      ru: "Полный гайд о работе, вакансиях и возможностях в Швеции.",
      en: "Complete guide to jobs, work and cleaning opportunities in Sweden.",
      sv: "Guide till arbete, städjobb och möjligheter i Sverige.",
      pl: "Kompletny poradnik o pracy, zleceniach i możliwościach w Szwecji.",
    },
  },
  {
    href: "/jobs-for-foreigners-in-sweden",
    label: {
      uk: "Іноземці",
      ru: "Иностранцы",
      en: "Foreigners",
      sv: "Utlänningar",
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
      uk: "Практичний гайд для новоприбулих, іммігрантів і експатів.",
      ru: "Практический гайд для новичков, иммигрантов и экспатов.",
      en: "Practical guide for newcomers, immigrants and expats looking for work.",
      sv: "Praktisk guide för nyanlända, invandrare och expats som söker arbete.",
      pl: "Praktyczny poradnik dla nowych osób, imigrantów i ekspatów.",
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
      uk: "Дізнайтеся, де шукати роботу, як подаватися і швидше знайти роботу.",
      ru: "Узнайте, где искать работу, как подаваться и быстрее найти работу.",
      en: "Learn where to search, how to apply and how to get hired faster.",
      sv: "Lär dig var du söker jobb, hur du ansöker och snabbare blir anställd.",
      pl: "Dowiedz się, gdzie szukać pracy, jak aplikować i szybciej ją znaleźć.",
    },
  },
  {
    href: "/jobb-i-sverige",
    label: {
      uk: "Швеція",
      ru: "Швеция",
      en: "Swedish",
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
      uk: "Гайд про роботу, клінінг і можливості у Швеції.",
      ru: "Гайд о работе, клининге и возможностях в Швеции.",
      en: "Guide to work, cleaning jobs and opportunities in Sweden.",
      sv: "Guide till arbete, städjobb och möjligheter i Sverige.",
      pl: "Poradnik o pracy, sprzątaniu i możliwościach w Szwecji.",
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
      uk: "Знайдіть роботу у Швеції, навіть якщо ще не говорите шведською вільно.",
      ru: "Найдите работу в Швеции, даже если ещё не говорите свободно по-шведски.",
      en: "Find work in Sweden even if you do not speak fluent Swedish.",
      sv: "Hitta arbete i Sverige även om du inte talar flytande svenska.",
      pl: "Znajdź pracę w Szwecji nawet bez płynnego szwedzkiego.",
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
      pl: "Ile zarabiają sprzątacze w Szwecji",
    },
    description: {
      uk: "Гайд про зарплати прибиральників, місячну оплату та фактори доходу.",
      ru: "Гайд о зарплатах уборщиков, месячной оплате и факторах дохода.",
      en: "Cleaner salary guide with monthly pay and income factors.",
      sv: "Guide till städarlön, månadslön och inkomstfaktorer.",
      pl: "Poradnik o zarobkach sprzątaczy, pensji miesięcznej i czynnikach dochodu.",
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
      uk: "Гайд про зарплату прибиральника, місячну оплату та більше клінінгової роботи.",
      ru: "Гайд о зарплате уборщика, месячной оплате и большем количестве работы.",
      en: "Guide to cleaner salary, monthly pay and more cleaning jobs.",
      sv: "Guide till städare lön, månadslön och fler städjobb.",
      pl: "Poradnik o pensji sprzątacza, miesięcznej wypłacie i większej liczbie zleceń.",
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
      uk: "Дані ринку, клінінгові компанії та тренди галузі.",
      ru: "Данные рынка, клининговые компании и тренды отрасли.",
      en: "Market data, cleaning companies and industry trends.",
      sv: "Marknadsdata, städföretag och branschtrender.",
      pl: "Dane rynkowe, firmy sprzątające i trendy branżowe.",
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
      uk: "Гайд про клінінгову галузь, ринок і клінінгові компанії.",
      ru: "Гайд о клининговой отрасли, рынке и клининговых компаниях.",
      en: "Guide to the cleaning industry, market and cleaning companies.",
      sv: "Guide till städbranschen, marknad och städföretag.",
      pl: "Poradnik o branży sprzątania, rynku i firmach sprzątających.",
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
      uk: "Знайдіть надійні клінінгові компанії та послуги по всій Швеції.",
      ru: "Найдите надежные клининговые компании и услуги по всей Швеции.",
      en: "Find trusted cleaning companies and services across Sweden.",
      sv: "Hitta pålitliga städföretag och tjänster i hela Sverige.",
      pl: "Znajdź zaufane firmy sprzątające i usługi w całej Szwecji.",
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
      uk: "Знайдіть клінінгові компанії, домашнє та офісне прибирання.",
      ru: "Найдите клининговые компании, уборку домов и офисов.",
      en: "Find cleaning companies, home cleaning and office cleaning.",
      sv: "Hitta städföretag, hemstädning och kontorsstädning.",
      pl: "Znajdź firmy sprzątające, sprzątanie domów i biur.",
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
      uk: "Знайдіть клінінгові роботи та замовлення у Стокгольмі.",
      ru: "Найдите клининговые работы и заказы в Стокгольме.",
      en: "Find cleaning jobs and cleaner work in Stockholm.",
      sv: "Hitta städjobb och städarbete i Stockholm.",
      pl: "Znajdź zlecenia sprzątania i pracę w Sztokholmie.",
    },
  },
  {
    href: "/stadjobb-stockholm",
    label: {
      uk: "Стокгольм",
      ru: "Стокгольм",
      en: "Cleaning work",
      sv: "Städjobb",
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
      uk: "Знайдіть домашнє прибирання, переїзне прибирання та клінінгові роботи.",
      ru: "Найдите уборку дома, после переезда и клининговые работы.",
      en: "Find home cleaning, moving cleaning and cleaning jobs.",
      sv: "Hitta städjobb, hemstädning och flyttstädning i Stockholm.",
      pl: "Znajdź sprzątanie domów, po przeprowadzce i zlecenia sprzątania.",
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
      uk: "Знайдіть клінінгові роботи та замовлення у Гетеборзі.",
      ru: "Найдите клининговые работы и заказы в Гётеборге.",
      en: "Find cleaning jobs and cleaner work in Gothenburg.",
      sv: "Hitta städjobb och städuppdrag i Göteborg.",
      pl: "Znajdź zlecenia sprzątania i pracę w Göteborgu.",
    },
  },
  {
    href: "/stadjobb-goteborg",
    label: {
      uk: "Гетеборг",
      ru: "Гётеборг",
      en: "Cleaning work",
      sv: "Städjobb",
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
      uk: "Знайдіть клінінгові роботи та замовлення у Гетеборзі.",
      ru: "Найдите клининговые работы и заказы в Гётеборге.",
      en: "Find cleaning jobs and cleaning assignments in Gothenburg.",
      sv: "Hitta städjobb och städuppdrag i Göteborg.",
      pl: "Znajdź pracę i zlecenia sprzątania w Göteborgu.",
    },
  },
  {
    href: "/cleaning-jobs-malmo",
    label: {
      uk: "Мальме",
      ru: "Мальмё",
      en: "Malmö",
      sv: "Malmö",
      pl: "Malmö",
    },
    title: {
      uk: "Клінінгові роботи у Мальме",
      ru: "Клининговые работы в Мальмё",
      en: "Cleaning Jobs Malmö",
      sv: "Städjobb Malmö",
      pl: "Praca sprzątanie Malmö",
    },
    description: {
      uk: "Знайдіть клінінгові роботи та замовлення у Мальме.",
      ru: "Найдите клининговые работы и заказы в Мальмё.",
      en: "Find cleaning jobs and cleaner work in Malmö.",
      sv: "Hitta städjobb och städuppdrag i Malmö.",
      pl: "Znajdź zlecenia sprzątania i pracę w Malmö.",
    },
  },
  {
    href: "/stadjobb-malmo",
    label: {
      uk: "Мальме",
      ru: "Мальмё",
      en: "Cleaning work",
      sv: "Städjobb",
      pl: "Malmö",
    },
    title: {
      uk: "Робота з прибирання у Мальме",
      ru: "Работа по уборке в Мальмё",
      en: "Cleaning Work Malmö",
      sv: "Städjobb Malmö",
      pl: "Praca sprzątanie Malmö",
    },
    description: {
      uk: "Знайдіть клінінгові роботи та замовлення у Мальме.",
      ru: "Найдите клининговые работы и заказы в Мальмё.",
      en: "Find cleaning jobs and cleaning assignments in Malmö.",
      sv: "Hitta städjobb och städuppdrag i Malmö.",
      pl: "Znajdź pracę i zlecenia sprzątania w Malmö.",
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
      en: "Cleaning company",
      sv: "Städfirma",
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
      uk: "Знайдіть клінінгові компанії та послуги у Стокгольмі.",
      ru: "Найдите клининговые компании и услуги в Стокгольме.",
      en: "Find cleaning companies and services in Stockholm.",
      sv: "Hitta städfirmor och städtjänster i Stockholm.",
      pl: "Znajdź firmy sprzątające i usługi w Sztokholmie.",
    },
  },
]

function hashString(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

export default async function RelatedGuides({
  currentPath,
  title,
}: {
  currentPath: string
  title?: string
}) {
  const cookieStore = await cookies()
  const locale = normalizeLocale(cookieStore.get("clean_jobs_locale")?.value)

  const t = copy[locale] || copy.en
  const availableGuides = guides.filter((guide) => guide.href !== currentPath)
  const startIndex = hashString(currentPath) % availableGuides.length

  const selectedGuides = [
    ...availableGuides.slice(startIndex),
    ...availableGuides.slice(0, startIndex),
  ].slice(0, 4)

  return (
    <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-700">
            {t.badge}
          </div>

          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {title || t.title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {t.description}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {selectedGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            prefetch={false}
            className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          >
            <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
              {guide.label[locale]}
            </div>

            <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950 transition group-hover:text-rose-700">
              {guide.title[locale]}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {guide.description[locale]}
            </p>

            <div className="mt-5 text-sm font-semibold text-rose-700">
              {t.readGuide}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}