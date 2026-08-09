"use client"

import { useActionState } from "react"
import { usePathname } from "next/navigation"
import { useFormStatus } from "react-dom"

import {
  submitCompanyLead,
  type CompanyLeadFormState,
} from "@/app/companies/[slug]/actions"

type Locale = "sv" | "en" | "uk" | "ru" | "pl"

type Props = {
  companyId: string
  companySlug: string
  companyName: string
  locale: Locale
  serviceTypes: string[]
  defaultCity?: string
  defaultEmail?: string
}

const initialCompanyLeadFormState: CompanyLeadFormState = {
  status: "idle",
  message: "",
}

type Copy = {
  title: string
  description: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  selectService: string
  city: string
  preferredDate: string
  message: string
  messagePlaceholder: string
  submit: string
  submitting: string
  successTitle: string
  sendAnother: string
  fallbackServices: string[]
}

const copy: Record<Locale, Copy> = {
  sv: {
    title: "Begär en offert",
    description:
      "Beskriv uppdraget så kan företaget kontakta dig med pris och tillgänglighet.",
    customerName: "Namn",
    customerEmail: "E-post",
    customerPhone: "Telefon, valfritt",
    serviceType: "Tjänst",
    selectService: "Välj tjänst",
    city: "Ort eller område",
    preferredDate: "Önskat datum, valfritt",
    message: "Beskriv uppdraget",
    messagePlaceholder:
      "Till exempel bostadens storlek, adressområde, önskat datum och vad som ska städas.",
    submit: "Skicka offertförfrågan",
    submitting: "Skickar...",
    successTitle: "Förfrågan är skickad",
    sendAnother: "Skicka en ny förfrågan",
    fallbackServices: [
      "Hemstädning",
      "Flyttstädning",
      "Kontorsstädning",
      "Fönsterputsning",
      "Byggstädning",
      "Annan städtjänst",
    ],
  },
  en: {
    title: "Request a quote",
    description:
      "Describe the job so the company can contact you with pricing and availability.",
    customerName: "Name",
    customerEmail: "Email",
    customerPhone: "Phone, optional",
    serviceType: "Service",
    selectService: "Select service",
    city: "City or area",
    preferredDate: "Preferred date, optional",
    message: "Describe the job",
    messagePlaceholder:
      "For example property size, area, preferred date and what should be cleaned.",
    submit: "Send quote request",
    submitting: "Sending...",
    successTitle: "Request sent",
    sendAnother: "Send another request",
    fallbackServices: [
      "Home cleaning",
      "Move-out cleaning",
      "Office cleaning",
      "Window cleaning",
      "Construction cleaning",
      "Other cleaning service",
    ],
  },
  uk: {
    title: "Отримати пропозицію",
    description:
      "Опишіть замовлення, щоб компанія зв’язалася з вами щодо ціни та доступного часу.",
    customerName: "Ім’я",
    customerEmail: "Email",
    customerPhone: "Телефон, необов’язково",
    serviceType: "Послуга",
    selectService: "Оберіть послугу",
    city: "Місто або район",
    preferredDate: "Бажана дата, необов’язково",
    message: "Опишіть замовлення",
    messagePlaceholder:
      "Наприклад, площа житла, район, бажана дата та що саме потрібно прибрати.",
    submit: "Надіслати запит",
    submitting: "Надсилання...",
    successTitle: "Запит надіслано",
    sendAnother: "Надіслати ще один запит",
    fallbackServices: [
      "Домашнє прибирання",
      "Прибирання після переїзду",
      "Прибирання офісу",
      "Миття вікон",
      "Будівельне прибирання",
      "Інша послуга",
    ],
  },
  ru: {
    title: "Получить предложение",
    description:
      "Опишите заказ, чтобы компания связалась с вами по поводу цены и доступного времени.",
    customerName: "Имя",
    customerEmail: "Email",
    customerPhone: "Телефон, необязательно",
    serviceType: "Услуга",
    selectService: "Выберите услугу",
    city: "Город или район",
    preferredDate: "Желаемая дата, необязательно",
    message: "Опишите заказ",
    messagePlaceholder:
      "Например, площадь жилья, район, желаемая дата и что именно нужно убрать.",
    submit: "Отправить запрос",
    submitting: "Отправка...",
    successTitle: "Запрос отправлен",
    sendAnother: "Отправить еще один запрос",
    fallbackServices: [
      "Домашняя уборка",
      "Уборка после переезда",
      "Уборка офиса",
      "Мытье окон",
      "Строительная уборка",
      "Другая услуга",
    ],
  },
  pl: {
    title: "Poproś o wycenę",
    description:
      "Opisz zlecenie, aby firma mogła skontaktować się z Tobą w sprawie ceny i terminu.",
    customerName: "Imię",
    customerEmail: "Email",
    customerPhone: "Telefon, opcjonalnie",
    serviceType: "Usługa",
    selectService: "Wybierz usługę",
    city: "Miasto lub obszar",
    preferredDate: "Preferowana data, opcjonalnie",
    message: "Opisz zlecenie",
    messagePlaceholder:
      "Na przykład metraż, lokalizacja, preferowana data i zakres sprzątania.",
    submit: "Wyślij zapytanie",
    submitting: "Wysyłanie...",
    successTitle: "Zapytanie wysłane",
    sendAnother: "Wyślij kolejne zapytanie",
    fallbackServices: [
      "Sprzątanie domu",
      "Sprzątanie po przeprowadzce",
      "Sprzątanie biura",
      "Mycie okien",
      "Sprzątanie budowlane",
      "Inna usługa sprzątania",
    ],
  },
}

export function CompanyOfferForm({
  companyId,
  companySlug,
  companyName,
  locale,
  serviceTypes,
  defaultCity = "",
  defaultEmail = "",
}: Props) {
  const t = copy[locale]
  const pathname = usePathname()
  const options = serviceTypes.length > 0 ? serviceTypes : t.fallbackServices
  const [state, formAction] = useActionState(
    submitCompanyLead,
    initialCompanyLeadFormState,
  )

  if (state.status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-700">
          ✓
        </div>

        <h3 className="mt-5 text-2xl font-black text-emerald-950">
          {t.successTitle}
        </h3>

        <p className="mt-3 leading-7 text-emerald-800">{state.message}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"
        >
          {t.sendAnother}
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight text-slate-950">
        {t.title}
      </h2>

      <p className="mt-3 leading-7 text-slate-600">
        {t.description.replace("företaget", companyName)}
      </p>

      <form action={formAction} className="mt-7 grid gap-5 sm:grid-cols-2">
        <input type="hidden" name="companyId" value={companyId} />
        <input type="hidden" name="companySlug" value={companySlug} />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="sourcePath" value={pathname || `/companies/${companySlug}`} />

        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <Field
          id="customerName"
          name="customerName"
          label={t.customerName}
          error={state.fieldErrors?.customerName}
          required
        />

        <Field
          id="customerEmail"
          name="customerEmail"
          type="email"
          label={t.customerEmail}
          error={state.fieldErrors?.customerEmail}
          defaultValue={defaultEmail}
          required
        />

        <Field
          id="customerPhone"
          name="customerPhone"
          type="tel"
          label={t.customerPhone}
          error={state.fieldErrors?.customerPhone}
        />

        <div>
          <label htmlFor="serviceType" className="block text-sm font-bold text-slate-900">
            {t.serviceType}
          </label>

          <select
            id="serviceType"
            name="serviceType"
            required
            className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          >
            <option value="">{t.selectService}</option>
            {options.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>

          <FieldError message={state.fieldErrors?.serviceType} />
        </div>

        <Field
          id="city"
          name="city"
          label={t.city}
          error={state.fieldErrors?.city}
          defaultValue={defaultCity}
          required
        />

        <Field
          id="preferredDate"
          name="preferredDate"
          type="date"
          label={t.preferredDate}
          error={state.fieldErrors?.preferredDate}
        />

        <div className="sm:col-span-2">
          <label htmlFor="message" className="block text-sm font-bold text-slate-900">
            {t.message}
          </label>

          <textarea
            id="message"
            name="message"
            required
            minLength={20}
            maxLength={2000}
            rows={6}
            placeholder={t.messagePlaceholder}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
          />

          <FieldError message={state.fieldErrors?.message} />
        </div>

        {state.status === "error" && state.message ? (
          <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {state.message}
          </div>
        ) : null}

        <div className="sm:col-span-2">
          <SubmitButton idleLabel={t.submit} loadingLabel={t.submitting} />
        </div>
      </form>
    </div>
  )
}

function Field({
  id,
  name,
  label,
  type = "text",
  error,
  required = false,
  defaultValue,
}: {
  id: string
  name: string
  label: string
  type?: string
  error?: string
  required?: boolean
  defaultValue?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-900">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
      />

      <FieldError message={error} />
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="mt-2 text-xs font-semibold text-red-700">{message}</p>
}

function SubmitButton({
  idleLabel,
  loadingLabel,
}: {
  idleLabel: string
  loadingLabel: string
}) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? loadingLabel : idleLabel}
    </button>
  )
}
