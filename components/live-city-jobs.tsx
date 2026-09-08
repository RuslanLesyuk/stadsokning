import Link from "next/link"

import {
  getLiveCityJobs,
  type LiveCityJob,
} from "@/lib/seo/live-city-jobs"

export type LiveCityJobsLocale =
  | "uk"
  | "ru"
  | "en"
  | "sv"
  | "pl"

type Copy = {
  eyebrow: string
  title: (city: string) => string
  intro: string
  emptyTitle: string
  emptyText: string
  browseAll: string
  postJob: string
  openJob: string
  homeCleaning: string
  officeCleaning: string
  budget: string
  scheduled: string
  published: string
  noBudget: string
}

const copy: Record<
  LiveCityJobsLocale,
  Copy
> = {
  sv: {
    eyebrow: "Live på Clean Jobs",
    title: (city) =>
      `Aktuella städjobb i ${city}`,
    intro:
      "Här visas de senaste öppna uppdragen som klarar Clean Jobs kvalitets- och modereringsregler.",
    emptyTitle:
      "Inga öppna kvalitetsjobb just nu",
    emptyText:
      "Nya uppdrag kan publiceras när som helst. Se alla jobb eller lägg upp ett städjobb.",
    browseAll: "Se alla jobb",
    postJob: "Lägg upp städjobb",
    openJob: "Visa jobb",
    homeCleaning: "Hemstädning",
    officeCleaning: "Kontorsstädning",
    budget: "Budget",
    scheduled: "Önskat datum",
    published: "Publicerat",
    noBudget: "Ej angiven",
  },
  en: {
    eyebrow: "Live on Clean Jobs",
    title: (city) =>
      `Current cleaning jobs in ${city}`,
    intro:
      "These are the latest open assignments that pass Clean Jobs quality and moderation rules.",
    emptyTitle:
      "No quality open jobs right now",
    emptyText:
      "New assignments can appear at any time. Browse all jobs or post a cleaning job.",
    browseAll: "Browse all jobs",
    postJob: "Post cleaning job",
    openJob: "View job",
    homeCleaning: "Home cleaning",
    officeCleaning: "Office cleaning",
    budget: "Budget",
    scheduled: "Preferred date",
    published: "Published",
    noBudget: "Not specified",
  },
  uk: {
    eyebrow: "Зараз на Clean Jobs",
    title: (city) =>
      `Актуальні роботи з прибирання — ${city}`,
    intro:
      "Тут показані останні відкриті замовлення, які проходять правила якості та модерації Clean Jobs.",
    emptyTitle:
      "Зараз немає якісних відкритих робіт",
    emptyText:
      "Нові замовлення можуть з’явитися будь-коли. Перегляньте всі роботи або опублікуйте своє замовлення.",
    browseAll: "Переглянути всі роботи",
    postJob: "Опублікувати роботу",
    openJob: "Відкрити роботу",
    homeCleaning: "Прибирання дому",
    officeCleaning: "Прибирання офісу",
    budget: "Бюджет",
    scheduled: "Бажана дата",
    published: "Опубліковано",
    noBudget: "Не вказано",
  },
  ru: {
    eyebrow: "Сейчас на Clean Jobs",
    title: (city) =>
      `Актуальные работы по уборке — ${city}`,
    intro:
      "Здесь показаны последние открытые заказы, которые проходят правила качества и модерации Clean Jobs.",
    emptyTitle:
      "Сейчас нет качественных открытых работ",
    emptyText:
      "Новые заказы могут появиться в любой момент. Посмотрите все работы или опубликуйте свой заказ.",
    browseAll: "Смотреть все работы",
    postJob: "Опубликовать работу",
    openJob: "Открыть работу",
    homeCleaning: "Уборка дома",
    officeCleaning: "Уборка офиса",
    budget: "Бюджет",
    scheduled: "Желаемая дата",
    published: "Опубликовано",
    noBudget: "Не указано",
  },
  pl: {
    eyebrow: "Teraz na Clean Jobs",
    title: (city) =>
      `Aktualne zlecenia sprzątania — ${city}`,
    intro:
      "Tutaj są najnowsze otwarte zlecenia, które spełniają zasady jakości i moderacji Clean Jobs.",
    emptyTitle:
      "Brak jakościowych otwartych zleceń",
    emptyText:
      "Nowe zlecenia mogą pojawić się w każdej chwili. Zobacz wszystkie albo dodaj własne zlecenie.",
    browseAll: "Zobacz wszystkie zlecenia",
    postJob: "Dodaj zlecenie",
    openJob: "Otwórz zlecenie",
    homeCleaning: "Sprzątanie domu",
    officeCleaning: "Sprzątanie biura",
    budget: "Budżet",
    scheduled: "Preferowana data",
    published: "Opublikowano",
    noBudget: "Nie podano",
  },
}

const localeTags: Record<
  LiveCityJobsLocale,
  string
> = {
  sv: "sv-SE",
  en: "en-SE",
  uk: "uk-UA",
  ru: "ru-RU",
  pl: "pl-PL",
}

function formatDate(
  value: string | null,
  locale: LiveCityJobsLocale,
) {
  if (!value) return null

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(
    localeTags[locale],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Europe/Stockholm",
    },
  ).format(date)
}

function formatScheduledDate(
  value: string | null,
  locale: LiveCityJobsLocale,
) {
  if (!value) return null

  const date = new Date(
    `${value}T12:00:00+02:00`,
  )

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat(
    localeTags[locale],
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Europe/Stockholm",
    },
  ).format(date)
}

function formatBudget(
  value: number | null,
  locale: LiveCityJobsLocale,
  noBudget: string,
) {
  if (value == null) {
    return noBudget
  }

  return new Intl.NumberFormat(
    localeTags[locale],
    {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: 0,
    },
  ).format(value)
}

function getJobTypeLabel(
  job: LiveCityJob,
  t: Copy,
) {
  if (job.jobType === "office_cleaning") {
    return t.officeCleaning
  }

  return t.homeCleaning
}

export default async function LiveCityJobs({
  city,
  locale,
}: {
  city: string
  locale: LiveCityJobsLocale
}) {
  const t = copy[locale] || copy.sv
  const jobs = await getLiveCityJobs(city)

  return (
    <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
            {t.eyebrow}
          </div>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
            {t.title(city)}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {t.intro}
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            {jobs.length}
          </div>
        ) : null}
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6">
          <h3 className="text-lg font-semibold text-slate-950">
            {t.emptyTitle}
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t.emptyText}
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/jobs?city=${encodeURIComponent(city)}`}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {t.browseAll}
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
            >
              {t.postJob}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => {
              const created = formatDate(
                job.createdAt,
                locale,
              )

              const scheduled =
                formatScheduledDate(
                  job.scheduledDate,
                  locale,
                )

              return (
                <article
                  key={job.id}
                  className="flex h-full flex-col rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-rose-50 px-3 py-1 font-semibold text-rose-700">
                      {getJobTypeLabel(job, t)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
                      {job.city}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                    {job.title}
                  </h3>

                  {job.description ? (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>
                  ) : null}

                  <dl className="mt-5 grid gap-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-slate-500">
                        {t.budget}
                      </dt>
                      <dd className="font-semibold text-slate-900">
                        {formatBudget(
                          job.budget,
                          locale,
                          t.noBudget,
                        )}
                      </dd>
                    </div>

                    {scheduled ? (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-slate-500">
                          {t.scheduled}
                        </dt>
                        <dd className="font-medium text-slate-800">
                          {scheduled}
                        </dd>
                      </div>
                    ) : null}

                    {created ? (
                      <div className="flex items-center justify-between gap-4">
                        <dt className="text-slate-500">
                          {t.published}
                        </dt>
                        <dd className="font-medium text-slate-800">
                          {created}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-auto pt-5">
                    <Link
                      href={`/jobs/${job.id}`}
                      prefetch={false}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      {t.openJob}
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/jobs?city=${encodeURIComponent(city)}`}
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
            >
              {t.browseAll}
            </Link>

            <Link
              href="/jobs/create"
              prefetch={false}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              {t.postJob}
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
