import type { Metadata } from "next"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"

import DeleteJobButton from "@/components/delete-job-button"
import JobStatusActions from "@/components/job-status-actions"
import JobApplicationsSection, {
  type JobApplicationItem,
} from "@/components/job-applications-section"
import JobReviewsSection from "@/components/reviews/job-reviews-section"
import ReportJobForm from "@/components/report-job-form"
import SaveJobButton from "@/components/save-job-button"
import TakeJobForm, {
  type CurrentJobApplication,
} from "@/components/take-job-form"
import { normalizeLocale, type Locale } from "@/lib/i18n"
import { createClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

type PageProps = {
  params: Promise<{
    id: string
  }>
}

type JobStatus =
  | "new"
  | "assigned"
  | "in_progress"
  | "done"
  | "cancelled"
  | null

type Job = {
  id: string
  title: string
  description: string | null
  city: string | null
  address: string | null
  budget: number | null
  job_type: string | null
  property_type: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  status: JobStatus
  created_at: string
  created_by: string
  assigned_to: string | null
}

type Profile = {
  id: string
  full_name: string | null
  city: string | null
  avatar_url: string | null
  company_logo_url: string | null
  company_name: string | null
  bankid_verified: boolean | null
}

type Activity = {
  id: string
  type: string
  actor_id: string | null
  created_at: string
}

type RatingReview = {
  reviewee_id: string
  rating: number
}

type Copy = {
  back: string
  cityMissing: string
  budgetMissing: string
  addressMissing: string
  scheduleMissing: string
  typeMissing: string
  propertyMissing: string
  author: string
  worker: string
  unknownUser: string
  status: string
  created: string
  city: string
  address: string
  budget: string
  jobType: string
  propertyType: string
  schedule: string
  description: string
  noDescription: string
  chat: string
  edit: string
  delete: string
  activity: string
  noActivity: string
  yourJob: string
  workerAssigned: string
  historyState: string
  completedHint: string
  cancelledHint: string
  noCompany: string
  statusNew: string
  statusAssigned: string
  statusInProgress: string
  statusDone: string
  statusCancelled: string
  activityJobCreated: string
  activityJobAssigned: string
  activityStatusChanged: string
  activityReviewLeft: string
}

const copy: Record<Locale, Copy> = {
  uk: {
    back: "Назад",
    cityMissing: "Місто не вказано",
    budgetMissing: "Бюджет не вказано",
    addressMissing: "Адресу не вказано",
    scheduleMissing: "Не вказано",
    typeMissing: "Не вказано",
    propertyMissing: "Не вказано",
    author: "Автор",
    worker: "Виконавець",
    unknownUser: "Користувач",
    status: "Статус",
    created: "Створено",
    city: "Місто",
    address: "Адреса",
    budget: "Бюджет",
    jobType: "Тип роботи",
    propertyType: "Тип об’єкта",
    schedule: "Дата і час",
    description: "Опис",
    noDescription: "Опис не додано.",
    chat: "Відкрити чат",
    edit: "Редагувати",
    delete: "Видалити",
    activity: "Історія активності",
    noActivity: "Ще немає подій.",
    yourJob: "Ваше замовлення",
    workerAssigned: "Є виконавець",
    historyState: "Історія",
    completedHint:
      "Це замовлення завершене і збережене в історії.",
    cancelledHint:
      "Це замовлення скасоване і збережене в історії.",
    noCompany: "Без компанії",
    statusNew: "Нове",
    statusAssigned: "Призначено",
    statusInProgress: "В процесі",
    statusDone: "Завершено",
    statusCancelled: "Скасовано",
    activityJobCreated: "Замовлення створено",
    activityJobAssigned: "Виконавця призначено",
    activityStatusChanged: "Статус змінено",
    activityReviewLeft: "Залишено відгук",
  },
  ru: {
    back: "Назад",
    cityMissing: "Город не указан",
    budgetMissing: "Бюджет не указан",
    addressMissing: "Адрес не указан",
    scheduleMissing: "Не указано",
    typeMissing: "Не указано",
    propertyMissing: "Не указано",
    author: "Автор",
    worker: "Исполнитель",
    unknownUser: "Пользователь",
    status: "Статус",
    created: "Создано",
    city: "Город",
    address: "Адрес",
    budget: "Бюджет",
    jobType: "Тип работы",
    propertyType: "Тип объекта",
    schedule: "Дата и время",
    description: "Описание",
    noDescription: "Описание не добавлено.",
    chat: "Открыть чат",
    edit: "Редактировать",
    delete: "Удалить",
    activity: "История активности",
    noActivity: "Событий пока нет.",
    yourJob: "Ваш заказ",
    workerAssigned: "Есть исполнитель",
    historyState: "История",
    completedHint:
      "Этот заказ завершён и сохранён в истории.",
    cancelledHint:
      "Этот заказ отменён и сохранён в истории.",
    noCompany: "Без компании",
    statusNew: "Новый",
    statusAssigned: "Назначено",
    statusInProgress: "В процессе",
    statusDone: "Завершено",
    statusCancelled: "Отменено",
    activityJobCreated: "Заказ создан",
    activityJobAssigned: "Исполнитель назначен",
    activityStatusChanged: "Статус изменён",
    activityReviewLeft: "Оставлен отзыв",
  },
  en: {
    back: "Back",
    cityMissing: "City not specified",
    budgetMissing: "Budget not specified",
    addressMissing: "Address not specified",
    scheduleMissing: "Not specified",
    typeMissing: "Not specified",
    propertyMissing: "Not specified",
    author: "Author",
    worker: "Worker",
    unknownUser: "User",
    status: "Status",
    created: "Created",
    city: "City",
    address: "Address",
    budget: "Budget",
    jobType: "Job type",
    propertyType: "Property type",
    schedule: "Date and time",
    description: "Description",
    noDescription: "No description added.",
    chat: "Open chat",
    edit: "Edit",
    delete: "Delete",
    activity: "Activity timeline",
    noActivity: "No activity yet.",
    yourJob: "Your job",
    workerAssigned: "Worker assigned",
    historyState: "History",
    completedHint:
      "This job is completed and kept in history.",
    cancelledHint:
      "This job is cancelled and kept in history.",
    noCompany: "No company",
    statusNew: "New",
    statusAssigned: "Assigned",
    statusInProgress: "In progress",
    statusDone: "Done",
    statusCancelled: "Cancelled",
    activityJobCreated: "Job created",
    activityJobAssigned: "Worker assigned",
    activityStatusChanged: "Status changed",
    activityReviewLeft: "Review left",
  },
  sv: {
    back: "Tillbaka",
    cityMissing: "Ingen stad angiven",
    budgetMissing: "Ingen budget angiven",
    addressMissing: "Ingen adress angiven",
    scheduleMissing: "Inte angivet",
    typeMissing: "Inte angivet",
    propertyMissing: "Inte angivet",
    author: "Skapad av",
    worker: "Arbetare",
    unknownUser: "Användare",
    status: "Status",
    created: "Skapad",
    city: "Stad",
    address: "Adress",
    budget: "Budget",
    jobType: "Jobbtyp",
    propertyType: "Typ av objekt",
    schedule: "Datum och tid",
    description: "Beskrivning",
    noDescription: "Ingen beskrivning tillagd.",
    chat: "Öppna chatt",
    edit: "Redigera",
    delete: "Ta bort",
    activity: "Aktivitetshistorik",
    noActivity: "Inga händelser ännu.",
    yourJob: "Ditt jobb",
    workerAssigned: "Arbetare tilldelad",
    historyState: "Historik",
    completedHint:
      "Det här jobbet är slutfört och sparat i historiken.",
    cancelledHint:
      "Det här jobbet är avbrutet och sparat i historiken.",
    noCompany: "Inget företag",
    statusNew: "Ny",
    statusAssigned: "Tilldelad",
    statusInProgress: "Pågår",
    statusDone: "Klar",
    statusCancelled: "Avbruten",
    activityJobCreated: "Jobb skapat",
    activityJobAssigned: "Arbetare tilldelad",
    activityStatusChanged: "Status ändrad",
    activityReviewLeft: "Recension lämnad",
  },
  pl: {
    back: "Wróć",
    cityMissing: "Nie podano miasta",
    budgetMissing: "Nie podano budżetu",
    addressMissing: "Nie podano adresu",
    scheduleMissing: "Nie podano",
    typeMissing: "Nie podano",
    propertyMissing: "Nie podano",
    author: "Autor",
    worker: "Wykonawca",
    unknownUser: "Użytkownik",
    status: "Status",
    created: "Utworzono",
    city: "Miasto",
    address: "Adres",
    budget: "Budżet",
    jobType: "Typ pracy",
    propertyType: "Typ obiektu",
    schedule: "Data i godzina",
    description: "Opis",
    noDescription: "Brak opisu.",
    chat: "Otwórz czat",
    edit: "Edytuj",
    delete: "Usuń",
    activity: "Historia aktywności",
    noActivity: "Brak zdarzeń.",
    yourJob: "Twoje zlecenie",
    workerAssigned: "Pracownik przypisany",
    historyState: "Historia",
    completedHint:
      "To zlecenie jest zakończone i zapisane w historii.",
    cancelledHint:
      "To zlecenie jest anulowane i zapisane w historii.",
    noCompany: "Bez firmy",
    statusNew: "Nowe",
    statusAssigned: "Przypisane",
    statusInProgress: "W trakcie",
    statusDone: "Zakończone",
    statusCancelled: "Anulowane",
    activityJobCreated: "Zlecenie utworzone",
    activityJobAssigned: "Przypisano wykonawcę",
    activityStatusChanged: "Zmieniono status",
    activityReviewLeft: "Dodano opinię",
  },
}


type WorkflowCopy = {
  nextStep: string
  moreActions: string
  ownerWaitingTitle: string
  ownerWaitingText: string
  ownerApplicationsTitle: string
  ownerApplicationsText: string
  ownerAssignedTitle: string
  ownerAssignedText: string
  ownerProgressTitle: string
  ownerProgressText: string
  workerApplyTitle: string
  workerApplyText: string
  workerWaitingTitle: string
  workerWaitingText: string
  workerAssignedTitle: string
  workerAssignedText: string
  workerProgressTitle: string
  workerProgressText: string
  doneTitle: string
  doneText: string
  cancelledTitle: string
  cancelledText: string
  openChat: string
  seeApplications: string
  applyNow: string
  leaveReview: string
  editDetails: string
  backToDashboard: string
  backToJobs: string
  homeCleaning: string
  officeCleaning: string
  apartment: string
  house: string
  office: string
  other: string
}

const workflowCopy: Record<Locale, WorkflowCopy> = {
  sv: {
    nextStep: "Nästa steg",
    moreActions: "Fler åtgärder",
    ownerWaitingTitle: "Jobbet är publicerat",
    ownerWaitingText: "Nu väntar du på ansökningar. Du behöver inte göra något förrän någon skickar en ansökan.",
    ownerApplicationsTitle: "Du har nya ansökningar",
    ownerApplicationsText: "Jämför förslagen nedan och välj den utförare du vill gå vidare med.",
    ownerAssignedTitle: "Utföraren är vald",
    ownerAssignedText: "Öppna chatten och kom överens om tid, adress och praktiska detaljer.",
    ownerProgressTitle: "Arbetet pågår",
    ownerProgressText: "Du kan använda chatten om ni behöver stämma av något under arbetet.",
    workerApplyTitle: "Vill du ha jobbet?",
    workerApplyText: "Skicka en enkel ansökan med ditt pris och ett kort meddelande.",
    workerWaitingTitle: "Din ansökan väntar på svar",
    workerWaitingText: "Beställaren har fått din ansökan. Du behöver inte göra något nu.",
    workerAssignedTitle: "Du har fått jobbet",
    workerAssignedText: "Öppna chatten, stäm av detaljerna och starta jobbet när ni är överens.",
    workerProgressTitle: "Jobbet pågår",
    workerProgressText: "När arbetet är helt färdigt markerar du jobbet som klart.",
    doneTitle: "Jobbet är klart",
    doneText: "Arbetet är avslutat. Lämna gärna en recension om hur samarbetet fungerade.",
    cancelledTitle: "Jobbet är avbrutet",
    cancelledText: "Jobbet ligger kvar i historiken. Beställaren kan öppna det igen vid behov.",
    openChat: "Öppna chatten",
    seeApplications: "Se ansökningar",
    applyNow: "Skicka ansökan",
    leaveReview: "Lämna recension",
    editDetails: "Ändra uppgifter",
    backToDashboard: "Mina ärenden",
    backToJobs: "Lediga jobb",
    homeCleaning: "Hemstädning",
    officeCleaning: "Kontorsstädning",
    apartment: "Lägenhet",
    house: "Hus",
    office: "Kontor",
    other: "Annat",
  },
  en: {
    nextStep: "Next step", moreActions: "More actions", ownerWaitingTitle: "Your job is published", ownerWaitingText: "Now wait for applications. You do not need to do anything until someone applies.", ownerApplicationsTitle: "You have new applications", ownerApplicationsText: "Compare the offers below and choose the worker you want to continue with.", ownerAssignedTitle: "Worker selected", ownerAssignedText: "Open the chat and agree on time, address and practical details.", ownerProgressTitle: "Work is in progress", ownerProgressText: "Use the chat if you need to coordinate anything during the job.", workerApplyTitle: "Want this job?", workerApplyText: "Send a simple application with your price and a short message.", workerWaitingTitle: "Your application is waiting for a response", workerWaitingText: "The customer has received your application. You do not need to do anything now.", workerAssignedTitle: "You got the job", workerAssignedText: "Open the chat, agree on the details and start when you are both ready.", workerProgressTitle: "Job in progress", workerProgressText: "When the work is completely finished, mark the job as done.", doneTitle: "Job completed", doneText: "The work is finished. You can now leave a review about the collaboration.", cancelledTitle: "Job cancelled", cancelledText: "The job remains in history. The customer can reopen it if needed.", openChat: "Open chat", seeApplications: "See applications", applyNow: "Send application", leaveReview: "Leave a review", editDetails: "Edit details", backToDashboard: "My activity", backToJobs: "Available jobs", homeCleaning: "Home cleaning", officeCleaning: "Office cleaning", apartment: "Apartment", house: "House", office: "Office", other: "Other",
  },
  uk: {
    nextStep: "Наступний крок", moreActions: "Інші дії", ownerWaitingTitle: "Замовлення опубліковано", ownerWaitingText: "Тепер чекайте на заявки. Поки ніхто не відгукнувся, нічого робити не потрібно.", ownerApplicationsTitle: "У вас є нові заявки", ownerApplicationsText: "Порівняйте пропозиції нижче та оберіть виконавця.", ownerAssignedTitle: "Виконавця обрано", ownerAssignedText: "Відкрийте чат і домовтеся про час, адресу та практичні деталі.", ownerProgressTitle: "Робота виконується", ownerProgressText: "Використовуйте чат, якщо потрібно щось уточнити під час роботи.", workerApplyTitle: "Хочете цю роботу?", workerApplyText: "Надішліть просту заявку з ціною та коротким повідомленням.", workerWaitingTitle: "Ваша заявка чекає відповіді", workerWaitingText: "Замовник отримав заявку. Зараз нічого робити не потрібно.", workerAssignedTitle: "Ви отримали роботу", workerAssignedText: "Відкрийте чат, узгодьте деталі та почніть роботу, коли все домовлено.", workerProgressTitle: "Робота триває", workerProgressText: "Коли все повністю готово, позначте роботу як завершену.", doneTitle: "Роботу завершено", doneText: "Робота закінчена. Тепер можна залишити відгук про співпрацю.", cancelledTitle: "Замовлення скасовано", cancelledText: "Замовлення залишилось в історії. Власник може відкрити його знову за потреби.", openChat: "Відкрити чат", seeApplications: "Переглянути заявки", applyNow: "Надіслати заявку", leaveReview: "Залишити відгук", editDetails: "Змінити дані", backToDashboard: "Мої справи", backToJobs: "Доступні роботи", homeCleaning: "Прибирання дому", officeCleaning: "Прибирання офісу", apartment: "Квартира", house: "Будинок", office: "Офіс", other: "Інше",
  },
  ru: {
    nextStep: "Следующий шаг", moreActions: "Другие действия", ownerWaitingTitle: "Заказ опубликован", ownerWaitingText: "Теперь ждите заявки. Пока никто не откликнулся, ничего делать не нужно.", ownerApplicationsTitle: "У вас есть новые заявки", ownerApplicationsText: "Сравните предложения ниже и выберите исполнителя.", ownerAssignedTitle: "Исполнитель выбран", ownerAssignedText: "Откройте чат и договоритесь о времени, адресе и деталях.", ownerProgressTitle: "Работа выполняется", ownerProgressText: "Используйте чат, если нужно что-то уточнить во время работы.", workerApplyTitle: "Хотите эту работу?", workerApplyText: "Отправьте простую заявку с ценой и коротким сообщением.", workerWaitingTitle: "Ваша заявка ждёт ответа", workerWaitingText: "Заказчик получил заявку. Сейчас ничего делать не нужно.", workerAssignedTitle: "Вы получили работу", workerAssignedText: "Откройте чат, согласуйте детали и начните работу, когда всё согласовано.", workerProgressTitle: "Работа идёт", workerProgressText: "Когда всё полностью готово, отметьте работу как завершённую.", doneTitle: "Работа завершена", doneText: "Работа закончена. Теперь можно оставить отзыв о сотрудничестве.", cancelledTitle: "Заказ отменён", cancelledText: "Заказ остался в истории. Владелец может открыть его снова при необходимости.", openChat: "Открыть чат", seeApplications: "Посмотреть заявки", applyNow: "Отправить заявку", leaveReview: "Оставить отзыв", editDetails: "Изменить данные", backToDashboard: "Мои дела", backToJobs: "Доступные работы", homeCleaning: "Уборка дома", officeCleaning: "Уборка офиса", apartment: "Квартира", house: "Дом", office: "Офис", other: "Другое",
  },
  pl: {
    nextStep: "Następny krok", moreActions: "Więcej działań", ownerWaitingTitle: "Zlecenie jest opublikowane", ownerWaitingText: "Teraz poczekaj na oferty. Nie musisz nic robić, dopóki ktoś się nie zgłosi.", ownerApplicationsTitle: "Masz nowe oferty", ownerApplicationsText: "Porównaj propozycje poniżej i wybierz wykonawcę.", ownerAssignedTitle: "Wykonawca wybrany", ownerAssignedText: "Otwórz czat i ustal czas, adres oraz szczegóły.", ownerProgressTitle: "Praca trwa", ownerProgressText: "Użyj czatu, jeśli podczas pracy trzeba coś ustalić.", workerApplyTitle: "Chcesz to zlecenie?", workerApplyText: "Wyślij prostą ofertę z ceną i krótką wiadomością.", workerWaitingTitle: "Twoja oferta czeka na odpowiedź", workerWaitingText: "Klient otrzymał ofertę. Teraz nie musisz nic robić.", workerAssignedTitle: "Masz to zlecenie", workerAssignedText: "Otwórz czat, ustal szczegóły i rozpocznij pracę, gdy wszystko będzie uzgodnione.", workerProgressTitle: "Praca trwa", workerProgressText: "Gdy wszystko jest gotowe, oznacz zlecenie jako zakończone.", doneTitle: "Zlecenie zakończone", doneText: "Praca została zakończona. Możesz teraz dodać opinię o współpracy.", cancelledTitle: "Zlecenie anulowane", cancelledText: "Zlecenie pozostaje w historii. Klient może je ponownie otworzyć.", openChat: "Otwórz czat", seeApplications: "Zobacz oferty", applyNow: "Wyślij ofertę", leaveReview: "Dodaj opinię", editDetails: "Edytuj dane", backToDashboard: "Moje sprawy", backToJobs: "Dostępne zlecenia", homeCleaning: "Sprzątanie domu", officeCleaning: "Sprzątanie biura", apartment: "Mieszkanie", house: "Dom", office: "Biuro", other: "Inne",
  },
}

function getJobTypeDisplay(value: string | null, t: WorkflowCopy, fallback: string) {
  if (value === "home_cleaning") return t.homeCleaning
  if (value === "office_cleaning") return t.officeCleaning
  return fallback
}

function getPropertyTypeDisplay(value: string | null, t: WorkflowCopy, fallback: string) {
  if (value === "apartment") return t.apartment
  if (value === "house") return t.house
  if (value === "office") return t.office
  if (value === "other") return t.other
  return fallback
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params

  const supabase = await createClient()

  const { data: job } = await supabase
    .from("jobs")
    .select("title, city, budget, description")
    .eq("id", id)
    .maybeSingle()

  if (!job) {
    return {
      title: "Cleaning Job | Clean Jobs",
      description:
        "Browse cleaning jobs across Sweden. Find house cleaning, office cleaning and apartment cleaning work near you.",
      alternates: {
        canonical: `/jobs/${id}`,
      },
    }
  }

  const city =
    typeof job.city === "string" && job.city.trim()
      ? job.city.trim()
      : "Sweden"

  const cleanTitle =
    typeof job.title === "string" && job.title.trim()
      ? job.title.trim()
      : "Cleaning Job"

  const budgetLabel =
    typeof job.budget === "number" &&
    Number.isFinite(job.budget)
      ? ` | ${job.budget} kr`
      : ""

  const title = `${cleanTitle} in ${city}${budgetLabel} | Clean Jobs`

  const fallbackDescription = `Find cleaning jobs in ${city}. Browse house cleaning, office cleaning and apartment cleaning work on Clean Jobs.`

  const description =
    typeof job.description === "string" &&
    job.description.trim()
      ? job.description.trim().slice(0, 155)
      : fallbackDescription

  return {
    title,
    description,
    alternates: {
      canonical: `/jobs/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `/jobs/${id}`,
      siteName: "Clean Jobs",
      type: "article",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  }
}

function formatBudget(value: number | null, t: Copy) {
  if (value === null) {
    return t.budgetMissing
  }

  return `${value} kr`
}

function formatDate(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(localeMap[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatDateTime(value: string, locale: Locale) {
  const localeMap: Record<Locale, string> = {
    uk: "uk-UA",
    ru: "ru-RU",
    en: "en-US",
    sv: "sv-SE",
    pl: "pl-PL",
  }

  try {
    return new Intl.DateTimeFormat(localeMap[locale], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  } catch {
    return value
  }
}

function formatSchedule(
  date: string | null,
  time: string | null,
  t: Copy,
) {
  if (!date && !time) {
    return t.scheduleMissing
  }

  if (date && time) {
    return `${date} • ${time}`
  }

  return date || time || t.scheduleMissing
}

function getStatusLabel(status: JobStatus, t: Copy) {
  switch (status) {
    case "new":
      return t.statusNew
    case "assigned":
      return t.statusAssigned
    case "in_progress":
      return t.statusInProgress
    case "done":
      return t.statusDone
    case "cancelled":
      return t.statusCancelled
    default:
      return "—"
  }
}

function getStatusClasses(status: JobStatus) {
  switch (status) {
    case "new":
      return "border-slate-200 bg-slate-100 text-slate-700"
    case "assigned":
      return "border-sky-200 bg-sky-50 text-sky-700"
    case "in_progress":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "done":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "cancelled":
      return "border-rose-200 bg-rose-50 text-rose-700"
    default:
      return "border-slate-200 bg-slate-100 text-slate-700"
  }
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)

  const initials = parts
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "U"
}

function getActivityLabel(
  type: string | null,
  labels: {
    activityJobCreated: string
    activityJobAssigned: string
    activityStatusChanged: string
    activityReviewLeft: string
  },
) {
  if (!type) {
    return labels.activityStatusChanged
  }

  switch (type) {
    case "job_created":
      return labels.activityJobCreated

    case "job_assigned":
      return labels.activityJobAssigned

    case "status_changed":
      return labels.activityStatusChanged

    case "review_left":
      return labels.activityReviewLeft

    default:
      return type.replaceAll("_", " ")
  }
}

function isHistoryStatus(status: JobStatus) {
  return status === "done" || status === "cancelled"
}

function PersonCard({
  label,
  profile,
  fallbackName,
  subdued = false,
  noCompanyLabel,
}: {
  label: string
  profile?: Profile | null
  fallbackName: string
  subdued?: boolean
  noCompanyLabel: string
}) {
  const name = profile?.full_name?.trim() || fallbackName
  const companyName =
    profile?.company_name?.trim() || noCompanyLabel

  return (
    <div
      className={
        subdued
          ? "rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-6"
          : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
      }
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <div
            className={
              subdued
                ? "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-300 text-sm font-semibold text-white md:h-14 md:w-14 md:text-base"
                : "flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white md:h-14 md:w-14 md:text-base"
            }
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(name)
            )}
          </div>

          {profile?.company_logo_url ? (
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center overflow-hidden rounded-md border border-white bg-white shadow-sm">
              <img
                src={profile.company_logo_url}
                alt={companyName}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
            {label}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-base font-semibold tracking-tight text-slate-900 md:text-lg">
              {name}
            </div>

            {profile?.bankid_verified ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                ✓ BankID
              </span>
            ) : null}
          </div>

          <div className="mt-0.5 truncate text-sm text-slate-500">
            {companyName}
          </div>

          {profile?.city ? (
            <div className="mt-0.5 text-sm text-slate-500">
              {profile.city}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  subdued = false,
}: {
  label: string
  value: string
  subdued?: boolean
}) {
  return (
    <div
      className={
        subdued
          ? "rounded-3xl border border-slate-200 bg-white/90 p-4 opacity-85 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-5"
          : "rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"
      }
    >
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 md:text-xs">
        {label}
      </div>

      <div className="mt-2 break-words text-sm font-medium text-slate-900 md:text-[15px]">
        {value}
      </div>
    </div>
  )
}

function EmptyPanel({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 md:p-8">
      {text}
    </div>
  )
}

export default async function JobDetailsPage({
  params,
}: PageProps) {
  const { id } = await params

  const cookieStore = await cookies()

  const locale = normalizeLocale(
    cookieStore.get("clean_jobs_locale")?.value,
  ) as Locale

  const t = copy[locale] || copy.en
  const wf = workflowCopy[locale] || workflowCopy.en

  async function deleteJobAction() {
    "use server"

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect(`/login?next=/jobs/${id}`)
    }

    const { data: existingJob } = await supabase
      .from("jobs")
      .select("id, created_by, status")
      .eq("id", id)
      .maybeSingle()

    if (!existingJob) {
      notFound()
    }

    if (existingJob.created_by !== user.id) {
      redirect(`/jobs/${id}`)
    }

    if (
      existingJob.status === "done" ||
      existingJob.status === "cancelled"
    ) {
      redirect(`/jobs/${id}`)
    }

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", id)
      .eq("created_by", user.id)

    if (error) {
      redirect(`/jobs/${id}`)
    }

    redirect("/dashboard")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?next=/jobs/${id}`)
  }

  const { data: jobRaw, error: jobError } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        description,
        city,
        address,
        budget,
        job_type,
        property_type,
        scheduled_date,
        scheduled_time,
        status,
        created_at,
        created_by,
        assigned_to
      `,
    )
    .eq("id", id)
    .maybeSingle()

  if (jobError || !jobRaw) {
    notFound()
  }

  const job = jobRaw as Job

  const isOwner = job.created_by === user.id
  const isAssignedWorker =
    Boolean(job.assigned_to) &&
    job.assigned_to === user.id

  const isParticipant = isOwner || isAssignedWorker
  const isHistory = isHistoryStatus(job.status)

  const canLeaveReview =
    job.status === "done" &&
    Boolean(job.assigned_to) &&
    isParticipant

  const revieweeId = isOwner
    ? job.assigned_to || job.created_by
    : job.created_by

  const profileIds = Array.from(
    new Set(
      [job.created_by, job.assigned_to].filter(
        (value): value is string => Boolean(value),
      ),
    ),
  )

  let profiles: Profile[] = []

  if (profileIds.length > 0) {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, city, avatar_url, company_logo_url, company_name, bankid_verified",
      )
      .in("id", profileIds)

    if (error) {
      console.error("Load job profiles error:", error)
    }

    profiles = (data || []) as Profile[]
  }

  const profileById = new Map<string, Profile>()

  for (const profile of profiles) {
    profileById.set(profile.id, profile)
  }

  const author = profileById.get(job.created_by)

  const worker = job.assigned_to
    ? profileById.get(job.assigned_to)
    : null

  const authorName =
    author?.full_name?.trim() || t.unknownUser

  const workerName =
    worker?.full_name?.trim() || t.unknownUser

  const [
    { data: activityRaw, error: activityError },
    { data: savedJobRaw, error: savedJobError },
    {
      data: currentApplicationRaw,
      error: currentApplicationError,
    },
    {
      data: ownerApplicationsRaw,
      error: ownerApplicationsError,
    },
  ] = await Promise.all([
    supabase
      .from("job_activity")
      .select("id, type, actor_id, created_at")
      .eq("job_id", job.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("saved_jobs")
      .select("id")
      .eq("user_id", user.id)
      .eq("job_id", job.id)
      .maybeSingle(),
    supabase
      .from("job_applications")
      .select(
        `
          id,
          hourly_rate,
          fixed_price,
          message,
          available_from,
          estimated_hours,
          status
        `,
      )
      .eq("job_id", job.id)
      .eq("applicant_id", user.id)
      .maybeSingle(),
    supabase
      .from("job_applications")
      .select(
        `
          id,
          job_id,
          applicant_id,
          hourly_rate,
          fixed_price,
          message,
          available_from,
          estimated_hours,
          status,
          created_at
        `,
      )
      .eq("job_id", job.id)
      .order("created_at", { ascending: false }),
  ])

  if (activityError) {
    console.error("Load job activity error:", activityError)
  }

  if (savedJobError) {
    console.error("Load saved job error:", savedJobError)
  }

  if (currentApplicationError) {
    console.error(
      "Load current job application error:",
      currentApplicationError,
    )
  }

  if (ownerApplicationsError) {
    console.error(
      "Load owner job applications error:",
      ownerApplicationsError,
    )
  }

  const activity = (activityRaw || []) as Activity[]
  const isSaved = Boolean(savedJobRaw)

  const currentApplication =
    (currentApplicationRaw as CurrentJobApplication | null) ||
    null

  const ownerApplicationsBase = isOwner
    ? ((ownerApplicationsRaw || []) as Array<{
        id: string
        job_id: string
        applicant_id: string
        hourly_rate: number | null
        fixed_price: number | null
        message: string | null
        available_from: string | null
        estimated_hours: number | null
        status:
          | "pending"
          | "accepted"
          | "rejected"
          | "withdrawn"
        created_at: string
      }>)
    : []

  const applicantIds = Array.from(
    new Set(
      ownerApplicationsBase.map(
        (application) => application.applicant_id,
      ),
    ),
  )

  let applicantProfiles: Profile[] = []
  let applicantReviews: RatingReview[] = []

  if (isOwner && applicantIds.length > 0) {
    const [
      {
        data: applicantProfilesRaw,
        error: applicantProfilesError,
      },
      {
        data: applicantReviewsRaw,
        error: applicantReviewsError,
      },
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id, full_name, city, avatar_url, company_logo_url, company_name, bankid_verified",
        )
        .in("id", applicantIds),
      supabase
        .from("reviews")
        .select("reviewee_id, rating")
        .in("reviewee_id", applicantIds),
    ])

    if (applicantProfilesError) {
      console.error(
        "Load applicant profiles error:",
        applicantProfilesError,
      )
    }

    if (applicantReviewsError) {
      console.error(
        "Load applicant ratings error:",
        applicantReviewsError,
      )
    }

    applicantProfiles =
      (applicantProfilesRaw || []) as Profile[]

    applicantReviews =
      (applicantReviewsRaw || []) as RatingReview[]
  }

  const applicantProfileById = new Map(
    applicantProfiles.map((profile) => [
      profile.id,
      profile,
    ]),
  )

  const applicantRatings = new Map<
    string,
    {
      total: number
      count: number
    }
  >()

  for (const review of applicantReviews) {
    const current =
      applicantRatings.get(review.reviewee_id) || {
        total: 0,
        count: 0,
      }

    current.total += Number(review.rating) || 0
    current.count += 1

    applicantRatings.set(
      review.reviewee_id,
      current,
    )
  }

  const ownerApplications: JobApplicationItem[] =
    ownerApplicationsBase
      .map((application) => {
        const ratingData = applicantRatings.get(
          application.applicant_id,
        )

        return {
          ...application,
          profile:
            applicantProfileById.get(
              application.applicant_id,
            ) || null,
          rating: {
            average:
              ratingData && ratingData.count > 0
                ? ratingData.total / ratingData.count
                : 0,
            count: ratingData?.count || 0,
          },
        }
      })
      .sort((a, b) => {
        const statusWeight = {
          accepted: 0,
          pending: 1,
          rejected: 2,
          withdrawn: 3,
        } as const

        const statusDifference =
          statusWeight[a.status] -
          statusWeight[b.status]

        if (statusDifference !== 0) {
          return statusDifference
        }

        if (b.rating.average !== a.rating.average) {
          return b.rating.average - a.rating.average
        }

        const verifiedDifference =
          Number(Boolean(b.profile?.bankid_verified)) -
          Number(Boolean(a.profile?.bankid_verified))

        if (verifiedDifference !== 0) {
          return verifiedDifference
        }

        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        )
      })


  const pendingApplicationsCount = ownerApplications.filter(
    (application) => application.status === "pending",
  ).length

  const activityActorIds = Array.from(
    new Set(
      activity
        .map((item) => item.actor_id)
        .filter((value): value is string => Boolean(value))
        .filter((actorId) => !profileById.has(actorId)),
    ),
  )

  if (activityActorIds.length > 0) {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, full_name, city, avatar_url, company_logo_url, company_name, bankid_verified",
      )
      .in("id", activityActorIds)

    if (error) {
      console.error(
        "Load activity profiles error:",
        error,
      )
    }

    for (const profile of (data || []) as Profile[]) {
      profileById.set(profile.id, profile)
    }
  }

  const canApplyToJob =
    job.created_by !== user.id &&
    ((job.status === "new" &&
      job.assigned_to === null) ||
      currentApplication !== null)

  const canEdit = isOwner && !isHistory
  const canDelete = isOwner && !isHistory

  const heroHint =
    job.status === "done"
      ? t.completedHint
      : job.status === "cancelled"
        ? t.cancelledHint
        : null

  const deleteConfirmText =
    locale === "uk"
      ? "Ти точно хочеш видалити цю роботу?"
      : locale === "ru"
        ? "Ты точно хочешь удалить эту работу?"
        : locale === "sv"
          ? "Är du säker på att du vill radera det här jobbet?"
          : locale === "pl"
            ? "Czy na pewno chcesz usunąć tę pracę?"
            : "Are you sure you want to delete this job?"

  let nextStepTitle = ""
  let nextStepText = ""
  let nextStepHref: string | null = null
  let nextStepLabel: string | null = null
  let showStatusActions = false

  if (isOwner) {
    if (job.status === "new") {
      if (pendingApplicationsCount > 0) {
        nextStepTitle = wf.ownerApplicationsTitle
        nextStepText = wf.ownerApplicationsText
        nextStepHref = "#applications"
        nextStepLabel = wf.seeApplications
      } else {
        nextStepTitle = wf.ownerWaitingTitle
        nextStepText = wf.ownerWaitingText
        nextStepHref = `/jobs/${job.id}/edit`
        nextStepLabel = wf.editDetails
      }
    } else if (job.status === "assigned") {
      nextStepTitle = wf.ownerAssignedTitle
      nextStepText = wf.ownerAssignedText
      nextStepHref = `/jobs/${job.id}/chat`
      nextStepLabel = wf.openChat
      showStatusActions = true
    } else if (job.status === "in_progress") {
      nextStepTitle = wf.ownerProgressTitle
      nextStepText = wf.ownerProgressText
      nextStepHref = `/jobs/${job.id}/chat`
      nextStepLabel = wf.openChat
      showStatusActions = true
    } else if (job.status === "done") {
      nextStepTitle = wf.doneTitle
      nextStepText = wf.doneText
      nextStepHref = "#reviews"
      nextStepLabel = wf.leaveReview
      showStatusActions = true
    } else if (job.status === "cancelled") {
      nextStepTitle = wf.cancelledTitle
      nextStepText = wf.cancelledText
      showStatusActions = true
    }
  } else if (isAssignedWorker) {
    if (job.status === "assigned") {
      nextStepTitle = wf.workerAssignedTitle
      nextStepText = wf.workerAssignedText
      nextStepHref = `/jobs/${job.id}/chat`
      nextStepLabel = wf.openChat
      showStatusActions = true
    } else if (job.status === "in_progress") {
      nextStepTitle = wf.workerProgressTitle
      nextStepText = wf.workerProgressText
      nextStepHref = `/jobs/${job.id}/chat`
      nextStepLabel = wf.openChat
      showStatusActions = true
    } else if (job.status === "done") {
      nextStepTitle = wf.doneTitle
      nextStepText = wf.doneText
      nextStepHref = "#reviews"
      nextStepLabel = wf.leaveReview
    } else if (job.status === "cancelled") {
      nextStepTitle = wf.cancelledTitle
      nextStepText = wf.cancelledText
    }
  } else if (currentApplication?.status === "pending") {
    nextStepTitle = wf.workerWaitingTitle
    nextStepText = wf.workerWaitingText
  } else if (job.status === "new" && currentApplication === null) {
    nextStepTitle = wf.workerApplyTitle
    nextStepText = wf.workerApplyText
    nextStepHref = "#apply"
    nextStepLabel = wf.applyNow
  } else if (job.status === "done") {
    nextStepTitle = wf.doneTitle
    nextStepText = wf.doneText
  } else if (job.status === "cancelled") {
    nextStepTitle = wf.cancelledTitle
    nextStepText = wf.cancelledText
  }


  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-5 md:mb-6">
          <Link
            href={isParticipant ? "/dashboard" : "/jobs"}
            prefetch={false}
            className="inline-flex min-h-11 items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 active:scale-[0.98]"
          >
            ← {isParticipant ? wf.backToDashboard : wf.backToJobs}
          </Link>
        </div>

        <section
          className={
            isHistory
              ? "rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.03)] md:p-8"
              : "rounded-[32px] border border-slate-200 bg-gradient-to-b from-white to-rose-50/40 p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8"
          }
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1 xl:pr-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                    job.status,
                  )}`}
                >
                  {getStatusLabel(job.status, t)}
                </span>

                {isOwner ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {t.yourJob}
                  </span>
                ) : null}

                {job.assigned_to ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {t.workerAssigned}
                  </span>
                ) : null}

                {isHistory ? (
                  <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                    {t.historyState}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 break-words text-2xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {job.title}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.city}: {job.city || t.cityMissing}
                </span>

                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.budget}: {formatBudget(job.budget, t)}
                </span>

                <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                  {t.created}:{" "}
                  {formatDate(job.created_at, locale)}
                </span>
              </div>

              {heroHint ? (
                <div className="mt-4 inline-flex rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-600">
                  {heroHint}
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <div className="flex flex-wrap gap-3">
                {author?.avatar_url ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white bg-white shadow-sm">
                    <img
                      src={author.avatar_url}
                      alt={authorName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white shadow-sm">
                    {getInitials(authorName)}
                  </div>
                )}

                {author?.company_logo_url ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
                    <img
                      src={author.company_logo_url}
                      alt={
                        author.company_name?.trim() ||
                        t.noCompany
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
              </div>

              {canEdit || canDelete || !isOwner ? (
                <details className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <summary className="cursor-pointer select-none px-4 py-3 text-sm font-semibold text-slate-700">
                    {wf.moreActions}
                  </summary>

                  <div className="grid gap-3 border-t border-slate-200 p-3">
                  {canEdit ? (
                    <Link
                      href={`/jobs/${job.id}/edit`}
                      prefetch={false}
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {t.edit}
                    </Link>
                  ) : null}

                  {canDelete ? (
                    <form action={deleteJobAction}>
                      <DeleteJobButton label={t.delete} confirmText={deleteConfirmText} />
                    </form>
                  ) : null}

                  {!isOwner ? (
                    <SaveJobButton jobId={job.id} initialSaved={isSaved} locale={locale} />
                  ) : null}

                    {!isOwner ? <ReportJobForm jobId={job.id} locale={locale} /> : null}
                  </div>
                </details>
              ) : null}
            </div>
          </div>
        </section>

        {nextStepTitle ? (
          <section className="mt-6 rounded-[30px] border border-rose-200 bg-gradient-to-br from-white to-rose-50 p-5 shadow-sm md:p-6">
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">
              {wf.nextStep}
            </div>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-950 md:text-2xl">{nextStepTitle}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{nextStepText}</p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                {nextStepHref && nextStepLabel ? (
                  <Link
                    href={nextStepHref}
                    prefetch={false}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                  >
                    {nextStepLabel}
                  </Link>
                ) : null}

                {showStatusActions ? (
                  <JobStatusActions
                    jobId={job.id}
                    status={job.status}
                    currentUserId={user.id}
                    createdBy={job.created_by}
                    assignedTo={job.assigned_to}
                    locale={locale}
                  />
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {canApplyToJob ? (
          <section id="apply" className="mt-6 scroll-mt-28 md:mt-8">
            <TakeJobForm
              jobId={job.id}
              locale={locale}
              application={currentApplication}
            />
          </section>
        ) : null}

        {isOwner ? (
          <JobApplicationsSection
            jobId={job.id}
            locale={locale}
            applications={ownerApplications}
            jobStatus={job.status}
          />
        ) : null}

        <section className="mt-6 grid gap-4 md:mt-8 lg:grid-cols-2">
          <PersonCard
            label={t.author}
            profile={author}
            fallbackName={authorName}
            subdued={isHistory}
            noCompanyLabel={t.noCompany}
          />

          {worker ? (
            <PersonCard
              label={t.worker}
              profile={worker}
              fallbackName={workerName}
              subdued={isHistory}
              noCompanyLabel={t.noCompany}
            />
          ) : null}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 md:mt-8 xl:grid-cols-3">
          <InfoCard
            label={t.status}
            value={getStatusLabel(job.status, t)}
            subdued={isHistory}
          />

          <InfoCard
            label={t.city}
            value={job.city || t.cityMissing}
            subdued={isHistory}
          />

          <InfoCard
            label={t.address}
            value={job.address || t.addressMissing}
            subdued={isHistory}
          />

          <InfoCard
            label={t.budget}
            value={formatBudget(job.budget, t)}
            subdued={isHistory}
          />

          <InfoCard
            label={t.jobType}
            value={getJobTypeDisplay(job.job_type, wf, t.typeMissing)}
            subdued={isHistory}
          />

          <InfoCard
            label={t.propertyType}
            value={getPropertyTypeDisplay(job.property_type, wf, t.propertyMissing)}
            subdued={isHistory}
          />

          <InfoCard
            label={t.schedule}
            value={formatSchedule(
              job.scheduled_date,
              job.scheduled_time,
              t,
            )}
            subdued={isHistory}
          />
        </section>

        <section
          className={
            isHistory
              ? "mt-6 rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:mt-8 md:p-6"
              : "mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:mt-8 md:p-6"
          }
        >
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
            {t.description}
          </h2>

          <div className="mt-4 break-words text-sm leading-7 text-slate-700">
            {job.description?.trim()
              ? job.description
              : t.noDescription}
          </div>
        </section>

        <section className="mt-6 grid gap-6 md:mt-8 md:gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div id="reviews" className="scroll-mt-28">
            <JobReviewsSection
              jobId={job.id}
              revieweeId={revieweeId}
              locale={locale}
              allowReview={canLeaveReview}
            />
          </div>

          <div
            className={
              isHistory
                ? "rounded-3xl border border-slate-200 bg-white/90 p-5 opacity-90 shadow-[0_2px_10px_rgba(15,23,42,0.03)] md:p-6"
                : "rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
            }
          >
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
              {t.activity}
            </h2>

            <div className="mt-5 space-y-4">
              {activity.length === 0 ? (
                <EmptyPanel text={t.noActivity} />
              ) : (
                activity.map((item, index) => {
                  const actor = item.actor_id
                    ? profileById.get(item.actor_id)
                    : null

                  const actorName =
                    actor?.full_name?.trim() ||
                    t.unknownUser

                  return (
                    <div
                      key={item.id}
                      className="relative pl-8"
                    >
                      {index !== activity.length - 1 ? (
                        <span className="absolute left-[11px] top-6 h-[calc(100%+16px)] w-px bg-slate-200" />
                      ) : null}

                      <span
                        className={
                          isHistory
                            ? "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 text-[10px] font-semibold text-white"
                            : "absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-[10px] font-semibold text-white"
                        }
                      >
                        •
                      </span>

                      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                          {actor ? (
                            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xs font-semibold text-white">
                              {actor.avatar_url ? (
                                <img
                                  src={actor.avatar_url}
                                  alt={actorName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                getInitials(actorName)
                              )}
                            </div>
                          ) : null}

                          <div className="min-w-0">
                            <div className="break-words text-sm font-semibold text-slate-900">
                              {getActivityLabel(item.type, t)}
                            </div>

                            <div className="mt-1 break-words text-xs text-slate-500">
                              {item.actor_id
                                ? `${actorName} • `
                                : ""}
                              {formatDateTime(
                                item.created_at,
                                locale,
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
