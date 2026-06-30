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
    metaTitle: "Скільки заробляє прибиральник у Швеції 2026?",
    metaDescription:
      "Гід по зарплаті прибиральника у Швеції: середня зарплата, місячна оплата, погодинна оплата, фактори доходу та як знайти роботу з прибирання.",
    metaOgTitle: "Скільки заробляє прибиральник у Швеції? | Clean Jobs",
    metaOgDescription:
      "Гід по зарплаті прибиральника, рівнях оплати, містах і способах знайти більше робіт з прибирання.",
    metaOgAlt: "Зарплата прибиральника у Швеції",
    twitterTitle: "Скільки заробляє прибиральник у Швеції?",
    twitterDescription:
      "Гід по зарплатах прибиральників у Швеції з порадами, як знаходити більше робіт.",

    faqOneQuestion: "Скільки заробляє прибиральник у Швеції?",
    faqOneAnswer:
      "Публічна статистика зарплат показує, що прибиральники у Швеції часто заробляють у верхній частині діапазону 20 000 SEK на місяць до податків, залежно від досвіду, регіону, роботодавця та робочого часу.",
    faqTwoQuestion: "Що впливає на зарплату прибиральника?",
    faqTwoAnswer:
      "На зарплату впливають досвід, роботодавець, місто, робочий час, відповідальність і тип прибирання: прибирання дому, офісу або після переїзду.",
    faqThreeQuestion: "Як прибиральнику отримувати більше робіт?",
    faqThreeAnswer:
      "Прибиральник може отримувати більше робіт через чіткий профіль, швидку комунікацію, якість, постійних клієнтів і платформи як Clean Jobs.",

    heroEyebrow: "Зарплата прибиральника",
    heroTitle: "Скільки заробляє прибиральник у Швеції?",
    heroText:
      "Зарплата прибиральника у Швеції залежить від досвіду, роботодавця, міста, робочого часу та типу прибирання. Прибирання дому, офісу, після переїзду та регулярні замовлення можуть мати різні рівні оплати й різні можливості.",
    seeCleaningJobs: "Переглянути роботи з прибирання",
    jobsWithoutSwedish: "Робота без шведської",

    statMonthlyTitle: "Типова місячна зарплата",
    statMonthlyValue: "≈ 27 600–28 700 kr",
    statMonthlyText:
      "Актуальні джерела зарплат ставлять прибиральників приблизно у верхню частину діапазону 20 000 крон на місяць до податків.",
    statRangeTitle: "Нижній квартиль / медіана / верхній квартиль",
    statRangeValue: "26 800 / 28 600 / 30 400",
    statRangeText:
      "Регіональна статистика SCB показує цей діапазон для прибиральників в останній доступній таблиці.",
    statDependsTitle: "Зарплата залежить від",
    statDependsValue: "Місто + роботодавець",
    statDependsText:
      "Досвід, робочий час, відповідальність, роботодавець і тип прибирання впливають на дохід.",

    salaryEyebrow: "Огляд зарплати",
    salaryTitle: "Зарплата прибиральника у Швеції",
    salaryText1:
      "Публічна статистика зарплат показує, що прибиральники у Швеції часто знаходяться у верхній частині діапазону 20 000 крон на місяць до податків. Остання таблиця SCB для прибиральників показує рівні близько 26 800, 28 600 і 30 400 крон для нижнього квартиля, медіани та верхнього квартиля.",
    salaryText2:
      "Це орієнтовні цифри, а не гарантія. Реальна зарплата може бути вищою або нижчою залежно від того, чи ви працюєте повний день, неповний день, через компанію, з приватними клієнтами або з регулярними замовленнями.",

    factorsEyebrow: "Фактори",
    factorsTitle: "Що впливає на зарплату прибиральника?",
    factorsText1:
      "Найважливіші фактори — досвід, якість, надійність, роботодавець, місто та тип прибирання. Прибиральник, який може виконувати прибирання дому, офісу, після переїзду та регулярні замовлення, часто має більше можливостей.",
    factorsText2:
      "Комунікація також дуже важлива. Клієнти у Швеції цінують довіру, пунктуальність і чіткі очікування. Чіткий профіль, швидка відповідь і ввічливість можуть допомогти отримувати більше робіт.",

    citiesEyebrow: "Міста",
    citiesTitle: "Зарплата прибиральника в Стокгольмі, Гетеборзі та Мальме",
    citiesText1:
      "У Стокгольмі, Гетеборзі та Мальме часто більше робіт з прибирання, бо там більше житла, офісів, компаній і переїздів. Великі міста можуть давати більше можливостей, але також більше конкуренції та витрат на дорогу.",
    citiesText2:
      "Якщо ви можете працювати в кількох районах, ваші шанси зростають. У Стокгольмі, наприклад, варто шукати також у Solna, Sundbyberg, Järfälla, Nacka і Huddinge. У Гетеборзі та Мальме сусідні комуни також можуть давати більше замовлень.",

    workTypesEyebrow: "Типи робіт",
    workTypesTitle: "Які роботи з прибирання можуть давати кращий дохід?",
    workTypesText1:
      "Регулярне прибирання може давати стабільніший дохід, бо клієнт потребує допомоги щотижня або щомісяця. Прибирання після переїзду іноді має більший бюджет, бо робота більша й термінова. Прибирання офісів також може бути цінним, якщо це довший договір.",
    workTypesText2:
      "Для окремих працівників важливо створити стабільний потік замовлень. Для клінінгових компаній — отримувати більше запитів і зберігати хороших клієнтів.",

    tipsEyebrow: "Поради",
    tipsTitle: "Як збільшити дохід прибиральником",
    tipsText1:
      "Створіть чіткий профіль, додайте місто, опишіть досвід і покажіть, який тип прибирання можете виконувати. Напишіть, чи можете брати прибирання дому, офісу, після переїзду, вечірні, вихідні або регулярні замовлення.",
    tipsText2:
      "Якщо ви ще вивчаєте шведську, продовжуйте розвивати мову. Навіть базова шведська може створювати більше довіри. Хороші відгуки, пунктуальність і швидка комунікація також допомагають отримувати більше клієнтів.",

    ctaTitle: "Знайдіть роботу з прибирання у Швеції",
    ctaText:
      "Clean Jobs допомагає прибиральникам, клієнтам і клінінговим компаніям знаходити одне одного у Швеції. Почніть із перегляду доступних робіт або створіть профіль.",
    seeJobs: "Переглянути роботи",
    createAccount: "Створити акаунт",
  },

  ru: {
    metaTitle: "Сколько зарабатывает уборщик в Швеции 2026?",
    metaDescription:
      "Гид по зарплате уборщика в Швеции: средняя зарплата, месячная оплата, почасовая оплата, факторы дохода и как найти работу по уборке.",
    metaOgTitle: "Сколько зарабатывает уборщик в Швеции? | Clean Jobs",
    metaOgDescription:
      "Гид по зарплате уборщика, уровням оплаты, городам и способам найти больше работ по уборке.",
    metaOgAlt: "Зарплата уборщика в Швеции",
    twitterTitle: "Сколько зарабатывает уборщик в Швеции?",
    twitterDescription:
      "Гид по зарплатам уборщиков в Швеции с советами, как находить больше работ.",

    faqOneQuestion: "Сколько зарабатывает уборщик в Швеции?",
    faqOneAnswer:
      "Публичная статистика зарплат показывает, что уборщики в Швеции часто находятся в верхней части диапазона 20 000 SEK в месяц до налогов, в зависимости от опыта, региона, работодателя и рабочего времени.",
    faqTwoQuestion: "Что влияет на зарплату уборщика?",
    faqTwoAnswer:
      "На зарплату влияют опыт, работодатель, город, рабочее время, ответственность и тип уборки: уборка дома, офиса или после переезда.",
    faqThreeQuestion: "Как уборщику получать больше работ?",
    faqThreeAnswer:
      "Уборщик может получать больше работ через понятный профиль, быструю коммуникацию, качество, постоянных клиентов и платформы вроде Clean Jobs.",

    heroEyebrow: "Зарплата уборщика",
    heroTitle: "Сколько зарабатывает уборщик в Швеции?",
    heroText:
      "Зарплата уборщика в Швеции зависит от опыта, работодателя, города, рабочего времени и типа уборки. Уборка дома, офиса, после переезда и регулярные заказы могут иметь разные уровни оплаты и разные возможности.",
    seeCleaningJobs: "Смотреть работы по уборке",
    jobsWithoutSwedish: "Работа без шведского",

    statMonthlyTitle: "Типичная месячная зарплата",
    statMonthlyValue: "≈ 27 600–28 700 kr",
    statMonthlyText:
      "Актуальные источники зарплат ставят уборщиков примерно в верхнюю часть диапазона 20 000 крон в месяц до налогов.",
    statRangeTitle: "Нижний квартиль / медиана / верхний квартиль",
    statRangeValue: "26 800 / 28 600 / 30 400",
    statRangeText:
      "Региональная статистика SCB показывает этот диапазон для уборщиков в последней доступной таблице.",
    statDependsTitle: "Зарплата зависит от",
    statDependsValue: "Город + работодатель",
    statDependsText:
      "Опыт, рабочее время, ответственность, работодатель и тип уборки влияют на доход.",

    salaryEyebrow: "Обзор зарплаты",
    salaryTitle: "Зарплата уборщика в Швеции",
    salaryText1:
      "Публичная статистика зарплат показывает, что уборщики в Швеции часто находятся в верхней части диапазона 20 000 крон в месяц до налогов. Последняя таблица SCB для уборщиков показывает уровни около 26 800, 28 600 и 30 400 крон для нижнего квартиля, медианы и верхнего квартиля.",
    salaryText2:
      "Это ориентировочные цифры, а не гарантия. Реальная зарплата может быть выше или ниже в зависимости от полной или частичной занятости, работы через компанию, частных клиентов или регулярных заказов.",

    factorsEyebrow: "Факторы",
    factorsTitle: "Что влияет на зарплату уборщика?",
    factorsText1:
      "Главные факторы — опыт, качество, надёжность, работодатель, город и тип уборки. Уборщик, который может выполнять уборку дома, офиса, после переезда и регулярные задания, часто имеет больше возможностей.",
    factorsText2:
      "Коммуникация также очень важна. Клиенты в Швеции ценят доверие, пунктуальность и ясные ожидания. Понятный профиль, быстрый ответ и хорошее отношение помогают получать больше работ.",

    citiesEyebrow: "Города",
    citiesTitle: "Зарплата уборщика в Стокгольме, Гётеборге и Мальмё",
    citiesText1:
      "В Стокгольме, Гётеборге и Мальмё часто больше работ по уборке, потому что там больше жилья, офисов, компаний и переездов. Крупные города могут давать больше возможностей, но также больше конкуренции и расходов на дорогу.",
    citiesText2:
      "Если вы можете работать в нескольких районах, ваши шансы растут. В Стокгольме, например, стоит искать также в Solna, Sundbyberg, Järfälla, Nacka и Huddinge. В Гётеборге и Мальмё соседние коммуны также могут давать больше заказов.",

    workTypesEyebrow: "Типы работ",
    workTypesTitle: "Какие работы по уборке могут давать лучший доход?",
    workTypesText1:
      "Регулярная уборка может давать более стабильный доход, потому что клиенту нужна помощь каждую неделю или каждый месяц. Уборка после переезда иногда имеет больший бюджет, потому что работа крупнее и срочнее. Уборка офисов также может быть ценной, если это долгий договор.",
    workTypesText2:
      "Для отдельных работников важно создать стабильный поток заказов. Для клининговых компаний — получать больше запросов и удерживать хороших клиентов.",

    tipsEyebrow: "Советы",
    tipsTitle: "Как увеличить доход уборщиком",
    tipsText1:
      "Создайте понятный профиль, добавьте город, опишите опыт и покажите, какой тип уборки можете выполнять. Напишите, можете ли брать уборку дома, офиса, после переезда, вечерние, выходные или регулярные заказы.",
    tipsText2:
      "Если вы ещё учите шведский, продолжайте развивать язык. Даже базовый шведский может создавать больше доверия. Хорошие отзывы, пунктуальность и быстрая коммуникация также помогают получать больше клиентов.",

    ctaTitle: "Найдите работу по уборке в Швеции",
    ctaText:
      "Clean Jobs помогает уборщикам, клиентам и клининговым компаниям находить друг друга в Швеции. Начните с просмотра доступных работ или создайте профиль.",
    seeJobs: "Смотреть работы",
    createAccount: "Создать аккаунт",
  },

  en: {
    metaTitle: "Cleaner Salary in Sweden 2026 | Clean Jobs",
    metaDescription:
      "Guide to cleaner salary in Sweden. Learn about average salary, monthly pay, hourly pay, what affects income and how to find cleaning jobs.",
    metaOgTitle: "Cleaner Salary in Sweden | Clean Jobs",
    metaOgDescription:
      "Guide to cleaner salary, salary levels, cities and how to find more cleaning jobs.",
    metaOgAlt: "Cleaner salary in Sweden",
    twitterTitle: "Cleaner salary in Sweden",
    twitterDescription:
      "Salary guide for cleaners in Sweden with tips for finding more cleaning jobs.",

    faqOneQuestion: "How much does a cleaner earn in Sweden?",
    faqOneAnswer:
      "Public salary statistics show that cleaners in Sweden are often around the upper 20,000 SEK range per month before tax, depending on experience, region, employer and working hours.",
    faqTwoQuestion: "What affects cleaner salary?",
    faqTwoAnswer:
      "Salary is affected by experience, employer, city, working hours, responsibility and type of cleaning, such as home cleaning, office cleaning or move-out cleaning.",
    faqThreeQuestion: "How can a cleaner get more jobs?",
    faqThreeAnswer:
      "A cleaner can get more jobs through a clear profile, fast communication, good quality, recurring customers and platforms such as Clean Jobs.",

    heroEyebrow: "Cleaner salary",
    heroTitle: "How much does a cleaner earn in Sweden?",
    heroText:
      "Cleaner salary in Sweden depends on experience, employer, city, working hours and type of cleaning. Home cleaning, office cleaning, move-out cleaning and recurring assignments can have different salary levels and opportunities.",
    seeCleaningJobs: "See cleaning jobs",
    jobsWithoutSwedish: "Jobs without Swedish",

    statMonthlyTitle: "Typical monthly salary",
    statMonthlyValue: "≈ 27 600–28 700 kr",
    statMonthlyText:
      "Current salary sources place cleaners around the upper part of the 20,000 SEK range per month before tax.",
    statRangeTitle: "Lower quartile / median / upper quartile",
    statRangeValue: "26 800 / 28 600 / 30 400",
    statRangeText:
      "SCB regional salary statistics show this range for cleaners in the latest available table.",
    statDependsTitle: "Salary affected by",
    statDependsValue: "City + employer",
    statDependsText:
      "Experience, working hours, responsibility, employer and type of cleaning affect income.",

    salaryEyebrow: "Salary overview",
    salaryTitle: "Cleaner salary in Sweden",
    salaryText1:
      "Public salary statistics show that cleaners in Sweden are often around the upper part of the 20,000 SEK range per month before tax. SCB’s latest table for cleaners shows levels around 26,800 SEK, 28,600 SEK and 30,400 SEK for lower quartile, median and upper quartile.",
    salaryText2:
      "These are guiding figures, not a guarantee. Your actual salary can be higher or lower depending on whether you work full-time, part-time, through a company, with private clients or with recurring assignments.",

    factorsEyebrow: "Factors",
    factorsTitle: "What affects cleaner salary?",
    factorsText1:
      "The most important factors are experience, quality, reliability, employer, city and type of cleaning. A cleaner who can do home cleaning, office cleaning, move-out cleaning and recurring assignments can often get more opportunities.",
    factorsText2:
      "Communication also matters. Customers in Sweden value trust, punctuality and clear expectations. A clear profile, fast response and good attitude can help you get more jobs.",

    citiesEyebrow: "Cities",
    citiesTitle: "Cleaner salary in Stockholm, Gothenburg and Malmö",
    citiesText1:
      "Stockholm, Gothenburg and Malmö often have more cleaning jobs because there are more homes, offices, companies and moving households. Larger cities can offer more opportunities, but also more competition and higher travel costs.",
    citiesText2:
      "If you can work in several areas, your chances increase. In Stockholm, for example, it can be valuable to also search in Solna, Sundbyberg, Järfälla, Nacka and Huddinge. In Gothenburg and Malmö, nearby municipalities can also provide more assignments.",

    workTypesEyebrow: "Work types",
    workTypesTitle: "Which cleaning jobs can give better income?",
    workTypesText1:
      "Recurring cleaning can provide more stable income because the client needs help every week or every month. Move-out cleaning can sometimes have a higher budget because the job is larger and time-sensitive. Office cleaning can also be valuable if it becomes a longer contract.",
    workTypesText2:
      "For individual workers, it is often about creating a stable flow of assignments. For cleaning companies, it is about receiving more requests and keeping good customers over time.",

    tipsEyebrow: "Tips",
    tipsTitle: "How to increase your income as a cleaner",
    tipsText1:
      "Create a clear profile, add your city, describe your experience and show what type of cleaning you can do. Write whether you can take home cleaning, office cleaning, move-out cleaning, evening jobs, weekend jobs or recurring assignments.",
    tipsText2:
      "If you are still learning Swedish, keep improving the language. Even basic Swedish can create more trust. Good reviews, punctuality and fast communication can also help you get more customers.",

    ctaTitle: "Find cleaning jobs in Sweden",
    ctaText:
      "Clean Jobs helps cleaners, customers and cleaning companies find each other in Sweden. Start by viewing available jobs or creating a profile.",
    seeJobs: "See jobs",
    createAccount: "Create account",
  },

  sv: {
    metaTitle: "Vad tjänar en städare i Sverige 2026?",
    metaDescription:
      "Guide till städare lön i Sverige. Läs om medellön, månadslön, timlön, vad som påverkar lönen och hur du hittar städjobb.",
    metaOgTitle: "Vad tjänar en städare i Sverige? | Clean Jobs",
    metaOgDescription:
      "Guide till städare lön, lönenivåer, städer och hur du hittar fler städjobb.",
    metaOgAlt: "Städare lön i Sverige",
    twitterTitle: "Vad tjänar en städare i Sverige?",
    twitterDescription:
      "Löneguide för städare i Sverige med tips för att hitta fler städjobb.",

    faqOneQuestion: "Vad tjänar en städare i Sverige?",
    faqOneAnswer:
      "Offentlig lönestatistik visar att städare i Sverige ofta ligger runt den övre delen av 20 000 kronor per månad före skatt, beroende på erfarenhet, region, arbetsgivare och arbetstid.",
    faqTwoQuestion: "Vad påverkar lönen för en städare?",
    faqTwoAnswer:
      "Lönen påverkas av erfarenhet, arbetsgivare, stad, arbetstid, ansvar och typ av städning, till exempel hemstädning, kontorsstädning eller flyttstädning.",
    faqThreeQuestion: "Hur kan en städare få fler jobb?",
    faqThreeAnswer:
      "En städare kan få fler jobb genom en tydlig profil, snabb kommunikation, bra kvalitet, återkommande kunder och genom att använda plattformar som Clean Jobs.",

    heroEyebrow: "Städare lön",
    heroTitle: "Vad tjänar en städare i Sverige?",
    heroText:
      "Lönen för en städare i Sverige beror på erfarenhet, arbetsgivare, stad, arbetstid och typ av städning. Hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag kan ha olika lönenivåer och olika möjligheter.",
    seeCleaningJobs: "Se städjobb",
    jobsWithoutSwedish: "Jobb utan svenska",

    statMonthlyTitle: "Typisk månadslön",
    statMonthlyValue: "≈ 27 600–28 700 kr",
    statMonthlyText:
      "Aktuella lönekällor placerar städare runt den övre delen av 20 000 kronor per månad före skatt.",
    statRangeTitle: "Undre kvartil / median / övre kvartil",
    statRangeValue: "26 800 / 28 600 / 30 400",
    statRangeText:
      "SCB:s regionala lönestatistik visar detta intervall för städare i den senaste tabellen.",
    statDependsTitle: "Lönen påverkas av",
    statDependsValue: "Stad + arbetsgivare",
    statDependsText:
      "Erfarenhet, arbetstid, ansvar, arbetsgivare och typ av städning påverkar inkomsten.",

    salaryEyebrow: "Löneöversikt",
    salaryTitle: "Städare lön i Sverige",
    salaryText1:
      "Offentlig lönestatistik visar att städare i Sverige ofta ligger runt den övre delen av 20 000 kronor per månad före skatt. SCB:s senaste tabell för städare visar nivåer omkring 26 800 kronor, 28 600 kronor och 30 400 kronor för undre kvartil, median och övre kvartil.",
    salaryText2:
      "Det här är vägledande siffror, inte en garanti. Din faktiska lön kan bli högre eller lägre beroende på om du arbetar heltid, deltid, via företag, med privata kunder eller med återkommande uppdrag.",

    factorsEyebrow: "Faktorer",
    factorsTitle: "Vad påverkar lönen för en städare?",
    factorsText1:
      "De viktigaste faktorerna är erfarenhet, kvalitet, pålitlighet, arbetsgivare, stad och typ av städning. En städare som kan utföra hemstädning, kontorsstädning, flyttstädning och återkommande uppdrag kan ofta få fler möjligheter.",
    factorsText2:
      "Kommunikation spelar också stor roll. Kunder i Sverige värdesätter förtroende, punktlighet och tydliga förväntningar. En tydlig profil, snabb respons och bra bemötande kan hjälpa dig få fler jobb.",

    citiesEyebrow: "Städer",
    citiesTitle: "Städare lön i Stockholm, Göteborg och Malmö",
    citiesText1:
      "Stockholm, Göteborg och Malmö har ofta fler städjobb eftersom det finns fler bostäder, kontor, företag och flyttar. Större städer kan ge fler möjligheter, men också mer konkurrens och högre reskostnader.",
    citiesText2:
      "Om du kan arbeta i flera områden ökar dina chanser. I Stockholm kan det till exempel vara värdefullt att även söka i Solna, Sundbyberg, Järfälla, Nacka och Huddinge. I Göteborg och Malmö kan närliggande kommuner också ge fler uppdrag.",

    workTypesEyebrow: "Arbetstyper",
    workTypesTitle: "Vilka städjobb kan ge bättre inkomst?",
    workTypesText1:
      "Återkommande städning kan ge stabilare inkomst eftersom kunden behöver hjälp varje vecka eller varje månad. Flyttstädning kan ibland ha högre budget eftersom jobbet är större och tidskänsligt. Kontorsstädning kan också vara värdefullt om det blir ett längre avtal.",
    workTypesText2:
      "För enskilda arbetare handlar det ofta om att skapa ett stabilt flöde av uppdrag. För städfirmor handlar det om att få fler förfrågningar och behålla bra kunder över tid.",

    tipsEyebrow: "Tips",
    tipsTitle: "Så kan du öka din inkomst som städare",
    tipsText1:
      "Skapa en tydlig profil, lägg till stad, beskriv din erfarenhet och visa vilken typ av städning du kan utföra. Skriv om du kan ta hemstädning, kontorsstädning, flyttstädning, kvällsjobb, helgjobb eller återkommande uppdrag.",
    tipsText2:
      "Om du fortfarande lär dig svenska, fortsätt utveckla språket. Även grundläggande svenska kan skapa mer förtroende. Bra omdömen, punktlighet och snabb kommunikation kan också hjälpa dig få fler kunder.",

    ctaTitle: "Hitta städjobb i Sverige",
    ctaText:
      "Clean Jobs hjälper städare, kunder och städfirmor att hitta varandra i Sverige. Börja med att se lediga jobb eller skapa en profil.",
    seeJobs: "Se jobb",
    createAccount: "Skapa konto",
  },

  pl: {
    metaTitle: "Ile zarabia sprzątacz w Szwecji 2026?",
    metaDescription:
      "Poradnik o pensji sprzątacza w Szwecji: średnia pensja, miesięczna płaca, stawka godzinowa, czynniki dochodu i jak znaleźć prace sprzątania.",
    metaOgTitle: "Ile zarabia sprzątacz w Szwecji? | Clean Jobs",
    metaOgDescription:
      "Poradnik o pensji sprzątacza, poziomach płac, miastach i sposobach zdobycia większej liczby prac sprzątania.",
    metaOgAlt: "Pensja sprzątacza w Szwecji",
    twitterTitle: "Ile zarabia sprzątacz w Szwecji?",
    twitterDescription:
      "Poradnik płacowy dla sprzątaczy w Szwecji z poradami, jak znaleźć więcej prac sprzątania.",

    faqOneQuestion: "Ile zarabia sprzątacz w Szwecji?",
    faqOneAnswer:
      "Publiczne statystyki płac pokazują, że sprzątacze w Szwecji często zarabiają w górnej części zakresu 20 000 SEK miesięcznie przed podatkiem, zależnie od doświadczenia, regionu, pracodawcy i czasu pracy.",
    faqTwoQuestion: "Co wpływa na pensję sprzątacza?",
    faqTwoAnswer:
      "Na pensję wpływa doświadczenie, pracodawca, miasto, czas pracy, odpowiedzialność i typ sprzątania, na przykład sprzątanie domu, biura albo po przeprowadzce.",
    faqThreeQuestion: "Jak sprzątacz może zdobyć więcej prac?",
    faqThreeAnswer:
      "Sprzątacz może zdobyć więcej prac dzięki jasnemu profilowi, szybkiej komunikacji, dobrej jakości, stałym klientom i platformom takim jak Clean Jobs.",

    heroEyebrow: "Pensja sprzątacza",
    heroTitle: "Ile zarabia sprzątacz w Szwecji?",
    heroText:
      "Pensja sprzątacza w Szwecji zależy od doświadczenia, pracodawcy, miasta, czasu pracy i typu sprzątania. Sprzątanie domu, biura, po przeprowadzce i regularne zlecenia mogą mieć różne poziomy płac oraz różne możliwości.",
    seeCleaningJobs: "Zobacz prace sprzątania",
    jobsWithoutSwedish: "Praca bez szwedzkiego",

    statMonthlyTitle: "Typowa miesięczna pensja",
    statMonthlyValue: "≈ 27 600–28 700 kr",
    statMonthlyText:
      "Aktualne źródła płac wskazują sprzątaczy w górnej części zakresu 20 000 koron miesięcznie przed podatkiem.",
    statRangeTitle: "Dolny kwartyl / mediana / górny kwartyl",
    statRangeValue: "26 800 / 28 600 / 30 400",
    statRangeText:
      "Regionalne statystyki SCB pokazują ten zakres dla sprzątaczy w najnowszej dostępnej tabeli.",
    statDependsTitle: "Na pensję wpływa",
    statDependsValue: "Miasto + pracodawca",
    statDependsText:
      "Doświadczenie, czas pracy, odpowiedzialność, pracodawca i typ sprzątania wpływają na dochód.",

    salaryEyebrow: "Przegląd pensji",
    salaryTitle: "Pensja sprzątacza w Szwecji",
    salaryText1:
      "Publiczne statystyki płac pokazują, że sprzątacze w Szwecji często znajdują się w górnej części zakresu 20 000 koron miesięcznie przed podatkiem. Najnowsza tabela SCB dla sprzątaczy pokazuje poziomy około 26 800, 28 600 i 30 400 koron dla dolnego kwartylu, mediany i górnego kwartylu.",
    salaryText2:
      "To są wartości orientacyjne, nie gwarancja. Rzeczywista pensja może być wyższa albo niższa w zależności od pracy na pełny etat, część etatu, przez firmę, z klientami prywatnymi albo przy stałych zleceniach.",

    factorsEyebrow: "Czynniki",
    factorsTitle: "Co wpływa na pensję sprzątacza?",
    factorsText1:
      "Najważniejsze czynniki to doświadczenie, jakość, niezawodność, pracodawca, miasto i typ sprzątania. Sprzątacz, który może wykonywać sprzątanie domu, biura, po przeprowadzce i stałe zlecenia, często ma więcej możliwości.",
    factorsText2:
      "Komunikacja też jest ważna. Klienci w Szwecji cenią zaufanie, punktualność i jasne oczekiwania. Jasny profil, szybka odpowiedź i dobre podejście pomagają zdobywać więcej prac.",

    citiesEyebrow: "Miasta",
    citiesTitle: "Pensja sprzątacza w Sztokholmie, Göteborgu i Malmö",
    citiesText1:
      "Sztokholm, Göteborg i Malmö często mają więcej prac sprzątania, ponieważ jest tam więcej mieszkań, biur, firm i przeprowadzek. Większe miasta mogą dawać więcej możliwości, ale też większą konkurencję i koszty dojazdu.",
    citiesText2:
      "Jeśli możesz pracować w kilku obszarach, zwiększasz swoje szanse. W Sztokholmie warto też szukać w Solna, Sundbyberg, Järfälla, Nacka i Huddinge. W Göteborgu i Malmö pobliskie gminy również mogą dawać więcej zleceń.",

    workTypesEyebrow: "Typy pracy",
    workTypesTitle: "Które prace sprzątania mogą dawać lepszy dochód?",
    workTypesText1:
      "Regularne sprzątanie może dawać stabilniejszy dochód, ponieważ klient potrzebuje pomocy co tydzień albo co miesiąc. Sprzątanie po przeprowadzce czasem ma wyższy budżet, bo praca jest większa i pilna. Sprzątanie biur też może być wartościowe, jeśli staje się dłuższą umową.",
    workTypesText2:
      "Dla pojedynczych pracowników chodzi często o stabilny przepływ zleceń. Dla firm sprzątających — o więcej zapytań i utrzymanie dobrych klientów.",

    tipsEyebrow: "Wskazówki",
    tipsTitle: "Jak zwiększyć dochód jako sprzątacz",
    tipsText1:
      "Stwórz jasny profil, dodaj miasto, opisz doświadczenie i pokaż, jaki typ sprzątania wykonujesz. Napisz, czy możesz brać sprzątanie domu, biura, po przeprowadzce, prace wieczorne, weekendowe albo stałe zlecenia.",
    tipsText2:
      "Jeśli nadal uczysz się szwedzkiego, kontynuuj naukę. Nawet podstawowy szwedzki może budować większe zaufanie. Dobre opinie, punktualność i szybka komunikacja też pomagają zdobywać więcej klientów.",

    ctaTitle: "Znajdź prace sprzątania w Szwecji",
    ctaText:
      "Clean Jobs pomaga sprzątaczom, klientom i firmom sprzątającym znaleźć się nawzajem w Szwecji. Zacznij od przeglądania dostępnych prac albo utwórz profil.",
    seeJobs: "Zobacz prace",
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
      canonical: "/vad-tjanar-en-stadare-i-sverige",
    },
    keywords: [
      "vad tjänar en städare",
      "städare lön",
      "städare lön Sverige",
      "lokalvårdare lön",
      "hemstädning lön",
      "kontorsstädning lön",
      "flyttstädning lön",
      "städjobb lön",
      "städare månadslön",
      "städare timlön",
    ],
    openGraph: {
      title: t.metaOgTitle,
      description: t.metaOgDescription,
      url: `${siteUrl}/vad-tjanar-en-stadare-i-sverige`,
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
      title: t.twitterTitle,
      description: t.twitterDescription,
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
        name: t.faqOneQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqOneAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqTwoQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqTwoAnswer,
        },
      },
      {
        "@type": "Question",
        name: t.faqThreeQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: t.faqThreeAnswer,
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

export default async function VadTjanarEnStadarePage() {
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
              {t.seeCleaningJobs}
            </Link>

            <Link
              href="/jobb-utan-svenska"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50 active:scale-[0.97]"
            >
              {t.jobsWithoutSwedish}
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
                {t.seeJobs}
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

          <RelatedGuides currentPath="/vad-tjanar-en-stadare-i-sverige" />
        </div>
      </main>
    </div>
  )
}