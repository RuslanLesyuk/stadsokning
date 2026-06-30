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
    metaTitle: "Скільки заробляють прибиральники у Швеції 2026? | Clean Jobs",
    metaDescription:
      "Гід по зарплаті прибиральників у Швеції: місячна зарплата, погодинна оплата, фактори доходу та як знайти роботу з прибирання.",
    metaOgTitle: "Скільки заробляють прибиральники у Швеції? | Clean Jobs",
    metaOgDescription:
      "Гід по зарплатах прибиральників у Швеції, рівнях доходу, різниці між містами та пошуку роботи з прибирання.",
    metaOgAlt: "Зарплата прибиральника у Швеції",

    faqSalaryQuestion: "Скільки заробляють прибиральники у Швеції?",
    faqSalaryAnswer:
      "Офіційна статистика зарплат показує, що прибиральники у Швеції часто заробляють приблизно у верхньому діапазоні 20 000 SEK на місяць до податків, залежно від досвіду, регіону, роботодавця та робочих годин.",
    faqCitiesQuestion: "Чи заробляють прибиральники більше у Стокгольмі, Гетеборзі або Мальме?",
    faqCitiesAnswer:
      "Оплата може відрізнятися залежно від міста й роботодавця. Великі міста можуть давати більше можливостей, але конкуренція та витрати на дорогу також можуть бути вищими.",
    faqIncreaseQuestion: "Як збільшити дохід прибиральником у Швеції?",
    faqIncreaseAnswer:
      "Можна підвищити дохід через довіру клієнтів, регулярні замовлення, вивчення шведської, якість роботи, співпрацю з компаніями та сильний профіль на платформах як Clean Jobs.",

    heroEyebrow: "Зарплата прибиральника у Швеції",
    heroTitle: "Скільки заробляють прибиральники у Швеції?",
    heroText:
      "Зарплата прибиральника у Швеції залежить від досвіду, роботодавця, міста, робочих годин і типу прибирання. Прибирання дому, офісу, після переїзду та регулярні замовлення можуть мати різний рівень оплати.",
    browseJobs: "Переглянути роботи з прибирання",
    foreignersJobs: "Робота для іноземців",

    statMonthlyTitle: "Типова місячна зарплата",
    statMonthlyValue: "≈ 27,600–28,700 SEK",
    statMonthlyText:
      "Публічні джерела зарплат ставлять прибиральників приблизно у верхній діапазон 20 000 SEK на місяць до податків.",
    statRangeTitle: "Нижній квартиль / медіана / верхній квартиль",
    statRangeValue: "26,800 / 28,600 / 30,400",
    statRangeText:
      "Регіональна статистика SCB показує цей діапазон для прибиральників у доступній таблиці.",
    statDependsTitle: "Зарплата залежить від",
    statDependsValue: "Місто + роботодавець",
    statDependsText:
      "Досвід, години, відповідальність, тип компанії та регіон можуть змінити фінальний дохід.",

    salaryEyebrow: "Огляд зарплати",
    salaryTitle: "Зарплата прибиральника у Швеції",
    salaryText1:
      "Офіційна шведська статистика зарплат показує, що прибиральники часто отримують приблизно верхній діапазон 20 000 SEK на місяць до податків. Таблиця SCB для прибиральників показує орієнтири близько 26,800 SEK, 28,600 SEK і 30,400 SEK.",
    salaryText2:
      "Ці числа корисні як орієнтир, але не гарантія. Реальна зарплата залежить від повної або часткової зайнятості, компанії, приватних клієнтів, регулярних замовлень і спеціалізованого прибирання.",

    factorsEyebrow: "Фактори доходу",
    factorsTitle: "Що впливає на оплату прибиральника?",
    factorsText1:
      "Найважливіші фактори — досвід, якість, надійність, місто, роботодавець і тип прибирання. Той, хто може брати офіси, доми, переїзди та регулярних клієнтів, має більше можливостей.",
    factorsText2:
      "Комунікація також важлива. У Швеції клієнти часто цінують довіру, пунктуальність і чіткі очікування. Сильний профіль і швидкі відповіді можуть давати більше запитів.",

    citiesEyebrow: "Міста",
    citiesTitle: "Зарплати прибиральників у Стокгольмі, Гетеборзі та Мальме",
    citiesText1:
      "У Стокгольмі, Гетеборзі та Мальме часто більше робіт з прибирання, бо там більше квартир, офісів, переїздів і локального бізнесу. Великі міста можуть давати більше можливостей, але також більше конкуренції.",
    citiesText2:
      "Прибиральники, які можуть їздити між кількома районами, часто мають більше шансів знайти роботу. Біля Стокгольма варто дивитися Solna, Sundbyberg, Järfälla, Nacka, Huddinge та сусідні комуни.",

    workTypesEyebrow: "Типи робіт",
    workTypesTitle: "Які роботи з прибирання можуть оплачуватися краще?",
    workTypesText1:
      "Регулярне прибирання може давати стабільний дохід, бо клієнт потребує допомоги щотижня або щомісяця. Прибирання після переїзду іноді має більший бюджет, бо робота більша й термінова.",
    workTypesText2:
      "Для окремих працівників ціль — створити стабільний потік робіт. Для клінінгових компаній — отримувати більше запитів і зберігати хороших клієнтів.",

    tipsEyebrow: "Поради",
    tipsTitle: "Як збільшити дохід прибиральником",
    tipsText1:
      "Створіть чіткий профіль, додайте місто, опишіть досвід і типи прибирання, які можете виконувати. Вкажіть, чи доступні ви для прибирання дому, офісу, після переїзду, вечорами, у вихідні або для регулярних замовлень.",
    tipsText2:
      "Якщо ви ще вчите шведську, продовжуйте. Навіть базова шведська допомагає будувати довіру. Хороші відгуки, пунктуальність і швидкі відповіді теж допомагають отримувати більше клієнтів.",

    ctaTitle: "Знайдіть роботу з прибирання у Швеції",
    ctaText:
      "Clean Jobs допомагає прибиральникам, клієнтам і клінінговим компаніям знаходити одне одного по всій Швеції. Почніть із перегляду робіт або створення профілю.",
    ctaBrowse: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Сколько зарабатывают уборщики в Швеции 2026? | Clean Jobs",
    metaDescription:
      "Гид по зарплате уборщиков в Швеции: месячная зарплата, почасовая оплата, факторы дохода и как найти работу по уборке.",
    metaOgTitle: "Сколько зарабатывают уборщики в Швеции? | Clean Jobs",
    metaOgDescription:
      "Гид по зарплатам уборщиков в Швеции, уровням дохода, разнице между городами и поиску работы по уборке.",
    metaOgAlt: "Зарплата уборщика в Швеции",

    faqSalaryQuestion: "Сколько зарабатывают уборщики в Швеции?",
    faqSalaryAnswer:
      "Официальная статистика зарплат показывает, что уборщики в Швеции часто получают примерно верхний диапазон 20 000 SEK в месяц до налогов, в зависимости от опыта, региона, работодателя и рабочих часов.",
    faqCitiesQuestion: "Зарабатывают ли уборщики больше в Стокгольме, Гётеборге или Мальмё?",
    faqCitiesAnswer:
      "Оплата может отличаться по городу и работодателю. Крупные города могут давать больше возможностей, но конкуренция и расходы на дорогу тоже могут быть выше.",
    faqIncreaseQuestion: "Как увеличить доход уборщиком в Швеции?",
    faqIncreaseAnswer:
      "Доход можно увеличить через доверие клиентов, регулярные заказы, изучение шведского, качество работы, сотрудничество с компаниями и сильный профиль на платформах вроде Clean Jobs.",

    heroEyebrow: "Зарплата уборщика в Швеции",
    heroTitle: "Сколько зарабатывают уборщики в Швеции?",
    heroText:
      "Зарплата уборщика в Швеции зависит от опыта, работодателя, города, рабочих часов и типа уборки. Уборка дома, офиса, после переезда и регулярные заказы могут иметь разный уровень оплаты.",
    browseJobs: "Смотреть работы по уборке",
    foreignersJobs: "Работа для иностранцев",

    statMonthlyTitle: "Типичная месячная зарплата",
    statMonthlyValue: "≈ 27,600–28,700 SEK",
    statMonthlyText:
      "Публичные источники зарплат ставят уборщиков примерно в верхний диапазон 20 000 SEK в месяц до налогов.",
    statRangeTitle: "Нижний квартиль / медиана / верхний квартиль",
    statRangeValue: "26,800 / 28,600 / 30,400",
    statRangeText:
      "Региональная статистика SCB показывает этот диапазон для уборщиков в доступной таблице.",
    statDependsTitle: "Зарплата зависит от",
    statDependsValue: "Город + работодатель",
    statDependsText:
      "Опыт, часы, ответственность, тип компании и регион могут изменить итоговый доход.",

    salaryEyebrow: "Обзор зарплаты",
    salaryTitle: "Зарплата уборщика в Швеции",
    salaryText1:
      "Официальная шведская статистика зарплат показывает, что уборщики часто получают примерно верхний диапазон 20 000 SEK в месяц до налогов. Таблица SCB для уборщиков показывает ориентиры около 26,800 SEK, 28,600 SEK и 30,400 SEK.",
    salaryText2:
      "Эти цифры полезны как ориентир, но не гарантия. Реальная зарплата зависит от полной или частичной занятости, компании, частных клиентов, регулярных заказов и специализированной уборки.",

    factorsEyebrow: "Факторы дохода",
    factorsTitle: "Что влияет на оплату уборщика?",
    factorsText1:
      "Главные факторы — опыт, качество, надёжность, город, работодатель и тип уборки. Тот, кто может брать офисы, дома, переезды и регулярных клиентов, имеет больше возможностей.",
    factorsText2:
      "Коммуникация тоже важна. В Швеции клиенты часто ценят доверие, пунктуальность и ясные ожидания. Сильный профиль и быстрые ответы могут давать больше запросов.",

    citiesEyebrow: "Города",
    citiesTitle: "Зарплаты уборщиков в Стокгольме, Гётеборге и Мальмё",
    citiesText1:
      "В Стокгольме, Гётеборге и Мальмё часто больше работ по уборке, потому что там больше квартир, офисов, переездов и локального бизнеса. Крупные города могут давать больше возможностей, но и больше конкуренции.",
    citiesText2:
      "Уборщики, которые могут ездить между несколькими районами, часто имеют больше шансов найти работу. Возле Стокгольма стоит смотреть Solna, Sundbyberg, Järfälla, Nacka, Huddinge и соседние коммуны.",

    workTypesEyebrow: "Типы работ",
    workTypesTitle: "Какие работы по уборке могут оплачиваться лучше?",
    workTypesText1:
      "Регулярная уборка может давать стабильный доход, потому что клиенту нужна помощь каждую неделю или каждый месяц. Уборка после переезда иногда имеет больший бюджет, потому что работа крупнее и срочнее.",
    workTypesText2:
      "Для отдельных работников цель — создать стабильный поток работ. Для клининговых компаний — получать больше запросов и сохранять хороших клиентов.",

    tipsEyebrow: "Советы",
    tipsTitle: "Как увеличить доход уборщиком",
    tipsText1:
      "Создайте понятный профиль, добавьте город, опишите опыт и типы уборки, которые можете выполнять. Укажите, доступны ли вы для уборки дома, офиса, после переезда, вечером, по выходным или для регулярных заказов.",
    tipsText2:
      "Если вы ещё учите шведский, продолжайте. Даже базовый шведский помогает строить доверие. Хорошие отзывы, пунктуальность и быстрые ответы тоже помогают получать больше клиентов.",

    ctaTitle: "Найдите работу по уборке в Швеции",
    ctaText:
      "Clean Jobs помогает уборщикам, клиентам и клининговым компаниям находить друг друга по всей Швеции. Начните с просмотра работ или создания профиля.",
    ctaBrowse: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "How Much Do Cleaners Earn in Sweden 2026?",
    metaDescription:
      "Cleaner salary in Sweden guide. Learn how much cleaners earn, monthly salary, hourly pay, factors that affect income and how to find cleaning jobs.",
    metaOgTitle: "How Much Do Cleaners Earn in Sweden? | Clean Jobs",
    metaOgDescription:
      "Guide to cleaner salaries in Sweden, salary levels, city differences and how to find cleaning jobs.",
    metaOgAlt: "Cleaner salary in Sweden",

    faqSalaryQuestion: "How much do cleaners earn in Sweden?",
    faqSalaryAnswer:
      "Official salary statistics show that cleaners in Sweden are commonly around the high 20,000 SEK range per month before tax, depending on experience, region, employer and working hours.",
    faqCitiesQuestion: "Do cleaners earn more in Stockholm, Gothenburg or Malmö?",
    faqCitiesAnswer:
      "Cleaner pay can vary by city and employer. Larger cities such as Stockholm, Gothenburg and Malmö may offer more opportunities, but cost of living and competition can also be higher.",
    faqIncreaseQuestion: "How can I increase my income as a cleaner in Sweden?",
    faqIncreaseAnswer:
      "Cleaners can increase income by building trust, taking recurring clients, learning Swedish, improving quality, working with companies and creating a clear profile on platforms such as Clean Jobs.",

    heroEyebrow: "Cleaner salary Sweden",
    heroTitle: "How much do cleaners earn in Sweden?",
    heroText:
      "Cleaner salaries in Sweden depend on experience, employer, city, working hours and type of cleaning work. Home cleaning, office cleaning, move-out cleaning and recurring cleaning can all have different pay levels.",
    browseJobs: "Browse cleaning jobs",
    foreignersJobs: "Jobs for foreigners",

    statMonthlyTitle: "Typical monthly salary",
    statMonthlyValue: "≈ 27,600–28,700 SEK",
    statMonthlyText:
      "Recent public salary sources place cleaners around the high 20,000 SEK range per month before tax.",
    statRangeTitle: "Lower quartile / median / upper quartile",
    statRangeValue: "26,800 / 28,600 / 30,400",
    statRangeText:
      "SCB regional salary statistics show this range for cleaners in the latest available table.",
    statDependsTitle: "Salary depends on",
    statDependsValue: "City + employer",
    statDependsText:
      "Experience, working hours, responsibility, company type and region can change the final income.",

    salaryEyebrow: "Salary overview",
    salaryTitle: "Cleaner salary in Sweden",
    salaryText1:
      "Official Swedish salary statistics show that cleaners are commonly paid around the high 20,000 SEK range per month before tax. SCB’s latest table for cleaners shows lower quartile, median and upper quartile salary levels around 26,800 SEK, 28,600 SEK and 30,400 SEK respectively.",
    salaryText2:
      "These numbers are useful as a guide, but they are not a guarantee. Your actual salary can be higher or lower depending on whether you work full-time or part-time, whether you are employed by a company, work with private clients, have recurring customers or take specialized cleaning assignments.",

    factorsEyebrow: "Income factors",
    factorsTitle: "What affects cleaner pay?",
    factorsText1:
      "The biggest factors are experience, quality, reliability, city, employer and type of cleaning. A cleaner who can handle office cleaning, home cleaning, move-out cleaning and recurring clients can often access more opportunities.",
    factorsText2:
      "Communication also matters. Clients in Sweden often care about trust, punctuality and clear expectations. A cleaner with a strong profile, good response time and clear availability may receive more requests.",

    citiesEyebrow: "Cities",
    citiesTitle: "Cleaner salaries in Stockholm, Gothenburg and Malmö",
    citiesText1:
      "Stockholm, Gothenburg and Malmö often have more cleaning jobs because they have more apartments, offices, moving households and local businesses. Bigger cities can provide more opportunities, but they can also mean more competition and higher travel costs.",
    citiesText2:
      "Cleaners who can travel across several areas often increase their chances of finding work. For example, near Stockholm you can also look at Solna, Sundbyberg, Järfälla, Nacka, Huddinge and nearby municipalities.",

    workTypesEyebrow: "Types of work",
    workTypesTitle: "Which cleaning jobs can pay better?",
    workTypesText1:
      "Recurring cleaning can provide stable income because the client needs help every week or every month. Move-out cleaning can sometimes have a higher budget because the work is larger and time-sensitive.",
    workTypesText2:
      "For individual workers, the goal is often to build a reliable flow of jobs. For cleaning companies, the goal is to receive more requests and keep good clients over time.",

    tipsEyebrow: "Tips",
    tipsTitle: "How to increase your income as a cleaner",
    tipsText1:
      "Create a clear profile, add your city, describe your experience and show what type of cleaning work you can do. Mention whether you are available for home cleaning, office cleaning, move-out cleaning, evening work, weekend work or recurring cleaning.",
    tipsText2:
      "If you are still learning Swedish, keep improving it. Even basic Swedish can help build trust and make communication easier. Good reviews, punctuality and fast replies can also help you get more clients.",

    ctaTitle: "Find cleaning jobs in Sweden",
    ctaText:
      "Clean Jobs helps cleaners, clients and cleaning companies connect across Sweden. Start by browsing jobs or creating a profile.",
    ctaBrowse: "Browse jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Hur mycket tjänar städare i Sverige 2026? | Clean Jobs",
    metaDescription:
      "Guide till städares lön i Sverige. Läs om månadslön, timlön, faktorer som påverkar inkomsten och hur du hittar städjobb.",
    metaOgTitle: "Hur mycket tjänar städare i Sverige? | Clean Jobs",
    metaOgDescription:
      "Guide till städares löner i Sverige, lönenivåer, skillnader mellan städer och hur du hittar städjobb.",
    metaOgAlt: "Städare lön i Sverige",

    faqSalaryQuestion: "Hur mycket tjänar städare i Sverige?",
    faqSalaryAnswer:
      "Officiell lönestatistik visar att städare i Sverige ofta ligger runt det övre 20 000-kronorsintervallet per månad före skatt, beroende på erfarenhet, region, arbetsgivare och arbetstid.",
    faqCitiesQuestion: "Tjänar städare mer i Stockholm, Göteborg eller Malmö?",
    faqCitiesAnswer:
      "Lönen kan variera beroende på stad och arbetsgivare. Större städer kan ge fler möjligheter, men konkurrens och resekostnader kan också vara högre.",
    faqIncreaseQuestion: "Hur kan jag öka min inkomst som städare i Sverige?",
    faqIncreaseAnswer:
      "Städare kan öka inkomsten genom att bygga förtroende, ta återkommande kunder, lära sig svenska, förbättra kvaliteten, arbeta med företag och skapa en tydlig profil på plattformar som Clean Jobs.",

    heroEyebrow: "Städare lön Sverige",
    heroTitle: "Hur mycket tjänar städare i Sverige?",
    heroText:
      "Städares löner i Sverige beror på erfarenhet, arbetsgivare, stad, arbetstid och typ av städarbete. Hemstädning, kontorsstädning, flyttstädning och återkommande städning kan ha olika lönenivåer.",
    browseJobs: "Bläddra bland städjobb",
    foreignersJobs: "Jobb för utlänningar",

    statMonthlyTitle: "Typisk månadslön",
    statMonthlyValue: "≈ 27,600–28,700 SEK",
    statMonthlyText:
      "Aktuella offentliga lönekällor placerar städare runt det övre 20 000-kronorsintervallet per månad före skatt.",
    statRangeTitle: "Nedre kvartil / median / övre kvartil",
    statRangeValue: "26,800 / 28,600 / 30,400",
    statRangeText:
      "SCB:s regionala lönestatistik visar detta intervall för städare i den senaste tillgängliga tabellen.",
    statDependsTitle: "Lönen beror på",
    statDependsValue: "Stad + arbetsgivare",
    statDependsText:
      "Erfarenhet, arbetstid, ansvar, företagstyp och region kan påverka den slutliga inkomsten.",

    salaryEyebrow: "Löneöversikt",
    salaryTitle: "Städare lön i Sverige",
    salaryText1:
      "Officiell svensk lönestatistik visar att städare ofta betalas runt det övre 20 000-kronorsintervallet per månad före skatt. SCB:s tabell för städare visar nivåer runt 26,800 SEK, 28,600 SEK och 30,400 SEK.",
    salaryText2:
      "Dessa siffror är användbara som vägledning, men de är ingen garanti. Din faktiska lön kan bli högre eller lägre beroende på heltid, deltid, arbetsgivare, privata kunder, återkommande uppdrag och specialiserad städning.",

    factorsEyebrow: "Inkomstfaktorer",
    factorsTitle: "Vad påverkar städares lön?",
    factorsText1:
      "De största faktorerna är erfarenhet, kvalitet, pålitlighet, stad, arbetsgivare och typ av städning. En städare som kan ta kontorsstädning, hemstädning, flyttstädning och återkommande kunder får ofta fler möjligheter.",
    factorsText2:
      "Kommunikation spelar också roll. Kunder i Sverige bryr sig ofta om förtroende, punktlighet och tydliga förväntningar. En stark profil och snabba svar kan ge fler förfrågningar.",

    citiesEyebrow: "Städer",
    citiesTitle: "Städares löner i Stockholm, Göteborg och Malmö",
    citiesText1:
      "Stockholm, Göteborg och Malmö har ofta fler städjobb eftersom de har fler lägenheter, kontor, flyttar och lokala företag. Större städer kan ge fler möjligheter, men också mer konkurrens.",
    citiesText2:
      "Städare som kan resa mellan flera områden ökar ofta sina chanser att hitta arbete. Nära Stockholm kan du till exempel också titta på Solna, Sundbyberg, Järfälla, Nacka, Huddinge och närliggande kommuner.",

    workTypesEyebrow: "Typer av arbete",
    workTypesTitle: "Vilka städjobb kan betala bättre?",
    workTypesText1:
      "Återkommande städning kan ge stabil inkomst eftersom kunden behöver hjälp varje vecka eller månad. Flyttstädning kan ibland ha högre budget eftersom arbetet är större och tidskänsligt.",
    workTypesText2:
      "För enskilda arbetare är målet ofta att bygga ett stabilt flöde av jobb. För städföretag är målet att få fler förfrågningar och behålla bra kunder över tid.",

    tipsEyebrow: "Tips",
    tipsTitle: "Så ökar du inkomsten som städare",
    tipsText1:
      "Skapa en tydlig profil, lägg till din stad, beskriv din erfarenhet och visa vilken typ av städarbete du kan göra. Nämn om du är tillgänglig för hemstädning, kontorsstädning, flyttstädning, kvällar, helger eller återkommande städning.",
    tipsText2:
      "Om du fortfarande lär dig svenska, fortsätt förbättra den. Även grundläggande svenska kan bygga förtroende. Bra omdömen, punktlighet och snabba svar kan också hjälpa dig att få fler kunder.",

    ctaTitle: "Hitta städjobb i Sverige",
    ctaText:
      "Clean Jobs hjälper städare, kunder och städföretag att mötas i hela Sverige. Börja med att bläddra bland jobb eller skapa en profil.",
    ctaBrowse: "Bläddra bland jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Ile zarabiają sprzątacze w Szwecji 2026? | Clean Jobs",
    metaDescription:
      "Poradnik o zarobkach sprzątaczy w Szwecji: miesięczna pensja, stawka godzinowa, czynniki dochodu i jak znaleźć prace sprzątania.",
    metaOgTitle: "Ile zarabiają sprzątacze w Szwecji? | Clean Jobs",
    metaOgDescription:
      "Poradnik o pensjach sprzątaczy w Szwecji, poziomach wynagrodzeń, różnicach między miastami i szukaniu pracy sprzątania.",
    metaOgAlt: "Pensja sprzątacza w Szwecji",

    faqSalaryQuestion: "Ile zarabiają sprzątacze w Szwecji?",
    faqSalaryAnswer:
      "Oficjalne statystyki wynagrodzeń pokazują, że sprzątacze w Szwecji często zarabiają w górnym zakresie 20 000 SEK miesięcznie przed podatkiem, zależnie od doświadczenia, regionu, pracodawcy i godzin pracy.",
    faqCitiesQuestion: "Czy sprzątacze zarabiają więcej w Sztokholmie, Göteborgu lub Malmö?",
    faqCitiesAnswer:
      "Wynagrodzenie może różnić się w zależności od miasta i pracodawcy. Większe miasta mogą dawać więcej możliwości, ale konkurencja i koszty dojazdu mogą być wyższe.",
    faqIncreaseQuestion: "Jak zwiększyć dochód jako sprzątacz w Szwecji?",
    faqIncreaseAnswer:
      "Sprzątacze mogą zwiększyć dochód przez budowanie zaufania, stałych klientów, naukę szwedzkiego, lepszą jakość, pracę z firmami i jasny profil na platformach takich jak Clean Jobs.",

    heroEyebrow: "Pensja sprzątacza w Szwecji",
    heroTitle: "Ile zarabiają sprzątacze w Szwecji?",
    heroText:
      "Pensje sprzątaczy w Szwecji zależą od doświadczenia, pracodawcy, miasta, godzin pracy i typu sprzątania. Sprzątanie domu, biura, po przeprowadzce i regularne zlecenia mogą mieć różne poziomy wynagrodzenia.",
    browseJobs: "Przeglądaj prace sprzątania",
    foreignersJobs: "Praca dla obcokrajowców",

    statMonthlyTitle: "Typowa miesięczna pensja",
    statMonthlyValue: "≈ 27,600–28,700 SEK",
    statMonthlyText:
      "Publiczne źródła płac wskazują sprzątaczy w górnym zakresie 20 000 SEK miesięcznie przed podatkiem.",
    statRangeTitle: "Dolny kwartyl / mediana / górny kwartyl",
    statRangeValue: "26,800 / 28,600 / 30,400",
    statRangeText:
      "Regionalne statystyki SCB pokazują ten zakres dla sprzątaczy w dostępnej tabeli.",
    statDependsTitle: "Pensja zależy od",
    statDependsValue: "Miasto + pracodawca",
    statDependsText:
      "Doświadczenie, godziny pracy, odpowiedzialność, typ firmy i region mogą zmienić końcowy dochód.",

    salaryEyebrow: "Przegląd pensji",
    salaryTitle: "Pensja sprzątacza w Szwecji",
    salaryText1:
      "Oficjalne szwedzkie statystyki płac pokazują, że sprzątacze często zarabiają w górnym zakresie 20 000 SEK miesięcznie przed podatkiem. Tabela SCB dla sprzątaczy pokazuje poziomy około 26,800 SEK, 28,600 SEK i 30,400 SEK.",
    salaryText2:
      "Te liczby są przydatne jako wskazówka, ale nie są gwarancją. Rzeczywista pensja zależy od pełnego lub częściowego etatu, firmy, prywatnych klientów, stałych zleceń i specjalistycznego sprzątania.",

    factorsEyebrow: "Czynniki dochodu",
    factorsTitle: "Co wpływa na wynagrodzenie sprzątacza?",
    factorsText1:
      "Największe czynniki to doświadczenie, jakość, niezawodność, miasto, pracodawca i typ sprzątania. Osoba, która może wykonywać sprzątanie biur, domów, po przeprowadzce i regularne zlecenia, ma więcej możliwości.",
    factorsText2:
      "Komunikacja też ma znaczenie. Klienci w Szwecji często cenią zaufanie, punktualność i jasne oczekiwania. Silny profil i szybkie odpowiedzi mogą dawać więcej zapytań.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Pensje sprzątaczy w Sztokholmie, Göteborgu i Malmö",
    citiesText1:
      "Sztokholm, Göteborg i Malmö często mają więcej prac sprzątania, ponieważ mają więcej mieszkań, biur, przeprowadzek i lokalnych firm. Większe miasta mogą dawać więcej możliwości, ale też większą konkurencję.",
    citiesText2:
      "Sprzątacze, którzy mogą podróżować między kilkoma obszarami, często zwiększają szanse na pracę. W pobliżu Sztokholmu warto też sprawdzić Solna, Sundbyberg, Järfälla, Nacka, Huddinge i sąsiednie gminy.",

    workTypesEyebrow: "Typy pracy",
    workTypesTitle: "Które prace sprzątania mogą płacić lepiej?",
    workTypesText1:
      "Regularne sprzątanie może dawać stabilny dochód, ponieważ klient potrzebuje pomocy co tydzień lub co miesiąc. Sprzątanie po przeprowadzce czasem ma większy budżet, bo praca jest większa i pilna.",
    workTypesText2:
      "Dla pojedynczych pracowników celem jest stabilny przepływ zleceń. Dla firm sprzątających celem jest więcej zapytań i utrzymanie dobrych klientów.",

    tipsEyebrow: "Wskazówki",
    tipsTitle: "Jak zwiększyć dochód jako sprzątacz",
    tipsText1:
      "Stwórz jasny profil, dodaj miasto, opisz doświadczenie i pokaż, jakie typy sprzątania wykonujesz. Napisz, czy jesteś dostępny do sprzątania domu, biura, po przeprowadzce, wieczorami, w weekendy lub regularnie.",
    tipsText2:
      "Jeśli nadal uczysz się szwedzkiego, kontynuuj. Nawet podstawowy szwedzki pomaga budować zaufanie. Dobre opinie, punktualność i szybkie odpowiedzi też pomagają zdobywać więcej klientów.",

    ctaTitle: "Znajdź prace sprzątania w Szwecji",
    ctaText:
      "Clean Jobs pomaga sprzątaczom, klientom i firmom sprzątającym łączyć się w całej Szwecji. Zacznij od przeglądania prac albo utworzenia profilu.",
    ctaBrowse: "Przeglądaj prace",
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
      canonical: "/how-much-do-cleaners-earn-in-sweden",
    },
    keywords: [
      "how much do cleaners earn in Sweden",
      "cleaner salary Sweden",
      "cleaning salary Sweden",
      "house cleaner salary Sweden",
      "office cleaner salary Sweden",
      "cleaning jobs salary Sweden",
      "cleaner hourly pay Sweden",
      "städare lön Sweden",
      "cleaning jobs Sweden",
      "work as cleaner Sweden",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/how-much-do-cleaners-earn-in-sweden`,
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
        name: t.faqSalaryQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqSalaryAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqCitiesQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqCitiesAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqIncreaseQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqIncreaseAnswer,
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

function StatCard({
  title,
  value,
  text,
}: {
  title: string
  value: string
  text: string
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
      <div className="text-sm font-medium text-slate-500">{title}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  )
}

export default async function CleanerSalarySwedenPage() {
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
              href="/jobs"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
            >
              {t.browseJobs}
            </Link>

            <Link
              href="/jobs-for-foreigners-in-sweden"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.foreignersJobs}
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6">
          <section className="grid gap-5 md:grid-cols-3">
            <StatCard
              title={t.statMonthlyTitle}
              value={t.statMonthlyValue}
              text={t.statMonthlyText}
            />

            <StatCard
              title={t.statRangeTitle}
              value={t.statRangeValue}
              text={t.statRangeText}
            />

            <StatCard
              title={t.statDependsTitle}
              value={t.statDependsValue}
              text={t.statDependsText}
            />
          </section>

          <Section eyebrow={t.salaryEyebrow} title={t.salaryTitle}>
            <p>{t.salaryText1}</p>
            <p>{t.salaryText2}</p>
          </Section>

          <Section eyebrow={t.factorsEyebrow} title={t.factorsTitle}>
            <p>{t.factorsText1}</p>
            <p>{t.factorsText2}</p>
          </Section>

          <Section eyebrow={t.citiesEyebrow} title={t.citiesTitle}>
            <p>{t.citiesText1}</p>
            <p>{t.citiesText2}</p>
          </Section>

          <Section eyebrow={t.workTypesEyebrow} title={t.workTypesTitle}>
            <p>{t.workTypesText1}</p>
            <p>{t.workTypesText2}</p>
          </Section>

          <Section eyebrow={t.tipsEyebrow} title={t.tipsTitle}>
            <p>{t.tipsText1}</p>
            <p>{t.tipsText2}</p>
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
                href="/jobs"
                prefetch={false}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.97]"
              >
                {t.ctaBrowse}
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

          <RelatedGuides currentPath="/how-much-do-cleaners-earn-in-sweden" />
        </div>
      </main>
    </div>
  )
}