import type { Locale } from "@/lib/i18n"
import type { EffectiveJobMatchSettings } from "@/lib/job-matching"
import { saveJobMatchPreferencesAction } from "@/app/profile/matching-actions"

type Copy = {
  eyebrow: string
  title: string
  description: string
  implicit: string
  enabled: string
  enabledHint: string
  cities: string
  citiesHint: string
  jobTypes: string
  home: string
  office: string
  channels: string
  inApp: string
  inAppHint: string
  email: string
  emailHint: string
  save: string
  saved: string
  errorChannel: string
  errorJobType: string
  errorCity: string
  errorEmail: string
  errorSave: string
}

const copy: Record<Locale, Copy> = {
  sv: {
    eyebrow: "Jobbmatchning",
    title: "Få relevanta städjobb automatiskt",
    description:
      "Välj områden och jobbtyper. Clean Jobs kan sedan visa en avisering när ett nytt kvalitetsjobb matchar dina val.",
    implicit:
      "Just nu används områden och tjänster från din tjänsteprofil. Spara formuläret om du vill anpassa matchningen.",
    enabled: "Aktivera jobbmatchning",
    enabledHint:
      "Stäng av detta om du inte vill få nya matchningar.",
    cities: "Städer och områden",
    citiesHint:
      "Separera flera områden med kommatecken, till exempel Stockholm, Solna, Sundbyberg.",
    jobTypes: "Jobbtyper",
    home: "Hemstädning",
    office: "Kontorsstädning",
    channels: "Aviseringar",
    inApp: "Aviseringar i Clean Jobs",
    inAppHint:
      "Visas i klockan och i aviseringscentret.",
    email: "E-postaviseringar",
    emailHint:
      "Skickas endast när du själv aktiverar detta val.",
    save: "Spara jobbmatchning",
    saved: "Jobbmatchningen har sparats.",
    errorChannel:
      "Välj minst en aviseringskanal.",
    errorJobType:
      "Välj minst en jobbtyp.",
    errorCity:
      "Lägg till minst en stad eller ett område.",
    errorEmail:
      "Kontot saknar en e-postadress.",
    errorSave:
      "Inställningarna kunde inte sparas.",
  },
  en: {
    eyebrow: "Job matching",
    title: "Get relevant cleaning jobs automatically",
    description:
      "Choose areas and job types. Clean Jobs can then notify you when a new quality job matches your choices.",
    implicit:
      "Your service profile areas and services are currently used for matching. Save this form to customize it.",
    enabled: "Enable job matching",
    enabledHint:
      "Turn this off if you do not want new matches.",
    cities: "Cities and areas",
    citiesHint:
      "Separate multiple areas with commas, for example Stockholm, Solna, Sundbyberg.",
    jobTypes: "Job types",
    home: "Home cleaning",
    office: "Office cleaning",
    channels: "Notifications",
    inApp: "Clean Jobs notifications",
    inAppHint:
      "Shown in the notification bell and notification centre.",
    email: "Email notifications",
    emailHint:
      "Email is sent only after you explicitly enable this option.",
    save: "Save job matching",
    saved: "Job matching preferences saved.",
    errorChannel:
      "Select at least one notification channel.",
    errorJobType:
      "Select at least one job type.",
    errorCity:
      "Add at least one city or area.",
    errorEmail:
      "Your account does not have an email address.",
    errorSave:
      "The settings could not be saved.",
  },
  uk: {
    eyebrow: "Підбір робіт",
    title: "Отримуйте релевантні роботи автоматично",
    description:
      "Оберіть міста та типи робіт. Clean Jobs повідомить, коли з’явиться нове якісне замовлення, що відповідає вашим параметрам.",
    implicit:
      "Зараз для підбору використовуються зони та послуги вашого service profile. Збережіть форму, щоб налаштувати їх вручну.",
    enabled: "Увімкнути підбір робіт",
    enabledHint:
      "Вимкніть, якщо не хочете отримувати нові збіги.",
    cities: "Міста та райони",
    citiesHint:
      "Розділяйте кілька районів комами, наприклад Stockholm, Solna, Sundbyberg.",
    jobTypes: "Типи робіт",
    home: "Прибирання дому",
    office: "Прибирання офісу",
    channels: "Сповіщення",
    inApp: "Сповіщення в Clean Jobs",
    inAppHint:
      "Показуються в дзвіночку та центрі сповіщень.",
    email: "Email-сповіщення",
    emailHint:
      "Email надсилається лише після того, як ви самі увімкнете цю опцію.",
    save: "Зберегти підбір робіт",
    saved: "Налаштування підбору збережено.",
    errorChannel:
      "Оберіть хоча б один канал сповіщень.",
    errorJobType:
      "Оберіть хоча б один тип роботи.",
    errorCity:
      "Додайте хоча б одне місто або район.",
    errorEmail:
      "У акаунта немає email-адреси.",
    errorSave:
      "Не вдалося зберегти налаштування.",
  },
  ru: {
    eyebrow: "Подбор работ",
    title: "Получайте релевантные работы автоматически",
    description:
      "Выберите города и типы работ. Clean Jobs уведомит, когда появится новый качественный заказ, соответствующий вашим настройкам.",
    implicit:
      "Сейчас для подбора используются зоны и услуги вашего service profile. Сохраните форму, чтобы настроить их вручную.",
    enabled: "Включить подбор работ",
    enabledHint:
      "Отключите, если не хотите получать новые совпадения.",
    cities: "Города и районы",
    citiesHint:
      "Разделяйте несколько районов запятыми, например Stockholm, Solna, Sundbyberg.",
    jobTypes: "Типы работ",
    home: "Уборка дома",
    office: "Уборка офиса",
    channels: "Уведомления",
    inApp: "Уведомления в Clean Jobs",
    inAppHint:
      "Показываются в колокольчике и центре уведомлений.",
    email: "Email-уведомления",
    emailHint:
      "Email отправляется только после того, как вы сами включите эту опцию.",
    save: "Сохранить подбор работ",
    saved: "Настройки подбора сохранены.",
    errorChannel:
      "Выберите хотя бы один канал уведомлений.",
    errorJobType:
      "Выберите хотя бы один тип работы.",
    errorCity:
      "Добавьте хотя бы один город или район.",
    errorEmail:
      "У аккаунта нет email-адреса.",
    errorSave:
      "Не удалось сохранить настройки.",
  },
  pl: {
    eyebrow: "Dopasowanie zleceń",
    title: "Otrzymuj odpowiednie zlecenia automatycznie",
    description:
      "Wybierz miasta i typy zleceń. Clean Jobs powiadomi Cię, gdy pojawi się nowe jakościowe zlecenie pasujące do ustawień.",
    implicit:
      "Obecnie dopasowanie korzysta z obszarów i usług Twojego profilu usług. Zapisz formularz, aby je dostosować.",
    enabled: "Włącz dopasowanie zleceń",
    enabledHint:
      "Wyłącz, jeśli nie chcesz otrzymywać nowych dopasowań.",
    cities: "Miasta i obszary",
    citiesHint:
      "Oddziel kilka obszarów przecinkami, np. Stockholm, Solna, Sundbyberg.",
    jobTypes: "Typy zleceń",
    home: "Sprzątanie domu",
    office: "Sprzątanie biura",
    channels: "Powiadomienia",
    inApp: "Powiadomienia Clean Jobs",
    inAppHint:
      "Widoczne w dzwonku i centrum powiadomień.",
    email: "Powiadomienia e-mail",
    emailHint:
      "E-mail jest wysyłany tylko po samodzielnym włączeniu tej opcji.",
    save: "Zapisz dopasowanie zleceń",
    saved: "Ustawienia dopasowania zostały zapisane.",
    errorChannel:
      "Wybierz co najmniej jeden kanał powiadomień.",
    errorJobType:
      "Wybierz co najmniej jeden typ zlecenia.",
    errorCity:
      "Dodaj co najmniej jedno miasto lub obszar.",
    errorEmail:
      "Konto nie ma adresu e-mail.",
    errorSave:
      "Nie udało się zapisać ustawień.",
  },
}

function errorMessage(
  code: string | undefined,
  t: Copy,
) {
  switch (code) {
    case "channel":
      return t.errorChannel
    case "job_type":
      return t.errorJobType
    case "city":
      return t.errorCity
    case "email":
      return t.errorEmail
    case "save":
      return t.errorSave
    default:
      return null
  }
}

export default function JobMatchPreferencesForm({
  locale,
  settings,
  saved,
  error,
}: {
  locale: Locale
  settings: EffectiveJobMatchSettings
  saved: boolean
  error?: string
}) {
  const t = copy[locale] || copy.sv
  const message = errorMessage(error, t)

  return (
    <section
      id="job-matching"
      className="mt-8 scroll-mt-28 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] md:p-8"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-600">
        {t.eyebrow}
      </div>

      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
        {t.title}
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
        {t.description}
      </p>

      {settings.source === "service_profile" ? (
        <p className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
          {t.implicit}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {t.saved}
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {message}
        </p>
      ) : null}

      <form
        action={saveJobMatchPreferencesAction}
        className="mt-6 grid gap-6"
      >
        <label className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={settings.enabled}
            className="mt-1 h-4 w-4 rounded border-slate-300 accent-rose-600"
          />
          <span>
            <span className="block text-sm font-semibold text-slate-900">
              {t.enabled}
            </span>
            <span className="mt-1 block text-sm leading-6 text-slate-600">
              {t.enabledHint}
            </span>
          </span>
        </label>

        <div>
          <label
            htmlFor="job_match_cities"
            className="block text-sm font-semibold text-slate-900"
          >
            {t.cities}
          </label>

          <input
            id="job_match_cities"
            name="cities"
            type="text"
            defaultValue={settings.cities.join(", ")}
            placeholder="Stockholm, Solna, Sundbyberg"
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-400"
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {t.citiesHint}
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">
            {t.jobTypes}
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="home_cleaning"
                defaultChecked={settings.jobTypes.includes(
                  "home_cleaning",
                )}
                className="h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              <span className="text-sm font-medium text-slate-800">
                {t.home}
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="office_cleaning"
                defaultChecked={settings.jobTypes.includes(
                  "office_cleaning",
                )}
                className="h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              <span className="text-sm font-medium text-slate-800">
                {t.office}
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-slate-900">
            {t.channels}
          </legend>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="flex gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="in_app_enabled"
                defaultChecked={
                  settings.inAppEnabled
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {t.inApp}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {t.inAppHint}
                </span>
              </span>
            </label>

            <label className="flex gap-3 rounded-2xl border border-slate-200 p-4">
              <input
                type="checkbox"
                name="email_enabled"
                defaultChecked={
                  settings.emailEnabled
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 accent-rose-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {t.email}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {t.emailHint}
                </span>
              </span>
            </label>
          </div>
        </fieldset>

        <div>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 active:scale-[0.98]"
          >
            {t.save}
          </button>
        </div>
      </form>
    </section>
  )
}
