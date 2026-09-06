"use client"

import { useEffect, useMemo, useState } from "react"
import { useFormStatus } from "react-dom"

import type { Locale } from "@/lib/i18n"
import { sendAnalyticsEvent } from "@/lib/analytics/acquisition-client"

const CITY_OPTIONS = [
  "Stockholm",
  "Solna",
  "Sundbyberg",
  "Nacka",
  "Täby",
  "Danderyd",
  "Sollentuna",
  "Järfälla",
  "Kista",
  "Barkarby",
  "Upplands Väsby",
  "Vallentuna",
  "Åkersberga",
  "Lidingö",
  "Huddinge",
  "Tumba",
  "Botkyrka",
  "Salem",
  "Haninge",
  "Tyresö",
  "Södertälje",
  "Nynäshamn",
  "Norrtälje",
  "Värmdö",
  "Ekerö",
  "Märsta",
] as const

type Props = {
  locale: Locale
  today: string
  action: (formData: FormData) => Promise<void>
}

type Copy = {
  eyebrow: string
  title: string
  subtitle: string
  step: string
  of: string
  back: string
  next: string
  publish: string
  publishing: string
  step1Title: string
  step1Text: string
  homeCleaning: string
  officeCleaning: string
  jobTitle: string
  jobTitlePlaceholder: string
  step1Error: string
  step2Title: string
  step2Text: string
  city: string
  chooseCity: string
  otherCity: string
  otherCityPlaceholder: string
  propertyType: string
  chooseOptional: string
  apartment: string
  house: string
  office: string
  other: string
  address: string
  addressPlaceholder: string
  step2Error: string
  step3Title: string
  step3Text: string
  date: string
  time: string
  budget: string
  budgetPlaceholder: string
  optional: string
  step4Title: string
  step4Text: string
  description: string
  descriptionPlaceholder: string
  review: string
  service: string
  location: string
  when: string
  noDate: string
  price: string
  noBudget: string
  publishedHint: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Skapa ett jobb",
    title: "Berätta vad du behöver hjälp med",
    subtitle: "Fyra korta steg. Du kan gå tillbaka och ändra innan du publicerar.",
    step: "Steg",
    of: "av",
    back: "Tillbaka",
    next: "Fortsätt",
    publish: "Publicera jobbet",
    publishing: "Publicerar...",
    step1Title: "Vad behöver du hjälp med?",
    step1Text: "Välj typ av städning och skriv en kort rubrik.",
    homeCleaning: "Hemstädning",
    officeCleaning: "Kontorsstädning",
    jobTitle: "Kort rubrik",
    jobTitlePlaceholder: "Till exempel: Flyttstädning av 2:a",
    step1Error: "Välj typ av städning och skriv en rubrik.",
    step2Title: "Var ska jobbet göras?",
    step2Text: "Välj område. Exakt adress är valfri och kan kompletteras senare.",
    city: "Stad eller område",
    chooseCity: "Välj stad eller område",
    otherCity: "Annan ort",
    otherCityPlaceholder: "Skriv ort",
    propertyType: "Typ av bostad eller lokal",
    chooseOptional: "Välj om du vill",
    apartment: "Lägenhet",
    house: "Hus",
    office: "Kontor",
    other: "Annat",
    address: "Adress",
    addressPlaceholder: "Valfritt",
    step2Error: "Välj stad eller skriv en annan ort.",
    step3Title: "När och ungefär vilken budget?",
    step3Text: "Det här är valfritt. Fyll bara i det du redan vet.",
    date: "Önskat datum",
    time: "Önskad tid",
    budget: "Ungefärlig budget",
    budgetPlaceholder: "Till exempel 1500",
    optional: "Valfritt",
    step4Title: "Beskriv jobbet med egna ord",
    step4Text: "Några enkla detaljer hjälper utförare att ge bättre förslag.",
    description: "Beskrivning",
    descriptionPlaceholder: "Till exempel: 65 m², 2 rum. Jag behöver hjälp med kök, badrum och fönster.",
    review: "Kontrollera innan du publicerar",
    service: "Typ",
    location: "Plats",
    when: "När",
    noDate: "Inte bestämt",
    price: "Budget",
    noBudget: "Inte angiven",
    publishedHint: "Efter publicering kan utförare skicka ansökningar. Du väljer själv vem du vill gå vidare med.",
  },
  en: {
    eyebrow: "Post a job",
    title: "Tell us what you need help with",
    subtitle: "Four short steps. You can go back and change anything before publishing.",
    step: "Step",
    of: "of",
    back: "Back",
    next: "Continue",
    publish: "Publish job",
    publishing: "Publishing...",
    step1Title: "What do you need help with?",
    step1Text: "Choose the cleaning type and add a short title.",
    homeCleaning: "Home cleaning",
    officeCleaning: "Office cleaning",
    jobTitle: "Short title",
    jobTitlePlaceholder: "For example: Move-out cleaning for 2-room apartment",
    step1Error: "Choose a cleaning type and enter a title.",
    step2Title: "Where is the job?",
    step2Text: "Choose the area. The exact address is optional and can be added later.",
    city: "City or area",
    chooseCity: "Choose city or area",
    otherCity: "Other location",
    otherCityPlaceholder: "Enter location",
    propertyType: "Property type",
    chooseOptional: "Choose if useful",
    apartment: "Apartment",
    house: "House",
    office: "Office",
    other: "Other",
    address: "Address",
    addressPlaceholder: "Optional",
    step2Error: "Choose a city or enter another location.",
    step3Title: "When and what is your approximate budget?",
    step3Text: "This is optional. Only fill in what you already know.",
    date: "Preferred date",
    time: "Preferred time",
    budget: "Approximate budget",
    budgetPlaceholder: "For example 1500",
    optional: "Optional",
    step4Title: "Describe the job in your own words",
    step4Text: "A few simple details help workers give better offers.",
    description: "Description",
    descriptionPlaceholder: "For example: 65 m², 2 rooms. I need help with the kitchen, bathroom and windows.",
    review: "Check before publishing",
    service: "Type",
    location: "Location",
    when: "When",
    noDate: "Not decided",
    price: "Budget",
    noBudget: "Not specified",
    publishedHint: "After publishing, workers can send applications. You choose who you want to continue with.",
  },
  uk: {
    eyebrow: "Створити замовлення",
    title: "Розкажіть, з чим потрібна допомога",
    subtitle: "Чотири короткі кроки. Перед публікацією все можна змінити.",
    step: "Крок",
    of: "з",
    back: "Назад",
    next: "Продовжити",
    publish: "Опублікувати замовлення",
    publishing: "Публікуємо...",
    step1Title: "Що потрібно прибрати?",
    step1Text: "Виберіть тип прибирання та напишіть коротку назву.",
    homeCleaning: "Прибирання дому",
    officeCleaning: "Прибирання офісу",
    jobTitle: "Коротка назва",
    jobTitlePlaceholder: "Наприклад: Прибирання квартири після переїзду",
    step1Error: "Виберіть тип прибирання та введіть назву.",
    step2Title: "Де потрібно прибрати?",
    step2Text: "Виберіть район. Точну адресу можна вказати зараз або пізніше.",
    city: "Місто або район",
    chooseCity: "Виберіть місто або район",
    otherCity: "Інше місто",
    otherCityPlaceholder: "Введіть місто",
    propertyType: "Тип приміщення",
    chooseOptional: "За бажанням",
    apartment: "Квартира",
    house: "Будинок",
    office: "Офіс",
    other: "Інше",
    address: "Адреса",
    addressPlaceholder: "Необов'язково",
    step2Error: "Виберіть місто або введіть інше.",
    step3Title: "Коли і який приблизно бюджет?",
    step3Text: "Це необов'язково. Заповніть лише те, що вже знаєте.",
    date: "Бажана дата",
    time: "Бажаний час",
    budget: "Приблизний бюджет",
    budgetPlaceholder: "Наприклад 1500",
    optional: "Необов'язково",
    step4Title: "Опишіть роботу своїми словами",
    step4Text: "Кілька простих деталей допоможуть виконавцям дати точнішу пропозицію.",
    description: "Опис",
    descriptionPlaceholder: "Наприклад: 65 м², 2 кімнати. Потрібно прибрати кухню, ванну та вікна.",
    review: "Перевірте перед публікацією",
    service: "Тип",
    location: "Місце",
    when: "Коли",
    noDate: "Ще не вирішено",
    price: "Бюджет",
    noBudget: "Не вказано",
    publishedHint: "Після публікації виконавці зможуть надсилати заявки. Ви самі оберете, з ким продовжити.",
  },
  ru: {
    eyebrow: "Создать заказ",
    title: "Расскажите, с чем нужна помощь",
    subtitle: "Четыре коротких шага. До публикации всё можно изменить.",
    step: "Шаг",
    of: "из",
    back: "Назад",
    next: "Продолжить",
    publish: "Опубликовать заказ",
    publishing: "Публикуем...",
    step1Title: "Что нужно убрать?",
    step1Text: "Выберите тип уборки и напишите короткое название.",
    homeCleaning: "Уборка дома",
    officeCleaning: "Уборка офиса",
    jobTitle: "Короткое название",
    jobTitlePlaceholder: "Например: Уборка квартиры после переезда",
    step1Error: "Выберите тип уборки и введите название.",
    step2Title: "Где нужно убрать?",
    step2Text: "Выберите район. Точный адрес можно указать сейчас или позже.",
    city: "Город или район",
    chooseCity: "Выберите город или район",
    otherCity: "Другой город",
    otherCityPlaceholder: "Введите город",
    propertyType: "Тип помещения",
    chooseOptional: "По желанию",
    apartment: "Квартира",
    house: "Дом",
    office: "Офис",
    other: "Другое",
    address: "Адрес",
    addressPlaceholder: "Необязательно",
    step2Error: "Выберите город или введите другой.",
    step3Title: "Когда и какой примерный бюджет?",
    step3Text: "Это необязательно. Заполните только то, что уже знаете.",
    date: "Желаемая дата",
    time: "Желаемое время",
    budget: "Примерный бюджет",
    budgetPlaceholder: "Например 1500",
    optional: "Необязательно",
    step4Title: "Опишите работу своими словами",
    step4Text: "Несколько простых деталей помогут исполнителям дать более точное предложение.",
    description: "Описание",
    descriptionPlaceholder: "Например: 65 м², 2 комнаты. Нужно убрать кухню, ванную и окна.",
    review: "Проверьте перед публикацией",
    service: "Тип",
    location: "Место",
    when: "Когда",
    noDate: "Ещё не решено",
    price: "Бюджет",
    noBudget: "Не указан",
    publishedHint: "После публикации исполнители смогут отправлять заявки. Вы сами выберете, с кем продолжить.",
  },
  pl: {
    eyebrow: "Dodaj zlecenie",
    title: "Powiedz, w czym potrzebujesz pomocy",
    subtitle: "Cztery krótkie kroki. Przed publikacją możesz wszystko zmienić.",
    step: "Krok",
    of: "z",
    back: "Wstecz",
    next: "Dalej",
    publish: "Opublikuj zlecenie",
    publishing: "Publikowanie...",
    step1Title: "Jakiej pomocy potrzebujesz?",
    step1Text: "Wybierz rodzaj sprzątania i wpisz krótki tytuł.",
    homeCleaning: "Sprzątanie domu",
    officeCleaning: "Sprzątanie biura",
    jobTitle: "Krótki tytuł",
    jobTitlePlaceholder: "Na przykład: Sprzątanie mieszkania po przeprowadzce",
    step1Error: "Wybierz rodzaj sprzątania i wpisz tytuł.",
    step2Title: "Gdzie jest zlecenie?",
    step2Text: "Wybierz obszar. Dokładny adres jest opcjonalny.",
    city: "Miasto lub obszar",
    chooseCity: "Wybierz miasto lub obszar",
    otherCity: "Inna miejscowość",
    otherCityPlaceholder: "Wpisz miejscowość",
    propertyType: "Typ obiektu",
    chooseOptional: "Wybierz opcjonalnie",
    apartment: "Mieszkanie",
    house: "Dom",
    office: "Biuro",
    other: "Inne",
    address: "Adres",
    addressPlaceholder: "Opcjonalnie",
    step2Error: "Wybierz miasto lub wpisz inną miejscowość.",
    step3Title: "Kiedy i jaki jest przybliżony budżet?",
    step3Text: "To opcjonalne. Wpisz tylko to, co już wiesz.",
    date: "Preferowana data",
    time: "Preferowana godzina",
    budget: "Przybliżony budżet",
    budgetPlaceholder: "Na przykład 1500",
    optional: "Opcjonalnie",
    step4Title: "Opisz zlecenie własnymi słowami",
    step4Text: "Kilka prostych szczegółów pomoże wykonawcom przygotować lepszą ofertę.",
    description: "Opis",
    descriptionPlaceholder: "Na przykład: 65 m², 2 pokoje. Potrzebuję pomocy z kuchnią, łazienką i oknami.",
    review: "Sprawdź przed publikacją",
    service: "Typ",
    location: "Miejsce",
    when: "Kiedy",
    noDate: "Nie ustalono",
    price: "Budżet",
    noBudget: "Nie podano",
    publishedHint: "Po publikacji wykonawcy mogą wysyłać oferty. To Ty wybierasz, z kim chcesz kontynuować.",
  },
}

function PublishButton({
  idle,
  pending,
  onPublish,
}: {
  idle: string
  pending: string
  onPublish: () => void
}) {
  const { pending: isPending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={isPending}
      onClick={onPublish}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {isPending ? pending : idle}
    </button>
  )
}

export default function CreateJobWizard({ locale, today, action }: Props) {
  const t = copy[locale] || copy.en
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [jobType, setJobType] = useState("")
  const [title, setTitle] = useState("")
  const [citySelect, setCitySelect] = useState("")
  const [cityOther, setCityOther] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [address, setAddress] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [budget, setBudget] = useState("")
  const [description, setDescription] = useState("")

  const resolvedCity = citySelect === "other" ? cityOther.trim() : citySelect
  const [hour = "", minute = ""] = scheduledTime ? scheduledTime.split(":") : ["", ""]

  const serviceLabel = jobType === "office_cleaning" ? t.officeCleaning : t.homeCleaning
  const summaryDate = scheduledDate
    ? `${scheduledDate}${scheduledTime ? ` • ${scheduledTime}` : ""}`
    : t.noDate

  const progress = useMemo(
    () => `${(step / 4) * 100}%`,
    [step],
  )

  useEffect(() => {
    sendAnalyticsEvent(
      "create_job_start",
    )
  }, [])

  function goNext() {
    setError("")

    if (step === 1 && (!jobType || !title.trim())) {
      setError(t.step1Error)
      return
    }

    if (step === 2 && (!citySelect || (citySelect === "other" && !cityOther.trim()))) {
      setError(t.step2Error)
      return
    }

    const nextStep =
      Math.min(4, step + 1)

    if (nextStep === 2) {
      sendAnalyticsEvent(
        "create_job_step_2",
        {
          job_type: jobType,
        },
      )
    }

    if (nextStep === 3) {
      sendAnalyticsEvent(
        "create_job_step_3",
        {
          has_property_type:
            Boolean(propertyType),
        },
      )
    }

    if (nextStep === 4) {
      sendAnalyticsEvent(
        "create_job_step_4",
        {
          has_date:
            Boolean(scheduledDate),
          has_budget:
            Boolean(budget),
        },
      )
    }

    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function goBack() {
    setError("")
    setStep((current) => Math.max(1, current - 1))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 md:py-10">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
        <div className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
          {t.eyebrow}
        </div>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
          {t.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">{t.subtitle}</p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm font-medium text-slate-600">
            <span>{t.step} {step} {t.of} 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-rose-600 transition-all" style={{ width: progress }} />
          </div>
        </div>

        <form action={action} className="mt-8">
          <input type="hidden" name="job_type" value={jobType} />
          <input type="hidden" name="city_select" value={citySelect} />
          <input type="hidden" name="city_other" value={cityOther} />
          <input type="hidden" name="scheduled_hour" value={hour} />
          <input type="hidden" name="scheduled_minute" value={minute} />

          <section className={step === 1 ? "block" : "hidden"} aria-hidden={step !== 1}>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t.step1Title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.step1Text}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["home_cleaning", t.homeCleaning],
                ["office_cleaning", t.officeCleaning],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setJobType(value)}
                  className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    jobType === value
                      ? "border-rose-600 bg-rose-50 text-rose-800 ring-2 ring-rose-100"
                      : "border-slate-300 bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50/50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="mt-6 block">
              <span className="text-sm font-medium text-slate-800">{t.jobTitle}</span>
              <input
                name="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                placeholder={t.jobTitlePlaceholder}
                className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </label>
          </section>

          <section className={step === 2 ? "block" : "hidden"} aria-hidden={step !== 2}>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t.step2Title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.step2Text}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">{t.city}</span>
                <select
                  value={citySelect}
                  onChange={(event) => setCitySelect(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">{t.chooseCity}</option>
                  {CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}
                  <option value="other">{t.otherCity}</option>
                </select>
              </label>

              {citySelect === "other" ? (
                <label className="block">
                  <span className="text-sm font-medium text-slate-800">{t.otherCity}</span>
                  <input
                    value={cityOther}
                    onChange={(event) => setCityOther(event.target.value)}
                    placeholder={t.otherCityPlaceholder}
                    className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-medium text-slate-800">{t.propertyType}</span>
                <select
                  name="property_type"
                  value={propertyType}
                  onChange={(event) => setPropertyType(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                >
                  <option value="">{t.chooseOptional}</option>
                  <option value="apartment">{t.apartment}</option>
                  <option value="house">{t.house}</option>
                  <option value="office">{t.office}</option>
                  <option value="other">{t.other}</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-800">{t.address} <span className="text-slate-400">({t.optional})</span></span>
                <input
                  name="address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder={t.addressPlaceholder}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </label>
            </div>
          </section>

          <section className={step === 3 ? "block" : "hidden"} aria-hidden={step !== 3}>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t.step3Title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.step3Text}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-800">{t.date}</span>
                <input
                  type="date"
                  name="scheduled_date"
                  min={today}
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-800">{t.time}</span>
                <input
                  type="time"
                  step="900"
                  value={scheduledTime}
                  onChange={(event) => setScheduledTime(event.target.value)}
                  className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-800">{t.budget} <span className="text-slate-400">({t.optional})</span></span>
                <div className="relative mt-2">
                  <input
                    type="number"
                    name="budget"
                    min="0"
                    step="1"
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    placeholder={t.budgetPlaceholder}
                    className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">kr</span>
                </div>
              </label>
            </div>
          </section>

          <section className={step === 4 ? "block" : "hidden"} aria-hidden={step !== 4}>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{t.step4Title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{t.step4Text}</p>

            <label className="mt-6 block">
              <span className="text-sm font-medium text-slate-800">{t.description}</span>
              <textarea
                name="description"
                rows={5}
                maxLength={5000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder={t.descriptionPlaceholder}
                className="mt-2 w-full resize-y rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </label>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-950">{t.review}</h3>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div><dt className="text-slate-500">{t.service}</dt><dd className="mt-1 font-medium text-slate-900">{serviceLabel}</dd></div>
                <div><dt className="text-slate-500">{t.location}</dt><dd className="mt-1 font-medium text-slate-900">{resolvedCity || "—"}</dd></div>
                <div><dt className="text-slate-500">{t.when}</dt><dd className="mt-1 font-medium text-slate-900">{summaryDate}</dd></div>
                <div><dt className="text-slate-500">{t.price}</dt><dd className="mt-1 font-medium text-slate-900">{budget ? `${budget} kr` : t.noBudget}</dd></div>
              </dl>
            </div>

            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">{t.publishedHint}</p>
          </section>

          {error ? (
            <div role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {t.back}
              </button>
            ) : <span />}

            {step < 4 ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                {t.next}
              </button>
            ) : (
              <PublishButton
                idle={t.publish}
                pending={t.publishing}
                onPublish={() => {
                  sendAnalyticsEvent(
                    "job_publish_click",
                    {
                      job_type: jobType,
                      has_budget:
                        Boolean(budget),
                      has_date:
                        Boolean(
                          scheduledDate,
                        ),
                      has_description:
                        Boolean(
                          description.trim(),
                        ),
                    },
                  )
                }}
              />
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
